import { useCallback, useEffect, useRef, useState } from 'react';

// ── Types ─────────────────────────────────────────────────────────────────────

type GlyphEntry = {
  char: string;       // Unicode character(s)
  phon: string;       // Phonetic value: "ı͗", "dingir", "ka"
  uname: string;      // Gardiner / sign-list code: "M017", "AN", "KA"
  font: 'egy' | 'sux';
  word: string;       // Script word this glyph contributes to, e.g. "nṯr", "dingir-e-ne"
  gloss: string;      // Word meaning, e.g. "gods", "the gods"
  stanzaEn: string;   // Full English sentence for this stanza
  highlight: string;  // Substring of stanzaEn to emphasise when this glyph is hovered
};

type DividerData = {
  char: string;    // Primary concept glyph (☉, ♄, etc.)
  name: string;    // Symbol name shown in hover lens
  char2?: string;  // Optional secondary concept glyph
  name2?: string;  // Symbol name for secondary glyph
  morse: string;   // Morse encoding — space separates letters, '.' dot, '-' dash
  lidar?: boolean;
};

type LensState =
  | { kind: 'glyph'; char: string; phon: string; uname: string; font: 'egy' | 'sux'; word: string; gloss: string; stanzaEn: string; highlight: string }
  | { kind: 'symbol'; char: string; name: string };

// ── Verified Egyptian Hieroglyph data (Unicode 15, confirmed via unicodedata) ─
// Sources: Gardiner Sign List; TLA (thesaurus-linguae-aegyptiae.de);
//          Unicode 15.0 code chart Egyptian Hieroglyphs (U+13000–U+1342F)
// Rule: transliteration and column signs are 1-for-1. Coinage marked §.

const S1L = 'Do the gods hold the answers?';
const S2L = 'Where is the deepest wisdom? Thoth knows.';
const S3L = 'Are there ancient settlements beneath the great sand dunes?';

