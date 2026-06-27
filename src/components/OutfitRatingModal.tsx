import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Star, Smile, Meh, Frown, Heart } from 'lucide-react';
import { rateSavedOutfit } from '@/lib/store';
import { SavedOutfit, OutfitRating } from '@/lib/types';
import { toast } from 'sonner';

interface Props {
  outfit: SavedOutfit | null;
  open: boolean;
  onClose: () => void;
  weatherLabel?: string;
}

const REACTIONS: { value: NonNullable<OutfitRating['reaction']>; label: string; Icon: typeof Smile }[] = [
  { value: 'love', label: 'Loved it', Icon: Heart },
  { value: 'good', label: 'Good', Icon: Smile },
  { value: 'meh', label: 'Meh', Icon: Meh },
  { value: 'bad', label: 'Not great', Icon: Frown },
];

export default function OutfitRatingModal({ outfit, open, onClose, weatherLabel }: Props) {
  const [stars, setStars] = useState(0);
  const [hover, setHover] = useState(0);
  const [reaction, setReaction] = useState<OutfitRating['reaction'] | undefined>();
  const [note, setNote] = useState('');

  const reset = () => { setStars(0); setHover(0); setReaction(undefined); setNote(''); };

  const submit = () => {
    if (!outfit) return;
    if (stars === 0) { toast.error('Pick a star rating first'); return; }
    rateSavedOutfit(outfit.id, {
      stars, reaction, note: note.trim() || undefined,
      weatherSnapshot: weatherLabel, ratedAt: Date.now(),
    });
    toast.success('Thanks for rating today\'s outfit!');
    reset();
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={(o) => { if (!o) { reset(); onClose(); } }}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="font-display text-2xl">How did today's outfit work for you?</DialogTitle>
        </DialogHeader>
        {outfit && (
          <p className="text-sm text-muted-foreground -mt-2">
            Rating <span className="text-foreground font-medium">{outfit.outfit.name}</span>
            {weatherLabel && <span> · {weatherLabel}</span>}
          </p>
        )}

        {/* Stars */}
        <div className="flex justify-center gap-1.5 py-2">
          {[1,2,3,4,5].map(n => {
            const active = (hover || stars) >= n;
            return (
              <button
                key={n}
                onMouseEnter={() => setHover(n)}
                onMouseLeave={() => setHover(0)}
                onClick={() => setStars(n)}
                className="p-1 transition-transform hover:scale-110"
                aria-label={`${n} stars`}
              >
                <Star
                  className={`h-9 w-9 transition-colors ${active ? 'fill-accent text-accent' : 'text-muted-foreground/40'}`}
                />
              </button>
            );
          })}
        </div>

        {/* Reactions */}
        <div className="grid grid-cols-4 gap-2">
          {REACTIONS.map(r => {
            const active = reaction === r.value;
            return (
              <button
                key={r.value}
                onClick={() => setReaction(r.value)}
                className={`flex flex-col items-center gap-1 py-3 rounded-xl border text-xs transition-colors ${
                  active ? 'border-accent bg-accent/10 text-accent' : 'border-border hover:bg-secondary'
                }`}
              >
                <r.Icon className={`h-5 w-5 ${active ? 'fill-accent/30' : ''}`} />
                {r.label}
              </button>
            );
          })}
        </div>

        <Textarea
          placeholder="Anything to remember about this look? (optional)"
          value={note}
          onChange={e => setNote(e.target.value)}
          maxLength={200}
          className="resize-none h-20"
        />

        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={() => { reset(); onClose(); }}>Skip</Button>
          <Button onClick={submit} className="bg-accent hover:bg-accent/90 text-accent-foreground">Save Rating</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
