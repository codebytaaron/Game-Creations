import React from 'react';
import { Obstacle as ObstacleType } from '@/lib/gameTypes';

interface ObstacleProps {
  obstacle: ObstacleType;
  scrollY: number;
}

export const Obstacle: React.FC<ObstacleProps> = ({ obstacle, scrollY }) => {
  const screenY = obstacle.y - scrollY;
  
  if (obstacle.type === 'wind') {
    return (
      <div
        className="absolute pointer-events-none overflow-hidden"
        style={{
          left: 0,
          top: screenY,
          width: obstacle.width,
          height: obstacle.height,
        }}
      >
        {/* Wind lines */}
        {[...Array(5)].map((_, i) => (
          <div
            key={i}
            className="absolute h-1 bg-gradient-to-r from-transparent via-white/40 to-transparent rounded-full"
            style={{
              top: `${20 + i * 15}%`,
              left: obstacle.direction === 'right' ? '-20%' : '20%',
              width: '60%',
              animation: `${obstacle.direction === 'right' ? 'slide-right' : 'slide-left'} ${1 + i * 0.2}s linear infinite`,
              animationDelay: `${i * 0.1}s`,
            }}
          />
        ))}
        {/* Wind indicator */}
        <div className="absolute top-2 left-1/2 -translate-x-1/2 text-white/60 text-xs font-bold">
          💨 WIND
        </div>
        <style>{`
          @keyframes slide-right {
            from { transform: translateX(-100%); }
            to { transform: translateX(200%); }
          }
          @keyframes slide-left {
            from { transform: translateX(100%); }
            to { transform: translateX(-200%); }
          }
        `}</style>
      </div>
    );
  }
  
  // Falling rock
  return (
    <div
      className="absolute"
      style={{
        left: obstacle.x,
        top: screenY,
        width: obstacle.width,
        height: obstacle.height,
      }}
    >
      <svg viewBox="0 0 30 30" className="w-full h-full animate-spin" style={{ animationDuration: '2s' }}>
        {/* Rock shape */}
        <polygon
          points="15,2 25,10 28,22 20,28 8,28 2,20 5,8"
          className="fill-mountain-dark"
        />
        <polygon
          points="15,5 22,11 24,20 18,25 10,25 6,18 8,10"
          className="fill-mountain-light"
        />
        {/* Highlights */}
        <ellipse cx="12" cy="12" rx="3" ry="2" className="fill-white/20" />
      </svg>
      {/* Danger indicator */}
      <div className="absolute -top-4 left-1/2 -translate-x-1/2 text-game-danger text-lg">
        ⚠️
      </div>
    </div>
  );
};
