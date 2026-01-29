import { Piece } from '@/lib/gameTypes';
import { cn } from '@/lib/utils';

interface PieceTrayProps {
  pieces: Piece[];
  selectedIndex: number | null;
  onSelect: (index: number) => void;
}

const colorClasses: Record<string, string> = {
  teal: 'block-teal',
  coral: 'block-coral',
  amber: 'block-amber',
  violet: 'block-violet',
  lime: 'block-lime',
  sky: 'block-sky',
};

export function PieceTray({ pieces, selectedIndex, onSelect }: PieceTrayProps) {
  return (
    <div className="flex justify-center gap-3 sm:gap-4">
      {pieces.map((piece, index) => (
        <button
          key={piece.id}
          onClick={() => !piece.used && onSelect(index)}
          className={cn(
            'p-2 sm:p-3 rounded-xl transition-all duration-200',
            'bg-card shadow-piece',
            !piece.used && 'hover:scale-105 active:scale-95 cursor-pointer',
            piece.used && 'opacity-30 cursor-not-allowed',
            selectedIndex === index && !piece.used && 'ring-3 ring-primary scale-105'
          )}
          disabled={piece.used}
        >
          <div
            className="grid gap-0.5"
            style={{
              gridTemplateColumns: `repeat(${piece.shape[0].length}, 1fr)`,
            }}
          >
            {piece.shape.map((row, rowIndex) =>
              row.map((filled, colIndex) => (
                <div
                  key={`${rowIndex}-${colIndex}`}
                  className={cn(
                    'w-5 h-5 sm:w-6 sm:h-6 rounded-sm',
                    filled ? colorClasses[piece.color] : 'bg-transparent'
                  )}
                />
              ))
            )}
          </div>
        </button>
      ))}
    </div>
  );
}
