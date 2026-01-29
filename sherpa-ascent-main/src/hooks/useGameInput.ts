import { useState, useEffect, useCallback } from 'react';
import { GameInput } from '@/lib/gameTypes';

export const useGameInput = () => {
  const [input, setInput] = useState<GameInput>({
    left: false,
    right: false,
    jump: false,
  });

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    switch (e.key) {
      case 'ArrowLeft':
      case 'a':
      case 'A':
        setInput(prev => ({ ...prev, left: true }));
        break;
      case 'ArrowRight':
      case 'd':
      case 'D':
        setInput(prev => ({ ...prev, right: true }));
        break;
      case ' ':
      case 'ArrowUp':
      case 'w':
      case 'W':
        e.preventDefault();
        setInput(prev => ({ ...prev, jump: true }));
        break;
    }
  }, []);

  const handleKeyUp = useCallback((e: KeyboardEvent) => {
    switch (e.key) {
      case 'ArrowLeft':
      case 'a':
      case 'A':
        setInput(prev => ({ ...prev, left: false }));
        break;
      case 'ArrowRight':
      case 'd':
      case 'D':
        setInput(prev => ({ ...prev, right: false }));
        break;
      case ' ':
      case 'ArrowUp':
      case 'w':
      case 'W':
        setInput(prev => ({ ...prev, jump: false }));
        break;
    }
  }, []);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [handleKeyDown, handleKeyUp]);

  const setMobileInput = useCallback((key: keyof GameInput, value: boolean) => {
    setInput(prev => ({ ...prev, [key]: value }));
  }, []);

  return { input, setMobileInput };
};
