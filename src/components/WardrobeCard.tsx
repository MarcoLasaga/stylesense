import { WardrobeItem } from '@/lib/types';
import { motion } from 'framer-motion';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart, X } from 'lucide-react';
import { LaundryBadge, SeasonTags, categoryGuessSeasons } from './ClothingMetaTags';
import { toggleFavoriteItem } from '@/lib/store';

interface Props {
  item: WardrobeItem;
  index?: number;
  onDelete?: (id: string) => void;
  compact?: boolean;
}

export default function WardrobeCard({ item, index = 0, onDelete, compact }: Props) {
  const [imgError, setImgError] = useState(!item.image);
  const [fav, setFav] = useState(!!item.favorite);

  const handleFav = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const next = toggleFavoriteItem(item.id);
    setFav(next);
  };

  const Inner = (
    <>
      <div className={`relative ${compact ? 'aspect-square' : 'aspect-[3/4]'} overflow-hidden rounded-xl bg-secondary`}>
        {!imgError && item.image ? (
          <img
            src={item.image}
            alt={item.name}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            onError={() => setImgError(true)}
            loading="lazy"
          />
        ) : (
          <div className="h-full w-full flex flex-col items-center justify-center gap-2 p-3">
            <div
              className="w-12 h-12 rounded-full border-2 border-border"
              style={{ backgroundColor: item.colorHex }}
            />
            <span className="text-[10px] uppercase tracking-widest text-muted-foreground">
              {item.category}
            </span>
          </div>
        )}

        {/* Top-left favorite */}
        {!compact && (
          <button
            onClick={handleFav}
            className={`absolute top-2 left-2 p-1.5 rounded-full backdrop-blur-md transition-colors ${
              fav ? 'bg-accent text-accent-foreground' : 'bg-background/80 text-muted-foreground hover:text-accent opacity-0 group-hover:opacity-100'
            } ${fav ? 'opacity-100' : ''}`}
            aria-label={fav ? 'Unfavorite' : 'Favorite'}
          >
            <Heart className={`h-3.5 w-3.5 ${fav ? 'fill-current' : ''}`} />
          </button>
        )}

        {/* Delete */}
        {onDelete && (
          <button
            onClick={(e) => { e.preventDefault(); e.stopPropagation(); onDelete(item.id); }}
            className="absolute top-2 right-2 p-1.5 rounded-full bg-destructive/90 text-destructive-foreground opacity-0 group-hover:opacity-100 transition-opacity"
            aria-label="Delete"
          >
            <X className="h-3 w-3" />
          </button>
        )}

        {/* Laundry badge bottom-right */}
        {!compact && (
          <div className="absolute top-2 right-9 opacity-0 group-hover:opacity-100 transition-opacity">
            <LaundryBadge status={item.laundryStatus} size="xs" />
          </div>
        )}

        <div className="absolute bottom-2 left-2 right-2 flex gap-1 flex-wrap">
          <span className="text-[9px] uppercase tracking-widest font-medium bg-background/80 backdrop-blur-sm px-1.5 py-0.5 rounded-full">
            {item.style}
          </span>
          <span className="text-[9px] uppercase tracking-widest font-medium bg-accent/90 text-accent-foreground px-1.5 py-0.5 rounded-full">
            {item.occasion}
          </span>
        </div>
      </div>

      {!compact && (
        <div className="mt-2 space-y-1">
          <h3 className="text-sm font-medium leading-tight truncate">{item.name}</h3>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full border border-border" style={{ backgroundColor: item.colorHex }} />
            <span className="text-xs text-muted-foreground truncate">{item.color} · {item.fabric}</span>
          </div>
          <SeasonTags seasons={item.seasons ?? categoryGuessSeasons(item)} />
        </div>
      )}
    </>
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: index * 0.04 }}
      className="group relative"
    >
      {compact ? Inner : <Link to={`/wardrobe/${item.id}`} className="block">{Inner}</Link>}
    </motion.div>
  );
}
