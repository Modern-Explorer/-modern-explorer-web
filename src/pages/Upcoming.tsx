import { useState } from 'react';

const BOOKING_URL = 'https://fareharbor.com/embeds/book/modernexplorer/?full-items=yes';
const IMG = (folder: string, file: string) => `/assets/images/content/${folder}/${file}`;

// ─── Specialty tours (coming soon) ────────────────────────────────────────────
const specialtyTours = [
  {
    title: 'UFO / UAP Tour',
    subtitle: 'The Sky Watch Experience',
    desc: 'A dedicated evening tour focused entirely on UAP phenomena in the San Luis Valley. Ground-based sky watch protocols, historical sighting data, and a guided visit to the highest-activity corridors we\'ve documented.',
    img: IMG('UFOs', 'pexels-miriamespacio-365625.jpg'),
    tags: ['Evening Tour', '3–4 hrs', 'Small Group'],
    eta: 'Fall 2025',
  },
  {
    title: 'Paranormal & Ghosts',
    subtitle: 'Crestone After Dark',
    desc: 'An after-dark walking tour through the most historically active locations in Crestone. EMF detection, EVP sessions, and documented accounts from locals who\'ve witnessed things they can\'t explain.',
    img: IMG('Ghosts', 'ZtDXn.jpg'),
    tags: ['Night Tour', '3 hrs', 'Ages 16+'],
    eta: 'Winter 2025',
  },
  {
    title: 'Mining & History',
    subtitle: 'The Hidden Past',
    desc: 'A deep dive into the mining and settler history of the Sangre de Cristo range. Abandoned sites, forgotten stories, and the economic forces that shaped — and scarred — this landscape.',
    img: IMG('History', '20241222_124511-EDIT.jpg'),
    tags: ['Day Tour', '4–5 hrs', 'Moderate Hike'],
    eta: '2026',
  },
];

// ─── Future expeditions ────────────────────────────────────────────────────────
const expeditions = [
  {
    title: 'Spanish Treasure Expedition',
    tagline: 'Follow the maps that historians dismissed.',
    desc: 'Multi-day field research into documented Spanish colonial treasure routes through the San Luis Valley. We\'ve been building this case for two years. When it\'s ready, you\'ll be the first to go.',
    img: IMG('History', 'IMG_20241228_093831-EDIT.jpg'),
    duration: '3–5 days',
    difficulty: 'Moderate to Strenuous',
    type: 'Multi-Day Expedition',
    icon: '🗺️',
  },
  {
    title: 'Sasquatch Expedition',
    tagline: 'Not a tour. An actual field investigation.',
    desc: 'High-altitude backcountry sweep through the Sangre de Cristo range. Track casting, audio monitoring, trail camera deployment, and review of evidence gathered across previous seasons.',
    img: IMG('Cryptids', 'TqSDS.jpg'),
    duration: '4–7 days',
    difficulty: 'Strenuous',
    type: 'Multi-Day Expedition',
    icon: '🐾',
  },
  {
    title: 'Ghost & Paranormal Deep Dive',
    tagline: 'Three nights. Multiple locations. No shortcuts.',
    desc: 'An extended paranormal investigation across Crestone and the surrounding valley floor. Full equipment suite, overnight sessions, and expert guidance from investigators who have been doing this for decades.',
    img: IMG('Ghosts', 'S8a4G.jpg'),
    duration: '3 nights',
    difficulty: 'Easy to Moderate',
    type: 'Multi-Day Expedition',
    icon: '👁️',
  },
  {
    title: 'Mountain Wilderness Expedition',
    tagline: 'The valley from the peaks that watch over it.',
    desc: 'A summit-to-floor traverse of the Sangre de Cristo range. Ancient trail systems, high-altitude anomaly sites, and some of the most remote terrain in Colorado — all with a guide who knows every inch of it.',
    img: IMG('Nature', '20250510_124904-EDIT.jpg'),
    duration: '5–7 days',
    difficulty: 'Strenuous',
    type: 'Multi-Day Expedition',
    icon: '⛰️',
  },
];

function NotifyButton({ label = 'Join Waitlist' }: { label?: string }) {
  const [done, setDone] = useState(false);
  return done ? (
    <span style={{ fontSize: 13, color: 'var(--accent)', fontFamily: 'var(--font-alt)', fontWeight: 600 }}>✓ You're on the list</span>
  ) : (
    <button
      onClick={() => setDone(true)}
      className="btn btn-outline"
      style={{ fontSize: 13, padding: '9px 20px' }}
    >
      {label}
    </button>
  );
}

