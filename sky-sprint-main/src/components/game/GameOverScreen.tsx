import React from 'react';
import { RotateCcw, Home, Trophy, Star } from 'lucide-react';

interface GameOverScreenProps {
  score: number;
  bestScore: number;
  isNewBest: boolean;
  onPlayAgain: () => void;
  onMenu: () => void;
}

export function GameOverScreen({
  score,
  bestScore,
  isNewBest,
  onPlayAgain,
  onMenu,
}: GameOverScreenProps) {
  return (
    <div className="absolute inset-0 flex items-center justify-center p-6 z-20 animate-fade-in">
      <div className="absolute inset-0 bg-foreground/40 backdrop-blur-md" />
      
      <div className="glass-panel rounded-3xl p-8 max-w-sm w-full relative z-10 animate-bounce-soft">
        {/* Game Over Title */}
        <h2 className="text-3xl font-bold text-center mb-2 text-foreground">Game Over</h2>
        
        {isNewBest && (
          <div className="flex items-center justify-center gap-2 mb-6 text-primary animate-pulse-slow">
            <Star className="w-5 h-5" fill="currentColor" />
            <span className="font-semibold">New Best Score!</span>
            <Star className="w-5 h-5" fill="currentColor" />
          </div>
        )}
        
        {/* Score display */}
        <div className="text-center mb-8">
          <p className="text-muted-foreground text-sm mb-1">Score</p>
          <p className="text-6xl font-extrabold text-foreground mb-4">{score}</p>
          
          <div className="flex items-center justify-center gap-2 text-muted-foreground">
            <Trophy className="w-5 h-5 text-yellow-500" />
            <span className="font-medium">Best: {bestScore}</span>
          </div>
        </div>
        
        {/* Actions */}
        <div className="space-y-4">
          <button
            onClick={onPlayAgain}
            className="btn-primary-game w-full flex items-center justify-center gap-3"
          >
            <RotateCcw className="w-5 h-5" />
            Play Again
          </button>
          
          <button
            onClick={onMenu}
            className="btn-secondary-game w-full flex items-center justify-center gap-3"
          >
            <Home className="w-5 h-5" />
            Back to Menu
          </button>
        </div>
        
        <p className="text-center text-muted-foreground text-sm mt-6">
          Press R to restart • Space to play
        </p>
      </div>
    </div>
  );
}
