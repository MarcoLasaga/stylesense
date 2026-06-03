/**
 * StyleSense — Fashion Knowledge Engine
 *
 * Rule-based validator that scores outfit combinations against
 * established fashion rules:
 *   1. Color compatibility (complementary, analogous, neutral)
 *   2. Occasion appropriateness
 *   3. Seasonal / environmental suitability
 *   4. Clothing category compatibility (e.g. no athletic + formal)
 *
 * Each validator returns a score in [0,1] plus a human-readable
 * explanation that the Explainable Recommendation Panel surfaces
 * to the user.
 */

import { WardrobeItem, OccasionType, WeatherContext, StyleType } from './types';

// ── Color Theory ────────────────────────────────────────────
const NEUTRALS = ['black', 'white', 'gray', 'grey', 'beige', 'cream', 'tan', 'khaki', 'navy', 'brown'];

// Simplified color wheel positions (degrees)
const HUE_MAP: Record<string, number> = {
  red: 0, coral: 10, orange: 30, peach: 25, rust: 20, burgundy: 350, maroon: 345,
  yellow: 55, gold: 50,
  olive: 75, sage: 90, green: 120, mint: 150, teal: 175,
  'light blue': 200, blue: 220, navy: 230,
  purple: 280, lilac: 290, lavender: 290, pink: 330, rose: 340,
};

function colorHue(c: string): number | null {
  const k = c.toLowerCase();
  if (k in HUE_MAP) return HUE_MAP[k];
  return null;
}

function isNeutral(c: string): boolean {
  return NEUTRALS.includes(c.toLowerCase());
}

export interface ColorRuleResult {
  score: number;
  type: 'monochrome' | 'neutral' | 'analogous' | 'complementary' | 'triadic' | 'clash';
  note: string;
}

/** Classify a color combination using basic color theory. */
export function evaluateColors(colors: string[]): ColorRuleResult {
  const uniq = [...new Set(colors.map(c => c.toLowerCase()))];
  if (uniq.length <= 1) return { score: 0.9, type: 'monochrome', note: 'Monochrome palette — always safe' };

  const nonNeutral = uniq.filter(c => !isNeutral(c));
  if (nonNeutral.length === 0) {
    return { score: 1.0, type: 'neutral', note: 'All-neutral palette — clean and versatile' };
  }
  if (nonNeutral.length === 1) {
    return { score: 0.95, type: 'neutral', note: `Neutrals anchor the ${nonNeutral[0]} accent` };
  }

  const hues = nonNeutral.map(colorHue).filter((h): h is number => h !== null);
  if (hues.length < 2) return { score: 0.7, type: 'neutral', note: 'Balanced color mix' };

  // Compute pairwise hue distances
  let maxDist = 0;
  let minDist = 360;
  for (let i = 0; i < hues.length; i++) {
    for (let j = i + 1; j < hues.length; j++) {
      const d = Math.min(Math.abs(hues[i] - hues[j]), 360 - Math.abs(hues[i] - hues[j]));
      if (d > maxDist) maxDist = d;
      if (d < minDist) minDist = d;
    }
  }

  if (maxDist <= 40) return { score: 0.9, type: 'analogous', note: 'Analogous colors — harmonious blend' };
  if (maxDist >= 150 && maxDist <= 210) return { score: 0.85, type: 'complementary', note: 'Complementary contrast — bold and striking' };
  if (maxDist >= 100 && maxDist <= 140) return { score: 0.75, type: 'triadic', note: 'Triadic balance — vibrant yet stable' };
  if (maxDist > 60 && maxDist < 100) return { score: 0.55, type: 'clash', note: 'Colors compete — consider a neutral anchor' };
  return { score: 0.7, type: 'analogous', note: 'Balanced color mix' };
}

// ── Occasion Compatibility ──────────────────────────────────
const OCCASION_STYLE_FIT: Record<OccasionType, Partial<Record<StyleType, number>>> = {
  school:   { casual: 1.0, streetwear: 0.95, minimalist: 0.9, sporty: 0.7, classic: 0.7, formal: 0.4, bohemian: 0.6, vintage: 0.7 },
  work:     { formal: 1.0, classic: 0.95, minimalist: 0.85, casual: 0.5, streetwear: 0.3, sporty: 0.1, bohemian: 0.5, vintage: 0.6 },
  gym:      { sporty: 1.0, casual: 0.4, streetwear: 0.5, minimalist: 0.3, formal: 0.0, classic: 0.0, bohemian: 0.1, vintage: 0.1 },
  party:    { streetwear: 0.9, classic: 0.8, formal: 0.85, casual: 0.6, minimalist: 0.7, bohemian: 0.85, vintage: 0.8, sporty: 0.2 },
  date:     { classic: 0.9, minimalist: 0.85, casual: 0.7, formal: 0.85, bohemian: 0.85, vintage: 0.8, streetwear: 0.6, sporty: 0.2 },
  outdoor:  { sporty: 0.9, casual: 0.85, streetwear: 0.7, minimalist: 0.6, bohemian: 0.6, classic: 0.4, formal: 0.1, vintage: 0.5 },
  everyday: { casual: 1.0, streetwear: 0.85, minimalist: 0.85, sporty: 0.6, classic: 0.7, formal: 0.5, bohemian: 0.7, vintage: 0.7 },
};

