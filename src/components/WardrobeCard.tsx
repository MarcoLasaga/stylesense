import { WardrobeItem } from '@/lib/types';
import { motion } from 'framer-motion';
import { useState } from 'react';

interface Props {
  item: WardrobeItem;
  index?: number;
  onDelete?: (id: string) => void;
  compact?: boolean;
}

export default function WardrobeCard({ item, index = 0, onDelete, compact }: Props) {
  const [imgError, setImgError] = useState(!item.image);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: index * 0.04 }}
      className="group relative"
    >
      <div className={`relative ${compact ? 'aspect-square' : 'aspect-[3/4]'} overflow-hidden rounded-sm bg-secondary`}>
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

        {/* Hover overlay with delete */}
        {onDelete && (
          <button
            onClick={() => onDelete(item.id)}
            className="absolute top-2 right-2 p-1.5 rounded-full bg-destructive/90 text-destructive-foreground opacity-0 group-hover:opacity-100 transition-opacity text-xs"
          >
            ✕
          </button>
        )}

        <div className="absolute bottom-2 left-2 right-2 flex gap-1 flex-wrap">
          <span className="text-[9px] uppercase tracking-widest font-medium bg-background/80 backdrop-blur-sm px-1.5 py-0.5 rounded-sm">
            {item.style}
          </span>
          <span className="text-[9px] uppercase tracking-widest font-medium bg-background/80 backdrop-blur-sm px-1.5 py-0.5 rounded-sm">
            {item.occasion}
          </span>
        </div>
      </div>

      {!compact && (
        <div className="mt-2 space-y-0.5">
          <h3 className="text-sm font-medium leading-tight truncate">{item.name}</h3>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full border border-border" style={{ backgroundColor: item.colorHex }} />
            <span className="text-xs text-muted-foreground">{item.color} · {item.fabric}</span>
          </div>
        </div>
      )}
    </motion.div>
  );
}
