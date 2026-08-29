/** Fast integer hash — good distribution, no trig. */
function hash2(ix: number, iy: number): number {
  let h = (ix * 374761393 + iy * 668265263) | 0;
  h = Math.imul(h ^ (h >>> 13), 1274126177);
  h = h ^ (h >>> 16);
  return (h >>> 0) / 0xffffffff;
}

function lerp(a: number, b: number, t: number) { return a + (b - a) * t; }
function smooth(t: number) { return t * t * (3 - 2 * t); }

/** 2-D value noise in [0, 1]. */
export function valueNoise(x: number, y: number): number {
  const ix = Math.floor(x), iy = Math.floor(y);
  const fx = smooth(x - ix), fy = smooth(y - iy);
  return lerp(
    lerp(hash2(ix, iy),     hash2(ix + 1, iy),     fx),
    lerp(hash2(ix, iy + 1), hash2(ix + 1, iy + 1), fx),
    fy,
  );
}

/** Fractional Brownian Motion — returns value in ~[0, 1]. */
export function fbm(x: number, y: number, octaves = 5): number {
  let v = 0, amp = 0.5, freq = 1;
  for (let i = 0; i < octaves; i++) {
    v += amp * valueNoise(x * freq, y * freq);
    amp *= 0.5; freq *= 2.1;
  }
  return v;
}

/** Terrain Y for world-space (x, z). Valley at x≈0, mountains at |x| large. */
export function terrainHeight(wx: number, wz: number): number {
  const tx = Math.abs(wx) / 110;
  // Valley floor flat near center, steeply rising sides
  const valley = tx < 0.25 ? 0 : Math.pow((tx - 0.25) / 0.75, 1.4) * 95;
  const noise = fbm(wx / 55, wz / 55) * 20 + fbm(wx / 22, wz / 22) * 6;
  return valley + noise - 2;
}
