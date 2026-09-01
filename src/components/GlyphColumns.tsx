import { useEffect, useRef, useState } from 'react';

// ── Shared SVG props ────────────────────────────────────────────────────────
const S: React.SVGProps<SVGSVGElement> = {
  viewBox: '0 0 64 64', fill: 'none', stroke: 'currentColor',
  strokeWidth: 2, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const,
  'aria-hidden': true,
};

// ══════════════════════════════════════════════════════════════════════════════
// LEFT COLUMN — Uncovering Hidden Truths (Lost History & Archaeology)
// R1: map fragment + compass bearing + mountain trail
// R2: footprint trail + cave mouth + torch
// R3: carved wall + eye + key
// R4: buried vessel + shovel + open chamber
// R5: Spanish cross + ledger + coin
// R6: rising sun + open hands + spiral
// ══════════════════════════════════════════════════════════════════════════════

const GlMapFragment = () => (
  <svg {...S}>
    <path d="M10,16 L52,13 L54,50 L12,53 Z"/>
    <line x1="10" y1="28" x2="52" y2="26"/>
    <line x1="11" y1="40" x2="53" y2="38"/>
    <line x1="24" y1="14" x2="26" y2="52"/>
    <line x1="38" y1="13" x2="40" y2="51"/>
    <path d="M38,13 L52,13 L52,26 Z"/>
    <circle cx="31" cy="37" r="4.5"/>
    <line x1="28" y1="37" x2="34" y2="37"/>
    <line x1="31" y1="34" x2="31" y2="40"/>
  </svg>
);

const GlCompassBearing = () => (
  <svg {...S}>
    <circle cx="32" cy="32" r="20"/>
    <line x1="32" y1="12" x2="32" y2="18"/>
    <line x1="52" y1="32" x2="46" y2="32"/>
    <line x1="32" y1="52" x2="32" y2="46"/>
    <line x1="12" y1="32" x2="18" y2="32"/>
    <line x1="46" y1="18" x2="43" y2="21"/>
    <line x1="46" y1="46" x2="43" y2="43"/>
    <line x1="18" y1="46" x2="21" y2="43"/>
    <line x1="18" y1="18" x2="21" y2="21"/>
    <line x1="30" y1="13" x2="34" y2="13"/>
    <line x1="32" y1="32" x2="42" y2="20"/>
    <polyline points="42,20 38,22 41,26"/>
    <circle cx="32" cy="32" r="2.5"/>
  </svg>
);

const GlMountainTrail = () => (
  <svg {...S}>
    <polyline points="4,54 22,24 40,54"/>
    <polyline points="28,54 44,18 60,46"/>
    <polyline points="19,28 22,24 25,28"/>
    <polyline points="41,22 44,18 47,22"/>
    <path d="M8,52 Q15,50 20,46 Q24,42 28,44 Q32,46 36,42 Q40,38 44,40 Q48,42 52,38 Q55,35 53,28" strokeDasharray="3 3"/>
    <circle cx="53" cy="26" r="2"/>
  </svg>
);

const GlTrail = () => (
  <svg {...S}>
    {/* Left footprint — lower */}
    <ellipse cx="18" cy="50" rx="7" ry="10" transform="rotate(-12 18 50)"/>
    <ellipse cx="10" cy="40" rx="2.5" ry="2"/>
    <ellipse cx="14" cy="37" rx="2.5" ry="2"/>
    <ellipse cx="19" cy="36" rx="2.5" ry="2"/>
    {/* Right footprint — middle */}
    <ellipse cx="42" cy="30" rx="7" ry="10" transform="rotate(12 42 30)"/>
    <ellipse cx="34" cy="20" rx="2.5" ry="2"/>
    <ellipse cx="40" cy="17" rx="2.5" ry="2"/>
    <ellipse cx="46" cy="18" rx="2.5" ry="2"/>
    {/* Track dots connecting them */}
    <circle cx="32" cy="42" r="1.5" fill="currentColor" stroke="none"/>
    <circle cx="30" cy="36" r="1.5" fill="currentColor" stroke="none"/>
    <circle cx="28" cy="28" r="1.5" fill="currentColor" stroke="none"/>
    {/* Left footprint — upper */}
    <ellipse cx="18" cy="12" rx="5.5" ry="8" transform="rotate(-12 18 12)"/>
    <ellipse cx="11" cy="5" rx="2" ry="1.5"/>
    <ellipse cx="16" cy="3" rx="2" ry="1.5"/>
    <ellipse cx="21" cy="4" rx="2" ry="1.5"/>
  </svg>
);

