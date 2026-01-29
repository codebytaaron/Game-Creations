import { useEffect, useRef, useState, useCallback } from 'react';
import { Vector2 } from '@/lib/gameTypes';

export interface GameInput {
  movement: Vector2;
  shooting: boolean;
  shootDirection: Vector2;
  dash: boolean;
  pause: boolean;
}

export const useGameInput = (canvasRef: React.RefObject<HTMLCanvasElement>) => {
  const keysPressed = useRef<Set<string>>(new Set());
  const mousePosition = useRef<Vector2>({ x: 0, y: 0 });
  const mouseDown = useRef(false);
  const touchPosition = useRef<Vector2 | null>(null);
  const touchShooting = useRef(false);
  const pausePressed = useRef(false);
  const dashPressed = useRef(false);
  
  const [input, setInput] = useState<GameInput>({
    movement: { x: 0, y: 0 },
    shooting: false,
    shootDirection: { x: 1, y: 0 },
    dash: false,
    pause: false,
  });

  const getInputState = useCallback((): GameInput => {
    const keys = keysPressed.current;
    
    let mx = 0, my = 0;
    if (keys.has('KeyW') || keys.has('ArrowUp')) my -= 1;
    if (keys.has('KeyS') || keys.has('ArrowDown')) my += 1;
    if (keys.has('KeyA') || keys.has('ArrowLeft')) mx -= 1;
    if (keys.has('KeyD') || keys.has('ArrowRight')) mx += 1;
    
    // Normalize diagonal movement
    const len = Math.sqrt(mx * mx + my * my);
    if (len > 0) {
      mx /= len;
      my /= len;
    }
    
    // Calculate shoot direction from mouse/touch
    let shootDir = { x: 1, y: 0 };
    const canvas = canvasRef.current;
    if (canvas) {
      const rect = canvas.getBoundingClientRect();
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      
      const targetPos = touchPosition.current || mousePosition.current;
      const dx = targetPos.x - centerX;
      const dy = targetPos.y - centerY;
      const dist = Math.sqrt(dx * dx + dy * dy);
      
      if (dist > 10) {
        shootDir = { x: dx / dist, y: dy / dist };
      }
    }
    
    const shooting = mouseDown.current || keys.has('Space') || touchShooting.current;
    const dash = dashPressed.current || keys.has('ShiftLeft') || keys.has('ShiftRight');
    const pause = pausePressed.current;
    
    // Reset single-press actions
    pausePressed.current = false;
    dashPressed.current = false;
    
    return {
      movement: { x: mx, y: my },
      shooting,
      shootDirection: shootDir,
      dash,
      pause,
    };
  }, [canvasRef]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      keysPressed.current.add(e.code);
      
      if (e.code === 'Escape') {
        pausePressed.current = true;
      }
      
      if (e.code === 'ShiftLeft' || e.code === 'ShiftRight') {
        dashPressed.current = true;
      }
      
      // Prevent default for game keys
      if (['Space', 'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.code)) {
        e.preventDefault();
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      keysPressed.current.delete(e.code);
    };

    const handleMouseMove = (e: MouseEvent) => {
      const canvas = canvasRef.current;
      if (canvas) {
        const rect = canvas.getBoundingClientRect();
        mousePosition.current = {
          x: e.clientX - rect.left,
          y: e.clientY - rect.top,
        };
      }
    };

    const handleMouseDown = (e: MouseEvent) => {
      if (e.button === 0) mouseDown.current = true;
    };

    const handleMouseUp = (e: MouseEvent) => {
      if (e.button === 0) mouseDown.current = false;
    };

    const handleTouchStart = (e: TouchEvent) => {
      const touch = e.touches[0];
      const canvas = canvasRef.current;
      if (canvas && touch) {
        const rect = canvas.getBoundingClientRect();
        touchPosition.current = {
          x: touch.clientX - rect.left,
          y: touch.clientY - rect.top,
        };
        touchShooting.current = true;
      }
    };

    const handleTouchMove = (e: TouchEvent) => {
      const touch = e.touches[0];
      const canvas = canvasRef.current;
      if (canvas && touch) {
        const rect = canvas.getBoundingClientRect();
        touchPosition.current = {
          x: touch.clientX - rect.left,
          y: touch.clientY - rect.top,
        };
      }
    };

    const handleTouchEnd = () => {
      touchShooting.current = false;
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);
    window.addEventListener('touchstart', handleTouchStart);
    window.addEventListener('touchmove', handleTouchMove);
    window.addEventListener('touchend', handleTouchEnd);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleTouchEnd);
    };
  }, [canvasRef]);

  return { getInputState };
};
