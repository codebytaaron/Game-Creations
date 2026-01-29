import { useState, useCallback, useRef, useEffect } from 'react';
import { 
  GameState, 
  Player, 
  Enemy, 
  Projectile, 
  SaveData,
  SkillNode,
  PlayerStats,
  EnemyType,
  Vector2,
} from '@/lib/gameTypes';
import { 
  generateId, 
  getXpForLevel, 
  getDefaultSkillTree, 
  getDefaultStats,
  applySkillEffects,
  createEnemy,
  createPowerNode,
  spawnPositionAwayFromPlayer,
  randomInRange,
} from '@/lib/gameUtils';
import { audioManager } from '@/lib/audioManager';

const SAVE_KEY = 'neon_control_save';

const loadSaveData = (): SaveData => {
  try {
    const saved = localStorage.getItem(SAVE_KEY);
    if (saved) {
      return JSON.parse(saved);
    }
  } catch (e) {
    console.error('Failed to load save data');
  }
  return {
    totalXp: 0,
    skillPoints: 0,
    unlockedSkills: [],
    highScore: 0,
    highestWave: 0,
    gamesPlayed: 0,
  };
};

const saveSaveData = (data: SaveData) => {
  try {
    localStorage.setItem(SAVE_KEY, JSON.stringify(data));
  } catch (e) {
    console.error('Failed to save data');
  }
};

