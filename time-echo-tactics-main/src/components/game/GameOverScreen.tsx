import React from 'react';
import { MAX_LOOPS } from '../../game/constants';

interface GameOverScreenProps {
  isVictory: boolean;
  loopNumber: number;
  score: number;
  onRestart: () => void;
}

export const GameOverScreen: React.FC<GameOverScreenProps> = ({
  isVictory,
  loopNumber,
  score,
  onRestart,
}) => {
  return (
    <div className="fixed inset-0 bg-background/95 backdrop-blur-md flex items-center justify-center z-50 fade-in">
      <div className="max-w-md w-full mx-4 text-center">
        <div className="text-6xl mb-6 slide-up">
          {isVictory ? '🏆' : '💀'}
        </div>
        
        <h2 
          className={`text-5xl font-display font-black mb-4 slide-up ${
            isVictory ? 'text-glow-accent' : 'text-destructive'
          }`}
          style={{ animationDelay: '0.1s' }}
        >
          {isVictory ? 'VICTORY!' : 'TIME COLLAPSED'}
        </h2>
        
        <p 
          className="text-muted-foreground font-body text-lg mb-8 slide-up"
          style={{ animationDelay: '0.2s' }}
        >
          {isVictory 
            ? 'You mastered the time loop and defeated all enemies!'
            : `Your timeline ended at loop ${loopNumber} of ${MAX_LOOPS}`
          }
        </p>
        
        <div 
          className="game-panel p-6 mb-8 slide-up"
          style={{ animationDelay: '0.3s' }}
        >
          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="text-sm text-muted-foreground font-body uppercase tracking-wider">Loops</div>
              <div className="text-3xl font-display font-bold text-primary">{loopNumber}</div>
            </div>
            <div>
              <div className="text-sm text-muted-foreground font-body uppercase tracking-wider">Score</div>
              <div className="text-3xl font-display font-bold text-accent">{score.toLocaleString()}</div>
            </div>
          </div>
        </div>
        
        <button
          onClick={onRestart}
          className="px-8 py-4 rounded-lg font-display font-bold text-xl 
            bg-primary text-primary-foreground box-glow hover:scale-105 
            transition-all duration-300 slide-up"
          style={{ animationDelay: '0.4s' }}
        >
          Try Again
        </button>
      </div>
    </div>
  );
};
