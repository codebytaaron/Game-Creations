import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

interface HowToPlayModalProps {
  open: boolean;
  onClose: () => void;
}

export function HowToPlayModal({ open, onClose }: HowToPlayModalProps) {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl sm:text-2xl font-bold">
            How to Play
          </DialogTitle>
        </DialogHeader>
        
        <DialogDescription asChild>
          <div className="space-y-4 text-foreground">
            <div className="space-y-2">
              <h3 className="font-semibold text-primary">🎯 Goal</h3>
              <p className="text-sm text-muted-foreground">
                Place blocks on the grid to clear full rows and columns. Score as high as you can!
              </p>
            </div>
            
            <div className="space-y-2">
              <h3 className="font-semibold text-primary">🕹️ Controls</h3>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Tap a piece to select it</li>
                <li>• Tap a cell on the grid to place it</li>
                <li>• A ghost preview shows where the piece will go</li>
              </ul>
            </div>
            
            <div className="space-y-2">
              <h3 className="font-semibold text-primary">⭐ Scoring</h3>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• +10 points per placed square</li>
                <li>• +50 points per cleared line</li>
                <li>• +200 bonus for clearing 2+ lines at once</li>
              </ul>
            </div>
            
            <div className="space-y-2">
              <h3 className="font-semibold text-primary">💡 Tips</h3>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Use <strong>Hint</strong> to see a valid placement</li>
                <li>• Use <strong>Shuffle</strong> once per game for new pieces</li>
                <li>• Plan ahead - leave room for different shapes!</li>
              </ul>
            </div>
          </div>
        </DialogDescription>
        
        <Button onClick={onClose} className="mt-2 font-semibold">
          Got it!
        </Button>
      </DialogContent>
    </Dialog>
  );
}
