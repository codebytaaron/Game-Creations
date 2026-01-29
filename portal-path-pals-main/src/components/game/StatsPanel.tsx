import { Stats } from '@/types/game';
import { StatBar } from './StatBar';

interface StatsPanelProps {
  stats: Stats;
  compact?: boolean;
}

export function StatsPanel({ stats, compact = false }: StatsPanelProps) {
  return (
    <div className={compact ? 'space-y-2' : 'space-y-4'}>
      <StatBar label="Stress" value={stats.stress} color="stress" compact={compact} />
      <StatBar label="Hype" value={stats.hype} color="hype" compact={compact} />
      <StatBar label="Fit" value={stats.fit} color="fit" compact={compact} />
      <StatBar label="Reputation" value={stats.reputation} color="reputation" compact={compact} />
      <StatBar label="Energy" value={stats.energy} color="energy" compact={compact} />
    </div>
  );
}
