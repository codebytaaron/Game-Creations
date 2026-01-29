import { Level, CellType, Guard, Loot, Position } from '@/types/game';

const generateId = () => Math.random().toString(36).substring(2, 9);

const shuffle = <T>(array: T[]): T[] => {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
};

const manhattanDistance = (a: Position, b: Position): number => {
  return Math.abs(a.x - b.x) + Math.abs(a.y - b.y);
};

const isValidPosition = (grid: CellType[][], pos: Position): boolean => {
  return (
    pos.x >= 0 &&
    pos.x < grid[0].length &&
    pos.y >= 0 &&
    pos.y < grid.length &&
    grid[pos.y][pos.x] !== 'wall'
  );
};

const generatePatrolPath = (
  grid: CellType[][],
  start: Position,
  length: number
): Position[] => {
  const path: Position[] = [start];
  const directions = [
    { x: 0, y: -1 },
    { x: 0, y: 1 },
    { x: -1, y: 0 },
    { x: 1, y: 0 },
  ];

  let current = start;
  for (let i = 0; i < length - 1; i++) {
    const validMoves = directions
      .map((d) => ({ x: current.x + d.x, y: current.y + d.y }))
      .filter(
        (pos) =>
          isValidPosition(grid, pos) &&
          !path.some((p) => p.x === pos.x && p.y === pos.y)
      );

    if (validMoves.length === 0) break;
    current = validMoves[Math.floor(Math.random() * validMoves.length)];
    path.push(current);
  }

  return path;
};

export const generateLevel = (levelNumber: number): Level => {
  const baseSize = 10;
  const sizeIncrease = Math.min(levelNumber * 2, 10);
  const width = baseSize + sizeIncrease;
  const height = baseSize + sizeIncrease;

  // Initialize grid with walls
  const grid: CellType[][] = Array(height)
    .fill(null)
    .map(() => Array(width).fill('wall'));

  // Create rooms and corridors using simple algorithm
  const rooms: { x: number; y: number; w: number; h: number }[] = [];
  const roomCount = 3 + Math.floor(levelNumber / 2);
  const minRoomSize = 3;
  const maxRoomSize = Math.min(5, Math.floor(Math.min(width, height) / 3));

  for (let i = 0; i < roomCount * 3; i++) {
    const w = minRoomSize + Math.floor(Math.random() * (maxRoomSize - minRoomSize));
    const h = minRoomSize + Math.floor(Math.random() * (maxRoomSize - minRoomSize));
    const x = 1 + Math.floor(Math.random() * (width - w - 2));
    const y = 1 + Math.floor(Math.random() * (height - h - 2));

    const overlaps = rooms.some(
      (r) =>
        x < r.x + r.w + 1 &&
        x + w + 1 > r.x &&
        y < r.y + r.h + 1 &&
        y + h + 1 > r.y
    );

    if (!overlaps && rooms.length < roomCount) {
      rooms.push({ x, y, w, h });
      for (let ry = y; ry < y + h; ry++) {
        for (let rx = x; rx < x + w; rx++) {
          grid[ry][rx] = 'floor';
        }
      }
    }
  }

  // Connect rooms with corridors
  for (let i = 0; i < rooms.length - 1; i++) {
    const r1 = rooms[i];
    const r2 = rooms[i + 1];
    const x1 = Math.floor(r1.x + r1.w / 2);
    const y1 = Math.floor(r1.y + r1.h / 2);
    const x2 = Math.floor(r2.x + r2.w / 2);
    const y2 = Math.floor(r2.y + r2.h / 2);

    // Horizontal then vertical
    for (let x = Math.min(x1, x2); x <= Math.max(x1, x2); x++) {
      if (y1 >= 0 && y1 < height && x >= 0 && x < width) {
        grid[y1][x] = 'floor';
      }
    }
    for (let y = Math.min(y1, y2); y <= Math.max(y1, y2); y++) {
      if (y >= 0 && y < height && x2 >= 0 && x2 < width) {
        grid[y][x2] = 'floor';
      }
    }
  }

  // Get all floor positions
  const floorPositions: Position[] = [];
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      if (grid[y][x] === 'floor') {
        floorPositions.push({ x, y });
      }
    }
  }

  if (floorPositions.length < 10) {
    // Fallback: create a simple open area
    for (let y = 2; y < height - 2; y++) {
      for (let x = 2; x < width - 2; x++) {
        grid[y][x] = 'floor';
        floorPositions.push({ x, y });
      }
    }
  }

  const shuffledPositions = shuffle(floorPositions);

  // Place player start
  const playerStart = shuffledPositions[0];

  // Place exit (far from player)
  const sortedByDistance = [...shuffledPositions].sort(
    (a, b) => manhattanDistance(b, playerStart) - manhattanDistance(a, playerStart)
  );
  const exit = sortedByDistance[0];
  grid[exit.y][exit.x] = 'exit';

  // Generate loot
  const lootCount = 3 + levelNumber;
  const loot: Loot[] = [];
  const usedPositions = new Set([
    `${playerStart.x},${playerStart.y}`,
    `${exit.x},${exit.y}`,
  ]);

  for (let i = 0; i < lootCount && i < shuffledPositions.length - 2; i++) {
    const pos = shuffledPositions.find(
      (p) => !usedPositions.has(`${p.x},${p.y}`)
    );
    if (pos) {
      usedPositions.add(`${pos.x},${pos.y}`);
      loot.push({
        id: generateId(),
        position: pos,
        value: 100 + Math.floor(Math.random() * 100) * levelNumber,
        collected: false,
      });
    }
  }

  // Generate guards
  const guardCount = 1 + Math.floor(levelNumber / 2);
  const guards: Guard[] = [];

  for (let i = 0; i < guardCount; i++) {
    const pos = shuffledPositions.find(
      (p) =>
        !usedPositions.has(`${p.x},${p.y}`) &&
        manhattanDistance(p, playerStart) > 4
    );
    if (pos) {
      usedPositions.add(`${pos.x},${pos.y}`);
      const patrolPath = generatePatrolPath(grid, pos, 3 + Math.floor(Math.random() * 4));
      guards.push({
        id: generateId(),
        position: { ...pos },
        state: 'patrol',
        patrolPath,
        patrolIndex: 0,
        patrolDirection: 1,
        visionRange: 3 + Math.floor(levelNumber / 3),
        investigateTarget: null,
        alertCountdown: 0,
      });
    }
  }

  // Add keycard doors on higher levels
  const keycardDoors: Position[] = [];
  if (levelNumber >= 3) {
    // Find a corridor position to block
    const corridorPos = shuffledPositions.find(
      (p) =>
        !usedPositions.has(`${p.x},${p.y}`) &&
        manhattanDistance(p, exit) < manhattanDistance(playerStart, exit) / 2
    );
    if (corridorPos) {
      grid[corridorPos.y][corridorPos.x] = 'keycard-door';
      keycardDoors.push(corridorPos);
    }
  }

  return {
    width,
    height,
    grid,
    guards,
    loot,
    playerStart,
    exit,
    keycardDoors,
    difficulty: levelNumber,
  };
};

