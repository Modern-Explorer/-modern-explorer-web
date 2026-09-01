import { Link } from 'react-router-dom';
import SEO from '../components/SEO';
import GoogleReviews from '../components/GoogleReviews';
import { useBooking } from '../context/BookingContext';
import { useWaitlist } from '../context/WaitlistContext';
import { useReveal } from '../hooks/useReveal';
import { OrbIcon, CompassIcon, LanternIcon, GhostEyeIcon } from '../components/Icons';
import ParticleHero from '../components/ParticleHero';
import GlyphColumns, { GlyphDivider } from '../components/GlyphColumns';

const IMG = (folder: string, file: string) => `/assets/images/content/${folder}/${file}`;

// ── Mission pillars ──────────────────────────────────────────────────────────
const missionPillars = [
  {
    icon: '🛸',
    label: 'UAP & Aerial Phenomena',
    detail: 'The San Luis Valley is one of North America\'s most documented UAP corridors. We collect witness testimony, correlate it with radar and sensor data, and map the hotspot clusters.',
  },
  {
    icon: '🐾',
    label: 'Cryptozoology',
    detail: 'Unclassified animals — Sasquatch, dogman, thunderbirds, lake creatures — investigated as an open question: flesh-and-blood biology, something more anomalous, or both? We collect track evidence, hair samples, and structured witness data to find out what the distribution actually shows.',
  },
  {
    icon: '🏛️',
    label: 'Lost History & Archaeology',
    detail: 'Pre-Columbian petroglyphs, anomalous ruins, and oral histories that don\'t fit the accepted timeline. We document, photograph, and cross-reference with academic sources.',
  },
  {
    icon: '🧭',
    label: 'Field Operations',
    detail: 'Reconnaissance, night operations, site surveys, drone mapping, and sensor deployment. The methodology — instruments, protocols, chain-of-custody data capture — that turns field time into evidence instead of stories.',
  },
];

// ── Frontier / membership features ──────────────────────────────────────────
const frontierFeatures = [
  { icon: '🗄️', label: 'The Arcanum', detail: 'A structured database of incidents, sightings, and field findings — organized by type, location, and confidence level.' },
  { icon: '📡', label: 'Field Instruments', detail: 'EMF meters, Geiger counters, thermal imaging, and GPS-logged tracks. Real data from real expeditions.' },
  { icon: '📋', label: 'Ongoing Case Files', detail: 'Active investigations with running notes, evidence chains, and member-contributed data from across the region.' },
  { icon: '🌐', label: 'Researcher Community', detail: 'Connect with investigators, share findings, and access the collective knowledge of a serious field research network.' },
];

