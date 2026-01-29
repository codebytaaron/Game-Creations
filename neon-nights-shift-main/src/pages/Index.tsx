import { useEffect, useState, useCallback } from 'react';
import { useGameState } from '@/hooks/useGameState';
import { MainMenu } from '@/components/game/MainMenu';
import { GameHUD } from '@/components/game/GameHUD';
import { TaskPanel } from '@/components/game/TaskPanel';
import { ClubCanvas } from '@/components/game/ClubCanvas';
import { PauseMenu } from '@/components/game/PauseMenu';
import { LevelComplete } from '@/components/game/LevelComplete';
import { GameOver } from '@/components/game/GameOver';
import { SettingsMenu } from '@/components/game/SettingsMenu';
import { Leaderboard } from '@/components/game/Leaderboard';
import { Tutorial } from '@/components/game/Tutorial';
import { MiniGameWrapper } from '@/components/game/MiniGameWrapper';
import { Task } from '@/types/game';

const Index = () => {
  const {
    gameState,
    profile,
    settings,
    highScores,
    setPhase,
    updateProfile,
    updateSettings,
    startLevel,
    startMiniGame,
    completeMiniGame,
    pauseGame,
    resumeGame,
    nextLevel,
    returnToMenu,
  } = useGameState();

  const [currentTask, setCurrentTask] = useState<Task | null>(null);

  // Keyboard handling for pause
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (gameState.phase === 'playing') {
          pauseGame();
        } else if (gameState.phase === 'paused') {
          resumeGame();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [gameState.phase, pauseGame, resumeGame]);

  // Handle task selection
  const handleTaskSelect = useCallback((task: Task) => {
    setCurrentTask(task);
    startMiniGame(task);
  }, [startMiniGame]);

  // Handle minigame completion
  const handleMiniGameComplete = useCallback((success: boolean) => {
    if (currentTask) {
      completeMiniGame(success, currentTask.id);
      setCurrentTask(null);
    }
  }, [currentTask, completeMiniGame]);

  // Apply colorblind mode class
  useEffect(() => {
    if (settings.colorblindMode) {
      document.body.classList.add('colorblind-mode');
    } else {
      document.body.classList.remove('colorblind-mode');
    }
  }, [settings.colorblindMode]);

  return (
    <div className="min-h-screen bg-background overflow-hidden select-none">
      {/* Main Menu */}
      {gameState.phase === 'menu' && (
        <MainMenu
          profile={profile}
          settings={settings}
          onStartTutorial={() => setPhase('tutorial')}
          onStartGame={startLevel}
          onOpenSettings={() => setPhase('settings')}
          onOpenLeaderboard={() => setPhase('leaderboard')}
          onUpdateProfile={updateProfile}
        />
      )}

      {/* Tutorial */}
      {gameState.phase === 'tutorial' && (
        <Tutorial onComplete={() => setPhase('menu')} />
      )}

      {/* Settings */}
      {gameState.phase === 'settings' && (
        <SettingsMenu
          settings={settings}
          profile={profile}
          onUpdateSettings={updateSettings}
          onUpdateProfile={updateProfile}
          onClose={() => setPhase('menu')}
        />
      )}

      {/* Leaderboard */}
      {gameState.phase === 'leaderboard' && (
        <Leaderboard
          highScores={highScores}
          onClose={() => setPhase('menu')}
        />
      )}

      {/* Game Screen */}
      {(gameState.phase === 'playing' || gameState.phase === 'paused' || gameState.phase === 'minigame') && (
        <div className="relative w-full h-screen">
          {/* Canvas background */}
          <ClubCanvas 
            gameState={gameState} 
            reducedMotion={settings.reducedMotion}
          />

          {/* HUD */}
          <GameHUD gameState={gameState} onPause={pauseGame} />

          {/* Task Panel */}
          {gameState.phase === 'playing' && (
            <TaskPanel
              tasks={gameState.activeTasks}
              onSelectTask={handleTaskSelect}
            />
          )}

          {/* Minigame Overlay */}
          {gameState.phase === 'minigame' && currentTask && (
            <MiniGameWrapper
              task={currentTask}
              level={gameState.currentLevel}
              onComplete={handleMiniGameComplete}
            />
          )}

          {/* Pause Menu */}
          {gameState.phase === 'paused' && (
            <PauseMenu
              gameState={gameState}
              onResume={resumeGame}
              onRestart={() => startLevel(gameState.currentLevel)}
              onQuit={returnToMenu}
            />
          )}
        </div>
      )}

      {/* Level Complete */}
      {gameState.phase === 'levelComplete' && (
        <LevelComplete
          gameState={gameState}
          onNextLevel={nextLevel}
          onReplay={() => startLevel(gameState.currentLevel)}
          onQuit={returnToMenu}
        />
      )}

      {/* Game Over */}
      {gameState.phase === 'gameOver' && (
        <GameOver
          gameState={gameState}
          highScores={highScores}
          onRestart={() => startLevel(1)}
          onQuit={returnToMenu}
        />
      )}
    </div>
  );
};

export default Index;
