import { Link } from 'react-router-dom';
import { useRef, useEffect } from 'react';
import { OrbIcon, CompassIcon, LanternIcon } from '../components/Icons';
import { useReveal } from '../hooks/useReveal';
import SEO from '../components/SEO';

const BOOKING_URL = 'https://fareharbor.com/embeds/book/modernexplorer/?full-items=yes';

const IMG = (folder: string, file: string) => `/assets/images/content/${folder}/${file}`;

const features = [
  { icon: '/assets/images/compass.png', label: 'Small Groups', desc: 'Intimate 6–12 person expeditions for a real, personal experience.' },
  { icon: '/assets/images/maps-and-flags.png', label: 'Authentic Local Experiences', desc: 'Every tour is rooted in genuine local history, legend, and lore.' },
  { icon: '/assets/images/backpack.png', label: 'Curated Immersive Travel', desc: 'Thoughtfully designed journeys that go far beyond the typical tour.' },
];

const activeTour = {
  img: IMG('Crestone', '20250810_090739-EDIT.jpg'),
  stats: [
    { label: 'Duration', value: '45–60 min' },
    { label: 'Group Size', value: '6–12' },
    { label: 'Difficulty', value: 'Easy' },
  ],
  topics: [
    { icon: '🏘️', label: 'Town History', detail: "The full arc of Crestone — from its Indigenous roots to its eccentric present" },
    { icon: '⛏️', label: 'Mining History', detail: 'Silver and gold rush era sites, boom-and-bust stories, and the people who built this town' },
    { icon: '🕌', label: 'Spiritual Sites', detail: "Sacred sites, sanctuary communities, and Crestone's role as a global spiritual center" },
    { icon: '👁️', label: 'Paranormal Activity', detail: "Documented unexplained events, local accounts, and the Valley's high-strangeness reputation" },
    { icon: '🛸', label: 'UFOs & UAP', detail: "The San Luis Valley's documented history as one of North America's most active UAP corridors" },
  ],
};

const comingSoon = [
  { title: 'UFO / UAP Tour', subtitle: 'The Sky Watch Experience', img: IMG('UFOs', 'pexels-miriamespacio-365625.jpg'), eta: 'Fall 2025' },
  { title: 'Paranormal & Ghosts', subtitle: 'Crestone After Dark', img: IMG('Ghosts', 'ZtDXn.jpg'), eta: 'Winter 2025' },
  { title: 'Mining & History', subtitle: 'The Hidden Past', img: IMG('History', '20241222_124511-EDIT.jpg'), eta: '2026' },
  { title: 'Future Expeditions', subtitle: 'Multi-Day Field Operations', img: IMG('Nature', '20250510_124904-EDIT.jpg'), eta: 'In Development' },
];

const testimonials = [
  { quote: "Every step on these tours felt like peeling back a layer of Crestone's hidden history. I left with more questions—and a deeper respect for this extraordinary place.", name: 'Sarah K.', role: 'Historian & Adventurer' },
  { quote: "I never imagined a walking tour could be this immersive. The stories, the landscapes, and the mysteries—each moment felt like a scene from a documentary.", name: 'Marcus T.', role: 'Outdoor Educator' },
  { quote: "From ancient legends to unexplained lights in the sky, this experience made me see the world with new eyes. Absolutely life-changing.", name: 'Elena R.', role: 'Paranormal Researcher' },
  { quote: "The guides blend knowledge, humor, and real adventure. I felt safe, challenged, and part of something bigger than myself.", name: 'David L.', role: 'Expedition Participant' },
];

const blogPreviews = [
  { tag: 'Field Report', title: 'Stories from the Edge', desc: 'Firsthand accounts of haunted trails, lost ruins, and the mysteries we uncover on every journey.', img: IMG('Crestone', '20250810_093828-EDIT.jpg') },
  { tag: 'Skills', title: 'Field Wisdom & Survival', desc: 'Hard-won lessons, gear tips, and practical know-how for thriving in the unknown.', img: IMG('Mateo', '20250421_075338-EDIT.jpg') },
  { tag: 'Community', title: 'Voices from Our Community', desc: 'Insights from fellow adventurers, local legends, and special guests—new perspectives on history and mystery.', img: IMG('History', '20231110_154447.jpg') },
];

const csTheme: Record<string, string> = {
  'UFO / UAP Tour': 'uap',
  'Paranormal & Ghosts': 'paranormal',
  'Mining & History': 'mining',
  'Future Expeditions': 'expedition',
};

