import { useState } from 'react';

const IMG = (folder: string, file: string) => `/assets/images/content/${folder}/${file}`;

const categories = ['All', 'Field Report', 'Skills & Gear', 'Community', 'Expedition News'];

const posts = [
  {
    id: 1, tag: 'Field Report',
    title: 'Strange Lights Over the Baca: A Night in the San Luis Valley',
    date: 'May 2025', author: 'Mateo Argüello', readTime: '6 min',
    img: IMG('UFOs', 'pexels-miriamespacio-365625.jpg'),
    excerpt: "We set up camp just south of the Baca Wildlife Refuge at 8pm. By midnight, we had logged four separate light events that matched none of the typical aircraft signatures we track. Here's what we documented.",
  },
  {
    id: 2, tag: 'Skills & Gear',
    title: "What's In Our Pack: The Definitive Field Research Kit",
    date: 'Apr 2025', author: 'Glenn Norberg', readTime: '8 min',
    img: IMG('Mateo', '20250421_075338-EDIT.jpg'),
    excerpt: "After years of field work, we've settled on a core kit that balances documentation capability, survival readiness, and packability. Here's everything we bring—and why.",
  },
  {
    id: 3, tag: 'Expedition News',
    title: 'New Tour Launch: Cañon City Mining Trail & Ruins Expedition',
    date: 'Apr 2025', author: 'Mateo Argüello', readTime: '4 min',
    img: IMG('History', '20250602_154009-EDIT.jpg'),
    excerpt: "We're officially launching our Cañon City route this summer. The route covers 4.2 miles of historic mining terrain, three documented ghost sites, and a section of trail that has generated consistent unexplained reports since the 1990s.",
  },
  {
    id: 4, tag: 'Community',
    title: "Interview: A Crestone Mystic on the Valley's Energy Vortexes",
    date: 'Mar 2025', author: 'Mateo Argüello', readTime: '10 min',
    img: IMG('Crestone', '20250810_092926-EDIT.jpg'),
    excerpt: "We sat down with a long-time Crestone resident who has spent 20 years cataloging the area's anomalous phenomena. Their perspective challenged some of our own assumptions.",
  },
  {
    id: 5, tag: 'Field Report',
    title: 'Footprint Cast Analysis: Sangre de Cristo High Country',
    date: 'Mar 2025', author: 'Glenn Norberg', readTime: '7 min',
    img: IMG('Cryptids', 'TqSDS.jpg'),
    excerpt: "During our March high-altitude sweep, we recovered three track impressions at 11,400 feet. The stride pattern and depth are inconsistent with known wildlife in the region. We sent casts to two independent analysts.",
  },
  {
    id: 6, tag: 'Skills & Gear',
    title: 'Night Sky Observation: A Protocol for UAP Documentation',
    date: 'Feb 2025', author: 'Glenn Norberg', readTime: '9 min',
    img: IMG('UFOs', 'KaTU7.jpg'),
    excerpt: "Consistent documentation starts with consistent protocol. We've refined our sky watch procedure over 40+ sessions. This is the framework we use—and what we teach on every expedition.",
  },
  {
    id: 7, tag: 'Field Report',
    title: "Animal Behavior Anomalies Near Crestone: What the Wildlife Is Telling Us",
    date: 'Feb 2025', author: 'Mateo Argüello', readTime: '5 min',
    img: IMG('Animals', 'pexels-brett-sayles-1467808.jpg'),
    excerpt: "One of the most consistent early indicators of something unusual in the field is animal behavior. Elk, deer, and birds often react before any human does. Here's what we've documented over three seasons.",
  },
  {
    id: 8, tag: 'Expedition News',
    title: 'Crestone Fall Season: What to Expect on Tour This Year',
    date: 'Jan 2025', author: 'Mateo Argüello', readTime: '4 min',
    img: IMG('Crestone', '20250810_091639-EDIT.jpg'),
    excerpt: "Fall is our favorite season in the San Luis Valley. The light is extraordinary, the crowds thin out, and the phenomena reports tend to spike. Here's what we're planning for the fall 2025 schedule.",
  },
  {
    id: 9, tag: 'Community',
    title: 'Oral History Project: Documenting the Voices of Old Colorado',
    date: 'Dec 2024', author: 'Glenn Norberg', readTime: '8 min',
    img: IMG('History', '20221122_163904.jpg'),
    excerpt: "We've started recording long-form conversations with locals who hold knowledge that isn't written anywhere. Stories of mining camp disappearances, unexplained cattle incidents, and traditions that predate written records.",
  },
];

