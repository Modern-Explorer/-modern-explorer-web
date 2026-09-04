import type { CSSProperties } from 'react';

type GlyphVariant = 'anthropomorph' | 'labyrinth' | 'barrier-figure' | 'ouroboros' | 'mandala';

const SVG_BASE: CSSProperties = { width: '100%', height: 'auto', display: 'block' };

// Fremont-style anthropomorph — McConkie Ranch character:
// trapezoidal body, three-horn headdress, hollow eyes, geometric limbs.
function Anthropomorph() {
  return (
    <svg viewBox="0 0 200 360" style={SVG_BASE} aria-hidden="true"
      fill="none" stroke="currentColor" strokeWidth="1.5"
      strokeLinecap="round" strokeLinejoin="round">
      {/* Center horn with tip dot */}
      <line x1="100" y1="52" x2="100" y2="13" />
      <circle cx="100" cy="10" r="3.5" fill="currentColor" stroke="none" />
      {/* Left horn */}
      <line x1="86" y1="57" x2="60" y2="18" />
      <circle cx="57" cy="15" r="3.5" fill="currentColor" stroke="none" />
      {/* Right horn */}
      <line x1="114" y1="57" x2="140" y2="18" />
      <circle cx="143" cy="15" r="3.5" fill="currentColor" stroke="none" />
      {/* Head circle */}
      <circle cx="100" cy="78" r="26" />
      {/* Hollow eyes */}
      <circle cx="90" cy="75" r="5" />
      <circle cx="110" cy="75" r="5" />
      {/* Neck */}
      <line x1="100" y1="104" x2="100" y2="118" />
      {/* Trapezoidal body — wide shoulders, narrowing base */}
      <path d="M 36,118 L 164,118 L 128,256 L 72,256 Z" />
      {/* Body decoration stripes */}
      <line x1="50" y1="161" x2="150" y2="161" />
      <line x1="56" y1="201" x2="144" y2="201" />
      {/* Belt chevron mark */}
      <path d="M 74,228 L 100,216 L 126,228" />
      {/* Arms */}
      <path d="M 36,142 Q 14,165 6,190" />
      <path d="M 164,142 Q 186,165 194,190" />
      {/* Legs */}
      <line x1="78" y1="256" x2="65" y2="340" />
      <line x1="122" y1="256" x2="135" y2="340" />
    </svg>
  );
}

// Classical 7-circuit Cretan labyrinth — unicursal path, entry on the right.
// Constructed from alternating upper/lower semicircular walls with connectors.
// r = step × n, step = 16, center = (150, 150).
function Labyrinth() {
  return (
    <svg viewBox="0 0 300 300" style={SVG_BASE} aria-hidden="true"
      fill="none" stroke="currentColor" strokeWidth="1.5"
      strokeLinecap="round">
      {/* Outer wall (r=128) — nearly complete, gap at right = entry */}
      <path d="M 278,155 A 128,128 0 1,1 278,145" />
      {/* Wall 7 (r=112) — upper semicircle */}
      <path d="M 38,150 A 112,112 0 0,0 262,150" />
      {/* Wall 6 (r=96) — lower semicircle */}
      <path d="M 246,150 A 96,96 0 0,1 54,150" />
      {/* Wall 5 (r=80) — upper */}
      <path d="M 70,150 A 80,80 0 0,0 230,150" />
      {/* Wall 4 (r=64) — lower */}
      <path d="M 214,150 A 64,64 0 0,1 86,150" />
      {/* Wall 3 (r=48) — upper */}
      <path d="M 102,150 A 48,48 0 0,0 198,150" />
      {/* Wall 2 (r=32) — lower */}
      <path d="M 182,150 A 32,32 0 0,1 118,150" />
      {/* Wall 1 (r=16) — upper / innermost wall */}
      <path d="M 134,150 A 16,16 0 0,0 166,150" />
      {/* Seed cross top arm — center to inner wall */}
      <line x1="150" y1="134" x2="150" y2="150" />
      {/* Left-side connectors (outer → wall 7, wall 6 → 5, wall 4 → 3, wall 2 → 1) */}
      <line x1="22" y1="150" x2="38" y2="150" />
      <line x1="54" y1="150" x2="70" y2="150" />
      <line x1="86" y1="150" x2="102" y2="150" />
      <line x1="118" y1="150" x2="134" y2="150" />
      {/* Right-side connectors (wall 1 → 2, wall 3 → 4, wall 5 → 6; entry gap between wall 7 and outer) */}
      <line x1="166" y1="150" x2="182" y2="150" />
      <line x1="198" y1="150" x2="214" y2="150" />
      <line x1="230" y1="150" x2="246" y2="150" />
    </svg>
  );
}

