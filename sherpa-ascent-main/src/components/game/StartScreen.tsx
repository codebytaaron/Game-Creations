import React, { useState } from 'react';
import { Button } from '@/components/ui/button';

interface StartScreenProps {
  highScore: number;
  onStart: () => void;
}

export const StartScreen: React.FC<StartScreenProps> = ({ highScore, onStart }) => {
  const [showHelp, setShowHelp] = useState(false);
  
  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center p-6 z-10">
      {/* Background overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-sky-top/80 to-sky-bottom/90 backdrop-blur-sm" />
      
      {/* Content */}
      <div className="relative z-10 flex flex-col items-center animate-slide-up">
        {/* Title */}
        <div className="mb-8 text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-foreground text-game-shadow mb-2">
            🏔️ Sherpa Climb
          </h1>
          <p className="text-lg text-muted-foreground">
            Climb the endless mountain!
          </p>
        </div>
        
        {/* Sherpa mascot */}
        <div className="mb-8 float-animation">
          <svg viewBox="0 0 80 100" className="w-24 h-32">
            {/* Backpack */}
            <rect x="16" y="40" width="24" height="36" rx="6" className="fill-sherpa-secondary" />
            <rect x="20" y="44" width="16" height="8" rx="2" className="fill-sherpa-primary" />
            
            {/* Body */}
            <ellipse cx="40" cy="64" rx="24" ry="28" className="fill-sherpa-primary" />
            
            {/* Arms */}
            <ellipse cx="16" cy="60" rx="8" ry="16" className="fill-sherpa-primary" />
            <ellipse cx="64" cy="60" rx="8" ry="16" className="fill-sherpa-primary" />
            
            {/* Hands waving */}
            <circle cx="12" cy="48" r="6" className="fill-sherpa-skin" />
            <circle cx="68" cy="48" r="6" className="fill-sherpa-skin" />
            
            {/* Head */}
            <circle cx="40" cy="28" r="20" className="fill-sherpa-skin" />
            
            {/* Hat */}
            <path d="M20 28 Q20 12 40 8 Q60 12 60 28" className="fill-sherpa-secondary" />
            <ellipse cx="40" cy="28" rx="24" ry="6" className="fill-sherpa-secondary" />
            <circle cx="40" cy="8" r="6" className="fill-snow" />
            
            {/* Eyes */}
            <circle cx="32" cy="26" r="4" className="fill-foreground" />
            <circle cx="48" cy="26" r="4" className="fill-foreground" />
            <ellipse cx="32" cy="24" rx="1.5" ry="1.5" className="fill-snow" />
            <ellipse cx="48" cy="24" rx="1.5" ry="1.5" className="fill-snow" />
            
            {/* Big smile */}
            <path d="M28 36 Q40 48 52 36" stroke="hsl(var(--foreground))" strokeWidth="3" fill="none" strokeLinecap="round" />
            
            {/* Rosy cheeks */}
            <circle cx="22" cy="32" r="4" className="fill-sherpa-primary/40" />
            <circle cx="58" cy="32" r="4" className="fill-sherpa-primary/40" />
            
            {/* Legs */}
            <rect x="28" y="88" width="10" height="12" rx="4" className="fill-mountain-dark" />
            <rect x="42" y="88" width="10" height="12" rx="4" className="fill-mountain-dark" />
          </svg>
        </div>
        
        {/* High score */}
        {highScore > 0 && (
          <div className="mb-6 bg-card/90 backdrop-blur-sm rounded-xl px-6 py-3 shadow-game">
            <div className="text-sm text-muted-foreground">High Score</div>
            <div className="text-2xl font-bold text-gold">{highScore.toLocaleString()}</div>
          </div>
        )}
        
        {/* Buttons */}
        <div className="flex flex-col gap-3 w-full max-w-xs">
          <Button 
            onClick={onStart}
            size="lg"
            className="w-full text-lg font-bold py-6 animate-pulse-scale"
          >
            🚀 Play Now
          </Button>
          
          <Button
            variant="secondary"
            size="lg"
            onClick={() => setShowHelp(!showHelp)}
            className="w-full"
          >
            ❓ How to Play
          </Button>
        </div>
        
        {/* Help panel */}
        {showHelp && (
          <div className="mt-6 bg-card/95 backdrop-blur-sm rounded-xl p-6 shadow-game max-w-sm animate-fade-in">
            <h3 className="font-bold text-lg mb-4 text-foreground">Controls</h3>
            
            <div className="space-y-3 text-sm">
              <div className="flex items-center gap-3">
                <div className="bg-secondary px-3 py-1 rounded font-mono">← →</div>
                <span className="text-muted-foreground">or A/D to move</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="bg-secondary px-3 py-1 rounded font-mono">SPACE</div>
                <span className="text-muted-foreground">to jump</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="bg-secondary px-3 py-1 rounded">📱</div>
                <span className="text-muted-foreground">Touch buttons on mobile</span>
              </div>
            </div>
            
            <h3 className="font-bold text-lg mt-6 mb-4 text-foreground">Power-ups</h3>
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-powerup-rope" />
                <span className="text-muted-foreground">Rope - Auto-grab platforms</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-powerup-boots" />
                <span className="text-muted-foreground">Boots - No slipping on ice</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-powerup-oxygen" />
                <span className="text-muted-foreground">Oxygen - Higher jumps</span>
              </div>
            </div>
            
            <h3 className="font-bold text-lg mt-6 mb-4 text-foreground">Platforms</h3>
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-8 h-3 rounded bg-gradient-to-b from-platform-rock-light to-platform-rock" />
                <span className="text-muted-foreground">Normal - Safe landing</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-8 h-3 rounded bg-gradient-to-b from-platform-ice-light to-platform-ice" />
                <span className="text-muted-foreground">Ice - Slippery!</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-8 h-3 rounded bg-gradient-to-b from-platform-rock-light to-platform-rock opacity-60" />
                <span className="text-muted-foreground">Breakable - Don't stay too long!</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-8 h-3 rounded bg-gradient-to-b from-platform-rope to-yellow-700" />
                <span className="text-muted-foreground">Moving - Watch the pattern</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