export const generateTutorialLevel = (): Level => {
  const width = 12;
  const height = 10;

  const grid: CellType[][] = Array(height)
    .fill(null)
    .map(() => Array(width).fill('wall'));

  // Create a simple T-shaped layout
  // Main corridor
  for (let x = 1; x < width - 1; x++) {
    grid[height - 3][x] = 'floor';
  }
  // Vertical corridor
  for (let y = 1; y < height - 1; y++) {
    grid[y][Math.floor(width / 2)] = 'floor';
  }
  // Starting room
  for (let y = height - 4; y < height - 1; y++) {
    for (let x = 1; x < 4; x++) {
      grid[y][x] = 'floor';
    }
  }
  // Exit room
  for (let y = 1; y < 4; y++) {
    for (let x = width - 4; x < width - 1; x++) {
      grid[y][x] = 'floor';
    }
  }
  // Connect rooms
  for (let x = Math.floor(width / 2); x < width - 1; x++) {
    grid[2][x] = 'floor';
  }

  const playerStart: Position = { x: 2, y: height - 2 };
  const exit: Position = { x: width - 2, y: 2 };
  grid[exit.y][exit.x] = 'exit';

  const loot: Loot[] = [
    { id: 'loot1', position: { x: Math.floor(width / 2), y: 5 }, value: 100, collected: false },
    { id: 'loot2', position: { x: width - 3, y: 2 }, value: 150, collected: false },
  ];

  const guards: Guard[] = [
    {
      id: 'guard1',
      position: { x: Math.floor(width / 2), y: 3 },
      state: 'patrol',
      patrolPath: [
        { x: Math.floor(width / 2), y: 3 },
        { x: Math.floor(width / 2), y: 5 },
      ],
      patrolIndex: 0,
      patrolDirection: 1,
      visionRange: 3,
      investigateTarget: null,
      alertCountdown: 0,
    },
  ];

  return {
    width,
    height,
    grid,
    guards,
    loot,
    playerStart,
    exit,
    keycardDoors: [],
    difficulty: 0,
  };
};
