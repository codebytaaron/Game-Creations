import { useState, useCallback, useRef, useEffect } from 'react';
import {
  GameState,
  GameInput,
  Platform,
  Player,
  ActivePowerUp,
} from '@/lib/gameTypes';
import {
  GAME_WIDTH,
  GAME_HEIGHT,
  PLAYER_WIDTH,
  PLAYER_HEIGHT,
  GRAVITY,
  JUMP_FORCE,
  MOVE_SPEED,
  MAX_FALL_SPEED,
  ICE_FRICTION,
  NORMAL_FRICTION,
  generateInitialPlatforms,
  generatePlatform,
  generatePowerUp,
  generateObstacle,
  generateCollectible,
  shouldSpawnPowerUp,
  shouldSpawnObstacle,
  shouldSpawnCollectible,
  checkCollision,
  getPowerUpDuration,
  getHighScore,
  saveHighScore,
} from '@/lib/gameUtils';

const createInitialPlayer = (): Player => ({
  x: GAME_WIDTH / 2 - PLAYER_WIDTH / 2,
  y: GAME_HEIGHT - 150,
  width: PLAYER_WIDTH,
  height: PLAYER_HEIGHT,
  vx: 0,
  vy: 0,
  isJumping: false,
  isOnGround: true,
  facingRight: true,
  activePowerUps: [],
});

const createInitialState = (): GameState => ({
  status: 'menu',
  score: 0,
  highScore: getHighScore(),
  scrollY: 0,
  scrollSpeed: 0.5,
  difficulty: 0,
  player: createInitialPlayer(),
  platforms: generateInitialPlatforms(),
  powerUps: [],
  obstacles: [],
  collectibles: [],
});

