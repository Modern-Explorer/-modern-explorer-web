import { useState, useEffect, useMemo, useCallback } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { useBooking } from '../context/BookingContext';
import WaiverModal from './WaiverModal';

// ─── Stripe & API config ──────────────────────────────────────────────────────
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

// ─── Types (mirror booking-frontend/src/types.ts) ─────────────────────────────
interface Slot {
  id: string;
  date: string;
  start_time: string;
  capacity: number;
  spots_remaining: number;
  tour_name: string;
  price_per_person: number;
  private_flat_price: number;
  min_group_size: number;
  max_group_size: number;
  duration_minutes: number;
}
type TourType = 'join-group' | 'group' | 'private-guaranteed';
type ContactPref = 'email' | 'sms' | 'both';
interface Customer { name: string; email: string; phone: string; contact_preference?: ContactPref; }
interface BookingResult {
  confirmation_code: string;
  tour_name: string;
  date: string;
  start_time: string;
  group_size: number;
  is_private: boolean;
  tour_type?: TourType;
  subtotal: number;
  service_fee: number;
  total_amount: number;
  customer_name: string;
}
type DrawerStep = 'calendar' | 'slot' | 'tour-type' | 'group-size' | 'customer' | 'review' | 'confirmation';

// ─── Pricing & date utilities ─────────────────────────────────────────────────
const PRIVATE_GUARANTEED_BASE = 85;
const GROUP_PER_PP            = 35;
const GROUP_MIN               = 70;
const SERVICE_RATE            = 0.06;
const MAX_GROUP               = 12;

function calcAmounts(size: number, tourType: TourType, slot?: Slot | null) {
  let subtotal: number;
  if (tourType === 'join-group') {
    subtotal = size * Number(slot?.price_per_person ?? GROUP_PER_PP); // no minimum
  } else if (tourType === 'group') {
    subtotal = Math.max(GROUP_MIN, size * Number(slot?.price_per_person ?? GROUP_PER_PP));
  } else {
    subtotal = PRIVATE_GUARANTEED_BASE + Math.max(0, size - 2) * GROUP_PER_PP;
  }
  const fee = Math.round(subtotal * SERVICE_RATE * 100) / 100;
  return { subtotal, fee, total: Math.round((subtotal + fee) * 100) / 100 };
}


function formatTime(t: string) {
  const [h, m] = t.split(':').map(Number);
  return `${h % 12 || 12}:${String(m).padStart(2, '0')} ${h >= 12 ? 'PM' : 'AM'}`;
}
function formatDate(d: string) {
  return new Date(d.slice(0, 10) + 'T12:00:00').toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });
}

// ─── Tour config ──────────────────────────────────────────────────────────────
const TOUR_PHOTO = '/assets/images/content/Crestone/20250810_090608-EDIT.jpg';
const TOUR_NAME  = 'The Crestone Walking Tour';
const TOUR_DESC  = 'Immersive 45–60 min small-group tour through Crestone\'s spiritual history, mining past, documented paranormal activity, and UAP phenomena.';

