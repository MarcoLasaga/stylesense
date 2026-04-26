/**
 * Size Adaptability System — automatically updates the user's size
 * profile when fit feedback shows a consistent drift.
 *
 * Algorithm:
 *  1. Collect last N fit feedbacks (item_size, fit) from localStorage + cloud.
 *  2. Convert each into a "preferred size delta" relative to the item:
 *       too_tight  → user is one size larger than item
 *       too_loose  → user is one size smaller than item
 *       perfect    → user matches the item size
 *  3. Take a weighted majority over the recent window (newer = heavier).
 *  4. If the inferred size differs from current profile size by ≥1 step
 *     AND the supporting evidence count ≥ MIN_SAMPLES, recommend an update.
 *
 * The user always keeps the option to confirm or dismiss the suggestion.
 */

import { ClothingSize, ALL_SIZES, FitFeedback } from './types';

const KEY = 'ss_fit_feedback';
const MIN_SAMPLES = 3;
const WINDOW_DAYS = 90;

export interface FitEntry {
  itemId: string;
  itemSize: ClothingSize;
  fit: FitFeedback;
  ts: number;
}

function read(): FitEntry[] {
  try { return JSON.parse(localStorage.getItem(KEY) || '[]'); } catch { return []; }
}
function write(list: FitEntry[]) { localStorage.setItem(KEY, JSON.stringify(list)); }

export function recordFitFeedback(itemId: string, itemSize: ClothingSize, fit: FitFeedback) {
  const list = read();
  list.push({ itemId, itemSize, fit, ts: Date.now() });
  write(list);
}

export function getAllFitFeedback(): FitEntry[] {
  return read();
}

function shift(size: ClothingSize, delta: number): ClothingSize {
  const idx = ALL_SIZES.indexOf(size);
  const next = Math.max(0, Math.min(ALL_SIZES.length - 1, idx + delta));
  return ALL_SIZES[next];
}

/**
 * Returns the inferred size from recent feedback, or null if not enough data.
 */
export function inferUserSize(currentSize: ClothingSize): {
  suggested: ClothingSize;
  confidence: number;
  samples: number;
  reason: string;
} | null {
  const cutoff = Date.now() - WINDOW_DAYS * 24 * 60 * 60 * 1000;
  const recent = read().filter(e => e.ts >= cutoff);
  if (recent.length < MIN_SAMPLES) return null;

  // Convert each feedback into an "implied user size" then weighted vote.
  const tally: Record<string, number> = {};
  let totalWeight = 0;
  recent.forEach((e, i) => {
    const ageDays = (Date.now() - e.ts) / (24 * 60 * 60 * 1000);
    const recencyW = Math.max(0.3, 1 - ageDays / WINDOW_DAYS); // newer weighs more
    let implied: ClothingSize = e.itemSize;
    if (e.fit === 'too_tight') implied = shift(e.itemSize, +1);
    else if (e.fit === 'too_loose') implied = shift(e.itemSize, -1);
    tally[implied] = (tally[implied] || 0) + recencyW;
    totalWeight += recencyW;
  });

  const ranked = Object.entries(tally).sort((a, b) => b[1] - a[1]);
  const [bestSize, bestW] = ranked[0];
  const confidence = bestW / totalWeight;

  if (bestSize === currentSize) return null;
  if (confidence < 0.5) return null; // no clear majority

  const direction = ALL_SIZES.indexOf(bestSize as ClothingSize) > ALL_SIZES.indexOf(currentSize)
    ? 'larger' : 'smaller';
  return {
    suggested: bestSize as ClothingSize,
    confidence,
    samples: recent.length,
    reason: `Based on ${recent.length} fit reports, your size appears to trend ${direction} (${Math.round(confidence * 100)}% agreement).`,
  };
}
