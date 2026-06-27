import { useState, useMemo, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import WardrobeCard from '@/components/WardrobeCard';
import { getWardrobe, addWardrobeItem, deleteWardrobeItem, getProfile } from '@/lib/store';
import { WardrobeItem, ClothingCategory, StyleType, OccasionType, SeasonTag, ALL_SEASONS } from '@/lib/types';
import { sampleWardrobe } from '@/data/sampleWardrobe';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, Plus, Download, Shirt, SlidersHorizontal, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import { toast } from 'sonner';
import { categoryGuessSeasons } from '@/components/ClothingMetaTags';

const categories: (ClothingCategory | 'all')[] = ['all', 'top', 'bottom', 'shoes', 'outerwear', 'accessories'];
const styleFilters: (StyleType | 'all')[] = ['all', 'casual', 'formal', 'sporty', 'streetwear', 'minimalist', 'classic'];
const occasionFilters: (OccasionType | 'all')[] = ['all', 'school', 'work', 'gym', 'party', 'date', 'outdoor', 'everyday'];
const sortOptions = ['recent', 'most_worn', 'oldest'] as const;
type SortOption = typeof sortOptions[number];

export default function Wardrobe() {
  const [items, setItems] = useState<WardrobeItem[]>([]);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState<string>('all');
  const [style, setStyle] = useState<string>('all');
  const [occasion, setOccasion] = useState<string>('all');
  const [season, setSeason] = useState<SeasonTag | 'all'>('all');
  const [color, setColor] = useState<string>('all');
  const [brand, setBrand] = useState<string>('all');
  const [favoritesOnly, setFavoritesOnly] = useState(false);
  const [sort, setSort] = useState<SortOption>('recent');
  const [showFilters, setShowFilters] = useState(true);

  useEffect(() => { setItems(getWardrobe()); }, []);

  const colors = useMemo(() => Array.from(new Set(items.map(i => i.color))).sort(), [items]);
  const brands = useMemo(() => Array.from(new Set(items.map(i => i.brand).filter(Boolean) as string[])).sort(), [items]);

  const loadSamples = () => {
    const profile = getProfile();
    sampleWardrobe.forEach(item => {
      addWardrobeItem({ ...item, userId: profile.id, id: 'sample_' + Math.random().toString(36).slice(2) });
    });
    setItems(getWardrobe());
    toast.success('Sample wardrobe loaded!');
  };

  const handleDelete = (id: string) => {
    deleteWardrobeItem(id);
    setItems(getWardrobe());
    toast.success('Item removed');
  };

  const filtered = useMemo(() => {
    let list = items.filter(item => {
      if (category !== 'all' && item.category !== category) return false;
      if (style !== 'all' && item.style !== style) return false;
      if (occasion !== 'all' && item.occasion !== occasion) return false;
      if (color !== 'all' && item.color !== color) return false;
      if (brand !== 'all' && item.brand !== brand) return false;
      if (favoritesOnly && !item.favorite) return false;
      if (season !== 'all') {
        const s = item.seasons ?? categoryGuessSeasons(item);
        if (!s.includes(season) && !s.includes('all_season')) return false;
      }
      if (search && !item.name.toLowerCase().includes(search.toLowerCase())) return false;
      return true;
    });
    if (sort === 'recent') list = list.sort((a, b) => b.addedAt - a.addedAt);
    if (sort === 'oldest') list = list.sort((a, b) => a.addedAt - b.addedAt);
    if (sort === 'most_worn') list = list.sort((a, b) => b.wornCount - a.wornCount);
    return list;
  }, [items, search, category, style, occasion, season, color, brand, favoritesOnly, sort]);

  const resetFilters = () => {
    setCategory('all'); setStyle('all'); setOccasion('all'); setSeason('all');
    setColor('all'); setBrand('all'); setFavoritesOnly(false); setSearch(''); setSort('recent');
  };

  const activeCount = [category, style, occasion, season, color, brand].filter(v => v !== 'all').length + (favoritesOnly ? 1 : 0);

  const Chips = ({ options, active, onSelect, capitalize = true }:
    { options: readonly string[]; active: string; onSelect: (v: string) => void; capitalize?: boolean }) => (
    <div className="flex flex-wrap gap-1.5">
      {options.map(opt => (
        <button
          key={opt}
          onClick={() => onSelect(opt)}
          className={`text-xs px-3 py-1.5 rounded-full transition-colors ${capitalize ? 'capitalize' : ''} ${
            active === opt ? 'bg-accent text-accent-foreground' : 'bg-secondary text-secondary-foreground hover:bg-secondary/70'
          }`}
        >
          {opt.replace('_', ' ')}
        </button>
      ))}
    </div>
  );

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 pt-24 pb-16">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-display font-bold mb-1">My Wardrobe</h1>
            <p className="text-muted-foreground text-sm">{filtered.length} of {items.length} items</p>
          </div>
          <div className="flex gap-2">
            {items.length === 0 && (
              <Button variant="outline" size="sm" className="gap-2" onClick={loadSamples}>
                <Download className="h-3.5 w-3.5" /> Load Samples
              </Button>
            )}
            <Link to="/upload">
              <Button size="sm" className="gap-2">
                <Plus className="h-3.5 w-3.5" /> Add Clothes
              </Button>
            </Link>
          </div>
        </div>

        {/* Search bar + filter toggle */}
        <div className="flex items-center gap-2 mb-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search your wardrobe..." value={search} onChange={e => setSearch(e.target.value)} className="pl-10 rounded-full" />
          </div>
          <Button
            variant={showFilters ? 'default' : 'outline'}
            size="sm" className="gap-2 rounded-full"
            onClick={() => setShowFilters(v => !v)}
          >
            <SlidersHorizontal className="h-3.5 w-3.5" />
            Filters {activeCount > 0 && <span className="ml-1 inline-flex items-center justify-center h-4 min-w-4 px-1 rounded-full bg-accent text-accent-foreground text-[10px]">{activeCount}</span>}
          </Button>
          {activeCount > 0 && (
            <Button variant="ghost" size="sm" className="gap-1 text-muted-foreground" onClick={resetFilters}>
              <X className="h-3 w-3" /> Clear
            </Button>
          )}
        </div>

        {/* Filter panel */}
        {showFilters && (
          <div className="bg-card border border-border rounded-2xl p-5 mb-8 space-y-4">
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setFavoritesOnly(v => !v)}
                className={`text-xs px-3 py-1.5 rounded-full transition-colors ${
                  favoritesOnly ? 'bg-accent text-accent-foreground' : 'bg-secondary hover:bg-secondary/70'
                }`}
              >❤ Favorites</button>
              {sortOptions.map(s => (
                <button
                  key={s}
                  onClick={() => setSort(s)}
                  className={`text-xs px-3 py-1.5 rounded-full capitalize transition-colors ${
                    sort === s ? 'bg-primary text-primary-foreground' : 'bg-secondary hover:bg-secondary/70'
                  }`}
                >{s.replace('_', ' ')}</button>
              ))}
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <p className="text-[10px] uppercase tracking-widest text-muted-foreground mb-1.5">Category</p>
                <Chips options={categories} active={category} onSelect={setCategory} />
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-widest text-muted-foreground mb-1.5">Style</p>
                <Chips options={styleFilters} active={style} onSelect={setStyle} />
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-widest text-muted-foreground mb-1.5">Occasion</p>
                <Chips options={occasionFilters} active={occasion} onSelect={setOccasion} />
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-widest text-muted-foreground mb-1.5">Season</p>
                <Chips options={['all', ...ALL_SEASONS]} active={season} onSelect={(v) => setSeason(v as SeasonTag | 'all')} />
              </div>
              {colors.length > 0 && (
                <div>
                  <p className="text-[10px] uppercase tracking-widest text-muted-foreground mb-1.5">Color</p>
                  <Chips options={['all', ...colors]} active={color} onSelect={setColor} capitalize={false} />
                </div>
              )}
              {brands.length > 0 && (
                <div>
                  <p className="text-[10px] uppercase tracking-widest text-muted-foreground mb-1.5">Brand</p>
                  <Chips options={['all', ...brands]} active={brand} onSelect={setBrand} capitalize={false} />
                </div>
              )}
            </div>
          </div>
        )}

        {/* Grid */}
        {filtered.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {filtered.map((item, i) => (
              <WardrobeCard key={item.id} item={item} index={i} onDelete={handleDelete} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <div className="w-16 h-16 rounded-2xl bg-accent/10 text-accent flex items-center justify-center mx-auto mb-4">
              <Shirt className="h-8 w-8" />
            </div>
            <h3 className="font-display text-2xl mb-2">
              {items.length === 0 ? 'Your wardrobe is empty' : 'No items match your filters'}
            </h3>
            <p className="text-sm text-muted-foreground mb-6">
              {items.length === 0 ? 'Start by uploading your clothes or loading sample items.' : 'Try clearing filters or broadening your search.'}
            </p>
            <div className="flex gap-3 justify-center">
              {items.length === 0 && (
                <Button variant="outline" onClick={loadSamples} className="gap-2">
                  <Download className="h-4 w-4" /> Load Samples
                </Button>
              )}
              <Link to="/upload">
                <Button className="gap-2"><Plus className="h-4 w-4" /> Upload Clothes</Button>
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
