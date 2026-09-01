import { useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useWaitlist } from '../context/WaitlistContext';

export default function Threshold() {
  const { open } = useWaitlist();

  useEffect(() => {
    open('threshold', 'frontier-membership');
  }, [open]);

  return (
    <>
      <Helmet>
        <title>Threshold</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#04060f',
      }}>
        <p style={{
          fontFamily: 'var(--font-heading)',
          fontSize: 'clamp(16px, 2.5vw, 22px)',
          letterSpacing: '0.14em',
          color: 'rgba(203, 243, 110, 0.75)',
          margin: 0,
        }}>
          You read the stones.
        </p>
      </div>
    </>
  );
}