const GlCaveMouth = () => (
  <svg {...S}>
    <path d="M8,54 L8,30 Q8,8 32,8 Q56,8 56,30 L56,54"/>
    <path d="M16,54 L16,33 Q16,16 32,16 Q48,16 48,33 L48,54"/>
    <polyline points="20,8 18,20 22,15 20,8"/>
    <polyline points="32,8 30,21 34,17 32,8"/>
    <polyline points="44,8 42,18 46,13 44,8"/>
    <line x1="6" y1="54" x2="58" y2="54"/>
  </svg>
);

const GlTorch = () => (
  <svg {...S}>
    <rect x="28" y="36" width="8" height="20" rx="1"/>
    <path d="M22,36 L24,28 L40,28 L42,36 Z"/>
    <path d="M32,28 Q28,20 30,11 Q34,17 32,22 Q36,15 38,9 Q41,18 37,24"/>
    <line x1="32" y1="7" x2="32" y2="4"/>
    <line x1="22" y1="11" x2="19" y2="8"/>
    <line x1="42" y1="11" x2="45" y2="8"/>
    <line x1="18" y1="20" x2="14" y2="18"/>
    <line x1="46" y1="20" x2="50" y2="18"/>
  </svg>
);

const GlCarvedWall = () => (
  <svg {...S}>
    <rect x="8" y="14" width="48" height="38" rx="2"/>
    <path d="M14,28 Q20,22 26,28 Q20,34 14,28 Z"/>
    <circle cx="20" cy="28" r="2"/>
    <circle cx="44" cy="26" r="5"/>
    <line x1="44" y1="18" x2="44" y2="15"/>
    <line x1="52" y1="26" x2="55" y2="26"/>
    <line x1="44" y1="34" x2="44" y2="37"/>
    <line x1="36" y1="26" x2="33" y2="26"/>
    <path d="M14,40 Q18,36 22,40 Q26,44 30,40 Q34,36 38,40 Q42,44 46,40 Q50,36 50,40"/>
    <line x1="8" y1="20" x2="14" y2="20"/>
    <line x1="8" y1="46" x2="14" y2="46"/>
  </svg>
);

const GlEye = () => (
  <svg {...S}>
    {/* Almond eye outline */}
    <path d="M6,32 Q14,18 32,18 Q50,18 58,32 Q50,46 32,46 Q14,46 6,32 Z"/>
    {/* Iris */}
    <circle cx="32" cy="32" r="10"/>
    {/* Pupil */}
    <circle cx="32" cy="32" r="4" fill="currentColor"/>
    {/* Upper kohl line */}
    <path d="M6,32 Q14,20 32,20 Q50,20 58,32" strokeWidth="1.5"/>
    {/* Egyptian teardrop extension */}
    <path d="M6,32 L2,38"/>
    <path d="M6,32 L2,26"/>
    {/* Highlight */}
    <circle cx="27" cy="28" r="1.5" fill="currentColor" stroke="none"/>
  </svg>
);

const GlKey = () => (
  <svg {...S}>
    <circle cx="22" cy="22" r="13"/>
    <circle cx="22" cy="22" r="6"/>
    <line x1="31" y1="31" x2="58" y2="55"/>
    <line x1="40" y1="39" x2="44" y2="34"/>
    <line x1="46" y1="44" x2="50" y2="39"/>
    <line x1="50" y1="49" x2="54" y2="44"/>
  </svg>
);

const GlBuriedVessel = () => (
  <svg {...S}>
    <line x1="4" y1="40" x2="60" y2="40"/>
    <path d="M4,40 Q10,44 16,40 Q22,36 28,40 Q34,44 40,40 Q46,36 52,40 Q58,44 60,40"/>
    <path d="M24,40 Q22,30 26,18 L32,14 L38,18 Q42,30 40,40"/>
    <path d="M26,18 Q28,16 32,14 Q36,16 38,18"/>
    <ellipse cx="32" cy="14" rx="5" ry="2.5"/>
    <path d="M24,30 Q18,28 20,22 Q22,18 26,20"/>
    <path d="M24,40 Q22,48 26,52 Q32,56 38,52 Q42,48 40,40" strokeDasharray="3 2"/>
  </svg>
);

