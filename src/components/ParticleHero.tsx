import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';

// ─── Constellation data (shared cosmology with VHE site) ──────────────────────
const CONSTELLATIONS = {
  gemini: {
    stars: [
      { nx: 0.3631, ny: 0.0744, r: 2.4, op: 0.95 }, { nx: 0.2381, ny: 0.2184, r: 2.4, op: 0.95 },
      { nx: 0.6559, ny: 0.1424, r: 1.4, op: 0.78 }, { nx: 0.52,   ny: 0.22,   r: 1.8, op: 0.86 },
      { nx: 0.2951, ny: 0.3006, r: 1.5, op: 0.80 }, { nx: 0.3062, ny: 0.5538, r: 1.4, op: 0.78 },
      { nx: 0.6,    ny: 0.58,   r: 1.5, op: 0.80 }, { nx: 0.2223, ny: 0.6962, r: 1.8, op: 0.86 },
      { nx: 0.6021, ny: 0.8054, r: 2.0, op: 0.90 }, { nx: 0.1701, ny: 0.3655, r: 1.5, op: 0.80 },
      { nx: 0.3726, ny: 0.3165, r: 1.5, op: 0.80 }, { nx: 0.379,  ny: 0.644,  r: 1.5, op: 0.80 },
      { nx: 0.4517, ny: 0.8703, r: 1.5, op: 0.80 }, { nx: 0.2998, ny: 0.9225, r: 1.5, op: 0.80 },
      { nx: 0.7476, ny: 0.7215, r: 1.5, op: 0.80 }, { nx: 0.8236, ny: 0.7484, r: 1.5, op: 0.80 },
      { nx: 0.9153, ny: 0.7421, r: 1.5, op: 0.80 },
    ],
    lines: [[1,4],[4,5],[5,7],[6,8],[2,3],[0,3],[4,9],[4,10],[3,10],[3,6],[5,11],[11,12],[7,13],[6,14],[14,15],[15,16]],
  },
  sagittarius: {
    stars: [
      { nx: 0.2856, ny: 0.2358, r: 1.3, op: 0.75 }, { nx: 0.2239, ny: 0.3892, r: 1.5, op: 0.80 },
      { nx: 0.621,  ny: 0.3924, r: 1.4, op: 0.78 }, { nx: 0.3995, ny: 0.2611, r: 1.5, op: 0.80 },
      { nx: 0.5815, ny: 0.2152, r: 1.6, op: 0.82 }, { nx: 0.7492, ny: 0.4494, r: 1.7, op: 0.84 },
      { nx: 0.6922, ny: 0.0744, r: 1.5, op: 0.80 }, { nx: 0.8995, ny: 0.4019, r: 1.4, op: 0.78 },
      { nx: 0.629,  ny: 0.693,  r: 2.3, op: 0.94 }, { nx: 0.5926, ny: 0.6123, r: 1.8, op: 0.86 },
      { nx: 0.1843, ny: 0.2911, r: 1.5, op: 0.80 }, { nx: 0.2777, ny: 0.1503, r: 1.5, op: 0.80 },
      { nx: 0.2286, ny: 0.1519, r: 1.5, op: 0.80 }, { nx: 0.1622, ny: 0.106,  r: 1.5, op: 0.80 },
      { nx: 0.1195, ny: 0.0744, r: 1.5, op: 0.80 }, { nx: 0.0894, ny: 0.2532, r: 1.5, op: 0.80 },
      { nx: 0.0277, ny: 0.3386, r: 1.5, op: 0.80 }, { nx: 0.0941, ny: 0.625,  r: 1.5, op: 0.80 },
      { nx: 0.1384, ny: 0.8117, r: 1.5, op: 0.80 }, { nx: 0.3172, ny: 0.7864, r: 1.5, op: 0.80 },
      { nx: 0.2903, ny: 0.9304, r: 1.5, op: 0.80 },
    ],
    lines: [[4,6],[2,4],[3,4],[2,3],[5,7],[2,5],[2,9],[5,9],[8,9],[1,9],[1,3],[0,3],[0,10],[1,10],[13,14],[12,13],[11,12],[0,11],[10,15],[15,16],[16,17],[17,18],[18,19],[18,20]],
  },
  capricornus: {
    stars: [
      { nx: 0.1337, ny: 0.3797, r: 2.2, op: 0.93 }, { nx: 0.2,    ny: 0.4,    r: 1.4, op: 0.78 },
      { nx: 0.45,   ny: 0.42,   r: 1.5, op: 0.80 }, { nx: 0.62,   ny: 0.4,    r: 1.7, op: 0.84 },
      { nx: 0.9881, ny: 0.2864, r: 1.9, op: 0.88 }, { nx: 1.0,    ny: 0.2247, r: 1.4, op: 0.78 },
      { nx: 0.42,   ny: 0.7,    r: 1.4, op: 0.78 }, { nx: 0.7318, ny: 0.8655, r: 1.5, op: 0.80 },
      { nx: 0.7666, ny: 0.8085, r: 1.5, op: 0.80 },
    ],
    lines: [[0,1],[1,2],[2,3],[3,4],[4,5],[2,6],[3,7],[4,8],[3,6]],
  },
};

