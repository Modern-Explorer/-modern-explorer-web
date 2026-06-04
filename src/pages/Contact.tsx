import { useState } from 'react';
import SEO from '../components/SEO';

const BOOKING_URL = 'https://fareharbor.com/embeds/book/modernexplorer/?full-items=yes';
const IMG = (folder: string, file: string) => `/assets/images/content/${folder}/${file}`;

// ─── Compass widget ────────────────────────────────────────────────────────────

function CompassWidget() {
  const ticks = [0, 45, 90, 135, 180, 225, 270, 315];
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '32px 0 24px' }}>
      <svg viewBox="0 0 120 120" width="108" height="108" style={{ overflow: 'visible' }}>
        {/* Outer pulsing rings */}
        <circle cx="60" cy="60" r="56" fill="none" stroke="rgba(203,243,110,0.07)" strokeWidth="1" className="me-pulse-ring" />
        <circle cx="60" cy="60" r="50" fill="none" stroke="rgba(203,243,110,0.15)" strokeWidth="0.75" strokeDasharray="2.5 3.5" />
        <circle cx="60" cy="60" r="43" fill="none" stroke="rgba(203,243,110,0.08)" strokeWidth="0.5" />
        {/* Tick marks */}
        {ticks.map(deg => {
          const major = deg % 90 === 0;
          const r1 = major ? 39 : 41;
          const angle = (deg * Math.PI) / 180;
          return (
            <line key={deg}
              x1={60 + r1 * Math.sin(angle)}    y1={60 - r1 * Math.cos(angle)}
              x2={60 + 43 * Math.sin(angle)}    y2={60 - 43 * Math.cos(angle)}
              stroke={`rgba(203,243,110,${major ? 0.55 : 0.2})`}
              strokeWidth={major ? 1.5 : 0.75}
            />
          );
        })}
        {/* Cardinal labels */}
        <text x="60" y="7"   textAnchor="middle" fill="rgba(203,243,110,0.95)" fontSize="9" fontFamily="'Courier New',monospace" fontWeight="bold">N</text>
        <text x="60" y="118" textAnchor="middle" fill="rgba(203,243,110,0.3)"  fontSize="7" fontFamily="'Courier New',monospace">S</text>
        <text x="117" y="64" textAnchor="middle" fill="rgba(203,243,110,0.3)"  fontSize="7" fontFamily="'Courier New',monospace">E</text>
        <text x="3"   y="64" textAnchor="middle" fill="rgba(203,243,110,0.3)"  fontSize="7" fontFamily="'Courier New',monospace">W</text>
        {/* Crosshair lines */}
        <line x1="60" y1="16" x2="60" y2="36" stroke="rgba(203,243,110,0.18)" strokeWidth="0.5" />
        <line x1="60" y1="84" x2="60" y2="104" stroke="rgba(203,243,110,0.18)" strokeWidth="0.5" />
        <line x1="16" y1="60" x2="36" y2="60" stroke="rgba(203,243,110,0.18)" strokeWidth="0.5" />
        <line x1="84" y1="60" x2="104" y2="60" stroke="rgba(203,243,110,0.18)" strokeWidth="0.5" />
        {/* Needle */}
        <g className="me-needle-float" style={{ transformOrigin: '60px 60px' }}>
          <polygon points="60,18 57,60 60,63 63,60" fill="rgba(203,243,110,0.88)" />
          <polygon points="60,102 57,60 60,57 63,60" fill="rgba(203,243,110,0.18)" />
        </g>
        {/* Centre */}
        <circle cx="60" cy="60" r="5.5" fill="none" stroke="rgba(203,243,110,0.35)" strokeWidth="1" />
        <circle cx="60" cy="60" r="3"   fill="rgba(203,243,110,0.8)" />
      </svg>

      <p className="me-coord-pulse" style={{
        fontFamily: "'Courier New', monospace",
        fontSize: 11,
        letterSpacing: '0.06em',
        color: 'rgba(203,243,110,0.55)',
        marginTop: 14,
        lineHeight: 1.8,
        textAlign: 'center',
      }}>
        37°59′N · 105°41′W<br />
        <span style={{ fontSize: 10, letterSpacing: '0.1em', textTransform: 'uppercase', opacity: 0.7 }}>
          Crestone, CO · 7,936 ft
        </span>
      </p>
    </div>
  );
}

