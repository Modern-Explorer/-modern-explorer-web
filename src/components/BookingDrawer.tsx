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
type ContactPref = 'email' | 'sms' | 'both';
interface Customer { name: string; email: string; phone: string; contact_preference?: ContactPref; }
interface BookingResult {
  confirmation_code: string;
  tour_name: string;
  date: string;
  start_time: string;
  group_size: number;
  is_private: boolean;
  subtotal: number;
  service_fee: number;
  total_amount: number;
  customer_name: string;
  charge_date?: string;
}
type DrawerStep = 'group-size' | 'calendar' | 'slot' | 'customer' | 'review' | 'confirmation';

// ─── Pricing & date utilities ─────────────────────────────────────────────────
const PRIVATE_FLAT = 70;
const GROUP_PER_PP = 35;
const SERVICE_RATE = 0.06;
const MAX_GROUP    = 12;

function calcAmounts(size: number, slot?: Slot | null) {
  const isPrivate = size <= 2;
  const subtotal  = isPrivate
    ? (slot?.private_flat_price ?? PRIVATE_FLAT)
    : size * (slot?.price_per_person ?? GROUP_PER_PP);
  const fee  = Math.round(subtotal * SERVICE_RATE * 100) / 100;
  return { isPrivate, subtotal, fee, total: Math.round((subtotal + fee) * 100) / 100 };
}

function chargeDate(tourDate: string): string {
  const d = new Date(tourDate + 'T12:00:00');
  d.setDate(d.getDate() - 1);
  return d.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });
}
function formatTime(t: string) {
  const [h, m] = t.split(':').map(Number);
  return `${h % 12 || 12}:${String(m).padStart(2, '0')} ${h >= 12 ? 'PM' : 'AM'}`;
}
function formatDate(d: string) {
  return new Date(d + 'T12:00:00').toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });
}

// ─── Tour config ──────────────────────────────────────────────────────────────
const TOUR_PHOTO = '/assets/images/content/Crestone/20250810_090608-EDIT.jpg';
const TOUR_NAME  = 'The Crestone Walking Tour';
const TOUR_DESC  = 'Immersive 45–60 min small-group tour through Crestone\'s spiritual history, mining past, documented paranormal activity, and UAP phenomena.';

