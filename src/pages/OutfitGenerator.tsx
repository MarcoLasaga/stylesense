import { useState, useMemo } from 'react';
import Navbar from '@/components/Navbar';
import WardrobeCard from '@/components/WardrobeCard';
import { getWardrobe, getProfile, saveOutfit as saveOutfitToStore } from '@/lib/store';
import { generateOutfits, randomOutfit } from '@/lib/recommendation';
import { GeneratedOutfit, OccasionType } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { RefreshCw, Save, Check, Shuffle, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import { Link } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const occasions: (OccasionType | 'any')[] = ['any', 'school', 'work', 'gym', 'party', 'date', 'outdoor', 'everyday'];

export default function OutfitGenerator() {
  const wardrobe = getWardrobe();
  const profile = getProfile();
  const [occasion, setOccasion] = useState<string>('any');
  const [key, setKey] = useState(0);
  const [savedIds, setSavedIds] = useState<Set<string>>(new Set());
  const [surprise, setSurprise] = useState<GeneratedOutfit | null>(null);

  const outfits = useMemo(() => {
    if (wardrobe.length < 2) return [];
    return generateOutfits(wardrobe, profile, {
      occasion: occasion === 'any' ? undefined : occasion as OccasionType,
      count: 9,
      includeOuterwear: true,
    });
  }, [key, occasion]);

  const handleSave = (outfit: GeneratedOutfit) => {
    saveOutfitToStore(outfit);
    setSavedIds(prev => new Set(prev).add(outfit.id));
    toast.success('Outfit saved!');
  };

  const handleSurprise = () => {
    const r = randomOutfit(wardrobe, profile);
    setSurprise(r);
    if (r) toast('🎲 Surprise outfit generated!');
  };

  if (wardrobe.length < 2) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-4 pt-24 pb-16 text-center max-w-lg">
          <p className="text-4xl mb-4">👔</p>
          <h1 className="text-2xl font-display font-bold mb-2">Not Enough Clothes</h1>
          <p className="text-muted-foreground mb-6">Add at least a top and a bottom to generate outfits.</p>
          <Link to="/upload"><Button className="gap-2"><Sparkles className="h-4 w-4" /> Add Clothes</Button></Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 pt-24 pb-16">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-3xl font-display font-bold mb-1">Outfit Generator</h1>
            <p className="text-muted-foreground text-sm">Smart combinations from your wardrobe</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" className="gap-2" onClick={handleSurprise}>
              <Shuffle className="h-3.5 w-3.5" /> Surprise Me
            </Button>
            <Button variant="outline" size="sm" className="gap-2" onClick={() => setKey(k => k + 1)}>
              <RefreshCw className="h-3.5 w-3.5" /> Refresh
            </Button>
          </div>
        </div>

        {/* Occasion filter */}
        <div className="mb-8">
          <p className="text-[10px] uppercase tracking-widest text-muted-foreground mb-2">Filter by Occasion</p>
          <div className="flex flex-wrap gap-2">
            {occasions.map(o => (
              <button
                key={o}
                onClick={() => setOccasion(o)}
                className={`text-xs px-3 py-1.5 rounded-sm capitalize transition-colors ${
                  occasion === o ? 'bg-primary text-primary-foreground' : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
                }`}
              >
                {o}
              </button>
            ))}
          </div>
        </div>

        {/* Surprise outfit */}
        {surprise && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-accent/10 border border-accent/30 rounded-sm p-6 mb-8"
          >
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-display font-semibold">🎲 Surprise Outfit</h3>
              <Button variant="ghost" size="sm" className="gap-1 text-xs" onClick={() => handleSave(surprise)}>
                <Save className="h-3.5 w-3.5" /> Save
              </Button>
            </div>
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
              {surprise.items.map((item, i) => (
                <WardrobeCard key={item.id} item={item} index={i} compact />
              ))}
            </div>
          </motion.div>
        )}

        {/* Generated outfits */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {outfits.map((outfit, i) => (
            <motion.div
              key={outfit.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
              className="bg-card border border-border rounded-sm p-5"
            >
              <div className="flex items-center justify-between mb-1">
                <h3 className="font-display font-semibold text-sm">{outfit.name}</h3>
                <Button
                  variant="ghost" size="icon" className="h-7 w-7"
                  onClick={() => handleSave(outfit)}
                  disabled={savedIds.has(outfit.id)}
                >
                  {savedIds.has(outfit.id) ? <Check className="h-3.5 w-3.5 text-accent" /> : <Save className="h-3.5 w-3.5" />}
                </Button>
              </div>
              <p className="text-xs text-accent mb-3">{outfit.reason}</p>
              <div className="grid grid-cols-3 gap-2 mb-3">
                {outfit.items.slice(0, 3).map((item) => (
                  <WardrobeCard key={item.id} item={item} compact />
                ))}
              </div>
              {outfit.items.length > 3 && (
                <div className="grid grid-cols-3 gap-2 mb-3">
                  {outfit.items.slice(3).map((item) => (
                    <WardrobeCard key={item.id} item={item} compact />
                  ))}
                </div>
              )}
              <div className="flex items-center justify-between text-[10px] text-muted-foreground pt-2 border-t border-border">
                <span className="capitalize">{outfit.style} · {outfit.occasion}</span>
                <span>Match: {Math.round(outfit.score * 100)}%</span>
              </div>
            </motion.div>
          ))}
        </div>

        {outfits.length === 0 && (
          <div className="text-center py-16 text-muted-foreground">
            <p className="text-lg mb-2">No matching outfits found</p>
            <p className="text-sm">Try a different occasion or add more clothes</p>
          </div>
        )}
      </div>
    </div>
  );
}
