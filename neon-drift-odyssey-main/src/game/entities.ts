import type { Rectangle, Circle, Triangle } from './physics';

export interface Player extends Triangle {
  velocityX: number;
  velocityY: number;
  speed: number;
  hasShield: boolean;
  shieldTimer: number;
}

export interface Obstacle extends Rectangle {
  velocityX: number;
  velocityY: number;
  type: 'static' | 'moving';
  color: string;
  glowColor: string;
}

export interface Orb extends Circle {
  type: 'score' | 'shield';
  pulsePhase: number;
  collected: boolean;
}

export interface Particle {
  x: number;
  y: number;
  velocityX: number;
  velocityY: number;
  life: number;
  maxLife: number;
  size: number;
  color: string;
  type: 'trail' | 'explosion' | 'sparkle';
}

export interface TrackLine {
  y: number;
  width: number;
  x: number;
}

export function createPlayer(canvasWidth: number, canvasHeight: number): Player {
  return {
    x: canvasWidth / 2,
    y: canvasHeight * 0.75,
    width: 24,
    height: 32,
    rotation: 0,
    velocityX: 0,
    velocityY: 0,
    speed: 1,
    hasShield: false,
    shieldTimer: 0,
  };
}

export function createObstacle(
  x: number,
  y: number,
  width: number,
  height: number,
  type: 'static' | 'moving' = 'static',
  velocityX: number = 0
): Obstacle {
  return {
    x,
    y,
    width,
    height,
    velocityX,
    velocityY: 0,
    type,
    color: type === 'static' ? 'hsl(320, 100%, 60%)' : 'hsl(30, 100%, 55%)',
    glowColor: type === 'static' ? 'hsl(320, 100%, 60%)' : 'hsl(30, 100%, 55%)',
  };
}

export function createOrb(
  x: number,
  y: number,
  type: 'score' | 'shield' = 'score'
): Orb {
  return {
    x,
    y,
    radius: type === 'shield' ? 18 : 12,
    type,
    pulsePhase: Math.random() * Math.PI * 2,
    collected: false,
  };
}

export function createParticle(
  x: number,
  y: number,
  velocityX: number,
  velocityY: number,
  life: number,
  size: number,
  color: string,
  type: Particle['type'] = 'trail'
): Particle {
  return {
    x,
    y,
    velocityX,
    velocityY,
    life,
    maxLife: life,
    size,
    color,
    type,
  };
}

export function createTrackLine(y: number, canvasWidth: number): TrackLine {
  return {
    y,
    width: 80,
    x: canvasWidth / 2 - 40,
  };
}
