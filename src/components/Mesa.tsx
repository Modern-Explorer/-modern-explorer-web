import { useState, useEffect, useRef, useCallback } from 'react';
import { useLocation } from 'react-router-dom';

interface Message { role: 'user' | 'assistant'; content: string; }

// Multiple messages per trigger — one chosen at random each visit
const SCROLL_NOTES: [string, string[]][] = [
  ['mesa-hero', [
    'Signal acquired. You are now entering monitored airspace — San Luis Valley, Colorado.',
    'Elevation: 7,930 feet. Population: 127. Anomalous events logged: 1,000+',
    'You have been drawn here. Most who come to Crestone say the same thing.',
  ]],
  ['mesa-about', [
    'Founder Mateo Argüello hiked from Colorado\'s Front Range through the Sangre de Cristos — two months, living off the land — arriving in Crestone on Halloween. Winter stopped him. Crestone didn\'t let him leave.',
    'Former Marine Corps intelligence. Now tracking different kinds of signals in these mountains.',
    'Modern Explorer was built on the premise that the observer changes the encounter.',
  ]],
  ['mesa-tours', [
    'One active expedition currently accepting participants. Clearance level: civilian.',
    'Average group size: small. By design. The valley responds differently to crowds.',
    'Tour duration: 45 minutes to 1 hour. Time perceived by participants: variable.',
  ]],
  ['mesa-reports', [
    'Accessing field database... 1,000+ anomalous events documented in this valley since 1992.',
    'Snippy the horse. September 1967. Still no official explanation.',
    'Christopher O\'Brien has documented this valley for over 30 years. He stopped being surprised.',
  ]],
  ['mesa-treasure', [
    'Coordinates partially recovered. LiDAR analysis ongoing. Investigation status: active.',
    '400 gold bars. Last seen 1880. Still there.',
    'The slope we are targeting has no LiDAR data. Mysteriously absent.',
  ]],
  ['mesa-caverna', [
    'Highest altitude significant cave in the United States. Accessible approximately 30 days per year.',
    'A skeleton in Spanish armor was found at the entrance in 1900. The red cross painted above it is still faintly visible.',
    'The cave has been called La Caverna del Oro, Spanish Cave, and Marble Mountain Cave. The gold has never been found.',
  ]],
  ['mesa-sasquatch', [
    'Last thermal signature logged — Sangre de Cristo ridge, elevation 11,400ft. Unconfirmed.',
    'Blanca Peak. August 2000. Two ATV operators. Filed with BFRO. Never explained.',
    'The Sangres do not give up their secrets easily.',
  ]],
  ['mesa-upcoming', [
    'Specialty tours in development. UFO focused. Paranormal focused. History focused. Coming soon.',
    'Expedition tours will require physical preparation. These are not walks in a park.',
    'If you are reading this, you are probably already the right kind of person.',
  ]],
  ['mesa-map', [
    "You are viewing Christopher O'Brien's life work — 30 years of field investigation in this valley. Some locations have been approximated for safety. Explore with respect.",
    "Every pin on this map is a documented event. Some have explanations. Most do not.",
    "Christopher O'Brien stopped being surprised decades ago. The data kept coming anyway.",
  ]],
  ['mesa-contact', [
    'Ready to begin your expedition? Establish contact.',
    'Small groups only. This is intentional.',
    'The valley has been waiting. So have we.',
  ]],
];

const GREETING = `MESA v2.4.1 // FIELD INTELLIGENCE — Online.

You are in the San Luis Valley signal zone. I have access to all documented field data — sighting records, expedition status, tour availability, and local intelligence.

What are you investigating, Explorer?`;