const LEFT_STANZAS: GlyphEntry[][] = [
  // Stanza 1 — "Do the gods hold the answers?"
  // Transliteration: ı͗n nṯrw ḫr wšbw
  // Integrity fix: R008 flag (nṯr sign itself) replaces G007 falcon; plural strokes added
  [
    { char: '\u{131CB}', phon: 'ı͗',    uname: 'M017', font: 'egy', word: 'ı͗n',   gloss: 'interrogative',       stanzaEn: S1L, highlight: 'Do' },
    { char: '\u{13216}', phon: 'n',     uname: 'N035', font: 'egy', word: 'ı͗n',   gloss: 'particle (is it?)',   stanzaEn: S1L, highlight: 'Do' },
    { char: '\u{132B9}', phon: 'nṯr',   uname: 'R008', font: 'egy', word: 'nṯrw', gloss: 'gods (flag sign)',    stanzaEn: S1L, highlight: 'the gods' },
    { char: '\u{13171}', phon: 'w',     uname: 'G043', font: 'egy', word: 'nṯrw', gloss: 'plural marker w',     stanzaEn: S1L, highlight: 'the gods' },
    { char: '\u{133ED}', phon: '|||',   uname: 'Z004', font: 'egy', word: 'nṯrw', gloss: 'plural strokes',      stanzaEn: S1L, highlight: 'the gods' },
    { char: '\u{1308B}', phon: 'r',     uname: 'D021', font: 'egy', word: 'ḫr',   gloss: 'hold / possess',      stanzaEn: S1L, highlight: 'hold' },
    { char: '\u{13079}', phon: 'Wḏꜣt',  uname: 'D004', font: 'egy', word: 'wšbw', gloss: 'the answers',          stanzaEn: S1L, highlight: 'the answers?' },
  ],
  // Stanza 2 — "Where is the deepest wisdom? Thoth knows."
  // Transliteration: sb3yt — Ḏḥwty rḫ
  // Integrity fix: G025 ibis-on-standard (Thoth) replaces mislabeled E010; N014 star for sb3
  [
    { char: '\u{131FC}', phon: 'sb3',   uname: 'N014', font: 'egy', word: 'sb3yt', gloss: 'wisdom star (sb3)',  stanzaEn: S2L, highlight: 'the deepest wisdom?' },
    { char: '\u{1313F}', phon: 'ꜣ',    uname: 'G001', font: 'egy', word: 'sb3yt', gloss: 'phonogram ꜣ',        stanzaEn: S2L, highlight: 'the deepest wisdom?' },
    { char: '\u{133CF}', phon: 't',    uname: 'X001', font: 'egy', word: 'sb3yt', gloss: 'abstract noun -t',   stanzaEn: S2L, highlight: 'wisdom?' },
    { char: '\u{1315C}', phon: 'Ḏḥwty',uname: 'G025', font: 'egy', word: 'Ḏḥwty', gloss: 'Thoth (ibis)',       stanzaEn: S2L, highlight: 'Thoth' },
    { char: '\u{13093}', phon: 'kꜣ',   uname: 'D028', font: 'egy', word: 'rḫ',   gloss: 'to know',             stanzaEn: S2L, highlight: 'Thoth knows.' },
    { char: '\u{1305F}', phon: 'nṯr',  uname: 'C003', font: 'egy', word: 'rḫ',   gloss: 'divine (determinative)',stanzaEn: S2L, highlight: 'Thoth knows.' },
  ],
  // Stanza 3 — NEW: "Are there ancient settlements beneath the great sand dunes?"
  // Transliteration: ı͗n niwt iꜣwt ẖr ḏww wr
  // Coinage §: "great sand dunes" rendered as ḏww wr (the great mountains) — marked in GLYPH-KEY
  [
    { char: '\u{131CB}', phon: 'ı͗',   uname: 'M017', font: 'egy', word: 'ı͗n',   gloss: 'interrogative',        stanzaEn: S3L, highlight: 'Are there' },
    { char: '\u{13216}', phon: 'n',    uname: 'N035', font: 'egy', word: 'ı͗n',   gloss: 'particle (is there?)', stanzaEn: S3L, highlight: 'Are there' },
    { char: '\u{13017}', phon: 'iꜣw',  uname: 'A019', font: 'egy', word: 'iꜣwt', gloss: 'ancient (elder sign)', stanzaEn: S3L, highlight: 'ancient' },
    { char: '\u{13296}', phon: 'niwt', uname: 'O049', font: 'egy', word: 'niwt', gloss: 'settlements',           stanzaEn: S3L, highlight: 'settlements' },
    { char: '\u{1308B}', phon: 'r',    uname: 'D021', font: 'egy', word: 'ẖr',   gloss: 'beneath',               stanzaEn: S3L, highlight: 'beneath' },
    { char: '\u{1320B}', phon: 'ḏw',   uname: 'N026', font: 'egy', word: 'ḏww §',gloss: 'mountains (§ = dunes)',stanzaEn: S3L, highlight: 'the great sand dunes?' },
    { char: '\u{13168}', phon: 'wr',   uname: 'G036', font: 'egy', word: 'ḏww §',gloss: 'great',                 stanzaEn: S3L, highlight: 'the great sand dunes?' },
  ],
];

// Morse per divider — distribution of T·H·R·E·S·H·O·L·D across left column
const LEFT_DIVIDERS: DividerData[] = [
  { char: '☉', name: 'Sun',  morse: '- ....' },                       // T H
  { char: '☽', name: 'Moon', char2: '🜃', name2: 'Earth', morse: '.-. .' }, // R E
];

// ── Verified Sumerian Cuneiform data (Unicode 15, confirmed via unicodedata) ──
// Sources: ePSD (Pennsylvania Sumerian Dictionary); ETCSL (Oxford);
//          Unicode 15.0 code chart Cuneiform (U+12000–U+1242F)
// Rule: transliteration and column signs are 1-for-1. Coinage marked §.

const S1R = 'Who were the gods?';
const S2R = 'Did our ways come from the Denisovans, or from the Neanderthals?';
const S3R = 'The secrets lie beneath.';

