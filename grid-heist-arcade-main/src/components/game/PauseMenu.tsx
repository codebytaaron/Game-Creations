import { motion } from 'framer-motion';

interface PauseMenuProps {
  onResume: () => void;
  onMainMenu: () => void;
}

export const PauseMenu = ({ onResume, onMainMenu }: PauseMenuProps) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="absolute inset-0 bg-background/90 backdrop-blur-sm flex items-center justify-center z-20"
    >
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-card border-2 border-primary rounded-xl p-8 text-center"
      >
        <h2 className="font-display text-4xl text-primary text-glow-cyan mb-8">
          PAUSED
        </h2>
        <div className="space-y-4">
          <button
            onClick={onResume}
            className="w-full py-3 px-8 bg-primary text-primary-foreground font-display rounded-lg hover:bg-primary/80 transition-colors"
          >
            RESUME
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
