import { useState, useCallback, useEffect } from 'react';
import { GameState, GameStats, Direction, Position, Tool } from '@/types/game';
import { generateLevel, generateTutorialLevel } from '@/utils/levelGenerator';
import {
  getDirectionOffset,
  canMoveTo,
  updateGuards,
  checkGuardCollision,
  checkPlayerSpotted,
  updateNoises,
  updateToolCooldowns,
  createInitialTools,
  manhattanDistance,
} from '@/utils/gameLogic';

const STORAGE_KEY = 'gridheist_highscore';
const STATS_KEY = 'gridheist_stats';

export const useGameState = () => {
  const [gameState, setGameState] = useState<GameState | null>(null);
  const [stats, setStats] = useState<GameStats>({
    levelsCompleted: 0,
    totalScore: 0,
    lootCollected: 0,
    turnsUsed: 0,
    timesSpotted: 0,
    toolsUsed: 0,
  });
  const [highScore, setHighScore] = useState<number>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? parseInt(saved, 10) : 0;
  });

  const initGame = useCallback((isTutorial: boolean = false) => {
    const level = isTutorial ? generateTutorialLevel() : generateLevel(1);
    
    setGameState({
      level,
      player: {
        position: { ...level.playerStart },
        hasKeycard: false,
        tools: createInitialTools(),
        isVisible: true,
        inSmoke: false,
      },
      score: 0,
      totalLootCollected: 0,
      alertMeter: 0,
      maxAlertMeter: 100,
      turn: 0,
      noises: [],
      gameStatus: 'playing',
      currentLevelNumber: isTutorial ? 0 : 1,
      message: isTutorial 
        ? 'Welcome! Use WASD or Arrow keys to move. Collect the gold coins and reach the green exit!' 
        : null,
      messageType: 'info',
    });
    setStats({
      levelsCompleted: 0,
      totalScore: 0,
      lootCollected: 0,
      turnsUsed: 0,
      timesSpotted: 0,
      toolsUsed: 0,
    });
  }, []);

  const nextLevel = useCallback(() => {
    if (!gameState) return;
    
    const nextLevelNumber = gameState.currentLevelNumber + 1;
    const level = generateLevel(nextLevelNumber);
    
    setGameState((prev) => {
      if (!prev) return null;
      return {
        ...prev,
        level,
        player: {
          ...prev.player,
          position: { ...level.playerStart },
          hasKeycard: false,
          inSmoke: false,
        },
        turn: 0,
        noises: [],
        gameStatus: 'playing',
        currentLevelNumber: nextLevelNumber,
        message: `Level ${nextLevelNumber} - Difficulty increased!`,
        messageType: 'info',
      };
    });
  }, [gameState]);

  const movePlayer = useCallback((direction: Direction) => {
    if (!gameState || gameState.gameStatus !== 'playing') return;

    const offset = getDirectionOffset(direction);
    const newPos: Position = {
      x: gameState.player.position.x + offset.x,
      y: gameState.player.position.y + offset.y,
    };

    if (!canMoveTo(gameState.level.grid, newPos, gameState.player.hasKeycard)) {
      return;
    }

    setGameState((prev) => {
      if (!prev) return null;

      let newState = { ...prev };
      let newPlayer = { ...prev.player, position: newPos };
      let newScore = prev.score;
      let newLootCollected = prev.totalLootCollected;
      let newAlertMeter = prev.alertMeter;
      let newMessage: string | null = null;
      let newMessageType: 'info' | 'warning' | 'success' | 'danger' = 'info';

      // Check for loot collection
      const newLoot = prev.level.loot.map((l) => {
        if (!l.collected && l.position.x === newPos.x && l.position.y === newPos.y) {
          newScore += l.value;
          newLootCollected++;
          newMessage = `+${l.value} points!`;
          newMessageType = 'success';
          return { ...l, collected: true };
        }
        return l;
      });

      // Check for keycard pickup (near keycard doors)
      if (!newPlayer.hasKeycard) {
        const nearKeycardDoor = prev.level.keycardDoors.some(
          (door) => manhattanDistance(newPos, door) <= 2
        );
        // Simplified: player finds keycard when near certain loot
        const foundKeycard = newLoot.some(
          (l) => l.collected && Math.random() < 0.3
        );
        if (foundKeycard || prev.level.keycardDoors.length === 0) {
          newPlayer.hasKeycard = true;
        }
      }

      // Update guards
      const newGuards = updateGuards({
        ...prev,
        player: newPlayer,
        level: { ...prev.level, loot: newLoot },
      });

      // Check if caught
      if (checkGuardCollision(newGuards, newPos)) {
        newAlertMeter = prev.maxAlertMeter;
        newMessage = 'CAUGHT! Game Over!';
        newMessageType = 'danger';
      }

      // Check if spotted
      if (checkPlayerSpotted(newGuards, newPos, prev.level.grid, newPlayer.inSmoke)) {
        newAlertMeter = Math.min(prev.maxAlertMeter, prev.alertMeter + 20);
        if (newAlertMeter >= prev.maxAlertMeter) {
          newMessage = 'ALERT MAXED! Guards are closing in!';
          newMessageType = 'danger';
        } else if (prev.alertMeter < 50 && newAlertMeter >= 50) {
          newMessage = 'Warning: Alert level rising!';
          newMessageType = 'warning';
        }
        setStats((s) => ({ ...s, timesSpotted: s.timesSpotted + 1 }));
      } else {
        // Slowly decrease alert when not spotted
        newAlertMeter = Math.max(0, prev.alertMeter - 2);
      }

      // Check for exit
      const cell = prev.level.grid[newPos.y]?.[newPos.x];
      if (cell === 'exit') {
        newMessage = 'Level Complete!';
        newMessageType = 'success';
        setStats((s) => ({
          ...s,
          levelsCompleted: s.levelsCompleted + 1,
          totalScore: s.totalScore + newScore,
          lootCollected: s.lootCollected + newLootCollected,
        }));
        
        return {
          ...prev,
          player: newPlayer,
          score: newScore,
          totalLootCollected: newLootCollected,
          level: { ...prev.level, loot: newLoot, guards: newGuards },
          turn: prev.turn + 1,
          noises: updateNoises(prev.noises),
          gameStatus: 'won',
          message: newMessage,
          messageType: newMessageType,
        };
      }

      // Game over check
      const gameOver = newAlertMeter >= prev.maxAlertMeter;

      // Update smoke status
      newPlayer.inSmoke = prev.noises.some(
        (n) => n.turnsRemaining > 0 && manhattanDistance(newPos, n.position) <= 1
      );

      setStats((s) => ({ ...s, turnsUsed: s.turnsUsed + 1 }));

      return {
        ...prev,
        player: {
          ...newPlayer,
          tools: updateToolCooldowns(newPlayer.tools),
        },
        score: newScore,
        totalLootCollected: newLootCollected,
        alertMeter: newAlertMeter,
        level: { ...prev.level, loot: newLoot, guards: newGuards },
        turn: prev.turn + 1,
        noises: updateNoises(prev.noises),
        gameStatus: gameOver ? 'lost' : 'playing',
        message: newMessage || prev.message,
        messageType: newMessageType,
      };
    });
  }, [gameState]);

  const useTool = useCallback((toolId: Tool['id']) => {
    if (!gameState || gameState.gameStatus !== 'playing') return;

    const tool = gameState.player.tools.find((t) => t.id === toolId);
    if (!tool || tool.currentCooldown > 0 || tool.charges <= 0) return;

    setGameState((prev) => {
      if (!prev) return null;

      const newTools = prev.player.tools.map((t) => {
        if (t.id === toolId) {
          return {
            ...t,
            currentCooldown: t.cooldown,
            charges: t.charges - 1,
          };
        }
        return t;
      });

      let newNoises = [...prev.noises];
      let newPlayer = { ...prev.player, tools: newTools };
      let newMessage: string | null = null;

      switch (toolId) {
        case 'smokebomb':
          newNoises.push({
            position: { ...prev.player.position },
            radius: 2,
            turnsRemaining: 3,
          });
          newPlayer.inSmoke = true;
          newMessage = 'Smoke bomb deployed! You are hidden for 3 turns.';
          break;
        case 'decoy':
          // Place decoy noise away from player
          const decoyPos = {
            x: Math.min(
              prev.level.width - 1,
              Math.max(0, prev.player.position.x + (Math.random() > 0.5 ? 3 : -3))
            ),
            y: Math.min(
              prev.level.height - 1,
              Math.max(0, prev.player.position.y + (Math.random() > 0.5 ? 3 : -3))
            ),
          };
          newNoises.push({
            position: decoyPos,
            radius: 4,
            turnsRemaining: 2,
          });
          newMessage = 'Decoy thrown! Guards will investigate.';
          break;
        case 'keycard':
          newPlayer.hasKeycard = true;
          newMessage = 'Keycard activated!';
          break;
      }

      setStats((s) => ({ ...s, toolsUsed: s.toolsUsed + 1 }));

      return {
        ...prev,
        player: newPlayer,
        noises: newNoises,
        message: newMessage,
        messageType: 'info',
      };
    });
  }, [gameState]);

  const togglePause = useCallback(() => {
    if (!gameState) return;
    setGameState((prev) => {
      if (!prev) return null;
      if (prev.gameStatus === 'playing') {
        return { ...prev, gameStatus: 'paused' };
      }
      if (prev.gameStatus === 'paused') {
        return { ...prev, gameStatus: 'playing' };
      }
      return prev;
    });
  }, [gameState]);

  // Save high score
  useEffect(() => {
    if (gameState && (gameState.gameStatus === 'won' || gameState.gameStatus === 'lost')) {
      if (stats.totalScore > highScore) {
        setHighScore(stats.totalScore);
        localStorage.setItem(STORAGE_KEY, stats.totalScore.toString());
      }
    }
  }, [gameState?.gameStatus, stats.totalScore, highScore]);

  return {
    gameState,
    stats,
    highScore,
    initGame,
    nextLevel,
    movePlayer,
    useTool,
    togglePause,
  };
};
