import { useState, useEffect, useCallback } from 'react';
import { ID_PATTERNS } from '@/types/game';

interface IDCheckMiniGameProps {
  onComplete: (success: boolean) => void;
  timeLimit: number;
  difficulty: number;
}

export function IDCheckMiniGame({ onComplete, timeLimit, difficulty }: IDCheckMiniGameProps) {
  const patternLength = 3 + Math.floor(difficulty / 2);
  const [targetPattern, setTargetPattern] = useState<string[]>([]);
  const [options, setOptions] = useState<string[][]>([]);
  const [correctIndex, setCorrectIndex] = useState(0);
  const [timeRemaining, setTimeRemaining] = useState(timeLimit);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  // Generate patterns
  useEffect(() => {
    // Create target pattern
    const target: string[] = [];
    for (let i = 0; i < patternLength; i++) {
      target.push(ID_PATTERNS[Math.floor(Math.random() * ID_PATTERNS.length)]);
    }
    setTargetPattern(target);

    // Create options (one correct, others similar)
    const numOptions = 3 + Math.floor(difficulty / 2);
    const correct = Math.floor(Math.random() * numOptions);
    setCorrectIndex(correct);

    const allOptions: string[][] = [];
    for (let i = 0; i < numOptions; i++) {
      if (i === correct) {
        allOptions.push([...target]);
      } else {
        // Create similar but wrong pattern
        const wrongPattern = [...target];
        const changeCount = Math.max(1, Math.floor(Math.random() * 2) + 1);
        for (let j = 0; j < changeCount; j++) {
          const changeIdx = Math.floor(Math.random() * wrongPattern.length);
          let newSymbol = wrongPattern[changeIdx];
          while (newSymbol === wrongPattern[changeIdx]) {
            newSymbol = ID_PATTERNS[Math.floor(Math.random() * ID_PATTERNS.length)];
          }
          wrongPattern[changeIdx] = newSymbol;
        }
        allOptions.push(wrongPattern);
      }
    }
    setOptions(allOptions);
  }, [patternLength, difficulty]);

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

  const handleSelect = useCallback((index: number) => {
    setSelectedIndex(index);
    setTimeout(() => {
      onComplete(index === correctIndex);
    }, 300);
  }, [correctIndex, onComplete]);

  // Keyboard controls
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const num = parseInt(e.key);
      if (num >= 1 && num <= options.length) {
        e.preventDefault();
        handleSelect(num - 1);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [options.length, handleSelect]);

  const timePercentage = (timeRemaining / timeLimit) * 100;

  return (
    <div className="minigame-container p-6 max-w-lg mx-auto animate-slide-in">
      {/* Header */}
      <div className="text-center mb-4">
        <span className="text-3xl mb-2 block">🪪</span>
        <h2 className="font-arcade text-lg neon-text-magenta">ID CHECK</h2>
        <p className="text-sm text-muted-foreground mt-1">Find the matching pattern!</p>
      </div>

      {/* Timer */}
      <div className="timer-bar mb-6">
        <div 
          className={`timer-bar-fill ${timePercentage < 30 ? 'warning' : ''}`}
          style={{ width: `${timePercentage}%` }}
        />
      </div>

      {/* Target Pattern */}
      <div className="text-center mb-6">
        <p className="text-xs text-muted-foreground mb-2 uppercase tracking-wider">Find this pattern:</p>
        <div className="inline-flex gap-2 p-3 bg-muted/50 rounded-lg border-2 border-neon-magenta/50">
          {targetPattern.map((symbol, idx) => (
            <span key={idx} className="text-2xl text-neon-magenta">
              {symbol}
            </span>
          ))}
        </div>
      </div>

      {/* Options */}
      <div className="grid gap-3">
        {options.map((option, idx) => (
          <button
            key={idx}
            onClick={() => handleSelect(idx)}
            disabled={selectedIndex !== null}
            className={`
              flex items-center gap-4 p-4 rounded-lg border-2 transition-all
              ${selectedIndex === idx 
                ? idx === correctIndex 
                  ? 'border-neon-lime bg-neon-lime/20' 
                  : 'border-destructive bg-destructive/20'
                : 'border-border hover:border-neon-cyan bg-muted/30 hover:bg-muted/50'
              }
              ${selectedIndex !== null && selectedIndex !== idx ? 'opacity-50' : ''}
            `}
          >
            <span className="font-arcade text-sm text-muted-foreground w-6">
              {idx + 1}
            </span>
            <div className="flex gap-2">
              {option.map((symbol, sIdx) => (
                <span key={sIdx} className="text-xl">
                  {symbol}
                </span>
              ))}
            </div>
          </button>
        ))}
      </div>

      <p className="text-center text-xs text-muted-foreground mt-4">
        Press 1-{options.length} to select
      </p>
    </div>
  );
}
