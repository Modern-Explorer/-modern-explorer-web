import { useEffect } from 'react';

// ── Waiver document shape (served by GET /api/waiver/current) ────────────────
export interface WaiverItem { n: string; text: string; }
export interface WaiverArticle { heading: string; intro?: string; items: WaiverItem[]; }
export interface WaiverCallout { label: string; text: string; }
export interface WaiverDoc {
  operator: string;
  subtitle: string;
  important_notice: { heading: string; body: string };
  articles: WaiverArticle[];
  callouts?: WaiverCallout[];
}

interface Props {
  doc:           WaiverDoc | null;   // null while loading
  effectiveDate: string | null;      // ISO date from the waiver version
  title:         string;
  loadError?:    boolean;
  onAgree:       () => void;
  onClose:       () => void;
}

const H = ({ children }: { children: React.ReactNode }) => (
  <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: 12, fontWeight: 700, letterSpacing: '0.16em', textTransform: 'uppercase', color: 'var(--accent)', marginBottom: 12, marginTop: 28, paddingBottom: 8, borderBottom: '1px solid rgba(203,243,110,0.15)' }}>{children}</h3>
);
const P = ({ children }: { children: React.ReactNode }) => (
  <p style={{ fontSize: 13, color: 'rgba(240,244,255,0.68)', lineHeight: 1.8, marginBottom: 10 }}>{children}</p>
);
const Item = ({ n, children }: { n: string; children: React.ReactNode }) => (
  <p style={{ fontSize: 13, color: 'rgba(240,244,255,0.65)', lineHeight: 1.8, marginBottom: 8, paddingLeft: 20 }}>
    {n && <span style={{ color: 'var(--text-muted)', fontWeight: 600 }}>{n}</span>}{n ? ' ' : ''}{children}
  </p>
);

// Render inline **bold** spans from the stored text.
function renderRich(text: string): React.ReactNode {
  const parts = text.split(/\*\*(.+?)\*\*/g);
  return parts.map((part, i) =>
    i % 2 === 1
      ? <strong key={i} style={{ color: 'rgba(240,244,255,0.88)', fontWeight: 600 }}>{part}</strong>
      : <span key={i}>{part}</span>,
  );
}

function formatEffective(iso: string | null): string {
  if (!iso) return '';
  const d = new Date(iso.slice(0, 10) + 'T12:00:00');
  if (isNaN(d.getTime())) return iso;
  return d.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
}

