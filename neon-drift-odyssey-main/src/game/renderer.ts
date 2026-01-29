import type { Player, Obstacle, Orb, Particle, TrackLine } from './entities';

export interface RenderContext {
  ctx: CanvasRenderingContext2D;
  width: number;
  height: number;
  time: number;
  screenShake: { x: number; y: number };
}

/**
 * Clear canvas with background
 */
export function clearCanvas(render: RenderContext): void {
  const { ctx, width, height } = render;
  
  // Deep space gradient
  const gradient = ctx.createLinearGradient(0, 0, 0, height);
  gradient.addColorStop(0, 'hsl(230, 50%, 3%)');
  gradient.addColorStop(0.5, 'hsl(230, 50%, 5%)');
  gradient.addColorStop(1, 'hsl(230, 50%, 4%)');
  
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, width, height);
}

/**
 * Draw track lines (moving road markers)
 */
export function drawTrackLines(render: RenderContext, lines: TrackLine[]): void {
  const { ctx } = render;
  
  ctx.strokeStyle = 'hsl(185, 100%, 50%)';
  ctx.lineWidth = 2;
  ctx.shadowColor = 'hsl(185, 100%, 50%)';
  ctx.shadowBlur = 10;
  
  lines.forEach(line => {
    ctx.globalAlpha = 0.4;
    ctx.beginPath();
    ctx.moveTo(line.x, line.y);
    ctx.lineTo(line.x + line.width, line.y);
    ctx.stroke();
  });
  
  ctx.globalAlpha = 1;
  ctx.shadowBlur = 0;
}

/**
 * Draw side rails
 */
export function drawRails(render: RenderContext, trackLeft: number, trackRight: number): void {
  const { ctx, height, time } = render;
  
  const pulse = Math.sin(time * 0.003) * 0.2 + 0.8;
  
  ctx.strokeStyle = `hsla(185, 100%, 50%, ${pulse * 0.6})`;
  ctx.lineWidth = 3;
  ctx.shadowColor = 'hsl(185, 100%, 50%)';
  ctx.shadowBlur = 15;
  
  // Left rail
  ctx.beginPath();
  ctx.moveTo(trackLeft, 0);
  ctx.lineTo(trackLeft, height);
  ctx.stroke();
  
  // Right rail
  ctx.beginPath();
  ctx.moveTo(trackRight, 0);
  ctx.lineTo(trackRight, height);
  ctx.stroke();
  
  ctx.shadowBlur = 0;
}

/**
 * Draw stars background
 */
export function drawStars(render: RenderContext, stars: { x: number; y: number; size: number; brightness: number }[]): void {
  const { ctx, time } = render;
  
  stars.forEach(star => {
    const twinkle = Math.sin(time * 0.002 + star.x * 0.1) * 0.3 + 0.7;
    ctx.fillStyle = `hsla(200, 50%, 80%, ${star.brightness * twinkle})`;
    ctx.beginPath();
    ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
    ctx.fill();
  });
}

/**
 * Draw player ship
 */