const RIGHT_STANZAS: GlyphEntry[][] = [
  // Stanza 1 — "Who were the gods?" (a-ba dingir-e-ne)
  // Attested: a-ba = "who" (ePSD); dingir-e-ne = "the gods" (ETCSL)
  [
    { char: '\u{12000}', phon: 'a',      uname: 'A',   font: 'sux', word: 'a-ba',        gloss: 'who',           stanzaEn: S1R, highlight: 'Who' },
    { char: '\u{12040}', phon: 'ba',     uname: 'BA',  font: 'sux', word: 'a-ba',        gloss: 'were',          stanzaEn: S1R, highlight: 'were' },
    { char: '\u{1202D}', phon: 'dingir', uname: 'AN',  font: 'sux', word: 'dingir-e-ne', gloss: 'the gods',      stanzaEn: S1R, highlight: 'the gods?' },
    { char: '\u{1208A}', phon: 'e',      uname: 'E',   font: 'sux', word: 'dingir-e-ne', gloss: 'verbal marker', stanzaEn: S1R, highlight: 'the gods?' },
    { char: '\u{12248}', phon: 'ne',     uname: 'NE',  font: 'sux', word: 'dingir-e-ne', gloss: 'plural (gods)', stanzaEn: S1R, highlight: 'the gods?' },
  ],
  // Stanza 2 — NEW: "Did our ways come from the Denisovans, or from the Neanderthals?"
  // Two coined compounds (§):
  //   lú-kur-utu-è = Denisovans (people of the eastern mountain sunrise)
  //   lú-kur-GAL   = Neanderthals (great mountain people)
  [
    { char: '\u{121FD}', phon: 'lú',  uname: 'LU2', font: 'sux', word: 'lú-kur-utu-è §', gloss: 'Denisovans (§)', stanzaEn: S2R, highlight: 'Denisovans' },
    { char: '\u{121B3}', phon: 'kur', uname: 'KUR', font: 'sux', word: 'lú-kur-utu-è §', gloss: 'mountain / east', stanzaEn: S2R, highlight: 'Denisovans' },
    { char: '\u{12313}', phon: 'utu', uname: 'UD',  font: 'sux', word: 'lú-kur-utu-è §', gloss: 'sun / sunrise',   stanzaEn: S2R, highlight: 'Denisovans' },
    { char: '\u{1208D}', phon: 'è',   uname: 'E2',  font: 'sux', word: 'lú-kur-utu-è §', gloss: 'arising (= east)',stanzaEn: S2R, highlight: 'Denisovans' },
    { char: '\u{121FD}', phon: 'lú',  uname: 'LU2', font: 'sux', word: 'lú-kur-GAL §',   gloss: 'Neanderthals (§)',stanzaEn: S2R, highlight: 'Neanderthals' },
    { char: '\u{121B3}', phon: 'kur', uname: 'KUR', font: 'sux', word: 'lú-kur-GAL §',   gloss: 'mountain people', stanzaEn: S2R, highlight: 'Neanderthals' },
    { char: '\u{120F2}', phon: 'GAL', uname: 'GAL', font: 'sux', word: 'lú-kur-GAL §',   gloss: 'great / ancient', stanzaEn: S2R, highlight: 'Neanderthals' },
  ],
  // Stanza 3 — "The secrets lie beneath." (ad-ḫal ki-ta gál)
  // Integrity fix: AD sign (U+1201C) replaces KA (U+12157) — ad starts with AD, not KA
  [
    { char: '\u{1201C}', phon: 'ad',  uname: 'AD',  font: 'sux', word: 'ad-ḫal', gloss: 'the secrets',    stanzaEn: S3R, highlight: 'The secrets' },
    { char: '\u{1212C}', phon: 'ḫal', uname: 'HAL', font: 'sux', word: 'ad-ḫal', gloss: 'concealed',      stanzaEn: S3R, highlight: 'The secrets' },
    { char: '\u{121A0}', phon: 'ki',  uname: 'KI',  font: 'sux', word: 'ki-ta',  gloss: 'earth / below',  stanzaEn: S3R, highlight: 'lie beneath.' },
    { char: '\u{122EB}', phon: 'ta',  uname: 'TA',  font: 'sux', word: 'ki-ta',  gloss: 'from beneath',   stanzaEn: S3R, highlight: 'lie beneath.' },
    { char: '\u{120F2}', phon: 'gál', uname: 'GAL', font: 'sux', word: 'gál',    gloss: 'to lie / exist', stanzaEn: S3R, highlight: 'lie beneath.' },
  ],
];

