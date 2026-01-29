import { Button } from '@/components/ui/button';
import { RotateCcw, Volume2, VolumeX, HelpCircle } from 'lucide-react';

interface GameHeaderProps {
  score: number;
  bestScore: number;
  soundEnabled: boolean;
  onToggleSound: () => void;
  onNewGame: () => void;
  onShowHelp: () => void;
}

export function GameHeader({
  score,
  bestScore,
  soundEnabled,
  onToggleSound,
  onNewGame,
  onShowHelp,
}: GameHeaderProps) {
  return (
    <div className="flex items-center justify-between gap-2 px-1">
      <div className="flex gap-3 sm:gap-4">
        <div className="text-center">
          <div className="text-xs sm:text-sm font-medium text-muted-foreground uppercase tracking-wide">
            Score
          </div>
          <div className="text-xl sm:text-2xl font-bold text-foreground">
            {score.toLocaleString()}
          </div>
        </div>
        <div className="text-center">
          <div className="text-xs sm:text-sm font-medium text-muted-foreground uppercase tracking-wide">
            Best
          </div>
          <div className="text-xl sm:text-2xl font-bold text-primary">
            {bestScore.toLocaleString()}
          </div>
        </div>
      </div>
      
      <div className="flex gap-1 sm:gap-2">
        <Button
          variant="ghost"
          size="icon"
          onClick={onShowHelp}
          className="h-9 w-9 sm:h-10 sm:w-10"
        >
          <HelpCircle className="h-5 w-5" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={onToggleSound}
          className="h-9 w-9 sm:h-10 sm:w-10"
        >
          {soundEnabled ? (
            <Volume2 className="h-5 w-5" />
          ) : (
            <VolumeX className="h-5 w-5" />
          )}
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={onNewGame}
          className="h-9 w-9 sm:h-10 sm:w-10"
        >
          <RotateCcw className="h-5 w-5" />
        </Button>
      </div>
    </div>
  );
}
