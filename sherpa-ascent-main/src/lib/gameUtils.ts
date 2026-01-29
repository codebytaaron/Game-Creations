import { Platform, PowerUp, Obstacle, Collectible, PlatformType, PowerUpType, ObstacleType } from './gameTypes';

let idCounter = 0;

export const generateId = (): string => {
  idCounter += 1;
  return `${Date.now()}-${idCounter}`;
};

export const GAME_WIDTH = 400;
export const GAME_HEIGHT = 700;
export const PLAYER_WIDTH = 40;
export const PLAYER_HEIGHT = 50;
export const PLATFORM_HEIGHT = 20;
export const GRAVITY = 0.5;
export const JUMP_FORCE = -14;
export const MOVE_SPEED = 5;
export const MAX_FALL_SPEED = 12;
export const ICE_FRICTION = 0.98;
export const NORMAL_FRICTION = 0.85;

export const getRandomPlatformType = (difficulty: number): PlatformType => {
  const rand = Math.random();
  const iceChance = Math.min(0.15 + difficulty * 0.02, 0.35);
  const breakableChance = Math.min(0.1 + difficulty * 0.02, 0.25);
  const movingChance = Math.min(0.05 + difficulty * 0.015, 0.2);
  
  if (rand < iceChance) return 'ice';
  if (rand < iceChance + breakableChance) return 'breakable';
  if (rand < iceChance + breakableChance + movingChance) return 'moving';
  return 'normal';
};

export const generatePlatform = (y: number, difficulty: number): Platform => {
  const type = getRandomPlatformType(difficulty);
  const width = type === 'ice' ? 80 : type === 'moving' ? 70 : 90;
  const x = Math.random() * (GAME_WIDTH - width);
  
  const platform: Platform = {
    id: generateId(),
    type,
    x,
    y,
    width,
    height: PLATFORM_HEIGHT,
  };
  
  if (type === 'moving') {
    platform.moveDirection = Math.random() > 0.5 ? 'left' : 'right';
    platform.moveSpeed = 1 + difficulty * 0.2;
    platform.moveRange = 60 + Math.random() * 40;
    platform.originalX = x;
  }
  
  return platform;
};

export const generateInitialPlatforms = (): Platform[] => {
  const platforms: Platform[] = [];
  
  // Starting platform (always normal, centered)
  platforms.push({
    id: generateId(),
    type: 'normal',
    x: GAME_WIDTH / 2 - 50,
    y: GAME_HEIGHT - 100,
    width: 100,
    height: PLATFORM_HEIGHT,
  });
  
  // Generate more platforms going up
  for (let i = 1; i < 12; i++) {
    platforms.push(generatePlatform(GAME_HEIGHT - 100 - i * 80, 0));
  }
  
  return platforms;
};

export const shouldSpawnPowerUp = (score: number): boolean => {
  return Math.random() < 0.08 + Math.min(score / 10000, 0.05);
};

export const getRandomPowerUpType = (): PowerUpType => {
  const types: PowerUpType[] = ['rope', 'boots', 'oxygen'];
  return types[Math.floor(Math.random() * types.length)];
};

export const generatePowerUp = (x: number, y: number): PowerUp => {
  return {
    id: generateId(),
    type: getRandomPowerUpType(),
    x: x + 20,
    y: y - 30,
    collected: false,
  };
};

export const shouldSpawnObstacle = (difficulty: number): boolean => {
  return Math.random() < Math.min(0.02 + difficulty * 0.01, 0.1);
};

export const generateObstacle = (y: number, difficulty: number): Obstacle => {
  const isWind = Math.random() > 0.6;
  
  if (isWind) {
    return {
      id: generateId(),
      type: 'wind',
      x: 0,
      y,
      width: GAME_WIDTH,
      height: 100,
      direction: Math.random() > 0.5 ? 'left' : 'right',
      strength: 2 + difficulty * 0.3,
    };
  }
  
  return {
    id: generateId(),
    type: 'rock',
    x: Math.random() * (GAME_WIDTH - 30),
    y: y - 500,
    width: 30,
    height: 30,
    velocity: {
      vx: (Math.random() - 0.5) * 2,
      vy: 3 + difficulty * 0.5,
    },
  };
};

export const shouldSpawnCollectible = (): boolean => {
  return Math.random() < 0.15;
};

export const generateCollectible = (x: number, y: number): Collectible => {
  const isFlag = Math.random() > 0.5;
  return {
    id: generateId(),
    type: isFlag ? 'flag' : 'supply',
    x: x + 30,
    y: y - 25,
    collected: false,
    points: isFlag ? 100 : 50,
  };
};

export const checkCollision = (
  ax: number, ay: number, aw: number, ah: number,
  bx: number, by: number, bw: number, bh: number
): boolean => {
  return ax < bx + bw && ax + aw > bx && ay < by + bh && ay + ah > by;
};

export const getPowerUpDuration = (type: PowerUpType): number => {
  switch (type) {
    case 'boots': return 10000;
    case 'oxygen': return 8000;
    case 'rope': return 5000;
    default: return 5000;
  }
};

export const getHighScore = (): number => {
  const saved = localStorage.getItem('sherpaClimb_highScore');
  return saved ? parseInt(saved, 10) : 0;
};

export const saveHighScore = (score: number): void => {
  const current = getHighScore();
  if (score > current) {
    localStorage.setItem('sherpaClimb_highScore', score.toString());
  }
};

export const getUnlockedItems = (): string[] => {
  const saved = localStorage.getItem('sherpaClimb_unlocks');
  return saved ? JSON.parse(saved) : [];
};

export const saveUnlockedItem = (itemId: string): void => {
  const current = getUnlockedItems();
  if (!current.includes(itemId)) {
    current.push(itemId);
    localStorage.setItem('sherpaClimb_unlocks', JSON.stringify(current));
  }
};
