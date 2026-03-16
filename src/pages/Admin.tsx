import { useState } from 'react';
import Navbar from '@/components/Navbar';
import { clothingItems } from '@/data/clothing';
import { ClothingItem, ClothingCategory } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { simulatedUsers } from '@/data/clothing';
import { getRatings } from '@/lib/store';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BarChart3, Package, Users } from 'lucide-react';

export default function Admin() {
  const [items, setItems] = useState(clothingItems);
  const ratings = getRatings();

  // New item form
  const [newItem, setNewItem] = useState({
    name: '', category: 'tops' as ClothingCategory, color: '', fabric: '',
    style: 'casual', occasion: 'casual', price: '', description: '', image: ''
  });

  const handleAddItem = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success('Item added (demo mode - not persisted)');
    setNewItem({ name: '', category: 'tops', color: '', fabric: '', style: 'casual', occasion: 'casual', price: '', description: '', image: '' });
  };

  const totalItems = items.length;
  const totalUsers = simulatedUsers.length + 1;
  const totalRatings = ratings.length;
  const avgRating = items.reduce((sum, i) => sum + i.rating, 0) / items.length;
  const categoryCounts = items.reduce((acc, i) => {
    acc[i.category] = (acc[i.category] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 pt-24 pb-16">
        <h1 className="text-3xl font-display font-bold mb-2">Admin Dashboard</h1>
        <p className="text-muted-foreground mb-8">Manage clothing items, users, and analytics</p>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Total Items', value: totalItems },
            { label: 'Total Users', value: totalUsers },
            { label: 'User Ratings', value: totalRatings },
            { label: 'Avg Rating', value: avgRating.toFixed(1) },
          ].map(stat => (
            <div key={stat.label} className="bg-card border border-border p-4 rounded-sm">
              <p className="text-xs uppercase tracking-wider text-muted-foreground">{stat.label}</p>
              <p className="text-2xl font-display font-bold mt-1">{stat.value}</p>
            </div>
          ))}
        </div>

        <Tabs defaultValue="items">
          <TabsList className="mb-6">
            <TabsTrigger value="items" className="gap-2"><Package className="h-3.5 w-3.5" /> Items</TabsTrigger>
            <TabsTrigger value="users" className="gap-2"><Users className="h-3.5 w-3.5" /> Users</TabsTrigger>
            <TabsTrigger value="analytics" className="gap-2"><BarChart3 className="h-3.5 w-3.5" /> Analytics</TabsTrigger>
          </TabsList>

          <TabsContent value="items">
            {/* Add item form */}
            <div className="bg-card border border-border p-6 rounded-sm mb-6">
              <h3 className="font-display font-semibold mb-4">Add New Item</h3>
              <form onSubmit={handleAddItem} className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <Input placeholder="Name" value={newItem.name} onChange={e => setNewItem({ ...newItem, name: e.target.value })} required />
                <Input placeholder="Color" value={newItem.color} onChange={e => setNewItem({ ...newItem, color: e.target.value })} required />
                <Input placeholder="Fabric" value={newItem.fabric} onChange={e => setNewItem({ ...newItem, fabric: e.target.value })} required />
                <Input placeholder="Price" type="number" value={newItem.price} onChange={e => setNewItem({ ...newItem, price: e.target.value })} required />
                <Input placeholder="Image URL" value={newItem.image} onChange={e => setNewItem({ ...newItem, image: e.target.value })} />
                <Textarea placeholder="Description" value={newItem.description} onChange={e => setNewItem({ ...newItem, description: e.target.value })} className="col-span-2 md:col-span-3" />
                <Button type="submit" className="col-span-2 md:col-span-3">Add Item</Button>
              </form>
            </div>

            {/* Item list */}
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-2 text-xs uppercase tracking-wider text-muted-foreground">Name</th>
                    <th className="text-left py-2 text-xs uppercase tracking-wider text-muted-foreground">Category</th>
                    <th className="text-left py-2 text-xs uppercase tracking-wider text-muted-foreground">Color</th>
                    <th className="text-left py-2 text-xs uppercase tracking-wider text-muted-foreground">Price</th>
                    <th className="text-left py-2 text-xs uppercase tracking-wider text-muted-foreground">Rating</th>
                  </tr>
                </thead>
                <tbody>
                  {items.map(item => (
                    <tr key={item.id} className="border-b border-border/50">
                      <td className="py-2">{item.name}</td>
                      <td className="py-2 capitalize">{item.category}</td>
                      <td className="py-2">{item.color}</td>
                      <td className="py-2">${item.price.toFixed(2)}</td>
                      <td className="py-2">{item.rating}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </TabsContent>

          <TabsContent value="users">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-2 text-xs uppercase tracking-wider text-muted-foreground">Name</th>
                    <th className="text-left py-2 text-xs uppercase tracking-wider text-muted-foreground">Styles</th>
                    <th className="text-left py-2 text-xs uppercase tracking-wider text-muted-foreground">Colors</th>
                    <th className="text-left py-2 text-xs uppercase tracking-wider text-muted-foreground">Ratings</th>
                  </tr>
                </thead>
                <tbody>
                  {simulatedUsers.map(user => (
                    <tr key={user.id} className="border-b border-border/50">
                      <td className="py-2">{user.name}</td>
                      <td className="py-2 capitalize">{user.preferredStyles.join(', ')}</td>
                      <td className="py-2">{user.favoriteColors.join(', ')}</td>
                      <td className="py-2">{Object.keys(user.ratings).length} items</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </TabsContent>

          <TabsContent value="analytics">
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-card border border-border p-6 rounded-sm">
                <h3 className="font-display font-semibold mb-4">Items by Category</h3>
                {Object.entries(categoryCounts).map(([cat, count]) => (
                  <div key={cat} className="flex items-center justify-between py-2 border-b border-border/50 last:border-0">
                    <span className="capitalize text-sm">{cat}</span>
                    <div className="flex items-center gap-3">
                      <div className="w-24 h-2 bg-secondary rounded-full overflow-hidden">
                        <div className="h-full bg-accent rounded-full" style={{ width: `${(count / totalItems) * 100}%` }} />
                      </div>
                      <span className="text-sm text-muted-foreground w-8 text-right">{count}</span>
                    </div>
                  </div>
                ))}
              </div>
              <div className="bg-card border border-border p-6 rounded-sm">
                <h3 className="font-display font-semibold mb-4">System Info</h3>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between"><span className="text-muted-foreground">Algorithm</span><span>Hybrid (CF + CB)</span></div>
                  <div className="flex justify-between"><span className="text-muted-foreground">Similarity Metric</span><span>Cosine Similarity</span></div>
                  <div className="flex justify-between"><span className="text-muted-foreground">CF Weight</span><span>40%</span></div>
                  <div className="flex justify-between"><span className="text-muted-foreground">CB Weight</span><span>60%</span></div>
                  <div className="flex justify-between"><span className="text-muted-foreground">Min Score Threshold</span><span>0.2</span></div>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