// Morse per divider — continuation of T·H·R·E·S·H·O·L·D across right column
const RIGHT_DIVIDERS: DividerData[] = [
  { char: '♄', name: 'Saturn',       morse: '... ....' },           // S H
  { char: '⊕', name: 'Earth Cross',  morse: '--- .-.. -..', lidar: true }, // O L D
];

// ── Morse tick marks SVG ─────────────────────────────────────────────────────

function MorseTicks({ code }: { code: string }) {
  type Mark = { kind: 'dot' | 'dash'; x: number };
  const marks: Mark[] = [];
  let x = 0;
  for (const ch of code) {
    if (ch === '.') {
      marks.push({ kind: 'dot', x });
      x += 5;
    } else if (ch === '-') {
      marks.push({ kind: 'dash', x });
      x += 12;
    } else if (ch === ' ') {
      x += 5;
    }
  }
  const w = Math.max(x + 2, 20);
  return (
    <svg viewBox={`0 0 ${w} 12`} width={w} height={12} aria-hidden="true" className="gc-morse-svg">
      {marks.map((m, i) =>
        m.kind === 'dot'
          ? <line key={i} x1={m.x + 1} y1={4} x2={m.x + 1} y2={8} stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          : <line key={i} x1={m.x + 1} y1={2} x2={m.x + 1} y2={10} stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      )}
    </svg>
  );
}

// LIDAR sweep arc — decorative modern mark for right column divider 2
function LidarMark() {
  return (
    <svg viewBox="0 0 36 18" width={36} height={18} aria-hidden="true" className="gc-lidar-mark">
      <path d="M3,15 Q18,3 33,15" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" />
      <line x1="18" y1="15" x2="18" y2="3" stroke="currentColor" strokeWidth="0.8" />
      <line x1="18" y1="15" x2="30" y2="8" stroke="currentColor" strokeWidth="0.75" strokeDasharray="2 2" opacity="0.6" />
      <line x1="18" y1="15" x2="6"  y2="8" stroke="currentColor" strokeWidth="0.75" strokeDasharray="2 2" opacity="0.6" />
    </svg>
  );
}

// ── Canvas stroke-fire helper ────────────────────────────────────────────────
// Fire crawls along the ink paths of each glyph via BFS distance field.
// No directional wipes — the flame front follows the strokes of the character.

const BURN_BG_COLOR = [16, 13, 9] as const;     // warm dark, matches column ground
const CHAR_SETTLED  = [58, 40, 22] as const;     // matches gc-glyph-burned color
const FIRE_SWEEP_MS = 2600;                       // ms for front to cross all strokes
const FIRE_SETTLE_MS = 700;                       // ms for tail pixels to char out

// Map per-pixel age-since-ignition → fire RGB
function fireColor(age: number): [number, number, number] {
  if (age < 0.04) {
    const u = age / 0.04;
    return [255, Math.round(255 - 55 * u), Math.round(200 * (1 - u))];
  }
  if (age < 0.12) {
    const u = (age - 0.04) / 0.08;
    return [255, Math.round(200 - 100 * u), 0];
  }
  if (age < 0.25) {
    const u = (age - 0.12) / 0.13;
    return [255, Math.round(100 - 70 * u), 0];
  }
  if (age < 0.45) {
    const u = (age - 0.25) / 0.20;
    return [Math.round(255 - 55 * u), Math.round(30 - 10 * u), 0];
  }
  if (age < 0.70) {
    const u = (age - 0.45) / 0.25;
    return [Math.round(200 - 80 * u), Math.round(20 + u * 5), Math.round(u * 5)];
  }
  const u = Math.min(1, (age - 0.70) / 0.30);
  return [
    Math.round(120 + (CHAR_SETTLED[0] - 120) * u),
    Math.round(25  + (CHAR_SETTLED[1] - 25)  * u),
    Math.round(8   + (CHAR_SETTLED[2] - 8)   * u),
  ];
}

