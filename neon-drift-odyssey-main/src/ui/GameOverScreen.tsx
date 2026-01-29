import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { GameState } from '@/game/engine';
import { seedToString } from '@/game/rng';
import { audio } from '@/game/audio';

interface GameOverScreenProps {
  gameState: GameState;
  onPlayAgain: () => void;
}

export function GameOverScreen({ gameState, onPlayAgain }: GameOverScreenProps) {
  const [copied, setCopied] = useState<'score' | 'seed' | null>(null);
  const { score, bestScore, seed } = gameState;
  const isNewBest = score === bestScore && score > 0;
  
  const handlePlayAgain = () => {
    audio.click();
    onPlayAgain();
  };
  
  const handleShareScore = async () => {
    audio.click();
    const text = `🚀 NEON DRIFT 🚀\nScore: ${score.toLocaleString()}\nSeed: ${seedToString(seed)}\nCan you beat my score?`;
    
    try {
      await navigator.clipboard.writeText(text);
      setCopied('score');
      setTimeout(() => setCopied(null), 2000);
    } catch {
      // Fallback for older browsers
      console.log('Copy failed');
    }
  };
  
  const handleCopySeed = async () => {
    audio.click();
    try {
      await navigator.clipboard.writeText(seedToString(seed));
      setCopied('seed');
      setTimeout(() => setCopied(null), 2000);
    } catch {
      console.log('Copy failed');
    }
  };
  
  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center p-8 bg-gradient-to-b from-background/95 via-background to-muted/30 z-20">
      {/* Game Over Title */}
      <h2 className="font-display text-5xl md:text-7xl text-destructive mb-8 animate-pulse">
        GAME OVER
      </h2>
      
      {/* Score Display */}
      <div className="text-center mb-8">
        <p className="font-body text-muted-foreground text-lg mb-2">Final Score</p>
        <p className="font-display text-5xl md:text-6xl text-primary glow-cyan">
          {score.toLocaleString()}
        </p>
        
        {isNewBest && (
          <div className="mt-4 px-6 py-2 bg-accent/20 rounded-full inline-block">
            <span className="font-display text-accent text-lg glow-green">
              🏆 NEW BEST! 🏆
            </span>
          </div>
        )}
        
        {!isNewBest && bestScore > 0 && (
          <p className="font-body text-muted-foreground mt-4">
            Best: <span className="text-foreground">{bestScore.toLocaleString()}</span>
          </p>
        )}
      </div>
      
      {/* Seed Display */}
      <div className="mb-8 text-center">
        <p className="font-body text-sm text-muted-foreground mb-1">Run Seed</p>
        <button
          onClick={handleCopySeed}
          className="font-display text-lg text-secondary hover:text-secondary/80 transition-colors"
        >
          {seedToString(seed)}
          {copied === 'seed' && (
            <span className="ml-2 text-accent text-sm">Copied!</span>
          )}
        </button>
      </div>
      
      {/* Buttons */}
      <div className="flex flex-col sm:flex-row gap-4">
        <Button
          onClick={handlePlayAgain}
          size="lg"
          className="font-display text-xl px-12 py-6 bg-primary text-primary-foreground hover:bg-primary/90 box-glow-cyan transition-all duration-300 hover:scale-105"
        >
          PLAY AGAIN
        </Button>
        <Button
          onClick={handleShareScore}
          size="lg"
          variant="outline"
          className="font-display text-lg px-8 py-6 border-secondary text-secondary hover:bg-secondary/10 transition-all duration-300"
        >
          {copied === 'score' ? 'COPIED!' : 'SHARE'}
        </Button>
      </div>
    </div>
  );
}
