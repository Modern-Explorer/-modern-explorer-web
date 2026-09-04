import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import GhostGlyph from '../components/GhostGlyph';

export default function NotFound() {
  return (
    <main style={{
      position: 'relative',
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      overflow: 'hidden',
      padding: '80px 24px',
    }}>
      <Helmet>
        <title>Not Found — Modern Explorer</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>

      <GhostGlyph
        variant="labyrinth"
        opacity={0.08}
        style={{
          left: '50%',
          top: '50%',
          transform: 'translate(-50%, -50%)',
          width: 'min(80vw, 560px)',
        }}
      />

      <div style={{ position: 'relative', zIndex: 1, textAlign: 'center', maxWidth: 520 }}>
        <p style={{
          fontFamily: 'var(--font-heading)',
          fontSize: 11,
          fontWeight: 700,
          letterSpacing: '0.22em',
          textTransform: 'uppercase',
          color: 'var(--text-dim)',
          marginBottom: 28,
        }}>
          404
        </p>

        <h1 style={{
          fontSize: 'clamp(1.9rem, 5vw, 3.2rem)',
          lineHeight: 1.1,
          marginBottom: 22,
        }}>
          You've wandered off the trail.
        </h1>

        <p style={{
          fontFamily: 'var(--font-alt)',
          color: 'var(--text-muted)',
          fontSize: 16,
          lineHeight: 1.78,
          maxWidth: 400,
          margin: '0 auto 44px',
        }}>
          Most who wander are lost. But not all.
        </p>

        <Link to="/" className="btn btn-primary" style={{ fontSize: 14, padding: '12px 28px' }}>
          Back to the Trail
        </Link>

        {/* Unmarked door to /threshold */}
        <div style={{ marginTop: 56 }}>
          <Link
            to="/threshold"
            style={{
              color: 'var(--text-dim)',
              opacity: 0.28,
              textDecoration: 'none',
              fontSize: 22,
              fontFamily: 'var(--font-heading)',
              display: 'inline-block',
              lineHeight: 1,
              transition: 'opacity 0.3s',
            }}
            onMouseEnter={e => (e.currentTarget.style.opacity = '0.5')}
            onMouseLeave={e => (e.currentTarget.style.opacity = '0.28')}
          >
            ⌖
          </Link>
        </div>
      </div>
    </main>
  );
}
