import { cn } from '@/lib/utils';
import { Stage, STAGES, STAGE_LABELS } from '@/types/game';
import { Sun, CloudSun, Sunset, Moon } from 'lucide-react';

interface TimelineProps {
  currentStage: Stage;
}

const stageIcons = {
  morning: Sun,
  midday: CloudSun,
  afternoon: Sunset,
  night: Moon,
};

export function Timeline({ currentStage }: TimelineProps) {
  const currentIndex = STAGES.indexOf(currentStage);

  return (
    <div className="flex items-center justify-between px-2">
      {STAGES.map((stage, index) => {
        const Icon = stageIcons[stage];
        const isPast = index < currentIndex;
        const isCurrent = index === currentIndex;
        const isFuture = index > currentIndex;

        return (
          <div key={stage} className="flex items-center">
            <div className="flex flex-col items-center">
              <div
                className={cn(
                  'w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300',
                  isPast && 'bg-primary/20 text-primary',
                  isCurrent && 'bg-primary text-primary-foreground box-glow animate-pulse-glow',
                  isFuture && 'bg-secondary text-muted-foreground'
                )}
              >
                <Icon className="w-5 h-5" />
              </div>
              <span
                className={cn(
                  'mt-2 font-mono text-xs uppercase tracking-wider',
                  isPast && 'text-primary/60',
                  isCurrent && 'text-primary text-glow',
                  isFuture && 'text-muted-foreground'
                )}
              >
                {STAGE_LABELS[stage]}
              </span>
            </div>
            {index < STAGES.length - 1 && (
              <div
                className={cn(
                  'w-12 h-0.5 mx-2 transition-all duration-300',
                  index < currentIndex ? 'bg-primary/50' : 'bg-secondary'
                )}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}
