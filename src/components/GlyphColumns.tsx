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

const S1L = 'Do the gods hold the answers?';
const S2L = 'Where is the deepest wisdom? Thoth knows.';
const S3L = 'Who built the pyramids?';

const LEFT_STANZAS: GlyphEntry[][] = [
  // Stanza 1 — "Do the gods hold the answers?" (in-iw nṯrw ḫr wšbw)
  [
    { char: '\u{131CB}', phon: 'ı͗', uname: 'M017', font: 'egy', word: 'ı͗',    gloss: 'interrogative',     stanzaEn: S1L, highlight: 'Do' },
    { char: '\u{13216}', phon: 'n',  uname: 'N035', font: 'egy', word: 'nṯrw', gloss: 'the gods',          stanzaEn: S1L, highlight: 'the gods' },
    { char: '\u{13146}', phon: 'nṯr',uname: 'G007', font: 'egy', word: 'nṯrw', gloss: 'gods (divine)',     stanzaEn: S1L, highlight: 'the gods' },
    { char: '\u{1308B}', phon: 'r',  uname: 'D021', font: 'egy', word: 'ḫr',   gloss: 'hold / possess',    stanzaEn: S1L, highlight: 'hold' },
    { char: '\u{13079}', phon: 'Wḏꜣt',uname:'D004',font: 'egy', word: 'Wḏꜣt', gloss: 'the answers',       stanzaEn: S1L, highlight: 'the answers?' },
  ],
  // Stanza 2 — "Where is the deepest wisdom? Thoth knows." (Ḏḥwty rḫ sb3yt wr)
  [
    { char: '\u{1305F}', phon: 'nṯr', uname: 'C003', font: 'egy', word: 'nṯr',   gloss: 'divine / sacred', stanzaEn: S2L, highlight: 'Where' },
    { char: '\u{130DD}', phon: 'Ḏḥwty',uname:'E010',font: 'egy', word: 'Ḏḥwty', gloss: 'Thoth',           stanzaEn: S2L, highlight: 'Thoth' },
    { char: '\u{1313F}', phon: 'ꜣ',  uname: 'G001', font: 'egy', word: 'sb3yt', gloss: 'the deepest wisdom',stanzaEn: S2L, highlight: 'the deepest wisdom?' },
    { char: '\u{131F3}', phon: 'Rꜥ', uname: 'N005', font: 'egy', word: 'sb3yt', gloss: 'wisdom',           stanzaEn: S2L, highlight: 'the deepest wisdom?' },
    { char: '\u{13093}', phon: 'kꜣ', uname: 'D028', font: 'egy', word: 'rḫ',   gloss: 'knows',            stanzaEn: S2L, highlight: 'Thoth knows.' },
  ],
  // Stanza 3 — "Who built the pyramids?" (in-m ḳd mrw)
  [
    { char: '\u{13000}', phon: 'rmṯ', uname: 'A001', font: 'egy', word: 'in-m', gloss: 'who',             stanzaEn: S3L, highlight: 'Who' },
    { char: '\u{131CC}', phon: 'y',  uname: 'M017A',font: 'egy', word: 'ḳd',   gloss: 'built / shaped',  stanzaEn: S3L, highlight: 'built' },
    { char: '\u{13171}', phon: 'w',  uname: 'G043', font: 'egy', word: 'ḳd',   gloss: 'built',           stanzaEn: S3L, highlight: 'built' },
    { char: '\u{13274}', phon: 'mr', uname: 'O024', font: 'egy', word: 'mrw',  gloss: 'the pyramids',    stanzaEn: S3L, highlight: 'the pyramids?' },
    { char: '\u{1305B}', phon: 'nṯr',uname: 'C002', font: 'egy', word: 'mrw',  gloss: 'pyramid (divine)',stanzaEn: S3L, highlight: 'the pyramids?' },
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

const S1R = 'Who were the gods?';
const S2R = 'Were they the sky-people? The old ones from the east?';
const S3R = 'The secrets lie beneath.';

const RIGHT_STANZAS: GlyphEntry[][] = [
  // Stanza 1 — "Who were the gods?" (a-ba dingir-e-ne)
  // Attested: a-ba = "who" (ePSD); dingir-e-ne = "the gods" (ETCSL)
  [
    { char: '\u{12000}', phon: 'a',      uname: 'A',   font: 'sux', word: 'a-ba',       gloss: 'who',          stanzaEn: S1R, highlight: 'Who' },
    { char: '\u{12040}', phon: 'ba',     uname: 'BA',  font: 'sux', word: 'a-ba',       gloss: 'were',         stanzaEn: S1R, highlight: 'were' },
    { char: '\u{1202D}', phon: 'dingir', uname: 'AN',  font: 'sux', word: 'dingir-e-ne',gloss: 'the gods',     stanzaEn: S1R, highlight: 'the gods?' },
    { char: '\u{1208A}', phon: 'e',      uname: 'E',   font: 'sux', word: 'dingir-e-ne',gloss: 'verbal marker',stanzaEn: S1R, highlight: 'the gods?' },
    { char: '\u{12248}', phon: 'ne',     uname: 'NE',  font: 'sux', word: 'dingir-e-ne',gloss: 'plural (gods)',stanzaEn: S1R, highlight: 'the gods?' },
  ],
  // Stanza 2 — "Were they the sky-people? The old ones from the east?"
  // lú-an-na = sky-person (semi-coined); lú-kur-utu-è = east-people (coined, see GLYPH-KEY.md)
  [
    { char: '\u{121FD}', phon: 'lú',   uname: 'LU2', font: 'sux', word: 'lú-an-na',    gloss: 'sky-people',         stanzaEn: S2R, highlight: 'sky-people?' },
    { char: '\u{1202D}', phon: 'an',   uname: 'AN',  font: 'sux', word: 'lú-an-na',    gloss: 'sky / heaven',       stanzaEn: S2R, highlight: 'the sky-people?' },
    { char: '\u{1223E}', phon: 'na',   uname: 'NA',  font: 'sux', word: 'lú-an-na',    gloss: 'genitive of sky',    stanzaEn: S2R, highlight: 'the sky-people?' },
    { char: '\u{121B3}', phon: 'kur',  uname: 'KUR', font: 'sux', word: 'lú-kur-utu-è',gloss: 'eastern ones',       stanzaEn: S2R, highlight: 'The old ones from the east?' },
    { char: '\u{12313}', phon: 'utu',  uname: 'UD',  font: 'sux', word: 'lú-kur-utu-è',gloss: 'sunrise / east',     stanzaEn: S2R, highlight: 'from the east?' },
    { char: '\u{1208D}', phon: 'è',    uname: 'E2',  font: 'sux', word: 'lú-kur-utu-è',gloss: 'arising from',       stanzaEn: S2R, highlight: 'from the east?' },
  ],
  // Stanza 3 — "The secrets lie beneath." (ad-ḫal ki-ta gál)
  // ad-ḫal: concealed word/secret; ki-ta gál: lies beneath (all signs attested)
  [
    { char: '\u{12157}', phon: 'ka',  uname: 'KA',  font: 'sux', word: 'ad-ḫal', gloss: 'the secrets',   stanzaEn: S3R, highlight: 'The secrets' },
    { char: '\u{1212C}', phon: 'ḫal', uname: 'HAL', font: 'sux', word: 'ad-ḫal', gloss: 'concealed',     stanzaEn: S3R, highlight: 'The secrets' },
    { char: '\u{121A0}', phon: 'ki',  uname: 'KI',  font: 'sux', word: 'ki-ta',  gloss: 'earth / below', stanzaEn: S3R, highlight: 'lie beneath.' },
    { char: '\u{122EB}', phon: 'ta',  uname: 'TA',  font: 'sux', word: 'ki-ta',  gloss: 'from beneath',  stanzaEn: S3R, highlight: 'lie beneath.' },
    { char: '\u{120F2}', phon: 'gál', uname: 'GAL', font: 'sux', word: 'gál',    gloss: 'to lie / exist',stanzaEn: S3R, highlight: 'lie beneath.' },
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

// ── Canvas fire-burn helper ───────────────────────────────────────────────────

const BURN_BG = 'rgb(16, 13, 9)'; // warm dark to match amber column ground, not cold navy

function startBurn(el: HTMLElement, delay: number): () => void {
  const canvas = document.createElement('canvas');
  Object.assign(canvas.style, {
    position: 'absolute', inset: '0', width: '100%', height: '100%',
    pointerEvents: 'none', zIndex: '2',
  });
  el.appendChild(canvas);

  let rafId = 0;
  let timerId: ReturnType<typeof setTimeout>;

  const run = () => {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const W = el.offsetWidth;
    const H = el.offsetHeight;
    if (!W || !H) { canvas.remove(); return; }

    canvas.width = Math.round(W * dpr);
    canvas.height = Math.round(H * dpr);
    const ctx = canvas.getContext('2d')!;
    ctx.scale(dpr, dpr);
    ctx.fillStyle = BURN_BG;
    ctx.fillRect(0, 0, W, H);

    const DURATION = 3000;
    const LEAD = 22;  // fire gradient height above revealed area (px)
    const TRAIL = 7;  // fire penetration below front into hidden area (px)

    const phases = new Float32Array(Math.ceil(W) + 2);
    for (let i = 0; i < phases.length; i++) phases[i] = Math.random() * Math.PI * 2;

    const start = performance.now();
    const frame = (now: number) => {
      const t = Math.min(1, (now - start) / DURATION);
      const tBase = t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
      ctx.clearRect(0, 0, W, H);

      for (let x = 0; x <= W; x++) {
        const noise =
          Math.sin(phases[x] + t * 9.1) * 0.065 +
          Math.sin(phases[x] * 1.71 + t * 5.3) * 0.04 +
          Math.sin(phases[x] * 3.2  + t * 13)  * 0.02;
        const frontY = (tBase + noise) * H;

        // Hidden area (below front + trail): fill bg
        const bgStart = Math.max(0, frontY - TRAIL);
        if (bgStart < H) {
          ctx.fillStyle = BURN_BG;
          ctx.fillRect(x, bgStart, 1, H - bgStart);
        }

        // Fire gradient strip
        const ft = Math.max(0, frontY - LEAD);
        const fb = Math.min(H, frontY + TRAIL);
        if (ft < fb) {
          const grd = ctx.createLinearGradient(0, ft, 0, fb);
          grd.addColorStop(0.00, 'rgba(255,230,110,0.00)');
          grd.addColorStop(0.15, 'rgba(255,210, 80,0.55)');
          grd.addColorStop(0.40, 'rgba(255,140, 20,0.92)');
          grd.addColorStop(0.65, 'rgba(255, 55,  8,0.98)');
          grd.addColorStop(0.85, 'rgba(200, 25,  5,0.75)');
          grd.addColorStop(1.00, 'rgba( 60,  8,  2,0.00)');
          ctx.fillStyle = grd;
          ctx.fillRect(x, ft, 1, fb - ft);
        }
      }

      if (t < 1) {
        rafId = requestAnimationFrame(frame);
      } else {
        ctx.clearRect(0, 0, W, H);
        canvas.remove();
      }
    };
    rafId = requestAnimationFrame(frame);
  };

  timerId = setTimeout(run, delay * 1000);
  return () => { clearTimeout(timerId); cancelAnimationFrame(rafId); canvas.remove(); };
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
    return startBurn(el, jitterRef.current!);
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