// ─── Glyph point generators ───────────────────────────────────────────────────
function glyphCompassRose(n: number): [number, number][] {
  const pts: [number, number][] = [];
  // Cardinal spikes (long)
  for (const d of [0, 0.5, 1, 1.5]) {
    const a = d * Math.PI;
    for (let t = 0.1; t <= 1; t += 0.18) {
      pts.push([Math.sin(a) * t, -Math.cos(a) * t]);
    }
    // Arrowhead sides
    pts.push([Math.sin(a + 0.3) * 0.55, -Math.cos(a + 0.3) * 0.55]);
    pts.push([Math.sin(a - 0.3) * 0.55, -Math.cos(a - 0.3) * 0.55]);
  }
  // Intercardinal spikes (short)
  for (const d of [0.25, 0.75, 1.25, 1.75]) {
    const a = d * Math.PI;
    for (let t = 0.15; t <= 0.65; t += 0.20) {
      pts.push([Math.sin(a) * t, -Math.cos(a) * t]);
    }
  }
  // Inner ring
  for (let i = 0; i < 12; i++) {
    const a = (i / 12) * Math.PI * 2;
    pts.push([Math.sin(a) * 0.22, Math.cos(a) * 0.22]);
  }
  // Center dot
  pts.push([0, 0]);
  return pts.slice(0, n);
}

function glyphCairn(n: number): [number, number][] {
  const pts: [number, number][] = [];
  const stones = [
    { y: 0.78, rx: 0.78, ry: 0.14, count: 22 },
    { y: 0.48, rx: 0.60, ry: 0.13, count: 18 },
    { y: 0.22, rx: 0.44, ry: 0.12, count: 14 },
    { y: 0.00, rx: 0.30, ry: 0.11, count: 10 },
    { y:-0.20, rx: 0.18, ry: 0.09, count: 7  },
  ];
  for (const s of stones) {
    for (let i = 0; i < s.count; i++) {
      const a = (i / s.count) * Math.PI * 2;
      pts.push([Math.cos(a) * s.rx, s.y + Math.sin(a) * s.ry]);
    }
    // Stone fill points
    pts.push([0, s.y]);
    pts.push([s.rx * 0.45, s.y + s.ry * 0.4]);
    pts.push([-s.rx * 0.45, s.y - s.ry * 0.4]);
  }
  return pts.slice(0, n);
}

function glyphFootprint(n: number): [number, number][] {
  const pts: [number, number][] = [];
  // Main foot pad (elongated oval)
  const padCount = Math.round(n * 0.65);
  for (let i = 0; i < padCount; i++) {
    const a = (i / padCount) * Math.PI * 2;
    const rx = 0.44;
    const ry = 0.82;
    pts.push([Math.cos(a) * rx, Math.sin(a) * ry]);
  }
  // Interior fill
  for (let i = 0; i < 20; i++) {
    const a = (i / 20) * Math.PI * 2;
    pts.push([Math.cos(a) * 0.22, Math.sin(a) * 0.50]);
  }
  // Toes at top (5 small ovals)
  const toeOffsets: [number, number][] = [[-0.36, -0.90], [-0.18, -0.96], [0, -0.99], [0.18, -0.96], [0.36, -0.90]];
  for (const [tx, ty] of toeOffsets) {
    const tr = 0.10;
    for (let i = 0; i < 6; i++) {
      const a = (i / 6) * Math.PI * 2;
      pts.push([tx + Math.cos(a) * tr, ty + Math.sin(a) * tr * 0.8]);
    }
  }
  return pts.slice(0, n);
}

function glyphUAP(n: number): [number, number][] {
  const pts: [number, number][] = [];
  // Main saucer body (wide flat ellipse)
  const bodyCount = Math.round(n * 0.45);
  for (let i = 0; i < bodyCount; i++) {
    const a = (i / bodyCount) * Math.PI * 2;
    pts.push([Math.cos(a) * 0.95, Math.sin(a) * 0.22]);
  }
  // Interior body fill
  for (let i = 0; i < 25; i++) {
    const a = (i / 25) * Math.PI * 2;
    pts.push([Math.cos(a) * 0.6, Math.sin(a) * 0.14]);
  }
  // Dome on top
  const domeCount = Math.round(n * 0.25);
  for (let i = 0; i < domeCount; i++) {
    const a = (i / domeCount) * Math.PI;
    pts.push([Math.cos(a) * 0.36, -0.18 - Math.sin(a) * 0.30]);
  }
  // Rim glow points
  for (let i = 0; i < 16; i++) {
    const a = (i / 16) * Math.PI * 2;
    pts.push([Math.cos(a) * 1.02, Math.sin(a) * 0.24]);
  }
  // Underside lights
  for (let i = 0; i < 7; i++) {
    const x = (i / 6 - 0.5) * 1.2;
    pts.push([x, 0.28]);
  }
  return pts.slice(0, n);
}

