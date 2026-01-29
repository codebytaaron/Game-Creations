import { useState } from 'react';
import { GameState, Choice } from '@/types/game';
import { Timeline } from './Timeline';
import { StatsPanel } from './StatsPanel';
import { SceneView } from './SceneView';
import { Button } from '@/components/ui/button';
import { RotateCcw, Volume2, VolumeX, ChevronDown, ChevronUp } from 'lucide-react';
import { cn } from '@/lib/utils';

interface GameBoardProps {
  state: GameState;
  onChoice: (choice: Choice) => void;
  onReset: () => void;
  soundEnabled: boolean;
  onToggleSound: () => void;
}

export function GameBoard({
  state,
  onChoice,
  onReset,
  soundEnabled,
  onToggleSound,
}: GameBoardProps) {
  const [showStats, setShowStats] = useState(false);

  if (!state.currentScene) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground">Loading scene...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col lg:flex-row">
      {/* Left Panel - Timeline & Stats (Desktop) */}
      <aside className="hidden lg:flex lg:flex-col lg:w-80 lg:border-r lg:border-border lg:bg-card/30 lg:p-6">
        <div className="mb-8">
          <Timeline currentStage={state.currentStage} />
        </div>
        
        <div className="flex-1">
          <h3 className="font-mono text-sm uppercase tracking-wider text-muted-foreground mb-4">
            Current Stats
          </h3>
          <StatsPanel stats={state.stats} />
        </div>

        <div className="pt-6 border-t border-border mt-6 flex items-center justify-between">
          <Button
            onClick={onReset}
            variant="ghost"
            size="sm"
            className="text-muted-foreground hover:text-destructive"
          >
            <RotateCcw className="w-4 h-4 mr-2" />
            Reset Run
          </Button>
          <button
            onClick={onToggleSound}
            className="p-2 text-muted-foreground hover:text-primary transition-colors"
            aria-label={soundEnabled ? 'Mute sounds' : 'Enable sounds'}
          >
            {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          </button>
        </div>
      </aside>

      {/* Mobile Header */}
      <div className="lg:hidden sticky top-0 z-10 bg-background/95 backdrop-blur border-b border-border p-4">
        <div className="mb-4">
          <Timeline currentStage={state.currentStage} />
        </div>
        
        {/* Collapsible Stats */}
        <button
          onClick={() => setShowStats(!showStats)}
          className="w-full flex items-center justify-between p-2 text-sm text-muted-foreground hover:text-primary"
        >
          <span className="font-mono uppercase tracking-wider">Stats</span>
          {showStats ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>
        <div
          className={cn(
            'overflow-hidden transition-all duration-300',
            showStats ? 'max-h-60 opacity-100' : 'max-h-0 opacity-0'
          )}
        >
          <div className="pt-2">
            <StatsPanel stats={state.stats} compact />
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="flex-1 p-4 md:p-6 lg:p-8 overflow-auto">
        <div className="max-w-2xl mx-auto">
          <SceneView
            scene={state.currentScene}
            stats={state.stats}
            onChoice={onChoice}
          />
        </div>
      </main>

      {/* Mobile Footer */}
      <div className="lg:hidden sticky bottom-0 bg-background/95 backdrop-blur border-t border-border p-4 flex items-center justify-between">
        <Button
          onClick={onReset}
          variant="ghost"
          size="sm"
          className="text-muted-foreground hover:text-destructive"
        >
          <RotateCcw className="w-4 h-4 mr-1" />
          Reset
        </Button>
        <button
          onClick={onToggleSound}
          className="p-2 text-muted-foreground hover:text-primary transition-colors"
        >
          {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
        </button>
      </div>
    </div>
  );
}
