import SEO from '../components/SEO';

const BOOKING_URL = 'https://fareharbor.com/embeds/book/modernexplorer/?full-items=yes';
const IMG = (folder: string, file: string) => `/assets/images/content/${folder}/${file}`;

const values = [
  { title: 'Boots on the Ground', desc: "We don't theorize from armchairs. Every claim we investigate, every trail we walk, we do it firsthand—in the field, in real conditions." },
  { title: 'Respect for the Land', desc: 'The places we explore are sacred to many. We operate with deep respect for the land, local communities, and the stories they hold.' },
  { title: 'Open-Minded Rigor', desc: 'We approach every mystery with the curiosity of a scientist and the wonder of a child. We follow evidence wherever it leads.' },
  { title: 'Community-Driven', desc: 'This is a "we" operation. Our guests, guides, and local partners are all part of the same expedition.' },
];

const gallery = [
  IMG('Crestone', '20250810_090447-EDIT.jpg'),
  IMG('Crestone', '20250810_090525-EDIT.jpg'),
  IMG('Crestone', '20250810_090608-EDIT.jpg'),
  IMG('Nature', '20241109_165442-EDIT.jpg'),
  IMG('Crestone', '20250810_091607-EDIT.jpg'),
  IMG('Nature', '20250510_091707-EDIT.jpg'),
];

const coreTeamPlaceholders = [
  { slot: 1, label: 'Core Team Member' },
  { slot: 2, label: 'Core Team Member' },
  { slot: 3, label: 'Core Team Member' },
];

const guidePlaceholders = [
  { slot: 1 },
  { slot: 2 },
  { slot: 3 },
  { slot: 4 },
];

