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
  ufo:        { label: 'UAP/UFO',    color: 'rgba(203,243,110,1)',  bg: 'rgba(203,243,110,.1)',  icon: '◈' },
  cryptid:    { label: 'Cryptid',    color: 'rgba(245,158,11,1)',   bg: 'rgba(245,158,11,.1)',   icon: '⬡' },
  mutilation: { label: 'Mutilation', color: 'rgba(239,68,68,1)',    bg: 'rgba(239,68,68,.1)',    icon: '⬤' },
  paranormal: { label: 'Paranormal', color: 'rgba(99,179,237,1)',   bg: 'rgba(99,179,237,.1)',   icon: '◎' },
} as const;

// Inline baseline — always available, no server required
// Sources: NUFORC public database, BFRO reports, O'Brien field archives, historical record
const BASELINE: AnomalyReport[] = [
  { id:'nuforc-2024-002', date:'2024-09-07', location:'Saguache, CO', county:'Saguache County', category:'paranormal',
    summary:'Resident reported cattle acting erratically for 3 days preceding discovery of a 28-foot flattened circle in adjacent alfalfa field. No mechanical equipment access. Plants were bent, not broken. Filed with NUFORC and MUFON.',
    source:'NUFORC / MUFON', lat:38.09, lng:-106.14 },
  { id:'nuforc-2024-001', date:'2024-03-15', location:'Hooper, CO', county:'Alamosa County', category:'ufo',
    summary:'Amber sphere observed hovering over irrigated fields east of the UFO Watchtower for 12 minutes. Photographed by two witnesses. Object descended to approximately 200 feet altitude then vanished without accelerating.',
    source:'NUFORC', lat:37.76, lng:-106.03 },
  { id:'nuforc-2023-001', date:'2023-02-28', location:'Alamosa County, CO', county:'Alamosa County', category:'mutilation',
    summary:'Rancher discovered bovine with precision incisions to jaw, left ear, and rectum. No tracks, no blood, no signs of predator activity. Sheriff\'s office responded. Case documented by county animal control.',
    source:'NUFORC', lat:37.51, lng:-105.72 },
  { id:'nuforc-2022-001', date:'2022-06-11', location:'Crestone, CO', county:'Saguache County', category:'ufo',
    summary:'Three residents in separate locations independently reported the same large green fireball descending over the Sangre de Cristos at 11:47 PM. Object appeared to decelerate before disappearing behind the ridge. No meteor shower active.',
    source:'NUFORC', lat:37.99, lng:-105.69 },
  { id:'nuforc-2021-001', date:'2021-08-22', location:'Del Norte, CO', county:'Rio Grande County', category:'ufo',
    summary:'Retired sheriff\'s deputy reported a rapidly moving light that executed a 90-degree turn at speed estimated in excess of Mach 3 based on angular velocity. No sonic boom. Object disappeared in the direction of Blanca Peak.',
    source:'NUFORC', lat:37.68, lng:-106.35 },
  { id:'bfro-2019-utm', date:'2019-09-01', location:'Near Ute Mountain, CO', county:'Costilla County', category:'cryptid',
    summary:'Two hunters encountered two extremely tall hooded figures with oversized heads at close range. Before departing the area, witnesses also found a 50–60 foot structure of unknown origin in the wilderness. "We\'re a couple of guys that don\'t believe in much. But we believe now."',
    source:'BFRO', lat:37.35, lng:-105.35 },
  { id:'nuforc-2019-001', date:'2019-04-17', location:'Alamosa, CO', county:'Alamosa County', category:'ufo',
    summary:'Two witnesses observed a bright orange sphere follow their vehicle for approximately 1.4 miles along Highway 160. Object matched vehicle speed before stopping and hovering. Mirrors the pattern of a 1994 documented encounter in the same corridor.',
    source:'NUFORC', lat:37.47, lng:-105.87 },
  { id:'nuforc-2018-001', date:'2018-07-04', location:'Hooper, CO', county:'Alamosa County', category:'ufo',
    summary:'UFO Watchtower on-site report: triangular craft with lights at each vertex traversed from north to south in approximately 6 seconds. Estimated size larger than commercial aircraft. Logged as one of 304+ documented sightings at this location.',
    source:'NUFORC / UFO Watchtower Log', lat:37.76, lng:-106.03 },
  { id:'obrien-2016-001', date:'2016-10-29', location:'Baca Grande, CO', county:'Saguache County', category:'paranormal',
    summary:'Property owner reported unusual electromagnetic interference — watches stopping, vehicle electronics malfunctioning — along with strong infrasound sensations and two nights of anomalous amber lights on the adjacent ridge.',
    source:"O'Brien Field Archives", lat:37.95, lng:-105.65 },
  { id:'nuforc-2014-001', date:'2014-03-09', location:'Saguache, CO', county:'Saguache County', category:'ufo',
    summary:'Multiple residents reported a hovering white light that changed from white to amber to red before disappearing. Estimated altitude 500–800 feet. No aircraft in FAA records for the area at that time.',
    source:'NUFORC', lat:38.09, lng:-106.14 },
  { id:'bfro-2010-001', date:'2010-06-03', location:'Sangre de Cristo Range, CO', county:'Saguache County', category:'cryptid',
    summary:'Backpacker at 11,200 feet elevation reported large bipedal figure crossing open talus field above treeline. Observed for approximately 90 seconds through binoculars at 200-yard distance. Filed with BFRO.',
    source:'BFRO', lat:38.10, lng:-105.60 },
  { id:'nuforc-2008-001', date:'2008-09-14', location:'Monte Vista, CO', county:'Rio Grande County', category:'ufo', shape:'Disc',
    summary:'Disc-shaped craft with pulsing white perimeter lights observed hovering for approximately 8 minutes before accelerating vertically at extreme speed. No sound reported. Three independent witnesses.',
    source:'NUFORC', lat:37.58, lng:-106.15 },
  { id:'obrien-2002-001', date:'2002-07-15', location:'San Luis Valley, CO', county:'Saguache County', category:'mutilation',
    summary:'Cattle mutilation documented by field investigator Christopher O\'Brien. Classic presentation: surgical incisions, bloodless, selective organ removal. Third documented case in county in 18 months.',
    source:"O'Brien Field Archives", lat:37.80, lng:-105.95 },
  { id:'bfro-2000-blanca', date:'2000-08-01', location:'Blanca Peak, CO', county:'Alamosa / Costilla County', category:'cryptid',
    summary:'Two ATV operators encountered a large bipedal creature on the Blanca Massif. Filed formal report with the Bigfoot Field Researchers Organization. Described as very large, moving on two legs, covered in dark hair. BFRO investigation confirmed credible witnesses.',
    source:'BFRO', lat:37.57, lng:-105.49 },
  { id:'nuforc-1998-002', date:'1998-12-09', location:'Alamosa, CO', county:'Alamosa County', category:'ufo', shape:'Oval',
    summary:'Police officer on routine northbound patrol observed oval-shaped object with no sound. Filed formal report with agency. Submitted to NUFORC.',
    source:'NUFORC', lat:37.47, lng:-105.87 },
  { id:'nuforc-1998-001', date:'1998-02-13', location:'Crestone, CO', county:'Saguache County', category:'ufo', shape:'Light',
    summary:'Large amber light observed at the top of the Sangre de Cristo range, approximately 10,000 feet elevation. Stationary for several minutes then moved laterally before disappearing.',
    source:'NUFORC', lat:37.99, lng:-105.69 },
  { id:'nuforc-1997-001', date:'1997-06-20', location:'West of Alamosa, CO', county:'Alamosa County', category:'ufo', shape:'Light',
    summary:'Bright silverish-white light 5 degrees above horizon with occasional red flashes, observed approximately 50 miles northwest of Alamosa for 20+ minutes. No conventional aircraft explanation.',
    source:'NUFORC', lat:37.47, lng:-106.10 },
  { id:'nuforc-1967-003', date:'1967-09-03', location:'Near Crestone, CO', county:'Saguache County', category:'ufo', shape:'Fireball',
    summary:'Three house-sized balls of fire descended vertically then accelerated horizontally, covering an estimated 40 miles in 3–4 seconds. Multiple witnesses in adjacent counties corroborated.',
    source:'NUFORC', lat:37.99, lng:-105.69 },
  { id:'historical-snippy', date:'1967-09-09', location:'King Ranch, near Alamosa, CO', county:'Alamosa County', category:'mutilation',
    summary:'Appaloosa mare Lady (Snippy) found with head and neck stripped to bone with surgical precision. Zero blood at scene. Tracks ended 100 feet from carcass. A Superior Court judge and wife reported three reddish-orange rings in triangular formation the same evening. First formally documented large-animal mutilation in history.',
    source:'Historical Record / NUFORC', lat:37.47, lng:-105.87 },
];

