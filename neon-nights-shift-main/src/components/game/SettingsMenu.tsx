import { GameSettings, PlayerProfile } from '@/types/game';

interface SettingsMenuProps {
  settings: GameSettings;
  profile: PlayerProfile;
  onUpdateSettings: (updates: Partial<GameSettings>) => void;
  onUpdateProfile: (updates: Partial<PlayerProfile>) => void;
  onClose: () => void;
}

export function SettingsMenu({ 
  settings, 
  profile, 
  onUpdateSettings, 
  onUpdateProfile, 
  onClose 
}: SettingsMenuProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/95 backdrop-blur-sm animate-fade-in">
      <div className="minigame-container p-8 max-w-md w-full mx-4">
        <div className="text-center mb-8">
          <span className="text-4xl mb-4 block">⚙️</span>
          <h2 className="font-arcade text-2xl neon-text-cyan">SETTINGS</h2>
        </div>

        <div className="space-y-6">
          {/* Player Name */}
          <div>
            <label className="block text-sm text-muted-foreground mb-2 uppercase tracking-wider">
              Player Name
            </label>
            <input
              type="text"
              value={profile.name}
              onChange={(e) => onUpdateProfile({ name: e.target.value.slice(0, 12) })}
              maxLength={12}
              className="w-full px-4 py-3 rounded-lg bg-muted border-2 border-border
                       focus:border-neon-cyan focus:outline-none transition-colors
                       font-orbitron text-foreground"
              placeholder="Enter name..."
            />
          </div>

          {/* Sound Settings */}
          <div className="space-y-4">
            <h3 className="font-arcade text-sm neon-text-magenta">Audio</h3>
            
            <ToggleSetting
              label="Music"
              enabled={settings.musicEnabled}
              onChange={(v) => onUpdateSettings({ musicEnabled: v })}
            />
            
            <ToggleSetting
              label="Sound Effects"
              enabled={settings.sfxEnabled}
              onChange={(v) => onUpdateSettings({ sfxEnabled: v })}
            />
          </div>

          {/* Accessibility */}
          <div className="space-y-4">
            <h3 className="font-arcade text-sm neon-text-lime">Accessibility</h3>
            
            <ToggleSetting
              label="Reduced Motion"
              enabled={settings.reducedMotion}
              onChange={(v) => onUpdateSettings({ reducedMotion: v })}
            />
            
            <ToggleSetting
              label="Colorblind Mode"
              enabled={settings.colorblindMode}
              onChange={(v) => onUpdateSettings({ colorblindMode: v })}
            />
          </div>

          {/* Difficulty */}
          <div>
            <h3 className="font-arcade text-sm neon-text-orange mb-3">Difficulty</h3>
            <div className="flex gap-2">
              {(['easy', 'normal', 'hard'] as const).map((diff) => (
                <button
                  key={diff}
                  onClick={() => onUpdateSettings({ difficulty: diff })}
                  className={`
                    flex-1 py-3 rounded-lg font-bold uppercase text-sm transition-all
                    ${settings.difficulty === diff
                      ? 'bg-neon-cyan text-primary-foreground'
                      : 'bg-muted text-muted-foreground hover:bg-muted/80'
                    }
                  `}
                >
                  {diff}
                </button>
              ))}
            </div>
          </div>
        </div>

        <button
          onClick={onClose}
          className="w-full mt-8 arcade-button py-4 px-6 rounded-lg"
        >
          ✓ DONE
        </button>
      </div>
    </div>
  );
}

interface ToggleSettingProps {
  label: string;
  enabled: boolean;
  onChange: (value: boolean) => void;
}

function ToggleSetting({ label, enabled, onChange }: ToggleSettingProps) {
  return (
    <div className="flex items-center justify-between py-2">
      <span className="text-foreground">{label}</span>
      <button
        onClick={() => onChange(!enabled)}
        className={`
          w-14 h-8 rounded-full relative transition-colors
          ${enabled ? 'bg-neon-lime' : 'bg-muted'}
        `}
      >
        <div
          className={`
            absolute top-1 w-6 h-6 rounded-full bg-foreground transition-transform
            ${enabled ? 'translate-x-7' : 'translate-x-1'}
          `}
        />
      </button>
    </div>
  );
}
