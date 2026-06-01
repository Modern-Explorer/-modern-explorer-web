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
    title: 'New Route: Crestone Ruins & High-Country Anomaly Corridor',
    date: 'Apr 2025', author: 'Mateo Argüello', readTime: '4 min',
    img: IMG('Crestone', '20250810_093514-EDIT.jpg'),
    excerpt: "We're launching a new route through the high country above Crestone. The trail passes three documented ruin sites and a ridge that has generated consistent unexplained reports since the early 2000s.",
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
    title: 'Animal Behavior Anomalies Near Crestone: What the Wildlife Is Telling Us',
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
    excerpt: "We've started recording long-form conversations with locals who hold knowledge that isn't written anywhere. Stories of unexplained cattle incidents and traditions that predate written records.",
  },
];

// ─── Mock social data ──────────────────────────────────────────────────────────
const ytVideos = [
  { id: 1, title: 'Night Watch: San Luis Valley Sky Anomalies', views: '4.2K', duration: '18:34', ago: '3 days ago', thumb: IMG('UFOs', 'KaTU7.jpg') },
  { id: 2, title: 'Field Guide: How We Cast Cryptid Tracks', views: '2.8K', duration: '11:52', ago: '2 weeks ago', thumb: IMG('Cryptids', 'TqSDS.jpg') },
  { id: 3, title: 'Crestone Tour Walkthrough — Full Route', views: '6.1K', duration: '24:07', ago: '1 month ago', thumb: IMG('Crestone', '20250810_095413-EDIT.jpg') },
];

const igPosts = [
  { id: 1, img: IMG('Crestone', '20250810_090739-EDIT.jpg'), likes: 312, caption: 'Golden hour above Crestone. The valley floor from up here is something else. 🌄 #SanLuisValley' },
  { id: 2, img: IMG('UFOs', 'pexels-miriamespacio-365625.jpg'), likes: 481, caption: 'Night three of the sky watch. Logged two anomalous events between 2–4am. More details in the field report. 👁️' },
  { id: 3, img: IMG('Animals', 'pexels-brett-sayles-1098886.jpg'), likes: 228, caption: "Ran into this one at 10,800ft. Animals know things we don't. #Colorado #WildlifeWatch" },
  { id: 4, img: IMG('Crestone', '20250810_093828-EDIT.jpg'), likes: 395, caption: 'Our new route breaks here at sunrise. This ridge has a story. Coming soon. 🧭' },
  { id: 5, img: IMG('Mateo', '20250421_075338-EDIT.jpg'), likes: 267, caption: "Gearing up for the season. Everything we carry has a reason. What's in your pack? ⛺" },
  { id: 6, img: IMG('Cryptids', 'di86V.jpg'), likes: 544, caption: "This came in from a guest last week. Make of it what you will. We're heading back to that area next month. 🐾" },
];

const fbPosts = [
  {
    id: 1, ago: '2 days ago', likes: 88, comments: 14,
    img: IMG('Crestone', '20250810_090851-EDIT.jpg'),
    text: 'New field report just dropped — six months of sky watch data from the San Luis Valley in one place. This is the most complete look at what we\'ve been tracking. Link in bio.',
  },
  {
    id: 2, ago: '1 week ago', likes: 61, comments: 9,
    img: IMG('Nature', '20250518_185929-EDIT.jpg'),
    text: 'Tour dates are filling up for the fall season. We keep groups small on purpose — this isn\'t a bus tour. If you\'ve been thinking about joining us, now\'s the time to book.',
  },
  {
    id: 3, ago: '2 weeks ago', likes: 103, comments: 22,
    img: IMG('UFOs', 'MrhuO.jpg'),
    text: 'Question for the community: what\'s your most unexplained experience in Colorado? We\'re building a community report and want to hear from people who\'ve been in the field.',
  },
];

// ─── Sub-components ────────────────────────────────────────────────────────────

