import React, { useEffect, useCallback } from 'react';
import { useGameState } from '@/hooks/useGameState';
import { GameCanvas } from './GameCanvas';
import { StartScreen } from './StartScreen';
import { GameHUD } from './GameHUD';
import { PauseOverlay } from './PauseOverlay';
import { GameOverScreen } from './GameOverScreen';

export function FlappySprintGame() {
  const {
    screen,
    score,
    bestScore,
    settings,
    startGame,
    pauseGame,
    resumeGame,
    endGame,
    goToMenu,
    incrementScore,
    updateSettings,
  } = useGameState();

  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'KeyP') {
        if (screen === 'playing') {
          pauseGame();
        } else if (screen === 'paused') {
          resumeGame();
        }
      }
      
      if (e.code === 'KeyR') {
        if (screen === 'paused' || screen === 'gameOver') {
          startGame();
        }
      }
      
      if (e.code === 'Space' && screen === 'gameOver') {
        e.preventDefault();
        startGame();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [screen, pauseGame, resumeGame, startGame]);

  const handleSoundToggle = useCallback(() => {
    updateSettings({ soundEnabled: !settings.soundEnabled });
  }, [settings.soundEnabled, updateSettings]);

  const handleReducedMotionToggle = useCallback(() => {
    updateSettings({ reducedMotion: !settings.reducedMotion });
  }, [settings.reducedMotion, updateSettings]);

  const isNewBest = score === bestScore && score > 0;

  return (
    <div className="relative w-full h-screen overflow-hidden bg-gradient-to-b from-sky-400 to-orange-100">
      {/* Game Canvas - Always rendered for background */}
      <GameCanvas
        isPlaying={screen === 'playing' || screen === 'paused'}
        isPaused={screen === 'paused'}
        soundEnabled={settings.soundEnabled}
        reducedMotion={settings.reducedMotion}
        onScore={incrementScore}
        onGameOver={endGame}
        score={score}
      />

      {/* Start Screen */}
      {screen === 'menu' && (
        <StartScreen
          onPlay={startGame}
          bestScore={bestScore}
          soundEnabled={settings.soundEnabled}
          reducedMotion={settings.reducedMotion}
          onSoundToggle={handleSoundToggle}
          onReducedMotionToggle={handleReducedMotionToggle}
        />
      )}

      {/* In-Game HUD */}
      {screen === 'playing' && (
        <GameHUD
          score={score}
          onPause={pauseGame}
          soundEnabled={settings.soundEnabled}
          onSoundToggle={handleSoundToggle}
        />
      )}

      {/* Pause Overlay */}
      {screen === 'paused' && (
        <PauseOverlay
          onResume={resumeGame}
          onRestart={startGame}
          onQuit={goToMenu}
        />
      )}

      {/* Game Over Screen */}
      {screen === 'gameOver' && (
        <GameOverScreen
          score={score}
          bestScore={bestScore}
          isNewBest={isNewBest}
          onPlayAgain={startGame}
          onMenu={goToMenu}
        />
      )}
    </div>
  );
}
