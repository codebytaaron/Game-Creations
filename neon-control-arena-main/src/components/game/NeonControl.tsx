import React, { useState, useEffect, useCallback } from 'react';
import { useGameState } from '@/hooks/useGameState';
import { GameCanvas } from './GameCanvas';
import { GameHUD } from './GameHUD';
import { MainMenu } from './MainMenu';
import { PauseMenu } from './PauseMenu';
import { GameOverScreen } from './GameOverScreen';
import { SkillTreeScreen } from './SkillTreeScreen';
import { audioManager } from '@/lib/audioManager';

export const NeonControl: React.FC = () => {
  const [dimensions, setDimensions] = useState({ width: 800, height: 600 });
  const [soundEnabled, setSoundEnabled] = useState(true);

  useEffect(() => {
    const updateDimensions = () => {
      const width = Math.min(window.innerWidth - 32, 1200);
      const height = Math.min(window.innerHeight - 32, 800);
      setDimensions({ width, height });
    };

    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    return () => window.removeEventListener('resize', updateDimensions);
  }, []);

  const {
    gameState,
    setGameState,
    startGame,
    pauseGame,
    resumeGame,
    openSkills,
    closeSkills,
    returnToMenu,
    gameOver,
    skillTree,
    unlockSkill,
    addXp,
    spawnWave,
    saveData,
    getPlayerStats,
  } = useGameState(dimensions.width, dimensions.height);

  const toggleSound = useCallback(() => {
    setSoundEnabled(prev => {
      audioManager.setEnabled(!prev);
      return !prev;
    });
  }, []);

  // Update arena dimensions when window resizes
  useEffect(() => {
    setGameState(prev => ({
      ...prev,
      arenaWidth: dimensions.width,
      arenaHeight: dimensions.height,
    }));
  }, [dimensions, setGameState]);

  if (gameState.status === 'menu') {
    return (
      <MainMenu
        saveData={saveData}
        skillPoints={gameState.skillPoints}
        onStart={startGame}
        onSkills={openSkills}
      />
    );
  }

  if (gameState.status === 'skills') {
    return (
      <SkillTreeScreen
        skillTree={skillTree}
        skillPoints={gameState.skillPoints}
        onUnlock={unlockSkill}
        onBack={closeSkills}
      />
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 game-canvas-container">
      <div className="relative rounded-lg overflow-hidden neon-border">
        <GameCanvas
          gameState={gameState}
          setGameState={setGameState}
          onGameOver={gameOver}
          onAddXp={addXp}
          onSpawnWave={spawnWave}
          getPlayerStats={getPlayerStats}
        />
        
        {gameState.status === 'playing' && (
          <GameHUD
            gameState={gameState}
            onPause={pauseGame}
            soundEnabled={soundEnabled}
            onToggleSound={toggleSound}
          />
        )}
        
        {gameState.status === 'paused' && (
          <PauseMenu
            gameState={gameState}
            onResume={resumeGame}
            onRestart={startGame}
            onMenu={returnToMenu}
            soundEnabled={soundEnabled}
            onToggleSound={toggleSound}
          />
        )}
        
        {gameState.status === 'gameover' && (
          <GameOverScreen
            gameState={gameState}
            saveData={saveData}
            onRestart={startGame}
            onMenu={returnToMenu}
          />
        )}
      </div>
    </div>
  );
};