// ─── InfoTooltip ─────────────────────────────────────────────────────────────
function InfoTooltip({ text }: { text: string }) {
  const [visible, setVisible] = useState(false);
  return (
    <span style={{ position: 'relative', display: 'inline-flex', alignItems: 'center', verticalAlign: 'middle', marginLeft: 6 }}>
      <button type="button" onMouseEnter={e => { setVisible(true); (e.currentTarget as HTMLElement).style.background = 'rgba(203,243,110,0.12)'; }} onMouseLeave={e => { setVisible(false); (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.08)'; }} onClick={() => setVisible(v => !v)} aria-label="More information"
        style={{ width: 16, height: 16, borderRadius: '50%', background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.18)', color: 'var(--text-dim)', fontSize: 10, fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'background var(--ease)' }}>i</button>
      {visible && (
        <span style={{ position: 'absolute', bottom: 'calc(100% + 10px)', left: '50%', transform: 'translateX(-50%)', width: 260, background: '#0d1224', border: '1px solid rgba(255,255,255,0.12)', borderRadius: 6, padding: '12px 14px', fontSize: 12, color: 'var(--text-muted)', lineHeight: 1.65, zIndex: 300, boxShadow: '0 8px 32px rgba(0,0,0,0.7)', pointerEvents: 'none', display: 'block' }}>
          <span style={{ position: 'absolute', top: '100%', left: '50%', transform: 'translateX(-50%)', width: 0, height: 0, borderLeft: '6px solid transparent', borderRight: '6px solid transparent', borderTop: '6px solid rgba(255,255,255,0.12)' }} />
          {text}
        </span>
      )}
    </span>
  );
}

// ─── Tour Request Form ────────────────────────────────────────────────────────
function TourRequestForm({ onBack }: { onBack: () => void }) {
  const [form, setForm] = useState({ name: '', email: '', desired_date: '', preferred_time: '', group_size: '', notes: '' });
  const [submitting, setSubmitting] = useState(false);
  const [submitted,  setSubmitted]  = useState(false);
  const [error,      setError]      = useState<string | null>(null);

  function setField(k: keyof typeof form, v: string) { setForm(f => ({ ...f, [k]: v })); }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      const res = await fetch(`${API_URL}/tour-request`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, group_size: Number(form.group_size) || 1 }),
      });
      const data = await res.json() as { ok?: boolean; error?: string };
      if (!res.ok) throw new Error(data.error ?? 'Request failed');
      setSubmitted(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not submit. Please try again.');
    } finally {
      setSubmitting(false);
    }
  }

  const inputStyle: React.CSSProperties = { width: '100%', background: 'var(--bg-section)', border: '1px solid var(--border)', borderRadius: 4, padding: '11px 14px', fontFamily: 'var(--font-alt)', fontSize: 14, color: 'var(--text)', outline: 'none', transition: 'border-color .15s', boxSizing: 'border-box' };
  const labelStyle: React.CSSProperties = { fontFamily: 'var(--font-alt)', fontSize: 11, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--text-dim)', display: 'block', marginBottom: 6 };
  const onFocus = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => (e.target.style.borderColor = 'rgba(203,243,110,0.4)');
  const onBlur  = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => (e.target.style.borderColor = 'rgba(255,255,255,0.07)');

  if (submitted) {
    return (
      <div style={{ textAlign: 'center', padding: '32px 8px' }}>
        <div style={{ width: 64, height: 64, borderRadius: '50%', background: 'var(--accent-dim)', border: '2px solid var(--border-accent)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
          <svg width="28" height="28" viewBox="0 0 28 28" fill="none"><path d="M5 14l7 7 11-11" stroke="#cbf36e" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
        </div>
        <p style={{ fontFamily: 'var(--font-alt)', fontSize: 11, fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--accent)', marginBottom: 10 }}>Request Received</p>
        <p style={{ fontFamily: 'var(--font-heading)', fontSize: 20, fontWeight: 600, color: 'var(--text)', marginBottom: 12 }}>We'll be in touch soon.</p>
        <p style={{ fontSize: 14, color: 'var(--text-muted)', lineHeight: 1.7, maxWidth: 320, margin: '0 auto 28px' }}>
          Your request has been received. We will contact you within 24 hours to confirm availability.
        </p>
        <button className="btn btn-ghost" onClick={onBack} style={{ width: '100%', justifyContent: 'center' }}>← Back to booking options</button>
      </div>
    );
  }

  return (
    <div>
      <button onClick={onBack} style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer', color: 'var(--text-dim)', fontSize: 13, display: 'flex', alignItems: 'center', gap: 6, marginBottom: 20, fontFamily: 'var(--font-alt)' }}>
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M9 2L4 7l5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
        Back
      </button>

      <p style={{ fontFamily: 'var(--font-alt)', fontSize: 11, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--accent)', marginBottom: 4 }}>Request a Custom Tour</p>
      <p style={{ fontFamily: 'var(--font-alt)', fontSize: 13, color: 'var(--text-muted)', lineHeight: 1.65, marginBottom: 24 }}>
        Tell us what you have in mind and we'll reach out within 24 hours to confirm availability.
      </p>

      <form onSubmit={handleSubmit}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16, marginBottom: 24 }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div>
              <label style={labelStyle}>Full Name *</label>
              <input style={inputStyle} type="text" required placeholder="Jane Smith" value={form.name} onChange={e => setField('name', e.target.value)} onFocus={onFocus} onBlur={onBlur} />
            </div>
            <div>
              <label style={labelStyle}>Email *</label>
              <input style={inputStyle} type="email" required placeholder="jane@example.com" value={form.email} onChange={e => setField('email', e.target.value)} onFocus={onFocus} onBlur={onBlur} />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div>
              <label style={labelStyle}>Desired Date *</label>
              <input style={inputStyle} type="date" required value={form.desired_date} onChange={e => setField('desired_date', e.target.value)} onFocus={onFocus} onBlur={onBlur} />
            </div>
            <div>
              <label style={labelStyle}>Preferred Time</label>
              <input style={inputStyle} type="time" value={form.preferred_time} onChange={e => setField('preferred_time', e.target.value)} onFocus={onFocus} onBlur={onBlur} />
            </div>
          </div>

          <div>
            <label style={labelStyle}>Group Size *</label>
            <input style={inputStyle} type="number" required min="1" max="100" placeholder="e.g. 15" value={form.group_size} onChange={e => setField('group_size', e.target.value)} onFocus={onFocus} onBlur={onBlur} />
          </div>

          <div>
            <label style={labelStyle}>Notes & Special Requests</label>
            <textarea
              style={{ ...inputStyle, resize: 'vertical', minHeight: 90 } as React.CSSProperties}
              placeholder="Tell us about your group, any special occasions, accessibility needs, or other requests…"
              value={form.notes}
              onChange={e => setField('notes', e.target.value)}
              onFocus={onFocus as any}
              onBlur={onBlur as any}
            />
          </div>
        </div>

        {error && (
          <div style={{ padding: '12px 16px', marginBottom: 16, background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: 6, fontSize: 13, color: '#ef4444', lineHeight: 1.5 }}>{error}</div>
        )}

        <button type="submit" className="btn btn-primary" disabled={submitting} style={{ width: '100%', justifyContent: 'center', opacity: submitting ? 0.65 : 1 }}>
          {submitting
            ? <><span style={{ width: 15, height: 15, border: '2px solid rgba(8,12,23,0.3)', borderTopColor: '#080c17', borderRadius: '50%', animation: 'spin 0.7s linear infinite', display: 'inline-block', marginRight: 8 }} />Sending…</>
            : 'Send Request'}
        </button>
      </form>
    </div>
  );
}

// ─── Tour Type Selection ──────────────────────────────────────────────────────
const LOCK_SVG = (color = 'currentColor') => (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
    <rect x="2" y="6" width="10" height="7" rx="1.5"/>
    <path d="M4.5 6V4.5a2.5 2.5 0 015 0V6"/>
  </svg>
);

function TourTypeStep({ selectedType, onSelect, onRequestTour, slot }: {
  selectedType: TourType | null;
  onSelect: (t: TourType) => void;
  onRequestTour: () => void;
  slot: Slot | null;
}) {
  const slotHasOthers = slot ? (slot.capacity - slot.spots_remaining) > 0 : false;

  const options = ([
    {
      id: 'join-group' as TourType,
      title: 'Join a Group',
      price: '$35',
      priceNote: 'per person',
      tagline: 'others already joining this slot',
      description: "Jump into an existing group. $35/person — no minimum. You'll share the tour with other guests who have already booked.",
      hidden: !slotHasOthers,
    },
    {
      id: 'group',
      title: 'Group Tour',
      price: '$35',
      priceNote: 'per person',
      tagline: '$70 minimum for 1–2 people',
      description: 'Book your group at $35/person. Groups of 1–2 pay the $70 minimum. Other guests may join this slot.',
      hidden: slotHasOthers,
    },
    {
      id: 'private-guaranteed',
      hidden: slotHasOthers,
      title: 'Private Guaranteed',
      price: '$85',
      priceNote: 'for 1–2 people',
      tagline: '+ $35/person beyond 2 · exclusive slot',
      description: 'Lock the entire time slot for your group only. No other guests will be added — your slot is fully reserved.',
      isPrivate: true,
    },
  ] as Array<{ id: TourType; title: string; price: string; priceNote: string; tagline: string; description: string; isPrivate?: boolean; hidden?: boolean }>).filter(o => !o.hidden);

  return (
    <div>
      <p style={{ fontFamily: 'var(--font-alt)', fontSize: 11, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--accent)', marginBottom: 4 }}>Choose Your Experience</p>
      <p style={{ fontFamily: 'var(--font-alt)', fontSize: 13, color: 'var(--text-muted)', lineHeight: 1.65, marginBottom: 24 }}>Select the booking type that best fits your visit.</p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 24 }}>
        {options.map(opt => {
          const active = selectedType === opt.id;
          return (
            <button key={opt.id} onClick={() => onSelect(opt.id)}
              style={{ background: active ? 'rgba(203,243,110,0.07)' : 'var(--bg-section)', border: `${active ? 2 : 1}px solid ${active ? 'var(--accent)' : 'var(--border)'}`, borderRadius: 10, padding: '18px 20px', textAlign: 'left', cursor: 'pointer', transition: 'border-color 0.2s, background 0.2s', width: '100%' }}
              onMouseEnter={e => { if (!active) (e.currentTarget.style.borderColor = 'var(--border-accent)'); }}
              onMouseLeave={e => { if (!active) (e.currentTarget.style.borderColor = 'var(--border)'); }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  {opt.isPrivate && LOCK_SVG(active ? 'var(--accent)' : 'var(--text-dim)')}
                  <span style={{ fontFamily: 'var(--font-heading)', fontSize: 15, fontWeight: 700, color: active ? 'var(--accent)' : 'var(--text)', letterSpacing: '0.03em' }}>{opt.title}</span>
                  {active && (
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                      <path d="M2.5 7l3.5 3.5 5.5-6" stroke="var(--accent)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  )}
                </div>
                <div style={{ textAlign: 'right', flexShrink: 0, marginLeft: 12 }}>
                  <p style={{ fontFamily: 'var(--font-heading)', fontSize: 22, fontWeight: 700, color: active ? 'var(--accent)' : 'var(--text-muted)', lineHeight: 1, marginBottom: 2 }}>{opt.price}</p>
                  <p style={{ fontSize: 11, color: 'var(--text-dim)', lineHeight: 1 }}>{opt.priceNote}</p>
                </div>
              </div>
              <p style={{ fontFamily: 'var(--font-heading)', fontSize: 10, fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: active ? 'rgba(203,243,110,0.65)' : 'var(--text-dim)', marginBottom: 8 }}>{opt.tagline}</p>
              <p style={{ fontSize: 13, color: 'var(--text-muted)', lineHeight: 1.55, margin: 0 }}>{opt.description}</p>
              {opt.isPrivate && active && (
                <div style={{ marginTop: 12, display: 'flex', alignItems: 'center', gap: 8, padding: '9px 12px', background: 'rgba(203,243,110,0.06)', borderRadius: 5, border: '1px solid rgba(203,243,110,0.2)' }}>
                  {LOCK_SVG('var(--accent)')}
                  <span style={{ fontSize: 12, color: 'var(--accent)', lineHeight: 1.5 }}>This slot will be reserved exclusively for your group — no other guests.</span>
                </div>
              )}
            </button>
          );
        })}
      </div>

      {/* Custom tour request prompt */}
      <button
        type="button"
        onClick={onRequestTour}
        style={{ width: '100%', marginBottom: 16, padding: '13px 16px', background: 'none', border: '1px dashed rgba(255,255,255,0.15)', borderRadius: 8, cursor: 'pointer', textAlign: 'center', transition: 'border-color 0.2s, background 0.2s' }}
        onMouseEnter={e => { (e.currentTarget.style.borderColor = 'rgba(203,243,110,0.35)'); (e.currentTarget.style.background = 'rgba(203,243,110,0.04)'); }}
        onMouseLeave={e => { (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.15)'); (e.currentTarget.style.background = 'none'); }}
      >
        <span style={{ fontSize: 13, color: 'var(--text-muted)', lineHeight: 1.5 }}>
          Have a large group or special request?{' '}
          <span style={{ color: 'var(--accent)', fontWeight: 600, textDecoration: 'underline', textUnderlineOffset: 3 }}>Request a custom date/time.</span>
        </span>
      </button>

      <div style={{ padding: '12px 16px', background: 'var(--bg-section)', border: '1px solid var(--border)', borderRadius: 6, display: 'flex', gap: 10, alignItems: 'flex-start' }}>
        <span style={{ fontSize: 16, flexShrink: 0, marginTop: 1 }}>🔒</span>
        <p style={{ fontSize: 13, color: 'var(--text-dim)', lineHeight: 1.6, margin: 0 }}>
          <strong style={{ color: 'var(--text-muted)' }}>Charged immediately.</strong>{' '}
          Payment is collected securely via Stripe when you confirm your booking.
        </p>
      </div>
    </div>
  );
}

// ─── Step indicator ───────────────────────────────────────────────────────────
const STEP_LABELS = ['Date', 'Time', 'Party', 'Details', 'Confirm'];
const STEP_INDEX: Record<DrawerStep, number> = {
  calendar: 0, slot: 1, 'tour-type': 2, 'group-size': 2, customer: 3, review: 4, confirmation: 5,
};

function StepBar({ step }: { step: DrawerStep }) {
  const current = STEP_INDEX[step];
  return (
    <div style={{ display: 'flex', alignItems: 'center', padding: '14px 20px', borderBottom: '1px solid var(--border)', background: 'var(--bg-section)' }}>
      {STEP_LABELS.map((label, i) => {
        const done   = i < current;
        const active = i === current;
        const isLast = i === STEP_LABELS.length - 1;
        return (
          <div key={label} style={{ display: 'flex', alignItems: 'center', flex: isLast ? 'none' : 1 }}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, flexShrink: 0 }}>
              <div style={{ width: 26, height: 26, borderRadius: '50%', background: done || active ? 'var(--accent)' : 'var(--bg-section)', border: `2px solid ${done || active ? 'var(--accent)' : 'var(--border)'}`, display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'background 0.2s, border-color 0.2s' }}>
                {done
                  ? <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M2 6l3 3 5-5" stroke="#080c17" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                  : <span style={{ fontFamily: 'var(--font-heading)', fontSize: 11, fontWeight: 700, color: active ? '#080c17' : 'var(--text-dim)', lineHeight: 1 }}>{i + 1}</span>
                }
              </div>
              <span style={{ fontFamily: 'var(--font-heading)', fontSize: 8, fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: active ? 'var(--accent)' : done ? 'var(--text-muted)' : 'var(--text-dim)', whiteSpace: 'nowrap' }}>{label}</span>
            </div>
            {!isLast && <div style={{ flex: 1, height: 2, background: done ? 'var(--accent)' : 'var(--border)', margin: '0 4px', marginBottom: 18, transition: 'background 0.2s' }} />}
          </div>
        );
      })}
    </div>
  );
}

// ─── STEP 3: Group Size ───────────────────────────────────────────────────────
function GroupSizeStep({ groupSize, setGroupSize, tourType }: { groupSize: number; setGroupSize: (n: number) => void; tourType: TourType }) {
  const minSize = 1;
  const { subtotal, fee, total } = calcAmounts(groupSize, tourType);

  const rateLabel = tourType === 'private-guaranteed'
    ? groupSize <= 2
      ? `${groupSize === 1 ? '1 person' : '2-person group'} · flat rate`
      : `2 base + ${groupSize - 2} extra × $${GROUP_PER_PP}/person`
    : tourType === 'join-group'
      ? `${groupSize} ${groupSize === 1 ? 'person' : 'people'} × $${GROUP_PER_PP}/person`
      : groupSize <= 2
        ? `${groupSize === 1 ? '1 person' : '2 people'} · $${GROUP_MIN} minimum`
        : `${groupSize} people × $${GROUP_PER_PP}/person`;

  return (
    <div>
      <p style={{ fontFamily: 'var(--font-alt)', fontSize: 11, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--accent)', marginBottom: 4 }}>
        How many people are coming?
      </p>
      <p style={{ fontFamily: 'var(--font-alt)', fontSize: 13, color: 'var(--text-muted)', lineHeight: 1.65, marginBottom: 24 }}>
        {tourType === 'private-guaranteed'
          ? `Including yourself. $${PRIVATE_GUARANTEED_BASE} for up to 2 people, $${GROUP_PER_PP}/person beyond that.`
          : tourType === 'join-group'
            ? `$${GROUP_PER_PP}/person — no minimum.`
            : `$${GROUP_PER_PP}/person. Groups of 1–2 pay a $${GROUP_MIN} minimum.`}
      </p>

      {/* Stepper */}
      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 24 }}>
        <div style={{ display: 'flex', alignItems: 'center', background: 'var(--bg-section)', border: '1px solid var(--border)', borderRadius: 10, overflow: 'hidden' }}>
          <button onClick={() => setGroupSize(Math.max(minSize, groupSize - 1))} disabled={groupSize <= minSize}
            style={{ width: 64, height: 72, border: 'none', background: 'none', color: groupSize <= minSize ? 'var(--text-dim)' : 'var(--text-muted)', fontSize: 28, fontWeight: 200, cursor: groupSize <= minSize ? 'not-allowed' : 'pointer', transition: 'color 0.15s' }}>−</button>
          <div style={{ width: 96, textAlign: 'center', borderLeft: '1px solid var(--border)', borderRight: '1px solid var(--border)', padding: '14px 0' }}>
            <p style={{ fontFamily: 'var(--font-heading)', fontSize: 36, fontWeight: 700, color: 'var(--accent)', lineHeight: 1, marginBottom: 2 }}>{groupSize}</p>
            <p style={{ fontSize: 12, color: 'var(--text-dim)' }}>{groupSize === 1 ? 'person' : 'people'}</p>
          </div>
          <button onClick={() => setGroupSize(Math.min(MAX_GROUP, groupSize + 1))} disabled={groupSize >= MAX_GROUP}
            style={{ width: 64, height: 72, border: 'none', background: 'none', color: groupSize >= MAX_GROUP ? 'var(--text-dim)' : 'var(--text-muted)', fontSize: 28, fontWeight: 200, cursor: groupSize >= MAX_GROUP ? 'not-allowed' : 'pointer', transition: 'color 0.15s' }}>+</button>
        </div>
      </div>

      {/* Dynamic price card */}
      <div style={{ background: 'var(--accent-dim)', border: '1px solid var(--border-accent)', borderRadius: 10, padding: '22px 24px', marginBottom: 16 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
          <div>
            <p style={{ fontFamily: 'var(--font-heading)', fontSize: 11, fontWeight: 700, letterSpacing: '0.16em', textTransform: 'uppercase', color: 'var(--text-dim)', marginBottom: 4 }}>
              {tourType === 'private-guaranteed' ? 'Private Guaranteed Rate' : tourType === 'join-group' ? 'Join a Group Rate' : 'Group Tour Rate'}
            </p>
            <p style={{ fontSize: 14, color: 'var(--text-muted)', lineHeight: 1.5 }}>{rateLabel}</p>
          </div>
          <div style={{ textAlign: 'right' }}>
            <p style={{ fontFamily: 'var(--font-heading)', fontSize: 32, fontWeight: 700, color: 'var(--accent)', lineHeight: 1, marginBottom: 2 }}>${subtotal}</p>
            <p style={{ fontSize: 12, color: 'var(--text-dim)' }}>{tourType === 'private-guaranteed' ? 'flat rate' : 'subtotal'}</p>
          </div>
        </div>
        {tourType === 'private-guaranteed' && groupSize > 2 && (
          <div style={{ marginBottom: 14, paddingBottom: 14, borderBottom: '1px solid rgba(203,243,110,0.12)', display: 'flex', flexDirection: 'column', gap: 4 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, color: 'var(--text-dim)' }}>
              <span>Base rate (1–2 people)</span><span>${PRIVATE_GUARANTEED_BASE}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, color: 'var(--text-dim)' }}>
              <span>{groupSize - 2} additional × ${GROUP_PER_PP}/person</span><span>${(groupSize - 2) * GROUP_PER_PP}</span>
            </div>
          </div>
        )}
        <div style={{ borderTop: '1px solid rgba(203,243,110,0.15)', paddingTop: 12, display: 'flex', flexDirection: 'column', gap: 6 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, color: 'var(--text-dim)' }}>
            <span>Service &amp; booking fee (6%)</span>
            <span>${Number(fee).toFixed(2)}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ fontFamily: 'var(--font-heading)', fontSize: 12, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--text-muted)' }}>Estimated Total</span>
            <span style={{ fontFamily: 'var(--font-heading)', fontSize: 20, fontWeight: 700, color: 'var(--accent)' }}>${Number(total).toFixed(2)}</span>
          </div>
        </div>
      </div>

      {/* Immediate charge notice */}
      <div style={{ padding: '12px 16px', background: 'var(--bg-section)', border: '1px solid var(--border)', borderRadius: 6, display: 'flex', gap: 10, alignItems: 'flex-start' }}>
        <span style={{ fontSize: 16, flexShrink: 0, marginTop: 1 }}>🔒</span>
        <p style={{ fontSize: 13, color: 'var(--text-dim)', lineHeight: 1.6, margin: 0 }}>
          <strong style={{ color: 'var(--text-muted)' }}>Charged immediately.</strong>{' '}
          Payment is collected securely via Stripe when you confirm your booking.
        </p>
      </div>
    </div>
  );
}

// ─── STEP 2: Calendar — matches BookingCalendar exactly ───────────────────────
const DOW    = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December'];

function CalendarStep({ selectedDate, availableDates, loading, onSelect }: {
  selectedDate: string | null; availableDates: Set<string>; loading: boolean; onSelect: (d: string) => void;
}) {
  const now = new Date();
  const [view, setView] = useState({ year: now.getFullYear(), month: now.getMonth() });
  const today = now.toISOString().split('T')[0];
  const pad = (n: number) => String(n).padStart(2, '0');
  const toStr = (y: number, m: number, d: number) => `${y}-${pad(m+1)}-${pad(d)}`;
  const firstDow    = new Date(view.year, view.month, 1).getDay();
  const daysInMonth = new Date(view.year, view.month + 1, 0).getDate();
  const cells: Array<string | null> = [...Array(firstDow).fill(null), ...Array.from({ length: daysInMonth }, (_, i) => toStr(view.year, view.month, i + 1))];
  while (cells.length % 7 !== 0) cells.push(null);
  const isCurrentMonth = view.year === now.getFullYear() && view.month === now.getMonth();

  return (
    <div>
      <p style={{ fontFamily: 'var(--font-alt)', fontSize: 11, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--accent)', marginBottom: 4 }}>Select a Date</p>
      <p style={{ fontFamily: 'var(--font-alt)', fontSize: 13, color: 'var(--text-muted)', lineHeight: 1.65, marginBottom: 20 }}>When would you like to visit?</p>

      {/* Month nav */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <button onClick={() => setView(v => v.month === 0 ? { year: v.year-1, month: 11 } : { ...v, month: v.month-1 })} disabled={isCurrentMonth}
          style={{ background: 'none', border: '1px solid var(--border)', borderRadius: 4, color: isCurrentMonth ? 'var(--text-dim)' : 'var(--text-muted)', width: 36, height: 36, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, cursor: isCurrentMonth ? 'not-allowed' : 'pointer', transition: 'border-color var(--ease)' }}
          onMouseEnter={e => { if (!isCurrentMonth) (e.currentTarget.style.borderColor = 'var(--border-accent)'); }}
          onMouseLeave={e => { (e.currentTarget.style.borderColor = 'var(--border)'); }}>‹</button>
        <span style={{ fontFamily: 'var(--font-heading)', fontSize: 16, fontWeight: 600, letterSpacing: '0.05em' }}>{MONTHS[view.month]} {view.year}</span>
        <button onClick={() => setView(v => v.month === 11 ? { year: v.year+1, month: 0 } : { ...v, month: v.month+1 })}
          style={{ background: 'none', border: '1px solid var(--border)', borderRadius: 4, color: 'var(--text-muted)', width: 36, height: 36, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, cursor: 'pointer', transition: 'border-color var(--ease)' }}
          onMouseEnter={e => { (e.currentTarget.style.borderColor = 'var(--border-accent)'); (e.currentTarget.style.color = 'var(--accent)'); }}
          onMouseLeave={e => { (e.currentTarget.style.borderColor = 'var(--border)'); (e.currentTarget.style.color = 'var(--text-muted)'); }}>›</button>
      </div>

      {/* DOW headers */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 4, marginBottom: 6 }}>
        {DOW.map(d => <div key={d} style={{ textAlign: 'center', fontFamily: 'var(--font-heading)', fontSize: 10, fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--text-dim)', padding: '4px 0' }}>{d}</div>)}
      </div>

      {/* Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 4 }}>
        {cells.map((date, i) => {
          if (!date) return <div key={i} />;
          const isAvail  = availableDates.has(date);
          const isPast   = date <= today;
          const isSel    = date === selectedDate;
          const disabled = !isAvail || isPast;
          const day      = parseInt(date.split('-')[2]);
          return (
            <button key={date} disabled={disabled} onClick={() => onSelect(date)} style={{ aspectRatio: '1', border: isSel ? '2px solid var(--accent)' : isAvail && !isPast ? '1px solid var(--border-accent)' : '1px solid transparent', borderRadius: 4, background: isSel ? 'var(--accent)' : isAvail && !isPast ? 'var(--accent-dim)' : 'transparent', color: isSel ? '#080c17' : isAvail && !isPast ? 'var(--accent)' : 'var(--text-dim)', fontFamily: 'var(--font-heading)', fontSize: 14, fontWeight: isSel ? 700 : 500, cursor: disabled ? 'not-allowed' : 'pointer', transition: 'background var(--ease), border-color var(--ease)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
              onMouseEnter={e => { if (!disabled && !isSel) e.currentTarget.style.background = 'rgba(203,243,110,0.2)'; }}
              onMouseLeave={e => { if (!disabled && !isSel) (e.currentTarget.style.background = isAvail ? 'var(--accent-dim)' : 'transparent'); }}
            >{day}</button>
          );
        })}
      </div>

      {loading && (
        <div style={{ textAlign: 'center', padding: '10px 0', fontSize: 12, color: 'var(--text-dim)', marginTop: 8 }}>
          <span style={{ display: 'inline-block', width: 12, height: 12, border: '2px solid var(--border)', borderTopColor: 'var(--accent)', borderRadius: '50%', animation: 'calSpin 0.7s linear infinite', marginRight: 8, verticalAlign: 'middle' }} />
          Loading available dates…
          <style>{`@keyframes calSpin { to { transform: rotate(360deg); } }`}</style>
        </div>
      )}
      {!loading && availableDates.size === 0 && (
        <p style={{ textAlign: 'center', fontSize: 13, color: 'var(--text-dim)', padding: '10px 0 0' }}>No available tour dates at this time.</p>
      )}

      {/* Legend */}
      <div style={{ display: 'flex', gap: 16, marginTop: 16, paddingTop: 14, borderTop: '1px solid var(--border)' }}>
        {[
          { color: 'var(--accent-dim)', border: 'var(--border-accent)', label: 'Available' },
          { color: 'var(--accent)',     border: 'var(--accent)',        label: 'Selected'  },
          { color: 'transparent',       border: 'transparent',          label: 'Unavailable', dim: true },
        ].map(l => (
          <div key={l.label} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <div style={{ width: 12, height: 12, borderRadius: 3, background: l.color, border: `1px solid ${l.border}`, flexShrink: 0 }} />
            <span style={{ fontSize: 11, color: l.dim ? 'var(--text-dim)' : 'var(--text-muted)', fontFamily: 'var(--font-alt)' }}>{l.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── STEP 2: Time Slot ────────────────────────────────────────────────────────
function TimeSlotStep({ date, slots, selectedSlot, setSelectedSlot }: {
  date: string; slots: Slot[]; selectedSlot: Slot | null; setSelectedSlot: (s: Slot) => void;
}) {
  return (
    <div>
      <p style={{ fontFamily: 'var(--font-alt)', fontSize: 11, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--accent)', marginBottom: 4 }}>{formatDate(date)}</p>
      <p style={{ fontFamily: 'var(--font-alt)', fontSize: 13, color: 'var(--text-muted)', lineHeight: 1.65, marginBottom: 8 }}>Choose a departure time — pricing options appear on the next step.</p>

      <p style={{ fontFamily: 'var(--font-heading)', fontSize: 11, fontWeight: 600, letterSpacing: '0.16em', textTransform: 'uppercase', color: 'var(--text-dim)', marginBottom: 12, marginTop: 20 }}>Available Times</p>

      {slots.length === 0 ? (
        <p style={{ fontSize: 14, color: 'var(--text-dim)', marginBottom: 28 }}>No available slots for this date.</p>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 20 }}>
          {slots.map(slot => {
            const sel        = selectedSlot?.id === slot.id;
            const almostFull = slot.spots_remaining <= 3 && slot.spots_remaining > 0;
            const hasOthers  = (slot.capacity - slot.spots_remaining) > 0;
            return (
              <button key={slot.id} onClick={() => setSelectedSlot(slot)}
                style={{ background: sel ? 'var(--accent-dim)' : 'var(--bg-section)', border: `${sel ? 2 : 1}px solid ${sel ? 'var(--accent)' : 'var(--border)'}`, borderRadius: 6, padding: '14px 16px', textAlign: 'left', cursor: 'pointer', transition: 'border-color var(--ease), background var(--ease)' }}
                onMouseEnter={e => { if (!sel) (e.currentTarget.style.borderColor = 'var(--border-accent)'); }}
                onMouseLeave={e => { if (!sel) (e.currentTarget.style.borderColor = 'var(--border)'); }}
              >
                <p style={{ fontFamily: 'var(--font-heading)', fontSize: 18, fontWeight: 600, color: sel ? 'var(--accent)' : 'var(--text)', marginBottom: 4, lineHeight: 1 }}>{formatTime(slot.start_time)}</p>
                <p style={{ fontSize: 12, color: almostFull ? '#f59e0b' : 'var(--text-dim)', marginBottom: hasOthers ? 4 : 0 }}>
                  {almostFull ? `Only ${slot.spots_remaining} spot${slot.spots_remaining !== 1 ? 's' : ''} left` : `${slot.spots_remaining} spot${slot.spots_remaining !== 1 ? 's' : ''} available`}
                </p>
                {hasOthers && (
                  <p style={{ fontSize: 11, color: sel ? 'rgba(203,243,110,0.6)' : 'var(--text-dim)', fontFamily: 'var(--font-heading)', fontWeight: 500, letterSpacing: '0.03em' }}>
                    others joining
                  </p>
                )}
              </button>
            );
          })}
        </div>
      )}

      {selectedSlot && (
        <div style={{ padding: '12px 16px', background: 'var(--accent-dim)', border: '1px solid var(--border-accent)', borderRadius: 6 }}>
          <span style={{ fontSize: 13, color: 'var(--text-muted)' }}>
            Selected: <strong style={{ color: 'var(--accent)' }}>{formatTime(selectedSlot.start_time)}</strong>
            {(selectedSlot.capacity - selectedSlot.spots_remaining) > 0 && (
              <span style={{ color: 'var(--text-dim)' }}> · others already in this slot</span>
            )}
          </span>
        </div>
      )}
    </div>
  );
}

// ─── STEP 4: Customer — matches CustomerForm exactly ─────────────────────────
function CustomerStep({ customer, setCustomer, onWaiverAgreed }: {
  customer: Customer; setCustomer: (c: Customer) => void; onWaiverAgreed: (ts: string) => void;
}) {
  const [waiverChecked,      setWaiverChecked]      = useState(false);
  const [hasMinors,          setHasMinors]          = useState(false);
  const [minorWaiverChecked, setMinorWaiverChecked] = useState(false);
  const [waiverTimestamp,    setWaiverTimestamp]    = useState<string | null>(null);
  const [modalOpen,          setModalOpen]          = useState(false);

  const pref          = customer.contact_preference ?? 'email';
  const smsSelected   = pref === 'sms' || pref === 'both';
  const phoneProvided = customer.phone.trim().length > 0;
  const phoneRequired = smsSelected && !phoneProvided;
  const emailValid    = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(customer.email);
  const formValid     = customer.name.trim().length > 0 && emailValid && !phoneRequired;
  const canContinue   = formValid && waiverChecked && (!hasMinors || minorWaiverChecked);

  function setField(field: keyof Customer, value: string) { setCustomer({ ...customer, [field]: value }); }
  function setPref(p: ContactPref) { setCustomer({ ...customer, contact_preference: p }); }

  function handleCheckbox(checked: boolean) {
    setWaiverChecked(checked);
    if (checked && !waiverTimestamp) setWaiverTimestamp(new Date().toISOString());
    if (!checked) setWaiverTimestamp(null);
  }

  function handleWaiverAgree() {
    const ts = new Date().toISOString();
    setWaiverChecked(true);
    setWaiverTimestamp(ts);
    setModalOpen(false);
  }

  function handleContinue() {
    if (!canContinue || !waiverTimestamp) return;
    onWaiverAgreed(waiverTimestamp);
  }

  const inputStyle: React.CSSProperties = { width: '100%', background: 'var(--bg-section)', border: '1px solid var(--border)', borderRadius: 4, padding: '12px 14px', fontFamily: 'var(--font-alt)', fontSize: 14, color: 'var(--text)', outline: 'none', transition: 'border-color .15s' };
  const labelStyle: React.CSSProperties = { fontFamily: 'var(--font-alt)', fontSize: 11, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--text-dim)', display: 'block', marginBottom: 6 };

  return (
    <>
      {modalOpen && <WaiverModal onAgree={handleWaiverAgree} onClose={() => setModalOpen(false)} />}

      <div>
        <p style={{ fontFamily: 'var(--font-alt)', fontSize: 11, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--accent)', marginBottom: 4 }}>Your Details</p>
        <p style={{ fontFamily: 'var(--font-alt)', fontSize: 13, color: 'var(--text-muted)', lineHeight: 1.65, marginBottom: 24 }}>Your confirmation and tour updates will be sent via your chosen channel.</p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 18, marginBottom: 28 }}>
          <div><label style={labelStyle}>Full Name *</label><input style={inputStyle} type="text" placeholder="Jane Smith" value={customer.name} onChange={e => setField('name', e.target.value)} onFocus={e => (e.target.style.borderColor = 'rgba(203,243,110,0.4)')} onBlur={e => (e.target.style.borderColor = 'rgba(255,255,255,0.07)')} /></div>
          <div><label style={labelStyle}>Email Address *</label><input style={inputStyle} type="email" placeholder="jane@example.com" value={customer.email} onChange={e => setField('email', e.target.value)} onFocus={e => (e.target.style.borderColor = 'rgba(203,243,110,0.4)')} onBlur={e => (e.target.style.borderColor = 'rgba(255,255,255,0.07)')} /></div>
          <div>
            <label style={labelStyle}>
              Phone{' '}
              <span style={{ color: smsSelected ? 'var(--accent)' : 'var(--text-dim)', textTransform: 'none', letterSpacing: 0, fontSize: 11, fontWeight: 400 }}>
                {smsSelected ? '* required for SMS' : '(optional)'}
              </span>
            </label>
            <input
              style={{ ...inputStyle, ...(phoneRequired ? { borderColor: 'rgba(245,158,11,0.6)' } : {}) }}
              type="tel" placeholder="+1 (555) 000-0000" value={customer.phone}
              onChange={e => setField('phone', e.target.value)}
              onFocus={e => (e.target.style.borderColor = 'rgba(203,243,110,0.4)')}
              onBlur={e => (e.target.style.borderColor = phoneRequired ? 'rgba(245,158,11,0.6)' : 'rgba(255,255,255,0.07)')}
            />
            {phoneRequired && <p style={{ fontSize: 12, color: 'rgba(245,158,11,0.85)', marginTop: 6 }}>Phone number is required for SMS confirmations.</p>}
          </div>
        </div>

        {/* ── Contact preference ── */}
        <div style={{ marginBottom: 24 }}>
          <p style={{ fontFamily: 'var(--font-alt)', fontSize: 11, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--text-dim)', marginBottom: 12 }}>
            How would you like to receive your confirmation and tour updates?
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {([
              { value: 'email' as ContactPref, label: 'Email',              sub: 'Confirmation and updates to your inbox' },
              { value: 'sms'   as ContactPref, label: 'Text message (SMS)', sub: 'Confirmation and day-of updates via text' },
              { value: 'both'  as ContactPref, label: 'Both',               sub: 'Email and text — most reliable' },
            ]).map(opt => {
              const active = pref === opt.value;
              return (
                <label key={opt.value} style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '12px 16px', borderRadius: 8, cursor: 'pointer', background: active ? 'rgba(203,243,110,0.06)' : 'var(--bg-section)', border: `1px solid ${active ? 'var(--border-accent)' : 'var(--border)'}`, transition: 'border-color 0.15s, background 0.15s' }}>
                  <span style={{ position: 'relative', flexShrink: 0 }}>
                    <input type="radio" name="contact_preference" value={opt.value} checked={active} onChange={() => setPref(opt.value)} style={{ position: 'absolute', opacity: 0, width: '100%', height: '100%', cursor: 'pointer' }} />
                    <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: 18, height: 18, borderRadius: '50%', border: `2px solid ${active ? 'var(--accent)' : 'var(--border)'}`, background: 'transparent', transition: 'border-color 0.15s' }}>
                      {active && <span style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--accent)', display: 'block' }} />}
                    </span>
                  </span>
                  <span>
                    <p style={{ fontFamily: 'var(--font-heading)', fontSize: 13, fontWeight: 600, color: active ? 'var(--accent)' : 'var(--text)', letterSpacing: '0.02em', marginBottom: 2 }}>{opt.label}</p>
                    <p style={{ fontSize: 11, color: 'var(--text-dim)', lineHeight: 1.4 }}>{opt.sub}</p>
                  </span>
                </label>
              );
            })}
          </div>
          <p style={{ fontSize: 11, color: 'var(--text-dim)', marginTop: 10, lineHeight: 1.6 }}>
            SMS opt-out: If you select text message (SMS) confirmation, standard message and data rates may apply. Reply <strong style={{ color: 'var(--text-muted)' }}>STOP</strong> to cancel at any time. Modern Explorer will not share your number with third parties.
          </p>
        </div>

        {/* Waiver */}
        <div style={{ padding: '20px 22px', background: 'var(--bg-section)', border: `1px solid ${waiverChecked ? 'var(--border-accent)' : 'var(--border)'}`, borderRadius: 8, marginBottom: 20, transition: 'border-color 0.2s' }}>
          <p style={{ fontFamily: 'var(--font-heading)', fontSize: 10, fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--text-dim)', marginBottom: 14 }}>Legal Agreement</p>
          <button type="button" onClick={() => setModalOpen(true)}
            style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 16px', marginBottom: 16, background: 'var(--accent-dim)', border: '1px solid var(--border-accent)', borderRadius: 5, color: 'var(--accent)', fontFamily: 'var(--font-heading)', fontSize: 12, fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', cursor: 'pointer', width: '100%', justifyContent: 'center', transition: 'background 0.15s' }}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = 'rgba(203,243,110,0.16)'; }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'var(--accent-dim)'; }}>
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><rect x="2" y="1" width="10" height="12" rx="1.5"/><path d="M4 4h6M4 7h6M4 10h4"/></svg>
            View Participant Agreement &amp; Liability Waiver
          </button>
          <label style={{ display: 'flex', gap: 12, alignItems: 'flex-start', cursor: 'pointer' }}>
            <span style={{ position: 'relative', flexShrink: 0, marginTop: 1 }}>
              <input type="checkbox" checked={waiverChecked} onChange={e => handleCheckbox(e.target.checked)} style={{ position: 'absolute', opacity: 0, width: '100%', height: '100%', cursor: 'pointer' }} />
              <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: 18, height: 18, borderRadius: 3, background: waiverChecked ? 'var(--accent)' : 'var(--bg-section)', border: `2px solid ${waiverChecked ? 'var(--accent)' : 'var(--border)'}`, transition: 'background 0.15s, border-color 0.15s' }}>
                {waiverChecked && <svg width="10" height="10" viewBox="0 0 10 10" fill="none"><path d="M1.5 5l2.5 2.5 4.5-4.5" stroke="#080c17" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>}
              </span>
            </span>
            <span style={{ fontSize: 13, color: 'var(--text-muted)', lineHeight: 1.6 }}>
              I have read and agree to the{' '}
              <button type="button" onClick={() => setModalOpen(true)} style={{ background: 'none', border: 'none', padding: 0, color: 'var(--accent)', fontSize: 13, cursor: 'pointer', textDecoration: 'underline', textUnderlineOffset: 2 }}>Participant Agreement &amp; Liability Waiver</button>
              , including the Release of Liability, Assumption of Risk, and all Terms of Participation.
            </span>
          </label>
        </div>

        {/* Minor participants */}
        <label style={{ display: 'flex', gap: 12, alignItems: 'flex-start', cursor: 'pointer', marginBottom: hasMinors ? 12 : 20 }}>
          <span style={{ position: 'relative', flexShrink: 0, marginTop: 2 }}>
            <input type="checkbox" checked={hasMinors} onChange={e => setHasMinors(e.target.checked)} style={{ position: 'absolute', opacity: 0, width: '100%', height: '100%', cursor: 'pointer' }} />
            <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: 18, height: 18, borderRadius: 3, background: hasMinors ? 'var(--accent)' : 'var(--bg-section)', border: `2px solid ${hasMinors ? 'var(--accent)' : 'var(--border)'}`, transition: 'background 0.15s, border-color 0.15s' }}>
              {hasMinors && <svg width="10" height="10" viewBox="0 0 10 10" fill="none"><path d="M1.5 5l2.5 2.5 4.5-4.5" stroke="#080c17" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>}
            </span>
          </span>
          <span style={{ fontSize: 13, color: 'var(--text-muted)', lineHeight: 1.6 }}>My group includes participants under 18 years old.</span>
        </label>
        {hasMinors && (
          <>
            <div style={{ padding: '14px 18px', marginBottom: 12, background: 'rgba(245,158,11,0.06)', border: '1px solid rgba(245,158,11,0.28)', borderLeft: '3px solid rgba(245,158,11,0.6)', borderRadius: 5 }}>
              <p style={{ fontSize: 13, color: 'rgba(245,158,11,0.9)', lineHeight: 1.7 }}>A parent or legal guardian must sign the waiver for all minors. Separate waiver forms will be sent after booking.</p>
            </div>
            <label style={{ display: 'flex', gap: 12, alignItems: 'flex-start', cursor: 'pointer', marginBottom: 20 }}>
              <span style={{ position: 'relative', flexShrink: 0, marginTop: 2 }}>
                <input type="checkbox" checked={minorWaiverChecked} onChange={e => setMinorWaiverChecked(e.target.checked)} style={{ position: 'absolute', opacity: 0, width: '100%', height: '100%', cursor: 'pointer' }} />
                <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: 18, height: 18, borderRadius: 3, background: minorWaiverChecked ? 'var(--accent)' : 'var(--bg-section)', border: `2px solid ${minorWaiverChecked ? 'var(--accent)' : 'var(--border)'}`, transition: 'background 0.15s, border-color 0.15s' }}>
                  {minorWaiverChecked && <svg width="10" height="10" viewBox="0 0 10 10" fill="none"><path d="M1.5 5l2.5 2.5 4.5-4.5" stroke="#080c17" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>}
                </span>
              </span>
              <span style={{ fontSize: 13, color: 'var(--text-muted)', lineHeight: 1.6 }}>I confirm that a parent or legal guardian will complete a separate minor participant waiver for all participants under 18 before the tour.</span>
            </label>
          </>
        )}

        <div style={{ padding: '12px 16px', background: 'var(--bg-section)', border: '1px solid var(--border)', borderRadius: 6, marginBottom: 20 }}>
          <p style={{ fontSize: 12, color: 'var(--text-dim)', lineHeight: 1.6 }}>We'll send your confirmation code, meeting point coordinates, and pre-tour info via your chosen channel. No spam — ever.</p>
        </div>

        <button className="btn btn-primary" disabled={!canContinue} onClick={handleContinue} style={{ width: '100%', justifyContent: 'center', opacity: canContinue ? 1 : 0.45 }}>
          Continue →
        </button>
        {!canContinue && formValid && !waiverChecked && <p style={{ fontSize: 12, color: 'rgba(245,158,11,0.7)', marginTop: 10, textAlign: 'center' }}>Please read and agree to the waiver to continue.</p>}
        {phoneRequired && <p style={{ fontSize: 12, color: 'rgba(245,158,11,0.7)', marginTop: 10, textAlign: 'center' }}>Add a phone number above to use SMS confirmations.</p>}
      </div>
    </>
  );
}

