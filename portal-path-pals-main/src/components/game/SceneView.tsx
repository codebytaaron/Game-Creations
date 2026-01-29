import { Scene, Choice, Stats } from '@/types/game';
import { InboxCard } from './InboxCard';
import { ChoiceButton } from './ChoiceButton';

interface SceneViewProps {
  scene: Scene;
  stats: Stats;
  onChoice: (choice: Choice) => void;
}

export function SceneView({ scene, stats, onChoice }: SceneViewProps) {
  const isChoiceAvailable = (choice: Choice): boolean => {
    if (!choice.requires) return true;
    
    const { stat, minValue, maxValue } = choice.requires;
    if (stat) {
      const value = stats[stat];
      if (minValue !== undefined && value < minValue) return false;
      if (maxValue !== undefined && value > maxValue) return false;
    }
    
    return true;
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Scene Title */}
      <div className="space-y-2">
        <h2 className="font-mono text-xl md:text-2xl font-bold text-primary text-glow">
          {scene.title}
        </h2>
        {scene.isRare && (
          <span className="inline-block px-2 py-1 text-xs font-mono uppercase bg-accent/20 text-accent border border-accent/50 rounded">
            ⚡ Rare Event
          </span>
        )}
      </div>

      {/* Narrative */}
      <div className="terminal-border rounded-lg p-4 md:p-6 bg-card/50">
        <p className="text-foreground/90 leading-relaxed whitespace-pre-line">
          {scene.narrative}
        </p>
      </div>

      {/* Inbox */}
      <div className="space-y-3">
        <h3 className="font-mono text-sm uppercase tracking-wider text-muted-foreground flex items-center gap-2">
          <span className="w-2 h-2 bg-primary rounded-full animate-pulse" />
          Inbox ({scene.messages.length})
        </h3>
        <div className="space-y-2">
          {scene.messages.map((message, index) => (
            <InboxCard key={message.id} message={message} index={index} />
          ))}
        </div>
      </div>

      {/* Choices */}
      <div className="space-y-3">
        <h3 className="font-mono text-sm uppercase tracking-wider text-muted-foreground">
          What do you do?
        </h3>
        <div className="space-y-2">
          {scene.choices.map((choice, index) => (
            <ChoiceButton
              key={choice.id}
              choice={choice}
              index={index}
              disabled={!isChoiceAvailable(choice)}
              onClick={() => onChoice(choice)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
