import React, { useRef, useEffect, useCallback, useState } from 'react';
import { useAudio } from '@/hooks/useAudio';

interface GameCanvasProps {
  isPlaying: boolean;
  isPaused: boolean;
  soundEnabled: boolean;
  reducedMotion: boolean;
  onScore: () => void;
  onGameOver: (score: number) => void;
  score: number;
}

interface Bird {
  x: number;
  y: number;
  velocity: number;
  rotation: number;
  wingAngle: number;
}

interface Pipe {
  x: number;
  gapY: number;
  gapSize: number;
  passed: boolean;
  id: number;
}

interface Cloud {
  x: number;
  y: number;
  size: number;
  speed: number;
  opacity: number;
}

// Game constants
const GRAVITY = 0.5;
const FLAP_FORCE = -9;
const BIRD_SIZE = 35;
const PIPE_WIDTH = 70;
const PIPE_GAP_BASE = 180;
const PIPE_GAP_MIN = 130;
const PIPE_SPEED_BASE = 3;
const PIPE_SPEED_MAX = 6;
const PIPE_SPAWN_INTERVAL = 180;

export function GameCanvas({
  isPlaying,
  isPaused,
  soundEnabled,
  reducedMotion,
  onScore,
  onGameOver,
  score,
}: GameCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();
  const lastTimeRef = useRef<number>(0);
  const frameCountRef = useRef<number>(0);
  
  const birdRef = useRef<Bird>({
    x: 100,
    y: 250,
    velocity: 0,
    rotation: 0,
    wingAngle: 0,
  });
  
  const pipesRef = useRef<Pipe[]>([]);
  const cloudsRef = useRef<Cloud[]>([]);
  const pipeIdRef = useRef<number>(0);
  const scoreRef = useRef<number>(0);
  const gameOverRef = useRef<boolean>(false);

  const audio = useAudio(soundEnabled);

  // Calculate difficulty based on score
  const getDifficulty = useCallback((currentScore: number) => {
    const level = Math.floor(currentScore / 10);
    const speed = Math.min(PIPE_SPEED_BASE + level * 0.3, PIPE_SPEED_MAX);
    const gap = Math.max(PIPE_GAP_BASE - level * 5, PIPE_GAP_MIN);
    return { speed, gap };
  }, []);

  // Initialize clouds
  const initClouds = useCallback((width: number, height: number) => {
    const clouds: Cloud[] = [];
    for (let i = 0; i < 6; i++) {
      clouds.push({
        x: Math.random() * width,
        y: Math.random() * (height * 0.6),
        size: 40 + Math.random() * 60,
        speed: 0.3 + Math.random() * 0.5,
        opacity: 0.4 + Math.random() * 0.4,
      });
    }
    cloudsRef.current = clouds;
  }, []);

  // Flap handler
  const flap = useCallback(() => {
    if (!isPlaying || isPaused || gameOverRef.current) return;
    
    birdRef.current.velocity = FLAP_FORCE;
    birdRef.current.wingAngle = -0.5;
    audio.playFlap();
  }, [isPlaying, isPaused, audio]);

  // Handle input
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Space' || e.code === 'ArrowUp') {
        e.preventDefault();
        flap();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [flap]);

  // Reset game
  const resetGame = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    birdRef.current = {
      x: 100,
      y: canvas.height / 2,
      velocity: 0,
      rotation: 0,
      wingAngle: 0,
    };
    pipesRef.current = [];
    scoreRef.current = 0;
    frameCountRef.current = 0;
    gameOverRef.current = false;
    pipeIdRef.current = 0;
    initClouds(canvas.width, canvas.height);
  }, [initClouds]);

  // Check collision
  const checkCollision = useCallback((bird: Bird, pipes: Pipe[], canvasHeight: number) => {
    // Ground and ceiling collision
    if (bird.y - BIRD_SIZE / 2 < 0 || bird.y + BIRD_SIZE / 2 > canvasHeight - 50) {
      return true;
    }

    // Pipe collision
    for (const pipe of pipes) {
      const pipeLeft = pipe.x;
      const pipeRight = pipe.x + PIPE_WIDTH;
      
      if (bird.x + BIRD_SIZE / 2 > pipeLeft && bird.x - BIRD_SIZE / 2 < pipeRight) {
        const gapTop = pipe.gapY;
        const gapBottom = pipe.gapY + pipe.gapSize;
        
        if (bird.y - BIRD_SIZE / 2 < gapTop || bird.y + BIRD_SIZE / 2 > gapBottom) {
          return true;
        }
      }
    }

    return false;
  }, []);

  // Draw cloud
  const drawCloud = useCallback((ctx: CanvasRenderingContext2D, cloud: Cloud) => {
    ctx.save();
    ctx.globalAlpha = cloud.opacity;
    ctx.fillStyle = '#ffffff';
    
    const { x, y, size } = cloud;
    
    ctx.beginPath();
    ctx.arc(x, y, size * 0.5, 0, Math.PI * 2);
    ctx.arc(x + size * 0.4, y - size * 0.1, size * 0.4, 0, Math.PI * 2);
    ctx.arc(x + size * 0.8, y, size * 0.35, 0, Math.PI * 2);
    ctx.arc(x + size * 0.3, y + size * 0.2, size * 0.3, 0, Math.PI * 2);
    ctx.fill();
    
    ctx.restore();
  }, []);

  // Draw bird
  const drawBird = useCallback((ctx: CanvasRenderingContext2D, bird: Bird) => {
    ctx.save();
    ctx.translate(bird.x, bird.y);
    ctx.rotate(bird.rotation);
    
    // Body
    const gradient = ctx.createRadialGradient(0, 0, 0, 0, 0, BIRD_SIZE / 2);
    gradient.addColorStop(0, '#ff8c42');
    gradient.addColorStop(1, '#f76b1c');
    
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.ellipse(0, 0, BIRD_SIZE / 2, BIRD_SIZE / 2.2, 0, 0, Math.PI * 2);
    ctx.fill();
    
    // Wing
    ctx.fillStyle = '#ffb366';
    ctx.beginPath();
    const wingY = Math.sin(bird.wingAngle) * 8;
    ctx.ellipse(-5, wingY, BIRD_SIZE / 3, BIRD_SIZE / 5, -0.3 + bird.wingAngle * 0.5, 0, Math.PI * 2);
    ctx.fill();
    
    // Eye
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(BIRD_SIZE / 5, -BIRD_SIZE / 8, BIRD_SIZE / 6, 0, Math.PI * 2);
    ctx.fill();
    
    ctx.fillStyle = '#1a1a2e';
    ctx.beginPath();
    ctx.arc(BIRD_SIZE / 4, -BIRD_SIZE / 8, BIRD_SIZE / 10, 0, Math.PI * 2);
    ctx.fill();
    
    // Beak
    ctx.fillStyle = '#ffd166';
    ctx.beginPath();
    ctx.moveTo(BIRD_SIZE / 2 - 5, 0);
    ctx.lineTo(BIRD_SIZE / 2 + 10, 3);
    ctx.lineTo(BIRD_SIZE / 2 - 5, 6);
    ctx.closePath();
    ctx.fill();
    
    ctx.restore();
  }, []);

  // Draw pipe
  const drawPipe = useCallback((ctx: CanvasRenderingContext2D, pipe: Pipe, canvasHeight: number) => {
    const capHeight = 30;
    const capOverhang = 8;
    
    // Top pipe
    const gradient1 = ctx.createLinearGradient(pipe.x, 0, pipe.x + PIPE_WIDTH, 0);
    gradient1.addColorStop(0, '#3d9970');
    gradient1.addColorStop(0.5, '#5dba94');
    gradient1.addColorStop(1, '#3d9970');
    
    ctx.fillStyle = gradient1;
    ctx.beginPath();
    ctx.roundRect(pipe.x, 0, PIPE_WIDTH, pipe.gapY - capHeight, [0, 0, 8, 8]);
    ctx.fill();
    
    // Top cap
    ctx.beginPath();
    ctx.roundRect(pipe.x - capOverhang, pipe.gapY - capHeight, PIPE_WIDTH + capOverhang * 2, capHeight, 8);
    ctx.fill();
    
    // Bottom pipe
    const bottomStart = pipe.gapY + pipe.gapSize;
    ctx.beginPath();
    ctx.roundRect(pipe.x, bottomStart + capHeight, PIPE_WIDTH, canvasHeight - bottomStart - capHeight - 50, [8, 8, 0, 0]);
    ctx.fill();
    
    // Bottom cap
    ctx.beginPath();
    ctx.roundRect(pipe.x - capOverhang, bottomStart, PIPE_WIDTH + capOverhang * 2, capHeight, 8);
    ctx.fill();
  }, []);

  // Draw ground
  const drawGround = useCallback((ctx: CanvasRenderingContext2D, width: number, height: number) => {
    const groundHeight = 50;
    const gradient = ctx.createLinearGradient(0, height - groundHeight, 0, height);
    gradient.addColorStop(0, '#d4a574');
    gradient.addColorStop(1, '#c49560');
    
    ctx.fillStyle = gradient;
    ctx.fillRect(0, height - groundHeight, width, groundHeight);
    
    // Grass
    ctx.fillStyle = '#5dba94';
    ctx.fillRect(0, height - groundHeight, width, 8);
  }, []);

  // Main game loop
  const gameLoop = useCallback((timestamp: number) => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;

    const deltaTime = timestamp - lastTimeRef.current;
    lastTimeRef.current = timestamp;

    // Clear canvas
    const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
    gradient.addColorStop(0, '#87CEEB');
    gradient.addColorStop(0.6, '#b8d4e8');
    gradient.addColorStop(1, '#ffecd2');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Update and draw clouds
    cloudsRef.current.forEach(cloud => {
      if (!isPaused) {
        cloud.x -= cloud.speed;
        if (cloud.x + cloud.size < 0) {
          cloud.x = canvas.width + cloud.size;
          cloud.y = Math.random() * (canvas.height * 0.6);
        }
      }
      drawCloud(ctx, cloud);
    });

    if (isPlaying && !isPaused && !gameOverRef.current) {
      const bird = birdRef.current;
      const difficulty = getDifficulty(scoreRef.current);

      // Update bird physics
      bird.velocity += GRAVITY;
      bird.y += bird.velocity;
      bird.rotation = Math.min(Math.max(bird.velocity * 0.05, -0.5), 1.2);
      bird.wingAngle += 0.3;

      // Spawn pipes
      frameCountRef.current++;
      if (frameCountRef.current % PIPE_SPAWN_INTERVAL === 0) {
        const minGapY = 80;
        const maxGapY = canvas.height - difficulty.gap - 130;
        const gapY = minGapY + Math.random() * (maxGapY - minGapY);
        
        pipesRef.current.push({
          x: canvas.width,
          gapY,
          gapSize: difficulty.gap,
          passed: false,
          id: pipeIdRef.current++,
        });
      }

      // Update pipes
      pipesRef.current = pipesRef.current.filter(pipe => {
        pipe.x -= difficulty.speed;
        
        // Score when passing pipe
        if (!pipe.passed && pipe.x + PIPE_WIDTH < bird.x) {
          pipe.passed = true;
          scoreRef.current++;
          onScore();
          audio.playScore();
        }
        
        return pipe.x + PIPE_WIDTH > 0;
      });

      // Check collision
      if (checkCollision(bird, pipesRef.current, canvas.height)) {
        gameOverRef.current = true;
        audio.playHit();
        audio.vibrate([100, 50, 100]);
        onGameOver(scoreRef.current);
      }
    }

    // Draw pipes
    pipesRef.current.forEach(pipe => drawPipe(ctx, pipe, canvas.height));

    // Draw ground
    drawGround(ctx, canvas.width, canvas.height);

    // Draw bird
    drawBird(ctx, birdRef.current);

    animationRef.current = requestAnimationFrame(gameLoop);
  }, [isPlaying, isPaused, onScore, onGameOver, audio, getDifficulty, checkCollision, drawCloud, drawPipe, drawGround, drawBird]);

  // Handle canvas resize
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const handleResize = () => {
      const container = canvas.parentElement;
      if (!container) return;
      
      canvas.width = container.clientWidth;
      canvas.height = container.clientHeight;
      initClouds(canvas.width, canvas.height);
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [initClouds]);

  // Start/reset game loop
  useEffect(() => {
    if (isPlaying) {
      resetGame();
      lastTimeRef.current = performance.now();
      animationRef.current = requestAnimationFrame(gameLoop);
    }

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isPlaying, gameLoop, resetGame]);

  // Handle pause state changes
  useEffect(() => {
    if (!isPlaying) return;

    if (!isPaused && !gameOverRef.current) {
      lastTimeRef.current = performance.now();
      animationRef.current = requestAnimationFrame(gameLoop);
    } else if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
    }

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isPaused, isPlaying, gameLoop]);

  return (
    <canvas
      ref={canvasRef}
      className="w-full h-full touch-none cursor-pointer"
      onClick={flap}
      onTouchStart={(e) => {
        e.preventDefault();
        flap();
      }}
    />
  );
}
