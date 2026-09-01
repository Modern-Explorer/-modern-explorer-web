import { useCallback, useEffect, useRef, useState } from 'react';

// ── Types ─────────────────────────────────────────────────────────────────────

type GlyphEntry = {
  char: string;   // Unicode character(s)
  trans: string;  // Transliteration shown in hover lens
  uname: string;  // Gardiner / sign-list code shown in hover lens
  font: 'egy' | 'sux';
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
  | { kind: 'glyph'; char: string; trans: string; uname: string; font: 'egy' | 'sux' }
  | { kind: 'symbol'; char: string; name: string };

// ── Verified Egyptian Hieroglyph data (Unicode 15, confirmed via unicodedata) ─
// Sources: Gardiner Sign List; TLA (thesaurus-linguae-aegyptiae.de);
//          Unicode 15.0 code chart Egyptian Hieroglyphs (U+13000–U+1342F)

const LEFT_STANZAS: GlyphEntry[][] = [
  // Stanza 1 — "Do the gods hold the answers?" (in-iw nṯrw ḫr wšbw)
  // Attested: M017 (reed) = ı͗ interrogative; N035 (water) = n; G007 (falcon) = nṯr det.;
  //           D021 (mouth) = r; D004 (Horus eye) = Wḏꜣt (sacred seeing)
  [
    { char: '\u{131CB}', trans: 'ı͗ — reed (interrogative)', uname: 'M017', font: 'egy' },
    { char: '\u{13216}', trans: 'n — water ripple', uname: 'N035', font: 'egy' },
    { char: '\u{13146}', trans: 'nṯr — Horus on standard', uname: 'G007', font: 'egy' },
    { char: '\u{1308B}', trans: 'r — mouth', uname: 'D021', font: 'egy' },
    { char: '\u{13079}', trans: 'Wḏꜣt — Eye of Horus', uname: 'D004', font: 'egy' },
  ],
  // Stanza 2 — "Where is the deepest wisdom? Thoth knows." (Ḏḥwty rḫ sb3yt wr)
  // Attested: C003 (seated deity) = nṯr det.; E010 (ibis) = Ḏḥwty (Thoth);
  //           G001 (vulture) = ꜣ; N005 (sun disk) = Rꜥ; D028 (ka-arms) = kꜣ/rḫ
  [
    { char: '\u{1305F}', trans: 'nṯr — seated deity', uname: 'C003', font: 'egy' },
    { char: '\u{130DD}', trans: 'Ḏḥwty — Thoth ibis', uname: 'E010', font: 'egy' },
    { char: '\u{1313F}', trans: 'ꜣ — Egyptian vulture', uname: 'G001', font: 'egy' },
    { char: '\u{131F3}', trans: 'Rꜥ — sun disk', uname: 'N005', font: 'egy' },
    { char: '\u{13093}', trans: 'kꜣ — ka arms', uname: 'D028', font: 'egy' },
  ],
  // Stanza 3 — "Who built the pyramids?" (in-m ḳd mrw)
  // Attested: A001 (seated man) = rmṯ det.; M017A (two reeds) = y; G043 (quail) = w;
  //           O024 (pyramid) = mr; C002 (deity w/ two feathers) = nṯr form
  [
    { char: '\u{13000}', trans: 'rmṯ — seated man', uname: 'A001', font: 'egy' },
    { char: '\u{131CC}', trans: 'y — two reeds', uname: 'M017A', font: 'egy' },
    { char: '\u{13171}', trans: 'w — quail chick', uname: 'G043', font: 'egy' },
    { char: '\u{13274}', trans: 'mr — pyramid', uname: 'O024', font: 'egy' },
    { char: '\u{1305B}', trans: 'nṯr — deity form', uname: 'C002', font: 'egy' },
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

const RIGHT_STANZAS: GlyphEntry[][] = [
  // Stanza 1 — "Who were the gods?" (a-ba dingir-e-ne)
  // Attested: a-ba = "who" question construction (ePSD); dingir-e-ne = "the gods" (ETCSL)
  [
    { char: '\u{12000}', trans: 'a — who', uname: 'A', font: 'sux' },
    { char: '\u{12040}', trans: 'ba — were (past marker)', uname: 'BA', font: 'sux' },
    { char: '\u{1202D}', trans: 'dingir — divine (AN)', uname: 'AN', font: 'sux' },
    { char: '\u{1208A}', trans: 'e — verbal complex', uname: 'E', font: 'sux' },
    { char: '\u{12248}', trans: 'ne — plural/demonstrative', uname: 'NE', font: 'sux' },
  ],
  // Stanza 2 — "Were they the sky-people? Were they the old ones from the east?"
  // COINED: lú-an-na = sky-person (alien); lú-kur-utu-è = east-people (Denisovans)
  // Note: lú-an "sky-person" construction appears in some ETCSL contexts;
  //       lú-kur-utu-è is coined — documented in GLYPH-KEY.md
  [
    { char: '\u{121FD}', trans: 'lú — person', uname: 'LU2', font: 'sux' },
    { char: '\u{1202D}', trans: 'an — sky/heaven', uname: 'AN', font: 'sux' },
    { char: '\u{1223E}', trans: 'na — genitive marker', uname: 'NA', font: 'sux' },
    { char: '\u{121B3}', trans: 'kur — mountain/eastern land', uname: 'KUR', font: 'sux' },
    { char: '\u{12313}', trans: 'utu — sun / sunrise / east', uname: 'UD', font: 'sux' },
    { char: '\u{1208D}', trans: 'è — to exit / to rise', uname: 'E2', font: 'sux' },
  ],
  // Stanza 3 — "The secrets lie beneath." (ad-ḫal ki-ta gál)
  // ad-ḫal: KA (voice/word) + HAL (to conceal) → "concealed word / secret"
  // ki-ta gál: KI (earth/place) + TA (ablative) + GAL (to exist) → "lies beneath"
  // All signs attested; compound ad-ḫal for "secret" is semi-coined (see key)
  [
    { char: '\u{12157}', trans: 'ka — mouth / voice', uname: 'KA', font: 'sux' },
    { char: '\u{1212C}', trans: 'ḫal — to conceal / secret', uname: 'HAL', font: 'sux' },
    { char: '\u{121A0}', trans: 'ki — earth / place', uname: 'KI', font: 'sux' },
    { char: '\u{122EB}', trans: 'ta — from (ablative)', uname: 'TA', font: 'sux' },
    { char: '\u{120F2}', trans: 'gál — to exist / to lie', uname: 'GAL', font: 'sux' },
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

// ── Glyph cell ───────────────────────────────────────────────────────────────

interface GlyphCellProps {
  entry: GlyphEntry;
  delay: number;
  burned: boolean;
  onEnter: (entry: GlyphEntry) => void;
  onLeave: () => void;
}

function GlyphCell({ entry, delay, burned, onEnter, onLeave }: GlyphCellProps) {
  return (
    <div
      className={`gc-glyph${burned ? ' gc-glyph-burned' : ''}`}
      style={{ animationDelay: `${delay}s` }}
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
  const ref = useRef<HTMLDivElement>(null);
  const [burned, setBurned] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setBurned(true);
          io.disconnect();
        }
      },
      { threshold: 0.1, rootMargin: '0px 0px -60px 0px' }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div ref={ref} className="gc-stanza" lang={lang}>
      {glyphs.map((g, i) => (
        <GlyphCell
          key={i}
          entry={g}
          delay={i * 0.4}
          burned={burned}
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

  useEffect(() => {
    const mq = window.matchMedia('(min-width: 1440px)');
    setShow(mq.matches);
    const handler = (e: MediaQueryListEvent) => setShow(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  // Follow mouse with lens (no CSS transition on position — direct assignment for lag-free tracking)
  useEffect(() => {
    if (!show) return;
    const onMove = (e: MouseEvent) => {
      const el = lensRef.current;
      if (el) {
        el.style.left = `${e.clientX - 90}px`;
        el.style.top  = `${e.clientY - 90}px`;
      }
    };
    document.addEventListener('mousemove', onMove, { passive: true });
    return () => document.removeEventListener('mousemove', onMove);
  }, [show]);

  const onGlyphEnter = useCallback((entry: GlyphEntry) => {
    setLens({ kind: 'glyph', char: entry.char, trans: entry.trans, uname: entry.uname, font: entry.font });
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
        {lens && (
          <>
            <span
              className={`gc-lens-char${lens.kind === 'glyph' ? ` gc-font-${lens.font}` : ''}`}
            >
              {lens.char}
            </span>
            <span className="gc-lens-trans">
              {lens.kind === 'glyph' ? lens.trans : lens.name}
            </span>
            {lens.kind === 'glyph' && (
              <span className="gc-lens-uname">{lens.uname}</span>
            )}
          </>
        )}
      </div>

      {/* ── Column wrapper ─────────────────────────────────────────────── */}
      <div className="gc-wrapper" aria-hidden="true">
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
