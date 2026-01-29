import React from 'react';
import { ActivePowerUp } from '@/lib/gameTypes';

interface GameHUDProps {
  score: number;
  highScore: number;
  activePowerUps: ActivePowerUp[];
}

export const GameHUD: React.FC<GameHUDProps> = ({ score, highScore, activePowerUps }) => {
  const getPowerUpInfo = (type: string) => {
    switch (type) {
      case 'rope':
        return { icon: '🪢', label: 'Rope', color: 'bg-powerup-rope' };
      case 'boots':
        return { icon: '👢', label: 'Boots', color: 'bg-powerup-boots' };
      case 'oxygen':
        return { icon: '💨', label: 'Oxygen', color: 'bg-powerup-oxygen' };
      default:
        return { icon: '⭐', label: 'Power', color: 'bg-accent' };
    }
  };
  
  return (
    <div className="absolute top-0 left-0 right-0 p-4 pointer-events-none">
      {/* Score display */}
      <div className="flex justify-between items-start">
        <div className="bg-card/90 backdrop-blur-sm rounded-xl px-4 py-2 shadow-game">
          <div className="text-xs text-muted-foreground font-medium">SCORE</div>
          <div className="text-2xl font-bold text-foreground">{score.toLocaleString()}</div>
        </div>
        
        <div className="bg-card/90 backdrop-blur-sm rounded-xl px-4 py-2 shadow-game">
          <div className="text-xs text-muted-foreground font-medium">BEST</div>
          <div className="text-lg font-bold text-gold">{highScore.toLocaleString()}</div>
        </div>
      </div>
      
      {/* Active power-ups */}
      {activePowerUps.length > 0 && (
        <div className="mt-4 flex gap-2">
          {activePowerUps.map((pu, index) => {
            const info = getPowerUpInfo(pu.type);
            const progress = pu.remainingTime / (pu.type === 'boots' ? 10000 : pu.type === 'oxygen' ? 8000 : 5000);
            
            return (
              <div 
                key={`${pu.type}-${index}`}
                className={`${info.color} rounded-lg px-3 py-1 flex items-center gap-2 shadow-lg`}
              >
                <span className="text-lg">{info.icon}</span>
                <div className="flex flex-col">
                  <span className="text-xs font-medium text-white">{info.label}</span>
                  <div className="w-12 h-1 bg-black/20 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-white/80 rounded-full transition-all duration-100"
                      style={{ width: `${progress * 100}%` }}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