export default function WaiverModal({ doc, effectiveDate, title, loadError, onAgree, onClose }: Props) {
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onClose]);

  const ready = !!doc && !loadError;

  return (
    <div
      onClick={onClose}
      style={{ position: 'fixed', inset: 0, zIndex: 10100, background: 'rgba(0,0,0,0.88)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px 16px', backdropFilter: 'blur(3px)' }}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{ width: '100%', maxWidth: 720, maxHeight: '90vh', background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 10, display: 'flex', flexDirection: 'column', boxShadow: '0 32px 80px rgba(0,0,0,0.8)', overflow: 'hidden' }}
      >
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '18px 24px', borderBottom: '1px solid var(--border)', background: 'var(--bg-section)', flexShrink: 0 }}>
          <div>
            <p style={{ fontFamily: 'var(--font-heading)', fontSize: 9, fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--accent)', marginBottom: 3 }}>Modern Explorer · Legal Document</p>
            <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: 16, fontWeight: 600, color: 'var(--text)' }}>{title}</h2>
          </div>
          <button
            onClick={onClose}
            aria-label="Close"
            style={{ width: 34, height: 34, borderRadius: '50%', border: '1px solid var(--border)', background: 'var(--bg)', color: 'var(--text-muted)', fontSize: 20, lineHeight: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', flexShrink: 0, transition: 'border-color 0.15s, color 0.15s' }}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = 'var(--border-accent)'; (e.currentTarget as HTMLElement).style.color = 'var(--accent)'; }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = 'var(--border)'; (e.currentTarget as HTMLElement).style.color = 'var(--text-muted)'; }}
          >×</button>
        </div>

        {/* Scrollable body */}
        <div style={{ overflowY: 'auto', flex: 1, padding: '28px 28px 0' }}>
          {!ready ? (
            <div style={{ padding: '48px 8px', textAlign: 'center' }}>
              {loadError ? (
                <p style={{ fontSize: 14, color: '#f59e0b', lineHeight: 1.7 }}>
                  We couldn't load the current agreement. Please close this window and try again — you must be able to review the agreement before accepting it.
                </p>
              ) : (
                <>
                  <div style={{ width: 24, height: 24, margin: '0 auto 12px', border: '2px solid var(--border)', borderTopColor: 'var(--accent)', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
                  <p style={{ fontSize: 13, color: 'var(--text-dim)' }}>Loading agreement…</p>
                  <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
                </>
              )}
            </div>
          ) : (
            <>
              <div style={{ textAlign: 'center', marginBottom: 28, paddingBottom: 24, borderBottom: '1px solid var(--border)' }}>
                <p style={{ fontFamily: 'var(--font-heading)', fontSize: 18, fontWeight: 700, letterSpacing: '0.06em', color: 'var(--text)', marginBottom: 6 }}>{doc!.operator.toUpperCase()}</p>
                <p style={{ fontFamily: 'var(--font-heading)', fontSize: 13, fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: 12 }}>{doc!.subtitle}</p>
                {effectiveDate && <p style={{ fontSize: 12, color: 'var(--text-dim)' }}>Effective {formatEffective(effectiveDate)}</p>}
              </div>

              <div style={{ padding: '14px 18px', background: 'rgba(245,158,11,0.06)', border: '1px solid rgba(245,158,11,0.22)', borderRadius: 6, marginBottom: 24 }}>
                <p style={{ fontSize: 13, color: '#f59e0b', lineHeight: 1.7, fontWeight: 600 }}>{doc!.important_notice.heading}</p>
                <p style={{ fontSize: 12, color: 'rgba(245,158,11,0.75)', lineHeight: 1.65 }}>{doc!.important_notice.body}</p>
              </div>

              {doc!.articles.map((art, ai) => (
                <div key={ai}>
                  <H>{art.heading}</H>
                  {art.intro && <P>{renderRich(art.intro)}</P>}
                  {art.items.map((it, ii) => (
                    <Item key={ii} n={it.n}>{renderRich(it.text)}</Item>
                  ))}
                </div>
              ))}

              {(doc!.callouts ?? []).map((c, ci) => (
                <div key={ci} style={{ marginTop: 28, padding: '16px 20px', background: 'rgba(203,243,110,0.05)', border: '1px solid rgba(203,243,110,0.25)', borderLeft: '3px solid rgba(203,243,110,0.6)', borderRadius: 5 }}>
                  <p style={{ fontFamily: 'var(--font-heading)', fontSize: 10, fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--accent)', marginBottom: 8 }}>{c.label}</p>
                  <p style={{ fontSize: 13, color: 'rgba(240,244,255,0.72)', lineHeight: 1.75 }}>{renderRich(c.text)}</p>
                </div>
              ))}
              <div style={{ height: 32 }} />
            </>
          )}
        </div>

        {/* Sticky footer */}
        <div style={{ padding: '18px 28px', borderTop: '1px solid var(--border)', background: 'var(--bg-section)', flexShrink: 0, display: 'flex', gap: 12, alignItems: 'center', justifyContent: 'flex-end', flexWrap: 'wrap' }}>
          <button onClick={onClose} className="btn btn-ghost" style={{ fontSize: 13, padding: '10px 22px' }}>Close</button>
          <button onClick={onAgree} disabled={!ready} className="btn btn-primary" style={{ padding: '12px 28px', fontSize: 14, opacity: ready ? 1 : 0.5, cursor: ready ? 'pointer' : 'not-allowed' }}>I Have Read and Agree →</button>
        </div>
      </div>
    </div>
  );
}
