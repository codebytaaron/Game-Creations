import { useGameState } from '@/hooks/useGameState';
import { StartScreen } from '@/components/game/StartScreen';
import { CharacterSetup } from '@/components/game/CharacterSetup';
import { HowToPlay } from '@/components/game/HowToPlay';
import { Credits } from '@/components/game/Credits';
import { GameBoard } from '@/components/game/GameBoard';
import { EndScreen } from '@/components/game/EndScreen';

const Index = () => {
  const {
    state,
    setScreen,
    setCharacter,
    setSoundEnabled,
    startGame,
    applyChoice,
    resetGame,
    generateShareText,
  } = useGameState();

  const handleCharacterComplete = (character: Parameters<typeof setCharacter>[0]) => {
    setCharacter(character);
    startGame();
  };

  return (
    <div className="min-h-screen bg-background text-foreground scanline">
      {state.screen === 'start' && (
        <StartScreen
          onStart={() => setScreen('setup')}
          onHowTo={() => setScreen('howto')}
          onCredits={() => setScreen('credits')}
          soundEnabled={state.soundEnabled}
          onToggleSound={() => setSoundEnabled(!state.soundEnabled)}
        />
      )}

      {state.screen === 'setup' && (
        <CharacterSetup
          onComplete={handleCharacterComplete}
          onBack={() => setScreen('start')}
        />
      )}

      {state.screen === 'howto' && (
        <HowToPlay onBack={() => setScreen('start')} />
      )}

      {state.screen === 'credits' && (
        <Credits onBack={() => setScreen('start')} />
      )}

      {state.screen === 'game' && (
        <GameBoard
          state={state}
          onChoice={applyChoice}
          onReset={resetGame}
          soundEnabled={state.soundEnabled}
          onToggleSound={() => setSoundEnabled(!state.soundEnabled)}
        />
      )}

      {state.screen === 'end' && (
        <EndScreen
          state={state}
          onReset={resetGame}
          onShare={generateShareText}
        />
      )}
    </div>
  );
};

export default Index;
