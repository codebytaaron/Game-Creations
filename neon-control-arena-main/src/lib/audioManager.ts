// Web Audio API-based sound effects generator
class AudioManager {
  private audioContext: AudioContext | null = null;
  private masterVolume: number = 0.3;
  private enabled: boolean = true;

  private getContext(): AudioContext {
    if (!this.audioContext) {
      this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    return this.audioContext;
  }

  setVolume(volume: number) {
    this.masterVolume = Math.max(0, Math.min(1, volume));
  }

  setEnabled(enabled: boolean) {
    this.enabled = enabled;
  }

  private playTone(frequency: number, duration: number, type: OscillatorType = 'sine', volume: number = 1) {
    if (!this.enabled) return;
    
    try {
      const ctx = this.getContext();
      const oscillator = ctx.createOscillator();
      const gainNode = ctx.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(ctx.destination);
      
      oscillator.type = type;
      oscillator.frequency.setValueAtTime(frequency, ctx.currentTime);
      
      gainNode.gain.setValueAtTime(this.masterVolume * volume, ctx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + duration);
      
      oscillator.start(ctx.currentTime);
      oscillator.stop(ctx.currentTime + duration);
    } catch (e) {
      // Audio context not available
    }
  }

  shoot() {
    this.playTone(800, 0.1, 'square', 0.3);
    setTimeout(() => this.playTone(600, 0.05, 'square', 0.2), 20);
  }

  enemyHit() {
    this.playTone(300, 0.1, 'sawtooth', 0.4);
    this.playTone(200, 0.15, 'square', 0.2);
  }

  enemyDestroy() {
    this.playTone(150, 0.2, 'sawtooth', 0.5);
    setTimeout(() => this.playTone(100, 0.3, 'square', 0.3), 50);
  }

  playerHit() {
    this.playTone(200, 0.3, 'sawtooth', 0.6);
    this.playTone(150, 0.4, 'square', 0.4);
  }

  collectPowerup() {
    this.playTone(600, 0.1, 'sine', 0.4);
    setTimeout(() => this.playTone(800, 0.1, 'sine', 0.4), 100);
    setTimeout(() => this.playTone(1000, 0.15, 'sine', 0.3), 200);
  }

  captureNode() {
    for (let i = 0; i < 5; i++) {
      setTimeout(() => this.playTone(400 + i * 100, 0.15, 'sine', 0.3), i * 80);
    }
  }

  levelUp() {
    const notes = [523, 659, 784, 1047]; // C5, E5, G5, C6
    notes.forEach((note, i) => {
      setTimeout(() => this.playTone(note, 0.2, 'sine', 0.4), i * 100);
    });
  }

  waveStart() {
    this.playTone(200, 0.5, 'sine', 0.3);
    setTimeout(() => this.playTone(300, 0.5, 'sine', 0.3), 200);
    setTimeout(() => this.playTone(400, 0.5, 'sine', 0.3), 400);
  }

  gameOver() {
    const notes = [400, 350, 300, 200];
    notes.forEach((note, i) => {
      setTimeout(() => this.playTone(note, 0.4, 'sawtooth', 0.5), i * 200);
    });
  }

  buttonClick() {
    this.playTone(500, 0.05, 'square', 0.2);
  }

  pause() {
    this.playTone(400, 0.1, 'sine', 0.3);
    this.playTone(300, 0.15, 'sine', 0.2);
  }

  resume() {
    this.playTone(300, 0.1, 'sine', 0.3);
    this.playTone(400, 0.15, 'sine', 0.2);
  }
}

export const audioManager = new AudioManager();
