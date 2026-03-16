/**
 * StyleSense — Outfit Recommendation Engine
 *
 * Generates outfit combinations from a user's OWN wardrobe using:
 *
 * 1. CONTENT-BASED FILTERING
 *    Scores outfits by matching clothing attributes:
 *    - Color harmony (complementary/analogous colors)
 *    - Style consistency (all items same style = bonus)
 *    - Occasion match (items fit the target occasion)
 *    - User preference alignment
 *
 * 2. COLLABORATIVE FILTERING
 *    Uses community outfit patterns to boost combinations
 *    that similar users frequently wear together.
 *    Similarity measured via cosine similarity on style vectors.
 *
 * 3. HYBRID SCORING
 *    Combines both scores: 55% content-based + 45% collaborative
 */

import {
  WardrobeItem, UserProfile, GeneratedOutfit,
  ClothingCategory, StyleType, OccasionType, CommunityPattern,
} from './types';

// ── Color Harmony Rules ──────────────────────────────────

const COLOR_GROUPS: Record<string, string[]> = {
  neutral: ['Black', 'White', 'Gray', 'Beige', 'Cream', 'Brown', 'Khaki', 'Tan', 'Navy'],
  warm:    ['Red', 'Orange', 'Yellow', 'Coral', 'Burgundy', 'Rust', 'Maroon', 'Gold'],
  cool:    ['Blue', 'Green', 'Teal', 'Purple', 'Lavender', 'Mint', 'Sage', 'Olive'],
  pastel:  ['Pink', 'Light Blue', 'Peach', 'Lilac', 'Mint', 'Rose'],
};

/**
 * Score color compatibility between items (0-1).
 * Neutrals go with everything. Same group = good. Mixed warm+cool = lower score.
 */
function colorHarmonyScore(colors: string[]): number {
  const groups = colors.map(c => {
    for (const [group, members] of Object.entries(COLOR_GROUPS)) {
      if (members.some(m => m.toLowerCase() === c.toLowerCase())) return group;
    }
    return 'neutral'; // Unknown colors treated as neutral
  });

  const unique = [...new Set(groups)];
  if (unique.length === 1) return 1.0;
  if (unique.every(g => g === 'neutral' || g === unique.find(u => u !== 'neutral'))) return 0.85;
  if (unique.includes('warm') && unique.includes('cool') && !unique.includes('neutral')) return 0.4;
  return 0.65;
}

// ── Simulated Community Patterns (Collaborative Filtering Data) ──

const communityPatterns: CommunityPattern[] = [
  {
    id: 'cp1', userName: 'Alex',
    preferredStyles: ['casual', 'streetwear'], favoriteColors: ['Black', 'White'],
    outfitPatterns: [
      { categories: ['top', 'bottom', 'shoes'], colors: ['Black', 'Blue', 'White'], styles: ['casual', 'casual', 'casual'], occasion: 'everyday' },
      { categories: ['top', 'bottom', 'shoes', 'outerwear'], colors: ['White', 'Black', 'White', 'Black'], styles: ['streetwear', 'streetwear', 'streetwear', 'streetwear'], occasion: 'school' },
    ]
  },
  {
    id: 'cp2', userName: 'Jordan',
    preferredStyles: ['formal', 'classic'], favoriteColors: ['Navy', 'White', 'Black'],
    outfitPatterns: [
      { categories: ['top', 'bottom', 'shoes'], colors: ['White', 'Black', 'Black'], styles: ['formal', 'formal', 'formal'], occasion: 'work' },
      { categories: ['top', 'bottom', 'shoes', 'accessories'], colors: ['Blue', 'Gray', 'Brown', 'Brown'], styles: ['classic', 'classic', 'classic', 'classic'], occasion: 'work' },
    ]
  },
  {
    id: 'cp3', userName: 'Sam',
    preferredStyles: ['casual', 'minimalist'], favoriteColors: ['White', 'Cream', 'Gray'],
    outfitPatterns: [
      { categories: ['top', 'bottom', 'shoes'], colors: ['White', 'Beige', 'White'], styles: ['minimalist', 'minimalist', 'minimalist'], occasion: 'everyday' },
      { categories: ['top', 'bottom', 'shoes'], colors: ['Gray', 'Black', 'White'], styles: ['casual', 'casual', 'casual'], occasion: 'school' },
    ]
  },
  {
    id: 'cp4', userName: 'Taylor',
    preferredStyles: ['sporty', 'casual'], favoriteColors: ['Black', 'Gray'],
    outfitPatterns: [
      { categories: ['top', 'bottom', 'shoes'], colors: ['Black', 'Gray', 'Black'], styles: ['sporty', 'sporty', 'sporty'], occasion: 'gym' },
      { categories: ['top', 'bottom', 'shoes', 'outerwear'], colors: ['White', 'Black', 'Black', 'Gray'], styles: ['sporty', 'sporty', 'sporty', 'sporty'], occasion: 'outdoor' },
    ]
  },
  {
    id: 'cp5', userName: 'Morgan',
    preferredStyles: ['bohemian', 'vintage'], favoriteColors: ['Brown', 'Cream', 'Green'],
    outfitPatterns: [
      { categories: ['top', 'bottom', 'shoes', 'accessories'], colors: ['Cream', 'Brown', 'Brown', 'Gold'], styles: ['bohemian', 'bohemian', 'bohemian', 'bohemian'], occasion: 'date' },
    ]
  },
];

