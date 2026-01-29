import { Task } from '@/types/game';
import { TASK_CONFIG } from '@/config/levels';
import { useEffect, useState } from 'react';

interface TaskPanelProps {
  tasks: Task[];
  onSelectTask: (task: Task) => void;
}

export function TaskPanel({ tasks, onSelectTask }: TaskPanelProps) {
  return (
    <div className="absolute bottom-4 left-4 right-4 z-20">
      <div className="flex gap-3 justify-center flex-wrap">
        {tasks.map((task) => (
          <TaskButton key={task.id} task={task} onSelect={() => onSelectTask(task)} />
        ))}
        {tasks.length === 0 && (
          <div className="hud-panel px-6 py-3 text-muted-foreground text-sm">
            Waiting for tasks...
          </div>
        )}
      </div>
    </div>
  );
}

interface TaskButtonProps {
  task: Task;
  onSelect: () => void;
}

function TaskButton({ task, onSelect }: TaskButtonProps) {
  const config = TASK_CONFIG[task.type];
  const [timeLeft, setTimeLeft] = useState(100);

  useEffect(() => {
    const interval = setInterval(() => {
      const elapsed = Date.now() - task.startTime;
      const remaining = Math.max(0, 100 - (elapsed / task.timeLimit) * 100);
      setTimeLeft(remaining);
    }, 50);

    return () => clearInterval(interval);
  }, [task.startTime, task.timeLimit]);

  const isUrgent = timeLeft < 30;
  const colorClass = {
    cyan: 'border-neon-cyan hover:shadow-neon-cyan',
    magenta: 'border-neon-magenta hover:shadow-neon-magenta',
    lime: 'border-neon-lime hover:shadow-neon-lime',
    orange: 'border-neon-orange hover:shadow-neon-orange',
  }[config.color];

  return (
    <button
      onClick={onSelect}
      className={`
        task-button ${isUrgent ? 'active animate-shake' : ''} ${colorClass}
        min-w-[140px] relative overflow-hidden
      `}
    >
      {/* Progress bar background */}
      <div 
        className="absolute inset-0 opacity-20 transition-all duration-100"
        style={{
          background: `linear-gradient(90deg, hsl(var(--neon-${config.color})) ${timeLeft}%, transparent ${timeLeft}%)`,
        }}
      />
      
      <div className="relative flex items-center gap-2">
        <span className="text-2xl">{config.icon}</span>
        <div className="text-left">
          <div className={`font-bold text-sm ${isUrgent ? 'neon-text-orange' : ''}`}>
            {config.name}
          </div>
          <div className="text-xs text-muted-foreground">
            +{config.basePoints} pts
          </div>
        </div>
      </div>
    </button>
  );
}