function glyphPetroglyph(n: number): [number, number][] {
  const pts: [number, number][] = [];
  // Head circle
  for (let i = 0; i < 18; i++) {
    const a = (i / 18) * Math.PI * 2;
    pts.push([Math.cos(a) * 0.22, -0.68 + Math.sin(a) * 0.22]);
  }
  // Body line
  for (let t = 0; t <= 1; t += 0.1) pts.push([0, -0.44 + t * 0.72]);
  // Arms (outstretched, slightly raised)
  for (let t = 0; t <= 1; t += 0.1) pts.push([-t * 0.72, -0.18 - t * 0.12]);
  for (let t = 0; t <= 1; t += 0.1) pts.push([ t * 0.72, -0.18 - t * 0.12]);
  // Left leg (spread)
  for (let t = 0; t <= 1; t += 0.12) pts.push([-t * 0.44, 0.28 + t * 0.60]);
  // Right leg
  for (let t = 0; t <= 1; t += 0.12) pts.push([ t * 0.44, 0.28 + t * 0.60]);
  // Hands
  for (let i = 0; i < 5; i++) { const a = (i/5)*Math.PI*2; pts.push([-0.72+Math.cos(a)*0.10, -0.30+Math.sin(a)*0.10]); }
  for (let i = 0; i < 5; i++) { const a = (i/5)*Math.PI*2; pts.push([ 0.72+Math.cos(a)*0.10, -0.30+Math.sin(a)*0.10]); }
  return pts.slice(0, n);
}

function glyphSpiral(n: number): [number, number][] {
  const pts: [number, number][] = [];
  const turns = 3.2;
  for (let i = 0; i < n; i++) {
    const t = i / n;
    const a = t * Math.PI * 2 * turns;
    const r = 0.08 + t * 0.88;
    pts.push([Math.cos(a) * r, Math.sin(a) * r]);
  }
  return pts;
}

function glyphTopoRings(n: number): [number, number][] {
  const pts: [number, number][] = [];
  const rings = [
    { r: 0.95, count: Math.round(n * 0.38) },
    { r: 0.62, count: Math.round(n * 0.32) },
    { r: 0.33, count: Math.round(n * 0.20) },
    { r: 0.12, count: Math.round(n * 0.10) },
  ];
  for (const ring of rings) {
    for (let i = 0; i < ring.count; i++) {
      // Add slight irregularity to look topographic
      const a = (i / ring.count) * Math.PI * 2;
      const jitter = 0.04 * Math.sin(a * 5) + 0.02 * Math.cos(a * 8);
      const r = ring.r + jitter;
      pts.push([Math.cos(a) * r, Math.sin(a) * r]);
    }
  }
  return pts.slice(0, n);
}

const GLYPHS = [
  glyphCompassRose,
  glyphCairn,
  glyphFootprint,
  glyphUAP,
  glyphPetroglyph,
  glyphSpiral,
  glyphTopoRings,
];

// ─── Particle type ────────────────────────────────────────────────────────────
interface Particle {
  bx: number; by: number;   // base position (normalized 0-1)
  ox: number; oy: number;   // offset from base
  vx: number; vy: number;   // velocity
  r: number;                // radius
  op: number;               // opacity
  depth: number;            // 0=near 1=mid 2=far  (drift speed multiplier)
  tx: number | null;        // formation target x (canvas px)
  ty: number | null;
  formOp: number;           // formation-override opacity (>0 during gather/hold)
}

