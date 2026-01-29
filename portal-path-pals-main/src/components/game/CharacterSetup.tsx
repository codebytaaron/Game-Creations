import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import {
  Character,
  Position,
  PlayStyle,
  Priority,
  POSITION_LABELS,
  PLAY_STYLE_LABELS,
  PRIORITY_LABELS,
} from '@/types/game';
import { ArrowLeft, ArrowRight, User } from 'lucide-react';

interface CharacterSetupProps {
  onComplete: (character: Character) => void;
  onBack: () => void;
}

const positions: Position[] = ['QB', 'WR', 'DB', 'LB'];
const playStyles: PlayStyle[] = ['aggressive', 'balanced', 'calculated'];
const priorities: Priority[] = ['playing-time', 'nil', 'development'];

export function CharacterSetup({ onComplete, onBack }: CharacterSetupProps) {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [position, setPosition] = useState<Position | null>(null);
  const [playStyle, setPlayStyle] = useState<PlayStyle | null>(null);
  const [priority, setPriority] = useState<Priority | null>(null);

  const handleNext = () => {
    if (step === 1 && position) setStep(2);
    else if (step === 2 && playStyle) setStep(3);
    else if (step === 3 && priority && position && playStyle) {
      onComplete({ position, playStyle, priority });
    }
  };

  const handlePrev = () => {
    if (step === 1) onBack();
    else setStep((s) => (s - 1) as 1 | 2 | 3);
  };

  const canProceed =
    (step === 1 && position) ||
    (step === 2 && playStyle) ||
    (step === 3 && priority);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 animate-fade-in">
      {/* Progress */}
      <div className="w-full max-w-md mb-8">
        <div className="flex items-center justify-between mb-2">
          {[1, 2, 3].map((s) => (
            <div
              key={s}
              className={cn(
                'w-8 h-8 rounded-full flex items-center justify-center font-mono text-sm transition-all',
                s === step && 'bg-primary text-primary-foreground box-glow',
                s < step && 'bg-primary/30 text-primary',
                s > step && 'bg-secondary text-muted-foreground'
              )}
            >
              {s}
            </div>
          ))}
        </div>
        <div className="h-1 bg-secondary rounded-full overflow-hidden">
          <div
            className="h-full bg-primary transition-all duration-300"
            style={{ width: `${((step - 1) / 2) * 100}%` }}
          />
        </div>
      </div>

      {/* Content */}
      <div className="w-full max-w-md">
        {step === 1 && (
          <div className="space-y-6 animate-slide-up">
            <div className="text-center">
              <User className="w-12 h-12 mx-auto text-primary mb-4" />
              <h2 className="font-mono text-2xl font-bold text-foreground mb-2">
                Choose Your Position
              </h2>
              <p className="text-muted-foreground text-sm">
                Your position affects which coaches reach out and what they offer.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {positions.map((pos) => (
                <button
                  key={pos}
                  onClick={() => setPosition(pos)}
                  className={cn(
                    'p-4 rounded-lg border-2 transition-all text-center',
                    position === pos
                      ? 'border-primary bg-primary/10 text-primary'
                      : 'border-border bg-card hover:border-primary/50 text-foreground'
                  )}
                >
                  <span className="font-mono text-2xl font-bold block">{pos}</span>
                  <span className="text-xs text-muted-foreground">
                    {POSITION_LABELS[pos]}
                  </span>
                </button>
              ))}
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-6 animate-slide-up">
            <div className="text-center">
              <h2 className="font-mono text-2xl font-bold text-foreground mb-2">
                Your Play Style
              </h2>
              <p className="text-muted-foreground text-sm">
                How do you approach big decisions?
              </p>
            </div>
            <div className="space-y-3">
              {playStyles.map((style) => (
                <button
                  key={style}
                  onClick={() => setPlayStyle(style)}
                  className={cn(
                    'w-full p-4 rounded-lg border-2 transition-all text-left',
                    playStyle === style
                      ? 'border-primary bg-primary/10'
                      : 'border-border bg-card hover:border-primary/50'
                  )}
                >
                  <span className="font-medium text-foreground block">
                    {PLAY_STYLE_LABELS[style].label}
                  </span>
                  <span className="text-sm text-muted-foreground">
                    {PLAY_STYLE_LABELS[style].desc}
                  </span>
                </button>
              ))}
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-6 animate-slide-up">
            <div className="text-center">
              <h2 className="font-mono text-2xl font-bold text-foreground mb-2">
                Your Priority
              </h2>
              <p className="text-muted-foreground text-sm">
                What matters most in your next school?
              </p>
            </div>
            <div className="space-y-3">
              {priorities.map((p) => (
                <button
                  key={p}
                  onClick={() => setPriority(p)}
                  className={cn(
                    'w-full p-4 rounded-lg border-2 transition-all text-left',
                    priority === p
                      ? 'border-primary bg-primary/10'
                      : 'border-border bg-card hover:border-primary/50'
                  )}
                >
                  <span className="font-medium text-foreground block">
                    {PRIORITY_LABELS[p].label}
                  </span>
                  <span className="text-sm text-muted-foreground">
                    {PRIORITY_LABELS[p].desc}
                  </span>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Navigation */}
      <div className="flex gap-4 mt-8">
        <Button
          onClick={handlePrev}
          variant="outline"
          className="border-primary/30 text-primary hover:bg-primary/10"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>
        <Button
          onClick={handleNext}
          disabled={!canProceed}
          className="bg-primary text-primary-foreground hover:bg-primary/90"
        >
          {step === 3 ? 'Start Day' : 'Next'}
          <ArrowRight className="w-4 h-4 ml-2" />
        </Button>
      </div>
    </div>
  );
}
