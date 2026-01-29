import { LevelConfig } from '@/types/game';

export const LEVELS: LevelConfig[] = [
  {
    id: 1,
    name: 'Opening Night',
    duration: 60,
    taskInterval: 4000,
    maxActiveTasks: 2,
    minigames: ['dj', 'lights'],
    scoreMultiplier: 1,
    description: 'Learn the basics. Keep the DJ booth running and fix the lights!',
  },
  {
    id: 2,
    name: 'Getting Busy',
    duration: 90,
    taskInterval: 3000,
    maxActiveTasks: 3,
    minigames: ['dj', 'lights', 'id-check'],
    scoreMultiplier: 1.5,
    description: 'More guests arriving! Check IDs and keep the vibe going.',
  },
  {
    id: 3,
    name: 'Peak Hours',
    duration: 120,
    taskInterval: 2500,
    maxActiveTasks: 4,
    minigames: ['dj', 'lights', 'id-check', 'drinks'],
    scoreMultiplier: 2,
    description: 'Full house! Handle everything at once to survive the rush!',
  },
];

export const TASK_CONFIG = {
  dj: {
    name: 'DJ Booth',
    icon: '🎧',
    basePoints: 100,
    timeLimit: 8000,
    color: 'cyan',
  },
  'id-check': {
    name: 'ID Check',
    icon: '🪪',
    basePoints: 150,
    timeLimit: 10000,
    color: 'magenta',
  },
  lights: {
    name: 'Fix Lights',
    icon: '💡',
    basePoints: 120,
    timeLimit: 12000,
    color: 'lime',
  },
  drinks: {
    name: 'Restock Drinks',
    icon: '🥤',
    basePoints: 130,
    timeLimit: 10000,
    color: 'orange',
  },
} as const;

export const COMBO_MULTIPLIERS = [1, 1.5, 2, 2.5, 3, 4, 5];

export const getComboMultiplier = (combo: number): number => {
  const index = Math.min(Math.floor(combo / 3), COMBO_MULTIPLIERS.length - 1);
  return COMBO_MULTIPLIERS[index];
};
