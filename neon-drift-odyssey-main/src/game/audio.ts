/**
 * Web Audio API sound effects generator
 */
class AudioManager {
  private context: AudioContext | null = null;
  private enabled: boolean = true;
  private masterGain: GainNode | null = null;

  private getContext(): AudioContext {
    if (!this.context) {
      this.context = new AudioContext();
      this.masterGain = this.context.createGain();
      this.masterGain.connect(this.context.destination);
      this.masterGain.gain.value = 0.3;
    }
    return this.context;
  }

  setEnabled(enabled: boolean): void {
    this.enabled = enabled;
  }

  isEnabled(): boolean {
    return this.enabled;
  }

  private playTone(
    frequency: number,
    duration: number,
    type: OscillatorType = 'sine',
    attack: number = 0.01,
    decay: number = 0.1,
    volume: number = 0.5
  ): void {
    if (!this.enabled) return;

    try {
      const ctx = this.getContext();
      const oscillator = ctx.createOscillator();
      const gainNode = ctx.createGain();

      oscillator.type = type;
      oscillator.frequency.setValueAtTime(frequency, ctx.currentTime);

      gainNode.gain.setValueAtTime(0, ctx.currentTime);
      gainNode.gain.linearRampToValueAtTime(volume, ctx.currentTime + attack);
      gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);

      oscillator.connect(gainNode);
      gainNode.connect(this.masterGain!);

      oscillator.start(ctx.currentTime);
      oscillator.stop(ctx.currentTime + duration);
    } catch (e) {
      console.warn('Audio playback failed:', e);
    }
  }

  /**
   * UI click sound
   */
  click(): void {
    this.playTone(800, 0.08, 'sine', 0.005, 0.05, 0.2);
  }

  /**
   * Orb collection sound - pleasant chime
   */
  orbPickup(): void {
    if (!this.enabled) return;
    
    try {
      const ctx = this.getContext();
      const now = ctx.currentTime;

      // Play ascending notes
      [523.25, 659.25, 783.99].forEach((freq, i) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + i * 0.05);
        
        gain.gain.setValueAtTime(0, now + i * 0.05);
        gain.gain.linearRampToValueAtTime(0.3, now + i * 0.05 + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.05 + 0.15);
        
        osc.connect(gain);
        gain.connect(this.masterGain!);
        
        osc.start(now + i * 0.05);
        osc.stop(now + i * 0.05 + 0.2);
      });
    } catch (e) {
      console.warn('Audio playback failed:', e);
    }
  }

  /**
   * Shield activation sound - power up whoosh
   */
  shieldOn(): void {
    if (!this.enabled) return;

    try {
      const ctx = this.getContext();
      const now = ctx.currentTime;

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(200, now);
      osc.frequency.exponentialRampToValueAtTime(600, now + 0.2);

      gain.gain.setValueAtTime(0, now);
      gain.gain.linearRampToValueAtTime(0.3, now + 0.05);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.3);

      osc.connect(gain);
      gain.connect(this.masterGain!);

      osc.start(now);
      osc.stop(now + 0.4);
    } catch (e) {
      console.warn('Audio playback failed:', e);
    }
  }

  /**
   * Shield deactivation/hit sound
   */
  shieldOff(): void {
    if (!this.enabled) return;

    try {
      const ctx = this.getContext();
      const now = ctx.currentTime;

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(500, now);
      osc.frequency.exponentialRampToValueAtTime(150, now + 0.15);

      gain.gain.setValueAtTime(0.3, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.2);

      osc.connect(gain);
      gain.connect(this.masterGain!);

      osc.start(now);
      osc.stop(now + 0.3);
    } catch (e) {
      console.warn('Audio playback failed:', e);
    }
  }

  /**
   * Crash/game over sound
   */
  crash(): void {
    if (!this.enabled) return;

    try {
      const ctx = this.getContext();
      const now = ctx.currentTime;

      // Noise burst
      const bufferSize = ctx.sampleRate * 0.3;
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const data = buffer.getChannelData(0);
      
      for (let i = 0; i < bufferSize; i++) {
        data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (bufferSize * 0.3));
      }

      const noise = ctx.createBufferSource();
      noise.buffer = buffer;

      const noiseGain = ctx.createGain();
      noiseGain.gain.setValueAtTime(0.4, now);
      noiseGain.gain.exponentialRampToValueAtTime(0.001, now + 0.3);

      const filter = ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(2000, now);
      filter.frequency.exponentialRampToValueAtTime(200, now + 0.2);

      noise.connect(filter);
      filter.connect(noiseGain);
      noiseGain.connect(this.masterGain!);

      noise.start(now);

      // Add low rumble
      const osc = ctx.createOscillator();
      const oscGain = ctx.createGain();
      
      osc.type = 'sine';
      osc.frequency.setValueAtTime(80, now);
      osc.frequency.exponentialRampToValueAtTime(30, now + 0.3);
      
      oscGain.gain.setValueAtTime(0.3, now);
      oscGain.gain.exponentialRampToValueAtTime(0.001, now + 0.4);
      
      osc.connect(oscGain);
      oscGain.connect(this.masterGain!);
      
      osc.start(now);
      osc.stop(now + 0.5);
    } catch (e) {
      console.warn('Audio playback failed:', e);
    }
  }

  /**
   * Resume audio context (needed after user interaction)
   */
  resume(): void {
    if (this.context?.state === 'suspended') {
      this.context.resume();
    }
  }
}

export const audio = new AudioManager();
