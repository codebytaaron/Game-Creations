import { useEffect, useCallback, useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import { useGameState } from '@/hooks/useGameState';
import { MainMenu } from './MainMenu';
import { GameGrid } from './GameGrid';
import { GameHUD } from './GameHUD';
import { GameMessage } from './GameMessage';
import { PauseMenu } from './PauseMenu';
import { GameOverScreen } from './GameOverScreen';
import { Direction, Tool } from '@/types/game';

type GameScreen = 'menu' | 'playing';

export const Game = () => {
  const [screen, setScreen] = useState<GameScreen>('menu');
  const {
    gameState,
    stats,
    highScore,
    initGame,
    nextLevel,
    movePlayer,
    useTool,
    togglePause,
  } = useGameState();

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (!gameState) return;

      // Pause toggle
      if (e.key === 'Escape') {
        e.preventDefault();
        togglePause();
        return;
      }

      if (gameState.gameStatus !== 'playing') return;

      // Movement
      const keyToDirection: Record<string, Direction> = {
        ArrowUp: 'up',
        ArrowDown: 'down',
        ArrowLeft: 'left',
        ArrowRight: 'right',
        w: 'up',
        W: 'up',
        s: 'down',
        S: 'down',
        a: 'left',
        A: 'left',
        d: 'right',
        D: 'right',
      };

      const direction = keyToDirection[e.key];
      if (direction) {
        e.preventDefault();
        movePlayer(direction);
        return;
      }

      // Tool hotkeys
      const keyToTool: Record<string, Tool['id']> = {
        '1': 'smokebomb',
        '2': 'decoy',
        '3': 'keycard',
      };

      const toolId = keyToTool[e.key];
      if (toolId) {
        e.preventDefault();
        useTool(toolId);
      }
    },
    [gameState, movePlayer, useTool, togglePause]
  );

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  const handleStartGame = () => {
    initGame(false);
    setScreen('playing');
  };

  const handleStartTutorial = () => {
    initGame(true);
    setScreen('playing');
  };

  const handleMainMenu = () => {
    setScreen('menu');
  };

  const handleRestart = () => {
    initGame(false);
  };

  if (screen === 'menu') {
    return (
      <MainMenu
        highScore={highScore}
        onStartGame={handleStartGame}
        onStartTutorial={handleStartTutorial}
      />
    );
  }

  if (!gameState) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-primary font-display text-2xl animate-pulse">
          Loading...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4 overflow-hidden relative">
      {/* Background grid */}
      <div className="absolute inset-0 grid-pattern opacity-10" />

      <div className="relative z-10 flex gap-8 items-start">
        {/* Game Area */}
        <div className="relative">
          <GameMessage message={gameState.message} type={gameState.messageType} />
          <GameGrid gameState={gameState} />
        </div>

        {/* HUD */}
        <GameHUD
          gameState={gameState}
          stats={stats}
          highScore={highScore}
          onUseTool={useTool}
        />
      </div>

      {/* Pause Menu */}
      <AnimatePresence>
        {gameState.gameStatus === 'paused' && (
          <PauseMenu onResume={togglePause} onMainMenu={handleMainMenu} />
        )}
      </AnimatePresence>

      {/* Game Over / Level Complete */}
      <AnimatePresence>
        {(gameState.gameStatus === 'won' || gameState.gameStatus === 'lost') && (
          <GameOverScreen
            won={gameState.gameStatus === 'won'}
            stats={stats}
            score={gameState.score}
            highScore={highScore}
            onNextLevel={nextLevel}
            onRestart={handleRestart}
            onMainMenu={handleMainMenu}
          />
        )}
      </AnimatePresence>
    </div>
  );
};
