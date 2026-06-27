import { useEffect, useState } from 'react';
import Navbar from '@/components/Navbar';
import { getSavedOutfits, toggleFavoriteOutfit } from '@/lib/store';
import { SavedOutfit } from '@/lib/types';
import WardrobeCard from '@/components/WardrobeCard';
import { Heart, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';

export default function FavoriteOutfits() {
  const [outfits, setOutfits] = useState<SavedOutfit[]>([]);

  useEffect(() => {
    setOutfits(getSavedOutfits().filter(o => o.favorite));
  }, []);

  const handleUnfav = (id: string) => {
    toggleFavoriteOutfit(id);
    setOutfits(getSavedOutfits().filter(o => o.favorite));
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 pt-24 pb-16">
        <div className="flex items-center gap-3 mb-1">
          <Heart className="h-7 w-7 text-accent fill-accent" />
          <h1 className="text-3xl font-display font-bold">Favorite Outfits</h1>
        </div>
        <p className="text-muted-foreground text-sm mb-8">{outfits.length} favorite{outfits.length !== 1 ? 's' : ''} · your go-to looks</p>

        {outfits.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-16 h-16 rounded-2xl bg-accent/10 text-accent flex items-center justify-center mx-auto mb-4">
              <Heart className="h-8 w-8" />
            </div>
            <h3 className="font-display text-2xl mb-2">No favorites yet</h3>
            <p className="text-sm text-muted-foreground mb-6">Tap the heart on any saved outfit to add it here.</p>
            <Link to="/saved"><Button className="gap-2"><Sparkles className="h-4 w-4" /> View Saved Outfits</Button></Link>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {outfits.map((saved, i) => (
              <motion.div
                key={saved.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="bg-card border border-border rounded-2xl p-5 hover:shadow-md transition-shadow"
              >
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-display font-semibold">{saved.outfit.name}</h3>
                  <button onClick={() => handleUnfav(saved.id)} className="p-1.5 rounded-full bg-accent text-accent-foreground hover:bg-accent/90">
                    <Heart className="h-4 w-4 fill-current" />
                  </button>
                </div>
                <div className="grid grid-cols-3 gap-2 mb-3">
                  {saved.outfit.items.slice(0, 3).map(item => (
                    <WardrobeCard key={item.id} item={item} compact />
                  ))}
                </div>
                <div className="flex items-center justify-between text-xs text-muted-foreground pt-3 border-t border-border">
                  <span className="capitalize">{saved.outfit.style} · {saved.outfit.occasion}</span>
                  <span>Worn {saved.wornDates.length}×</span>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