// ─── Canvas engine (lives inside useEffect, no deps) ─────────────────────────
function runCanvas(canvas: HTMLCanvasElement, reduced: boolean): () => void {
  const ctx = canvas.getContext('2d')!;
  let W = 0, H = 0;
  const isMobile = window.innerWidth < 768;
  const PARTICLE_COUNT = isMobile ? 160 : 320;
  const FORM_COUNT     = isMobile ? 80  : 160;  // particles that join glyph
  const GLYPH_SCALE    = () => Math.min(W, H) * (isMobile ? 0.28 : 0.26);
  const GLYPH_CX       = () => W / 2;
  const GLYPH_CY       = () => H * 0.47;

  // ── Particle pool ───────────────────────────────────────────────────────────
  const particles: Particle[] = [];
  for (let i = 0; i < PARTICLE_COUNT; i++) {
    const depth = i % 3;
    particles.push({
      bx: Math.random(),
      by: Math.random(),
      ox: 0, oy: 0,
      vx: (Math.random() - 0.5) * 0.0008,
      vy: (Math.random() - 0.5) * 0.0004,
      r:  depth === 0 ? 1.4 + Math.random() * 0.8 :
          depth === 1 ? 0.9 + Math.random() * 0.6 :
                        0.5 + Math.random() * 0.4,
      op: depth === 0 ? 0.45 + Math.random() * 0.40 :
          depth === 1 ? 0.25 + Math.random() * 0.35 :
                        0.10 + Math.random() * 0.20,
      depth,
      tx: null, ty: null,
      formOp: 0,
    });
  }

  // ── Constellation state ─────────────────────────────────────────────────────
  type ConstKey = 'gemini' | 'sagittarius' | 'capricornus';
  const CONST_ORDER: ConstKey[] = ['gemini', 'sagittarius', 'capricornus'];
  // Placement: each constellation in its own corner/area (canvas-relative fractions)
  const CONST_PLACEMENT: Record<ConstKey, { cx: number; cy: number; scale: number }> = {
    gemini:      { cx: 0.72, cy: 0.16, scale: isMobile ? 0.14 : 0.20 },
    sagittarius: { cx: 0.14, cy: 0.65, scale: isMobile ? 0.13 : 0.18 },
    capricornus: { cx: 0.82, cy: 0.70, scale: isMobile ? 0.12 : 0.16 },
  };

  interface ConstellationState {
    key: ConstKey;
    traceProgress: number; // 0-1 (0=not started, 1=fully drawn)
    opacity: number;       // final line+star opacity
    targetOpacity: number;
  }
  const constStates: ConstellationState[] = CONST_ORDER.map(key => ({
    key,
    traceProgress: 0,
    opacity: 0,
    targetOpacity: 0,
  }));

  // Ignition sequence timing
  let ignitionStarted = false;
  let ignitionT = 0;
  const TRACE_DUR = 2000;   // ms per constellation trace
  const TRACE_GAP = 600;    // ms between constellations
  const FADE_TO_PERSISTENT = 3000; // ms to fade to persistent

  // Build canvas-space star positions for a constellation
  function buildConstStarPositions(key: ConstKey): { x: number; y: number; r: number; op: number }[] {
    const data = CONSTELLATIONS[key];
    const pl   = CONST_PLACEMENT[key];
    const dim  = Math.min(W, H);
    const cenX = data.stars.reduce((s, st) => s + st.nx, 0) / data.stars.length;
    const cenY = data.stars.reduce((s, st) => s + st.ny, 0) / data.stars.length;
    return data.stars.map(st => ({
      x:  pl.cx * W + (st.nx - cenX) * pl.scale * dim,
      y:  pl.cy * H + (st.ny - cenY) * pl.scale * dim,
      r:  st.r  * (isMobile ? 0.65 : 1),
      op: st.op,
    }));
  }

  // ── Glyph formation state ───────────────────────────────────────────────────
  type FormPhase = 'idle' | 'gathering' | 'holding' | 'dissolving';
  let formPhase: FormPhase = 'idle';
  let formT = 0;
  let currentGlyphIdx = -1;
  let lastGlyphIdx = -1;
  const GATHER_DUR  = 2800;
  const HOLD_DUR    = 4200;
  const DISSOLVE_DUR= 2000;
  const IDLE_DUR    = 1400; // gap between cycles

  function pickNextGlyph(): number {
    const len = GLYPHS.length;
    let idx = Math.floor(Math.random() * len);
    if (idx === lastGlyphIdx) idx = (idx + 1) % len;
    return idx;
  }

  function assignGlyphTargets(glyphIdx: number) {
    const gen = GLYPHS[glyphIdx];
    const rawPts = gen(FORM_COUNT);
    const scale = GLYPH_SCALE();
    const cx = GLYPH_CX();
    const cy = GLYPH_CY();
    // Assign first FORM_COUNT particles as formation members
    for (let i = 0; i < FORM_COUNT; i++) {
      const [px, py] = rawPts[i] ?? [0, 0];
      particles[i].tx = cx + px * scale;
      particles[i].ty = cy + py * scale;
    }
  }

  function clearTargets() {
    for (let i = 0; i < FORM_COUNT; i++) {
      particles[i].tx = null;
      particles[i].ty = null;
    }
  }

  // ── Meteors ─────────────────────────────────────────────────────────────────
  interface Meteor { x: number; y: number; vx: number; vy: number; life: number; trail: number }
  const meteors: Meteor[] = [];
  let lastMeteor = 0;
  const METEOR_INTERVAL = 18000 + Math.random() * 12000;

  function spawnMeteor() {
    const startX = Math.random() * W * 0.7;
    const startY = -10;
    const a = 0.85 + Math.random() * 0.4;
    meteors.push({ x: startX, y: startY, vx: 7 * Math.cos(a), vy: 7 * Math.sin(a), life: 1, trail: 80 + Math.random() * 40 });
  }

  // ── Resize ──────────────────────────────────────────────────────────────────
  function resize() {
    const dpr = window.devicePixelRatio || 1;
    W = canvas.clientWidth;
    H = canvas.clientHeight;
    canvas.width  = Math.round(W * dpr);
    canvas.height = Math.round(H * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  // ── Draw helpers ─────────────────────────────────────────────────────────────
  function drawConstellation(key: ConstKey, state: ConstellationState) {
    const data = CONSTELLATIONS[key];
    const starPos = buildConstStarPositions(key);
    const op = state.opacity;
    if (op < 0.005) return;

    // Lines — draw only up to traceProgress fraction
    const totalLines = data.lines.length;
    const linesToDraw = Math.floor(state.traceProgress * totalLines);
    const partial = (state.traceProgress * totalLines) - linesToDraw;

    ctx.strokeStyle = `rgba(200,218,255,${(op * 0.32).toFixed(3)})`;
    ctx.lineWidth = isMobile ? 0.5 : 0.8;
    ctx.beginPath();
    for (let li = 0; li < linesToDraw; li++) {
      const [ai, bi] = data.lines[li];
      const a = starPos[ai], b = starPos[bi];
      if (!a || !b) continue;
      ctx.moveTo(a.x, a.y);
      ctx.lineTo(b.x, b.y);
    }
    // Partial last line
    if (linesToDraw < totalLines && partial > 0) {
      const [ai, bi] = data.lines[linesToDraw];
      const a = starPos[ai], b = starPos[bi];
      if (a && b) {
        ctx.moveTo(a.x, a.y);
        ctx.lineTo(a.x + (b.x - a.x) * partial, a.y + (b.y - a.y) * partial);
      }
    }
    ctx.stroke();

    // Stars (ignite as trace reaches them)
    const visibleStarsFraction = state.traceProgress;
    for (let i = 0; i < starPos.length; i++) {
      const s = starPos[i];
      const starFrac = i / Math.max(1, starPos.length - 1);
      if (starFrac > visibleStarsFraction + 0.05) continue;
      const igniteBoost = starFrac > visibleStarsFraction - 0.12 ? 1.6 : 1;
      const sOp = Math.min(0.95, s.op * op * igniteBoost);
      // Glow
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.r * 3.5, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(215,232,255,${(sOp * 0.12).toFixed(3)})`;
      ctx.fill();
      // Core
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(215,232,255,${sOp.toFixed(3)})`;
      ctx.fill();
    }
  }

  function drawParticle(p: Particle, formProgress: number) {
    const x = p.bx * W + p.ox;
    const y = p.by * H + p.oy;
    let op = p.op;
    let r  = p.r;

    if (p.tx !== null && formProgress > 0) {
      // Boost opacity/size for formation particles
      op = p.op + (1 - p.op) * 0.6 * formProgress;
      r  = p.r + 0.8 * formProgress;
    }

    // Glow halo
    ctx.beginPath();
    ctx.arc(x, y, r * 3.2, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(203,243,110,${(op * 0.08).toFixed(3)})`;
    ctx.fill();
    // Core
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    const [cr, cg, cb] = p.depth === 0 ? [220, 240, 200] : p.depth === 1 ? [200, 220, 200] : [180, 200, 200];
    ctx.fillStyle = `rgba(${cr},${cg},${cb},${op.toFixed(3)})`;
    ctx.fill();
  }

  // ── Physics ──────────────────────────────────────────────────────────────────
  const DRIFT_SPEEDS = [0.00018, 0.00011, 0.00006]; // near, mid, far
  const SPRING = 0.055;
  const FRICTION = 0.82;
  const BROWNIE = 0.00014;

  function stepParticles(formProgress: number) {
    for (let i = 0; i < particles.length; i++) {
      const p = particles[i];
      const hasTarget = p.tx !== null && i < FORM_COUNT;

      if (hasTarget && formProgress > 0) {
        // Spring toward canvas target — convert target to normalized
        const targetBx = p.tx! / W;
        const targetBy = p.ty! / H;
        const totalX   = p.bx + p.ox / W;
        const totalY   = p.by + p.oy / H;
        const dx = targetBx - totalX;
        const dy = targetBy - totalY;
        p.vx += dx * SPRING * formProgress;
        p.vy += dy * SPRING * formProgress;
      } else {
        // Drift — gentle directional + brownian
        const dspeed = DRIFT_SPEEDS[p.depth];
        p.vx += (Math.random() - 0.5) * BROWNIE;
        p.vy += (Math.random() - 0.5) * BROWNIE * 0.5;
        // Depth-based slow drift direction
        p.vx += (p.depth === 0 ? 0.000025 : p.depth === 1 ? -0.000015 : 0.000008);
        p.vy += dspeed * 0.1 * (Math.sin(p.bx * 6) * 0.5);
      }

      p.vx *= FRICTION;
      p.vy *= FRICTION;
      p.ox += p.vx * W;
      p.oy += p.vy * H;

      // Wrap base position (not offset) so particles tile
      p.bx = ((p.bx + p.vx * 0.4) + 1) % 1;
      p.by = ((p.by + p.vy * 0.2) + 1) % 1;
      if (Math.abs(p.ox) > W * 0.3) p.ox *= 0.7;
      if (Math.abs(p.oy) > H * 0.3) p.oy *= 0.7;
    }
  }

  // ── RAF loop ─────────────────────────────────────────────────────────────────
  let rafId: number = 0;
  let lastT = 0;
  let running = false;
  let inView  = false;

  function tick(now: number) {
    if (!running) return;
    rafId = requestAnimationFrame(tick);

    const dt = lastT > 0 ? Math.min(now - lastT, 50) : 16;
    lastT = now;

    ctx.clearRect(0, 0, W, H);

    // ── Constellation ignition ──────────────────────────────────────────────
    if (!ignitionStarted) { ignitionStarted = true; ignitionT = now; }
    const igt = now - ignitionT;

    for (let ci = 0; ci < constStates.length; ci++) {
      const cs = constStates[ci];
      const startT  = ci * (TRACE_DUR + TRACE_GAP);
      const allDone = (CONST_ORDER.length - 1) * (TRACE_DUR + TRACE_GAP) + TRACE_DUR;

      if (igt < startT) {
        cs.traceProgress = 0;
        cs.targetOpacity = 0;
      } else if (igt < startT + TRACE_DUR) {
        cs.traceProgress = (igt - startT) / TRACE_DUR;
        cs.targetOpacity = 0.88;
      } else if (igt < allDone + FADE_TO_PERSISTENT) {
        cs.traceProgress = 1;
        const fadeFrac = (igt - allDone) / FADE_TO_PERSISTENT;
        cs.targetOpacity = Math.max(0.30, 0.88 - fadeFrac * 0.58);
      } else {
        cs.traceProgress = 1;
        cs.targetOpacity = 0.30;
      }
      cs.opacity += (cs.targetOpacity - cs.opacity) * 0.04;
    }

    // ── Glyph formation state machine ───────────────────────────────────────
    let formProgress = 0;

    if (reduced) {
      // Static: show first glyph formed
      if (currentGlyphIdx < 0) {
        currentGlyphIdx = 0;
        assignGlyphTargets(0);
      }
      formProgress = 1;
    } else {
      formT += dt;
      if (formPhase === 'idle') {
        if (formT > IDLE_DUR) {
          formT = 0;
          formPhase = 'gathering';
          lastGlyphIdx = currentGlyphIdx;
          currentGlyphIdx = pickNextGlyph();
          assignGlyphTargets(currentGlyphIdx);
        }
      } else if (formPhase === 'gathering') {
        formProgress = Math.min(formT / GATHER_DUR, 1);
        if (formT > GATHER_DUR) { formT = 0; formPhase = 'holding'; }
      } else if (formPhase === 'holding') {
        formProgress = 1;
        if (formT > HOLD_DUR) { formT = 0; formPhase = 'dissolving'; }
      } else if (formPhase === 'dissolving') {
        formProgress = Math.max(1 - formT / DISSOLVE_DUR, 0);
        if (formT > DISSOLVE_DUR) { formT = 0; formPhase = 'idle'; clearTargets(); }
      }
    }

    // ── Physics step ────────────────────────────────────────────────────────
    stepParticles(formProgress);

    // ── Draw particles ──────────────────────────────────────────────────────
    // Far depth first (back to front)
    for (let d = 2; d >= 0; d--) {
      for (const p of particles) {
        if (p.depth !== d) continue;
        drawParticle(p, formProgress);
      }
    }

    // ── Draw constellations ─────────────────────────────────────────────────
    for (const cs of constStates) {
      drawConstellation(cs.key, cs);
    }

    // ── Meteors ─────────────────────────────────────────────────────────────
    if (!isMobile && now - lastMeteor > METEOR_INTERVAL) {
      lastMeteor = now;
      spawnMeteor();
    }
    for (let i = meteors.length - 1; i >= 0; i--) {
      const m = meteors[i];
      m.x += m.vx; m.y += m.vy; m.life -= 0.016;
      if (m.life <= 0 || m.y > H + 20) { meteors.splice(i, 1); continue; }
      const mag = Math.sqrt(m.vx * m.vx + m.vy * m.vy) || 1;
      const tx  = m.x - (m.vx / mag) * m.trail;
      const ty  = m.y - (m.vy / mag) * m.trail;
      const g   = ctx.createLinearGradient(tx, ty, m.x, m.y);
      g.addColorStop(0, 'rgba(200,240,180,0)');
      g.addColorStop(1, `rgba(200,240,180,${Math.min(m.life * 0.6, 0.45).toFixed(2)})`);
      ctx.beginPath(); ctx.moveTo(tx, ty); ctx.lineTo(m.x, m.y);
      ctx.strokeStyle = g; ctx.lineWidth = 1.2; ctx.stroke();
    }
  }

  function start() {
    if (running || !inView || document.hidden) return;
    running = true;
    rafId = requestAnimationFrame(tick);
  }
  function stop() {
    running = false;
    if (rafId) { cancelAnimationFrame(rafId); rafId = 0; }
  }

  resize();

  if (reduced) {
    // One static frame
    tick(0);
    stop();
    const ro = new ResizeObserver(() => { resize(); });
    ro.observe(canvas);
    return () => ro.disconnect();
  }

  const io = new IntersectionObserver(([e]) => {
    inView = e.isIntersecting;
    inView ? start() : stop();
  }, { threshold: 0 });
  io.observe(canvas);

  const onVis = () => { document.hidden ? stop() : (inView && start()); };
  document.addEventListener('visibilitychange', onVis);

  const onResize = () => resize();
  window.addEventListener('resize', onResize, { passive: true });

  return () => {
    stop();
    io.disconnect();
    document.removeEventListener('visibilitychange', onVis);
    window.removeEventListener('resize', onResize);
  };
}

// ─── Component ────────────────────────────────────────────────────────────────
export default function ParticleHero() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    let dispose: (() => void) | null = null;

    const load = () => {
      dispose = runCanvas(canvas, reduced);
    };

    // Post-LCP: defer to idle so canvas never blocks the initial paint
    if (typeof window.requestIdleCallback === 'function') {
      const id = window.requestIdleCallback(load, { timeout: 2000 });
      return () => {
        window.cancelIdleCallback(id);
        dispose?.();
      };
    } else {
      const id = setTimeout(load, 400);
      return () => {
        clearTimeout(id);
        dispose?.();
      };
    }
  }, []);

  return (
    <section
      id="mesa-hero"
      style={{ position: 'relative', minHeight: '100vh', display: 'flex', alignItems: 'center', overflow: 'hidden', background: '#060914' }}
    >
      {/* Canvas — fills the section, handled by runCanvas */}
      <canvas
        ref={canvasRef}
        aria-hidden="true"
        style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', display: 'block' }}
      />

      {/* Overlay: drifting topographic lines (lower third) — CSS only, transform/opacity */}
      {!window.matchMedia('(prefers-reduced-motion: reduce)').matches && (
        <div className="ph-topo-layer" aria-hidden="true">
          <svg className="ph-topo-svg ph-topo-a" viewBox="0 0 1400 300" preserveAspectRatio="none">
            <path d="M-100,180 C200,140 400,200 700,155 C900,120 1100,175 1500,145" stroke="rgba(203,243,110,0.08)" strokeWidth="1.2" fill="none"/>
            <path d="M-100,210 C250,175 450,225 750,185 C950,155 1150,205 1500,175" stroke="rgba(203,243,110,0.05)" strokeWidth="0.8" fill="none"/>
            <path d="M-100,240 C300,200 500,250 800,210 C1000,180 1200,235 1500,210" stroke="rgba(203,243,110,0.06)" strokeWidth="1.0" fill="none"/>
            <path d="M-100,160 C150,125 380,185 680,145 C870,115 1080,165 1500,130" stroke="rgba(203,243,110,0.04)" strokeWidth="0.6" fill="none"/>
          </svg>
          <svg className="ph-topo-svg ph-topo-b" viewBox="0 0 1400 300" preserveAspectRatio="none">
            <path d="M-100,190 C220,155 420,210 720,165 C920,130 1120,180 1500,155" stroke="rgba(203,243,110,0.07)" strokeWidth="1.0" fill="none"/>
            <path d="M-100,225 C280,190 480,240 780,195 C980,165 1180,215 1500,185" stroke="rgba(203,243,110,0.04)" strokeWidth="0.7" fill="none"/>
          </svg>
        </div>
      )}

      {/* Overlay: horizontal scan sweep — CSS animation */}
      <div className="ph-scan-line" aria-hidden="true" />

      {/* Overlay: faint rotating compass ring — behind logo text */}
      <div className="ph-compass-ring" aria-hidden="true">
        <svg viewBox="0 0 200 200" fill="none">
          <circle cx="100" cy="100" r="90" stroke="rgba(203,243,110,0.08)" strokeWidth="0.8" strokeDasharray="4 8"/>
          <circle cx="100" cy="100" r="72" stroke="rgba(203,243,110,0.05)" strokeWidth="0.5" strokeDasharray="2 10"/>
          {/* Cardinal tick marks */}
          {[0, 90, 180, 270].map(deg => {
            const rad = (deg * Math.PI) / 180;
            const x1 = 100 + Math.sin(rad) * 82, y1 = 100 - Math.cos(rad) * 82;
            const x2 = 100 + Math.sin(rad) * 92, y2 = 100 - Math.cos(rad) * 92;
            return <line key={deg} x1={x1} y1={y1} x2={x2} y2={y2} stroke="rgba(203,243,110,0.14)" strokeWidth="1"/>;
          })}
          {/* Intercardinal ticks */}
          {[45, 135, 225, 315].map(deg => {
            const rad = (deg * Math.PI) / 180;
            const x1 = 100 + Math.sin(rad) * 86, y1 = 100 - Math.cos(rad) * 86;
            const x2 = 100 + Math.sin(rad) * 92, y2 = 100 - Math.cos(rad) * 92;
            return <line key={deg} x1={x1} y1={y1} x2={x2} y2={y2} stroke="rgba(203,243,110,0.08)" strokeWidth="0.7"/>;
          })}
        </svg>
      </div>

      {/* Text protection gradient */}
      <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse 70% 60% at 50% 48%, rgba(6,9,20,0.72) 0%, rgba(6,9,20,0.20) 70%, transparent 100%)', zIndex: 2, pointerEvents: 'none' }} />

      {/* Bottom fade */}
      <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 140, background: 'linear-gradient(to top, #070b14, transparent)', zIndex: 2, pointerEvents: 'none' }} />

      {/* Hero content */}
      <div className="container" style={{ paddingTop: 110, paddingBottom: 90, textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', position: 'relative', zIndex: 3 }}>
        {/* Logo */}
        <picture>
          <source srcSet="/assets/images/content/Logo/me-logo.webp" type="image/webp" />
          <img
            src="/assets/images/content/Logo/ME Logo Draft 5.png"
            alt="Modern Explorer"
            fetchPriority="high"
            width={700}
            height={467}
            style={{ width: 'clamp(260px, 40vw, 580px)', height: 'auto', display: 'block', marginBottom: 18, filter: 'drop-shadow(0 0 60px rgba(203,243,110,0.22)) drop-shadow(0 8px 28px rgba(0,0,0,0.7))' }}
          />
        </picture>

        {/* Mission tagline */}
        <p style={{ fontFamily: 'var(--font-heading)', fontSize: 'clamp(11px, 1.5vw, 18px)', fontWeight: 600, color: 'rgba(203,243,110,0.85)', letterSpacing: '0.24em', textTransform: 'uppercase', marginBottom: 10, textShadow: '0 0 20px rgba(203,243,110,0.35), 0 2px 10px rgba(0,0,0,0.9)' }}>
          Reigniting the Age of Discovery
        </p>

        {/* Primary headline — mission framing */}
        <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: 'clamp(16px, 2.4vw, 28px)', fontWeight: 500, color: '#c8ddb8', letterSpacing: '0.07em', textTransform: 'uppercase', marginBottom: 14, textShadow: '0 2px 16px rgba(0,0,0,0.85)', maxWidth: 680, lineHeight: 1.3 }}>
          Investigating Unknown Phenomena —<br />Cryptozoology, UAP &amp; Lost History
        </h1>

        {/* Location */}
        <p style={{ fontFamily: 'var(--font-alt)', fontSize: 'clamp(11px, 1.3vw, 15px)', fontWeight: 500, color: 'rgba(240,244,255,0.55)', letterSpacing: '0.18em', textTransform: 'uppercase', marginBottom: 46 }}>
          Colorado · Crestone · San Luis Valley · Near Great Sand Dunes
        </p>

        {/* Dual CTA */}
        <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap', justifyContent: 'center' }}>
          <Link to="/membership" className="btn btn-primary" style={{ fontSize: 15, padding: '15px 32px' }}>
            Join the Research
          </Link>
          <button onClick={() => document.getElementById('mesa-tours')?.scrollIntoView({ behavior: 'smooth' })} className="btn btn-ghost" style={{ fontSize: 15, padding: '15px 32px' }}>
            Explore With Us ↓
          </button>
        </div>
      </div>
    </section>
  );
}
