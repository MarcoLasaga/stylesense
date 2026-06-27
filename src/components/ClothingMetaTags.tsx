import { WardrobeItem, LaundryStatus, SeasonTag } from '@/lib/types';
import { Droplets, WashingMachine, Sparkles, Sun, Snowflake, CloudRain, Leaf, Heart } from 'lucide-react';

const LAUNDRY_META: Record<LaundryStatus, { label: string; cls: string; Icon: typeof Sparkles }> = {
  clean: { label: 'Clean', cls: 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border-emerald-500/30', Icon: Sparkles },
  needs_washing: { label: 'Needs Wash', cls: 'bg-amber-500/15 text-amber-700 dark:text-amber-400 border-amber-500/30', Icon: Droplets },
  in_laundry: { label: 'In Laundry', cls: 'bg-sky-500/15 text-sky-700 dark:text-sky-400 border-sky-500/30', Icon: WashingMachine },
};

const SEASON_META: Record<SeasonTag, { label: string; Icon: typeof Sun }> = {
  spring: { label: 'Spring', Icon: Leaf },
  summer: { label: 'Summer', Icon: Sun },
  rainy: { label: 'Rainy', Icon: CloudRain },
  winter: { label: 'Winter', Icon: Snowflake },
  all_season: { label: 'All Season', Icon: Sparkles },
};

export function LaundryBadge({ status, size = 'sm' }: { status?: LaundryStatus; size?: 'xs' | 'sm' }) {
  const s = status ?? 'clean';
  const meta = LAUNDRY_META[s];
  const dim = size === 'xs' ? 'text-[9px] px-1.5 py-0.5' : 'text-[10px] px-2 py-0.5';
  return (
    <span className={`inline-flex items-center gap-1 rounded-full border font-medium ${dim} ${meta.cls}`}>
      <meta.Icon className="h-2.5 w-2.5" />
      {meta.label}
    </span>
  );
}

export function SeasonTags({ seasons }: { seasons?: SeasonTag[] }) {
  if (!seasons || seasons.length === 0) return null;
  return (
    <div className="flex flex-wrap gap-1">
      {seasons.map(t => {
        const m = SEASON_META[t];
        return (
          <span key={t} className="inline-flex items-center gap-1 rounded-full bg-secondary text-secondary-foreground text-[10px] px-2 py-0.5">
            <m.Icon className="h-2.5 w-2.5" /> {m.label}
          </span>
        );
      })}
    </div>
  );
}

export function FavoriteHeart({ active, onClick, size = 16 }: { active?: boolean; onClick?: (e: React.MouseEvent) => void; size?: number }) {
  return (
    <button
      onClick={onClick}
      className={`p-1.5 rounded-full backdrop-blur-sm transition-colors ${
        active ? 'bg-accent text-accent-foreground' : 'bg-background/80 text-muted-foreground hover:text-accent'
      }`}
      aria-label={active ? 'Remove favorite' : 'Add to favorites'}
    >
      <Heart className={active ? 'fill-current' : ''} style={{ width: size, height: size }} />
    </button>
  );
}

export function OccasionChip({ value }: { value: string }) {
  return (
    <span className="inline-flex items-center text-[10px] uppercase tracking-widest font-medium bg-accent/10 text-accent border border-accent/20 px-2 py-0.5 rounded-full capitalize">
      {value}
    </span>
  );
}

export function categoryGuessSeasons(item: WardrobeItem): SeasonTag[] {
  if (item.seasons?.length) return item.seasons;
  if (item.category === 'outerwear') return ['winter', 'rainy'];
  if (item.fabric === 'wool' || item.fabric === 'leather') return ['winter'];
  if (item.fabric === 'linen' || item.fabric === 'silk') return ['summer', 'spring'];
  return ['all_season'];
}
