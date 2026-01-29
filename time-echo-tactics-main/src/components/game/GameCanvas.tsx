import React, { useRef, useEffect, useCallback } from 'react';
import { GameState } from '../../game/types';
import { GAME_WIDTH, GAME_HEIGHT, COLORS } from '../../game/constants';

interface GameCanvasProps {
  gameState: GameState;
  onMouseMove: (e: MouseEvent, canvas: HTMLCanvasElement | null) => void;
  onMouseDown: () => void;
  onMouseUp: () => void;
}

export const GameCanvas: React.FC<GameCanvasProps> = ({
  gameState,
  onMouseMove,
  onMouseDown,
  onMouseUp,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();
  
  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Apply screen shake
    ctx.save();
    if (gameState.screenShake > 0) {
      const shakeX = (Math.random() - 0.5) * gameState.screenShake;
      const shakeY = (Math.random() - 0.5) * gameState.screenShake;
      ctx.translate(shakeX, shakeY);
    }
    
    // Clear and draw background
    ctx.fillStyle = COLORS.background;
    ctx.fillRect(0, 0, GAME_WIDTH, GAME_HEIGHT);
    
    // Draw grid
    ctx.strokeStyle = COLORS.grid;
    ctx.lineWidth = 1;
    const gridSize = 40;
    for (let x = 0; x <= GAME_WIDTH; x += gridSize) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, GAME_HEIGHT);
      ctx.stroke();
    }
    for (let y = 0; y <= GAME_HEIGHT; y += gridSize) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(GAME_WIDTH, y);
      ctx.stroke();
    }
    
    // Draw arena border
    ctx.strokeStyle = COLORS.player;
    ctx.lineWidth = 3;
    ctx.shadowColor = COLORS.player;
    ctx.shadowBlur = 15;
    ctx.strokeRect(10, 10, GAME_WIDTH - 20, GAME_HEIGHT - 20);
    ctx.shadowBlur = 0;
    
    // Draw ghosts
    gameState.ghosts.forEach((ghost, index) => {
      if (!ghost.isAlive) return;
      
      const opacity = 0.3 + (index * 0.05);
      ctx.fillStyle = `rgba(0, 255, 255, ${opacity})`;
      ctx.shadowColor = COLORS.ghost;
      ctx.shadowBlur = 10;
      ctx.beginPath();
      ctx.arc(ghost.position.x, ghost.position.y, ghost.size, 0, Math.PI * 2);
      ctx.fill();
      
      // Ghost number
      ctx.fillStyle = `rgba(255, 255, 255, ${opacity + 0.2})`;
      ctx.font = 'bold 12px Orbitron';
      ctx.textAlign = 'center';
      ctx.fillText(`${ghost.loopNumber}`, ghost.position.x, ghost.position.y + 4);
      ctx.shadowBlur = 0;
    });
    
    // Draw enemies
    gameState.enemies.forEach(enemy => {
      if (enemy.health <= 0) return;
      
      let color = COLORS.enemyMelee;
      if (enemy.type === 'ranged') color = COLORS.enemyRanged;
      if (enemy.type === 'boss') color = COLORS.boss;
      
      ctx.fillStyle = color;
      ctx.shadowColor = color;
      ctx.shadowBlur = 12;
      
      if (enemy.type === 'boss') {
        // Draw boss as hexagon
        ctx.beginPath();
        for (let i = 0; i < 6; i++) {
          const angle = (Math.PI / 3) * i - Math.PI / 6;
          const x = enemy.position.x + enemy.size * Math.cos(angle);
          const y = enemy.position.y + enemy.size * Math.sin(angle);
          if (i === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.closePath();
        ctx.fill();
      } else {
        // Draw regular enemies as circles
        ctx.beginPath();
        ctx.arc(enemy.position.x, enemy.position.y, enemy.size, 0, Math.PI * 2);
        ctx.fill();
      }
      
      // Health bar
      const healthPercent = enemy.health / enemy.maxHealth;
      const barWidth = enemy.size * 2;
      const barHeight = 4;
      const barY = enemy.position.y - enemy.size - 10;
      
      ctx.shadowBlur = 0;
      ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
      ctx.fillRect(enemy.position.x - barWidth / 2, barY, barWidth, barHeight);
      ctx.fillStyle = COLORS.health;
      ctx.fillRect(enemy.position.x - barWidth / 2, barY, barWidth * healthPercent, barHeight);
      
      ctx.shadowBlur = 0;
    });
    
    // Draw projectiles
    gameState.projectiles.forEach(proj => {
      ctx.fillStyle = proj.isPlayerOwned ? COLORS.projectilePlayer : COLORS.projectileEnemy;
      ctx.shadowColor = proj.isPlayerOwned ? COLORS.projectilePlayer : COLORS.projectileEnemy;
      ctx.shadowBlur = 8;
      ctx.beginPath();
      ctx.arc(proj.position.x, proj.position.y, proj.size, 0, Math.PI * 2);
      ctx.fill();
      ctx.shadowBlur = 0;
    });
    
    // Draw player
    ctx.fillStyle = COLORS.player;
    ctx.shadowColor = COLORS.player;
    ctx.shadowBlur = 20;
    ctx.beginPath();
    ctx.arc(gameState.player.position.x, gameState.player.position.y, gameState.player.size, 0, Math.PI * 2);
    ctx.fill();
    
    // Player inner circle
    ctx.fillStyle = COLORS.background;
    ctx.shadowBlur = 0;
    ctx.beginPath();
    ctx.arc(gameState.player.position.x, gameState.player.position.y, gameState.player.size * 0.5, 0, Math.PI * 2);
    ctx.fill();
    
    // Player direction indicator
    ctx.fillStyle = COLORS.player;
    ctx.beginPath();
    ctx.arc(gameState.player.position.x, gameState.player.position.y, gameState.player.size * 0.3, 0, Math.PI * 2);
    ctx.fill();
    
    ctx.restore();
    
    animationRef.current = requestAnimationFrame(draw);
  }, [gameState]);
  
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const handleMove = (e: MouseEvent) => onMouseMove(e, canvas);
    
    canvas.addEventListener('mousemove', handleMove);
    canvas.addEventListener('mousedown', onMouseDown);
    canvas.addEventListener('mouseup', onMouseUp);
    
    return () => {
      canvas.removeEventListener('mousemove', handleMove);
      canvas.removeEventListener('mousedown', onMouseDown);
      canvas.removeEventListener('mouseup', onMouseUp);
    };
  }, [onMouseMove, onMouseDown, onMouseUp]);
  
  useEffect(() => {
    animationRef.current = requestAnimationFrame(draw);
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [draw]);
  
  return (
    <canvas
      ref={canvasRef}
      width={GAME_WIDTH}
      height={GAME_HEIGHT}
      className="rounded-lg box-glow max-w-full h-auto cursor-crosshair"
      style={{ aspectRatio: `${GAME_WIDTH}/${GAME_HEIGHT}` }}
    />
  );
};
