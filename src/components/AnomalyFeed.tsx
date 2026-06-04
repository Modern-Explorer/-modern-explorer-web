import { useState, useEffect, useRef } from 'react';

export interface AnomalyReport {
  id: string;
  date: string;
  location: string;
  county?: string;
  category: 'ufo' | 'cryptid' | 'mutilation' | 'paranormal';
  shape?: string;
  summary: string;
  source: string;
  lat?: number;
  lng?: number;
}

const CAT_CONFIG = {
  ufo:        { label: 'UAP/UFO',     color: 'rgba(203,243,110,1)',   bg: 'rgba(203,243,110,.1)',  icon: '◈' },
  cryptid:    { label: 'Cryptid',     color: 'rgba(245,158,11,1)',    bg: 'rgba(245,158,11,.1)',   icon: '⬡' },
  mutilation: { label: 'Mutilation',  color: 'rgba(239,68,68,1)',     bg: 'rgba(239,68,68,.1)',    icon: '⬤' },
  paranormal: { label: 'Paranormal',  color: 'rgba(99,179,237,1)',    bg: 'rgba(99,179,237,.1)',   icon: '◎' },
} as const;

function fmt(iso: string) {
  const d = new Date(iso + 'T12:00:00');
  return isNaN(d.getTime()) ? iso : d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

function CoordBadge({ lat, lng }: { lat?: number; lng?: number }) {
  if (!lat || !lng) return null;
  const ns = lat >= 0 ? 'N' : 'S';
  const ew = lng >= 0 ? 'E' : 'W';
  return (
    <span style={{ fontFamily:"'Courier New',monospace", fontSize:9, color:'rgba(150,180,140,.5)', letterSpacing:'.05em', marginLeft:6 }}>
      {Math.abs(lat).toFixed(2)}°{ns} {Math.abs(lng).toFixed(2)}°{ew}
    </span>
  );
}

export default function AnomalyFeed() {
  const [reports, setReports]           = useState<AnomalyReport[]>([]);
  const [loading, setLoading]           = useState(true);
  const [error, setError]               = useState('');
  const [activeFilters, setActiveFilters] = useState<Set<string>>(new Set(['ufo','cryptid','mutilation','paranormal']));
  const [lastUpdated, setLastUpdated]   = useState<Date | null>(null);
  const prevIdsRef                      = useRef<Set<string>>(new Set());
  const seenFirstLoad                   = useRef(false);

  const load = async () => {
    try {
      const res = await fetch('/api/anomaly-feed');
      if (!res.ok) throw new Error('Feed unavailable');
      const data: AnomalyReport[] = await res.json();
      setReports(data);
      setLastUpdated(new Date());

      // Detect new reports after first load
      if (seenFirstLoad.current) {
        const newOnes = data.filter(r => !prevIdsRef.current.has(r.id));
        if (newOnes.length > 0) {
          const r = newOnes[0];
          window.dispatchEvent(new CustomEvent('mesa:field-report', {
            detail: { note: `New field report logged — ${r.location}. Category: ${CAT_CONFIG[r.category]?.label ?? r.category}. Source: ${r.source}.` },
          }));
        }
      } else {
        // First load — fire intro pulse
        window.dispatchEvent(new CustomEvent('mesa:field-report', {
          detail: { note: "You are viewing Christopher O'Brien's life work — 30 years of field investigation in this valley. Some locations have been approximated for safety. Explore with respect." },
        }));
        seenFirstLoad.current = true;
      }
      prevIdsRef.current = new Set(data.map(r => r.id));
    } catch (e) {
      setError('Feed signal interrupted. Retry pending.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    const interval = setInterval(load, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  const toggleFilter = (cat: string) => {
    setActiveFilters(prev => {
      const next = new Set(prev);
      if (next.has(cat)) {
        if (next.size === 1) return prev; // keep at least one
        next.delete(cat);
      } else {
        next.add(cat);
      }
      return next;
    });
  };

  const visible = reports.filter(r => activeFilters.has(r.category));

  return (
    <>
      <style>{`
        @keyframes feedSlideIn {
          from { opacity:0; transform:translateY(-8px); }
          to   { opacity:1; transform:translateY(0); }
        }
        .af-row { animation: feedSlideIn .25s ease-out; }
        .af-scroll::-webkit-scrollbar { width:3px; }
        .af-scroll::-webkit-scrollbar-track { background:transparent; }
        .af-scroll::-webkit-scrollbar-thumb { background:rgba(203,243,110,.15); border-radius:2px; }
      `}</style>

      <div style={{ display:'flex', flexDirection:'column', height:'100%', background:'rgba(2,10,3,.85)', border:'1px solid rgba(203,243,110,.2)', borderRadius:6, overflow:'hidden' }}>

        {/* Header */}
        <div style={{ padding:'14px 16px 10px', borderBottom:'1px solid rgba(203,243,110,.1)', background:'rgba(1,8,2,.9)', flexShrink:0 }}>
          <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:10 }}>
            <div style={{ display:'flex', alignItems:'center', gap:8 }}>
              <span style={{ width:6, height:6, borderRadius:'50%', background:'#4ade80', boxShadow:'0 0 5px #4ade80', display:'inline-block', flexShrink:0 }} />
              <span style={{ fontFamily:"'Courier New',monospace", fontSize:10, fontWeight:700, letterSpacing:'.16em', color:'rgba(203,243,110,.8)', textTransform:'uppercase' }}>
                LIVE ANOMALY FEED
              </span>
            </div>
            {lastUpdated && (
              <span style={{ fontFamily:"'Courier New',monospace", fontSize:9, color:'rgba(100,150,80,.45)', letterSpacing:'.06em' }}>
                REFRESHED {lastUpdated.toLocaleTimeString('en-US', { hour:'2-digit', minute:'2-digit' })}
              </span>
            )}
          </div>

          {/* Category filters */}
          <div style={{ display:'flex', gap:5, flexWrap:'wrap' }}>
            {(Object.entries(CAT_CONFIG) as [string, typeof CAT_CONFIG[keyof typeof CAT_CONFIG]][]).map(([key, cfg]) => {
              const on = activeFilters.has(key);
              return (
                <button key={key} onClick={() => toggleFilter(key)} style={{
                  padding:'3px 9px',
                  fontFamily:"'Courier New',monospace", fontSize:9, fontWeight:700, letterSpacing:'.1em', textTransform:'uppercase',
                  border:`1px solid ${on ? cfg.color : 'rgba(100,130,90,.25)'}`,
                  background: on ? cfg.bg : 'transparent',
                  color: on ? cfg.color : 'rgba(100,130,90,.45)',
                  borderRadius:2, cursor:'pointer',
                  transition:'all .15s ease',
                }}>
                  {cfg.icon} {cfg.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Feed list */}
        <div className="af-scroll" style={{ flex:1, overflowY:'auto', padding:'10px 0' }}>
          {loading && (
            <div style={{ padding:'24px 16px', fontFamily:"'Courier New',monospace", fontSize:11, color:'rgba(100,150,80,.5)', letterSpacing:'.08em' }}>
              ESTABLISHING SIGNAL…
            </div>
          )}
          {error && !loading && (
            <div style={{ padding:'16px', fontFamily:"'Courier New',monospace", fontSize:11, color:'rgba(220,80,80,.7)', letterSpacing:'.06em' }}>
              ⚠ {error}
            </div>
          )}
          {!loading && visible.length === 0 && (
            <div style={{ padding:'16px', fontFamily:"'Courier New',monospace", fontSize:11, color:'rgba(100,150,80,.5)' }}>
              No reports match active filters.
            </div>
          )}
          {!loading && visible.map((r, i) => {
            const cfg = CAT_CONFIG[r.category];
            return (
              <div key={r.id} className="af-row" style={{
                padding:'10px 16px',
                borderBottom:'1px solid rgba(203,243,110,.05)',
                borderLeft:`2px solid ${i === 0 ? cfg.color : 'transparent'}`,
                transition:'border-left-color .2s',
              }}
                onMouseEnter={e => (e.currentTarget.style.borderLeftColor = cfg.color)}
                onMouseLeave={e => (e.currentTarget.style.borderLeftColor = i === 0 ? cfg.color : 'transparent')}
              >
                {/* Row header */}
                <div style={{ display:'flex', alignItems:'center', gap:6, marginBottom:5, flexWrap:'wrap' }}>
                  <span style={{ fontFamily:"'Courier New',monospace", fontSize:9, fontWeight:700, letterSpacing:'.08em', color:cfg.color, background:cfg.bg, padding:'2px 7px', borderRadius:2 }}>
                    {cfg.icon} {cfg.label}
                  </span>
                  <span style={{ fontFamily:"'Courier New',monospace", fontSize:9, color:'rgba(150,180,140,.6)', letterSpacing:'.06em' }}>
                    {fmt(r.date)}
                  </span>
                  {r.shape && (
                    <span style={{ fontFamily:"'Courier New',monospace", fontSize:9, color:'rgba(130,160,120,.45)', letterSpacing:'.04em' }}>
                      · {r.shape}
                    </span>
                  )}
                </div>

                {/* Location */}
                <div style={{ display:'flex', alignItems:'baseline', gap:0, marginBottom:4 }}>
                  <span style={{ fontFamily:"'Courier New',monospace", fontSize:10, fontWeight:700, color:'rgba(203,243,110,.75)', letterSpacing:'.04em' }}>
                    {r.location}
                  </span>
                  <CoordBadge lat={r.lat} lng={r.lng} />
                </div>

                {/* Summary */}
                <p style={{ fontFamily:"'Courier New',monospace", fontSize:11, color:'rgba(160,200,140,.65)', lineHeight:1.6, margin:'0 0 5px' }}>
                  {r.summary}
                </p>

                {/* Source */}
                <span style={{ fontFamily:"'Courier New',monospace", fontSize:9, color:'rgba(100,140,80,.4)', letterSpacing:'.08em' }}>
                  SRC: {r.source}
                </span>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div style={{ padding:'8px 16px', borderTop:'1px solid rgba(203,243,110,.08)', background:'rgba(1,8,2,.9)', flexShrink:0 }}>
          <p style={{ fontFamily:"'Courier New',monospace", fontSize:9, color:'rgba(80,120,65,.45)', lineHeight:1.5, margin:0 }}>
            Sources: NUFORC · BFRO · O'Brien Field Archives · MUFON<br />
            Unverified witness accounts. Historical coordinates approximate.
          </p>
        </div>
      </div>
    </>
  );
}