// ─── Main component ────────────────────────────────────────────────────────────

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', phone: '', interest: '', message: '' });
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const update = (field: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setForm(f => ({ ...f, [field]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Submission failed.');
      setSent(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const sageVars = {
    '--bg':           '#18281c',
    '--bg-section':   '#131f16',
    '--bg-card':      '#1f3324',
    '--border':       'rgba(130, 175, 120, 0.16)',
    '--border-accent':'rgba(203, 243, 110, 0.42)',
    '--text-muted':   '#92b486',
    '--text-dim':     '#6a8f60',
    '--accent-dim':   'rgba(130, 175, 120, 0.12)',
    background:       '#18281c',
  } as React.CSSProperties;


  return (
    <main style={{ paddingTop: 72, ...sageVars }}>
      <SEO
        title="Contact Modern Explorer — Book a Tour in Crestone, Colorado"
        description="Plan your expedition with Modern Explorer. Book guided tours in Crestone, Colorado — 30 miles from Great Sand Dunes National Park, in the heart of the San Luis Valley and Sangre de Cristo mountains."
        url="/contact"
      />
      {/* ── KEYFRAMES ─────────────────────────────────────────────────────────── */}
      <style>{`
        @keyframes meNeedleFloat {
          0%, 100% { transform: rotate(0deg);   }
          30%       { transform: rotate(4deg);   }
          70%       { transform: rotate(-4deg);  }
        }
        @keyframes meCoordPulse {
          0%, 80%, 100% { opacity: 1;   }
          40%            { opacity: 0.4; }
        }
        @keyframes mePulseRing {
          0%, 100% { r: 56; opacity: 0.07; }
          50%       { r: 60; opacity: 0.18; }
        }
        @keyframes meContactGlow {
          0%, 100% { box-shadow: 0 0 0 0 rgba(203,243,110,0.0); }
          50%       { box-shadow: 0 0 18px 0 rgba(203,243,110,0.07); }
        }
        .me-needle-float { animation: meNeedleFloat 5s ease-in-out infinite; }
        .me-coord-pulse  { animation: meCoordPulse 5s ease-in-out infinite; }
        .me-pulse-ring   { animation: mePulseRing 5s ease-in-out infinite; }
        .me-contact-card { animation: meContactGlow 5s ease-in-out infinite; }

        /* ── Terminal form fields ────────────────────────────────────────── */
        @keyframes cfScan {
          0%,6%    { top:0%;   opacity:0; }
          9%       { top:0%;   opacity:.75; }
          88%      { top:100%; opacity:.2; }
          94%,100% { top:100%; opacity:0; }
        }
        @keyframes cfSubmitPulse {
          0%,100% { filter:drop-shadow(0 0 7px rgba(203,243,110,.35)) drop-shadow(0 0 0 transparent); }
          50%     { filter:drop-shadow(0 0 20px rgba(203,243,110,.85)) drop-shadow(0 0 40px rgba(203,243,110,.3)); }
        }
        .cf-outer {
          filter: drop-shadow(-2px 0 8px rgba(203,243,110,.06)) drop-shadow(0 0 0 transparent);
          transition: filter .22s ease;
        }
        .cf-outer:focus-within {
          filter: drop-shadow(-4px 0 18px rgba(203,243,110,.6)) drop-shadow(0 0 28px rgba(203,243,110,.12));
        }
        .cf-inner {
          position: relative;
          overflow: hidden;
          clip-path: polygon(0 0, 100% 0, 100% calc(100% - 13px), calc(100% - 13px) 100%, 0 100%);
          background: rgba(3,14,5,.75);
          backdrop-filter: blur(12px);
          border-left: 3px solid rgba(203,243,110,.3);
          border-top: 1px solid rgba(203,243,110,.07);
          border-right: 1px solid rgba(203,243,110,.05);
          border-bottom: 1px solid rgba(203,243,110,.05);
          transition: border-left-color .22s ease;
        }
        .cf-outer:focus-within .cf-inner {
          border-left-color: rgba(203,243,110,.92);
        }
        .cf-inner::after {
          content: '';
          position: absolute;
          left: 0; right: 0; height: 1px;
          background: linear-gradient(90deg, rgba(203,243,110,.8) 0%, rgba(203,243,110,.25) 60%, transparent 100%);
          pointer-events: none;
          opacity: 0;
          top: 0;
        }
        .cf-outer:focus-within .cf-inner::after {
          animation: cfScan 2.8s ease-in-out infinite;
        }
        .cf-input {
          width: 100%;
          padding: 14px 16px;
          background: transparent;
          border: none;
          outline: none;
          color: rgba(203,243,110,.88);
          font-family: 'Courier New', monospace;
          font-size: 13px;
          letter-spacing: .04em;
          caret-color: rgba(203,243,110,.9);
          box-sizing: border-box;
        }
        .cf-input::placeholder {
          color: rgba(100,155,75,.42);
          font-size: 11px;
          letter-spacing: .1em;
        }
        .cf-input option {
          background: #0c200e;
          color: rgba(203,243,110,.85);
        }
        .cf-submit {
          clip-path: polygon(0 0, 100% 0, 100% calc(100% - 11px), calc(100% - 11px) 100%, 0 100%);
          background: rgba(203,243,110,.92);
          color: #030d04;
          font-family: 'Courier New', monospace;
          font-size: 12px;
          font-weight: 700;
          letter-spacing: .2em;
          text-transform: uppercase;
          padding: 15px 44px;
          border: none;
          cursor: pointer;
          filter: drop-shadow(0 0 7px rgba(203,243,110,.3)) drop-shadow(0 0 0 transparent);
          transition: filter .2s ease, transform .15s ease;
        }
        .cf-submit:hover {
          animation: cfSubmitPulse 1s ease-in-out infinite;
          transform: translateY(-2px);
        }
        .cf-submit:disabled {
          opacity: .45;
          cursor: not-allowed;
          animation: none;
          transform: none;
        }
        .cf-label {
          display: block;
          font-family: 'Courier New', monospace;
          font-size: 10px;
          font-weight: 700;
          letter-spacing: .18em;
          text-transform: uppercase;
          color: rgba(130,175,100,.55);
          margin-bottom: 8px;
        }
      `}</style>

      {/* ── HERO ──────────────────────────────────────────────────────────────── */}
      <section style={{ position: 'relative', padding: '96px 0 80px', borderBottom: '1px solid var(--border)' }}>
        {/* Background image */}
        <div style={{
          position: 'absolute', inset: 0,
          backgroundImage: `url('${IMG('Nature', '20250729_200506-EDIT.jpg')}')`,
          backgroundSize: 'cover', backgroundPosition: 'center 40%',
          filter: 'brightness(0.22) saturate(0.7)',
        }} />
        {/* Sage green overlay for depth */}
        <div style={{
          position: 'absolute', inset: 0,
          background: 'linear-gradient(135deg, rgba(18,40,20,0.82) 0%, rgba(10,20,12,0.55) 50%, rgba(18,28,22,0.9) 100%)',
        }} />
        {/* Noise texture overlay */}
        <div style={{
          position: 'absolute', inset: 0,
          backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 256 256\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'n\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.9\' numOctaves=\'4\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23n)\' opacity=\'0.04\'/%3E%3C/svg%3E")',
          opacity: 0.6,
        }} />
        {/* Bottom fade */}
        <div style={{
          position: 'absolute', bottom: 0, left: 0, right: 0, height: '40%',
          background: 'linear-gradient(to bottom, transparent, var(--bg-section))',
        }} />

        <div className="container" style={{ position: 'relative' }}>
          {/* Coordinates eyebrow */}
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 10,
            marginBottom: 24,
          }}>
            <span style={{
              fontFamily: "'Courier New', monospace", fontSize: 11,
              color: 'rgba(203,243,110,0.55)', letterSpacing: '0.1em',
            }}>
              37°59′N · 105°41′W
            </span>
            <span style={{ width: 20, height: 1, background: 'rgba(203,243,110,0.3)' }} />
            <span className="eyebrow" style={{ margin: 0 }}>Crestone, Colorado</span>
          </div>

          <h1 style={{ fontSize: 'clamp(42px, 6.5vw, 80px)', marginBottom: 20, lineHeight: 1.0, letterSpacing: '-0.01em' }}>
            Begin Your<br />
            <span style={{ color: 'var(--accent)' }}>Expedition</span>
          </h1>
          <p style={{ fontFamily: 'var(--font-alt)', fontSize: 18, color: 'var(--text-muted)', maxWidth: 500, lineHeight: 1.7, marginBottom: 0 }}>
            Whether you're booking a tour, planning a private group, or chasing something unknown — start here. We read every message.
          </p>
        </div>
      </section>

      {/* ── FORM + SIDEBAR ────────────────────────────────────────────────────── */}
      <section id="mesa-contact" style={{ background: 'var(--bg-section)', padding: '72px 0 80px' }}>
        <div className="container">
          <div className="contact-layout">

            {/* ── LEFT: FORM ──────────────────────────────────────────────── */}
            <div>
              {/* Section label */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 32 }}>
                <div style={{ width: 3, height: 40, background: 'var(--accent)', borderRadius: 2, flexShrink: 0 }} />
                <div>
                  <p style={{ fontFamily: 'var(--font-heading)', fontSize: 10, fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--text-dim)', marginBottom: 4 }}>
                    Expedition Briefing Request
                  </p>
                  <h2 style={{ fontSize: 'clamp(24px, 3vw, 34px)', lineHeight: 1.1 }}>
                    Tell Us What You're<br />Planning
                  </h2>
                </div>
              </div>
              <p style={{ fontFamily: 'var(--font-alt)', color: 'var(--text-muted)', fontSize: 15, marginBottom: 40, lineHeight: 1.65 }}>
                We respond within 24–48 hours. For same-day tour booking, use the button in the sidebar.
              </p>

              {sent ? (
                <div style={{
                  padding: '48px 40px', textAlign: 'center',
                  background: 'rgba(2,12,4,.55)',
                  border: '1px solid rgba(203,243,110,0.25)',
                  clipPath: 'polygon(0 0, 100% 0, 100% calc(100% - 16px), calc(100% - 16px) 100%, 0 100%)',
                  boxShadow: '0 0 40px rgba(203,243,110,0.06)',
                }}>
                  <p style={{ fontFamily: "'Courier New',monospace", fontSize: 11, color: 'rgba(203,243,110,.4)', letterSpacing: '.18em', marginBottom: 20 }}>▸ TRANSMISSION RECEIVED</p>
                  <h3 style={{ fontFamily: "'Courier New',monospace", fontSize: 22, color: 'rgba(203,243,110,.9)', marginBottom: 14, letterSpacing: '.06em' }}>SIGNAL CONFIRMED</h3>
                  <p style={{ color: 'var(--text-muted)', fontFamily: "'Courier New',monospace", fontSize: 12, lineHeight: 1.75, maxWidth: 360, margin: '0 auto 28px', letterSpacing: '.03em' }}>
                    Message logged. Response inbound within 24–48 hours.<br />Stand by, Explorer.
                  </p>
                  <a href="/upcoming" className="btn btn-outline" style={{ fontSize: 12, fontFamily: "'Courier New',monospace", letterSpacing: '.12em' }}>
                    VIEW UPCOMING TOURS →
                  </a>
                </div>
              ) : (
                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

                  {/* Name + Email */}
                  <div className="form-row-2">
                    <div>
                      <label className="cf-label">
                        <span style={{ color: 'rgba(203,243,110,.22)', marginRight: 6 }}>▸</span>Name *
                      </label>
                      <div className="cf-outer">
                        <div className="cf-inner">
                          <input type="text" required value={form.name} onChange={update('name')}
                            placeholder="IDENTIFY YOURSELF" className="cf-input" />
                        </div>
                      </div>
                    </div>
                    <div>
                      <label className="cf-label">
                        <span style={{ color: 'rgba(203,243,110,.22)', marginRight: 6 }}>▸</span>Email *
                      </label>
                      <div className="cf-outer">
                        <div className="cf-inner">
                          <input type="email" required value={form.email} onChange={update('email')}
                            placeholder="TRANSMISSION ADDRESS" className="cf-input" />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Phone */}
                  <div>
                    <label className="cf-label">
                      <span style={{ color: 'rgba(203,243,110,.22)', marginRight: 6 }}>▸</span>
                      Phone
                      <span style={{ color: 'rgba(100,155,75,.4)', marginLeft: 8, fontSize: 9, letterSpacing: '.12em' }}>OPTIONAL</span>
                    </label>
                    <div className="cf-outer">
                      <div className="cf-inner">
                        <input type="tel" value={form.phone} onChange={update('phone')}
                          placeholder="SECONDARY CHANNEL (OPTIONAL)" className="cf-input" />
                      </div>
                    </div>
                  </div>

                  {/* Interest dropdown */}
                  <div>
                    <label className="cf-label">
                      <span style={{ color: 'rgba(203,243,110,.22)', marginRight: 6 }}>▸</span>Mission Type *
                    </label>
                    <div className="cf-outer">
                      <div className="cf-inner" style={{ position: 'relative' }}>
                        <select value={form.interest} onChange={update('interest')} required
                          className="cf-input"
                          style={{ appearance: 'none', cursor: 'pointer', paddingRight: 38 } as React.CSSProperties}>
                          <option value="">SELECT MISSION TYPE</option>
                          <option value="general-tour">General Walking Tour</option>
                          <option value="specialty-tours">Future Specialty Tours</option>
                          <option value="private-group">Private Group Booking</option>
                          <option value="expedition">Expedition Interest</option>
                          <option value="media">Media &amp; Press</option>
                          <option value="other">Other</option>
                        </select>
                        <span style={{ position: 'absolute', right: 16, top: '50%', transform: 'translateY(-50%)', color: 'rgba(203,243,110,.45)', fontSize: 11, pointerEvents: 'none', fontFamily: "'Courier New',monospace" }}>▾</span>
                      </div>
                    </div>
                  </div>

                  {/* Message */}
                  <div>
                    <label className="cf-label">
                      <span style={{ color: 'rgba(203,243,110,.22)', marginRight: 6 }}>▸</span>Field Report *
                    </label>
                    <div className="cf-outer">
                      <div className="cf-inner">
                        <textarea required value={form.message} onChange={update('message')} rows={7}
                          placeholder="ENTER FIELD REPORT OR INQUIRY"
                          className="cf-input"
                          style={{ resize: 'none', lineHeight: 1.7 }} />
                      </div>
                    </div>
                  </div>

                  {/* Error */}
                  {error && (
                    <div style={{
                      padding: '11px 16px',
                      background: 'rgba(220,50,50,.07)',
                      border: '1px solid rgba(220,50,50,.28)',
                      fontFamily: "'Courier New',monospace",
                      fontSize: 12, color: 'rgba(220,120,120,.9)',
                      letterSpacing: '.03em', lineHeight: 1.55,
                    }}>
                      <span style={{ marginRight: 8, opacity: .6 }}>⚠</span>{error}
                    </div>
                  )}

                  {/* Submit row */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: 22, paddingTop: 4 }}>
                    <button type="submit" disabled={loading} className="cf-submit">
                      {loading ? 'TRANSMITTING...' : 'SEND TRANSMISSION'}
                    </button>
                    <span style={{ fontFamily: "'Courier New',monospace", fontSize: 10, color: 'rgba(100,155,75,.45)', letterSpacing: '.1em' }}>
                      RESPONSE // 24–48 HRS
                    </span>
                  </div>
                </form>
              )}
            </div>

            {/* ── RIGHT: SIDEBAR ──────────────────────────────────────────── */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

              {/* Compass + coordinates */}
              <div className="me-contact-card" style={{
                background: 'rgba(0,0,0,0.22)',
                border: '1px solid rgba(203,243,110,0.15)',
                borderRadius: 8,
                overflow: 'hidden',
              }}>
                <CompassWidget />
              </div>

              {/* Direct contact */}
              <div style={{
                background: 'rgba(0,0,0,0.2)',
                border: '1px solid var(--border)',
                borderRadius: 8,
                padding: '24px 26px',
              }}>
                <p style={{
                  fontFamily: 'var(--font-heading)', fontSize: 10, fontWeight: 700,
                  letterSpacing: '0.18em', textTransform: 'uppercase',
                  color: 'var(--text-dim)', marginBottom: 18,
                }}>
                  Direct Contact
                </p>

                {[
                  {
                    icon: '✉',
                    label: 'Email',
                    value: 'admin@modernexplorer.me',
                    href: 'mailto:admin@modernexplorer.me',
                  },
                  {
                    icon: '☎',
                    label: 'Phone',
                    value: '(719) 331-4200',
                    href: 'tel:+17193314200',
                  },
                ].map(item => (
                  <a
                    key={item.label}
                    href={item.href}
                    style={{
                      display: 'flex', alignItems: 'flex-start', gap: 14,
                      padding: '14px 0',
                      borderBottom: item.label === 'Email' ? '1px solid var(--border)' : 'none',
                      textDecoration: 'none',
                      color: 'inherit',
                      transition: 'color 0.15s',
                    }}
                    onMouseEnter={e => (e.currentTarget.style.color = 'var(--accent)')}
                    onMouseLeave={e => (e.currentTarget.style.color = 'inherit')}
                  >
                    <span style={{
                      width: 34, height: 34, flexShrink: 0,
                      borderRadius: 6,
                      background: 'rgba(203,243,110,0.07)',
                      border: '1px solid rgba(203,243,110,0.15)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: 14, color: 'rgba(203,243,110,0.6)',
                    }}>
                      {item.icon}
                    </span>
                    <div>
                      <p style={{ fontFamily: 'var(--font-heading)', fontSize: 10, fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--text-dim)', marginBottom: 3 }}>
                        {item.label}
                      </p>
                      <p style={{ fontFamily: 'var(--font-alt)', fontSize: 13, fontWeight: 600, color: 'var(--text-muted)', lineHeight: 1.3 }}>
                        {item.value}
                      </p>
                    </div>
                  </a>
                ))}
              </div>

              {/* Book now CTA */}
              <div style={{
                background: 'rgba(203,243,110,0.05)',
                border: '1px solid rgba(203,243,110,0.2)',
                borderRadius: 8,
                padding: '22px 24px',
              }}>
                <p style={{ fontFamily: 'var(--font-heading)', fontSize: 10, fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--text-dim)', marginBottom: 10 }}>
                  Ready to Book?
                </p>
                <p style={{ fontFamily: 'var(--font-alt)', fontSize: 13, color: 'var(--text-muted)', marginBottom: 16, lineHeight: 1.55 }}>
                  Skip the form — reserve your spot directly through our booking system.
                </p>
                <a href={BOOKING_URL} target="_blank" rel="noopener noreferrer" className="btn btn-primary" style={{ width: '100%', justifyContent: 'center', fontSize: 13 }}>
                  Book a Tour Now
                </a>
              </div>

              {/* Location map */}
              <div style={{
                background: 'rgba(0,0,0,0.18)',
                border: '1px solid rgba(203,243,110,0.25)',
                borderRadius: 8,
                overflow: 'hidden',
                boxShadow: '0 0 32px rgba(203,243,110,0.06)',
              }}>
                {/* Map header */}
                <div style={{ padding: '14px 18px 10px', borderBottom: '1px solid rgba(203,243,110,0.12)', background: 'rgba(1,8,2,0.9)' }}>
                  <p style={{ fontFamily: 'var(--font-heading)', fontSize: 10, fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--text-dim)', marginBottom: 4 }}>
                    Based In
                  </p>
                  <p style={{ fontFamily: 'var(--font-heading)', fontSize: 15, marginBottom: 1 }}>Crestone, Colorado</p>
                  <p style={{ fontSize: 12, color: 'var(--text-dim)', fontFamily: "'Courier New', monospace", letterSpacing: '0.05em' }}>
                    37°59′N · 105°41′W · 7,936 ft
                  </p>
                </div>

                {/* Map iframe with lime green pin overlay */}
                <div style={{ position: 'relative', height: 240 }}>
                  <iframe
                    src="https://maps.google.com/maps?q=37.9933215,-105.695489&z=14&output=embed"
                    title="Modern Explorer — Crestone, Colorado"
                    style={{ display: 'block', width: '100%', height: '100%', border: 'none', filter: 'grayscale(0.3) brightness(0.88)' }}
                    loading="lazy"
                  />
                  {/* Lime green custom pin — centered over the business location */}
                  <div style={{
                    position: 'absolute',
                    top: '50%', left: '50%',
                    transform: 'translate(-50%, -100%)',
                    pointerEvents: 'none',
                    zIndex: 10,
                    filter: 'drop-shadow(0 2px 8px rgba(0,0,0,0.7))',
                  }}>
                    <svg width="32" height="42" viewBox="0 0 32 42" fill="none">
                      <path d="M16 0C7.16 0 0 7.16 0 16c0 11.08 14.24 24.64 15.18 25.54a1.14 1.14 0 0 0 1.64 0C17.76 40.64 32 27.08 32 16 32 7.16 24.84 0 16 0z" fill="#CBF36E"/>
                      <circle cx="16" cy="16" r="6" fill="#0b0f1c"/>
                      <circle cx="16" cy="16" r="3" fill="#CBF36E" opacity="0.9"/>
                    </svg>
                  </div>
                </div>

                {/* Directions link */}
                <a
                  href="https://maps.google.com/maps?q=Modern+Explorer+Crestone+Colorado&z=14"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, padding: '11px', background: 'rgba(203,243,110,0.05)', borderTop: '1px solid rgba(203,243,110,0.12)', color: 'var(--accent)', fontFamily: 'var(--font-heading)', fontSize: 11, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', textDecoration: 'none', transition: 'background 0.15s' }}
                  onMouseEnter={e => (e.currentTarget.style.background = 'rgba(203,243,110,0.1)')}
                  onMouseLeave={e => (e.currentTarget.style.background = 'rgba(203,243,110,0.05)')}
                >
                  Get Directions →
                </a>
              </div>

              {/* Social */}
              <div style={{
                background: 'rgba(0,0,0,0.18)',
                border: '1px solid var(--border)',
                borderRadius: 8,
                padding: '22px 24px',
              }}>
                <p style={{ fontFamily: 'var(--font-heading)', fontSize: 10, fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--text-dim)', marginBottom: 14 }}>
                  Follow the Expedition
                </p>
                {[
                  { name: 'Instagram', handle: '@modern._explorer', href: 'https://instagram.com/modern._explorer' },
                  { name: 'YouTube',   handle: '@ModernExplorer',   href: 'https://www.youtube.com/@ModernExplorer' },
                  { name: 'X',         handle: '@ModernExplorer5',  href: 'https://x.com/ModernExplorer5' },
                ].map(s => (
                  <a key={s.name} href={s.href} target="_blank" rel="noopener noreferrer"
                    style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '11px 0', borderBottom: '1px solid var(--border)', color: 'var(--text-muted)', textDecoration: 'none', transition: 'color 0.15s', fontSize: 13 }}
                    onMouseEnter={e => (e.currentTarget.style.color = 'var(--accent)')}
                    onMouseLeave={e => (e.currentTarget.style.color = 'var(--text-muted)')}
                  >
                    <span style={{ fontFamily: 'var(--font-alt)', fontWeight: 600 }}>{s.name}</span>
                    <span style={{ fontFamily: "'Courier New', monospace", fontSize: 11, opacity: 0.7 }}>{s.handle} →</span>
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
