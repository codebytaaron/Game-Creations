import { SeededRNG } from './rng';
import {
  Player,
  Obstacle,
  Orb,
  Particle,
  TrackLine,
  createPlayer,
  createObstacle,
  createOrb,
  createParticle,
  createTrackLine,
} from './entities';
import {
  triangleRectIntersect,
  triangleCircleIntersect,
  clamp,
  lerp,
} from './physics';
import {
  RenderContext,
  clearCanvas,
  drawTrackLines,
  drawRails,
  drawStars,
  drawPlayer,
  drawObstacle,
  drawOrb,
  drawParticle,
  drawSpeedLines,
} from './renderer';
import { audio } from './audio';

export type Difficulty = 'casual' | 'standard' | 'hardcore';

export interface DifficultySettings {
  baseSpeed: number;
  speedRampRate: number;
  obstacleSpawnRate: number;
  orbSpawnRate: number;
  shieldSpawnRate: number;
  movingObstacleTime: number;
}

const DIFFICULTY_PRESETS: Record<Difficulty, DifficultySettings> = {
  casual: {
    baseSpeed: 2.5,
    speedRampRate: 0.015,
    obstacleSpawnRate: 1200,
    orbSpawnRate: 3000,
    shieldSpawnRate: 15000,
    movingObstacleTime: 60000,
  },
  standard: {
    baseSpeed: 3.5,
    speedRampRate: 0.025,
    obstacleSpawnRate: 900,
    orbSpawnRate: 4000,
    shieldSpawnRate: 20000,
    movingObstacleTime: 45000,
  },
  hardcore: {
    baseSpeed: 4.5,
    speedRampRate: 0.04,
    obstacleSpawnRate: 600,
    orbSpawnRate: 5000,
    shieldSpawnRate: 30000,
    movingObstacleTime: 30000,
  },
};

export interface GameState {
  status: 'menu' | 'playing' | 'paused' | 'gameover';
  score: number;
  bestScore: number;
  time: number;
  speed: number;
  difficulty: Difficulty;
  seed: number;
  screenShakeEnabled: boolean;
  shieldTimer: number;
}

interface Star {
  x: number;
  y: number;
  size: number;
  brightness: number;
}

export class GameEngine {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private width: number = 0;
  private height: number = 0;
  private dpr: number = 1;
  
  private rng: SeededRNG;
  private settings: DifficultySettings;
  
  private player: Player;
  private obstacles: Obstacle[] = [];
  private orbs: Orb[] = [];
  private particles: Particle[] = [];
  private trackLines: TrackLine[] = [];
  private stars: Star[] = [];
  
  private state: GameState;
  private lastTime: number = 0;
  private accumulator: number = 0;
  private readonly FIXED_DT: number = 1000 / 60; // 60 FPS fixed timestep
  
  private trackLeft: number = 0;
  private trackRight: number = 0;
  private trackWidth: number = 0;
  
  private input = {
    left: false,
    right: false,
    up: false,
    down: false,
  };
  
  private lastObstacleSpawn: number = 0;
  private lastOrbSpawn: number = 0;
  private lastShieldSpawn: number = 0;
  
  private screenShake = { x: 0, y: 0 };
  private shakeIntensity: number = 0;
  
  private onStateChange: (state: GameState) => void;
  
  constructor(canvas: HTMLCanvasElement, onStateChange: (state: GameState) => void) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d')!;
    this.onStateChange = onStateChange;
    
    this.rng = new SeededRNG();
    this.settings = DIFFICULTY_PRESETS.standard;
    
    this.state = {
      status: 'menu',
      score: 0,
      bestScore: this.loadBestScore(),
      time: 0,
      speed: this.settings.baseSpeed,
      difficulty: 'standard',
      seed: this.rng.seed,
      screenShakeEnabled: true,
      shieldTimer: 0,
    };
    
    this.player = createPlayer(0, 0);
    
