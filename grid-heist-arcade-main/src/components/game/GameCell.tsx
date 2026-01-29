import { motion } from 'framer-motion';
import { CellType, Position, Guard, Loot, Noise } from '@/types/game';
import { cn } from '@/lib/utils';

interface GameCellProps {
  cellType: CellType;
  position: Position;
  isPlayer: boolean;
  guard: Guard | null;
  loot: Loot | null;
  noise: Noise | null;
  isPlayerVisible: boolean;
  cellSize: number;
}

export const GameCell = ({
  cellType,
  position,
  isPlayer,
  guard,
  loot,
  noise,
  isPlayerVisible,
  cellSize,
}: GameCellProps) => {
  const getCellBackground = () => {
    switch (cellType) {
      case 'wall':
        return 'bg-game-wall border border-border/30';
      case 'exit':
        return 'bg-neon-green/20 border-2 border-neon-green';
      case 'keycard-door':
        return 'bg-neon-orange/20 border-2 border-neon-orange';
      default:
        return 'bg-game-floor border border-grid-line/50';
    }
  };

  const getGuardColor = (state: Guard['state']) => {
    switch (state) {
      case 'chase':
        return 'bg-neon-red';
      case 'investigate':
        return 'bg-neon-orange';
      case 'alert':
        return 'bg-neon-magenta';
      default:
        return 'bg-neon-red/70';
    }
  };

  return (
    <div
      className={cn(
        'relative flex items-center justify-center transition-colors',
        getCellBackground()
      )}
      style={{ width: cellSize, height: cellSize }}
    >
      {/* Noise/Smoke effect */}
      {noise && (
        <motion.div
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 0.6, scale: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-muted-foreground/40 rounded-full blur-sm"
        />
      )}

      {/* Loot */}
      {loot && !loot.collected && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1, rotate: [0, 10, -10, 0] }}
          transition={{ rotate: { repeat: Infinity, duration: 2 } }}
          className="absolute w-3/5 h-3/5 rounded-full bg-neon-gold box-glow-gold animate-pulse-neon"
        />
      )}

      {/* Exit marker */}
      {cellType === 'exit' && (
        <motion.div
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ repeat: Infinity, duration: 1.5 }}
          className="absolute inset-1 border-2 border-neon-green rounded box-glow-green flex items-center justify-center"
        >
          <span className="text-neon-green font-display text-xs font-bold">EXIT</span>
        </motion.div>
      )}

      {/* Guard */}
      {guard && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className={cn(
            'absolute w-4/5 h-4/5 rounded-sm flex items-center justify-center',
            getGuardColor(guard.state),
            guard.state === 'chase' && 'box-glow-magenta animate-pulse'
          )}
        >
          <div className="text-primary-foreground font-bold text-xs">G</div>
          {/* Vision cone indicator */}
          <div
            className="absolute -top-1 left-1/2 -translate-x-1/2 w-0 h-0"
            style={{
              borderLeft: '4px solid transparent',
              borderRight: '4px solid transparent',
              borderBottom: `6px solid ${guard.state === 'chase' ? 'hsl(var(--neon-red))' : 'hsl(var(--neon-orange)/0.5)'}`,
            }}
          />
        </motion.div>
      )}

      {/* Player */}
      {isPlayer && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className={cn(
            'absolute w-4/5 h-4/5 rounded-full bg-primary box-glow-cyan',
            !isPlayerVisible && 'opacity-50'
          )}
        >
          <motion.div
            animate={{ boxShadow: ['0 0 10px hsl(var(--primary))', '0 0 25px hsl(var(--primary))', '0 0 10px hsl(var(--primary))'] }}
            transition={{ repeat: Infinity, duration: 1.5 }}
            className="w-full h-full rounded-full flex items-center justify-center"
          >
            <div className="w-2 h-2 bg-primary-foreground rounded-full" />
          </motion.div>
        </motion.div>
      )}

      {/* Keycard door indicator */}
      {cellType === 'keycard-door' && (
        <div className="absolute inset-1 border-2 border-dashed border-neon-orange rounded flex items-center justify-center">
          <span className="text-neon-orange text-xs">🔒</span>
        </div>
      )}
    </div>
  );
};
