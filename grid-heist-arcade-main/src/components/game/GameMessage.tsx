import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

interface GameMessageProps {
  message: string | null;
  type: 'info' | 'warning' | 'success' | 'danger';
}

export const GameMessage = ({ message, type }: GameMessageProps) => {
  const getMessageStyle = () => {
    switch (type) {
      case 'success':
        return 'border-neon-green text-neon-green bg-neon-green/10';
      case 'warning':
        return 'border-neon-orange text-neon-orange bg-neon-orange/10';
      case 'danger':
        return 'border-neon-red text-neon-red bg-neon-red/10';
      default:
        return 'border-primary text-primary bg-primary/10';
    }
  };

  return (
    <AnimatePresence>
      {message && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className={cn(
            'absolute top-4 left-1/2 -translate-x-1/2 px-6 py-3 rounded-lg border-2 font-display text-sm z-10',
            getMessageStyle()
          )}
        >
          {message}
        </motion.div>
      )}
    </AnimatePresence>
  );
};
