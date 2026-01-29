import React from 'react';
import { Button } from '@/components/ui/button';

interface GameOverScreenProps {
  score: number;
  highScore: number;
  isNewHighScore: boolean;
  onRestart: () => void;
}

export const GameOverScreen: React.FC<GameOverScreenProps> = ({
  score,
  highScore,
  isNewHighScore,
  onRestart,
}) => {
  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center p-6 z-20">
      {/* Background overlay */}
      <div className="absolute inset-0 bg-foreground/60 backdrop-blur-md" />
      
      {/* Content */}
      <div className="relative z-10 flex flex-col items-center animate-slide-up">
        {/* Fallen sherpa */}
        <div className="mb-6">
          <svg viewBox="0 0 80 60" className="w-24 h-16">
            {/* Sherpa lying down */}
            <ellipse cx="40" cy="35" rx="30" ry="15" className="fill-sherpa-primary" />
            <circle cx="60" cy="25" r="15" className="fill-sherpa-skin" />
            
            {/* Hat fallen off */}
            <ellipse cx="20" cy="45" rx="12" ry="4" className="fill-sherpa-secondary" />
            
            {/* Dizzy eyes */}
            <text x="52" y="28" className="text-xs fill-foreground">✕</text>
            <text x="62" y="28" className="text-xs fill-foreground">✕</text>
            
            {/* Stars */}
            <text x="55" y="12" className="text-sm animate-spin" style={{ transformOrigin: '60px 12px' }}>⭐</text>
            <text x="68" y="18" className="text-sm animate-spin" style={{ transformOrigin: '72px 18px', animationDelay: '0.3s' }}>⭐</text>
          </svg>
        </div>
        
        {/* Game Over text */}
        <h2 className="text-4xl font-bold text-primary-foreground mb-2 text-game-shadow">
          Game Over!
        </h2>
        
        {/* New high score celebration */}
        {isNewHighScore && (
          <div className="mb-4 flex items-center gap-2 animate-bounce">
            <span className="text-2xl">🎉</span>
            <span className="text-xl font-bold text-gold">New High Score!</span>
            <span className="text-2xl">🎉</span>
          </div>
        )}
        
        {/* Score card */}
        <div className="bg-card/95 backdrop-blur-sm rounded-2xl p-6 shadow-game mb-6 min-w-[200px]">
          <div className="text-center mb-4">
            <div className="text-sm text-muted-foreground mb-1">Your Score</div>
            <div className="text-4xl font-bold text-foreground">{score.toLocaleString()}</div>
          </div>
          
          <div className="h-px bg-border my-4" />
          
          <div className="text-center">
            <div className="text-sm text-muted-foreground mb-1">Best Score</div>
            <div className="text-2xl font-bold text-gold">{highScore.toLocaleString()}</div>
          </div>
        </div>
        
        {/* Stats */}
        <div className="flex gap-6 mb-6 text-center">
          <div className="bg-card/80 rounded-xl px-4 py-2">
            <div className="text-2xl">🏔️</div>
            <div className="text-xs text-muted-foreground">Height</div>
            <div className="font-bold text-foreground">{Math.floor(score / 10)}m</div>
          </div>
          <div className="bg-card/80 rounded-xl px-4 py-2">
            <div className="text-2xl">⏱️</div>
            <div className="text-xs text-muted-foreground">Climbed</div>
            <div className="font-bold text-foreground">{Math.floor(score / 50)}s</div>
          </div>
        </div>
        
        {/* Restart button */}
        <Button 
          onClick={onRestart}
          size="lg"
          className="text-lg font-bold py-6 px-12 animate-pulse-scale"
        >
          🔄 Try Again
        </Button>
        
        {/* Motivational message */}
        <p className="mt-4 text-primary-foreground/80 text-sm">
          {score < 500 && "Keep trying! You'll get higher! 💪"}
          {score >= 500 && score < 2000 && "Nice climb! Can you beat your record? 🏔️"}
          {score >= 2000 && score < 5000 && "Great job, climber! 🌟"}
          {score >= 5000 && "Amazing! You're a true Sherpa! 🏆"}
        </p>
      </div>
    </div>
  );
};
