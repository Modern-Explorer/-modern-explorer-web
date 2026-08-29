import * as THREE from 'three';
import { terrainHeight } from './noise';
import type { SweepUniforms } from './terrain';

// ─── Encounter shader (cyan-green emissive, fog-aware) ────────────────────────

const ENC_VERT = /* glsl */`
varying vec3 vWorld;
void main() {
  vec4 w = modelMatrix * vec4(position, 1.0);
  vWorld = w.xyz;
  gl_Position = projectionMatrix * viewMatrix * w;
}`;

const ENC_FRAG = /* glsl */`
uniform float uSweepZ;
uniform float uTrailLength;
uniform float uSweepIntensity;
uniform vec3  uCameraPos;
uniform vec3  uFogColor;
uniform float uFogDensity;
uniform float uEncAlpha;   // 0–1 fade controlled by encounter manager

varying vec3 vWorld;

void main() {
  float dZ   = vWorld.z - uSweepZ;
  float trail = (dZ >= 0.0 && dZ <= uTrailLength)
    ? (1.0 - dZ / uTrailLength) * uSweepIntensity
    : 0.0;
  if (dZ >= 0.0 && dZ < 6.0) trail = uSweepIntensity;

  // Encounters are nearly invisible until the sweep reveals them
  float reveal = trail * uEncAlpha;
  if (reveal < 0.01) discard;

  vec3 color = vec3(0.05, 1.0, 0.6) * reveal;
  float dist = length(vWorld - uCameraPos);
  float fog  = 1.0 - exp(-uFogDensity * dist);
  color = mix(color, uFogColor, clamp(fog, 0.0, 1.0));
  gl_FragColor = vec4(color, reveal);
}`;

function makeEncMaterial(su: SweepUniforms): THREE.ShaderMaterial {
  return new THREE.ShaderMaterial({
    uniforms: {
      ...(su as unknown as { [k: string]: THREE.IUniform }),
      uEncAlpha: { value: 1.0 },
    },
    vertexShader: ENC_VERT,
    fragmentShader: ENC_FRAG,
    transparent: true,
    depthWrite: false,
    side: THREE.DoubleSide,
  });
}

// ─── Figure (tall bipedal) ────────────────────────────────────────────────────

function buildFigure(su: SweepUniforms): THREE.Group {
  const mat = makeEncMaterial(su);
  const g = new THREE.Group();

  const head = new THREE.Mesh(new THREE.SphereGeometry(1.1, 6, 6), mat);
  head.position.y = 9;

  const body = new THREE.Mesh(new THREE.CylinderGeometry(0.7, 0.9, 5.5, 6), mat);
  body.position.y = 5.5;

  const legGeo = new THREE.CylinderGeometry(0.35, 0.25, 3.2, 5);
  const legL = new THREE.Mesh(legGeo, mat); legL.position.set(-0.7, 1.5, 0);
  const legR = new THREE.Mesh(legGeo, mat); legR.position.set( 0.7, 1.5, 0);

  g.add(head, body, legL, legR);
  (g as any)._encMat = mat;
  return g;
}

// ─── Air return (small moving orb) ───────────────────────────────────────────

function buildAirReturn(su: SweepUniforms): THREE.Mesh {
  const mat = makeEncMaterial(su);
  const m = new THREE.Mesh(new THREE.SphereGeometry(1.8, 8, 8), mat);
  (m as any)._encMat = mat;
  return m;
}

// ─── Anomaly cluster (dense point return) ────────────────────────────────────

function buildAnomalyCluster(su: SweepUniforms): THREE.Points {
  const mat = new THREE.ShaderMaterial({
    uniforms: {
      ...(su as unknown as { [k: string]: THREE.IUniform }),
      uEncAlpha: { value: 1.0 },
    },
    vertexShader: /* glsl */`
      varying vec3 vWorld;
      void main() {
        vec4 w = modelMatrix * vec4(position, 1.0);
        vWorld = w.xyz;
        gl_PointSize = 2.5;
        gl_Position = projectionMatrix * viewMatrix * w;
      }`,
    fragmentShader: ENC_FRAG,
    transparent: true,
    depthWrite: false,
  });

  const count = 320;
  const pos = new Float32Array(count * 3);
  for (let i = 0; i < count; i++) {
    const r = Math.random() * 7, θ = Math.random() * Math.PI * 2;
    pos[i * 3]     = Math.cos(θ) * r;
    pos[i * 3 + 1] = (Math.random() - 0.3) * 5;
    pos[i * 3 + 2] = Math.sin(θ) * r;
  }
  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
  const pts = new THREE.Points(geo, mat);
  (pts as any)._encMat = mat;
  return pts;
}