const GlShovel = () => (
  <svg {...S}>
    {/* Handle */}
    <line x1="32" y1="6" x2="32" y2="36"/>
    {/* Grip cross-bar */}
    <line x1="24" y1="8" x2="40" y2="8"/>
    <line x1="24" y1="8" x2="24" y2="12"/>
    <line x1="40" y1="8" x2="40" y2="12"/>
    {/* Blade — pointed trowel */}
    <path d="M20,36 Q20,44 26,52 L32,58 L38,52 Q44,44 44,36 Z"/>
    {/* Blade spine */}
    <line x1="32" y1="36" x2="32" y2="58" strokeWidth="1"/>
    {/* Handle grip lines */}
    <line x1="29" y1="22" x2="35" y2="22" strokeWidth="1"/>
    <line x1="29" y1="28" x2="35" y2="28" strokeWidth="1"/>
  </svg>
);

const GlOpenedChamber = () => (
  <svg {...S}>
    <path d="M10,56 L10,32 Q10,10 32,10 Q54,10 54,32 L54,56"/>
    <path d="M20,56 L20,34 Q20,18 32,18 Q44,18 44,34 L44,56"/>
    <line x1="32" y1="34" x2="32" y2="10"/>
    <line x1="32" y1="34" x2="18" y2="16"/>
    <line x1="32" y1="34" x2="46" y2="16"/>
    <line x1="32" y1="34" x2="10" y2="24"/>
    <line x1="32" y1="34" x2="54" y2="24"/>
    <line x1="32" y1="34" x2="8" y2="36"/>
    <line x1="32" y1="34" x2="56" y2="36"/>
    <line x1="14" y1="52" x2="50" y2="52"/>
    <line x1="6" y1="56" x2="58" y2="56"/>
  </svg>
);

const GlCross = () => (
  <svg {...S}>
    <line x1="32" y1="8" x2="32" y2="58"/>
    <line x1="14" y1="22" x2="50" y2="22"/>
    <line x1="30" y1="8" x2="34" y2="8"/>
    <line x1="30" y1="58" x2="34" y2="58"/>
    <line x1="14" y1="20" x2="14" y2="24"/>
    <line x1="50" y1="20" x2="50" y2="24"/>
    <circle cx="32" cy="22" r="7"/>
    <line x1="32" y1="10" x2="32" y2="8"/>
    <line x1="40" y1="14" x2="42" y2="12"/>
    <line x1="44" y1="22" x2="46" y2="22"/>
    <line x1="40" y1="30" x2="42" y2="32"/>
    <line x1="24" y1="30" x2="22" y2="32"/>
    <line x1="20" y1="22" x2="18" y2="22"/>
    <line x1="24" y1="14" x2="22" y2="12"/>
    <rect x="24" y="53" width="16" height="5" rx="1"/>
  </svg>
);

const GlLedger = () => (
  <svg {...S}>
    <line x1="32" y1="10" x2="32" y2="56"/>
    <path d="M32,10 Q20,8 10,10 L10,52 Q20,50 32,52"/>
    <path d="M32,10 Q44,8 54,10 L54,52 Q44,50 32,52"/>
    <line x1="14" y1="20" x2="28" y2="20"/>
    <line x1="14" y1="27" x2="28" y2="27"/>
    <line x1="14" y1="34" x2="28" y2="34"/>
    <line x1="14" y1="41" x2="28" y2="41"/>
    <line x1="14" y1="47" x2="22" y2="47"/>
    <line x1="36" y1="20" x2="50" y2="20"/>
    <line x1="36" y1="27" x2="50" y2="27"/>
    <line x1="36" y1="34" x2="50" y2="34"/>
    <line x1="36" y1="41" x2="50" y2="41"/>
    <circle cx="46" cy="47" r="4"/>
  </svg>
);

const GlCoin = () => (
  <svg {...S}>
    <circle cx="32" cy="32" r="24"/>
    <circle cx="32" cy="32" r="20"/>
    <circle cx="32" cy="32" r="14" strokeDasharray="4 3"/>
    {/* Sunburst pattern inside */}
    <line x1="32" y1="18" x2="32" y2="46"/>
    <line x1="18" y1="32" x2="46" y2="32"/>
    <line x1="22" y1="22" x2="42" y2="42"/>
    <line x1="42" y1="22" x2="22" y2="42"/>
    <circle cx="32" cy="32" r="4"/>
  </svg>
);

