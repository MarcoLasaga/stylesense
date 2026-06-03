import Navbar from '@/components/Navbar';
import { getWardrobe } from '@/lib/store';
import { analyzeWardrobeGaps } from '@/lib/sustainability';
import { AlertTriangle, CheckCircle2, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

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
      <div className="container mx-auto px-4 pt-24 pb-16 max-w-3xl">
        <h1 className="text-3xl font-display font-bold mb-1">Wardrobe Gap Analysis</h1>
        <p className="text-muted-foreground text-sm mb-8">AI-driven review of your wardrobe completeness.</p>

        {gaps.length === 0 ? (
          <div className="bg-card border border-border rounded-sm p-10 text-center">
            <CheckCircle2 className="h-10 w-10 text-accent mx-auto mb-3" />
            <h2 className="font-display font-semibold text-xl mb-1">Your wardrobe is well-balanced</h2>
            <p className="text-sm text-muted-foreground">No major gaps detected across categories, styles, and conditions.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {gaps.map((g, i) => (
              <div key={i} className={`border rounded-sm p-5 ${sevColor[g.severity]}`}>
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

        <div className="mt-8 flex gap-2">
          <Link to="/upload"><Button className="gap-2"><Sparkles className="h-4 w-4" /> Add Clothes</Button></Link>
          <Link to="/sustainability"><Button variant="outline">View Sustainability</Button></Link>
        </div>
      </div>
    </div>
  );
}
