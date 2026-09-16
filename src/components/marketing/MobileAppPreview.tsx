import { CalendarDays, CloudSun, Heart, Shirt } from 'lucide-react';

export default function MobileAppPreview({ compact = false }: { compact?: boolean }) {
  return (
    <div className={`relative mx-auto ${compact ? 'w-[250px] sm:w-[276px]' : 'w-[270px] sm:w-[310px]'}`}>
      <div className="absolute -inset-5 rounded-[3.25rem] border border-primary/45" aria-hidden="true" />
      <div className="relative overflow-hidden rounded-[2.65rem] border-[8px] border-foreground bg-background shadow-editorial">
        <div className="mx-auto mt-2 h-5 w-24 rounded-full bg-foreground" />
        <div className="p-4 sm:p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-muted-foreground">Tuesday · 27°</p>
              <h3 className="mt-1 font-display text-xl">Good morning, Mika</h3>
            </div>
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary"><CloudSun className="h-4 w-4" /></div>
          </div>
          <div className="mt-5 bg-fashion-cream-deep p-3">
            <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-secondary">Today’s recommendation</p>
            <div className="mt-3 grid grid-cols-3 gap-2">
              <div className="aspect-[3/4] bg-fashion-rose/55" />
              <div className="aspect-[3/4] bg-primary/65" />
              <div className="aspect-[3/4] bg-secondary/25" />
            </div>
            <p className="mt-3 text-xs font-bold">Warm, polished, no recent repeats</p>
          </div>
          <div className="mt-4 grid grid-cols-3 border-y border-border py-3 text-center">
            <div><Shirt className="mx-auto h-4 w-4 text-secondary" /><span className="mt-1 block text-[9px]">Wardrobe</span></div>
            <div><Heart className="mx-auto h-4 w-4 text-secondary" /><span className="mt-1 block text-[9px]">Outfits</span></div>
            <div><CalendarDays className="mx-auto h-4 w-4 text-secondary" /><span className="mt-1 block text-[9px]">Planner</span></div>
          </div>
          <div className="mt-4 rounded-full bg-primary py-2.5 text-center text-xs font-bold text-primary-foreground">Save this outfit</div>
        </div>
      </div>
    </div>
  );
}