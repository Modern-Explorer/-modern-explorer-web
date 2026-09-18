// DB-backed abuse controls for the public API surface (the MESA chatbot).
//
// Why a store at all: /api/mesa is public, unauthenticated, and calls the *paid*
// Claude API. Before this it had NO protection — anyone who found the endpoint
// could stuff an unbounded conversation into it and run up the API bill. In-memory
// counters don't help here: a crash or `pm2 restart` resets them, so an attacker
// just waits for a restart. The controls therefore live in SQLite and survive
// restarts. This is a direct ESM port of the proven pattern on the VLD site's Sage
// chatbot (vld-website/server/store.js). Two concerns:
//   • rate_events — rolling-window per-IP + global request budgets (429 over cap)
//   • api_spend   — a cost ledger so a bot can't run up the Claude bill (hard cap)
import Database from 'better-sqlite3';
import { mkdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));
// Persistent, gitignored path. In production set ME_DATA_DIR to a location OUTSIDE
// the repo (e.g. /var/lib/modern-explorer) so a `git pull` + rebuild can't wipe the
// ledger; the repo-local ../data fallback is only for local dev and is gitignored.
const DATA_DIR = process.env.ME_DATA_DIR || join(__dirname, '../data');
mkdirSync(DATA_DIR, { recursive: true });

const db = new Database(join(DATA_DIR, 'mesa.db'));
db.pragma('journal_mode = WAL');

// ── Schema (idempotent) ─────────────────────────────────────────────────────
db.exec(`
CREATE TABLE IF NOT EXISTS rate_events (
  id         INTEGER PRIMARY KEY AUTOINCREMENT,
  scope      TEXT    NOT NULL,   -- 'chat_ip' | 'chat_global'
  ip         TEXT    NOT NULL,
  created_ms INTEGER NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_rate_events_scope_ms    ON rate_events(scope, created_ms);
CREATE INDEX IF NOT EXISTS idx_rate_events_scope_ip_ms ON rate_events(scope, ip, created_ms);

-- Claude API cost ledger. One row per completed call; cost stored in integer
-- micro-dollars (µ$) to avoid float drift. Daily/monthly caps sum a rolling window.
CREATE TABLE IF NOT EXISTS api_spend (
  id            INTEGER PRIMARY KEY AUTOINCREMENT,
  created_ms    INTEGER NOT NULL,
  input_tokens  INTEGER NOT NULL DEFAULT 0,
  output_tokens INTEGER NOT NULL DEFAULT 0,
  cost_micros   INTEGER NOT NULL DEFAULT 0
);
CREATE INDEX IF NOT EXISTS idx_api_spend_ms ON api_spend(created_ms);
`);

// ── Generic rolling-window rate limiting ────────────────────────────────────
// Two budgets: an "ip" scope counts EVERY attempt from one source (throttles a
// single abuser, including failed validation), and a "global" scope bounds total
// volume across all sources. The caller wires the scope names + caps; the
// mechanism is shared.
const WINDOW_MS = 60 * 60 * 1000; // 1 hour rolling window for all rate scopes

function prune(now) {
  db.prepare('DELETE FROM rate_events WHERE created_ms < ?').run(now - WINDOW_MS);
}

// Count events for a scope (optionally per-IP) inside the rolling window.
function countEvents(scope, ip, now = Date.now()) {
  const since = now - WINDOW_MS;
  if (ip == null) {
    return db.prepare('SELECT COUNT(*) n FROM rate_events WHERE scope=? AND created_ms>=?').get(scope, since).n;
  }
  return db.prepare('SELECT COUNT(*) n FROM rate_events WHERE scope=? AND ip=? AND created_ms>=?')
    .get(scope, String(ip || ''), since).n;
}

function recordEvent(scope, ip, now = Date.now()) {
  db.prepare('INSERT INTO rate_events (scope, ip, created_ms) VALUES (?,?,?)').run(scope, String(ip || ''), now);
}

// Check a per-IP + global budget for a named endpoint. Does NOT consume.
// Returns { limited:false } or { limited:true, scope:'ip'|'global' }.
function rateStatus({ ipScope, globalScope, perIp, global }, ip, now = Date.now()) {
  prune(now);
  if (perIp != null && countEvents(ipScope, ip, now) >= perIp) return { limited: true, scope: 'ip' };
  if (global != null && countEvents(globalScope, null, now) >= global) return { limited: true, scope: 'global' };
  return { limited: false };
}

// ── Claude spend ceiling ────────────────────────────────────────────────────
// Rolling 24h + 30d windows (simpler and stricter than calendar boundaries — a
// flood can't reset the counter by crossing midnight). Caps are dollar env knobs;
// internally we compare micro-dollars.
const DAY_MS   = 24 * 60 * 60 * 1000;
const MONTH_MS = 30 * DAY_MS;
const DAILY_CAP_MICROS   = Math.round(parseFloat(process.env.MESA_DAILY_USD   || '5')  * 1e6);
const MONTHLY_CAP_MICROS = Math.round(parseFloat(process.env.MESA_MONTHLY_USD || '50') * 1e6);

// Haiku 4.5 list price (USD per million tokens); override via env if it changes.
const INPUT_PER_MTOK  = parseFloat(process.env.MESA_INPUT_USD_PER_MTOK  || '1');
const OUTPUT_PER_MTOK = parseFloat(process.env.MESA_OUTPUT_USD_PER_MTOK || '5');

function costMicros(inputTokens, outputTokens) {
  const usd = (inputTokens / 1e6) * INPUT_PER_MTOK + (outputTokens / 1e6) * OUTPUT_PER_MTOK;
  return Math.round(usd * 1e6);
}

function spentMicros(sinceMs, now = Date.now()) {
  const row = db.prepare('SELECT COALESCE(SUM(cost_micros),0) s FROM api_spend WHERE created_ms >= ?')
    .get(now - sinceMs);
  return row.s;
}

// Checked BEFORE a paid call. Returns { over:false } or { over:true, window:'daily'|'monthly' }.
// The cap can be exceeded by at most one in-flight request's cost — acceptable for a hard ceiling.
function spendStatus(now = Date.now()) {
  db.prepare('DELETE FROM api_spend WHERE created_ms < ?').run(now - MONTH_MS);
  if (spentMicros(DAY_MS, now)   >= DAILY_CAP_MICROS)   return { over: true, window: 'daily' };
  if (spentMicros(MONTH_MS, now) >= MONTHLY_CAP_MICROS) return { over: true, window: 'monthly' };
  return { over: false };
}

// Record the actual cost of a completed call from the API's usage numbers.
function recordSpend(inputTokens, outputTokens, now = Date.now()) {
  const micros = costMicros(inputTokens, outputTokens);
  db.prepare('INSERT INTO api_spend (created_ms, input_tokens, output_tokens, cost_micros) VALUES (?,?,?,?)')
    .run(now, inputTokens | 0, outputTokens | 0, micros);
  return micros;
}

// Small snapshot for logging / health checks.
function spendSnapshot(now = Date.now()) {
  return {
    dailyUsd:      +(spentMicros(DAY_MS, now)   / 1e6).toFixed(4),
    monthlyUsd:    +(spentMicros(MONTH_MS, now) / 1e6).toFixed(4),
    dailyCapUsd:   DAILY_CAP_MICROS / 1e6,
    monthlyCapUsd: MONTHLY_CAP_MICROS / 1e6,
  };
}

export {
  db,
  WINDOW_MS,
  rateStatus, recordEvent, countEvents,
  spendStatus, recordSpend, spendSnapshot, costMicros,
};