export default function About() {
  return (
    <main style={{ paddingTop: 72 }}>
      <SEO
        title="About Modern Explorer — Crestone, Colorado"
        description="Modern Explorer is led by founder Mateo Argüello, a former Marine Corps intelligence operator based in Crestone, Colorado — 30 miles from Great Sand Dunes National Park. Small-group guided tours through the mysteries of the San Luis Valley and Sangre de Cristo mountains."
        url="/about"
      />
      {/* PAGE HERO */}
      <section style={{ position: 'relative', padding: '100px 0 80px' }}>
        <div style={{ position: 'absolute', inset: 0, backgroundImage: `url('${IMG('Crestone', '20250810_093514-EDIT.jpg')}')`, backgroundSize: 'cover', backgroundPosition: 'center', filter: 'brightness(0.3)' }} />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, rgba(11,15,28,0.3), var(--bg))' }} />
        <div className="container" style={{ position: 'relative', textAlign: 'center' }}>
          <span className="eyebrow">Our Story</span>
          <h1 style={{ fontSize: 'clamp(44px, 7vw, 80px)', marginBottom: 24 }}>Who We Are</h1>
          <p style={{ fontFamily: 'var(--font-alt)', fontSize: 20, color: 'rgba(240,244,255,0.8)', maxWidth: 620, margin: '0 auto', lineHeight: 1.65 }}>
            Modern Explorer is a Colorado-based guided tour company built around one idea: the best adventures are the ones that leave you wanting more.
          </p>
        </div>
      </section>

      {/* FOUNDER */}
      <section id="mesa-about" className="section">
        <div className="container">
          <div className="grid-2" style={{ alignItems: 'center', gap: 64 }}>
            <div style={{ position: 'relative' }}>
              <img
                src={IMG('Mateo', '20250301_134650.jpg')}
                alt="Mateo Argüello"
                style={{ width: '100%', borderRadius: 6, border: '1px solid var(--border)', display: 'block' }}
              />
              <div style={{
                position: 'absolute', bottom: -20, right: -20,
                background: 'var(--bg-card)', border: '1px solid var(--border-accent)',
                borderRadius: 6, padding: '14px 22px',
              }}>
                <p style={{ fontFamily: 'var(--font-heading)', fontSize: 11, fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--accent)', marginBottom: 2 }}>Founder</p>
                <p style={{ fontFamily: 'var(--font-heading)', fontSize: 16, fontWeight: 600, color: 'var(--text)' }}>Mateo Argüello</p>
              </div>
            </div>
            <div>
              <span className="eyebrow">The Founder</span>
              <h2 style={{ fontSize: 'clamp(32px, 4vw, 48px)', marginBottom: 20 }}>Built From<br />the Ground Up</h2>
              <div className="divider" />
              <p style={{ fontFamily: 'var(--font-alt)', color: 'var(--text-muted)', fontSize: 16, lineHeight: 1.75, marginBottom: 20 }}>
                Mateo Argüello built Modern Explorer from a lifelong obsession with the unexplained and a conviction that real discovery still happens—if you're willing to look for it. He created this company to bring curious people into the field, not just to a viewpoint.
              </p>
              <p style={{ fontFamily: 'var(--font-alt)', color: 'var(--text-muted)', fontSize: 16, lineHeight: 1.75, marginBottom: 32 }}>
                Based in Colorado and rooted in the San Luis Valley, Mateo specializes in cryptozoology, high-strangeness field research, and the kind of local lore that doesn't make it into the guidebooks. Every tour he leads is built on what he's actually found—not what's expected.
              </p>
              <a href={BOOKING_URL} target="_blank" rel="noopener noreferrer" className="btn btn-primary">
                Join an Expedition
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* GALLERY STRIP */}
      <section style={{ overflow: 'hidden', borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)' }}>
        <div style={{ display: 'flex', height: 280 }}>
          {gallery.map((src, i) => (
            <div key={i} style={{ flex: 1, minWidth: 0, overflow: 'hidden' }}>
              <img src={src} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.5s ease' }}
                onMouseEnter={e => (e.currentTarget.style.transform = 'scale(1.06)')}
                onMouseLeave={e => (e.currentTarget.style.transform = 'scale(1)')}
              />
            </div>
          ))}
        </div>
      </section>

      {/* MISSION */}
      <section className="section" style={{ background: 'var(--bg-section)' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: 56 }}>
            <span className="eyebrow">Our Mission</span>
            <h2 style={{ fontSize: 'clamp(32px, 4vw, 48px)' }}>Build a Self-Funded<br />Exploration Engine</h2>
          </div>
          <div style={{ maxWidth: 780, margin: '0 auto', textAlign: 'center' }}>
            <p style={{ fontFamily: 'var(--font-alt)', color: 'var(--text-muted)', fontSize: 18, lineHeight: 1.8, marginBottom: 20 }}>
              We're building a self-funded exploration engine that enables real discovery in archaeology, cryptozoology, UAPs, paranormal phenomena, and anomalous events—in places where conventional funding falls short.
            </p>
            <p style={{ fontFamily: 'var(--font-alt)', color: 'var(--text-muted)', fontSize: 18, lineHeight: 1.8 }}>
              Every ticket sold funds deeper field research, better equipment, and more ambitious expeditions into the San Luis Valley and beyond. You're not just a tourist—you're a supporter of genuine discovery.
            </p>
          </div>
        </div>
      </section>

      {/* VALUES */}
      <section className="section">
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: 56 }}>
            <span className="eyebrow">What We Stand For</span>
            <h2 style={{ fontSize: 'clamp(32px, 4vw, 48px)' }}>Our Core Values</h2>
          </div>
          <div className="grid-2">
            {values.map((v, i) => (
              <div key={v.title} style={{ padding: '32px 36px', background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 6 }}>
                <div style={{ fontFamily: 'var(--font-heading)', fontSize: 13, color: 'var(--accent)', letterSpacing: '0.15em', marginBottom: 12 }}>0{i + 1}</div>
                <h3 style={{ fontSize: 22, marginBottom: 12 }}>{v.title}</h3>
                <p style={{ color: 'var(--text-muted)', fontSize: 15, lineHeight: 1.7 }}>{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CORE TEAM */}
      <section className="section" style={{ background: 'var(--bg-section)', borderTop: '1px solid var(--border)' }}>
        <div className="container">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 56, flexWrap: 'wrap', gap: 16 }}>
            <div>
              <span className="eyebrow">The Team</span>
              <h2 style={{ fontSize: 'clamp(32px, 4vw, 48px)' }}>Core Team</h2>
            </div>
            <p style={{ fontFamily: 'var(--font-alt)', fontSize: 14, color: 'var(--text-dim)', fontStyle: 'italic' }}>
              Growing soon
            </p>
          </div>
          <div className="grid-3">
            {coreTeamPlaceholders.map(p => (
              <div key={p.slot} style={{
                background: 'var(--bg-card)',
                border: '1px dashed var(--border)',
                borderRadius: 6,
                overflow: 'hidden',
                opacity: 0.55,
              }}>
                <div style={{
                  paddingTop: '75%',
                  background: 'repeating-linear-gradient(45deg, var(--bg) 0px, var(--bg) 10px, var(--bg-card) 10px, var(--bg-card) 20px)',
                  position: 'relative',
                }}>
                  <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <div style={{ width: 56, height: 56, borderRadius: '50%', background: 'var(--bg-section)', border: '2px dashed var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <span style={{ fontSize: 22, opacity: 0.4 }}>👤</span>
                    </div>
                  </div>
                </div>
                <div style={{ padding: '20px 24px 24px' }}>
                  <div style={{ height: 14, width: '60%', background: 'var(--bg-section)', borderRadius: 3, marginBottom: 8 }} />
                  <div style={{ height: 10, width: '40%', background: 'var(--bg-section)', borderRadius: 3, marginBottom: 16 }} />
                  <div style={{ height: 8, width: '100%', background: 'var(--bg-section)', borderRadius: 2, marginBottom: 6 }} />
                  <div style={{ height: 8, width: '85%', background: 'var(--bg-section)', borderRadius: 2 }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* GUIDES */}
      <section className="section">
        <div className="container">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 48, flexWrap: 'wrap', gap: 16 }}>
            <div>
              <span className="eyebrow">In the Field</span>
              <h2 style={{ fontSize: 'clamp(32px, 4vw, 48px)' }}>Our Guides</h2>
            </div>
            <p style={{ fontFamily: 'var(--font-alt)', fontSize: 14, color: 'var(--text-dim)', fontStyle: 'italic' }}>
              Guide profiles coming soon
            </p>
          </div>
          <div className="grid-4">
            {guidePlaceholders.map(p => (
              <div key={p.slot} style={{
                background: 'var(--bg-card)',
                border: '1px dashed var(--border)',
                borderRadius: 6,
                overflow: 'hidden',
                opacity: 0.5,
              }}>
                <div style={{ paddingTop: '100%', position: 'relative', background: 'var(--bg-section)' }}>
                  <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <div style={{ width: 48, height: 48, borderRadius: '50%', background: 'var(--bg)', border: '2px dashed var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <span style={{ fontSize: 18, opacity: 0.4 }}>👤</span>
                    </div>
                  </div>
                </div>
                <div style={{ padding: '14px 16px 18px' }}>
                  <div style={{ height: 12, width: '70%', background: 'var(--bg-section)', borderRadius: 3, marginBottom: 6 }} />
                  <div style={{ height: 9, width: '50%', background: 'var(--bg-section)', borderRadius: 2, marginBottom: 10 }} />
                  <div style={{ height: 7, width: '100%', background: 'var(--bg-section)', borderRadius: 2, marginBottom: 4 }} />
                  <div style={{ height: 7, width: '80%', background: 'var(--bg-section)', borderRadius: 2 }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* LOCATION — Crestone only */}
      <section className="section" style={{ background: 'var(--bg-section)', borderTop: '1px solid var(--border)' }}>
        <div className="container">
          <div className="grid-2" style={{ alignItems: 'center', gap: 64 }}>
            <div>
              <span className="eyebrow">Where We Operate</span>
              <h2 style={{ fontSize: 'clamp(32px, 4vw, 48px)', marginBottom: 20 }}>Crestone &<br />the San Luis Valley</h2>
              <div className="divider" />
              <p style={{ fontFamily: 'var(--font-alt)', color: 'var(--text-muted)', fontSize: 16, lineHeight: 1.75, marginBottom: 16 }}>
                Crestone sits at 7,930 ft in the heart of the San Luis Valley — the largest alpine valley in the world, stretching 122 miles long and 74 miles wide across 8,000 square miles. Located 30 miles north of Great Sand Dunes National Park and surrounded by the Sangre de Cristo mountains, it draws spiritual seekers, researchers, and the simply curious from around the world.
              </p>
              <p style={{ fontFamily: 'var(--font-alt)', color: 'var(--text-muted)', fontSize: 16, lineHeight: 1.75, marginBottom: 28 }}>
                The Valley has logged more UAP reports per capita than almost anywhere in the U.S. The land holds centuries of Indigenous history. The mountains contain ruins that haven't been fully documented. This is where we work.
              </p>

              {/* Stats */}
              <div style={{ display: 'flex', gap: 24, marginBottom: 32 }}>
                {[
                  { value: "7,930'", label: 'Crestone Elevation' },
                  { value: '8,000 sq mi', label: 'Valley Area' },
                  { value: '10', label: 'Sangre de Cristo 14ers' },
                ].map(stat => (
                  <div key={stat.label}>
                    <p style={{ fontFamily: 'var(--font-heading)', fontSize: 22, fontWeight: 700, color: 'var(--accent)', marginBottom: 2 }}>{stat.value}</p>
                    <p style={{ fontFamily: 'var(--font-alt)', fontSize: 11, fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--text-dim)' }}>{stat.label}</p>
                  </div>
                ))}
              </div>

              {/* Fourteeners grid */}
              <div>
                <p style={{ fontFamily: 'var(--font-heading)', fontSize: 10, fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--text-dim)', marginBottom: 10 }}>Sangre de Cristo Fourteeners</p>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '6px 16px' }}>
                  {[
                    ['Blanca Peak', '14,351 ft'],
                    ['Ellingwood Point', '14,042 ft'],
                    ['Little Bear Peak', '14,037 ft'],
                    ['Mount Lindsey', '14,042 ft'],
                    ['Crestone Peak', '14,297 ft'],
                    ['Crestone Needle', '14,197 ft'],
                    ['Kit Carson Peak', '14,165 ft'],
                    ['Challenger Point', '14,081 ft'],
                    ['Humboldt Peak', '14,064 ft'],
                    ['Culebra Peak', '14,053 ft'],
                  ].map(([name, elev]) => (
                    <div key={name} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', padding: '5px 0', borderBottom: '1px solid var(--border)', gap: 6 }}>
                      <span style={{ fontFamily: 'var(--font-alt)', fontSize: 12, color: 'var(--text-muted)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{name}</span>
                      <span style={{ fontFamily: 'var(--font-heading)', fontSize: 11, color: 'var(--accent)', letterSpacing: '0.04em', flexShrink: 0 }}>{elev}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6 }}>
              {[
                IMG('Crestone', '20250810_093131-EDIT.jpg'),
                IMG('Crestone', '20250810_093137-EDIT.jpg'),
                IMG('Crestone', '20250810_093528-EDIT.jpg'),
                IMG('Nature', '20250510_100646-EDIT.jpg'),
              ].map((src, i) => (
                <div key={i} style={{ paddingTop: '80%', position: 'relative', overflow: 'hidden', borderRadius: 4 }}>
                  <img src={src} alt="" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.4s ease' }}
                    onMouseEnter={e => (e.currentTarget.style.transform = 'scale(1.05)')}
                    onMouseLeave={e => (e.currentTarget.style.transform = 'scale(1)')}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