export const useGameState = (canvasWidth: number, canvasHeight: number) => {
  const [saveData, setSaveData] = useState<SaveData>(loadSaveData);
  const [skillTree, setSkillTree] = useState<SkillNode[]>(() => {
    const tree = getDefaultSkillTree();
    const saved = loadSaveData();
    return tree.map(skill => ({
      ...skill,
      unlocked: saved.unlockedSkills.includes(skill.id),
    }));
  });

  const getPlayerStats = useCallback((): PlayerStats => {
    return applySkillEffects(getDefaultStats(), skillTree);
  }, [skillTree]);

  const createInitialPlayer = useCallback((): Player => {
    const stats = getPlayerStats();
    return {
      id: 'player',
      position: { x: canvasWidth / 2, y: canvasHeight / 2 },
      velocity: { x: 0, y: 0 },
      radius: 15,
      health: stats.maxHealth,
      maxHealth: stats.maxHealth,
      energy: stats.maxEnergy,
      maxEnergy: stats.maxEnergy,
      speed: stats.speed,
      fireRate: stats.fireRate,
      damage: stats.damage,
      lastShot: 0,
      invulnerable: 0,
      dashCooldown: stats.dashCooldown,
      lastDash: 0,
    };
  }, [canvasWidth, canvasHeight, getPlayerStats]);

  const createInitialState = useCallback((): GameState => {
    return {
      status: 'menu',
      player: createInitialPlayer(),
      enemies: [],
      projectiles: [],
      powerNodes: [],
      hazards: [],
      particles: [],
      wave: 0,
      score: 0,
      xp: 0,
      level: 1,
      xpToNextLevel: getXpForLevel(1),
      totalXp: saveData.totalXp,
      skillPoints: saveData.skillPoints,
      timeElapsed: 0,
      waveTimer: 0,
      arenaWidth: canvasWidth,
      arenaHeight: canvasHeight,
    };
  }, [canvasWidth, canvasHeight, createInitialPlayer, saveData]);

  const [gameState, setGameState] = useState<GameState>(createInitialState);

  const startGame = useCallback(() => {
    audioManager.buttonClick();
    setGameState(prev => ({
      ...createInitialState(),
      status: 'playing',
      wave: 1,
      waveTimer: Date.now(),
      totalXp: prev.totalXp,
      skillPoints: prev.skillPoints,
    }));
    audioManager.waveStart();
  }, [createInitialState]);

  const pauseGame = useCallback(() => {
    audioManager.pause();
    setGameState(prev => ({ ...prev, status: 'paused' }));
  }, []);

  const resumeGame = useCallback(() => {
    audioManager.resume();
    setGameState(prev => ({ ...prev, status: 'playing' }));
  }, []);

  const openSkills = useCallback(() => {
    audioManager.buttonClick();
    setGameState(prev => ({ ...prev, status: 'skills' }));
  }, []);

  const closeSkills = useCallback(() => {
    audioManager.buttonClick();
    setGameState(prev => ({ ...prev, status: 'menu' }));
  }, []);

  const returnToMenu = useCallback(() => {
    audioManager.buttonClick();
    setGameState(createInitialState);
  }, [createInitialState]);

  const gameOver = useCallback(() => {
    audioManager.gameOver();
    setGameState(prev => {
      const earnedXp = Math.floor(prev.score / 10);
      const newTotalXp = prev.totalXp + earnedXp;
      const newSkillPoints = prev.skillPoints + Math.floor(earnedXp / 50);
      
      const newSaveData: SaveData = {
        ...saveData,
        totalXp: newTotalXp,
        skillPoints: newSkillPoints,
        highScore: Math.max(saveData.highScore, prev.score),
        highestWave: Math.max(saveData.highestWave, prev.wave),
        gamesPlayed: saveData.gamesPlayed + 1,
      };
      
      setSaveData(newSaveData);
      saveSaveData(newSaveData);
      
      return { 
        ...prev, 
        status: 'gameover',
        totalXp: newTotalXp,
        skillPoints: newSkillPoints,
      };
    });
  }, [saveData]);

  const unlockSkill = useCallback((skillId: string) => {
    const skill = skillTree.find(s => s.id === skillId);
    if (!skill || skill.unlocked) return;
    if (gameState.skillPoints < skill.cost) return;
    
    const requirementsMet = skill.requires.every(
      reqId => skillTree.find(s => s.id === reqId)?.unlocked
    );
    if (!requirementsMet) return;
    
    audioManager.levelUp();
    
    setSkillTree(prev => prev.map(s => 
      s.id === skillId ? { ...s, unlocked: true } : s
    ));
    
    setGameState(prev => ({
      ...prev,
      skillPoints: prev.skillPoints - skill.cost,
    }));
    
    const newSaveData: SaveData = {
      ...saveData,
      skillPoints: saveData.skillPoints - skill.cost,
      unlockedSkills: [...saveData.unlockedSkills, skillId],
    };
    setSaveData(newSaveData);
    saveSaveData(newSaveData);
  }, [skillTree, gameState.skillPoints, saveData]);

  const addXp = useCallback((amount: number) => {
    setGameState(prev => {
      let newXp = prev.xp + amount;
      let newLevel = prev.level;
      let newSkillPoints = prev.skillPoints;
      let xpToNext = prev.xpToNextLevel;
      
      while (newXp >= xpToNext) {
        newXp -= xpToNext;
        newLevel++;
        newSkillPoints++;
        xpToNext = getXpForLevel(newLevel);
        audioManager.levelUp();
      }
      
      return {
        ...prev,
        xp: newXp,
        level: newLevel,
        xpToNextLevel: xpToNext,
        skillPoints: newSkillPoints,
      };
    });
  }, []);

  const spawnWave = useCallback((wave: number, playerPos: Vector2) => {
    const enemyCount = Math.min(3 + wave * 2, 20);
    const enemies: Enemy[] = [];
    
    const types: EnemyType[] = ['chaser'];
    if (wave >= 2) types.push('shooter');
    if (wave >= 4) types.push('bomber');
    
    for (let i = 0; i < enemyCount; i++) {
      const type = types[Math.floor(Math.random() * types.length)];
      const position = spawnPositionAwayFromPlayer(
        playerPos,
        canvasWidth,
        canvasHeight,
        200
      );
      enemies.push(createEnemy(type, position, wave));
    }
    
    // Spawn power nodes
    const nodeCount = Math.min(1 + Math.floor(wave / 2), 4);
    const nodeTypes: ('health' | 'energy' | 'damage' | 'speed')[] = ['health', 'energy', 'damage', 'speed'];
    const powerNodes = Array.from({ length: nodeCount }, () => {
      const type = nodeTypes[Math.floor(Math.random() * nodeTypes.length)];
      const position = spawnPositionAwayFromPlayer(
        playerPos,
        canvasWidth,
        canvasHeight,
        100
      );
      return createPowerNode(position, type);
    });
    
    setGameState(prev => ({
      ...prev,
      enemies: [...prev.enemies, ...enemies],
      powerNodes: [...prev.powerNodes, ...powerNodes],
    }));
    
    audioManager.waveStart();
  }, [canvasWidth, canvasHeight]);

  return {
    gameState,
    setGameState,
    startGame,
    pauseGame,
    resumeGame,
    openSkills,
    closeSkills,
    returnToMenu,
    gameOver,
    skillTree,
    unlockSkill,
    addXp,
    spawnWave,
    saveData,
    getPlayerStats,
  };
};
