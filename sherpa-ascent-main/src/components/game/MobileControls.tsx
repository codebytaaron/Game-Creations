import React from 'react';
import { GameInput } from '@/lib/gameTypes';

interface MobileControlsProps {
  onInput: (key: keyof GameInput, value: boolean) => void;
}

export const MobileControls: React.FC<MobileControlsProps> = ({ onInput }) => {
  const handleTouchStart = (key: keyof GameInput) => (e: React.TouchEvent) => {
    e.preventDefault();
    onInput(key, true);
  };
  
  const handleTouchEnd = (key: keyof GameInput) => (e: React.TouchEvent) => {
    e.preventDefault();
    onInput(key, false);
  };
  
  return (
    <div className="absolute bottom-0 left-0 right-0 p-4 pointer-events-none">
      <div className="flex justify-between items-end max-w-md mx-auto">
        {/* Left/Right buttons */}
        <div className="flex gap-2 pointer-events-auto">
          <button
            className="w-16 h-16 rounded-full bg-card/80 backdrop-blur-sm shadow-game flex items-center justify-center active:scale-95 active:bg-primary/20 transition-all touch-none select-none"
            onTouchStart={handleTouchStart('left')}
            onTouchEnd={handleTouchEnd('left')}
            onMouseDown={() => onInput('left', true)}
            onMouseUp={() => onInput('left', false)}
            onMouseLeave={() => onInput('left', false)}
          >
            <svg className="w-8 h-8 text-foreground" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
              <path d="M15 18l-6-6 6-6" />
            </svg>
          </button>
          
          <button
            className="w-16 h-16 rounded-full bg-card/80 backdrop-blur-sm shadow-game flex items-center justify-center active:scale-95 active:bg-primary/20 transition-all touch-none select-none"
            onTouchStart={handleTouchStart('right')}
            onTouchEnd={handleTouchEnd('right')}
            onMouseDown={() => onInput('right', true)}
            onMouseUp={() => onInput('right', false)}
            onMouseLeave={() => onInput('right', false)}
          >
            <svg className="w-8 h-8 text-foreground" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
              <path d="M9 18l6-6-6-6" />
            </svg>
          </button>
        </div>
        
        {/* Jump button */}
        <button
          className="w-20 h-20 rounded-full bg-primary/90 backdrop-blur-sm shadow-game flex items-center justify-center active:scale-95 active:bg-primary transition-all pointer-events-auto touch-none select-none"
          onTouchStart={handleTouchStart('jump')}
          onTouchEnd={handleTouchEnd('jump')}
          onMouseDown={() => onInput('jump', true)}
          onMouseUp={() => onInput('jump', false)}
          onMouseLeave={() => onInput('jump', false)}
        >
          <svg className="w-10 h-10 text-primary-foreground" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
            <path d="M12 19V5M5 12l7-7 7 7" />
          </svg>
        </button>
      </div>
    </div>
  );
};
