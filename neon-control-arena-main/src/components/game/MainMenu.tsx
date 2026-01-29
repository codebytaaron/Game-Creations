import React from 'react';
import { SaveData } from '@/lib/gameTypes';
import { Play, Trophy, Zap, Gamepad2 } from 'lucide-react';

interface MainMenuProps {
  saveData: SaveData;
  skillPoints: number;
  onStart: () => void;
  onSkills: () => void;
}

export const MainMenu: React.FC<MainMenuProps> = ({
  saveData,
  skillPoints,
  onStart,
  onSkills,
}) => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-muted opacity-50" />
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-pulse-neon" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-secondary/10 rounded-full blur-3xl animate-pulse-neon" style={{ animationDelay: '1s' }} />
      
      {/* Content */}
      <div className="relative z-10 text-center space-y-8 max-w-2xl">
        {/* Title */}
        <div className="space-y-2">
          <h1 className="text-5xl md:text-7xl font-display font-black tracking-wider text-primary neon-text">
            NEON CONTROL
          </h1>
          <p className="text-muted-foreground font-mono text-sm md:text-base">
            SURVIVE • UPGRADE • DOMINATE
          </p>
        </div>
        
        {/* Stats */}
        {saveData.gamesPlayed > 0 && (
          <div className="flex flex-wrap justify-center gap-4 md:gap-8">
            <div className="px-4 py-2 rounded-lg bg-card/50 border border-border backdrop-blur-sm">
              <div className="text-muted-foreground text-xs font-mono">HIGH SCORE</div>
              <div className="text-xl font-display text-primary neon-text">
                {saveData.highScore.toLocaleString()}
              </div>
            </div>
            <div className="px-4 py-2 rounded-lg bg-card/50 border border-border backdrop-blur-sm">
              <div className="text-muted-foreground text-xs font-mono">BEST WAVE</div>
              <div className="text-xl font-display text-secondary neon-text-magenta">
                {saveData.highestWave}
              </div>
            </div>
            <div className="px-4 py-2 rounded-lg bg-card/50 border border-border backdrop-blur-sm">
              <div className="text-muted-foreground text-xs font-mono">GAMES PLAYED</div>
              <div className="text-xl font-display text-foreground">
                {saveData.gamesPlayed}
              </div>
            </div>
          </div>
        )}
        
        {/* Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <button
            onClick={onStart}
            className="group flex items-center gap-3 px-8 py-4 rounded-lg neon-button text-lg font-display"
          >
            <Play className="w-6 h-6 text-primary group-hover:scale-110 transition-transform" />
            <span className="text-primary">START GAME</span>
          </button>
          
          <button
            onClick={onSkills}
            className="group relative flex items-center gap-3 px-8 py-4 rounded-lg neon-button text-lg font-display"
          >
            <Zap className="w-6 h-6 text-accent group-hover:scale-110 transition-transform" />
            <span className="text-accent">SKILL TREE</span>
            {skillPoints > 0 && (
              <span className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-accent text-accent-foreground text-xs font-bold flex items-center justify-center animate-bounce">
                {skillPoints}
              </span>
            )}
          </button>
        </div>
        
        {/* How to play */}
        <div className="mt-12 p-6 rounded-xl bg-card/30 border border-border backdrop-blur-sm">
          <div className="flex items-center gap-2 mb-4">
            <Gamepad2 className="w-5 h-5 text-primary" />
            <h2 className="text-lg font-display text-foreground">HOW TO PLAY</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left text-sm">
            <div className="space-y-2">
              <p className="text-muted-foreground font-mono">
                <span className="text-primary">WASD / ARROWS</span> — Move your ship
              </p>
              <p className="text-muted-foreground font-mono">
                <span className="text-primary">CLICK / SPACE</span> — Shoot towards cursor
              </p>
              <p className="text-muted-foreground font-mono">
                <span className="text-primary">ESC</span> — Pause game
              </p>
            </div>
            <div className="space-y-2">
              <p className="text-muted-foreground font-mono">
                <span className="text-neon-green">●</span> Power nodes — Stand near to capture
              </p>
              <p className="text-muted-foreground font-mono">
                <span className="text-neon-red">▲</span> Chasers — Fast, weak melee
              </p>
              <p className="text-muted-foreground font-mono">
                <span className="text-neon-magenta">■</span> Shooters — Ranged attacks
              </p>
              <p className="text-muted-foreground font-mono">
                <span className="text-orange-400">⬡</span> Bombers — Explode on contact
              </p>
            </div>
          </div>
        </div>
        
        {/* Touch hint for mobile */}
        <p className="text-muted-foreground text-xs font-mono md:hidden">
          TAP AND HOLD to move and shoot towards touch position
        </p>
      </div>
    </div>
  );
};
