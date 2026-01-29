export type Position = {
  x: number;
  y: number;
};

export type Direction = 'up' | 'down' | 'left' | 'right';

export type CellType = 'floor' | 'wall' | 'exit' | 'loot' | 'keycard-door';

export type GuardState = 'patrol' | 'chase' | 'investigate' | 'alert';

export type Guard = {
  id: string;
  position: Position;
  state: GuardState;
  patrolPath: Position[];
  patrolIndex: number;
  patrolDirection: 1 | -1;
  visionRange: number;
  investigateTarget: Position | null;
  alertCountdown: number;
};

export type Tool = {
  id: 'smokebomb' | 'decoy' | 'keycard';
  name: string;
  description: string;
  cooldown: number;
  currentCooldown: number;
  charges: number;
  maxCharges: number;
};

export type Loot = {
  id: string;
  position: Position;
  value: number;
  collected: boolean;
};

export type Noise = {
  position: Position;
  radius: number;
  turnsRemaining: number;
};

export type Level = {
  width: number;
  height: number;
  grid: CellType[][];
  guards: Guard[];
  loot: Loot[];
  playerStart: Position;
  exit: Position;
  keycardDoors: Position[];
  difficulty: number;
};

export type Player = {
  position: Position;
  hasKeycard: boolean;
  tools: Tool[];
  isVisible: boolean;
  inSmoke: boolean;
};

export type GameState = {
  level: Level;
  player: Player;
  score: number;
  totalLootCollected: number;
  alertMeter: number;
  maxAlertMeter: number;
  turn: number;
  noises: Noise[];
  gameStatus: 'playing' | 'won' | 'lost' | 'paused';
  currentLevelNumber: number;
  message: string | null;
  messageType: 'info' | 'warning' | 'success' | 'danger';
};

export type GameStats = {
  levelsCompleted: number;
  totalScore: number;
  lootCollected: number;
  turnsUsed: number;
  timesSpotted: number;
  toolsUsed: number;
};
