import { useMemo } from 'react';
import Navbar from '@/components/Navbar';
import { getSavedOutfits } from '@/lib/store';
import WardrobeCard from '@/components/WardrobeCard';
import { History, Cloud, Star, Calendar, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';

interface HistoryEntry {
  savedId: string;
  outfitName: string;
  items: ReturnType<typeof getSavedOutfits>[number]['outfit']['items'];
  wornAt: number;
  occasion: string;
  rating?: number;
  weather?: string;
}

export default function OutfitHistory() {
  const entries = useMemo<HistoryEntry[]>(() => {
    const all = getSavedOutfits();
    const list: HistoryEntry[] = [];
    all.forEach(s => {
      s.wornDates.forEach((d, idx) => {
        const rating = s.ratings?.[idx];
        list.push({
          savedId: s.id,
          outfitName: s.outfit.name,
          items: s.outfit.items,
          wornAt: d,
          occasion: s.outfit.occasion,
          rating: rating?.stars,
          weather: rating?.weatherSnapshot,
        });
      });
    });
    return list.sort((a, b) => b.wornAt - a.wornAt);
  }, []);

  const groupByMonth = useMemo(() => {
    const map = new Map<string, HistoryEntry[]>();
    entries.forEach(e => {
      const key = new Date(e.wornAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
      if (!map.has(key)) map.set(key, []);
      map.get(key)!.push(e);
    });
    return Array.from(map.entries());
  }, [entries]);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 pt-24 pb-16">
        <div className="flex items-center gap-3 mb-1">
          <History className="h-7 w-7 text-accent" />
          <h1 className="text-3xl font-display font-bold">Outfit History</h1>
        </div>
        <p className="text-muted-foreground text-sm mb-10">{entries.length} look{entries.length !== 1 ? 's' : ''} logged · your style story</p>

        {entries.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-16 h-16 rounded-2xl bg-accent/10 text-accent flex items-center justify-center mx-auto mb-4">
              <History className="h-8 w-8" />
            </div>
            <h3 className="font-display text-2xl mb-2">No outfits worn yet</h3>
            <p className="text-sm text-muted-foreground mb-6">Mark a saved outfit as worn to build your history.</p>
            <Link to="/saved"><Button className="gap-2"><Sparkles className="h-4 w-4" /> Go to Saved Outfits</Button></Link>
          </div>
        ) : (
          <div className="space-y-10">
            {groupByMonth.map(([month, list]) => (
              <section key={month}>
                <h2 className="font-display text-xl mb-4 sticky top-16 bg-background/85 backdrop-blur py-2 z-10">{month}</h2>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
                  {list.map((e, i) => (
                    <motion.div
                      key={`${e.savedId}-${e.wornAt}`}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.04 }}
                      className="bg-card border border-border rounded-2xl p-5 hover:shadow-md transition-shadow"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h3 className="font-display font-semibold text-sm">{e.outfitName}</h3>
                          <p className="text-[11px] text-muted-foreground flex items-center gap-1 mt-0.5">
                            <Calendar className="h-3 w-3" />
                            {new Date(e.wornAt).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
                          </p>
                        </div>
                        {e.rating ? (
                          <div className="flex items-center gap-0.5">
                            {[1,2,3,4,5].map(n => (
                              <Star key={n} className={`h-3 w-3 ${n <= e.rating! ? 'fill-accent text-accent' : 'text-muted-foreground/30'}`} />
                            ))}
                          </div>
                        ) : (
                          <span className="text-[10px] text-muted-foreground">Not rated</span>
                        )}
                      </div>
                      <div className="grid grid-cols-3 gap-2 mb-3">
                        {e.items.slice(0, 3).map(item => (
                          <WardrobeCard key={item.id} item={item} compact />
                        ))}
                      </div>
                      <div className="flex items-center justify-between text-[11px] text-muted-foreground pt-2 border-t border-border">
                        <span className="capitalize inline-flex items-center gap-1">
                          <Sparkles className="h-3 w-3" /> {e.occasion}
                        </span>
                        {e.weather && (
                          <span className="inline-flex items-center gap-1">
                            <Cloud className="h-3 w-3" /> {e.weather}
                          </span>
                        )}
                      </div>
                    </motion.div>
                  ))}
                </div>
              </section>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
