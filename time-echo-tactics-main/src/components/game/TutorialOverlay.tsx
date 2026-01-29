import React from 'react';

interface TutorialOverlayProps {
  onClose: () => void;
}

export const TutorialOverlay: React.FC<TutorialOverlayProps> = ({ onClose }) => {
  return (
    <div className="fixed inset-0 bg-background/95 backdrop-blur-md flex items-center justify-center z-50 fade-in">
      <div className="max-w-xl w-full mx-4 game-panel p-8">
        <h1 className="text-4xl font-display font-bold text-glow text-center mb-6">
          Time Loop Tactician
        </h1>
        
        <div className="space-y-6 font-body">
          <div className="slide-up" style={{ animationDelay: '0.1s' }}>
            <h3 className="text-lg font-display font-bold text-primary mb-2">🎮 Controls</h3>
            <ul className="text-muted-foreground space-y-1">
              <li><span className="text-foreground">WASD / Arrow Keys</span> - Move</li>
              <li><span className="text-foreground">Mouse Click / Space</span> - Attack towards cursor</li>
              <li><span className="text-foreground">ESC</span> - Pause</li>
            </ul>
          </div>
          
          <div className="slide-up" style={{ animationDelay: '0.2s' }}>
            <h3 className="text-lg font-display font-bold text-accent mb-2">⏳ The Time Loop</h3>
            <p className="text-muted-foreground">
              Each loop lasts <span className="text-foreground">30 seconds</span>. When time runs out, 
              your actions become a <span className="text-primary">ghost replay</span>. These ghosts 
              fight alongside you in future loops!
            </p>
          </div>
          
          <div className="slide-up" style={{ animationDelay: '0.3s' }}>
            <h3 className="text-lg font-display font-bold text-secondary mb-2">👻 Ghost Strategy</h3>
            <p className="text-muted-foreground">
              Plan your moves carefully! Your past selves will repeat everything exactly. 
              Coordinate across timelines to overwhelm enemies.
            </p>
          </div>
          
          <div className="slide-up" style={{ animationDelay: '0.4s' }}>
            <h3 className="text-lg font-display font-bold text-destructive mb-2">⚔️ Goal</h3>
            <p className="text-muted-foreground">
              Survive <span className="text-foreground">15 loops</span> and defeat the final boss. 
              Bosses appear every 5 loops. Don't let your health reach zero!
            </p>
          </div>
        </div>
        
        <button
          onClick={onClose}
          className="w-full mt-8 py-4 rounded-lg font-display font-bold text-xl 
            bg-primary text-primary-foreground box-glow hover:scale-[1.02] 
            transition-all duration-300 slide-up"
          style={{ animationDelay: '0.5s' }}
        >
          Start Game
        </button>
        
        <p className="text-center text-muted-foreground text-sm mt-4">
          Press any key or click to begin
        </p>
      </div>
    </div>
  );
};
