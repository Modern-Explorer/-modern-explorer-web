import { useEffect, useRef } from 'react';
import { useWaitlist } from '../context/WaitlistContext';

// ─── Original constellation data ──────────────────────────────────────────────
type ConstKey = 'gemini' | 'sagittarius' | 'capricornus';
const CONSTELLATIONS: Record<ConstKey, {
  stars: { nx: number; ny: number; r: number; op: number }[];
  lines: [number, number][];
}> = {
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

// ─── Side symbol definitions ──────────────────────────────────────────────────
interface SymbolDef {
  stars: { nx: number; ny: number; r: number; op: number }[];
  lines: [number, number][];
}

function symPentagram(): SymbolDef {
  const stars: SymbolDef['stars'] = [];
  const R = 0.44;
  for (let i = 0; i < 5; i++) {
    const a = (i / 5) * Math.PI * 2 - Math.PI / 2;
    stars.push({ nx: 0.5 + R * Math.cos(a), ny: 0.5 + R * Math.sin(a), r: 2.2, op: 0.92 });
  }
  return { stars, lines: [[0,2],[2,4],[4,1],[1,3],[3,0]] };
}
function symHexagram(): SymbolDef {
  const stars: SymbolDef['stars'] = [];
  const R = 0.44, r = 0.22;
  for (let i = 0; i < 6; i++) {
    const a = (i / 6) * Math.PI * 2 - Math.PI / 6;
    stars.push({ nx: 0.5 + R * Math.cos(a), ny: 0.5 + R * Math.sin(a), r: 2.0, op: 0.90 });
  }
  for (let i = 0; i < 6; i++) {
    const a = (i / 6) * Math.PI * 2 + Math.PI / 6;
    stars.push({ nx: 0.5 + r * Math.cos(a), ny: 0.5 + r * Math.sin(a), r: 1.2, op: 0.68 });
  }
  stars.push({ nx: 0.5, ny: 0.5, r: 1.6, op: 0.78 });
  return { stars, lines: [[0,2],[2,4],[4,0],[1,3],[3,5],[5,1]] };
}
function symMetatron(): SymbolDef {
  const stars: SymbolDef['stars'] = [];
  const lines: [number, number][] = [];
  stars.push({ nx: 0.5, ny: 0.5, r: 2.0, op: 0.90 });
  const R1 = 0.24, R2 = 0.46;
  for (let i = 0; i < 6; i++) {
    const a = (i / 6) * Math.PI * 2;
    stars.push({ nx: 0.5 + R1 * Math.cos(a), ny: 0.5 + R1 * Math.sin(a), r: 1.6, op: 0.82 });
  }
  for (let i = 0; i < 6; i++) {
    const a = (i / 6) * Math.PI * 2;
    stars.push({ nx: 0.5 + R2 * Math.cos(a), ny: 0.5 + R2 * Math.sin(a), r: 1.4, op: 0.75 });
  }
  for (let i = 1; i <= 12; i++) lines.push([0, i]);
  for (let i = 1; i <= 6; i++) lines.push([i, i < 6 ? i + 1 : 1]);
  for (let i = 7; i <= 12; i++) lines.push([i, i < 12 ? i + 1 : 7]);
  for (let i = 1; i <= 6; i++) { lines.push([i, i + 6]); lines.push([i, i < 6 ? i + 7 : 7]); }
  return { stars, lines };
}
function symVesica(): SymbolDef {
  const stars: SymbolDef['stars'] = [
    { nx: 0.30, ny: 0.50, r: 1.8, op: 0.85 }, { nx: 0.70, ny: 0.50, r: 1.8, op: 0.85 },
    { nx: 0.50, ny: 0.12, r: 2.0, op: 0.92 }, { nx: 0.50, ny: 0.88, r: 2.0, op: 0.92 },
    { nx: 0.06, ny: 0.50, r: 1.4, op: 0.76 }, { nx: 0.94, ny: 0.50, r: 1.4, op: 0.76 },
    { nx: 0.12, ny: 0.26, r: 1.1, op: 0.68 }, { nx: 0.12, ny: 0.74, r: 1.1, op: 0.68 },
    { nx: 0.88, ny: 0.26, r: 1.1, op: 0.68 }, { nx: 0.88, ny: 0.74, r: 1.1, op: 0.68 },
  ];
  return { stars, lines: [[2,4],[4,3],[3,5],[5,2],[2,3],[0,2],[0,3],[0,4],[0,6],[0,7],[1,2],[1,3],[1,5],[1,8],[1,9],[6,2],[7,3],[8,2],[9,3],[6,4],[7,4],[8,5],[9,5]] };
}
function symAnkh(): SymbolDef {
  const stars: SymbolDef['stars'] = [];
  const lines: [number, number][] = [];
  const cR = 0.22, cCX = 0.5, cCY = 0.28;
  for (let i = 0; i < 8; i++) {
    const a = (i / 8) * Math.PI * 2;
    stars.push({ nx: cCX + cR * Math.cos(a), ny: cCY + cR * Math.sin(a), r: 1.4, op: 0.80 });
  }
  stars.push({ nx: 0.50, ny: 0.52, r: 1.8, op: 0.88 });
  stars.push({ nx: 0.50, ny: 0.94, r: 1.6, op: 0.82 });
  stars.push({ nx: 0.22, ny: 0.52, r: 1.6, op: 0.82 });
  stars.push({ nx: 0.78, ny: 0.52, r: 1.6, op: 0.82 });
  stars.push({ nx: 0.50, ny: cCY + cR + 0.02, r: 1.4, op: 0.78 });
  for (let i = 0; i < 8; i++) lines.push([i, (i + 1) % 8]);
  lines.push([4, 12], [12, 8], [8, 9], [10, 8], [8, 11]);
  return { stars, lines };
}
function symOuroboros(): SymbolDef {
  const stars: SymbolDef['stars'] = [];
  const lines: [number, number][] = [];
  const N = 12, R = 0.43;
  for (let i = 0; i < N; i++) {
    const a = (i / N) * Math.PI * 2 - Math.PI / 2;
    const isTip = i === 0 || i === 1;
    stars.push({ nx: 0.5 + R * Math.cos(a), ny: 0.5 + R * Math.sin(a), r: isTip ? 2.2 : 1.4, op: isTip ? 0.94 : 0.76 });
  }
  for (let i = 0; i < N; i++) lines.push([i, (i + 1) % N]);
  stars.push({ nx: 0.5 + (R - 0.07) * Math.cos(-Math.PI / 2 + 0.25), ny: 0.5 + (R - 0.07) * Math.sin(-Math.PI / 2 + 0.25), r: 1.0, op: 0.60 });
  stars.push({ nx: 0.5 + (R - 0.07) * Math.cos(-Math.PI / 2 - 0.25), ny: 0.5 + (R - 0.07) * Math.sin(-Math.PI / 2 - 0.25), r: 1.0, op: 0.60 });
  lines.push([0, N], [0, N + 1]);
  return { stars, lines };
}
function symTriskele(): SymbolDef {
  const stars: SymbolDef['stars'] = [];
  const lines: [number, number][] = [];
  stars.push({ nx: 0.5, ny: 0.5, r: 2.0, op: 0.90 });
  for (let arm = 0; arm < 3; arm++) {
    const base = (arm / 3) * Math.PI * 2 - Math.PI / 2;
    for (let p = 1; p <= 5; p++) {
      const t = p / 5;
      const a = base + t * Math.PI * 0.8;
      stars.push({ nx: 0.5 + (0.08 + t * 0.38) * Math.cos(a), ny: 0.5 + (0.08 + t * 0.38) * Math.sin(a), r: 1.0 + t * 0.6, op: 0.62 + t * 0.26 });
    }
    const s = 1 + arm * 5;
    lines.push([0, s]);
    for (let p = 0; p < 4; p++) lines.push([s + p, s + p + 1]);
  }
  return { stars, lines };
}
function symEyeOfHorus(): SymbolDef {
  const stars: SymbolDef['stars'] = [
    { nx: 0.10, ny: 0.44, r: 2.0, op: 0.90 }, { nx: 0.90, ny: 0.44, r: 2.0, op: 0.90 },
    { nx: 0.50, ny: 0.24, r: 1.5, op: 0.78 }, { nx: 0.50, ny: 0.60, r: 1.5, op: 0.78 },
    { nx: 0.50, ny: 0.44, r: 2.2, op: 0.95 },
    { nx: 0.40, ny: 0.36, r: 1.2, op: 0.70 }, { nx: 0.60, ny: 0.36, r: 1.2, op: 0.70 },
    { nx: 0.60, ny: 0.52, r: 1.2, op: 0.70 }, { nx: 0.40, ny: 0.52, r: 1.2, op: 0.70 },
    { nx: 0.78, ny: 0.70, r: 1.5, op: 0.78 }, { nx: 0.66, ny: 0.84, r: 1.3, op: 0.72 },
    { nx: 0.52, ny: 0.90, r: 1.2, op: 0.66 },
    { nx: 0.24, ny: 0.18, r: 1.2, op: 0.68 }, { nx: 0.76, ny: 0.18, r: 1.2, op: 0.68 },
  ];
  return { stars, lines: [[0,2],[2,1],[1,3],[3,0],[5,6],[6,7],[7,8],[8,5],[4,5],[4,6],[4,7],[4,8],[1,9],[9,10],[10,11],[12,13],[12,0],[13,1]] };
}
function symUAPTriangle(): SymbolDef {
  const stars: SymbolDef['stars'] = [];
  const R = 0.44;
  for (let i = 0; i < 3; i++) {
    const a = (i / 3) * Math.PI * 2 - Math.PI / 2;
    stars.push({ nx: 0.5 + R * Math.cos(a), ny: 0.5 + R * Math.sin(a), r: 2.4, op: 0.95 });
  }
  stars.push({ nx: 0.5, ny: 0.5, r: 1.8, op: 0.85 });
  for (let i = 0; i < 3; i++) {
    const a0 = (i / 3) * Math.PI * 2 - Math.PI / 2;
    const a1 = ((i + 1) / 3) * Math.PI * 2 - Math.PI / 2;
    stars.push({ nx: 0.5 + R * 0.5 * (Math.cos(a0) + Math.cos(a1)), ny: 0.5 + R * 0.5 * (Math.sin(a0) + Math.sin(a1)), r: 1.2, op: 0.66 });
  }
  return { stars, lines: [[0,1],[1,2],[2,0],[0,3],[1,3],[2,3]] };
}
function symTicTac(): SymbolDef {
  const stars: SymbolDef['stars'] = [];
  const lines: [number, number][] = [];
  const N = 10, RX = 0.46, RY = 0.22;
  for (let i = 0; i < N; i++) {
    const a = (i / N) * Math.PI * 2;
    const tip = i === 0 || i === N / 2;
    stars.push({ nx: 0.5 + RX * Math.cos(a), ny: 0.5 + RY * Math.sin(a), r: tip ? 2.0 : 1.3, op: tip ? 0.90 : 0.72 });
  }
  for (let i = 0; i < N; i++) lines.push([i, (i + 1) % N]);
  lines.push([0, 5]);
  return { stars, lines };
}
function symBoomerang(): SymbolDef {
  const stars: SymbolDef['stars'] = [
    { nx: 0.08, ny: 0.30, r: 2.2, op: 0.92 }, { nx: 0.22, ny: 0.42, r: 1.4, op: 0.76 },
    { nx: 0.36, ny: 0.52, r: 1.4, op: 0.76 }, { nx: 0.50, ny: 0.60, r: 2.0, op: 0.90 },
    { nx: 0.64, ny: 0.52, r: 1.4, op: 0.76 }, { nx: 0.78, ny: 0.42, r: 1.4, op: 0.76 },
    { nx: 0.92, ny: 0.30, r: 2.2, op: 0.92 },
    { nx: 0.18, ny: 0.58, r: 1.0, op: 0.62 }, { nx: 0.36, ny: 0.66, r: 1.0, op: 0.62 },
    { nx: 0.50, ny: 0.72, r: 1.2, op: 0.68 }, { nx: 0.64, ny: 0.66, r: 1.0, op: 0.62 },
    { nx: 0.82, ny: 0.58, r: 1.0, op: 0.62 }, { nx: 0.50, ny: 0.46, r: 1.8, op: 0.85 },
  ];
  return { stars, lines: [[0,1],[1,2],[2,3],[3,4],[4,5],[5,6],[0,7],[7,8],[8,9],[9,10],[10,11],[11,6],[0,3],[3,6],[2,12],[4,12],[3,12]] };
}
function symNazcaBird(): SymbolDef {
  const stars: SymbolDef['stars'] = [
    { nx: 0.08, ny: 0.42, r: 1.6, op: 0.82 }, { nx: 0.22, ny: 0.44, r: 1.4, op: 0.76 },
    { nx: 0.30, ny: 0.36, r: 2.0, op: 0.90 }, { nx: 0.30, ny: 0.52, r: 1.6, op: 0.80 },
    { nx: 0.50, ny: 0.45, r: 2.2, op: 0.92 }, { nx: 0.70, ny: 0.50, r: 1.8, op: 0.86 },
    { nx: 0.88, ny: 0.36, r: 1.4, op: 0.76 }, { nx: 0.88, ny: 0.62, r: 1.4, op: 0.76 },
    { nx: 0.92, ny: 0.50, r: 1.6, op: 0.80 }, { nx: 0.42, ny: 0.20, r: 1.8, op: 0.86 },
    { nx: 0.58, ny: 0.14, r: 1.4, op: 0.76 }, { nx: 0.42, ny: 0.72, r: 1.4, op: 0.76 },
    { nx: 0.26, ny: 0.40, r: 1.2, op: 0.72 },
  ];
  return { stars, lines: [[0,1],[1,2],[1,3],[2,12],[2,4],[3,4],[4,9],[9,10],[4,11],[4,5],[5,6],[5,7],[5,8],[6,8],[7,8]] };
}
function symBigfootPrint(): SymbolDef {
  const stars: SymbolDef['stars'] = [
    { nx: 0.50, ny: 0.14, r: 1.4, op: 0.78 }, { nx: 0.68, ny: 0.22, r: 1.4, op: 0.78 },
    { nx: 0.76, ny: 0.40, r: 1.4, op: 0.78 }, { nx: 0.72, ny: 0.60, r: 1.4, op: 0.78 },
    { nx: 0.60, ny: 0.76, r: 1.4, op: 0.78 }, { nx: 0.40, ny: 0.76, r: 1.4, op: 0.78 },
    { nx: 0.28, ny: 0.60, r: 1.4, op: 0.78 }, { nx: 0.24, ny: 0.40, r: 1.4, op: 0.78 },
    { nx: 0.32, ny: 0.22, r: 1.4, op: 0.78 },
    { nx: 0.25, ny: 0.06, r: 1.8, op: 0.86 }, { nx: 0.37, ny: 0.00, r: 1.8, op: 0.86 },
    { nx: 0.50, ny: -0.02, r: 1.8, op: 0.86 }, { nx: 0.63, ny: 0.00, r: 1.8, op: 0.86 },
    { nx: 0.75, ny: 0.06, r: 1.8, op: 0.86 },
  ];
  return { stars, lines: [[0,1],[1,2],[2,3],[3,4],[4,5],[5,6],[6,7],[7,8],[8,0],[9,10],[10,11],[11,12],[12,13],[8,9],[0,10],[0,11],[1,12],[1,13]] };
}
function symCairn(): SymbolDef {
  const stars: SymbolDef['stars'] = [
    { nx: 0.25, ny: 0.90, r: 1.5, op: 0.80 }, { nx: 0.50, ny: 0.90, r: 1.5, op: 0.80 },
    { nx: 0.75, ny: 0.90, r: 1.5, op: 0.80 }, { nx: 0.30, ny: 0.68, r: 1.5, op: 0.80 },
    { nx: 0.50, ny: 0.68, r: 1.5, op: 0.80 }, { nx: 0.70, ny: 0.68, r: 1.5, op: 0.80 },
    { nx: 0.36, ny: 0.47, r: 1.5, op: 0.80 }, { nx: 0.50, ny: 0.47, r: 1.5, op: 0.80 },
    { nx: 0.64, ny: 0.47, r: 1.5, op: 0.80 }, { nx: 0.42, ny: 0.28, r: 1.6, op: 0.82 },
    { nx: 0.58, ny: 0.28, r: 1.6, op: 0.82 }, { nx: 0.50, ny: 0.10, r: 1.8, op: 0.88 },
  ];
  return { stars, lines: [[0,1],[1,2],[3,4],[4,5],[6,7],[7,8],[9,10],[1,4],[4,7],[7,9],[9,10],[10,7],[7,11],[9,11],[10,11]] };
}

const SIDE_SYMBOLS: SymbolDef[] = [
  symPentagram(), symHexagram(), symMetatron(), symVesica(), symAnkh(),
  symOuroboros(), symTriskele(), symEyeOfHorus(), symUAPTriangle(), symTicTac(),
  symBoomerang(), symNazcaBird(), symBigfootPrint(), symCairn(),
];

// ─── Glyph generators (center formation) ─────────────────────────────────────
function glyphCompassRose(n: number): [number, number][] {
  const pts: [number, number][] = [];
  for (const d of [0, 0.5, 1, 1.5]) {
    const a = d * Math.PI;
    for (let t = 0.1; t <= 1; t += 0.18) pts.push([Math.sin(a) * t, -Math.cos(a) * t]);
    pts.push([Math.sin(a + 0.3) * 0.55, -Math.cos(a + 0.3) * 0.55]);
    pts.push([Math.sin(a - 0.3) * 0.55, -Math.cos(a - 0.3) * 0.55]);
  }
  for (const d of [0.25, 0.75, 1.25, 1.75]) {
    const a = d * Math.PI;
    for (let t = 0.15; t <= 0.65; t += 0.20) pts.push([Math.sin(a) * t, -Math.cos(a) * t]);
  }
  for (let i = 0; i < 12; i++) { const a = (i / 12) * Math.PI * 2; pts.push([Math.sin(a) * 0.22, Math.cos(a) * 0.22]); }
  pts.push([0, 0]);
  return pts.slice(0, n);
}
function glyphCairn(n: number): [number, number][] {
  const pts: [number, number][] = [];
  for (const s of [{ y: 0.78, rx: 0.78, ry: 0.14, count: 22 }, { y: 0.48, rx: 0.60, ry: 0.13, count: 18 }, { y: 0.22, rx: 0.44, ry: 0.12, count: 14 }, { y: 0.00, rx: 0.30, ry: 0.11, count: 10 }, { y: -0.20, rx: 0.18, ry: 0.09, count: 7 }]) {
    for (let i = 0; i < s.count; i++) { const a = (i / s.count) * Math.PI * 2; pts.push([Math.cos(a) * s.rx, s.y + Math.sin(a) * s.ry]); }
    pts.push([0, s.y], [s.rx * 0.45, s.y + s.ry * 0.4], [-s.rx * 0.45, s.y - s.ry * 0.4]);
  }
  return pts.slice(0, n);
}
function glyphFootprint(n: number): [number, number][] {
  const pts: [number, number][] = [];
  const pc = Math.round(n * 0.65);
  for (let i = 0; i < pc; i++) { const a = (i / pc) * Math.PI * 2; pts.push([Math.cos(a) * 0.44, Math.sin(a) * 0.82]); }
  for (let i = 0; i < 20; i++) { const a = (i / 20) * Math.PI * 2; pts.push([Math.cos(a) * 0.22, Math.sin(a) * 0.50]); }
  for (const [tx, ty] of [[-0.36, -0.90], [-0.18, -0.96], [0, -0.99], [0.18, -0.96], [0.36, -0.90]] as [number,number][]) {
    for (let i = 0; i < 6; i++) { const a = (i / 6) * Math.PI * 2; pts.push([tx + Math.cos(a) * 0.10, ty + Math.sin(a) * 0.08]); }
  }
  return pts.slice(0, n);
}
function glyphUAP(n: number): [number, number][] {
  const pts: [number, number][] = [];
  const bc = Math.round(n * 0.45);
  for (let i = 0; i < bc; i++) { const a = (i / bc) * Math.PI * 2; pts.push([Math.cos(a) * 0.95, Math.sin(a) * 0.22]); }
  for (let i = 0; i < 25; i++) { const a = (i / 25) * Math.PI * 2; pts.push([Math.cos(a) * 0.6, Math.sin(a) * 0.14]); }
  const dc = Math.round(n * 0.25);
  for (let i = 0; i < dc; i++) { const a = (i / dc) * Math.PI; pts.push([Math.cos(a) * 0.36, -0.18 - Math.sin(a) * 0.30]); }
  for (let i = 0; i < 16; i++) { const a = (i / 16) * Math.PI * 2; pts.push([Math.cos(a) * 1.02, Math.sin(a) * 0.24]); }
  for (let i = 0; i < 7; i++) pts.push([(i / 6 - 0.5) * 1.2, 0.28]);
  return pts.slice(0, n);
}
function glyphPetroglyph(n: number): [number, number][] {
  const pts: [number, number][] = [];
  for (let i = 0; i < 18; i++) { const a = (i / 18) * Math.PI * 2; pts.push([Math.cos(a) * 0.22, -0.68 + Math.sin(a) * 0.22]); }
  for (let t = 0; t <= 1; t += 0.1) pts.push([0, -0.44 + t * 0.72]);
  for (let t = 0; t <= 1; t += 0.1) pts.push([-t * 0.72, -0.18 - t * 0.12]);
  for (let t = 0; t <= 1; t += 0.1) pts.push([t * 0.72, -0.18 - t * 0.12]);
  for (let t = 0; t <= 1; t += 0.12) pts.push([-t * 0.44, 0.28 + t * 0.60]);
  for (let t = 0; t <= 1; t += 0.12) pts.push([t * 0.44, 0.28 + t * 0.60]);
  for (let i = 0; i < 5; i++) { const a = (i / 5) * Math.PI * 2; pts.push([-0.72 + Math.cos(a) * 0.10, -0.30 + Math.sin(a) * 0.10]); }
  for (let i = 0; i < 5; i++) { const a = (i / 5) * Math.PI * 2; pts.push([0.72 + Math.cos(a) * 0.10, -0.30 + Math.sin(a) * 0.10]); }
  return pts.slice(0, n);
}
function glyphSpiral(n: number): [number, number][] {
  const pts: [number, number][] = [];
  for (let i = 0; i < n; i++) { const t = i / n; const a = t * Math.PI * 2 * 3.2; pts.push([Math.cos(a) * (0.08 + t * 0.88), Math.sin(a) * (0.08 + t * 0.88)]); }
  return pts;
}
function glyphTopoRings(n: number): [number, number][] {
  const pts: [number, number][] = [];
  for (const ring of [{ r: 0.95, count: Math.round(n * 0.38) }, { r: 0.62, count: Math.round(n * 0.32) }, { r: 0.33, count: Math.round(n * 0.20) }, { r: 0.12, count: Math.round(n * 0.10) }]) {
    for (let i = 0; i < ring.count; i++) { const a = (i / ring.count) * Math.PI * 2; const j = 0.04 * Math.sin(a * 5) + 0.02 * Math.cos(a * 8); pts.push([Math.cos(a) * (ring.r + j), Math.sin(a) * (ring.r + j)]); }
  }
  return pts.slice(0, n);
}
const GLYPHS = [glyphCompassRose, glyphCairn, glyphFootprint, glyphUAP, glyphPetroglyph, glyphSpiral, glyphTopoRings];

// ─── Types ────────────────────────────────────────────────────────────────────
interface Particle {
  bx: number; by: number; ox: number; oy: number; vx: number; vy: number;
  r: number; op: number; depth: number; tx: number | null; ty: number | null; formOp: number;
}

type CyclePhase = 'fading-intro' | 'gap' | 'tracing' | 'holding' | 'fading-sym';

interface Slot {
  constKey: ConstKey;
  cx: number; cy: number; scale: number;
  traceProgress: number;  // shared: intro trace progress AND cycling symbol trace progress
  opacity: number;        // shared: intro/transition opacity AND cycling opacity
  targetOpacity: number;
  // cycling
  cycleActive: boolean;
  cyclePhase: CyclePhase;
  cyclePhaseT: number;
  symIdx: number;
  lastSymIdx: number;
  transitionDelay: number; // ms after cycling starts before this slot activates
  doCycle: boolean;        // false on mobile for non-primary slots
}

// ─── Canvas engine ────────────────────────────────────────────────────────────
function runCanvas(canvas: HTMLCanvasElement, reduced: boolean): () => void {
  const ctx = canvas.getContext('2d')!;
  let W = 0, H = 0;
  const isMobile = window.innerWidth < 768;
  const PARTICLE_COUNT = isMobile ? 160 : 320;
  const FORM_COUNT     = isMobile ? 80  : 160;
  const GLYPH_SCALE    = () => Math.min(W, H) * (isMobile ? 0.28 : 0.26);
  const GLYPH_CX       = () => W / 2;
  const GLYPH_CY       = () => H * 0.47;

  // Intro timing
  const INTRO_TRACE_DUR  = 2000; // ms per constellation
  const INTRO_TRACE_GAP  = 600;  // ms between constellations
  const INTRO_HOLD_DUR   = 7000; // ms all three held bright after finishing
  const INTRO_ALL_DONE_T = 3 * INTRO_TRACE_DUR + 2 * INTRO_TRACE_GAP; // ~7200ms
  const INTRO_CYCLE_T    = INTRO_ALL_DONE_T + INTRO_HOLD_DUR;          // ~14200ms
  const INTRO_SLOT_START = [0, INTRO_TRACE_DUR + INTRO_TRACE_GAP, 2 * (INTRO_TRACE_DUR + INTRO_TRACE_GAP)];

  // Cycling timing
  const SYM_TRACE_DUR = 2500;
  const SYM_HOLD_DUR  = 5000;
  const SYM_FADE_DUR  = 1200;
  const SYM_GAP_DUR   = 500;

  type SysPhase = 'intro-tracing' | 'intro-holding' | 'cycling';
  let sysPhase: SysPhase = 'intro-tracing';
  let sysElapsed = 0;

  // Slots: index 0=gemini(upper-right), 1=sagittarius(lower-left), 2=capricornus(lower-right)
  // Stagger transition: sagittarius first, then gemini, then capricornus
  const slots: Slot[] = [
    { constKey: 'gemini',      cx: 0.72, cy: 0.16, scale: isMobile ? 0.14 : 0.20, traceProgress: 0, opacity: 0, targetOpacity: 0, cycleActive: false, cyclePhase: 'fading-intro', cyclePhaseT: 0, symIdx: 0, lastSymIdx: -1, transitionDelay: 2000, doCycle: !isMobile },
    { constKey: 'sagittarius', cx: 0.14, cy: 0.65, scale: isMobile ? 0.13 : 0.18, traceProgress: 0, opacity: 0, targetOpacity: 0, cycleActive: false, cyclePhase: 'fading-intro', cyclePhaseT: 0, symIdx: 1, lastSymIdx: -1, transitionDelay: 0,    doCycle: true },
    { constKey: 'capricornus', cx: 0.82, cy: 0.60, scale: isMobile ? 0.12 : 0.16, traceProgress: 0, opacity: 0, targetOpacity: 0, cycleActive: false, cyclePhase: 'fading-intro', cyclePhaseT: 0, symIdx: 3, lastSymIdx: -1, transitionDelay: 4000, doCycle: !isMobile },
  ];

  // ── Particle pool ───────────────────────────────────────────────────────────
  const particles: Particle[] = [];
  for (let i = 0; i < PARTICLE_COUNT; i++) {
    const depth = i % 3;
    particles.push({
      bx: Math.random(), by: Math.random(), ox: 0, oy: 0,
      vx: (Math.random() - 0.5) * 0.0008, vy: (Math.random() - 0.5) * 0.0004,
      r: depth === 0 ? 1.4 + Math.random() * 0.8 : depth === 1 ? 0.9 + Math.random() * 0.6 : 0.5 + Math.random() * 0.4,
      op: depth === 0 ? 0.45 + Math.random() * 0.40 : depth === 1 ? 0.25 + Math.random() * 0.35 : 0.10 + Math.random() * 0.20,
      depth, tx: null, ty: null, formOp: 0,
    });
  }

  // ── Symbol picker ────────────────────────────────────────────────────────────
  function pickSym(excludeIdxs: number[]): number {
    const len = SIDE_SYMBOLS.length;
    let idx = Math.floor(Math.random() * len);
    let tries = 0;
    while (excludeIdxs.includes(idx) && tries < len) { idx = (idx + 1) % len; tries++; }
    return idx;
  }

  // ── Constellation drawing helpers ────────────────────────────────────────────
  function buildStarPos(key: ConstKey, slot: Slot): { x: number; y: number; r: number; op: number }[] {
    const data = CONSTELLATIONS[key];
    const dim = Math.min(W, H);
    const cenX = data.stars.reduce((s, st) => s + st.nx, 0) / data.stars.length;
    const cenY = data.stars.reduce((s, st) => s + st.ny, 0) / data.stars.length;
    return data.stars.map(st => ({
      x: slot.cx * W + (st.nx - cenX) * slot.scale * dim,
      y: slot.cy * H + (st.ny - cenY) * slot.scale * dim,
      r: st.r * (isMobile ? 0.65 : 1),
      op: st.op,
    }));
  }

  function drawConstellation(key: ConstKey, slot: Slot) {
    const data = CONSTELLATIONS[key];
    const starPos = buildStarPos(key, slot);
    const op = slot.opacity;
    if (op < 0.005) return;
    const totalLines = data.lines.length;
    const linesToDraw = Math.floor(slot.traceProgress * totalLines);
    const partial = (slot.traceProgress * totalLines) - linesToDraw;
    ctx.strokeStyle = `rgba(200,218,255,${(op * 0.58).toFixed(3)})`;
    ctx.lineWidth = isMobile ? 0.7 : 1.1;
    ctx.beginPath();
    for (let li = 0; li < linesToDraw; li++) {
      const [ai, bi] = data.lines[li];
      const a = starPos[ai], b = starPos[bi];
      if (!a || !b) continue;
      ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y);
    }
    if (linesToDraw < totalLines && partial > 0) {
      const [ai, bi] = data.lines[linesToDraw];
      const a = starPos[ai], b = starPos[bi];
      if (a && b) { ctx.moveTo(a.x, a.y); ctx.lineTo(a.x + (b.x - a.x) * partial, a.y + (b.y - a.y) * partial); }
    }
    ctx.stroke();
    const vf = slot.traceProgress;
    for (let i = 0; i < starPos.length; i++) {
      const s = starPos[i];
      const sf = i / Math.max(1, starPos.length - 1);
      if (sf > vf + 0.05) continue;
      const boost = sf > vf - 0.12 ? 1.6 : 1;
      const sOp = Math.min(0.95, s.op * op * boost);
      ctx.beginPath(); ctx.arc(s.x, s.y, s.r * 4.5, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(215,232,255,${(sOp * 0.25).toFixed(3)})`; ctx.fill();
      ctx.beginPath(); ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(215,232,255,${sOp.toFixed(3)})`; ctx.fill();
    }
  }

  function drawSideSymbol(slot: Slot) {
    if (slot.opacity < 0.005) return;
    const sym = SIDE_SYMBOLS[slot.symIdx];
    if (!sym) return;
    const dim = Math.min(W, H);
    const scale = slot.scale * dim;
    const cx = slot.cx * W, cy = slot.cy * H;
    const op = slot.opacity;
    const cenNx = sym.stars.reduce((s, st) => s + st.nx, 0) / sym.stars.length;
    const cenNy = sym.stars.reduce((s, st) => s + st.ny, 0) / sym.stars.length;
    const pos = sym.stars.map(st => ({
      x: cx + (st.nx - cenNx) * scale,
      y: cy + (st.ny - cenNy) * scale,
      r: st.r * (isMobile ? 0.65 : 1),
      op: st.op,
    }));
    const totalLines = sym.lines.length;
    const linesToDraw = Math.floor(slot.traceProgress * totalLines);
    const partial = (slot.traceProgress * totalLines) - linesToDraw;
    ctx.strokeStyle = `rgba(200,218,255,${(op * 0.55).toFixed(3)})`;
    ctx.lineWidth = isMobile ? 0.7 : 1.0;
    ctx.beginPath();
    for (let li = 0; li < linesToDraw; li++) {
      const [ai, bi] = sym.lines[li];
      const a = pos[ai], b = pos[bi];
      if (!a || !b) continue;
      ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y);
    }
    if (linesToDraw < totalLines && partial > 0) {
      const [ai, bi] = sym.lines[linesToDraw];
      const a = pos[ai], b = pos[bi];
      if (a && b) { ctx.moveTo(a.x, a.y); ctx.lineTo(a.x + (b.x - a.x) * partial, a.y + (b.y - a.y) * partial); }
    }
    ctx.stroke();
    for (let i = 0; i < pos.length; i++) {
      const s = pos[i];
      const sf = i / Math.max(1, pos.length - 1);
      if (sf > slot.traceProgress + 0.05) continue;
      const boost = sf > slot.traceProgress - 0.12 ? 1.6 : 1;
      const sOp = Math.min(0.95, s.op * op * boost);
      ctx.beginPath(); ctx.arc(s.x, s.y, s.r * 4.5, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(215,232,255,${(sOp * 0.25).toFixed(3)})`; ctx.fill();
      ctx.beginPath(); ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(215,232,255,${sOp.toFixed(3)})`; ctx.fill();
    }
  }

  // ── Glyph formation ──────────────────────────────────────────────────────────
  type FormPhase = 'idle' | 'gathering' | 'holding' | 'dissolving';
  let formPhase: FormPhase = 'idle';
  let formT = 0, currentGlyphIdx = -1, lastGlyphIdx = -1;
  const GATHER_DUR = 2800, HOLD_DUR = 4200, DISSOLVE_DUR = 2000, IDLE_DUR = 1400;

  function pickNextGlyph(): number {
    const len = GLYPHS.length;
    let idx = Math.floor(Math.random() * len);
    if (idx === lastGlyphIdx) idx = (idx + 1) % len;
    return idx;
  }
  function assignGlyphTargets(gi: number) {
    const rawPts = GLYPHS[gi](FORM_COUNT);
    const scale = GLYPH_SCALE(), cx = GLYPH_CX(), cy = GLYPH_CY();
    for (let i = 0; i < FORM_COUNT; i++) {
      const [px, py] = rawPts[i] ?? [0, 0];
      particles[i].tx = cx + px * scale; particles[i].ty = cy + py * scale;
    }
  }
  function clearTargets() { for (let i = 0; i < FORM_COUNT; i++) { particles[i].tx = null; particles[i].ty = null; } }

  // ── Meteors ──────────────────────────────────────────────────────────────────
  interface Meteor { x: number; y: number; vx: number; vy: number; life: number; trail: number }
  const meteors: Meteor[] = [];
  let lastMeteor = 0;
  const METEOR_INTERVAL = 18000 + Math.random() * 12000;
  function spawnMeteor() {
    const a = 0.85 + Math.random() * 0.4;
    meteors.push({ x: Math.random() * W * 0.7, y: -10, vx: 7 * Math.cos(a), vy: 7 * Math.sin(a), life: 1, trail: 80 + Math.random() * 40 });
  }

  // ── Resize ───────────────────────────────────────────────────────────────────
  function resize() {
    const dpr = window.devicePixelRatio || 1;
    W = canvas.clientWidth; H = canvas.clientHeight;
    canvas.width = Math.round(W * dpr); canvas.height = Math.round(H * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  // ── Particle draw/physics ────────────────────────────────────────────────────
  function drawParticle(p: Particle, fp: number) {
    const x = p.bx * W + p.ox, y = p.by * H + p.oy;
    let op = p.op, r = p.r;
    if (p.tx !== null && fp > 0) { op = p.op + (1 - p.op) * 0.6 * fp; r = p.r + 0.8 * fp; }
    ctx.beginPath(); ctx.arc(x, y, r * 3.2, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(203,243,110,${(op * 0.08).toFixed(3)})`; ctx.fill();
    ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2);
    const [cr, cg, cb] = p.depth === 0 ? [220, 240, 200] : p.depth === 1 ? [200, 220, 200] : [180, 200, 200];
    ctx.fillStyle = `rgba(${cr},${cg},${cb},${op.toFixed(3)})`; ctx.fill();
  }
  const DRIFT = [0.00018, 0.00011, 0.00006];
  const SPRING = 0.055, FRICTION = 0.82, BROWNIE = 0.00014;
  function stepParticles(fp: number) {
    for (let i = 0; i < particles.length; i++) {
      const p = particles[i];
      if (p.tx !== null && i < FORM_COUNT && fp > 0) {
        p.vx += (p.tx! / W - p.bx - p.ox / W) * SPRING * fp;
        p.vy += (p.ty! / H - p.by - p.oy / H) * SPRING * fp;
      } else {
        p.vx += (Math.random() - 0.5) * BROWNIE;
        p.vy += (Math.random() - 0.5) * BROWNIE * 0.5;
        p.vx += p.depth === 0 ? 0.000025 : p.depth === 1 ? -0.000015 : 0.000008;
        p.vy += DRIFT[p.depth] * 0.1 * Math.sin(p.bx * 6) * 0.5;
      }
      p.vx *= FRICTION; p.vy *= FRICTION;
      p.ox += p.vx * W; p.oy += p.vy * H;
      p.bx = ((p.bx + p.vx * 0.4) + 1) % 1;
      p.by = ((p.by + p.vy * 0.2) + 1) % 1;
      if (Math.abs(p.ox) > W * 0.3) p.ox *= 0.7;
      if (Math.abs(p.oy) > H * 0.3) p.oy *= 0.7;
    }
  }

  // ── RAF loop ─────────────────────────────────────────────────────────────────
  let rafId = 0, lastT = 0, running = false, inView = false;

  function tick(now: number) {
    if (!running) return;
    rafId = requestAnimationFrame(tick);
    const dt = lastT > 0 ? Math.min(now - lastT, 50) : 16;
    lastT = now;
    ctx.clearRect(0, 0, W, H);

    // ── Slot state machine ──────────────────────────────────────────────────
    if (reduced) {
      // Static: all three constellations fully traced
      for (const slot of slots) { slot.traceProgress = 1; slot.opacity = 0.55; }
    } else {
      sysElapsed += dt;

      if (sysPhase === 'intro-tracing' || sysPhase === 'intro-holding') {
        // Update phase transitions
        if (sysPhase === 'intro-tracing' && sysElapsed >= INTRO_ALL_DONE_T) sysPhase = 'intro-holding';
        if (sysPhase === 'intro-holding' && sysElapsed >= INTRO_CYCLE_T)    sysPhase = 'cycling';

        // Animate intro opacity per slot
        for (let i = 0; i < slots.length; i++) {
          const slot = slots[i];
          const st = INTRO_SLOT_START[i];
          if (sysElapsed < st) {
            slot.traceProgress = 0; slot.targetOpacity = 0;
          } else if (sysElapsed < st + INTRO_TRACE_DUR) {
            slot.traceProgress = (sysElapsed - st) / INTRO_TRACE_DUR;
            slot.targetOpacity = 0.88;
          } else {
            slot.traceProgress = 1; slot.targetOpacity = 0.88;
          }
          slot.opacity += (slot.targetOpacity - slot.opacity) * 0.04;
        }
      } else {
        // Cycling phase
        const sinceStart = sysElapsed - INTRO_CYCLE_T;
        const activeSyms = slots.filter(s => s.cycleActive && s.cyclePhase !== 'fading-intro' && s.cyclePhase !== 'gap').map(s => s.symIdx);

        for (let i = 0; i < slots.length; i++) {
          const slot = slots[i];
          const timeOffset = sinceStart - slot.transitionDelay;

          if (timeOffset < 0) {
            // Hold bright while waiting for staggered transition
            slot.opacity += (0.88 - slot.opacity) * 0.04;
            continue;
          }

          if (!slot.cycleActive) {
            slot.cycleActive = true;
            slot.cyclePhase = 'fading-intro';
            slot.cyclePhaseT = 0;
          }

          slot.cyclePhaseT += dt;

          if (slot.cyclePhase === 'fading-intro') {
            slot.opacity += (0 - slot.opacity) * 0.06;
            if (slot.opacity < 0.015) {
              slot.opacity = 0;
              if (slot.doCycle) {
                slot.symIdx = pickSym([...activeSyms, slot.lastSymIdx]);
                slot.traceProgress = 0;
                slot.cyclePhase = 'gap';
                slot.cyclePhaseT = 0;
              }
              // Non-cycling slots (mobile non-primary) just stay dark
            }
          } else if (!slot.doCycle) {
            slot.opacity = 0;
          } else if (slot.cyclePhase === 'gap') {
            slot.opacity += (0 - slot.opacity) * 0.05;
            if (slot.cyclePhaseT >= SYM_GAP_DUR) {
              const others = slots.filter((s, si) => si !== i && s.doCycle && s.cycleActive && s.cyclePhase !== 'fading-intro' && s.cyclePhase !== 'gap').map(s => s.symIdx);
              slot.symIdx = pickSym([...others, slot.lastSymIdx]);
              slot.traceProgress = 0; slot.cyclePhase = 'tracing'; slot.cyclePhaseT = 0;
            }
          } else if (slot.cyclePhase === 'tracing') {
            slot.opacity += (0.82 - slot.opacity) * 0.05;
            slot.traceProgress = Math.min(slot.cyclePhaseT / SYM_TRACE_DUR, 1);
            if (slot.cyclePhaseT >= SYM_TRACE_DUR) { slot.traceProgress = 1; slot.cyclePhase = 'holding'; slot.cyclePhaseT = 0; }
          } else if (slot.cyclePhase === 'holding') {
            slot.opacity += (0.82 - slot.opacity) * 0.05;
            slot.traceProgress = 1;
            if (slot.cyclePhaseT >= SYM_HOLD_DUR) { slot.cyclePhase = 'fading-sym'; slot.cyclePhaseT = 0; }
          } else if (slot.cyclePhase === 'fading-sym') {
            slot.opacity += (0 - slot.opacity) * 0.05;
            if (slot.cyclePhaseT >= SYM_FADE_DUR) { slot.lastSymIdx = slot.symIdx; slot.cyclePhase = 'gap'; slot.cyclePhaseT = 0; }
          }
        }
      }
    }

    // ── Glyph formation ─────────────────────────────────────────────────────
    let formProgress = 0;
    if (reduced) {
      if (currentGlyphIdx < 0) { currentGlyphIdx = 0; assignGlyphTargets(0); }
      formProgress = 1;
    } else {
      formT += dt;
      if (formPhase === 'idle') {
        if (formT > IDLE_DUR) { formT = 0; formPhase = 'gathering'; lastGlyphIdx = currentGlyphIdx; currentGlyphIdx = pickNextGlyph(); assignGlyphTargets(currentGlyphIdx); }
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

    // ── Physics & particles ──────────────────────────────────────────────────
    stepParticles(formProgress);
    for (let d = 2; d >= 0; d--) { for (const p of particles) { if (p.depth === d) drawParticle(p, formProgress); } }

    // ── Draw slots ───────────────────────────────────────────────────────────
    for (const slot of slots) {
      if (slot.opacity < 0.005) continue;
      if (slot.cycleActive && slot.cyclePhase !== 'fading-intro') {
        drawSideSymbol(slot);
      } else {
        drawConstellation(slot.constKey, slot);
      }
    }

    // ── Meteors ──────────────────────────────────────────────────────────────
    if (!isMobile && now - lastMeteor > METEOR_INTERVAL) { lastMeteor = now; spawnMeteor(); }
    for (let i = meteors.length - 1; i >= 0; i--) {
      const m = meteors[i];
      m.x += m.vx; m.y += m.vy; m.life -= 0.016;
      if (m.life <= 0 || m.y > H + 20) { meteors.splice(i, 1); continue; }
      const mag = Math.sqrt(m.vx * m.vx + m.vy * m.vy) || 1;
      const tx = m.x - (m.vx / mag) * m.trail, ty = m.y - (m.vy / mag) * m.trail;
      const g = ctx.createLinearGradient(tx, ty, m.x, m.y);
      g.addColorStop(0, 'rgba(200,240,180,0)');
      g.addColorStop(1, `rgba(200,240,180,${Math.min(m.life * 0.6, 0.45).toFixed(2)})`);
      ctx.beginPath(); ctx.moveTo(tx, ty); ctx.lineTo(m.x, m.y);
      ctx.strokeStyle = g; ctx.lineWidth = 1.2; ctx.stroke();
    }
  }

  function start() { if (running || !inView || document.hidden) return; running = true; rafId = requestAnimationFrame(tick); }
  function stop() { running = false; if (rafId) { cancelAnimationFrame(rafId); rafId = 0; } }

  resize();

  if (reduced) {
    tick(0); stop();
    const ro = new ResizeObserver(() => resize());
    ro.observe(canvas);
    return () => ro.disconnect();
  }

  const io = new IntersectionObserver(([e]) => { inView = e.isIntersecting; inView ? start() : stop(); }, { threshold: 0 });
  io.observe(canvas);
  const onVis = () => { document.hidden ? stop() : (inView && start()); };
  document.addEventListener('visibilitychange', onVis);
  const onResize = () => resize();
  window.addEventListener('resize', onResize, { passive: true });
  return () => { stop(); io.disconnect(); document.removeEventListener('visibilitychange', onVis); window.removeEventListener('resize', onResize); };
}

// ─── Component ────────────────────────────────────────────────────────────────
export default function ParticleHero() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { open: openWaitlist } = useWaitlist();
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let dispose: (() => void) | null = null;
    const load = () => { dispose = runCanvas(canvas, reduced); };
    if (typeof window.requestIdleCallback === 'function') {
      const id = window.requestIdleCallback(load, { timeout: 2000 });
      return () => { window.cancelIdleCallback(id); dispose?.(); };
    } else {
      const id = setTimeout(load, 400);
      return () => { clearTimeout(id); dispose?.(); };
    }
  }, []);

  return (
    <section id="mesa-hero" style={{ position: 'relative', minHeight: '100vh', display: 'flex', alignItems: 'center', overflow: 'hidden', background: '#060914' }}>
      <canvas ref={canvasRef} aria-hidden="true" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', display: 'block' }} />

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
      <div className="ph-scan-line" aria-hidden="true" />
      <div className="ph-compass-ring" aria-hidden="true">
        <svg viewBox="0 0 200 200" fill="none">
          <circle cx="100" cy="100" r="90" stroke="rgba(203,243,110,0.08)" strokeWidth="0.8" strokeDasharray="4 8"/>
          <circle cx="100" cy="100" r="72" stroke="rgba(203,243,110,0.05)" strokeWidth="0.5" strokeDasharray="2 10"/>
          {[0, 90, 180, 270].map(deg => { const rad = (deg * Math.PI) / 180; return <line key={deg} x1={100 + Math.sin(rad) * 82} y1={100 - Math.cos(rad) * 82} x2={100 + Math.sin(rad) * 92} y2={100 - Math.cos(rad) * 92} stroke="rgba(203,243,110,0.14)" strokeWidth="1"/>; })}
          {[45, 135, 225, 315].map(deg => { const rad = (deg * Math.PI) / 180; return <line key={deg} x1={100 + Math.sin(rad) * 86} y1={100 - Math.cos(rad) * 86} x2={100 + Math.sin(rad) * 92} y2={100 - Math.cos(rad) * 92} stroke="rgba(203,243,110,0.08)" strokeWidth="0.7"/>; })}
        </svg>
      </div>
      <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse 70% 60% at 50% 48%, rgba(6,9,20,0.72) 0%, rgba(6,9,20,0.20) 70%, transparent 100%)', zIndex: 2, pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 140, background: 'linear-gradient(to top, #070b14, transparent)', zIndex: 2, pointerEvents: 'none' }} />

      <div className="container" style={{ paddingTop: 110, paddingBottom: 90, textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', position: 'relative', zIndex: 3 }}>
        <picture>
          <source srcSet="/assets/images/content/Logo/me-logo.webp" type="image/webp" />
          <img src="/assets/images/content/Logo/ME Logo Draft 5.png" alt="Modern Explorer" fetchPriority="high" width={700} height={467}
            style={{ width: 'clamp(260px, 40vw, 580px)', height: 'auto', display: 'block', marginBottom: 18, filter: 'drop-shadow(0 0 60px rgba(203,243,110,0.22)) drop-shadow(0 8px 28px rgba(0,0,0,0.7))' }} />
        </picture>
        <p style={{ fontFamily: 'var(--font-heading)', fontSize: 'clamp(11px, 1.5vw, 18px)', fontWeight: 600, color: 'rgba(203,243,110,0.85)', letterSpacing: '0.24em', textTransform: 'uppercase', marginBottom: 10, textShadow: '0 0 20px rgba(203,243,110,0.35), 0 2px 10px rgba(0,0,0,0.9)' }}>
          Reigniting the Age of Discovery
        </p>
        <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: 'clamp(16px, 2.4vw, 28px)', fontWeight: 500, color: '#c8ddb8', letterSpacing: '0.07em', textTransform: 'uppercase', marginBottom: 14, textShadow: '0 2px 16px rgba(0,0,0,0.85)', maxWidth: 680, lineHeight: 1.3 }}>
          Investigating Unknown Phenomena —<br />Cryptozoology, UAP &amp; Lost History
        </h1>
        <p style={{ fontFamily: 'var(--font-alt)', fontSize: 'clamp(11px, 1.3vw, 15px)', fontWeight: 500, color: 'rgba(240,244,255,0.55)', letterSpacing: '0.18em', textTransform: 'uppercase', marginBottom: 46 }}>
          Colorado · Crestone · San Luis Valley · Near Great Sand Dunes
        </p>
        <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap', justifyContent: 'center' }}>
          <button onClick={() => openWaitlist('hero')} className="btn btn-primary" style={{ fontSize: 15, padding: '15px 32px' }}>Join the Research</button>
          <button onClick={() => document.getElementById('mesa-tours')?.scrollIntoView({ behavior: 'smooth' })} className="btn btn-ghost" style={{ fontSize: 15, padding: '15px 32px' }}>Explore With Us ↓</button>
        </div>
      </div>
    </section>
  );
}