const GlRisingSun = () => (
  <svg {...S}>
    {/* Horizon */}
    <line x1="2" y1="46" x2="62" y2="46"/>
    {/* Sun arc emerging */}
    <path d="M14,46 Q14,22 32,22 Q50,22 50,46"/>
    {/* Inner glow ring */}
    <path d="M22,46 Q22,30 32,30 Q42,30 42,46"/>
    {/* Rays */}
    <line x1="32" y1="20" x2="32" y2="10"/>
    <line x1="44" y1="24" x2="50" y2="16"/>
    <line x1="52" y1="34" x2="60" y2="28"/>
    <line x1="20" y1="24" x2="14" y2="16"/>
    <line x1="12" y1="34" x2="4" y2="28"/>
    <line x1="48" y1="28" x2="54" y2="20"/>
    <line x1="16" y1="28" x2="10" y2="20"/>
    {/* Horizon reflection strokes */}
    <line x1="18" y1="50" x2="28" y2="50" strokeDasharray="2 3"/>
    <line x1="34" y1="50" x2="44" y2="50" strokeDasharray="2 3"/>
  </svg>
);

const GlOpenHands = () => (
  <svg {...S}>
    {/* Left palm */}
    <path d="M4,40 Q4,50 10,54 Q16,58 20,54 L22,26 Q18,22 14,24 Q6,26 4,40 Z"/>
    {/* Left fingers */}
    <line x1="22" y1="26" x2="22" y2="14" strokeWidth="1.5"/>
    <line x1="24" y1="25" x2="24" y2="12" strokeWidth="1.5"/>
    <line x1="26" y1="24" x2="26" y2="11" strokeWidth="1.5"/>
    <line x1="28" y1="24" x2="28" y2="12" strokeWidth="1.5"/>
    {/* Right palm (mirror) */}
    <path d="M60,40 Q60,50 54,54 Q48,58 44,54 L42,26 Q46,22 50,24 Q58,26 60,40 Z"/>
    {/* Right fingers */}
    <line x1="42" y1="26" x2="42" y2="14" strokeWidth="1.5"/>
    <line x1="40" y1="25" x2="40" y2="12" strokeWidth="1.5"/>
    <line x1="38" y1="24" x2="38" y2="11" strokeWidth="1.5"/>
    <line x1="36" y1="24" x2="36" y2="12" strokeWidth="1.5"/>
    {/* Light suggestion between palms */}
    <path d="M28,30 Q32,28 36,30" strokeDasharray="2 3" strokeWidth="1"/>
    <path d="M27,35 Q32,32 37,35" strokeDasharray="2 3" strokeWidth="1"/>
  </svg>
);

const GlSpiral = () => (
  <svg {...S}>
    {/* Outward Archimedean spiral */}
    <path d="M32,32
      Q38,28 40,22 Q42,14 34,10
      Q22,6 14,18 Q8,28 14,40
      Q20,52 34,52 Q50,52 56,38
      Q62,22 50,10"/>
    <circle cx="32" cy="32" r="3"/>
    {/* Small tick marks at quarter turns */}
    <line x1="32" y1="29" x2="32" y2="26" strokeWidth="1"/>
    <line x1="42" y1="32" x2="45" y2="32" strokeWidth="1"/>
  </svg>
);

const LEFT_REGISTERS = [
  [GlMapFragment, GlCompassBearing, GlMountainTrail],
  [GlTrail, GlCaveMouth, GlTorch],
  [GlCarvedWall, GlEye, GlKey],
  [GlBuriedVessel, GlShovel, GlOpenedChamber],
  [GlCross, GlLedger, GlCoin],
  [GlRisingSun, GlOpenHands, GlSpiral],
];

// ══════════════════════════════════════════════════════════════════════════════
// RIGHT COLUMN — The Unknown Encounter (Cryptozoology + UAP + Esoteric)
// R1: crescent moon + forest + broken branch
// R2: footprint + eyes in dark + tree-knock waves
// R3: tall figure + question spiral
// R4: disc craft + triangle craft + three lights
// R5: scattered camp + camera frame + thermal figure
// R6: eye of Horus + all-seeing triangle + open circle
// ══════════════════════════════════════════════════════════════════════════════

const GlNight = () => (
  <svg {...S}>
    <path d="M32,10 Q44,12 48,24 Q52,36 44,46 Q36,52 28,48 Q38,44 40,32 Q42,20 32,10 Z"/>
    <circle cx="16" cy="18" r="1.5"/>
    <circle cx="52" cy="28" r="1.5"/>
    <circle cx="20" cy="44" r="1.5"/>
    <line x1="16" y1="14" x2="16" y2="22"/>
    <line x1="12" y1="18" x2="20" y2="18"/>
    <line x1="52" y1="24" x2="52" y2="32"/>
    <line x1="48" y1="28" x2="56" y2="28"/>
  </svg>
);

