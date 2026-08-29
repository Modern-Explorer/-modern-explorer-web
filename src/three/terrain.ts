import * as THREE from 'three';
import { terrainHeight } from './noise';

// ─── Shared sweep uniforms (same reference threaded into all materials) ──────

export interface SweepUniforms {
  uSweepZ:         { value: number };
  uTrailLength:    { value: number };
  uSweepIntensity: { value: number };
  uCameraPos:      { value: THREE.Vector3 };
  uFogColor:       { value: THREE.Color };
  uFogDensity:     { value: number };
}

export function makeSweepUniforms(fogColor: THREE.Color, mobile: boolean): SweepUniforms {
  return {
    uSweepZ:         { value: 9999 },
    uTrailLength:    { value: 140 },
    uSweepIntensity: { value: 0 },
    uCameraPos:      { value: new THREE.Vector3() },
    uFogColor:       { value: fogColor },
    uFogDensity:     { value: mobile ? 0.032 : 0.020 },
  };
}

// ─── Terrain ShaderMaterial ───────────────────────────────────────────────────

const VERT = /* glsl */`
varying vec3 vWorld;
void main() {
  vec4 w = modelMatrix * vec4(position, 1.0);
  vWorld = w.xyz;
  gl_Position = projectionMatrix * viewMatrix * w;
}`;

const FRAG = /* glsl */`
uniform float uSweepZ;
uniform float uTrailLength;
uniform float uSweepIntensity;
uniform vec3  uCameraPos;
uniform vec3  uFogColor;
uniform float uFogDensity;

varying vec3 vWorld;

void main() {
  // Base rock/dirt colour — very dark, cold blue-black
  float slope = clamp(vWorld.y / 90.0, 0.0, 1.0);
  vec3 base = mix(vec3(0.032, 0.040, 0.055), vec3(0.018, 0.022, 0.032), slope);

  // Sweep trail: dZ positive = vertex is behind sweep front (already scanned)
  float dZ = vWorld.z - uSweepZ;
  float trail = (dZ >= 0.0 && dZ <= uTrailLength)
    ? (1.0 - dZ / uTrailLength) * uSweepIntensity
    : 0.0;
  // Hard leading edge
  if (dZ >= 0.0 && dZ < 4.0) trail = uSweepIntensity;

  vec3 sweepColor = vec3(0.0, 0.95, 0.55);
  vec3 color = base + sweepColor * trail * 0.85;

  // Exponential fog
  float dist = length(vWorld - uCameraPos);
  float fog  = 1.0 - exp(-uFogDensity * dist);
  color = mix(color, uFogColor, clamp(fog, 0.0, 1.0));

  gl_FragColor = vec4(color, 1.0);
}`;

export function makeTerrainMaterial(su: SweepUniforms): THREE.ShaderMaterial {
  return new THREE.ShaderMaterial({
    uniforms: su as unknown as { [k: string]: THREE.IUniform },
    vertexShader: VERT,
    fragmentShader: FRAG,
    side: THREE.FrontSide,
  });
}

// ─── Tree ShaderMaterial (same sweep, darker green tint) ─────────────────────

const TREE_FRAG = /* glsl */`
uniform float uSweepZ;
uniform float uTrailLength;
uniform float uSweepIntensity;
uniform vec3  uCameraPos;
uniform vec3  uFogColor;
uniform float uFogDensity;

varying vec3 vWorld;

void main() {
  vec3 base = vec3(0.018, 0.038, 0.022);
  float dZ  = vWorld.z - uSweepZ;
  float trail = (dZ >= 0.0 && dZ <= uTrailLength)
    ? (1.0 - dZ / uTrailLength) * uSweepIntensity
    : 0.0;
  if (dZ >= 0.0 && dZ < 4.0) trail = uSweepIntensity;

  vec3 color = base + vec3(0.0, 0.9, 0.5) * trail * 0.9;
  float dist = length(vWorld - uCameraPos);
  float fog  = 1.0 - exp(-uFogDensity * dist);
  color = mix(color, uFogColor, clamp(fog, 0.0, 1.0));
  gl_FragColor = vec4(color, 1.0);
}`;

export function makeTreeMaterial(su: SweepUniforms): THREE.ShaderMaterial {
  return new THREE.ShaderMaterial({
    uniforms: su as unknown as { [k: string]: THREE.IUniform },
    vertexShader: VERT,
    fragmentShader: TREE_FRAG,
    side: THREE.DoubleSide,
  });
}

// ─── Chunk geometry ───────────────────────────────────────────────────────────

export const CHUNK_SIZE = 220;
const SEG_DESKTOP = 60;
const SEG_MOBILE  = 32;