// ── Tours data ───────────────────────────────────────────────────────────────
const activeTour = {
  img: IMG('Crestone', 'old-crestone.webp'),
  imgMobile: IMG('Crestone', 'old-crestone-mobile.webp'),
  stats: [
    { label: 'Duration', value: '45–60 min' },
    { label: 'Group Size', value: '2–12' },
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
  { title: 'UFO / UAP Tour', subtitle: 'The Sky Watch Experience', img: IMG('UFOs', 'pexels-miriamespacio-365625.webp'), eta: 'Fall 2025' },
  { title: 'Paranormal & Ghosts', subtitle: 'Crestone After Dark', img: IMG('Ghosts', 'ZtDXn.webp'), eta: 'Winter 2025' },
  { title: 'Mining & History', subtitle: 'The Hidden Past', img: IMG('History', '20241222_124511-EDIT.webp'), eta: '2026' },
  { title: 'Future Expeditions', subtitle: 'Multi-Day Field Operations', img: IMG('Nature', '20250510_124904-EDIT.webp'), eta: 'In Development' },
];

const csTheme: Record<string, string> = {
  'UFO / UAP Tour': 'uap',
  'Paranormal & Ghosts': 'paranormal',
  'Mining & History': 'mining',
  'Future Expeditions': 'expedition',
};

const iconMap: Record<string, React.ReactNode> = {
  'UFO / UAP Tour':      <OrbIcon className="me-orb" />,
  'Paranormal & Ghosts': <GhostEyeIcon className="me-ghost-eye" />,
  'Mining & History':    <LanternIcon />,
  'Future Expeditions':  <CompassIcon className="me-compass" />,
};

const blogPreviews = [
  { tag: 'Field Report', title: 'Stories from the Edge', desc: 'Firsthand accounts of haunted trails, lost ruins, and the mysteries we uncover on every journey.', img: IMG('Crestone', '20250810_093828-EDIT.webp') },
  { tag: 'Skills', title: 'Field Wisdom & Survival', desc: 'Hard-won lessons, gear tips, and practical know-how for thriving in the unknown.', img: IMG('Mateo', '20250421_075338-EDIT.webp') },
  { tag: 'Community', title: 'Voices from Our Community', desc: 'Insights from fellow adventurers, local legends, and special guests — new perspectives on history and mystery.', img: IMG('History', '20231110_154447.webp') },
];

export default function Home() {
  const { open: openBooking } = useBooking();
  const { open: openWaitlist } = useWaitlist();
  useReveal();

  return (
    <main style={{ position: 'relative' }}>
      <GlyphColumns />
      <SEO
        title="Modern Explorer | UFO, Paranormal & Cryptozoology Research — Crestone, CO"
        description="Modern Explorer investigates unknown phenomena — UAP, cryptozoology, and lost history — in Crestone, Colorado and the San Luis Valley. Join the research or book a guided expedition."
        url="/"
      />

      {/* ── HERO ─────────────────────────────────────────────────────────── */}
      <ParticleHero />

      {/* ── THE MISSION ──────────────────────────────────────────────────── */}
      <GlyphDivider />
      <section className="section" style={{ background: 'var(--bg)' }}>
        <div className="container">
          <div data-reveal style={{ textAlign: 'center', marginBottom: 56 }}>
            <span className="eyebrow">What We Investigate</span>
            <h2 style={{ fontSize: 'clamp(30px, 4.5vw, 52px)', marginBottom: 18 }}>
              The Mission: Document the Unexplained
            </h2>
            <p style={{ fontFamily: 'var(--font-alt)', color: 'var(--text-muted)', fontSize: 17, maxWidth: 600, margin: '0 auto' }}>
              We operate with modern instruments, structured field protocols, and a commitment to data over speculation. Four primary domains — one valley with more documented incidents per square mile than almost anywhere else on the continent.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(230px, 1fr))', gap: 16 }}>
            {missionPillars.map(p => (
              <div key={p.label} data-reveal style={{ padding: '28px 24px', background: 'var(--bg-section)', border: '1px solid var(--border)', borderRadius: 6 }}>
                <div style={{ fontSize: 32, marginBottom: 14 }}>{p.icon}</div>
                <h3 style={{ fontSize: 18, marginBottom: 10 }}>{p.label}</h3>
                <p style={{ fontFamily: 'var(--font-alt)', fontSize: 14, color: 'var(--text-muted)', lineHeight: 1.7 }}>{p.detail}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <GlyphDivider />
      {/* ── THE FRONTIER — RESEARCH ACCESS ───────────────────────────────── */}
      <section className="section" style={{ background: 'var(--bg-section)', borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)' }}>
        <div className="container">
          <div style={{ display: 'flex', gap: 64, flexWrap: 'wrap', alignItems: 'center' }}>
            {/* Left: copy */}
            <div style={{ flex: '1 1 340px' }}>
              <div data-reveal>
                <span className="eyebrow">The Frontier</span>
                <h2 style={{ fontSize: 'clamp(28px, 4vw, 46px)', marginBottom: 16, lineHeight: 1.1 }}>
                  Research Access.<br />Field Tools. Community.
                </h2>
                <p style={{ fontFamily: 'var(--font-alt)', color: 'var(--text-muted)', fontSize: 16, lineHeight: 1.75, marginBottom: 28 }}>
                  The Frontier is Modern Explorer's research membership — access to the Arcanum phenomenon database, field instrument data, active case files, and a community of serious investigators. We're building the infrastructure that serious field research has always lacked.
                </p>
                <p style={{ fontFamily: 'var(--font-alt)', color: 'var(--text-muted)', fontSize: 15, lineHeight: 1.75, marginBottom: 36 }}>
                  The waitlist is open now. Founding members shape what gets built first.
                </p>
                <button onClick={() => openWaitlist('Home — The Frontier section')} className="btn btn-primary" style={{ fontSize: 15, padding: '14px 32px' }}>
                  Join the Waitlist →
                </button>
              </div>
            </div>
            {/* Right: feature grid */}
            <div style={{ flex: '1 1 320px' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {frontierFeatures.map(f => (
                  <div key={f.label} data-reveal style={{ display: 'flex', gap: 14, alignItems: 'flex-start', padding: '14px 16px', background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 5 }}>
                    <span style={{ fontSize: 20, flexShrink: 0 }}>{f.icon}</span>
                    <div>
                      <p style={{ fontFamily: 'var(--font-heading)', fontSize: 13, fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: 4, color: 'var(--accent)' }}>{f.label}</p>
                      <p style={{ fontFamily: 'var(--font-alt)', fontSize: 13, color: 'var(--text-muted)', lineHeight: 1.55 }}>{f.detail}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <GlyphDivider />
      {/* ── EXPEDITIONS & TOURS ──────────────────────────────────────────── */}
      <section id="mesa-tours" className="section">
        <div className="container">

          <div data-reveal style={{ textAlign: 'center', marginBottom: 48 }}>
            <span className="eyebrow">Expeditions &amp; Tours</span>
            <h2 style={{ fontSize: 'clamp(28px, 4vw, 46px)', marginBottom: 16 }}>
              Guided Tours of Crestone &amp; the San Luis Valley
            </h2>
            <p style={{ fontFamily: 'var(--font-alt)', color: 'var(--text-muted)', fontSize: 16, maxWidth: 520, margin: '0 auto' }}>
              One tour running now. Specialty UAP, paranormal, and multi-day expeditions in development.
            </p>
          </div>

          {/* Now Available label */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
            <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#4ade80', display: 'inline-block', boxShadow: '0 0 0 3px rgba(74,222,128,0.2)', animation: 'meLiveDot 2s ease-in-out infinite' }} />
            <span style={{ fontFamily: 'var(--font-heading)', fontSize: 11, fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#4ade80' }}>Now Available</span>
            <div style={{ flex: 1, height: 1, background: 'var(--border)' }} />
          </div>

          {/* Active tour card — Crestone Walking Tour */}
          <div className="home-tour-card">
            <div className="home-tour-image" style={{ position: 'relative', minHeight: 400 }}>
              <picture>
                <source
                  media="(max-width: 640px)"
                  srcSet={activeTour.imgMobile}
                  type="image/webp"
                />
                <img
                  src={activeTour.img}
                  alt="Historic black-and-white photo of old Crestone, Colorado — Crestone tours"
                  loading="lazy"
                  decoding="async"
                  style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }}
                />
              </picture>
              <div className="tour-gradient-overlay" style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to right, transparent 40%, var(--bg-card))' }} />
              <div style={{ position: 'absolute', top: 20, left: 20 }}>
                <span style={{ display: 'inline-block', padding: '5px 14px', background: 'rgba(74,222,128,0.15)', border: '1px solid rgba(74,222,128,0.4)', borderRadius: 3 }}>
                  <span style={{ fontFamily: 'var(--font-heading)', fontSize: 11, fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: '#4ade80' }}>Available Now</span>
                </span>
              </div>
              <div style={{ position: 'absolute', top: 18, right: 20, opacity: 0.7 }}>
                <CompassIcon className="me-compass-active" />
              </div>
              <div className="home-tour-stats" style={{ position: 'absolute', bottom: 24, left: 20, display: 'flex', gap: 10 }}>
                {activeTour.stats.map(s => (
                  <div key={s.label} style={{ padding: '10px 14px', background: 'rgba(11,15,28,0.88)', border: '1px solid var(--border)', borderRadius: 4, backdropFilter: 'blur(8px)', textAlign: 'center' }}>
                    <p style={{ fontFamily: 'var(--font-heading)', fontSize: 17, fontWeight: 700, color: 'var(--accent)', marginBottom: 1 }}>{s.value}</p>
                    <p style={{ fontFamily: 'var(--font-alt)', fontSize: 10, fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--text-dim)' }}>{s.label}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="home-tour-content" style={{ padding: '44px 44px 44px 40px' }}>
              <span className="eyebrow">The Original Tour</span>
              <h2 style={{ fontSize: 'clamp(24px, 2.8vw, 38px)', marginBottom: 14, lineHeight: 1.1 }}>The Crestone<br />Walking Tour</h2>
              <div className="divider" />
              <p style={{ fontFamily: 'var(--font-alt)', color: 'var(--text-muted)', fontSize: 15, lineHeight: 1.8, marginBottom: 24 }}>
                Crestone holds more layers of history, mystery, and unexplained phenomena per square mile than almost anywhere in Colorado. This walking tour covers the full picture — from the town's spiritual sanctuary status and hard-labor mining past to the UAP sightings locals have been quietly documenting for decades.
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 7, marginBottom: 32 }}>
                {activeTour.topics.map(t => (
                  <div key={t.label} style={{ display: 'flex', gap: 12, alignItems: 'flex-start', padding: '9px 12px', background: 'var(--bg-section)', border: '1px solid var(--border)', borderRadius: 4 }}>
                    <span style={{ fontSize: 15, flexShrink: 0, marginTop: 1 }}>{t.icon}</span>
                    <div>
                      <p style={{ fontFamily: 'var(--font-heading)', fontSize: 11, fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 1 }}>{t.label}</p>
                      <p style={{ fontFamily: 'var(--font-alt)', fontSize: 12, color: 'var(--text-muted)', lineHeight: 1.5 }}>{t.detail}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="home-tour-booking" style={{ display: 'flex', alignItems: 'center', gap: 20, flexWrap: 'wrap' }}>
                <div>
                  <span style={{ fontFamily: 'var(--font-heading)', fontSize: 30, fontWeight: 700, color: 'var(--accent)', letterSpacing: '-0.01em' }}>$35</span>
                  <span style={{ fontFamily: 'var(--font-alt)', fontSize: 14, color: 'var(--text-muted)', marginLeft: 6 }}>/ person</span>
                  <p style={{ fontFamily: 'var(--font-alt)', fontSize: 12, color: 'var(--text-dim)', marginTop: 2 }}>Groups of 2–12 · 45–60 min · All ages</p>
                </div>
                <button onClick={openBooking} className="btn btn-primary" style={{ fontSize: 14, padding: '13px 30px' }}>
                  Book This Tour →
                </button>
              </div>
            </div>
          </div>

          {/* Coming Soon */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, margin: '40px 0 24px' }}>
            <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#f59e0b', display: 'inline-block', boxShadow: '0 0 0 3px rgba(245,158,11,0.2)' }} />
            <span style={{ fontFamily: 'var(--font-heading)', fontSize: 11, fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#f59e0b' }}>Coming Soon</span>
            <div style={{ flex: 1, height: 1, background: 'var(--border)' }} />
          </div>

          <div className="grid-2 home-coming-soon" style={{ marginBottom: 36 }}>
            {comingSoon.map(tour => (
              <div key={tour.title} data-cs-theme={csTheme[tour.title] || ''} style={{ position: 'relative', borderRadius: 6, overflow: 'hidden', border: '1px solid var(--border)', background: 'var(--bg-card)' }}>
                <div style={{ position: 'relative', paddingTop: '46%', overflow: 'hidden' }}>
                  <img src={tour.img} alt={tour.title} loading="lazy" decoding="async" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', filter: 'brightness(0.32) saturate(0.5)' }} />
                  <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
                    {iconMap[tour.title] && <div style={{ marginBottom: 2 }}>{iconMap[tour.title]}</div>}
                    <span style={{ fontSize: iconMap[tour.title] ? 18 : 26, opacity: iconMap[tour.title] ? 0.5 : 1 }}>🔒</span>
                    <div style={{ padding: '4px 12px', background: 'rgba(245,158,11,0.15)', border: '1px solid rgba(245,158,11,0.4)', borderRadius: 3 }}>
                      <span style={{ fontFamily: 'var(--font-heading)', fontSize: 11, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#f59e0b' }}>{tour.eta}</span>
                    </div>
                  </div>
                  {csTheme[tour.title] === 'uap' && <div className="cs-drift-orb"><OrbIcon style={{ width: 38, height: 38 }} /></div>}
                  {csTheme[tour.title] === 'paranormal' && <div className="cs-flicker-layer" />}
                </div>
                <div style={{ padding: '14px 18px 18px' }}>
                  <p style={{ fontFamily: 'var(--font-alt)', fontSize: 10, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--text-dim)', marginBottom: 3 }}>{tour.subtitle}</p>
                  <h4 style={{ fontSize: 15 }}>{tour.title}</h4>
                </div>
              </div>
            ))}
          </div>

          <div style={{ textAlign: 'center' }}>
            <Link to="/upcoming#mesa-upcoming" className="btn btn-ghost" style={{ fontSize: 14, padding: '11px 26px' }}>
              See All Upcoming Tours →
            </Link>
          </div>
        </div>
      </section>

      <GlyphDivider />
      {/* ── LATEST FROM THE FIELD ────────────────────────────────────────── */}
      <section id="mesa-reports" className="section" style={{ background: 'var(--bg-section)', borderTop: '1px solid var(--border)' }}>
        <div className="container">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 44, flexWrap: 'wrap', gap: 16 }}>
            <div data-reveal>
              <span className="eyebrow">From the Field</span>
              <h2 style={{ fontSize: 'clamp(28px, 3.5vw, 44px)' }}>Latest From the Field</h2>
            </div>
            <Link to="/field-reports" className="btn btn-ghost" style={{ fontSize: 13, padding: '10px 22px' }}>All Reports →</Link>
          </div>
          <div className="grid-3">
            {blogPreviews.map(post => (
              <div key={post.title} className="card">
                <div style={{ position: 'relative', paddingTop: '60%', overflow: 'hidden' }}>
                  <img src={post.img} alt={post.title} loading="lazy" decoding="async" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>
                <div style={{ padding: '18px 20px 22px' }}>
                  <span className="tag">{post.tag}</span>
                  <h3 style={{ fontSize: 17, margin: '10px 0 8px' }}>{post.title}</h3>
                  <p style={{ color: 'var(--text-muted)', fontSize: 14, lineHeight: 1.65 }}>{post.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── ANOMALY MAP TEASER ───────────────────────────────────────────── */}
      <section style={{ background: 'var(--bg-section)', borderTop: '1px solid var(--border)', padding: '72px 0' }}>
        <div className="container">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 24, flexWrap: 'wrap', gap: 16 }}>
            <div>
              <span className="eyebrow">Field Intelligence</span>
              <h2 style={{ fontSize: 'clamp(24px, 3.2vw, 40px)', lineHeight: 1.1, marginBottom: 8 }}>
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
          <div style={{ position: 'relative', border: '1px solid rgba(203,243,110,.22)', borderRadius: 6, overflow: 'hidden', boxShadow: '0 0 32px rgba(203,243,110,.06)' }}>
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, zIndex: 10, background: 'linear-gradient(to bottom, rgba(2,8,4,.9), transparent)', padding: '10px 14px 24px', display: 'flex', alignItems: 'center', gap: 8, pointerEvents: 'none' }}>
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
            <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, zIndex: 10, background: 'linear-gradient(to top, rgba(11,15,28,.92) 30%, transparent)', padding: '40px 24px 20px', display: 'flex', justifyContent: 'center', pointerEvents: 'none' }}>
              <Link to="/field-reports#mesa-map" className="btn btn-outline" style={{ fontSize: 12, pointerEvents: 'auto', backdropFilter: 'blur(4px)' }}>
                Explore the Full Anomaly Map →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── REVIEWS ──────────────────────────────────────────────────────── */}
      <section className="section">
        <div className="container">
          <GoogleReviews />
        </div>
      </section>

      {/* ── FINAL CTA ────────────────────────────────────────────────────── */}
      <section style={{ background: 'var(--bg-section)', borderTop: '1px solid var(--border)', padding: '80px 0' }}>
        <div className="container" style={{ textAlign: 'center' }}>
          <span className="eyebrow">Ready to Investigate?</span>
          <h2 style={{ fontSize: 'clamp(28px, 4.5vw, 50px)', marginBottom: 18 }}>
            Guided UFO &amp; Paranormal Tours in Crestone, Colorado
          </h2>
          <p style={{ fontFamily: 'var(--font-alt)', fontSize: 17, color: 'var(--text-muted)', maxWidth: 580, margin: '0 auto 36px', lineHeight: 1.7 }}>
            Join a guided tour of the San Luis Valley's most documented paranormal sites — or join The Frontier and become part of the research.
          </p>
          <div style={{ display: 'flex', gap: 14, justifyContent: 'center', flexWrap: 'wrap' }}>
            <button onClick={openBooking} className="btn btn-primary" style={{ fontSize: 15, padding: '14px 34px' }}>Book a Tour</button>
            <button onClick={() => openWaitlist('Home — Bottom CTA')} className="btn btn-ghost" style={{ fontSize: 15, padding: '14px 34px' }}>Join the Research</button>
          </div>
        </div>
      </section>
    </main>
  );
}
