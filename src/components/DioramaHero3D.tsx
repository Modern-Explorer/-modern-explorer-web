import { useEffect, useRef, useState } from 'react';

// ─── Static fallback — renders instantly as LCP-safe base ───────────────────

function StaticFallback() {
  return (
    <div style={{ position: 'absolute', inset: 0 }}>
      {/* Sky gradient */}
      <div style={{
        position: 'absolute', inset: 0,
        background: 'linear-gradient(180deg, #02010a 0%, #080520 35%, #130c2e 65%, #1e1040 100%)',
      }} />
      {/* Mountain silhouettes (SVG) */}
      <svg
        viewBox="0 0 1440 900" preserveAspectRatio="xMidYMid slice"
        style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}
        aria-hidden="true"
      >
        {/* Far peaks */}
        <polygon points="0,900 0,420 120,310 240,380 360,260 500,340 620,200 780,310 900,250 1060,330 1180,220 1320,340 1440,290 1440,900"
          fill="#0f0a1e" />
        {/* Near ridge */}
        <polygon points="0,900 0,560 100,510 200,530 300,490 420,520 540,480 660,510 780,470 900,500 1020,465 1140,495 1260,475 1380,510 1440,490 1440,900"
          fill="#090618" />
        {/* Valley floor / treeline */}
        <polygon points="0,900 0,680 80,660 180,650 250,640 320,655 400,638 480,648 560,635 640,645 720,632 800,642 880,635 960,650 1040,638 1120,655 1200,642 1300,650 1380,660 1440,655 1440,900"
          fill="#060410" />
        {/* Foreground dune */}
        <ellipse cx="720" cy="920" rx="900" ry="140" fill="#06040e" />
      </svg>
      {/* Stars (pure CSS) */}
      <div style={{
        position: 'absolute', inset: 0,
        background: `
          radial-gradient(1px 1px at 15% 12%, rgba(200,220,255,0.7) 0%, transparent 100%),
          radial-gradient(1px 1px at 32% 8%,  rgba(200,220,255,0.5) 0%, transparent 100%),
          radial-gradient(1px 1px at 55% 5%,  rgba(200,220,255,0.8) 0%, transparent 100%),
          radial-gradient(1px 1px at 71% 14%, rgba(200,220,255,0.6) 0%, transparent 100%),
          radial-gradient(1px 1px at 88% 9%,  rgba(200,220,255,0.7) 0%, transparent 100%),
          radial-gradient(1px 1px at 42% 18%, rgba(200,220,255,0.5) 0%, transparent 100%),
          radial-gradient(1px 1px at 66% 22%, rgba(200,220,255,0.6) 0%, transparent 100%)
        `,
      }} />
    </div>
  );
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function DioramaHero3D() {
  const canvasRef    = useRef<HTMLCanvasElement>(null);
  const scene3DRef   = useRef<{ handlePointer: (n: number) => void; dispose: () => void } | null>(null);
  const [glReady, setGlReady] = useState(false);
  const [opacity, setOpacity] = useState(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // WebGL capability check
    const testCtx = document.createElement('canvas').getContext('webgl2')
                  ?? document.createElement('canvas').getContext('webgl');
    if (!testCtx) return; // stay on static fallback

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    let disposed = false;
    let idleCb: number | ReturnType<typeof setTimeout>;

    const load = () => {
      if (disposed) return;
      // Dynamic import — Three.js loads here, post-LCP
      import('../three/scene3D').then(({ initScene }) => {
        if (disposed) return;
        const mobile = window.innerWidth < 768;
        const s3d = initScene(canvas, mobile, reduced);
        scene3DRef.current = s3d;
        setGlReady(true);
        // Short delay before fading in so first frame is painted
        requestAnimationFrame(() => requestAnimationFrame(() => setOpacity(1)));
      }).catch(() => { /* WebGL init failed — stay on fallback */ });
    };

    if (typeof window.requestIdleCallback === 'function') {
      idleCb = window.requestIdleCallback(load, { timeout: 3000 });
    } else {
      idleCb = setTimeout(load, 500);
    }

    return () => {
      disposed = true;
      if (typeof window.requestIdleCallback === 'function') {
        window.cancelIdleCallback(idleCb as number);
      } else {
        clearTimeout(idleCb as ReturnType<typeof setTimeout>);
      }
      scene3DRef.current?.dispose();
    };
  }, []);

  const onPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const nx = (e.clientX - rect.left) / rect.width * 2 - 1;
    scene3DRef.current?.handlePointer(nx);
  };

  return (
    <div
      style={{ position: 'relative', width: '100%', height: '100vh', overflow: 'hidden', background: '#02010a' }}
      onPointerMove={onPointerMove}
    >
      {/* LCP-safe static base — always visible until 3D fades in */}
      <StaticFallback />

      {/* Three.js canvas — fades in over static once first frame is ready */}
      <canvas
        ref={canvasRef}
        style={{
          position: 'absolute', inset: 0,
          width: '100%', height: '100%', display: 'block',
          opacity: glReady ? opacity : 0,
          transition: 'opacity 1.4s ease',
          pointerEvents: 'none',
        }}
      />

      {/* Text-protection gradient */}
      <div style={{
        position: 'absolute', inset: 0, pointerEvents: 'none',
        background: 'radial-gradient(ellipse 62% 52% at 50% 46%, rgba(2,1,10,0.68) 0%, rgba(2,1,10,0.12) 72%, transparent 100%)',
      }} />

      {/* LIDAR scan aesthetic accent — thin cyan line at bottom of text block */}
      <div style={{
        position: 'absolute', left: '50%', transform: 'translateX(-50%)',
        top: 'calc(50% + 100px)', width: 'min(340px, 55vw)', height: '1px',
        background: 'linear-gradient(90deg, transparent, rgba(0,240,140,0.4), transparent)',
        pointerEvents: 'none',
      }} />

      {/* Hero content */}
      <div style={{
        position: 'absolute', inset: 0,
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        padding: '2rem',
        paddingTop: 'clamp(80px, 10vh, 120px)',
      }}>
        <img
          src="/assets/images/content/Logo/me-logo.webp"
          alt="Modern Explorer"
          loading="eager"
          style={{
            width: 'min(230px, 50vw)',
            marginBottom: '1.4rem',
            filter: 'drop-shadow(0 0 28px rgba(0,240,140,0.12)) drop-shadow(0 2px 20px rgba(2,1,10,0.9))',
          }}
        />
        <h1 style={{
          fontFamily: "'Oswald', sans-serif",
          fontSize: 'clamp(1.7rem, 4.6vw, 3.2rem)',
          fontWeight: 700,
          color: '#e8f4f0',
          textAlign: 'center',
          letterSpacing: '0.05em',
          textShadow: '0 2px 24px rgba(2,1,10,0.98), 0 0 50px rgba(2,1,10,0.7)',
          marginBottom: '0.55rem',
          lineHeight: 1.12,
        }}>
          Discover What's Out There
        </h1>
        <p style={{
          fontFamily: 'Georgia, serif',
          fontSize: 'clamp(0.88rem, 1.8vw, 1.1rem)',
          color: 'rgba(185,210,200,0.85)',
          textAlign: 'center',
          maxWidth: '440px',
          textShadow: '0 1px 12px rgba(2,1,10,0.95)',
          marginBottom: '2rem',
          lineHeight: 1.65,
        }}>
          Guided expeditions into the mysteries of the San Luis Valley
        </p>
        <a
          href="/#book"
          style={{
            fontFamily: "'Oswald', sans-serif",
            fontSize: '0.93rem',
            fontWeight: 600,
            letterSpacing: '0.13em',
            textTransform: 'uppercase',
            color: '#02010a',
            background: 'linear-gradient(135deg, #00c870 0%, #00f08c 50%, #00c870 100%)',
            border: 'none',
            borderRadius: '2px',
            padding: '0.7rem 2.3rem',
            cursor: 'pointer',
            textDecoration: 'none',
            display: 'inline-block',
            boxShadow: '0 4px 24px rgba(0,240,140,0.28)',
          }}
        >
          Book an Expedition
        </a>
      </div>

      {/* Scan hint */}
      <p style={{
        position: 'absolute', bottom: '1.3rem', left: 0, right: 0,
        textAlign: 'center', pointerEvents: 'none',
        fontFamily: 'Georgia, serif', fontSize: '0.68rem',
        letterSpacing: '0.14em', textTransform: 'uppercase',
        color: 'rgba(0,200,120,0.35)',
      }}>
        lidar active · scan in progress
      </p>
    </div>
  );
}
