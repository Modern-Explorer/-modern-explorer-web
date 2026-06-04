import { Link } from 'react-router-dom';

const BOOKING_URL = 'https://fareharbor.com/embeds/book/modernexplorer/?full-items=yes';

export default function Footer() {
  return (
    <footer style={{ background: '#080c17', borderTop: '1px solid var(--border)', paddingTop: 64, paddingBottom: 40 }}>
      <div className="container">
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', gap: 48, marginBottom: 64 }}>
          <div>
            <img
              src="/assets/images/content/Logo/ME Logo Draft 5.png"
              alt="Modern Explorer"
              style={{ height: 48, width: 'auto', objectFit: 'contain', marginBottom: 20 }}
            />
            <p style={{ color: 'var(--text-muted)', fontSize: 15, lineHeight: 1.7, maxWidth: 320 }}>
              Immersive small-group guided tours rooted in Crestone and the San Luis Valley, Colorado. We explore history,
              mystery, and the unexplained—boots on the ground.
            </p>
            <div style={{ display: 'flex', gap: 12, marginTop: 24 }}>
              {[
                { label: 'Instagram', href: 'https://instagram.com/modern._explorer' },
                { label: 'YouTube', href: 'https://www.youtube.com/@ModernExplorer' },
                { label: 'Facebook', href: 'https://facebook.com' },
              ].map(s => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    padding: '8px 14px',
                    border: '1px solid var(--border)',
                    borderRadius: 3,
                    fontSize: 12,
                    fontFamily: 'var(--font-alt)',
                    fontWeight: 600,
                    letterSpacing: '0.08em',
                    color: 'var(--text-muted)',
                    transition: 'var(--ease)',
                  }}
                  onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = 'var(--border-accent)'; (e.currentTarget as HTMLElement).style.color = 'var(--accent)'; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = 'var(--border)'; (e.currentTarget as HTMLElement).style.color = 'var(--text-muted)'; }}
                >
                  {s.label}
                </a>
              ))}
            </div>
          </div>

          <div>
            <p style={{ fontFamily: 'var(--font-heading)', fontSize: 12, fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--accent)', marginBottom: 20 }}>Explore</p>
            {[
              { to: '/', label: 'Home' },
              { to: '/about', label: 'About Us' },
              { to: '/field-reports', label: 'Field Reports' },
              { to: '/upcoming', label: 'Upcoming Tours' },
              { to: '/merch', label: 'Merch Store' },
            ].map(l => (
              <Link key={l.to} to={l.to} style={{ display: 'block', color: 'var(--text-muted)', fontSize: 14, marginBottom: 12, transition: 'color 0.15s' }}
                onMouseEnter={e => (e.currentTarget.style.color = 'var(--text)')}
                onMouseLeave={e => (e.currentTarget.style.color = 'var(--text-muted)')}
              >{l.label}</Link>
            ))}
          </div>

          <div>
            <p style={{ fontFamily: 'var(--font-heading)', fontSize: 12, fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--accent)', marginBottom: 20 }}>Info</p>
            {[
              { to: '/faq', label: 'FAQ' },
              { to: '/contact', label: 'Contact' },
              { to: '/coming-soon', label: 'Coming Soon' },
            ].map(l => (
              <Link key={l.to} to={l.to} style={{ display: 'block', color: 'var(--text-muted)', fontSize: 14, marginBottom: 12, transition: 'color 0.15s' }}
                onMouseEnter={e => (e.currentTarget.style.color = 'var(--text)')}
                onMouseLeave={e => (e.currentTarget.style.color = 'var(--text-muted)')}
              >{l.label}</Link>
            ))}
          </div>

          <div>
            <p style={{ fontFamily: 'var(--font-heading)', fontSize: 12, fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--accent)', marginBottom: 20 }}>Book Now</p>
            <p style={{ color: 'var(--text-muted)', fontSize: 14, lineHeight: 1.6, marginBottom: 16 }}>
              Ready for your next adventure? Reserve your spot today.
            </p>
            <a href={BOOKING_URL} target="_blank" rel="noopener noreferrer" className="btn btn-primary" style={{ fontSize: 13, padding: '10px 20px' }}>
              Reserve a Spot
            </a>
          </div>
        </div>

        <div style={{ borderTop: '1px solid var(--border)', paddingTop: 28, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
          <p style={{ color: 'var(--text-dim)', fontSize: 13, fontFamily: 'var(--font-alt)' }}>
            © {new Date().getFullYear()} Modern Explorer. All rights reserved.
          </p>
          <p style={{ color: 'var(--text-dim)', fontSize: 13, fontFamily: 'var(--font-alt)' }}>
            Crestone · San Luis Valley, Colorado · Near Great Sand Dunes National Park
          </p>
        </div>
      </div>

      <style>{`
        @media (max-width: 900px) {
          footer .container > div:first-child { grid-template-columns: 1fr 1fr !important; }
        }
        @media (max-width: 560px) {
          footer .container > div:first-child { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </footer>
  );
}
