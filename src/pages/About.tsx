const BOOKING_URL = 'https://fareharbor.com/embeds/book/modernexplorer/?full-items=yes';
const IMG = (folder: string, file: string) => `/assets/images/content/${folder}/${file}`;

const values = [
  { title: 'Boots on the Ground', desc: "We don't theorize from armchairs. Every claim we investigate, every trail we walk, we do it firsthand—in the field, in real conditions." },
  { title: 'Respect for the Land', desc: 'The places we explore are sacred to many. We operate with deep respect for the land, local communities, and the stories they hold.' },
  { title: 'Open-Minded Rigor', desc: 'We approach every mystery with the curiosity of a scientist and the wonder of a child. We follow evidence wherever it leads.' },
  { title: 'Community-Driven', desc: 'This is a "we" operation. Our guests, guides, and local partners are all part of the same expedition.' },
];

const team = [
  {
    name: 'Mateo Argüello',
    role: 'Founder & Lead Guide',
    bio: 'Based in Colorado Springs, Mateo built Modern Explorer from a lifelong passion for the unexplained and a belief that the best travel leaves you with more questions than you started with. He has been leading guided tours throughout Colorado for years, specializing in cryptozoology, local lore, and high-altitude wilderness navigation.',
    img: IMG('Mateo', '20250301_134650.jpg'),
  },
  {
    name: 'Glenn Norberg',
    role: 'Field Investigator & Artist',
    bio: 'Glenn is an accomplished artist by trade and a passionate field investigator at heart. He brings creative vision and years of independent on-the-ground work to Modern Explorer, particularly in the areas of cryptid research and anomalous phenomena documentation across the American Southwest.',
    img: IMG('Crestone', '20250810_091206-EDIT.jpg'),
  },
];

const gallery = [
  IMG('Crestone', '20250810_090447-EDIT.jpg'),
  IMG('Crestone', '20250810_090525-EDIT.jpg'),
  IMG('Crestone', '20250810_090608-EDIT.jpg'),
  IMG('Nature', '20241109_165442-EDIT.jpg'),
  IMG('Crestone', '20250810_091607-EDIT.jpg'),
  IMG('Nature', '20250510_091707-EDIT.jpg'),
];

