import { useState, useCallback, useEffect, useRef } from 'react';
import { 
  GameState, 
  GamePhase, 
  Task, 
  MiniGameType, 
  MiniGameState,
  PlayerProfile,
  GameSettings,
  HighScore,
  RunStats
} from '@/types/game';
import { LEVELS, TASK_CONFIG, getComboMultiplier } from '@/config/levels';

const STORAGE_KEYS = {
  PROFILE: 'tequila_profile',
  SETTINGS: 'tequila_settings',
  HIGH_SCORES: 'tequila_highscores',
};

const DEFAULT_SETTINGS: GameSettings = {
  musicEnabled: true,
  sfxEnabled: true,
  reducedMotion: false,
  colorblindMode: false,
  difficulty: 'normal',
};

const DEFAULT_PROFILE: PlayerProfile = {
  name: 'Player',
  bestScore: 0,
  gamesPlayed: 0,
  createdAt: Date.now(),
};

const createInitialStats = (): RunStats => ({
  score: 0,
  combo: 0,
  maxCombo: 0,
  tasksCompleted: 0,
  tasksFailed: 0,
  level: 1,
  timeElapsed: 0,
});

const createInitialState = (): GameState => ({
  phase: 'menu',
  currentLevel: 1,
  score: 0,
  combo: 0,
  maxCombo: 0,
  timeRemaining: 60,
  activeTasks: [],
  currentMiniGame: null,
  stats: createInitialStats(),
});

