import { useState } from 'react';
import { LockPulseIcon, FootprintIcon, GhostEyeIcon, MountainIcon } from '../components/Icons';
import { useReveal } from '../hooks/useReveal';
import SEO from '../components/SEO';

const BOOKING_URL = 'https://fareharbor.com/embeds/book/modernexplorer/?full-items=yes';
const IMG = (folder: string, file: string) => `/assets/images/content/${folder}/${file}`;

// ─── Specialty tours (coming soon) ────────────────────────────────────────────
const specialtyTours = [
  {
    title: 'UFO / UAP Tour',
    subtitle: 'The Sky Watch Experience',
    desc: 'A dedicated evening tour focused entirely on UAP phenomena in the San Luis Valley. Ground-based sky watch protocols, historical sighting data, and a guided visit to the highest-activity corridors we\'ve documented.',
    img: IMG('UFOs', 'pexels-miriamespacio-365625.jpg'),
    tags: ['Evening Tour', '~90 min', 'Small Group'],
    eta: 'Fall 2025',
  },
  {
    title: 'Paranormal & Ghosts',
    subtitle: 'Crestone After Dark',
    desc: 'An after-dark walking tour through the most historically active locations in Crestone. EMF detection, EVP sessions, and documented accounts from locals who\'ve witnessed things they can\'t explain.',
    img: IMG('Ghosts', 'ZtDXn.jpg'),
    tags: ['Night Tour', '~90 min', 'Ages 16+'],
    eta: 'Winter 2025',
  },
  {
    title: 'Mining & History',
    subtitle: 'The Hidden Past',
    desc: 'A deep dive into the mining and settler history of the Sangre de Cristo range. Abandoned sites, forgotten stories, and the economic forces that shaped — and scarred — this landscape.',
    img: IMG('History', '20241222_124511-EDIT.jpg'),
    tags: ['Day Tour', '~90 min', 'Moderate Hike'],
    eta: '2026',
  },
];

