import React from 'react';
import { Platform as PlatformType } from '@/lib/gameTypes';

interface PlatformProps {
  platform: PlatformType;
  scrollY: number;
}

export const Platform: React.FC<PlatformProps> = ({ platform, scrollY }) => {
  const screenY = platform.y - scrollY;
  
  if (platform.isBroken) return null;
  
  const getStyles = () => {
    switch (platform.type) {
      case 'ice':
        return 'bg-gradient-to-b from-platform-ice-light to-platform-ice border-2 border-platform-ice-light/50';
      case 'breakable':
        const cracking = (platform.breakTimer || 0) > 200;
        return `bg-gradient-to-b from-platform-rock-light to-platform-rock ${cracking ? 'animate-shake opacity-60' : ''}`;
      case 'moving':
        return 'bg-gradient-to-b from-platform-rope to-yellow-700 border-2 border-yellow-600';
      default:
        return 'bg-gradient-to-b from-platform-rock-light to-platform-rock';
    }
  };
  
  const renderDetails = () => {
    switch (platform.type) {
      case 'ice':
        return (
          <>
            {/* Ice shine */}
            <div className="absolute top-1 left-2 w-6 h-2 bg-white/60 rounded-full transform -skew-x-12" />
            <div className="absolute top-2 right-4 w-3 h-1 bg-white/40 rounded-full" />
            {/* Ice crystals */}
            <svg className="absolute -top-2 left-1/4 w-4 h-4 text-platform-ice-light" viewBox="0 0 20 20">
              <polygon points="10,0 12,8 20,10 12,12 10,20 8,12 0,10 8,8" fill="currentColor" opacity="0.6" />
            </svg>
          </>
        );
      case 'breakable':
        const crackProgress = Math.min((platform.breakTimer || 0) / 500, 1);
        return (
          <>
            {/* Cracks */}
            <svg className="absolute inset-0 w-full h-full" style={{ opacity: 0.3 + crackProgress * 0.5 }}>
              <line x1="20%" y1="0" x2="35%" y2="100%" stroke="hsl(var(--foreground))" strokeWidth="1" />
              <line x1="60%" y1="0" x2="50%" y2="100%" stroke="hsl(var(--foreground))" strokeWidth="1" />
              <line x1="80%" y1="30%" x2="70%" y2="80%" stroke="hsl(var(--foreground))" strokeWidth="1" />
            </svg>
            {/* Rock texture */}
            <div className="absolute top-1/2 left-1/4 w-2 h-2 bg-platform-rock/50 rounded-full" />
            <div className="absolute top-1/3 right-1/3 w-3 h-2 bg-platform-rock/30 rounded-full" />
          </>
        );
      case 'moving':
        return (
          <>
            {/* Rope texture */}
            <div className="absolute inset-y-0 left-0 w-full flex justify-around items-center">
              {[...Array(Math.floor(platform.width / 15))].map((_, i) => (
                <div key={i} className="w-1 h-full bg-yellow-800/40" />
              ))}
            </div>
            {/* Knots */}
            <div className="absolute top-1/2 -translate-y-1/2 left-2 w-3 h-3 bg-yellow-700 rounded-full border border-yellow-600" />
            <div className="absolute top-1/2 -translate-y-1/2 right-2 w-3 h-3 bg-yellow-700 rounded-full border border-yellow-600" />
          </>
        );
      default:
        return (
          <>
            {/* Rock details */}
            <div className="absolute top-1 left-3 w-4 h-2 bg-platform-rock-light/60 rounded-full" />
            <div className="absolute bottom-1 right-4 w-3 h-2 bg-platform-rock/60 rounded-full" />
            {/* Snow patches */}
            <div className="absolute -top-1 left-1/4 w-6 h-2 bg-snow rounded-full" />
            <div className="absolute -top-1 right-1/3 w-4 h-2 bg-snow rounded-full" />
          </>
        );
    }
  };
  
  return (
    <div
      className={`absolute rounded-lg shadow-lg overflow-hidden ${getStyles()}`}
      style={{
        left: platform.x,
        top: screenY,
        width: platform.width,
        height: platform.height,
      }}
    >
      {renderDetails()}
      {/* Bottom shadow */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-black/20" />
    </div>
  );
};
