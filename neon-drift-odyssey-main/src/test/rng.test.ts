import { describe, it, expect } from 'vitest';
import { SeededRNG, seedToString, stringToSeed } from '../game/rng';

describe('SeededRNG', () => {
  it('produces deterministic results with same seed', () => {
    const rng1 = new SeededRNG(12345);
    const rng2 = new SeededRNG(12345);
    
    for (let i = 0; i < 100; i++) {
      expect(rng1.next()).toBe(rng2.next());
    }
  });
  
  it('produces different results with different seeds', () => {
    const rng1 = new SeededRNG(12345);
    const rng2 = new SeededRNG(54321);
    
    const results1: number[] = [];
    const results2: number[] = [];
    
    for (let i = 0; i < 10; i++) {
      results1.push(rng1.next());
      results2.push(rng2.next());
    }
    
    expect(results1).not.toEqual(results2);
  });
  
  it('range produces values within bounds', () => {
    const rng = new SeededRNG(42);
    
    for (let i = 0; i < 100; i++) {
      const val = rng.range(10, 20);
      expect(val).toBeGreaterThanOrEqual(10);
      expect(val).toBeLessThan(20);
    }
  });
  
  it('int produces integers within bounds', () => {
    const rng = new SeededRNG(42);
    
    for (let i = 0; i < 100; i++) {
      const val = rng.int(1, 6);
      expect(val).toBeGreaterThanOrEqual(1);
      expect(val).toBeLessThanOrEqual(6);
      expect(Number.isInteger(val)).toBe(true);
    }
  });
  
  it('bool respects probability', () => {
    const rng = new SeededRNG(42);
    let trueCount = 0;
    const iterations = 10000;
    
    for (let i = 0; i < iterations; i++) {
      if (rng.bool(0.3)) trueCount++;
    }
    
    // Should be roughly 30%, allow 5% margin
    const ratio = trueCount / iterations;
    expect(ratio).toBeGreaterThan(0.25);
    expect(ratio).toBeLessThan(0.35);
  });
  
  it('pick returns elements from array', () => {
    const rng = new SeededRNG(42);
    const array = ['a', 'b', 'c', 'd'];
    
    for (let i = 0; i < 100; i++) {
      const picked = rng.pick(array);
      expect(array).toContain(picked);
    }
  });
  
  it('reset restores initial state', () => {
    const rng = new SeededRNG(42);
    const firstValues: number[] = [];
    
    for (let i = 0; i < 10; i++) {
      firstValues.push(rng.next());
    }
    
    rng.reset();
    
    for (let i = 0; i < 10; i++) {
      expect(rng.next()).toBe(firstValues[i]);
    }
  });
  
  it('clone preserves state', () => {
    const rng = new SeededRNG(42);
    
    // Advance state
    for (let i = 0; i < 50; i++) {
      rng.next();
    }
    
    const cloned = rng.clone();
    
    // Both should produce same next values
    for (let i = 0; i < 10; i++) {
      expect(rng.next()).toBe(cloned.next());
    }
  });
});

describe('Seed conversion', () => {
  it('converts seed to string and back', () => {
    const seed = 1234567890;
    const str = seedToString(seed);
    const restored = stringToSeed(str);
    
    expect(restored).toBe(seed);
  });
  
  it('produces uppercase strings', () => {
    const str = seedToString(12345);
    expect(str).toBe(str.toUpperCase());
  });
});
