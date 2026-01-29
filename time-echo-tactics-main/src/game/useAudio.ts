import { useCallback, useRef, useEffect } from 'react';

const createOscillator = (
  ctx: AudioContext,
  type: OscillatorType,
  frequency: number,
  duration: number,
  gainValue: number = 0.3
) => {
  const oscillator = ctx.createOscillator();
  const gainNode = ctx.createGain();
  
  oscillator.type = type;
  oscillator.frequency.setValueAtTime(frequency, ctx.currentTime);
  
  gainNode.gain.setValueAtTime(gainValue, ctx.currentTime);
  gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + duration);
  
  oscillator.connect(gainNode);
  gainNode.connect(ctx.destination);
  
  return { oscillator, gainNode };
};

export const useAudio = () => {
  const audioContextRef = useRef<AudioContext | null>(null);
  
  const getContext = useCallback(() => {
    if (!audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    return audioContextRef.current;
  }, []);
  
  const playShoot = useCallback(() => {
    const ctx = getContext();
    const { oscillator } = createOscillator(ctx, 'square', 800, 0.1, 0.15);
    oscillator.frequency.exponentialRampToValueAtTime(200, ctx.currentTime + 0.1);
    oscillator.start();
    oscillator.stop(ctx.currentTime + 0.1);
  }, [getContext]);
  
  const playHit = useCallback(() => {
    const ctx = getContext();
    const { oscillator } = createOscillator(ctx, 'sawtooth', 200, 0.15, 0.2);
    oscillator.frequency.exponentialRampToValueAtTime(50, ctx.currentTime + 0.15);
    oscillator.start();
    oscillator.stop(ctx.currentTime + 0.15);
  }, [getContext]);
  
  const playEnemyDeath = useCallback(() => {
    const ctx = getContext();
    const { oscillator } = createOscillator(ctx, 'square', 400, 0.2, 0.15);
    oscillator.frequency.exponentialRampToValueAtTime(100, ctx.currentTime + 0.2);
    oscillator.start();
    oscillator.stop(ctx.currentTime + 0.2);
  }, [getContext]);
  
  const playUpgrade = useCallback(() => {
    const ctx = getContext();
    const notes = [523.25, 659.25, 783.99]; // C5, E5, G5
    notes.forEach((freq, i) => {
      const { oscillator } = createOscillator(ctx, 'sine', freq, 0.3, 0.1);
      oscillator.start(ctx.currentTime + i * 0.1);
      oscillator.stop(ctx.currentTime + 0.3 + i * 0.1);
    });
  }, [getContext]);
  
  const playLoopStart = useCallback(() => {
    const ctx = getContext();
    const { oscillator } = createOscillator(ctx, 'sine', 440, 0.5, 0.2);
    oscillator.frequency.setValueAtTime(220, ctx.currentTime);
    oscillator.frequency.exponentialRampToValueAtTime(440, ctx.currentTime + 0.25);
    oscillator.start();
    oscillator.stop(ctx.currentTime + 0.5);
  }, [getContext]);
  
  const playGameOver = useCallback(() => {
    const ctx = getContext();
    const notes = [392, 349.23, 311.13, 261.63]; // G4, F4, Eb4, C4
    notes.forEach((freq, i) => {
      const { oscillator } = createOscillator(ctx, 'sawtooth', freq, 0.4, 0.15);
      oscillator.start(ctx.currentTime + i * 0.15);
      oscillator.stop(ctx.currentTime + 0.4 + i * 0.15);
    });
  }, [getContext]);
  
  const playVictory = useCallback(() => {
    const ctx = getContext();
    const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
    notes.forEach((freq, i) => {
      const { oscillator } = createOscillator(ctx, 'sine', freq, 0.5, 0.15);
      oscillator.start(ctx.currentTime + i * 0.15);
      oscillator.stop(ctx.currentTime + 0.5 + i * 0.15);
    });
  }, [getContext]);
  
  return {
    playShoot,
    playHit,
    playEnemyDeath,
    playUpgrade,
    playLoopStart,
    playGameOver,
    playVictory,
  };
};
