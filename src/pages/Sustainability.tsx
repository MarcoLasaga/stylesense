import Navbar from '@/components/Navbar';
import { getWardrobe, getSavedOutfits, getHistory } from '@/lib/store';
import { computeSustainability } from '@/lib/sustainability';
import { Leaf, Recycle, ShoppingBag, TrendingUp } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Sustainability() {
  const wardrobe = getWardrobe();
  const saved = getSavedOutfits();
  const history = getHistory();
  const r = computeSustainability(wardrobe, saved, history);

  const ring = `conic-gradient(hsl(var(--accent)) ${r.score * 3.6}deg, hsl(var(--secondary)) ${r.score * 3.6}deg)`;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 pt-24 pb-16 max-w-5xl">
        <div className="flex items-center gap-3 mb-2">
          <Leaf className="h-6 w-6 text-accent" />
          <h1 className="text-3xl font-display font-bold">Sustainability Dashboard</h1>
        </div>
        <p className="text-muted-foreground text-sm mb-8">Maximise your existing wardrobe — reduce unnecessary purchases.</p>

        <div className="grid md:grid-cols-3 gap-6 mb-8">
          {/* Score ring */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
            className="bg-card border border-border rounded-sm p-6 flex flex-col items-center"
          >
            <p className="text-[10px] uppercase tracking-widest text-muted-foreground mb-4">Sustainability Score</p>
            <div className="relative w-40 h-40 rounded-full flex items-center justify-center" style={{ background: ring }}>
              <div className="absolute inset-2 rounded-full bg-card flex flex-col items-center justify-center">
                <p className="text-4xl font-display font-bold">{r.score}</p>
                <p className="text-[10px] uppercase tracking-widest text-muted-foreground">/ 100</p>
              </div>
            </div>
            <p className="text-xs text-muted-foreground mt-4 text-center">
              {r.score >= 75 ? 'Excellent — your wardrobe is highly reused.' :
               r.score >= 50 ? 'Good — keep mixing existing pieces.' :
               'Room to grow — try more outfit combinations.'}
            </p>
          </motion.div>

          {/* Utilization */}
          <div className="bg-card border border-border rounded-sm p-6 md:col-span-2 grid grid-cols-2 gap-4">
            {[
              { label: 'Total Items', value: r.totalItems, icon: ShoppingBag },
              { label: 'Active Items', value: r.activeItems, icon: Recycle },
              { label: 'Unused Items', value: r.unusedItems, icon: Leaf },
              { label: 'Avoided Purchases', value: r.avoidedPurchasesEst, icon: TrendingUp },
            ].map(s => (
              <div key={s.label} className="p-4 bg-secondary/30 rounded-sm">
                <s.icon className="h-4 w-4 text-accent mb-2" />
                <p className="text-2xl font-display font-bold">{s.value}</p>
                <p className="text-[10px] uppercase tracking-widest text-muted-foreground mt-1">{s.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Metrics */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <div className="bg-card border border-border p-6 rounded-sm">
            <h3 className="font-display font-semibold mb-4">Wardrobe Utilization</h3>
            <Bar label="Utilization Rate" value={r.utilizationPct} />
            <Bar label="Category Diversity" value={r.diversityPct} />
            <Bar label="Reuse Intensity" value={Math.min(r.reuseIntensity / 5, 1)} />
          </div>

          <div className="bg-card border border-border p-6 rounded-sm">
            <h3 className="font-display font-semibold mb-4">Most Reused Items</h3>
            {r.mostReused.length > 0 ? r.mostReused.map((it, i) => (
              <div key={it.id} className="flex items-center justify-between py-2 border-b border-border/40 last:border-0 text-sm">
                <div className="flex items-center gap-3">
                  <span className="text-xs text-muted-foreground w-4">{i + 1}.</span>
                  <div className="w-4 h-4 rounded-full border border-border" style={{ backgroundColor: it.colorHex }} />
                  <span>{it.name}</span>
                </div>
                <span className="font-medium">{it.wornCount}×</span>
              </div>
            )) : <p className="text-sm text-muted-foreground">Mark outfits as worn to track reuse.</p>}
          </div>
        </div>

        <div className="bg-card border border-border p-6 rounded-sm">
          <h3 className="font-display font-semibold mb-4">Reuse Statistics</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: 'Outfits Generated', value: r.outfitsGenerated },
              { label: 'Outfits Saved', value: r.outfitsSaved },
              { label: 'Wardrobe Utilized', value: `${Math.round(r.utilizationPct * 100)}%` },
              { label: 'Avg Wears / Item', value: r.reuseIntensity.toFixed(1) },
            ].map(s => (
              <div key={s.label} className="text-center p-3 bg-secondary/30 rounded-sm">
                <p className="text-[10px] uppercase tracking-widest text-muted-foreground mb-2">{s.label}</p>
                <p className="text-xl font-display font-bold">{s.value}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function Bar({ label, value }: { label: string; value: number }) {
  const pct = Math.round(Math.min(1, Math.max(0, value)) * 100);
  return (
    <div className="mb-3">
      <div className="flex justify-between text-xs mb-1">
        <span>{label}</span><span className="text-muted-foreground tabular-nums">{pct}%</span>
      </div>
      <div className="h-2 bg-secondary rounded-full overflow-hidden">
        <div className="h-full bg-accent rounded-full transition-all" style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}
