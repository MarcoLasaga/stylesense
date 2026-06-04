import { useState, useMemo, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import WardrobeCard from '@/components/WardrobeCard';
import { getWardrobe, getProfile, saveOutfit as saveOutfitToStore } from '@/lib/store';
import { generateOutfits, randomOutfit } from '@/lib/recommendation';
import { GeneratedOutfit, OccasionType, WeatherContext } from '@/lib/types';
import { getWeatherCached } from '@/lib/weather';
import { computeTrendSnapshot, TrendSnapshot } from '@/lib/trends';
import { getSocialAffinity, postOutfit } from '@/lib/socialStore';
import { recordFeedback } from '@/lib/feedback';
import RecommendationBreakdownPanel from '@/components/RecommendationBreakdownPanel';
import { Button } from '@/components/ui/button';
import { RefreshCw, Save, Check, Shuffle, Sparkles, Share2, Cloud, CloudRain, Sun, Snowflake, TrendingUp, Heart, ThumbsDown, Ban } from 'lucide-react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import { Link } from 'react-router-dom';

const occasions: (OccasionType | 'any')[] = ['any', 'school', 'work', 'gym', 'party', 'date', 'outdoor', 'everyday'];

export default function OutfitGenerator() {
  const wardrobe = getWardrobe();
  const profile = getProfile();
  const [occasion, setOccasion] = useState<string>('any');
  const [key, setKey] = useState(0);
  const [savedIds, setSavedIds] = useState<Set<string>>(new Set());
  const [surprise, setSurprise] = useState<GeneratedOutfit | null>(null);
  const [weather, setWeather] = useState<WeatherContext | null>(null);
  const [trends, setTrends] = useState<TrendSnapshot | null>(null);
  const [social, setSocial] = useState<{ styles: Record<string, number>; colors: Record<string, number> }>({ styles: {}, colors: {} });
  const [excludeRecent, setExcludeRecent] = useState(false);
  const [useWeather, setUseWeather] = useState(true);

  useEffect(() => {
    Promise.all([getWeatherCached(), computeTrendSnapshot(), getSocialAffinity()])
      .then(([w, t, s]) => { setWeather(w); setTrends(t); setSocial(s); });
  }, []);

  const outfits = useMemo(() => {
    if (wardrobe.length < 2) return [];
    return generateOutfits(wardrobe, profile, {
      occasion: occasion === 'any' ? undefined : occasion as OccasionType,
      count: 9,
      includeOuterwear: useWeather && weather ? (weather.condition === 'cool' || weather.condition === 'cold' || weather.precipitation === 'rain') : true,
      weather: useWeather ? (weather ?? undefined) : undefined,
      trends: trends ?? undefined,
      socialAffinity: social,
      excludeRecentlyWorn: excludeRecent,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key, occasion, weather, trends, social, excludeRecent, useWeather]);

  const handleSave = (outfit: GeneratedOutfit) => {
    saveOutfitToStore(outfit);
    setSavedIds(prev => new Set(prev).add(outfit.id));
    toast.success('Outfit saved!');
  };

  const handleShare = async (outfit: GeneratedOutfit) => {
    const id = await postOutfit(outfit, '');
    if (id) toast.success('Shared to the community feed!');
    else toast.error('Sign in to share outfits');
  };

  const handleSurprise = () => {
    const r = randomOutfit(wardrobe, profile);
    setSurprise(r);
    if (r) toast('Surprise outfit generated!');
  };

  const WeatherIcon = ({ w }: { w: WeatherContext }) => {
    if (w.precipitation === 'snow') return <Snowflake className="h-4 w-4" />;
    if (w.precipitation === 'rain') return <CloudRain className="h-4 w-4" />;
    if (w.condition === 'hot' || w.condition === 'warm') return <Sun className="h-4 w-4" />;
    return <Cloud className="h-4 w-4" />;
  };

  if (wardrobe.length < 2) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-4 pt-24 pb-16 text-center max-w-lg">
          <div className="w-16 h-16 rounded-2xl bg-accent/10 text-accent flex items-center justify-center mx-auto mb-4">
            <Sparkles className="h-8 w-8" />
          </div>
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
            <p className="text-muted-foreground text-sm">Hybrid recommendations from your wardrobe</p>
          </div>
          <div className="flex gap-2 flex-wrap">
            <Button variant="outline" size="sm" className="gap-2" onClick={handleSurprise}>
              <Shuffle className="h-3.5 w-3.5" /> Surprise Me
            </Button>
            <Button variant="outline" size="sm" className="gap-2" onClick={() => setKey(k => k + 1)}>
              <RefreshCw className="h-3.5 w-3.5" /> Refresh
            </Button>
          </div>
        </div>

        {/* Context bar */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
          {weather && (
            <button
              onClick={() => setUseWeather(v => !v)}
              className={`flex items-center gap-2 p-3 border rounded-sm text-left transition-colors ${
                useWeather ? 'border-accent bg-accent/5' : 'border-border bg-card'
              }`}
            >
              <WeatherIcon w={weather} />
              <div className="flex-1">
                <p className="text-[10px] uppercase tracking-widest text-muted-foreground">Weather Context {useWeather ? '· On' : '· Off'}</p>
                <p className="text-xs font-medium">{weather.tempC}°C · {weather.description}</p>
              </div>
            </button>
          )}
          <button
            onClick={() => setExcludeRecent(v => !v)}
            className={`flex items-center gap-2 p-3 border rounded-sm text-left transition-colors ${
              excludeRecent ? 'border-accent bg-accent/5' : 'border-border bg-card'
            }`}
          >
            <RefreshCw className="h-4 w-4" />
            <div className="flex-1">
              <p className="text-[10px] uppercase tracking-widest text-muted-foreground">Anti-Repetition {excludeRecent ? '· On' : '· Off'}</p>
              <p className="text-xs font-medium">Hide recently-worn items</p>
            </div>
          </button>
        </div>

        {/* Trend pill */}
        {trends && trends.topStyles.length > 0 && (
          <div className="flex items-center gap-2 text-xs text-muted-foreground mb-6">
            <TrendingUp className="h-3.5 w-3.5 text-accent" />
            Trending now: {trends.topStyles.slice(0, 3).map(s => s.value).join(', ')}
          </div>
        )}

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
              <h3 className="font-display font-semibold flex items-center gap-2"><Shuffle className="h-4 w-4" /> Surprise Outfit</h3>
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
                <div className="flex gap-0.5">
                  <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => handleShare(outfit)} title="Share to feed">
                    <Share2 className="h-3.5 w-3.5" />
                  </Button>
                  <Button
                    variant="ghost" size="icon" className="h-7 w-7"
                    onClick={() => handleSave(outfit)}
                    disabled={savedIds.has(outfit.id)}
                  >
                    {savedIds.has(outfit.id) ? <Check className="h-3.5 w-3.5 text-accent" /> : <Save className="h-3.5 w-3.5" />}
                  </Button>
                </div>
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

              <RecommendationBreakdownPanel breakdown={outfit.breakdown} />

              {/* Feedback Learning System */}
              <div className="flex items-center gap-1 mt-3 pt-3 border-t border-border">
                <span className="text-[10px] uppercase tracking-widest text-muted-foreground mr-auto">Feedback</span>
                <Button variant="ghost" size="icon" className="h-7 w-7"
                  title="Love this outfit"
                  onClick={() => { recordFeedback(outfit, 'loved'); toast.success('Thanks — we\'ll show more like this'); }}>
                  <Heart className="h-3.5 w-3.5" />
                </Button>
                <Button variant="ghost" size="icon" className="h-7 w-7"
                  title="Mark as worn"
                  onClick={() => { recordFeedback(outfit, 'wore'); toast('Logged as worn'); }}>
                  <Check className="h-3.5 w-3.5" />
                </Button>
                <Button variant="ghost" size="icon" className="h-7 w-7"
                  title="Not my style"
                  onClick={() => { recordFeedback(outfit, 'disliked'); toast('Got it — adjusting recommendations'); }}>
                  <ThumbsDown className="h-3.5 w-3.5" />
                </Button>
                <Button variant="ghost" size="icon" className="h-7 w-7"
                  title="Never recommend again"
                  onClick={() => { recordFeedback(outfit, 'banned'); toast('This combo won\'t appear again'); setKey(k => k + 1); }}>
                  <Ban className="h-3.5 w-3.5" />
                </Button>
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