const iconMap: Record<string, React.ReactNode> = {
  'UFO / UAP Tour':    <OrbIcon className="me-orb" />,
  'Mining & History':  <LanternIcon />,
  'Future Expeditions': <CompassIcon className="me-compass" />,
};

export default function Home() {
  const heroRef = useRef<HTMLElement>(null);
  const bgRef = useRef<HTMLDivElement>(null);
  const topoRef = useRef<HTMLDivElement>(null);
  useReveal();

  useEffect(() => {
    const section = heroRef.current;
    if (!section) return;
    let raf: number;
    let tx = 0, ty = 0;
    let bx = 0, by = 0;   // background — slow, laggy
    let mx = 0, my = 0;   // terrain map — fast, snappy

    const onMove = (e: MouseEvent) => {
      const r = section.getBoundingClientRect();
      tx = ((e.clientX - r.left) / r.width - 0.5) * 2;
      ty = ((e.clientY - r.top) / r.height - 0.5) * 2;
    };

    const tick = () => {
      bx += (tx - bx) * 0.038;   // slow lag
      by += (ty - by) * 0.038;
      mx += (tx - mx) * 0.080;   // snappy response
      my += (ty - my) * 0.080;
      if (bgRef.current) {
        bgRef.current.style.transform = `translate(${bx * 14}px, ${by * 9}px) scale(1.05)`;
      }
      if (topoRef.current) {
        topoRef.current.style.transform = `translate(${mx * 58}px, ${my * 36}px) scale(1.16)`;
      }
      raf = requestAnimationFrame(tick);
    };

    section.addEventListener('mousemove', onMove);
    raf = requestAnimationFrame(tick);
    return () => {
      section.removeEventListener('mousemove', onMove);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <main>
      <SEO
        title="Modern Explorer | Guided Tours in Crestone, Colorado & the San Luis Valley"
        description="Immersive small-group guided tours in Crestone, Colorado. Explore UFO hotspots, Spanish treasure legends, paranormal history, and the mysteries of the San Luis Valley and Sangre de Cristo mountains. Located 30 miles from Great Sand Dunes National Park."
        url="/"
      />
      {/* HERO */}
      <section id="mesa-hero" ref={heroRef} style={{
        position: 'relative', minHeight: '100vh', display: 'flex', alignItems: 'center', overflow: 'hidden',
      }}>
        {/* Background — parallax layer (moves with cursor) */}
        <div
          ref={bgRef}
          style={{
            position: 'absolute', inset: 0,
            backgroundImage: `url('${IMG('Nature', 'pexels-walidphotoz-847402.jpg')}')`,
            backgroundSize: 'cover', backgroundPosition: 'center 60%',
            transform: 'scale(1.05)',
            willChange: 'transform',
          }}
        />
        {/* Gradient — fixed, above topo layer */}
        <div style={{ position: 'absolute', inset: 0, zIndex: 2, background: 'linear-gradient(135deg, rgba(8,12,23,0.72) 0%, rgba(8,12,23,0.38) 60%, rgba(8,12,23,0.25) 100%)' }} />
        {/* Terrain map — medium-speed parallax layer between landscape and text */}
        <div
          ref={topoRef}
          style={{
            position: 'absolute',
            inset: 0,
            backgroundImage: `url('${IMG('Crestone', 'terrain-map-san-luis.jpg')}')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            opacity: 0.35,
            mixBlendMode: 'screen',
            transform: 'scale(1.16)',
            willChange: 'transform',
            zIndex: 1,
            filter: 'saturate(0.55) brightness(0.9)',
          }}
        />

        <div className="container" style={{ paddingTop: 100, paddingBottom: 80, textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', position: 'relative', zIndex: 3 }}>
          {/* Large centerpiece logo — ~¼ of the hero area at full width */}
          <img
            src="/assets/images/content/Logo/ME Logo Draft 5.png"
            alt="Modern Explorer"
            style={{
              width: 'clamp(300px, 48vw, 700px)',
              height: 'auto',
              display: 'block',
              marginBottom: 24,
              filter: 'drop-shadow(0 0 60px rgba(203,243,110,0.20)) drop-shadow(0 8px 24px rgba(0,0,0,0.6))',
            }}
          />

          {/* Tagline — large and clearly readable */}
          <p style={{
            fontFamily: 'var(--font-alt)',
            fontSize: 'clamp(15px, 1.8vw, 22px)',
            fontWeight: 500,
            color: 'rgba(240,244,255,0.92)',
            letterSpacing: '0.18em',
            textTransform: 'uppercase',
            marginBottom: 52,
          }}>
            Colorado · Crestone · San Luis Valley · Near Great Sand Dunes National Park
          </p>

          <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', justifyContent: 'center' }}>
            <a href={BOOKING_URL} target="_blank" rel="noopener noreferrer" className="btn btn-primary" style={{ fontSize: 16, padding: '16px 36px' }}>
              Explore Journeys
            </a>
            <a href="https://www.youtube.com/@ModernExplorer" target="_blank" rel="noopener noreferrer" className="btn btn-ghost" style={{ fontSize: 16, padding: '16px 36px' }}>
              ▶ See Trailer
            </a>
          </div>
          <p style={{
            fontFamily: 'var(--font-alt)',
            fontSize: 'clamp(16px, 1.8vw, 22px)',
            color: 'rgba(240,244,255,0.65)',
            letterSpacing: '0.06em',
            marginTop: 52,
          }}>
            Immersive Small-Group Tours Designed For Curious Travelers.
          </p>
        </div>
        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 140, background: 'linear-gradient(to top, var(--bg), transparent)', zIndex: 3 }} />
      </section>

      {/* FEATURES STRIP */}
      <section style={{ background: 'var(--bg-section)', borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)', padding: '56px 0' }}>
        <div className="container">
          <div className="grid-3">
            {features.map(f => (
              <div key={f.label} style={{ display: 'flex', gap: 20, alignItems: 'flex-start' }}>
                <div style={{ width: 48, height: 48, flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--accent-dim)', border: '1px solid var(--border-accent)', borderRadius: 6 }}>
                  <img src={f.icon} alt="" style={{ width: 24, height: 24, objectFit: 'contain', filter: 'invert(1) sepia(1) hue-rotate(30deg) saturate(2)' }} />
                </div>
                <div>
                  <h4 style={{ fontSize: 16, marginBottom: 6 }}>{f.label}</h4>
                  <p style={{ fontSize: 14, color: 'var(--text-muted)', lineHeight: 1.6 }}>{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TOURS */}
      <section id="mesa-tours" className="section">
        <div className="container">

          <div data-reveal style={{ textAlign: 'center', marginBottom: 64 }}>
            <span className="eyebrow">Tours & Expeditions</span>
            <h2 style={{ fontSize: 'clamp(36px, 5vw, 56px)', marginBottom: 20 }}>Travel Beyond The Ordinary</h2>
            <p style={{ fontFamily: 'var(--font-alt)', color: 'var(--text-muted)', fontSize: 18, maxWidth: 560, margin: '0 auto' }}>
              One tour running now. More launching soon.
            </p>
          </div>

          {/* Now Available label */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 28 }}>
            <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#4ade80', display: 'inline-block', boxShadow: '0 0 0 3px rgba(74,222,128,0.2)', animation: 'meLiveDot 2s ease-in-out infinite' }} />
            <span style={{ fontFamily: 'var(--font-heading)', fontSize: 11, fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#4ade80' }}>Now Available</span>
            <div style={{ flex: 1, height: 1, background: 'var(--border)' }} />
          </div>

          {/* Active tour card */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 8, overflow: 'hidden', marginBottom: 80 }}>
            {/* Image side */}
            <div style={{ position: 'relative', minHeight: 440 }}>
              <img
                src={activeTour.img}
                alt="Crestone Walking Tour"
                style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }}
              />
              <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to right, transparent 50%, var(--bg-card))' }} />
              <div style={{ position: 'absolute', top: 20, left: 20 }}>
                <span style={{ display: 'inline-block', padding: '5px 14px', background: 'rgba(74,222,128,0.15)', border: '1px solid rgba(74,222,128,0.4)', borderRadius: 3 }}>
                  <span style={{ fontFamily: 'var(--font-heading)', fontSize: 11, fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: '#4ade80' }}>Available Now</span>
                </span>
              </div>
              <div style={{ position: 'absolute', top: 18, right: 20, opacity: 0.7 }}>
                <CompassIcon className="me-compass-active" />
              </div>
              <div style={{ position: 'absolute', bottom: 24, left: 20, display: 'flex', gap: 10 }}>
                {activeTour.stats.map(s => (
                  <div key={s.label} style={{ padding: '10px 14px', background: 'rgba(11,15,28,0.88)', border: '1px solid var(--border)', borderRadius: 4, backdropFilter: 'blur(8px)', textAlign: 'center' }}>
                    <p style={{ fontFamily: 'var(--font-heading)', fontSize: 17, fontWeight: 700, color: 'var(--accent)', marginBottom: 1 }}>{s.value}</p>
                    <p style={{ fontFamily: 'var(--font-alt)', fontSize: 10, fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--text-dim)' }}>{s.label}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Content side */}
            <div style={{ padding: '44px 44px 44px 40px' }}>
              <span className="eyebrow">The Original Tour</span>
              <h2 style={{ fontSize: 'clamp(26px, 3vw, 42px)', marginBottom: 16, lineHeight: 1.1 }}>The Crestone<br />Walking Tour</h2>
              <div className="divider" />
              <p style={{ fontFamily: 'var(--font-alt)', color: 'var(--text-muted)', fontSize: 15, lineHeight: 1.8, marginBottom: 28 }}>
                Crestone holds more layers of history, mystery, and unexplained phenomena per square mile than almost anywhere in Colorado. This walking tour is the full picture — from the town's spiritual sanctuary status, to its hard-labor mining past, to the UAP sightings locals have been quietly documenting for decades.
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 36 }}>
                {activeTour.topics.map(t => (
                  <div key={t.label} style={{ display: 'flex', gap: 12, alignItems: 'flex-start', padding: '10px 14px', background: 'var(--bg-section)', border: '1px solid var(--border)', borderRadius: 4 }}>
                    <span style={{ fontSize: 16, flexShrink: 0, marginTop: 1 }}>{t.icon}</span>
                    <div>
                      <p style={{ fontFamily: 'var(--font-heading)', fontSize: 12, fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 1 }}>{t.label}</p>
                      <p style={{ fontFamily: 'var(--font-alt)', fontSize: 12, color: 'var(--text-muted)', lineHeight: 1.5 }}>{t.detail}</p>
                    </div>
                  </div>
                ))}
              </div>
              <a href={BOOKING_URL} target="_blank" rel="noopener noreferrer" className="btn btn-primary" style={{ fontSize: 15, padding: '15px 36px' }}>
                Book This Tour
              </a>
            </div>
          </div>

          {/* Coming Soon label */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 28 }}>
            <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#f59e0b', display: 'inline-block', boxShadow: '0 0 0 3px rgba(245,158,11,0.2)' }} />
            <span style={{ fontFamily: 'var(--font-heading)', fontSize: 11, fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#f59e0b' }}>Coming Soon</span>
            <div style={{ flex: 1, height: 1, background: 'var(--border)' }} />
          </div>

          <div style={{ marginBottom: 32 }}>
            <h3 style={{ fontSize: 'clamp(22px, 3vw, 34px)', marginBottom: 10 }}>More Tours On The Way</h3>
            <p style={{ fontFamily: 'var(--font-alt)', color: 'var(--text-muted)', fontSize: 15 }}>
              Specialty tours and multi-day expeditions in development. A preview of what's on the horizon.
            </p>
          </div>

          <div className="grid-2" style={{ marginBottom: 40 }}>
            {comingSoon.map(tour => (
              <div key={tour.title} data-cs-theme={csTheme[tour.title] || ''} style={{ position: 'relative', borderRadius: 6, overflow: 'hidden', border: '1px solid var(--border)', background: 'var(--bg-card)' }}>
                <div style={{ position: 'relative', paddingTop: '48%', overflow: 'hidden' }}>
                  <img src={tour.img} alt={tour.title} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', filter: 'brightness(0.32) saturate(0.5)' }} />
                  <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
                    {iconMap[tour.title] && (
                      <div style={{ marginBottom: 2 }}>{iconMap[tour.title]}</div>
                    )}
                    <span style={{ fontSize: iconMap[tour.title] ? 18 : 26, opacity: iconMap[tour.title] ? 0.5 : 1 }}>🔒</span>
                    <div style={{ padding: '4px 12px', background: 'rgba(245,158,11,0.15)', border: '1px solid rgba(245,158,11,0.4)', borderRadius: 3 }}>
                      <span style={{ fontFamily: 'var(--font-heading)', fontSize: 11, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#f59e0b' }}>{tour.eta}</span>
                    </div>
                  </div>
                  {/* Drift orb overlay for UAP hover */}
                  {csTheme[tour.title] === 'uap' && (
                    <div className="cs-drift-orb"><OrbIcon style={{ width: 38, height: 38 }} /></div>
                  )}
                  {/* Flicker overlay for paranormal hover */}
                  {csTheme[tour.title] === 'paranormal' && (
                    <div className="cs-flicker-layer" />
                  )}
                </div>
                <div style={{ padding: '16px 20px 20px' }}>
                  <p style={{ fontFamily: 'var(--font-alt)', fontSize: 10, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--text-dim)', marginBottom: 4 }}>{tour.subtitle}</p>
                  <h4 style={{ fontSize: 16 }}>{tour.title}</h4>
                </div>
              </div>
            ))}
          </div>

          <div style={{ textAlign: 'center' }}>
            <Link to="/upcoming#mesa-upcoming" className="btn btn-ghost" style={{ fontSize: 14, padding: '12px 28px' }}>
              See What's Coming →
            </Link>
          </div>

        </div>
      </section>

      {/* CTA BANNER */}
      <section style={{ position: 'relative', padding: '100px 0', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, backgroundImage: `url('${IMG('Nature', '20250518_185929-EDIT.jpg')}')`, backgroundSize: 'cover', backgroundPosition: 'center', filter: 'brightness(0.28)' }} />
        <div className="container" style={{ position: 'relative', textAlign: 'center' }}>
          <span className="eyebrow">Ready?</span>
          <h2 style={{ fontSize: 'clamp(36px, 6vw, 64px)', marginBottom: 24 }}>Adventure Starts at the Edge</h2>
          <p style={{ fontFamily: 'var(--font-alt)', fontSize: 20, color: 'rgba(240,244,255,0.8)', maxWidth: 560, margin: '0 auto 40px' }}>
            Ready to seek the unknown? Join our guided journeys—where history, mystery, and wild landscapes come alive.
          </p>
          <a href={BOOKING_URL} target="_blank" rel="noopener noreferrer" className="btn btn-primary" style={{ fontSize: 16, padding: '16px 40px' }}>
            Book Your Expedition
          </a>
        </div>
      </section>

      {/* FIELD REPORTS PREVIEW */}
      <section id="mesa-reports" className="section" style={{ background: 'var(--bg-section)' }}>
        <div className="container">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 48, flexWrap: 'wrap', gap: 16 }}>
            <div data-reveal>
              <span className="eyebrow">From the Field</span>
              <h2 style={{ fontSize: 'clamp(32px, 4vw, 48px)' }}>With Modern Explorer<br />You Will Learn…</h2>
            </div>
            <Link to="/field-reports" className="btn btn-ghost" style={{ fontSize: 13, padding: '10px 22px' }}>All Reports →</Link>
          </div>
          <div className="grid-3">
            {blogPreviews.map(post => (
              <div key={post.title} className="card">
                <div style={{ position: 'relative', paddingTop: '60%', overflow: 'hidden' }}>
                  <img src={post.img} alt={post.title} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>
                <div style={{ padding: '20px 22px 24px' }}>
                  <span className="tag">{post.tag}</span>
                  <h3 style={{ fontSize: 18, margin: '12px 0 10px' }}>{post.title}</h3>
                  <p style={{ color: 'var(--text-muted)', fontSize: 14, lineHeight: 1.65 }}>{post.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ANOMALY MAP TEASER */}
      <section style={{ background: 'var(--bg-section)', borderTop: '1px solid var(--border)', padding: '72px 0' }}>
        <div className="container">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 24, flexWrap: 'wrap', gap: 16 }}>
            <div>
              <span className="eyebrow">Field Intelligence</span>
              <h2 style={{ fontSize: 'clamp(26px, 3.5vw, 42px)', lineHeight: 1.1, marginBottom: 8 }}>
                1,000+ Events.<br />One Valley.
              </h2>
              <p style={{ fontFamily: 'var(--font-alt)', color: 'var(--text-muted)', fontSize: 15, maxWidth: 440, lineHeight: 1.65 }}>
                Christopher O'Brien spent 30 years mapping the paranormal hotspots of the San Luis Valley. This is his life's work.
              </p>
            </div>
            <Link to="/field-reports#mesa-map" className="btn btn-outline" style={{ fontSize: 13, whiteSpace: 'nowrap', flexShrink: 0 }}>
              Explore the Full Anomaly Map →
            </Link>
          </div>

          {/* Teaser map */}
          <div style={{
            position: 'relative',
            border: '1px solid rgba(203,243,110,.22)',
            borderRadius: 6,
            overflow: 'hidden',
            boxShadow: '0 0 32px rgba(203,243,110,.06)',
          }}>
            {/* Top bar */}
            <div style={{
              position: 'absolute', top: 0, left: 0, right: 0, zIndex: 10,
              background: 'linear-gradient(to bottom, rgba(2,8,4,.9), transparent)',
              padding: '10px 14px 24px',
              display: 'flex', alignItems: 'center', gap: 8,
              pointerEvents: 'none',
            }}>
              <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#4ade80', boxShadow: '0 0 5px #4ade80', display: 'inline-block' }} />
              <span style={{ fontFamily: "'Courier New', monospace", fontSize: 9, fontWeight: 700, letterSpacing: '.16em', color: 'rgba(203,243,110,.65)', textTransform: 'uppercase' }}>
                SLV ANOMALY MAP — C. O'BRIEN (1952–2024)
              </span>
            </div>
            <iframe
              src="https://www.google.com/maps/d/embed?mid=1JrJi16Sso3iOS1Qy2_1NNLLxKis&ehbc=2E312F&noprof=1&ll=37.9947,-105.5183&z=10"
              title="SLV Anomaly Map"
              style={{ display: 'block', width: '100%', height: 320, border: 'none' }}
              loading="lazy"
            />
            {/* Fade + CTA overlay at bottom */}
            <div style={{
              position: 'absolute', bottom: 0, left: 0, right: 0, zIndex: 10,
              background: 'linear-gradient(to top, rgba(11,15,28,.92) 30%, transparent)',
              padding: '40px 24px 20px',
              display: 'flex', justifyContent: 'center',
              pointerEvents: 'none',
            }}>
              <Link to="/field-reports#mesa-map"
                className="btn btn-outline"
                style={{ fontSize: 12, pointerEvents: 'auto', backdropFilter: 'blur(4px)' }}
              >
                Explore the Full Anomaly Map →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="section">
        <div className="container">
          <div data-reveal style={{ textAlign: 'center', marginBottom: 56 }}>
            <span className="eyebrow">Explorer Stories</span>
            <h2 style={{ fontSize: 'clamp(32px, 4vw, 48px)' }}>Begin Your Next True Adventure</h2>
          </div>
          <div className="grid-2">
            {testimonials.map(t => (
              <div key={t.name} style={{ padding: '32px 36px', background: 'var(--bg-section)', border: '1px solid var(--border)', borderRadius: 6 }}>
                <div style={{ fontSize: 48, color: 'var(--accent)', fontFamily: 'Georgia, serif', lineHeight: 1, marginBottom: 16, opacity: 0.6 }}>"</div>
                <p style={{ fontFamily: 'var(--font-alt)', fontSize: 17, color: 'var(--text)', lineHeight: 1.7, marginBottom: 24, fontStyle: 'italic' }}>{t.quote}</p>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'var(--accent-dim)', border: '1px solid var(--border-accent)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--font-heading)', fontSize: 14, color: 'var(--accent)' }}>
                    {t.name[0]}
                  </div>
                  <div>
                    <p style={{ fontFamily: 'var(--font-heading)', fontSize: 14, fontWeight: 600, letterSpacing: '0.05em' }}>{t.name}</p>
                    <p style={{ fontSize: 12, color: 'var(--text-muted)', fontFamily: 'var(--font-alt)' }}>{t.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section style={{ background: 'var(--bg-section)', borderTop: '1px solid var(--border)', padding: '80px 0' }}>
        <div className="container" style={{ textAlign: 'center' }}>
          <span className="eyebrow">Don't Wait</span>
          <h2 style={{ fontSize: 'clamp(32px, 5vw, 54px)', marginBottom: 20 }}>Curious About Crestone's Secrets?</h2>
          <p style={{ fontFamily: 'var(--font-alt)', fontSize: 18, color: 'var(--text-muted)', maxWidth: 600, margin: '0 auto 40px', lineHeight: 1.65 }}>
            Step into a world of hidden history, spiritual sanctuaries, and unexplained mysteries. Our guided walking tours are your invitation to explore, question, and connect.
          </p>
          <div style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap' }}>
            <a href={BOOKING_URL} target="_blank" rel="noopener noreferrer" className="btn btn-primary" style={{ fontSize: 15, padding: '14px 36px' }}>Book a Tour</a>
            <Link to="/about" className="btn btn-ghost" style={{ fontSize: 15, padding: '14px 36px' }}>Learn About Us</Link>
          </div>
        </div>
      </section>
    </main>
  );
}
