/**
 * StyleSense — Hybrid Outfit Recommendation Engine (UPGRADED)
 *
 * Layers (weights sum to 1.0 of the base hybrid score):
 *   1. CONTENT-BASED FILTERING (40%)
 *      Color harmony, style consistency, occasion match, user preference.
 *
 *   2. COLLABORATIVE FILTERING (30%)
 *      Cosine similarity vs. simulated community patterns + REAL user
 *      affinity learned from social likes/saves (see socialStore).
 *
 *   3. TREND-AWARE LAYER (15%)
 *      Boost styles/colors that are popular in the social feed.
 *
 *   4. CONTEXT (WEATHER) FIT (15%)
 *      Penalize/reward items based on current temperature + precipitation.
 *
 * After the weighted sum, two multiplicative modifiers are applied:
 *   • Frequency multiplier (anti-repetition cooldown)
 *   • Size match multiplier (must fit the user's current size)
 */

import {
  WardrobeItem, UserProfile, GeneratedOutfit,
  ClothingCategory, StyleType, OccasionType, CommunityPattern,
  WeatherContext, RecommendationBreakdown,
} from './types';
import { frequencyMultiplier, isInCooldown } from './frequency';
import { TrendSnapshot, trendScore } from './trends';
import { evaluateOutfit } from './fashionRules';
import { getFeedbackAffinity, getBanList } from './feedback';

// ── Color Harmony Rules ──────────────────────────────────
const COLOR_GROUPS: Record<string, string[]> = {
  neutral: ['Black', 'White', 'Gray', 'Beige', 'Cream', 'Brown', 'Khaki', 'Tan', 'Navy'],
  warm:    ['Red', 'Orange', 'Yellow', 'Coral', 'Burgundy', 'Rust', 'Maroon', 'Gold'],
  cool:    ['Blue', 'Green', 'Teal', 'Purple', 'Lavender', 'Mint', 'Sage', 'Olive'],
  pastel:  ['Pink', 'Light Blue', 'Peach', 'Lilac', 'Mint', 'Rose'],
};

function colorHarmonyScore(colors: string[]): number {
  const groups = colors.map(c => {
    for (const [group, members] of Object.entries(COLOR_GROUPS)) {
      if (members.some(m => m.toLowerCase() === c.toLowerCase())) return group;
    }
    return 'neutral';
  });
  const unique = [...new Set(groups)];
  if (unique.length === 1) return 1.0;
  if (unique.every(g => g === 'neutral' || g === unique.find(u => u !== 'neutral'))) return 0.85;
  if (unique.includes('warm') && unique.includes('cool') && !unique.includes('neutral')) return 0.4;
  return 0.65;
}

// ── Simulated Community Patterns ─────────────────────────
const communityPatterns: CommunityPattern[] = [
  { id: 'cp1', userName: 'Alex', preferredStyles: ['casual', 'streetwear'], favoriteColors: ['Black', 'White'],
    outfitPatterns: [
      { categories: ['top', 'bottom', 'shoes'], colors: ['Black', 'Blue', 'White'], styles: ['casual', 'casual', 'casual'], occasion: 'everyday' },
      { categories: ['top', 'bottom', 'shoes', 'outerwear'], colors: ['White', 'Black', 'White', 'Black'], styles: ['streetwear', 'streetwear', 'streetwear', 'streetwear'], occasion: 'school' },
    ]},
  { id: 'cp2', userName: 'Jordan', preferredStyles: ['formal', 'classic'], favoriteColors: ['Navy', 'White', 'Black'],
    outfitPatterns: [
      { categories: ['top', 'bottom', 'shoes'], colors: ['White', 'Black', 'Black'], styles: ['formal', 'formal', 'formal'], occasion: 'work' },
      { categories: ['top', 'bottom', 'shoes', 'accessories'], colors: ['Blue', 'Gray', 'Brown', 'Brown'], styles: ['classic', 'classic', 'classic', 'classic'], occasion: 'work' },
    ]},
  { id: 'cp3', userName: 'Sam', preferredStyles: ['casual', 'minimalist'], favoriteColors: ['White', 'Cream', 'Gray'],
    outfitPatterns: [
      { categories: ['top', 'bottom', 'shoes'], colors: ['White', 'Beige', 'White'], styles: ['minimalist', 'minimalist', 'minimalist'], occasion: 'everyday' },
      { categories: ['top', 'bottom', 'shoes'], colors: ['Gray', 'Black', 'White'], styles: ['casual', 'casual', 'casual'], occasion: 'school' },
    ]},
  { id: 'cp4', userName: 'Taylor', preferredStyles: ['sporty', 'casual'], favoriteColors: ['Black', 'Gray'],
    outfitPatterns: [
      { categories: ['top', 'bottom', 'shoes'], colors: ['Black', 'Gray', 'Black'], styles: ['sporty', 'sporty', 'sporty'], occasion: 'gym' },
      { categories: ['top', 'bottom', 'shoes', 'outerwear'], colors: ['White', 'Black', 'Black', 'Gray'], styles: ['sporty', 'sporty', 'sporty', 'sporty'], occasion: 'outdoor' },
    ]},
  { id: 'cp5', userName: 'Morgan', preferredStyles: ['bohemian', 'vintage'], favoriteColors: ['Brown', 'Cream', 'Green'],
    outfitPatterns: [
      { categories: ['top', 'bottom', 'shoes', 'accessories'], colors: ['Cream', 'Brown', 'Brown', 'Gold'], styles: ['bohemian', 'bohemian', 'bohemian', 'bohemian'], occasion: 'date' },
    ]},
];