function fmt(iso: string) {
  const d = new Date(iso + 'T12:00:00');
  return isNaN(d.getTime()) ? iso : d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

function CoordBadge({ lat, lng }: { lat?: number; lng?: number }) {
  if (!lat || !lng) return null;
  const ns = lat >= 0 ? 'N' : 'S';
  const ew = lng >= 0 ? 'E' : 'W';
  return (
    <span style={{ fontFamily:"'Courier New',monospace", fontSize:9, color:'rgba(150,180,140,.45)', letterSpacing:'.05em', marginLeft:6 }}>
      {Math.abs(lat).toFixed(2)}°{ns} {Math.abs(lng).toFixed(2)}°{ew}
    </span>
  );
}

export default function AnomalyFeed() {
  const [reports, setReports]             = useState<AnomalyReport[]>(BASELINE);
  const [liveLoaded, setLiveLoaded]       = useState(false);
  const [lastUpdated, setLastUpdated]     = useState<Date | null>(null);
  const [activeFilters, setActiveFilters] = useState<Set<string>>(new Set(['ufo','cryptid','mutilation','paranormal']));
  const [hoveredId, setHoveredId]         = useState<string | null>(null);
  const [tappedIds, setTappedIds]         = useState<Set<string>>(new Set());
  const prevIdsRef                        = useRef<Set<string>>(new Set(BASELINE.map(r => r.id)));
  const seenFirstLoad                     = useRef(false);

  useEffect(() => {
    // Fire MESA intro note on mount
    const t = setTimeout(() => {
      window.dispatchEvent(new CustomEvent('mesa:field-report', {
        detail: { note: "You are viewing Christopher O'Brien's life work — 30 years of field investigation in this valley. Some locations have been approximated for safety. Explore with respect." },
      }));
      seenFirstLoad.current = true;
    }, 800);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    const tryLive = async () => {
      try {
        const ctrl = new AbortController();
        const timeout = setTimeout(() => ctrl.abort(), 8000);

        // Try combined feed AND dedicated proxy endpoints in parallel
        const [feedRes, ufoRes, bfroRes] = await Promise.allSettled([
          fetch('/api/anomaly-feed',     { signal: ctrl.signal }),
          fetch('/api/ufo-reports',      { signal: ctrl.signal }),
          fetch('/api/bigfoot-reports',  { signal: ctrl.signal }),
        ]);
        clearTimeout(timeout);

        // Collect all successfully parsed arrays
        const all: AnomalyReport[] = [];
        for (const result of [feedRes, ufoRes, bfroRes]) {
          if (result.status === 'fulfilled' && result.value.ok) {
            try {
              const d: AnomalyReport[] = await result.value.json();
              if (Array.isArray(d)) all.push(...d);
            } catch { /* ignore parse errors */ }
          }
        }

        // Deduplicate by id, keep newest first
        const seen = new Set<string>();
        const data = all.filter(r => {
          if (seen.has(r.id)) return false;
          seen.add(r.id);
          return true;
        }).sort((a, b) => (b.date > a.date ? 1 : -1));

        if (data.length === 0) return;

        // Detect new entries vs what's already shown
        const newOnes = data.filter(r => !prevIdsRef.current.has(r.id));
        setReports(data);
        setLiveLoaded(true);
        setLastUpdated(new Date());
        prevIdsRef.current = new Set(data.map(r => r.id));

        if (newOnes.length > 0 && seenFirstLoad.current) {
          const r = newOnes[0];
          window.dispatchEvent(new CustomEvent('mesa:field-report', {
            detail: { note: `New field report logged — ${r.location}. Category: ${CAT_CONFIG[r.category]?.label ?? r.category}. Source: ${r.source}.` },
          }));
        }
      } catch {
        // silently keep showing baseline
      }
    };

    tryLive();
    const interval = setInterval(tryLive, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  const toggleFilter = (cat: string) => {
    setActiveFilters(prev => {
      const next = new Set(prev);
      if (next.has(cat)) {
        if (next.size === 1) return prev;
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
          from { opacity:0; transform:translateY(-6px); }
          to   { opacity:1; transform:translateY(0); }
        }
        .af-row { animation: feedSlideIn .22s ease-out; }
        .af-scroll::-webkit-scrollbar { width:3px; }
        .af-scroll::-webkit-scrollbar-track { background:transparent; }
        .af-scroll::-webkit-scrollbar-thumb { background:rgba(203,243,110,.15); border-radius:2px; }
      `}</style>

      <div style={{ display:'flex', flexDirection:'column', background:'rgba(2,10,3,.9)', border:'1px solid rgba(203,243,110,.22)', borderRadius:6, overflow:'hidden', height:480 }}>

        {/* Header */}
        <div style={{ padding:'12px 16px 10px', borderBottom:'1px solid rgba(203,243,110,.1)', background:'rgba(1,8,2,.95)', flexShrink:0 }}>
          <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:9 }}>
            <div style={{ display:'flex', alignItems:'center', gap:7 }}>
              <span style={{ width:6, height:6, borderRadius:'50%', background:'#4ade80', boxShadow:'0 0 5px #4ade80', display:'inline-block', flexShrink:0 }} />
              <span style={{ fontFamily:"'Courier New',monospace", fontSize:10, fontWeight:700, letterSpacing:'.15em', color:'rgba(203,243,110,.85)', textTransform:'uppercase' }}>
                Anomaly Feed
              </span>
              {liveLoaded && (
                <span style={{ fontFamily:"'Courier New',monospace", fontSize:8, color:'rgba(74,222,128,.6)', letterSpacing:'.1em' }}>LIVE</span>
              )}
            </div>
            {lastUpdated && (
              <span style={{ fontFamily:"'Courier New',monospace", fontSize:9, color:'rgba(100,150,80,.4)', letterSpacing:'.05em' }}>
                {lastUpdated.toLocaleTimeString('en-US', { hour:'2-digit', minute:'2-digit' })}
              </span>
            )}
          </div>

          {/* Filters */}
          <div style={{ display:'flex', gap:4, flexWrap:'wrap' }}>
            {(Object.entries(CAT_CONFIG) as [string, typeof CAT_CONFIG[keyof typeof CAT_CONFIG]][]).map(([key, cfg]) => {
              const on = activeFilters.has(key);
              return (
                <button key={key} onClick={() => toggleFilter(key)} style={{
                  padding:'2px 8px',
                  fontFamily:"'Courier New',monospace", fontSize:9, fontWeight:700, letterSpacing:'.08em', textTransform:'uppercase',
                  border:`1px solid ${on ? cfg.color : 'rgba(100,130,90,.2)'}`,
                  background: on ? cfg.bg : 'transparent',
                  color: on ? cfg.color : 'rgba(100,130,90,.4)',
                  borderRadius:2, cursor:'pointer', transition:'all .15s ease',
                }}>
                  {cfg.icon} {cfg.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Report list */}
        <div className="af-scroll" style={{ flex:1, overflowY:'auto', padding:'8px 0' }}>
          {visible.length === 0 && (
            <div style={{ padding:'16px', fontFamily:"'Courier New',monospace", fontSize:11, color:'rgba(100,150,80,.45)' }}>
              No reports match active filters.
            </div>
          )}
          {visible.map((r, i) => {
            const cfg = CAT_CONFIG[r.category];
            const expanded = hoveredId === r.id || tappedIds.has(r.id);
            return (
              <div key={r.id} className="af-row" style={{
                padding:'10px 14px',
                borderBottom:'1px solid rgba(203,243,110,.05)',
                borderLeft:`2px solid ${expanded || i === 0 ? cfg.color : 'transparent'}`,
                background: expanded ? 'rgba(203,243,110,.03)' : 'transparent',
                maxHeight: expanded ? '400px' : '92px',
                overflow: 'hidden',
                transition: 'max-height .35s ease, background .18s, border-left-color .18s',
                cursor: 'pointer',
              }}
                onMouseEnter={() => setHoveredId(r.id)}
                onMouseLeave={() => setHoveredId(null)}
                onClick={() => setTappedIds(prev => {
                  const next = new Set(prev);
                  next.has(r.id) ? next.delete(r.id) : next.add(r.id);
                  return next;
                })}
              >
                <div style={{ display:'flex', alignItems:'center', gap:5, marginBottom:4, flexWrap:'wrap' }}>
                  <span style={{ fontFamily:"'Courier New',monospace", fontSize:8, fontWeight:700, letterSpacing:'.08em', color:cfg.color, background:cfg.bg, padding:'1px 6px', borderRadius:2 }}>
                    {cfg.icon} {cfg.label}
                  </span>
                  <span style={{ fontFamily:"'Courier New',monospace", fontSize:9, color:'rgba(150,180,140,.55)', letterSpacing:'.04em' }}>
                    {fmt(r.date)}
                  </span>
                  {r.shape && (
                    <span style={{ fontFamily:"'Courier New',monospace", fontSize:8, color:'rgba(120,150,110,.4)' }}>· {r.shape}</span>
                  )}
                </div>
                <div style={{ display:'flex', alignItems:'baseline', marginBottom:4 }}>
                  <span style={{ fontFamily:"'Courier New',monospace", fontSize:expanded ? 12 : 10, fontWeight:700, color:'rgba(203,243,110,.85)', letterSpacing:'.03em', transition:'font-size .2s ease' }}>
                    {r.location}
                  </span>
                  <CoordBadge lat={r.lat} lng={r.lng} />
                </div>
                <p style={{ fontFamily:"'Courier New',monospace", fontSize: expanded ? 14 : 11, color: expanded ? 'rgba(185,220,165,.82)' : 'rgba(155,195,135,.6)', lineHeight: expanded ? 1.7 : 1.5, margin:'0 0 5px', transition:'font-size .2s ease, color .2s ease' }}>
                  {r.summary}
                </p>
                <span style={{ fontFamily:"'Courier New',monospace", fontSize:8, color:'rgba(90,130,70,.4)', letterSpacing:'.07em' }}>
                  SRC: {r.source}{expanded ? '' : ' · hover to expand'}
                </span>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div style={{ padding:'7px 14px', borderTop:'1px solid rgba(203,243,110,.07)', background:'rgba(1,8,2,.95)', flexShrink:0 }}>
          <p style={{ fontFamily:"'Courier New',monospace", fontSize:8, color:'rgba(80,120,65,.38)', lineHeight:1.55, margin:0 }}>
            NUFORC · BFRO · O'Brien Field Archives · MUFON<br />
            Unverified witness accounts. Coordinates approximate.
          </p>
        </div>
      </div>
    </>
  );
}