export function drawPlayer(render: RenderContext, player: Player): void {
  const { ctx, time } = render;
  
  ctx.save();
  ctx.translate(player.x, player.y);
  ctx.rotate(player.rotation);
  
  // Engine glow
  const enginePulse = Math.sin(time * 0.01) * 0.3 + 0.7;
  ctx.shadowColor = 'hsl(185, 100%, 50%)';
  ctx.shadowBlur = 20 * enginePulse;
  
  // Ship body (triangle)
  ctx.fillStyle = 'hsl(185, 100%, 60%)';
  ctx.strokeStyle = 'hsl(185, 100%, 80%)';
  ctx.lineWidth = 2;
  
  ctx.beginPath();
  ctx.moveTo(0, -player.height / 2); // Nose
  ctx.lineTo(-player.width / 2, player.height / 2); // Left
  ctx.lineTo(player.width / 2, player.height / 2); // Right
  ctx.closePath();
  ctx.fill();
  ctx.stroke();
  
  // Inner detail
  ctx.fillStyle = 'hsl(230, 50%, 10%)';
  ctx.beginPath();
  ctx.moveTo(0, -player.height / 4);
  ctx.lineTo(-player.width / 4, player.height / 4);
  ctx.lineTo(player.width / 4, player.height / 4);
  ctx.closePath();
  ctx.fill();
  
  // Engine flame
  ctx.shadowColor = 'hsl(30, 100%, 60%)';
  ctx.shadowBlur = 15;
  ctx.fillStyle = `hsla(30, 100%, 60%, ${enginePulse})`;
  ctx.beginPath();
  ctx.moveTo(-player.width / 4, player.height / 2);
  ctx.lineTo(0, player.height / 2 + 10 + enginePulse * 5);
  ctx.lineTo(player.width / 4, player.height / 2);
  ctx.closePath();
  ctx.fill();
  
  // Shield effect
  if (player.hasShield) {
    const shieldPulse = Math.sin(time * 0.008) * 0.3 + 0.7;
    ctx.strokeStyle = `hsla(150, 100%, 50%, ${shieldPulse})`;
    ctx.lineWidth = 3;
    ctx.shadowColor = 'hsl(150, 100%, 50%)';
    ctx.shadowBlur = 25;
    ctx.beginPath();
    ctx.arc(0, 0, player.width * 1.2, 0, Math.PI * 2);
    ctx.stroke();
    
    // Shield timer arc
    const shieldProgress = player.shieldTimer / 8000;
    ctx.strokeStyle = `hsla(150, 100%, 70%, 0.8)`;
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.arc(0, 0, player.width * 1.4, -Math.PI / 2, -Math.PI / 2 + Math.PI * 2 * shieldProgress);
    ctx.stroke();
  }
  
  ctx.restore();
  ctx.shadowBlur = 0;
}

/**
 * Draw obstacle
 */
export function drawObstacle(render: RenderContext, obstacle: Obstacle, time: number): void {
  const { ctx } = render;
  
  const pulse = Math.sin(time * 0.005 + obstacle.x * 0.01) * 0.15 + 0.85;
  
  ctx.save();
  
  ctx.shadowColor = obstacle.glowColor;
  ctx.shadowBlur = 15 * pulse;
  ctx.fillStyle = obstacle.color;
  ctx.strokeStyle = obstacle.type === 'static' ? 'hsl(320, 100%, 80%)' : 'hsl(30, 100%, 80%)';
  ctx.lineWidth = 2;
  
  // Rounded rectangle
  const radius = 4;
  ctx.beginPath();
  ctx.moveTo(obstacle.x + radius, obstacle.y);
  ctx.lineTo(obstacle.x + obstacle.width - radius, obstacle.y);
  ctx.quadraticCurveTo(obstacle.x + obstacle.width, obstacle.y, obstacle.x + obstacle.width, obstacle.y + radius);
  ctx.lineTo(obstacle.x + obstacle.width, obstacle.y + obstacle.height - radius);
  ctx.quadraticCurveTo(obstacle.x + obstacle.width, obstacle.y + obstacle.height, obstacle.x + obstacle.width - radius, obstacle.y + obstacle.height);
  ctx.lineTo(obstacle.x + radius, obstacle.y + obstacle.height);
  ctx.quadraticCurveTo(obstacle.x, obstacle.y + obstacle.height, obstacle.x, obstacle.y + obstacle.height - radius);
  ctx.lineTo(obstacle.x, obstacle.y + radius);
  ctx.quadraticCurveTo(obstacle.x, obstacle.y, obstacle.x + radius, obstacle.y);
  ctx.closePath();
  
  ctx.fill();
  ctx.stroke();
  
  // Inner pattern for moving obstacles
  if (obstacle.type === 'moving') {
    ctx.fillStyle = 'hsla(30, 100%, 40%, 0.5)';
    ctx.fillRect(
      obstacle.x + obstacle.width * 0.2,
      obstacle.y + obstacle.height * 0.2,
      obstacle.width * 0.6,
      obstacle.height * 0.6
    );
  }
  
  ctx.restore();
}

