import React, { useEffect, useState, useCallback } from 'react';
import { useGameEngine } from '../../game/useGameEngine';
import { useAudio } from '../../game/useAudio';
import { GameCanvas } from './GameCanvas';
import { GameUI } from './GameUI';
import { TutorialOverlay } from './TutorialOverlay';
import { UpgradeScreen } from './UpgradeScreen';
import { GameOverScreen } from './GameOverScreen';
import { PauseMenu } from './PauseMenu';

export const Game: React.FC = () => {
  const [showTutorial, setShowTutorial] = useState(true);
  const {
    gameState,
    startGame,
    pauseGame,
    restartGame,
    applyUpgrade,
    handleKeyDown,
    handleKeyUp,
    handleMouseMove,
    handleMouseDown,
    handleMouseUp,
    update,
    appliedUpgrades,
  } = useGameEngine();
  
  const audio = useAudio();
  
  // Game loop
  useEffect(() => {
    if (!gameState.isPlaying || gameState.isPaused) return;
    
    const interval = setInterval(update, 1000 / 60);
    return () => clearInterval(interval);
  }, [gameState.isPlaying, gameState.isPaused, update]);
  
  // Keyboard events
  useEffect(() => {
    const handleDown = (e: KeyboardEvent) => {
      if (showTutorial) {
        setShowTutorial(false);
        startGame();
        audio.playLoopStart();
        return;
      }
      handleKeyDown(e);
    };
    
    window.addEventListener('keydown', handleDown);
    window.addEventListener('keyup', handleKeyUp);
    
    return () => {
      window.removeEventListener('keydown', handleDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [handleKeyDown, handleKeyUp, showTutorial, startGame, audio]);
  
  const handleStartFromTutorial = useCallback(() => {
    setShowTutorial(false);
    startGame();
    audio.playLoopStart();
  }, [startGame, audio]);
  
  const handleRestart = useCallback(() => {
    restartGame();
    setShowTutorial(true);
  }, [restartGame]);
  
  const handleUpgradeSelect = useCallback((upgrade: any) => {
    audio.playUpgrade();
    applyUpgrade(upgrade);
    audio.playLoopStart();
  }, [applyUpgrade, audio]);
  
  // Determine which screen to show
  const showUpgradeScreen = !gameState.isPlaying && 
    !gameState.isGameOver && 
    !gameState.isVictory && 
    !showTutorial &&
    gameState.loopNumber > 0;
  
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 select-none">
      <div className="relative">
        <GameCanvas
          gameState={gameState}
          onMouseMove={handleMouseMove}
          onMouseDown={handleMouseDown}
          onMouseUp={handleMouseUp}
        />
        
        {gameState.isPlaying && <GameUI gameState={gameState} />}
      </div>
      
      {/* Overlays */}
      {showTutorial && (
        <TutorialOverlay onClose={handleStartFromTutorial} />
      )}
      
      {showUpgradeScreen && (
        <UpgradeScreen
          loopNumber={gameState.loopNumber}
          appliedUpgrades={appliedUpgrades}
          onSelectUpgrade={handleUpgradeSelect}
        />
      )}
      
      {gameState.isPaused && (
        <PauseMenu onResume={pauseGame} onRestart={handleRestart} />
      )}
      
      {(gameState.isGameOver || gameState.isVictory) && (
        <GameOverScreen
          isVictory={gameState.isVictory}
          loopNumber={gameState.loopNumber}
          score={gameState.score}
          onRestart={handleRestart}
        />
      )}
      
      {/* Mobile controls hint */}
      <div className="mt-4 text-center text-muted-foreground text-sm font-body md:hidden">
        <p>Best played on desktop with keyboard & mouse</p>
      </div>
    </div>
  );
};
