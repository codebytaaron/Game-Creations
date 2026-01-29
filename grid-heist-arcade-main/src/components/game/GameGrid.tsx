import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { GameState } from '@/types/game';
import { GameCell } from './GameCell';

interface GameGridProps {
  gameState: GameState;
}

export const GameGrid = ({ gameState }: GameGridProps) => {
  const { level, player, noises } = gameState;
  const cellSize = Math.min(32, Math.floor(600 / Math.max(level.width, level.height)));

  const grid = useMemo(() => {
    const cells = [];
    for (let y = 0; y < level.height; y++) {
      for (let x = 0; x < level.width; x++) {
        const isPlayer = player.position.x === x && player.position.y === y;
        const guard = level.guards.find((g) => g.position.x === x && g.position.y === y) || null;
        const loot = level.loot.find((l) => l.position.x === x && l.position.y === y && !l.collected) || null;
        const noise = noises.find((n) => n.position.x === x && n.position.y === y) || null;

        cells.push(
          <GameCell
            key={`${x}-${y}`}
            cellType={level.grid[y][x]}
            position={{ x, y }}
            isPlayer={isPlayer}
            guard={guard}
            loot={loot}
            noise={noise}
            isPlayerVisible={!player.inSmoke}
            cellSize={cellSize}
          />
        );
      }
    }
    return cells;
  }, [level, player, noises, cellSize]);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="relative bg-grid-bg rounded-lg border-2 border-border p-2"
      style={{ boxShadow: '0 0 40px hsl(var(--primary) / 0.2)' }}
    >
      <div
        className="grid gap-0"
        style={{
          gridTemplateColumns: `repeat(${level.width}, ${cellSize}px)`,
          gridTemplateRows: `repeat(${level.height}, ${cellSize}px)`,
        }}
      >
        {grid}
      </div>
    </motion.div>
  );
};
