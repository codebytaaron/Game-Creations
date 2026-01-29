import { useCallback, useRef, useEffect } from 'react';

// Simple audio generation using Web Audio API
export function useAudio(enabled: boolean) {
  const audioContextRef = useRef<AudioContext | null>(null);

  const getAudioContext = useCallback(() => {
    if (!audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    return audioContextRef.current;
  }, []);

  const playTone = useCallback((frequency: number, duration: number, type: OscillatorType = 'sine', volume: number = 0.3) => {
    if (!enabled) return;
    
    try {
      const ctx = getAudioContext();
      const oscillator = ctx.createOscillator();
      const gainNode = ctx.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(ctx.destination);
      
      oscillator.type = type;
      oscillator.frequency.setValueAtTime(frequency, ctx.currentTime);
      
      gainNode.gain.setValueAtTime(volume, ctx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + duration);
      
      oscillator.start(ctx.currentTime);
      oscillator.stop(ctx.currentTime + duration);
    } catch (e) {
      console.log('Audio not supported');
    }
  }, [enabled, getAudioContext]);

  const playFlap = useCallback(() => {
    playTone(400, 0.1, 'sine', 0.2);
    setTimeout(() => playTone(500, 0.08, 'sine', 0.15), 50);
  }, [playTone]);

  const playScore = useCallback(() => {
    playTone(600, 0.1, 'sine', 0.25);
    setTimeout(() => playTone(800, 0.15, 'sine', 0.2), 80);
  }, [playTone]);

  const playHit = useCallback(() => {
    playTone(200, 0.2, 'square', 0.3);
    playTone(150, 0.3, 'square', 0.2);
  }, [playTone]);

  const vibrate = useCallback((pattern: number | number[]) => {
    if ('vibrate' in navigator) {
      navigator.vibrate(pattern);
    }
  }, []);

  return {
    playFlap,
    playScore,
    playHit,
    vibrate,
  };
}