// ── Cosine Similarity for Collaborative Filtering ────────

/**
 * Build a style preference vector for a user/pattern.
 * Each dimension = one style type. Value = frequency/preference weight.
 */
const ALL_STYLES: StyleType[] = ['casual', 'formal', 'sporty', 'streetwear', 'minimalist', 'bohemian', 'vintage', 'classic'];

function styleVector(styles: StyleType[]): number[] {
  return ALL_STYLES.map(s => styles.filter(st => st === s).length);
}

function cosineSimilarity(a: number[], b: number[]): number {
  let dot = 0, magA = 0, magB = 0;
  for (let i = 0; i < a.length; i++) {
    dot += a[i] * b[i];
    magA += a[i] * a[i];
    magB += b[i] * b[i];
  }
  magA = Math.sqrt(magA);
  magB = Math.sqrt(magB);
  return magA && magB ? dot / (magA * magB) : 0;
}

/**
 * Score an outfit combination against community patterns.
 * Finds similar users and checks if they wear similar combos.
 */
function collaborativeScore(
  outfitCategories: ClothingCategory[],
  outfitColors: string[],
  outfitStyles: StyleType[],
  userProfile: UserProfile
): number {
  const userVec = styleVector(userProfile.preferredStyles);

  let totalScore = 0;
  let totalWeight = 0;

  for (const pattern of communityPatterns) {
    const patternVec = styleVector(pattern.preferredStyles);
    const similarity = cosineSimilarity(userVec, patternVec);

    if (similarity < 0.1) continue;

    for (const op of pattern.outfitPatterns) {
      // Check if categories overlap
      const catOverlap = outfitCategories.filter(c => op.categories.includes(c)).length / Math.max(outfitCategories.length, op.categories.length);
      // Check style overlap
      const styleOverlap = outfitStyles.filter(s => op.styles.includes(s)).length / Math.max(outfitStyles.length, op.styles.length);

      const patternScore = (catOverlap * 0.3 + styleOverlap * 0.7) * similarity;
      totalScore += patternScore;
      totalWeight += similarity;
    }
  }

  return totalWeight > 0 ? Math.min(totalScore / totalWeight, 1) : 0;
}

// ── Content-Based Scoring ────────────────────────────────

function contentBasedScore(
  items: WardrobeItem[],
  profile: UserProfile,
  targetOccasion?: OccasionType
): { score: number; reasons: string[] } {
  const reasons: string[] = [];
  let score = 0;

  // 1. Color harmony (25%)
  const harmony = colorHarmonyScore(items.map(i => i.color));
  score += harmony * 0.25;
  if (harmony > 0.8) reasons.push('Great color combination');

  // 2. Style consistency (25%)
  const styles = items.map(i => i.style);
  const uniqueStyles = [...new Set(styles)];
  const styleConsistency = 1 / uniqueStyles.length;
  score += styleConsistency * 0.25;
  if (uniqueStyles.length === 1) reasons.push(`Cohesive ${uniqueStyles[0]} look`);

  // 3. Occasion match (25%)
  if (targetOccasion) {
    const occasionMatch = items.filter(i => i.occasion === targetOccasion).length / items.length;
    score += occasionMatch * 0.25;
    if (occasionMatch > 0.5) reasons.push(`Perfect for ${targetOccasion}`);
  } else {
    // Check if items share an occasion
    const occasions = items.map(i => i.occasion);
    const commonOccasion = occasions.every(o => o === occasions[0]);
    score += (commonOccasion ? 1 : 0.5) * 0.25;
    if (commonOccasion) reasons.push(`Great for ${occasions[0]}`);
  }

  // 4. User preference alignment (25%)
  const prefMatch = items.filter(i =>
    profile.preferredStyles.includes(i.style) ||
    profile.favoriteColors.some(c => c.toLowerCase() === i.color.toLowerCase())
  ).length / items.length;
  score += prefMatch * 0.25;
  if (prefMatch > 0.5) reasons.push('Matches your style preferences');

  return { score: Math.min(score, 1), reasons };
}

// ── Main Outfit Generator ────────────────────────────────

/**
 * Generate outfit combinations from the user's wardrobe.
 *
 * Algorithm:
 * 1. Get all items grouped by category
 * 2. Create combinations: top + bottom + shoes (+ optional outerwear/accessories)
 * 3. Score each combination using content-based + collaborative filtering
 * 4. Return top N outfits sorted by score
 */
