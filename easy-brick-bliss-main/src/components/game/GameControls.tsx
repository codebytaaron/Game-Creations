import { Button } from '@/components/ui/button';
import { Lightbulb, Shuffle } from 'lucide-react';

interface GameControlsProps {
  shufflesLeft: number;
  onHint: () => void;
  onShuffle: () => void;
}

export function GameControls({ shufflesLeft, onHint, onShuffle }: GameControlsProps) {
  return (
    <div className="flex justify-center gap-3">
      <Button
        variant="secondary"
        onClick={onHint}
        className="gap-2 font-semibold"
      >
        <Lightbulb className="h-4 w-4" />
        Hint
      </Button>
      <Button
        variant="secondary"
        onClick={onShuffle}
        disabled={shufflesLeft <= 0}
        className="gap-2 font-semibold"
      >
        <Shuffle className="h-4 w-4" />
        Shuffle ({shufflesLeft})
      </Button>
    </div>
  );
}
