import { useState } from 'react';
import { PlayerProfile, GameSettings } from '@/types/game';
import { LEVELS } from '@/config/levels';

interface MainMenuProps {
  profile: PlayerProfile;
  settings: GameSettings;
  onStartTutorial: () => void;
  onStartGame: (level: number) => void;
  onOpenSettings: () => void;
  onOpenLeaderboard: () => void;
  onUpdateProfile: (updates: Partial<PlayerProfile>) => void;
}

export function MainMenu({
  profile,
  onStartTutorial,
  onStartGame,
  onOpenSettings,
  onOpenLeaderboard,
}: MainMenuProps) {
  const [showLevelSelect, setShowLevelSelect] = useState(false);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 relative overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0 bg-gradient-club" />
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-neon-cyan/20 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-neon-magenta/20 rounded-full blur-3xl animate-float" style={{ animationDelay: '1s' }} />
        <div className="absolute top-1/2 right-1/3 w-48 h-48 bg-neon-lime/20 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }} />
      </div>

      {/* Content */}
      <div className="relative z-10 text-center animate-slide-in">
        {/* Title */}
        <h1 className="font-arcade text-4xl md:text-6xl neon-text-cyan mb-2 tracking-wider">
          TEQUILA
        </h1>
        <p className="text-lg md:text-xl text-muted-foreground mb-2 font-orbitron">
          🎧 Nightclub Manager 🌙
        </p>
        <p className="text-sm text-neon-magenta/80 mb-8 font-orbitron">
          Keep the party going!
        </p>

        {/* Best Score */}
        {profile.bestScore > 0 && (
          <div className="mb-8 hud-panel inline-block">
            <span className="text-muted-foreground text-sm">Best Score: </span>
            <span className="score-display">{profile.bestScore.toLocaleString()}</span>
          </div>
        )}

        {/* Menu Buttons */}
        {!showLevelSelect ? (
          <div className="flex flex-col gap-4 max-w-xs mx-auto">
            <button
              onClick={() => setShowLevelSelect(true)}
              className="arcade-button py-4 px-8 rounded-lg text-lg"
            >
              ▶ PLAY
            </button>
            
            <button
              onClick={onStartTutorial}
              className="arcade-button py-3 px-6 rounded-lg bg-gradient-to-r from-neon-lime/80 to-neon-cyan/80"
            >
              📖 TUTORIAL
            </button>
            
            <button
              onClick={onOpenLeaderboard}
              className="arcade-button py-3 px-6 rounded-lg bg-gradient-to-r from-neon-orange/80 to-neon-magenta/80"
            >
              🏆 LEADERBOARD
            </button>
            
            <button
              onClick={onOpenSettings}
              className="arcade-button py-3 px-6 rounded-lg bg-gradient-to-r from-muted to-muted/80 border-muted-foreground"
            >
              ⚙️ SETTINGS
            </button>
          </div>
        ) : (
          <div className="flex flex-col gap-4 max-w-md mx-auto animate-fade-in">
            <h2 className="font-arcade text-xl neon-text-magenta mb-4">SELECT LEVEL</h2>
            
            {LEVELS.map((level) => (
              <button
                key={level.id}
                onClick={() => onStartGame(level.id)}
                className="hud-panel p-4 text-left hover:border-neon-cyan transition-all duration-200 group"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="font-arcade text-sm neon-text-cyan group-hover:animate-glow">
                    LEVEL {level.id}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {level.duration}s
                  </span>
                </div>
                <h3 className="font-orbitron font-bold text-lg text-foreground mb-1">
                  {level.name}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {level.description}
                </p>
                <div className="flex gap-2 mt-2">
                  {level.minigames.map(game => (
                    <span key={game} className="text-lg">
                      {game === 'dj' && '🎧'}
                      {game === 'lights' && '💡'}
                      {game === 'id-check' && '🪪'}
                      {game === 'drinks' && '🥤'}
                    </span>
                  ))}
                </div>
              </button>
            ))}
            
            <button
              onClick={() => setShowLevelSelect(false)}
              className="mt-4 text-muted-foreground hover:text-foreground transition-colors"
            >
              ← Back
            </button>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="absolute bottom-4 text-center text-xs text-muted-foreground">
        <p>Use WASD/Arrow keys or tap to play</p>
        <p className="mt-1 text-neon-lime/60">🍵 100% Non-Alcoholic Fun 🍵</p>
      </div>
    </div>
  );
}
