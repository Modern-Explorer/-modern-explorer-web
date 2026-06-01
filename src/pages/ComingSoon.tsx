import { useState } from 'react';

const IMG = (folder: string, file: string) => `/assets/images/content/${folder}/${file}`;

const platforms = [
  {
    icon: '🧭',
    title: 'Merch Store',
    eta: 'Summer 2025',
    desc: 'Field-tested apparel, art prints by Glenn Norberg, and expedition gear. Built for people who take curiosity seriously. Every purchase funds field research.',
    status: 'In Production',
  },
  {
    icon: '📡',
    title: 'Field Research App',
    eta: 'Fall 2025',
    desc: 'A mobile-first tool for documenting anomalous events in real time, sharing reports with the community, and contributing to a crowdsourced database of unexplained phenomena across the San Luis Valley and beyond.',
    status: 'In Development',
  },
  {
    icon: '🎙️',
    title: 'Modern Explorer Podcast',
    eta: 'TBD',
    desc: 'Weekly long-form conversations with field researchers, historians, local guides, archaeologists, and explorers who refuse to accept silence as a final answer.',
    status: 'Pre-Production',
  },
  {
    icon: '⛺',
    title: 'Member Community',
    eta: 'Late 2025',
    desc: 'Priority access to expedition slots, exclusive field reports before public release, gear discounts, and a private community of serious explorers who are actually doing the work.',
    status: 'Planning',
  },
  {
    icon: '📰',
    title: 'Research Archive',
    eta: '2026',
    desc: 'A structured public archive of our documented field observations — track logs, cast analysis, audio captures, photographic evidence, and anomaly reports organized by location and date.',
    status: 'Scoping',
  },
  {
    icon: '🤝',
    title: 'Field Research Partnerships',
    eta: '2026',
    desc: 'Formal collaboration framework with independent researchers, university departments, and investigation teams. We\'re building infrastructure to share data and run joint expeditions at scale.',
    status: 'Scoping',
  },
];

const statusColors: Record<string, string> = {
  'In Production': '#4ade80',
  'In Development': '#60a5fa',
  'Pre-Production': '#f59e0b',
  'Planning': '#a78bfa',
  'Scoping': 'var(--text-dim)',
};

