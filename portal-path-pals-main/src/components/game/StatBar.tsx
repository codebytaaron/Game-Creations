import { cn } from '@/lib/utils';

interface StatBarProps {
  label: string;
  value: number;
  color: 'stress' | 'hype' | 'fit' | 'reputation' | 'energy';
  compact?: boolean;
}

const colorMap = {
  stress: 'bg-stat-stress',
  hype: 'bg-stat-hype',
  fit: 'bg-stat-fit',
  reputation: 'bg-stat-reputation',
  energy: 'bg-stat-energy',
};

const glowMap = {
  stress: 'shadow-[0_0_10px_hsl(var(--stat-stress)/0.5)]',
  hype: 'shadow-[0_0_10px_hsl(var(--stat-hype)/0.5)]',
  fit: 'shadow-[0_0_10px_hsl(var(--stat-fit)/0.5)]',
  reputation: 'shadow-[0_0_10px_hsl(var(--stat-reputation)/0.5)]',
  energy: 'shadow-[0_0_10px_hsl(var(--stat-energy)/0.5)]',
};

export function StatBar({ label, value, color, compact = false }: StatBarProps) {
  return (
    <div className={cn('space-y-1', compact ? 'space-y-0.5' : '')}>
      <div className="flex justify-between items-center">
        <span
          className={cn(
            'font-mono text-muted-foreground uppercase tracking-wider',
            compact ? 'text-[10px]' : 'text-xs'
          )}
        >
          {label}
        </span>
        <span
          className={cn(
            'font-mono font-bold',
            compact ? 'text-xs' : 'text-sm',
            value >= 70 && 'text-success',
            value >= 40 && value < 70 && 'text-warning',
            value < 40 && 'text-destructive'
          )}
        >
          {value}
        </span>
      </div>
      <div
        className={cn(
          'bg-secondary/50 rounded-full overflow-hidden',
          compact ? 'h-1.5' : 'h-2'
        )}
      >
        <div
          className={cn(
            'h-full rounded-full transition-all duration-500 ease-out',
            colorMap[color],
            glowMap[color]
          )}
          style={{ width: `${value}%` }}
        />
      </div>
    </div>
  );
}
