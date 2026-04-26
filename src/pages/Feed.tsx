import { useEffect, useState } from 'react';
import Navbar from '@/components/Navbar';
import { fetchFeed, toggleLike, toggleSave, rateOutfit, isCloudSignedIn } from '@/lib/socialStore';
import { SharedOutfit } from '@/lib/types';
import { Heart, Bookmark, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
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
      <div className="container mx-auto px-4 pt-24 pb-16 max-w-3xl">
        <div className="flex items-end justify-between mb-6">
          <div>
            <h1 className="text-3xl font-display font-bold mb-1">Outfit Feed</h1>
            <p className="text-muted-foreground text-sm">Community outfits — likes & ratings power your recommendations</p>
          </div>
          <Link to="/outfits"><Button variant="outline" size="sm">Generate &amp; Share</Button></Link>
        </div>

        {loading && <p className="text-sm text-muted-foreground">Loading…</p>}

        {!loading && feed.length === 0 && (
          <div className="text-center py-16 border border-dashed border-border rounded-sm">
            <p className="text-4xl mb-3">👕</p>
            <p className="font-medium mb-1">No outfits posted yet</p>
            <p className="text-sm text-muted-foreground mb-4">Be the first to share a look from your wardrobe</p>
            <Link to="/outfits"><Button size="sm">Generate an outfit</Button></Link>
          </div>
        )}

        <div className="space-y-6">
          {feed.map((o, i) => (
            <motion.article
              key={o.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.04 }}
              className="bg-card border border-border rounded-sm overflow-hidden"
            >
              <div className="flex items-center gap-3 p-4 border-b border-border">
                <div className="w-9 h-9 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-display font-semibold">
                  {o.avatar_initial}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{o.display_name}</p>
                  <p className="text-[10px] uppercase tracking-widest text-muted-foreground">
                    {o.style} · {o.occasion}
                  </p>
                </div>
                <span className="text-[10px] text-muted-foreground">
                  {new Date(o.created_at).toLocaleDateString()}
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-1 bg-muted/30">
                {o.items.slice(0, 4).map((it, idx) => (
                  <div key={idx} className="aspect-square bg-background flex items-center justify-center overflow-hidden">
                    {it.image ? (
                      <img src={it.image} alt={it.name} className="w-full h-full object-cover" loading="lazy" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-xs text-muted-foreground capitalize p-2 text-center">
                        {it.name}
                      </div>
                    )}
                  </div>
                ))}
              </div>

              <div className="p-4">
                <p className="font-display font-semibold text-sm mb-1">{o.name}</p>
                {o.caption && <p className="text-sm text-muted-foreground mb-3">{o.caption}</p>}

                <div className="flex items-center gap-1 mb-3">
                  {[1, 2, 3, 4, 5].map(n => (
                    <button
                      key={n}
                      onClick={() => handleRate(o, n)}
                      className="p-0.5"
                      aria-label={`Rate ${n} stars`}
                    >
                      <Star
                        className={`h-4 w-4 transition-colors ${
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

                <div className="flex items-center gap-3 pt-2 border-t border-border">
                  <button
                    onClick={() => handleLike(o)}
                    className={`flex items-center gap-1.5 text-xs transition-colors ${
                      o.liked_by_me ? 'text-accent' : 'text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    <Heart className={`h-4 w-4 ${o.liked_by_me ? 'fill-accent' : ''}`} />
                    {o.like_count} {o.like_count === 1 ? 'like' : 'likes'}
                  </button>
                  <button
                    onClick={() => handleSave(o)}
                    className={`flex items-center gap-1.5 text-xs transition-colors ${
                      o.saved_by_me ? 'text-accent' : 'text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    <Bookmark className={`h-4 w-4 ${o.saved_by_me ? 'fill-accent' : ''}`} />
                    {o.save_count} {o.save_count === 1 ? 'save' : 'saves'}
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
