import { useState, useEffect, useRef, useCallback } from 'react';

interface Review {
  author: string;
  url:    string;
  photo:  string;
  rating: number;
  ago:    string;
  time:   number;
  text:   string;
}

interface ReviewsData {
  configured: boolean;
  rating:     number;
  total:      number;
  reviews:    Review[];
  error?:     string;
}

function Stars({ n, size = 14 }: { n: number; size?: number }) {
  return (
    <span style={{ display: 'inline-flex', gap: 2 }}>
      {[1,2,3,4,5].map(i => (
        <span key={i} style={{ fontSize: size, color: i <= n ? '#f59e0b' : 'rgba(100,100,80,.3)', lineHeight: 1 }}>★</span>
      ))}
    </span>
  );
}

function Avatar({ photo, name }: { photo: string; name: string }) {
  const [err, setErr] = useState(false);
  if (photo && !err) {
    return (
      <img src={photo} alt={name} onError={() => setErr(true)}
        style={{ width: 42, height: 42, borderRadius: '50%', objectFit: 'cover', flexShrink: 0 }} />
    );
  }
  const initial = name?.[0]?.toUpperCase() || '?';
  return (
    <div style={{ width: 42, height: 42, borderRadius: '50%', background: 'var(--accent-dim)', border: '1px solid var(--border-accent)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--font-heading)', fontSize: 16, fontWeight: 700, color: 'var(--accent)', flexShrink: 0 }}>
      {initial}
    </div>
  );
}

function ReviewCard({ r }: { r: Review }) {
  const [expanded, setExpanded] = useState(false);
  const MAX = 180;
  const long = r.text.length > MAX;
  const display = long && !expanded ? r.text.slice(0, MAX).trimEnd() + '…' : r.text;

  return (
    <div style={{ padding: '22px 24px', background: 'var(--bg-section)', border: '1px solid var(--border)', borderRadius: 6, display: 'flex', flexDirection: 'column', gap: 14 }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <Avatar photo={r.photo} name={r.author} />
        <div style={{ flex: 1, minWidth: 0 }}>
          <a href={r.url} target="_blank" rel="noopener noreferrer"
            style={{ fontFamily: 'var(--font-heading)', fontSize: 14, fontWeight: 600, letterSpacing: '0.04em', color: 'var(--text)', textDecoration: 'none', display: 'block', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}
            onMouseEnter={e => (e.currentTarget.style.color = 'var(--accent)')}
            onMouseLeave={e => (e.currentTarget.style.color = 'var(--text)')}>
            {r.author}
          </a>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 3 }}>
            <Stars n={r.rating} size={13} />
            <span style={{ fontSize: 12, color: 'var(--text-dim)', fontFamily: 'var(--font-alt)' }}>{r.ago}</span>
          </div>
        </div>
        {/* Google G */}
        <svg width="18" height="18" viewBox="0 0 18 18" style={{ flexShrink: 0, opacity: 0.45 }}>
          <path d="M9 3.48c1.69 0 2.83.73 3.48 1.34l2.54-2.48C13.46.89 11.43 0 9 0 5.48 0 2.44 2.02.96 4.96l2.91 2.26C4.6 5.05 6.62 3.48 9 3.48z" fill="#EA4335"/>
          <path d="M17.64 9.2c0-.74-.06-1.28-.19-1.84H9v3.34h4.96c-.1.83-.64 2.08-1.84 2.92l2.84 2.2c1.7-1.57 2.68-3.88 2.68-6.62z" fill="#4285F4"/>
          <path d="M3.88 10.78A5.54 5.54 0 0 1 3.58 9c0-.62.11-1.22.29-1.78L.96 4.96A9 9 0 0 0 0 9c0 1.45.35 2.82.96 4.04l2.92-2.26z" fill="#FBBC05"/>
          <path d="M9 18c2.43 0 4.47-.8 5.96-2.18l-2.84-2.2c-.76.53-1.78.9-3.12.9-2.38 0-4.4-1.57-5.12-3.74L.97 13.04C2.45 15.98 5.48 18 9 18z" fill="#34A853"/>
        </svg>
      </div>

      {/* Review text */}
      {r.text ? (
        <div>
          <p style={{ fontFamily: 'var(--font-alt)', fontSize: 14, color: 'var(--text-muted)', lineHeight: 1.7, margin: 0 }}>
            {display}
          </p>
          {long && (
            <button onClick={() => setExpanded(e => !e)}
              style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--accent)', fontFamily: 'var(--font-alt)', fontSize: 13, padding: '4px 0 0', letterSpacing: '0.02em' }}>
              {expanded ? 'Show less' : 'Read more'}
            </button>
          )}
        </div>
      ) : (
        <p style={{ fontFamily: 'var(--font-alt)', fontSize: 13, color: 'var(--text-dim)', fontStyle: 'italic', margin: 0 }}>
          No written review — {r.rating} stars
        </p>
      )}
    </div>
  );
}

