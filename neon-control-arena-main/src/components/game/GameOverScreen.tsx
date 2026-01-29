import React from 'react';
import { GameState, SaveData } from '@/lib/gameTypes';
import { RotateCcw, Home, Trophy, Star, Zap } from 'lucide-react';

interface GameOverScreenProps {
  gameState: GameState;
  saveData: SaveData;
  onRestart: () => void;
  onMenu: () => void;
}

export const GameOverScreen: React.FC<GameOverScreenProps> = ({
  gameState,
  saveData,
  onRestart,
  onMenu,
}) => {
  const isNewHighScore = gameState.score >= saveData.highScore;
  const isNewHighWave = gameState.wave >= saveData.highestWave;
  const earnedXp = Math.floor(gameState.score / 10);
  const earnedSkillPoints = Math.floor(earnedXp / 50);

  return (
    <div className="absolute inset-0 bg-background/90 backdrop-blur-md flex items-center justify-center z-50">
      <div className="text-center space-y-6 p-8 rounded-2xl bg-card/50 border border-destructive/50 backdrop-blur-sm max-w-md w-full mx-4">
        <div className="space-y-2">
          <h2 className="text-4xl font-display font-bold text-destructive">
            GAME OVER
          </h2>
          {(isNewHighScore || isNewHighWave) && (
            <div className="flex items-center justify-center gap-2 text-accent animate-pulse">
              <Trophy className="w-5 h-5" />
              <span className="font-display text-sm">
                {isNewHighScore ? 'NEW HIGH SCORE!' : 'NEW WAVE RECORD!'}
              </span>
              <Trophy className="w-5 h-5" />
            </div>
          )}
        </div>
        
        {/* Final stats */}
        <div className="grid grid-cols-2 gap-4 py-4">
          <div className="p-3 rounded-lg bg-muted/30">
            <div className="text-muted-foreground text-xs font-mono">SCORE</div>
            <div className="text-2xl font-display text-primary neon-text">
              {gameState.score.toLocaleString()}
            </div>
          </div>
          <div className="p-3 rounded-lg bg-muted/30">
            <div className="text-muted-foreground text-xs font-mono">WAVE</div>
            <div className="text-2xl font-display text-secondary neon-text-magenta">
              {gameState.wave}
            </div>
          </div>
          <div className="p-3 rounded-lg bg-muted/30">
            <div className="text-muted-foreground text-xs font-mono">LEVEL</div>
            <div className="text-2xl font-display text-foreground">
              {gameState.level}
            </div>
          </div>
          <div className="p-3 rounded-lg bg-muted/30">
            <div className="text-muted-foreground text-xs font-mono">TIME</div>
            <div className="text-2xl font-display text-foreground">
              {Math.floor(gameState.timeElapsed / 60)}:{Math.floor(gameState.timeElapsed % 60).toString().padStart(2, '0')}
            </div>
          </div>
        </div>
        
        {/* Rewards */}
        <div className="p-4 rounded-lg bg-accent/10 border border-accent/30 space-y-2">
          <div className="text-accent text-sm font-display flex items-center justify-center gap-2">
            <Star className="w-4 h-4" />
            REWARDS EARNED
            <Star className="w-4 h-4" />
          </div>
          <div className="flex justify-center gap-6">
            <div className="text-center">
              <div className="text-2xl font-display text-primary">+{earnedXp}</div>
              <div className="text-xs text-muted-foreground font-mono">XP</div>
            </div>
            {earnedSkillPoints > 0 && (
              <div className="text-center">
                <div className="text-2xl font-display text-accent flex items-center gap-1">
                  <Zap className="w-5 h-5" />
                  +{earnedSkillPoints}
                </div>
                <div className="text-xs text-muted-foreground font-mono">SKILL POINTS</div>
              </div>
            )}
          </div>
        </div>
        
        {/* Actions */}
        <div className="space-y-3">
          <button
            onClick={onRestart}
            className="w-full flex items-center justify-center gap-3 px-6 py-3 rounded-lg neon-button font-display"
          >
            <RotateCcw className="w-5 h-5 text-primary" />
            <span className="text-primary">TRY AGAIN</span>
          </button>
          
          <button
            onClick={onMenu}
            className="w-full flex items-center justify-center gap-3 px-6 py-3 rounded-lg bg-muted/50 border border-border hover:bg-muted transition-colors font-display"
          >
            <Home className="w-5 h-5 text-muted-foreground" />
            <span className="text-muted-foreground">MAIN MENU</span>
          </button>
        </div>
      </div>
    </div>
  );
};
