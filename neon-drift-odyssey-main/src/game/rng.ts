/**
 * Seeded Pseudo-Random Number Generator
 * Uses Mulberry32 algorithm for deterministic random numbers
 */
export class SeededRNG {
  private state: number;
  public readonly seed: number;

  constructor(seed?: number) {
    this.seed = seed ?? Math.floor(Math.random() * 2147483647);
    this.state = this.seed;
  }

  /**
   * Generate next random number between 0 and 1
   */
  next(): number {
    let t = (this.state += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  }

  /**
   * Generate random number in range [min, max)
   */
  range(min: number, max: number): number {
    return min + this.next() * (max - min);
  }

  /**
   * Generate random integer in range [min, max]
   */
  int(min: number, max: number): number {
    return Math.floor(this.range(min, max + 1));
  }

  /**
   * Random boolean with optional probability
   */
  bool(probability: number = 0.5): boolean {
    return this.next() < probability;
  }

  /**
   * Pick random element from array
   */
  pick<T>(array: T[]): T {
    return array[this.int(0, array.length - 1)];
  }

  /**
   * Reset to initial seed
   */
  reset(): void {
    this.state = this.seed;
  }

  /**
   * Clone with same current state
   */
  clone(): SeededRNG {
    const cloned = new SeededRNG(this.seed);
    cloned.state = this.state;
    return cloned;
  }
}

/**
 * Generate a display-friendly seed string
 */
export function seedToString(seed: number): string {
  return seed.toString(36).toUpperCase();
}

/**
 * Parse seed from string
 */
export function stringToSeed(str: string): number {
  return parseInt(str.toLowerCase(), 36);
}
