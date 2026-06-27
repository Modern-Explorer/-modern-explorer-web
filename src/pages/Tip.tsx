import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';
import SEO from '../components/SEO';

const stripePromise = loadStripe((import.meta as any).env?.VITE_STRIPE_PUBLISHABLE_KEY ?? '');
const API_URL = (import.meta.env.VITE_BOOKING_API_URL as string | undefined) ?? 'http://localhost:3001/api';

const STRIPE_APPEARANCE: import('@stripe/stripe-js').Appearance = {
  theme: 'night',
  variables: {
    colorPrimary: '#cbf36e', colorBackground: '#111827', colorText: '#f0f4ff',
    colorTextSecondary: 'rgba(240,244,255,0.55)', colorDanger: '#ef4444',
    fontFamily: '"DM Sans", sans-serif', fontSizeBase: '15px',
    borderRadius: '6px', spacingUnit: '4px',
  },
  rules: {
    '.Input': { border: '1px solid rgba(255,255,255,0.08)', backgroundColor: '#111827', color: '#f0f4ff', padding: '12px 14px' },
    '.Input:focus': { border: '1px solid rgba(203,243,110,0.32)', boxShadow: 'none' },
    '.Label': { fontFamily: '"Oswald", sans-serif', fontSize: '11px', fontWeight: '600', letterSpacing: '0.14em', textTransform: 'uppercase', color: 'rgba(240,244,255,0.35)', marginBottom: '6px' },
    '.Tab': { border: '1px solid rgba(255,255,255,0.08)', backgroundColor: '#0a0e1d', color: 'rgba(240,244,255,0.55)' },
    '.Tab--selected': { border: '1px solid rgba(203,243,110,0.32)', backgroundColor: 'rgba(203,243,110,0.08)', color: '#cbf36e' },
    '.Tab:hover': { border: '1px solid rgba(203,243,110,0.2)' },
    '.Error': { color: '#ef4444', fontSize: '13px' },
  },
};

const PRESET_AMOUNTS = [5, 10, 15, 20, 25, 50];

// ─── Inner payment form (must live inside <Elements>) ─────────────────────────
function PaymentForm({ amountCents, guideName: _guideName, onSuccess, onBack }: {
  amountCents: number;
  guideName: string;
  onSuccess: (paymentIntentId: string) => void;
  onBack: () => void;
}) {
  const stripe   = useStripe();
  const elements = useElements();
  const [processing, setProcessing] = useState(false);
  const [error, setError]           = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!stripe || !elements) return;
    setProcessing(true);
    setError(null);

    const { error: stripeErr, paymentIntent } = await stripe.confirmPayment({
      elements,
      confirmParams: {},
      redirect: 'if_required',
    });

    if (stripeErr) {
      setError(stripeErr.message ?? 'Could not process payment. Please try again.');
      setProcessing(false);
      return;
    }
    if (!paymentIntent || (paymentIntent.status !== 'succeeded' && paymentIntent.status !== 'processing')) {
      setError('Payment was not completed. Please try again.');
      setProcessing(false);
      return;
    }
    onSuccess(paymentIntent.id);
  }

  const dollars = amountCents / 100;

  return (
    <form onSubmit={handleSubmit}>
      <div style={{ marginBottom: 20 }}>
        <PaymentElement options={{ layout: 'tabs' }} />
      </div>
      {error && (
        <div style={{ padding: '12px 16px', marginBottom: 16, background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: 6, fontSize: 13, color: '#ef4444', lineHeight: 1.5 }}>
          {error}
        </div>
      )}
      <div style={{ display: 'flex', gap: 12 }}>
        <button type="button" className="btn btn-ghost" onClick={onBack} disabled={processing} style={{ flex: '0 0 auto' }}>
          ← Back
        </button>
        <button type="submit" className="btn btn-primary" disabled={!stripe || !elements || processing} style={{ flex: 1, justifyContent: 'center' }}>
          {processing
            ? <><span style={{ width: 16, height: 16, border: '2px solid rgba(8,12,23,0.3)', borderTopColor: '#080c17', borderRadius: '50%', animation: 'spin 0.7s linear infinite', display: 'inline-block', flexShrink: 0, marginRight: 8 }} />Processing…</>
            : `Send $${Number.isInteger(dollars) ? dollars : dollars.toFixed(2)} Tip`}
        </button>
      </div>
    </form>
  );
}