// ─── Future expeditions ────────────────────────────────────────────────────────
const expeditions = [
  {
    title: 'Sasquatch Expedition',
    tagline: 'Not a tour. An actual field investigation.',
    desc: 'High-altitude backcountry sweep through the Sangre de Cristo range. Track casting, audio monitoring, trail camera deployment, and review of evidence gathered across previous seasons.',
    img: IMG('Cryptids', 'Sasquatch.jpg'),
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
  useReveal();
  return (
    <main style={{ paddingTop: 72 }}>
      <SEO
        title="Upcoming Tours & Expeditions | Modern Explorer — Crestone, Colorado"
        description="Specialty tours and expeditions launching soon in Crestone, Colorado — 30 miles from Great Sand Dunes National Park. UFO/UAP tours, paranormal investigations, Dead Man's Cave treasure expeditions, and more in the San Luis Valley."
        url="/upcoming"
      />

      {/* ── PAGE HERO ─────────────────────────────────────────────────────────── */}
      <section style={{ position: 'relative', padding: '90px 0 70px' }}>
        <div style={{ position: 'absolute', inset: 0, backgroundImage: `url('${IMG('Crestone', '20250810_095413-EDIT.jpg')}')`, backgroundSize: 'cover', backgroundPosition: 'center 35%', filter: 'brightness(0.28)' }} />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, rgba(11,15,28,0.2), var(--bg))' }} />
        <div className="container" style={{ position: 'relative', textAlign: 'center' }}>
          <span className="eyebrow">Book · Preview · Dream</span>
          <h1 style={{ fontSize: 'clamp(48px, 8vw, 90px)', marginBottom: 20 }}>Upcoming Tours</h1>
          <p style={{ fontFamily: 'var(--font-alt)', fontSize: 19, color: 'rgba(240,244,255,0.75)', maxWidth: 580, margin: '0 auto', lineHeight: 1.6 }}>
            One tour running now. More launching soon. Expeditions in the works. Here's everything on the frontier. Crestone sits 30 miles north of Great Sand Dunes National Park — the same valley, the same mountains, and a completely different kind of mystery.
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
                  { label: 'Duration', value: '45–60 min' },
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
      <section id="mesa-upcoming" className="section">
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
                      <LockPulseIcon style={{ marginBottom: 8 }} />
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

          {/* ─ DEAD MAN'S TREASURE — FEATURED EXPEDITION ──────────────────── */}
          <div id="mesa-treasure" style={{ border: '1px solid rgba(203,243,110,0.2)', borderRadius: 8, overflow: 'hidden', marginBottom: 56, background: 'var(--bg-card)' }}>

            {/* Map image — large, atmospheric */}
            <div style={{ position: 'relative', paddingTop: '42%', overflow: 'hidden' }}>
              <img
                src="/assets/images/content/History/Spanish Map.jpg"
                alt="Spanish colonial map — San Luis Valley"
                style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center top', filter: 'sepia(0.55) contrast(1.12) brightness(0.68)' }}
              />
              <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at center, transparent 35%, rgba(8,12,23,0.72) 100%)' }} />
              <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 140, background: 'linear-gradient(to top, var(--bg-card), transparent)' }} />

              {/* Top badges */}
              <div style={{ position: 'absolute', top: 24, left: 28, display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                <div style={{ padding: '6px 14px', background: 'rgba(8,12,23,0.82)', border: '1px solid rgba(203,243,110,0.35)', borderRadius: 3, backdropFilter: 'blur(8px)' }}>
                  <span style={{ fontFamily: 'var(--font-heading)', fontSize: 10, fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--accent)' }}>Featured Expedition</span>
                </div>
                <div style={{ padding: '6px 14px', background: 'rgba(8,12,23,0.82)', border: '1px solid var(--border)', borderRadius: 3, backdropFilter: 'blur(8px)' }}>
                  <span style={{ fontFamily: 'var(--font-heading)', fontSize: 10, fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--text-muted)' }}>3–5 Days · Moderate to Strenuous</span>
                </div>
              </div>

              {/* Document caption */}
              <div style={{ position: 'absolute', bottom: 18, right: 24 }}>
                <span style={{ fontFamily: 'var(--font-alt)', fontSize: 11, color: 'rgba(240,244,255,0.38)', letterSpacing: '0.08em' }}>Spanish Colonial Document · San Luis Valley Region</span>
              </div>
            </div>

            {/* Editorial content */}
            <div style={{ padding: '44px 48px 52px', display: 'grid', gridTemplateColumns: '1fr 340px', gap: 52, alignItems: 'start' }}>

              {/* Left — body copy */}
              <div>
                <p style={{ fontFamily: 'var(--font-alt)', fontSize: 12, fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--accent)', marginBottom: 14, opacity: 0.85 }}>
                  The map is real. The gold may be too.
                </p>
                <h2 style={{ fontSize: 'clamp(32px, 4.5vw, 58px)', marginBottom: 28, lineHeight: 1.04 }}>Dead Man's<br />Treasure</h2>

                <p style={{ fontFamily: 'var(--font-alt)', color: 'rgba(240,244,255,0.72)', fontSize: 15, lineHeight: 1.9, marginBottom: 40 }}>
                  In 1719, Spanish colonial governor Antonio Valverde y Cosío led a military expedition deep into the Sangre de Cristo range — the mountains whose very name, <em>Blood of Christ</em>, was given by missionaries who watched the setting sun turn the peaks a deep, violent red. What they were looking for, the official reports never quite say. The San Luis Valley sits at the center of documented Spanish colonial treasure routes stretching north from the silver mines of Chihuahua and Santa Fe. Multiple independent accounts — oral traditions, court records, surveyor field notes — converge on the same terrain: the foothills east of Crestone, where the flatland meets the mountains and the old Spanish trail systems vanish into wilderness.
                </p>

                {/* Legend I */}
                <div id="mesa-caverna" style={{ borderLeft: '2px solid rgba(203,243,110,0.35)', paddingLeft: 22, marginBottom: 36 }}>
                  <p style={{ fontFamily: 'var(--font-heading)', fontSize: 10, fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--accent)', opacity: 0.7, marginBottom: 6 }}>Legend I</p>
                  <h3 style={{ fontSize: 'clamp(18px, 2.2vw, 24px)', marginBottom: 14, letterSpacing: '0.04em' }}>Spanish Cave — <em style={{ fontWeight: 400, fontSize: '0.88em' }}>La Caverna del Oro</em></h3>
                  <p style={{ fontFamily: 'var(--font-alt)', color: 'rgba(240,244,255,0.68)', fontSize: 14, lineHeight: 1.85, marginBottom: 14 }}>
                    At 13,266 ft, Marble Mountain sits southeast of the Crestone Peak and Crestone Needle group in the Sangre de Cristo range. Inside it is a cave known officially as Spanish Cave — also called <em>La Caverna del Oro</em> and Marble Mountain Cave. Its entrance sits between 11,500 and 12,100 feet elevation, making it{' '}
                    <strong style={{ color: 'rgba(240,244,255,0.9)', fontWeight: 600 }}>the highest elevation significant cave in the United States</strong>. The passages run over a mile and descend more than 700 feet — the deepest cave in Colorado. A snowdrift blocks the entrance for most of the year and doesn't fully melt until August, leaving a window of roughly one month when entry is physically possible. Ropes and climbing gear are required throughout. It is considered the most objectively dangerous cave in Colorado.
                  </p>
                  <p style={{ fontFamily: 'var(--font-alt)', color: 'rgba(240,244,255,0.68)', fontSize: 14, lineHeight: 1.85, marginBottom: 14 }}>
                    In 1541, Spanish monks traveling with the Coronado expedition used Native American slave labor to extract gold from this cave. The operation was real enough to leave a name that has persisted for nearly 500 years. Around 1900, explorer Elisha Horn entered the cave and found a skeleton in Spanish armor with an arrow through its back. At the cave entrance, he documented a red cross painted on the rock —{' '}
                    <strong style={{ color: 'rgba(240,244,255,0.9)', fontWeight: 600 }}>still faintly visible today</strong>.
                  </p>
                  <p style={{ fontFamily: 'var(--font-alt)', color: 'rgba(240,244,255,0.68)', fontSize: 14, lineHeight: 1.85 }}>
                    In 1932, a separate expedition pushed deeper into the cave and found a second skeleton — chained by the neck to the wall. No explanation has ever been established for who it was, how it got there, or what it was guarding. The cave has been explored in pieces over the decades but has never been fully surveyed. What's in the deeper passages is still unknown.
                  </p>
                </div>

                {/* Legend II */}
                <div style={{ borderLeft: '2px solid rgba(203,243,110,0.35)', paddingLeft: 22, marginBottom: 40 }}>
                  <p style={{ fontFamily: 'var(--font-heading)', fontSize: 10, fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--accent)', opacity: 0.7, marginBottom: 6 }}>Documented · October 1880</p>
                  <h3 style={{ fontSize: 'clamp(18px, 2.2vw, 24px)', marginBottom: 14, letterSpacing: '0.04em' }}>Dead Man's Cave</h3>

                  <p style={{ fontFamily: 'var(--font-alt)', color: 'rgba(240,244,255,0.68)', fontSize: 14, lineHeight: 1.88, marginBottom: 14 }}>
                    October 1880. Three prospectors from Silver Cliff — E.J. Oliver, S.J. Harkman, and H.A. Melton — were working the Sangre de Cristo range two miles north of what would become Dead Man Camp when a blizzard closed in. Across the canyon, Oliver spotted a small opening in a sheer rock wall. They crossed, found the gap barely four feet high, and crawled through into a large chamber roughly twenty feet across.
                  </p>

                  <p style={{ fontFamily: 'var(--font-alt)', color: 'rgba(240,244,255,0.68)', fontSize: 14, lineHeight: 1.88, marginBottom: 14 }}>
                    Oliver kicked something in the dark. He lowered his torch. It was a human skull. Scattered across the cave floor were five skeletons. That is how the place got its name — Dead Man's Cave. The three men pushed deeper, working through tight passages until they broke into a second chamber. On the western wall, shelves had been carved directly into the rock. Sitting on those shelves, covered in dust, were 400 gold bars. Each one was stamped with a Spanish cross and an inverted caret — colonial mint marks from centuries earlier.
                  </p>

                  <p style={{ fontFamily: 'var(--font-alt)', color: 'rgba(240,244,255,0.68)', fontSize: 14, lineHeight: 1.88, marginBottom: 14 }}>
                    They carried out five bars, hiked over the pass to Silver Cliff, and had them assayed. <strong style={{ color: 'rgba(240,244,255,0.9)', fontWeight: 600 }}>$900 per bar.</strong> The three men became local celebrities overnight. They refused to say where the cave was. When they went back to find it, they couldn't.
                  </p>

                  {/* Value callout */}
                  <div style={{ margin: '18px 0', padding: '14px 18px', background: 'rgba(203,243,110,0.06)', border: '1px solid rgba(203,243,110,0.18)', borderRadius: 4 }}>
                    <p style={{ fontFamily: 'var(--font-alt)', color: 'rgba(240,244,255,0.72)', fontSize: 13, lineHeight: 1.75 }}>
                      400 bars × $900 = <strong style={{ color: 'rgba(240,244,255,0.9)' }}>$360,000 in 1880</strong> — equivalent to approximately <strong style={{ color: 'var(--accent)' }}>$30–50 million today</strong>, depending on how gold prices are applied. The 395 bars that stayed in the cave have never been accounted for.
                    </p>
                  </div>

                  <p style={{ fontFamily: 'var(--font-alt)', color: 'rgba(240,244,255,0.55)', fontSize: 13, lineHeight: 1.75, fontStyle: 'italic' }}>
                    The account was documented in <em style={{ fontStyle: 'normal' }}>The Fairplay Flume</em> and <em style={{ fontStyle: 'normal' }}>The Denver Post</em> in 1880 — making it one of the most credibly sourced treasure legends in Colorado history.
                  </p>
                </div>

                {/* Historical Evidence */}
                <div style={{ padding: '22px 26px', background: 'rgba(203,243,110,0.04)', border: '1px solid rgba(203,243,110,0.14)', borderRadius: 5, marginBottom: 28 }}>
                  <p style={{ fontFamily: 'var(--font-heading)', fontSize: 10, fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--accent)', opacity: 0.7, marginBottom: 8 }}>Historical Evidence</p>
                  <h3 style={{ fontSize: 'clamp(16px, 2vw, 21px)', marginBottom: 14, letterSpacing: '0.04em' }}>The Rastras</h3>
                  <p style={{ fontFamily: 'var(--font-alt)', color: 'rgba(240,244,255,0.65)', fontSize: 14, lineHeight: 1.85 }}>
                    The most tangible evidence of pre-American Spanish mining activity in the region comes from the ground itself. <em>Rastras</em> — heavy circular grinding stones used to crush ore in colonial-era mills — have been found at several sites in the Sangre de Cristo foothills near Crestone. These are not trail markers or decorative objects. They are industrial equipment. Their presence indicates sustained ore-processing operations, not a single expedition passing through. Spanish colonial miners did not haul rastras into remote mountain terrain unless they had a reason to stay. The known find locations cluster in a way that suggests a pattern — one we have been mapping against the routes marked on the document above.
                  </p>
                </div>

                {/* Active Research */}
                <div style={{ padding: '24px 28px', background: 'rgba(8,12,23,0.7)', border: '1px solid rgba(203,243,110,0.2)', borderRadius: 5, borderLeft: '3px solid var(--accent)' }}>
                  <p style={{ fontFamily: 'var(--font-heading)', fontSize: 10, fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--accent)', marginBottom: 8 }}>Expedition Status</p>
                  <h3 style={{ fontSize: 'clamp(16px, 2vw, 21px)', marginBottom: 18, letterSpacing: '0.04em' }}>The Slope No One Has Mapped</h3>

                  <p style={{ fontFamily: 'var(--font-alt)', color: 'rgba(240,244,255,0.72)', fontSize: 14, lineHeight: 1.88, marginBottom: 16 }}>
                    Two years of research — historical accounts, Spanish mission records, colonial trail mapping, rastra locations, and <strong style={{ color: 'rgba(240,244,255,0.9)', fontWeight: 600 }}>LiDAR analysis</strong> of the surrounding terrain — have pointed us to a specific face of the Sangre de Cristo range. The topography matches. The evidence of past mining activity in the area is consistent with what the historical accounts describe. We believe we've identified the general slope.
                  </p>

                  <p style={{ fontFamily: 'var(--font-alt)', color: 'rgba(240,244,255,0.72)', fontSize: 14, lineHeight: 1.88, marginBottom: 16 }}>
                    Here's what makes this different from every other treasure search in the valley: <strong style={{ color: 'rgba(240,244,255,0.9)', fontWeight: 600 }}>the specific slope we're targeting has no LiDAR data available.</strong> The coverage simply doesn't exist for this section of terrain. We don't know why. We're working entirely from old pathways and historical routes that still need to be physically located and cleared. The slope is massive, steep, and largely unexplored. That's exactly why nobody has found anything in 140 years — not because the gold isn't there, but because getting to it requires something most people aren't willing to do.
                  </p>

                  <p style={{ fontFamily: 'var(--font-alt)', color: 'rgba(240,244,255,0.72)', fontSize: 14, lineHeight: 1.88, marginBottom: 20 }}>
                    Be clear on what this expedition involves: cutting through significant deadfall, navigating steep and technically demanding slopes, using fixed ropes on exposed sections, wearing helmets, and pushing through wilderness that hasn't seen regular human traffic in decades. There are no established trails to the target area. This is genuine frontier exploration — uncomfortable, demanding, and entirely uncharted.
                  </p>

                  <p style={{ fontFamily: 'var(--font-alt)', color: 'rgba(240,244,255,0.88)', fontSize: 15, lineHeight: 1.85, fontStyle: 'italic' }}>
                    Harkman, Melton, and Oliver carried out five bars and had them assayed. The find was verified and reported in the press. Then they went back — and couldn't find the cave. In 145 years, nobody else has found it either. The remaining 395 bars are still in there. We know the creek. We know the terrain. We're going. Come help us find it.
                  </p>
                </div>
              </div>

              {/* Right — briefing card + CTA */}
              <div>
                <div style={{ padding: '28px', background: 'var(--bg-section)', border: '1px solid var(--border)', borderRadius: 6, marginBottom: 16 }}>
                  <p style={{ fontFamily: 'var(--font-heading)', fontSize: 11, fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--text-dim)', marginBottom: 20 }}>Expedition Brief</p>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
                    {[
                      { label: 'Type', value: 'Multi-Day Field Research' },
                      { label: 'Duration', value: '3–5 Days' },
                      { label: 'Difficulty', value: 'Strenuous · Technical' },
                      { label: 'Location', value: 'San Luis Valley, CO' },
                      { label: 'Status', value: 'In Development' },
                    ].map((item, i, arr) => (
                      <div key={item.label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', padding: '11px 0', borderBottom: i < arr.length - 1 ? '1px solid var(--border)' : 'none' }}>
                        <span style={{ fontFamily: 'var(--font-alt)', fontSize: 11, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--text-dim)' }}>{item.label}</span>
                        <span style={{ fontFamily: 'var(--font-alt)', fontSize: 13, fontWeight: 600, color: 'var(--text-muted)' }}>{item.value}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div style={{ padding: '18px 20px', background: 'rgba(8,12,23,0.5)', border: '1px solid var(--border)', borderRadius: 6, marginBottom: 20 }}>
                  <p style={{ fontFamily: 'var(--font-alt)', fontSize: 13, color: 'rgba(240,244,255,0.5)', lineHeight: 1.7 }}>
                    This is a real field research expedition. It is physically demanding, technically challenging, and genuinely uncharted. If you're looking for a guided tour, we have those. If you want to be part of something that has never been done — get on the list.
                  </p>
                </div>

                <NotifyButton label="Join the Expedition" />
              </div>
            </div>
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
                  {exp.icon === '🐾' && <FootprintIcon className="me-footprint" style={{ width: 44, height: 60 }} />}
                  {exp.icon === '👁️' && <GhostEyeIcon style={{ animation: 'meFloat 5s ease-in-out infinite', width: 44, height: 34 }} />}
                  {exp.icon === '⛰️' && <MountainIcon style={{ animation: 'meFloat 6s ease-in-out infinite', width: 48, height: 42 }} />}
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