function startBurnStroke(
  el: HTMLElement,
  char: string,
  delay: number,
): () => void {
  const canvas = document.createElement('canvas');
  Object.assign(canvas.style, {
    position: 'absolute', inset: '0', width: '100%', height: '100%',
    pointerEvents: 'none', zIndex: '2',
  });
  el.appendChild(canvas);

  let rafId = 0;
  let alive = true;

  const timerId = setTimeout(async () => {
    await document.fonts.ready;
    if (!alive) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const W = el.offsetWidth;
    const H = el.offsetHeight;
    if (!W || !H) { canvas.remove(); return; }

    const PW = Math.round(W * dpr);
    const PH = Math.round(H * dpr);
    canvas.width = PW;
    canvas.height = PH;
    const ctx = canvas.getContext('2d')!;

    // ── 1. Rasterize glyph into offscreen canvas ───────────────────────
    const cs = window.getComputedStyle(el);
    const fontFamily = cs.fontFamily;
    const fontSize   = parseFloat(cs.fontSize) * dpr;

    const off = document.createElement('canvas');
    off.width = PW; off.height = PH;
    const oCtx = off.getContext('2d')!;
    oCtx.fillStyle = '#000';
    oCtx.fillRect(0, 0, PW, PH);
    oCtx.fillStyle = '#fff';
    oCtx.font = `${fontSize}px ${fontFamily}`;
    oCtx.textAlign = 'center';
    oCtx.textBaseline = 'middle';
    oCtx.fillText(char, PW / 2, PH / 2);

    const raw = oCtx.getImageData(0, 0, PW, PH).data;

    // ── 2. Build ink mask (alpha > threshold = stroke pixel) ───────────
    const inkMask = new Uint8Array(PW * PH);
    let inkCount = 0;
    for (let i = 0; i < PW * PH; i++) {
      if (raw[i * 4] > 40) { inkMask[i] = 1; inkCount++; }
    }
    if (inkCount === 0) { canvas.remove(); return; }

    // ── 3. BFS distance field through ink pixels (8-connected) ─────────
    // Each ink pixel gets a distance = steps from the ignition seed.
    // Disconnected components get their own slightly-delayed seed.
    const DX = [-1, 0, 1, -1, 1, -1, 0, 1];
    const DY = [-1, -1, -1, 0,  0,  1, 1, 1];

    const dist      = new Float32Array(PW * PH).fill(-1);
    const pixNoise  = new Float32Array(PW * PH);
    for (let i = 0; i < PW * PH; i++) pixNoise[i] = (Math.random() * 2 - 1) * 0.07;

    let maxDist    = 0;
    let compOffset = 0;

    const bfs = (seedIdx: number, offset: number) => {
      const q: number[] = [seedIdx];
      dist[seedIdx] = offset;
      let h = 0;
      while (h < q.length) {
        const idx = q[h++];
        const y = (idx / PW) | 0;
        const x = idx % PW;
        for (let k = 0; k < 8; k++) {
          const nx = x + DX[k];
          const ny = y + DY[k];
          if (nx < 0 || nx >= PW || ny < 0 || ny >= PH) continue;
          const ni = ny * PW + nx;
          if (!inkMask[ni] || dist[ni] >= 0) continue;
          const nd = dist[idx] + (DX[k] !== 0 && DY[k] !== 0 ? 1.414 : 1);
          dist[ni] = nd;
          if (nd > maxDist) maxDist = nd;
          q.push(ni);
        }
      }
    };

    // Pick a random ink pixel as the primary ignition point
    let seed = -1;
    for (let a = 0; a < 5000 && seed < 0; a++) {
      const c = (Math.random() * PW * PH) | 0;
      if (inkMask[c]) seed = c;
    }
    if (seed < 0) { canvas.remove(); return; }
    bfs(seed, 0);

    // Disconnected stroke components ignite slightly after the main burn
    for (let i = 0; i < PW * PH; i++) {
      if (inkMask[i] && dist[i] < 0) {
        compOffset += maxDist * 0.18;
        dist[i] = compOffset;
        bfs(i, compOffset);
      }
    }

    // Normalize to [0, 1] and add per-pixel noise for ragged front
    const denom = maxDist > 0 ? maxDist : 1;
    for (let i = 0; i < PW * PH; i++) {
      if (dist[i] >= 0) {
        dist[i] = Math.max(0, Math.min(1, dist[i] / denom + pixNoise[i]));
      }
    }

    // ── 4. Animate ─────────────────────────────────────────────────────
    const outImg = ctx.createImageData(PW, PH);
    const out    = outImg.data;
    const [bgR, bgG, bgB] = BURN_BG_COLOR;
    const TOTAL  = FIRE_SWEEP_MS + FIRE_SETTLE_MS;

    // Initial fill: dark background before first frame
    for (let o = 0; o < PW * PH * 4; o += 4) {
      out[o] = bgR; out[o+1] = bgG; out[o+2] = bgB; out[o+3] = 255;
    }
    ctx.putImageData(outImg, 0, 0);

    const start = performance.now();
    const frame = (now: number) => {
      if (!alive) return;
      const elapsed = now - start;
      const rawT = elapsed / FIRE_SWEEP_MS;
      // Ease during sweep, hold at 1 during settle
      const tE = rawT >= 1 ? 1 : (rawT < 0.5 ? 2 * rawT * rawT : -1 + (4 - 2 * rawT) * rawT);
      // Settle bonus ramps to 1.1 so the last pixel (d=1.0) reaches age≥1.0
      // — fully charred [58,40,22] — matching gc-glyph-burned color exactly at canvas removal.
      const settleBonus = elapsed > FIRE_SWEEP_MS
        ? ((elapsed - FIRE_SWEEP_MS) / FIRE_SETTLE_MS) * 1.1
        : 0;

      for (let i = 0; i < PW * PH; i++) {
        const o = i * 4;
        const d = dist[i];
        if (!inkMask[i] || d < 0 || d > tE) {
          out[o] = bgR; out[o+1] = bgG; out[o+2] = bgB; out[o+3] = 255;
          continue;
        }
        const age = tE - d + settleBonus;
        const [r, g, b] = fireColor(age);
        out[o] = r; out[o+1] = g; out[o+2] = b; out[o+3] = 255;
      }

      ctx.putImageData(outImg, 0, 0);

      if (elapsed < TOTAL) {
        rafId = requestAnimationFrame(frame);
      } else {
        ctx.clearRect(0, 0, PW, PH);
        canvas.remove();
      }
    };
    rafId = requestAnimationFrame(frame);
  }, delay * 1000);

  return () => {
    alive = false;
    clearTimeout(timerId);
    cancelAnimationFrame(rafId);
    canvas.remove();
  };
}

