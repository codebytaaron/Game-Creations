import { Button } from '@/components/ui/button';
import { Play, HelpCircle, Info, Volume2, VolumeX } from 'lucide-react';

interface StartScreenProps {
  onStart: () => void;
  onHowTo: () => void;
  onCredits: () => void;
  soundEnabled: boolean;
  onToggleSound: () => void;
}

export function StartScreen({
  onStart,
  onHowTo,
  onCredits,
  soundEnabled,
  onToggleSound,
}: StartScreenProps) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 animate-fade-in">
      {/* Sound Toggle */}
      <button
        onClick={onToggleSound}
        className="absolute top-6 right-6 p-2 text-muted-foreground hover:text-primary transition-colors"
        aria-label={soundEnabled ? 'Mute sounds' : 'Enable sounds'}
      >
        {soundEnabled ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
      </button>

      {/* Title */}
      <div className="text-center mb-12">
        <div className="font-mono text-xs uppercase tracking-[0.3em] text-primary/60 mb-4">
          A Decision-Driven Experience
        </div>
        <h1 className="font-mono text-4xl md:text-6xl lg:text-7xl font-bold text-primary text-glow mb-4">
          THE PORTAL
        </h1>
        <h2 className="font-mono text-2xl md:text-3xl font-bold text-foreground mb-6">
          GAME
        </h2>
        <p className="text-muted-foreground max-w-md mx-auto leading-relaxed">
          Navigate 24 hours in the college transfer portal. Every choice has
          consequences. There are no right answers—only tradeoffs.
        </p>
      </div>

      {/* Decorative Element */}
      <div className="w-full max-w-xs mb-12">
        <div className="h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
        <div className="flex justify-center -mt-3">
          <div className="w-6 h-6 bg-background border border-primary/50 rounded-full flex items-center justify-center">
            <div className="w-2 h-2 bg-primary rounded-full animate-pulse" />
          </div>
        </div>
      </div>

      {/* Buttons */}
      <div className="flex flex-col gap-4 w-full max-w-xs">
        <Button
          onClick={onStart}
          size="lg"
          className="w-full bg-primary text-primary-foreground hover:bg-primary/90 font-mono uppercase tracking-wider box-glow group"
        >
          <Play className="w-4 h-4 mr-2 group-hover:animate-pulse" />
          Start Day
        </Button>
        <Button
          onClick={onHowTo}
          variant="outline"
          size="lg"
          className="w-full border-primary/30 text-primary hover:bg-primary/10 font-mono uppercase tracking-wider"
        >
          <HelpCircle className="w-4 h-4 mr-2" />
          How It Works
        </Button>
        <Button
          onClick={onCredits}
          variant="ghost"
          size="lg"
          className="w-full text-muted-foreground hover:text-foreground hover:bg-secondary font-mono uppercase tracking-wider"
        >
          <Info className="w-4 h-4 mr-2" />
          Credits
        </Button>
      </div>

      {/* Footer */}
      <div className="absolute bottom-6 text-center">
        <p className="font-mono text-xs text-muted-foreground/50">
          v1.0 · No perfect paths, only tradeoffs
        </p>
      </div>
    </div>
  );
}
