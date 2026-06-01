import { useState } from 'react';

const categories = ['All', 'Field Report', 'Skills & Gear', 'Community', 'Expedition News'];

const posts = [
  { id: 1, tag: 'Field Report', title: "Strange Lights Over the Baca: A Night in the San Luis Valley", date: 'May 2025', author: 'Mateo Argüello', readTime: '6 min', img: '/assets/images/kellepics-fantasy-2847724_1920.jpg', excerpt: "We set up camp just south of the Baca Wildlife Refuge at 8pm. By midnight, we had logged four separate light events that matched none of the typical aircraft signatures we track. Here's what we documented." },
  { id: 2, tag: 'Skills & Gear', title: "What's In Our Pack: The Definitive Field Research Kit", date: 'Apr 2025', author: 'Glenn Norberg', readTime: '8 min', img: '/assets/images/20250810_090914-EDIT.jpg', excerpt: "After years of field work, we've settled on a core kit that balances documentation capability, survival readiness, and packability. Here's everything we bring—and why." },
  { id: 3, tag: 'Expedition News', title: "New Tour Launch: Cañon City Mining Trail & Ruins Expedition", date: 'Apr 2025', author: 'Mateo Argüello', readTime: '4 min', img: '/assets/images/Colorado Photo.jpg', excerpt: "We're officially launching our Cañon City route this summer. The route covers 4.2 miles of historic mining terrain, three documented ghost sites, and a section of trail that has generated consistent unexplained reports since the 1990s." },
  { id: 4, tag: 'Community', title: "Interview: A Crestone Mystic on the Valley's Energy Vortexes", date: 'Mar 2025', author: 'Mateo Argüello', readTime: '10 min', img: '/assets/images/kellepics-fantasy-2861815_1920.jpg', excerpt: "We sat down with a long-time Crestone resident who has spent 20 years cataloging the area's anomalous phenomena. Their perspective challenged some of our own assumptions." },
  { id: 5, tag: 'Field Report', title: "Footprint Cast Analysis: Sangre de Cristo High Country", date: 'Mar 2025', author: 'Glenn Norberg', readTime: '7 min', img: '/assets/images/sylwesterl-spider-8279740_1920.jpg', excerpt: "During our March high-altitude sweep, we recovered three track impressions at 11,400 feet. The stride pattern and depth are inconsistent with known wildlife in the region. We sent casts to two independent analysts." },
  { id: 6, tag: 'Skills & Gear', title: "Night Sky Observation: A Protocol for UAP Documentation", date: 'Feb 2025', author: 'Glenn Norberg', readTime: '9 min', img: '/assets/images/infinite-creations-scary-6389656_1920.jpg', excerpt: "Consistent documentation starts with consistent protocol. We've refined our sky watch procedure over 40+ sessions. This is the framework we use—and what we teach on every expedition." },
];

export default function FieldReports() {
  const [active, setActive] = useState('All');
  const filtered = active === 'All' ? posts : posts.filter(p => p.tag === active);

  return (
    <main style={{ paddingTop: 72 }}>
      {/* HERO */}
      <section style={{ position: 'relative', padding: '80px 0 64px', background: 'var(--bg-section)', borderBottom: '1px solid var(--border)' }}>
        <div style={{ position: 'absolute', inset: 0, backgroundImage: "url('/assets/images/sylwesterl-spider-8279740_1920.jpg')", backgroundSize: 'cover', backgroundPosition: 'center', opacity: 0.1 }} />
        <div className="container" style={{ position: 'relative' }}>
          <span className="eyebrow">From the Field</span>
          <h1 style={{ fontSize: 'clamp(40px, 6vw, 72px)', marginBottom: 20 }}>Field Reports</h1>
          <p style={{ fontFamily: 'var(--font-alt)', fontSize: 18, color: 'var(--text-muted)', maxWidth: 560, lineHeight: 1.65 }}>
            Firsthand accounts of haunted trails, lost ruins, cryptid encounters, and the mysteries we uncover on every journey. No speculation—just what we observed.
          </p>
        </div>
      </section>

      {/* FILTER */}
      <section style={{ borderBottom: '1px solid var(--border)', padding: '0' }}>
        <div className="container" style={{ display: 'flex', gap: 4, overflowX: 'auto', padding: '16px 24px' }}>
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setActive(cat)}
              style={{
                padding: '8px 18px',
                fontFamily: 'var(--font-heading)',
                fontSize: 12,
                fontWeight: 600,
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                borderRadius: 3,
                border: '1px solid',
                borderColor: active === cat ? 'var(--border-accent)' : 'var(--border)',
                background: active === cat ? 'var(--accent-dim)' : 'transparent',
                color: active === cat ? 'var(--accent)' : 'var(--text-muted)',
                transition: 'var(--ease)',
                whiteSpace: 'nowrap',
              }}
            >
              {cat}
            </button>
          ))}
        </div>
      </section>

      {/* POSTS GRID */}
      <section className="section">
        <div className="container">
          {filtered.length === 0 ? (
            <p style={{ color: 'var(--text-muted)', textAlign: 'center', padding: '60px 0' }}>No reports in this category yet.</p>
          ) : (
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
                      <span style={{ fontSize: 12, color: 'var(--text-dim)', fontFamily: 'var(--font-alt)' }}>{post.readTime} read</span>
                    </div>
                    <h3 style={{ fontSize: 18, lineHeight: 1.25, marginBottom: 10 }}>{post.title}</h3>
                    <p style={{ color: 'var(--text-muted)', fontSize: 14, lineHeight: 1.65, flex: 1, marginBottom: 20 }}>{post.excerpt}</p>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--border)', paddingTop: 14 }}>
                      <span style={{ fontSize: 12, color: 'var(--text-dim)', fontFamily: 'var(--font-alt)' }}>By {post.author} · {post.date}</span>
                      <button style={{ fontSize: 12, color: 'var(--accent)', fontFamily: 'var(--font-heading)', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', background: 'none', border: 'none', cursor: 'pointer' }}>
                        Read →
                      </button>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
