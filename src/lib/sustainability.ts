/**
 * StyleSense — Sustainability Metrics
 *
 * Quantifies the environmental impact of reusing the existing wardrobe.
 * A higher Sustainability Score reflects:
 *   - more of the wardrobe is actively worn
 *   - greater category diversity
 *   - more outfits generated per item (reuse intensity)
 */
import { WardrobeItem, SavedOutfit, OutfitHistory } from './types';

export interface SustainabilityReport {
  totalItems: number;
  activeItems: number;
  unusedItems: number;
  utilizationPct: number;             // % of wardrobe with wornCount > 0
  diversityPct: number;               // % of category coverage (0..1 of 5 buckets)
  reuseIntensity: number;             // avg wears per item
  outfitsGenerated: number;
  outfitsSaved: number;
  avoidedPurchasesEst: number;        // heuristic: ceil(saved / 4)
  mostReused: WardrobeItem[];         // top 5
  score: number;                      // 0..100
}

export function computeSustainability(
  wardrobe: WardrobeItem[],
  saved: SavedOutfit[],
  history: OutfitHistory[],
): SustainabilityReport {
  const total = wardrobe.length;
  const active = wardrobe.filter(i => i.wornCount > 0).length;
  const unused = total - active;
  const utilization = total > 0 ? active / total : 0;

  const categories = new Set(wardrobe.map(i => i.category));
  const diversity = categories.size / 5; // top/bottom/shoes/outerwear/accessories

  const totalWears = wardrobe.reduce((s, i) => s + i.wornCount, 0);
  const reuseIntensity = total > 0 ? totalWears / total : 0;

  const mostReused = [...wardrobe].sort((a, b) => b.wornCount - a.wornCount).slice(0, 5);

  // Heuristic: every ~4 saved outfits reused from existing wardrobe ≈ 1 avoided purchase
  const avoidedPurchases = Math.floor(saved.length / 4);

  // Composite score
  const score = Math.round(
    (utilization * 50) +
    (diversity * 25) +
    (Math.min(reuseIntensity / 5, 1) * 25)
  );

  return {
    totalItems: total,
    activeItems: active,
    unusedItems: unused,
    utilizationPct: utilization,
    diversityPct: diversity,
    reuseIntensity,
    outfitsGenerated: history.length,
    outfitsSaved: saved.length,
    avoidedPurchasesEst: avoidedPurchases,
    mostReused,
    score,
  };
}

// ── Wardrobe Gap Analysis ───────────────────────────────────
export interface WardrobeGap {
  category: string;
  severity: 'low' | 'medium' | 'high';
  message: string;
  suggestion: string;
}

const TARGETS = {
  top: 5,
  bottom: 4,
  shoes: 3,
  outerwear: 2,
  accessories: 2,
};

export function analyzeWardrobeGaps(wardrobe: WardrobeItem[]): WardrobeGap[] {
  const gaps: WardrobeGap[] = [];

  // Category coverage
  for (const [cat, target] of Object.entries(TARGETS)) {
    const count = wardrobe.filter(i => i.category === cat).length;
    if (count === 0) {
      gaps.push({ category: cat, severity: 'high',
        message: `No ${cat} items in your wardrobe`,
        suggestion: `Add at least ${target} ${cat} pieces to unlock more outfit combinations.` });
    } else if (count < target) {
      gaps.push({ category: cat, severity: count < target / 2 ? 'medium' : 'low',
        message: `Limited ${cat} options (${count} / ${target} recommended)`,
        suggestion: `Consider ${target - count} more ${cat} piece${target - count > 1 ? 's' : ''} for variety.` });
    }
  }

  // Formal coverage
  const formalCount = wardrobe.filter(i => i.style === 'formal').length;
  if (formalCount === 0 && wardrobe.length >= 6) {
    gaps.push({ category: 'formal', severity: 'medium',
      message: 'No formal pieces',
      suggestion: 'Add formal wear for work or events.' });
  }

  // Rain-ready coverage
  const rainReady = wardrobe.filter(i => i.category === 'outerwear' && (i.fabric === 'nylon' || i.fabric === 'polyester' || i.fabric === 'leather')).length;
  if (rainReady === 0 && wardrobe.length >= 5) {
    gaps.push({ category: 'rain', severity: 'low',
      message: 'No rain-friendly outerwear',
      suggestion: 'A water-resistant jacket would expand your weather range.' });
  }

  // Cold-weather coverage
  const warmItems = wardrobe.filter(i => i.fabric === 'wool' || i.fabric === 'knit').length;
  if (warmItems === 0 && wardrobe.length >= 5) {
    gaps.push({ category: 'cold', severity: 'low',
      message: 'No cold-weather pieces',
      suggestion: 'Add a wool or knit layer for chilly days.' });
  }

  return gaps;
}
