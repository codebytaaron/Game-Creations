export interface Vector2 {
  x: number;
  y: number;
}

export interface Rectangle {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface Circle {
  x: number;
  y: number;
  radius: number;
}

export interface Triangle {
  x: number;
  y: number;
  width: number;
  height: number;
  rotation: number;
}

/**
 * Check if two rectangles overlap
 */
export function rectIntersect(a: Rectangle, b: Rectangle): boolean {
  return (
    a.x < b.x + b.width &&
    a.x + a.width > b.x &&
    a.y < b.y + b.height &&
    a.y + a.height > b.y
  );
}

/**
 * Check if two circles overlap
 */
export function circleIntersect(a: Circle, b: Circle): boolean {
  const dx = a.x - b.x;
  const dy = a.y - b.y;
  const distance = Math.sqrt(dx * dx + dy * dy);
  return distance < a.radius + b.radius;
}

/**
 * Check if a point is inside a rectangle
 */
export function pointInRect(point: Vector2, rect: Rectangle): boolean {
  return (
    point.x >= rect.x &&
    point.x <= rect.x + rect.width &&
    point.y >= rect.y &&
    point.y <= rect.y + rect.height
  );
}

/**
 * Check if a circle and rectangle overlap
 */
export function circleRectIntersect(circle: Circle, rect: Rectangle): boolean {
  // Find the closest point on the rectangle to the circle's center
  const closestX = Math.max(rect.x, Math.min(circle.x, rect.x + rect.width));
  const closestY = Math.max(rect.y, Math.min(circle.y, rect.y + rect.height));

  // Calculate the distance between the circle's center and the closest point
  const dx = circle.x - closestX;
  const dy = circle.y - closestY;

  return dx * dx + dy * dy < circle.radius * circle.radius;
}

/**
 * Get bounding box for triangle (simplified as rectangle for collision)
 */
export function triangleToBoundingBox(tri: Triangle): Rectangle {
  return {
    x: tri.x - tri.width / 2,
    y: tri.y - tri.height / 2,
    width: tri.width,
    height: tri.height,
  };
}

/**
 * Check if triangle (as bounding box) intersects with rectangle
 */
export function triangleRectIntersect(tri: Triangle, rect: Rectangle): boolean {
  const triBounds = triangleToBoundingBox(tri);
  return rectIntersect(triBounds, rect);
}

/**
 * Check if triangle center is within circle
 */
export function triangleCircleIntersect(tri: Triangle, circle: Circle): boolean {
  const dx = tri.x - circle.x;
  const dy = tri.y - circle.y;
  const distance = Math.sqrt(dx * dx + dy * dy);
  return distance < circle.radius + Math.max(tri.width, tri.height) / 2;
}

/**
 * Linear interpolation
 */
export function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * Math.max(0, Math.min(1, t));
}

/**
 * Clamp value between min and max
 */
export function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

/**
 * Ease out quad
 */
export function easeOutQuad(t: number): number {
  return 1 - (1 - t) * (1 - t);
}

/**
 * Ease in out quad
 */
export function easeInOutQuad(t: number): number {
  return t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
}
