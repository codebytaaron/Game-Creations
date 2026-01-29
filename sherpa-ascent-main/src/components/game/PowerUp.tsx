import React from 'react';
import { PowerUp as PowerUpType } from '@/lib/gameTypes';

interface PowerUpProps {
  powerUp: PowerUpType;
  scrollY: number;
}

export const PowerUpItem: React.FC<PowerUpProps> = ({ powerUp, scrollY }) => {
  const screenY = powerUp.y - scrollY;
  
  if (powerUp.collected) return null;
  
  const getStyles = () => {
    switch (powerUp.type) {
      case 'rope':
        return 'bg-powerup-rope';
      case 'boots':
        return 'bg-powerup-boots';
      case 'oxygen':
        return 'bg-powerup-oxygen';
    }
  };
  
  const renderIcon = () => {
    switch (powerUp.type) {
      case 'rope':
        return (
          <svg viewBox="0 0 24 24" className="w-5 h-5 text-white">
            <path 
              fill="currentColor" 
              d="M12 2C10.3 2 9 3.3 9 5V7H7C5.3 7 4 8.3 4 10V12C4 13.7 5.3 15 7 15H8V19C8 20.7 9.3 22 11 22H13C14.7 22 16 20.7 16 19V15H17C18.7 15 20 13.7 20 12V10C20 8.3 18.7 7 17 7H15V5C15 3.3 13.7 2 12 2Z"
            />
          </svg>
        );
      case 'boots':
        return (
          <svg viewBox="0 0 24 24" className="w-5 h-5 text-white">
            <path 
              fill="currentColor" 
              d="M4 22H20V19L18 17V13L20 11V7L18 5H14L12 3L10 5H6L4 7V11L6 13V17L4 19V22Z"
            />
          </svg>
        );
      case 'oxygen':
        return (
          <svg viewBox="0 0 24 24" className="w-5 h-5 text-white">
            <circle cx="12" cy="12" r="8" fill="currentColor" opacity="0.8" />
            <path 
              fill="white" 
              d="M12 6C12 6 8 10 8 13C8 15.2 9.8 17 12 17C14.2 17 16 15.2 16 13C16 10 12 6 12 6Z"
              opacity="0.6"
            />
          </svg>
        );
    }
  };
  
  return (
    <div
      className={`absolute w-8 h-8 rounded-full flex items-center justify-center animate-bounce-gentle pulse-glow ${getStyles()}`}
      style={{
        left: powerUp.x - 15,
        top: screenY - 15,
      }}
    >
      {renderIcon()}
      {/* Glow effect */}
      <div className={`absolute inset-0 rounded-full ${getStyles()} opacity-50 blur-sm -z-10`} />
    </div>
  );
};
