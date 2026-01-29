import { GameState } from '@/types/game';
import { LEVELS, getComboMultiplier } from '@/config/levels';

interface GameHUDProps {
  gameState: GameState;
  onPause: () => void;
}

export function GameHUD({ gameState, onPause }: GameHUDProps) {
  const level = LEVELS[gameState.currentLevel - 1];
  const timePercentage = (gameState.timeRemaining / level.duration) * 100;
  const isLowTime = timePercentage < 25;
  const comboMultiplier = getComboMultiplier(gameState.combo);

  return (
    <div className="absolute top-0 left-0 right-0 p-4 flex items-start justify-between gap-4 z-20">
      {/* Left: Level & Timer */}
      <div className="hud-panel min-w-[200px]">
        <div className="flex items-center justify-between mb-2">
          <span className="font-arcade text-xs neon-text-cyan">
            LEVEL {gameState.currentLevel}
          </span>
          <span className="font-arcade text-xs text-muted-foreground">
            {level.name}
          </span>
        </div>
        
        {/* Timer bar */}
        <div className="timer-bar">
          <div 
            className={`timer-bar-fill ${isLowTime ? 'warning' : ''}`}
            style={{ width: `${timePercentage}%` }}
          />
        </div>
        <div className="text-right mt-1">
          <span className={`font-arcade text-xs ${isLowTime ? 'neon-text-orange animate-beat-pulse' : 'text-muted-foreground'}`}>
            {Math.ceil(gameState.timeRemaining)}s
          </span>
        </div>
      </div>

      {/* Center: Score */}
      <div className="hud-panel text-center flex-shrink-0">
        <div className="text-xs text-muted-foreground mb-1 uppercase tracking-wider">Score</div>
        <div className="score-display text-3xl">
          {gameState.score.toLocaleString()}
        </div>
      </div>

      {/* Right: Combo & Pause */}
      <div className="flex items-start gap-2">
        {/* Combo */}
        <div className="hud-panel min-w-[100px] text-center">
          <div className="text-xs text-muted-foreground mb-1 uppercase tracking-wider">Combo</div>
          {gameState.combo > 0 ? (
            <div className="combo-display">
              x{gameState.combo}
              {comboMultiplier > 1 && (
                <span className="text-xs ml-1 text-neon-lime">
                  ({comboMultiplier}x)
                </span>
              )}
            </div>
          ) : (
            <div className="text-muted-foreground font-arcade text-sm">-</div>
          )}
        </div>

        {/* Pause Button */}
        <button
          onClick={onPause}
          className="hud-panel p-3 hover:bg-muted/50 transition-colors"
          aria-label="Pause game"
        >
          <span className="text-xl">⏸️</span>
        </button>
      </div>
    </div>
  );
}
