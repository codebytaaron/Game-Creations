import { MiniGameType, Task } from '@/types/game';
import { DJMiniGame } from './minigames/DJMiniGame';
import { LightsMiniGame } from './minigames/LightsMiniGame';
import { IDCheckMiniGame } from './minigames/IDCheckMiniGame';
import { DrinksMiniGame } from './minigames/DrinksMiniGame';
import { TASK_CONFIG } from '@/config/levels';

interface MiniGameWrapperProps {
  task: Task;
  level: number;
  onComplete: (success: boolean) => void;
}

export function MiniGameWrapper({ task, level, onComplete }: MiniGameWrapperProps) {
  const config = TASK_CONFIG[task.type];
  const difficulty = level;
  const timeLimit = config.timeLimit / 1000;

  const handleComplete = (success: boolean) => {
    // Small delay for feedback before closing
    setTimeout(() => {
      onComplete(success);
    }, success ? 200 : 400);
  };

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-background/80 backdrop-blur-sm">
      {task.type === 'dj' && (
        <DJMiniGame
          onComplete={handleComplete}
          timeLimit={timeLimit}
          difficulty={difficulty}
        />
      )}
      {task.type === 'lights' && (
        <LightsMiniGame
          onComplete={handleComplete}
          timeLimit={timeLimit}
          difficulty={difficulty}
        />
      )}
      {task.type === 'id-check' && (
        <IDCheckMiniGame
          onComplete={handleComplete}
          timeLimit={timeLimit}
          difficulty={difficulty}
        />
      )}
      {task.type === 'drinks' && (
        <DrinksMiniGame
          onComplete={handleComplete}
          timeLimit={timeLimit}
          difficulty={difficulty}
        />
      )}
    </div>
  );
}
