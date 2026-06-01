import { useState } from 'react';

const BOOKING_URL = 'https://fareharbor.com/embeds/book/modernexplorer/?full-items=yes';

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [sent, setSent] = useState(false);

  const update = (field: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setForm(f => ({ ...f, [field]: e.target.value }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSent(true);
  };

  const inputStyle: React.CSSProperties = {
    width: '100%',
    padding: '13px 16px',
    background: 'var(--bg-card)',
    border: '1px solid var(--border)',
    borderRadius: 4,
    color: 'var(--text)',
    fontFamily: 'var(--font-body)',
    fontSize: 15,
    outline: 'none',
    transition: 'border-color 0.15s',
  };

  return (
    <main style={{ paddingTop: 72 }}>
      {/* HERO */}
      <section style={{ position: 'relative', padding: '80px 0 64px', background: 'var(--bg-section)', borderBottom: '1px solid var(--border)' }}>
        <div style={{ position: 'absolute', inset: 0, backgroundImage: "url('/assets/images/Colorado Photo.jpg')", backgroundSize: 'cover', backgroundPosition: 'center', opacity: 0.1 }} />
        <div className="container" style={{ position: 'relative' }}>
          <span className="eyebrow">Get in Touch</span>
          <h1 style={{ fontSize: 'clamp(40px, 6vw, 72px)', marginBottom: 20 }}>Contact Us</h1>
          <p style={{ fontFamily: 'var(--font-alt)', fontSize: 18, color: 'var(--text-muted)', maxWidth: 520, lineHeight: 1.65 }}>
            Questions about tours, private groups, field research partnerships, or media? We read every message.
          </p>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="grid-2" style={{ gap: 64, alignItems: 'flex-start' }}>

            {/* FORM */}
            <div>
              <h2 style={{ fontSize: 32, marginBottom: 8 }}>Send a Message</h2>
              <p style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-alt)', fontSize: 15, marginBottom: 36 }}>
                We typically respond within 24–48 hours.
              </p>

              {sent ? (
                <div style={{ padding: '40px 36px', background: 'var(--accent-dim)', border: '1px solid var(--border-accent)', borderRadius: 6, textAlign: 'center' }}>
                  <p style={{ fontSize: 40, marginBottom: 16 }}>🗺️</p>
                  <h3 style={{ fontSize: 24, marginBottom: 12 }}>Message Received</h3>
                  <p style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-alt)', fontSize: 15 }}>
                    We'll get back to you within 24–48 hours. In the meantime, feel free to browse our upcoming tours.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                  <div className="grid-2" style={{ gap: 16 }}>
                    <div>
                      <label style={{ display: 'block', fontFamily: 'var(--font-heading)', fontSize: 11, fontWeight: 600, letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: 8 }}>Name</label>
                      <input type="text" required value={form.name} onChange={update('name')} placeholder="Your name" style={inputStyle}
                        onFocus={e => (e.currentTarget.style.borderColor = 'var(--border-accent)')}
                        onBlur={e => (e.currentTarget.style.borderColor = 'var(--border)')}
                      />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontFamily: 'var(--font-heading)', fontSize: 11, fontWeight: 600, letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: 8 }}>Email</label>
                      <input type="email" required value={form.email} onChange={update('email')} placeholder="your@email.com" style={inputStyle}
                        onFocus={e => (e.currentTarget.style.borderColor = 'var(--border-accent)')}
                        onBlur={e => (e.currentTarget.style.borderColor = 'var(--border)')}
                      />
                    </div>
                  </div>
                  <div>
                    <label style={{ display: 'block', fontFamily: 'var(--font-heading)', fontSize: 11, fontWeight: 600, letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: 8 }}>Subject</label>
                    <select value={form.subject} onChange={update('subject')} required style={{ ...inputStyle, cursor: 'pointer' }}
                      onFocus={e => (e.currentTarget.style.borderColor = 'var(--border-accent)')}
                      onBlur={e => (e.currentTarget.style.borderColor = 'var(--border)')}
                    >
                      <option value="">Select a topic…</option>
                      <option>Tour Booking Question</option>
                      <option>Private / Group Tours</option>
                      <option>Field Research Partnership</option>
                      <option>Media & Press</option>
                      <option>Merchandise</option>
                      <option>General Inquiry</option>
                    </select>
                  </div>
                  <div>
                    <label style={{ display: 'block', fontFamily: 'var(--font-heading)', fontSize: 11, fontWeight: 600, letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: 8 }}>Message</label>
                    <textarea required value={form.message} onChange={update('message')} rows={6} placeholder="Tell us what you're looking for…"
                      style={{ ...inputStyle, resize: 'vertical', lineHeight: 1.65 }}
                      onFocus={e => (e.currentTarget.style.borderColor = 'var(--border-accent)')}
                      onBlur={e => (e.currentTarget.style.borderColor = 'var(--border)')}
                    />
                  </div>
                  <button type="submit" className="btn btn-primary" style={{ alignSelf: 'flex-start', fontSize: 14 }}>
                    Send Message
                  </button>
                </form>
              )}
            </div>

            {/* SIDEBAR */}
            <div>
              <div style={{ padding: '28px 30px', background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 6, marginBottom: 24 }}>
                <h3 style={{ fontSize: 20, marginBottom: 20 }}>Quick Links</h3>
                <a href={BOOKING_URL} target="_blank" rel="noopener noreferrer" className="btn btn-primary" style={{ width: '100%', justifyContent: 'center', marginBottom: 12, fontSize: 14 }}>
                  Book a Tour Now
                </a>
                <a href="https://instagram.com/modern._explorer" target="_blank" rel="noopener noreferrer" className="btn btn-ghost" style={{ width: '100%', justifyContent: 'center', fontSize: 14 }}>
                  Follow on Instagram
                </a>
              </div>

              <div style={{ padding: '28px 30px', background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 6, marginBottom: 24 }}>
                <h3 style={{ fontSize: 20, marginBottom: 16 }}>Based In</h3>
                {[
                  { place: 'Crestone, Colorado', detail: 'Saguache County · San Luis Valley' },
                  { place: 'Cañon City, Colorado', detail: 'Fremont County · Royal Gorge region' },
                ].map(loc => (
                  <div key={loc.place} style={{ paddingBottom: 16, marginBottom: 16, borderBottom: '1px solid var(--border)' }}>
                    <p style={{ fontFamily: 'var(--font-heading)', fontSize: 15, marginBottom: 4 }}>{loc.place}</p>
                    <p style={{ fontSize: 13, color: 'var(--text-muted)', fontFamily: 'var(--font-alt)' }}>{loc.detail}</p>
                  </div>
                ))}
              </div>

              <div style={{ padding: '28px 30px', background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 6 }}>
                <h3 style={{ fontSize: 20, marginBottom: 16 }}>Follow the Expedition</h3>
                {[
                  { name: 'Instagram', handle: '@modern._explorer', href: 'https://instagram.com/modern._explorer' },
                  { name: 'YouTube', handle: '@ModernExplorer', href: 'https://www.youtube.com/@ModernExplorer' },
                ].map(s => (
                  <a key={s.name} href={s.href} target="_blank" rel="noopener noreferrer"
                    style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 0', borderBottom: '1px solid var(--border)', color: 'var(--text-muted)', transition: 'color 0.15s' }}
                    onMouseEnter={e => (e.currentTarget.style.color = 'var(--accent)')}
                    onMouseLeave={e => (e.currentTarget.style.color = 'var(--text-muted)')}
                  >
                    <span style={{ fontFamily: 'var(--font-alt)', fontWeight: 600, fontSize: 14 }}>{s.name}</span>
                    <span style={{ fontSize: 13 }}>{s.handle} →</span>
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
