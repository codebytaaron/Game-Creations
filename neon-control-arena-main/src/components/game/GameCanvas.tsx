import React, { useRef, useEffect, useCallback } from 'react';
import { GameState, Projectile, Enemy, Vector2 } from '@/lib/gameTypes';
import { 
  distance, 
  normalize, 
  checkCollision, 
  clamp,
  generateId,
  createExplosionParticles,
  getEnemyColor,
  getPowerNodeColor,
} from '@/lib/gameUtils';
import { useGameInput } from '@/hooks/useGameInput';
import { audioManager } from '@/lib/audioManager';

interface GameCanvasProps {
  gameState: GameState;
  setGameState: React.Dispatch<React.SetStateAction<GameState>>;
  onGameOver: () => void;
  onAddXp: (amount: number) => void;
  onSpawnWave: (wave: number, playerPos: Vector2) => void;
  getPlayerStats: () => any;
}

export const GameCanvas: React.FC<GameCanvasProps> = ({
  gameState,
  setGameState,
  onGameOver,
  onAddXp,
  onSpawnWave,
  getPlayerStats,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();
  const lastTimeRef = useRef<number>(0);
  const { getInputState } = useGameInput(canvasRef);

  const shoot = useCallback((direction: Vector2, now: number) => {
    const stats = getPlayerStats();
    const fireDelay = 200 / stats.fireRate;
    
    setGameState(prev => {
      if (now - prev.player.lastShot < fireDelay) return prev;
      if (prev.player.energy < 5) return prev;
      
      audioManager.shoot();
      
      const projectile: Projectile = {
        id: generateId(),
        position: { ...prev.player.position },
        velocity: { x: direction.x * 500, y: direction.y * 500 },
        radius: 5,
        damage: stats.damage,
        isEnemy: false,
        lifetime: 2000,
        createdAt: now,
      };
      
      return {
        ...prev,
        player: {
          ...prev.player,
          lastShot: now,
          energy: prev.player.energy - 5,
        },
        projectiles: [...prev.projectiles, projectile],
      };
    });
  }, [setGameState, getPlayerStats]);

  const updateGame = useCallback((deltaTime: number, now: number) => {
    const input = getInputState();
    
    if (input.pause) {
      setGameState(prev => ({ ...prev, status: 'paused' }));
      return;
    }

    setGameState(prev => {
      if (prev.status !== 'playing') return prev;

      const stats = getPlayerStats();
      let newState = { ...prev };
      
      // Update player position
      const newPlayerX = clamp(
        prev.player.position.x + input.movement.x * prev.player.speed * deltaTime,
        prev.player.radius,
        prev.arenaWidth - prev.player.radius
      );
      const newPlayerY = clamp(
        prev.player.position.y + input.movement.y * prev.player.speed * deltaTime,
        prev.player.radius,
        prev.arenaHeight - prev.player.radius
      );
      
      newState.player = {
        ...prev.player,
        position: { x: newPlayerX, y: newPlayerY },
        energy: Math.min(prev.player.maxEnergy, prev.player.energy + stats.energyRegen * deltaTime),
        health: Math.min(prev.player.maxHealth, prev.player.health + stats.healthRegen * deltaTime),
        invulnerable: Math.max(0, prev.player.invulnerable - deltaTime * 1000),
      };
      
      // Update enemies
      newState.enemies = prev.enemies.map(enemy => {
        const toPlayer = {
          x: prev.player.position.x - enemy.position.x,
          y: prev.player.position.y - enemy.position.y,
        };
        const dist = distance(enemy.position, prev.player.position);
        const dir = normalize(toPlayer);
        
        let newEnemy = { ...enemy };
        
        switch (enemy.type) {
          case 'chaser':
            newEnemy.position = {
              x: enemy.position.x + dir.x * enemy.speed * deltaTime,
              y: enemy.position.y + dir.y * enemy.speed * deltaTime,
            };
            break;
            
          case 'shooter':
            if (dist > 200) {
              newEnemy.position = {
                x: enemy.position.x + dir.x * enemy.speed * deltaTime,
                y: enemy.position.y + dir.y * enemy.speed * deltaTime,
              };
            } else if (dist < 150) {
              newEnemy.position = {
                x: enemy.position.x - dir.x * enemy.speed * deltaTime,
                y: enemy.position.y - dir.y * enemy.speed * deltaTime,
              };
            }
            
            // Shoot at player
            if (now - enemy.lastAction > enemy.actionCooldown) {
              const projectile: Projectile = {
                id: generateId(),
                position: { ...enemy.position },
                velocity: { x: dir.x * 300, y: dir.y * 300 },
                radius: 6,
                damage: enemy.damage,
                isEnemy: true,
                lifetime: 3000,
                createdAt: now,
              };
              newState.projectiles = [...newState.projectiles, projectile];
              newEnemy.lastAction = now;
            }
            break;
            
          case 'bomber':
            newEnemy.position = {
              x: enemy.position.x + dir.x * enemy.speed * deltaTime,
              y: enemy.position.y + dir.y * enemy.speed * deltaTime,
            };
            
            // Explode near player
            if (dist < 50) {
              newEnemy.health = 0;
              if (prev.player.invulnerable <= 0) {
                newState.player.health -= enemy.damage;
                newState.player.invulnerable = 500;
                audioManager.playerHit();
              }
              newState.particles = [
                ...newState.particles,
                ...createExplosionParticles(enemy.position, 'hsl(30, 100%, 50%)', 16),
              ];
            }
            break;
        }
        
        // Keep enemies in bounds
        newEnemy.position = {
          x: clamp(newEnemy.position.x, enemy.radius, prev.arenaWidth - enemy.radius),
          y: clamp(newEnemy.position.y, enemy.radius, prev.arenaHeight - enemy.radius),
        };
        
        return newEnemy;
      });
      
      // Update projectiles
      newState.projectiles = prev.projectiles
        .map(proj => ({
          ...proj,
          position: {
            x: proj.position.x + proj.velocity.x * deltaTime,
            y: proj.position.y + proj.velocity.y * deltaTime,
          },
        }))
        .filter(proj => {
          // Remove expired projectiles
          if (now - proj.createdAt > proj.lifetime) return false;
          // Remove out of bounds
          if (proj.position.x < 0 || proj.position.x > prev.arenaWidth) return false;
          if (proj.position.y < 0 || proj.position.y > prev.arenaHeight) return false;
          return true;
        });
      
      // Check projectile collisions
      const hitEnemies = new Set<string>();
      const hitProjectiles = new Set<string>();
      
      newState.projectiles.forEach(proj => {
        if (proj.isEnemy) {
          // Enemy projectile hitting player
          if (checkCollision(proj, newState.player) && newState.player.invulnerable <= 0) {
            hitProjectiles.add(proj.id);
            newState.player.health -= proj.damage;
            newState.player.invulnerable = 500;
            audioManager.playerHit();
            newState.particles = [
              ...newState.particles,
              ...createExplosionParticles(proj.position, 'hsl(180, 100%, 50%)', 6),
            ];
          }
        } else {
          // Player projectile hitting enemies
          newState.enemies.forEach(enemy => {
            if (checkCollision(proj, enemy)) {
              hitProjectiles.add(proj.id);
              
              const isCrit = Math.random() < stats.critChance;
              const damage = isCrit ? proj.damage * stats.critDamage : proj.damage;
              
              const enemyIndex = newState.enemies.findIndex(e => e.id === enemy.id);
              if (enemyIndex !== -1) {
                newState.enemies[enemyIndex] = {
                  ...newState.enemies[enemyIndex],
                  health: newState.enemies[enemyIndex].health - damage,
                };
                
                if (newState.enemies[enemyIndex].health <= 0) {
                  hitEnemies.add(enemy.id);
                }
              }
              
              audioManager.enemyHit();
              newState.particles = [
                ...newState.particles,
                ...createExplosionParticles(
                  proj.position,
                  isCrit ? 'hsl(60, 100%, 50%)' : getEnemyColor(enemy.type),
                  isCrit ? 10 : 6
                ),
              ];
            }
          });
        }
      });
      
      newState.projectiles = newState.projectiles.filter(p => !hitProjectiles.has(p.id));
      
      // Handle destroyed enemies
      let xpGained = 0;
      newState.enemies = newState.enemies.filter(enemy => {
        if (hitEnemies.has(enemy.id) || enemy.health <= 0) {
          audioManager.enemyDestroy();
          newState.score += enemy.xpValue * 10;
          xpGained += enemy.xpValue;
          newState.particles = [
            ...newState.particles,
            ...createExplosionParticles(enemy.position, getEnemyColor(enemy.type), 12),
          ];
          return false;
        }
        return true;
      });
      
      if (xpGained > 0) {
        onAddXp(xpGained);
      }
      
      // Check player-enemy collision
      newState.enemies.forEach(enemy => {
        if (checkCollision(enemy, newState.player) && newState.player.invulnerable <= 0) {
          newState.player.health -= enemy.damage * 0.5;
          newState.player.invulnerable = 500;
          audioManager.playerHit();
        }
      });
      
      // Update power nodes
      newState.powerNodes = prev.powerNodes.map(node => {
        if (node.captured) return node;
        
        const dist = distance(node.position, newState.player.position);
        if (dist < node.radius + newState.player.radius) {
          const newProgress = node.captureProgress + deltaTime * 50;
          if (newProgress >= 100) {
            audioManager.captureNode();
            
            // Apply buff
            switch (node.type) {
              case 'health':
                newState.player.health = Math.min(
                  newState.player.maxHealth,
                  newState.player.health + 30
                );
                break;
              case 'energy':
                newState.player.energy = newState.player.maxEnergy;
                break;
              case 'damage':
                newState.player.damage *= 1.2;
                break;
              case 'speed':
                newState.player.speed *= 1.15;
                break;
            }
            
            return { ...node, captured: true, captureProgress: 100 };
          }
          return { ...node, captureProgress: newProgress };
        }
        return node;
      });
      
      newState.powerNodes = newState.powerNodes.filter(node => !node.captured);
      
      // Update particles
      newState.particles = prev.particles
        .map(p => ({
          ...p,
          position: {
            x: p.position.x + p.velocity.x * deltaTime,
            y: p.position.y + p.velocity.y * deltaTime,
          },
          velocity: {
            x: p.velocity.x * 0.95,
            y: p.velocity.y * 0.95,
          },
          size: p.size * 0.98,
        }))
        .filter(p => now - p.createdAt < p.lifetime);
      
      // Check wave completion
      if (newState.enemies.length === 0) {
        newState.wave += 1;
        newState.waveTimer = now;
        onSpawnWave(newState.wave, newState.player.position);
      }
      
      // Update time
      newState.timeElapsed += deltaTime;
      
      // Check game over
      if (newState.player.health <= 0) {
        onGameOver();
      }
      
      return newState;
    });

    // Handle shooting
    if (input.shooting) {
      shoot(input.shootDirection, now);
    }
  }, [getInputState, shoot, setGameState, onGameOver, onAddXp, onSpawnWave, getPlayerStats]);

  const render = useCallback((ctx: CanvasRenderingContext2D) => {
    const { player, enemies, projectiles, powerNodes, particles, arenaWidth, arenaHeight } = gameState;
    
    // Clear canvas
    ctx.fillStyle = 'hsl(230, 25%, 5%)';
    ctx.fillRect(0, 0, arenaWidth, arenaHeight);
    
    // Draw grid
    ctx.strokeStyle = 'hsl(180, 100%, 50%, 0.1)';
    ctx.lineWidth = 1;
    const gridSize = 50;
    for (let x = 0; x < arenaWidth; x += gridSize) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, arenaHeight);
      ctx.stroke();
    }
    for (let y = 0; y < arenaHeight; y += gridSize) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(arenaWidth, y);
      ctx.stroke();
    }
    
    // Draw border
    ctx.strokeStyle = 'hsl(180, 100%, 50%, 0.5)';
    ctx.lineWidth = 3;
    ctx.strokeRect(2, 2, arenaWidth - 4, arenaHeight - 4);
    
    // Draw particles
    particles.forEach(particle => {
      const alpha = 1 - (Date.now() - particle.createdAt) / particle.lifetime;
      ctx.fillStyle = particle.color.replace(')', `, ${alpha})`).replace('hsl', 'hsla');
      ctx.beginPath();
      ctx.arc(particle.position.x, particle.position.y, particle.size, 0, Math.PI * 2);
      ctx.fill();
    });
    
    // Draw power nodes
    powerNodes.forEach(node => {
      const color = getPowerNodeColor(node.type);
      
      // Outer ring
      ctx.strokeStyle = color;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(node.position.x, node.position.y, node.radius, 0, Math.PI * 2);
      ctx.stroke();
      
      // Progress arc
      if (node.captureProgress > 0) {
        ctx.strokeStyle = color;
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.arc(
          node.position.x,
          node.position.y,
          node.radius - 5,
          -Math.PI / 2,
          -Math.PI / 2 + (node.captureProgress / 100) * Math.PI * 2
        );
        ctx.stroke();
      }
      
      // Glow
      const gradient = ctx.createRadialGradient(
        node.position.x, node.position.y, 0,
        node.position.x, node.position.y, node.radius + 10
      );
      gradient.addColorStop(0, color.replace(')', ', 0.3)').replace('hsl', 'hsla'));
      gradient.addColorStop(1, 'transparent');
      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(node.position.x, node.position.y, node.radius + 10, 0, Math.PI * 2);
      ctx.fill();
    });
    
    // Draw enemies
    enemies.forEach(enemy => {
      const color = getEnemyColor(enemy.type);
      
      // Body
      ctx.fillStyle = color;
      ctx.beginPath();
      
      switch (enemy.type) {
        case 'chaser':
          // Triangle
          ctx.moveTo(enemy.position.x, enemy.position.y - enemy.radius);
          ctx.lineTo(enemy.position.x - enemy.radius, enemy.position.y + enemy.radius);
          ctx.lineTo(enemy.position.x + enemy.radius, enemy.position.y + enemy.radius);
          break;
        case 'shooter':
          // Square
          ctx.rect(
            enemy.position.x - enemy.radius,
            enemy.position.y - enemy.radius,
            enemy.radius * 2,
            enemy.radius * 2
          );
          break;
        case 'bomber':
          // Hexagon
          for (let i = 0; i < 6; i++) {
            const angle = (i / 6) * Math.PI * 2 - Math.PI / 2;
            const x = enemy.position.x + Math.cos(angle) * enemy.radius;
            const y = enemy.position.y + Math.sin(angle) * enemy.radius;
            if (i === 0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
          }
          break;
      }
      ctx.closePath();
      ctx.fill();
      
      // Health bar
      const healthPercent = enemy.health / enemy.maxHealth;
      ctx.fillStyle = 'hsl(0, 0%, 20%)';
      ctx.fillRect(enemy.position.x - 15, enemy.position.y - enemy.radius - 8, 30, 4);
      ctx.fillStyle = healthPercent > 0.5 ? 'hsl(150, 100%, 50%)' : 'hsl(0, 100%, 50%)';
      ctx.fillRect(enemy.position.x - 15, enemy.position.y - enemy.radius - 8, 30 * healthPercent, 4);
    });
    
    // Draw projectiles
    projectiles.forEach(proj => {
      ctx.fillStyle = proj.isEnemy ? 'hsl(300, 100%, 60%)' : 'hsl(180, 100%, 50%)';
      ctx.beginPath();
      ctx.arc(proj.position.x, proj.position.y, proj.radius, 0, Math.PI * 2);
      ctx.fill();
      
      // Trail
      ctx.strokeStyle = proj.isEnemy ? 'hsl(300, 100%, 60%, 0.5)' : 'hsl(180, 100%, 50%, 0.5)';
      ctx.lineWidth = proj.radius * 1.5;
      ctx.lineCap = 'round';
      ctx.beginPath();
      ctx.moveTo(proj.position.x, proj.position.y);
      ctx.lineTo(
        proj.position.x - proj.velocity.x * 0.03,
        proj.position.y - proj.velocity.y * 0.03
      );
      ctx.stroke();
    });
    
    // Draw player
    const alpha = player.invulnerable > 0 ? 0.5 + Math.sin(Date.now() * 0.02) * 0.3 : 1;
    
    // Player glow
    const playerGlow = ctx.createRadialGradient(
      player.position.x, player.position.y, 0,
      player.position.x, player.position.y, player.radius * 2
    );
    playerGlow.addColorStop(0, `hsla(180, 100%, 50%, ${0.4 * alpha})`);
    playerGlow.addColorStop(1, 'transparent');
    ctx.fillStyle = playerGlow;
    ctx.beginPath();
    ctx.arc(player.position.x, player.position.y, player.radius * 2, 0, Math.PI * 2);
    ctx.fill();
    
    // Player body
    ctx.fillStyle = `hsla(180, 100%, 50%, ${alpha})`;
    ctx.beginPath();
    ctx.arc(player.position.x, player.position.y, player.radius, 0, Math.PI * 2);
    ctx.fill();
    
    // Player core
    ctx.fillStyle = `hsla(180, 100%, 70%, ${alpha})`;
    ctx.beginPath();
    ctx.arc(player.position.x, player.position.y, player.radius * 0.5, 0, Math.PI * 2);
    ctx.fill();
  }, [gameState]);

  // Game loop
  useEffect(() => {
    if (gameState.status !== 'playing') return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const gameLoop = (timestamp: number) => {
      if (lastTimeRef.current === 0) {
        lastTimeRef.current = timestamp;
      }
      
      const deltaTime = Math.min((timestamp - lastTimeRef.current) / 1000, 0.1);
      lastTimeRef.current = timestamp;

      updateGame(deltaTime, Date.now());
      render(ctx);

      animationRef.current = requestAnimationFrame(gameLoop);
    };

    animationRef.current = requestAnimationFrame(gameLoop);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [gameState.status, updateGame, render]);

  // Initial wave spawn
  useEffect(() => {
    if (gameState.status === 'playing' && gameState.enemies.length === 0 && gameState.wave > 0) {
      onSpawnWave(gameState.wave, gameState.player.position);
    }
  }, [gameState.status, gameState.wave, gameState.enemies.length, gameState.player.position, onSpawnWave]);

  return (
    <canvas
      ref={canvasRef}
      width={gameState.arenaWidth}
      height={gameState.arenaHeight}
      className="rounded-lg"
      style={{ touchAction: 'none' }}
    />
  );
};
