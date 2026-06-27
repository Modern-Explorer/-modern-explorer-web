import { useState, useEffect } from 'react';
import { NavLink, Link } from 'react-router-dom';
import { useBooking } from '../context/BookingContext';

type NavItem = { to: string; label: string } | { href: string; label: string };
const links: NavItem[] = [
  { to: '/', label: 'Home' },
  { to: '/about', label: 'About' },
  { to: '/field-reports', label: 'Field Reports' },
  { to: '/upcoming', label: 'Upcoming' },
  { href: '/lab', label: 'Field Lab' },
  { to: '/merch', label: 'Merch' },
  { to: '/contact', label: 'Contact' },
  { to: '/faq', label: 'FAQ' },
];

export default function Navbar() {
  const { open: openBooking } = useBooking();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', handler, { passive: true });
    return () => window.removeEventListener('scroll', handler);
  }, []);

  return (
    <nav style={{
      position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
      background: scrolled ? 'var(--bg-nav)' : 'transparent',
      borderBottom: scrolled ? '1px solid var(--border)' : '1px solid transparent',
      backdropFilter: scrolled ? 'blur(12px)' : 'none',
      transition: 'all 0.3s ease',
    }}>
      <div className="container" style={{ display: 'flex', alignItems: 'center', height: 72, gap: 32 }}>
        <Link to="/" style={{ flexShrink: 0 }}
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
          <img
            src="/assets/images/content/Logo/ME Logo Draft 5.png"
            alt="Modern Explorer"
            style={{ height: 40, width: 'auto', objectFit: 'contain' }}
          />
        </Link>

        <div style={{ display: 'flex', gap: 4, flex: 1, alignItems: 'center' }} className="nav-links-desktop">
          {links.map(l => (
            'href' in l ? (
              <a
                key={l.href}
                href={l.href}
                style={{
                  padding: '6px 14px',
                  fontFamily: 'var(--font-heading)',
                  fontSize: 13,
                  fontWeight: 600,
                  letterSpacing: '0.1em',
                  textTransform: 'uppercase',
                  color: 'var(--text-muted)',
                  borderRadius: 3,
                  transition: 'color 0.15s',
                  position: 'relative',
                }}
              >
                {l.label}
              </a>
            ) : (
              <NavLink
                key={l.to}
                to={l.to}
                end={l.to === '/'}
                onClick={l.to === '/' ? () => window.scrollTo({ top: 0, behavior: 'smooth' }) : undefined}
                style={({ isActive }) => ({
                  padding: '6px 14px',
                  fontFamily: 'var(--font-heading)',
                  fontSize: 13,
                  fontWeight: 600,
                  letterSpacing: '0.1em',
                  textTransform: 'uppercase',
                  color: isActive ? 'var(--accent)' : 'var(--text-muted)',
                  borderRadius: 3,
                  transition: 'color 0.15s',
                  position: 'relative',
                })}
              >
                {({ isActive }) => (
                  <>
                    {l.label}
                    {isActive && <span className="nav-active-line" />}
                  </>
                )}
              </NavLink>
            )
          ))}
        </div>

        <button
          onClick={openBooking}
          className="btn btn-primary"
          style={{ flexShrink: 0, padding: '10px 22px', fontSize: 13 }}
        >
          Book a Tour
        </button>

        <button
          aria-label="Toggle menu"
          onClick={() => setOpen(o => !o)}
          style={{ display: 'none', color: 'var(--text)', fontSize: 24, padding: 4 }}
          className="nav-hamburger"
        >
          {open ? '✕' : '☰'}
        </button>
      </div>

      {open && (
        <div style={{
          background: 'var(--bg-nav)',
          borderTop: '1px solid var(--border)',
          padding: '16px 24px 24px',
          backdropFilter: 'blur(12px)',
        }}>
          {links.map(l => (
            'href' in l ? (
              <a
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                style={{
                  display: 'block',
                  padding: '12px 0',
                  fontFamily: 'var(--font-heading)',
                  fontSize: 16,
                  fontWeight: 600,
                  letterSpacing: '0.1em',
                  textTransform: 'uppercase',
                  color: 'var(--text)',
                  borderBottom: '1px solid var(--border)',
                }}
              >
                {l.label}
              </a>
            ) : (
              <NavLink
                key={l.to}
                to={l.to}
                end={l.to === '/'}
                onClick={() => setOpen(false)}
                style={({ isActive }) => ({
                  display: 'block',
                  padding: '12px 0',
                  fontFamily: 'var(--font-heading)',
                  fontSize: 16,
                  fontWeight: 600,
                  letterSpacing: '0.1em',
                  textTransform: 'uppercase',
                  color: isActive ? 'var(--accent)' : 'var(--text)',
                  borderBottom: '1px solid var(--border)',
                })}
              >
                {l.label}
              </NavLink>
            )
          ))}
          <button
            onClick={() => { openBooking(); setOpen(false); }}
            className="btn btn-primary"
            style={{ marginTop: 20, width: '100%', justifyContent: 'center' }}
          >
            Book a Tour
          </button>
        </div>
      )}

      <style>{`
        @media (max-width: 767px) {
          .nav-links-desktop { display: none !important; }
          .nav-hamburger { display: flex !important; }
        }
        /* Tablet: force desktop nav visible, hide hamburger */
        @media (min-width: 768px) {
          .nav-links-desktop { display: flex !important; }
          .nav-hamburger { display: none !important; }
        }
      `}</style>
    </nav>
  );
}
