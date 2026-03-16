import { useState } from 'react';
import Navbar from '@/components/Navbar';
import { getWardrobe, getSavedOutfits } from '@/lib/store';
import { getWardrobeStats } from '@/lib/recommendation';
import { WardrobeItem, ClothingCategory } from '@/lib/types';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BarChart3, Shirt, Settings } from 'lucide-react';

export default function Admin() {
  const wardrobe = getWardrobe();
  const saved = getSavedOutfits();
  const stats = getWardrobeStats(wardrobe);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 pt-24 pb-16">
        <h1 className="text-3xl font-display font-bold mb-1">Dashboard</h1>
        <p className="text-muted-foreground text-sm mb-8">Wardrobe analytics and system info</p>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
          {[
            { label: 'Wardrobe Items', value: stats.totalItems },
            { label: 'Saved Outfits', value: saved.length },
            { label: 'Times Worn', value: stats.totalWorn },
            { label: 'Top Color', value: stats.topColor },
          ].map(s => (
            <div key={s.label} className="bg-card border border-border p-4 rounded-sm">
              <p className="text-[10px] uppercase tracking-widest text-muted-foreground">{s.label}</p>
              <p className="text-xl font-display font-bold capitalize mt-1">{s.value}</p>
            </div>
          ))}
        </div>

        <Tabs defaultValue="wardrobe">
          <TabsList className="mb-6">
            <TabsTrigger value="wardrobe" className="gap-2"><Shirt className="h-3.5 w-3.5" /> Wardrobe</TabsTrigger>
            <TabsTrigger value="analytics" className="gap-2"><BarChart3 className="h-3.5 w-3.5" /> Analytics</TabsTrigger>
            <TabsTrigger value="system" className="gap-2"><Settings className="h-3.5 w-3.5" /> System</TabsTrigger>
          </TabsList>

          <TabsContent value="wardrobe">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border">
                    {['Name', 'Category', 'Color', 'Style', 'Occasion', 'Worn'].map(h => (
                      <th key={h} className="text-left py-2 text-[10px] uppercase tracking-widest text-muted-foreground">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {wardrobe.map(item => (
                    <tr key={item.id} className="border-b border-border/50">
                      <td className="py-2 flex items-center gap-2">
                        <div className="w-4 h-4 rounded-full border border-border" style={{ backgroundColor: item.colorHex }} />
                        {item.name}
                      </td>
                      <td className="py-2 capitalize">{item.category}</td>
                      <td className="py-2">{item.color}</td>
                      <td className="py-2 capitalize">{item.style}</td>
                      <td className="py-2 capitalize">{item.occasion}</td>
                      <td className="py-2">{item.wornCount}×</td>
                    </tr>
                  ))}
                  {wardrobe.length === 0 && (
                    <tr><td colSpan={6} className="py-8 text-center text-muted-foreground">No items yet</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </TabsContent>

          <TabsContent value="analytics">
            <div className="grid md:grid-cols-2 gap-6">
              {/* Category distribution */}
              <div className="bg-card border border-border p-6 rounded-sm">
                <h3 className="font-display font-semibold mb-4">Items by Category</h3>
                {Object.entries(stats.categoryCounts).length > 0 ? Object.entries(stats.categoryCounts).map(([cat, count]) => (
                  <div key={cat} className="flex items-center justify-between py-2 border-b border-border/50 last:border-0">
                    <span className="capitalize text-sm">{cat}</span>
                    <div className="flex items-center gap-3">
                      <div className="w-24 h-2 bg-secondary rounded-full overflow-hidden">
                        <div className="h-full bg-accent rounded-full" style={{ width: `${(count / stats.totalItems) * 100}%` }} />
                      </div>
                      <span className="text-sm text-muted-foreground w-6 text-right">{count}</span>
                    </div>
                  </div>
                )) : <p className="text-sm text-muted-foreground">No data yet</p>}
              </div>

              {/* Color distribution */}
              <div className="bg-card border border-border p-6 rounded-sm">
                <h3 className="font-display font-semibold mb-4">Colors in Wardrobe</h3>
                {Object.entries(stats.colorCounts).length > 0 ? Object.entries(stats.colorCounts)
                  .sort((a, b) => b[1] - a[1])
                  .map(([color, count]) => (
                  <div key={color} className="flex items-center justify-between py-2 border-b border-border/50 last:border-0">
                    <span className="text-sm">{color}</span>
                    <div className="flex items-center gap-3">
                      <div className="w-24 h-2 bg-secondary rounded-full overflow-hidden">
                        <div className="h-full bg-accent rounded-full" style={{ width: `${(count / stats.totalItems) * 100}%` }} />
                      </div>
                      <span className="text-sm text-muted-foreground w-6 text-right">{count}</span>
                    </div>
                  </div>
                )) : <p className="text-sm text-muted-foreground">No data yet</p>}
              </div>

              {/* Style distribution */}
              <div className="bg-card border border-border p-6 rounded-sm md:col-span-2">
                <h3 className="font-display font-semibold mb-4">Style Distribution</h3>
                {Object.entries(stats.styleCounts).length > 0 ? Object.entries(stats.styleCounts)
                  .sort((a, b) => b[1] - a[1])
                  .map(([sty, count]) => (
                  <div key={sty} className="flex items-center justify-between py-2 border-b border-border/50 last:border-0">
                    <span className="capitalize text-sm">{sty}</span>
                    <div className="flex items-center gap-3">
                      <div className="w-32 h-2 bg-secondary rounded-full overflow-hidden">
                        <div className="h-full bg-accent rounded-full" style={{ width: `${(count / stats.totalItems) * 100}%` }} />
                      </div>
                      <span className="text-sm text-muted-foreground w-6 text-right">{count}</span>
                    </div>
                  </div>
                )) : <p className="text-sm text-muted-foreground">No data yet</p>}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="system">
            <div className="bg-card border border-border p-6 rounded-sm max-w-md">
              <h3 className="font-display font-semibold mb-4">Algorithm Configuration</h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between"><span className="text-muted-foreground">Approach</span><span>Hybrid (CB + CF)</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Content-Based Weight</span><span>55%</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Collaborative Weight</span><span>45%</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Similarity Metric</span><span>Cosine Similarity</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Color Harmony</span><span>Group-based scoring</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Community Patterns</span><span>5 simulated users</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Data Storage</span><span>localStorage</span></div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
