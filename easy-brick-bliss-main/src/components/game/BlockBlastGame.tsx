import { useState, useEffect } from 'react';
import { Position } from '@/lib/gameTypes';
import { useGameState } from '@/hooks/useGameState';
import { useSound } from '@/hooks/useSound';
import { GameHeader } from './GameHeader';
import { GameBoard } from './GameBoard';
import { PieceTray } from './PieceTray';
import { GameControls } from './GameControls';
import { GameOverModal } from './GameOverModal';
import { HowToPlayModal } from './HowToPlayModal';

export function BlockBlastGame() {
  const {
    gameState,
    hintPosition,
    clearingCells,
    lastPlacedCells,
    selectPiece,
    tryPlacePiece,
    showHint,
    shuffle,
    newGame,
  } = useGameState();
  
  const {
    soundEnabled,
    toggleSound,
    playPlace,
    playClear,
    playClick,
    playGameOver,
  } = useSound();
  
  const [hoverPosition, setHoverPosition] = useState<Position | null>(null);
  const [showHelp, setShowHelp] = useState(false);
  const [prevScore, setPrevScore] = useState(gameState.score);
  const [wasGameOver, setWasGameOver] = useState(false);
  
  // Sound effects
  useEffect(() => {
    if (gameState.score > prevScore) {
      if (clearingCells.length > 0) {
        playClear();
      } else {
        playPlace();
      }
    }
    setPrevScore(gameState.score);
  }, [gameState.score, prevScore, clearingCells.length, playPlace, playClear]);
  
  useEffect(() => {
    if (gameState.isGameOver && !wasGameOver) {
      playGameOver();
    }
    setWasGameOver(gameState.isGameOver);
  }, [gameState.isGameOver, wasGameOver, playGameOver]);
  
  const handleCellClick = (position: Position) => {
    if (gameState.selectedPieceIndex !== null) {
      tryPlacePiece(position);
    }
  };
  
  const handleSelectPiece = (index: number) => {
    playClick();
    selectPiece(gameState.selectedPieceIndex === index ? null : index);
  };
  
  const handleHint = () => {
    playClick();
    showHint();
  };
  
  const handleShuffle = () => {
    playClick();
    shuffle();
  };
  
  const handleNewGame = () => {
    playClick();
    newGame();
  };
  
  const selectedPiece = gameState.selectedPieceIndex !== null
    ? gameState.pieces[gameState.selectedPieceIndex]
    : null;
  
  const isNewBest = gameState.score >= gameState.bestScore && gameState.score > 0;

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <div className="flex-1 flex flex-col items-center justify-center p-4 gap-4 sm:gap-6">
        {/* Title */}
        <h1 className="text-2xl sm:text-3xl font-bold text-foreground tracking-tight">
          Block Blast
        </h1>
        
        {/* Header with score and controls */}
        <div className="w-full max-w-sm">
          <GameHeader
            score={gameState.score}
            bestScore={gameState.bestScore}
            soundEnabled={soundEnabled}
            onToggleSound={toggleSound}
            onNewGame={handleNewGame}
            onShowHelp={() => setShowHelp(true)}
          />
        </div>
        
        {/* Game Board */}
        <GameBoard
          board={gameState.board}
          selectedPiece={selectedPiece}
          hintPosition={hintPosition ? hintPosition : null}
          clearingCells={clearingCells}
          lastPlacedCells={lastPlacedCells}
          onCellClick={handleCellClick}
          hoverPosition={hoverPosition}
          onHover={setHoverPosition}
        />
        
        {/* Piece Tray */}
        <div className="space-y-4">
          <PieceTray
            pieces={gameState.pieces}
            selectedIndex={gameState.selectedPieceIndex}
            onSelect={handleSelectPiece}
          />
          
          {/* Controls */}
          <GameControls
            shufflesLeft={gameState.shufflesLeft}
            onHint={handleHint}
            onShuffle={handleShuffle}
          />
        </div>
        
        {/* Instructions hint */}
        <p className="text-sm text-muted-foreground text-center">
          Tap a piece, then tap the grid to place it
        </p>
      </div>
      
      {/* Modals */}
      <GameOverModal
        open={gameState.isGameOver}
        score={gameState.score}
        bestScore={gameState.bestScore}
        isNewBest={isNewBest}
        onNewGame={handleNewGame}
      />
      
      <HowToPlayModal
        open={showHelp}
        onClose={() => setShowHelp(false)}
      />
    </div>
  );
}