// ─── Main page ────────────────────────────────────────────────────────────────
export default function Tip() {
  const [searchParams]  = useSearchParams();
  const guideName       = searchParams.get('guide') ?? '';

  const [selected, setSelected]       = useState<number | null>(null);
  const [customAmount, setCustomAmount] = useState('');
  const [step, setStep]               = useState<'select' | 'payment' | 'success'>('select');
  const [clientSecret, setClientSecret] = useState('');
  const [loading, setLoading]         = useState(false);
  const [apiError, setApiError]       = useState('');

  const amountDollars = selected !== null ? selected : parseFloat(customAmount) || 0;
  const amountCents   = Math.round(amountDollars * 100);
  const isValid       = amountCents >= 100;

  async function handleContinue() {
    if (!isValid) return;
    setLoading(true);
    setApiError('');
    try {
      const res = await fetch(`${API_URL}/tips/intent`, {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ amount_cents: amountCents, guide_name: guideName }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to initialize payment.');
      setClientSecret(data.client_secret);
      setStep('payment');
    } catch (err) {
      setApiError(err instanceof Error ? err.message : 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  const displayDollars = Number.isInteger(amountDollars) ? amountDollars.toFixed(0) : amountDollars.toFixed(2);

  return (
    <main style={{ paddingTop: 72, background: 'var(--bg)', minHeight: '100vh' }}>
      <SEO
        title="Leave a Tip — Modern Explorer"
        description="Show your appreciation for your Modern Explorer guide."
        url="/tip"
      />

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        .tip-amt-btn {
          padding: 16px 8px;
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 8px;
          color: var(--text);
          font-family: var(--font-heading);
          font-size: 20px;
          font-weight: 700;
          cursor: pointer;
          transition: border-color 0.15s, background 0.15s, color 0.15s;
          text-align: center;
        }
        .tip-amt-btn:hover { border-color: rgba(203,243,110,0.4); background: rgba(203,243,110,0.06); }
        .tip-amt-btn.tip-selected { border-color: #cbf36e; background: rgba(203,243,110,0.12); color: #cbf36e; }
        .tip-custom-input {
          width: 100%; padding: 13px 14px 13px 30px;
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 8px; color: var(--text);
          font-family: var(--font-heading); font-size: 16px;
          outline: none; transition: border-color 0.15s;
          box-sizing: border-box;
        }
        .tip-custom-input:focus { border-color: rgba(203,243,110,0.4); }
        .tip-custom-input::placeholder { color: rgba(255,255,255,0.2); font-size: 14px; }
      `}</style>

      <div style={{ maxWidth: 520, margin: '0 auto', padding: '60px 24px 80px' }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: 48 }}>
          <span className="eyebrow" style={{ display: 'block', marginBottom: 12 }}>Modern Explorer</span>
          <h1 style={{ fontSize: 'clamp(30px, 5vw, 46px)', marginBottom: 16, lineHeight: 1.05 }}>
            Leave a Tip for<br />
            <span style={{ color: 'var(--accent)' }}>Your Guide</span>
          </h1>
          {guideName && (
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              padding: '6px 18px',
              background: 'rgba(203,243,110,0.08)',
              border: '1px solid rgba(203,243,110,0.25)',
              borderRadius: 100,
              marginBottom: 16,
            }}>
              <span style={{ color: 'var(--accent)', fontSize: 14, fontFamily: 'var(--font-heading)', letterSpacing: '0.06em' }}>
                Tip for {guideName}
              </span>
            </div>
          )}
          <p style={{ color: 'var(--text-muted)', fontSize: 16, lineHeight: 1.65 }}>
            Thank you for exploring with Modern Explorer!
          </p>
        </div>

        {/* ── SUCCESS ─────────────────────────────────────────────────────── */}
        {step === 'success' ? (
          <div style={{
            textAlign: 'center', padding: '52px 32px',
            background: 'var(--bg-card)',
            border: '1px solid rgba(203,243,110,0.25)',
            borderRadius: 12,
          }}>
            <div style={{ fontSize: 64, marginBottom: 20 }}>🙏</div>
            <h2 style={{ fontSize: 28, marginBottom: 14 }}>Thank You!</h2>
            <p style={{ color: 'var(--text-muted)', fontSize: 16, lineHeight: 1.65, maxWidth: 320, margin: '0 auto 28px' }}>
              Your guide will receive your tip. It means the world to them.
            </p>
            <a href="/" className="btn btn-outline">Back to Home</a>
          </div>

        ) : (
          <div style={{
            background: 'var(--bg-card)',
            border: '1px solid var(--border)',
            borderRadius: 12,
            padding: '32px',
          }}>

            {/* ── SELECT AMOUNT ──────────────────────────────────────────── */}
            {step === 'select' && (
              <>
                <p style={{
                  fontFamily: 'var(--font-heading)', fontSize: 11, fontWeight: 700,
                  letterSpacing: '0.18em', textTransform: 'uppercase',
                  color: 'var(--text-dim)', marginBottom: 20,
                }}>
                  Select Amount
                </p>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10, marginBottom: 24 }}>
                  {PRESET_AMOUNTS.map(amt => (
                    <button
                      key={amt}
                      className={`tip-amt-btn${selected === amt ? ' tip-selected' : ''}`}
                      onClick={() => { setSelected(amt); setCustomAmount(''); }}
                    >
                      ${amt}
                    </button>
                  ))}
                </div>

                <div style={{ marginBottom: 28 }}>
                  <label style={{
                    display: 'block', fontFamily: 'var(--font-heading)', fontSize: 10, fontWeight: 700,
                    letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--text-dim)', marginBottom: 8,
                  }}>
                    Custom Amount
                  </label>
                  <div style={{ position: 'relative' }}>
                    <span style={{
                      position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)',
                      color: customAmount ? 'rgba(203,243,110,0.7)' : 'rgba(255,255,255,0.25)',
                      fontFamily: 'var(--font-heading)', fontSize: 16, pointerEvents: 'none',
                    }}>
                      $
                    </span>
                    <input
                      type="number"
                      min="1"
                      step="1"
                      placeholder="Other amount"
                      value={customAmount}
                      onChange={e => { setCustomAmount(e.target.value); setSelected(null); }}
                      className="tip-custom-input"
                    />
                  </div>
                </div>

                {apiError && (
                  <div style={{ padding: '11px 16px', marginBottom: 16, background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: 6, fontSize: 13, color: '#ef4444' }}>
                    {apiError}
                  </div>
                )}

                <button
                  onClick={handleContinue}
                  disabled={!isValid || loading}
                  className="btn btn-primary"
                  style={{ width: '100%', justifyContent: 'center', fontSize: 15 }}
                >
                  {loading
                    ? <><span style={{ width: 16, height: 16, border: '2px solid rgba(8,12,23,0.3)', borderTopColor: '#080c17', borderRadius: '50%', animation: 'spin 0.7s linear infinite', display: 'inline-block', flexShrink: 0, marginRight: 8 }} />Loading…</>
                    : isValid
                      ? `Continue — $${displayDollars}`
                      : 'Select an Amount'}
                </button>

                <p style={{ marginTop: 14, textAlign: 'center', fontSize: 12, color: 'var(--text-dim)', fontFamily: 'var(--font-alt)' }}>
                  Payments are processed securely via Stripe.
                </p>
              </>
            )}

            {/* ── PAYMENT ────────────────────────────────────────────────── */}
            {step === 'payment' && clientSecret && (
              <>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
                  <p style={{
                    fontFamily: 'var(--font-heading)', fontSize: 11, fontWeight: 700,
                    letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--text-dim)',
                  }}>
                    Payment Details
                  </p>
                  <div style={{ background: 'rgba(203,243,110,0.08)', border: '1px solid rgba(203,243,110,0.2)', borderRadius: 20, padding: '4px 16px' }}>
                    <span style={{ color: 'var(--accent)', fontFamily: 'var(--font-heading)', fontSize: 16, fontWeight: 700 }}>
                      ${displayDollars} Tip
                    </span>
                  </div>
                </div>

                <Elements
                  stripe={stripePromise}
                  options={{
                    clientSecret,
                    appearance: STRIPE_APPEARANCE,
                    fonts: [{ cssSrc: 'https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600&display=swap' }],
                  }}
                >
                  <PaymentForm
                    amountCents={amountCents}
                    guideName={guideName}
                    onSuccess={async (paymentIntentId) => {
                      setStep('success');
                      fetch(`${API_URL}/tips/record`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ amount_cents: amountCents, guide_name: guideName || undefined, guide_id: new URLSearchParams(window.location.search).get('guide_id') || undefined, payment_intent_id: paymentIntentId }),
                      }).catch(() => {});
                    }}
                    onBack={() => setStep('select')}
                  />
                </Elements>
              </>
            )}

          </div>
        )}
      </div>
    </main>
  );
}
