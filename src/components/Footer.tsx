import { Link } from 'react-router-dom';
import { useBooking } from '../context/BookingContext';

export default function Footer() {
  const { open: openBooking } = useBooking();
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
                { label: 'Facebook', href: 'https://www.facebook.com/Modern.Explorer.ME' },
                { label: 'Twitter/X', href: 'https://twitter.com/explorer_modern' },
                { label: 'Reddit', href: 'https://www.reddit.com/r/modernexplorer' },
                { label: 'Spotify', href: 'https://open.spotify.com/show/0sX6pZpCSM7m4nyHRnLjUx' },
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
              { to: '/what-to-expect', label: 'What to Expect' },
              { to: '/contact', label: 'Contact' },
              { to: '/privacy-policy', label: 'Privacy Policy' },
              { to: '/terms', label: 'Terms of Service' },
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
            <button onClick={openBooking} className="btn btn-primary" style={{ fontSize: 13, padding: '10px 20px' }}>
              Reserve a Spot
            </button>
          </div>
        </div>

        <div style={{ borderTop: '1px solid var(--border)', paddingTop: 28, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
          <p style={{ color: 'var(--text-dim)', fontSize: 13, fontFamily: 'var(--font-alt)', display: 'flex', alignItems: 'center', gap: 10 }}>
            <a href="https://app.modernexplorer.me/admin" className="footer-sigil footer-sigil--spin" style={{ color: '#cbf36e', opacity: 0.4, fontSize: 16, textDecoration: 'none', userSelect: 'none', cursor: 'default', display: 'inline-block', lineHeight: 1 }}>✦</a>
            © {new Date().getFullYear()} Modern Explorer. All rights reserved.
          </p>
          <p style={{ color: 'var(--text-dim)', fontSize: 13, fontFamily: 'var(--font-alt)', display: 'flex', alignItems: 'center', gap: 10 }}>
            Crestone · San Luis Valley, Colorado · Near Great Sand Dunes National Park
            <a href="https://app.modernexplorer.me/guide/login" className="footer-sigil footer-sigil--pulse" style={{ color: '#cbf36e', opacity: 0.4, fontSize: 16, textDecoration: 'none', userSelect: 'none', cursor: 'default', display: 'inline-block', lineHeight: 1 }}>⬡</a>
          </p>
        </div>
      </div>

      <style>{`
        @keyframes footer-spin {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }
        @keyframes footer-pulse {
          0%, 100% { opacity: 0.4; }
          50%       { opacity: 0.15; }
        }
        .footer-sigil--spin  { animation: footer-spin  8s linear infinite; }
        .footer-sigil--pulse { animation: footer-pulse 6s ease-in-out infinite; }
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
