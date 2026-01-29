import { GameState, HighScore } from '@/types/game';
import { LEVELS } from '@/config/levels';

interface GameOverProps {
  gameState: GameState;
  highScores: HighScore[];
  onRestart: () => void;
  onQuit: () => void;
}

export function GameOver({ gameState, highScores, onRestart, onQuit }: GameOverProps) {
  const level = LEVELS[gameState.currentLevel - 1];
  const stats = gameState.stats;
  
  // Check if new high score
  const isNewHighScore = highScores.length > 0 && 
    gameState.score === highScores[0]?.score && 
    gameState.score > 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/95 backdrop-blur-sm">
      <div className="minigame-container p-8 max-w-md w-full mx-4 animate-slide-in">
        {/* Header */}
        <div className="text-center mb-6">
          <span className="text-5xl mb-4 block">🌙</span>
          <h2 className="font-arcade text-2xl neon-text-magenta mb-2">GAME OVER</h2>
          <p className="text-muted-foreground">Thanks for keeping the club running!</p>
        </div>

        {/* New High Score */}
        {isNewHighScore && (
          <div className="text-center mb-6 py-4 border-2 border-neon-lime rounded-lg bg-neon-lime/10 animate-beat-pulse">
            <span className="text-2xl">🏆</span>
            <p className="font-arcade text-lg neon-text-lime mt-2">NEW HIGH SCORE!</p>
          </div>
        )}

        {/* Final Stats */}
        <div className="space-y-4 mb-8">
          <div className="hud-panel text-center">
            <div className="text-xs text-muted-foreground uppercase">Final Score</div>
            <div className="score-display text-3xl">{gameState.score.toLocaleString()}</div>
          </div>
          
          <div className="grid grid-cols-3 gap-3">
            <div className="hud-panel text-center py-3">
              <div className="text-xs text-muted-foreground uppercase mb-1">Level</div>
              <div className="text-lg font-bold text-foreground">{level.name}</div>
            </div>
            <div className="hud-panel text-center py-3">
              <div className="text-xs text-muted-foreground uppercase mb-1">Max Combo</div>
              <div className="combo-display">x{gameState.maxCombo}</div>
            </div>
            <div className="hud-panel text-center py-3">
              <div className="text-xs text-muted-foreground uppercase mb-1">Tasks</div>
              <div className="text-lg font-bold">
                <span className="text-neon-lime">{stats.tasksCompleted}</span>
                <span className="text-muted-foreground">/</span>
                <span className="text-destructive">{stats.tasksFailed}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Top Scores Preview */}
        {highScores.length > 0 && (
          <div className="mb-6">
            <h3 className="font-arcade text-sm neon-text-cyan mb-3 text-center">TOP SCORES</h3>
            <div className="space-y-2">
              {highScores.slice(0, 3).map((score, idx) => (
                <div 
                  key={idx}
                  className={`flex items-center justify-between px-4 py-2 rounded bg-muted/30
                    ${score.score === gameState.score && isNewHighScore ? 'border border-neon-lime' : ''}
                  `}
                >
                  <span className="font-arcade text-xs">
                    {idx === 0 ? '🥇' : idx === 1 ? '🥈' : '🥉'} {score.name}
                  </span>
                  <span className="score-display text-sm">{score.score.toLocaleString()}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Buttons */}
        <div className="flex flex-col gap-3">
          <button
            onClick={onRestart}
            className="arcade-button py-4 px-6 rounded-lg text-lg"
          >
            🔄 TRY AGAIN
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
