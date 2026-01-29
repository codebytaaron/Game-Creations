export type Position = 'QB' | 'WR' | 'DB' | 'LB';

export type PlayStyle = 'aggressive' | 'balanced' | 'calculated';

export type Priority = 'playing-time' | 'nil' | 'development';

export type Stage = 'morning' | 'midday' | 'afternoon' | 'night';

export type MessageType = 'coach' | 'agent' | 'media' | 'social' | 'family' | 'teammate';

export interface Stats {
  stress: number;
  hype: number;
  fit: number;
  reputation: number;
  energy: number;
}

export interface StatDelta {
  stress?: number;
  hype?: number;
  fit?: number;
  reputation?: number;
  energy?: number;
}

export interface Character {
  position: Position;
  playStyle: PlayStyle;
  priority: Priority;
}

export interface InboxMessage {
  id: string;
  type: MessageType;
  sender: string;
  subject: string;
  preview: string;
  tier?: 'power5' | 'group5' | 'fcs';
}

export interface Choice {
  id: string;
  text: string;
  delta: StatDelta;
  tooltip: string;
  requires?: {
    stat?: keyof Stats;
    minValue?: number;
    maxValue?: number;
    flag?: string;
  };
  setsFlag?: string;
}

export interface Scene {
  id: string;
  stage: Stage;
  title: string;
  narrative: string;
  messages: InboxMessage[];
  choices: Choice[];
  isRare?: boolean;
  rareChance?: number;
  requiredPosition?: Position;
  requiredPriority?: Priority;
}

export interface EventLogEntry {
  stage: Stage;
  choiceText: string;
  delta: StatDelta;
  timestamp: number;
}

export interface Ending {
  id: string;
  label: string;
  description: string;
  requirements: {
    stats?: Partial<Record<keyof Stats, { min?: number; max?: number }>>;
    flags?: string[];
    notFlags?: string[];
  };
  priority: number;
}

export interface GameState {
  screen: 'start' | 'setup' | 'howto' | 'credits' | 'game' | 'end';
  character: Character | null;
  stats: Stats;
  currentStage: Stage;
  currentScene: Scene | null;
  eventLog: EventLogEntry[];
  flags: string[];
  ending: Ending | null;
  soundEnabled: boolean;
}

export const INITIAL_STATS: Stats = {
  stress: 30,
  hype: 50,
  fit: 40,
  reputation: 50,
  energy: 80,
};

export const STAGES: Stage[] = ['morning', 'midday', 'afternoon', 'night'];

export const STAGE_LABELS: Record<Stage, string> = {
  morning: 'Morning',
  midday: 'Midday',
  afternoon: 'Afternoon',
  night: 'Night',
};

export const POSITION_LABELS: Record<Position, string> = {
  QB: 'Quarterback',
  WR: 'Wide Receiver',
  DB: 'Defensive Back',
  LB: 'Linebacker',
};

export const PLAY_STYLE_LABELS: Record<PlayStyle, { label: string; desc: string }> = {
  aggressive: { label: 'Aggressive', desc: 'Bold moves, high risk/reward' },
  balanced: { label: 'Balanced', desc: 'Steady approach, measured decisions' },
  calculated: { label: 'Calculated', desc: 'Patient, strategic long game' },
};

export const PRIORITY_LABELS: Record<Priority, { label: string; desc: string }> = {
  'playing-time': { label: 'Playing Time', desc: 'Start now, prove yourself' },
  'nil': { label: 'NIL Deals', desc: 'Maximize your earning potential' },
  'development': { label: 'Development', desc: 'Best coaching, long-term growth' },
};
