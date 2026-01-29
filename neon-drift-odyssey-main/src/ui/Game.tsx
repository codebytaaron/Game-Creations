import { useGame } from '@/hooks/useGame';
import { GameCanvas } from './GameCanvas';
import { StartScreen } from './StartScreen';
import { HUD } from './HUD';
import { PauseOverlay } from './PauseOverlay';
import { GameOverScreen } from './GameOverScreen';

export function Game() {
  const {
    initEngine,
    gameState,
    settings,
    updateSettings,
    startGame,
    togglePause,
  } = useGame();
  
  return (
    <div className="relative w-full h-screen overflow-hidden bg-background">
      {/* Game Canvas - always rendered */}
      <GameCanvas
        onInit={initEngine}
        className="absolute inset-0"
      />
      
      {/* UI Overlays based on game state */}
      {gameState.status === 'menu' && (
        <StartScreen
          onPlay={() => startGame()}
          settings={settings}
          onSettingsChange={updateSettings}
          bestScore={gameState.bestScore}
        />
      )}
      
      {gameState.status === 'playing' && (
        <HUD gameState={gameState} />
      )}
      
      {gameState.status === 'paused' && (
        <>
          <HUD gameState={gameState} />
          <PauseOverlay onResume={togglePause} />
        </>
      )}
      
      {gameState.status === 'gameover' && (
        <GameOverScreen
          gameState={gameState}
          onPlayAgain={() => startGame()}
        />
      )}
    </div>
  );
}
