import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Trophy, RotateCcw } from 'lucide-react';

interface GameOverModalProps {
  open: boolean;
  score: number;
  bestScore: number;
  isNewBest: boolean;
  onNewGame: () => void;
}

export function GameOverModal({
  open,
  score,
  bestScore,
  isNewBest,
  onNewGame,
}: GameOverModalProps) {
  return (
    <Dialog open={open}>
      <DialogContent className="sm:max-w-md text-center" onPointerDownOutside={(e) => e.preventDefault()}>
        <DialogHeader>
          <DialogTitle className="text-2xl sm:text-3xl font-bold text-center">
            Game Over!
          </DialogTitle>
          <DialogDescription className="text-center pt-4 space-y-4">
            <div className="text-4xl sm:text-5xl font-bold text-foreground">
              {score.toLocaleString()}
            </div>
            
            {isNewBest ? (
              <div className="flex items-center justify-center gap-2 text-primary">
                <Trophy className="h-6 w-6" />
                <span className="text-lg font-semibold">New Best Score!</span>
                <Trophy className="h-6 w-6" />
              </div>
            ) : (
              <div className="text-muted-foreground">
                Best: {bestScore.toLocaleString()}
              </div>
            )}
          </DialogDescription>
        </DialogHeader>
        
        <Button
          size="lg"
          onClick={onNewGame}
          className="mt-4 gap-2 font-semibold"
        >
          <RotateCcw className="h-5 w-5" />
          Play Again
        </Button>
      </DialogContent>
    </Dialog>
  );
}
