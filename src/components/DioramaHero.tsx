import { useEffect, useRef } from 'react';

// ─── RNG ────────────────────────────────────────────────────────────────────

function makeRng(seed: number) {
  let s = seed | 1;
  return () => {
    s ^= s << 13; s ^= s >> 17; s ^= s << 5;
    return (s >>> 0) / 0x100000000;
  };
}

// ─── Profile builders ────────────────────────────────────────────────────────

/** Sine-sum mountain profile — tiles seamlessly at period W. */
function buildMtnProfile(
  W: number, H: number, seed: number,
  baseYFrac: number, ampFrac: number, terms: number
): Float32Array {
  const r = makeRng(seed);
  const hs = Array.from({ length: terms }, (_, i) => ({
    n: i + 1, amp: r(), phase: r() * Math.PI * 2,
  }));
  const total = hs.reduce((s, h) => s + h.amp, 0);
  hs.forEach(h => (h.amp /= total));
  const baseY = H * baseYFrac, amp = H * ampFrac;
  const pts = new Float32Array(W + 1);
  for (let x = 0; x <= W; x++) {
    let y = baseY;
    for (const h of hs) y -= amp * h.amp * Math.sin(h.n * 2 * Math.PI * x / W + h.phase);
    pts[x] = y;
  }
  return pts;
}

interface Tree { x: number; h: number; w: number; }

function buildTrees(W: number, H: number, count: number): Tree[] {
  const r = makeRng(777);
  return Array.from({ length: count }, () => ({
    x: r() * W,
    h: (0.07 + r() * 0.10) * H,
    w: (0.012 + r() * 0.014) * H,
  }));
}

/** Triangular-overlap tree profile — tiles via extended copies. */
function buildTreeProfile(W: number, H: number, trees: Tree[]): Float32Array {
  const baseY = H * 0.67;
  const profile = new Float32Array(W + 1).fill(baseY);
  const ext = [
    ...trees.map(t => ({ ...t, x: t.x - W })),
    ...trees,
    ...trees.map(t => ({ ...t, x: t.x + W })),
  ];
  for (let x = 0; x <= W; x++) {
    let minY = baseY;
    for (const t of ext) {
      const dx = Math.abs(x - t.x);
      if (dx < t.w) {
        const top = baseY - t.h * (1 - dx / t.w);
        if (top < minY) minY = top;
      }
    }
    profile[x] = minY;
  }
  return profile;
}

interface StarDef { x: number; y: number; r: number; period: number; phase: number; }

function buildStars(W: number, H: number, count: number): StarDef[] {
  const r = makeRng(1234);
  return Array.from({ length: count }, () => ({
    x: r() * W, y: r() * H * 0.50,
    r: 0.4 + r() * 1.1,
    period: 2 + r() * 6,
    phase: r() * Math.PI * 2,
  }));
}

// ─── Encounter types ─────────────────────────────────────────────────────────

type EncounterKind = 'eyes' | 'silhouette' | 'skylight' | 'glint';

interface Encounter {
  kind: EncounterKind;
  t: number; duration: number;
  x: number; y: number;
  vx?: number;
}

// ─── Scene state ─────────────────────────────────────────────────────────────

interface S {
  W: number; H: number; mobile: boolean; reduced: boolean; paused: boolean;
  mtnPhase: number; ridgePhase: number; treePhase: number;
  fogPhase: number; dunePhase: number;
  pxNorm: number; pxTarget: number;
  mtnProfile: Float32Array; ridgeProfile: Float32Array;
  treeProfile: Float32Array; trees: Tree[];
  duneProfile: Float32Array; stars: StarDef[];
  fireflies: { x: number; y: number; period: number; phase: number }[];
  encounter: Encounter | null;
  nextEncIn: number; lastKind: string;
  totalTime: number; lastTime: number;
}

