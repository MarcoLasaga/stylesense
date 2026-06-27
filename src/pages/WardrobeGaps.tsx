import Navbar from '@/components/Navbar';
import { getWardrobe } from '@/lib/store';
import { analyzeWardrobeGaps } from '@/lib/sustainability';
import { AlertTriangle, CheckCircle2, Sparkles, ShoppingBag, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

interface ShoppingIdea {
  name: string;
  blurb: string;
  category: string;
  swatch: string;
  emoji: string; // pure label fallback inside the colored tile
}

const SHOPPING_IDEAS: ShoppingIdea[] = [
  { name: 'White Sneakers', blurb: 'Goes with denim, dresses, and tailored looks alike.', category: 'shoes', swatch: '#f5f5f5', emoji: '👟' },
  { name: 'Denim Jacket', blurb: 'Layer over tees, hoodies, or summer dresses.', category: 'outerwear', swatch: '#3b6ea5', emoji: '🧥' },
  { name: 'Black Trousers', blurb: 'Work-ready bottom that elevates any top.', category: 'bottom', swatch: '#111111', emoji: '👖' },
  { name: 'Neutral Hoodie', blurb: 'Cozy off-duty staple in beige or stone.', category: 'top', swatch: '#d6c5a8', emoji: '🧶' },
  { name: 'Crisp White Shirt', blurb: 'Smart-casual base that never goes out of style.', category: 'top', swatch: '#ffffff', emoji: '👔' },
  { name: 'Tailored Blazer', blurb: 'Instantly polish any outfit.', category: 'outerwear', swatch: '#2c2c2c', emoji: '🥼' },
];

export default function WardrobeGaps() {
  const wardrobe = getWardrobe();
  const gaps = analyzeWardrobeGaps(wardrobe);

  const sevColor: Record<string, string> = {
    high: 'border-destructive/40 bg-destructive/5',
    medium: 'border-accent/40 bg-accent/5',
    low: 'border-border bg-card',
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 pt-24 pb-16 max-w-5xl">
        <h1 className="text-3xl font-display font-bold mb-1">Wardrobe Gap Analysis</h1>
        <p className="text-muted-foreground text-sm mb-8">AI-driven review of your wardrobe completeness, with shopping inspiration.</p>

        {gaps.length === 0 ? (
          <div className="bg-card border border-border rounded-2xl p-10 text-center mb-12">
            <CheckCircle2 className="h-10 w-10 text-accent mx-auto mb-3" />
            <h2 className="font-display font-semibold text-xl mb-1">Your wardrobe is well-balanced</h2>
            <p className="text-sm text-muted-foreground">No major gaps detected across categories, styles, and conditions.</p>
          </div>
        ) : (
          <div className="space-y-3 mb-12">
            {gaps.map((g, i) => (
              <div key={i} className={`border rounded-2xl p-5 ${sevColor[g.severity]}`}>
                <div className="flex items-start gap-3">
                  <AlertTriangle className="h-4 w-4 text-accent mt-0.5 flex-shrink-0" />
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <h3 className="font-display font-semibold text-sm capitalize">{g.category}</h3>
                      <span className="text-[10px] uppercase tracking-widest text-muted-foreground">{g.severity}</span>
                    </div>
                    <p className="text-sm mb-1">{g.message}</p>
                    <p className="text-xs text-muted-foreground">{g.suggestion}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Shopping suggestions */}
        <section>
          <div className="flex items-center gap-2 mb-4">
            <ShoppingBag className="h-5 w-5 text-accent" />
            <h2 className="font-display text-2xl">Shopping Inspiration</h2>
          </div>
          <p className="text-sm text-muted-foreground mb-6">Versatile essentials that pair beautifully with what you already own.</p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {SHOPPING_IDEAS.map((s, i) => (
              <div key={s.name} className="group bg-card border border-border rounded-2xl overflow-hidden hover:shadow-md transition-all">
                <div
                  className="aspect-[4/3] flex items-center justify-center text-5xl relative"
                  style={{ backgroundColor: s.swatch, color: s.swatch === '#ffffff' || s.swatch === '#f5f5f5' || s.swatch === '#d6c5a8' ? '#222' : '#fff' }}
                >
                  <span className="opacity-80 transition-transform group-hover:scale-110">{s.emoji}</span>
                  <span className="absolute top-3 left-3 text-[10px] uppercase tracking-widest font-medium bg-background/85 text-foreground px-2 py-0.5 rounded-full">
                    {s.category}
                  </span>
                </div>
                <div className="p-4">
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="font-display text-lg">{s.name}</h3>
                    <span className="text-[10px] uppercase tracking-widest text-accent">Essential</span>
                  </div>
                  <p className="text-sm text-muted-foreground mb-3">{s.blurb}</p>
                  <Button variant="outline" size="sm" className="w-full gap-1.5">
                    <ExternalLink className="h-3.5 w-3.5" /> Find inspiration
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </section>

        <div className="mt-10 flex gap-2">
          <Link to="/upload"><Button className="gap-2"><Sparkles className="h-4 w-4" /> Add Clothes</Button></Link>
          <Link to="/sustainability"><Button variant="outline">View Sustainability</Button></Link>
        </div>
      </div>
    </div>
  );
}