export default function ComingSoon() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) setSubmitted(true);
  };

  return (
    <main style={{ paddingTop: 72 }}>

      {/* HERO */}
      <section style={{ position: 'relative', padding: '100px 0 80px', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, backgroundImage: `url('${IMG('Crestone', 'DJI_0289 edit.png')}')`, backgroundSize: 'cover', backgroundPosition: 'center', filter: 'brightness(0.22)' }} />
        <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at center, rgba(203,243,110,0.05) 0%, transparent 65%)' }} />
        <div className="container-narrow" style={{ position: 'relative', textAlign: 'center' }}>
          <span className="eyebrow">Beyond the Tours</span>
          <h1 style={{ fontSize: 'clamp(44px, 7vw, 80px)', marginBottom: 20 }}>What We're<br />Building</h1>
          <p style={{ fontFamily: 'var(--font-alt)', fontSize: 19, color: 'var(--text-muted)', marginBottom: 48, lineHeight: 1.65, maxWidth: 520, margin: '0 auto 48px' }}>
            The tours are just the start. We're building the infrastructure for a real, long-term exploration operation — tools, community, and content.
          </p>

          {!submitted ? (
            <form onSubmit={handleSubmit} style={{ display: 'flex', gap: 12, maxWidth: 480, margin: '0 auto', flexWrap: 'wrap', justifyContent: 'center' }}>
              <input
                type="email" value={email} onChange={e => setEmail(e.target.value)}
                placeholder="your@email.com" required
                style={{ flex: 1, minWidth: 240, padding: '14px 18px', background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 4, color: 'var(--text)', fontFamily: 'var(--font-body)', fontSize: 15, outline: 'none' }}
                onFocus={e => (e.currentTarget.style.borderColor = 'var(--border-accent)')}
                onBlur={e => (e.currentTarget.style.borderColor = 'var(--border)')}
              />
              <button type="submit" className="btn btn-primary" style={{ fontSize: 14 }}>Get Updates</button>
            </form>
          ) : (
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 12, padding: '16px 32px', background: 'var(--accent-dim)', border: '1px solid var(--border-accent)', borderRadius: 4 }}>
              <span style={{ color: 'var(--accent)', fontSize: 20 }}>✓</span>
              <p style={{ fontFamily: 'var(--font-alt)', color: 'var(--accent)', fontWeight: 600 }}>You're on the list. We'll be in touch.</p>
            </div>
          )}
        </div>
      </section>

      {/* PHOTO STRIP */}
      <section style={{ borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)', overflow: 'hidden' }}>
        <div style={{ display: 'flex', height: 220 }}>
          {[
            IMG('Crestone', '20250810_090800-EDIT.jpg'),
            IMG('Nature', '20250729_200506-EDIT.jpg'),
            IMG('Animals', 'pexels-brett-sayles-1603783.jpg'),
            IMG('UFOs', 'MrhuO.jpg'),
            IMG('Mateo', '20250421_075338-EDIT.jpg'),
          ].map((src, i) => (
            <div key={i} style={{ flex: 1, minWidth: 0, overflow: 'hidden' }}>
              <img src={src} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', filter: 'brightness(0.55)', transition: 'filter 0.3s, transform 0.4s' }}
                onMouseEnter={e => { (e.currentTarget as HTMLImageElement).style.filter = 'brightness(0.9)'; (e.currentTarget as HTMLImageElement).style.transform = 'scale(1.05)'; }}
                onMouseLeave={e => { (e.currentTarget as HTMLImageElement).style.filter = 'brightness(0.55)'; (e.currentTarget as HTMLImageElement).style.transform = 'scale(1)'; }}
              />
            </div>
          ))}
        </div>
      </section>

      {/* PLATFORM ROADMAP */}
      <section className="section" style={{ background: 'var(--bg-section)' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: 56 }}>
            <span className="eyebrow">The Roadmap</span>
            <h2 style={{ fontSize: 'clamp(32px, 4vw, 48px)' }}>Platform & Tools</h2>
            <p style={{ fontFamily: 'var(--font-alt)', color: 'var(--text-muted)', fontSize: 16, maxWidth: 520, margin: '16px auto 0', lineHeight: 1.65 }}>
              Looking for upcoming tours? Visit the <a href="/upcoming" style={{ color: 'var(--accent)', textDecoration: 'underline' }}>Upcoming page</a>.
            </p>
          </div>
          <div className="grid-3">
            {platforms.map(item => (
              <div key={item.title} style={{ padding: '28px 28px 28px', background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 6, display: 'flex', flexDirection: 'column' }}>
                <div style={{ fontSize: 30, marginBottom: 16 }}>{item.icon}</div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10, gap: 8 }}>
                  <h3 style={{ fontSize: 18, lineHeight: 1.2 }}>{item.title}</h3>
                  <span style={{ flexShrink: 0, display: 'inline-flex', alignItems: 'center', gap: 5, padding: '3px 8px', background: 'rgba(0,0,0,0.3)', border: '1px solid var(--border)', borderRadius: 3 }}>
                    <span style={{ width: 5, height: 5, borderRadius: '50%', background: statusColors[item.status] ?? 'var(--text-dim)', display: 'inline-block', flexShrink: 0 }} />
                    <span style={{ fontSize: 10, fontFamily: 'var(--font-alt)', fontWeight: 700, letterSpacing: '0.08em', color: statusColors[item.status] ?? 'var(--text-dim)', whiteSpace: 'nowrap' }}>{item.status}</span>
                  </span>
                </div>
                <p style={{ fontSize: 14, color: 'var(--text-muted)', lineHeight: 1.7, flex: 1, marginBottom: 20 }}>{item.desc}</p>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <span style={{ width: 5, height: 5, borderRadius: '50%', background: 'var(--accent)', display: 'inline-block', opacity: 0.6 }} />
                  <span style={{ fontSize: 12, fontFamily: 'var(--font-alt)', fontWeight: 600, color: 'var(--text-dim)', letterSpacing: '0.06em' }}>ETA: {item.eta}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* BOTTOM CTA */}
      <section style={{ borderTop: '1px solid var(--border)', padding: '72px 0' }}>
        <div className="container" style={{ textAlign: 'center' }}>
          <h2 style={{ fontSize: 'clamp(28px, 4vw, 44px)', marginBottom: 16 }}>Stay in the Loop</h2>
          <p style={{ fontFamily: 'var(--font-alt)', color: 'var(--text-muted)', fontSize: 16, maxWidth: 480, margin: '0 auto 36px', lineHeight: 1.7 }}>
            We announce everything to the mailing list first — new tours, new tools, and expedition openings. No spam, no frequency you didn't ask for.
          </p>
          <div style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap' }}>
            <a href="/upcoming" className="btn btn-outline" style={{ fontSize: 14 }}>View Upcoming Tours</a>
            <a href="/contact" className="btn btn-ghost" style={{ fontSize: 14 }}>Contact Us</a>
          </div>
        </div>
      </section>

    </main>
  );
}