export function generateOutfits(
  wardrobe: WardrobeItem[],
  profile: UserProfile,
  options?: {
    occasion?: OccasionType;
    count?: number;
    includeOuterwear?: boolean;
  }
): GeneratedOutfit[] {
  const count = options?.count ?? 6;
  const occasion = options?.occasion;

  // Group by category
  const tops = wardrobe.filter(i => i.category === 'top');
  const bottoms = wardrobe.filter(i => i.category === 'bottom');
  const shoes = wardrobe.filter(i => i.category === 'shoes');
  const outerwear = wardrobe.filter(i => i.category === 'outerwear');
  const accessories = wardrobe.filter(i => i.category === 'accessories');

  if (tops.length === 0 || bottoms.length === 0) {
    return []; // Need at least a top and bottom
  }

  const candidates: GeneratedOutfit[] = [];

  // Generate combinations
  for (const top of tops) {
    for (const bottom of bottoms) {
      const baseItems = [top, bottom];
      const shoeOptions = shoes.length > 0 ? shoes : [null];

      for (const shoe of shoeOptions) {
        const items = shoe ? [...baseItems, shoe] : baseItems;

        // Optionally add outerwear
        const outerOptions = options?.includeOuterwear && outerwear.length > 0
          ? [null, ...outerwear]
          : [null];

        for (const outer of outerOptions) {
          const finalItems = outer ? [...items, outer] : items;

          // Filter by occasion if specified
          if (occasion) {
            const hasMatchingItem = finalItems.some(i => i.occasion === occasion);
            if (!hasMatchingItem) continue;
          }

          // Score the outfit
          const cbResult = contentBasedScore(finalItems, profile, occasion);
          const collabScore = collaborativeScore(
            finalItems.map(i => i.category),
            finalItems.map(i => i.color),
            finalItems.map(i => i.style),
            profile
          );

          // Hybrid score: 55% content-based + 45% collaborative
          const hybridScore = cbResult.score * 0.55 + collabScore * 0.45;

          // Determine outfit style (majority vote)
          const styleCounts = finalItems.reduce((acc, i) => {
            acc[i.style] = (acc[i.style] || 0) + 1;
            return acc;
          }, {} as Record<string, number>);
          const dominantStyle = Object.entries(styleCounts).sort((a, b) => b[1] - a[1])[0][0] as StyleType;

          const outfitOccasion = occasion || finalItems[0].occasion;

          candidates.push({
            id: `outfit_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
            userId: profile.id,
            name: `${dominantStyle.charAt(0).toUpperCase() + dominantStyle.slice(1)} ${outfitOccasion} Look`,
            items: finalItems,
            occasion: outfitOccasion,
            style: dominantStyle,
            score: hybridScore,
            reason: cbResult.reasons.length > 0 ? cbResult.reasons.join(' · ') : 'Recommended combination',
            createdAt: Date.now(),
          });
        }
      }
    }
  }

  // Sort by score descending, deduplicate similar outfits, return top N
  const sorted = candidates.sort((a, b) => b.score - a.score);

  // Deduplicate: don't show outfits with exact same item IDs
  const seen = new Set<string>();
  const unique = sorted.filter(outfit => {
    const key = outfit.items.map(i => i.id).sort().join(',');
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });

  return unique.slice(0, count);
}

/**
 * Generate a single random outfit for "surprise me" feature.
 */
export function randomOutfit(wardrobe: WardrobeItem[], profile: UserProfile): GeneratedOutfit | null {
  const tops = wardrobe.filter(i => i.category === 'top');
  const bottoms = wardrobe.filter(i => i.category === 'bottom');
  const shoes = wardrobe.filter(i => i.category === 'shoes');

  if (tops.length === 0 || bottoms.length === 0) return null;

  const pick = <T>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];

  const items: WardrobeItem[] = [pick(tops), pick(bottoms)];
  if (shoes.length > 0) items.push(pick(shoes));

  const cbResult = contentBasedScore(items, profile);

  return {
    id: `outfit_random_${Date.now()}`,
    userId: profile.id,
    name: 'Surprise Outfit',
    items,
    occasion: items[0].occasion,
    style: items[0].style,
    score: cbResult.score,
    reason: 'Random pick from your wardrobe!',
    createdAt: Date.now(),
  };
}

/**
 * Get wardrobe statistics for the profile/admin page.
 */
export function getWardrobeStats(wardrobe: WardrobeItem[]) {
  const colorCounts: Record<string, number> = {};
  const categoryCounts: Record<string, number> = {};
  const styleCounts: Record<string, number> = {};
  let totalWorn = 0;

  wardrobe.forEach(item => {
    colorCounts[item.color] = (colorCounts[item.color] || 0) + 1;
    categoryCounts[item.category] = (categoryCounts[item.category] || 0) + 1;
    styleCounts[item.style] = (styleCounts[item.style] || 0) + 1;
    totalWorn += item.wornCount;
  });

  const topColor = Object.entries(colorCounts).sort((a, b) => b[1] - a[1])[0];
  const topCategory = Object.entries(categoryCounts).sort((a, b) => b[1] - a[1])[0];
  const topStyle = Object.entries(styleCounts).sort((a, b) => b[1] - a[1])[0];

  return {
    totalItems: wardrobe.length,
    colorCounts,
    categoryCounts,
    styleCounts,
    totalWorn,
    topColor: topColor ? topColor[0] : 'N/A',
    topCategory: topCategory ? topCategory[0] : 'N/A',
    topStyle: topStyle ? topStyle[0] : 'N/A',
  };
}
