import * as THREE from 'three';
import { makeSweepUniforms, TerrainManager } from './terrain';
import { EncounterManager } from './encounters';
import { ScanSweep } from './scanSweep';

const CAM_HEIGHT  = 18;
const CAM_SPEED   = 14;    // world units/s forward
const BANK_AMP    = 0.018; // radians, gentle roll
const DRIFT_AMP   = 3.5;   // slight lateral sway, units
const PAR_STRENGTH = 0.008; // look-at parallax from pointer

export interface Scene3D {
  handlePointer: (nx: number) => void; // nx in [-1, 1]
  dispose: () => void;
}

export function initScene(canvas: HTMLCanvasElement, mobile: boolean, reduced: boolean): Scene3D {
  const W = canvas.clientWidth, H = canvas.clientHeight;

  // ── Renderer ──────────────────────────────────────────────────────────────
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: !mobile, alpha: false });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, mobile ? 1 : 1.5));
  renderer.setSize(W, H, false);
  renderer.setClearColor(0x02010a);

  // ── Scene + fog ───────────────────────────────────────────────────────────
  const scene  = new THREE.Scene();
  const fogColor = new THREE.Color(0x02010a);
  // Three.js built-in fog for sky/background blend — very dense
  scene.fog = new THREE.FogExp2(fogColor, mobile ? 0.034 : 0.022);
  scene.background = fogColor;

  // ── Stars ─────────────────────────────────────────────────────────────────
  {
    const count  = mobile ? 900 : 1800;
    const pos    = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const θ = Math.random() * Math.PI * 2;
      const φ = Math.acos(2 * Math.random() - 1) * 0.45; // top hemisphere only
      const r = 500;
      pos[i * 3]     = r * Math.sin(φ) * Math.cos(θ);
      pos[i * 3 + 1] = r * Math.abs(Math.cos(φ)) + 20;
      pos[i * 3 + 2] = r * Math.sin(φ) * Math.sin(θ);
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    const mat = new THREE.PointsMaterial({ color: 0xd8e4f8, size: 0.9, sizeAttenuation: false });
    scene.add(new THREE.Points(geo, mat));
  }

  // ── Moonlight ─────────────────────────────────────────────────────────────
  const moon = new THREE.DirectionalLight(0x6080c0, 0.55);
  moon.position.set(80, 200, -100);
  scene.add(moon);
  scene.add(new THREE.AmbientLight(0x05080f, 1.2));

  // ── Camera ────────────────────────────────────────────────────────────────
  const camera = new THREE.PerspectiveCamera(62, W / H, 0.5, mobile ? 450 : 700);
  camera.position.set(0, CAM_HEIGHT, 0);
  scene.add(camera);

  // ── Sweep uniforms + subsystems ───────────────────────────────────────────
  const su      = makeSweepUniforms(fogColor, mobile);
  const terrain = new TerrainManager(scene, su, mobile);
  terrain.init(0);
  const encMgr = new EncounterManager(scene, su);
  const sweep  = new ScanSweep(su, encMgr, mobile);
  if (reduced) sweep.hide();

  // ── Resize ───────────────────────────────────────────────────────────────
  const ro = new ResizeObserver(() => {
    const w = canvas.clientWidth, h = canvas.clientHeight;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
  });
  ro.observe(canvas);

  // ── Pointer parallax ─────────────────────────────────────────────────────
  let pxNorm = 0, pxTarget = 0;
  const handlePointer = (nx: number) => { if (!mobile) pxTarget = nx; };

  // ── Pause on visibility / intersection ────────────────────────────────────
  let paused = false;
  const onVis = () => { paused = document.hidden; };
  document.addEventListener('visibilitychange', onVis);

  const io = new IntersectionObserver(([e]) => { paused = !e.isIntersecting; }, { threshold: 0.01 });
  io.observe(canvas);

  // ── RAF loop ──────────────────────────────────────────────────────────────
  let raf = 0, lastT = 0, totalT = 0;
  let staticDone = false;

  const tick = (now: number) => {
    raf = requestAnimationFrame(tick);
    if (paused) return;

    const dt = lastT > 0 ? Math.min((now - lastT) / 1000, 0.05) : 0;
    lastT = now; totalT += dt;

    if (reduced) {
      // Render one static frame then stop
      if (!staticDone) {
        renderer.render(scene, camera);
        staticDone = true;
        cancelAnimationFrame(raf);
      }
      return;
    }

    // ── Move camera forward ─────────────────────────────────────────────
    camera.position.z -= CAM_SPEED * dt;
    camera.position.y  = CAM_HEIGHT + Math.sin(totalT * 0.18) * 1.4;
    camera.position.x  = Math.sin(totalT * 0.11) * DRIFT_AMP;

    // Camera bank (roll) — very subtle
    camera.rotation.z = Math.sin(totalT * 0.13) * BANK_AMP;

    // Pointer parallax — ease look-at offset
    pxNorm += (pxTarget - pxNorm) * Math.min(dt * 4, 1);
    const lookTarget = new THREE.Vector3(
      camera.position.x + pxNorm * camera.position.z * PAR_STRENGTH * -60,
      camera.position.y - 4,
      camera.position.z - 40
    );
    camera.lookAt(lookTarget);
    // Re-apply bank after lookAt
    camera.rotation.z = Math.sin(totalT * 0.13) * BANK_AMP;

    // ── Update subsystems ───────────────────────────────────────────────
    terrain.update(camera.position.z);
    su.uCameraPos.value.copy(camera.position);
    sweep.update(dt, camera.position.z, terrain.drawDistance);

    renderer.render(scene, camera);
  };

  raf = requestAnimationFrame(tick);

  return {
    handlePointer,
    dispose() {
      cancelAnimationFrame(raf);
      io.disconnect();
      ro.disconnect();
      document.removeEventListener('visibilitychange', onVis);
      terrain.dispose();
      encMgr.dispose();
      renderer.dispose();
    },
  };
}
