export type PlatformType = 'normal' | 'ice' | 'breakable' | 'moving';

export type PowerUpType = 'rope' | 'boots' | 'oxygen';

export type ObstacleType = 'rock' | 'wind';

export interface Position {
  x: number;
  y: number;
}

export interface Velocity {
  vx: number;
  vy: number;
}

export interface Platform {
  id: string;
  type: PlatformType;
  x: number;
  y: number;
  width: number;
  height: number;
  // For moving platforms
  moveDirection?: 'left' | 'right';
  moveSpeed?: number;
  moveRange?: number;
  originalX?: number;
  // For breakable platforms
  breakTimer?: number;
  isBroken?: boolean;
}

export interface PowerUp {
  id: string;
  type: PowerUpType;
  x: number;
  y: number;
  collected: boolean;
}

export interface Obstacle {
  id: string;
  type: ObstacleType;
  x: number;
  y: number;
  width: number;
  height: number;
  velocity?: Velocity;
  // For wind
  direction?: 'left' | 'right';
  strength?: number;
}

export interface Collectible {
  id: string;
  type: 'flag' | 'supply';
  x: number;
  y: number;
  collected: boolean;
  points: number;
}

export interface Player {
  x: number;
  y: number;
  width: number;
  height: number;
  vx: number;
  vy: number;
  isJumping: boolean;
  isOnGround: boolean;
  facingRight: boolean;
  activePowerUps: ActivePowerUp[];
}

export interface ActivePowerUp {
  type: PowerUpType;
  remainingTime: number;
}

export interface GameState {
  status: 'menu' | 'playing' | 'paused' | 'gameover';
  score: number;
  highScore: number;
  scrollY: number;
  scrollSpeed: number;
  difficulty: number;
  player: Player;
  platforms: Platform[];
  powerUps: PowerUp[];
  obstacles: Obstacle[];
  collectibles: Collectible[];
}

export interface UnlockableItem {
  id: string;
  name: string;
  type: 'outfit' | 'backpack';
  requiredScore: number;
  unlocked: boolean;
}

export interface GameInput {
  left: boolean;
  right: boolean;
  jump: boolean;
}