function initScene(W: number, H: number, reduced: boolean): S {
  const mobile = W < 768;
  const r = makeRng(9999);
  const trees = buildTrees(W, H, mobile ? 38 : 65);
  return {
    W, H, mobile, reduced, paused: false,
    mtnPhase: 0, ridgePhase: 0, treePhase: 0, fogPhase: 0, dunePhase: 0,
    pxNorm: 0, pxTarget: 0,
    mtnProfile: buildMtnProfile(W, H, 111, 0.37, 0.19, 9),
    ridgeProfile: buildMtnProfile(W, H, 222, 0.51, 0.11, 14),
    treeProfile: buildTreeProfile(W, H, trees), trees,
    duneProfile: buildMtnProfile(W, H, 333, 0.84, 0.055, 3),
    stars: buildStars(W, H, mobile ? 80 : 155),
    fireflies: Array.from({ length: mobile ? 5 : 14 }, () => ({
      x: r() * W, y: H * 0.54 + r() * H * 0.14,
      period: 3 + r() * 5, phase: r() * Math.PI * 2,
    })),
    encounter: null, nextEncIn: 18 + r() * 15, lastKind: '',
    totalTime: 0, lastTime: 0,
  };
}

// ─── Drawing ─────────────────────────────────────────────────────────────────

/** Draw a silhouette that tiles at tileW=W via three offset copies. */
function drawLayer(
  ctx: CanvasRenderingContext2D,
  profile: Float32Array,
  phase: number, parallaxPx: number,
  W: number, H: number,
  fill: string | CanvasGradient
) {
  const shift = -(phase % W) + parallaxPx;
  ctx.fillStyle = fill;
  for (let c = 0; c < 3; c++) {
    const dx = shift + (c - 1) * W;
    if (dx > W || dx + W < 0) continue;
    ctx.beginPath();
    ctx.moveTo(dx, H + 1);
    for (let x = 0; x < profile.length; x++) ctx.lineTo(dx + x, profile[x]);
    ctx.lineTo(dx + W, H + 1);
    ctx.closePath();
    ctx.fill();
  }
}

function drawSky(ctx: CanvasRenderingContext2D, W: number, H: number) {
  const g = ctx.createLinearGradient(0, 0, 0, H);
  g.addColorStop(0.00, '#040210');
  g.addColorStop(0.28, '#0b0920');
  g.addColorStop(0.55, '#170f30');
  g.addColorStop(0.80, '#2b1840');
  g.addColorStop(1.00, '#3a2050');
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, W, H);
}

function drawStars(ctx: CanvasRenderingContext2D, stars: StarDef[], t: number) {
  for (const s of stars) {
    const a = 0.25 + 0.75 * (0.5 + 0.5 * Math.sin((t / s.period) * Math.PI * 2 + s.phase));
    ctx.beginPath();
    ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(255,248,230,${a.toFixed(2)})`;
    ctx.fill();
  }
}

function drawFog(ctx: CanvasRenderingContext2D, phase: number, W: number, H: number) {
  const fogMid = H * 0.635;
  const fogHH = H * 0.022;
  const shift = -(phase % W);
  const g = ctx.createLinearGradient(0, fogMid - fogHH * 2, 0, fogMid + fogHH * 2.5);
  g.addColorStop(0, 'rgba(165,185,210,0)');
  g.addColorStop(0.35, 'rgba(165,185,210,0.09)');
  g.addColorStop(0.65, 'rgba(165,185,210,0.09)');
  g.addColorStop(1, 'rgba(165,185,210,0)');
  for (let c = 0; c < 3; c++) {
    const dx = shift + (c - 1) * W;
    ctx.beginPath();
    ctx.moveTo(dx, fogMid + fogHH * 2.5);
    for (let x = 0; x <= W; x += 5) {
      const wy = fogMid + Math.sin((x / W) * Math.PI * 6 + phase * 0.008) * fogHH;
      ctx.lineTo(dx + x, wy);
    }
    ctx.lineTo(dx + W, fogMid + fogHH * 2.5);
    ctx.closePath();
    ctx.fillStyle = g;
    ctx.fill();
  }
}

function drawFireflies(
  ctx: CanvasRenderingContext2D,
  ffs: S['fireflies'], t: number
) {
  for (const f of ffs) {
    const a = 0.5 + 0.5 * Math.sin((t / f.period) * Math.PI * 2 + f.phase);
    if (a < 0.42) continue;
    const { x, y } = f;
    ctx.beginPath();
    ctx.arc(x, y, 1.4, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(185,235,120,${(a * 0.65).toFixed(2)})`;
    ctx.fill();
    const grd = ctx.createRadialGradient(x, y, 0, x, y, 7);
    grd.addColorStop(0, `rgba(170,225,100,${(a * 0.28).toFixed(2)})`);
    grd.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = grd;
    ctx.beginPath(); ctx.arc(x, y, 7, 0, Math.PI * 2); ctx.fill();
  }
}

