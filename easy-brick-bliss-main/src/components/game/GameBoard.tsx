import { Cell, Position, Piece, BOARD_SIZE } from '@/lib/gameTypes';
import { canPlacePiece } from '@/lib/gameLogic';
import { cn } from '@/lib/utils';

interface GameBoardProps {
  board: Cell[][];
  selectedPiece: Piece | null;
  hintPosition: { pieceIndex: number; position: Position } | null;
  clearingCells: Position[];
  lastPlacedCells: Position[];
  onCellClick: (position: Position) => void;
  hoverPosition: Position | null;
  onHover: (position: Position | null) => void;
}

const colorClasses: Record<string, string> = {
  teal: 'block-teal',
  coral: 'block-coral',
  amber: 'block-amber',
  violet: 'block-violet',
  lime: 'block-lime',
  sky: 'block-sky',
};

export function GameBoard({
  board,
  selectedPiece,
  hintPosition,
  clearingCells,
  lastPlacedCells,
  onCellClick,
  hoverPosition,
  onHover,
}: GameBoardProps) {
  // Calculate ghost preview positions
  const getGhostPositions = (): { positions: Position[]; valid: boolean } => {
    if (!selectedPiece || !hoverPosition) {
      return { positions: [], valid: false };
    }
    
    const positions: Position[] = [];
    const { shape } = selectedPiece;
    
    for (let r = 0; r < shape.length; r++) {
      for (let c = 0; c < shape[r].length; c++) {
        if (shape[r][c]) {
          positions.push({
            row: hoverPosition.row + r,
            col: hoverPosition.col + c,
          });
        }
      }
    }
    
    const valid = canPlacePiece(board, selectedPiece, hoverPosition);
    return { positions, valid };
  };
  
  const ghost = getGhostPositions();
  
  const isClearing = (row: number, col: number) =>
    clearingCells.some(c => c.row === row && c.col === col);
  
  const isLastPlaced = (row: number, col: number) =>
    lastPlacedCells.some(c => c.row === row && c.col === col);
  
  const isGhost = (row: number, col: number) =>
    ghost.positions.some(p => p.row === row && p.col === col);
  
  const isHint = (row: number, col: number) => {
    if (!hintPosition || !selectedPiece) return false;
    const { shape } = selectedPiece;
    for (let r = 0; r < shape.length; r++) {
      for (let c = 0; c < shape[r].length; c++) {
        if (shape[r][c] && hintPosition.position.row + r === row && hintPosition.position.col + c === col) {
          return true;
        }
      }
    }
    return false;
  };

  return (
    <div className="bg-grid-bg p-2 sm:p-3 rounded-xl shadow-soft">
      <div
        className="grid gap-1"
        style={{
          gridTemplateColumns: `repeat(${BOARD_SIZE}, 1fr)`,
        }}
      >
        {board.map((row, rowIndex) =>
          row.map((cell, colIndex) => {
            const clearing = isClearing(rowIndex, colIndex);
            const placed = isLastPlaced(rowIndex, colIndex);
            const ghostCell = isGhost(rowIndex, colIndex);
            const hintCell = isHint(rowIndex, colIndex);
            
            return (
              <button
                key={`${rowIndex}-${colIndex}`}
                className={cn(
                  'aspect-square rounded-md transition-all duration-150',
                  'w-8 h-8 sm:w-10 sm:h-10 md:w-11 md:h-11',
                  cell.filled && cell.color
                    ? colorClasses[cell.color]
                    : 'bg-grid-cell',
                  !cell.filled && selectedPiece && 'hover:bg-grid-hover cursor-pointer',
                  clearing && 'animate-clear',
                  placed && !clearing && 'animate-pop',
                  ghostCell && !cell.filled && (ghost.valid ? 'bg-ghost-valid/50' : 'bg-ghost-invalid/50'),
                  hintCell && !cell.filled && 'ring-2 ring-primary ring-offset-2 ring-offset-grid-bg animate-pulse'
                )}
                onClick={() => onCellClick({ row: rowIndex, col: colIndex })}
                onMouseEnter={() => onHover({ row: rowIndex, col: colIndex })}
                onMouseLeave={() => onHover(null)}
                disabled={!selectedPiece}
              />
            );
          })
        )}
      </div>
    </div>
  );
}