export default function About() {
  return (
    <main style={{ paddingTop: 72 }}>
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

      {/* MISSION */}
      <section className="section">
        <div className="container">
          <div className="grid-2" style={{ alignItems: 'center', gap: 64 }}>
            <div>
              <span className="eyebrow">Our Mission</span>
              <h2 style={{ fontSize: 'clamp(32px, 4vw, 48px)', marginBottom: 20 }}>Build a Self-Funded<br />Exploration Engine</h2>
              <div className="divider" />
              <p style={{ fontFamily: 'var(--font-alt)', color: 'var(--text-muted)', fontSize: 16, lineHeight: 1.75, marginBottom: 20 }}>
                We're building a self-funded exploration engine that enables real discovery in archaeology, cryptozoology, UAPs, paranormal phenomena, and anomalous events—in places where conventional funding falls short.
              </p>
              <p style={{ fontFamily: 'var(--font-alt)', color: 'var(--text-muted)', fontSize: 16, lineHeight: 1.75, marginBottom: 32 }}>
                Our walking tours in Crestone and Cañon City are the first step. Every ticket sold funds deeper field research, better equipment, and more ambitious expeditions. You're not just a tourist—you're a supporter of genuine discovery.
              </p>
              <a href={BOOKING_URL} target="_blank" rel="noopener noreferrer" className="btn btn-primary">Join an Expedition</a>
            </div>
            <div style={{ position: 'relative' }}>
              <img src={IMG('Crestone', '20250810_090851-EDIT.jpg')} alt="Colorado field expedition" style={{ width: '100%', borderRadius: 6, border: '1px solid var(--border)' }} />
              <div style={{ position: 'absolute', bottom: -24, right: -24, background: 'var(--bg-card)', border: '1px solid var(--border-accent)', borderRadius: 6, padding: '16px 24px' }}>
                <p style={{ fontFamily: 'var(--font-heading)', fontSize: 28, fontWeight: 700, color: 'var(--accent)' }}>2</p>
                <p style={{ fontFamily: 'var(--font-alt)', fontSize: 12, color: 'var(--text-muted)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>Colorado Locations</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* GALLERY STRIP */}
      <section style={{ overflow: 'hidden', borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)' }}>
        <div style={{ display: 'flex', height: 280 }}>
          {gallery.map((src, i) => (
            <div key={i} style={{ flex: 1, minWidth: 0, overflow: 'hidden', position: 'relative' }}>
              <img src={src} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.5s ease' }}
                onMouseEnter={e => (e.currentTarget.style.transform = 'scale(1.06)')}
                onMouseLeave={e => (e.currentTarget.style.transform = 'scale(1)')}
              />
            </div>
          ))}
        </div>
      </section>

      {/* VALUES */}
      <section className="section" style={{ background: 'var(--bg-section)' }}>
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

      {/* TEAM */}
      <section className="section">
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: 56 }}>
            <span className="eyebrow">The Team</span>
            <h2 style={{ fontSize: 'clamp(32px, 4vw, 48px)' }}>Meet Your Guides</h2>
          </div>
          <div className="grid-2" style={{ gap: 40 }}>
            {team.map(member => (
              <div key={member.name} style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 6, overflow: 'hidden' }}>
                <div style={{ position: 'relative', paddingTop: '65%' }}>
                  <img src={member.img} alt={member.name} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'top' }} />
                </div>
                <div style={{ padding: '28px 32px' }}>
                  <h3 style={{ fontSize: 24, marginBottom: 4 }}>{member.name}</h3>
                  <p style={{ color: 'var(--accent)', fontFamily: 'var(--font-alt)', fontSize: 13, fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 16 }}>{member.role}</p>
                  <p style={{ color: 'var(--text-muted)', fontSize: 15, lineHeight: 1.75 }}>{member.bio}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* LOCATIONS */}
      <section className="section" style={{ background: 'var(--bg-section)', borderTop: '1px solid var(--border)' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: 56 }}>
            <span className="eyebrow">Where We Operate</span>
            <h2 style={{ fontSize: 'clamp(32px, 4vw, 48px)' }}>Current Focus Areas</h2>
          </div>
          <div className="grid-2" style={{ gap: 32 }}>
            {[
              {
                name: 'Crestone, Colorado', county: 'Saguache County',
                desc: "A spiritual hotbed in the San Luis Valley. Home to sacred land, unexplained phenomena, and some of the most stunning high-desert terrain in the Rockies.",
                img: IMG('Crestone', '20250810_093131-EDIT.jpg'),
              },
              {
                name: 'Cañon City, Colorado', county: 'Fremont County',
                desc: "The Royal Gorge region is layered with history—from ancient Native American routes to Old West mining lore. Stunning geology and decades of unexplained field reports.",
                img: IMG('History', '20250602_154545-EDIT.jpg'),
              },
            ].map(loc => (
              <div key={loc.name} style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 6, overflow: 'hidden' }}>
                <div style={{ position: 'relative', paddingTop: '50%' }}>
                  <img src={loc.img} alt={loc.name} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} />
                  <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(11,15,28,0.85), transparent)' }} />
                  <div style={{ position: 'absolute', bottom: 20, left: 24 }}>
                    <h3 style={{ fontSize: 22 }}>{loc.name}</h3>
                    <p style={{ fontSize: 12, color: 'var(--accent)', fontFamily: 'var(--font-alt)', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase' }}>{loc.county}</p>
                  </div>
                </div>
                <div style={{ padding: '20px 24px 28px' }}>
                  <p style={{ color: 'var(--text-muted)', fontSize: 15, lineHeight: 1.7 }}>{loc.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
