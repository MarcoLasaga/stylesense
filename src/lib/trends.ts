/**
 * Trend-Aware Layer.
 *
 * Reads the social feed (shared outfits + likes) and computes which styles,
 * colors, and category combos are currently popular. The recommender uses
 * these scores to boost outfits that include trendy elements.
 *
 * Falls back to the in-memory community patterns when no social data exists yet.
 */

import { supabase } from '@/integrations/supabase/client';

export interface TrendSnapshot {
  topStyles: { value: string; weight: number }[];
  topColors: { value: string; weight: number }[];
  topComboKeys: { value: string; weight: number }[]; // "casual+denim" type keys
  computedAt: number;
}

const CACHE_KEY = 'ss_trends_cache';
const CACHE_TTL_MS = 10 * 60 * 1000;

export async function computeTrendSnapshot(): Promise<TrendSnapshot> {
  // Cache check
  try {
    const c = sessionStorage.getItem(CACHE_KEY);
    if (c) {
      const parsed = JSON.parse(c);
      if (Date.now() - parsed.computedAt < CACHE_TTL_MS) return parsed;
    }
  } catch { /* ignore */ }

  const empty: TrendSnapshot = { topStyles: [], topColors: [], topComboKeys: [], computedAt: Date.now() };
  try {
    const { data, error } = await supabase
      .from('shared_outfits')
      .select('style, occasion, items, like_count, save_count, rating_avg')
      .order('created_at', { ascending: false })
      .limit(200);
    if (error || !data) return empty;

    const styleW: Record<string, number> = {};
    const colorW: Record<string, number> = {};
    const comboW: Record<string, number> = {};

    for (const row of data) {
      // Engagement weight: likes + saves + (rating_avg * rating_count proxy)
      const engagement = 1 + (row.like_count ?? 0) + (row.save_count ?? 0) + (row.rating_avg ?? 0);
      styleW[row.style] = (styleW[row.style] || 0) + engagement;
      const items = (row.items as Array<{ color?: string; style?: string }>) || [];
      items.forEach(it => {
        if (it.color) colorW[it.color] = (colorW[it.color] || 0) + engagement * 0.5;
      });
      // Combo key: style + occasion
      const combo = `${row.style}+${row.occasion}`;
      comboW[combo] = (comboW[combo] || 0) + engagement;
    }

    const toArr = (m: Record<string, number>) =>
      Object.entries(m).sort((a, b) => b[1] - a[1]).slice(0, 10).map(([value, weight]) => ({ value, weight }));

    const snap: TrendSnapshot = {
      topStyles: toArr(styleW),
      topColors: toArr(colorW),
      topComboKeys: toArr(comboW),
      computedAt: Date.now(),
    };
    try { sessionStorage.setItem(CACHE_KEY, JSON.stringify(snap)); } catch { /* ignore */ }
    return snap;
  } catch {
    return empty;
  }
}

/** Score how trendy an outfit is given a snapshot (0..1). */
export function trendScore(
  outfitStyle: string,
  outfitColors: string[],
  outfitOccasion: string,
  snap: TrendSnapshot,
): number {
  if (!snap.topStyles.length && !snap.topColors.length) return 0.3; // neutral when no data
  const max = (arr: { value: string; weight: number }[]) => Math.max(1, ...arr.map(x => x.weight));

  const styleHit = snap.topStyles.find(s => s.value === outfitStyle);
  const styleScore = styleHit ? styleHit.weight / max(snap.topStyles) : 0;

  const colorMaxW = max(snap.topColors);
  const colorScore = outfitColors.reduce((acc, c) => {
    const hit = snap.topColors.find(t => t.value === c);
    return acc + (hit ? hit.weight / colorMaxW : 0);
  }, 0) / Math.max(1, outfitColors.length);

  const comboKey = `${outfitStyle}+${outfitOccasion}`;
  const comboHit = snap.topComboKeys.find(s => s.value === comboKey);
  const comboScore = comboHit ? comboHit.weight / max(snap.topComboKeys) : 0;

  return Math.min(1, styleScore * 0.4 + colorScore * 0.3 + comboScore * 0.3);
}
