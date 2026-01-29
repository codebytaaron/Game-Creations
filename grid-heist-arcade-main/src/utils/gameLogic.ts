import { GameState, Position, Direction, Guard, Tool, Noise, CellType } from '@/types/game';

export const getDirectionOffset = (direction: Direction): Position => {
  switch (direction) {
    case 'up': return { x: 0, y: -1 };
    case 'down': return { x: 0, y: 1 };
    case 'left': return { x: -1, y: 0 };
    case 'right': return { x: 1, y: 0 };
  }
};

export const manhattanDistance = (a: Position, b: Position): number => {
  return Math.abs(a.x - b.x) + Math.abs(a.y - b.y);
};

export const canMoveTo = (
  grid: CellType[][],
  pos: Position,
  hasKeycard: boolean
): boolean => {
  if (pos.x < 0 || pos.x >= grid[0].length || pos.y < 0 || pos.y >= grid.length) {
    return false;
  }
  const cell = grid[pos.y][pos.x];
  if (cell === 'wall') return false;
  if (cell === 'keycard-door' && !hasKeycard) return false;
  return true;
};

export const hasLineOfSight = (
  grid: CellType[][],
  from: Position,
  to: Position,
  range: number
): boolean => {
  const dist = manhattanDistance(from, to);
  if (dist > range) return false;

  // Simple ray casting
  const dx = to.x - from.x;
  const dy = to.y - from.y;
  const steps = Math.max(Math.abs(dx), Math.abs(dy));
  
  if (steps === 0) return true;

  for (let i = 1; i < steps; i++) {
    const x = Math.round(from.x + (dx * i) / steps);
    const y = Math.round(from.y + (dy * i) / steps);
    if (grid[y]?.[x] === 'wall') return false;
  }

  return true;
};

export const updateGuards = (state: GameState): Guard[] => {
  return state.level.guards.map((guard) => {
    const newGuard = { ...guard };
    const playerPos = state.player.position;
    const canSeePlayer =
      !state.player.inSmoke &&
      hasLineOfSight(
        state.level.grid,
        guard.position,
        playerPos,
        guard.visionRange
      );

    // Check for nearby noises
    const heardNoise = state.noises.find(
      (n) => manhattanDistance(guard.position, n.position) <= n.radius
    );

    switch (guard.state) {
      case 'patrol':
        if (canSeePlayer) {
          newGuard.state = 'chase';
          newGuard.alertCountdown = 5;
        } else if (heardNoise) {
          newGuard.state = 'investigate';
          newGuard.investigateTarget = heardNoise.position;
        } else {
          // Continue patrol
          const nextIndex = guard.patrolIndex + guard.patrolDirection;
          if (nextIndex >= guard.patrolPath.length || nextIndex < 0) {
            newGuard.patrolDirection = (guard.patrolDirection * -1) as 1 | -1;
            newGuard.patrolIndex = guard.patrolIndex + newGuard.patrolDirection;
          } else {
            newGuard.patrolIndex = nextIndex;
          }
          if (guard.patrolPath[newGuard.patrolIndex]) {
            newGuard.position = { ...guard.patrolPath[newGuard.patrolIndex] };
          }
        }
        break;

      case 'chase':
        if (canSeePlayer) {
          // Move towards player
          const dx = Math.sign(playerPos.x - guard.position.x);
          const dy = Math.sign(playerPos.y - guard.position.y);
          const newPos = { x: guard.position.x + dx, y: guard.position.y + dy };
          if (canMoveTo(state.level.grid, newPos, true)) {
            newGuard.position = newPos;
          }
          newGuard.alertCountdown = 5;
        } else {
          newGuard.alertCountdown--;
          if (newGuard.alertCountdown <= 0) {
            newGuard.state = 'alert';
            newGuard.alertCountdown = 3;
          }
        }
        break;

      case 'investigate':
        if (canSeePlayer) {
          newGuard.state = 'chase';
          newGuard.alertCountdown = 5;
        } else if (guard.investigateTarget) {
          if (
            guard.position.x === guard.investigateTarget.x &&
            guard.position.y === guard.investigateTarget.y
          ) {
            newGuard.state = 'alert';
            newGuard.investigateTarget = null;
            newGuard.alertCountdown = 3;
          } else {
            // Move towards investigation target
            const dx = Math.sign(guard.investigateTarget.x - guard.position.x);
            const dy = Math.sign(guard.investigateTarget.y - guard.position.y);
            const newPos = { x: guard.position.x + dx, y: guard.position.y + dy };
            if (canMoveTo(state.level.grid, newPos, true)) {
              newGuard.position = newPos;
            }
          }
        }
        break;

      case 'alert':
        if (canSeePlayer) {
          newGuard.state = 'chase';
          newGuard.alertCountdown = 5;
        } else {
          newGuard.alertCountdown--;
          if (newGuard.alertCountdown <= 0) {
            newGuard.state = 'patrol';
            // Return to nearest patrol point
            const nearestPatrolPoint = guard.patrolPath.reduce((nearest, point, index) => {
              const dist = manhattanDistance(guard.position, point);
              if (dist < nearest.dist) return { index, dist };
              return nearest;
            }, { index: 0, dist: Infinity });
            newGuard.patrolIndex = nearestPatrolPoint.index;
          }
        }
        break;
    }

    return newGuard;
  });
};

export const checkGuardCollision = (guards: Guard[], playerPos: Position): boolean => {
  return guards.some(
    (g) => g.position.x === playerPos.x && g.position.y === playerPos.y
  );
};

export const checkPlayerSpotted = (
  guards: Guard[],
  playerPos: Position,
  grid: CellType[][],
  inSmoke: boolean
): boolean => {
  if (inSmoke) return false;
  return guards.some(
    (g) =>
      g.state === 'chase' ||
      hasLineOfSight(grid, g.position, playerPos, g.visionRange)
  );
};

export const updateNoises = (noises: Noise[]): Noise[] => {
  return noises
    .map((n) => ({ ...n, turnsRemaining: n.turnsRemaining - 1 }))
    .filter((n) => n.turnsRemaining > 0);
};

export const updateToolCooldowns = (tools: Tool[]): Tool[] => {
  return tools.map((t) => ({
    ...t,
    currentCooldown: Math.max(0, t.currentCooldown - 1),
  }));
};

export const createInitialTools = (): Tool[] => [
  {
    id: 'smokebomb',
    name: 'Smoke Bomb',
    description: 'Creates a smoke cloud that hides you for 3 turns',
    cooldown: 5,
    currentCooldown: 0,
    charges: 2,
    maxCharges: 2,
  },
  {
    id: 'decoy',
    name: 'Decoy',
    description: 'Creates noise to distract guards',
    cooldown: 4,
    currentCooldown: 0,
    charges: 3,
    maxCharges: 3,
  },
  {
    id: 'keycard',
    name: 'Keycard',
    description: 'Opens locked doors',
    cooldown: 0,
    currentCooldown: 0,
    charges: 1,
    maxCharges: 1,
  },
];
