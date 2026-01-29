import React from 'react';

interface PauseMenuProps {
  onResume: () => void;
  onRestart: () => void;
}

export const PauseMenu: React.FC<PauseMenuProps> = ({ onResume, onRestart }) => {
  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-50 fade-in">
      <div className="game-panel p-8 text-center">
        <h2 className="text-4xl font-display font-bold text-glow mb-8">PAUSED</h2>
        
        <div className="space-y-4">
          <button
            onClick={onResume}
            className="w-full px-8 py-3 rounded-lg font-display font-bold text-lg 
              bg-primary text-primary-foreground box-glow hover:scale-105 
              transition-all duration-300"
          >
            Resume
          </button>
          
          <button
            onClick={onRestart}
            className="w-full px-8 py-3 rounded-lg font-display font-bold text-lg 
              bg-muted text-foreground hover:bg-muted/80
              transition-all duration-300"
          >
            Restart
          </button>
        </div>
        
        <p className="text-muted-foreground text-sm mt-6 font-body">
          Press ESC to resume
        </p>
      </div>
    </div>
  );
};
