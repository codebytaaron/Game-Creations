import React from 'react';
import { Collectible as CollectibleType } from '@/lib/gameTypes';

interface CollectibleProps {
  collectible: CollectibleType;
  scrollY: number;
}

export const Collectible: React.FC<CollectibleProps> = ({ collectible, scrollY }) => {
  const screenY = collectible.y - scrollY;
  
  if (collectible.collected) return null;
  
  return (
    <div
      className="absolute animate-bounce-gentle"
      style={{
        left: collectible.x - 10,
        top: screenY - 10,
        width: 20,
        height: 20,
      }}
    >
      {collectible.type === 'flag' ? (
        <svg viewBox="0 0 24 24" className="w-full h-full">
          {/* Pole */}
          <rect x="4" y="4" width="2" height="18" className="fill-mountain-dark" />
          {/* Flag */}
          <path
            d="M6 4 L20 8 L6 12 Z"
            className="fill-gold"
          />
          <path
            d="M6 5 L18 8 L6 11 Z"
            className="fill-gold-light"
          />
          {/* Sparkle */}
          <circle cx="14" cy="7" r="1" className="fill-white animate-pulse" />
        </svg>
      ) : (
        <svg viewBox="0 0 24 24" className="w-full h-full">
          {/* Supply box */}
          <rect x="4" y="8" width="16" height="12" rx="2" className="fill-sherpa-secondary" />
          <rect x="4" y="8" width="16" height="4" rx="2" className="fill-sherpa-primary" />
          {/* Cross */}
          <rect x="10" y="11" width="4" height="8" className="fill-white" />
          <rect x="7" y="14" width="10" height="3" className="fill-white" />
          {/* Shine */}
          <ellipse cx="8" cy="10" rx="2" ry="1" className="fill-white/40" />
        </svg>
      )}
      {/* Points indicator */}
      <div className="absolute -top-3 left-1/2 -translate-x-1/2 text-gold text-xs font-bold">
        +{collectible.points}
      </div>
    </div>
  );
};
