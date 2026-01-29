import { Upgrade } from './types';

export const GAME_WIDTH = 800;
export const GAME_HEIGHT = 600;
export const LOOP_DURATION = 30; // seconds
export const MAX_LOOPS = 15;
export const BOSS_INTERVAL = 5;

export const PLAYER_DEFAULTS = {
  speed: 200,
  size: 20,
  health: 100,
  maxHealth: 100,
  attackPower: 25,
  attackRange: 40,
  attackCooldown: 0.3,
  energy: 100,
  maxEnergy: 100,
};

export const ENEMY_DEFAULTS = {
  melee: {
    speed: 80,
    size: 18,
    health: 50,
    attackPower: 15,
    attackRange: 25,
    attackCooldown: 1,
  },
  ranged: {
    speed: 50,
    size: 16,
    health: 30,
    attackPower: 10,
    attackRange: 200,
    attackCooldown: 1.5,
  },
  boss: {
    speed: 40,
    size: 40,
    health: 500,
    attackPower: 30,
    attackRange: 60,
    attackCooldown: 0.8,
  },
};

export const UPGRADES: Upgrade[] = [
  {
    id: 'speed-1',
    name: 'Swift Boots',
    description: '+20% movement speed',
    icon: '⚡',
    type: 'speed',
    value: 0.2,
  },
  {
    id: 'attack-1',
    name: 'Sharp Blade',
    description: '+30% attack damage',
    icon: '⚔️',
    type: 'attack',
    value: 0.3,
  },
  {
    id: 'health-1',
    name: 'Vital Core',
    description: '+25 max health',
    icon: '❤️',
    type: 'health',
    value: 25,
  },
  {
    id: 'energy-1',
    name: 'Power Cell',
    description: '+20 max energy',
    icon: '🔋',
    type: 'energy',
    value: 20,
  },
  {
    id: 'special-dash',
    name: 'Chrono Dash',
    description: 'Dash through enemies',
    icon: '💨',
    type: 'special',
    value: 0,
    specialAbility: 'dash',
  },
  {
    id: 'special-shield',
    name: 'Time Shield',
    description: 'Temporary invincibility',
    icon: '🛡️',
    type: 'special',
    value: 0,
    specialAbility: 'shield',
  },
  {
    id: 'special-freeze',
    name: 'Time Freeze',
    description: 'Slow all enemies',
    icon: '❄️',
    type: 'special',
    value: 0,
    specialAbility: 'freeze',
  },
  {
    id: 'special-multishot',
    name: 'Echo Strike',
    description: 'Attack hits 3 directions',
    icon: '✨',
    type: 'special',
    value: 0,
    specialAbility: 'multishot',
  },
];

export const COLORS = {
  player: '#00ffff',
  ghost: 'rgba(0, 255, 255, 0.4)',
  enemyMelee: '#ff00aa',
  enemyRanged: '#aa00ff',
  boss: '#ff3333',
  projectilePlayer: '#00ffff',
  projectileEnemy: '#ff00aa',
  health: '#44cc44',
  energy: '#ffaa00',
  background: '#0a0a14',
  arena: '#12121f',
  grid: 'rgba(0, 255, 255, 0.05)',
};
