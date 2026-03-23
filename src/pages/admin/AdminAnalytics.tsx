import AdminLayout from '@/components/AdminLayout';
import { getAllWardrobeItems, getAllSavedOutfits, getAllUsers, getHistory } from '@/lib/store';
import { getWardrobeStats } from '@/lib/recommendation';

export default function AdminAnalytics() {
  const allItems = getAllWardrobeItems();
  const allSaved = getAllSavedOutfits();
  const users = getAllUsers();
  const history = getHistory();
  const stats = getWardrobeStats(allItems);

  // Compute most worn items
  const mostWorn = [...allItems].sort((a, b) => b.wornCount - a.wornCount).slice(0, 5);

  // Occasion distribution
  const occasionCounts: Record<string, number> = {};
  allItems.forEach(i => { occasionCounts[i.occasion] = (occasionCounts[i.occasion] || 0) + 1; });

  // Fabric distribution
  const fabricCounts: Record<string, number> = {};
  allItems.forEach(i => { fabricCounts[i.fabric] = (fabricCounts[i.fabric] || 0) + 1; });

  // User engagement
  const activeUsers = users.filter(u => u.role !== 'admin').length;
  const avgItemsPerUser = activeUsers > 0 ? (allItems.length / activeUsers).toFixed(1) : '0';
  const avgSavedPerUser = activeUsers > 0 ? (allSaved.length / activeUsers).toFixed(1) : '0';

  const BarChart = ({ data, total }: { data: Record<string, number>; total: number }) => (
    <div className="space-y-2">
      {Object.entries(data).sort((a, b) => b[1] - a[1]).map(([key, count]) => (
        <div key={key} className="flex items-center justify-between py-1.5">
          <span className="capitalize text-sm w-24 truncate">{key}</span>
          <div className="flex items-center gap-3 flex-1 ml-4">
            <div className="flex-1 h-2 bg-secondary rounded-full overflow-hidden">
              <div className="h-full bg-accent rounded-full transition-all" style={{ width: `${(count / Math.max(total, 1)) * 100}%` }} />
            </div>
            <span className="text-sm text-muted-foreground w-8 text-right">{count}</span>
            <span className="text-[10px] text-muted-foreground w-10 text-right">{Math.round((count / Math.max(total, 1)) * 100)}%</span>
          </div>
        </div>
      ))}
      {Object.keys(data).length === 0 && <p className="text-sm text-muted-foreground">No data</p>}
    </div>
  );

  return (
    <AdminLayout>
      <h1 className="text-3xl font-display font-bold mb-1">Analytics & Insights</h1>
      <p className="text-muted-foreground text-sm mb-8">Wardrobe data analysis for system evaluation</p>

      {/* Summary stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Active Users', value: activeUsers },
          { label: 'Avg Items/User', value: avgItemsPerUser },
          { label: 'Avg Saved/User', value: avgSavedPerUser },
          { label: 'Total Worn Count', value: stats.totalWorn },
        ].map(s => (
          <div key={s.label} className="bg-card border border-border p-5 rounded-sm">
            <p className="text-[10px] uppercase tracking-widest text-muted-foreground mb-3">{s.label}</p>
            <p className="text-2xl font-display font-bold">{s.value}</p>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6 mb-6">
        {/* Category distribution */}
        <div className="bg-card border border-border p-6 rounded-sm">
          <h3 className="font-display font-semibold mb-4">Items by Category</h3>
          <BarChart data={stats.categoryCounts} total={stats.totalItems} />
        </div>

        {/* Color distribution */}
        <div className="bg-card border border-border p-6 rounded-sm">
          <h3 className="font-display font-semibold mb-4">Color Distribution</h3>
          <BarChart data={stats.colorCounts} total={stats.totalItems} />
        </div>

        {/* Style distribution */}
        <div className="bg-card border border-border p-6 rounded-sm">
          <h3 className="font-display font-semibold mb-4">Style Distribution</h3>
          <BarChart data={stats.styleCounts} total={stats.totalItems} />
        </div>

        {/* Occasion distribution */}
        <div className="bg-card border border-border p-6 rounded-sm">
          <h3 className="font-display font-semibold mb-4">Occasion Distribution</h3>
          <BarChart data={occasionCounts} total={stats.totalItems} />
        </div>

        {/* Fabric distribution */}
        <div className="bg-card border border-border p-6 rounded-sm">
          <h3 className="font-display font-semibold mb-4">Fabric Distribution</h3>
          <BarChart data={fabricCounts} total={stats.totalItems} />
        </div>

        {/* Most worn items */}
        <div className="bg-card border border-border p-6 rounded-sm">
          <h3 className="font-display font-semibold mb-4">Most Worn Items</h3>
          {mostWorn.length > 0 ? mostWorn.map((item, i) => (
            <div key={item.id} className="flex items-center justify-between py-2 border-b border-border/50 last:border-0">
              <div className="flex items-center gap-3">
                <span className="text-xs text-muted-foreground w-4">{i + 1}.</span>
                <div className="w-4 h-4 rounded-full border border-border" style={{ backgroundColor: item.colorHex }} />
                <span className="text-sm">{item.name}</span>
              </div>
              <span className="text-sm font-medium">{item.wornCount}×</span>
            </div>
          )) : <p className="text-sm text-muted-foreground">No wear data yet</p>}
        </div>
      </div>

      {/* User engagement */}
      <div className="bg-card border border-border p-6 rounded-sm">
        <h3 className="font-display font-semibold mb-4">User Engagement Summary</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: 'Total Outfits Generated', value: history.length },
            { label: 'Total Outfits Saved', value: allSaved.length },
            { label: 'Total Clothes Uploaded', value: allItems.length },
            { label: 'Save Rate', value: history.length > 0 ? `${Math.round((allSaved.length / history.length) * 100)}%` : '0%' },
          ].map(s => (
            <div key={s.label} className="text-center p-3 bg-secondary/30 rounded-sm">
              <p className="text-[10px] uppercase tracking-widest text-muted-foreground mb-2">{s.label}</p>
              <p className="text-xl font-display font-bold">{s.value}</p>
            </div>
          ))}
        </div>
      </div>
    </AdminLayout>
  );
}
