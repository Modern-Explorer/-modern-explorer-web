import type { SweepUniforms } from './terrain';
import { EncounterManager, type EncKind } from './encounters';

const ENC_KINDS: EncKind[] = ['figure', 'airReturn', 'anomaly'];
const SWEEP_SPEED = 55; // world units per second
const RESET_LEAD  = 30; // units ahead of camera when sweep resets

/** Manages one active LiDAR sweep at a time. */
export class ScanSweep {
  private su: SweepUniforms;
  private encManager: EncounterManager;
  private mobile: boolean;

  private sweeping = false;
  private sweepZ   = 0;

  /** Seconds until next sweep triggers. */
  private cooldown = 3; // first sweep fires quickly

  /** Encounter fires on every 2nd–4th sweep. */
  private sweepCount   = 0;
  private nextEncEvery = 3; // randomized after each sweep

  /** Sweep intensity ramps up/down to avoid hard cut-on. */
  private intensityTarget = 0;
  private intensity       = 0;

  constructor(su: SweepUniforms, encManager: EncounterManager, mobile: boolean) {
    this.su = su;
    this.encManager = encManager;
    this.mobile = mobile;
  }

  update(dt: number, cameraZ: number, drawDistance: number) {
    const { su } = this;

    if (!this.sweeping) {
      this.cooldown -= dt;
      if (this.cooldown <= 0) this.startSweep(cameraZ);
    }

    if (this.sweeping) {
      // Advance sweep front
      this.sweepZ -= SWEEP_SPEED * dt;
      su.uSweepZ.value = this.sweepZ;

      // Ramp intensity up at start, keep steady, ramp down near end
      const distFromStart = cameraZ - RESET_LEAD - this.sweepZ;
      const progress = distFromStart / (drawDistance - RESET_LEAD);
      if (progress < 0.08)       this.intensityTarget = progress / 0.08;
      else if (progress > 0.88)  this.intensityTarget = (1 - progress) / 0.12;
      else                        this.intensityTarget = 1;

      // Trigger encounter when sweep is mid-way and this is an encounter sweep
      const encSweep = this.sweepCount % this.nextEncEvery === 0;
      if (encSweep && progress > 0.3 && progress < 0.35) {
        const last = this.encManager.getLastKind();
        const pool = ENC_KINDS.filter(k => k !== last);
        const kind = pool[Math.floor(Math.random() * pool.length)];
        this.encManager.spawn(kind, this.sweepZ, cameraZ);
      }

      // Sweep done when it reaches end of draw distance
      if (this.sweepZ < cameraZ - drawDistance) {
        this.sweeping = false;
        this.intensityTarget = 0;
        this.sweepCount++;
        this.nextEncEvery = 2 + Math.floor(Math.random() * 3);
        const minInterval = this.mobile ? 14 : 12;
        const maxInterval = this.mobile ? 22 : 20;
        this.cooldown = minInterval + Math.random() * (maxInterval - minInterval);
      }
    }

    // Ease intensity
    this.intensity += (this.intensityTarget - this.intensity) * Math.min(dt * 6, 1);
    su.uSweepIntensity.value = this.intensity;

    this.encManager.update(dt);
  }

  private startSweep(cameraZ: number) {
    this.sweeping = true;
    this.sweepZ   = cameraZ - RESET_LEAD;
    this.su.uSweepZ.value = this.sweepZ;
    this.intensityTarget = 0;
  }

  /** Force-hide sweep (e.g., for prefers-reduced-motion static frame). */
  hide() {
    this.su.uSweepIntensity.value = 0;
    this.su.uSweepZ.value = 9999;
    this.sweeping = false;
  }
}
