import { useState, useEffect, useCallback } from 'react';

interface DJMiniGameProps {
  onComplete: (success: boolean) => void;
  timeLimit: number;
  difficulty: number;
}

type Direction = 'up' | 'down' | 'left' | 'right';

const ARROW_MAP: Record<Direction, { key: string[]; symbol: string }> = {
  up: { key: ['ArrowUp', 'w', 'W'], symbol: '↑' },
  down: { key: ['ArrowDown', 's', 'S'], symbol: '↓' },
  left: { key: ['ArrowLeft', 'a', 'A'], symbol: '←' },
  right: { key: ['ArrowRight', 'd', 'D'], symbol: '→' },
};

export function DJMiniGame({ onComplete, timeLimit, difficulty }: DJMiniGameProps) {
  const patternLength = 3 + difficulty;
  const [pattern, setPattern] = useState<Direction[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [timeRemaining, setTimeRemaining] = useState(timeLimit);
  const [showFeedback, setShowFeedback] = useState<'correct' | 'wrong' | null>(null);
  const [beatPulse, setBeatPulse] = useState(false);

  // Generate pattern on mount
  useEffect(() => {
    const directions: Direction[] = ['up', 'down', 'left', 'right'];
    const newPattern = Array.from({ length: patternLength }, () => 
      directions[Math.floor(Math.random() * 4)]
    );
    setPattern(newPattern);
  }, [patternLength]);

  // Timer
  useEffect(() => {
    const interval = setInterval(() => {
      setTimeRemaining(prev => {
        if (prev <= 0.1) {
          onComplete(false);
          return 0;
        }
        return prev - 0.1;
      });
    }, 100);

    return () => clearInterval(interval);
  }, [onComplete]);

  // Beat pulse animation
  useEffect(() => {
    const interval = setInterval(() => {
      setBeatPulse(p => !p);
    }, 500);
    return () => clearInterval(interval);
  }, []);

  const handleInput = useCallback((direction: Direction) => {
    if (pattern[currentIndex] === direction) {
      setShowFeedback('correct');
      setTimeout(() => setShowFeedback(null), 150);
      
      if (currentIndex === pattern.length - 1) {
        onComplete(true);
      } else {
        setCurrentIndex(prev => prev + 1);
      }
    } else {
      setShowFeedback('wrong');
      setTimeout(() => setShowFeedback(null), 300);
      onComplete(false);
    }
  }, [pattern, currentIndex, onComplete]);

  // Keyboard controls
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      for (const [dir, config] of Object.entries(ARROW_MAP)) {
        if (config.key.includes(e.key)) {
          e.preventDefault();
          handleInput(dir as Direction);
          return;
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleInput]);

  const timePercentage = (timeRemaining / timeLimit) * 100;

  return (
    <div className="minigame-container p-6 max-w-md mx-auto animate-slide-in">
      {/* Header */}
      <div className="text-center mb-6">
        <span className="text-3xl mb-2 block">🎧</span>
        <h2 className="font-arcade text-lg neon-text-cyan">DJ TIMING</h2>
        <p className="text-sm text-muted-foreground mt-1">Hit the arrows in order!</p>
      </div>

      {/* Timer */}
      <div className="timer-bar mb-6">
        <div 
          className={`timer-bar-fill ${timePercentage < 30 ? 'warning' : ''}`}
          style={{ width: `${timePercentage}%` }}
        />
      </div>

      {/* Pattern Display */}
      <div className="flex justify-center gap-2 mb-8">
        {pattern.map((dir, idx) => (
          <div
            key={idx}
            className={`
              w-12 h-12 rounded-lg flex items-center justify-center font-bold text-2xl
              transition-all duration-150
              ${idx < currentIndex ? 'bg-neon-lime/30 text-neon-lime border border-neon-lime' : ''}
              ${idx === currentIndex ? `bg-neon-cyan/20 text-neon-cyan border-2 border-neon-cyan ${beatPulse ? 'scale-110' : 'scale-100'}` : ''}
              ${idx > currentIndex ? 'bg-muted text-muted-foreground border border-border' : ''}
            `}
          >
            {ARROW_MAP[dir].symbol}
          </div>
        ))}
      </div>

      {/* Feedback */}
      {showFeedback && (
        <div className={`
          text-center font-arcade text-lg mb-4 animate-fade-in
          ${showFeedback === 'correct' ? 'neon-text-lime' : 'neon-text-orange animate-shake'}
        `}>
          {showFeedback === 'correct' ? 'NICE!' : 'MISS!'}
        </div>
      )}

      {/* Touch Controls */}
      <div className="grid grid-cols-3 gap-2 max-w-[180px] mx-auto">
        <div />
        <button
          onClick={() => handleInput('up')}
          className="pattern-button cyan"
        >
          ↑
        </button>
        <div />
        <button
          onClick={() => handleInput('left')}
          className="pattern-button magenta"
        >
          ←
        </button>
        <button
          onClick={() => handleInput('down')}
          className="pattern-button lime"
        >
          ↓
        </button>
        <button
          onClick={() => handleInput('right')}
          className="pattern-button orange"
        >
          →
        </button>
      </div>

      <p className="text-center text-xs text-muted-foreground mt-4">
        Use arrow keys or WASD
      </p>
    </div>
  );
}
