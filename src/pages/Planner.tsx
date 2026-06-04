import { useEffect, useState } from 'react';
import Navbar from '@/components/Navbar';
import { getWardrobe, getProfile } from '@/lib/store';
import { generateOutfits } from '@/lib/recommendation';
import { getWeatherCached } from '@/lib/weather';
import { computeTrendSnapshot, TrendSnapshot } from '@/lib/trends';
import { getSocialAffinity, logWear } from '@/lib/socialStore';
import { recordWear } from '@/lib/frequency';
import { GeneratedOutfit, OccasionType, WeatherContext } from '@/lib/types';
import { Cloud, CloudRain, Sun, Snowflake, MapPin, RefreshCw, Check, TrendingUp, CalendarDays } from 'lucide-react';
import WardrobeCard from '@/components/WardrobeCard';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { toast } from 'sonner';

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

/**
 * Smart Outfit Planner — combines every signal:
 *   user prefs · weather · trends · frequency cooldown · size profile.
 * Produces a 7-day non-repetitive outfit plan.
 */
export default function Planner() {
  const wardrobe = getWardrobe();
  const profile = getProfile();
  const [weather, setWeather] = useState<WeatherContext | null>(null);
  const [trends, setTrends] = useState<TrendSnapshot | null>(null);
  const [plan, setPlan] = useState<GeneratedOutfit[]>([]);
  const [loading, setLoading] = useState(true);

  const buildPlan = async () => {
    setLoading(true);
    const [w, t, social] = await Promise.all([
      getWeatherCached(),
      computeTrendSnapshot(),
      getSocialAffinity(),
    ]);
    setWeather(w);
    setTrends(t);

    // Generate enough variety, then enforce no-repeat across the week.
    const pool = generateOutfits(wardrobe, profile, {
      count: 30,
      includeOuterwear: w.condition === 'cool' || w.condition === 'cold' || w.precipitation === 'rain',
      weather: w,
      trends: t,
      socialAffinity: social,
      excludeRecentlyWorn: true,
    });

    const usedItemIds = new Set<string>();
    const dayPlan: GeneratedOutfit[] = [];
    for (const o of pool) {
      // Skip if any item was already chosen for an earlier day
      if (o.items.some(i => usedItemIds.has(i.id))) continue;
      o.items.forEach(i => usedItemIds.add(i.id));
      dayPlan.push(o);
      if (dayPlan.length === 7) break;
    }
    // Backfill if not enough variety in wardrobe
    if (dayPlan.length < 7) {
      for (const o of pool) {
        if (dayPlan.includes(o)) continue;
        dayPlan.push(o);
        if (dayPlan.length === 7) break;
      }
    }
    setPlan(dayPlan.slice(0, 7));
    setLoading(false);
  };

  useEffect(() => { buildPlan(); /* eslint-disable-line react-hooks/exhaustive-deps */ }, []);

  const markWorn = async (o: GeneratedOutfit) => {
    recordWear(o.items);
    await logWear(o.items);
    toast.success('Marked as worn — recommender will avoid these for a few days');
  };

  const WeatherIcon = ({ w }: { w: WeatherContext }) => {
    if (w.precipitation === 'snow') return <Snowflake className="h-5 w-5" />;
    if (w.precipitation === 'rain') return <CloudRain className="h-5 w-5" />;
    if (w.condition === 'hot' || w.condition === 'warm') return <Sun className="h-5 w-5" />;
    return <Cloud className="h-5 w-5" />;
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 pt-24 pb-16 max-w-5xl">
        <div className="flex items-start justify-between gap-4 mb-6 flex-wrap">
          <div>
            <h1 className="text-3xl font-display font-bold mb-1">Weekly Outfit Plan</h1>
            <p className="text-muted-foreground text-sm">Context-aware, non-repetitive — built from your wardrobe</p>
          </div>
          <Button variant="outline" size="sm" className="gap-2" onClick={buildPlan}>
            <RefreshCw className="h-3.5 w-3.5" /> Regenerate
          </Button>
        </div>

        {/* Context bar */}
        {weather && (
          <div className="grid sm:grid-cols-3 gap-3 mb-8">
            <div className="bg-card border border-border rounded-sm p-4 flex items-center gap-3">
              <WeatherIcon w={weather} />
              <div>
                <p className="text-[10px] uppercase tracking-widest text-muted-foreground">Weather</p>
                <p className="text-sm font-medium">{weather.tempC}°C · {weather.description}</p>
              </div>
            </div>
            <div className="bg-card border border-border rounded-sm p-4 flex items-center gap-3">
              <MapPin className="h-5 w-5" />
              <div>
                <p className="text-[10px] uppercase tracking-widest text-muted-foreground">Location</p>
                <p className="text-sm font-medium">{weather.city || 'Auto-detected'}</p>
              </div>
            </div>
            <div className="bg-card border border-border rounded-sm p-4 flex items-center gap-3">
              <TrendingUp className="h-5 w-5" />
              <div>
                <p className="text-[10px] uppercase tracking-widest text-muted-foreground">Trending</p>
                <p className="text-sm font-medium capitalize">
                  {trends?.topStyles[0]?.value || 'Building trends…'}
                </p>
              </div>
            </div>
          </div>
        )}

        {loading && <p className="text-sm text-muted-foreground">Building your plan…</p>}

        {!loading && plan.length === 0 && (
          <div className="text-center py-16 border border-dashed border-border rounded-2xl">
            <div className="w-14 h-14 rounded-2xl bg-accent/10 text-accent flex items-center justify-center mx-auto mb-3">
              <CalendarDays className="h-7 w-7" />
            </div>
            <p className="font-medium mb-1">Add more clothes to plan a full week</p>
            <p className="text-sm text-muted-foreground">You need at least a few tops, bottoms, and shoes</p>
          </div>
        )}

        <div className="grid md:grid-cols-2 gap-4">
          {plan.map((o, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="bg-card border border-border rounded-sm p-4"
            >
              <div className="flex items-center justify-between mb-3">
                <p className="text-[10px] uppercase tracking-widest text-muted-foreground">{DAYS[i] || `Day ${i + 1}`}</p>
                <span className="text-[10px] text-accent">Match: {Math.round(o.score * 100)}%</span>
              </div>
              <h3 className="font-display font-semibold text-sm mb-1">{o.name}</h3>
              <p className="text-xs text-accent mb-3">{o.reason}</p>
              <div className="grid grid-cols-3 gap-2 mb-3">
                {o.items.slice(0, 3).map(item => (
                  <WardrobeCard key={item.id} item={item} compact />
                ))}
              </div>
              <Button variant="outline" size="sm" className="w-full gap-2" onClick={() => markWorn(o)}>
                <Check className="h-3.5 w-3.5" /> Mark as Worn
              </Button>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