// ── Cosine similarity helpers ────────────────────────────
const ALL_STYLES: StyleType[] = ['casual', 'formal', 'sporty', 'streetwear', 'minimalist', 'bohemian', 'vintage', 'classic'];
function styleVector(styles: StyleType[]): number[] {
  return ALL_STYLES.map(s => styles.filter(st => st === s).length);
}
function cosineSimilarity(a: number[], b: number[]): number {
  let dot = 0, magA = 0, magB = 0;
  for (let i = 0; i < a.length; i++) { dot += a[i] * b[i]; magA += a[i] * a[i]; magB += b[i] * b[i]; }
  magA = Math.sqrt(magA); magB = Math.sqrt(magB);
  return magA && magB ? dot / (magA * magB) : 0;
}

function collaborativeScore(
  outfitCategories: ClothingCategory[],
  outfitStyles: StyleType[],
  outfitColors: string[],
  userProfile: UserProfile,
  socialAffinity?: { styles: Record<string, number>; colors: Record<string, number> },
): number {
  const userVec = styleVector(userProfile.preferredStyles);
  let totalScore = 0;
  let totalWeight = 0;

  for (const pattern of communityPatterns) {
    const sim = cosineSimilarity(userVec, styleVector(pattern.preferredStyles));
    if (sim < 0.1) continue;
    for (const op of pattern.outfitPatterns) {
      const catOverlap = outfitCategories.filter(c => op.categories.includes(c)).length / Math.max(outfitCategories.length, op.categories.length);
      const styleOverlap = outfitStyles.filter(s => op.styles.includes(s)).length / Math.max(outfitStyles.length, op.styles.length);
      const patternScore = (catOverlap * 0.3 + styleOverlap * 0.7) * sim;
      totalScore += patternScore;
      totalWeight += sim;
    }
  }
  let base = totalWeight > 0 ? Math.min(totalScore / totalWeight, 1) : 0;

  // Augment with REAL user affinity (online collaborative signal)
  if (socialAffinity) {
    const styleHits = outfitStyles.reduce((acc, s) => acc + (socialAffinity.styles[s] || 0), 0) / outfitStyles.length;
    const colorHits = outfitColors.reduce((acc, c) => acc + (socialAffinity.colors[c] || 0), 0) / outfitColors.length;
    base = Math.min(1, base * 0.6 + styleHits * 0.25 + colorHits * 0.15);
  }
  return base;
}

// ── Content-Based Scoring ────────────────────────────────
function contentBasedScore(
  items: WardrobeItem[],
  profile: UserProfile,
  targetOccasion?: OccasionType
): { score: number; reasons: string[] } {
  const reasons: string[] = [];
  let score = 0;

  const harmony = colorHarmonyScore(items.map(i => i.color));
  score += harmony * 0.25;
  if (harmony > 0.8) reasons.push('Great color combination');

  const styles = items.map(i => i.style);
  const uniqueStyles = [...new Set(styles)];
  const styleConsistency = 1 / uniqueStyles.length;
  score += styleConsistency * 0.25;
  if (uniqueStyles.length === 1) reasons.push(`Cohesive ${uniqueStyles[0]} look`);

  if (targetOccasion) {
    const occasionMatch = items.filter(i => i.occasion === targetOccasion).length / items.length;
    score += occasionMatch * 0.25;
    if (occasionMatch > 0.5) reasons.push(`Perfect for ${targetOccasion}`);
  } else {
    const occasions = items.map(i => i.occasion);
    const commonOccasion = occasions.every(o => o === occasions[0]);
    score += (commonOccasion ? 1 : 0.5) * 0.25;
    if (commonOccasion) reasons.push(`Great for ${occasions[0]}`);
  }

  const prefMatch = items.filter(i =>
    profile.preferredStyles.includes(i.style) ||
    profile.favoriteColors.some(c => c.toLowerCase() === i.color.toLowerCase())
  ).length / items.length;
  score += prefMatch * 0.25;
  if (prefMatch > 0.5) reasons.push('Matches your style preferences');

  return { score: Math.min(score, 1), reasons };
}

