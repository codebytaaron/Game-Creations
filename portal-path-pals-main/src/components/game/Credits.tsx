import { Button } from '@/components/ui/button';
import { ArrowLeft, Heart } from 'lucide-react';

interface CreditsProps {
  onBack: () => void;
}

export function Credits({ onBack }: CreditsProps) {
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
        Credits
      </h1>

      <div className="space-y-8">
        <section className="terminal-border rounded-lg p-6 bg-card/50">
          <h2 className="font-mono text-lg font-bold text-foreground mb-4">
            About The Portal Game
          </h2>
          <p className="text-muted-foreground leading-relaxed mb-4">
            The Portal Game is an interactive narrative experience that explores
            the modern reality of college football's transfer portal. Through
            simulated choices and consequences, players experience the pressures,
            opportunities, and tradeoffs that student-athletes face during one
            of the most consequential days of their careers.
          </p>
          <p className="text-muted-foreground leading-relaxed">
            This game is a work of fiction. All characters, schools, and
            scenarios are imaginary, though inspired by the real dynamics
            of college athletics.
          </p>
        </section>

        <section className="terminal-border rounded-lg p-6 bg-card/50">
          <h2 className="font-mono text-lg font-bold text-foreground mb-4">
            Design Philosophy
          </h2>
          <p className="text-muted-foreground leading-relaxed">
            We believe games can illuminate complex systems without simplifying
            them. The Portal Game intentionally avoids "correct" answers because
            real life doesn't have them. Every path leads somewhere meaningful—
            or meaningfully difficult.
          </p>
        </section>

        <section className="terminal-border rounded-lg p-6 bg-card/50">
          <h2 className="font-mono text-lg font-bold text-foreground mb-4">
            Tech Stack
          </h2>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li>• Built with React + TypeScript</li>
            <li>• Styled with Tailwind CSS</li>
            <li>• State persisted in localStorage</li>
            <li>• No accounts, no tracking, no nonsense</li>
          </ul>
        </section>

        <section className="text-center py-8">
          <div className="inline-flex items-center gap-2 text-muted-foreground">
            <span>Made with</span>
            <Heart className="w-4 h-4 text-destructive fill-destructive" />
            <span>for the game</span>
          </div>
        </section>
      </div>

      <div className="mt-8 pt-6 border-t border-border">
        <Button
          onClick={onBack}
          className="bg-primary text-primary-foreground hover:bg-primary/90"
        >
          Back to Start
        </Button>
      </div>
    </div>
  );
}
