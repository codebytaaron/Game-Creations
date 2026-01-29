import { GameState } from '@/game/engine';

interface HUDProps {
  gameState: GameState;
}

export function HUD({ gameState }: HUDProps) {
  const { score, bestScore, speed, shieldTimer } = gameState;
  const shieldTimeLeft = Math.ceil(shieldTimer / 1000);
  
  return (
    <div className="absolute top-0 left-0 right-0 p-4 pointer-events-none">
      <div className="max-w-2xl mx-auto flex justify-between items-start">
        {/* Score */}
        <div className="space-y-1">
          <div className="font-display text-3xl md:text-4xl text-primary glow-cyan tabular-nums">
            {score.toLocaleString()}
          </div>
          <div className="font-body text-sm text-muted-foreground">
            Best: <span className="text-foreground">{bestScore.toLocaleString()}</span>
          </div>
        </div>
        
        {/* Right side info */}
        <div className="text-right space-y-2">
          {/* Speed multiplier */}
          <div className="font-body">
            <span className="text-muted-foreground text-sm">Speed </span>
            <span className="font-display text-xl text-neon-pink glow-pink">
              {speed.toFixed(1)}x
            </span>
          </div>
          
          {/* Shield timer */}
          {shieldTimeLeft > 0 && (
            <div className="font-body flex items-center justify-end gap-2">
              <span className="text-neon-green text-sm">⛨ Shield</span>
              <span className="font-display text-xl text-neon-green glow-green">
                {shieldTimeLeft}s
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