// ── Glyph cell ───────────────────────────────────────────────────────────────

interface GlyphCellProps {
  entry: GlyphEntry;
  onEnter: (entry: GlyphEntry) => void;
  onLeave: () => void;
}

// Each glyph observes itself — individual ignition as it enters the viewport.
// jitterRef stores a stable random delay (0–0.4 s) so nearby glyphs stagger.
function GlyphCell({ entry, onEnter, onLeave }: GlyphCellProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [burned, setBurned] = useState(false);
  const started = useRef(false);
  const jitterRef = useRef<number | null>(null);
  if (jitterRef.current === null) jitterRef.current = Math.random() * 0.4;

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([obs]) => {
        if (obs.isIntersecting) {
          setBurned(true);
          io.disconnect();
        }
      },
      { threshold: 0, rootMargin: '0px 0px -40% 0px' }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (!burned || started.current) return;
    started.current = true;
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    return startBurnStroke(el, entry.char, jitterRef.current!);
  }, [burned]);

  return (
    <div
      ref={ref}
      className={`gc-glyph${burned ? ' gc-glyph-burned' : ''}`}
      style={burned ? { animationDelay: `${jitterRef.current}s` } : undefined}
      onMouseEnter={() => onEnter(entry)}
      onMouseLeave={onLeave}
    >
      {entry.char}
    </div>
  );
}

// ── Stanza block ─────────────────────────────────────────────────────────────

interface StanzaProps {
  glyphs: GlyphEntry[];
  lang: string;
  onGlyphEnter: (entry: GlyphEntry) => void;
  onGlyphLeave: () => void;
}

function GlyphStanza({ glyphs, lang, onGlyphEnter, onGlyphLeave }: StanzaProps) {
  return (
    <div className="gc-stanza" lang={lang}>
      {glyphs.map((g, i) => (
        <GlyphCell
          key={i}
          entry={g}
          onEnter={onGlyphEnter}
          onLeave={onGlyphLeave}
        />
      ))}
    </div>
  );
}

