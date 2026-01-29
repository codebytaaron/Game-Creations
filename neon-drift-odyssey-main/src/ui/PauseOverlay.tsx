import { Button } from '@/components/ui/button';
import { audio } from '@/game/audio';

interface PauseOverlayProps {
  onResume: () => void;
}

export function PauseOverlay({ onResume }: PauseOverlayProps) {
  const handleResume = () => {
    audio.click();
    onResume();
  };
  
  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center bg-background/80 backdrop-blur-sm z-20">
      <h2 className="font-display text-5xl md:text-6xl text-primary glow-cyan mb-8">
        PAUSED
      </h2>
      
      <Button
        onClick={handleResume}
        size="lg"
        className="font-display text-xl px-12 py-6 bg-primary text-primary-foreground hover:bg-primary/90 box-glow-cyan transition-all duration-300"
      >
        RESUME
      </Button>
      
      <p className="font-body text-muted-foreground mt-6 text-sm">
        Press Space to resume
      </p>
    </div>
  );
}