// ─── Encounter drawing ────────────────────────────────────────────────────────

function drawEncounter(ctx: CanvasRenderingContext2D, enc: Encounter, H: number) {
  const { kind, t, duration, x, y } = enc;
  const p = t / duration;
  const fi = 0.15, fo = 0.15;
  let alpha = 1;
  if (p < fi) alpha = p / fi;
  else if (p > 1 - fo) alpha = (1 - p) / fo;
  if (alpha <= 0) return;

  if (kind === 'eyes') {
    for (let side = -1; side <= 1; side += 2) {
      const ex = x + side * 13, ey = y;
      const grd = ctx.createRadialGradient(ex, ey, 0, ex, ey, 16);
      grd.addColorStop(0, `rgba(255,155,25,${(alpha * 0.45).toFixed(2)})`);
      grd.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.fillStyle = grd;
      ctx.beginPath(); ctx.arc(ex, ey, 16, 0, Math.PI * 2); ctx.fill();
      ctx.save(); ctx.translate(ex, ey); ctx.scale(1, 0.5);
      ctx.beginPath(); ctx.arc(0, 0, 5.5, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255,172,35,${alpha.toFixed(2)})`; ctx.fill();
      ctx.restore();
      ctx.beginPath(); ctx.arc(ex, ey, 2, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(20,8,0,${alpha.toFixed(2)})`; ctx.fill();
    }
  } else if (kind === 'silhouette') {
    const sx = x + (1 - p) * 65;
    const shH = H * 0.115;
    ctx.save(); ctx.globalAlpha = alpha * 0.88; ctx.fillStyle = '#000';
    // Head
    ctx.beginPath();
    ctx.ellipse(sx, y - shH * 0.89, shH * 0.065, shH * 0.095, 0, 0, Math.PI * 2);
    ctx.fill();
    // Body
    ctx.beginPath();
    ctx.moveTo(sx - shH * 0.085, y - shH * 0.79);
    ctx.lineTo(sx - shH * 0.115, y - shH * 0.08);
    ctx.lineTo(sx + shH * 0.115, y - shH * 0.08);
    ctx.lineTo(sx + shH * 0.085, y - shH * 0.79);
    ctx.closePath(); ctx.fill();
    // Legs
    const sw = Math.sin(p * Math.PI * 5) * shH * 0.055;
    ctx.beginPath();
    ctx.moveTo(sx - shH * 0.055, y - shH * 0.08); ctx.lineTo(sx - shH * 0.055 - sw, y);
    ctx.moveTo(sx + shH * 0.055, y - shH * 0.08); ctx.lineTo(sx + shH * 0.055 + sw, y);
    ctx.strokeStyle = '#000'; ctx.lineWidth = shH * 0.07; ctx.stroke();
    ctx.restore();
  } else if (kind === 'skylight') {
    const dir = enc.vx ?? 1;
    const lx = x + dir * p * 190;
    const ly = y + Math.sin(p * Math.PI) * 22;
    const grd = ctx.createRadialGradient(lx, ly, 0, lx, ly, 9);
    grd.addColorStop(0, `rgba(215,232,255,${(alpha * 0.92).toFixed(2)})`);
    grd.addColorStop(0.45, `rgba(195,215,255,${(alpha * 0.38).toFixed(2)})`);
    grd.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = grd;
    ctx.beginPath(); ctx.arc(lx, ly, 9, 0, Math.PI * 2); ctx.fill();
  } else {
    // glint
    const shimmer = 0.55 + 0.45 * Math.sin(t * 14);
    const ga = alpha * shimmer;
    ctx.save(); ctx.strokeStyle = `rgba(255,215,140,${ga.toFixed(2)})`; ctx.lineWidth = 1.2;
    for (let a = 0; a < Math.PI * 2; a += Math.PI / 2) {
      ctx.beginPath();
      ctx.moveTo(x + Math.cos(a) * 2.5, y + Math.sin(a) * 2.5);
      ctx.lineTo(x + Math.cos(a) * 9, y + Math.sin(a) * 9);
      ctx.stroke();
    }
    for (let a = Math.PI / 4; a < Math.PI * 2; a += Math.PI / 2) {
      ctx.beginPath();
      ctx.moveTo(x + Math.cos(a) * 1.5, y + Math.sin(a) * 1.5);
      ctx.lineTo(x + Math.cos(a) * 6, y + Math.sin(a) * 6);
      ctx.stroke();
    }
    ctx.fillStyle = `rgba(255,238,195,${ga.toFixed(2)})`;
    ctx.beginPath(); ctx.arc(x, y, 2.8, 0, Math.PI * 2); ctx.fill();
    ctx.restore();
  }
}