export function useGameState() {
  const [gameState, setGameState] = useState<GameState>(createInitialState);
  const [profile, setProfile] = useState<PlayerProfile>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.PROFILE);
    return saved ? JSON.parse(saved) : DEFAULT_PROFILE;
  });
  const [settings, setSettings] = useState<GameSettings>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.SETTINGS);
    return saved ? JSON.parse(saved) : DEFAULT_SETTINGS;
  });
  const [highScores, setHighScores] = useState<HighScore[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.HIGH_SCORES);
    return saved ? JSON.parse(saved) : [];
  });

  const gameLoopRef = useRef<number | null>(null);
  const lastTickRef = useRef<number>(0);
  const taskSpawnRef = useRef<number>(0);

  // Save to localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.PROFILE, JSON.stringify(profile));
  }, [profile]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
  }, [settings]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.HIGH_SCORES, JSON.stringify(highScores));
  }, [highScores]);

  const setPhase = useCallback((phase: GamePhase) => {
    setGameState(prev => ({ ...prev, phase }));
  }, []);

  const updateProfile = useCallback((updates: Partial<PlayerProfile>) => {
    setProfile(prev => ({ ...prev, ...updates }));
  }, []);

  const updateSettings = useCallback((updates: Partial<GameSettings>) => {
    setSettings(prev => ({ ...prev, ...updates }));
  }, []);

  const addHighScore = useCallback((score: number, level: number) => {
    const newScore: HighScore = {
      name: profile.name,
      score,
      level,
      date: Date.now(),
    };
    setHighScores(prev => {
      const updated = [...prev, newScore].sort((a, b) => b.score - a.score).slice(0, 10);
      return updated;
    });
    if (score > profile.bestScore) {
      updateProfile({ bestScore: score });
    }
  }, [profile.name, profile.bestScore, updateProfile]);

  const generateTask = useCallback((): Task => {
    const level = LEVELS[gameState.currentLevel - 1];
    const types = level.minigames;
    const type = types[Math.floor(Math.random() * types.length)];
    const config = TASK_CONFIG[type];
    
    return {
      id: `task_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      type,
      timeLimit: config.timeLimit,
      startTime: Date.now(),
      completed: false,
      points: config.basePoints,
    };
  }, [gameState.currentLevel]);

  const startMiniGame = useCallback((task: Task) => {
    const miniGameState: MiniGameState = {
      type: task.type,
      data: null,
      timeRemaining: task.timeLimit / 1000,
    };
    setGameState(prev => ({
      ...prev,
      phase: 'minigame',
      currentMiniGame: miniGameState,
    }));
  }, []);

  const completeMiniGame = useCallback((success: boolean, taskId: string) => {
    setGameState(prev => {
      const task = prev.activeTasks.find(t => t.id === taskId);
      if (!task) return prev;

      const level = LEVELS[prev.currentLevel - 1];
      let newCombo = success ? prev.combo + 1 : 0;
      let newMaxCombo = Math.max(prev.maxCombo, newCombo);
      let pointsEarned = 0;

      if (success) {
        const multiplier = getComboMultiplier(newCombo) * level.scoreMultiplier;
        pointsEarned = Math.floor(task.points * multiplier);
      }

      return {
        ...prev,
        phase: 'playing',
        score: prev.score + pointsEarned,
        combo: newCombo,
        maxCombo: newMaxCombo,
        activeTasks: prev.activeTasks.filter(t => t.id !== taskId),
        currentMiniGame: null,
        stats: {
          ...prev.stats,
          score: prev.score + pointsEarned,
          combo: newCombo,
          maxCombo: newMaxCombo,
          tasksCompleted: success ? prev.stats.tasksCompleted + 1 : prev.stats.tasksCompleted,
          tasksFailed: success ? prev.stats.tasksFailed : prev.stats.tasksFailed + 1,
        },
      };
    });
  }, []);

  const startLevel = useCallback((levelNum: number) => {
    const level = LEVELS[levelNum - 1];
    setGameState({
      phase: 'playing',
      currentLevel: levelNum,
      score: 0,
      combo: 0,
      maxCombo: 0,
      timeRemaining: level.duration,
      activeTasks: [],
      currentMiniGame: null,
      stats: { ...createInitialStats(), level: levelNum },
    });
    lastTickRef.current = Date.now();
    taskSpawnRef.current = Date.now();
  }, []);

  const pauseGame = useCallback(() => {
    setGameState(prev => ({ ...prev, phase: 'paused' }));
  }, []);

  const resumeGame = useCallback(() => {
    lastTickRef.current = Date.now();
    setGameState(prev => ({ ...prev, phase: 'playing' }));
  }, []);

  const endLevel = useCallback((success: boolean) => {
    if (success) {
      setGameState(prev => ({
        ...prev,
        phase: 'levelComplete',
      }));
    } else {
      setGameState(prev => {
        addHighScore(prev.score, prev.currentLevel);
        updateProfile({ gamesPlayed: profile.gamesPlayed + 1 });
        return { ...prev, phase: 'gameOver' };
      });
    }
  }, [addHighScore, profile.gamesPlayed, updateProfile]);

  const nextLevel = useCallback(() => {
    const nextLevelNum = gameState.currentLevel + 1;
    if (nextLevelNum <= LEVELS.length) {
      startLevel(nextLevelNum);
    } else {
      // Game completed!
      addHighScore(gameState.score, gameState.currentLevel);
      updateProfile({ gamesPlayed: profile.gamesPlayed + 1 });
      setPhase('gameOver');
    }
  }, [gameState.currentLevel, gameState.score, startLevel, addHighScore, profile.gamesPlayed, updateProfile, setPhase]);

  const returnToMenu = useCallback(() => {
    setGameState(createInitialState());
  }, []);

  // Game loop
  useEffect(() => {
    if (gameState.phase !== 'playing') {
      if (gameLoopRef.current) {
        cancelAnimationFrame(gameLoopRef.current);
      }
      return;
    }

    const tick = () => {
      const now = Date.now();
      const delta = (now - lastTickRef.current) / 1000;
      lastTickRef.current = now;

      setGameState(prev => {
        if (prev.phase !== 'playing') return prev;

        const level = LEVELS[prev.currentLevel - 1];
        const newTimeRemaining = prev.timeRemaining - delta;

        // Check level completion
        if (newTimeRemaining <= 0) {
          endLevel(true);
          return prev;
        }

        // Spawn new tasks
        let newTasks = [...prev.activeTasks];
        if (now - taskSpawnRef.current > level.taskInterval && newTasks.length < level.maxActiveTasks) {
          newTasks.push(generateTask());
          taskSpawnRef.current = now;
        }

        // Check for expired tasks
        const expiredTasks = newTasks.filter(t => now - t.startTime > t.timeLimit);
        if (expiredTasks.length > 0) {
          newTasks = newTasks.filter(t => now - t.startTime <= t.timeLimit);
          // Break combo for expired tasks
          return {
            ...prev,
            timeRemaining: newTimeRemaining,
            activeTasks: newTasks,
            combo: 0,
            stats: {
              ...prev.stats,
              tasksFailed: prev.stats.tasksFailed + expiredTasks.length,
              timeElapsed: prev.stats.timeElapsed + delta,
            },
          };
        }

        return {
          ...prev,
          timeRemaining: newTimeRemaining,
          activeTasks: newTasks,
          stats: {
            ...prev.stats,
            timeElapsed: prev.stats.timeElapsed + delta,
          },
        };
      });

      gameLoopRef.current = requestAnimationFrame(tick);
    };

    gameLoopRef.current = requestAnimationFrame(tick);

    return () => {
      if (gameLoopRef.current) {
        cancelAnimationFrame(gameLoopRef.current);
      }
    };
  }, [gameState.phase, generateTask, endLevel]);

  return {
    gameState,
    profile,
    settings,
    highScores,
    setPhase,
    updateProfile,
    updateSettings,
    startLevel,
    startMiniGame,
    completeMiniGame,
    pauseGame,
    resumeGame,
    endLevel,
    nextLevel,
    returnToMenu,
  };
}