export function evaluateOccasion(items: WardrobeItem[], target: OccasionType): { score: number; note: string } {
  let total = 0;
  for (const item of items) {
    const fit = OCCASION_STYLE_FIT[target]?.[item.style] ?? 0.5;
    total += fit;
  }
  const score = total / items.length;
  let note = `Suitable for ${target}`;
  if (score < 0.4) note = `Mismatched for ${target} — pieces feel out of context`;
  else if (score < 0.7) note = `Acceptable for ${target}, with room to improve`;
  return { score, note };
}

// ── Category Compatibility (anti-clash rules) ───────────────
const CATEGORY_RULES: { test: (items: WardrobeItem[]) => boolean; penalty: number; reason: string }[] = [
  {
    test: items => items.some(i => i.style === 'sporty') && items.some(i => i.style === 'formal'),
    penalty: 0.4,
    reason: 'Athletic and formal pieces should not mix',
  },
  {
    test: items => {
      const formal = items.filter(i => i.style === 'formal').length;
      return formal > 0 && items.some(i => i.fabric === 'denim' && i.category === 'bottom');
    },
    penalty: 0.15,
    reason: 'Denim weakens an otherwise formal look',
  },
  {
    test: items => items.filter(i => i.style === 'streetwear').length > 0 && items.some(i => i.style === 'classic') && items.length > 2,
    penalty: 0.1,
    reason: 'Streetwear and classic pieces fight for attention',
  },
];

export function evaluateCategoryCompatibility(items: WardrobeItem[]): { score: number; notes: string[] } {
  let score = 1.0;
  const notes: string[] = [];
  for (const r of CATEGORY_RULES) {
    if (r.test(items)) {
      score -= r.penalty;
      notes.push(r.reason);
    }
  }
  return { score: Math.max(0, score), notes };
}

// ── Seasonal / Environmental Suitability ────────────────────
export function evaluateSeasonal(items: WardrobeItem[], w?: WeatherContext): { score: number; note: string } {
  if (!w) return { score: 0.7, note: 'No weather data — neutral score' };

  const hasOuter = items.some(i => i.category === 'outerwear');
  const light = items.filter(i => i.fabric === 'cotton' || i.fabric === 'linen' || i.fabric === 'silk').length;
  const heavy = items.filter(i => i.fabric === 'wool' || i.fabric === 'leather' || i.fabric === 'knit').length;
  const total = items.length;

  let s = 0.7;
  let note = 'Suitable for current weather';

  if (w.condition === 'hot') {
    s = light / total;
    if (hasOuter) s *= 0.4;
    note = 'Lightweight, breathable pieces for the heat';
  } else if (w.condition === 'cold') {
    s = heavy / total + (hasOuter ? 0.3 : 0);
    note = 'Insulating layers for cold weather';
  } else if (w.condition === 'cool') {
    s = 0.5 + 0.3 * (heavy / total) + (hasOuter ? 0.2 : 0);
    note = 'Layered for cool weather';
  }

  if (w.precipitation === 'rain') {
    if (!hasOuter) { s *= 0.55; note = 'Add a jacket — rain expected'; }
    else note = 'Rain-ready with outer layer';
  }

  return { score: Math.min(1, Math.max(0, s)), note };
}

// ── Master Fashion Score ────────────────────────────────────
export interface FashionEvaluation {
  score: number;            // 0..1 overall fashion-rule score
  color: ColorRuleResult;
  occasion: { score: number; note: string };
  category: { score: number; notes: string[] };
  seasonal: { score: number; note: string };
  notes: string[];
}

export function evaluateOutfit(
  items: WardrobeItem[],
  occasion: OccasionType,
  weather?: WeatherContext,
): FashionEvaluation {
  const color = evaluateColors(items.map(i => i.color));
  const occ = evaluateOccasion(items, occasion);
  const cat = evaluateCategoryCompatibility(items);
  const seas = evaluateSeasonal(items, weather);

  const score = color.score * 0.30 + occ.score * 0.30 + cat.score * 0.25 + seas.score * 0.15;

  const notes: string[] = [color.note, occ.note, seas.note, ...cat.notes];
  return { score, color, occasion: occ, category: cat, seasonal: seas, notes };
}
