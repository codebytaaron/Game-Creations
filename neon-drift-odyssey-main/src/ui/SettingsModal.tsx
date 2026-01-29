import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { GameSettings } from '@/hooks/useGame';
import { Difficulty } from '@/game/engine';
import { audio } from '@/game/audio';

interface SettingsModalProps {
  open: boolean;
  onClose: () => void;
  settings: GameSettings;
  onSettingsChange: (settings: Partial<GameSettings>) => void;
}

const DIFFICULTY_OPTIONS: { value: Difficulty; label: string; description: string }[] = [
  { value: 'casual', label: 'Casual', description: 'Slower pace, more forgiving' },
  { value: 'standard', label: 'Standard', description: 'Balanced challenge' },
  { value: 'hardcore', label: 'Hardcore', description: 'Intense speed, more obstacles' },
];

export function SettingsModal({ open, onClose, settings, onSettingsChange }: SettingsModalProps) {
  const handleSoundChange = (enabled: boolean) => {
    audio.click();
    onSettingsChange({ soundEnabled: enabled });
  };
  
  const handleShakeChange = (enabled: boolean) => {
    audio.click();
    onSettingsChange({ screenShakeEnabled: enabled });
  };
  
  const handleDifficultyChange = (difficulty: Difficulty) => {
    audio.click();
    onSettingsChange({ difficulty });
  };
  
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="font-body bg-card border-border max-w-md">
        <DialogHeader>
          <DialogTitle className="font-display text-2xl text-primary glow-cyan">
            Settings
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6 py-4">
          {/* Sound Toggle */}
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="sound" className="text-foreground font-medium">
                Sound Effects
              </Label>
              <p className="text-sm text-muted-foreground">
                Enable game audio
              </p>
            </div>
            <Switch
              id="sound"
              checked={settings.soundEnabled}
              onCheckedChange={handleSoundChange}
              className="data-[state=checked]:bg-primary"
            />
          </div>
          
          {/* Screen Shake Toggle */}
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="shake" className="text-foreground font-medium">
                Screen Shake
              </Label>
              <p className="text-sm text-muted-foreground">
                Camera shake on impacts
              </p>
            </div>
            <Switch
              id="shake"
              checked={settings.screenShakeEnabled}
              onCheckedChange={handleShakeChange}
              className="data-[state=checked]:bg-primary"
            />
          </div>
          
          {/* Difficulty Selection */}
          <div className="space-y-3">
            <Label className="text-foreground font-medium">
              Difficulty
            </Label>
            <RadioGroup
              value={settings.difficulty}
              onValueChange={(val) => handleDifficultyChange(val as Difficulty)}
              className="space-y-2"
            >
              {DIFFICULTY_OPTIONS.map((option) => (
                <div
                  key={option.value}
                  className={`flex items-center space-x-3 p-3 rounded-lg border transition-colors cursor-pointer ${
                    settings.difficulty === option.value
                      ? 'border-primary bg-primary/10'
                      : 'border-border hover:border-muted-foreground/50'
                  }`}
                  onClick={() => handleDifficultyChange(option.value)}
                >
                  <RadioGroupItem
                    value={option.value}
                    id={option.value}
                    className="border-muted-foreground data-[state=checked]:border-primary data-[state=checked]:text-primary"
                  />
                  <div className="flex-1">
                    <Label
                      htmlFor={option.value}
                      className={`font-medium cursor-pointer ${
                        settings.difficulty === option.value ? 'text-primary' : 'text-foreground'
                      }`}
                    >
                      {option.label}
                    </Label>
                    <p className="text-sm text-muted-foreground">
                      {option.description}
                    </p>
                  </div>
                </div>
              ))}
            </RadioGroup>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