/**
 * Draw orb
 */
export function drawOrb(render: RenderContext, orb: Orb): void {
  if (orb.collected) return;
  
  const { ctx, time } = render;
  
  const pulse = Math.sin(time * 0.006 + orb.pulsePhase) * 0.2 + 0.8;
  const radius = orb.radius * pulse;
  
  ctx.save();
  
  if (orb.type === 'shield') {
    // Shield orb - green
    ctx.shadowColor = 'hsl(150, 100%, 50%)';
    ctx.shadowBlur = 25 * pulse;
    
    // Outer ring
    ctx.strokeStyle = 'hsl(150, 100%, 60%)';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(orb.x, orb.y, radius + 5, 0, Math.PI * 2);
    ctx.stroke();
    
    // Inner orb
    const gradient = ctx.createRadialGradient(orb.x, orb.y, 0, orb.x, orb.y, radius);
    gradient.addColorStop(0, 'hsl(150, 100%, 70%)');
    gradient.addColorStop(0.5, 'hsl(150, 100%, 50%)');
    gradient.addColorStop(1, 'hsl(150, 100%, 30%)');
    
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(orb.x, orb.y, radius, 0, Math.PI * 2);
    ctx.fill();
    
    // Shield icon
    ctx.fillStyle = 'hsl(150, 100%, 90%)';
    ctx.font = `${radius}px sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('⛨', orb.x, orb.y);
  } else {
    // Score orb - cyan
    ctx.shadowColor = 'hsl(185, 100%, 50%)';
    ctx.shadowBlur = 20 * pulse;
    
    const gradient = ctx.createRadialGradient(orb.x, orb.y, 0, orb.x, orb.y, radius);
    gradient.addColorStop(0, 'hsl(185, 100%, 80%)');
    gradient.addColorStop(0.6, 'hsl(185, 100%, 50%)');
    gradient.addColorStop(1, 'hsl(185, 100%, 30%)');
    
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(orb.x, orb.y, radius, 0, Math.PI * 2);
    ctx.fill();
  }
  
  ctx.restore();
}

/**
 * Draw particle
 */
export function drawParticle(render: RenderContext, particle: Particle): void {
  const { ctx } = render;
  
  const alpha = particle.life / particle.maxLife;
  
  ctx.save();
  ctx.globalAlpha = alpha;
  
  if (particle.type === 'trail') {
    ctx.shadowColor = particle.color;
    ctx.shadowBlur = 5;
    ctx.fillStyle = particle.color;
    ctx.beginPath();
    ctx.arc(particle.x, particle.y, particle.size * alpha, 0, Math.PI * 2);
    ctx.fill();
  } else if (particle.type === 'explosion') {
    ctx.shadowColor = particle.color;
    ctx.shadowBlur = 10;
    ctx.fillStyle = particle.color;
    ctx.beginPath();
    ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
    ctx.fill();
  } else if (particle.type === 'sparkle') {
    ctx.strokeStyle = particle.color;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(particle.x - particle.size, particle.y);
    ctx.lineTo(particle.x + particle.size, particle.y);
    ctx.moveTo(particle.x, particle.y - particle.size);
    ctx.lineTo(particle.x, particle.y + particle.size);
    ctx.stroke();
  }
  
  ctx.restore();
}

/**
 * Draw speed lines effect
 */
export function drawSpeedLines(render: RenderContext, speed: number): void {
  const { ctx, width, height, time } = render;
  
  const lineCount = Math.floor(speed * 10);
  const lineLength = speed * 50;
  
  ctx.save();
  ctx.strokeStyle = 'hsla(185, 100%, 50%, 0.15)';
  ctx.lineWidth = 1;
  
  for (let i = 0; i < lineCount; i++) {
    const x = ((time * 0.5 + i * 137.5) % width);
    const y = ((time * (speed * 0.8) + i * 97.3) % height);
    
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x, y + lineLength);
    ctx.stroke();
  }
  
  ctx.restore();
}