    this.resize();
    this.setupInput();
    this.generateStars();
  }
  
  private loadBestScore(): number {
    try {
      return parseInt(localStorage.getItem('neonDrift_bestScore') || '0', 10);
    } catch {
      return 0;
    }
  }
  
  private saveBestScore(score: number): void {
    try {
      localStorage.setItem('neonDrift_bestScore', score.toString());
    } catch {
      // Ignore storage errors
    }
  }
  
  resize(): void {
    this.dpr = window.devicePixelRatio || 1;
    const rect = this.canvas.getBoundingClientRect();
    
    this.width = rect.width;
    this.height = rect.height;
    
    this.canvas.width = this.width * this.dpr;
    this.canvas.height = this.height * this.dpr;
    
    this.ctx.scale(this.dpr, this.dpr);
    
    // Calculate track boundaries
    this.trackWidth = Math.min(this.width * 0.7, 500);
    this.trackLeft = (this.width - this.trackWidth) / 2;
    this.trackRight = this.trackLeft + this.trackWidth;
    
    // Reset player position
    this.player.x = this.width / 2;
    this.player.y = this.height * 0.75;
    
    this.generateStars();
  }
  
  private generateStars(): void {
    this.stars = [];
    const starCount = Math.floor((this.width * this.height) / 5000);
    
    for (let i = 0; i < starCount; i++) {
      this.stars.push({
        x: Math.random() * this.width,
        y: Math.random() * this.height,
        size: Math.random() * 1.5 + 0.5,
        brightness: Math.random() * 0.5 + 0.3,
      });
    }
  }
  
  private setupInput(): void {
    // Keyboard
    window.addEventListener('keydown', this.handleKeyDown);
    window.addEventListener('keyup', this.handleKeyUp);
    
    // Touch
    this.canvas.addEventListener('touchstart', this.handleTouchStart, { passive: false });
    this.canvas.addEventListener('touchmove', this.handleTouchMove, { passive: false });
    this.canvas.addEventListener('touchend', this.handleTouchEnd);
    
    // Visibility
    document.addEventListener('visibilitychange', this.handleVisibilityChange);
  }
  
  private handleKeyDown = (e: KeyboardEvent): void => {
    if (this.state.status !== 'playing' && this.state.status !== 'paused') return;
    
    switch (e.key.toLowerCase()) {
      case 'arrowleft':
      case 'a':
        this.input.left = true;
        e.preventDefault();
        break;
      case 'arrowright':
      case 'd':
        this.input.right = true;
        e.preventDefault();
        break;
      case 'arrowup':
      case 'w':
        this.input.up = true;
        e.preventDefault();
        break;
      case 'arrowdown':
      case 's':
        this.input.down = true;
        e.preventDefault();
        break;
      case ' ':
        this.togglePause();
        e.preventDefault();
        break;
    }
  };
  
  private handleKeyUp = (e: KeyboardEvent): void => {
    switch (e.key.toLowerCase()) {
      case 'arrowleft':
      case 'a':
        this.input.left = false;
        break;
      case 'arrowright':
      case 'd':
        this.input.right = false;
        break;
      case 'arrowup':
      case 'w':
        this.input.up = false;
        break;
      case 'arrowdown':
      case 's':
        this.input.down = false;
        break;
    }
  };
  
  private touchStartX: number = 0;
  private touchStartY: number = 0;
  
  private handleTouchStart = (e: TouchEvent): void => {
    e.preventDefault();
    if (this.state.status !== 'playing') return;
    
    const touch = e.touches[0];
    this.touchStartX = touch.clientX;
    this.touchStartY = touch.clientY;
    
    if (touch.clientX < this.width / 2) {
      this.input.left = true;
    } else {
      this.input.right = true;
    }
  };
  
  private handleTouchMove = (e: TouchEvent): void => {
    e.preventDefault();
    if (this.state.status !== 'playing') return;
    
    const touch = e.touches[0];
    const deltaY = this.touchStartY - touch.clientY;
    
    // Swipe up for boost
    if (deltaY > 30) {
      this.input.up = true;
    }
  };
  
  private handleTouchEnd = (): void => {
    this.input.left = false;
    this.input.right = false;
    this.input.up = false;
    this.input.down = false;
  };
  
  private handleVisibilityChange = (): void => {
    if (document.hidden && this.state.status === 'playing') {
      this.togglePause();
    }
  };
  
  setDifficulty(difficulty: Difficulty): void {
    this.state.difficulty = difficulty;
    this.settings = DIFFICULTY_PRESETS[difficulty];
    this.notifyStateChange();
  }
  
  setScreenShake(enabled: boolean): void {
    this.state.screenShakeEnabled = enabled;
    this.notifyStateChange();
  }
  
  setSoundEnabled(enabled: boolean): void {
    audio.setEnabled(enabled);
  }
  
  start(seed?: number): void {
    audio.resume();
    
    this.rng = new SeededRNG(seed);
    this.settings = DIFFICULTY_PRESETS[this.state.difficulty];
    
    // Reset game state
    this.state.status = 'playing';
    this.state.score = 0;
    this.state.time = 0;
    this.state.speed = this.settings.baseSpeed;
    this.state.seed = this.rng.seed;
    
    // Reset entities
    this.player = createPlayer(this.width, this.height);
    this.obstacles = [];
    this.orbs = [];
    this.particles = [];
    this.trackLines = [];
    
    // Generate initial track lines
    for (let y = 0; y < this.height; y += 80) {
      this.trackLines.push(createTrackLine(y, this.width));
    }
    
    this.lastObstacleSpawn = 0;
    this.lastOrbSpawn = 0;
    this.lastShieldSpawn = 0;
    this.lastTime = performance.now();
    this.accumulator = 0;
    
    this.input = { left: false, right: false, up: false, down: false };
    
    this.notifyStateChange();
    this.gameLoop(this.lastTime);
  }
  
  togglePause(): void {
    if (this.state.status === 'playing') {
      this.state.status = 'paused';
    } else if (this.state.status === 'paused') {
      this.state.status = 'playing';
      this.lastTime = performance.now();
      this.gameLoop(this.lastTime);
    }
    this.notifyStateChange();
  }
  
  private gameLoop = (currentTime: number): void => {
    if (this.state.status !== 'playing') return;
    
    const deltaTime = currentTime - this.lastTime;
    this.lastTime = currentTime;
    
    // Fixed timestep accumulator
    this.accumulator += Math.min(deltaTime, 100); // Cap to prevent spiral of death
    
    while (this.accumulator >= this.FIXED_DT) {
      this.update(this.FIXED_DT);
      this.accumulator -= this.FIXED_DT;
    }
    
    this.render(currentTime);
    
    if (this.state.status === 'playing') {
      requestAnimationFrame(this.gameLoop);
    }
  };
  
  private update(dt: number): void {
    this.state.time += dt;
    
    // Increase difficulty over time
    const timeSeconds = this.state.time / 1000;
    this.state.speed = this.settings.baseSpeed + timeSeconds * this.settings.speedRampRate;
    
    // Update score
    this.state.score += Math.floor(dt * this.state.speed * 0.01);
    
    // Update player
    this.updatePlayer(dt);
    
    // Spawn entities
    this.spawnEntities();
    
    // Update entities
    this.updateObstacles(dt);
    this.updateOrbs(dt);
    this.updateParticles(dt);
    this.updateTrackLines(dt);
    
    // Check collisions
    this.checkCollisions();
    
    // Update screen shake
    this.updateScreenShake(dt);
    
    // Notify UI of state changes periodically
    if (Math.floor(this.state.time / 100) !== Math.floor((this.state.time - dt) / 100)) {
      this.notifyStateChange();
    }
  }
  
  private updatePlayer(dt: number): void {
    const steerSpeed = 0.4;
    const maxLean = 0.3;
    
    // Horizontal movement
    if (this.input.left) {
      this.player.velocityX -= steerSpeed;
      this.player.rotation = lerp(this.player.rotation, -maxLean, 0.1);
    } else if (this.input.right) {
      this.player.velocityX += steerSpeed;
      this.player.rotation = lerp(this.player.rotation, maxLean, 0.1);
    } else {
      this.player.rotation = lerp(this.player.rotation, 0, 0.1);
    }
    
    // Boost/brake
    if (this.input.up) {
      this.player.speed = lerp(this.player.speed, 1.5, 0.05);
    } else if (this.input.down) {
      this.player.speed = lerp(this.player.speed, 0.5, 0.05);
    } else {
      this.player.speed = lerp(this.player.speed, 1, 0.02);
    }
    
    // Apply velocity with friction
    this.player.x += this.player.velocityX * dt * 0.1;
    this.player.velocityX *= 0.92;
    
    // Clamp to track
    this.player.x = clamp(
      this.player.x,
      this.trackLeft + this.player.width / 2 + 10,
      this.trackRight - this.player.width / 2 - 10
    );
    
    // Update shield timer
    if (this.player.hasShield) {
      this.player.shieldTimer -= dt;
      if (this.player.shieldTimer <= 0) {
        this.player.hasShield = false;
        audio.shieldOff();
      }
    }
    
    // Trail particles
    if (this.rng.bool(0.3)) {
      this.particles.push(
        createParticle(
          this.player.x + this.rng.range(-5, 5),
          this.player.y + this.player.height / 2,
          this.rng.range(-0.5, 0.5),
          this.rng.range(1, 3),
          500,
          this.rng.range(2, 4),
          'hsl(185, 100%, 60%)',
          'trail'
        )
      );
    }
  }
  
  private spawnEntities(): void {
    const timeMs = this.state.time;
    
    // Spawn obstacles
    const obstacleInterval = this.settings.obstacleSpawnRate / this.state.speed;
    if (timeMs - this.lastObstacleSpawn > obstacleInterval) {
      this.spawnObstacle();
      this.lastObstacleSpawn = timeMs;
    }
    
    // Spawn orbs
    if (timeMs - this.lastOrbSpawn > this.settings.orbSpawnRate) {
      this.spawnOrb('score');
      this.lastOrbSpawn = timeMs;
    }
    
    // Spawn shield orbs (rare)
    if (timeMs - this.lastShieldSpawn > this.settings.shieldSpawnRate && !this.player.hasShield) {
      if (this.rng.bool(0.3)) {
        this.spawnOrb('shield');
      }
      this.lastShieldSpawn = timeMs;
    }
  }
  
  private spawnObstacle(): void {
    const width = this.rng.range(40, 100);
    const height = this.rng.range(20, 50);
    const x = this.rng.range(this.trackLeft + 20, this.trackRight - width - 20);
    
    const timeSeconds = this.state.time / 1000;
    const canMove = timeSeconds * 1000 > this.settings.movingObstacleTime && this.rng.bool(0.3);
    
    const velocityX = canMove ? this.rng.range(-2, 2) : 0;
    
    this.obstacles.push(
      createObstacle(x, -height, width, height, canMove ? 'moving' : 'static', velocityX)
    );
  }
  
  private spawnOrb(type: 'score' | 'shield'): void {
    const x = this.rng.range(this.trackLeft + 30, this.trackRight - 30);
    this.orbs.push(createOrb(x, -30, type));
  }
  
  private updateObstacles(dt: number): void {
    const speed = this.state.speed * this.player.speed;
    
    this.obstacles = this.obstacles.filter(obstacle => {
      obstacle.y += speed * dt * 0.15;
      obstacle.x += obstacle.velocityX * dt * 0.05;
      
      // Bounce off walls for moving obstacles
      if (obstacle.type === 'moving') {
        if (obstacle.x < this.trackLeft + 10 || obstacle.x + obstacle.width > this.trackRight - 10) {
          obstacle.velocityX *= -1;
        }
        obstacle.x = clamp(obstacle.x, this.trackLeft + 10, this.trackRight - obstacle.width - 10);
      }
      
      return obstacle.y < this.height + 100;
    });
  }
  
  private updateOrbs(dt: number): void {
    const speed = this.state.speed * this.player.speed;
    
    this.orbs = this.orbs.filter(orb => {
      if (orb.collected) return false;
      
      orb.y += speed * dt * 0.15;
      orb.pulsePhase += dt * 0.01;
      
      return orb.y < this.height + 50;
    });
  }
  
  private updateParticles(dt: number): void {
    this.particles = this.particles.filter(particle => {
      particle.x += particle.velocityX * dt * 0.05;
      particle.y += particle.velocityY * dt * 0.05;
      particle.life -= dt;
      
      return particle.life > 0;
    });
  }
  
  private updateTrackLines(dt: number): void {
    const speed = this.state.speed * this.player.speed;
    
    this.trackLines.forEach(line => {
      line.y += speed * dt * 0.15;
    });
    
    // Remove off-screen lines
    this.trackLines = this.trackLines.filter(line => line.y < this.height + 20);
    
    // Add new lines
    if (this.trackLines.length < 20) {
      const minY = Math.min(...this.trackLines.map(l => l.y), 0);
      if (minY > -80) {
        this.trackLines.push(createTrackLine(minY - 80, this.width));
      }
    }
  }
  
  private checkCollisions(): void {
    // Check obstacle collisions
    for (const obstacle of this.obstacles) {
      if (triangleRectIntersect(this.player, obstacle)) {
        if (this.player.hasShield) {
          // Shield absorbs hit
          this.player.hasShield = false;
          this.player.shieldTimer = 0;
          audio.shieldOff();
          this.triggerScreenShake(10);
          this.spawnExplosion(obstacle.x + obstacle.width / 2, obstacle.y + obstacle.height / 2, obstacle.color);
          
          // Remove the obstacle
          this.obstacles = this.obstacles.filter(o => o !== obstacle);
        } else {
          this.gameOver();
          return;
        }
      }
    }
    
    // Check orb collisions
    for (const orb of this.orbs) {
      if (!orb.collected && triangleCircleIntersect(this.player, orb)) {
        orb.collected = true;
        
        if (orb.type === 'shield') {
          this.player.hasShield = true;
          this.player.shieldTimer = 8000;
          audio.shieldOn();
          this.spawnSparkles(orb.x, orb.y, 'hsl(150, 100%, 60%)');
        } else {
          this.state.score += 500;
          audio.orbPickup();
          this.spawnSparkles(orb.x, orb.y, 'hsl(185, 100%, 60%)');
        }
      }
    }
  }
  
  private spawnExplosion(x: number, y: number, color: string): void {
    for (let i = 0; i < 20; i++) {
      const angle = this.rng.range(0, Math.PI * 2);
      const speed = this.rng.range(2, 8);
      this.particles.push(
        createParticle(
          x,
          y,
          Math.cos(angle) * speed,
          Math.sin(angle) * speed,
          600,
          this.rng.range(3, 8),
          color,
          'explosion'
        )
      );
    }
  }
  
  private spawnSparkles(x: number, y: number, color: string): void {
    for (let i = 0; i < 10; i++) {
      const angle = this.rng.range(0, Math.PI * 2);
      const speed = this.rng.range(1, 4);
      this.particles.push(
        createParticle(
          x,
          y,
          Math.cos(angle) * speed,
          Math.sin(angle) * speed,
          400,
          this.rng.range(4, 8),
          color,
          'sparkle'
        )
      );
    }
  }
  
  private triggerScreenShake(intensity: number): void {
    if (this.state.screenShakeEnabled) {
      this.shakeIntensity = intensity;
    }
  }
  
  private updateScreenShake(dt: number): void {
    if (this.shakeIntensity > 0) {
      this.screenShake.x = (Math.random() - 0.5) * this.shakeIntensity;
      this.screenShake.y = (Math.random() - 0.5) * this.shakeIntensity;
      this.shakeIntensity *= 0.9;
      
      if (this.shakeIntensity < 0.5) {
        this.shakeIntensity = 0;
        this.screenShake = { x: 0, y: 0 };
      }
    }
  }
  
  private gameOver(): void {
    audio.crash();
    this.triggerScreenShake(20);
    
    // Spawn explosion at player
    this.spawnExplosion(this.player.x, this.player.y, 'hsl(185, 100%, 60%)');
    
    this.state.status = 'gameover';
    
    if (this.state.score > this.state.bestScore) {
      this.state.bestScore = this.state.score;
      this.saveBestScore(this.state.score);
    }
    
    this.notifyStateChange();
  }
  
  private render(time: number): void {
    const render: RenderContext = {
      ctx: this.ctx,
      width: this.width,
      height: this.height,
      time,
      screenShake: this.screenShake,
    };
    
    this.ctx.save();
    this.ctx.translate(this.screenShake.x, this.screenShake.y);
    
    clearCanvas(render);
    drawStars(render, this.stars);
    drawSpeedLines(render, this.state.speed);
    drawRails(render, this.trackLeft, this.trackRight);
    drawTrackLines(render, this.trackLines);
    
    // Draw obstacles
    this.obstacles.forEach(obstacle => drawObstacle(render, obstacle, time));
    
    // Draw orbs
    this.orbs.forEach(orb => drawOrb(render, orb));
    
    // Draw particles
    this.particles.forEach(particle => drawParticle(render, particle));
    
    // Draw player (unless game over)
    if (this.state.status !== 'gameover') {
      drawPlayer(render, this.player);
    }
    
    this.ctx.restore();
  }
  
  private notifyStateChange(): void {
    this.onStateChange({ 
      ...this.state,
      shieldTimer: this.player.shieldTimer,
    });
  }
  
  getState(): GameState {
    return { ...this.state };
  }
  
  destroy(): void {
    window.removeEventListener('keydown', this.handleKeyDown);
    window.removeEventListener('keyup', this.handleKeyUp);
    this.canvas.removeEventListener('touchstart', this.handleTouchStart);
    this.canvas.removeEventListener('touchmove', this.handleTouchMove);
    this.canvas.removeEventListener('touchend', this.handleTouchEnd);
    document.removeEventListener('visibilitychange', this.handleVisibilityChange);
  }
}
