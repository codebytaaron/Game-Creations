import { useState, useEffect, useCallback } from 'react';

interface LightsMiniGameProps {
  onComplete: (success: boolean) => void;
  timeLimit: number;
  difficulty: number;
}

const COLORS = ['cyan', 'magenta', 'lime', 'orange'] as const;
type LightColor = typeof COLORS[number];

export function LightsMiniGame({ onComplete, timeLimit, difficulty }: LightsMiniGameProps) {
  const sequenceLength = 2 + difficulty;
  const [sequence, setSequence] = useState<number[]>([]);
  const [playerSequence, setPlayerSequence] = useState<number[]>([]);
  const [isShowingSequence, setIsShowingSequence] = useState(true);
  const [currentShowIndex, setCurrentShowIndex] = useState(-1);
  const [timeRemaining, setTimeRemaining] = useState(timeLimit);
  const [litButton, setLitButton] = useState<number | null>(null);

  // Generate sequence
  useEffect(() => {
    const newSequence = Array.from({ length: sequenceLength }, () => 
      Math.floor(Math.random() * 4)
    );
    setSequence(newSequence);
  }, [sequenceLength]);

  // Show sequence animation
  useEffect(() => {
    if (sequence.length === 0) return;

    let index = 0;
    const showNext = () => {
      if (index < sequence.length) {
        setCurrentShowIndex(index);
        setTimeout(() => {
          setCurrentShowIndex(-1);
          index++;
          setTimeout(showNext, 300);
        }, 500);
      } else {
        setIsShowingSequence(false);
      }
    };

    const timeout = setTimeout(showNext, 500);
    return () => clearTimeout(timeout);
  }, [sequence]);

  // Timer (only when player input phase)
  useEffect(() => {
    if (isShowingSequence) return;

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
  }, [isShowingSequence, onComplete]);

  const handlePress = useCallback((index: number) => {
    if (isShowingSequence) return;

    setLitButton(index);
    setTimeout(() => setLitButton(null), 200);

    const newPlayerSequence = [...playerSequence, index];
    setPlayerSequence(newPlayerSequence);

    // Check if correct
    const currentIdx = newPlayerSequence.length - 1;
    if (sequence[currentIdx] !== index) {
      onComplete(false);
      return;
    }

    // Check if complete
    if (newPlayerSequence.length === sequence.length) {
      onComplete(true);
    }
  }, [isShowingSequence, playerSequence, sequence, onComplete]);

  // Keyboard controls
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isShowingSequence) return;
      
      const keyMap: Record<string, number> = {
        '1': 0, 'q': 0, 'Q': 0,
        '2': 1, 'w': 1, 'W': 1,
        '3': 2, 'e': 2, 'E': 2,
        '4': 3, 'r': 3, 'R': 3,
      };

      if (e.key in keyMap) {
        e.preventDefault();
        handlePress(keyMap[e.key]);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isShowingSequence, handlePress]);

  const timePercentage = (timeRemaining / timeLimit) * 100;

  return (
    <div className="minigame-container p-6 max-w-md mx-auto animate-slide-in">
      {/* Header */}
      <div className="text-center mb-6">
        <span className="text-3xl mb-2 block">💡</span>
        <h2 className="font-arcade text-lg neon-text-lime">FIX LIGHTS</h2>
        <p className="text-sm text-muted-foreground mt-1">
          {isShowingSequence ? 'Watch the pattern...' : 'Repeat the pattern!'}
        </p>
      </div>

      {/* Timer (only show during input phase) */}
      {!isShowingSequence && (
        <div className="timer-bar mb-6">
          <div 
            className={`timer-bar-fill ${timePercentage < 30 ? 'warning' : ''}`}
            style={{ width: `${timePercentage}%` }}
          />
        </div>
      )}

      {/* Progress dots */}
      <div className="flex justify-center gap-2 mb-6">
        {sequence.map((_, idx) => (
          <div
            key={idx}
            className={`
              w-3 h-3 rounded-full transition-all
              ${idx < playerSequence.length ? 'bg-neon-lime' : 'bg-muted'}
            `}
          />
        ))}
      </div>

      {/* Light buttons */}
      <div className="grid grid-cols-2 gap-4 max-w-[240px] mx-auto">
        {COLORS.map((color, idx) => {
          const isLit = currentShowIndex === idx || litButton === idx;
          return (
            <button
              key={color}
              onClick={() => handlePress(idx)}
              disabled={isShowingSequence}
              className={`
                pattern-button ${color} aspect-square text-3xl
                ${isLit ? 'lit' : ''}
                ${isShowingSequence ? 'cursor-not-allowed opacity-70' : ''}
              `}
            >
              {idx + 1}
            </button>
          );
        })}
      </div>

      <p className="text-center text-xs text-muted-foreground mt-4">
        Press 1-4 or Q-W-E-R
      </p>
    </div>
  );
}
