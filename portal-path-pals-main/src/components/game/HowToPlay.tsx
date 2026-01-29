import { Button } from '@/components/ui/button';
import { ArrowLeft, Clock, TrendingUp, Zap, AlertTriangle } from 'lucide-react';

interface HowToPlayProps {
  onBack: () => void;
}

export function HowToPlay({ onBack }: HowToPlayProps) {
  return (
    <div className="min-h-screen flex flex-col p-6 max-w-2xl mx-auto animate-fade-in">
      <Button
        onClick={onBack}
        variant="ghost"
        className="self-start mb-6 text-muted-foreground hover:text-primary"
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back
      </Button>

      <h1 className="font-mono text-3xl font-bold text-primary text-glow mb-8">
        How It Works
      </h1>

      <div className="space-y-8">
        {/* The Day */}
        <section className="terminal-border rounded-lg p-6 bg-card/50">
          <div className="flex items-start gap-4">
            <Clock className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
            <div>
              <h2 className="font-mono text-lg font-bold text-foreground mb-2">
                One Day, Four Stages
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                You have 24 hours in the transfer portal. The day is divided into
                four stages: <strong className="text-primary">Morning</strong>,{' '}
                <strong className="text-primary">Midday</strong>,{' '}
                <strong className="text-primary">Afternoon</strong>, and{' '}
                <strong className="text-primary">Night</strong>. Each stage presents
                a unique scenario with messages from coaches, agents, media, and more.
              </p>
            </div>
          </div>
        </section>

        {/* Stats */}
        <section className="terminal-border rounded-lg p-6 bg-card/50">
          <div className="flex items-start gap-4">
            <TrendingUp className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
            <div>
              <h2 className="font-mono text-lg font-bold text-foreground mb-2">
                Your Stats
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                Five stats track your journey. Every choice affects them:
              </p>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-stat-stress" />
                  <strong className="text-foreground">Stress</strong>
                  <span className="text-muted-foreground">— The mental toll of the process</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-stat-hype" />
                  <strong className="text-foreground">Hype</strong>
                  <span className="text-muted-foreground">— Your buzz and visibility</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-stat-fit" />
                  <strong className="text-foreground">Fit</strong>
                  <span className="text-muted-foreground">— How good your potential landing spot is</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-stat-reputation" />
                  <strong className="text-foreground">Reputation</strong>
                  <span className="text-muted-foreground">— What coaches and media think of you</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-stat-energy" />
                  <strong className="text-foreground">Energy</strong>
                  <span className="text-muted-foreground">— Your physical and mental reserves</span>
                </li>
              </ul>
            </div>
          </div>
        </section>

        {/* Choices */}
        <section className="terminal-border rounded-lg p-6 bg-card/50">
          <div className="flex items-start gap-4">
            <Zap className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
            <div>
              <h2 className="font-mono text-lg font-bold text-foreground mb-2">
                Making Choices
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                Each stage offers 2-4 choices. Hover over a choice to see its
                effects on your stats. Some choices unlock (or lock) later options.
                There's no save-scumming—commit and live with the consequences.
              </p>
            </div>
          </div>
        </section>

        {/* No Perfect Path */}
        <section className="terminal-border rounded-lg p-6 bg-card/50 border-accent/30">
          <div className="flex items-start gap-4">
            <AlertTriangle className="w-6 h-6 text-accent flex-shrink-0 mt-1" />
            <div>
              <h2 className="font-mono text-lg font-bold text-accent mb-2">
                No Perfect Path
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                This game isn't about winning. It's about navigating a complex
                situation with no clear right answers. Every choice involves
                tradeoffs. High hype might mean high stress. Loyalty might cost
                you opportunities. The ending you get reflects the path you
                walked—not a score.
              </p>
            </div>
          </div>
        </section>

        {/* Tips */}
        <section className="space-y-3">
          <h3 className="font-mono text-sm uppercase tracking-wider text-muted-foreground">
            Pro Tips
          </h3>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li>• Your progress is saved automatically. Refresh won't lose your run.</li>
            <li>• Watch for rare events—they can change everything.</li>
            <li>• Keyboard navigation: Tab to move between choices, Enter to select.</li>
            <li>• There are 12+ unique endings based on your stats and key decisions.</li>
            <li>• Replays differ—scenes are randomized each playthrough.</li>
          </ul>
        </section>
      </div>

      <div className="mt-8 pt-6 border-t border-border">
        <Button
          onClick={onBack}
          className="bg-primary text-primary-foreground hover:bg-primary/90"
        >
          Got It
        </Button>
      </div>
    </div>
  );
}
