import React from 'react';
import { Pause, Volume2, VolumeX } from 'lucide-react';

interface GameHUDProps {
  score: number;
  onPause: () => void;
  soundEnabled: boolean;
  onSoundToggle: () => void;
}

export function GameHUD({ score, onPause, soundEnabled, onSoundToggle }: GameHUDProps) {
  return (
    <div className="absolute inset-x-0 top-0 p-4 flex items-start justify-between pointer-events-none z-10">
      {/* Left side controls */}
      <div className="flex gap-2 pointer-events-auto">
        <button
          onClick={onPause}
          className="btn-icon glass-panel"
          aria-label="Pause game"
        >
          <Pause className="w-5 h-5" />
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onSoundToggle();
          }}
          className="btn-icon glass-panel"
          aria-label={soundEnabled ? 'Mute sound' : 'Enable sound'}
        >
          {soundEnabled ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
        </button>
      </div>
      
      {/* Score display */}
      <div className="absolute left-1/2 -translate-x-1/2 top-4">
        <p className="score-display drop-shadow-lg">{score}</p>
      </div>
      
      {/* Placeholder for right side balance */}
      <div className="w-24" />
    </div>
  );
}
