import { describe, it, expect } from 'vitest';
import {
  rectIntersect,
  circleIntersect,
  pointInRect,
  circleRectIntersect,
  triangleRectIntersect,
  triangleCircleIntersect,
  lerp,
  clamp,
} from '../game/physics';

describe('rectIntersect', () => {
  it('detects overlapping rectangles', () => {
    const a = { x: 0, y: 0, width: 10, height: 10 };
    const b = { x: 5, y: 5, width: 10, height: 10 };
    
    expect(rectIntersect(a, b)).toBe(true);
  });
  
  it('detects non-overlapping rectangles', () => {
    const a = { x: 0, y: 0, width: 10, height: 10 };
    const b = { x: 20, y: 20, width: 10, height: 10 };
    
    expect(rectIntersect(a, b)).toBe(false);
  });
  
  it('handles touching edges (no overlap)', () => {
    const a = { x: 0, y: 0, width: 10, height: 10 };
    const b = { x: 10, y: 0, width: 10, height: 10 };
    
    expect(rectIntersect(a, b)).toBe(false);
  });
  
  it('handles contained rectangle', () => {
    const a = { x: 0, y: 0, width: 20, height: 20 };
    const b = { x: 5, y: 5, width: 5, height: 5 };
    
    expect(rectIntersect(a, b)).toBe(true);
  });
});

describe('circleIntersect', () => {
  it('detects overlapping circles', () => {
    const a = { x: 0, y: 0, radius: 10 };
    const b = { x: 15, y: 0, radius: 10 };
    
    expect(circleIntersect(a, b)).toBe(true);
  });
  
  it('detects non-overlapping circles', () => {
    const a = { x: 0, y: 0, radius: 5 };
    const b = { x: 20, y: 0, radius: 5 };
    
    expect(circleIntersect(a, b)).toBe(false);
  });
  
  it('handles touching circles (overlap)', () => {
    const a = { x: 0, y: 0, radius: 10 };
    const b = { x: 20, y: 0, radius: 10 };
    
    expect(circleIntersect(a, b)).toBe(false);
  });
});

describe('pointInRect', () => {
  it('detects point inside rectangle', () => {
    const point = { x: 5, y: 5 };
    const rect = { x: 0, y: 0, width: 10, height: 10 };
    
    expect(pointInRect(point, rect)).toBe(true);
  });
  
  it('detects point outside rectangle', () => {
    const point = { x: 15, y: 15 };
    const rect = { x: 0, y: 0, width: 10, height: 10 };
    
    expect(pointInRect(point, rect)).toBe(false);
  });
  
  it('handles point on edge', () => {
    const point = { x: 0, y: 5 };
    const rect = { x: 0, y: 0, width: 10, height: 10 };
    
    expect(pointInRect(point, rect)).toBe(true);
  });
});

describe('circleRectIntersect', () => {
  it('detects circle overlapping rectangle', () => {
    const circle = { x: 15, y: 5, radius: 10 };
    const rect = { x: 0, y: 0, width: 10, height: 10 };
    
    expect(circleRectIntersect(circle, rect)).toBe(true);
  });
  
  it('detects circle inside rectangle', () => {
    const circle = { x: 50, y: 50, radius: 5 };
    const rect = { x: 0, y: 0, width: 100, height: 100 };
    
    expect(circleRectIntersect(circle, rect)).toBe(true);
  });
  
  it('detects non-overlapping circle and rectangle', () => {
    const circle = { x: 50, y: 50, radius: 5 };
    const rect = { x: 0, y: 0, width: 10, height: 10 };
    
    expect(circleRectIntersect(circle, rect)).toBe(false);
  });
});

describe('triangleRectIntersect', () => {
  it('detects overlapping triangle and rectangle', () => {
    const tri = { x: 10, y: 10, width: 10, height: 15, rotation: 0 };
    const rect = { x: 5, y: 5, width: 10, height: 10 };
    
    expect(triangleRectIntersect(tri, rect)).toBe(true);
  });
  
  it('detects non-overlapping triangle and rectangle', () => {
    const tri = { x: 50, y: 50, width: 10, height: 15, rotation: 0 };
    const rect = { x: 0, y: 0, width: 10, height: 10 };
    
    expect(triangleRectIntersect(tri, rect)).toBe(false);
  });
});

describe('triangleCircleIntersect', () => {
  it('detects overlapping triangle and circle', () => {
    const tri = { x: 10, y: 10, width: 10, height: 15, rotation: 0 };
    const circle = { x: 12, y: 12, radius: 5 };
    
    expect(triangleCircleIntersect(tri, circle)).toBe(true);
  });
  
  it('detects non-overlapping triangle and circle', () => {
    const tri = { x: 10, y: 10, width: 10, height: 15, rotation: 0 };
    const circle = { x: 50, y: 50, radius: 5 };
    
    expect(triangleCircleIntersect(tri, circle)).toBe(false);
  });
});

describe('lerp', () => {
  it('interpolates correctly at t=0', () => {
    expect(lerp(0, 100, 0)).toBe(0);
  });
  
  it('interpolates correctly at t=1', () => {
    expect(lerp(0, 100, 1)).toBe(100);
  });
  
  it('interpolates correctly at t=0.5', () => {
    expect(lerp(0, 100, 0.5)).toBe(50);
  });
  
  it('clamps t to [0, 1]', () => {
    expect(lerp(0, 100, -1)).toBe(0);
    expect(lerp(0, 100, 2)).toBe(100);
  });
});

describe('clamp', () => {
  it('returns value when in range', () => {
    expect(clamp(5, 0, 10)).toBe(5);
  });
  
  it('clamps to min', () => {
    expect(clamp(-5, 0, 10)).toBe(0);
  });
  
  it('clamps to max', () => {
    expect(clamp(15, 0, 10)).toBe(10);
  });
});
