import React from 'react';
import { GameState } from '../../game/types';
import { LOOP_DURATION, MAX_LOOPS } from '../../game/constants';

interface GameUIProps {
  gameState: GameState;
}

export const GameUI: React.FC<GameUIProps> = ({ gameState }) => {
  const { player, loopNumber, timeRemaining, score } = gameState;
  const timePercent = (timeRemaining / LOOP_DURATION) * 100;
  const healthPercent = (player.health / player.maxHealth) * 100;
  const energyPercent = (player.energy / player.maxEnergy) * 100;
  
  return (
    <div className="absolute inset-0 pointer-events-none p-4">
      {/* Top bar */}
      <div className="flex justify-between items-start">
        {/* Loop counter */}
        <div className="game-panel p-3 pointer-events-auto">
          <div className="text-xs text-muted-foreground font-body uppercase tracking-wider">Loop</div>
          <div className="text-2xl font-display font-bold text-glow">
            {loopNumber} <span className="text-muted-foreground text-lg">/ {MAX_LOOPS}</span>
          </div>
        </div>
        
        {/* Timer */}
        <div className="game-panel p-3 min-w-[120px]">
          <div className="text-xs text-muted-foreground font-body uppercase tracking-wider text-center">Time</div>
          <div className="text-3xl font-display font-bold text-glow text-center">
            {Math.ceil(timeRemaining)}
          </div>
          <div className="h-2 bg-muted rounded-full mt-2 overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-primary to-secondary transition-all duration-200"
              style={{ width: `${timePercent}%` }}
            />
          </div>
        </div>
        
        {/* Score */}
        <div className="game-panel p-3 pointer-events-auto">
          <div className="text-xs text-muted-foreground font-body uppercase tracking-wider">Score</div>
          <div className="text-2xl font-display font-bold text-glow-accent">
            {score.toLocaleString()}
          </div>
        </div>
      </div>
      
      {/* Bottom bar - Health & Energy */}
      <div className="absolute bottom-4 left-4 right-4 flex gap-4">
        {/* Health */}
        <div className="game-panel p-3 flex-1">
          <div className="flex justify-between items-center mb-2">
            <span className="text-xs text-muted-foreground font-body uppercase tracking-wider">Health</span>
            <span className="font-display text-health text-sm">
              {Math.ceil(player.health)} / {player.maxHealth}
            </span>
          </div>
          <div className="h-3 bg-muted rounded-full overflow-hidden">
            <div 
              className="h-full transition-all duration-200 rounded-full"
              style={{ 
                width: `${healthPercent}%`,
                background: `linear-gradient(90deg, hsl(120 70% 45%) 0%, hsl(90 80% 50%) 100%)`,
                boxShadow: '0 0 10px hsl(120 70% 45% / 0.5)'
              }}
            />
          </div>
        </div>
        
        {/* Energy */}
        <div className="game-panel p-3 flex-1">
          <div className="flex justify-between items-center mb-2">
            <span className="text-xs text-muted-foreground font-body uppercase tracking-wider">Energy</span>
            <span className="font-display text-energy text-sm">
              {Math.ceil(player.energy)} / {player.maxEnergy}
            </span>
          </div>
          <div className="h-3 bg-muted rounded-full overflow-hidden">
            <div 
              className="h-full transition-all duration-200 rounded-full"
              style={{ 
                width: `${energyPercent}%`,
                background: `linear-gradient(90deg, hsl(45 100% 55%) 0%, hsl(30 100% 50%) 100%)`,
                boxShadow: '0 0 10px hsl(45 100% 55% / 0.5)'
              }}
            />
          </div>
        </div>
      </div>
      
      {/* Ghost count indicator */}
      {gameState.ghosts.length > 0 && (
        <div className="absolute top-20 left-4 game-panel p-2">
          <div className="text-xs text-muted-foreground font-body">Active Ghosts</div>
          <div className="flex gap-1 mt-1">
            {gameState.ghosts.map((ghost, i) => (
              <div 
                key={ghost.id}
                className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-display
                  ${ghost.isAlive ? 'bg-ghost/30 text-primary' : 'bg-muted text-muted-foreground'}`}
              >
                {i + 1}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
