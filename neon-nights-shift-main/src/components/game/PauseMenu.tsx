import { GameState } from '@/types/game';
import { LEVELS } from '@/config/levels';

interface PauseMenuProps {
  gameState: GameState;
  onResume: () => void;
  onRestart: () => void;
  onQuit: () => void;
}

export function PauseMenu({ gameState, onResume, onRestart, onQuit }: PauseMenuProps) {
  const level = LEVELS[gameState.currentLevel - 1];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/90 backdrop-blur-sm animate-fade-in">
      <div className="minigame-container p-8 max-w-sm w-full mx-4">
        <div className="text-center mb-8">
          <span className="text-4xl mb-4 block">⏸️</span>
          <h2 className="font-arcade text-2xl neon-text-cyan mb-2">PAUSED</h2>
          <p className="text-muted-foreground">{level.name}</p>
        </div>

        {/* Current stats */}
        <div className="grid grid-cols-2 gap-4 mb-8">
          <div className="hud-panel text-center">
            <div className="text-xs text-muted-foreground uppercase">Score</div>
            <div className="score-display text-lg">{gameState.score.toLocaleString()}</div>
          </div>
          <div className="hud-panel text-center">
            <div className="text-xs text-muted-foreground uppercase">Max Combo</div>
            <div className="combo-display text-lg">x{gameState.maxCombo}</div>
          </div>
        </div>

        {/* Menu buttons */}
        <div className="flex flex-col gap-3">
          <button
            onClick={onResume}
            className="arcade-button py-4 px-6 rounded-lg text-lg"
          >
            ▶ RESUME
          </button>
          
          <button
            onClick={onRestart}
            className="arcade-button py-3 px-6 rounded-lg bg-gradient-to-r from-neon-orange/80 to-neon-magenta/80"
          >
            🔄 RESTART LEVEL
          </button>
          
          <button
            onClick={onQuit}
            className="py-3 px-6 rounded-lg border-2 border-muted text-muted-foreground
                     hover:border-destructive hover:text-destructive transition-colors"
          >
            🚪 QUIT TO MENU
          </button>
        </div>

        <p className="text-center text-xs text-muted-foreground mt-6">
          Press ESC to resume
        </p>
      </div>
    </div>
  );
}
