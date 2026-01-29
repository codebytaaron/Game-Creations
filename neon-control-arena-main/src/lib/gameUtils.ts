import { Vector2, Entity, Enemy, EnemyType, PowerNode, Hazard, Particle, SkillNode, PlayerStats } from './gameTypes';

export const generateId = (): string => Math.random().toString(36).substr(2, 9);

export const distance = (a: Vector2, b: Vector2): number => {
  const dx = a.x - b.x;
  const dy = a.y - b.y;
  return Math.sqrt(dx * dx + dy * dy);
};

export const normalize = (v: Vector2): Vector2 => {
  const len = Math.sqrt(v.x * v.x + v.y * v.y);
  if (len === 0) return { x: 0, y: 0 };
  return { x: v.x / len, y: v.y / len };
};

export const checkCollision = (a: Entity, b: Entity): boolean => {
  return distance(a.position, b.position) < a.radius + b.radius;
};

export const clamp = (value: number, min: number, max: number): number => {
  return Math.max(min, Math.min(max, value));
};

export const lerp = (a: number, b: number, t: number): number => {
  return a + (b - a) * t;
};

export const randomInRange = (min: number, max: number): number => {
  return Math.random() * (max - min) + min;
};

export const randomPosition = (width: number, height: number, margin: number = 50): Vector2 => {
  return {
    x: randomInRange(margin, width - margin),
    y: randomInRange(margin, height - margin),
  };
};

export const spawnPositionAwayFromPlayer = (
  playerPos: Vector2,
  width: number,
  height: number,
  minDistance: number = 150
): Vector2 => {
  let pos: Vector2;
  let attempts = 0;
  do {
    pos = randomPosition(width, height);
    attempts++;
  } while (distance(pos, playerPos) < minDistance && attempts < 50);
  return pos;
};

export const createEnemy = (
  type: EnemyType,
  position: Vector2,
  wave: number
): Enemy => {
  const waveMultiplier = 1 + wave * 0.1;
  
  const baseStats: Record<EnemyType, Omit<Enemy, 'id' | 'position' | 'velocity'>> = {
    chaser: {
      type: 'chaser',
      health: 30 * waveMultiplier,
      maxHealth: 30 * waveMultiplier,
      damage: 15,
      speed: 120 + wave * 5,
      radius: 15,
      lastAction: 0,
      actionCooldown: 0,
      xpValue: 10,
    },
    shooter: {
      type: 'shooter',
      health: 40 * waveMultiplier,
      maxHealth: 40 * waveMultiplier,
      damage: 20,
      speed: 60 + wave * 3,
      radius: 18,
      lastAction: 0,
      actionCooldown: 2000,
      xpValue: 20,
    },
    bomber: {
      type: 'bomber',
      health: 60 * waveMultiplier,
      maxHealth: 60 * waveMultiplier,
      damage: 35,
      speed: 80 + wave * 4,
      radius: 22,
      lastAction: 0,
      actionCooldown: 3000,
      xpValue: 30,
    },
  };

  return {
    id: generateId(),
    position,
    velocity: { x: 0, y: 0 },
    ...baseStats[type],
  };
};

export const createPowerNode = (position: Vector2, type: PowerNode['type']): PowerNode => {
  return {
    id: generateId(),
    position,
    velocity: { x: 0, y: 0 },
    radius: 25,
    type,
    captureProgress: 0,
    captured: false,
    duration: 10000,
  };
};

export const createHazard = (
  position: Vector2,
  type: Hazard['type'],
  activationTime: number
): Hazard => {
  return {
    id: generateId(),
    position,
    velocity: { x: 0, y: 0 },
    radius: type === 'laser' ? 10 : 60,
    type,
    damage: type === 'laser' ? 25 : 10,
    active: false,
    activationTime,
    duration: 3000,
  };
};

export const createParticle = (
  position: Vector2,
  velocity: Vector2,
  color: string,
  size: number = 4,
  lifetime: number = 500
): Particle => {
  return {
    id: generateId(),
    position: { ...position },
    velocity,
    color,
    size,
    lifetime,
    createdAt: Date.now(),
  };
};

