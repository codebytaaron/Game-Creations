import React from 'react';
import { Player, ActivePowerUp } from '@/lib/gameTypes';

interface SherpaProps {
  player: Player;
  scrollY: number;
}

export const Sherpa: React.FC<SherpaProps> = ({ player, scrollY }) => {
  const screenY = player.y - scrollY;
  const isSquishing = player.isOnGround && Math.abs(player.vy) < 1;
  
  const hasBoots = player.activePowerUps.some(pu => pu.type === 'boots');
  const hasOxygen = player.activePowerUps.some(pu => pu.type === 'oxygen');
  const hasRope = player.activePowerUps.some(pu => pu.type === 'rope');
  
  return (
    <div
      className="absolute transition-transform duration-75"
      style={{
        left: player.x,
        top: screenY,
        width: player.width,
        height: player.height,
        transform: `scaleX(${player.facingRight ? 1 : -1}) ${isSquishing ? 'scaleY(0.9)' : 'scaleY(1)'}`,
        transformOrigin: 'bottom center',
      }}
    >
      {/* Power-up glow effects */}
      {hasOxygen && (
        <div className="absolute inset-0 rounded-full bg-powerup-oxygen/30 animate-pulse -m-2" />
      )}
      {hasRope && (
        <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-2 h-8 bg-powerup-rope rounded-full animate-bounce" />
      )}
      
      {/* Sherpa body */}
      <svg viewBox="0 0 40 50" className="w-full h-full">
        {/* Backpack */}
        <rect
          x="8"
          y="20"
          width="12"
          height="18"
          rx="3"
          className="fill-sherpa-secondary"
        />
        <rect
          x="10"
          y="22"
          width="8"
          height="4"
          rx="1"
          className="fill-sherpa-primary"
        />
        
        {/* Body/Jacket */}
        <ellipse
          cx="20"
          cy="32"
          rx="12"
          ry="14"
          className="fill-sherpa-primary"
        />
        
        {/* Warm boots indicator */}
        {hasBoots && (
          <ellipse
            cx="20"
            cy="32"
            rx="14"
            ry="16"
            className="fill-powerup-boots/20 animate-pulse"
          />
        )}
        
        {/* Arms */}
        <ellipse
          cx="8"
          cy="30"
          rx="4"
          ry="8"
          className="fill-sherpa-primary"
        />
        <ellipse
          cx="32"
          cy="30"
          rx="4"
          ry="8"
          className="fill-sherpa-primary"
        />
        
        {/* Hands */}
        <circle cx="8" cy="38" r="3" className="fill-sherpa-skin" />
        <circle cx="32" cy="38" r="3" className="fill-sherpa-skin" />
        
        {/* Head */}
        <circle cx="20" cy="14" r="10" className="fill-sherpa-skin" />
        
        {/* Hat */}
        <path
          d="M10 14 Q10 6 20 4 Q30 6 30 14"
          className="fill-sherpa-secondary"
        />
        <ellipse
          cx="20"
          cy="14"
          rx="12"
          ry="3"
          className="fill-sherpa-secondary"
        />
        <circle cx="20" cy="4" r="3" className="fill-snow" />
        
        {/* Face */}
        <circle cx="16" cy="13" r="2" className="fill-foreground" />
        <circle cx="24" cy="13" r="2" className="fill-foreground" />
        <ellipse cx="16" cy="12" rx="0.8" ry="0.8" className="fill-snow" />
        <ellipse cx="24" cy="12" rx="0.8" ry="0.8" className="fill-snow" />
        
        {/* Smile */}
        <path
          d="M16 18 Q20 22 24 18"
          stroke="hsl(var(--foreground))"
          strokeWidth="1.5"
          fill="none"
          strokeLinecap="round"
        />
        
        {/* Rosy cheeks */}
        <circle cx="12" cy="16" r="2" className="fill-sherpa-primary/40" />
        <circle cx="28" cy="16" r="2" className="fill-sherpa-primary/40" />
        
        {/* Legs */}
        <rect x="14" y="44" width="5" height="6" rx="2" className="fill-mountain-dark" />
        <rect x="21" y="44" width="5" height="6" rx="2" className="fill-mountain-dark" />
        
        {/* Boots */}
        <rect 
          x="13" 
          y="48" 
          width="7" 
          height="4" 
          rx="2" 
          className={hasBoots ? "fill-powerup-boots" : "fill-mountain-dark"}
        />
        <rect 
          x="20" 
          y="48" 
          width="7" 
          height="4" 
          rx="2" 
          className={hasBoots ? "fill-powerup-boots" : "fill-mountain-dark"}
        />
      </svg>
    </div>
  );
};
