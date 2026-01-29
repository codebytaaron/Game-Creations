import React, { useState, useMemo } from 'react';
import { Upgrade } from '../../game/types';
import { UPGRADES } from '../../game/constants';

interface UpgradeScreenProps {
  loopNumber: number;
  appliedUpgrades: Upgrade[];
  onSelectUpgrade: (upgrade: Upgrade) => void;
}

export const UpgradeScreen: React.FC<UpgradeScreenProps> = ({
  loopNumber,
  appliedUpgrades,
  onSelectUpgrade,
}) => {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  
  // Get 3 random upgrades that haven't been selected (unless all have)
  const availableUpgrades = useMemo(() => {
    const appliedIds = new Set(appliedUpgrades.map(u => u.id));
    let pool = UPGRADES.filter(u => !appliedIds.has(u.id));
    
    // If all upgrades have been applied, allow duplicates (except special abilities)
    if (pool.length < 3) {
      pool = UPGRADES.filter(u => u.type !== 'special' || !appliedIds.has(u.id));
    }
    
    // Shuffle and take 3
    const shuffled = [...pool].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, 3);
  }, [appliedUpgrades]);
  
  const handleConfirm = () => {
    const upgrade = availableUpgrades.find(u => u.id === selectedId);
    if (upgrade) {
      onSelectUpgrade(upgrade);
    }
  };
  
  return (
    <div className="fixed inset-0 bg-background/90 backdrop-blur-md flex items-center justify-center z-50 fade-in">
      <div className="max-w-2xl w-full mx-4">
        <div className="text-center mb-8 slide-up">
          <div className="text-sm text-muted-foreground font-body uppercase tracking-widest mb-2">
            Loop {loopNumber} Complete
          </div>
          <h2 className="text-4xl font-display font-bold text-glow mb-2">
            Choose Your Upgrade
          </h2>
          <p className="text-muted-foreground font-body">
            Your actions from this loop will be replayed by a ghost
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          {availableUpgrades.map((upgrade, index) => (
            <button
              key={upgrade.id}
              onClick={() => setSelectedId(upgrade.id)}
              className={`upgrade-card text-left slide-up ${selectedId === upgrade.id ? 'selected' : ''}`}
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="text-4xl mb-3">{upgrade.icon}</div>
              <h3 className="font-display font-bold text-lg mb-1">{upgrade.name}</h3>
              <p className="text-sm text-muted-foreground font-body">{upgrade.description}</p>
              <div className="mt-3 pt-3 border-t border-border">
                <span className={`text-xs font-body uppercase tracking-wider ${
                  upgrade.type === 'special' ? 'text-accent' : 'text-primary'
                }`}>
                  {upgrade.type === 'special' ? 'Special Ability' : upgrade.type}
                </span>
              </div>
            </button>
          ))}
        </div>
        
        <div className="text-center">
          <button
            onClick={handleConfirm}
            disabled={!selectedId}
            className={`px-8 py-3 rounded-lg font-display font-bold text-lg transition-all duration-300
              ${selectedId 
                ? 'bg-primary text-primary-foreground box-glow hover:scale-105' 
                : 'bg-muted text-muted-foreground cursor-not-allowed'
              }`}
          >
            Start Loop {loopNumber + 1}
          </button>
        </div>
      </div>
    </div>
  );
};
