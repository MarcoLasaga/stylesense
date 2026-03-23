import AdminLayout from '@/components/AdminLayout';
import { getAllUsers, getAllWardrobeItems, getAllSavedOutfits, getHistory } from '@/lib/store';
import { getWardrobeStats } from '@/lib/recommendation';
import { Users, Shirt, Heart, TrendingUp, Upload, Cpu, BarChart3, Layers } from 'lucide-react';

export default function AdminOverview() {
  const users = getAllUsers();
  const allItems = getAllWardrobeItems();
  const allSaved = getAllSavedOutfits();
  const history = getHistory();
  const stats = getWardrobeStats(allItems);

  // Simulated process metrics
  const imageProcessingCount = allItems.length;
  const recommendationCount = history.length + allSaved.length;
  const contentBasedUsage = Math.round(recommendationCount * 0.55);
  const collaborativeUsage = Math.round(recommendationCount * 0.45);

  return (
    <AdminLayout>
      <h1 className="text-3xl font-display font-bold mb-1">System Dashboard</h1>
      <p className="text-muted-foreground text-sm mb-8">IPO Model — Input, Process, and Output monitoring for system evaluation</p>

      {/* ── INPUT MONITORING ── */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-4">
          <Upload className="h-4 w-4 text-accent" />
          <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-accent">Input Monitoring</h2>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: 'Total Users', value: users.length, icon: Users },
            { label: 'Uploaded Clothes', value: allItems.length, icon: Shirt },
            { label: 'User Preferences Set', value: users.filter(u => u.preferredStyles.length > 0).length, icon: Heart },
            { label: 'Wardrobe Entries', value: allItems.length, icon: Layers },
          ].map(s => (
            <div key={s.label} className="bg-card border border-border p-5 rounded-sm">
              <div className="flex items-center justify-between mb-3">
                <p className="text-[10px] uppercase tracking-widest text-muted-foreground">{s.label}</p>
                <s.icon className="h-4 w-4 text-muted-foreground" />
              </div>
              <p className="text-3xl font-display font-bold">{s.value}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ── PROCESS MONITORING ── */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-4">
          <Cpu className="h-4 w-4 text-accent" />
          <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-accent">Process Monitoring</h2>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: 'Image Processing Requests', value: imageProcessingCount },
            { label: 'Classification Results', value: allItems.length },
            { label: 'Content-Based Runs', value: contentBasedUsage },
            { label: 'Collaborative Runs', value: collaborativeUsage },
          ].map(s => (
            <div key={s.label} className="bg-card border border-border p-5 rounded-sm">
              <p className="text-[10px] uppercase tracking-widest text-muted-foreground mb-3">{s.label}</p>
              <p className="text-3xl font-display font-bold">{s.value}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ── OUTPUT MONITORING ── */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-4">
          <TrendingUp className="h-4 w-4 text-accent" />
          <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-accent">Output Monitoring</h2>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: 'Generated Outfits', value: history.length },
            { label: 'Saved Outfits', value: allSaved.length },
            { label: 'Top Recommended Color', value: stats.topColor },
            { label: 'Most Used Category', value: stats.topCategory },
          ].map(s => (
            <div key={s.label} className="bg-card border border-border p-5 rounded-sm">
              <p className="text-[10px] uppercase tracking-widest text-muted-foreground mb-3">{s.label}</p>
              <p className="text-2xl font-display font-bold capitalize">{s.value}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Quick summaries */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Recent users */}
        <div className="bg-card border border-border rounded-sm p-5">
          <h3 className="font-display font-semibold mb-4">Registered Users</h3>
          <div className="space-y-2">
            {users.length === 0 && <p className="text-sm text-muted-foreground">No users yet</p>}
            {users.slice(0, 5).map(u => (
              <div key={u.id} className="flex items-center justify-between py-2 border-b border-border/50 last:border-0">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center text-xs font-bold">{u.avatarInitial}</div>
                  <div>
                    <p className="text-sm font-medium">{u.name || 'Unnamed'}</p>
                    <p className="text-xs text-muted-foreground">{u.email}</p>
                  </div>
                </div>
                <span className={`text-[10px] uppercase tracking-widest px-2 py-0.5 rounded-sm ${
                  u.role === 'admin' ? 'bg-accent/20 text-accent' : 'bg-secondary text-muted-foreground'
                }`}>{u.role}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Clothing distribution */}
        <div className="bg-card border border-border rounded-sm p-5">
          <h3 className="font-display font-semibold mb-4">Clothing Distribution</h3>
          {Object.entries(stats.categoryCounts).length > 0 ? Object.entries(stats.categoryCounts)
            .sort((a, b) => b[1] - a[1])
            .map(([cat, count]) => (
            <div key={cat} className="flex items-center justify-between py-2 border-b border-border/50 last:border-0">
              <span className="capitalize text-sm">{cat}</span>
              <div className="flex items-center gap-3">
                <div className="w-24 h-2 bg-secondary rounded-full overflow-hidden">
                  <div className="h-full bg-accent rounded-full" style={{ width: `${(count / Math.max(stats.totalItems, 1)) * 100}%` }} />
                </div>
                <span className="text-sm text-muted-foreground w-6 text-right">{count}</span>
              </div>
            </div>
          )) : <p className="text-sm text-muted-foreground">No clothing data yet</p>}
        </div>
      </div>
    </AdminLayout>
  );
}
