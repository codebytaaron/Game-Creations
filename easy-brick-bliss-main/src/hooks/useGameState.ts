import { useState, useCallback, useEffect } from 'react';
import {
  GameState,
  Cell,
  Piece,
  Position,
  BOARD_SIZE,
} from '@/lib/gameTypes';
import {
  createEmptyBoard,
  generatePiecesWithPlaceable,
  canPlacePiece,
  placePiece,
  findLinesToClear,
  clearLines,
  calculateScore,
  canAnyPieceBePlaced,
  getHint,
} from '@/lib/gameLogic';

const BEST_SCORE_KEY = 'blockblast_best_score';

export function useGameState() {
  const [gameState, setGameState] = useState<GameState>(() => {
    const bestScore = parseInt(localStorage.getItem(BEST_SCORE_KEY) || '0', 10);
    const board = createEmptyBoard();
    return {
      board,
      pieces: generatePiecesWithPlaceable(board),
      score: 0,
      bestScore,
      isGameOver: false,
      shufflesLeft: 1,
      selectedPieceIndex: null,
    };
  });
  
  const [hintPosition, setHintPosition] = useState<{ pieceIndex: number; position: Position } | null>(null);
  const [clearingCells, setClearingCells] = useState<Position[]>([]);
  const [lastPlacedCells, setLastPlacedCells] = useState<Position[]>([]);

  // Save best score
  useEffect(() => {
    if (gameState.score > gameState.bestScore) {
      setGameState(prev => ({ ...prev, bestScore: gameState.score }));
      localStorage.setItem(BEST_SCORE_KEY, gameState.score.toString());
    }
  }, [gameState.score, gameState.bestScore]);

  // Check game over after pieces change
  useEffect(() => {
    const unusedPieces = gameState.pieces.filter(p => !p.used);
    if (unusedPieces.length > 0 && !canAnyPieceBePlaced(gameState.board, unusedPieces)) {
      setGameState(prev => ({ ...prev, isGameOver: true }));
    }
  }, [gameState.pieces, gameState.board]);

  const selectPiece = useCallback((index: number | null) => {
    setGameState(prev => ({ ...prev, selectedPieceIndex: index }));
    setHintPosition(null);
  }, []);

  const tryPlacePiece = useCallback((position: Position) => {
    setGameState(prev => {
      if (prev.selectedPieceIndex === null) return prev;
      
      const piece = prev.pieces[prev.selectedPieceIndex];
      if (piece.used || !canPlacePiece(prev.board, piece, position)) {
        return prev;
      }
      
      // Place the piece
      const { newBoard, squaresPlaced } = placePiece(prev.board, piece, position);
      
      // Track placed cells for animation
      const placedCells: Position[] = [];
      for (let r = 0; r < piece.shape.length; r++) {
        for (let c = 0; c < piece.shape[r].length; c++) {
          if (piece.shape[r][c]) {
            placedCells.push({ row: position.row + r, col: position.col + c });
          }
        }
      }
      setLastPlacedCells(placedCells);
      
      // Find lines to clear
      const { rows, cols } = findLinesToClear(newBoard);
      const linesCleared = rows.length + cols.length;
      
      // Mark cells for clearing animation
      if (linesCleared > 0) {
        const cellsToAnimate: Position[] = [];
        for (const r of rows) {
          for (let c = 0; c < BOARD_SIZE; c++) {
            cellsToAnimate.push({ row: r, col: c });
          }
        }
        for (const c of cols) {
          for (let r = 0; r < BOARD_SIZE; r++) {
            if (!rows.includes(r)) { // Avoid duplicates
              cellsToAnimate.push({ row: r, col: c });
            }
          }
        }
        setClearingCells(cellsToAnimate);
        
        // Clear after animation
        setTimeout(() => {
          setGameState(current => ({
            ...current,
            board: clearLines(current.board, rows, cols),
          }));
          setClearingCells([]);
        }, 300);
      }
      
      // Calculate score
      const points = calculateScore(squaresPlaced, linesCleared);
      
      // Mark piece as used
      const newPieces = prev.pieces.map((p, i) =>
        i === prev.selectedPieceIndex ? { ...p, used: true } : p
      );
      
      // Check if all pieces are used
      const allUsed = newPieces.every(p => p.used);
      
      return {
        ...prev,
        board: newBoard,
        pieces: allUsed ? generatePiecesWithPlaceable(newBoard) : newPieces,
        score: prev.score + points,
        selectedPieceIndex: null,
      };
    });
    
    setHintPosition(null);
    
    // Clear last placed animation
    setTimeout(() => setLastPlacedCells([]), 300);
  }, []);

  const showHint = useCallback(() => {
    const hint = getHint(gameState.board, gameState.pieces);
    if (hint) {
      setHintPosition(hint);
      setGameState(prev => ({ ...prev, selectedPieceIndex: hint.pieceIndex }));
    }
  }, [gameState.board, gameState.pieces]);

  const shuffle = useCallback(() => {
    if (gameState.shufflesLeft <= 0) return;
    
    setGameState(prev => ({
      ...prev,
      pieces: generatePiecesWithPlaceable(prev.board),
      shufflesLeft: prev.shufflesLeft - 1,
      selectedPieceIndex: null,
    }));
    setHintPosition(null);
  }, [gameState.shufflesLeft]);

  const newGame = useCallback(() => {
    const board = createEmptyBoard();
    setGameState(prev => ({
      board,
      pieces: generatePiecesWithPlaceable(board),
      score: 0,
      bestScore: prev.bestScore,
      isGameOver: false,
      shufflesLeft: 1,
      selectedPieceIndex: null,
    }));
    setHintPosition(null);
    setClearingCells([]);
    setLastPlacedCells([]);
  }, []);

  return {
    gameState,
    hintPosition,
    clearingCells,
    lastPlacedCells,
    selectPiece,
    tryPlacePiece,
    showHint,
    shuffle,
    newGame,
  };
}
