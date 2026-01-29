import { cn } from '@/lib/utils';
import { InboxMessage, MessageType } from '@/types/game';
import { User, Briefcase, Newspaper, MessageCircle, Heart, Users } from 'lucide-react';

interface InboxCardProps {
  message: InboxMessage;
  index: number;
}

const typeIcons: Record<MessageType, typeof User> = {
  coach: User,
  agent: Briefcase,
  media: Newspaper,
  social: MessageCircle,
  family: Heart,
  teammate: Users,
};

const typeColors: Record<MessageType, string> = {
  coach: 'text-terminal-cyan border-terminal-cyan/30',
  agent: 'text-accent border-accent/30',
  media: 'text-stat-hype border-stat-hype/30',
  social: 'text-terminal-green border-terminal-green/30',
  family: 'text-stat-fit border-stat-fit/30',
  teammate: 'text-stat-reputation border-stat-reputation/30',
};

const tierBadges: Record<string, string> = {
  power5: 'bg-accent/20 text-accent border-accent/50',
  group5: 'bg-terminal-cyan/20 text-terminal-cyan border-terminal-cyan/50',
  fcs: 'bg-muted text-muted-foreground border-muted-foreground/30',
};

export function InboxCard({ message, index }: InboxCardProps) {
  const Icon = typeIcons[message.type];

  return (
    <div
      className={cn(
        'inbox-card rounded-lg p-3 animate-slide-up',
        typeColors[message.type]
      )}
      style={{ animationDelay: `${index * 100}ms` }}
      role="article"
      aria-label={`Message from ${message.sender}`}
    >
      <div className="flex items-start gap-3">
        <div className={cn('p-2 rounded-lg bg-background/50', typeColors[message.type])}>
          <Icon className="w-4 h-4" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-medium text-sm text-foreground truncate">
              {message.sender}
            </span>
            {message.tier && (
              <span
                className={cn(
                  'px-1.5 py-0.5 text-[10px] font-mono uppercase rounded border',
                  tierBadges[message.tier]
                )}
              >
                {message.tier}
              </span>
            )}
          </div>
          <p className="text-xs text-muted-foreground mt-0.5 font-medium">
            {message.subject}
          </p>
          <p className="text-xs text-muted-foreground/70 mt-1 line-clamp-2">
            {message.preview}
          </p>
        </div>
      </div>
    </div>
  );
}
