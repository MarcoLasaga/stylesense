/**
 * Explainable Recommendation Panel
 *
 * Renders the transparent breakdown of why an outfit was recommended,
 * including the percentage contribution of each factor and the
 * fashion-rule notes from the Fashion Knowledge Engine.
 */
import { RecommendationBreakdown } from '@/lib/types';
import { Info } from 'lucide-react';

const FACTOR_LABELS: Record<string, string> = {
  userPreference: 'User Preferences',
  wardrobeCompatibility: 'Wardrobe Analysis',
  collaborative: 'Collaborative Filtering',
  trend: 'Trend Analysis',
  weather: 'Weather & Context',
  frequency: 'Frequency Tracker',
  fashionRules: 'Fashion Rules',
};

export default function RecommendationBreakdownPanel({ breakdown }: { breakdown?: RecommendationBreakdown }) {
  if (!breakdown) return null;
  const contrib = breakdown.contributions;

  return (
    <div className="bg-secondary/40 border border-border rounded-sm p-3 mt-3 text-xs">
      <div className="flex items-center gap-1.5 mb-2 text-muted-foreground">
        <Info className="h-3 w-3" />
        <span className="uppercase tracking-widest text-[10px]">Why this outfit?</span>
      </div>
      {contrib && (
        <div className="space-y-1.5 mb-3">
          {Object.entries(contrib)
            .filter(([, v]) => v > 0)
            .sort((a, b) => b[1] - a[1])
            .map(([key, pct]) => (
              <div key={key} className="flex items-center gap-2">
                <span className="w-32 truncate">{FACTOR_LABELS[key] ?? key}</span>
                <div className="flex-1 h-1.5 bg-secondary rounded-full overflow-hidden">
                  <div className="h-full bg-accent rounded-full" style={{ width: `${pct}%` }} />
                </div>
                <span className="w-9 text-right tabular-nums">{pct}%</span>
              </div>
            ))}
        </div>
      )}
      <div className="space-y-0.5">
        {breakdown.factors.slice(0, 4).map((f, i) => (
          <p key={i} className="text-muted-foreground">• {f}</p>
        ))}
      </div>
      {breakdown.fashionScore !== undefined && (
        <p className="text-[10px] text-muted-foreground mt-2 pt-2 border-t border-border">
          Fashion-rule score: <span className="text-foreground font-medium">{Math.round(breakdown.fashionScore * 100)}/100</span>
          {' · '}Final match: <span className="text-foreground font-medium">{Math.round(breakdown.finalScore * 100)}%</span>
        </p>
      )}
    </div>
  );
}
