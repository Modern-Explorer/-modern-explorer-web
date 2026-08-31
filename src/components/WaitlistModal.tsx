import { useEffect, useId, useRef, useState } from 'react';
import { useWaitlist } from '../context/WaitlistContext';

const RATE_LIMIT_KEY = 'me_waitlist_submit_ts';
const RATE_LIMIT_MS  = 60_000; // 60 s between submissions

function isRateLimited(): boolean {
  try {
    const ts = Number(localStorage.getItem(RATE_LIMIT_KEY) ?? 0);
    return Date.now() - ts < RATE_LIMIT_MS;
  } catch { return false; }
}

function stampRateLimit() {
  try { localStorage.setItem(RATE_LIMIT_KEY, String(Date.now())); } catch { /* ignore */ }
}

const inputStyle: React.CSSProperties = {
  width: '100%',
  background: 'rgba(255,255,255,0.05)',
  border: '1px solid rgba(255,255,255,0.12)',
  borderRadius: 5,
  color: '#f0f4ff',
  fontFamily: 'var(--font-body)',
  fontSize: 15,
  padding: '11px 14px',
  outline: 'none',
  boxSizing: 'border-box',
  transition: 'border-color 0.15s',
};

export default function WaitlistModal() {
  const { isOpen, source, close } = useWaitlist();
  const formId = useId();

  const [name,     setName]     = useState('');
  const [email,    setEmail]    = useState('');
  const [phone,    setPhone]    = useState('');
  const [interest, setInterest] = useState('');
  const [message,  setMessage]  = useState('');
  const [pot,      setPot]      = useState('');
  const [status,   setStatus]   = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errMsg,   setErrMsg]   = useState('');

  const emailRef = useRef<HTMLInputElement>(null);

  // Reset form on open
  useEffect(() => {
    if (isOpen) {
      setName(''); setEmail(''); setPhone(''); setInterest(''); setMessage(''); setPot('');
      setStatus('idle'); setErrMsg('');
      setTimeout(() => emailRef.current?.focus(), 80);
    }
  }, [isOpen]);

  // Close on Escape
  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') close(); };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [isOpen, close]);

  // Lock body scroll while open
  useEffect(() => {
    if (isOpen) { document.body.style.overflow = 'hidden'; }
    else         { document.body.style.overflow = ''; }
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  if (!isOpen) return null;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (pot) return; // honeypot

    const trimmedName = name.trim();
    if (!trimmedName) {
      setErrMsg('Name is required.');
      setStatus('error');
      return;
    }

    const trimmedEmail = email.trim();
    if (!trimmedEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) {
      setErrMsg('Please enter a valid email address.');
      setStatus('error');
      return;
    }

    if (isRateLimited()) {
      setErrMsg('You already signed up recently. Check your inbox for a confirmation.');
      setStatus('error');
      return;
    }

    setStatus('loading');
    setErrMsg('');

    try {
      const res = await fetch('/api/waitlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name:     trimmedName,
          email:    trimmedEmail,
          phone:    phone.trim() || undefined,
          interest: interest || undefined,
          message:  message.trim() || undefined,
          source,
          website:  pot,
        }),
      });
      const json = await res.json() as { ok?: boolean; error?: string };
      if (!res.ok) throw new Error(json.error ?? 'Something went wrong. Please try again.');
      stampRateLimit();
      setStatus('success');
    } catch (err) {
      setErrMsg(err instanceof Error ? err.message : 'Something went wrong. Please try again.');
      setStatus('error');
    }
  }

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={close}
        style={{
          position: 'fixed', inset: 0, zIndex: 9998,
          background: 'rgba(4,6,16,0.82)',
          backdropFilter: 'blur(4px)',
          animation: 'meModalFadeIn 0.18s ease',
        }}
        aria-hidden="true"
      />

      {/* Modal panel */}
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Join the waitlist"
        style={{
          position: 'fixed', inset: 0, zIndex: 9999,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          padding: '16px',
          pointerEvents: 'none',
        }}
      >
        <div
          style={{
            width: '100%', maxWidth: 460,
            background: '#0d1120',
            border: '1px solid rgba(203,243,110,0.18)',
            borderRadius: 8,
            boxShadow: '0 24px 64px rgba(0,0,0,0.7), 0 0 0 1px rgba(203,243,110,0.06)',
            overflow: 'hidden',
            pointerEvents: 'auto',
            animation: 'meModalSlideIn 0.22s cubic-bezier(0.34,1.26,0.64,1)',
          }}
        >
          {/* Header */}
          <div style={{ padding: '28px 32px 0', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <p style={{ fontFamily: 'var(--font-heading)', fontSize: 10, fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'rgba(203,243,110,0.75)', marginBottom: 6 }}>
                The Frontier
              </p>
              <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: 'clamp(20px, 4vw, 26px)', fontWeight: 600, color: '#f0f4ff', margin: 0 }}>
                Join the Waitlist
              </h2>
            </div>
            <button
              onClick={close}
              aria-label="Close"
              style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(240,244,255,0.4)', fontSize: 22, lineHeight: 1, padding: '2px 4px', marginTop: -2 }}
            >
              ×
            </button>
          </div>

          {/* Note */}
          <p style={{ fontFamily: 'var(--font-alt)', fontSize: 13, color: 'rgba(240,244,255,0.55)', lineHeight: 1.6, padding: '10px 32px 0', margin: 0 }}>
            Early access to The Frontier — first word on founding member pricing.
          </p>

          {status === 'success' ? (
            /* Success state */
            <div style={{ padding: '36px 32px 40px', textAlign: 'center' }}>
              <div style={{ fontSize: 30, color: 'var(--accent)', marginBottom: 14 }}>◉</div>
              <p style={{ fontFamily: 'var(--font-heading)', fontSize: 18, fontWeight: 600, color: 'var(--accent)', letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: 10 }}>
                You're on the list
              </p>
              <p style={{ fontFamily: 'var(--font-alt)', fontSize: 14, color: 'rgba(240,244,255,0.6)', lineHeight: 1.7, maxWidth: 320, margin: '0 auto' }}>
                Check your inbox for a confirmation. You'll hear from us first when doors open.
              </p>
            </div>
          ) : (
            /* Form */
            <form onSubmit={handleSubmit} noValidate style={{ padding: '20px 32px 32px' }}>
              {/* Honeypot — hidden from real users */}
              <div style={{ position: 'absolute', left: '-9999px', opacity: 0, pointerEvents: 'none' }} aria-hidden="true">
                <label htmlFor={`${formId}-hp`}>Leave blank</label>
                <input id={`${formId}-hp`} type="text" value={pot} onChange={e => setPot(e.target.value)} tabIndex={-1} autoComplete="off" />
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                {/* Name (required) */}
                <div>
                  <label htmlFor={`${formId}-name`} style={{ display: 'block', fontFamily: 'var(--font-heading)', fontSize: 10, fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'rgba(240,244,255,0.5)', marginBottom: 7 }}>
                    Name <span style={{ color: 'var(--accent)' }}>*</span>
                  </label>
                  <input
                    id={`${formId}-name`}
                    type="text"
                    value={name}
                    onChange={e => { setName(e.target.value); if (status === 'error') setStatus('idle'); }}
                    placeholder="Your name"
                    required
                    autoComplete="name"
                    style={{ ...inputStyle, borderColor: status === 'error' && !name.trim() ? 'rgba(248,113,113,0.6)' : 'rgba(255,255,255,0.12)' }}
                    onFocus={e => (e.currentTarget.style.borderColor = 'rgba(203,243,110,0.45)')}
                    onBlur={e => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.12)')}
                  />
                </div>

                {/* Email */}
                <div>
                  <label htmlFor={`${formId}-email`} style={{ display: 'block', fontFamily: 'var(--font-heading)', fontSize: 10, fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'rgba(240,244,255,0.5)', marginBottom: 7 }}>
                    Email <span style={{ color: 'var(--accent)' }}>*</span>
                  </label>
                  <input
                    id={`${formId}-email`}
                    ref={emailRef}
                    type="email"
                    value={email}
                    onChange={e => { setEmail(e.target.value); if (status === 'error') setStatus('idle'); }}
                    placeholder="you@example.com"
                    required
                    autoComplete="email"
                    style={{ ...inputStyle, borderColor: status === 'error' && !email.trim() ? 'rgba(248,113,113,0.6)' : 'rgba(255,255,255,0.12)' }}
                    onFocus={e => (e.currentTarget.style.borderColor = 'rgba(203,243,110,0.45)')}
                    onBlur={e => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.12)')}
                  />
                </div>

                {/* Phone (optional) */}
                <div>
                  <label htmlFor={`${formId}-phone`} style={{ display: 'block', fontFamily: 'var(--font-heading)', fontSize: 10, fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'rgba(240,244,255,0.5)', marginBottom: 7 }}>
                    Phone <span style={{ opacity: 0.45, fontWeight: 400 }}>(optional)</span>
                  </label>
                  <input
                    id={`${formId}-phone`}
                    type="tel"
                    value={phone}
                    onChange={e => setPhone(e.target.value)}
                    placeholder="+1 (555) 000-0000"
                    autoComplete="tel"
                    style={inputStyle}
                    onFocus={e => (e.currentTarget.style.borderColor = 'rgba(203,243,110,0.45)')}
                    onBlur={e => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.12)')}
                  />
                </div>

                {/* Interest (optional) */}
                <div>
                  <label htmlFor={`${formId}-interest`} style={{ display: 'block', fontFamily: 'var(--font-heading)', fontSize: 10, fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'rgba(240,244,255,0.5)', marginBottom: 7 }}>
                    What are you most interested in? <span style={{ opacity: 0.45, fontWeight: 400 }}>(optional)</span>
                  </label>
                  <select
                    id={`${formId}-interest`}
                    value={interest}
                    onChange={e => setInterest(e.target.value)}
                    style={{ ...inputStyle, appearance: 'none', WebkitAppearance: 'none', cursor: 'pointer', paddingRight: 36, backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8'%3E%3Cpath d='M1 1l5 5 5-5' stroke='rgba(240,244,255,0.35)' stroke-width='1.5' fill='none' stroke-linecap='round'/%3E%3C/svg%3E")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 14px center' }}
                    onFocus={e => (e.currentTarget.style.borderColor = 'rgba(203,243,110,0.45)')}
                    onBlur={e => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.12)')}
                  >
                    <option value="">— pick one —</option>
                    <option value="expeditions-tours">Expeditions &amp; Tours</option>
                    <option value="uap-research">UAP Research</option>
                    <option value="cryptozoology">Cryptozoology</option>
                    <option value="lost-history">Lost History &amp; Archaeology</option>
                    <option value="frontier-membership">The Frontier Membership</option>
                    <option value="courses-training">Courses &amp; Training</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                {/* Message (optional) */}
                <div>
                  <label htmlFor={`${formId}-message`} style={{ display: 'block', fontFamily: 'var(--font-heading)', fontSize: 10, fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'rgba(240,244,255,0.5)', marginBottom: 7 }}>
                    Message <span style={{ opacity: 0.45, fontWeight: 400 }}>(optional)</span>
                  </label>
                  <textarea
                    id={`${formId}-message`}
                    value={message}
                    onChange={e => setMessage(e.target.value)}
                    placeholder="What brings you here?"
                    rows={3}
                    style={{ ...inputStyle, resize: 'vertical', lineHeight: 1.5 }}
                    onFocus={e => (e.currentTarget.style.borderColor = 'rgba(203,243,110,0.45)')}
                    onBlur={e => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.12)')}
                  />
                </div>

                {/* Inline error */}
                {status === 'error' && errMsg && (
                  <p role="alert" style={{ color: '#f87171', fontSize: 13, margin: 0, lineHeight: 1.5 }}>{errMsg}</p>
                )}

                {/* Submit */}
                <button
                  type="submit"
                  disabled={status === 'loading'}
                  className="btn btn-primary"
                  style={{ width: '100%', justifyContent: 'center', padding: '13px 20px', fontSize: 14, marginTop: 2, opacity: status === 'loading' ? 0.7 : 1 }}
                >
                  {status === 'loading' ? 'Sending…' : 'Join the Waiting List'}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>

      <style>{`
        @keyframes meModalFadeIn  { from { opacity: 0; } to { opacity: 1; } }
        @keyframes meModalSlideIn { from { opacity: 0; transform: translateY(12px) scale(0.97); } to { opacity: 1; transform: none; } }
      `}</style>
    </>
  );
}
