import React from 'react';
import { Play, RotateCcw, Home } from 'lucide-react';

interface PauseOverlayProps {
  onResume: () => void;
  onRestart: () => void;
  onQuit: () => void;
}

export function PauseOverlay({ onResume, onRestart, onQuit }: PauseOverlayProps) {
  return (
    <div className="absolute inset-0 flex items-center justify-center p-6 z-20 animate-fade-in">
      <div className="absolute inset-0 bg-foreground/40 backdrop-blur-md" />
      
      <div className="glass-panel rounded-3xl p-8 max-w-sm w-full relative z-10 animate-bounce-soft">
        <h2 className="text-3xl font-bold text-center mb-8 text-foreground">Paused</h2>
        
        <div className="space-y-4">
          <button
            onClick={onResume}
            className="btn-primary-game w-full flex items-center justify-center gap-3"
          >
            <Play className="w-5 h-5" fill="currentColor" />
            Resume
          </button>
          
          <button
            onClick={onRestart}
            className="btn-secondary-game w-full flex items-center justify-center gap-3"
          >
            <RotateCcw className="w-5 h-5" />
            Restart
          </button>
          
          <button
            onClick={onQuit}
            className="btn-secondary-game w-full flex items-center justify-center gap-3"
          >
            <Home className="w-5 h-5" />
            Quit to Menu
          </button>
        </div>
        
        <p className="text-center text-muted-foreground text-sm mt-6">
          Press P to resume
        </p>
      </div>
    </div>
  );
}
