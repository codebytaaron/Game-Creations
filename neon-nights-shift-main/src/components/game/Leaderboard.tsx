import { HighScore } from '@/types/game';

interface LeaderboardProps {
  highScores: HighScore[];
  onClose: () => void;
}

export function Leaderboard({ highScores, onClose }: LeaderboardProps) {
  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/95 backdrop-blur-sm animate-fade-in">
      <div className="minigame-container p-8 max-w-md w-full mx-4">
        <div className="text-center mb-8">
          <span className="text-4xl mb-4 block">🏆</span>
          <h2 className="font-arcade text-2xl neon-text-orange">LEADERBOARD</h2>
        </div>

        {highScores.length > 0 ? (
          <div className="space-y-2 mb-8 max-h-[400px] overflow-y-auto">
            {highScores.map((score, idx) => (
              <div
                key={idx}
                className={`
                  flex items-center gap-4 p-4 rounded-lg border-2 transition-all
                  ${idx === 0 ? 'border-neon-lime bg-neon-lime/10' : ''}
                  ${idx === 1 ? 'border-neon-cyan bg-neon-cyan/5' : ''}
                  ${idx === 2 ? 'border-neon-magenta bg-neon-magenta/5' : ''}
                  ${idx > 2 ? 'border-border bg-muted/20' : ''}
                `}
              >
                {/* Rank */}
                <div className="text-2xl w-10 text-center">
                  {idx === 0 && '🥇'}
                  {idx === 1 && '🥈'}
                  {idx === 2 && '🥉'}
                  {idx > 2 && <span className="font-arcade text-sm text-muted-foreground">#{idx + 1}</span>}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="font-bold text-foreground truncate">{score.name}</div>
                  <div className="text-xs text-muted-foreground">
                    Level {score.level} • {formatDate(score.date)}
                  </div>
                </div>

                {/* Score */}
                <div className="score-display text-lg">
                  {score.score.toLocaleString()}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 mb-8">
            <span className="text-4xl mb-4 block">🎮</span>
            <p className="text-muted-foreground">No scores yet!</p>
            <p className="text-sm text-muted-foreground mt-2">Play a game to set the first record.</p>
          </div>
        )}

        <button
          onClick={onClose}
          className="w-full arcade-button py-4 px-6 rounded-lg"
        >
          ← BACK
        </button>
      </div>
    </div>
  );
}
