import { motion } from 'framer-motion';
import { GameState, GameStats, Tool } from '@/types/game';
import { cn } from '@/lib/utils';

interface GameHUDProps {
  gameState: GameState;
  stats: GameStats;
  highScore: number;
  onUseTool: (toolId: Tool['id']) => void;
}

export const GameHUD = ({ gameState, stats, highScore, onUseTool }: GameHUDProps) => {
  const alertPercentage = (gameState.alertMeter / gameState.maxAlertMeter) * 100;

  const getAlertColor = () => {
    if (alertPercentage >= 80) return 'bg-neon-red';
    if (alertPercentage >= 50) return 'bg-neon-orange';
    if (alertPercentage >= 25) return 'bg-neon-gold';
    return 'bg-neon-green';
  };

  return (
    <div className="flex flex-col gap-4 w-64">
      {/* Score */}
      <div className="bg-card rounded-lg p-4 border border-border">
        <h3 className="font-display text-primary text-sm mb-2">SCORE</h3>
        <div className="text-3xl font-display text-foreground text-glow-cyan">
          {gameState.score}
        </div>
        <div className="text-xs text-muted-foreground mt-1">
          High Score: {highScore}
        </div>
      </div>

      {/* Level Info */}
      <div className="bg-card rounded-lg p-4 border border-border">
        <h3 className="font-display text-primary text-sm mb-2">
          LEVEL {gameState.currentLevelNumber === 0 ? 'TUTORIAL' : gameState.currentLevelNumber}
        </h3>
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Turn:</span>
          <span className="text-foreground">{gameState.turn}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Loot:</span>
          <span className="text-neon-gold">
            {gameState.level.loot.filter((l) => l.collected).length}/{gameState.level.loot.length}
          </span>
        </div>
      </div>

      {/* Alert Meter */}
      <div className="bg-card rounded-lg p-4 border border-border">
        <h3 className="font-display text-secondary text-sm mb-2">ALERT LEVEL</h3>
        <div className="w-full h-4 bg-muted rounded-full overflow-hidden">
          <motion.div
            className={cn('h-full transition-colors', getAlertColor())}
            initial={{ width: 0 }}
            animate={{ width: `${alertPercentage}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>
        <div className="text-xs text-muted-foreground mt-1 text-right">
          {Math.round(alertPercentage)}%
        </div>
      </div>

      {/* Tools */}
      <div className="bg-card rounded-lg p-4 border border-border">
        <h3 className="font-display text-primary text-sm mb-3">TOOLS</h3>
        <div className="space-y-2">
          {gameState.player.tools.map((tool) => (
            <ToolButton key={tool.id} tool={tool} onUse={() => onUseTool(tool.id)} />
          ))}
        </div>
      </div>

      {/* Controls hint */}
      <div className="bg-card/50 rounded-lg p-3 border border-border/50">
        <h4 className="font-display text-xs text-muted-foreground mb-2">CONTROLS</h4>
        <div className="text-xs text-muted-foreground space-y-1">
          <div>↑ W / ↓ S / ← A / → D - Move</div>
          <div>1 / 2 / 3 - Use Tools</div>
          <div>ESC - Pause</div>
        </div>
      </div>
    </div>
  );
};

const ToolButton = ({ tool, onUse }: { tool: Tool; onUse: () => void }) => {
  const isAvailable = tool.currentCooldown === 0 && tool.charges > 0;

  const getToolIcon = () => {
    switch (tool.id) {
      case 'smokebomb':
        return '💨';
      case 'decoy':
        return '📢';
      case 'keycard':
        return '🔑';
    }
  };

  return (
    <button
      onClick={onUse}
      disabled={!isAvailable}
      className={cn(
        'w-full p-2 rounded border transition-all text-left',
        isAvailable
          ? 'bg-muted/50 border-primary/50 hover:border-primary hover:bg-muted cursor-pointer'
          : 'bg-muted/20 border-border/30 cursor-not-allowed opacity-50'
      )}
    >
      <div className="flex items-center gap-2">
        <span className="text-lg">{getToolIcon()}</span>
        <div className="flex-1">
          <div className="text-xs font-semibold text-foreground">{tool.name}</div>
          <div className="text-xs text-muted-foreground">
            {tool.currentCooldown > 0
              ? `Cooldown: ${tool.currentCooldown}`
              : `Charges: ${tool.charges}`}
          </div>
        </div>
      </div>
    </button>
  );
};
