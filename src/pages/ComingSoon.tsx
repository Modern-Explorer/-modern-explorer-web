import { useState } from 'react';

const upcoming = [
  { title: 'Merch Store', desc: 'Field-tested apparel, art prints by Glenn Norberg, and expedition gear. Built for people who take curiosity seriously.', eta: 'Summer 2025', icon: '🧭' },
  { title: 'Field Research App', desc: 'A mobile-first tool for documenting anomalous events, sharing reports with the community, and building a crowdsourced database of unexplained phenomena.', eta: 'Fall 2025', icon: '📡' },
  { title: 'Cañon City Tour Launch', desc: 'Royal Gorge region mining ruins, ghost towns, and high-strangeness corridors. Full season of guided tours launching in Fremont County.', eta: 'Summer 2025', icon: '🏔️' },
  { title: 'Modern Explorer Podcast', desc: "Weekly conversations with field researchers, historians, local guides, and the explorers who refuse to accept 'we don't know' as a final answer.", eta: 'TBD', icon: '🎙️' },
  { title: 'Member Community', desc: 'Early access to expedition slots, exclusive field reports, gear discounts, and a private community of serious explorers.', eta: 'Late 2025', icon: '⛺' },
  { title: 'Extended Expeditions', desc: 'Multi-day wilderness trips into the Sangre de Cristo range. Camping, high-altitude field research, and genuine remote exploration.', eta: '2026', icon: '🗺️' },
];

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
        <div style={{ position: 'absolute', inset: 0, backgroundImage: "url('/assets/images/kellepics-fantasy-2861815_1920.jpg')", backgroundSize: 'cover', backgroundPosition: 'center', opacity: 0.15 }} />
        <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at center, rgba(203,243,110,0.05) 0%, transparent 70%)' }} />
        <div className="container-narrow" style={{ position: 'relative', textAlign: 'center' }}>
          <span className="eyebrow">What's Next</span>
          <h1 style={{ fontSize: 'clamp(44px, 7vw, 80px)', marginBottom: 24 }}>The Expedition<br />Continues</h1>
          <p style={{ fontFamily: 'var(--font-alt)', fontSize: 20, color: 'var(--text-muted)', marginBottom: 48, lineHeight: 1.65 }}>
            We're building more ways to explore, connect, and discover. Be the first to know when new tours, tools, and experiences launch.
          </p>

          {!submitted ? (
            <form onSubmit={handleSubmit} style={{ display: 'flex', gap: 12, maxWidth: 480, margin: '0 auto', flexWrap: 'wrap', justifyContent: 'center' }}>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="your@email.com"
                required
                style={{ flex: 1, minWidth: 240, padding: '14px 18px', background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 4, color: 'var(--text)', fontFamily: 'var(--font-body)', fontSize: 15, outline: 'none' }}
                onFocus={e => (e.currentTarget.style.borderColor = 'var(--border-accent)')}
                onBlur={e => (e.currentTarget.style.borderColor = 'var(--border)')}
              />
              <button type="submit" className="btn btn-primary" style={{ fontSize: 14 }}>
                Notify Me
              </button>
            </form>
          ) : (
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 12, padding: '16px 32px', background: 'var(--accent-dim)', border: '1px solid var(--border-accent)', borderRadius: 4 }}>
              <span style={{ color: 'var(--accent)', fontSize: 20 }}>✓</span>
              <p style={{ fontFamily: 'var(--font-alt)', color: 'var(--accent)', fontWeight: 600 }}>You're on the list. We'll be in touch.</p>
            </div>
          )}
        </div>
      </section>

      {/* UPCOMING */}
      <section className="section" style={{ background: 'var(--bg-section)', borderTop: '1px solid var(--border)' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: 56 }}>
            <span className="eyebrow">On the Horizon</span>
            <h2 style={{ fontSize: 'clamp(32px, 4vw, 48px)' }}>What We're Building</h2>
          </div>
          <div className="grid-3">
            {upcoming.map(item => (
              <div key={item.title} style={{ padding: '28px 30px', background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 6 }}>
                <div style={{ fontSize: 32, marginBottom: 16 }}>{item.icon}</div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
                  <h3 style={{ fontSize: 19 }}>{item.title}</h3>
                </div>
                <p style={{ fontSize: 14, color: 'var(--text-muted)', lineHeight: 1.7, marginBottom: 16 }}>{item.desc}</p>
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                  <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--accent)', display: 'inline-block' }} />
                  <span style={{ fontSize: 12, fontFamily: 'var(--font-alt)', fontWeight: 600, color: 'var(--text-dim)', letterSpacing: '0.08em' }}>ETA: {item.eta}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
