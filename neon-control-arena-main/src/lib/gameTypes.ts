export interface Vector2 {
  x: number;
  y: number;
}

export interface Entity {
  id: string;
  position: Vector2;
  velocity: Vector2;
  radius: number;
}

export interface Player extends Entity {
  health: number;
  maxHealth: number;
  energy: number;
  maxEnergy: number;
  speed: number;
  fireRate: number;
  damage: number;
  lastShot: number;
  invulnerable: number;
  dashCooldown: number;
  lastDash: number;
}

export type EnemyType = 'chaser' | 'shooter' | 'bomber';

export interface Enemy extends Entity {
  type: EnemyType;
  health: number;
  maxHealth: number;
  damage: number;
  speed: number;
  lastAction: number;
  actionCooldown: number;
  xpValue: number;
}

export interface Projectile extends Entity {
  damage: number;
  isEnemy: boolean;
  lifetime: number;
  createdAt: number;
}

export interface PowerNode extends Entity {
  type: 'health' | 'energy' | 'damage' | 'speed';
  captureProgress: number;
  captured: boolean;
  duration: number;
}

export interface Hazard extends Entity {
  type: 'laser' | 'zone';
  damage: number;
  active: boolean;
  activationTime: number;
  duration: number;
}

export interface Particle {
  id: string;
  position: Vector2;
  velocity: Vector2;
  color: string;
  size: number;
  lifetime: number;
  createdAt: number;
}

export interface SkillNode {
  id: string;
  name: string;
  description: string;
  cost: number;
  unlocked: boolean;
  requires: string[];
  effect: Partial<PlayerStats>;
  icon: string;
}

export interface PlayerStats {
  maxHealth: number;
  maxEnergy: number;
  speed: number;
  fireRate: number;
  damage: number;
  energyRegen: number;
  healthRegen: number;
  dashCooldown: number;
  critChance: number;
  critDamage: number;
}

export interface GameState {
  status: 'menu' | 'playing' | 'paused' | 'gameover' | 'skills';
  player: Player;
  enemies: Enemy[];
  projectiles: Projectile[];
  powerNodes: PowerNode[];
  hazards: Hazard[];
  particles: Particle[];
  wave: number;
  score: number;
  xp: number;
  level: number;
  xpToNextLevel: number;
  totalXp: number;
  skillPoints: number;
  timeElapsed: number;
  waveTimer: number;
  arenaWidth: number;
  arenaHeight: number;
}

export interface SaveData {
  totalXp: number;
  skillPoints: number;
  unlockedSkills: string[];
  highScore: number;
  highestWave: number;
  gamesPlayed: number;
}