const GlForest = () => (
  <svg {...S}>
    <line x1="12" y1="20" x2="12" y2="54"/>
    <polyline points="5,34 12,20 19,34"/>
    <polyline points="6,44 12,32 18,44"/>
    <line x1="32" y1="10" x2="32" y2="54"/>
    <polyline points="23,28 32,10 41,28"/>
    <polyline points="24,40 32,24 40,40"/>
    <line x1="52" y1="20" x2="52" y2="54"/>
    <polyline points="45,34 52,20 59,34"/>
    <polyline points="46,44 52,32 58,44"/>
    <line x1="4" y1="54" x2="60" y2="54"/>
  </svg>
);

const GlBrokenBranch = () => (
  <svg {...S}>
    <path d="M8,20 Q18,22 26,28"/>
    <path d="M38,36 Q50,44 58,46"/>
    <polyline points="26,28 30,24 34,32 38,36"/>
    <path d="M14,22 Q12,13 10,8"/>
    <path d="M20,24 Q18,17 20,10"/>
    <path d="M46,40 Q51,32 54,26"/>
    <path d="M52,44 Q56,37 60,32"/>
    <line x1="30" y1="20" x2="28" y2="14"/>
    <line x1="34" y1="22" x2="36" y2="16"/>
    <line x1="32" y1="38" x2="30" y2="44"/>
  </svg>
);

const GlBigfootPrint = () => (
  <svg {...S}>
    <ellipse cx="32" cy="40" rx="16" ry="18"/>
    <path d="M20,34 Q26,28 38,32 Q42,36 38,40 Q26,36 20,34"/>
    <ellipse cx="18" cy="25" rx="4" ry="3"/>
    <ellipse cx="24" cy="20" rx="4" ry="3"/>
    <ellipse cx="32" cy="17" rx="4.5" ry="3"/>
    <ellipse cx="40" cy="20" rx="4" ry="3"/>
    <ellipse cx="46" cy="25" rx="4" ry="3"/>
    <line x1="16" y1="25" x2="20" y2="25"/>
    <line x1="22" y1="20" x2="26" y2="20"/>
    <line x1="30" y1="17" x2="34" y2="17"/>
    <line x1="38" y1="20" x2="42" y2="20"/>
    <line x1="44" y1="25" x2="48" y2="25"/>
    <path d="M20,38 Q18,44 20,50"/>
    <path d="M44,38 Q46,44 44,50"/>
  </svg>
);

const GlEyesInDark = () => (
  <svg {...S}>
    <path d="M8,32 Q14,22 20,32 Q14,42 8,32 Z"/>
    <circle cx="14" cy="32" r="3"/>
    <circle cx="14" cy="32" r="1" fill="currentColor"/>
    <path d="M44,32 Q50,22 56,32 Q50,42 44,32 Z"/>
    <circle cx="50" cy="32" r="3"/>
    <circle cx="50" cy="32" r="1" fill="currentColor"/>
    <path d="M8,26 Q14,22 20,26"/>
    <path d="M44,26 Q50,22 56,26"/>
    <path d="M5,32 Q14,18 23,32" strokeDasharray="2 3"/>
    <path d="M41,32 Q50,18 59,32" strokeDasharray="2 3"/>
  </svg>
);

const GlTreeKnock = () => (
  <svg {...S}>
    <path d="M28,6 Q24,10 24,18 L24,56 Q28,58 36,56 L36,18 Q36,10 32,6"/>
    <path d="M25,20 Q30,22 35,20"/>
    <path d="M25,32 Q30,34 35,32"/>
    <path d="M25,44 Q30,46 35,44"/>
    <circle cx="32" cy="32" r="3.5"/>
    <path d="M28,32 Q22,30 14,32"/>
    <path d="M36,32 Q42,30 50,32"/>
    <path d="M30,27 Q26,24 20,22"/>
    <path d="M34,27 Q38,24 44,22"/>
    <path d="M30,37 Q26,40 20,42"/>
    <path d="M34,37 Q38,40 44,42"/>
    <path d="M10,26 Q8,32 10,38" strokeDasharray="2 2"/>
    <path d="M6,22 Q4,32 6,42" strokeDasharray="2 2"/>
  </svg>
);