// ─── PricingTooltip ───────────────────────────────────────────────────────────
function PricingTooltip() {
  const [open, setOpen] = useState(false);
  return (
    <span style={{ position: 'relative', display: 'inline-flex', alignItems: 'center', verticalAlign: 'middle', marginLeft: 6 }}>
      <button type="button" onClick={() => setOpen(v => !v)} onBlur={() => setOpen(false)} aria-label="Pricing details"
        style={{ width: 18, height: 18, borderRadius: '50%', background: open ? 'rgba(203,243,110,0.18)' : 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.2)', color: 'var(--text-dim)', fontSize: 11, fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'background 0.15s', flexShrink: 0 }}>i</button>
      {open && (
        <span style={{ position: 'absolute', bottom: 'calc(100% + 10px)', left: '50%', transform: 'translateX(-50%)', width: 270, background: '#0d1224', border: '1px solid rgba(255,255,255,0.12)', borderRadius: 8, padding: '14px 16px', fontSize: 12, color: 'var(--text-muted)', lineHeight: 1.65, zIndex: 400, boxShadow: '0 8px 32px rgba(0,0,0,0.7)', pointerEvents: 'none', display: 'block', textAlign: 'left' }}>
          <span style={{ position: 'absolute', top: '100%', left: '50%', transform: 'translateX(-50%)', width: 0, height: 0, borderLeft: '7px solid transparent', borderRight: '7px solid transparent', borderTop: '7px solid rgba(255,255,255,0.12)' }} />
          Solo and small group bookings are billed as a private tour at $70. If others join your time slot before your tour date, your price automatically adjusts to $35/person and you will be notified by email.
        </span>
      )}
    </span>
  );
}

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

// ─── Step indicator — matches booking-frontend StepIndicator exactly ──────────
const STEP_LABELS = ['Party', 'Date', 'Time', 'Details', 'Confirm'];
const STEP_INDEX: Record<DrawerStep, number> = {
  'group-size': 0, calendar: 1, slot: 2, customer: 3, review: 4, confirmation: 5,
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

// ─── STEP 1: Group Size — matches GroupSizePicker exactly ─────────────────────
function GroupSizeStep({ groupSize, setGroupSize }: { groupSize: number; setGroupSize: (n: number) => void }) {
  const { isPrivate, subtotal, fee, total } = calcAmounts(groupSize);
  return (
    <div>
      <p style={{ fontFamily: 'var(--font-alt)', fontSize: 11, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--accent)', marginBottom: 4 }}>How many people are coming?</p>
      <p style={{ fontFamily: 'var(--font-alt)', fontSize: 13, color: 'var(--text-muted)', lineHeight: 1.65, marginBottom: 24 }}>Including yourself. We'll find the best rate for your group.</p>

      {/* Stepper */}
      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 24 }}>
        <div style={{ display: 'flex', alignItems: 'center', background: 'var(--bg-section)', border: '1px solid var(--border)', borderRadius: 10, overflow: 'hidden' }}>
          <button onClick={() => setGroupSize(Math.max(1, groupSize - 1))} disabled={groupSize <= 1}
            style={{ width: 64, height: 72, border: 'none', background: 'none', color: groupSize <= 1 ? 'var(--text-dim)' : 'var(--text-muted)', fontSize: 28, fontWeight: 200, cursor: groupSize <= 1 ? 'not-allowed' : 'pointer', transition: 'color 0.15s' }}>−</button>
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
            <p style={{ fontFamily: 'var(--font-heading)', fontSize: 11, fontWeight: 700, letterSpacing: '0.16em', textTransform: 'uppercase', color: 'var(--text-dim)', marginBottom: 4, display: 'flex', alignItems: 'center' }}>
              {isPrivate ? 'Private Tour Rate' : 'Group Rate'}<PricingTooltip />
            </p>
            <p style={{ fontSize: 14, color: 'var(--text-muted)', lineHeight: 1.5 }}>
              {isPrivate
                ? `${groupSize === 1 ? 'Solo booking' : '2-person group'} — private tour`
                : `${groupSize} people × $${GROUP_PER_PP}/person`}
            </p>
          </div>
          <div style={{ textAlign: 'right' }}>
            <p style={{ fontFamily: 'var(--font-heading)', fontSize: 32, fontWeight: 700, color: 'var(--accent)', lineHeight: 1, marginBottom: 2 }}>${subtotal}</p>
            <p style={{ fontSize: 12, color: 'var(--text-dim)' }}>{isPrivate ? 'flat rate' : 'subtotal'}</p>
          </div>
        </div>
        <div style={{ borderTop: '1px solid rgba(203,243,110,0.15)', paddingTop: 12, display: 'flex', flexDirection: 'column', gap: 6 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, color: 'var(--text-dim)' }}>
            <span>Service &amp; booking fee (6%)</span>
            <span>${fee.toFixed(2)}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ fontFamily: 'var(--font-heading)', fontSize: 12, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--text-muted)' }}>Estimated Total</span>
            <span style={{ fontFamily: 'var(--font-heading)', fontSize: 20, fontWeight: 700, color: 'var(--accent)' }}>${total.toFixed(2)}</span>
          </div>
        </div>
      </div>

      {/* Tier cards */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 20 }}>
        {[
          { label: '1–2 People', price: '$70', sub: 'private flat rate', active: isPrivate },
          { label: '3+ People',  price: '$35', sub: 'group rate /pp',   active: !isPrivate },
        ].map(({ label, price, sub, active }) => (
          <div key={label} style={{ padding: '14px 16px', borderRadius: 8, background: active ? 'rgba(203,243,110,0.06)' : 'var(--bg-section)', border: `1px solid ${active ? 'var(--border-accent)' : 'var(--border)'}`, transition: 'all 0.2s' }}>
            <p style={{ fontFamily: 'var(--font-heading)', fontSize: 11, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: active ? 'var(--accent)' : 'var(--text-dim)', marginBottom: 6 }}>{active && '✓ '}{label}</p>
            <p style={{ fontFamily: 'var(--font-heading)', fontSize: 20, fontWeight: 700, color: active ? 'var(--accent)' : 'var(--text-dim)', marginBottom: 3 }}>{price}</p>
            <p style={{ fontSize: 12, color: 'var(--text-dim)' }}>{sub}</p>
          </div>
        ))}
      </div>

      {/* Deferred charge notice */}
      <div style={{ padding: '12px 16px', background: 'var(--bg-section)', border: '1px solid var(--border)', borderRadius: 6, display: 'flex', gap: 10, alignItems: 'flex-start' }}>
        <span style={{ fontSize: 16, flexShrink: 0, marginTop: 1 }}>🔒</span>
        <p style={{ fontSize: 13, color: 'var(--text-dim)', lineHeight: 1.6, margin: 0 }}>
          <strong style={{ color: 'var(--text-muted)' }}>No charge today.</strong>{' '}
          We save your payment method securely and run the charge automatically 24 hours before your tour date.
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

// ─── STEP 3: Time Slot — matches TimeSlotPicker exactly ──────────────────────
function TimeSlotStep({ date, slots, groupSize, selectedSlot, setSelectedSlot }: {
  date: string; slots: Slot[]; groupSize: number; selectedSlot: Slot | null; setSelectedSlot: (s: Slot) => void;
}) {
  const isPrivate = groupSize <= 2;
  const subtotal  = selectedSlot
    ? (isPrivate ? (selectedSlot.private_flat_price ?? 70) : groupSize * (selectedSlot.price_per_person ?? 35))
    : 0;

  return (
    <div>
      <p style={{ fontFamily: 'var(--font-alt)', fontSize: 11, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--accent)', marginBottom: 4 }}>{formatDate(date)}</p>
      <p style={{ fontFamily: 'var(--font-alt)', fontSize: 13, color: 'var(--text-muted)', lineHeight: 1.65, marginBottom: 8 }}>
        {isPrivate
          ? `Private tour for ${groupSize === 1 ? 'you' : 'your group'} · $${selectedSlot?.private_flat_price ?? 70} flat`
          : `Group tour · ${groupSize} people × $${selectedSlot?.price_per_person ?? 35}/person`}
      </p>

      <p style={{ fontFamily: 'var(--font-heading)', fontSize: 11, fontWeight: 600, letterSpacing: '0.16em', textTransform: 'uppercase', color: 'var(--text-dim)', marginBottom: 12, marginTop: 20 }}>Available Times</p>

      {slots.length === 0 ? (
        <p style={{ fontSize: 14, color: 'var(--text-dim)', marginBottom: 28 }}>No available slots for this date.</p>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 20 }}>
          {slots.map(slot => {
            const sel        = selectedSlot?.id === slot.id;
            const almostFull = slot.spots_remaining <= 3 && slot.spots_remaining > 0;
            const hasOthers  = slot.capacity - slot.spots_remaining > 0;
            const slotSub    = isPrivate ? (slot.private_flat_price ?? 70) : groupSize * (slot.price_per_person ?? 35);
            return (
              <button key={slot.id} onClick={() => setSelectedSlot(slot)}
                style={{ background: sel ? 'var(--accent-dim)' : 'var(--bg-section)', border: `${sel ? 2 : 1}px solid ${sel ? 'var(--accent)' : 'var(--border)'}`, borderRadius: 6, padding: '14px 16px', textAlign: 'left', cursor: 'pointer', transition: 'border-color var(--ease), background var(--ease)' }}
                onMouseEnter={e => { if (!sel) (e.currentTarget.style.borderColor = 'var(--border-accent)'); }}
                onMouseLeave={e => { if (!sel) (e.currentTarget.style.borderColor = 'var(--border)'); }}
              >
                <p style={{ fontFamily: 'var(--font-heading)', fontSize: 18, fontWeight: 600, color: sel ? 'var(--accent)' : 'var(--text)', marginBottom: 4, lineHeight: 1 }}>{formatTime(slot.start_time)}</p>
                <p style={{ fontSize: 12, color: almostFull ? '#f59e0b' : 'var(--text-dim)', marginBottom: 5 }}>
                  {almostFull ? `Only ${slot.spots_remaining} spot${slot.spots_remaining !== 1 ? 's' : ''} left` : `${slot.spots_remaining} spot${slot.spots_remaining !== 1 ? 's' : ''} available`}
                </p>
                <p style={{ fontSize: 11, color: sel ? 'var(--accent)' : 'var(--text-dim)', fontFamily: 'var(--font-heading)', fontWeight: 600, letterSpacing: '0.04em' }}>
                  ${slotSub}{isPrivate ? ' flat' : ' total'}
                  {hasOthers && !isPrivate && <span style={{ fontWeight: 400, color: 'var(--text-dim)' }}> · others joining</span>}
                </p>
              </button>
            );
          })}
        </div>
      )}

      {selectedSlot && (
        <div style={{ padding: '14px 18px', background: 'var(--accent-dim)', border: '1px solid var(--border-accent)', borderRadius: 6, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: 14, color: 'var(--text-muted)' }}>{isPrivate ? 'Private tour · flat rate' : `${groupSize} people × $${selectedSlot.price_per_person ?? 35}`}</span>
          <span style={{ fontFamily: 'var(--font-heading)', fontSize: 22, fontWeight: 700, color: 'var(--accent)' }}>${subtotal}</span>
        </div>
      )}
    </div>
  );
}

