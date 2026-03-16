import { useState, useMemo } from 'react';
import Navbar from '@/components/Navbar';
import ClothingCard from '@/components/ClothingCard';
import { clothingItems } from '@/data/clothing';
import { ClothingCategory, OccasionType, StyleType } from '@/lib/types';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';

const categories: (ClothingCategory | 'all')[] = ['all', 'tops', 'bottoms', 'dresses', 'outerwear', 'shoes', 'accessories', 'activewear'];
const occasions: (OccasionType | 'all')[] = ['all', 'casual', 'formal', 'sports', 'party', 'work', 'date', 'outdoor'];
const colors = ['all', 'Black', 'White', 'Blue', 'Navy', 'Cream', 'Olive', 'Rose', 'Gray', 'Brown', 'Camel', 'Multi', 'Sage', 'Nude', 'Khaki'];

export default function Catalog() {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState<string>('all');
  const [occasion, setOccasion] = useState<string>('all');
  const [color, setColor] = useState<string>('all');

  const filtered = useMemo(() => {
    return clothingItems.filter(item => {
      if (category !== 'all' && item.category !== category) return false;
      if (occasion !== 'all' && item.occasion !== occasion) return false;
      if (color !== 'all' && item.color !== color) return false;
      if (search && !item.name.toLowerCase().includes(search.toLowerCase()) &&
          !item.description.toLowerCase().includes(search.toLowerCase())) return false;
      return true;
    });
  }, [search, category, occasion, color]);

  const FilterChips = ({ items, active, onSelect }: { items: string[]; active: string; onSelect: (v: string) => void }) => (
    <div className="flex flex-wrap gap-2">
      {items.map(item => (
        <button
          key={item}
          onClick={() => onSelect(item)}
          className={`text-xs px-3 py-1.5 rounded-sm capitalize transition-colors ${
            active === item
              ? 'bg-primary text-primary-foreground'
              : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
          }`}
        >
          {item}
        </button>
      ))}
    </div>
  );

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 pt-24 pb-16">
        <div className="mb-8">
          <h1 className="text-3xl font-display font-bold mb-2">Clothing Catalog</h1>
          <p className="text-muted-foreground">Browse our curated collection</p>
        </div>

        {/* Search */}
        <div className="relative mb-6 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search clothing..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Filters */}
        <div className="space-y-4 mb-8">
          <div>
            <p className="text-xs uppercase tracking-wider text-muted-foreground mb-2">Category</p>
            <FilterChips items={categories} active={category} onSelect={setCategory} />
          </div>
          <div>
            <p className="text-xs uppercase tracking-wider text-muted-foreground mb-2">Occasion</p>
            <FilterChips items={occasions} active={occasion} onSelect={setOccasion} />
          </div>
          <div>
            <p className="text-xs uppercase tracking-wider text-muted-foreground mb-2">Color</p>
            <FilterChips items={colors} active={color} onSelect={setColor} />
          </div>
        </div>

        {/* Results */}
        <p className="text-sm text-muted-foreground mb-4">{filtered.length} items</p>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {filtered.map((item, i) => (
            <ClothingCard key={item.id} item={item} index={i} />
          ))}
        </div>
        {filtered.length === 0 && (
          <div className="text-center py-20 text-muted-foreground">
            <p className="text-lg mb-2">No items found</p>
            <p className="text-sm">Try adjusting your filters</p>
          </div>
        )}
      </div>
    </div>
  );
}
