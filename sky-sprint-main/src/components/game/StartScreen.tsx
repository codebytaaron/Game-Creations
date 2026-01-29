import React, { useState } from 'react';
import { Play, HelpCircle, Settings, Volume2, VolumeX, Accessibility } from 'lucide-react';

interface StartScreenProps {
  onPlay: () => void;
  bestScore: number;
  soundEnabled: boolean;
  reducedMotion: boolean;
  onSoundToggle: () => void;
  onReducedMotionToggle: () => void;
}

export function StartScreen({
  onPlay,
  bestScore,
  soundEnabled,
  reducedMotion,
  onSoundToggle,
  onReducedMotionToggle,
}: StartScreenProps) {
  const [showHelp, setShowHelp] = useState(false);
  const [showSettings, setShowSettings] = useState(false);

  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center p-6 z-10">
      {/* Background overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-sky-400/20 to-orange-200/30" />
      
      {/* Main content */}
      <div className="relative z-10 flex flex-col items-center gap-8 max-w-md w-full">
        {/* Animated bird icon */}
        <div className="animate-float">
          <div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary to-orange-400 shadow-2xl flex items-center justify-center relative">
            <div className="absolute w-8 h-8 bg-white rounded-full top-4 right-5" />
            <div className="absolute w-4 h-4 bg-foreground rounded-full top-5 right-5" />
            <div className="absolute w-6 h-4 bg-yellow-400 right-0 top-1/2 -translate-y-1/2 rounded-r-full" style={{ clipPath: 'polygon(0 50%, 100% 0, 100% 100%)' }} />
          </div>
        </div>

        {/* Title */}
        <div className="text-center animate-slide-up">
          <h1 className="game-title mb-2">Flappy Sprint</h1>
          <p className="text-muted-foreground text-lg">Tap • Click • Space to fly!</p>
        </div>

        {/* Best score */}
        {bestScore > 0 && (
          <div className="glass-panel px-6 py-3 rounded-2xl animate-fade-in">
            <p className="text-muted-foreground text-sm">Best Score</p>
            <p className="text-2xl font-bold text-foreground">{bestScore}</p>
          </div>
        )}

        {/* Play button */}
        <button
          onClick={onPlay}
          className="btn-primary-game flex items-center gap-3 animate-bounce-soft"
        >
          <Play className="w-6 h-6" fill="currentColor" />
          Play Game
        </button>

        {/* Action buttons */}
        <div className="flex gap-4">
          <button
            onClick={() => setShowHelp(true)}
            className="btn-secondary-game flex items-center gap-2 py-3 px-5"
          >
            <HelpCircle className="w-5 h-5" />
            How to Play
          </button>
          <button
            onClick={() => setShowSettings(true)}
            className="btn-icon glass-panel"
          >
            <Settings className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Help Modal */}
      {showHelp && (
        <div className="absolute inset-0 flex items-center justify-center p-6 z-20 animate-fade-in">
          <div className="absolute inset-0 bg-foreground/30 backdrop-blur-sm" onClick={() => setShowHelp(false)} />
          <div className="glass-panel rounded-3xl p-8 max-w-sm w-full relative z-10 animate-bounce-soft">
            <h2 className="text-2xl font-bold mb-6 text-foreground">How to Play</h2>
            
            <div className="space-y-4 text-foreground/80">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center shrink-0">
                  <span className="text-lg">🎮</span>
                </div>
                <div>
                  <p className="font-medium">Controls</p>
                  <p className="text-sm text-muted-foreground">Tap, Click, or press Space/Up Arrow to flap</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-accent/20 flex items-center justify-center shrink-0">
                  <span className="text-lg">🎯</span>
                </div>
                <div>
                  <p className="font-medium">Goal</p>
                  <p className="text-sm text-muted-foreground">Fly through the gaps between pipes to score points</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-destructive/20 flex items-center justify-center shrink-0">
                  <span className="text-lg">⚠️</span>
                </div>
                <div>
                  <p className="font-medium">Avoid</p>
                  <p className="text-sm text-muted-foreground">Don't hit the pipes, ground, or ceiling!</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center shrink-0">
                  <span className="text-lg">📈</span>
                </div>
                <div>
                  <p className="font-medium">Difficulty</p>
                  <p className="text-sm text-muted-foreground">Speed increases and gaps shrink every 10 points</p>
                </div>
              </div>
            </div>

            <button
              onClick={() => setShowHelp(false)}
              className="btn-primary-game w-full mt-8"
            >
              Got it!
            </button>
          </div>
        </div>
      )}

      {/* Settings Modal */}
      {showSettings && (
        <div className="absolute inset-0 flex items-center justify-center p-6 z-20 animate-fade-in">
          <div className="absolute inset-0 bg-foreground/30 backdrop-blur-sm" onClick={() => setShowSettings(false)} />
          <div className="glass-panel rounded-3xl p-8 max-w-sm w-full relative z-10 animate-bounce-soft">
            <h2 className="text-2xl font-bold mb-6 text-foreground">Settings</h2>
            
            <div className="space-y-4">
              <button
                onClick={onSoundToggle}
                className="w-full flex items-center justify-between p-4 rounded-2xl bg-secondary/50 hover:bg-secondary transition-colors"
              >
                <div className="flex items-center gap-3">
                  {soundEnabled ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
                  <span className="font-medium">Sound Effects</span>
                </div>
                <div className={`w-12 h-7 rounded-full transition-colors ${soundEnabled ? 'bg-primary' : 'bg-muted-foreground/30'}`}>
                  <div className={`w-5 h-5 rounded-full bg-white shadow-md transform transition-transform mt-1 ${soundEnabled ? 'translate-x-6' : 'translate-x-1'}`} />
                </div>
              </button>
              
              <button
                onClick={onReducedMotionToggle}
                className="w-full flex items-center justify-between p-4 rounded-2xl bg-secondary/50 hover:bg-secondary transition-colors"
              >
                <div className="flex items-center gap-3">
                  <Accessibility className="w-5 h-5" />
                  <span className="font-medium">Reduced Motion</span>
                </div>
                <div className={`w-12 h-7 rounded-full transition-colors ${reducedMotion ? 'bg-primary' : 'bg-muted-foreground/30'}`}>
                  <div className={`w-5 h-5 rounded-full bg-white shadow-md transform transition-transform mt-1 ${reducedMotion ? 'translate-x-6' : 'translate-x-1'}`} />
                </div>
              </button>
            </div>

            <button
              onClick={() => setShowSettings(false)}
              className="btn-secondary-game w-full mt-8"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