export default function Upcoming() {
  return (
    <main style={{ paddingTop: 72 }}>

      {/* ── PAGE HERO ─────────────────────────────────────────────────────────── */}
      <section style={{ position: 'relative', padding: '90px 0 70px' }}>
        <div style={{ position: 'absolute', inset: 0, backgroundImage: `url('${IMG('Crestone', '20250810_095413-EDIT.jpg')}')`, backgroundSize: 'cover', backgroundPosition: 'center 35%', filter: 'brightness(0.28)' }} />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, rgba(11,15,28,0.2), var(--bg))' }} />
        <div className="container" style={{ position: 'relative', textAlign: 'center' }}>
          <span className="eyebrow">Book · Preview · Dream</span>
          <h1 style={{ fontSize: 'clamp(48px, 8vw, 90px)', marginBottom: 20 }}>Upcoming Tours</h1>
          <p style={{ fontFamily: 'var(--font-alt)', fontSize: 19, color: 'rgba(240,244,255,0.75)', maxWidth: 580, margin: '0 auto', lineHeight: 1.6 }}>
            One tour running now. More launching soon. Expeditions in the works. Here's everything on the frontier.
          </p>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════════ */}
      {/* SECTION 1 — CURRENT TOUR                                            */}
      {/* ══════════════════════════════════════════════════════════════════════ */}
      <section className="section" style={{ background: 'var(--bg-section)', borderTop: '1px solid var(--border)' }}>
        <div className="container">

          {/* Section label */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 52 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#4ade80', display: 'inline-block', boxShadow: '0 0 0 3px rgba(74,222,128,0.2)' }} />
              <span style={{ fontFamily: 'var(--font-heading)', fontSize: 11, fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#4ade80' }}>Now Available</span>
            </div>
            <div style={{ flex: 1, height: 1, background: 'var(--border)' }} />
          </div>

          <div className="grid-2" style={{ gap: 64, alignItems: 'flex-start' }}>
            {/* Left — image + quick stats */}
            <div>
              <div style={{ position: 'relative', borderRadius: 8, overflow: 'hidden', border: '1px solid var(--border)', marginBottom: 20 }}>
                <div style={{ position: 'relative', paddingTop: '65%' }}>
                  <img src={IMG('Crestone', '20250810_090608-EDIT.jpg')} alt="Crestone Walking Tour" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} />
                  <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(11,15,28,0.6) 0%, transparent 60%)' }} />
                  <div style={{ position: 'absolute', top: 16, left: 16 }}>
                    <span className="tag">Available Now</span>
                  </div>
                </div>
              </div>
              {/* Quick stats row */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
                {[
                  { label: 'Duration', value: '2.5 hrs' },
                  { label: 'Group Size', value: '6–12' },
                  { label: 'Difficulty', value: 'Easy' },
                ].map(s => (
                  <div key={s.label} style={{ padding: '14px 16px', background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 4, textAlign: 'center' }}>
                    <p style={{ fontFamily: 'var(--font-heading)', fontSize: 18, fontWeight: 700, color: 'var(--accent)', marginBottom: 2 }}>{s.value}</p>
                    <p style={{ fontFamily: 'var(--font-alt)', fontSize: 11, fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--text-dim)' }}>{s.label}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Right — description */}
            <div>
              <span className="eyebrow">The Original Tour</span>
              <h2 style={{ fontSize: 'clamp(30px, 4vw, 48px)', marginBottom: 16, lineHeight: 1.1 }}>
                The Crestone<br />Walking Tour
              </h2>
              <div className="divider" />
              <p style={{ fontFamily: 'var(--font-alt)', color: 'var(--text-muted)', fontSize: 16, lineHeight: 1.8, marginBottom: 28 }}>
                Crestone holds more layers of history, mystery, and unexplained phenomena per square mile than almost anywhere in Colorado. This walking tour is the full picture — from the town's spiritual sanctuary status, to its hard-labor mining past, to the UAP sightings that locals have been quietly documenting for decades.
              </p>

              {/* What's covered */}
              <div style={{ marginBottom: 32 }}>
                <p style={{ fontFamily: 'var(--font-heading)', fontSize: 11, fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: 14 }}>What We Cover</p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {[
                    { icon: '🕌', label: 'Spiritual History', detail: 'Sacred sites, sanctuary communities, and Crestone\'s role as a global spiritual center' },
                    { icon: '⛏️', label: 'Mining History', detail: 'Silver and gold rush era sites, boom-and-bust stories, and the people who built this town' },
                    { icon: '🛸', label: 'UFOs & UAP', detail: 'The San Luis Valley\'s documented history as one of North America\'s most active UAP corridors' },
                    { icon: '👁️', label: 'Paranormal Activity', detail: 'Documented unexplained events, local accounts, and the Valley\'s high-strangeness reputation' },
                    { icon: '🏘️', label: 'Town History', detail: 'The full arc of Crestone — from its Indigenous roots to its eccentric present' },
                  ].map(item => (
                    <div key={item.label} style={{ display: 'flex', gap: 14, alignItems: 'flex-start', padding: '12px 16px', background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 4 }}>
                      <span style={{ fontSize: 18, flexShrink: 0, marginTop: 1 }}>{item.icon}</span>
                      <div>
                        <p style={{ fontFamily: 'var(--font-heading)', fontSize: 13, fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: 2 }}>{item.label}</p>
                        <p style={{ fontFamily: 'var(--font-alt)', fontSize: 13, color: 'var(--text-muted)', lineHeight: 1.5 }}>{item.detail}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <a
                href={BOOKING_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-primary"
                style={{ fontSize: 15, padding: '15px 36px' }}
              >
                Book This Tour
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════════ */}
      {/* SECTION 2 — SPECIALTY WALKING TOURS (COMING SOON)                   */}
      {/* ══════════════════════════════════════════════════════════════════════ */}
      <section className="section">
        <div className="container">

          {/* Section label */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 52 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#f59e0b', display: 'inline-block', boxShadow: '0 0 0 3px rgba(245,158,11,0.2)' }} />
              <span style={{ fontFamily: 'var(--font-heading)', fontSize: 11, fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#f59e0b' }}>Coming Soon</span>
            </div>
            <div style={{ flex: 1, height: 1, background: 'var(--border)' }} />
          </div>

          <div style={{ marginBottom: 36 }}>
            <h2 style={{ fontSize: 'clamp(28px, 4vw, 44px)', marginBottom: 12 }}>Specialty Walking Tours</h2>
            <p style={{ fontFamily: 'var(--font-alt)', color: 'var(--text-muted)', fontSize: 16, maxWidth: 560, lineHeight: 1.65 }}>
              Dedicated single-topic tours for people who want to go deep. Each one builds on the original tour with a focused lens.
            </p>
          </div>

          <div className="grid-3">
            {specialtyTours.map(tour => (
              <div key={tour.title} style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 8, overflow: 'hidden', display: 'flex', flexDirection: 'column', position: 'relative' }}>
                {/* Locked image */}
                <div style={{ position: 'relative', paddingTop: '56%', overflow: 'hidden' }}>
                  <img src={tour.img} alt={tour.title} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', filter: 'brightness(0.45) saturate(0.6)' }} />
                  {/* Lock overlay */}
                  <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <div style={{ textAlign: 'center' }}>
                      <div style={{ fontSize: 32, marginBottom: 8, opacity: 0.9 }}>🔒</div>
                      <div style={{ display: 'inline-block', padding: '4px 12px', background: 'rgba(245,158,11,0.15)', border: '1px solid rgba(245,158,11,0.4)', borderRadius: 3 }}>
                        <span style={{ fontFamily: 'var(--font-heading)', fontSize: 11, fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: '#f59e0b' }}>
                          Unlocks {tour.eta}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Content */}
                <div style={{ padding: '22px 24px 26px', flex: 1, display: 'flex', flexDirection: 'column' }}>
                  <p style={{ fontFamily: 'var(--font-alt)', fontSize: 11, fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--text-dim)', marginBottom: 6 }}>{tour.subtitle}</p>
                  <h3 style={{ fontSize: 21, marginBottom: 12 }}>{tour.title}</h3>
                  <p style={{ color: 'var(--text-muted)', fontSize: 14, lineHeight: 1.7, marginBottom: 18, flex: 1 }}>{tour.desc}</p>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 20 }}>
                    {tour.tags.map(tag => (
                      <span key={tag} style={{ padding: '3px 10px', background: 'var(--bg-section)', border: '1px solid var(--border)', borderRadius: 2, fontSize: 11, fontFamily: 'var(--font-alt)', fontWeight: 600, color: 'var(--text-dim)' }}>{tag}</span>
                    ))}
                  </div>
                  <NotifyButton label="Notify Me When Live" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════════ */}
      {/* SECTION 3 — FUTURE EXPEDITIONS                                       */}
      {/* ══════════════════════════════════════════════════════════════════════ */}
      <section style={{ background: 'var(--bg-section)', borderTop: '1px solid var(--border)', padding: '100px 0' }}>
        <div className="container">

          {/* Section label */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 52 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <span style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--accent)', display: 'inline-block', boxShadow: '0 0 0 3px rgba(203,243,110,0.15)' }} />
              <span style={{ fontFamily: 'var(--font-heading)', fontSize: 11, fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--accent)' }}>The Frontier</span>
            </div>
            <div style={{ flex: 1, height: 1, background: 'var(--border)' }} />
          </div>

          <div style={{ marginBottom: 56 }}>
            <h2 style={{ fontSize: 'clamp(32px, 5vw, 56px)', marginBottom: 16 }}>Future Expeditions</h2>
            <p style={{ fontFamily: 'var(--font-alt)', color: 'var(--text-muted)', fontSize: 17, maxWidth: 600, lineHeight: 1.7 }}>
              These aren't walking tours. These are multi-day field operations for people who are serious about what's out there. They're in development — join the waitlist to shape how they're built.
            </p>
          </div>

          {/* 2-column grid of large expedition cards */}
          <div className="grid-2" style={{ gap: 28 }}>
            {expeditions.map((exp) => (
              <div key={exp.title} style={{ position: 'relative', borderRadius: 8, overflow: 'hidden', border: '1px solid var(--border)', minHeight: 420, display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', cursor: 'default' }}>
                {/* Full-bleed background image */}
                <img
                  src={exp.img}
                  alt={exp.title}
                  style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.6s ease' }}
                  onMouseEnter={e => (e.currentTarget.style.transform = 'scale(1.04)')}
                  onMouseLeave={e => (e.currentTarget.style.transform = 'scale(1)')}
                />
                {/* Dark gradient overlay — heavier at bottom */}
                <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(8,12,23,0.97) 0%, rgba(8,12,23,0.6) 50%, rgba(8,12,23,0.15) 100%)' }} />

                {/* Top badge */}
                <div style={{ position: 'absolute', top: 20, left: 20, right: 20, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div style={{ padding: '5px 12px', background: 'rgba(8,12,23,0.7)', border: '1px solid var(--border)', borderRadius: 3, backdropFilter: 'blur(6px)' }}>
                    <span style={{ fontFamily: 'var(--font-heading)', fontSize: 10, fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--text-muted)' }}>{exp.type}</span>
                  </div>
                  <span style={{ fontSize: 28 }}>{exp.icon}</span>
                </div>

                {/* Bottom content */}
                <div style={{ position: 'relative', padding: '0 28px 32px' }}>
                  <p style={{ fontFamily: 'var(--font-alt)', fontSize: 13, color: 'var(--accent)', fontWeight: 600, letterSpacing: '0.06em', marginBottom: 8, opacity: 0.9 }}>
                    {exp.tagline}
                  </p>
                  <h3 style={{ fontSize: 'clamp(22px, 3vw, 30px)', marginBottom: 12, lineHeight: 1.1 }}>{exp.title}</h3>
                  <p style={{ fontFamily: 'var(--font-alt)', color: 'rgba(240,244,255,0.65)', fontSize: 14, lineHeight: 1.7, marginBottom: 20 }}>{exp.desc}</p>

                  {/* Meta row */}
                  <div style={{ display: 'flex', gap: 20, marginBottom: 24 }}>
                    {[
                      { label: 'Duration', value: exp.duration },
                      { label: 'Difficulty', value: exp.difficulty },
                    ].map(m => (
                      <div key={m.label}>
                        <p style={{ fontFamily: 'var(--font-alt)', fontSize: 10, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--text-dim)', marginBottom: 2 }}>{m.label}</p>
                        <p style={{ fontFamily: 'var(--font-alt)', fontSize: 13, fontWeight: 600, color: 'var(--text-muted)' }}>{m.value}</p>
                      </div>
                    ))}
                  </div>

                  <NotifyButton label="Join the Waitlist" />
                </div>
              </div>
            ))}
          </div>

          {/* Bottom note */}
          <div style={{ marginTop: 48, padding: '24px 28px', background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 6, display: 'flex', alignItems: 'flex-start', gap: 16 }}>
            <span style={{ fontSize: 22, flexShrink: 0 }}>🧭</span>
            <div>
              <p style={{ fontFamily: 'var(--font-heading)', fontSize: 14, fontWeight: 600, letterSpacing: '0.05em', textTransform: 'uppercase', marginBottom: 6 }}>About the Expeditions</p>
              <p style={{ fontFamily: 'var(--font-alt)', color: 'var(--text-muted)', fontSize: 14, lineHeight: 1.7 }}>
                These are real field operations, not adventure tourism packages. Dates, routes, and logistics are determined by research readiness—not a calendar. Waitlist members will be consulted on format and will have first access to slots when they open.
              </p>
            </div>
          </div>

        </div>
      </section>

    </main>
  );
}