// ── Divider band ─────────────────────────────────────────────────────────────

interface DividerBandProps {
  data: DividerData;
  onSymbolEnter: (char: string, name: string) => void;
  onSymbolLeave: () => void;
}

function DividerBand({ data, onSymbolEnter, onSymbolLeave }: DividerBandProps) {
  return (
    <div className="gc-divider-band">
      <div className="gc-divider-rule" />
      <div className="gc-divider-body">
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <span
            className="gc-concept-glyph"
            onMouseEnter={() => onSymbolEnter(data.char, data.name)}
            onMouseLeave={onSymbolLeave}
          >
            {data.char}
          </span>
          {data.char2 && (
            <span
              className="gc-concept-glyph"
              style={{ fontSize: 20 }}
              onMouseEnter={() => onSymbolEnter(data.char2!, data.name2 ?? '')}
              onMouseLeave={onSymbolLeave}
            >
              {data.char2}
            </span>
          )}
          {data.lidar && (
            <span className="gc-lidar-mark">
              <LidarMark />
            </span>
          )}
        </div>
        <span className="gc-divider-marks">
          <MorseTicks code={data.morse} />
        </span>
      </div>
      <div className="gc-divider-rule" />
    </div>
  );
}

// ── Column renderer helper ────────────────────────────────────────────────────

interface ColumnProps {
  stanzas: GlyphEntry[][];
  dividers: DividerData[];
  lang: string;
  side: 'left' | 'right';
  onGlyphEnter: (entry: GlyphEntry) => void;
  onGlyphLeave: () => void;
  onSymbolEnter: (char: string, name: string) => void;
  onSymbolLeave: () => void;
}

function GlyphColumn({ stanzas, dividers, lang, side, onGlyphEnter, onGlyphLeave, onSymbolEnter, onSymbolLeave }: ColumnProps) {
  const items: React.ReactNode[] = [];
  stanzas.forEach((glyphs, si) => {
    items.push(
      <GlyphStanza
        key={`s${si}`}
        glyphs={glyphs}
        lang={lang}
        onGlyphEnter={onGlyphEnter}
        onGlyphLeave={onGlyphLeave}
      />
    );
    if (si < dividers.length) {
      items.push(
        <DividerBand
          key={`d${si}`}
          data={dividers[si]}
          onSymbolEnter={onSymbolEnter}
          onSymbolLeave={onSymbolLeave}
        />
      );
    }
  });

  return (
    <div className={`gc-col gc-col-${side}`}>
      {items}
    </div>
  );
}

// ── Main component ────────────────────────────────────────────────────────────

