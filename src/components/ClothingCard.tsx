import { ClothingItem } from '@/lib/types';
import { Heart } from 'lucide-react';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { addRating, getProfile } from '@/lib/store';

interface Props {
  item: ClothingItem;
  index?: number;
  showReason?: string;
}

export default function ClothingCard({ item, index = 0, showReason }: Props) {
  const [liked, setLiked] = useState(false);
  const [imgError, setImgError] = useState(false);

  const handleLike = () => {
    setLiked(!liked);
    const profile = getProfile();
    addRating({
      userId: profile.id,
      itemId: item.id,
      rating: liked ? 3 : 5,
      liked: !liked,
      timestamp: Date.now(),
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
      className="group relative"
    >
      <div className="relative aspect-[3/4] overflow-hidden rounded-sm bg-secondary">
        {!imgError ? (
          <img
            src={item.image}
            alt={item.name}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            onError={() => setImgError(true)}
            loading="lazy"
          />
        ) : (
          <div className="h-full w-full flex items-center justify-center bg-secondary">
            <div className="text-center p-4">
              <div className="w-12 h-12 rounded-full mx-auto mb-2 flex items-center justify-center" style={{ backgroundColor: item.colorHex + '33' }}>
                <div className="w-6 h-6 rounded-full" style={{ backgroundColor: item.colorHex }} />
              </div>
              <p className="text-xs text-muted-foreground">{item.category}</p>
            </div>
          </div>
        )}

        {/* Hover overlay */}
        <div className="absolute inset-0 bg-foreground/0 group-hover:bg-foreground/10 transition-colors duration-300" />

        {/* Like button */}
        <button
          onClick={handleLike}
          className="absolute top-3 right-3 p-2 rounded-full bg-background/80 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity"
        >
          <Heart className={`h-4 w-4 ${liked ? 'fill-accent text-accent' : 'text-foreground'}`} />
        </button>

        {/* Category tag */}
        <div className="absolute bottom-3 left-3">
          <span className="text-[10px] uppercase tracking-widest font-medium bg-background/80 backdrop-blur-sm px-2 py-1 rounded-sm">
            {item.occasion}
          </span>
        </div>
      </div>

      <div className="mt-3 space-y-1">
        <h3 className="text-sm font-medium leading-tight">{item.name}</h3>
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">${item.price.toFixed(2)}</p>
          <div className="flex items-center gap-1">
            <span className="text-xs text-fashion-gold">★</span>
            <span className="text-xs text-muted-foreground">{item.rating}</span>
          </div>
        </div>
        {showReason && (
          <p className="text-xs text-accent mt-1 italic">{showReason}</p>
        )}
      </div>
    </motion.div>
  );
}
