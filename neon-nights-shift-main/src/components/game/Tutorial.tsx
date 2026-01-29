import { useState } from 'react';

interface TutorialProps {
  onComplete: () => void;
}

const TUTORIAL_STEPS = [
  {
    title: 'Welcome to Tequila!',
    icon: '🎧',
    content: 'You\'re the manager of the hottest nightclub in town. Keep everything running smoothly to earn points and build combos!',
  },
  {
    title: 'Tasks Appear',
    icon: '📋',
    content: 'Tasks will pop up at the bottom of the screen. Each task has a time limit - complete them before they expire!',
  },
  {
    title: 'DJ Booth',
    icon: '🎧',
    content: 'Follow the arrow pattern using WASD or arrow keys. Hit them in order to keep the music pumping!',
  },
  {
    title: 'Fix Lights',
    icon: '💡',
    content: 'A Simon Says style game! Watch the pattern, then repeat it by pressing the numbered buttons.',
  },
  {
    title: 'ID Check',
    icon: '🪪',
    content: 'Find the matching pattern quickly! Look carefully and select the correct one from the options.',
  },
  {
    title: 'Restock Drinks',
    icon: '🥤',
    content: 'Fill orders in sequence! Select drinks in the correct order to complete the order.',
  },
  {
    title: 'Combos & Score',
    icon: '🔥',
    content: 'Complete tasks in a row to build your combo. Higher combos mean bigger score multipliers!',
  },
  {
    title: 'Ready to Play?',
    icon: '🌟',
    content: 'Good luck, manager! Remember: ESC to pause, and have fun keeping the party going!',
  },
];

export function Tutorial({ onComplete }: TutorialProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const step = TUTORIAL_STEPS[currentStep];
  const isLast = currentStep === TUTORIAL_STEPS.length - 1;

  const handleNext = () => {
    if (isLast) {
      onComplete();
    } else {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handlePrev = () => {
    setCurrentStep(prev => Math.max(0, prev - 1));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/95 backdrop-blur-sm animate-fade-in">
      <div className="minigame-container p-8 max-w-md w-full mx-4">
        {/* Progress dots */}
        <div className="flex justify-center gap-2 mb-6">
          {TUTORIAL_STEPS.map((_, idx) => (
            <div
              key={idx}
              className={`
                w-2 h-2 rounded-full transition-all
                ${idx === currentStep ? 'bg-neon-cyan w-6' : 'bg-muted'}
              `}
            />
          ))}
        </div>

        {/* Content */}
        <div className="text-center mb-8 animate-fade-in" key={currentStep}>
          <span className="text-5xl mb-4 block">{step.icon}</span>
          <h2 className="font-arcade text-xl neon-text-cyan mb-4">{step.title}</h2>
          <p className="text-foreground leading-relaxed">{step.content}</p>
        </div>

        {/* Navigation */}
        <div className="flex gap-4">
          {currentStep > 0 && (
            <button
              onClick={handlePrev}
              className="flex-1 py-3 px-6 rounded-lg border-2 border-muted text-muted-foreground
                       hover:border-primary hover:text-primary transition-colors"
            >
              ← PREV
            </button>
          )}
          
          <button
            onClick={handleNext}
            className={`flex-1 arcade-button py-3 px-6 rounded-lg ${currentStep === 0 ? 'w-full' : ''}`}
          >
            {isLast ? '🎮 START PLAYING' : 'NEXT →'}
          </button>
        </div>

        {/* Skip button */}
        <button
          onClick={onComplete}
          className="w-full mt-4 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          Skip tutorial
        </button>
      </div>
    </div>
  );
}
