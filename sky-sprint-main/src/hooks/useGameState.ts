import { useState, useCallback, useRef, useEffect } from 'react';

export type GameScreen = 'menu' | 'playing' | 'paused' | 'gameOver';

interface GameSettings {
  soundEnabled: boolean;
  reducedMotion: boolean;
}

interface GameState {
  screen: GameScreen;
  score: number;
  bestScore: number;
  settings: GameSettings;
}

const BEST_SCORE_KEY = 'flappy_sprint_best_score';
const SETTINGS_KEY = 'flappy_sprint_settings';

const defaultSettings: GameSettings = {
  soundEnabled: true,
  reducedMotion: false,
};

export function useGameState() {
  const [state, setState] = useState<GameState>(() => {
    const savedBest = localStorage.getItem(BEST_SCORE_KEY);
    const savedSettings = localStorage.getItem(SETTINGS_KEY);
    
    return {
      screen: 'menu',
      score: 0,
      bestScore: savedBest ? parseInt(savedBest, 10) : 0,
      settings: savedSettings ? JSON.parse(savedSettings) : defaultSettings,
    };
  });

  const updateBestScore = useCallback((newScore: number) => {
    if (newScore > state.bestScore) {
      localStorage.setItem(BEST_SCORE_KEY, newScore.toString());
      setState(prev => ({ ...prev, bestScore: newScore }));
    }
  }, [state.bestScore]);

  const updateSettings = useCallback((newSettings: Partial<GameSettings>) => {
    setState(prev => {
      const updated = { ...prev.settings, ...newSettings };
      localStorage.setItem(SETTINGS_KEY, JSON.stringify(updated));
      return { ...prev, settings: updated };
    });
  }, []);

  const startGame = useCallback(() => {
    setState(prev => ({ ...prev, screen: 'playing', score: 0 }));
  }, []);

  const pauseGame = useCallback(() => {
    setState(prev => ({ ...prev, screen: 'paused' }));
  }, []);

  const resumeGame = useCallback(() => {
    setState(prev => ({ ...prev, screen: 'playing' }));
  }, []);

  const endGame = useCallback((finalScore: number) => {
    updateBestScore(finalScore);
    setState(prev => ({ ...prev, screen: 'gameOver', score: finalScore }));
  }, [updateBestScore]);

  const goToMenu = useCallback(() => {
    setState(prev => ({ ...prev, screen: 'menu', score: 0 }));
  }, []);

  const incrementScore = useCallback(() => {
    setState(prev => ({ ...prev, score: prev.score + 1 }));
  }, []);

  return {
    ...state,
    startGame,
    pauseGame,
    resumeGame,
    endGame,
    goToMenu,
    incrementScore,
    updateSettings,
  };
}
