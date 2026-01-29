import React from 'react';
import { GameState } from '@/lib/gameTypes';
import { Pause, Volume2, VolumeX } from 'lucide-react';

interface GameHUDProps {
  gameState: GameState;
  onPause: () => void;
  soundEnabled: boolean;
  onToggleSound: () => void;
}

export const GameHUD: React.FC<GameHUDProps> = ({
  gameState,
  onPause,
  soundEnabled,
  onToggleSound,
}) => {
  const { player, wave, score, xp, level, xpToNextLevel, skillPoints, timeElapsed } = gameState;
  
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="absolute inset-0 pointer-events-none">
      {/* Top bar */}
      <div className="absolute top-0 left-0 right-0 p-4 flex justify-between items-start">
        {/* Left - Stats */}
        <div className="space-y-2 pointer-events-auto">
          {/* Health */}
          <div className="flex items-center gap-2">
            <span className="text-neon-green text-sm font-mono w-16">HEALTH</span>
            <div className="w-32 h-3 bg-muted rounded-full overflow-hidden">
              <div
                className="h-full transition-all duration-300"
                style={{
                  width: `${(player.health / player.maxHealth) * 100}%`,
                  background: 'linear-gradient(90deg, hsl(0, 100%, 50%), hsl(0, 100%, 60%))',
                  boxShadow: '0 0 10px hsl(0, 100%, 50%, 0.5)',
                }}
              />
            </div>
            <span className="text-foreground text-sm font-mono w-16">
              {Math.ceil(player.health)}/{player.maxHealth}
            </span>
          </div>
          
          {/* Energy */}
          <div className="flex items-center gap-2">
            <span className="text-neon-yellow text-sm font-mono w-16">ENERGY</span>
            <div className="w-32 h-3 bg-muted rounded-full overflow-hidden">
              <div
                className="h-full transition-all duration-300"
                style={{
                  width: `${(player.energy / player.maxEnergy) * 100}%`,
                  background: 'linear-gradient(90deg, hsl(60, 100%, 40%), hsl(60, 100%, 50%))',
                  boxShadow: '0 0 10px hsl(60, 100%, 50%, 0.5)',
                }}
              />
            </div>
            <span className="text-foreground text-sm font-mono w-16">
              {Math.ceil(player.energy)}/{player.maxEnergy}
            </span>
          </div>
          
          {/* XP */}
          <div className="flex items-center gap-2">
            <span className="text-neon-cyan text-sm font-mono w-16">XP</span>
            <div className="w-32 h-3 bg-muted rounded-full overflow-hidden">
              <div
                className="h-full transition-all duration-300"
                style={{
                  width: `${(xp / xpToNextLevel) * 100}%`,
                  background: 'linear-gradient(90deg, hsl(180, 100%, 40%), hsl(300, 100%, 50%))',
                  boxShadow: '0 0 10px hsl(180, 100%, 50%, 0.5)',
                }}
              />
            </div>
            <span className="text-foreground text-sm font-mono w-16">
              LV.{level}
            </span>
          </div>
        </div>
        
        {/* Right - Wave and Score */}
        <div className="flex items-start gap-4 pointer-events-auto">
          <div className="text-right">
            <div className="text-muted-foreground text-xs font-mono">WAVE</div>
            <div className="text-2xl font-display text-neon-magenta neon-text-magenta">{wave}</div>
          </div>
          <div className="text-right">
            <div className="text-muted-foreground text-xs font-mono">SCORE</div>
            <div className="text-2xl font-display text-primary neon-text">{score.toLocaleString()}</div>
          </div>
          <div className="text-right">
            <div className="text-muted-foreground text-xs font-mono">TIME</div>
            <div className="text-2xl font-display text-foreground">{formatTime(timeElapsed)}</div>
          </div>
          
          <div className="flex gap-2">
            <button
              onClick={onToggleSound}
              className="p-2 rounded-lg neon-button"
            >
              {soundEnabled ? (
                <Volume2 className="w-5 h-5 text-primary" />
              ) : (
                <VolumeX className="w-5 h-5 text-muted-foreground" />
              )}
            </button>
            <button
              onClick={onPause}
              className="p-2 rounded-lg neon-button"
            >
              <Pause className="w-5 h-5 text-primary" />
            </button>
          </div>
        </div>
      </div>
      
      {/* Bottom - Skill Points */}
      {skillPoints > 0 && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2">
          <div className="px-4 py-2 rounded-lg bg-card/80 border border-accent backdrop-blur-sm">
            <span className="text-accent font-display">
              +{skillPoints} SKILL POINT{skillPoints > 1 ? 'S' : ''}
            </span>
          </div>
        </div>
      )}
      
      {/* Controls hint */}
      <div className="absolute bottom-4 left-4 text-muted-foreground text-xs font-mono opacity-50">
        WASD / ARROWS to move • CLICK / SPACE to shoot • ESC to pause
      </div>
    </div>
  );
};
