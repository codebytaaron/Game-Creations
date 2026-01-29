export interface Vector2 {
  x: number;
  y: number;
}

export interface Entity {
  id: string;
  position: Vector2;
  velocity: Vector2;
  size: number;
  health: number;
  maxHealth: number;
}

export interface Player extends Entity {
  speed: number;
  attackPower: number;
  attackRange: number;
  attackCooldown: number;
  lastAttackTime: number;
  energy: number;
  maxEnergy: number;
  specialAbility: SpecialAbility | null;
}

export interface Enemy extends Entity {
  type: 'melee' | 'ranged' | 'boss';
  speed: number;
  attackPower: number;
  attackRange: number;
  attackCooldown: number;
  lastAttackTime: number;
  targetId: string | null;
}

export interface Projectile {
  id: string;
  position: Vector2;
  velocity: Vector2;
  size: number;
  damage: number;
  ownerId: string;
  isPlayerOwned: boolean;
  lifetime: number;
}

export interface Ghost {
  id: string;
  loopNumber: number;
  actions: GhostAction[];
  currentActionIndex: number;
  position: Vector2;
  isAlive: boolean;
  health: number;
  maxHealth: number;
  attackPower: number;
  attackRange: number;
  size: number;
}

export interface GhostAction {
  timestamp: number;
  position: Vector2;
  action: 'move' | 'attack' | 'special' | 'idle';
  direction?: Vector2;
}

export interface EnvironmentObject {
  id: string;
  type: 'switch' | 'turret' | 'door';
  position: Vector2;
  size: number;
  isActive: boolean;
  linkedId?: string;
  cooldown?: number;
  lastActivationTime?: number;
}

export type SpecialAbility = 'dash' | 'shield' | 'freeze' | 'multishot';

export interface Upgrade {
  id: string;
  name: string;
  description: string;
  icon: string;
  type: 'speed' | 'attack' | 'health' | 'energy' | 'special';
  value: number;
  specialAbility?: SpecialAbility;
}

export interface GameState {
  player: Player;
  enemies: Enemy[];
  projectiles: Projectile[];
  ghosts: Ghost[];
  environmentObjects: EnvironmentObject[];
  loopNumber: number;
  timeRemaining: number;
  isPlaying: boolean;
  isPaused: boolean;
  isGameOver: boolean;
  isVictory: boolean;
  currentActions: GhostAction[];
  screenShake: number;
  score: number;
}

export interface RecordedLoop {
  loopNumber: number;
  actions: GhostAction[];
  upgrades: Upgrade[];
}