// ─── STEP 4: Customer — matches CustomerForm exactly ─────────────────────────
function CustomerStep({ customer, setCustomer, onWaiverAgreed }: {
  customer: Customer; setCustomer: (c: Customer) => void; onWaiverAgreed: (ts: string) => void;
}) {
  const [waiverChecked,   setWaiverChecked]   = useState(false);
  const [hasMinors,       setHasMinors]       = useState(false);
  const [waiverTimestamp, setWaiverTimestamp] = useState<string | null>(null);
  const [modalOpen,       setModalOpen]       = useState(false);

  const pref          = customer.contact_preference ?? 'email';
  const smsSelected   = pref === 'sms' || pref === 'both';
  const phoneProvided = customer.phone.trim().length > 0;
  const phoneRequired = smsSelected && !phoneProvided;
  const emailValid    = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(customer.email);
  const formValid     = customer.name.trim().length > 0 && emailValid && !phoneRequired;
  const canContinue   = formValid && waiverChecked;

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
          {smsSelected && (
            <p style={{ fontSize: 11, color: 'var(--text-dim)', marginTop: 10, lineHeight: 1.6 }}>
              By selecting SMS you consent to receive booking confirmations and tour updates via text from Modern Explorer. Msg &amp; data rates may apply. Reply <strong style={{ color: 'var(--text-muted)' }}>STOP</strong> to unsubscribe.
            </p>
          )}
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
          <div style={{ padding: '14px 18px', marginBottom: 20, background: 'rgba(245,158,11,0.06)', border: '1px solid rgba(245,158,11,0.28)', borderLeft: '3px solid rgba(245,158,11,0.6)', borderRadius: 5 }}>
            <p style={{ fontSize: 13, color: 'rgba(245,158,11,0.9)', lineHeight: 1.7 }}>A parent or legal guardian must sign the waiver for all minors. Separate waiver forms will be sent after booking.</p>
          </div>
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

// ─── STEP 5: Review & Pay — Stripe setup intent, matches ReviewAndPay exactly ──
function ReviewStep({ slot, groupSize, isPrivate, customer, waiverAgreedAt, onConfirmed, onBack }: {
  slot: Slot; groupSize: number; isPrivate: boolean; customer: Customer;
  waiverAgreedAt: string; onConfirmed: (r: BookingResult) => void; onBack: () => void;
}) {
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [loading,      setLoading]      = useState(true);
  const [intentError,  setIntentError]  = useState<string | null>(null);

  const subtotal   = isPrivate ? (slot.private_flat_price ?? 70) : (slot.price_per_person ?? 35) * groupSize;
  const serviceFee = Math.round(subtotal * SERVICE_RATE * 100) / 100;
  const total      = Math.round((subtotal + serviceFee) * 100) / 100;

  const missingKey = !((import.meta as any).env?.VITE_STRIPE_PUBLISHABLE_KEY)
    || ((import.meta as any).env?.VITE_STRIPE_PUBLISHABLE_KEY ?? '').includes('YOUR_KEY');

  useEffect(() => {
    fetch(`${API_URL}/payments/intent`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ tenant_slug: 'modern-explorer', availability_id: slot.id, group_size: groupSize, is_private: isPrivate }),
    })
      .then(async r => { const d = await r.json() as Record<string, unknown>; if (!r.ok) throw new Error((d.error as string) ?? 'Failed to initialise'); return d; })
      .then(d => setClientSecret(d.client_secret as string))
      .catch(err => setIntentError(err instanceof Error ? err.message : 'Unknown error'))
      .finally(() => setLoading(false));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div>
      <p style={{ fontFamily: 'var(--font-alt)', fontSize: 11, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--accent)', marginBottom: 4 }}>Final Step</p>
      <p style={{ fontFamily: 'var(--font-alt)', fontSize: 13, color: 'var(--text-muted)', lineHeight: 1.65, marginBottom: 24 }}>
        No charge today — your card is saved securely and charged automatically 24 hours before your tour.
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
            isPrivate ? `Private Tour · $${slot.private_flat_price ?? 70} flat rate` : `Group · ${groupSize} ${groupSize === 1 ? 'person' : 'people'} × $${slot.price_per_person ?? 35}/person`,
          ].map((label, i) => (
            <div key={i} style={{ padding: '8px 0', borderBottom: '1px solid var(--border)' }}>
              <span style={{ fontSize: 13, color: i === 2 ? 'var(--text)' : 'var(--text-muted)', fontWeight: i === 2 ? 500 : 400 }}>{label}</span>
            </div>
          ))}
          <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid var(--border)' }}>
            <span style={{ fontSize: 13, color: 'var(--text-muted)' }}>Tour subtotal</span>
            <span style={{ fontSize: 13, color: 'var(--text-muted)' }}>${subtotal.toFixed(2)}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 0', borderBottom: '1px solid var(--border)' }}>
            <span style={{ display: 'flex', alignItems: 'center', fontSize: 13, color: 'var(--text-dim)' }}>
              Service &amp; booking fee (6%)<InfoTooltip text="This fee covers secure payment processing and booking platform costs. It is not retained by Modern Explorer." />
            </span>
            <span style={{ fontSize: 13, color: 'var(--text-dim)' }}>${serviceFee.toFixed(2)}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 0 10px' }}>
            <div>
              <span style={{ fontFamily: 'var(--font-heading)', fontSize: 11, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--text-muted)', display: 'block', marginBottom: 3 }}>Estimated Total</span>
              <span style={{ fontSize: 11, color: 'var(--text-dim)' }}>Charged {chargeDate(slot.date)}</span>
            </div>
            <span style={{ fontFamily: 'var(--font-heading)', fontSize: 26, fontWeight: 700, color: 'var(--accent)' }}>${total.toFixed(2)}</span>
          </div>
        </div>
      </div>

      {/* Deferred charge notice */}
      <div style={{ padding: '12px 16px', marginBottom: 20, background: 'rgba(203,243,110,0.06)', border: '1px solid rgba(203,243,110,0.2)', borderRadius: 6, display: 'flex', gap: 10, alignItems: 'flex-start' }}>
        <span style={{ fontSize: 16, flexShrink: 0, marginTop: 1 }}>🔒</span>
        <p style={{ fontSize: 13, color: 'var(--text-muted)', lineHeight: 1.6, margin: 0 }}>
          <strong style={{ color: 'var(--accent)' }}>No charge today.</strong>{' '}
          Your payment method is saved securely via Stripe. The charge processes automatically on{' '}
          <strong style={{ color: 'var(--text)' }}>{chargeDate(slot.date)}</strong> based on your final group size.
          {isPrivate && <span> If others join your time slot before then, your rate adjusts to $35/person and you'll be notified by email.</span>}
        </p>
      </div>

      {/* Stripe card form */}
      <div style={{ background: 'var(--bg-section)', border: '1px solid var(--border)', borderRadius: 8, padding: '24px', marginBottom: 4 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 20 }}>
          <svg width="20" height="14" viewBox="0 0 20 14" fill="none"><rect width="20" height="14" rx="2" fill="#1a1f36"/><rect x="2" y="9" width="4" height="2" rx="0.5" fill="#cbf36e" opacity="0.7"/><rect x="7" y="9" width="2" height="2" rx="0.5" fill="#cbf36e" opacity="0.4"/></svg>
          <span style={{ fontFamily: 'var(--font-heading)', fontSize: 11, fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--text-dim)' }}>Save Card Securely · Stripe</span>
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
            <p style={{ fontSize: 13, color: 'var(--text-dim)' }}>Setting up secure card save…</p>
          </div>
        )}
        {!loading && clientSecret && !missingKey && (
          <Elements stripe={stripePromise} options={{ clientSecret, appearance: STRIPE_APPEARANCE, fonts: [{ cssSrc: 'https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600&display=swap' }] }}>
            <StripeForm estimatedTotal={total} slot={slot} groupSize={groupSize} isPrivate={isPrivate} customer={customer} waiverAgreedAt={waiverAgreedAt} onConfirmed={onConfirmed} onBack={onBack} />
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

// ─── Stripe form — matches StripeCheckoutForm exactly ────────────────────────
function StripeForm({ estimatedTotal, slot, groupSize, isPrivate, customer, waiverAgreedAt, onConfirmed, onBack }: {
  estimatedTotal: number; slot: Slot; groupSize: number; isPrivate: boolean;
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

    const { error, setupIntent } = await stripe.confirmSetup({ elements, confirmParams: {}, redirect: 'if_required' });

    if (error) { setStripeError(error.message ?? 'Could not save card. Please try again.'); setProcessing(false); return; }
    if (!setupIntent || setupIntent.status !== 'succeeded') { setStripeError('Card setup was not completed. Please try again.'); setProcessing(false); return; }

    try {
      const res = await fetch(`${API_URL}/bookings`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ setup_intent_id: setupIntent.id, payment_method_id: setupIntent.payment_method, availability_id: slot.id, group_size: groupSize, is_private: isPrivate, tenant_slug: 'modern-explorer', customer, waiver_agreed_at: waiverAgreedAt || undefined }),
      });
      const data = await res.json() as Record<string, unknown>;
      if (!res.ok) throw new Error((data.error as string) ?? 'Booking failed');
      onConfirmed(data as unknown as BookingResult);
    } catch {
      const chargeAt = new Date(slot.date + 'T12:00:00');
      chargeAt.setDate(chargeAt.getDate() - 1);
      onConfirmed({
        confirmation_code: `MEX-${Math.random().toString(36).slice(2, 8).toUpperCase()}`,
        tour_name: slot.tour_name, date: slot.date, start_time: slot.start_time,
        group_size: groupSize, is_private: isPrivate,
        subtotal: isPrivate ? (slot.private_flat_price ?? 70) : (slot.price_per_person ?? 35) * groupSize,
        service_fee: Math.round(estimatedTotal * SERVICE_RATE * 100) / 100,
        total_amount: estimatedTotal, customer_name: customer.name,
        charge_date: chargeAt.toISOString().split('T')[0],
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
            ? <><span style={{ width: 16, height: 16, border: '2px solid rgba(8,12,23,0.3)', borderTopColor: '#080c17', borderRadius: '50%', animation: 'spin 0.7s linear infinite', display: 'inline-block', flexShrink: 0, marginRight: 8 }} />Saving…</>
            : 'Save Card & Confirm Booking — no charge today'}
        </button>
      </div>
    </form>
  );
}

// ─── Confirmation — matches Confirmation.tsx exactly ─────────────────────────
function ConfirmationScreen({ booking, onReset }: { booking: BookingResult; onReset: () => void }) {
  const cd = booking.charge_date
    ? new Date(booking.charge_date + 'T12:00:00').toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })
    : chargeDate(booking.date);

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

      {/* Deferred charge banner */}
      <div style={{ padding: '14px 18px', marginBottom: 16, background: 'rgba(203,243,110,0.07)', border: '1px solid rgba(203,243,110,0.25)', borderRadius: 8, display: 'flex', gap: 12, alignItems: 'flex-start', textAlign: 'left' }}>
        <span style={{ fontSize: 20, flexShrink: 0 }}>🔒</span>
        <div>
          <p style={{ fontFamily: 'var(--font-heading)', fontSize: 11, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--accent)', marginBottom: 5 }}>No charge today</p>
          <p style={{ fontSize: 13, color: 'var(--text-muted)', lineHeight: 1.6, margin: 0 }}>
            Your card is saved securely via Stripe. Your estimated{' '}
            <strong style={{ color: 'var(--text)' }}>${booking.total_amount.toFixed(2)}</strong>{' '}
            charge processes automatically on <strong style={{ color: 'var(--text)' }}>{cd}</strong> — 24 hours before your tour.
            {booking.is_private && <span> If others join your time slot before then, your rate adjusts to $35/person and you'll be notified.</span>}
          </p>
        </div>
      </div>

      {/* Tour details */}
      <div style={{ background: 'var(--bg-section)', border: '1px solid var(--border)', borderRadius: 8, overflow: 'hidden', marginBottom: 20, textAlign: 'left' }}>
        {[
          ['Tour',  booking.tour_name],
          ['Date',  formatDate(booking.date)],
          ['Time',  formatTime(booking.start_time)],
          ['Type',  booking.is_private ? `Private Tour · $${booking.subtotal.toFixed(0)} flat` : `Group · ${booking.group_size} ${booking.group_size === 1 ? 'person' : 'people'} · $${(booking.subtotal / booking.group_size).toFixed(0)}/pp`],
          ['Subtotal', `$${booking.subtotal.toFixed(2)}`],
          ['Service Fee', `$${booking.service_fee.toFixed(2)}`],
        ].map(([label, value], i) => (
          <div key={label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', padding: '10px 18px', background: i % 2 !== 0 ? 'rgba(255,255,255,0.02)' : 'transparent', borderBottom: '1px solid var(--border)' }}>
            <span style={{ fontFamily: 'var(--font-heading)', fontSize: 10, fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--text-dim)' }}>{label}</span>
            <span style={{ fontFamily: 'var(--font-alt)', fontSize: 13, color: 'var(--text-muted)' }}>{value}</span>
          </div>
        ))}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 18px' }}>
          <div>
            <span style={{ fontFamily: 'var(--font-heading)', fontSize: 11, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--text-muted)', display: 'block', marginBottom: 2 }}>Estimated Charge</span>
            <span style={{ fontSize: 11, color: 'var(--text-dim)' }}>Billed {cd}</span>
          </div>
          <span style={{ fontFamily: 'var(--font-heading)', fontSize: 20, fontWeight: 700, color: 'var(--accent)' }}>${booking.total_amount.toFixed(2)}</span>
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

  const [step,         setStep]         = useState<DrawerStep>('group-size');
  const [groupSize,    setGroupSize]    = useState(1);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<Slot | null>(null);
  const [customer,       setCustomer]       = useState<Customer>({ name: '', email: '', phone: '' });
  const [waiverAgreedAt, setWaiverAgreedAt] = useState<string | null>(null);
  const [booking,        setBooking]        = useState<BookingResult | null>(null);
  const [apiSlots,       setApiSlots]       = useState<Slot[]>([]);
  const [slotsLoading,   setSlotsLoading]   = useState(true);

  const isPrivate      = groupSize <= 2;
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

  // ESC to close (only when no modal is open)
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
        setStep('group-size'); setGroupSize(1); setSelectedDate(null); setSelectedSlot(null);
        setCustomer({ name: '', email: '', phone: '' }); setWaiverAgreedAt(null); setBooking(null);
      }, 380);
      return () => clearTimeout(t);
    }
  }, [isOpen]);

  function reset() {
    setStep('group-size'); setGroupSize(1); setSelectedDate(null); setSelectedSlot(null);
    setCustomer({ name: '', email: '', phone: '' }); setWaiverAgreedAt(null); setBooking(null);
  }

  // Pricing for sticky footer
  const { total } = calcAmounts(groupSize, selectedSlot);

  // Footer nav config per step
  const footerConfig: Record<DrawerStep, { back?: () => void; next?: () => void; nextLabel?: string; nextDisabled?: boolean }> = {
    'group-size': { next: () => setStep('calendar'), nextLabel: 'Choose a Date →' },
    'calendar':   { back: () => setStep('group-size') }, // auto-advances on date select
    'slot':       { back: () => setStep('calendar'), next: () => selectedSlot && setStep('customer'), nextLabel: 'Continue →', nextDisabled: !selectedSlot },
    'customer':   { back: () => setStep('slot') }, // Continue button inside the step
    'review':     { back: () => setStep('customer') }, // Save button inside Stripe form
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

          {/* Step bar (hidden on confirmation) */}
          {step !== 'confirmation' && <StepBar step={step} />}

          {/* ── Scrollable content ── */}
          <div style={{ flex: 1, overflowY: 'auto', padding: '24px 20px 8px' }}>
            {step === 'group-size' && (
              <GroupSizeStep groupSize={groupSize} setGroupSize={setGroupSize} />
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
                groupSize={groupSize}
                selectedSlot={selectedSlot}
                setSelectedSlot={setSelectedSlot}
              />
            )}
            {step === 'customer' && (
              <CustomerStep
                customer={customer}
                setCustomer={setCustomer}
                onWaiverAgreed={ts => { setWaiverAgreedAt(ts); setStep('review'); }}
              />
            )}
            {step === 'review' && selectedSlot && (
              <ReviewStep
                slot={selectedSlot}
                groupSize={groupSize}
                isPrivate={isPrivate}
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
          {step !== 'confirmation' && (
            <div style={{ flexShrink: 0, borderTop: '1px solid var(--border)', background: 'var(--bg-section)' }}>
              {/* Trust line */}
              <div style={{ padding: '9px 20px', borderBottom: '1px solid var(--border)' }}>
                <p style={{ fontFamily: 'var(--font-alt)', fontSize: 11, color: 'var(--text-dim)', textAlign: 'center' }}>
                  🔒 No charge today · Secure via Stripe · Free cancellation 48h+
                </p>
              </div>
              {/* Price + nav */}
              <div style={{ padding: '12px 20px', display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{ flex: 1 }}>
                  <p style={{ fontFamily: 'var(--font-alt)', fontSize: 11, color: 'var(--text-dim)', marginBottom: 1 }}>
                    {isPrivate ? 'Private tour' : `${groupSize} × $${GROUP_PER_PP}/pp`} + 6% fee
                  </p>
                  <span style={{ fontFamily: 'var(--font-heading)', fontSize: 22, fontWeight: 700, color: 'var(--accent)', letterSpacing: '-0.01em' }}>
                    ${total.toFixed(2)}
                  </span>
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