// ── Weather context fit ──────────────────────────────────
function weatherFitScore(items: WardrobeItem[], w?: WeatherContext): { score: number; note?: string } {
  if (!w) return { score: 0.5 };
  const fabrics = items.map(i => i.fabric);
  const hasOuter = items.some(i => i.category === 'outerwear');
  const lightFabrics = fabrics.filter(f => f === 'cotton' || f === 'linen' || f === 'silk').length;
  const heavyFabrics = fabrics.filter(f => f === 'wool' || f === 'leather' || f === 'denim' || f === 'knit').length;
  const total = fabrics.length || 1;

  let score = 0.5;
  let note: string | undefined;

  if (w.condition === 'hot') {
    score = lightFabrics / total;
    if (hasOuter) score *= 0.5;
    note = 'Light, breathable for hot weather';
  } else if (w.condition === 'warm') {
    score = 0.4 + 0.5 * (lightFabrics / total);
    if (hasOuter) score *= 0.7;
    note = 'Comfortable for warm weather';
  } else if (w.condition === 'mild') {
    score = 0.7;
  } else if (w.condition === 'cool') {
    score = 0.5 + 0.4 * (heavyFabrics / total) + (hasOuter ? 0.1 : 0);
    note = 'Layers for cool weather';
  } else if (w.condition === 'cold') {
    score = 0.3 + 0.5 * (heavyFabrics / total) + (hasOuter ? 0.2 : 0);
    note = 'Warm fabrics for cold weather';
  }
  if (w.precipitation === 'rain') {
    if (!hasOuter) score *= 0.6;
    if (fabrics.includes('linen') || fabrics.includes('silk')) score *= 0.7;
    note = (note ? note + ' · ' : '') + 'Rain-ready layers';
  }
  return { score: Math.min(1, Math.max(0, score)), note };
}

// ── Main Outfit Generator (UPGRADED) ─────────────────────
export interface GenerateOptions {
  occasion?: OccasionType;
  count?: number;
  includeOuterwear?: boolean;
  weather?: WeatherContext;
  trends?: TrendSnapshot;
  socialAffinity?: { styles: Record<string, number>; colors: Record<string, number> };
  excludeRecentlyWorn?: boolean;
}

