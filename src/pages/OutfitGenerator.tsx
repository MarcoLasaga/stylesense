import { useState, useMemo } from 'react';
import Navbar from '@/components/Navbar';
import { getProfile, saveOutfit } from '@/lib/store';
import { generateOutfits } from '@/lib/recommendation';
import { Button } from '@/components/ui/button';
import { RefreshCw, Save, Check } from 'lucide-react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import { ClothingItem } from '@/lib/types';

function OutfitCard({ item, label }: { item: ClothingItem; label: string }) {
  const [imgErr, setImgErr] = useState(false);
  return (
    <div className="text-center">
      <p className="text-[10px] uppercase tracking-widest text-muted-foreground mb-2">{label}</p>
      <div className="aspect-[3/4] rounded-sm overflow-hidden bg-secondary mb-2">
        {!imgErr ? (
          <img src={item.image} alt={item.name} className="h-full w-full object-cover" onError={() => setImgErr(true)} loading="lazy" />
        ) : (
          <div className="h-full w-full flex items-center justify-center">
            <div className="w-8 h-8 rounded-full" style={{ backgroundColor: item.colorHex }} />
          </div>
        )}
      </div>
      <p className="text-xs font-medium">{item.name}</p>
      <p className="text-xs text-muted-foreground">${item.price.toFixed(2)}</p>
    </div>
  );
}

export default function OutfitGenerator() {
  const profile = getProfile();
  const [key, setKey] = useState(0);
  const [savedIds, setSavedIds] = useState<Set<number>>(new Set());

  const outfits = useMemo(() => generateOutfits(profile, 6), [key]);

  const handleSave = (index: number) => {
    const outfit = outfits[index];
    saveOutfit({
      id: 'outfit_' + Date.now(),
      userId: profile.id,
      name: `${outfit.top.name} + ${outfit.bottom.name}`,
      items: [outfit.top.id, outfit.bottom.id, outfit.shoes.id],
      createdAt: Date.now(),
    });
    setSavedIds(prev => new Set(prev).add(index));
    toast.success('Outfit saved!');
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 pt-24 pb-16">
        <div className="flex items-start justify-between mb-8">
          <div>
            <h1 className="text-3xl font-display font-bold mb-2">Outfit Generator</h1>
            <p className="text-muted-foreground">AI-generated outfit combinations matched to your style</p>
          </div>
          <Button
            variant="outline"
            className="gap-2"
            onClick={() => { setKey(k => k + 1); setSavedIds(new Set()); }}
          >
            <RefreshCw className="h-4 w-4" /> Refresh
          </Button>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {outfits.map((outfit, i) => (
            <motion.div
              key={`${key}-${i}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="bg-card border border-border rounded-sm p-6"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-display font-semibold">Outfit {i + 1}</h3>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-accent">
                    Match: {Math.round(outfit.score * 100)}%
                  </span>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => handleSave(i)}
                    disabled={savedIds.has(i)}
                  >
                    {savedIds.has(i) ? <Check className="h-4 w-4 text-accent" /> : <Save className="h-4 w-4" />}
                  </Button>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-3">
                <OutfitCard item={outfit.top} label="Top" />
                <OutfitCard item={outfit.bottom} label="Bottom" />
                <OutfitCard item={outfit.shoes} label="Shoes" />
              </div>
              <p className="text-xs text-muted-foreground mt-4 text-center">
                Total: ${(outfit.top.price + outfit.bottom.price + outfit.shoes.price).toFixed(2)}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