const GlTallFigure = () => (
  <svg {...S}>
    <line x1="10" y1="54" x2="10" y2="12"/>
    <polyline points="4,24 10,12 16,24"/>
    <polyline points="4,36 10,26 16,36"/>
    <polyline points="4,46 10,38 16,46"/>
    <line x1="54" y1="54" x2="54" y2="12"/>
    <polyline points="48,24 54,12 60,24"/>
    <polyline points="48,36 54,26 60,36"/>
    <polyline points="48,46 54,38 60,46"/>
    <circle cx="32" cy="13" r="5"/>
    <path d="M28,18 L26,38 L24,54"/>
    <path d="M36,18 L38,38 L40,54"/>
    <path d="M28,18 Q32,20 36,18"/>
    <path d="M28,22 Q20,28 18,38"/>
    <path d="M36,22 Q44,28 46,38"/>
    <path d="M26,38 Q32,42 38,38"/>
    <line x1="4" y1="54" x2="60" y2="54"/>
  </svg>
);

const GlQuestionSpiral = () => (
  <svg {...S}>
    <path d="M32,32 Q32,22 40,18 Q50,14 54,22 Q58,32 50,40 Q42,48 32,46 Q20,44 16,34 Q12,22 20,14 Q28,6 40,8"/>
    <line x1="32" y1="46" x2="32" y2="54"/>
    <circle cx="32" cy="58" r="2.5"/>
  </svg>
);

const GlDiscCraft = () => (
  <svg {...S}>
    {/* Upper hull curve */}
    <path d="M8,38 Q14,24 32,20 Q50,24 56,36"/>
    {/* Lower hull curve — flatter */}
    <path d="M8,38 Q14,46 32,48 Q50,46 56,36"/>
    {/* Dome */}
    <path d="M22,36 Q24,20 32,16 Q40,20 42,36"/>
    {/* Dome window */}
    <ellipse cx="32" cy="28" rx="6" ry="4"/>
    {/* Hull panel lines */}
    <path d="M16,40 Q32,46 50,38" strokeDasharray="4 3" strokeWidth="1.5"/>
    <path d="M12,38 Q32,44 54,36" strokeDasharray="2 4" strokeWidth="1"/>
    {/* Belly ring */}
    <ellipse cx="32" cy="42" rx="16" ry="3.5" strokeDasharray="5 3"/>
    {/* Running lights */}
    <circle cx="7" cy="38" r="2" fill="currentColor" stroke="none"/>
    <circle cx="57" cy="36" r="2" fill="currentColor" stroke="none"/>
    <circle cx="32" cy="50" r="2" fill="currentColor" stroke="none"/>
    {/* Glow halos */}
    <circle cx="7" cy="38" r="5" strokeWidth="0.75" strokeDasharray="2 2"/>
    <circle cx="57" cy="36" r="5" strokeWidth="0.75" strokeDasharray="2 2"/>
  </svg>
);

const GlTriangleCraft = () => (
  <svg {...S}>
    {/* Triangle hull */}
    <polygon points="32,8 6,54 58,54"/>
    {/* Internal structure */}
    <line x1="32" y1="8" x2="32" y2="46" strokeWidth="1"/>
    <line x1="19" y1="31" x2="45" y2="31" strokeWidth="1"/>
    {/* Corner running lights — filled */}
    <circle cx="32" cy="10" r="3" fill="currentColor" stroke="none"/>
    <circle cx="8" cy="50" r="3" fill="currentColor" stroke="none"/>
    <circle cx="56" cy="50" r="3" fill="currentColor" stroke="none"/>
    {/* Glow halos */}
    <circle cx="32" cy="10" r="7" strokeWidth="0.75" strokeDasharray="2 2"/>
    {/* Central orb */}
    <circle cx="32" cy="40" r="6"/>
    <circle cx="32" cy="40" r="2" fill="currentColor" stroke="none"/>
    {/* Exhaust shimmer */}
    <line x1="20" y1="56" x2="18" y2="62" strokeWidth="1" strokeDasharray="2 2"/>
    <line x1="32" y1="56" x2="32" y2="62" strokeWidth="1" strokeDasharray="2 2"/>
    <line x1="44" y1="56" x2="46" y2="62" strokeWidth="1" strokeDasharray="2 2"/>
  </svg>
);

const GlThreeLights = () => (
  <svg {...S}>
    {/* Three orbs in triangle formation */}
    <circle cx="20" cy="28" r="7"/>
    <circle cx="44" cy="22" r="7"/>
    <circle cx="32" cy="46" r="7"/>
    {/* Glow rings */}
    <circle cx="20" cy="28" r="12" strokeDasharray="3 3" strokeWidth="1"/>
    <circle cx="44" cy="22" r="12" strokeDasharray="3 3" strokeWidth="1"/>
    <circle cx="32" cy="46" r="12" strokeDasharray="3 3" strokeWidth="1"/>
    {/* Center glows */}
    <circle cx="20" cy="28" r="3" fill="currentColor" stroke="none"/>
    <circle cx="44" cy="22" r="3" fill="currentColor" stroke="none"/>
    <circle cx="32" cy="46" r="3" fill="currentColor" stroke="none"/>
  </svg>
);

