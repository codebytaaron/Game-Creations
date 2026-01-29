import { GameState } from '@/types/game';
import { LEVELS } from '@/config/levels';

interface LevelCompleteProps {
  gameState: GameState;
  onNextLevel: () => void;
  onReplay: () => void;
  onQuit: () => void;
}

export function LevelComplete({ gameState, onNextLevel, onReplay, onQuit }: LevelCompleteProps) {
  const level = LEVELS[gameState.currentLevel - 1];
  const hasNextLevel = gameState.currentLevel < LEVELS.length;
  const stats = gameState.stats;

  // Calculate grade
  const getGrade = () => {
    const taskSuccessRate = stats.tasksCompleted / (stats.tasksCompleted + stats.tasksFailed);
    if (taskSuccessRate >= 0.95 && gameState.maxCombo >= 10) return { grade: 'S', color: 'neon-text-lime' };
    if (taskSuccessRate >= 0.85 && gameState.maxCombo >= 5) return { grade: 'A', color: 'neon-text-cyan' };
    if (taskSuccessRate >= 0.7) return { grade: 'B', color: 'neon-text-magenta' };
    if (taskSuccessRate >= 0.5) return { grade: 'C', color: 'neon-text-orange' };
    return { grade: 'D', color: 'text-muted-foreground' };
  };

  const { grade, color } = getGrade();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/95 backdrop-blur-sm">
      <div className="minigame-container p-8 max-w-md w-full mx-4 animate-slide-in">
        {/* Celebration */}
        <div className="text-center mb-6">
          <span className="text-5xl mb-4 block animate-float">🎉</span>
          <h2 className="font-arcade text-2xl neon-text-lime mb-2">LEVEL COMPLETE!</h2>
          <p className="text-lg text-foreground font-orbitron font-bold">{level.name}</p>
        </div>

        {/* Grade */}
        <div className="text-center mb-6">
          <div className="inline-block hud-panel px-8 py-4">
            <div className="text-xs text-muted-foreground uppercase mb-1">Grade</div>
            <div className={`font-arcade text-5xl ${color}`}>{grade}</div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-4 mb-8">
          <div className="hud-panel text-center">
            <div className="text-xs text-muted-foreground uppercase">Score</div>
            <div className="score-display text-xl">{gameState.score.toLocaleString()}</div>
          </div>
          <div className="hud-panel text-center">
            <div className="text-xs text-muted-foreground uppercase">Max Combo</div>
            <div className="combo-display text-xl">x{gameState.maxCombo}</div>
          </div>
          <div className="hud-panel text-center">
            <div className="text-xs text-muted-foreground uppercase">Tasks Done</div>
            <div className="text-lg font-bold text-foreground">{stats.tasksCompleted}</div>
          </div>
          <div className="hud-panel text-center">
            <div className="text-xs text-muted-foreground uppercase">Tasks Failed</div>
            <div className="text-lg font-bold text-destructive">{stats.tasksFailed}</div>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex flex-col gap-3">
          {hasNextLevel ? (
            <button
              onClick={onNextLevel}
              className="arcade-button py-4 px-6 rounded-lg text-lg"
            >
              ▶ NEXT LEVEL
            </button>
          ) : (
            <div className="text-center py-4 neon-text-lime font-arcade">
              🏆 ALL LEVELS COMPLETE! 🏆
            </div>
          )}
          
          <button
            onClick={onReplay}
            className="arcade-button py-3 px-6 rounded-lg bg-gradient-to-r from-neon-orange/80 to-neon-magenta/80"
          >
            🔄 REPLAY LEVEL
          </button>
          
          <button
            onClick={onQuit}
            className="py-3 px-6 rounded-lg border-2 border-muted text-muted-foreground
                     hover:border-primary hover:text-primary transition-colors"
          >
            🏠 MAIN MENU
          </button>
        </div>
      </div>
    </div>
  );
}
