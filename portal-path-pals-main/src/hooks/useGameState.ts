import { useState, useEffect, useCallback } from 'react';
import {
  GameState,
  Stats,
  Character,
  Stage,
  Scene,
  EventLogEntry,
  INITIAL_STATS,
  STAGES,
  StatDelta,
  Choice,
} from '@/types/game';
import { getRandomScene } from '@/data/scenes';
import { determineEnding } from '@/data/endings';

const STORAGE_KEY = 'portal-game-state';

const initialGameState: GameState = {
  screen: 'start',
  character: null,
  stats: { ...INITIAL_STATS },
  currentStage: 'morning',
  currentScene: null,
  eventLog: [],
  flags: [],
  ending: null,
  soundEnabled: true,
};

export function useGameState() {
  const [state, setState] = useState<GameState>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return initialGameState;
      }
    }
    return initialGameState;
  });

  const [usedSceneIds, setUsedSceneIds] = useState<string[]>([]);

  // Persist state changes
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state]);

  const setScreen = useCallback((screen: GameState['screen']) => {
    setState((prev) => ({ ...prev, screen }));
  }, []);

  const setCharacter = useCallback((character: Character) => {
    setState((prev) => ({ ...prev, character }));
  }, []);

  const setSoundEnabled = useCallback((enabled: boolean) => {
    setState((prev) => ({ ...prev, soundEnabled: enabled }));
  }, []);

  const startGame = useCallback(() => {
    const firstScene = getRandomScene('morning', []);
    setUsedSceneIds([firstScene.id]);
    setState((prev) => ({
      ...prev,
      screen: 'game',
      currentStage: 'morning',
      currentScene: firstScene,
      stats: { ...INITIAL_STATS },
      eventLog: [],
      flags: [],
      ending: null,
    }));
  }, []);

  const applyChoice = useCallback((choice: Choice) => {
    setState((prev) => {
      // Apply stat changes
      const newStats: Stats = { ...prev.stats };
      const delta = choice.delta;

      if (delta.stress !== undefined) {
        newStats.stress = Math.max(0, Math.min(100, newStats.stress + delta.stress));
      }
      if (delta.hype !== undefined) {
        newStats.hype = Math.max(0, Math.min(100, newStats.hype + delta.hype));
      }
      if (delta.fit !== undefined) {
        newStats.fit = Math.max(0, Math.min(100, newStats.fit + delta.fit));
      }
      if (delta.reputation !== undefined) {
        newStats.reputation = Math.max(0, Math.min(100, newStats.reputation + delta.reputation));
      }
      if (delta.energy !== undefined) {
        newStats.energy = Math.max(0, Math.min(100, newStats.energy + delta.energy));
      }

      // Add event log entry
      const logEntry: EventLogEntry = {
        stage: prev.currentStage,
        choiceText: choice.text,
        delta: choice.delta,
        timestamp: Date.now(),
      };

      // Add flags
      const newFlags = choice.setsFlag
        ? [...prev.flags, choice.setsFlag]
        : prev.flags;

      // Determine next stage
      const currentStageIndex = STAGES.indexOf(prev.currentStage);
      const isLastStage = currentStageIndex === STAGES.length - 1;

      if (isLastStage) {
        // Game ends
        const ending = determineEnding(newStats, newFlags);
        return {
          ...prev,
          stats: newStats,
          eventLog: [...prev.eventLog, logEntry],
          flags: newFlags,
          ending,
          screen: 'end' as const,
        };
      }

      // Move to next stage
      const nextStage = STAGES[currentStageIndex + 1];
      const nextScene = getRandomScene(nextStage, [...usedSceneIds, prev.currentScene?.id || '']);
      setUsedSceneIds((ids) => [...ids, nextScene.id]);

      return {
        ...prev,
        stats: newStats,
        eventLog: [...prev.eventLog, logEntry],
        flags: newFlags,
        currentStage: nextStage,
        currentScene: nextScene,
      };
    });
  }, [usedSceneIds]);

  const resetGame = useCallback(() => {
    setUsedSceneIds([]);
    setState(initialGameState);
    localStorage.removeItem(STORAGE_KEY);
  }, []);

  const generateShareText = useCallback(() => {
    if (!state.ending) return '';

    const statEmoji = (value: number) => {
      if (value >= 70) return '🟢';
      if (value >= 40) return '🟡';
      return '🔴';
    };

    return `🏈 The Portal Game

${state.ending.label}
"${state.ending.description.slice(0, 100)}..."

📊 Final Stats:
${statEmoji(state.stats.stress)} Stress: ${state.stats.stress}
${statEmoji(state.stats.hype)} Hype: ${state.stats.hype}
${statEmoji(state.stats.fit)} Fit: ${state.stats.fit}
${statEmoji(state.stats.reputation)} Rep: ${state.stats.reputation}
${statEmoji(state.stats.energy)} Energy: ${state.stats.energy}

Play: ${window.location.origin}`;
  }, [state.ending, state.stats]);

  return {
    state,
    setScreen,
    setCharacter,
    setSoundEnabled,
    startGame,
    applyChoice,
    resetGame,
    generateShareText,
  };
}
