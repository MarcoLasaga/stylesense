import { useMemo, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import { getWardrobe, toggleFavoriteItem, setLaundryStatus, updateWardrobeItem, deleteWardrobeItem } from '@/lib/store';
import { ALL_LAUNDRY, ALL_SEASONS, LaundryStatus, SeasonTag } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Heart, Trash2, Calendar, TrendingUp, Sparkles, Trophy, Hourglass, Tag, DollarSign } from 'lucide-react';
import { LaundryBadge, SeasonTags, categoryGuessSeasons, OccasionChip } from '@/components/ClothingMetaTags';
import { toast } from 'sonner';

function timeAgo(ts?: number) {
  if (!ts) return 'Never';
  const days = Math.floor((Date.now() - ts) / 86400000);
  if (days <= 0) return 'Today';
  if (days === 1) return 'Yesterday';
  if (days < 30) return `${days}d ago`;
  if (days < 365) return `${Math.floor(days / 30)}mo ago`;
  return `${Math.floor(days / 365)}y ago`;
}

export default function ClothingDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [, refresh] = useState(0);
  const wardrobe = getWardrobe();
  const item = wardrobe.find(i => i.id === id);
  const isMostWorn = useMemo(() => {
    if (!item) return false;
    const max = Math.max(...wardrobe.map(i => i.wornCount));
    return item.wornCount === max && max > 0;
  }, [wardrobe, item]);
  const isLeastWorn = useMemo(() => {
    if (!item) return false;
    const min = Math.min(...wardrobe.map(i => i.wornCount));
    return item.wornCount === min;
  }, [wardrobe, item]);

  if (!item) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-4 pt-24 pb-16 text-center">
          <p className="text-muted-foreground mb-4">Item not found.</p>
          <Link to="/wardrobe"><Button variant="outline">Back to Wardrobe</Button></Link>
        </div>
      </div>
    );
  }

  const seasons = categoryGuessSeasons(item);
  const costPerWear = item.cost && item.wornCount > 0 ? (item.cost / item.wornCount) : null;

  const stats = [
    { label: 'Times Worn', value: item.wornCount, Icon: TrendingUp },
    { label: 'Last Worn', value: timeAgo(item.lastWorn), Icon: Calendar },
    { label: 'Date Added', value: new Date(item.addedAt).toLocaleDateString(), Icon: Sparkles },
    { label: 'Cost / Wear', value: costPerWear !== null ? `$${costPerWear.toFixed(2)}` : '—', Icon: DollarSign },
  ];

  const toggleSeason = (s: SeasonTag) => {
    const next = new Set(item.seasons ?? seasons);
    next.has(s) ? next.delete(s) : next.add(s);
    updateWardrobeItem({ ...item, seasons: Array.from(next) });
    refresh(v => v + 1);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 pt-24 pb-16 max-w-5xl">
        <Link to="/wardrobe" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground mb-6">
          <ArrowLeft className="h-4 w-4" /> Back to wardrobe
        </Link>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Image */}
          <div className="relative aspect-[3/4] bg-secondary rounded-2xl overflow-hidden">
            {item.image ? (
              <img src={item.image} alt={item.name} className="h-full w-full object-cover" />
            ) : (
              <div className="h-full w-full flex items-center justify-center">
                <div className="w-20 h-20 rounded-full border-4 border-border" style={{ backgroundColor: item.colorHex }} />
              </div>
            )}
            <button
              onClick={() => { toggleFavoriteItem(item.id); refresh(v => v + 1); }}
              className={`absolute top-3 right-3 p-2.5 rounded-full backdrop-blur-md transition ${
                item.favorite ? 'bg-accent text-accent-foreground' : 'bg-background/80 hover:bg-background'
              }`}
            >
              <Heart className={`h-5 w-5 ${item.favorite ? 'fill-current' : ''}`} />
            </button>
          </div>

          {/* Right column */}
          <div className="space-y-6">
            <div>
              <p className="text-xs uppercase tracking-widest text-muted-foreground mb-1">{item.category}</p>
              <h1 className="font-display text-4xl mb-2">{item.name}</h1>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="inline-flex items-center gap-1.5 text-sm">
                  <span className="w-3.5 h-3.5 rounded-full border border-border" style={{ backgroundColor: item.colorHex }} />
                  {item.color}
                </span>
                <span className="text-muted-foreground">·</span>
                <span className="text-sm capitalize">{item.fabric}</span>
                <span className="text-muted-foreground">·</span>
                <span className="text-sm">Size {item.size}</span>
                {item.brand && (<><span className="text-muted-foreground">·</span><span className="text-sm">{item.brand}</span></>)}
              </div>
            </div>

            {/* Tags row */}
            <div className="flex flex-wrap gap-2 items-center">
              <OccasionChip value={item.occasion} />
              <span className="text-[10px] uppercase tracking-widest font-medium bg-secondary px-2 py-0.5 rounded-full capitalize">{item.style}</span>
              <LaundryBadge status={item.laundryStatus} />
              {item.favorite && (
                <span className="inline-flex items-center gap-1 rounded-full bg-accent/10 text-accent text-[10px] px-2 py-0.5 border border-accent/20">
                  <Heart className="h-2.5 w-2.5 fill-current" /> Favorite
                </span>
              )}
              {isMostWorn && (
                <span className="inline-flex items-center gap-1 rounded-full bg-accent/15 text-accent text-[10px] px-2 py-0.5"><Trophy className="h-2.5 w-2.5" /> Most Worn</span>
              )}
              {isLeastWorn && item.wornCount === 0 && (
                <span className="inline-flex items-center gap-1 rounded-full bg-muted text-muted-foreground text-[10px] px-2 py-0.5"><Hourglass className="h-2.5 w-2.5" /> Least Worn</span>
              )}
            </div>

            {/* Insights */}
            <div>
              <p className="text-[10px] uppercase tracking-widest text-muted-foreground mb-2">Insights</p>
              <div className="grid grid-cols-2 gap-2">
                {stats.map(s => (
                  <div key={s.label} className="bg-card border border-border rounded-xl p-3">
                    <div className="flex items-center gap-1.5 text-[10px] uppercase tracking-widest text-muted-foreground mb-1">
                      <s.Icon className="h-3 w-3" /> {s.label}
                    </div>
                    <div className="font-display text-xl">{s.value}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Laundry status selector */}
            <div>
              <p className="text-[10px] uppercase tracking-widest text-muted-foreground mb-2">Laundry Status</p>
              <div className="flex gap-2 flex-wrap">
                {ALL_LAUNDRY.map(s => {
                  const active = (item.laundryStatus ?? 'clean') === s;
                  return (
                    <button
                      key={s}
                      onClick={() => { setLaundryStatus(item.id, s); refresh(v => v + 1); toast.success(`Marked as ${s.replace('_',' ')}`); }}
                      className={`text-xs px-3 py-1.5 rounded-full border transition-colors capitalize ${
                        active ? 'bg-accent text-accent-foreground border-accent' : 'border-border hover:bg-secondary'
                      }`}
                    >
                      {s.replace('_', ' ')}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Season toggles */}
            <div>
              <p className="text-[10px] uppercase tracking-widest text-muted-foreground mb-2">Season Compatibility</p>
              <div className="flex gap-2 flex-wrap">
                {ALL_SEASONS.map(s => {
                  const current = item.seasons ?? seasons;
                  const active = current.includes(s);
                  return (
                    <button
                      key={s}
                      onClick={() => toggleSeason(s)}
                      className={`text-xs px-3 py-1.5 rounded-full border transition-colors capitalize ${
                        active ? 'bg-accent/10 text-accent border-accent/40' : 'border-border hover:bg-secondary'
                      }`}
                    >
                      {s.replace('_', ' ')}
                    </button>
                  );
                })}
              </div>
              <div className="mt-2"><SeasonTags seasons={item.seasons ?? seasons} /></div>
            </div>

            <div className="flex gap-2 pt-2">
              <Button
                variant="outline"
                className="gap-2 text-destructive border-destructive/40 hover:bg-destructive/5"
                onClick={() => { deleteWardrobeItem(item.id); toast.success('Item removed'); navigate('/wardrobe'); }}
              >
                <Trash2 className="h-4 w-4" /> Remove
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