// Barrier Canyon-style elongated spectral figure — tall, hollow-eyed,
// the signature polychrome form: tapered bag-body, no legs, antennae.
function BarrierFigure() {
  return (
    <svg viewBox="0 0 120 480" style={SVG_BASE} aria-hidden="true"
      fill="none" stroke="currentColor" strokeWidth="1.5"
      strokeLinecap="round" strokeLinejoin="round">
      {/* Antennae / head emanations */}
      <path d="M 44,22 Q 38,10 34,2" />
      <line x1="60" y1="20" x2="60" y2="4" />
      <path d="M 76,22 Q 82,10 86,2" />
      {/* Head oval */}
      <ellipse cx="60" cy="52" rx="28" ry="34" />
      {/* Large hollow saucer eyes — Barrier Canyon signature */}
      <circle cx="47" cy="46" r="9" />
      <circle cx="73" cy="46" r="9" />
      {/* Slit mouth */}
      <line x1="50" y1="68" x2="70" y2="68" />
      {/* Elongated tapered body — no legs, floats */}
      <path d="M 6,86 Q 2,240 12,418 Q 60,442 108,418 Q 118,240 114,86 Z" />
      {/* Internal spectral robe striping */}
      <line x1="40" y1="102" x2="28" y2="402" />
      <line x1="60" y1="98" x2="60" y2="422" />
      <line x1="80" y1="102" x2="92" y2="402" />
      {/* Ghostly arms extending beyond figure */}
      <path d="M 6,124 Q -12,140 -22,154" />
      <path d="M 114,124 Q 132,140 142,154" />
    </svg>
  );
}

// Ouroboros — the serpent consuming its own tail.
// Body is a thick arc completing most of a circle; head meets tail in the upper right.
function Ouroboros() {
  return (
    <svg viewBox="0 0 300 300" style={SVG_BASE} aria-hidden="true"
      fill="none" stroke="currentColor"
      strokeLinecap="round" strokeLinejoin="round">
      {/* Body arc — thick stroke, CCW from tail (upper-right) all the way around to head */}
      <path d="M 220,52 A 120,120 0 1,0 254,88" strokeWidth="13" />
      {/* Tail taper — thins as it enters head's mouth */}
      <path d="M 220,52 Q 212,42 206,32" strokeWidth="7" />
      <path d="M 206,32 Q 202,22 198,14" strokeWidth="3" />
      {/* Head at arc end (254,88) — jaw following the tail end */}
      <ellipse cx="256" cy="82" rx="15" ry="9"
        transform="rotate(38 256 82)" strokeWidth="1.5" />
      {/* Upper jaw line reaching toward tail */}
      <path d="M 254,88 Q 240,72 226,56 Q 218,48 212,42"
        strokeWidth="1.2" />
      {/* Eye */}
      <circle cx="250" cy="76" r="3.5" fill="currentColor" stroke="none" />
      {/* Forked tongue */}
      <path d="M 264,86 L 272,80" strokeWidth="1.2" />
      <path d="M 264,86 L 270,94" strokeWidth="1.2" />
    </svg>
  );
}

// Jungian mandala — squared circle, quadrated.
// Outer circle contains a diamond (square at 45°), cardinal cross,
// inner circle with inner diamond, 8-fold division, center.
function Mandala() {
  return (
    <svg viewBox="0 0 300 300" style={SVG_BASE} aria-hidden="true"
      fill="none" stroke="currentColor" strokeWidth="1.5"
      strokeLinecap="round">
      {/* Outer circle */}
      <circle cx="150" cy="150" r="130" />
      {/* Outer diamond — square rotated 45° */}
      <path d="M 150,20 L 280,150 L 150,280 L 20,150 Z" />
      {/* Cardinal axis cross */}
      <line x1="150" y1="20" x2="150" y2="280" />
      <line x1="20" y1="150" x2="280" y2="150" />
      {/* Diagonal cross completing 8-fold division */}
      <line x1="58" y1="58" x2="242" y2="242" />
      <line x1="242" y1="58" x2="58" y2="242" />
      {/* Inner circle */}
      <circle cx="150" cy="150" r="74" />
      {/* Inner diamond */}
      <path d="M 150,76 L 224,150 L 150,224 L 76,150 Z" />
      {/* Center circle */}
      <circle cx="150" cy="150" r="24" />
    </svg>
  );
}

const GLYPHS: Record<GlyphVariant, () => React.ReactElement> = {
  anthropomorph: Anthropomorph,
  labyrinth: Labyrinth,
  'barrier-figure': BarrierFigure,
  ouroboros: Ouroboros,
  mandala: Mandala,
};

interface GhostGlyphProps {
  variant: GlyphVariant;
  opacity?: number;
  style?: CSSProperties;
}

// Ghost glyphs: large, barely-visible watermark SVGs behind section content.
// aria-hidden, no pointer events, z-index 0 (content sits at z-index 1 above it).
// opacity defaults to 4% — felt more than seen against the dark ground.
export default function GhostGlyph({ variant, opacity = 0.04, style }: GhostGlyphProps) {
  const Glyph = GLYPHS[variant];
  return (
    <div
      aria-hidden="true"
      style={{
        position: 'absolute',
        pointerEvents: 'none',
        zIndex: 0,
        opacity,
        color: 'var(--text)',
        userSelect: 'none',
        ...style,
      }}
    >
      <Glyph />
    </div>
  );
}
