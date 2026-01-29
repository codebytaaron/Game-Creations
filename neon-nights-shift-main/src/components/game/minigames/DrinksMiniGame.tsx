import { useState, useEffect, useCallback } from 'react';
import { DRINK_TYPES } from '@/types/game';

interface DrinksMiniGameProps {
  onComplete: (success: boolean) => void;
  timeLimit: number;
  difficulty: number;
}

export function DrinksMiniGame({ onComplete, timeLimit, difficulty }: DrinksMiniGameProps) {
  const orderLength = 2 + difficulty;
  const [order, setOrder] = useState<string[]>([]);
  const [selected, setSelected] = useState<string[]>([]);
  const [available, setAvailable] = useState<string[]>([]);
  const [timeRemaining, setTimeRemaining] = useState(timeLimit);
  const [showError, setShowError] = useState(false);

  // Generate order and available drinks
  useEffect(() => {
    // Generate order
    const newOrder: string[] = [];
    for (let i = 0; i < orderLength; i++) {
      newOrder.push(DRINK_TYPES[Math.floor(Math.random() * DRINK_TYPES.length)]);
    }
    setOrder(newOrder);

    // Generate available (includes all order items + extras)
    const extraCount = 2 + difficulty;
    const allDrinks = [...newOrder];
    for (let i = 0; i < extraCount; i++) {
      allDrinks.push(DRINK_TYPES[Math.floor(Math.random() * DRINK_TYPES.length)]);
    }
    // Shuffle
    setAvailable(allDrinks.sort(() => Math.random() - 0.5));
  }, [orderLength, difficulty]);

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

  const handleSelect = useCallback((drink: string, index: number) => {
    const nextRequired = order[selected.length];
    
    if (drink === nextRequired) {
      const newSelected = [...selected, drink];
      setSelected(newSelected);
      
      // Remove from available
      setAvailable(prev => {
        const newAvail = [...prev];
        newAvail.splice(index, 1);
        return newAvail;
      });

      // Check win
      if (newSelected.length === order.length) {
        onComplete(true);
      }
    } else {
      setShowError(true);
      setTimeout(() => setShowError(false), 300);
    }
  }, [order, selected, onComplete]);

  // Keyboard controls
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const num = parseInt(e.key);
      if (num >= 1 && num <= available.length) {
        e.preventDefault();
        handleSelect(available[num - 1], num - 1);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [available, handleSelect]);

  const timePercentage = (timeRemaining / timeLimit) * 100;

  return (
    <div className={`minigame-container p-6 max-w-md mx-auto animate-slide-in ${showError ? 'animate-shake' : ''}`}>
      {/* Header */}
      <div className="text-center mb-4">
        <span className="text-3xl mb-2 block">🥤</span>
        <h2 className="font-arcade text-lg neon-text-orange">RESTOCK DRINKS</h2>
        <p className="text-sm text-muted-foreground mt-1">Fill the order in sequence!</p>
      </div>

      {/* Timer */}
      <div className="timer-bar mb-6">
        <div 
          className={`timer-bar-fill ${timePercentage < 30 ? 'warning' : ''}`}
          style={{ width: `${timePercentage}%` }}
        />
      </div>

      {/* Order display */}
      <div className="text-center mb-6">
        <p className="text-xs text-muted-foreground mb-2 uppercase tracking-wider">Order:</p>
        <div className="flex justify-center gap-2">
          {order.map((drink, idx) => (
            <div
              key={idx}
              className={`
                w-12 h-12 rounded-lg flex items-center justify-center text-2xl
                transition-all duration-200 border-2
                ${idx < selected.length 
                  ? 'bg-neon-lime/20 border-neon-lime' 
                  : idx === selected.length
                    ? 'bg-neon-orange/20 border-neon-orange animate-beat-pulse'
                    : 'bg-muted/30 border-border'
                }
              `}
            >
              {idx < selected.length ? '✓' : drink}
            </div>
          ))}
        </div>
      </div>

      {/* Available drinks */}
      <div className="grid grid-cols-4 gap-3">
        {available.map((drink, idx) => (
          <button
            key={idx}
            onClick={() => handleSelect(drink, idx)}
            className="relative p-3 rounded-lg bg-muted/50 border-2 border-border
                     hover:border-neon-cyan hover:bg-muted transition-all
                     text-2xl flex flex-col items-center gap-1"
          >
            {drink}
            <span className="text-xs text-muted-foreground font-arcade">
              {idx + 1}
            </span>
          </button>
        ))}
      </div>

      {showError && (
        <div className="text-center mt-4 neon-text-orange font-arcade animate-fade-in">
          Wrong drink!
        </div>
      )}

      <p className="text-center text-xs text-muted-foreground mt-4">
        Press 1-{Math.min(9, available.length)} to select
      </p>
    </div>
  );
}
