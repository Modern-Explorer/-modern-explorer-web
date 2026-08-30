import { useState, useId } from 'react';
import SEO from '../components/SEO';

// ─── Feature card data ────────────────────────────────────────────────────────

const FEATURES = [
  {
    icon: '◈',
    title: 'The Classroom',
    desc: 'Structured courses in field research, cryptozoology, and local history — plus guided audio field training you can run yourself.',
    slot: 'courses-preview',
  },
  {
    icon: '⬡',
    title: 'Community',
    desc: 'Member directory, direct messages, and live topic channels. Talk to people who take this as seriously as you do.',
    slot: 'community-preview',
  },
  {
    icon: '◉',
    title: 'Expeditions & Field Ops',
    desc: 'Member-only expedition slots and meetups. Get to places that never appear on public tour schedules.',
    slot: 'expeditions-preview',
  },
  {
    icon: '▲',
    title: 'Ranks & Archetypes',
    desc: 'Earn your path — Tracker, Sage, or Guide. Badges, leaderboards, and recognition that actually means something in the field.',
    slot: 'ranks-preview',
  },
  {
    icon: '▣',
    title: 'The Library',
    desc: 'Curated books and audiobooks: field research, regional history, documented anomalies. Updated continuously.',
    slot: 'library-preview',
  },
  {
    icon: '✦',
    title: 'Member Email',
    desc: 'Your own @thefrontier.work address. A field identity that travels with you.',
    slot: 'email-preview',
  },
] as const;

const TIERS = [
  { name: 'Visitor',      tag: 'Free forever — community access, public courses.'     },
  { name: 'Scout',        tag: 'Full Library, classroom, and member channels.'          },
  { name: 'Trailblazer', tag: 'Priority expedition slots, member email, leaderboards.' },
  { name: 'Expedition',  tag: 'All-access — private ops, mentorship, field partner network.' },
] as const;

// ─── Waitlist form ─────────────────────────────────────────────────────────────

function WaitlistForm() {
  const formId = useId();
  const [name,    setName]    = useState('');
  const [email,   setEmail]   = useState('');
  const [pot,     setPot]     = useState(''); // honeypot
  const [status,  setStatus]  = useState<'idle'|'loading'|'success'|'error'>('idle');
  const [errMsg,  setErrMsg]  = useState('');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (pot) return; // honeypot triggered — silently ignore
    setStatus('loading');
    try {
      const res = await fetch('/api/waitlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: name.trim() || undefined, email: email.trim(), source: 'membership-page', website: pot }),
      });
      const json = await res.json() as { error?: string };
      if (!res.ok) throw new Error(json.error ?? 'Something went wrong.');
      setStatus('success');
    } catch (err) {
      setErrMsg(err instanceof Error ? err.message : 'Something went wrong.');
      setStatus('error');
    }
  }

  if (status === 'success') {
    return (
      <div style={{ textAlign: 'center', padding: '48px 24px' }}>
        <div style={{ fontSize: 32, marginBottom: 16, color: 'var(--accent)' }}>◉</div>
        <p style={{ fontFamily: 'var(--font-heading)', fontSize: 'clamp(1.2rem, 3vw, 1.6rem)', color: 'var(--accent)', letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: 12 }}>
          You're on the list
        </p>
        <p style={{ color: 'var(--text-muted)', maxWidth: 380, margin: '0 auto', lineHeight: 1.7 }}>
          We'll email you when the doors open. Welcome to The Frontier.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate>
      {/* Honeypot — visually hidden, never filled by real users */}
      <div style={{ position: 'absolute', left: '-9999px', opacity: 0, pointerEvents: 'none' }} aria-hidden="true">
        <label htmlFor={`${formId}-hp`}>Leave blank</label>
        <input id={`${formId}-hp`} type="text" value={pot} onChange={e => setPot(e.target.value)} tabIndex={-1} autoComplete="off" />
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 14, maxWidth: 460, margin: '0 auto' }}>
        <div>
          <label style={{ display: 'block', fontFamily: 'var(--font-heading)', fontSize: 11, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: 6 }}>
            Name <span style={{ opacity: 0.5 }}>(optional)</span>
          </label>
          <input
            type="text"
            value={name}
            onChange={e => setName(e.target.value)}
            placeholder="Your name"
            autoComplete="name"
            style={inputStyle}
          />
        </div>
        <div>
          <label style={{ display: 'block', fontFamily: 'var(--font-heading)', fontSize: 11, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: 6 }}>
            Email <span style={{ color: 'var(--accent)' }}>*</span>
          </label>
          <input
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            placeholder="you@example.com"
            required
            autoComplete="email"
            style={inputStyle}
          />
        </div>

        {status === 'error' && (
          <p style={{ color: '#f87171', fontSize: 13, margin: 0 }}>{errMsg}</p>
        )}

        <button
          type="submit"
          disabled={status === 'loading'}
          className="btn btn-primary"
          style={{ width: '100%', justifyContent: 'center', padding: '14px 24px', fontSize: 14, opacity: status === 'loading' ? 0.7 : 1 }}
        >
          {status === 'loading' ? 'Sending…' : 'Join the Waiting List'}
        </button>
      </div>
    </form>
  );
}