export function buildChunkGeometry(
  centerX: number, centerZ: number, mobile: boolean
): THREE.BufferGeometry {
  const seg = mobile ? SEG_MOBILE : SEG_DESKTOP;
  const geo = new THREE.PlaneGeometry(CHUNK_SIZE, CHUNK_SIZE, seg, seg);
  geo.rotateX(-Math.PI / 2);
  const pos = geo.attributes.position as THREE.BufferAttribute;
  for (let i = 0; i < pos.count; i++) {
    const wx = pos.getX(i) + centerX;
    const wz = pos.getZ(i) + centerZ;
    pos.setY(i, terrainHeight(wx, wz));
  }
  pos.needsUpdate = true;
  geo.computeVertexNormals();
  return geo;
}

// ─── Instanced conifers ───────────────────────────────────────────────────────

const TREE_CONE = new THREE.ConeGeometry(2.2, 11, 6, 1);
const MAX_TREES = 90;

export function buildTreeMesh(
  centerX: number, centerZ: number,
  mobile: boolean,
  mat: THREE.ShaderMaterial
): THREE.InstancedMesh {
  const count = mobile ? 40 : MAX_TREES;
  const mesh = new THREE.InstancedMesh(TREE_CONE, mat, count);
  mesh.frustumCulled = true;

  const dummy = new THREE.Object3D();
  let placed = 0;
  const half = CHUNK_SIZE / 2;

  // Deterministic placement via simple hash walk
  for (let attempt = 0; attempt < count * 6 && placed < count; attempt++) {
    // pseudo-random offsets via hash
    const h1 = ((attempt * 7919 + centerX * 31 + centerZ * 17) | 0) >>> 0;
    const h2 = ((attempt * 6271 + centerZ * 53 + centerX * 41) | 0) >>> 0;
    const lx = (h1 / 0xffffffff) * CHUNK_SIZE - half;
    const lz = (h2 / 0xffffffff) * CHUNK_SIZE - half;
    const wx = lx + centerX, wz = lz + centerZ;

    // Only plant trees on slopes (not valley floor, not peaks)
    const y = terrainHeight(wx, wz);
    const absX = Math.abs(wx);
    if (absX < 30 || absX > 100 || y < 5 || y > 82) continue;

    dummy.position.set(wx, y + 4.5, wz);
    const scale = 0.7 + (h1 % 100) / 200;
    dummy.scale.setScalar(scale);
    dummy.rotation.y = (h2 % 628) / 100;
    dummy.updateMatrix();
    mesh.setMatrixAt(placed++, dummy.matrix);
  }

  mesh.count = placed;
  mesh.instanceMatrix.needsUpdate = true;
  return mesh;
}

// ─── Terrain manager ─────────────────────────────────────────────────────────

interface Chunk {
  mesh: THREE.Mesh;
  trees: THREE.InstancedMesh;
  centerZ: number;
}

export class TerrainManager {
  private chunks: Chunk[] = [];
  private scene: THREE.Scene;
  private terrainMat: THREE.ShaderMaterial;
  private treeMat: THREE.ShaderMaterial;
  private mobile: boolean;
  readonly drawDistance: number;

  constructor(
    scene: THREE.Scene,
    su: SweepUniforms,
    mobile: boolean
  ) {
    this.scene    = scene;
    this.mobile   = mobile;
    this.drawDistance = mobile ? 440 : 660;
    this.terrainMat = makeTerrainMaterial(su);
    this.treeMat    = makeTreeMaterial(su);
  }

  /** Seed three chunks ahead of starting position. */
  init(cameraZ: number) {
    for (let i = 0; i < 3; i++) {
      this.addChunk(0, cameraZ - CHUNK_SIZE / 2 - i * CHUNK_SIZE);
    }
  }

  private addChunk(cx: number, cz: number) {
    const geo  = buildChunkGeometry(cx, cz, this.mobile);
    const mesh = new THREE.Mesh(geo, this.terrainMat);
    const trees = buildTreeMesh(cx, cz, this.mobile, this.treeMat);
    this.scene.add(mesh, trees);
    this.chunks.push({ mesh, trees, centerZ: cz });
  }

  /** Move elapsed chunks forward; call every frame with current camera Z. */
  update(cameraZ: number) {
    for (const chunk of this.chunks) {
      // Chunk is more than CHUNK_SIZE behind the camera — recycle it
      if (chunk.centerZ > cameraZ + CHUNK_SIZE) {
        const newZ = cameraZ - this.drawDistance + CHUNK_SIZE / 2;
        const geo = buildChunkGeometry(0, newZ, this.mobile);
        chunk.mesh.geometry.dispose();
        chunk.mesh.geometry = geo;
        const trees = buildTreeMesh(0, newZ, this.mobile, this.treeMat);
        this.scene.remove(chunk.trees);
        chunk.trees.dispose();
        chunk.trees = trees;
        this.scene.add(trees);
        chunk.centerZ = newZ;
      }
    }
  }

  dispose() {
    for (const { mesh, trees } of this.chunks) {
      mesh.geometry.dispose();
      this.scene.remove(mesh, trees);
      trees.dispose();
    }
    this.terrainMat.dispose();
    this.treeMat.dispose();
    this.chunks = [];
  }
}
