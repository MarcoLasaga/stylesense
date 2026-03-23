import AdminLayout from '@/components/AdminLayout';
import { getAllWardrobeItems, getAllSavedOutfits, getAllUsers, getHistory } from '@/lib/store';
import { getWardrobeStats } from '@/lib/recommendation';
import { Eye, Cpu, Layers, CheckCircle2, ArrowRight } from 'lucide-react';

/**
 * Recommendation Transparency Panel
 * 
 * Shows how the recommendation algorithms work — critical for thesis defense.
 * Displays the hybrid scoring model, algorithm weights, and sample scoring breakdown.
 */
export default function AdminAlgorithm() {
  const allItems = getAllWardrobeItems();
  const allSaved = getAllSavedOutfits();
  const history = getHistory();
  const users = getAllUsers();
  const stats = getWardrobeStats(allItems);

  const totalRecs = history.length + allSaved.length;
  const cbWeight = 55;
  const cfWeight = 45;

  return (
    <AdminLayout>
      <h1 className="text-3xl font-display font-bold mb-1">Recommendation Transparency</h1>
      <p className="text-muted-foreground text-sm mb-8">Algorithm explainability for system evaluation and thesis defense</p>

      {/* Algorithm overview */}
      <div className="grid lg:grid-cols-3 gap-6 mb-8">
        <div className="bg-card border border-border p-6 rounded-sm lg:col-span-3">
          <div className="flex items-center gap-2 mb-4">
            <Cpu className="h-4 w-4 text-accent" />
            <h3 className="font-display font-semibold">Hybrid Recommendation Model</h3>
          </div>
          <p className="text-sm text-muted-foreground mb-6 max-w-3xl">
            StyleSense uses a <strong>hybrid recommendation engine</strong> combining Content-Based Filtering and Collaborative Filtering 
            to generate outfit suggestions from the user's personal wardrobe. The hybrid score determines the final ranking of each outfit.
          </p>

          {/* Visual pipeline */}
          <div className="flex flex-col md:flex-row items-stretch gap-4 mb-6">
            <div className="flex-1 bg-secondary/30 p-4 rounded-sm border border-border">
              <p className="text-[10px] uppercase tracking-widest text-accent font-bold mb-2">Input</p>
              <ul className="text-xs text-muted-foreground space-y-1.5">
                <li className="flex items-center gap-2"><CheckCircle2 className="h-3 w-3 text-accent" /> User wardrobe items</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="h-3 w-3 text-accent" /> User style preferences</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="h-3 w-3 text-accent" /> Favorite colors</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="h-3 w-3 text-accent" /> Occasion preference</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="h-3 w-3 text-accent" /> Clothing attributes (color, fabric, style)</li>
              </ul>
            </div>
            <div className="flex items-center justify-center">
              <ArrowRight className="h-5 w-5 text-muted-foreground hidden md:block" />
              <div className="h-5 w-px bg-border md:hidden" />
            </div>
            <div className="flex-1 bg-secondary/30 p-4 rounded-sm border border-border">
              <p className="text-[10px] uppercase tracking-widest text-accent font-bold mb-2">Process</p>
              <ul className="text-xs text-muted-foreground space-y-1.5">
                <li className="flex items-center gap-2"><CheckCircle2 className="h-3 w-3 text-accent" /> Generate item combinations (Top+Bottom+Shoes)</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="h-3 w-3 text-accent" /> Content-Based scoring (color, style, occasion)</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="h-3 w-3 text-accent" /> Collaborative scoring (cosine similarity)</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="h-3 w-3 text-accent" /> Hybrid score = CB×0.55 + CF×0.45</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="h-3 w-3 text-accent" /> Rank & deduplicate results</li>
              </ul>
            </div>
            <div className="flex items-center justify-center">
              <ArrowRight className="h-5 w-5 text-muted-foreground hidden md:block" />
              <div className="h-5 w-px bg-border md:hidden" />
            </div>
            <div className="flex-1 bg-secondary/30 p-4 rounded-sm border border-border">
              <p className="text-[10px] uppercase tracking-widest text-accent font-bold mb-2">Output</p>
              <ul className="text-xs text-muted-foreground space-y-1.5">
                <li className="flex items-center gap-2"><CheckCircle2 className="h-3 w-3 text-accent" /> Ranked outfit suggestions</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="h-3 w-3 text-accent" /> Score with reasoning text</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="h-3 w-3 text-accent" /> Outfit name & occasion label</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="h-3 w-3 text-accent" /> Save & wear tracking</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Algorithm details side by side */}
      <div className="grid lg:grid-cols-2 gap-6 mb-8">
        {/* Content-Based Filtering */}
        <div className="bg-card border border-border p-6 rounded-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-display font-semibold">Content-Based Filtering</h3>
            <span className="text-sm font-bold text-accent">{cbWeight}% weight</span>
          </div>
          <p className="text-xs text-muted-foreground mb-4">
            Scores outfits by analyzing clothing attributes and matching against user preferences.
          </p>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between py-2 border-b border-border/50">
              <span className="text-muted-foreground">Color Harmony</span>
              <span className="font-medium">25% of CB score</span>
            </div>
            <div className="pl-4 text-xs text-muted-foreground space-y-1 pb-2">
              <p>• Neutral colors (Black, White, Gray, Navy) = universal match</p>
              <p>• Same color group (warm/cool/pastel) = 0.85 score</p>
              <p>• Mixed warm + cool without neutrals = 0.4 penalty</p>
            </div>
            <div className="flex justify-between py-2 border-b border-border/50">
              <span className="text-muted-foreground">Style Consistency</span>
              <span className="font-medium">25% of CB score</span>
            </div>
            <div className="pl-4 text-xs text-muted-foreground space-y-1 pb-2">
              <p>• All items same style = 1.0</p>
              <p>• Score = 1 / number of unique styles</p>
            </div>
            <div className="flex justify-between py-2 border-b border-border/50">
              <span className="text-muted-foreground">Occasion Match</span>
              <span className="font-medium">25% of CB score</span>
            </div>
            <div className="pl-4 text-xs text-muted-foreground space-y-1 pb-2">
              <p>• Proportion of items matching target occasion</p>
              <p>• All matching = 1.0; partial match = proportional</p>
            </div>
            <div className="flex justify-between py-2 border-b border-border/50">
              <span className="text-muted-foreground">User Preference Alignment</span>
              <span className="font-medium">25% of CB score</span>
            </div>
            <div className="pl-4 text-xs text-muted-foreground space-y-1">
              <p>• Matches items against user's preferred styles and favorite colors</p>
            </div>
          </div>
        </div>

        {/* Collaborative Filtering */}
        <div className="bg-card border border-border p-6 rounded-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-display font-semibold">Collaborative Filtering</h3>
            <span className="text-sm font-bold text-accent">{cfWeight}% weight</span>
          </div>
          <p className="text-xs text-muted-foreground mb-4">
            Compares user preferences with community patterns using cosine similarity to boost proven combinations.
          </p>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between py-2 border-b border-border/50">
              <span className="text-muted-foreground">Similarity Metric</span>
              <span className="font-medium">Cosine Similarity</span>
            </div>
            <div className="pl-4 text-xs text-muted-foreground space-y-1 pb-2">
              <p>• Builds style vector (8 dimensions: casual, formal, sporty, etc.)</p>
              <p>• Computes dot product / (magnitude_A × magnitude_B)</p>
              <p>• Threshold: similarity &gt; 0.1 to consider pattern</p>
            </div>
            <div className="flex justify-between py-2 border-b border-border/50">
              <span className="text-muted-foreground">Community Patterns</span>
              <span className="font-medium">5 simulated users</span>
            </div>
            <div className="pl-4 text-xs text-muted-foreground space-y-1 pb-2">
              <p>• Alex (casual/streetwear), Jordan (formal/classic)</p>
              <p>• Sam (casual/minimalist), Taylor (sporty/casual)</p>
              <p>• Morgan (bohemian/vintage)</p>
            </div>
            <div className="flex justify-between py-2 border-b border-border/50">
              <span className="text-muted-foreground">Pattern Matching</span>
              <span className="font-medium">Category + Style overlap</span>
            </div>
            <div className="pl-4 text-xs text-muted-foreground space-y-1 pb-2">
              <p>• Category overlap: 30% weight</p>
              <p>• Style overlap: 70% weight</p>
              <p>• Score multiplied by user similarity</p>
            </div>
            <div className="flex justify-between py-2 border-b border-border/50">
              <span className="text-muted-foreground">Formula</span>
              <span className="font-medium text-xs">Σ(pattern_score × similarity) / Σ(similarity)</span>
            </div>
          </div>
        </div>
      </div>

      {/* Algorithm configuration summary */}
      <div className="bg-card border border-border p-6 rounded-sm mb-8">
        <h3 className="font-display font-semibold mb-4">System Configuration</h3>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-3 text-sm">
          {[
            ['Approach', 'Hybrid (CB + CF)'],
            ['Content-Based Weight', `${cbWeight}%`],
            ['Collaborative Weight', `${cfWeight}%`],
            ['Similarity Metric', 'Cosine Similarity'],
            ['Color Harmony', 'Group-based scoring (neutral/warm/cool/pastel)'],
            ['Community Patterns', '5 simulated user profiles'],
            ['Outfit Structure', 'Top + Bottom + Shoes + optional Outerwear'],
            ['Scoring Range', '0.0 – 1.0'],
            ['Deduplication', 'Item-ID based unique filtering'],
            ['Data Storage', 'localStorage (client-side)'],
            ['Total Recommendations', String(totalRecs)],
            ['Wardrobe Items in System', String(allItems.length)],
          ].map(([key, val]) => (
            <div key={key} className="flex justify-between py-2 border-b border-border/50">
              <span className="text-muted-foreground">{key}</span>
              <span className="font-medium text-right">{val}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Saved outfit sample breakdown */}
      {allSaved.length > 0 && (
        <div className="bg-card border border-border p-6 rounded-sm">
          <h3 className="font-display font-semibold mb-4">Sample Recommendation Outputs</h3>
          <p className="text-xs text-muted-foreground mb-4">Recent saved outfits with their scoring details</p>
          <div className="space-y-4">
            {allSaved.slice(0, 3).map(s => (
              <div key={s.id} className="p-4 bg-secondary/20 rounded-sm border border-border/50">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium text-sm">{s.outfit.name}</span>
                  <span className="text-xs bg-accent/20 text-accent px-2 py-0.5 rounded-sm">
                    Score: {(s.outfit.score * 100).toFixed(0)}%
                  </span>
                </div>
                <div className="flex flex-wrap gap-2 mb-2">
                  {s.outfit.items.map(item => (
                    <span key={item.id} className="text-xs px-2 py-1 bg-secondary rounded-sm">
                      {item.name} ({item.category})
                    </span>
                  ))}
                </div>
                <p className="text-xs text-muted-foreground">
                  <strong>Style:</strong> {s.outfit.style} · <strong>Occasion:</strong> {s.outfit.occasion} · <strong>Reason:</strong> {s.outfit.reason}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
