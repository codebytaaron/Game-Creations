import { GameState, STAGE_LABELS } from '@/types/game';
import { StatsPanel } from './StatsPanel';
import { Button } from '@/components/ui/button';
import { RotateCcw, Share2, Copy, Check } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

interface EndScreenProps {
  state: GameState;
  onReset: () => void;
  onShare: () => string;
}

export function EndScreen({ state, onReset, onShare }: EndScreenProps) {
  const [copied, setCopied] = useState(false);

  const handleShare = async () => {
    const text = onShare();
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      toast.success('Results copied to clipboard!');
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error('Failed to copy to clipboard');
    }
  };

  if (!state.ending) return null;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 animate-fade-in">
      <div className="w-full max-w-2xl">
        {/* Ending Label */}
        <div className="text-center mb-8">
          <div className="font-mono text-xs uppercase tracking-[0.3em] text-primary/60 mb-4">
            Day Complete
          </div>
          <h1 className="font-mono text-3xl md:text-4xl font-bold text-primary text-glow mb-4">
            {state.ending.label}
          </h1>
          <p className="text-muted-foreground leading-relaxed max-w-lg mx-auto">
            {state.ending.description}
          </p>
        </div>

        {/* Decorative Divider */}
        <div className="w-full max-w-xs mx-auto mb-8">
          <div className="h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
        </div>

        {/* Final Stats */}
        <div className="terminal-border rounded-lg p-6 bg-card/50 mb-8">
          <h2 className="font-mono text-sm uppercase tracking-wider text-muted-foreground mb-4 text-center">
            Final Stats
          </h2>
          <StatsPanel stats={state.stats} />
        </div>

        {/* Event Log */}
        <div className="terminal-border rounded-lg p-6 bg-card/50 mb-8">
          <h2 className="font-mono text-sm uppercase tracking-wider text-muted-foreground mb-4">
            Key Decisions
          </h2>
          <div className="space-y-3">
            {state.eventLog.map((event, index) => (
              <div
                key={index}
                className="flex items-start gap-3 text-sm animate-slide-up"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <span className="font-mono text-xs text-primary uppercase whitespace-nowrap">
                  {STAGE_LABELS[event.stage]}
                </span>
                <span className="text-muted-foreground">{event.choiceText}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Flags (if any interesting ones) */}
        {state.flags.length > 0 && (
          <div className="mb-8">
            <h3 className="font-mono text-xs uppercase tracking-wider text-muted-foreground mb-3 text-center">
              Key Moments
            </h3>
            <div className="flex flex-wrap justify-center gap-2">
              {state.flags.slice(0, 5).map((flag) => (
                <span
                  key={flag}
                  className="px-2 py-1 text-xs font-mono bg-primary/10 text-primary border border-primary/30 rounded"
                >
                  {flag.replace(/-/g, ' ')}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button
            onClick={onReset}
            size="lg"
            className="bg-primary text-primary-foreground hover:bg-primary/90 font-mono uppercase tracking-wider"
          >
            <RotateCcw className="w-4 h-4 mr-2" />
            Play Again
          </Button>
          <Button
            onClick={handleShare}
            size="lg"
            variant="outline"
            className="border-primary/30 text-primary hover:bg-primary/10 font-mono uppercase tracking-wider"
          >
            {copied ? (
              <>
                <Check className="w-4 h-4 mr-2" />
                Copied!
              </>
            ) : (
              <>
                <Share2 className="w-4 h-4 mr-2" />
                Share Result
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Footer */}
      <div className="absolute bottom-6 text-center">
        <p className="font-mono text-xs text-muted-foreground/50">
          Thanks for playing · No perfect paths, only tradeoffs
        </p>
      </div>
    </div>
  );
}
