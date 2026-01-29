import { cn } from '@/lib/utils';
import { Choice } from '@/types/game';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';

interface ChoiceButtonProps {
  choice: Choice;
  onClick: () => void;
  disabled?: boolean;
  index: number;
}

export function ChoiceButton({ choice, onClick, disabled, index }: ChoiceButtonProps) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <button
          onClick={onClick}
          disabled={disabled}
          className={cn(
            'choice-button w-full text-left px-4 py-3 rounded-lg',
            'font-medium text-foreground',
            'focus:outline-none focus-visible:ring-2 focus-visible:ring-primary',
            'disabled:opacity-50 disabled:cursor-not-allowed',
            'animate-slide-up'
          )}
          style={{ animationDelay: `${300 + index * 100}ms` }}
          aria-label={`${choice.text}. ${choice.tooltip}`}
        >
          <span className="font-mono text-primary text-xs mr-2">[{index + 1}]</span>
          {choice.text}
        </button>
      </TooltipTrigger>
      <TooltipContent
        side="right"
        className="bg-card border-border text-sm font-mono"
      >
        {choice.tooltip}
      </TooltipContent>
    </Tooltip>
  );
}
