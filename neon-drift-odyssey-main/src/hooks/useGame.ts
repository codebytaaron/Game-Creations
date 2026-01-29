import { useRef, useState, useCallback, useEffect } from 'react';
import { GameEngine, GameState, Difficulty } from '@/game/engine';
import { audio } from '@/game/audio';

export interface GameSettings {
  soundEnabled: boolean;
  screenShakeEnabled: boolean;
  difficulty: Difficulty;
}

const DEFAULT_SETTINGS: GameSettings = {
  soundEnabled: true,
  screenShakeEnabled: true,
  difficulty: 'standard',
};

function loadSettings(): GameSettings {
  try {
    const saved = localStorage.getItem('neonDrift_settings');
    if (saved) {
      return { ...DEFAULT_SETTINGS, ...JSON.parse(saved) };
    }
  } catch {
    // Ignore
  }
  return DEFAULT_SETTINGS;
}

function saveSettings(settings: GameSettings): void {
  try {
    localStorage.setItem('neonDrift_settings', JSON.stringify(settings));
  } catch {
    // Ignore
  }
}

export function useGame() {
  const engineRef = useRef<GameEngine | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  
  const [gameState, setGameState] = useState<GameState>({
    status: 'menu',
    score: 0,
    bestScore: 0,
    time: 0,
    speed: 3.5,
    difficulty: 'standard',
    seed: 0,
    screenShakeEnabled: true,
    shieldTimer: 0,
  });
  
  const [settings, setSettings] = useState<GameSettings>(loadSettings);
  
  const initEngine = useCallback((canvas: HTMLCanvasElement) => {
    canvasRef.current = canvas;
    
    if (engineRef.current) {
      engineRef.current.destroy();
    }
    
    const engine = new GameEngine(canvas, setGameState);
    engine.setDifficulty(settings.difficulty);
    engine.setScreenShake(settings.screenShakeEnabled);
    engine.setSoundEnabled(settings.soundEnabled);
    
    engineRef.current = engine;
    
    const handleResize = () => engine.resize();
    window.addEventListener('resize', handleResize);
    
    return () => {
      window.removeEventListener('resize', handleResize);
      engine.destroy();
    };
  }, [settings]);
  
  const startGame = useCallback((seed?: number) => {
    if (engineRef.current) {
      audio.click();
      engineRef.current.start(seed);
    }
  }, []);
  
  const togglePause = useCallback(() => {
    if (engineRef.current) {
      engineRef.current.togglePause();
    }
  }, []);
  
  const updateSettings = useCallback((newSettings: Partial<GameSettings>) => {
    setSettings(prev => {
      const updated = { ...prev, ...newSettings };
      saveSettings(updated);
      
      if (engineRef.current) {
        if (newSettings.difficulty !== undefined) {
          engineRef.current.setDifficulty(newSettings.difficulty);
        }
        if (newSettings.screenShakeEnabled !== undefined) {
          engineRef.current.setScreenShake(newSettings.screenShakeEnabled);
        }
        if (newSettings.soundEnabled !== undefined) {
          engineRef.current.setSoundEnabled(newSettings.soundEnabled);
        }
      }
      
      return updated;
    });
  }, []);
  
  // Sync settings with audio
  useEffect(() => {
    audio.setEnabled(settings.soundEnabled);
  }, [settings.soundEnabled]);
  
  return {
    canvasRef,
    initEngine,
    gameState,
    settings,
    updateSettings,
    startGame,
    togglePause,
  };
}
