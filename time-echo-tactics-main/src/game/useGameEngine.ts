import { useCallback, useRef, useState, useEffect } from 'react';
import { GameState, Player, Enemy, Ghost, GhostAction, Upgrade, Projectile, Vector2 } from './types';
import { GAME_WIDTH, GAME_HEIGHT, LOOP_DURATION, PLAYER_DEFAULTS, ENEMY_DEFAULTS, MAX_LOOPS, BOSS_INTERVAL } from './constants';

const generateId = () => Math.random().toString(36).substr(2, 9);

const distance = (a: Vector2, b: Vector2) => Math.sqrt((a.x - b.x) ** 2 + (a.y - b.y) ** 2);

const normalize = (v: Vector2): Vector2 => {
  const mag = Math.sqrt(v.x * v.x + v.y * v.y);
  return mag > 0 ? { x: v.x / mag, y: v.y / mag } : { x: 0, y: 0 };
};

const clamp = (val: number, min: number, max: number) => Math.max(min, Math.min(max, val));

export const useGameEngine = () => {
  const [gameState, setGameState] = useState<GameState>(createInitialState());
  const [recordedLoops, setRecordedLoops] = useState<GhostAction[][]>([]);
  const [appliedUpgrades, setAppliedUpgrades] = useState<Upgrade[]>([]);
  
  const keysPressed = useRef<Set<string>>(new Set());
  const mousePosition = useRef<Vector2>({ x: 0, y: 0 });
  const isAttacking = useRef(false);
  const lastUpdateTime = useRef(Date.now());
  const actionRecordInterval = useRef(0);
  
  function createInitialState(): GameState {
    return {
      player: createPlayer(),
      enemies: [],
      projectiles: [],
      ghosts: [],
      environmentObjects: [],
      loopNumber: 1,
      timeRemaining: LOOP_DURATION,
      isPlaying: false,
      isPaused: false,
      isGameOver: false,
      isVictory: false,
      currentActions: [],
      screenShake: 0,
      score: 0,
    };
  }
  
  function createPlayer(): Player {
    return {
      id: 'player',
      position: { x: GAME_WIDTH / 2, y: GAME_HEIGHT / 2 },
      velocity: { x: 0, y: 0 },
      size: PLAYER_DEFAULTS.size,
      health: PLAYER_DEFAULTS.health,
      maxHealth: PLAYER_DEFAULTS.maxHealth,
      speed: PLAYER_DEFAULTS.speed,
      attackPower: PLAYER_DEFAULTS.attackPower,
      attackRange: PLAYER_DEFAULTS.attackRange,
      attackCooldown: PLAYER_DEFAULTS.attackCooldown,
      lastAttackTime: 0,
      energy: PLAYER_DEFAULTS.energy,
      maxEnergy: PLAYER_DEFAULTS.maxEnergy,
      specialAbility: null,
    };
  }
  
  function applyUpgradesToPlayer(player: Player, upgrades: Upgrade[]): Player {
    let upgraded = { ...player };
    upgrades.forEach(upgrade => {
      switch (upgrade.type) {
        case 'speed':
          upgraded.speed *= (1 + upgrade.value);
          break;
        case 'attack':
          upgraded.attackPower *= (1 + upgrade.value);
          break;
        case 'health':
          upgraded.maxHealth += upgrade.value;
          upgraded.health = upgraded.maxHealth;
          break;
        case 'energy':
          upgraded.maxEnergy += upgrade.value;
          upgraded.energy = upgraded.maxEnergy;
          break;
        case 'special':
          if (upgrade.specialAbility) {
            upgraded.specialAbility = upgrade.specialAbility;
          }
          break;
      }
    });
    return upgraded;
  }
  
  function spawnEnemies(loopNumber: number): Enemy[] {
    const enemies: Enemy[] = [];
    const baseCount = 3 + Math.floor(loopNumber * 1.5);
    const isBossLoop = loopNumber % BOSS_INTERVAL === 0;
    const scaleFactor = 1 + (loopNumber - 1) * 0.1;
    
    // Spawn regular enemies
    for (let i = 0; i < baseCount; i++) {
      const isMelee = Math.random() > 0.3;
      const type = isMelee ? 'melee' : 'ranged';
      const defaults = ENEMY_DEFAULTS[type];
      
      // Spawn at edges
      const edge = Math.floor(Math.random() * 4);
      let x, y;
      switch (edge) {
        case 0: x = Math.random() * GAME_WIDTH; y = 50; break;
        case 1: x = Math.random() * GAME_WIDTH; y = GAME_HEIGHT - 50; break;
        case 2: x = 50; y = Math.random() * GAME_HEIGHT; break;
        default: x = GAME_WIDTH - 50; y = Math.random() * GAME_HEIGHT;
      }
      
      enemies.push({
        id: generateId(),
        position: { x, y },
        velocity: { x: 0, y: 0 },
        size: defaults.size,
        health: defaults.health * scaleFactor,
        maxHealth: defaults.health * scaleFactor,
        type,
        speed: defaults.speed,
        attackPower: defaults.attackPower * scaleFactor,
        attackRange: defaults.attackRange,
        attackCooldown: defaults.attackCooldown,
        lastAttackTime: 0,
        targetId: null,
      });
    }
    
    // Spawn boss on boss loops
    if (isBossLoop) {
      const bossDefaults = ENEMY_DEFAULTS.boss;
      enemies.push({
        id: generateId(),
        position: { x: GAME_WIDTH / 2, y: 80 },
        velocity: { x: 0, y: 0 },
        size: bossDefaults.size,
        health: bossDefaults.health * scaleFactor,
        maxHealth: bossDefaults.health * scaleFactor,
        type: 'boss',
        speed: bossDefaults.speed,
        attackPower: bossDefaults.attackPower * scaleFactor,
        attackRange: bossDefaults.attackRange,
        attackCooldown: bossDefaults.attackCooldown,
        lastAttackTime: 0,
        targetId: null,
      });
    }
    
    return enemies;
  }
  
  function createGhostsFromRecordings(recordings: GhostAction[][], upgrades: Upgrade[]): Ghost[] {
    return recordings.map((actions, index) => {
      const ghostUpgrades = upgrades.slice(0, index + 1);
      let ghost: Ghost = {
        id: `ghost-${index}`,
        loopNumber: index + 1,
        actions,
        currentActionIndex: 0,
        position: { x: GAME_WIDTH / 2, y: GAME_HEIGHT / 2 },
        isAlive: true,
        health: PLAYER_DEFAULTS.health,
        maxHealth: PLAYER_DEFAULTS.health,
        attackPower: PLAYER_DEFAULTS.attackPower,
        attackRange: PLAYER_DEFAULTS.attackRange,
        size: PLAYER_DEFAULTS.size,
      };
      
      // Apply upgrades to ghost
      ghostUpgrades.forEach(upgrade => {
        switch (upgrade.type) {
          case 'attack':
            ghost.attackPower *= (1 + upgrade.value);
            break;
          case 'health':
            ghost.maxHealth += upgrade.value;
            ghost.health = ghost.maxHealth;
            break;
        }
      });
      
      return ghost;
    });
  }
  
  const startGame = useCallback(() => {
    const player = applyUpgradesToPlayer(createPlayer(), appliedUpgrades);
    const ghosts = createGhostsFromRecordings(recordedLoops, appliedUpgrades);
    
    setGameState({
      ...createInitialState(),
      player,
      enemies: spawnEnemies(recordedLoops.length + 1),
      ghosts,
      loopNumber: recordedLoops.length + 1,
      isPlaying: true,
      currentActions: [],
    });
    
    lastUpdateTime.current = Date.now();
    actionRecordInterval.current = 0;
  }, [recordedLoops, appliedUpgrades]);
  
  const pauseGame = useCallback(() => {
    setGameState(prev => ({ ...prev, isPaused: !prev.isPaused }));
  }, []);
  
  const restartGame = useCallback(() => {
    setRecordedLoops([]);
    setAppliedUpgrades([]);
    setGameState(createInitialState());
  }, []);
  
  const endLoop = useCallback((victory: boolean = false) => {
    setGameState(prev => {
      if (prev.loopNumber >= MAX_LOOPS && victory) {
        return { ...prev, isPlaying: false, isVictory: true };
      }
      return { ...prev, isPlaying: false };
    });
  }, []);
  
  const applyUpgrade = useCallback((upgrade: Upgrade) => {
    setRecordedLoops(prev => [...prev, gameState.currentActions]);
    setAppliedUpgrades(prev => [...prev, upgrade]);
    
    // Start next loop
    setTimeout(() => startGame(), 100);
  }, [gameState.currentActions, startGame]);
  
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    keysPressed.current.add(e.key.toLowerCase());
    if (e.key === ' ') {
      isAttacking.current = true;
      e.preventDefault();
    }
    if (e.key === 'Escape') {
      pauseGame();
    }
  }, [pauseGame]);
  
  const handleKeyUp = useCallback((e: KeyboardEvent) => {
    keysPressed.current.delete(e.key.toLowerCase());
    if (e.key === ' ') {
      isAttacking.current = false;
    }
  }, []);
  
  const handleMouseMove = useCallback((e: MouseEvent, canvas: HTMLCanvasElement | null) => {
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const scaleX = GAME_WIDTH / rect.width;
    const scaleY = GAME_HEIGHT / rect.height;
    mousePosition.current = {
      x: (e.clientX - rect.left) * scaleX,
      y: (e.clientY - rect.top) * scaleY,
    };
  }, []);
  
  const handleMouseDown = useCallback(() => {
    isAttacking.current = true;
  }, []);
  
  const handleMouseUp = useCallback(() => {
    isAttacking.current = false;
  }, []);
  
  const update = useCallback(() => {
    const now = Date.now();
    const deltaTime = (now - lastUpdateTime.current) / 1000;
    lastUpdateTime.current = now;
    
    setGameState(prev => {
      if (!prev.isPlaying || prev.isPaused) return prev;
      
      let newState = { ...prev };
      
      // Update timer
      newState.timeRemaining -= deltaTime;
      if (newState.timeRemaining <= 0) {
        return { ...newState, isPlaying: false };
      }
      
      // Reduce screen shake
      if (newState.screenShake > 0) {
        newState.screenShake = Math.max(0, newState.screenShake - deltaTime * 20);
      }
      
      // Player movement
      let moveDir: Vector2 = { x: 0, y: 0 };
      if (keysPressed.current.has('w') || keysPressed.current.has('arrowup')) moveDir.y -= 1;
      if (keysPressed.current.has('s') || keysPressed.current.has('arrowdown')) moveDir.y += 1;
      if (keysPressed.current.has('a') || keysPressed.current.has('arrowleft')) moveDir.x -= 1;
      if (keysPressed.current.has('d') || keysPressed.current.has('arrowright')) moveDir.x += 1;
      
      const normalizedDir = normalize(moveDir);
      const player = { ...newState.player };
      
      if (normalizedDir.x !== 0 || normalizedDir.y !== 0) {
        player.position = {
          x: clamp(player.position.x + normalizedDir.x * player.speed * deltaTime, player.size, GAME_WIDTH - player.size),
          y: clamp(player.position.y + normalizedDir.y * player.speed * deltaTime, player.size, GAME_HEIGHT - player.size),
        };
        player.energy = Math.max(0, player.energy - deltaTime * 5);
      } else {
        player.energy = Math.min(player.maxEnergy, player.energy + deltaTime * 10);
      }
      
      // Player attack
      const gameTime = LOOP_DURATION - newState.timeRemaining;
      let newProjectiles = [...newState.projectiles];
      
      if (isAttacking.current && gameTime - player.lastAttackTime >= player.attackCooldown && player.energy >= 5) {
        const attackDir = normalize({
          x: mousePosition.current.x - player.position.x,
          y: mousePosition.current.y - player.position.y,
        });
        
        if (attackDir.x !== 0 || attackDir.y !== 0) {
          player.lastAttackTime = gameTime;
          player.energy -= 5;
          
          newProjectiles.push({
            id: generateId(),
            position: { ...player.position },
            velocity: { x: attackDir.x * 400, y: attackDir.y * 400 },
            size: 8,
            damage: player.attackPower,
            ownerId: player.id,
            isPlayerOwned: true,
            lifetime: 2,
          });
        }
      }
      
      // Record action
      actionRecordInterval.current += deltaTime;
      if (actionRecordInterval.current >= 0.05) {
        actionRecordInterval.current = 0;
        const action: GhostAction = {
          timestamp: gameTime,
          position: { ...player.position },
          action: isAttacking.current ? 'attack' : (normalizedDir.x !== 0 || normalizedDir.y !== 0 ? 'move' : 'idle'),
          direction: normalizedDir,
        };
        newState.currentActions = [...newState.currentActions, action];
      }
      
      // Update ghosts
      const ghosts = newState.ghosts.map(ghost => {
        if (!ghost.isAlive) return ghost;
        
        const updatedGhost = { ...ghost };
        
        // Find current action based on timestamp
        while (updatedGhost.currentActionIndex < updatedGhost.actions.length - 1) {
          const nextAction = updatedGhost.actions[updatedGhost.currentActionIndex + 1];
          if (nextAction.timestamp <= gameTime) {
            updatedGhost.currentActionIndex++;
          } else {
            break;
          }
        }
        
        const currentAction = updatedGhost.actions[updatedGhost.currentActionIndex];
        if (currentAction) {
          updatedGhost.position = { ...currentAction.position };
          
          // Ghost attacks
          if (currentAction.action === 'attack' && currentAction.direction) {
            // Create projectile for ghost (simplified - just damage nearby enemies)
            newState.enemies.forEach((enemy, idx) => {
              if (distance(updatedGhost.position, enemy.position) < updatedGhost.attackRange + enemy.size) {
                const damageAmount = updatedGhost.attackPower * 0.3 * deltaTime;
                newState.enemies[idx] = { ...enemy, health: enemy.health - damageAmount };
              }
            });
          }
        }
        
        return updatedGhost;
      });
      
      // Update enemies
      const enemies = newState.enemies.map(enemy => {
        if (enemy.health <= 0) return enemy;
        
        const updatedEnemy = { ...enemy };
        
        // Find closest target (player or ghost)
        let closestTarget: Vector2 | null = null;
        let closestDist = Infinity;
        
        // Check player
        const playerDist = distance(enemy.position, player.position);
        if (playerDist < closestDist) {
          closestDist = playerDist;
          closestTarget = player.position;
        }
        
        // Check ghosts
        ghosts.forEach(ghost => {
          if (!ghost.isAlive) return;
          const ghostDist = distance(enemy.position, ghost.position);
          if (ghostDist < closestDist) {
            closestDist = ghostDist;
            closestTarget = ghost.position;
          }
        });
        
        if (closestTarget) {
          const dir = normalize({
            x: closestTarget.x - enemy.position.x,
            y: closestTarget.y - enemy.position.y,
          });
          
          if (enemy.type === 'ranged' && closestDist < enemy.attackRange) {
            // Ranged enemy attacks
            if (gameTime - enemy.lastAttackTime >= enemy.attackCooldown) {
              updatedEnemy.lastAttackTime = gameTime;
              newProjectiles.push({
                id: generateId(),
                position: { ...enemy.position },
                velocity: { x: dir.x * 200, y: dir.y * 200 },
                size: 6,
                damage: enemy.attackPower,
                ownerId: enemy.id,
                isPlayerOwned: false,
                lifetime: 3,
              });
            }
          } else if (closestDist > enemy.attackRange * 0.8) {
            // Move towards target
            updatedEnemy.position = {
              x: clamp(enemy.position.x + dir.x * enemy.speed * deltaTime, enemy.size, GAME_WIDTH - enemy.size),
              y: clamp(enemy.position.y + dir.y * enemy.speed * deltaTime, enemy.size, GAME_HEIGHT - enemy.size),
            };
          } else if (enemy.type !== 'ranged' && gameTime - enemy.lastAttackTime >= enemy.attackCooldown) {
            // Melee attack
            updatedEnemy.lastAttackTime = gameTime;
            if (closestDist < enemy.attackRange + player.size) {
              player.health -= enemy.attackPower;
              newState.screenShake = 5;
            }
          }
        }
        
        return updatedEnemy;
      }).filter(e => e.health > 0);
      
      // Update projectiles
      newProjectiles = newProjectiles.map(proj => {
        const updated = { ...proj };
        updated.position.x += proj.velocity.x * deltaTime;
        updated.position.y += proj.velocity.y * deltaTime;
        updated.lifetime -= deltaTime;
        return updated;
      }).filter(p => 
        p.lifetime > 0 &&
        p.position.x > 0 && p.position.x < GAME_WIDTH &&
        p.position.y > 0 && p.position.y < GAME_HEIGHT
      );
      
      // Check projectile collisions
      newProjectiles = newProjectiles.filter(proj => {
        if (proj.isPlayerOwned) {
          // Hit enemies
          for (let i = 0; i < enemies.length; i++) {
            if (distance(proj.position, enemies[i].position) < proj.size + enemies[i].size) {
              enemies[i] = { ...enemies[i], health: enemies[i].health - proj.damage };
              newState.score += 10;
              newState.screenShake = 2;
              return false;
            }
          }
        } else {
          // Hit player
          if (distance(proj.position, player.position) < proj.size + player.size) {
            player.health -= proj.damage;
            newState.screenShake = 4;
            return false;
          }
          // Hit ghosts
          for (let i = 0; i < ghosts.length; i++) {
            if (ghosts[i].isAlive && distance(proj.position, ghosts[i].position) < proj.size + ghosts[i].size) {
              ghosts[i] = { ...ghosts[i], health: ghosts[i].health - proj.damage };
              if (ghosts[i].health <= 0) {
                ghosts[i] = { ...ghosts[i], isAlive: false };
              }
              return false;
            }
          }
        }
        return true;
      });
      
      // Check player death
      if (player.health <= 0) {
        return { ...newState, player, isPlaying: false, isGameOver: true };
      }
      
      // Check victory (all enemies dead on final loop)
      const allEnemiesDead = enemies.filter(e => e.health > 0).length === 0;
      if (allEnemiesDead && newState.loopNumber >= MAX_LOOPS) {
        return { ...newState, player, enemies, isPlaying: false, isVictory: true };
      }
      
      return {
        ...newState,
        player,
        enemies,
        projectiles: newProjectiles,
        ghosts,
      };
    });
  }, []);
  
  return {
    gameState,
    startGame,
    pauseGame,
    restartGame,
    applyUpgrade,
    handleKeyDown,
    handleKeyUp,
    handleMouseMove,
    handleMouseDown,
    handleMouseUp,
    update,
    recordedLoops,
    appliedUpgrades,
  };
};