export function generateOutfits(
  wardrobe: WardrobeItem[],
  profile: UserProfile,
  options?: GenerateOptions,
): GeneratedOutfit[] {
  const count = options?.count ?? 6;
  const occasion = options?.occasion;
  const weather = options?.weather;
  const trends = options?.trends;

  // Merge cross-user social affinity with this user's explicit feedback
  const fb = getFeedbackAffinity();
  const social = options?.socialAffinity
    ? {
        styles: { ...options.socialAffinity.styles },
        colors: { ...options.socialAffinity.colors },
      }
    : { styles: {} as Record<string, number>, colors: {} as Record<string, number> };
  for (const [k, v] of Object.entries(fb.styles)) social.styles[k] = (social.styles[k] || 0) + v * 0.6;
  for (const [k, v] of Object.entries(fb.colors)) social.colors[k] = (social.colors[k] || 0) + v * 0.6;

  const banList = new Set(getBanList());

  const filteredWardrobe = options?.excludeRecentlyWorn
    ? wardrobe.filter(i => !isInCooldown(i.id))
    : wardrobe;

  const tops = filteredWardrobe.filter(i => i.category === 'top');
  const bottoms = filteredWardrobe.filter(i => i.category === 'bottom');
  const shoes = filteredWardrobe.filter(i => i.category === 'shoes');
  const outerwear = filteredWardrobe.filter(i => i.category === 'outerwear');

  if (tops.length === 0 || bottoms.length === 0) return [];

  const candidates: GeneratedOutfit[] = [];

  for (const top of tops) {
    for (const bottom of bottoms) {
      const baseItems = [top, bottom];
      const shoeOptions: (WardrobeItem | null)[] = shoes.length > 0 ? shoes : [null];
      for (const shoe of shoeOptions) {
        const items = shoe ? [...baseItems, shoe] : baseItems;
        const outerOptions: (WardrobeItem | null)[] = options?.includeOuterwear && outerwear.length > 0
          ? [null, ...outerwear] : [null];
        for (const outer of outerOptions) {
          const finalItems = outer ? [...items, outer] : items;
          if (occasion) {
            const hasMatch = finalItems.some(i => i.occasion === occasion);
            if (!hasMatch) continue;
          }

          // Skip banned combos
          const sig = finalItems.map(i => i.id).sort().join('|');
          if (banList.has(sig)) continue;

          const styleCounts = finalItems.reduce<Record<string, number>>((acc, i) => {
            acc[i.style] = (acc[i.style] || 0) + 1; return acc;
          }, {});
          const dominantStyle = Object.entries(styleCounts).sort((a, b) => b[1] - a[1])[0][0] as StyleType;
          const outfitOccasion = occasion || finalItems[0].occasion;

          // Score components
          const cb = contentBasedScore(finalItems, profile, occasion);
          const cf = collaborativeScore(
            finalItems.map(i => i.category),
            finalItems.map(i => i.style),
            finalItems.map(i => i.color),
            profile,
            social,
          );
          const tScore = trends ? trendScore(dominantStyle, finalItems.map(i => i.color), outfitOccasion, trends) : 0.3;
          const wFit = weatherFitScore(finalItems, weather);

          // Fashion Knowledge Engine
          const fashion = evaluateOutfit(finalItems, outfitOccasion, weather);

          // Hybrid weighted score
          // Weights: Content 35 · Collab 25 · Trend 10 · Weather 10 · Fashion Rules 20
          const base =
            cb.score * 0.35 +
            cf * 0.25 +
            tScore * 0.10 +
            wFit.score * 0.10 +
            fashion.score * 0.20;

          const freqMult = frequencyMultiplier(finalItems);
          const wrongSize = finalItems.filter(i => i.size && i.size !== profile.currentSize).length;
          const sizeMult = wrongSize === 0 ? 1 : Math.max(0.4, 1 - wrongSize * 0.15);

          const finalScore = base * freqMult * sizeMult;

          const reasons = [...cb.reasons];
          if (tScore > 0.5) reasons.push('Trending now');
          if (wFit.note) reasons.push(wFit.note);
          if (fashion.color.note) reasons.push(fashion.color.note);
          if (fashion.category.notes.length) reasons.push(...fashion.category.notes);
          if (freqMult < 0.7) reasons.push('Includes recently-worn item');

          // Normalised contributions (sum = 100) for Explainable Panel
          const raw = {
            userPreference: cb.score * 0.35,
            wardrobeCompatibility: fashion.score * 0.20,
            collaborative: cf * 0.25,
            trend: tScore * 0.10,
            weather: wFit.score * 0.10,
            frequency: (freqMult - 1) * 10,   // negative when penalised
            fashionRules: fashion.score * 0.05,
          };
          const sum = Object.values(raw).reduce((s, v) => s + Math.max(0, v), 0) || 1;
          const contributions = Object.fromEntries(
            Object.entries(raw).map(([k, v]) => [k, Math.round((Math.max(0, v) / sum) * 100)])
          ) as RecommendationBreakdown['contributions'];

          candidates.push({
            id: `outfit_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
            userId: profile.id,
            name: `${dominantStyle.charAt(0).toUpperCase() + dominantStyle.slice(1)} ${outfitOccasion} Look`,
            items: finalItems,
            occasion: outfitOccasion,
            style: dominantStyle,
            score: finalScore,
            reason: reasons.length > 0 ? reasons.join(' · ') : 'Recommended combination',
            createdAt: Date.now(),
            breakdown: {
              contentScore: cb.score,
              collaborativeScore: cf,
              trendScore: tScore,
              frequencyPenalty: 1 - freqMult,
              weatherFit: wFit.score,
              fashionScore: fashion.score,
              finalScore,
              factors: reasons,
              contributions,
            },
          });
        }
      }
    }
  }

  const sorted = candidates.sort((a, b) => b.score - a.score);
  const seen = new Set<string>();
  const unique = sorted.filter(o => {
    const key = o.items.map(i => i.id).sort().join(',');
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
  return unique.slice(0, count);
}

export function randomOutfit(wardrobe: WardrobeItem[], profile: UserProfile): GeneratedOutfit | null {
  const tops = wardrobe.filter(i => i.category === 'top');
  const bottoms = wardrobe.filter(i => i.category === 'bottom');
  const shoes = wardrobe.filter(i => i.category === 'shoes');
  if (tops.length === 0 || bottoms.length === 0) return null;
  const pick = <T>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];
  const items: WardrobeItem[] = [pick(tops), pick(bottoms)];
  if (shoes.length > 0) items.push(pick(shoes));
  const cb = contentBasedScore(items, profile);
  return {
    id: `outfit_random_${Date.now()}`,
    userId: profile.id,
    name: 'Surprise Outfit',
    items,
    occasion: items[0].occasion,
    style: items[0].style,
    score: cb.score,
    reason: 'Random pick from your wardrobe!',
    createdAt: Date.now(),
  };
}

// ── Stats ────────────────────────────────────────────────
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
    colorCounts, categoryCounts, styleCounts, totalWorn,
    topColor: topColor ? topColor[0] : 'N/A',
    topCategory: topCategory ? topCategory[0] : 'N/A',
    topStyle: topStyle ? topStyle[0] : 'N/A',
  };
}
