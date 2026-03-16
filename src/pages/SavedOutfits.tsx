import { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import { getSavedOutfits, removeSavedOutfit, markOutfitWorn } from '@/lib/store';
import { SavedOutfit } from '@/lib/types';
import WardrobeCard from '@/components/WardrobeCard';
import { Button } from '@/components/ui/button';
import { Trash2, CheckCircle } from 'lucide-react';
import { toast } from 'sonner';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

export default function SavedOutfitsPage() {
  const [outfits, setOutfits] = useState<SavedOutfit[]>([]);

  useEffect(() => {
    setOutfits(getSavedOutfits());
  }, []);

  const handleRemove = (id: string) => {
    removeSavedOutfit(id);
    setOutfits(getSavedOutfits());
    toast.success('Outfit removed');
  };

  const handleWorn = (id: string) => {
    markOutfitWorn(id);
    setOutfits(getSavedOutfits());
    toast.success('Marked as worn! Stats updated.');
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 pt-24 pb-16">
        <h1 className="text-3xl font-display font-bold mb-1">Saved Outfits</h1>
        <p className="text-muted-foreground text-sm mb-8">{outfits.length} saved outfit{outfits.length !== 1 ? 's' : ''}</p>

        {outfits.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-4xl mb-4">💾</p>
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
                    <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => handleWorn(saved.id)} title="Mark as worn">
                      <CheckCircle className="h-3.5 w-3.5" />
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
                <div className="flex justify-between text-[10px] text-muted-foreground pt-2 border-t border-border">
                  <span>Worn {saved.wornDates.length} time{saved.wornDates.length !== 1 ? 's' : ''}</span>
                  <span>Saved {new Date(saved.savedAt).toLocaleDateString()}</span>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