// ─── Encounter spawner ────────────────────────────────────────────────────────

const ALL_KINDS: EncounterKind[] = ['eyes', 'silhouette', 'skylight', 'glint'];

function spawnEncounter(s: S): Encounter {
  const r = makeRng(Math.floor(s.totalTime * 997) ^ 0xbeef);
  const pool = ALL_KINDS.filter(k => k !== s.lastKind);
  const kind = pool[Math.floor(r() * pool.length)];
  const { W, H } = s;
  if (kind === 'eyes')       return { kind, t: 0, duration: 2.6, x: W * (0.2 + r() * 0.6), y: H * (0.57 + r() * 0.08) };
  if (kind === 'silhouette') return { kind, t: 0, duration: 3.6, x: W * (0.15 + r() * 0.5), y: H * 0.695 };
  if (kind === 'skylight')   return { kind, t: 0, duration: 4.2, x: r() > 0.5 ? W * 0.08 : W * 0.92, y: H * (0.06 + r() * 0.24), vx: r() > 0.5 ? 1 : -1 };
  return { kind, t: 0, duration: 2.1, x: W * (0.1 + r() * 0.8), y: H * (0.86 + r() * 0.09) };
}

// ─── Main frame draw ─────────────────────────────────────────────────────────

function renderFrame(ctx: CanvasRenderingContext2D, s: S) {
  const { W, H, mobile, pxNorm } = s;
  const mtnPx   = pxNorm * W * 0.006;
  const ridgePx  = pxNorm * W * 0.016;
  const treePx   = pxNorm * W * 0.028;
  const dunePx   = pxNorm * W * 0.045;

  drawSky(ctx, W, H);
  drawStars(ctx, s.stars, s.totalTime);

  const mtnG = ctx.createLinearGradient(0, H * 0.22, 0, H * 0.58);
  mtnG.addColorStop(0, '#1c1432'); mtnG.addColorStop(1, '#120f28');
  drawLayer(ctx, s.mtnProfile, s.mtnPhase, mtnPx, W, H, mtnG);

  if (!mobile) {
    const ridgeG = ctx.createLinearGradient(0, H * 0.44, 0, H * 0.68);
    ridgeG.addColorStop(0, '#0f1a10'); ridgeG.addColorStop(1, '#0a1309');
    drawLayer(ctx, s.ridgeProfile, s.ridgePhase, ridgePx, W, H, ridgeG);
  }

  const treeG = ctx.createLinearGradient(0, H * 0.58, 0, H * 0.75);
  treeG.addColorStop(0, '#0a1309'); treeG.addColorStop(1, '#07100a');
  drawLayer(ctx, s.treeProfile, s.treePhase, treePx, W, H, treeG);

  drawFog(ctx, s.fogPhase, W, H);

  if (!mobile) drawFireflies(ctx, s.fireflies, s.totalTime);

  const duneG = ctx.createLinearGradient(0, H * 0.82, 0, H);
  duneG.addColorStop(0, '#2e2008'); duneG.addColorStop(0.5, '#3e2c10'); duneG.addColorStop(1, '#4c3416');
  drawLayer(ctx, s.duneProfile, s.dunePhase, dunePx, W, H, duneG);

  if (s.encounter) drawEncounter(ctx, s.encounter, H);
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function DioramaHero() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const stateRef  = useRef<S | null>(null);
  const rafRef    = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d')!;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const resize = () => {
      const W = canvas.offsetWidth;
      const H = canvas.offsetHeight;
      canvas.width = W; canvas.height = H;
      const prev = stateRef.current;
      stateRef.current = initScene(W, H, reduced);
      // Preserve phases across resize
      if (prev) {
        const r = stateRef.current;
        r.mtnPhase = prev.mtnPhase; r.ridgePhase = prev.ridgePhase;
        r.treePhase = prev.treePhase; r.fogPhase = prev.fogPhase;
        r.dunePhase = prev.dunePhase; r.totalTime = prev.totalTime;
      }
    };

    const tick = (now: number) => {
      const s = stateRef.current;
      if (!s) { rafRef.current = requestAnimationFrame(tick); return; }
      if (!s.paused) {
        const dt = s.lastTime > 0 ? Math.min((now - s.lastTime) / 1000, 0.05) : 0;
        s.lastTime = now; s.totalTime += dt;
        const scale = s.W / 1440;
        s.mtnPhase  += 5  * scale * dt;
        s.ridgePhase += 12 * scale * dt;
        s.treePhase  += 22 * scale * dt;
        s.fogPhase   += 16 * scale * dt;
        s.dunePhase  += 45 * scale * dt;
        s.pxNorm += (s.pxTarget - s.pxNorm) * 0.055;
        // Encounters
        if (s.encounter) {
          s.encounter.t += dt;
          if (s.encounter.t >= s.encounter.duration) {
            s.lastKind = s.encounter.kind; s.encounter = null;
            s.nextEncIn = 25 + Math.random() * 25;
          }
        } else {
          s.nextEncIn -= dt;
          if (s.nextEncIn <= 0) s.encounter = spawnEncounter(s);
        }
        renderFrame(ctx, s);
      }
      rafRef.current = requestAnimationFrame(tick);
    };

    const io = new IntersectionObserver(
      ([e]) => { if (stateRef.current) stateRef.current.paused = !e.isIntersecting; },
      { threshold: 0.01 }
    );
    io.observe(canvas);

    const onVis = () => { if (stateRef.current) stateRef.current.paused = document.hidden; };
    document.addEventListener('visibilitychange', onVis);

    const onPtr = (e: PointerEvent) => {
      const s = stateRef.current;
      if (!s || s.mobile) return;
      const r = canvas.getBoundingClientRect();
      s.pxTarget = (e.clientX - r.left) / r.width * 2 - 1;
    };
    canvas.addEventListener('pointermove', onPtr);

    const ro = new ResizeObserver(resize);
    ro.observe(canvas);
    resize();

    const start = () => {
      if (reduced) {
        const s = stateRef.current;
        if (s) renderFrame(ctx, s);
      } else {
        rafRef.current = requestAnimationFrame(tick);
      }
    };

    if (typeof window.requestIdleCallback === 'function') {
      window.requestIdleCallback(start, { timeout: 3000 });
    } else {
      setTimeout(start, 400);
    }

    return () => {
      cancelAnimationFrame(rafRef.current);
      io.disconnect(); ro.disconnect();
      document.removeEventListener('visibilitychange', onVis);
      canvas.removeEventListener('pointermove', onPtr);
    };
  }, []);

  return (
    <div style={{ position: 'relative', width: '100%', height: '100vh', overflow: 'hidden', background: '#040210' }}>
      <canvas
        ref={canvasRef}
        style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', display: 'block' }}
      />

      {/* Text-protection gradient — dark radial behind copy */}
      <div style={{
        position: 'absolute', inset: 0, pointerEvents: 'none',
        background: 'radial-gradient(ellipse 58% 48% at 50% 46%, rgba(4,2,16,0.62) 0%, rgba(4,2,16,0.10) 70%, transparent 100%)',
      }} />

      {/* Hero content */}
      <div style={{
        position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center', padding: '2rem',
        paddingTop: 'clamp(80px, 10vh, 120px)',
      }}>
        <img
          src="/assets/images/content/Logo/me-logo.webp"
          alt="Modern Explorer"
          loading="eager"
          style={{ width: 'min(240px, 52vw)', marginBottom: '1.5rem', filter: 'drop-shadow(0 2px 24px rgba(4,2,16,0.85))' }}
        />
        <h1 style={{
          fontFamily: "'Oswald', sans-serif",
          fontSize: 'clamp(1.75rem, 4.8vw, 3.4rem)',
          fontWeight: 700,
          color: '#ede5d5',
          textAlign: 'center',
          letterSpacing: '0.045em',
          textShadow: '0 2px 22px rgba(4,2,16,0.95), 0 0 50px rgba(4,2,16,0.6)',
          marginBottom: '0.6rem',
          lineHeight: 1.15,
        }}>
          Discover What's Out There
        </h1>
        <p style={{
          fontFamily: 'Georgia, serif',
          fontSize: 'clamp(0.9rem, 1.85vw, 1.15rem)',
          color: 'rgba(215,203,188,0.88)',
          textAlign: 'center',
          maxWidth: '460px',
          textShadow: '0 1px 10px rgba(4,2,16,0.9)',
          marginBottom: '2.2rem',
          lineHeight: 1.65,
        }}>
          Guided expeditions into the mysteries of the San Luis Valley
        </p>
        <a
          href="/#book"
          style={{
            fontFamily: "'Oswald', sans-serif",
            fontSize: '0.95rem',
            fontWeight: 600,
            letterSpacing: '0.12em',
            textTransform: 'uppercase',
            color: '#0b0820',
            background: 'linear-gradient(135deg, #c8a045 0%, #e2bc62 50%, #c8a045 100%)',
            border: 'none',
            borderRadius: '2px',
            padding: '0.72rem 2.4rem',
            cursor: 'pointer',
            textDecoration: 'none',
            display: 'inline-block',
            boxShadow: '0 4px 22px rgba(200,160,70,0.38)',
          }}
        >
          Book an Expedition
        </a>
      </div>

      {/* Subtle hint for lingerers */}
      <p style={{
        position: 'absolute', bottom: '1.4rem', left: 0, right: 0,
        textAlign: 'center', pointerEvents: 'none',
        fontFamily: 'Georgia, serif', fontSize: '0.72rem',
        letterSpacing: '0.12em', textTransform: 'uppercase',
        color: 'rgba(180,168,155,0.5)',
      }}>
        linger · something is out there
      </p>
    </div>
  );
}