export default function Mesa() {
  const location = useLocation();
  const [open, setOpen]           = useState(false);
  const [messages, setMessages]   = useState<Message[]>([]);
  const [input, setInput]         = useState('');
  const [loading, setLoading]     = useState(false);
  const [fieldNote, setFieldNote] = useState<string | null>(null);
  const [orbPulsing, setOrbPulsing] = useState(false);
  const [nearBottom, setNearBottom] = useState(false);
  const [listening,       setListening]       = useState(false);
  const [speechSupported, setSpeechSupported] = useState(false);
  const [interim,         setInterim]         = useState('');

  const seenRef        = useRef<Set<string>>(new Set());
  const noteTimerRef   = useRef<ReturnType<typeof setTimeout> | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef       = useRef<HTMLInputElement>(null);
  const listeningRef   = useRef(false);
  const recogRef       = useRef<any>(null);
  const pendingRef     = useRef('');

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 120);
  }, [open]);

  useEffect(() => {
    const onScroll = () => {
      const distFromBottom = document.documentElement.scrollHeight - window.scrollY - window.innerHeight;
      setNearBottom(distFromBottom < 200);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const showFieldNote = useCallback((note: string) => {
    setFieldNote(note);
    setOrbPulsing(true);
    if (noteTimerRef.current) clearTimeout(noteTimerRef.current);
    // Note stays for 7s; orb pulse CSS runs its iterations then returns to normal
    noteTimerRef.current = setTimeout(() => {
      setFieldNote(null);
      setOrbPulsing(false);
    }, 7000);
  }, []);

  useEffect(() => {
    let observers: IntersectionObserver[] = [];
    const timer = setTimeout(() => {
      observers = SCROLL_NOTES.map(([id, notes]) => {
        const el = document.getElementById(id);
        if (!el) return null as unknown as IntersectionObserver;
        const obs = new IntersectionObserver(([entry]) => {
          if (entry.isIntersecting && !seenRef.current.has(id)) {
            seenRef.current.add(id);
            const note = notes[Math.floor(Math.random() * notes.length)];
            showFieldNote(note);
          }
        }, { threshold: 0.18 });
        obs.observe(el);
        return obs;
      }).filter(Boolean);
    }, 200);
    return () => { clearTimeout(timer); observers.forEach(o => o.disconnect()); };
  }, [location.pathname, showFieldNote]);

  // Receive events dispatched by AnomalyFeed and other components
  useEffect(() => {
    const handler = (e: Event) => {
      const { note } = (e as CustomEvent<{ note: string }>).detail;
      if (note) showFieldNote(note);
    };
    window.addEventListener('mesa:field-report', handler);
    return () => window.removeEventListener('mesa:field-report', handler);
  }, [showFieldNote]);

  useEffect(() => {
    const SR = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SR) return;
    setSpeechSupported(true);

    const recog = new SR();
    recog.continuous     = true;
    recog.interimResults = true;
    recog.lang           = 'en-US';

    recog.onresult = (e: any) => {
      let fin = '', interimText = '';
      for (let i = e.resultIndex; i < e.results.length; i++) {
        if (e.results[i].isFinal) fin         += e.results[i][0].transcript;
        else                      interimText += e.results[i][0].transcript;
      }
      setInterim(interimText);
      if (fin) {
        const appended = fin.trim();
        setInput(prev => prev + (prev && !prev.endsWith(' ') ? ' ' : '') + appended);
        pendingRef.current += (pendingRef.current ? ' ' : '') + appended;
      }
    };

    recog.onend = () => {
      // If listening was not explicitly stopped, restart (some browsers end continuous sessions early)
      if (listeningRef.current) {
        try { recog.start(); } catch {}
        return;
      }
      setListening(false);
      setInterim('');
      pendingRef.current = '';
    };

    recog.onerror = (e: any) => {
      if (e.error === 'not-allowed' || e.error === 'service-not-allowed') {
        setSpeechSupported(false);
      }
      listeningRef.current = false;
      setListening(false);
      setInterim('');
    };

    recogRef.current = recog;
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  function toggleMic() {
    if (!recogRef.current) return;
    if (listening) {
      listeningRef.current = false;
      recogRef.current.stop();
    } else {
      pendingRef.current = '';
      try {
        recogRef.current.start();
        listeningRef.current = true;
        setListening(true);
      } catch {}
    }
  }

  const sendMessage = async () => {
    if (listening) {
      listeningRef.current = false;
      setListening(false);
      recogRef.current?.stop();
    }
    const text = input.trim();
    if (!text || loading) return;
    const userMsg: Message = { role: 'user', content: text };
    const next = [...messages, userMsg];
    setMessages(next);
    setInput('');
    setLoading(true);
    try {
      const res = await fetch('/api/mesa', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: next }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setMessages([...next, { role: 'assistant', content: data.content }]);
    } catch {
      setMessages([...next, { role: 'assistant', content: 'Signal lost. Field intelligence temporarily offline. Try again.' }]);
    } finally {
      setLoading(false);
    }
  };

  const handleKey = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(); }
  };

  const displayInput = listening && interim
    ? input + (input && !input.endsWith(' ') ? ' ' : '') + interim
    : input;

  return (
    <>
      {/* ── KEYFRAMES ─────────────────────────────────────────────────────── */}
      <style>{`
        @keyframes mesaPulse {
          0%,100% { box-shadow:0 0 18px 4px rgba(203,243,110,.22),0 0 36px 8px rgba(203,243,110,.08); }
          50%      { box-shadow:0 0 30px 10px rgba(203,243,110,.42),0 0 60px 20px rgba(203,243,110,.15); }
        }
        @keyframes mesaCrackle {
          0%   { box-shadow:0 0 22px 6px rgba(203,243,110,.5),  0 0 44px 14px rgba(203,243,110,.2); }
          18%  { box-shadow:0 0 52px 18px rgba(203,243,110,.9), 0 0 95px 32px rgba(203,243,110,.45); }
          34%  { box-shadow:0 0 10px 2px rgba(203,243,110,.2),  0 0 20px 5px rgba(203,243,110,.08); }
          52%  { box-shadow:0 0 65px 22px rgba(203,243,110,1),  0 0 120px 44px rgba(203,243,110,.55); }
          68%  { box-shadow:0 0 20px 5px rgba(203,243,110,.35), 0 0 42px 12px rgba(203,243,110,.15); }
          85%  { box-shadow:0 0 72px 26px rgba(203,243,110,.95),0 0 140px 52px rgba(203,243,110,.5); }
          100% { box-shadow:0 0 30px 10px rgba(203,243,110,.42),0 0 60px 20px rgba(203,243,110,.15); }
        }
        @keyframes mesaNotePulse {
          0%   { box-shadow:0 0 28px 8px rgba(203,243,110,.55), 0 0 56px 18px rgba(203,243,110,.22); transform:scale(1); }
          12%  { box-shadow:0 0 80px 32px rgba(203,243,110,1),  0 0 160px 64px rgba(203,243,110,.65); transform:scale(1.14); }
          25%  { box-shadow:0 0 18px 4px rgba(203,243,110,.3),  0 0 36px 8px rgba(203,243,110,.12);  transform:scale(1.02); }
          40%  { box-shadow:0 0 90px 38px rgba(203,243,110,1),  0 0 180px 72px rgba(203,243,110,.7); transform:scale(1.16); }
          58%  { box-shadow:0 0 30px 10px rgba(203,243,110,.5), 0 0 60px 20px rgba(203,243,110,.2);  transform:scale(1.04); }
          72%  { box-shadow:0 0 70px 28px rgba(203,243,110,.9), 0 0 140px 56px rgba(203,243,110,.55);transform:scale(1.1); }
          86%  { box-shadow:0 0 40px 14px rgba(203,243,110,.6), 0 0 80px 28px rgba(203,243,110,.3);  transform:scale(1.05); }
          100% { box-shadow:0 0 28px 8px rgba(203,243,110,.42), 0 0 56px 18px rgba(203,243,110,.15); transform:scale(1); }
        }
        @keyframes mesaTopoSpin {
          from { transform:rotate(0deg); }
          to   { transform:rotate(360deg); }
        }
        @keyframes mesaNoteIn {
          from { opacity:0; transform:translateX(14px); }
          to   { opacity:1; transform:translateX(0); }
        }
        @keyframes mesaChatIn {
          from { opacity:0; transform:translateY(10px) scale(.97); }
          to   { opacity:1; transform:translateY(0)   scale(1); }
        }
        @keyframes mesaDot {
          0%,60%,100% { opacity:.12; }
          30%          { opacity:.9; }
        }
        .mesa-orb {
          position:fixed; bottom:24px; right:24px; z-index:9999;
          width:64px; height:64px; border-radius:50%; border:none; padding:0;
          outline:1px solid rgba(203,243,110,.28); outline-offset:0;
          background:radial-gradient(circle at 36% 34%,rgba(18,56,22,.95),rgba(2,8,4,.99));
          cursor:pointer;
          display:flex; align-items:center; justify-content:center;
          animation:mesaPulse 3.4s ease-in-out infinite;
          transition:transform .18s ease, outline-color .18s ease;
        }
        .mesa-orb:hover {
          animation:mesaCrackle .65s ease-in-out infinite;
          transform:scale(1.1);
          outline-color:rgba(203,243,110,.75);
        }
        .mesa-orb.orb-open   { outline-color:rgba(203,243,110,.5); animation:mesaPulse 1.9s ease-in-out infinite; }
        .mesa-orb.orb-pulse  { animation:mesaNotePulse .65s ease-out 5; outline-color:rgba(203,243,110,.9); }
        .mesa-topo-spin {
          animation:mesaTopoSpin 22s linear infinite;
          transform-box:fill-box; transform-origin:center;
        }
        .mesa-dot-1 { animation:mesaDot 1.4s .00s ease-in-out infinite; }
        .mesa-dot-2 { animation:mesaDot 1.4s .22s ease-in-out infinite; }
        .mesa-dot-3 { animation:mesaDot 1.4s .44s ease-in-out infinite; }
        @keyframes mesaMicPulse {
          0%,100% { opacity:1; box-shadow:0 0 5px #f87171; }
          50%      { opacity:0.35; box-shadow:0 0 2px #f87171; }
        }
        .mesa-chat {
          position:fixed; bottom:100px; right:24px; z-index:9998;
          width:min(400px, calc(100vw - 48px)); height:530px;
          background:#020c03;
          border:1px solid rgba(203,243,110,.22);
          border-radius:8px;
          box-shadow:0 0 48px rgba(203,243,110,.07), 0 28px 72px rgba(0,0,0,.75);
          display:flex; flex-direction:column; overflow:hidden;
          animation:mesaChatIn .2s ease-out;
        }
        .mesa-msgs::-webkit-scrollbar { width:3px; }
        .mesa-msgs::-webkit-scrollbar-track { background:transparent; }
        .mesa-msgs::-webkit-scrollbar-thumb { background:rgba(203,243,110,.14); border-radius:2px; }
        .mesa-input::placeholder { color:rgba(100,160,80,.38); }
        .mesa-input:focus { outline:none; }
      `}</style>

      {/* ── FIELD NOTE ───────────────────────────────────────────────────── */}
      {fieldNote && !open && (
        <div className="mesa-field-note-box" style={{
          position:'fixed', bottom:100, right:24, zIndex:9997,
          maxWidth:320, padding:'14px 18px',
          background:'rgba(1,14,2,.96)',
          border:'1px solid rgba(203,243,110,.4)',
          borderLeft:'3px solid rgba(203,243,110,.85)',
          borderRadius:4,
          boxShadow:'0 0 32px rgba(203,243,110,.12), 0 8px 32px rgba(0,0,0,.6)',
          animation:'mesaNoteIn .2s ease-out',
          opacity: nearBottom ? 0 : undefined,
          pointerEvents: nearBottom ? 'none' : undefined,
          transition: 'opacity 0.4s ease',
        }}>
          <p style={{ fontFamily:"'Courier New',monospace", fontSize:10, color:'rgba(203,243,110,.38)', letterSpacing:'.14em', margin:'0 0 6px' }}>
            MESA // FIELD NOTE
          </p>
          <p style={{ fontFamily:"'Courier New',monospace", fontSize:12, color:'rgba(203,243,110,.88)', lineHeight:1.65, margin:0 }}>
            {fieldNote}
          </p>
        </div>
      )}

      {/* ── CHAT WINDOW ──────────────────────────────────────────────────── */}
      {open && (
        <div className="mesa-chat">

          {/* Header */}
          <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'12px 16px', borderBottom:'1px solid rgba(203,243,110,.12)', background:'#010904', flexShrink:0 }}>
            <div style={{ display:'flex', alignItems:'center', gap:10 }}>
              <div style={{ width:26, height:26, borderRadius:'50%', border:'1px solid rgba(203,243,110,.32)', background:'radial-gradient(circle at 36% 34%,rgba(18,52,22,.9),rgba(2,8,4,.99))', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
                <div style={{ width:7, height:7, borderRadius:'50%', background:'rgba(203,243,110,.8)', boxShadow:'0 0 5px rgba(203,243,110,.7)' }} />
              </div>
              <div>
                <p style={{ fontFamily:"'Courier New',monospace", fontSize:12, fontWeight:700, color:'rgba(203,243,110,.95)', letterSpacing:'.12em', lineHeight:1, margin:0 }}>MESA</p>
                <p style={{ fontFamily:"'Courier New',monospace", fontSize:9,  color:'rgba(100,155,78,.55)', letterSpacing:'.1em', marginTop:2, lineHeight:1 }}>v2.4.1 // FIELD INTELLIGENCE</p>
              </div>
            </div>
            <div style={{ display:'flex', alignItems:'center', gap:8 }}>
              <span style={{ width:6, height:6, borderRadius:'50%', background:'#4ade80', boxShadow:'0 0 5px #4ade80', display:'inline-block' }} />
              <span style={{ fontFamily:"'Courier New',monospace", fontSize:9, color:'rgba(74,222,128,.65)', letterSpacing:'.08em' }}>ONLINE</span>
              <button onClick={() => setOpen(false)}
                style={{ marginLeft:8, background:'none', border:'none', color:'rgba(203,243,110,.35)', cursor:'pointer', fontSize:20, lineHeight:1, padding:'0 3px', transition:'color .15s' }}
                onMouseEnter={e => (e.currentTarget.style.color = 'rgba(203,243,110,.9)')}
                onMouseLeave={e => (e.currentTarget.style.color = 'rgba(203,243,110,.35)')}
              >×</button>
            </div>
          </div>

          {/* Messages */}
          <div className="mesa-msgs" style={{ flex:1, overflowY:'auto', padding:'16px 16px 8px', display:'flex', flexDirection:'column', gap:16 }}>

            {/* Greeting — always shown, not part of API context */}
            <div>
              <span style={{ fontFamily:"'Courier New',monospace", fontSize:10, color:'rgba(203,243,110,.35)', display:'block', marginBottom:5, letterSpacing:'.08em' }}>MESA ›</span>
              <p style={{ fontFamily:"'Courier New',monospace", fontSize:13, color:'rgba(203,243,110,.8)', lineHeight:1.7, margin:0, whiteSpace:'pre-wrap' }}>{GREETING}</p>
            </div>

            {/* Conversation */}
            {messages.map((msg, i) => (
              <div key={i}>
                {msg.role === 'assistant' ? (
                  <div>
                    <span style={{ fontFamily:"'Courier New',monospace", fontSize:10, color:'rgba(203,243,110,.35)', display:'block', marginBottom:5, letterSpacing:'.08em' }}>MESA ›</span>
                    <p style={{ fontFamily:"'Courier New',monospace", fontSize:13, color:'rgba(203,243,110,.85)', lineHeight:1.7, margin:0, whiteSpace:'pre-wrap' }}>{msg.content}</p>
                  </div>
                ) : (
                  <div style={{ display:'flex', gap:7, alignItems:'flex-start' }}>
                    <span style={{ fontFamily:"'Courier New',monospace", fontSize:13, color:'rgba(203,243,110,.3)', flexShrink:0, marginTop:1 }}>›</span>
                    <p style={{ fontFamily:"'Courier New',monospace", fontSize:13, color:'rgba(155,200,130,.65)', lineHeight:1.6, margin:0, whiteSpace:'pre-wrap' }}>{msg.content}</p>
                  </div>
                )}
              </div>
            ))}

            {/* Typing indicator */}
            {loading && (
              <div>
                <span style={{ fontFamily:"'Courier New',monospace", fontSize:10, color:'rgba(203,243,110,.35)', display:'block', marginBottom:5 }}>MESA ›</span>
                <span style={{ fontFamily:"'Courier New',monospace", fontSize:20, color:'rgba(203,243,110,.55)', letterSpacing:5 }}>
                  <span className="mesa-dot-1">·</span>
                  <span className="mesa-dot-2">·</span>
                  <span className="mesa-dot-3">·</span>
                </span>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Divider */}
          <div style={{ height:1, background:'rgba(203,243,110,.09)', flexShrink:0 }} />

          {/* Input area */}
          <div style={{ background:'#010803', flexShrink:0 }}>
            {/* Listening status line */}
            {listening && (
              <div style={{ padding:'5px 14px 0', display:'flex', alignItems:'center', gap:6 }}>
                <span style={{ display:'inline-block', width:5, height:5, borderRadius:'50%', background:'#f87171', boxShadow:'0 0 5px #f87171', animation:'mesaMicPulse 0.8s ease-in-out infinite' }} />
                <span style={{ fontFamily:"'Courier New',monospace", fontSize:9, color:'rgba(248,113,113,.75)', letterSpacing:'.12em' }}>LISTENING…</span>
              </div>
            )}

            {/* Input row */}
            <div style={{ padding:'10px 14px', display:'flex', alignItems:'center', gap:9 }}>
              <span style={{ fontFamily:"'Courier New',monospace", fontSize:14, color: listening ? 'rgba(248,113,113,.5)' : 'rgba(203,243,110,.35)', flexShrink:0 }}>›</span>
              <input
                ref={inputRef}
                value={displayInput}
                onChange={e => { if (!listening) setInput(e.target.value); }}
                onKeyDown={handleKey}
                placeholder={listening ? '' : 'Enter query…'}
                disabled={loading}
                className="mesa-input"
                style={{ flex:1, background:'none', border:'none', fontFamily:"'Courier New',monospace", fontSize:13, color: listening && interim ? 'rgba(248,113,113,.65)' : 'rgba(203,243,110,.9)', caretColor:'rgba(203,243,110,.9)' }}
              />

              {/* Mic button */}
              {speechSupported && (
                <button
                  type="button"
                  onClick={toggleMic}
                  disabled={loading}
                  title={listening ? 'Stop recording' : 'Voice input'}
                  style={{
                    flexShrink:0, width:28, height:28,
                    background: listening ? 'rgba(248,113,113,.12)' : 'none',
                    border:`1px solid ${listening ? 'rgba(248,113,113,.45)' : 'rgba(203,243,110,.18)'}`,
                    borderRadius:3,
                    color: listening ? 'rgba(248,113,113,.85)' : 'rgba(203,243,110,.38)',
                    cursor: loading ? 'not-allowed' : 'pointer',
                    display:'flex', alignItems:'center', justifyContent:'center',
                    transition:'all 0.15s',
                  }}
                  onMouseEnter={e => { if (!loading && !listening) { e.currentTarget.style.borderColor='rgba(203,243,110,.45)'; e.currentTarget.style.color='rgba(203,243,110,.7)'; } }}
                  onMouseLeave={e => { if (!listening) { e.currentTarget.style.borderColor='rgba(203,243,110,.18)'; e.currentTarget.style.color='rgba(203,243,110,.38)'; } }}
                >
                  {listening ? (
                    <svg width="9" height="9" viewBox="0 0 10 10">
                      <rect x="1.5" y="1.5" width="7" height="7" fill="currentColor" rx="1" />
                    </svg>
                  ) : (
                    <svg width="11" height="12" viewBox="0 0 13 14" fill="none">
                      <rect x="4" y="1" width="5" height="8" rx="2.5" stroke="currentColor" strokeWidth="1.5"/>
                      <path d="M1.5 7.5A5 5 0 0 0 11.5 7.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                      <line x1="6.5" y1="12.5" x2="6.5" y2="10.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                    </svg>
                  )}
                </button>
              )}

              {/* Send button */}
              <button
                onClick={sendMessage}
                disabled={loading || !input.trim()}
                style={{
                  background:'none',
                  border:`1px solid rgba(203,243,110,${loading || !input.trim() ? '.12' : '.3'})`,
                  borderRadius:3, padding:'4px 10px',
                  fontFamily:"'Courier New',monospace", fontSize:10,
                  color:`rgba(203,243,110,${loading || !input.trim() ? '.18' : '.65'})`,
                  cursor: loading || !input.trim() ? 'not-allowed' : 'pointer',
                  letterSpacing:'.1em', transition:'color .15s, border-color .15s',
                }}
                onMouseEnter={e => { if (!loading && input.trim()) { e.currentTarget.style.color='rgba(203,243,110,.95)'; e.currentTarget.style.borderColor='rgba(203,243,110,.6)'; } }}
                onMouseLeave={e => { e.currentTarget.style.color=`rgba(203,243,110,${loading||!input.trim()?'.18':'.65'})`; e.currentTarget.style.borderColor=`rgba(203,243,110,${loading||!input.trim()?'.12':'.3'})`; }}
              >SEND</button>
            </div>
          </div>

          {/* Footer */}
          <div style={{ padding:'5px 14px 8px', background:'#010803', flexShrink:0 }}>
            <p style={{ fontFamily:"'Courier New',monospace", fontSize:9, color:'rgba(90,140,70,.3)', letterSpacing:'.06em', margin:0 }}>
              MODERN EXPLORER SITUATIONAL AI · CRESTONE, CO · 37°59′N 105°41′W
            </p>
          </div>
        </div>
      )}

      {/* ── ORB ──────────────────────────────────────────────────────────── */}
      <button
        className={`mesa-orb${open ? ' orb-open' : ''}${orbPulsing && !open ? ' orb-pulse' : ''}`}
        onClick={() => setOpen(o => !o)}
        title="MESA — Modern Explorer Situational AI"
        aria-label="Open MESA field intelligence"
        style={{ opacity: nearBottom ? 0 : undefined, pointerEvents: nearBottom ? 'none' : undefined, transition: 'opacity 0.4s ease' }}
      >
        <svg viewBox="0 0 80 80" width="44" height="44">
          <defs>
            <radialGradient id="msGrad" cx="37%" cy="34%" r="62%">
              <stop offset="0%"   stopColor="rgba(22,64,26,.92)" />
              <stop offset="58%"  stopColor="rgba(6,22,8,.97)" />
              <stop offset="100%" stopColor="rgba(1,5,2,1)" />
            </radialGradient>
            <clipPath id="msClip"><circle cx="40" cy="40" r="35" /></clipPath>
          </defs>
          <circle cx="40" cy="40" r="35" fill="url(#msGrad)" />
          <g clipPath="url(#msClip)" className="mesa-topo-spin">
            <ellipse cx="40" cy="40" rx="35" ry="9"  fill="none" stroke="rgba(203,243,110,.22)" strokeWidth=".7" />
            <ellipse cx="40" cy="40" rx="32" ry="19" fill="none" stroke="rgba(203,243,110,.17)" strokeWidth=".6" />
            <ellipse cx="40" cy="40" rx="26" ry="27" fill="none" stroke="rgba(203,243,110,.14)" strokeWidth=".55" />
            <ellipse cx="40" cy="40" rx="15" ry="33" fill="none" stroke="rgba(203,243,110,.12)" strokeWidth=".5" />
            <ellipse cx="40" cy="40" rx="9"  ry="35" fill="none" stroke="rgba(203,243,110,.18)" strokeWidth=".55" />
            <ellipse cx="40" cy="40" rx="29" ry="35" fill="none" stroke="rgba(203,243,110,.09)" strokeWidth=".4" />
          </g>
          <ellipse cx="29" cy="27" rx="13" ry="8" fill="rgba(203,243,110,.05)" />
          <circle  cx="40" cy="40" r="37" fill="none" stroke="rgba(203,243,110,.17)" strokeWidth=".6" />
          <line x1="40" y1="3" x2="40" y2="9" stroke="rgba(203,243,110,.65)" strokeWidth="1.5" strokeLinecap="round" />
          <circle cx="40" cy="40" r="2.5" fill="rgba(203,243,110,.5)" />
        </svg>
      </button>
    </>
  );
}