const GlScatteredCamp = () => (
  <svg {...S}>
    <line x1="4" y1="50" x2="60" y2="50"/>
    <polyline points="14,50 32,20 50,50"/>
    <line x1="22" y1="50" x2="42" y2="50"/>
    <line x1="32" y1="20" x2="32" y2="50"/>
    <rect x="4" y="42" width="10" height="8" rx="2"/>
    <path d="M6,42 Q10,38 14,42"/>
    <ellipse cx="54" cy="46" rx="6" ry="4"/>
    <line x1="48" y1="44" x2="60" y2="44"/>
    <line x1="48" y1="48" x2="60" y2="48"/>
    <path d="M20,50 Q18,46 16,46 Q14,46 14,50"/>
    <ellipse cx="56" cy="18" rx="3" ry="4" transform="rotate(-20 56 18)"/>
    <ellipse cx="50" cy="30" rx="3" ry="4" transform="rotate(10 50 30)"/>
    <ellipse cx="56" cy="40" rx="3" ry="4" transform="rotate(-10 56 40)"/>
  </svg>
);

const GlCameraFrame = () => (
  <svg {...S}>
    <polyline points="8,20 8,8 20,8"/>
    <polyline points="44,8 56,8 56,20"/>
    <polyline points="56,44 56,56 44,56"/>
    <polyline points="20,56 8,56 8,44"/>
    <line x1="32" y1="14" x2="32" y2="50"/>
    <line x1="14" y1="32" x2="50" y2="32"/>
    <circle cx="32" cy="32" r="8"/>
    <circle cx="32" cy="32" r="14" strokeDasharray="4 4"/>
    <line x1="28" y1="14" x2="36" y2="14"/>
    <line x1="28" y1="50" x2="36" y2="50"/>
    <line x1="14" y1="28" x2="14" y2="36"/>
    <line x1="50" y1="28" x2="50" y2="36"/>
    <circle cx="52" cy="12" r="2.5"/>
  </svg>
);

const GlThermalFigure = () => (
  <svg {...S}>
    {/* FLIR-style corner brackets */}
    <polyline points="4,10 4,4 10,4" strokeWidth="1.5"/>
    <polyline points="54,4 60,4 60,10" strokeWidth="1.5"/>
    <polyline points="60,54 60,60 54,60" strokeWidth="1.5"/>
    <polyline points="10,60 4,60 4,54" strokeWidth="1.5"/>
    {/* Head — heat bloom */}
    <circle cx="32" cy="16" r="8"/>
    {/* Shoulder/torso hot zone */}
    <path d="M20,24 Q16,36 18,50 L32,54 L46,50 Q48,36 44,24 Q38,20 32,20 Q26,20 20,24 Z"/>
    {/* Arms */}
    <path d="M20,28 Q14,30 10,38" strokeWidth="1.5"/>
    <path d="M44,28 Q50,30 54,38" strokeWidth="1.5"/>
    {/* Thermal scan lines */}
    <line x1="6" y1="32" x2="26" y2="32" strokeDasharray="3 2" strokeWidth="1"/>
    <line x1="38" y1="32" x2="58" y2="32" strokeDasharray="3 2" strokeWidth="1"/>
    <line x1="6" y1="44" x2="18" y2="44" strokeDasharray="3 2" strokeWidth="1"/>
    <line x1="46" y1="44" x2="58" y2="44" strokeDasharray="3 2" strokeWidth="1"/>
    {/* Crosshair reticle */}
    <circle cx="32" cy="32" r="4" strokeWidth="1"/>
    <line x1="30" y1="32" x2="28" y2="32" strokeWidth="1"/>
    <line x1="34" y1="32" x2="36" y2="32" strokeWidth="1"/>
    <line x1="32" y1="30" x2="32" y2="28" strokeWidth="1"/>
    <line x1="32" y1="34" x2="32" y2="36" strokeWidth="1"/>
  </svg>
);