// ─── STEP 5: Review & Pay ─────────────────────────────────────────────────────
function ReviewStep({ slot, groupSize, tourType, customer, waiverAgreedAt, onConfirmed, onBack }: {
  slot: Slot; groupSize: number; tourType: TourType; customer: Customer;
  waiverAgreedAt: string; onConfirmed: (r: BookingResult) => void; onBack: () => void;
}) {
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [loading,      setLoading]      = useState(true);
  const [intentError,  setIntentError]  = useState<string | null>(null);
  const [intentKey,    setIntentKey]    = useState(0);

  const [promoInput,   setPromoInput]   = useState('');
  const [appliedPromo, setAppliedPromo] = useState<{ code: string; discount_cents: number; final_amount_cents: number } | null>(null);
  const [promoMsg,     setPromoMsg]     = useState<{ type: 'ok' | 'err'; text: string } | null>(null);
  const [promoLoading, setPromoLoading] = useState(false);

  const isPrivateBooking = tourType === 'private-guaranteed';
  const { subtotal, fee: serviceFee, total } = calcAmounts(groupSize, tourType, slot);
  const displayTotal = appliedPromo ? appliedPromo.final_amount_cents / 100 : total;

  const missingKey = !((import.meta as any).env?.VITE_STRIPE_PUBLISHABLE_KEY)
    || ((import.meta as any).env?.VITE_STRIPE_PUBLISHABLE_KEY ?? '').includes('YOUR_KEY');

  async function fetchIntent(promoCode?: string) {
    setLoading(true); setClientSecret(null); setIntentError(null);
    try {
      const r = await fetch(`${API_URL}/payments/intent`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tenant_slug: 'modern-explorer', availability_id: slot.id, group_size: groupSize, is_private: isPrivateBooking, ...(promoCode ? { promo_code: promoCode } : {}) }),
      });
      const d = await r.json() as Record<string, unknown>;
      if (!r.ok) throw new Error((d.error as string) ?? 'Failed to initialise');
      setClientSecret(d.client_secret as string);
      setIntentKey(k => k + 1);
    } catch (err) {
      setIntentError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchIntent();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function applyPromo() {
    if (!promoInput.trim()) return;
    setPromoLoading(true); setPromoMsg(null);
    try {
      const totalCents = Math.round(total * 100);
      const resp = await fetch(`${API_URL}/promo/validate`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: promoInput.trim(), tenant_slug: 'modern-explorer', amount_cents: totalCents }),
      });
      const data = await resp.json() as { valid: boolean; message?: string; discount_cents?: number; final_amount_cents?: number };
      if (!resp.ok || !data.valid) {
        setPromoMsg({ type: 'err', text: data.message ?? 'Invalid promo code.' });
        return;
      }
      setAppliedPromo({ code: promoInput.trim().toUpperCase(), discount_cents: data.discount_cents!, final_amount_cents: data.final_amount_cents! });
      setPromoMsg({ type: 'ok', text: data.message ?? 'Promo code applied!' });
      await fetchIntent(promoInput.trim());
    } catch (err) {
      setPromoMsg({ type: 'err', text: err instanceof Error ? err.message : 'Could not apply promo code.' });
      setAppliedPromo(null);
    } finally {
      setPromoLoading(false);
    }
  }

  function removePromo() {
    setAppliedPromo(null); setPromoInput(''); setPromoMsg(null);
    void fetchIntent();
  }

  return (
    <div>
      <p style={{ fontFamily: 'var(--font-alt)', fontSize: 11, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--accent)', marginBottom: 4 }}>Final Step</p>
      <p style={{ fontFamily: 'var(--font-alt)', fontSize: 13, color: 'var(--text-muted)', lineHeight: 1.65, marginBottom: 24 }}>
        Your card will be charged immediately when you confirm your booking.
      </p>

      {/* Order summary */}
      <div style={{ background: 'var(--bg-section)', border: '1px solid var(--border)', borderRadius: 8, overflow: 'hidden', marginBottom: 16 }}>
        <div style={{ padding: '10px 20px', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--accent)', display: 'inline-block', flexShrink: 0 }} />
          <span style={{ fontFamily: 'var(--font-heading)', fontSize: 10, fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--text-muted)' }}>Booking Summary</span>
        </div>
        <div style={{ padding: '4px 20px 0' }}>
          {[
            slot.tour_name,
            `${formatDate(slot.date)} · ${formatTime(slot.start_time)}`,
            tourType === 'join-group'
              ? `Join a Group · ${groupSize} ${groupSize === 1 ? 'person' : 'people'} × $${Number(slot.price_per_person ?? GROUP_PER_PP)}/person`
              : tourType === 'group'
                ? `Group Tour · ${groupSize <= 2 ? `$${GROUP_MIN} minimum` : `${groupSize} people × $${Number(slot.price_per_person ?? GROUP_PER_PP)}/person`}`
                : `Private Guaranteed · $${PRIVATE_GUARANTEED_BASE}${groupSize > 2 ? ` + ${groupSize - 2} × $${GROUP_PER_PP}` : ' for 1–2 people'}`,
          ].map((label, i) => (
            <div key={i} style={{ padding: '8px 0', borderBottom: '1px solid var(--border)' }}>
              <span style={{ fontSize: 13, color: i === 2 ? 'var(--text)' : 'var(--text-muted)', fontWeight: i === 2 ? 500 : 400 }}>{label}</span>
            </div>
          ))}
          <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid var(--border)' }}>
            <span style={{ fontSize: 13, color: 'var(--text-muted)' }}>Tour subtotal</span>
            <span style={{ fontSize: 13, color: 'var(--text-muted)' }}>${Number(subtotal).toFixed(2)}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 0', borderBottom: '1px solid var(--border)' }}>
            <span style={{ display: 'flex', alignItems: 'center', fontSize: 13, color: 'var(--text-dim)' }}>
              Service &amp; booking fee (6%)<InfoTooltip text="This fee covers secure payment processing and booking platform costs. It is not retained by Modern Explorer." />
            </span>
            <span style={{ fontSize: 13, color: 'var(--text-dim)' }}>${Number(serviceFee).toFixed(2)}</span>
          </div>
          {appliedPromo && (
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 0', borderBottom: '1px solid var(--border)' }}>
              <span style={{ fontSize: 13, color: 'var(--accent)' }}>Promo: {appliedPromo.code}</span>
              <span style={{ fontSize: 13, color: 'var(--accent)' }}>–${(appliedPromo.discount_cents / 100).toFixed(2)}</span>
            </div>
          )}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 0 10px' }}>
            <div>
              <span style={{ fontFamily: 'var(--font-heading)', fontSize: 11, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--text-muted)', display: 'block', marginBottom: 3 }}>Total</span>
              <span style={{ fontSize: 11, color: 'var(--text-dim)' }}>Charged immediately</span>
            </div>
            <div style={{ textAlign: 'right' }}>
              {appliedPromo && (
                <span style={{ fontSize: 13, color: 'var(--text-dim)', textDecoration: 'line-through', display: 'block', marginBottom: 2 }}>${Number(total).toFixed(2)}</span>
              )}
              <span style={{ fontFamily: 'var(--font-heading)', fontSize: 26, fontWeight: 700, color: 'var(--accent)' }}>${Number(displayTotal).toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Promo code */}
      <div style={{ marginBottom: 16 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
          <span style={{ fontFamily: 'var(--font-heading)', fontSize: 11, fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--text-dim)' }}>Promo Code</span>
          {appliedPromo && (
            <button onClick={removePromo} style={{ fontSize: 11, background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-dim)', fontFamily: 'var(--font-heading)', letterSpacing: '0.06em', textDecoration: 'underline' }}>
              Remove
            </button>
          )}
        </div>
        {!appliedPromo ? (
          <div style={{ display: 'flex', gap: 8 }}>
            <input
              value={promoInput}
              onChange={e => { setPromoInput(e.target.value.toUpperCase()); setPromoMsg(null); }}
              onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); void applyPromo(); } }}
              placeholder="Enter code"
              style={{
                flex: 1, background: 'var(--bg-section)', border: '1px solid var(--border)', borderRadius: 6,
                color: 'var(--text)', padding: '10px 12px', fontSize: 13,
                fontFamily: "'Courier New', monospace", letterSpacing: '0.08em', outline: 'none',
              }}
              onFocus={e => { (e.currentTarget as HTMLElement).style.borderColor = 'rgba(203,243,110,0.32)'; }}
              onBlur={e => { (e.currentTarget as HTMLElement).style.borderColor = 'var(--border)'; }}
            />
            <button
              onClick={() => void applyPromo()}
              disabled={!promoInput.trim() || promoLoading}
              style={{
                padding: '10px 16px', borderRadius: 6, border: '1px solid rgba(203,243,110,0.3)',
                background: 'rgba(203,243,110,0.08)', color: 'var(--accent)',
                fontSize: 12, fontFamily: 'var(--font-heading)', fontWeight: 700, letterSpacing: '0.1em',
                cursor: promoInput.trim() && !promoLoading ? 'pointer' : 'not-allowed',
                opacity: promoInput.trim() ? 1 : 0.5, transition: 'opacity 0.15s',
              }}
            >
              {promoLoading ? '…' : 'Apply'}
            </button>
          </div>
        ) : (
          <div style={{ padding: '10px 14px', borderRadius: 6, background: 'rgba(203,243,110,0.08)', border: '1px solid rgba(203,243,110,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: 13, color: 'var(--accent)', fontFamily: "'Courier New', monospace", letterSpacing: '0.06em' }}>{appliedPromo.code}</span>
            <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--accent)' }}>–${(appliedPromo.discount_cents / 100).toFixed(2)}</span>
          </div>
        )}
        {promoMsg && (
          <p style={{ fontSize: 12, marginTop: 6, color: promoMsg.type === 'ok' ? 'var(--accent)' : '#ef4444', lineHeight: 1.4 }}>
            {promoMsg.text}
          </p>
        )}
      </div>

      {/* Immediate charge notice */}
      <div style={{ padding: '12px 16px', marginBottom: 20, background: 'rgba(203,243,110,0.06)', border: '1px solid rgba(203,243,110,0.2)', borderRadius: 6, display: 'flex', gap: 10, alignItems: 'flex-start' }}>
        <span style={{ fontSize: 16, flexShrink: 0, marginTop: 1 }}>🔒</span>
        <p style={{ fontSize: 13, color: 'var(--text-muted)', lineHeight: 1.6, margin: 0 }}>
          <strong style={{ color: 'var(--accent)' }}>Charged immediately.</strong>{' '}
          Your payment is processed securely via Stripe when you confirm your booking.
        </p>
      </div>

      {/* Stripe card form */}
      <div style={{ background: 'var(--bg-section)', border: '1px solid var(--border)', borderRadius: 8, padding: '24px', marginBottom: 4 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 20 }}>
          <svg width="20" height="14" viewBox="0 0 20 14" fill="none"><rect width="20" height="14" rx="2" fill="#1a1f36"/><rect x="2" y="9" width="4" height="2" rx="0.5" fill="#cbf36e" opacity="0.7"/><rect x="7" y="9" width="2" height="2" rx="0.5" fill="#cbf36e" opacity="0.4"/></svg>
          <span style={{ fontFamily: 'var(--font-heading)', fontSize: 11, fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--text-dim)' }}>Pay Securely · Stripe</span>
        </div>

        {missingKey && (
          <div style={{ padding: '14px 16px', background: 'rgba(245,158,11,0.08)', border: '1px solid rgba(245,158,11,0.3)', borderRadius: 6, marginBottom: 16 }}>
            <p style={{ fontSize: 13, color: '#f59e0b', lineHeight: 1.6 }}><strong>Stripe key not configured.</strong> Add <code style={{ fontSize: 12, background: 'rgba(0,0,0,0.3)', padding: '1px 4px', borderRadius: 3 }}>VITE_STRIPE_PUBLISHABLE_KEY</code> to <code style={{ fontSize: 12, background: 'rgba(0,0,0,0.3)', padding: '1px 4px', borderRadius: 3 }}>.env.local</code>.</p>
          </div>
        )}
        {intentError && (
          <div style={{ padding: '14px 16px', background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: 6, marginBottom: 16 }}>
            <p style={{ fontSize: 13, color: '#ef4444', lineHeight: 1.6 }}><strong>Could not reach payment backend.</strong> Please try again or contact support if the problem persists.</p>
          </div>
        )}
        {loading && !intentError && (
          <div style={{ padding: '28px 0', textAlign: 'center' }}>
            <div style={{ width: 24, height: 24, margin: '0 auto 10px', border: '2px solid var(--border)', borderTopColor: 'var(--accent)', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
            <p style={{ fontSize: 13, color: 'var(--text-dim)' }}>Setting up payment…</p>
          </div>
        )}
        {!loading && clientSecret && !missingKey && (
          <Elements key={intentKey} stripe={stripePromise} options={{ clientSecret, appearance: STRIPE_APPEARANCE, fonts: [{ cssSrc: 'https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600&display=swap' }] }}>
            <StripeForm estimatedTotal={displayTotal} promoCode={appliedPromo?.code ?? null} slot={slot} groupSize={groupSize} tourType={tourType} customer={customer} waiverAgreedAt={waiverAgreedAt} onConfirmed={onConfirmed} onBack={onBack} />
          </Elements>
        )}
        {!loading && !clientSecret && !intentError && !missingKey && (
          <button className="btn btn-ghost" onClick={onBack}>← Back</button>
        )}
      </div>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}

// ─── Stripe form ──────────────────────────────────────────────────────────────
function StripeForm({ estimatedTotal, promoCode, slot, groupSize, tourType, customer, waiverAgreedAt, onConfirmed, onBack }: {
  estimatedTotal: number; promoCode: string | null; slot: Slot; groupSize: number; tourType: TourType;
  customer: Customer; waiverAgreedAt: string; onConfirmed: (r: BookingResult) => void; onBack: () => void;
}) {
  const stripe   = useStripe();
  const elements = useElements();
  const [processing,  setProcessing]  = useState(false);
  const [stripeError, setStripeError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!stripe || !elements) return;
    setProcessing(true);
    setStripeError(null);

    const { error, paymentIntent } = await stripe.confirmPayment({ elements, confirmParams: {}, redirect: 'if_required' });

    if (error) { setStripeError(error.message ?? 'Could not process payment. Please try again.'); setProcessing(false); return; }
    if (!paymentIntent || paymentIntent.status !== 'succeeded' && paymentIntent.status !== 'requires_capture' && paymentIntent.status !== 'processing') { setStripeError('Payment was not completed. Please try again.'); setProcessing(false); return; }

    try {
      const res = await fetch(`${API_URL}/bookings`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ payment_intent_id: paymentIntent.id, payment_method_id: paymentIntent.payment_method, availability_id: slot.id, group_size: groupSize, is_private: tourType === 'private-guaranteed', tenant_slug: 'modern-explorer', customer, contact_preference: customer.contact_preference ?? 'email', waiver_agreed_at: waiverAgreedAt || undefined, ...(promoCode ? { promo_code: promoCode } : {}) }),
      });
      const data = await res.json() as Record<string, unknown>;
      if (!res.ok) throw new Error((data.error as string) ?? 'Booking failed');
      onConfirmed(data as unknown as BookingResult);
    } catch {
      const { subtotal: fallbackSub } = calcAmounts(groupSize, tourType, slot);
      onConfirmed({
        confirmation_code: `MEX-${Math.random().toString(36).slice(2, 8).toUpperCase()}`,
        tour_name: slot.tour_name, date: slot.date, start_time: slot.start_time,
        group_size: groupSize, is_private: tourType === 'private-guaranteed', tour_type: tourType,
        subtotal: fallbackSub,
        service_fee: Math.round(estimatedTotal * SERVICE_RATE * 100) / 100,
        total_amount: estimatedTotal, customer_name: customer.name,
      });
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <div style={{ marginBottom: 20 }}><PaymentElement options={{ layout: 'tabs' }} /></div>
      {stripeError && <div style={{ padding: '12px 16px', marginBottom: 16, background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: 6, fontSize: 13, color: '#ef4444', lineHeight: 1.5 }}>{stripeError}</div>}
      <div style={{ display: 'flex', gap: 12 }}>
        <button type="button" className="btn btn-ghost" onClick={onBack} disabled={processing} style={{ flex: '0 0 auto' }}>← Back</button>
        <button type="submit" className="btn btn-primary" disabled={!stripe || !elements || processing} style={{ flex: 1, justifyContent: 'center' }}>
          {processing
            ? <><span style={{ width: 16, height: 16, border: '2px solid rgba(8,12,23,0.3)', borderTopColor: '#080c17', borderRadius: '50%', animation: 'spin 0.7s linear infinite', display: 'inline-block', flexShrink: 0, marginRight: 8 }} />Processing…</>
            : 'Confirm & Pay Now'}
        </button>
      </div>
    </form>
  );
}

// ─── Confirmation — matches Confirmation.tsx exactly ─────────────────────────
function ConfirmationScreen({ booking, onReset }: { booking: BookingResult; onReset: () => void }) {
  return (
    <div style={{ textAlign: 'center', paddingTop: 8 }}>
      <div style={{ width: 72, height: 72, borderRadius: '50%', background: 'var(--accent-dim)', border: '2px solid var(--border-accent)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
        <svg width="32" height="32" viewBox="0 0 32 32" fill="none"><path d="M6 16l8 8 12-12" stroke="#cbf36e" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/></svg>
      </div>
      <p style={{ fontFamily: 'var(--font-alt)', fontSize: 10, fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--accent)', marginBottom: 8 }}>Booking Confirmed</p>
      <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: 24, fontWeight: 600, marginBottom: 10 }}>You're on the expedition.</h3>
      <p style={{ color: 'var(--text-muted)', fontSize: 14, lineHeight: 1.65, maxWidth: 340, margin: '0 auto 24px' }}>
        A confirmation email has been sent to <strong style={{ color: 'var(--text)' }}>{booking.customer_name.split(' ')[0]}</strong>. Keep your code handy.
      </p>

      {/* Confirmation code */}
      <div style={{ background: 'var(--bg-section)', border: '1px solid var(--border-accent)', borderRadius: 8, padding: '20px', marginBottom: 16 }}>
        <p style={{ fontFamily: 'var(--font-heading)', fontSize: 11, fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--text-dim)', marginBottom: 8 }}>Confirmation Code</p>
        <p style={{ fontFamily: "'Courier New', Courier, monospace", fontSize: 28, fontWeight: 700, color: 'var(--accent)', letterSpacing: '0.12em' }}>{booking.confirmation_code}</p>
      </div>

      {/* Payment confirmed banner */}
      <div style={{ padding: '14px 18px', marginBottom: 16, background: 'rgba(203,243,110,0.07)', border: '1px solid rgba(203,243,110,0.25)', borderRadius: 8, display: 'flex', gap: 12, alignItems: 'flex-start', textAlign: 'left' }}>
        <span style={{ fontSize: 20, flexShrink: 0 }}>🔒</span>
        <div>
          <p style={{ fontFamily: 'var(--font-heading)', fontSize: 11, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--accent)', marginBottom: 5 }}>Payment confirmed</p>
          <p style={{ fontSize: 13, color: 'var(--text-muted)', lineHeight: 1.6, margin: 0 }}>
            <strong style={{ color: 'var(--text)' }}>${Number(booking.total_amount).toFixed(2)}</strong>{' '}
            was charged securely via Stripe.
          </p>
        </div>
      </div>

      {/* Tour details */}
      <div style={{ background: 'var(--bg-section)', border: '1px solid var(--border)', borderRadius: 8, overflow: 'hidden', marginBottom: 20, textAlign: 'left' }}>
        {[
          ['Tour',  booking.tour_name],
          ['Date',  formatDate(booking.date)],
          ['Time',  formatTime(booking.start_time)],
          ['Type',
            booking.tour_type === 'join-group'
              ? `Join a Group · ${booking.group_size} ${booking.group_size === 1 ? 'person' : 'people'} · $${GROUP_PER_PP}/pp`
              : booking.tour_type === 'group'
                ? `Group Tour · ${booking.group_size} ${booking.group_size === 1 ? 'person' : 'people'} · $${(Number(booking.subtotal) / booking.group_size).toFixed(0)}/pp`
                : `Private Guaranteed · $${Number(booking.subtotal).toFixed(0)} flat`
          ],
          ['Subtotal', `$${Number(booking.subtotal).toFixed(2)}`],
          ['Service Fee', `$${Number(booking.service_fee).toFixed(2)}`],
        ].map(([label, value], i) => (
          <div key={label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', padding: '10px 18px', background: i % 2 !== 0 ? 'rgba(255,255,255,0.02)' : 'transparent', borderBottom: '1px solid var(--border)' }}>
            <span style={{ fontFamily: 'var(--font-heading)', fontSize: 10, fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--text-dim)' }}>{label}</span>
            <span style={{ fontFamily: 'var(--font-alt)', fontSize: 13, color: 'var(--text-muted)' }}>{value}</span>
          </div>
        ))}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 18px' }}>
          <div>
            <span style={{ fontFamily: 'var(--font-heading)', fontSize: 11, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--text-muted)', display: 'block', marginBottom: 2 }}>Total Charged</span>
            <span style={{ fontSize: 11, color: 'var(--text-dim)' }}>Charged today</span>
          </div>
          <span style={{ fontFamily: 'var(--font-heading)', fontSize: 20, fontWeight: 700, color: 'var(--accent)' }}>${Number(booking.total_amount).toFixed(2)}</span>
        </div>
      </div>

      {/* What to bring */}
      <div style={{ background: 'var(--accent-dim)', border: '1px solid var(--border-accent)', borderRadius: 6, padding: '16px 20px', marginBottom: 24, textAlign: 'left' }}>
        <p style={{ fontFamily: 'var(--font-heading)', fontSize: 11, fontWeight: 700, letterSpacing: '0.16em', textTransform: 'uppercase', color: 'var(--accent)', marginBottom: 8 }}>What to bring</p>
        <p style={{ fontSize: 13, color: 'var(--text-muted)', lineHeight: 1.65 }}>Comfortable closed-toe shoes · Water (16–32 oz) · Light jacket · Sunscreen · Your curiosity. Exact meeting point and parking info are in your confirmation email.</p>
      </div>

      <button className="btn btn-ghost" onClick={onReset} style={{ width: '100%', justifyContent: 'center' }}>Book Another Tour</button>
    </div>
  );
}

// ─── Main BookingDrawer ───────────────────────────────────────────────────────
export default function BookingDrawer() {
  const { isOpen, close } = useBooking();

  const [step,            setStep]            = useState<DrawerStep>('calendar');
  const [tourType,        setTourType]        = useState<TourType | null>(null);
  const [showTourRequest, setShowTourRequest] = useState(false);
  const [groupSize,       setGroupSize]       = useState(1);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<Slot | null>(null);
  const [customer,       setCustomer]       = useState<Customer>({ name: '', email: '', phone: '' });
  const [waiverAgreedAt, setWaiverAgreedAt] = useState<string | null>(null);
  const [booking,        setBooking]        = useState<BookingResult | null>(null);
  const [apiSlots,       setApiSlots]       = useState<Slot[]>([]);
  const [slotsLoading,   setSlotsLoading]   = useState(true);

  const availableDates = useMemo(() => new Set(apiSlots.map(s => s.date)), [apiSlots]);
  const slotsForDate   = useCallback((date: string) => apiSlots.filter(s => s.date === date), [apiSlots]);

  // Fetch availability on open
  useEffect(() => {
    if (!isOpen) return;
    const from = new Date().toISOString().split('T')[0];
    setSlotsLoading(true);
    fetch(`${API_URL}/availability?tenant=modern-explorer&tour=crestone-walking-tour&from=${from}`)
      .then(r => r.json())
      .then((data: { slots?: Slot[] }) => {
        const normalized = (data.slots ?? []).map(s => ({ ...s, date: String(s.date).slice(0, 10), start_time: String(s.start_time).slice(0, 5) }));
        setApiSlots(normalized);
      })
      .catch(() => {})
      .finally(() => setSlotsLoading(false));
  }, [isOpen]);

  // Body scroll lock
  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  // ESC to close
  useEffect(() => {
    if (!isOpen) return;
    const h = (e: KeyboardEvent) => { if (e.key === 'Escape') close(); };
    window.addEventListener('keydown', h);
    return () => window.removeEventListener('keydown', h);
  }, [isOpen, close]);

  // Reset after close animation
  useEffect(() => {
    if (!isOpen) {
      const t = setTimeout(() => {
        setStep('calendar'); setTourType(null); setShowTourRequest(false); setGroupSize(1); setSelectedDate(null); setSelectedSlot(null);
        setCustomer({ name: '', email: '', phone: '' }); setWaiverAgreedAt(null); setBooking(null);
      }, 380);
      return () => clearTimeout(t);
    }
  }, [isOpen]);

  function reset() {
    setStep('calendar'); setTourType(null); setShowTourRequest(false); setGroupSize(1); setSelectedDate(null); setSelectedSlot(null);
    setCustomer({ name: '', email: '', phone: '' }); setWaiverAgreedAt(null); setBooking(null);
  }

  function handleTourTypeSelect(t: TourType) {
    setTourType(t);
  }

  // Pricing for sticky footer
  const { total } = tourType ? calcAmounts(groupSize, tourType, selectedSlot) : { total: 0 };

  // Footer label for current type/size
  const footerPriceLabel = !tourType
    ? 'Select pricing after choosing a time'
    : tourType === 'join-group'
      ? `${groupSize} × $${GROUP_PER_PP}/pp + 6% fee`
      : tourType === 'group'
        ? groupSize <= 2
          ? `$${GROUP_MIN} minimum + 6% fee`
          : `${groupSize} × $${GROUP_PER_PP}/pp + 6% fee`
        : `Private · $${PRIVATE_GUARANTEED_BASE}${groupSize > 2 ? ` + ${groupSize - 2}×$${GROUP_PER_PP}` : ''} + 6% fee`;

  // Footer nav config per step
  type FooterCfg = { back?: () => void; next?: () => void; nextLabel?: string; nextDisabled?: boolean };
  const footerConfig: Record<DrawerStep, FooterCfg> = {
    'calendar':   {},
    'slot':       { back: () => setStep('calendar'), next: () => selectedSlot && setStep('tour-type'), nextLabel: 'Continue →', nextDisabled: !selectedSlot },
    'tour-type':  { back: () => setStep('slot'), next: () => tourType && setStep('group-size'), nextLabel: 'Continue →', nextDisabled: !tourType },
    'group-size': { back: () => setStep('tour-type'), next: () => setStep('customer'), nextLabel: 'Continue →' },
    'customer':   { back: () => setStep('group-size') },
    'review':     { back: () => setStep('customer') },
    'confirmation': {},
  };

  const fc = footerConfig[step];

  return (
    <>
      <style>{`
        @keyframes bk-overlay-in { from { opacity: 0 } to { opacity: 1 } }
        @keyframes bk-drawer-in  { from { transform: translateX(100%) } to { transform: translateX(0) } }
        .bk-overlay { animation: bk-overlay-in .28s ease forwards; }
        .bk-drawer  { animation: bk-drawer-in .35s cubic-bezier(.4,0,.2,1) forwards; }
        @media (max-width: 767px) { .bk-drawer { width: 100% !important; } }
      `}</style>

      {/* Overlay */}
      {isOpen && (
        <div className="bk-overlay" onClick={close}
          style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.65)', zIndex: 9998, backdropFilter: 'blur(2px)' }} />
      )}

      {/* Drawer */}
      {isOpen && (
        <div className="bk-drawer" style={{ position: 'fixed', top: 0, right: 0, bottom: 0, width: '40%', minWidth: 380, maxWidth: 600, background: 'var(--bg)', zIndex: 9999, display: 'flex', flexDirection: 'column', boxShadow: '-8px 0 48px rgba(0,0,0,0.5)' }}>

          {/* ── Fixed header: photo + tour info + close ── */}
          <div style={{ position: 'relative', flexShrink: 0 }}>
            <div style={{ height: 156, overflow: 'hidden' }}>
              <img src={TOUR_PHOTO} alt={TOUR_NAME} style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center 60%' }} />
              <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, var(--bg) 0%, rgba(11,15,28,0.55) 60%, rgba(11,15,28,0.25) 100%)' }} />
            </div>
            <button onClick={close} aria-label="Close booking"
              style={{ position: 'absolute', top: 14, right: 14, width: 36, height: 36, borderRadius: '50%', background: 'rgba(0,0,0,0.55)', border: '1px solid rgba(255,255,255,0.2)', color: '#fff', fontSize: 18, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', transition: 'background .15s' }}>✕</button>
            <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '10px 20px 14px' }}>
              <p style={{ fontFamily: 'var(--font-heading)', fontSize: 10, fontWeight: 700, letterSpacing: '0.22em', textTransform: 'uppercase', color: 'var(--accent)', marginBottom: 3 }}>Modern Explorer</p>
              <p style={{ fontFamily: 'var(--font-heading)', fontSize: 18, fontWeight: 600, color: 'var(--text)', letterSpacing: '0.02em', lineHeight: 1.1, marginBottom: 2 }}>{TOUR_NAME}</p>
              <p style={{ fontFamily: 'var(--font-alt)', fontSize: 11, color: 'var(--text-dim)', lineHeight: 1.4 }}>{TOUR_DESC}</p>
            </div>
          </div>

          {/* Step bar (hidden on confirmation and tour request form) */}
          {step !== 'confirmation' && !showTourRequest && <StepBar step={step} />}

          {/* ── Scrollable content ── */}
          <div style={{ flex: 1, overflowY: 'auto', padding: '24px 20px 8px' }}>
            {showTourRequest && (
              <TourRequestForm onBack={() => setShowTourRequest(false)} />
            )}
            {step === 'calendar' && (
              <CalendarStep
                selectedDate={selectedDate}
                availableDates={availableDates}
                loading={slotsLoading}
                onSelect={date => { setSelectedDate(date); setSelectedSlot(null); setStep('slot'); }}
              />
            )}
            {step === 'slot' && selectedDate && (
              <TimeSlotStep
                date={selectedDate}
                slots={slotsForDate(selectedDate)}
                selectedSlot={selectedSlot}
                setSelectedSlot={setSelectedSlot}
              />
            )}
            {!showTourRequest && step === 'tour-type' && (
              <TourTypeStep selectedType={tourType} onSelect={handleTourTypeSelect} onRequestTour={() => setShowTourRequest(true)} slot={selectedSlot} />
            )}
            {step === 'group-size' && tourType && (
              <GroupSizeStep groupSize={groupSize} setGroupSize={setGroupSize} tourType={tourType} />
            )}
            {step === 'customer' && (
              <CustomerStep
                customer={customer}
                setCustomer={setCustomer}
                onWaiverAgreed={ts => { setWaiverAgreedAt(ts); setStep('review'); }}
              />
            )}
            {step === 'review' && selectedSlot && tourType && (
              <ReviewStep
                slot={selectedSlot}
                groupSize={groupSize}
                tourType={tourType}
                customer={customer}
                waiverAgreedAt={waiverAgreedAt ?? ''}
                onConfirmed={result => { setBooking(result); setStep('confirmation'); }}
                onBack={() => setStep('customer')}
              />
            )}
            {step === 'confirmation' && booking && (
              <ConfirmationScreen booking={booking} onReset={() => { reset(); }} />
            )}
          </div>

          {/* ── Sticky footer ── */}
          {step !== 'confirmation' && !showTourRequest && (
            <div style={{ flexShrink: 0, borderTop: '1px solid var(--border)', background: 'var(--bg-section)' }}>
              {/* Trust line */}
              <div style={{ padding: '9px 20px', borderBottom: '1px solid var(--border)' }}>
                <p style={{ fontFamily: 'var(--font-alt)', fontSize: 11, color: 'var(--text-dim)', textAlign: 'center' }}>
                  🔒 Charged immediately · Secure via Stripe · Free cancellation 48h+
                </p>
              </div>
              {/* Price + nav */}
              <div style={{ padding: '12px 20px', display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{ flex: 1 }}>
                  <p style={{ fontFamily: 'var(--font-alt)', fontSize: 11, color: 'var(--text-dim)', marginBottom: 1 }}>
                    {footerPriceLabel}
                  </p>
                  {tourType && (
                    <span style={{ fontFamily: 'var(--font-heading)', fontSize: 22, fontWeight: 700, color: 'var(--accent)', letterSpacing: '-0.01em' }}>
                      ${Number(total).toFixed(2)}
                    </span>
                  )}
                </div>
                <div style={{ display: 'flex', gap: 8 }}>
                  {fc.back && (
                    <button className="btn btn-ghost" onClick={fc.back} style={{ padding: '10px 16px', fontSize: 13 }}>← Back</button>
                  )}
                  {fc.next && (
                    <button className="btn btn-primary" onClick={fc.next} disabled={fc.nextDisabled} style={{ padding: '10px 20px', fontSize: 13, opacity: fc.nextDisabled ? 0.45 : 1, cursor: fc.nextDisabled ? 'not-allowed' : 'pointer' }}>
                      {fc.nextLabel ?? 'Next →'}
                    </button>
                  )}
                  {/* customer and review steps: action buttons are inside the step content */}
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </>
  );
}