// ── Mobile carousel hook ──────────────────────────────────────────────────────
function useMobileCarousel(count: number) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [activeIdx, setActiveIdx] = useState(0);

  const scrollTo = useCallback((idx: number) => {
    const el = trackRef.current;
    if (!el) return;
    el.scrollTo({ left: idx * el.offsetWidth, behavior: 'smooth' });
    setActiveIdx(idx);
  }, []);

  const onScroll = useCallback(() => {
    const el = trackRef.current;
    if (!el) return;
    setActiveIdx(Math.round(el.scrollLeft / el.offsetWidth));
  }, []);

  return { trackRef, activeIdx, scrollTo, onScroll, count };
}

export default function GoogleReviews() {
  const [data, setData]       = useState<ReviewsData | null>(null);
  const [loading, setLoading] = useState(true);

  // ALL hooks must be called before any conditional return
  const carousel = useMobileCarousel(data?.reviews?.length || 3);

  useEffect(() => {
    fetch('/api/reviews')
      .then(r => r.json())
      .then(d => { setData(d); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  // Loading skeleton
  if (loading) {
    return (
      <div className="grid-3" style={{ marginBottom: 20 }}>
        {[1,2,3].map(i => (
          <div key={i} style={{ padding: '22px 24px', background: 'var(--bg-section)', border: '1px solid var(--border)', borderRadius: 6, minHeight: 160 }}>
            <div style={{ width: 42, height: 42, borderRadius: '50%', background: 'var(--bg-card)', marginBottom: 12 }} />
            <div style={{ height: 12, width: '60%', background: 'var(--bg-card)', borderRadius: 3, marginBottom: 8 }} />
            <div style={{ height: 10, width: '40%', background: 'var(--bg-card)', borderRadius: 3, marginBottom: 16 }} />
            <div style={{ height: 8, width: '100%', background: 'var(--bg-card)', borderRadius: 2, marginBottom: 6 }} />
            <div style={{ height: 8, width: '80%', background: 'var(--bg-card)', borderRadius: 2 }} />
          </div>
        ))}
      </div>
    );
  }

  const reviews    = data?.reviews || [];
  const hasReviews = reviews.length > 0;

  return (
    <>
      <style>{`
        /* Desktop/tablet: show grid, hide carousel controls */
        .gr-desktop { display: block; }
        .gr-mobile  { display: none; }
        /* Mobile: show carousel, hide grid */
        @media (max-width: 767px) {
          .gr-desktop { display: none !important; }
          .gr-mobile  { display: block !important; }
          .gr-track {
            display: flex;
            overflow-x: auto;
            scroll-snap-type: x mandatory;
            -webkit-overflow-scrolling: touch;
            scrollbar-width: none;
            gap: 0;
          }
          .gr-track::-webkit-scrollbar { display: none; }
          .gr-slide {
            min-width: 100%;
            max-width: 100%;
            scroll-snap-align: start;
            padding: 0 4px;
            box-sizing: border-box;
          }
          .gr-dots {
            display: flex;
            justify-content: center;
            gap: 8px;
            margin-top: 16px;
          }
          .gr-dot {
            width: 8px; height: 8px; border-radius: 50%;
            background: var(--border);
            border: none; cursor: pointer; padding: 0;
            transition: background .2s, transform .2s;
          }
          .gr-dot.active { background: var(--accent); transform: scale(1.25); }
          .gr-arrows {
            display: flex;
            justify-content: center;
            gap: 12px;
            margin-top: 12px;
          }
          .gr-arrow {
            width: 36px; height: 36px; border-radius: 50%;
            border: 1px solid var(--border-accent);
            background: var(--accent-dim);
            color: var(--accent);
            font-size: 18px; line-height: 1;
            cursor: pointer;
            display: flex; align-items: center; justify-content: center;
            transition: background .15s;
          }
          .gr-arrow:disabled { opacity: .3; cursor: not-allowed; }
          .gr-rating-bar { flex-direction: column !important; align-items: flex-start !important; gap: 8px !important; }
          .gr-leave-link { margin-left: 0 !important; }
        }
      `}</style>

      {/* Overall rating bar */}
      {hasReviews && data && data.rating > 0 && (
        <div className="gr-rating-bar" style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 36, flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
            <span style={{ fontFamily: 'var(--font-heading)', fontSize: 48, fontWeight: 700, color: 'var(--accent)', letterSpacing: '-0.02em', lineHeight: 1 }}>
              {data.rating.toFixed(1)}
            </span>
            <Stars n={Math.round(data.rating)} size={22} />
          </div>
          <div>
            <p style={{ fontFamily: 'var(--font-alt)', fontSize: 14, color: 'var(--text-muted)', margin: 0 }}>
              Based on <strong style={{ color: 'var(--text)' }}>{data.total} Google {data.total === 1 ? 'review' : 'reviews'}</strong>
            </p>
            <p style={{ fontFamily: 'var(--font-alt)', fontSize: 12, color: 'var(--text-dim)', margin: '2px 0 0' }}>
              Updates automatically as new reviews come in
            </p>
          </div>
          <a href="https://search.google.com/local/writereview"
            target="_blank" rel="noopener noreferrer"
            className="btn btn-ghost gr-leave-link"
            style={{ fontSize: 12, marginLeft: 'auto' }}>
            Leave a Review →
          </a>
        </div>
      )}

      {/* ── DESKTOP/TABLET: grid ── */}
      {hasReviews ? (
        <div className="gr-desktop">
          <div className="grid-3" style={{ marginBottom: reviews.length > 3 ? 20 : 0 }}>
            {reviews.slice(0, 3).map((r, i) => <ReviewCard key={i} r={r} />)}
          </div>
          {reviews.length > 3 && (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 20, maxWidth: 820, margin: '0 auto' }}>
              {reviews.slice(3).map((r, i) => <ReviewCard key={i} r={r} />)}
            </div>
          )}
        </div>
      ) : (
        <div className="gr-desktop">
          {/* No reviews CTA — desktop */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20 }}>
            {[
              'Share what brought you to Crestone and what you discovered.',
              'Tell us about the moment the valley changed how you see things.',
              'Help future explorers know what to expect on their first visit.',
            ].map((prompt, i) => (
              <div key={i} style={{ padding: '28px 24px', background: 'var(--bg-section)', border: '1px dashed rgba(203,243,110,0.2)', borderRadius: 6, display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: 14 }}>
                <span style={{ fontSize: 28, opacity: 0.4 }}>{'★'.repeat(5)}</span>
                <p style={{ fontFamily: 'var(--font-alt)', fontSize: 14, color: 'var(--text-dim)', lineHeight: 1.65 }}>{prompt}</p>
                <a href="https://g.page/r/review" target="_blank" rel="noopener noreferrer"
                  style={{ fontSize: 12, color: 'var(--accent)', fontFamily: 'var(--font-alt)', fontWeight: 600 }}>
                  Write a Google review →
                </a>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── MOBILE: carousel ── */}
      <div className="gr-mobile">
        <div className="gr-track" ref={carousel.trackRef} onScroll={carousel.onScroll}>
          {hasReviews ? reviews.map((r, i) => (
            <div key={i} className="gr-slide">
              <ReviewCard r={r} />
            </div>
          )) : (
            ['Share what brought you to Crestone.', 'Tell us what you discovered here.', 'Help future explorers know what to expect.'].map((prompt, i) => (
              <div key={i} className="gr-slide">
                <div style={{ padding: '28px 20px', background: 'var(--bg-section)', border: '1px dashed rgba(203,243,110,0.2)', borderRadius: 6, display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: 14 }}>
                  <span style={{ fontSize: 24, opacity: 0.4 }}>★★★★★</span>
                  <p style={{ fontFamily: 'var(--font-alt)', fontSize: 14, color: 'var(--text-dim)', lineHeight: 1.65 }}>{prompt}</p>
                  <a href="https://g.page/r/review" target="_blank" rel="noopener noreferrer" style={{ fontSize: 13, color: 'var(--accent)', fontFamily: 'var(--font-alt)', fontWeight: 600 }}>Write a Google review →</a>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Arrows */}
        <div className="gr-arrows">
          <button className="gr-arrow" disabled={carousel.activeIdx === 0}
            onClick={() => carousel.scrollTo(carousel.activeIdx - 1)}>‹</button>
          <button className="gr-arrow" disabled={carousel.activeIdx >= (hasReviews ? reviews.length : 3) - 1}
            onClick={() => carousel.scrollTo(carousel.activeIdx + 1)}>›</button>
        </div>

        {/* Dots */}
        <div className="gr-dots">
          {(hasReviews ? reviews : [1,2,3]).map((_, i) => (
            <button key={i} className={`gr-dot${carousel.activeIdx === i ? ' active' : ''}`}
              onClick={() => carousel.scrollTo(i)} />
          ))}
        </div>
      </div>

      {/* Google attribution (required by ToS) */}
      <p style={{ textAlign: 'right', marginTop: 16, fontFamily: 'var(--font-alt)', fontSize: 11, color: 'var(--text-dim)', opacity: 0.6 }}>
        Reviews from Google
      </p>
    </>
  );
}