export const createExplosionParticles = (
  position: Vector2,
  color: string,
  count: number = 8
): Particle[] => {
  const particles: Particle[] = [];
  for (let i = 0; i < count; i++) {
    const angle = (Math.PI * 2 * i) / count + Math.random() * 0.5;
    const speed = randomInRange(100, 200);
    particles.push(
      createParticle(
        position,
        { x: Math.cos(angle) * speed, y: Math.sin(angle) * speed },
        color,
        randomInRange(3, 6),
        randomInRange(300, 600)
      )
    );
  }
  return particles;
};

export const getXpForLevel = (level: number): number => {
  return Math.floor(50 * Math.pow(1.5, level - 1));
};

export const getDefaultSkillTree = (): SkillNode[] => [
  {
    id: 'health1',
    name: 'Vitality I',
    description: '+25 Max Health',
    cost: 1,
    unlocked: false,
    requires: [],
    effect: { maxHealth: 25 },
    icon: '❤️',
  },
  {
    id: 'health2',
    name: 'Vitality II',
    description: '+50 Max Health',
    cost: 2,
    unlocked: false,
    requires: ['health1'],
    effect: { maxHealth: 50 },
    icon: '💖',
  },
  {
    id: 'damage1',
    name: 'Power I',
    description: '+5 Damage',
    cost: 1,
    unlocked: false,
    requires: [],
    effect: { damage: 5 },
    icon: '⚡',
  },
  {
    id: 'damage2',
    name: 'Power II',
    description: '+10 Damage',
    cost: 2,
    unlocked: false,
    requires: ['damage1'],
    effect: { damage: 10 },
    icon: '🔥',
  },
  {
    id: 'speed1',
    name: 'Agility I',
    description: '+20 Speed',
    cost: 1,
    unlocked: false,
    requires: [],
    effect: { speed: 20 },
    icon: '💨',
  },
  {
    id: 'firerate1',
    name: 'Rapid Fire',
    description: '+20% Fire Rate',
    cost: 2,
    unlocked: false,
    requires: ['damage1'],
    effect: { fireRate: 0.2 },
    icon: '🔫',
  },
  {
    id: 'energy1',
    name: 'Energy Core',
    description: '+25 Max Energy',
    cost: 1,
    unlocked: false,
    requires: [],
    effect: { maxEnergy: 25 },
    icon: '🔋',
  },
  {
    id: 'regen1',
    name: 'Regeneration',
    description: 'Passive health regen',
    cost: 2,
    unlocked: false,
    requires: ['health1'],
    effect: { healthRegen: 1 },
    icon: '💚',
  },
  {
    id: 'crit1',
    name: 'Precision',
    description: '+10% Crit Chance',
    cost: 2,
    unlocked: false,
    requires: ['damage2'],
    effect: { critChance: 0.1 },
    icon: '🎯',
  },
];

export const getDefaultStats = (): PlayerStats => ({
  maxHealth: 100,
  maxEnergy: 100,
  speed: 200,
  fireRate: 1,
  damage: 15,
  energyRegen: 5,
  healthRegen: 0,
  dashCooldown: 2000,
  critChance: 0,
  critDamage: 1.5,
});

export const applySkillEffects = (
  baseStats: PlayerStats,
  skills: SkillNode[]
): PlayerStats => {
  const stats = { ...baseStats };
  
  skills
    .filter(skill => skill.unlocked)
    .forEach(skill => {
      Object.entries(skill.effect).forEach(([key, value]) => {
        if (key === 'fireRate') {
          stats[key as keyof PlayerStats] = (stats[key as keyof PlayerStats] as number) * (1 + (value as number));
        } else {
          stats[key as keyof PlayerStats] = (stats[key as keyof PlayerStats] as number) + (value as number);
        }
      });
    });
  
  return stats;
};

export const getEnemyColor = (type: EnemyType): string => {
  switch (type) {
    case 'chaser': return 'hsl(0, 100%, 60%)';
    case 'shooter': return 'hsl(300, 100%, 60%)';
    case 'bomber': return 'hsl(30, 100%, 50%)';
    default: return 'hsl(0, 100%, 60%)';
  }
};

export const getPowerNodeColor = (type: PowerNode['type']): string => {
  switch (type) {
    case 'health': return 'hsl(150, 100%, 50%)';
    case 'energy': return 'hsl(60, 100%, 50%)';
    case 'damage': return 'hsl(0, 100%, 60%)';
    case 'speed': return 'hsl(180, 100%, 50%)';
    default: return 'hsl(180, 100%, 50%)';
  }
};