function PlatformHeader({ color, label, handle, url }: { color: string; label: string; handle: string; url: string }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <div style={{ width: 32, height: 32, borderRadius: 6, background: color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16 }}>
          {label === 'YouTube' ? '▶' : label === 'Instagram' ? '◈' : '𝑓'}
        </div>
        <div>
          <p style={{ fontFamily: 'var(--font-heading)', fontSize: 14, fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', lineHeight: 1 }}>{label}</p>
          <p style={{ fontSize: 11, color: 'var(--text-dim)', fontFamily: 'var(--font-alt)', marginTop: 2 }}>{handle}</p>
        </div>
      </div>
      <a href={url} target="_blank" rel="noopener noreferrer"
        style={{ fontSize: 11, fontFamily: 'var(--font-heading)', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--text-dim)', border: '1px solid var(--border)', borderRadius: 3, padding: '5px 10px', transition: 'var(--ease)' }}
        onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = 'var(--border-accent)'; (e.currentTarget as HTMLElement).style.color = 'var(--accent)'; }}
        onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = 'var(--border)'; (e.currentTarget as HTMLElement).style.color = 'var(--text-dim)'; }}
      >
        Follow →
      </a>
    </div>
  );
}

function MockBadge() {
  return (
    <span style={{ display: 'inline-block', padding: '2px 8px', background: 'rgba(203,243,110,0.08)', border: '1px solid rgba(203,243,110,0.2)', borderRadius: 2, fontSize: 10, fontFamily: 'var(--font-alt)', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--accent)', opacity: 0.7 }}>
      Mock Data
    </span>
  );
}

// ─── Main component ────────────────────────────────────────────────────────────

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

      {/* ── SOCIAL MEDIA DASHBOARD ────────────────────────────────────────────── */}
      <section className="section" style={{ background: 'var(--bg-section)', borderTop: '1px solid var(--border)' }}>
        <div className="container">
          {/* Header */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 48, flexWrap: 'wrap', gap: 12 }}>
            <div>
              <span className="eyebrow">Follow the Expedition</span>
              <h2 style={{ fontSize: 'clamp(28px, 4vw, 44px)' }}>Social Activity</h2>
            </div>
            <MockBadge />
          </div>

          {/* YOUTUBE */}
          <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 8, padding: '28px 28px 24px', marginBottom: 24 }}>
            <PlatformHeader
              color="#ff0000"
              label="YouTube"
              handle="@ModernExplorer"
              url="https://www.youtube.com/@ModernExplorer"
            />
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
              {ytVideos.map(v => (
                <div key={v.id} style={{ cursor: 'pointer' }}
                  onMouseEnter={e => (e.currentTarget.style.opacity = '0.85')}
                  onMouseLeave={e => (e.currentTarget.style.opacity = '1')}
                >
                  <div style={{ position: 'relative', paddingTop: '56.25%', borderRadius: 4, overflow: 'hidden', marginBottom: 10, background: 'var(--bg)' }}>
                    <img src={v.thumb} alt={v.title} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} />
                    {/* Play button overlay */}
                    <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.3)' }}>
                      <div style={{ width: 40, height: 40, borderRadius: '50%', background: 'rgba(255,0,0,0.85)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, color: '#fff', paddingLeft: 3 }}>
                        ▶
                      </div>
                    </div>
                    {/* Duration badge */}
                    <div style={{ position: 'absolute', bottom: 6, right: 8, background: 'rgba(0,0,0,0.82)', borderRadius: 2, padding: '2px 6px', fontSize: 11, fontFamily: 'var(--font-alt)', fontWeight: 600, color: '#fff' }}>
                      {v.duration}
                    </div>
                  </div>
                  <p style={{ fontFamily: 'var(--font-alt)', fontSize: 13, fontWeight: 600, lineHeight: 1.35, color: 'var(--text)', marginBottom: 4 }}>{v.title}</p>
                  <p style={{ fontSize: 11, color: 'var(--text-dim)', fontFamily: 'var(--font-alt)' }}>{v.views} views · {v.ago}</p>
                </div>
              ))}
            </div>
          </div>

          {/* INSTAGRAM + FACEBOOK side by side */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>

            {/* INSTAGRAM */}
            <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 8, padding: '28px 28px 24px' }}>
              <PlatformHeader
                color="linear-gradient(135deg,#833ab4,#fd1d1d,#fcb045)"
                label="Instagram"
                handle="@modern._explorer"
                url="https://instagram.com/modern._explorer"
              />
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 4 }}>
                {igPosts.map(p => (
                  <div key={p.id} style={{ position: 'relative', paddingTop: '100%', overflow: 'hidden', borderRadius: 3, cursor: 'pointer' }}
                    onMouseEnter={e => { const el = e.currentTarget as HTMLElement; el.querySelector('div')!.style.opacity = '1'; }}
                    onMouseLeave={e => { const el = e.currentTarget as HTMLElement; el.querySelector('div')!.style.opacity = '0'; }}
                  >
                    <img src={p.img} alt="" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} />
                    {/* Hover overlay */}
                    <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.55)', opacity: 0, transition: 'opacity 0.2s', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 4 }}>
                      <span style={{ fontSize: 13, color: '#fff', fontWeight: 700 }}>♥ {p.likes}</span>
                    </div>
                  </div>
                ))}
              </div>
              <p style={{ fontSize: 12, color: 'var(--text-dim)', fontFamily: 'var(--font-alt)', marginTop: 14, fontStyle: 'italic' }}>
                "{igPosts[0].caption}"
              </p>
            </div>

            {/* FACEBOOK */}
            <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 8, padding: '28px 28px 24px', display: 'flex', flexDirection: 'column' }}>
              <PlatformHeader
                color="#1877f2"
                label="Facebook"
                handle="Modern Explorer"
                url="https://facebook.com"
              />
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16, flex: 1 }}>
                {fbPosts.map(p => (
                  <div key={p.id} style={{ display: 'flex', gap: 14, paddingBottom: 16, borderBottom: '1px solid var(--border)' }}>
                    <div style={{ flexShrink: 0, width: 72, height: 72, borderRadius: 4, overflow: 'hidden' }}>
                      <img src={p.img} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p style={{ fontSize: 13, color: 'var(--text)', fontFamily: 'var(--font-alt)', lineHeight: 1.55, marginBottom: 8, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' } as React.CSSProperties}>
                        {p.text}
                      </p>
                      <div style={{ display: 'flex', gap: 12 }}>
                        <span style={{ fontSize: 11, color: 'var(--text-dim)', fontFamily: 'var(--font-alt)' }}>♥ {p.likes}</span>
                        <span style={{ fontSize: 11, color: 'var(--text-dim)', fontFamily: 'var(--font-alt)' }}>💬 {p.comments}</span>
                        <span style={{ fontSize: 11, color: 'var(--text-dim)', fontFamily: 'var(--font-alt)', marginLeft: 'auto' }}>{p.ago}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* API Note */}
          <div style={{ marginTop: 20, padding: '14px 20px', background: 'rgba(203,243,110,0.04)', border: '1px dashed rgba(203,243,110,0.15)', borderRadius: 4, display: 'flex', alignItems: 'center', gap: 12 }}>
            <span style={{ fontSize: 16, opacity: 0.6 }}>🔌</span>
            <p style={{ fontSize: 12, color: 'var(--text-dim)', fontFamily: 'var(--font-alt)', lineHeight: 1.5 }}>
              <strong style={{ color: 'var(--text-muted)' }}>Live API integration pending.</strong>{' '}
              This dashboard currently shows mock data. Real-time posts will populate once YouTube Data API, Instagram Graph API, and Facebook Graph API are connected.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
