import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { SettingsModal } from './SettingsModal';
import { GameSettings } from '@/hooks/useGame';
import { Difficulty } from '@/game/engine';
import { audio } from '@/game/audio';

interface StartScreenProps {
  onPlay: () => void;
  settings: GameSettings;
  onSettingsChange: (settings: Partial<GameSettings>) => void;
  bestScore: number;
}

export function StartScreen({ onPlay, settings, onSettingsChange, bestScore }: StartScreenProps) {
  const [showSettings, setShowSettings] = useState(false);
  
  const handlePlay = () => {
    audio.click();
    onPlay();
  };
  
  const handleSettingsClick = () => {
    audio.click();
    setShowSettings(true);
  };
  
  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center p-8 bg-gradient-to-b from-background via-background to-muted/30">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-primary/5 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-secondary/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
      </div>
      
      {/* Title */}
      <div className="relative z-10 text-center mb-12">
        <h1 className="font-display text-6xl md:text-8xl font-bold tracking-wider text-neon-cyan glow-cyan animate-pulse-glow">
          NEON
        </h1>
        <h1 className="font-display text-5xl md:text-7xl font-bold tracking-widest text-neon-pink glow-pink -mt-2">
          DRIFT
        </h1>
        
        {bestScore > 0 && (
          <p className="font-body text-lg text-muted-foreground mt-4">
            Best Score: <span className="text-primary font-semibold">{bestScore.toLocaleString()}</span>
          </p>
        )}
      </div>
      
      {/* Instructions */}
      <div className="relative z-10 text-center mb-12 max-w-md">
        <p className="font-body text-muted-foreground text-lg leading-relaxed">
          Dodge obstacles. Collect orbs. Survive as long as you can.
        </p>
        <div className="mt-4 flex flex-wrap justify-center gap-3 text-sm">
          <span className="px-3 py-1 rounded bg-muted/50 text-foreground font-body">
            ← → or A/D to steer
          </span>
          <span className="px-3 py-1 rounded bg-muted/50 text-foreground font-body">
            ↑ or W to boost
          </span>
          <span className="px-3 py-1 rounded bg-muted/50 text-foreground font-body">
            Space to pause
          </span>
        </div>
        <p className="mt-3 text-sm text-muted-foreground font-body">
          On mobile: tap left/right to steer, swipe up to boost
        </p>
      </div>
      
      {/* Buttons */}
      <div className="relative z-10 flex flex-col sm:flex-row gap-4">
        <Button
          onClick={handlePlay}
          size="lg"
          className="font-display text-xl px-12 py-6 bg-primary text-primary-foreground hover:bg-primary/90 box-glow-cyan transition-all duration-300 hover:scale-105"
        >
          PLAY
        </Button>
        <Button
          onClick={handleSettingsClick}
          size="lg"
          variant="outline"
          className="font-display text-lg px-8 py-6 border-muted-foreground/30 hover:border-primary hover:text-primary transition-all duration-300"
        >
          SETTINGS
        </Button>
      </div>
      
      {/* Settings Modal */}
      <SettingsModal
        open={showSettings}
        onClose={() => setShowSettings(false)}
        settings={settings}
        onSettingsChange={onSettingsChange}
      />
    </div>
  );
}
