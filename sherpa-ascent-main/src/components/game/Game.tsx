import React, { useEffect } from 'react';
import { useGameEngine } from '@/hooks/useGameEngine';
import { useGameInput } from '@/hooks/useGameInput';
import { useIsMobile } from '@/hooks/use-mobile';
import { GAME_WIDTH, GAME_HEIGHT } from '@/lib/gameUtils';
import { Background } from './Background';
import { Sherpa } from './Sherpa';
import { Platform } from './Platform';
import { PowerUpItem } from './PowerUp';
import { Obstacle } from './Obstacle';
import { Collectible } from './Collectible';
import { GameHUD } from './GameHUD';
import { MobileControls } from './MobileControls';
import { StartScreen } from './StartScreen';
import { GameOverScreen } from './GameOverScreen';

export const Game: React.FC = () => {
  const { gameState, startGame, updateInput } = useGameEngine();
  const { input, setMobileInput } = useGameInput();
  const isMobile = useIsMobile();
  
  // Update game engine with current input
  useEffect(() => {
    updateInput(input);
  }, [input, updateInput]);
  
  const { status, score, highScore, scrollY, player, platforms, powerUps, obstacles, collectibles } = gameState;
  
  return (
    <div className="relative w-full h-full flex items-center justify-center bg-foreground/10">
      {/* Game container */}
      <div 
        className="relative overflow-hidden rounded-2xl shadow-game"
        style={{
          width: Math.min(GAME_WIDTH, window.innerWidth - 32),
          height: Math.min(GAME_HEIGHT, window.innerHeight - 32),
          maxWidth: GAME_WIDTH,
          maxHeight: GAME_HEIGHT,
        }}
      >
        {/* Background */}
        <Background scrollY={scrollY} />
        
        {/* Game elements container */}
        <div className="absolute inset-0">
          {/* Platforms */}
          {platforms.map(platform => (
            <Platform key={platform.id} platform={platform} scrollY={scrollY} />
          ))}
          
          {/* Collectibles */}
          {collectibles.map(collectible => (
            <Collectible key={collectible.id} collectible={collectible} scrollY={scrollY} />
          ))}
          
          {/* Power-ups */}
          {powerUps.map(powerUp => (
            <PowerUpItem key={powerUp.id} powerUp={powerUp} scrollY={scrollY} />
          ))}
          
          {/* Obstacles */}
          {obstacles.map(obstacle => (
            <Obstacle key={obstacle.id} obstacle={obstacle} scrollY={scrollY} />
          ))}
          
          {/* Player */}
          {status === 'playing' && (
            <Sherpa player={player} scrollY={scrollY} />
          )}
        </div>
        
        {/* HUD */}
        {status === 'playing' && (
          <GameHUD 
            score={score} 
            highScore={highScore}
            activePowerUps={player.activePowerUps}
          />
        )}
        
        {/* Mobile controls */}
        {status === 'playing' && isMobile && (
          <MobileControls onInput={setMobileInput} />
        )}
        
        {/* Start screen */}
        {status === 'menu' && (
          <StartScreen highScore={highScore} onStart={startGame} />
        )}
        
        {/* Game over screen */}
        {status === 'gameover' && (
          <GameOverScreen
            score={score}
            highScore={highScore}
            isNewHighScore={score >= highScore && score > 0}
            onRestart={startGame}
          />
        )}
      </div>
      
      {/* Desktop controls hint */}
      {status === 'playing' && !isMobile && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-card/80 backdrop-blur-sm rounded-lg px-4 py-2 text-sm text-muted-foreground">
          <span className="font-mono">← →</span> or <span className="font-mono">A D</span> to move • <span className="font-mono">SPACE</span> to jump
        </div>
      )}
    </div>
  );
};
