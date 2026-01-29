import { motion } from 'framer-motion';
import { GameStats } from '@/types/game';

interface GameOverScreenProps {
  won: boolean;
  stats: GameStats;
  score: number;
  highScore: number;
  onNextLevel: () => void;
  onRestart: () => void;
  onMainMenu: () => void;
}

export const GameOverScreen = ({
  won,
  stats,
  score,
  highScore,
  onNextLevel,
  onRestart,
  onMainMenu,
}: GameOverScreenProps) => {
  const isNewHighScore = score > highScore;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="absolute inset-0 bg-background/95 backdrop-blur-sm flex items-center justify-center z-20"
    >
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-card border-2 border-border rounded-xl p-8 text-center max-w-md w-full mx-4"
      >
        {/* Title */}
        <motion.h2
          initial={{ y: -20 }}
          animate={{ y: 0 }}
          className={`font-display text-4xl mb-2 ${
            won ? 'text-neon-green text-glow-gold' : 'text-neon-red text-glow-magenta'
          }`}
        >
          {won ? 'LEVEL COMPLETE!' : 'BUSTED!'}
        </motion.h2>

        {isNewHighScore && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.3 }}
            className="text-neon-gold text-glow-gold font-display text-lg mb-4"
          >
            ⭐ NEW HIGH SCORE! ⭐
          </motion.div>
        )}

        {/* Score */}
        <div className="my-6">
          <div className="text-muted-foreground text-sm">SCORE</div>
          <div className="font-display text-5xl text-primary text-glow-cyan">
            {score}
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-4 my-6 text-sm">
          <div className="bg-muted/30 rounded-lg p-3">
            <div className="text-muted-foreground">Levels</div>
            <div className="text-xl font-display text-foreground">{stats.levelsCompleted}</div>
          </div>
          <div className="bg-muted/30 rounded-lg p-3">
            <div className="text-muted-foreground">Loot</div>
            <div className="text-xl font-display text-neon-gold">{stats.lootCollected}</div>
          </div>
          <div className="bg-muted/30 rounded-lg p-3">
            <div className="text-muted-foreground">Turns</div>
            <div className="text-xl font-display text-foreground">{stats.turnsUsed}</div>
          </div>
          <div className="bg-muted/30 rounded-lg p-3">
            <div className="text-muted-foreground">Spotted</div>
            <div className="text-xl font-display text-neon-red">{stats.timesSpotted}</div>
          </div>
        </div>

        {/* Buttons */}
        <div className="space-y-3 mt-6">
          {won && (
            <button
              onClick={onNextLevel}
              className="w-full py-3 px-8 bg-neon-green text-primary-foreground font-display rounded-lg hover:bg-neon-green/80 transition-colors"
            >
              NEXT LEVEL →
            </button>
          )}
          <button
            onClick={onRestart}
            className="w-full py-3 px-8 bg-primary text-primary-foreground font-display rounded-lg hover:bg-primary/80 transition-colors"
          >
            {won ? 'RESTART GAME' : 'TRY AGAIN'}
          </button>
          <button
            onClick={onMainMenu}
            className="w-full py-3 px-8 bg-muted text-foreground font-display rounded-lg hover:bg-muted/80 transition-colors"
          >
            MAIN MENU
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
};
