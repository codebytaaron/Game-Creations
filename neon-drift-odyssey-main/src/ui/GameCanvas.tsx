import { useEffect, useRef, forwardRef, useImperativeHandle } from 'react';

interface GameCanvasProps {
  onInit: (canvas: HTMLCanvasElement) => (() => void) | void;
  className?: string;
}

export interface GameCanvasHandle {
  getCanvas: () => HTMLCanvasElement | null;
}

export const GameCanvas = forwardRef<GameCanvasHandle, GameCanvasProps>(
  ({ onInit, className }, ref) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    
    useImperativeHandle(ref, () => ({
      getCanvas: () => canvasRef.current,
    }));
    
    useEffect(() => {
      if (canvasRef.current) {
        const cleanup = onInit(canvasRef.current);
        return () => {
          if (typeof cleanup === 'function') {
            cleanup();
          }
        };
      }
    }, [onInit]);
    
    return (
      <canvas
        ref={canvasRef}
        className={className}
        style={{
          width: '100%',
          height: '100%',
          display: 'block',
          touchAction: 'none',
        }}
      />
    );
  }
);

GameCanvas.displayName = 'GameCanvas';