export default function FieldReports() {
  const [active, setActive] = useState('All');
  const filtered = active === 'All' ? posts : posts.filter(p => p.tag === active);

  return (
    <main style={{ paddingTop: 72 }}>
      {/* HERO */}
      <section style={{ position: 'relative', padding: '80px 0 64px', background: 'var(--bg-section)', borderBottom: '1px solid var(--border)' }}>
        <div style={{ position: 'absolute', inset: 0, backgroundImage: `url('${IMG('Crestone', '20250810_095422-EDIT.jpg')}')`, backgroundSize: 'cover', backgroundPosition: 'center', filter: 'brightness(0.25)' }} />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, transparent, var(--bg-section))' }} />
        <div className="container" style={{ position: 'relative' }}>
          <span className="eyebrow">From the Field</span>
          <h1 style={{ fontSize: 'clamp(40px, 6vw, 72px)', marginBottom: 20 }}>Field Reports</h1>
          <p style={{ fontFamily: 'var(--font-alt)', fontSize: 18, color: 'var(--text-muted)', maxWidth: 560, lineHeight: 1.65 }}>
            Firsthand accounts of haunted trails, lost ruins, cryptid encounters, and the mysteries we uncover on every journey. No speculation—just what we observed.
          </p>
        </div>
      </section>

      {/* FILTER */}
      <section style={{ borderBottom: '1px solid var(--border)' }}>
        <div className="container" style={{ display: 'flex', gap: 4, overflowX: 'auto', padding: '16px 24px' }}>
          {categories.map(cat => (
            <button key={cat} onClick={() => setActive(cat)} style={{
              padding: '8px 18px',
              fontFamily: 'var(--font-heading)', fontSize: 12, fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase',
              borderRadius: 3, border: '1px solid',
              borderColor: active === cat ? 'var(--border-accent)' : 'var(--border)',
              background: active === cat ? 'var(--accent-dim)' : 'transparent',
              color: active === cat ? 'var(--accent)' : 'var(--text-muted)',
              transition: 'var(--ease)', whiteSpace: 'nowrap',
            }}>
              {cat}
            </button>
          ))}
        </div>
      </section>

      {/* FEATURED POST */}
      {active === 'All' && (
        <section style={{ borderBottom: '1px solid var(--border)' }}>
          <div className="container" style={{ padding: '48px 24px' }}>
            <div className="grid-2" style={{ gap: 48, alignItems: 'center' }}>
              <div style={{ position: 'relative', paddingTop: '60%', borderRadius: 6, overflow: 'hidden', border: '1px solid var(--border)' }}>
                <img src={IMG('Crestone', '20250810_093828-EDIT.jpg')} alt="Featured" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>
              <div>
                <span className="tag">Featured</span>
                <h2 style={{ fontSize: 'clamp(24px, 3vw, 36px)', margin: '16px 0 16px', lineHeight: 1.15 }}>
                  The Crestone Phenomenon: Six Months of Field Documentation
                </h2>
                <p style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-alt)', fontSize: 16, lineHeight: 1.75, marginBottom: 28 }}>
                  A comprehensive look at what we've observed, recorded, and measured across six months of consistent field work in the San Luis Valley. This is our most complete public report to date.
                </p>
                <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 28 }}>
                  <span style={{ fontSize: 13, color: 'var(--text-dim)', fontFamily: 'var(--font-alt)' }}>By Mateo Argüello · Jun 2025</span>
                  <span style={{ fontSize: 13, color: 'var(--text-dim)', fontFamily: 'var(--font-alt)' }}>12 min read</span>
                </div>
                <button className="btn btn-outline" style={{ fontSize: 13 }}>Read Full Report →</button>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* POSTS GRID */}
      <section className="section">
        <div className="container">
          <div className="grid-3">
            {filtered.map(post => (
              <article key={post.id} className="card" style={{ display: 'flex', flexDirection: 'column' }}>
                <div style={{ position: 'relative', paddingTop: '60%', overflow: 'hidden' }}>
                  <img src={post.img} alt={post.title} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.4s ease' }}
                    onMouseEnter={e => (e.currentTarget.style.transform = 'scale(1.04)')}
                    onMouseLeave={e => (e.currentTarget.style.transform = 'scale(1)')}
                  />
                </div>
                <div style={{ padding: '20px 22px 24px', flex: 1, display: 'flex', flexDirection: 'column' }}>
                  <div style={{ display: 'flex', gap: 10, alignItems: 'center', marginBottom: 12 }}>
                    <span className="tag">{post.tag}</span>
                    <span style={{ fontSize: 12, color: 'var(--text-dim)', fontFamily: 'var(--font-alt)' }}>{post.readTime}</span>
                  </div>
                  <h3 style={{ fontSize: 18, lineHeight: 1.25, marginBottom: 10 }}>{post.title}</h3>
                  <p style={{ color: 'var(--text-muted)', fontSize: 14, lineHeight: 1.65, flex: 1, marginBottom: 20 }}>{post.excerpt}</p>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--border)', paddingTop: 14 }}>
                    <span style={{ fontSize: 12, color: 'var(--text-dim)', fontFamily: 'var(--font-alt)' }}>By {post.author} · {post.date}</span>
                    <button style={{ fontSize: 12, color: 'var(--accent)', fontFamily: 'var(--font-heading)', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                      Read →
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
