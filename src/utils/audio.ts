/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Player } from '../types/game';

class SoundEngine {
  private ctx: AudioContext | null = null;
  private isMuted: boolean = false;
  private volume: number = 0.6;

  private initCtx() {
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
  }

  public setMuted(muted: boolean) {
    this.isMuted = muted;
  }

  public setVolume(vol: number) {
    this.volume = Math.max(0, Math.min(1, vol));
  }

  public getMuted() {
    return this.isMuted;
  }

  public getVolume() {
    return this.volume;
  }

  public playMove(player: Player) {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;
      // High-tech tactile pop + chime
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      const freq = player === 'X' ? 587.33 : 440.0; // D5 for X, A4 for O
      osc.type = player === 'X' ? 'triangle' : 'sine';
      osc.frequency.setValueAtTime(freq, now);
      osc.frequency.exponentialRampToValueAtTime(freq * 1.5, now + 0.08);

      gain.gain.setValueAtTime(0.001, now);
      gain.gain.linearRampToValueAtTime(0.25 * this.volume, now + 0.015);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.18);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.18);
    } catch {
      // AudioContext policy safe guard
    }
  }

  public playWin() {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;
      // Majestic 6-note victory fanfare
      const notes = [392.0, 523.25, 659.25, 783.99, 1046.5, 1318.51]; // G4, C5, E5, G5, C6, E6
      notes.forEach((freq, i) => {
        if (!this.ctx) return;
        const noteTime = now + i * 0.09;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = i >= 4 ? 'triangle' : 'sine';
        osc.frequency.setValueAtTime(freq, noteTime);

        gain.gain.setValueAtTime(0.001, noteTime);
        gain.gain.linearRampToValueAtTime(0.35 * this.volume, noteTime + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.0001, noteTime + (i === notes.length - 1 ? 0.9 : 0.28));

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(noteTime);
        osc.stop(noteTime + 0.95);
      });
    } catch {
      // safe fallback
    }
  }

  public playDraw() {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;
      // Balanced dramatic chord: two tones converging and resolving
      const tone1 = this.ctx.createOscillator();
      const tone2 = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      tone1.type = 'sine';
      tone2.type = 'triangle';

      tone1.frequency.setValueAtTime(440, now); // A4
      tone1.frequency.linearRampToValueAtTime(329.63, now + 0.4); // E4

      tone2.frequency.setValueAtTime(466.16, now); // A#4 minor clash
      tone2.frequency.linearRampToValueAtTime(329.63, now + 0.4); // Resolves to E4 in harmony

      gain.gain.setValueAtTime(0.001, now);
      gain.gain.linearRampToValueAtTime(0.3 * this.volume, now + 0.03);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.7);

      tone1.connect(gain);
      tone2.connect(gain);
      gain.connect(this.ctx.destination);

      tone1.start(now);
      tone2.start(now);
      tone1.stop(now + 0.75);
      tone2.stop(now + 0.75);
    } catch {
      // safe fallback
    }
  }

  public playTick() {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(880, now);

      gain.gain.setValueAtTime(0.001, now);
      gain.gain.linearRampToValueAtTime(0.12 * this.volume, now + 0.005);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.05);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.06);
    } catch {
      // safe fallback
    }
  }

  public playClick() {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(320, now);
      osc.frequency.exponentialRampToValueAtTime(160, now + 0.04);

      gain.gain.setValueAtTime(0.08 * this.volume, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.04);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.05);
    } catch {
      // safe fallback
    }
  }

  public playInfinityFade() {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(600, now);
      osc.frequency.exponentialRampToValueAtTime(200, now + 0.2);

      gain.gain.setValueAtTime(0.15 * this.volume, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.2);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.22);
    } catch {
      // safe fallback
    }
  }
}

export const soundEngine = new SoundEngine();
