import { useEffect, useState } from 'react';
import Navbar from '@/components/Navbar';
import { fetchFeed, toggleLike, toggleSave, rateOutfit, isCloudSignedIn } from '@/lib/socialStore';
import { SharedOutfit } from '@/lib/types';
import { Heart, Bookmark, Star, Shirt, MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { toast } from 'sonner';

/**
 * Social Outfit Feed — the online community layer.
 * Posted outfits, likes, ratings, and saves all flow into the
 * collaborative-filtering & trend-aware recommendation layers.
 */
export default function Feed() {
  const [feed, setFeed] = useState<SharedOutfit[]>([]);
  const [loading, setLoading] = useState(true);
  const [signedIn, setSignedIn] = useState(false);

  const load = async () => {
    setLoading(true);
    setSignedIn(await isCloudSignedIn());
    setFeed(await fetchFeed());
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const handleLike = async (o: SharedOutfit) => {
    if (!signedIn) { toast.error('Sign in to like outfits'); return; }
    setFeed(f => f.map(x => x.id === o.id ? {
      ...x,
      liked_by_me: !x.liked_by_me,
      like_count: x.like_count + (x.liked_by_me ? -1 : 1),
    } : x));
    await toggleLike(o.id, !!o.liked_by_me);
  };

  const handleSave = async (o: SharedOutfit) => {
    if (!signedIn) { toast.error('Sign in to save outfits'); return; }
    setFeed(f => f.map(x => x.id === o.id ? {
      ...x, saved_by_me: !x.saved_by_me,
      save_count: x.save_count + (x.saved_by_me ? -1 : 1),
    } : x));
    await toggleSave(o.id, !!o.saved_by_me);
  };

  const handleRate = async (o: SharedOutfit, value: number) => {
    if (!signedIn) { toast.error('Sign in to rate outfits'); return; }
    await rateOutfit(o.id, value);
    toast.success(`Rated ${value} ★`);
    load();
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 pt-24 pb-16 max-w-2xl">
        <div className="flex items-end justify-between mb-8">
          <div>
            <h1 className="font-display text-4xl mb-1">Community Feed</h1>
            <p className="text-muted-foreground text-sm">
              Outfits from the StyleSense community — likes &amp; ratings shape your recommendations
            </p>
          </div>
          <Link to="/outfits"><Button size="sm" className="rounded-full">Share Outfit</Button></Link>
        </div>

        {loading && <p className="text-sm text-muted-foreground">Loading…</p>}

        {!loading && feed.length === 0 && (
          <div className="text-center py-20 border border-dashed border-border rounded-2xl bg-card">
            <div className="w-14 h-14 rounded-2xl bg-accent/10 text-accent flex items-center justify-center mx-auto mb-4">
              <Shirt className="h-7 w-7" />
            </div>
            <p className="font-display text-xl mb-1">No outfits posted yet</p>
            <p className="text-sm text-muted-foreground mb-5">Be the first to share a look from your wardrobe</p>
            <Link to="/outfits"><Button className="rounded-full">Generate an outfit</Button></Link>
          </div>
        )}

        <div className="space-y-6">
          {feed.map((o, i) => (
            <motion.article
              key={o.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.04 }}
              className="bg-card border border-border rounded-2xl overflow-hidden shadow-sm"
            >
              <div className="flex items-center gap-3 p-5">
                <Avatar className="h-11 w-11 ring-1 ring-border">
                  {o.avatar_url && <AvatarImage src={o.avatar_url} alt={o.display_name} />}
                  <AvatarFallback className="bg-primary text-primary-foreground font-display">
                    {o.avatar_initial}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold truncate">{o.display_name}</p>
                  <p className="text-[10px] uppercase tracking-widest text-muted-foreground">
                    {o.style} · {o.occasion}
                  </p>
                </div>
                <span className="text-[10px] text-muted-foreground">
                  {new Date(o.created_at).toLocaleDateString()}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-1 bg-muted/30">
                {o.items.slice(0, 4).map((it, idx) => (
                  <div key={idx} className="aspect-square bg-background flex items-center justify-center overflow-hidden">
                    {it.image ? (
                      <img src={it.image} alt={it.name} className="w-full h-full object-cover" loading="lazy" />
                    ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center text-xs text-muted-foreground capitalize p-2 text-center gap-2">
                        <Shirt className="h-6 w-6 opacity-50" />
                        {it.name}
                      </div>
                    )}
                  </div>
                ))}
              </div>

              <div className="p-5">
                <p className="font-display text-lg mb-1">{o.name}</p>
                {o.caption && <p className="text-sm text-muted-foreground mb-4">{o.caption}</p>}

                <div className="flex flex-wrap gap-1.5 mb-4">
                  <span className="text-[10px] px-2.5 py-1 bg-secondary rounded-full capitalize">{o.style}</span>
                  <span className="text-[10px] px-2.5 py-1 bg-secondary rounded-full capitalize">{o.occasion}</span>
                </div>

                <div className="flex items-center gap-1 mb-4">
                  {[1, 2, 3, 4, 5].map(n => (
                    <button
                      key={n}
                      onClick={() => handleRate(o, n)}
                      className="p-0.5"
                      aria-label={`Rate ${n} stars`}
                    >
                      <Star
                        className={`h-5 w-5 transition-colors ${
                          (o.my_rating ?? 0) >= n ? 'fill-accent text-accent' : 'text-muted-foreground'
                        }`}
                      />
                    </button>
                  ))}
                  <span className="text-xs text-muted-foreground ml-2">
                    {o.rating_avg ? `${Number(o.rating_avg).toFixed(1)} avg` : 'Not rated'}{' '}
                    {o.rating_count > 0 && `(${o.rating_count})`}
                  </span>
                </div>

                <div className="flex items-center gap-5 pt-4 border-t border-border">
                  <button
                    onClick={() => handleLike(o)}
                    className={`flex items-center gap-2 text-sm font-medium transition-colors ${
                      o.liked_by_me ? 'text-accent' : 'text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    <Heart className={`h-5 w-5 ${o.liked_by_me ? 'fill-accent' : ''}`} />
                    {o.like_count}
                  </button>
                  <button
                    onClick={() => handleSave(o)}
                    className={`flex items-center gap-2 text-sm font-medium transition-colors ${
                      o.saved_by_me ? 'text-accent' : 'text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    <Bookmark className={`h-5 w-5 ${o.saved_by_me ? 'fill-accent' : ''}`} />
                    {o.save_count}
                  </button>
                  <button
                    className="flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                    aria-label="Comments coming soon"
                  >
                    <MessageCircle className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </div>
  );
}
