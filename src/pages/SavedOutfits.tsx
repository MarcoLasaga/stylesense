import { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import { getSavedOutfits, removeSavedOutfit, markOutfitWorn, toggleFavoriteOutfit } from '@/lib/store';
import { SavedOutfit, FitFeedback, WardrobeItem } from '@/lib/types';
import WardrobeCard from '@/components/WardrobeCard';
import { Button } from '@/components/ui/button';
import { Trash2, CheckCircle, Share2, Smile, Bookmark, ArrowDownToLine, ArrowUpToLine, Heart } from 'lucide-react';
import { toast } from 'sonner';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { recordWear } from '@/lib/frequency';
import { recordFitFeedback } from '@/lib/sizeAdaptation';
import { logWear, logFitFeedback, postOutfit } from '@/lib/socialStore';
import OutfitRatingModal from '@/components/OutfitRatingModal';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';

const FIT_LABELS: { value: FitFeedback; label: string; Icon: typeof Smile }[] = [
  { value: 'too_tight', label: 'Too tight', Icon: ArrowUpToLine },
  { value: 'perfect', label: 'Perfect', Icon: Smile },
  { value: 'too_loose', label: 'Too loose', Icon: ArrowDownToLine },
];

export default function SavedOutfitsPage() {
  const [outfits, setOutfits] = useState<SavedOutfit[]>([]);
  const [shareTarget, setShareTarget] = useState<SavedOutfit | null>(null);
  const [caption, setCaption] = useState('');
  const [ratingTarget, setRatingTarget] = useState<SavedOutfit | null>(null);

  useEffect(() => { setOutfits(getSavedOutfits()); }, []);

  const handleRemove = (id: string) => {
    removeSavedOutfit(id);
    setOutfits(getSavedOutfits());
    toast.success('Outfit removed');
  };

  const handleFavorite = (id: string) => {
    const isFav = toggleFavoriteOutfit(id);
    setOutfits(getSavedOutfits());
    toast.success(isFav ? 'Added to favorites' : 'Removed from favorites');
  };

  const handleWorn = async (saved: SavedOutfit) => {
    markOutfitWorn(saved.id);
    recordWear(saved.outfit.items);
    await logWear(saved.outfit.items);
    const fresh = getSavedOutfits().find(o => o.id === saved.id) ?? saved;
    setOutfits(getSavedOutfits());
    setRatingTarget(fresh);
  };

  const handleFit = async (item: WardrobeItem, fit: FitFeedback) => {
    recordFitFeedback(item.id, item.size, fit);
    await logFitFeedback(item.id, item.size, fit);
    toast.success(`Recorded fit: ${fit.replace('_', ' ')}`);
  };

  const handleShare = async () => {
    if (!shareTarget) return;
    const id = await postOutfit(shareTarget.outfit, caption);
    if (id) {
      toast.success('Posted to the feed!');
      setShareTarget(null);
      setCaption('');
    } else {
      toast.error('Sign in to share outfits');
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 pt-24 pb-16">
        <h1 className="text-3xl font-display font-bold mb-1">Saved Outfits</h1>
        <p className="text-muted-foreground text-sm mb-8">{outfits.length} saved outfit{outfits.length !== 1 ? 's' : ''}</p>

        {outfits.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-16 h-16 rounded-2xl bg-accent/10 text-accent flex items-center justify-center mx-auto mb-4">
              <Bookmark className="h-8 w-8" />
            </div>
            <p className="text-muted-foreground mb-4">No saved outfits yet</p>
            <Link to="/outfits"><Button>Generate Outfits</Button></Link>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {outfits.map((saved, i) => (
              <motion.div
                key={saved.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="bg-card border border-border rounded-sm p-5"
              >
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-display font-semibold text-sm">{saved.outfit.name}</h3>
                  <div className="flex gap-1">
                    <Button variant="ghost" size="icon" className={`h-7 w-7 ${saved.favorite ? 'text-accent' : ''}`} onClick={() => handleFavorite(saved.id)} title={saved.favorite ? 'Unfavorite' : 'Favorite'}>
                      <Heart className={`h-3.5 w-3.5 ${saved.favorite ? 'fill-current' : ''}`} />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => handleWorn(saved)} title="Mark as worn">
                      <CheckCircle className="h-3.5 w-3.5" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => setShareTarget(saved)} title="Share to feed">
                      <Share2 className="h-3.5 w-3.5" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive" onClick={() => handleRemove(saved.id)}>
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-2 mb-3">
                  {saved.outfit.items.slice(0, 3).map(item => (
                    <WardrobeCard key={item.id} item={item} compact />
                  ))}
                </div>
                {saved.outfit.items.length > 3 && (
                  <div className="grid grid-cols-3 gap-2 mb-3">
                    {saved.outfit.items.slice(3).map(item => (
                      <WardrobeCard key={item.id} item={item} compact />
                    ))}
                  </div>
                )}

                {/* Fit feedback per item — fuels size adaptation */}
                <div className="border-t border-border pt-3 mt-2">
                  <p className="text-[10px] uppercase tracking-widest text-muted-foreground mb-2 flex items-center gap-1">
                    <Smile className="h-3 w-3" /> How does each item fit?
                  </p>
                  <div className="space-y-1.5">
                    {saved.outfit.items.map(item => (
                      <div key={item.id} className="flex items-center justify-between gap-2">
                        <span className="text-[11px] truncate flex-1">{item.name} <span className="text-muted-foreground">({item.size})</span></span>
                        <div className="flex gap-1">
                          {FIT_LABELS.map(f => (
                            <button
                              key={f.value}
                              onClick={() => handleFit(item, f.value)}
                              className="p-1.5 rounded-md bg-secondary hover:bg-secondary/70"
                              title={f.label}
                              aria-label={f.label}
                            >
                              <f.Icon className="h-3.5 w-3.5" />
                            </button>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex justify-between text-[10px] text-muted-foreground pt-2 border-t border-border mt-3">
                  <span>Worn {saved.wornDates.length} time{saved.wornDates.length !== 1 ? 's' : ''}</span>
                  <span>Saved {new Date(saved.savedAt).toLocaleDateString()}</span>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* Share dialog */}
        <Dialog open={!!shareTarget} onOpenChange={(o) => !o && setShareTarget(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Share to community feed</DialogTitle>
            </DialogHeader>
            <p className="text-sm text-muted-foreground mb-2">
              Posting <span className="font-medium text-foreground">{shareTarget?.outfit.name}</span> to the StyleSense feed.
            </p>
            <Input
              placeholder="Add a caption (optional)…"
              value={caption}
              onChange={e => setCaption(e.target.value)}
              maxLength={200}
            />
            <div className="flex justify-end gap-2 mt-2">
              <Button variant="outline" size="sm" onClick={() => setShareTarget(null)}>Cancel</Button>
              <Button size="sm" onClick={handleShare}>Post</Button>
            </div>
          </DialogContent>
        </Dialog>

        {/* Rating modal — appears after marking worn */}
        <OutfitRatingModal
          outfit={ratingTarget}
          open={!!ratingTarget}
          onClose={() => { setRatingTarget(null); setOutfits(getSavedOutfits()); }}
        />
      </div>
    </div>
  );
}
