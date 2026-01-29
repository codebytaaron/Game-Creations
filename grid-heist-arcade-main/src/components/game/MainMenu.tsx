import { motion } from 'framer-motion';

interface MainMenuProps {
  highScore: number;
  onStartGame: () => void;
  onStartTutorial: () => void;
}

export const MainMenu = ({ highScore, onStartGame, onStartTutorial }: MainMenuProps) => {
  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4 overflow-hidden relative">
      {/* Background grid pattern */}
      <div className="absolute inset-0 grid-pattern opacity-20" />
      
      {/* Animated background elements */}
      <motion.div
        className="absolute top-1/4 left-1/4 w-32 h-32 rounded-full bg-primary/10 blur-3xl"
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.3, 0.5, 0.3],
        }}
        transition={{ duration: 4, repeat: Infinity }}
      />
      <motion.div
        className="absolute bottom-1/4 right-1/4 w-40 h-40 rounded-full bg-secondary/10 blur-3xl"
        animate={{
          scale: [1.2, 1, 1.2],
          opacity: [0.3, 0.5, 0.3],
        }}
        transition={{ duration: 5, repeat: Infinity }}
      />

      {/* Title */}
      <motion.div
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="text-center mb-12 relative z-10"
      >
        <motion.h1
          className="font-display text-6xl md:text-8xl text-primary text-glow-cyan mb-4"
          animate={{ textShadow: ['0 0 20px hsl(var(--primary))', '0 0 40px hsl(var(--primary))', '0 0 20px hsl(var(--primary))'] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          GRID HEIST
        </motion.h1>
        <p className="text-muted-foreground text-lg">
          Steal. Evade. Escape.
        </p>
      </motion.div>

      {/* Menu buttons */}
      <motion.div
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        className="space-y-4 relative z-10"
      >
        <button
          onClick={onStartGame}
          className="w-64 py-4 px-8 bg-primary text-primary-foreground font-display text-xl rounded-lg hover:bg-primary/80 transition-all hover:scale-105 box-glow-cyan"
        >
          START HEIST
        </button>
        <button
          onClick={onStartTutorial}
          className="w-64 py-4 px-8 bg-muted text-foreground font-display text-xl rounded-lg hover:bg-muted/80 transition-all hover:scale-105"
        >
          TUTORIAL
        </button>
      </motion.div>

      {/* High Score */}
      {highScore > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-12 text-center relative z-10"
        >
          <div className="text-muted-foreground text-sm">HIGH SCORE</div>
          <div className="font-display text-3xl text-neon-gold text-glow-gold">
            {highScore}
          </div>
        </motion.div>
      )}

      {/* Instructions preview */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.7 }}
        className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-4 text-center text-xs text-muted-foreground relative z-10"
      >
        <div className="bg-card/50 rounded-lg p-3 border border-border/50">
          <div className="text-2xl mb-1">🏃</div>
          <div>Move with WASD</div>
        </div>
        <div className="bg-card/50 rounded-lg p-3 border border-border/50">
          <div className="text-2xl mb-1">💰</div>
          <div>Collect Loot</div>
        </div>
        <div className="bg-card/50 rounded-lg p-3 border border-border/50">
          <div className="text-2xl mb-1">👁️</div>
          <div>Avoid Guards</div>
        </div>
        <div className="bg-card/50 rounded-lg p-3 border border-border/50">
          <div className="text-2xl mb-1">🚪</div>
          <div>Reach Exit</div>
        </div>
      </motion.div>

      {/* Version */}
      <div className="absolute bottom-4 text-muted-foreground/50 text-xs">
        v1.0 - Turn-based stealth strategy
      </div>
    </div>
  );
};
