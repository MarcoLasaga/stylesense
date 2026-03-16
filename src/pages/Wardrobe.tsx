import { useState, useMemo, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import WardrobeCard from '@/components/WardrobeCard';
import { getWardrobe, addWardrobeItem, deleteWardrobeItem, getProfile } from '@/lib/store';
import { WardrobeItem, ClothingCategory, StyleType, OccasionType } from '@/lib/types';
import { sampleWardrobe } from '@/data/sampleWardrobe';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, Plus, Download } from 'lucide-react';
import { Link } from 'react-router-dom';
import { toast } from 'sonner';

const categories: (ClothingCategory | 'all')[] = ['all', 'top', 'bottom', 'shoes', 'outerwear', 'accessories'];
const styleFilters: (StyleType | 'all')[] = ['all', 'casual', 'formal', 'sporty', 'streetwear', 'minimalist', 'classic'];

export default function Wardrobe() {
  const [items, setItems] = useState<WardrobeItem[]>([]);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState<string>('all');
  const [style, setStyle] = useState<string>('all');

  useEffect(() => {
    setItems(getWardrobe());
  }, []);

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
    return items.filter(item => {
      if (category !== 'all' && item.category !== category) return false;
      if (style !== 'all' && item.style !== style) return false;
      if (search && !item.name.toLowerCase().includes(search.toLowerCase())) return false;
      return true;
    });
  }, [items, search, category, style]);

  const Chips = ({ options, active, onSelect }: { options: string[]; active: string; onSelect: (v: string) => void }) => (
    <div className="flex flex-wrap gap-2">
      {options.map(opt => (
        <button
          key={opt}
          onClick={() => onSelect(opt)}
          className={`text-xs px-3 py-1.5 rounded-sm capitalize transition-colors ${
            active === opt ? 'bg-primary text-primary-foreground' : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
          }`}
        >
          {opt}
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
            <p className="text-muted-foreground text-sm">{items.length} items in your closet</p>
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

        {/* Search & Filters */}
        <div className="space-y-3 mb-8">
          <div className="relative max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search your wardrobe..." value={search} onChange={e => setSearch(e.target.value)} className="pl-10" />
          </div>
          <div className="flex flex-col sm:flex-row gap-4">
            <div>
              <p className="text-[10px] uppercase tracking-widest text-muted-foreground mb-1.5">Category</p>
              <Chips options={categories} active={category} onSelect={setCategory} />
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-widest text-muted-foreground mb-1.5">Style</p>
              <Chips options={styleFilters} active={style} onSelect={setStyle} />
            </div>
          </div>
        </div>

        {/* Grid */}
        {filtered.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {filtered.map((item, i) => (
              <WardrobeCard key={item.id} item={item} index={i} onDelete={handleDelete} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <p className="text-4xl mb-4">👗</p>
            <h3 className="text-lg font-display font-semibold mb-2">Your wardrobe is empty</h3>
            <p className="text-sm text-muted-foreground mb-6">Start by uploading your clothes or loading sample items.</p>
            <div className="flex gap-3 justify-center">
              <Button variant="outline" onClick={loadSamples} className="gap-2">
                <Download className="h-4 w-4" /> Load Samples
              </Button>
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
