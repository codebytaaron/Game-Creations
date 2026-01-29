import { useEffect, useRef, useCallback } from 'react';
import { GameState } from '@/types/game';

interface ClubCanvasProps {
  gameState: GameState;
  reducedMotion: boolean;
}

export function ClubCanvas({ gameState, reducedMotion }: ClubCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>(0);
  const timeRef = useRef<number>(0);

  const draw = useCallback((ctx: CanvasRenderingContext2D, width: number, height: number, time: number) => {
    // Clear
    ctx.fillStyle = 'hsl(230, 25%, 5%)';
    ctx.fillRect(0, 0, width, height);

    // Floor pattern
    ctx.fillStyle = 'hsl(230, 30%, 8%)';
    const tileSize = 40;
    for (let x = 0; x < width; x += tileSize) {
      for (let y = 0; y < height; y += tileSize) {
        if ((Math.floor(x / tileSize) + Math.floor(y / tileSize)) % 2 === 0) {
          ctx.fillRect(x, y, tileSize, tileSize);
        }
      }
    }

    // Animated dance floor lights
    if (!reducedMotion) {
      const centerX = width / 2;
      const centerY = height / 2;
      const numRays = 8;
      
      for (let i = 0; i < numRays; i++) {
        const angle = (i / numRays) * Math.PI * 2 + time * 0.5;
        const colors = ['#00F5FF', '#FF00AA', '#39FF14', '#FF6B00'];
        const color = colors[i % colors.length];
        
        ctx.save();
        ctx.translate(centerX, centerY);
        ctx.rotate(angle);
        
        const gradient = ctx.createLinearGradient(0, 0, 0, -height);
        gradient.addColorStop(0, color + '40');
        gradient.addColorStop(1, 'transparent');
        
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.moveTo(-30, 0);
        ctx.lineTo(30, 0);
        ctx.lineTo(60, -height);
        ctx.lineTo(-60, -height);
        ctx.closePath();
        ctx.fill();
        
        ctx.restore();
      }
    }

    // Club elements - DJ Booth (top center)
    const djX = width / 2 - 60;
    const djY = 40;
    ctx.fillStyle = 'hsl(230, 40%, 15%)';
    ctx.fillRect(djX, djY, 120, 50);
    ctx.strokeStyle = '#00F5FF';
    ctx.lineWidth = 2;
    ctx.strokeRect(djX, djY, 120, 50);
    
    // DJ icon
    ctx.font = '24px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('🎧', width / 2, djY + 35);

    // Bar area (right side)
    ctx.fillStyle = 'hsl(230, 40%, 12%)';
    ctx.fillRect(width - 100, height / 3, 80, 150);
    ctx.strokeStyle = '#FF6B00';
    ctx.strokeRect(width - 100, height / 3, 80, 150);
    ctx.fillText('🥤', width - 60, height / 3 + 80);

    // Entrance (bottom left)
    ctx.fillStyle = 'hsl(230, 40%, 10%)';
    ctx.fillRect(20, height - 100, 100, 60);
    ctx.strokeStyle = '#FF00AA';
    ctx.strokeRect(20, height - 100, 100, 60);
    ctx.fillText('🪪', 70, height - 60);

    // Light fixtures
    const lightPositions = [
      { x: width * 0.25, y: height * 0.3 },
      { x: width * 0.75, y: height * 0.3 },
      { x: width * 0.25, y: height * 0.7 },
      { x: width * 0.75, y: height * 0.7 },
    ];

    lightPositions.forEach((pos, i) => {
      const pulse = reducedMotion ? 1 : Math.sin(time * 3 + i) * 0.3 + 0.7;
      const color = i % 2 === 0 ? '#39FF14' : '#FF00AA';
      
      ctx.beginPath();
      ctx.arc(pos.x, pos.y, 15 * pulse, 0, Math.PI * 2);
      ctx.fillStyle = color + Math.floor(pulse * 80).toString(16).padStart(2, '0');
      ctx.fill();
      
      ctx.font = '16px Arial';
      ctx.fillText('💡', pos.x - 8, pos.y + 6);
    });

    // Decorative NPCs (dancers)
    if (!reducedMotion) {
      const dancerPositions = [
        { x: width * 0.35, y: height * 0.5 },
        { x: width * 0.5, y: height * 0.6 },
        { x: width * 0.65, y: height * 0.45 },
        { x: width * 0.4, y: height * 0.75 },
        { x: width * 0.6, y: height * 0.72 },
      ];

      dancerPositions.forEach((pos, i) => {
        const bounce = Math.sin(time * 4 + i * 0.5) * 3;
        ctx.font = '20px Arial';
        ctx.fillText('💃', pos.x, pos.y + bounce);
      });
    }

    // Neon signs
    ctx.save();
    ctx.font = 'bold 16px Orbitron';
    ctx.fillStyle = '#00F5FF';
    ctx.shadowColor = '#00F5FF';
    ctx.shadowBlur = reducedMotion ? 5 : 10 + Math.sin(time * 2) * 5;
    ctx.fillText('TEQUILA', width / 2 - 40, 25);
    ctx.restore();

  }, [reducedMotion]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width * window.devicePixelRatio;
      canvas.height = rect.height * window.devicePixelRatio;
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    };

    resize();
    window.addEventListener('resize', resize);

    const animate = () => {
      timeRef.current += 0.016;
      const rect = canvas.getBoundingClientRect();
      draw(ctx, rect.width, rect.height, timeRef.current);
      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animationRef.current);
    };
  }, [draw, gameState.phase]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full"
      style={{ imageRendering: 'pixelated' }}
    />
  );
}
