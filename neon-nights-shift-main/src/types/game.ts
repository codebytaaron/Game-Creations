// Game Types and Interfaces

export type MiniGameType = 'dj' | 'id-check' | 'lights' | 'drinks';

export interface PlayerProfile {
  name: string;
  bestScore: number;
  gamesPlayed: number;
  createdAt: number;
}

export interface GameSettings {
  musicEnabled: boolean;
  sfxEnabled: boolean;
  reducedMotion: boolean;
  colorblindMode: boolean;
  difficulty: 'easy' | 'normal' | 'hard';
}

export interface RunStats {
  score: number;
  combo: number;
  maxCombo: number;
  tasksCompleted: number;
  tasksFailed: number;
  level: number;
  timeElapsed: number;
}

export interface LevelConfig {
  id: number;
  name: string;
  duration: number; // seconds
  taskInterval: number; // ms between new tasks
  maxActiveTasks: number;
  minigames: MiniGameType[];
  scoreMultiplier: number;
  description: string;
}

export interface Task {
  id: string;
  type: MiniGameType;
  timeLimit: number;
  startTime: number;
  completed: boolean;
  points: number;
}

export interface MiniGameState {
  type: MiniGameType;
  data: unknown;
  timeRemaining: number;
}

// DJ Minigame
export interface DJGameData {
  targetBeat: number;
  currentBeat: number;
  perfectZone: { start: number; end: number };
  pattern: ('left' | 'right' | 'up' | 'down')[];
  currentIndex: number;
}

// ID Check Minigame
export interface IDCheckData {
  pattern: string[];
  userInput: string[];
  correctPattern: string[];
  timeLimit: number;
}

// Lights Minigame (Simon-says style)
export interface LightsGameData {
  sequence: number[];
  playerSequence: number[];
  showingSequence: boolean;
  currentShowIndex: number;
  round: number;
}

// Drinks Minigame
export interface DrinksGameData {
  order: string[];
  available: string[];
  selected: string[];
  correctOrder: string[];
}

export interface HighScore {
  name: string;
  score: number;
  level: number;
  date: number;
}

export type GamePhase = 'menu' | 'tutorial' | 'playing' | 'paused' | 'minigame' | 'levelComplete' | 'gameOver' | 'leaderboard' | 'settings';

export interface GameState {
  phase: GamePhase;
  currentLevel: number;
  score: number;
  combo: number;
  maxCombo: number;
  timeRemaining: number;
  activeTasks: Task[];
  currentMiniGame: MiniGameState | null;
  stats: RunStats;
}

// Drink types for the drinks minigame
export const DRINK_TYPES = [
  '🧃', // Juice
  '🥤', // Soda
  '☕', // Coffee
  '🍵', // Tea
  '🥛', // Milk
  '🧊', // Ice
] as const;

// Pattern symbols for ID check
export const ID_PATTERNS = ['◆', '●', '▲', '■', '★', '♦'] as const;
