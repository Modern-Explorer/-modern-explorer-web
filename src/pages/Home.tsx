import { Link } from 'react-router-dom';

const BOOKING_URL = 'https://fareharbor.com/embeds/book/modernexplorer/?full-items=yes';

const IMG = (folder: string, file: string) => `/assets/images/content/${folder}/${file}`;

const features = [
  { icon: '/assets/images/compass.png', label: 'Small Groups', desc: 'Intimate 6–12 person expeditions for a real, personal experience.' },
  { icon: '/assets/images/maps-and-flags.png', label: 'Authentic Local Experiences', desc: 'Every tour is rooted in genuine local history, legend, and lore.' },
  { icon: '/assets/images/backpack.png', label: 'Curated Immersive Travel', desc: 'Thoughtfully designed journeys that go far beyond the typical tour.' },
];

const experiences = [
  {
    category: 'Walking Tours',
    items: [
      {
        title: 'Legends & Lore of Crestone',
        desc: "Step into the legends and lore of Crestone's past. Ancient spiritual sites, unexplained phenomena, and centuries of hidden history await.",
        img: IMG('Crestone', '20250810_090739-EDIT.jpg'),
      },
      {
        title: 'UAPs & Local Mysteries',
        desc: 'Dive into tales of UFOs and local mysteries. The San Luis Valley is one of the most active UAP corridors in North America.',
        img: IMG('UFOs', 'pexels-miriamespacio-365625.jpg'),
      },
    ],
  },
  {
    category: 'Wilderness Trips',
    items: [
      {
        title: 'Sangre de Cristo Expedition',
        desc: 'Venture deep into the Sangre de Cristo range. Remote high-altitude terrain, ancient sites, and landscapes that defy description.',
        img: IMG('Crestone', '20250810_090914-EDIT.jpg'),
      },
      {
        title: 'Ruins & Mining Trails',
        desc: 'Uncover ancient ruins and forgotten sites in the Sangre de Cristo foothills. Layers of history hiding in plain sight.',
        img: IMG('History', '20250602_154009-EDIT.jpg'),
      },
    ],
  },
  {
    category: 'Field Research',
    items: [
      {
        title: 'Cryptid Hunt',
        desc: 'Join the search for elusive creatures and phenomena. Evidence review, fieldwork techniques, and hands-on investigation.',
        img: IMG('Cryptids', 'TqSDS.jpg'),
      },
      {
        title: 'Night Sky & the Unknown',
        desc: 'Gaze at stars and witness the unknown. Structured sky watches with expert commentary on UAP reporting protocols.',
        img: IMG('UFOs', 'KaTU7.jpg'),
      },
    ],
  },
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

export default function Home() {
  return (
    <main>
      {/* HERO */}
      <section style={{
        position: 'relative', minHeight: '100vh', display: 'flex', alignItems: 'center',
      }}>
        <div style={{
          position: 'absolute', inset: 0, zIndex: -1,
          backgroundImage: `url('${IMG('Nature', 'pexels-walidphotoz-847402.jpg')}')`,
          backgroundSize: 'cover', backgroundPosition: 'center 60%',
        }} />
        <div style={{ position: 'absolute', inset: 0, zIndex: -1, background: 'linear-gradient(135deg, rgba(8,12,23,0.72) 0%, rgba(8,12,23,0.38) 60%, rgba(8,12,23,0.25) 100%)' }} />

        <div className="container" style={{ paddingTop: 100, paddingBottom: 80, textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
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
            Colorado · Crestone · San Luis Valley
          </p>

          <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', justifyContent: 'center' }}>
            <a href={BOOKING_URL} target="_blank" rel="noopener noreferrer" className="btn btn-primary" style={{ fontSize: 16, padding: '16px 36px' }}>
              Explore Journeys
            </a>
            <a href="https://www.youtube.com/@ModernExplorer" target="_blank" rel="noopener noreferrer" className="btn btn-ghost" style={{ fontSize: 16, padding: '16px 36px' }}>
              ▶ See Trailer
            </a>
          </div>
        </div>
        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 140, background: 'linear-gradient(to top, var(--bg), transparent)' }} />
      </section>

      {/* SPANISH MAP FEATURE */}
      <section style={{ background: '#07090f', borderTop: '1px solid var(--border)', padding: '80px 0 0' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: 40 }}>
            <span className="eyebrow">Primary Source</span>
            <h2 style={{ fontSize: 'clamp(28px, 4vw, 44px)', marginBottom: 16 }}>A Map the Historians Buried</h2>
            <p style={{ fontFamily: 'var(--font-alt)', color: 'var(--text-muted)', fontSize: 17, maxWidth: 580, margin: '0 auto', lineHeight: 1.7 }}>
              A hand-drawn Spanish colonial map documenting treasure routes through the San Luis Valley. We've been following this document into the field. This is where the expedition begins.
            </p>
          </div>
        </div>

        {/* Full-bleed map image */}
        <div style={{ position: 'relative', maxWidth: 1000, margin: '0 auto', padding: '0 24px 0' }}>
          <div style={{
            position: 'relative',
            borderRadius: '6px 6px 0 0',
            overflow: 'hidden',
            border: '1px solid rgba(203,243,110,0.15)',
            borderBottom: 'none',
            boxShadow: '0 -8px 60px rgba(0,0,0,0.6), 0 0 0 1px rgba(203,243,110,0.08)',
          }}>
            <img
              src="/assets/images/content/History/Spanish Map.jpg"
              alt="Spanish colonial treasure map — San Luis Valley"
              style={{
                width: '100%',
                display: 'block',
                filter: 'sepia(0.25) contrast(1.08) brightness(0.92)',
              }}
            />
            {/* Subtle vignette overlay */}
            <div style={{
              position: 'absolute', inset: 0,
              background: 'radial-gradient(ellipse at center, transparent 55%, rgba(7,9,15,0.55) 100%)',
              pointerEvents: 'none',
            }} />
            {/* Bottom gradient fade into next section */}
            <div style={{
              position: 'absolute', bottom: 0, left: 0, right: 0, height: 120,
              background: 'linear-gradient(to top, #07090f, transparent)',
              pointerEvents: 'none',
            }} />
            {/* Caption badge */}
            <div style={{
              position: 'absolute', bottom: 20, left: 24,
              padding: '6px 14px',
              background: 'rgba(7,9,15,0.82)',
              border: '1px solid rgba(203,243,110,0.2)',
              borderRadius: 3,
              backdropFilter: 'blur(8px)',
            }}>
              <span style={{ fontFamily: 'var(--font-alt)', fontSize: 12, color: 'var(--text-muted)', letterSpacing: '0.08em' }}>
                Spanish Colonial Document · San Luis Valley Region
              </span>
            </div>
          </div>
        </div>
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

      {/* EXPERIENCES */}
      <section className="section">
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: 64 }}>
            <span className="eyebrow">What We Offer</span>
            <h2 style={{ fontSize: 'clamp(36px, 5vw, 56px)', marginBottom: 20 }}>Travel Beyond The Ordinary</h2>
            <p style={{ fontFamily: 'var(--font-alt)', color: 'var(--text-muted)', fontSize: 18, maxWidth: 560, margin: '0 auto' }}>
              Every journey is built around wonder, authenticity, and the kind of story you'll be telling for years.
            </p>
          </div>

          {experiences.map(group => (
            <div key={group.category} style={{ marginBottom: 64 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 28 }}>
                <span className="tag">{group.category}</span>
                <div style={{ flex: 1, height: 1, background: 'var(--border)' }} />
              </div>
              <div className="grid-2">
                {group.items.map(item => (
                  <div key={item.title} className="card" style={{ display: 'flex', flexDirection: 'column' }}>
                    <div style={{ position: 'relative', paddingTop: '56%', overflow: 'hidden' }}>
                      <img src={item.img} alt={item.title} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.4s ease' }}
                        onMouseEnter={e => (e.currentTarget.style.transform = 'scale(1.04)')}
                        onMouseLeave={e => (e.currentTarget.style.transform = 'scale(1)')}
                      />
                    </div>
                    <div style={{ padding: '24px 28px 28px' }}>
                      <h3 style={{ fontSize: 22, marginBottom: 12 }}>{item.title}</h3>
                      <p style={{ color: 'var(--text-muted)', fontSize: 15, lineHeight: 1.65, marginBottom: 20 }}>{item.desc}</p>
                      <a href={BOOKING_URL} target="_blank" rel="noopener noreferrer" className="btn btn-outline" style={{ fontSize: 13, padding: '10px 20px' }}>
                        Book This Tour
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
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
      <section className="section" style={{ background: 'var(--bg-section)' }}>
        <div className="container">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 48, flexWrap: 'wrap', gap: 16 }}>
            <div>
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

      {/* TESTIMONIALS */}
      <section className="section">
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: 56 }}>
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
