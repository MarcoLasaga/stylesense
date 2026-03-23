import { useState } from 'react';
import AdminLayout from '@/components/AdminLayout';
import { getAllWardrobeItems, updateWardrobeItem, deleteWardrobeItem } from '@/lib/store';
import { WardrobeItem, ClothingCategory, StyleType, OccasionType } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Trash2, Pencil, Search, X, Check } from 'lucide-react';
import { toast } from 'sonner';

const categories: ClothingCategory[] = ['top', 'bottom', 'shoes', 'outerwear', 'accessories'];
const styles: StyleType[] = ['casual', 'formal', 'sporty', 'streetwear', 'minimalist', 'bohemian', 'vintage', 'classic'];
const occasions: OccasionType[] = ['school', 'work', 'gym', 'party', 'date', 'outdoor', 'everyday'];

export default function AdminClothes() {
  const [items, setItems] = useState(getAllWardrobeItems());
  const [search, setSearch] = useState('');
  const [filterCat, setFilterCat] = useState<string>('all');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editData, setEditData] = useState<Partial<WardrobeItem>>({});

  const filtered = items.filter(i => {
    const matchSearch = i.name.toLowerCase().includes(search.toLowerCase()) || i.color.toLowerCase().includes(search.toLowerCase());
    const matchCat = filterCat === 'all' || i.category === filterCat;
    return matchSearch && matchCat;
  });

  const startEdit = (item: WardrobeItem) => {
    setEditingId(item.id);
    setEditData({ color: item.color, category: item.category, style: item.style, occasion: item.occasion });
  };

  const saveEdit = (item: WardrobeItem) => {
    const updated = { ...item, ...editData };
    updateWardrobeItem(updated);
    setItems(getAllWardrobeItems());
    setEditingId(null);
    toast.success('Item updated');
  };

  const handleDelete = (id: string) => {
    deleteWardrobeItem(id);
    setItems(getAllWardrobeItems());
    toast.success('Item deleted');
  };

  return (
    <AdminLayout>
      <h1 className="text-3xl font-display font-bold mb-1">Clothing Management</h1>
      <p className="text-muted-foreground text-sm mb-6">View, edit, and manage all uploaded clothing items</p>

      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search by name or color..." className="pl-9" value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <div className="flex gap-2 flex-wrap">
          <button onClick={() => setFilterCat('all')}
            className={`text-xs px-3 py-1.5 rounded-sm transition-colors ${filterCat === 'all' ? 'bg-primary text-primary-foreground' : 'bg-secondary text-secondary-foreground'}`}>
            All
          </button>
          {categories.map(c => (
            <button key={c} onClick={() => setFilterCat(c)}
              className={`text-xs px-3 py-1.5 rounded-sm capitalize transition-colors ${filterCat === c ? 'bg-primary text-primary-foreground' : 'bg-secondary text-secondary-foreground'}`}>
              {c}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-card border border-border rounded-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-secondary/30">
                {['Item', 'Category', 'Color', 'Style', 'Occasion', 'Worn', 'Owner', 'Actions'].map(h => (
                  <th key={h} className="text-left py-3 px-4 text-[10px] uppercase tracking-widest text-muted-foreground">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map(item => (
                <tr key={item.id} className="border-b border-border/50 hover:bg-secondary/20 transition-colors">
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-sm border border-border flex items-center justify-center"
                        style={{ backgroundColor: item.colorHex + '22' }}>
                        <div className="w-4 h-4 rounded-full" style={{ backgroundColor: item.colorHex }} />
                      </div>
                      <span className="font-medium">{item.name}</span>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    {editingId === item.id ? (
                      <select value={editData.category} onChange={e => setEditData({ ...editData, category: e.target.value as ClothingCategory })}
                        className="text-xs bg-secondary border border-border rounded px-2 py-1">
                        {categories.map(c => <option key={c} value={c}>{c}</option>)}
                      </select>
                    ) : <span className="capitalize">{item.category}</span>}
                  </td>
                  <td className="py-3 px-4">
                    {editingId === item.id ? (
                      <Input value={editData.color} onChange={e => setEditData({ ...editData, color: e.target.value })}
                        className="h-7 text-xs w-24" />
                    ) : item.color}
                  </td>
                  <td className="py-3 px-4">
                    {editingId === item.id ? (
                      <select value={editData.style} onChange={e => setEditData({ ...editData, style: e.target.value as StyleType })}
                        className="text-xs bg-secondary border border-border rounded px-2 py-1">
                        {styles.map(s => <option key={s} value={s}>{s}</option>)}
                      </select>
                    ) : <span className="capitalize">{item.style}</span>}
                  </td>
                  <td className="py-3 px-4">
                    {editingId === item.id ? (
                      <select value={editData.occasion} onChange={e => setEditData({ ...editData, occasion: e.target.value as OccasionType })}
                        className="text-xs bg-secondary border border-border rounded px-2 py-1">
                        {occasions.map(o => <option key={o} value={o}>{o}</option>)}
                      </select>
                    ) : <span className="capitalize">{item.occasion}</span>}
                  </td>
                  <td className="py-3 px-4 text-muted-foreground">{item.wornCount}×</td>
                  <td className="py-3 px-4 text-xs text-muted-foreground">{item.userId}</td>
                  <td className="py-3 px-4">
                    <div className="flex gap-1">
                      {editingId === item.id ? (
                        <>
                          <Button variant="ghost" size="icon" className="h-7 w-7 text-green-600" onClick={() => saveEdit(item)}>
                            <Check className="h-3.5 w-3.5" />
                          </Button>
                          <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => setEditingId(null)}>
                            <X className="h-3.5 w-3.5" />
                          </Button>
                        </>
                      ) : (
                        <>
                          <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => startEdit(item)}>
                            <Pencil className="h-3.5 w-3.5" />
                          </Button>
                          <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive hover:text-destructive" onClick={() => handleDelete(item.id)}>
                            <Trash2 className="h-3.5 w-3.5" />
                          </Button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr><td colSpan={8} className="py-8 text-center text-muted-foreground">No items found</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      <p className="text-xs text-muted-foreground mt-3">{filtered.length} item{filtered.length !== 1 ? 's' : ''} shown</p>
    </AdminLayout>
  );
}