// ─── Encounter manager ────────────────────────────────────────────────────────

export type EncKind = 'figure' | 'airReturn' | 'anomaly';

interface ActiveEnc {
  kind: EncKind;
  obj: THREE.Object3D;
  mat: THREE.ShaderMaterial;
  spawnZ: number;
  /** Time (s) since sweep first touched this encounter. */
  revealAge: number;
  revealed: boolean;
}

const ENC_LIFE = 2.2; // seconds after sweep reveals it

export class EncounterManager {
  private su: SweepUniforms;
  private scene: THREE.Scene;
  private active: ActiveEnc | null = null;
  private lastKind: EncKind | null = null;

  constructor(scene: THREE.Scene, su: SweepUniforms) {
    this.su = su; this.scene = scene;
  }

  /** Called by ScanSweep when a sweep encounter should spawn. */
  spawn(kind: EncKind, sweepZ: number, _cameraZ: number) {
    if (this.active) this.remove();
    const spawnZ = sweepZ - 60 - Math.random() * 80;
    let obj: THREE.Object3D;

    if (kind === 'figure') {
      obj = buildFigure(this.su);
      // Place at treeline (|x| 28–45)
      const x = (Math.random() > 0.5 ? 1 : -1) * (28 + Math.random() * 17);
      const y = terrainHeight(x, spawnZ);
      obj.position.set(x, y, spawnZ);
    } else if (kind === 'airReturn') {
      obj = buildAirReturn(this.su);
      obj.position.set(
        (Math.random() - 0.5) * 60,
        30 + Math.random() * 25,
        spawnZ
      );
      (obj as any)._vx = (Math.random() - 0.5) * 4;
      (obj as any)._vy = (Math.random() - 0.5) * 2;
    } else {
      obj = buildAnomalyCluster(this.su);
      const x = (Math.random() - 0.5) * 30;
      const y = terrainHeight(x, spawnZ) + 0.5;
      obj.position.set(x, y, spawnZ);
    }

    const mat = (obj as any)._encMat as THREE.ShaderMaterial;
    mat.uniforms['uEncAlpha'].value = 0;
    this.scene.add(obj);
    this.active = { kind, obj, mat, spawnZ, revealAge: 0, revealed: false };
    this.lastKind = kind;
  }

  update(dt: number) {
    if (!this.active) return;
    const enc = this.active;
    const sweepZ = this.su.uSweepZ.value;
    const dZ = enc.spawnZ - sweepZ; // positive once sweep has passed

    if (dZ >= 0 && !enc.revealed) {
      enc.revealed = true;
    }

    if (enc.revealed) {
      enc.revealAge += dt;
      // Fade in quickly, hold, then fade out
      const t = enc.revealAge / ENC_LIFE;
      const alpha = t < 0.15 ? t / 0.15 : t > 0.75 ? (1 - t) / 0.25 : 1;
      enc.mat.uniforms['uEncAlpha'].value = Math.max(0, alpha);

      // Air return drifts then makes a right-angle turn
      if (enc.kind === 'airReturn') {
        const vx = (enc.obj as any)._vx ?? 0;
        const vy = (enc.obj as any)._vy ?? 0;
        const turnAt = 0.45;
        if (t < turnAt) {
          enc.obj.position.x += vx * dt;
          enc.obj.position.y += vy * dt;
        } else {
          // Hard right-angle turn: swap velocities
          enc.obj.position.x -= vy * dt * 1.6;
          enc.obj.position.y += vx * dt * 0.3;
        }
      }

      if (enc.revealAge >= ENC_LIFE) this.remove();
    }
  }

  private remove() {
    if (!this.active) return;
    this.scene.remove(this.active.obj);
    this.active = null;
  }

  getLastKind() { return this.lastKind; }

  dispose() { this.remove(); }
}