export const useGameEngine = () => {
  const [gameState, setGameState] = useState<GameState>(createInitialState);
  const animationFrameRef = useRef<number>();
  const lastTimeRef = useRef<number>(0);
  const inputRef = useRef<GameInput>({ left: false, right: false, jump: false });

  const updateInput = useCallback((input: GameInput) => {
    inputRef.current = input;
  }, []);

  const startGame = useCallback(() => {
    setGameState({
      ...createInitialState(),
      status: 'playing',
      highScore: getHighScore(),
    });
  }, []);

  const endGame = useCallback(() => {
    setGameState(prev => {
      saveHighScore(prev.score);
      return {
        ...prev,
        status: 'gameover',
        highScore: Math.max(prev.score, prev.highScore),
      };
    });
  }, []);

  const gameLoop = useCallback((timestamp: number) => {
    if (lastTimeRef.current === 0) {
      lastTimeRef.current = timestamp;
    }
    
    const deltaTime = Math.min(timestamp - lastTimeRef.current, 32);
    lastTimeRef.current = timestamp;
    
    setGameState(prev => {
      if (prev.status !== 'playing') return prev;
      
      const input = inputRef.current;
      let { player, platforms, powerUps, obstacles, collectibles, scrollY, scrollSpeed, score, difficulty } = prev;
      
      // Clone player for modifications
      player = { ...player, activePowerUps: [...player.activePowerUps] };
      
      // Update power-up timers
      player.activePowerUps = player.activePowerUps
        .map(pu => ({ ...pu, remainingTime: pu.remainingTime - deltaTime }))
        .filter(pu => pu.remainingTime > 0);
      
      const hasBoots = player.activePowerUps.some(pu => pu.type === 'boots');
      const hasOxygen = player.activePowerUps.some(pu => pu.type === 'oxygen');
      const hasRope = player.activePowerUps.some(pu => pu.type === 'rope');
      
      // Apply input
      if (input.left) {
        player.vx = -MOVE_SPEED;
        player.facingRight = false;
      } else if (input.right) {
        player.vx = MOVE_SPEED;
        player.facingRight = true;
      }
      
      // Apply friction
      const currentPlatform = platforms.find(p => 
        player.isOnGround &&
        checkCollision(player.x, player.y + player.height, player.width, 5, p.x, p.y, p.width, p.height)
      );
      
      const isOnIce = currentPlatform?.type === 'ice' && !hasBoots;
      player.vx *= isOnIce ? ICE_FRICTION : NORMAL_FRICTION;
      
      // Apply gravity
      player.vy += GRAVITY;
      player.vy = Math.min(player.vy, MAX_FALL_SPEED);
      
      // Jump
      if (input.jump && player.isOnGround) {
        const jumpMultiplier = hasOxygen ? 1.3 : 1;
        player.vy = JUMP_FORCE * jumpMultiplier;
        player.isJumping = true;
        player.isOnGround = false;
      }
      
      // Update position
      player.x += player.vx;
      player.y += player.vy;
      
      // Screen wrap
      if (player.x < -player.width) player.x = GAME_WIDTH;
      if (player.x > GAME_WIDTH) player.x = -player.width;
      
      // Update moving platforms
      platforms = platforms.map(p => {
        if (p.type === 'moving' && p.originalX !== undefined) {
          let newX = p.x + (p.moveDirection === 'right' ? (p.moveSpeed || 1) : -(p.moveSpeed || 1));
          const range = p.moveRange || 60;
          
          if (newX > p.originalX + range) {
            newX = p.originalX + range;
            p = { ...p, moveDirection: 'left' };
          } else if (newX < p.originalX - range) {
            newX = p.originalX - range;
            p = { ...p, moveDirection: 'right' };
          }
          
          return { ...p, x: newX };
        }
        return p;
      });
      
      // Platform collision (only when falling)
      player.isOnGround = false;
      if (player.vy >= 0) {
        for (const platform of platforms) {
          if (platform.isBroken) continue;
          
          const playerBottom = player.y + player.height;
          const wasAbove = playerBottom - player.vy <= platform.y + 5;
          
          if (
            wasAbove &&
            checkCollision(
              player.x, player.y, player.width, player.height,
              platform.x, platform.y, platform.width, platform.height
            )
          ) {
            player.y = platform.y - player.height;
            player.vy = 0;
            player.isOnGround = true;
            player.isJumping = false;
            
            // Handle breakable platform
            if (platform.type === 'breakable') {
              const platformIndex = platforms.indexOf(platform);
              if (platformIndex !== -1) {
                const newPlatforms = [...platforms];
                newPlatforms[platformIndex] = {
                  ...platform,
                  breakTimer: (platform.breakTimer || 0) + deltaTime,
                };
                if ((newPlatforms[platformIndex].breakTimer || 0) > 500) {
                  newPlatforms[platformIndex] = { ...newPlatforms[platformIndex], isBroken: true };
                }
                platforms = newPlatforms;
              }
            }
            break;
          }
        }
      }
      
      // Rope power-up: auto-grab nearest platform above
      if (hasRope && player.vy > 0 && !player.isOnGround) {
        const nearestPlatform = platforms
          .filter(p => !p.isBroken && p.y < player.y && p.y > player.y - 150)
          .sort((a, b) => b.y - a.y)[0];
        
        if (nearestPlatform && Math.abs(player.x + player.width/2 - (nearestPlatform.x + nearestPlatform.width/2)) < 100) {
          player.x = nearestPlatform.x + nearestPlatform.width/2 - player.width/2;
          player.y = nearestPlatform.y - player.height;
          player.vy = 0;
          player.isOnGround = true;
          // Remove rope power-up after use
          player.activePowerUps = player.activePowerUps.filter(pu => pu.type !== 'rope');
        }
      }
      
      // Update obstacles
      obstacles = obstacles.map(obs => {
        if (obs.type === 'rock' && obs.velocity) {
          return {
            ...obs,
            x: obs.x + obs.velocity.vx,
            y: obs.y + obs.velocity.vy,
          };
        }
        return obs;
      }).filter(obs => obs.y < scrollY + GAME_HEIGHT + 100);
      
      // Check obstacle collision
      for (const obs of obstacles) {
        if (obs.type === 'rock') {
          if (checkCollision(player.x, player.y, player.width, player.height, obs.x, obs.y, obs.width, obs.height)) {
            // Hit by rock - end game
            return { ...prev, status: 'gameover' as const, highScore: Math.max(score, prev.highScore) };
          }
        } else if (obs.type === 'wind') {
          if (checkCollision(player.x, player.y, player.width, player.height, obs.x, obs.y, obs.width, obs.height)) {
            // Apply wind force
            const windForce = obs.direction === 'right' ? (obs.strength || 2) : -(obs.strength || 2);
            player.vx += windForce * 0.1;
          }
        }
      }
      
      // Collect power-ups
      powerUps = powerUps.map(pu => {
        if (!pu.collected && checkCollision(player.x, player.y, player.width, player.height, pu.x - 15, pu.y - 15, 30, 30)) {
          player.activePowerUps.push({
            type: pu.type,
            remainingTime: getPowerUpDuration(pu.type),
          });
          return { ...pu, collected: true };
        }
        return pu;
      });
      
      // Collect collectibles
      let bonusPoints = 0;
      collectibles = collectibles.map(c => {
        if (!c.collected && checkCollision(player.x, player.y, player.width, player.height, c.x - 10, c.y - 10, 20, 20)) {
          bonusPoints += c.points;
          return { ...c, collected: true };
        }
        return c;
      });
      
      // Calculate scroll
      const playerScreenY = player.y - scrollY;
      const targetScrollY = player.y - GAME_HEIGHT * 0.4;
      
      if (targetScrollY < scrollY) {
        const scoreDelta = Math.floor((scrollY - targetScrollY) / 10);
        score += scoreDelta + bonusPoints;
        scrollY = targetScrollY;
        
        // Increase difficulty based on score
        difficulty = Math.floor(score / 500);
        scrollSpeed = 0.5 + difficulty * 0.1;
      }
      
      // Auto scroll
      scrollY -= scrollSpeed;
      
      // Generate new platforms
      const highestPlatform = Math.min(...platforms.map(p => p.y));
      while (highestPlatform > scrollY - 100) {
        const newY = highestPlatform - (60 + Math.random() * 40);
        const newPlatform = generatePlatform(newY, difficulty);
        platforms.push(newPlatform);
        
        // Maybe spawn power-up
        if (shouldSpawnPowerUp(score)) {
          powerUps.push(generatePowerUp(newPlatform.x, newPlatform.y));
        }
        
        // Maybe spawn collectible
        if (shouldSpawnCollectible()) {
          collectibles.push(generateCollectible(newPlatform.x, newPlatform.y));
        }
        
        break;
      }
      
      // Maybe spawn obstacle
      if (shouldSpawnObstacle(difficulty)) {
        obstacles.push(generateObstacle(scrollY, difficulty));
      }
      
      // Clean up off-screen elements
      platforms = platforms.filter(p => p.y < scrollY + GAME_HEIGHT + 50);
      powerUps = powerUps.filter(pu => pu.y < scrollY + GAME_HEIGHT + 50 && !pu.collected);
      collectibles = collectibles.filter(c => c.y < scrollY + GAME_HEIGHT + 50 && !c.collected);
      
      // Check game over (fell off screen)
      if (player.y > scrollY + GAME_HEIGHT + 100) {
        saveHighScore(score);
        return {
          ...prev,
          status: 'gameover' as const,
          score,
          highScore: Math.max(score, prev.highScore),
        };
      }
      
      return {
        ...prev,
        player,
        platforms,
        powerUps,
        obstacles,
        collectibles,
        scrollY,
        scrollSpeed,
        score,
        difficulty,
      };
    });
    
    animationFrameRef.current = requestAnimationFrame(gameLoop);
  }, []);

  useEffect(() => {
    if (gameState.status === 'playing') {
      lastTimeRef.current = 0;
      animationFrameRef.current = requestAnimationFrame(gameLoop);
    }
    
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [gameState.status, gameLoop]);

  return {
    gameState,
    startGame,
    endGame,
    updateInput,
  };
};