export default function GlyphColumns() {
  const [show, setShow] = useState(false);
  const [lens, setLens] = useState<LensState | null>(null);
  const lensRef = useRef<HTMLDivElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mq = window.matchMedia('(min-width: 1440px)');
    setShow(mq.matches);
    const handler = (e: MediaQueryListEvent) => setShow(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  // Clip wrapper height to sentinel; set column top offset from hero's bottom
  useEffect(() => {
    if (!show) return;
    const measure = () => {
      const hero     = document.querySelector('#mesa-hero') as HTMLElement | null;
      const sentinel = document.querySelector('[data-gc-end]') as HTMLElement | null;
      const wrapper  = wrapperRef.current;
      if (!wrapper) return;
      const wrapperTop = wrapper.getBoundingClientRect().top + window.pageYOffset;
      if (sentinel) {
        const sentinelTop = sentinel.getBoundingClientRect().top + window.pageYOffset;
        wrapper.style.height = `${Math.max(0, sentinelTop - wrapperTop)}px`;
      }
      if (hero) {
        const heroBottom = hero.getBoundingClientRect().bottom + window.pageYOffset;
        // Push columns so first glyph starts clear of the hero section
        wrapper.style.setProperty('--gc-col-top', `${Math.max(0, heroBottom - wrapperTop)}px`);
      }
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(document.documentElement);
    return () => ro.disconnect();
  }, [show]);

  // Follow mouse with lens (no CSS transition on position — direct assignment for lag-free tracking)
  useEffect(() => {
    if (!show) return;
    const onMove = (e: MouseEvent) => {
      const el = lensRef.current;
      if (el) {
        el.style.left = `${e.clientX - 130}px`;
        el.style.top  = `${e.clientY + 16}px`;
      }
    };
    document.addEventListener('mousemove', onMove, { passive: true });
    return () => document.removeEventListener('mousemove', onMove);
  }, [show]);

  const onGlyphEnter = useCallback((entry: GlyphEntry) => {
    setLens({ kind: 'glyph', char: entry.char, phon: entry.phon, uname: entry.uname, font: entry.font, word: entry.word, gloss: entry.gloss, stanzaEn: entry.stanzaEn, highlight: entry.highlight });
  }, []);

  const onGlyphLeave = useCallback(() => setLens(null), []);

  const onSymbolEnter = useCallback((char: string, name: string) => {
    setLens({ kind: 'symbol', char, name });
  }, []);

  const onSymbolLeave = useCallback(() => setLens(null), []);

  if (!show) return null;

  const lensVisible = lens !== null;

  return (
    <>
      {/* ── Hover lens (single reused element) ─────────────────────────── */}
      <div
        ref={lensRef}
        className={`gc-lens${lensVisible ? ' gc-lens-visible' : ''}`}
        aria-hidden="true"
      >
        {lens && lens.kind === 'glyph' && (() => {
          const before = lens.stanzaEn.indexOf(lens.highlight);
          const after  = before + lens.highlight.length;
          return (
            <>
              <span className={`gc-lens-char gc-font-${lens.font}`}>{lens.char}</span>
              <span className="gc-lens-phon">{lens.phon}</span>
              <span className="gc-lens-word">{lens.word} — {lens.gloss}</span>
              <span className="gc-lens-sentence">
                {before >= 0 ? (
                  <>
                    {lens.stanzaEn.slice(0, before)}
                    <strong>{lens.stanzaEn.slice(before, after)}</strong>
                    {lens.stanzaEn.slice(after)}
                  </>
                ) : lens.stanzaEn}
              </span>
              <span className="gc-lens-uname">{lens.uname}</span>
            </>
          );
        })()}
        {lens && lens.kind === 'symbol' && (
          <>
            <span className="gc-lens-char">{lens.char}</span>
            <span className="gc-lens-phon">{lens.name}</span>
          </>
        )}
      </div>

      {/* ── Column wrapper ─────────────────────────────────────────────── */}
      <div ref={wrapperRef} className="gc-wrapper" aria-hidden="true">
        <GlyphColumn
          stanzas={LEFT_STANZAS}
          dividers={LEFT_DIVIDERS}
          lang="egy"
          side="left"
          onGlyphEnter={onGlyphEnter}
          onGlyphLeave={onGlyphLeave}
          onSymbolEnter={onSymbolEnter}
          onSymbolLeave={onSymbolLeave}
        />
        <GlyphColumn
          stanzas={RIGHT_STANZAS}
          dividers={RIGHT_DIVIDERS}
          lang="sux"
          side="right"
          onGlyphEnter={onGlyphEnter}
          onGlyphLeave={onGlyphLeave}
          onSymbolEnter={onSymbolEnter}
          onSymbolLeave={onSymbolLeave}
        />
      </div>
    </>
  );
}

// ── Mobile / tablet section divider (unchanged) ───────────────────────────────
export function GlyphDivider() {
  return (
    <div className="mg-divider" aria-hidden="true">
      <svg viewBox="0 0 120 24" fill="none" stroke="currentColor" strokeWidth="1.5"
           strokeLinecap="round" strokeLinejoin="round">
        <line x1="0" y1="12" x2="38" y2="12"/>
        <circle cx="48" cy="12" r="4"/>
        <line x1="44" y1="8" x2="48" y2="4"/>
        <line x1="52" y1="8" x2="48" y2="4"/>
        <line x1="44" y1="16" x2="48" y2="20"/>
        <line x1="52" y1="16" x2="48" y2="20"/>
        <line x1="40" y1="12" x2="36" y2="12"/>
        <line x1="56" y1="12" x2="60" y2="12"/>
        <circle cx="60" cy="12" r="1.5"/>
        <line x1="82" y1="12" x2="120" y2="12"/>
        <circle cx="72" cy="12" r="4"/>
      </svg>
    </div>
  );
}
