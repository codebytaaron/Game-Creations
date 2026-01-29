import React from 'react';
import { GameState } from '@/lib/gameTypes';
import { Play, RotateCcw, Home, Volume2, VolumeX } from 'lucide-react';

interface PauseMenuProps {
  gameState: GameState;
  onResume: () => void;
  onRestart: () => void;
  onMenu: () => void;
  soundEnabled: boolean;
  onToggleSound: () => void;
}

export const PauseMenu: React.FC<PauseMenuProps> = ({
  gameState,
  onResume,
  onRestart,
  onMenu,
  soundEnabled,
  onToggleSound,
}) => {
  return (
    <div className="absolute inset-0 bg-background/80 backdrop-blur-md flex items-center justify-center z-50">
      <div className="text-center space-y-6 p-8 rounded-2xl bg-card/50 border border-border backdrop-blur-sm max-w-md w-full mx-4">
        <h2 className="text-4xl font-display font-bold text-primary neon-text">
          PAUSED
        </h2>
        
        {/* Current stats */}
        <div className="grid grid-cols-3 gap-4 py-4 border-y border-border">
          <div>
            <div className="text-muted-foreground text-xs font-mono">WAVE</div>
            <div className="text-xl font-display text-secondary neon-text-magenta">
              {gameState.wave}
            </div>
          </div>
          <div>
            <div className="text-muted-foreground text-xs font-mono">SCORE</div>
            <div className="text-xl font-display text-primary neon-text">
              {gameState.score.toLocaleString()}
            </div>
          </div>
          <div>
            <div className="text-muted-foreground text-xs font-mono">LEVEL</div>
            <div className="text-xl font-display text-foreground">
              {gameState.level}
            </div>
          </div>
        </div>
        
        {/* Actions */}
        <div className="space-y-3">
          <button
            onClick={onResume}
            className="w-full flex items-center justify-center gap-3 px-6 py-3 rounded-lg neon-button font-display"
          >
            <Play className="w-5 h-5 text-primary" />
            <span className="text-primary">RESUME</span>
          </button>
          
          <button
            onClick={onRestart}
            className="w-full flex items-center justify-center gap-3 px-6 py-3 rounded-lg bg-muted/50 border border-border hover:bg-muted transition-colors font-display"
          >
            <RotateCcw className="w-5 h-5 text-foreground" />
            <span className="text-foreground">RESTART</span>
          </button>
          
          <button
            onClick={onMenu}
            className="w-full flex items-center justify-center gap-3 px-6 py-3 rounded-lg bg-muted/50 border border-border hover:bg-muted transition-colors font-display"
          >
            <Home className="w-5 h-5 text-muted-foreground" />
            <span className="text-muted-foreground">MAIN MENU</span>
          </button>
        </div>
        
        {/* Sound toggle */}
        <button
          onClick={onToggleSound}
          className="flex items-center justify-center gap-2 mx-auto text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          {soundEnabled ? (
            <>
              <Volume2 className="w-4 h-4" />
              <span className="font-mono">SOUND ON</span>
            </>
          ) : (
            <>
              <VolumeX className="w-4 h-4" />
              <span className="font-mono">SOUND OFF</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};