const GlEyeOfHorus = () => (
  <svg {...S}>
    {/* Eyebrow arc */}
    <path d="M8,20 Q20,12 32,14 Q44,12 56,20"/>
    {/* Eye outline */}
    <path d="M8,30 Q16,20 32,20 Q48,20 56,30 Q48,40 32,40 Q16,40 8,30 Z"/>
    {/* Iris */}
    <circle cx="32" cy="30" r="7"/>
    {/* Pupil */}
    <circle cx="32" cy="30" r="3" fill="currentColor"/>
    {/* Teardrop — left extension */}
    <path d="M8,30 L4,44"/>
    <path d="M10,32 L8,46 L14,48"/>
    {/* Spiral tail — right extension */}
    <path d="M56,30 Q58,36 56,42 Q54,50 46,52 Q38,54 38,58"/>
    {/* Upper kohl line */}
    <path d="M8,24 Q12,20 14,18" strokeWidth="1"/>
  </svg>
);

const GlAllSeeingTriangle = () => (
  <svg {...S}>
    {/* Triangle */}
    <polygon points="32,6 4,58 60,58"/>
    {/* Eye inside triangle */}
    <path d="M18,46 Q24,36 32,34 Q40,36 46,46 Q40,54 32,54 Q24,54 18,46 Z"/>
    <circle cx="32" cy="46" r="6"/>
    <circle cx="32" cy="46" r="2.5" fill="currentColor"/>
    {/* Rays from triangle apex */}
    <line x1="32" y1="4" x2="32" y2="2"/>
    <line x1="20" y1="24" x2="16" y2="18" strokeWidth="1"/>
    <line x1="44" y1="24" x2="48" y2="18" strokeWidth="1"/>
    <line x1="26" y1="14" x2="22" y2="8" strokeWidth="1"/>
    <line x1="38" y1="14" x2="42" y2="8" strokeWidth="1"/>
    {/* Small decorative marks on sides */}
    <line x1="18" y1="32" x2="8" y2="32" strokeWidth="1" strokeDasharray="2 2"/>
    <line x1="46" y1="32" x2="56" y2="32" strokeWidth="1" strokeDasharray="2 2"/>
  </svg>
);

const GlOpenCircle = () => (
  <svg {...S}>
    {/* Main circle — slightly open (ouroboros suggestion) */}
    <path d="M34,6 Q52,6 58,22 Q64,40 52,52 Q38,62 22,56 Q8,48 6,32 Q4,16 18,8 Q26,4 34,6"/>
    {/* Inner ring */}
    <circle cx="32" cy="32" r="14"/>
    {/* Cardinal spokes */}
    <line x1="32" y1="18" x2="32" y2="14" strokeWidth="1"/>
    <line x1="46" y1="32" x2="50" y2="32" strokeWidth="1"/>
    <line x1="32" y1="46" x2="32" y2="50" strokeWidth="1"/>
    <line x1="18" y1="32" x2="14" y2="32" strokeWidth="1"/>
    {/* Center jewel */}
    <circle cx="32" cy="32" r="4"/>
    <circle cx="32" cy="32" r="1.5" fill="currentColor" stroke="none"/>
    {/* Tail at opening */}
    <path d="M34,6 L38,2 L40,8" strokeWidth="1"/>
  </svg>
);

const RIGHT_REGISTERS = [
  [GlNight, GlForest, GlBrokenBranch],
  [GlBigfootPrint, GlEyesInDark, GlTreeKnock],
  [GlTallFigure, GlQuestionSpiral],
  [GlDiscCraft, GlTriangleCraft, GlThreeLights],
  [GlScatteredCamp, GlCameraFrame, GlThermalFigure],
  [GlEyeOfHorus, GlAllSeeingTriangle, GlOpenCircle],
];

// ── Register band — IntersectionObserver reveal ──────────────────────────────
function RevealRegister({ glyphs }: { glyphs: React.FC[] }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add('mg-revealed');
          io.disconnect();
        }
      },
      { threshold: 0.2, rootMargin: '0px 0px -40px 0px' }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div ref={ref} className="mg-register">
      {glyphs.map((Glyph, i) => <Glyph key={i} />)}
    </div>
  );
}

// ── Mobile section dividers ──────────────────────────────────────────────────
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

// ── Main component ───────────────────────────────────────────────────────────
export default function GlyphColumns() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia('(min-width: 1440px)');
    setShow(mq.matches);
    const handler = (e: MediaQueryListEvent) => setShow(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  if (!show) return null;

  return (
    <div className="mg-wrapper" aria-hidden="true">
      <div className="mg-col mg-col-left">
        {LEFT_REGISTERS.map((glyphs, i) => (
          <RevealRegister key={i} glyphs={glyphs} />
        ))}
      </div>
      <div className="mg-col mg-col-right">
        {RIGHT_REGISTERS.map((glyphs, i) => (
          <RevealRegister key={i} glyphs={glyphs} />
        ))}
      </div>
    </div>
  );
}