const inputStyle: React.CSSProperties = {
  width: '100%',
  background: 'rgba(255,255,255,0.04)',
  border: '1px solid var(--border)',
  borderRadius: 'var(--radius)',
  color: 'var(--text)',
  fontFamily: 'var(--font-body)',
  fontSize: 15,
  padding: '11px 14px',
  outline: 'none',
  transition: 'border-color 0.15s',
};

// ─── Page ──────────────────────────────────────────────────────────────────────

export default function Membership() {
  return (
    <>
      <SEO
        title="The Frontier — Modern Explorer Membership"
        description="Join The Frontier: the Modern Explorer membership community. Courses, field training, expeditions, ranks, and a library built for people who take the hunt seriously. Waitlist open now."
        url="/membership"
        keywords="Modern Explorer membership, The Frontier, field research community, cryptozoology courses, San Luis Valley expeditions, paranormal training"
      />

      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <section style={{
        minHeight: '100vh', display: 'flex', flexDirection: 'column',
        justifyContent: 'center', alignItems: 'center',
        padding: '120px 24px 80px',
        background: 'radial-gradient(ellipse 80% 60% at 50% 30%, rgba(203,243,110,0.04) 0%, transparent 70%)',
        position: 'relative', textAlign: 'center',
      }}>
        {/* Ghost login note — top-right ish, rendered below the nav */}
        <div style={{ position: 'absolute', top: 90, right: 24, display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{ fontSize: 12, color: 'var(--text-muted)', fontFamily: 'var(--font-body)' }}>Already a member?</span>
          <button
            disabled
            title="Member login opens at launch"
            style={{
              fontFamily: 'var(--font-heading)', fontSize: 11, fontWeight: 600,
              letterSpacing: '0.1em', textTransform: 'uppercase',
              color: 'var(--text-dim)', border: '1px solid var(--border)',
              borderRadius: 'var(--radius)', padding: '6px 14px',
              cursor: 'not-allowed', background: 'transparent',
            }}
          >
            Member Login
          </button>
        </div>

        <p style={{ fontFamily: 'var(--font-heading)', fontSize: 11, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--accent)', opacity: 0.8, marginBottom: 18 }}>
          Modern Explorer · Membership Community
        </p>

        <h1 style={{
          fontFamily: 'var(--font-heading)', fontWeight: 700,
          fontSize: 'clamp(3.5rem, 10vw, 7rem)',
          letterSpacing: '0.06em', textTransform: 'uppercase',
          color: 'var(--text)', lineHeight: 0.95,
          marginBottom: 28,
        }}>
          The Frontier
        </h1>

        <p style={{ fontSize: 'clamp(1rem, 2.2vw, 1.25rem)', color: 'var(--text-muted)', maxWidth: 540, lineHeight: 1.65, marginBottom: 18 }}>
          A community of modern explorers — training, expeditions, and the hunt for what's out there.
        </p>

        <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap', justifyContent: 'center', marginTop: 16 }}>
          <a
            href="#waitlist"
            className="btn btn-primary"
            style={{ padding: '13px 32px', fontSize: 14 }}
          >
            Join the Waiting List
          </a>
          <a
            href="#inside"
            style={{
              padding: '13px 32px', fontSize: 14, fontFamily: 'var(--font-heading)',
              fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase',
              color: 'var(--text-muted)', border: '1px solid var(--border)',
              borderRadius: 'var(--radius)', display: 'inline-flex', alignItems: 'center', gap: 8,
            }}
          >
            What's Inside
          </a>
        </div>

        {/* Divider */}
        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 1, background: 'linear-gradient(90deg, transparent, var(--border-accent), transparent)' }} />
      </section>

      {/* ── Feature cards ────────────────────────────────────────────────── */}
      <section id="inside" className="section" style={{ background: 'var(--bg-section)' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: 60 }}>
            <p style={{ fontFamily: 'var(--font-heading)', fontSize: 11, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--accent)', opacity: 0.8, marginBottom: 12 }}>
              What you get
            </p>
            <h2 style={{ fontSize: 'clamp(1.8rem, 4vw, 2.8rem)', color: 'var(--text)' }}>Built for the Field</h2>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
            gap: 24,
          }}>
            {FEATURES.map(f => (
              <div
                key={f.title}
                style={{
                  background: 'var(--bg-card)',
                  border: '1px solid var(--border)',
                  borderLeft: '3px solid var(--accent)',
                  borderRadius: 'var(--radius)',
                  padding: '28px 24px 24px',
                  display: 'flex', flexDirection: 'column', gap: 12,
                }}
              >
                <span style={{ fontFamily: 'var(--font-heading)', fontSize: 22, color: 'var(--accent)', opacity: 0.85 }}>{f.icon}</span>
                <h3 style={{ fontSize: '1.05rem', color: 'var(--text)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>{f.title}</h3>
                <p style={{ fontSize: 14, color: 'var(--text-muted)', lineHeight: 1.65, flexGrow: 1 }}>{f.desc}</p>
                {/* Screenshot slot — replace this div with an <img> when ready */}
                <div
                  data-screenshot-slot={f.slot}
                  style={{
                    height: 120, borderRadius: 3,
                    border: '1px dashed rgba(255,255,255,0.10)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    marginTop: 6,
                  }}
                >
                  <span style={{ fontSize: 11, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--text-dim)', fontFamily: 'var(--font-heading)' }}>
                    Screenshot coming
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Tier strip ───────────────────────────────────────────────────── */}
      <section style={{ padding: '80px 0', background: 'var(--bg)', borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: 48 }}>
            <p style={{ fontFamily: 'var(--font-heading)', fontSize: 11, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--accent)', opacity: 0.8, marginBottom: 12 }}>
              Membership tiers
            </p>
            <h2 style={{ fontSize: 'clamp(1.6rem, 3.5vw, 2.4rem)', color: 'var(--text)' }}>Choose Your Path</h2>
            <p style={{ color: 'var(--text-muted)', marginTop: 10, fontSize: 14 }}>Pricing revealed at launch. Join the waitlist to lock founding-member rates.</p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 16 }}>
            {TIERS.map((t, i) => (
              <div
                key={t.name}
                style={{
                  background: 'var(--bg-card)',
                  border: `1px solid ${i === 2 ? 'var(--border-accent)' : 'var(--border)'}`,
                  borderRadius: 'var(--radius)',
                  padding: '28px 20px',
                  position: 'relative',
                }}
              >
                {i === 2 && (
                  <span style={{
                    position: 'absolute', top: -1, right: 16,
                    background: 'var(--accent)', color: '#0b0f1c',
                    fontFamily: 'var(--font-heading)', fontSize: 9, fontWeight: 700,
                    letterSpacing: '0.15em', textTransform: 'uppercase',
                    padding: '3px 8px', borderRadius: '0 0 3px 3px',
                  }}>Popular</span>
                )}
                <p style={{ fontFamily: 'var(--font-heading)', fontSize: '1.1rem', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: i === 2 ? 'var(--accent)' : 'var(--text)', marginBottom: 10 }}>
                  {t.name}
                </p>
                <p style={{ fontSize: 13, color: 'var(--text-muted)', lineHeight: 1.55 }}>{t.tag}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Waitlist form ─────────────────────────────────────────────────── */}
      <section id="waitlist" className="section" style={{ background: 'var(--bg-section)' }}>
        <div style={{ maxWidth: 560, margin: '0 auto', padding: '0 24px', textAlign: 'center' }}>
          <p style={{ fontFamily: 'var(--font-heading)', fontSize: 11, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--accent)', opacity: 0.8, marginBottom: 14 }}>
            Founding access
          </p>
          <h2 style={{ fontSize: 'clamp(1.6rem, 4vw, 2.6rem)', color: 'var(--text)', marginBottom: 14 }}>
            Join the Waiting List
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: 15, lineHeight: 1.7, marginBottom: 40 }}>
            We'll email you the moment doors open — and founding members get first access, locked-in rates, and a founding badge that never resets.
          </p>
          <WaitlistForm />
        </div>
      </section>
    </>
  );
}
