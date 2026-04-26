/**
 * Frequency Tracker — anti-repetition system.
 *
 * Tracks how often each clothing item / outfit has been worn and
 * applies cooldown penalties so the recommender naturally rotates
 * variety into the user's suggestions.
 *
 * Storage: localStorage (per current user) — kept lightweight and
 * also mirrored to the cloud `wear_log` table when the user is
 * signed in (see socialStore.logWear).
 */

import { WardrobeItem } from './types';

const KEY_WEAR = 'ss_wear_log';     // [{ itemId, ts }]
const KEY_OUTFIT_WEAR = 'ss_outfit_wear_log'; // [{ signature, ts }]

export interface WearEntry { itemId: string; ts: number }
export interface OutfitWearEntry { signature: string; ts: number }

const DAY = 24 * 60 * 60 * 1000;

/** Cooldown window: don't suggest the same item within N days. */
export const COOLDOWN_DAYS = 3;
/** After N wears in the window, penalty grows quickly. */
export const FREQUENCY_WINDOW_DAYS = 14;

export function outfitSignature(items: WardrobeItem[]): string {
  return items.map(i => i.id).sort().join('|');
}

function readWear(): WearEntry[] {
  try { return JSON.parse(localStorage.getItem(KEY_WEAR) || '[]'); } catch { return []; }
}
function writeWear(w: WearEntry[]) { localStorage.setItem(KEY_WEAR, JSON.stringify(w)); }

function readOutfitWear(): OutfitWearEntry[] {
  try { return JSON.parse(localStorage.getItem(KEY_OUTFIT_WEAR) || '[]'); } catch { return []; }
}
function writeOutfitWear(w: OutfitWearEntry[]) { localStorage.setItem(KEY_OUTFIT_WEAR, JSON.stringify(w)); }

/** Record that an outfit (and its items) was worn today. */
export function recordWear(items: WardrobeItem[]) {
  const now = Date.now();
  const log = readWear();
  items.forEach(i => log.push({ itemId: i.id, ts: now }));
  writeWear(log);

  const oLog = readOutfitWear();
  oLog.push({ signature: outfitSignature(items), ts: now });
  writeOutfitWear(oLog);
}

/** Number of times an item was worn in the last `windowDays` days. */
export function wearCount(itemId: string, windowDays = FREQUENCY_WINDOW_DAYS): number {
  const cutoff = Date.now() - windowDays * DAY;
  return readWear().filter(e => e.itemId === itemId && e.ts >= cutoff).length;
}

/** Last time an item was worn (ms timestamp), or undefined. */
export function lastWornAt(itemId: string): number | undefined {
  const entries = readWear().filter(e => e.itemId === itemId).sort((a, b) => b.ts - a.ts);
  return entries[0]?.ts;
}

/** Days since item was last worn (Infinity if never). */
export function daysSinceLastWorn(itemId: string): number {
  const last = lastWornAt(itemId);
  if (!last) return Infinity;
  return (Date.now() - last) / DAY;
}

/**
 * Penalty multiplier for an outfit (0..1). 1 = no penalty, 0 = strongly penalized.
 * Two effects compound:
 *  • Cooldown: any item worn within COOLDOWN_DAYS halves the score
 *  • Frequency: each wear in the 14-day window subtracts 10% (capped)
 */
export function frequencyMultiplier(items: WardrobeItem[]): number {
  let mult = 1;
  for (const item of items) {
    const days = daysSinceLastWorn(item.id);
    if (days < COOLDOWN_DAYS) mult *= 0.5;            // cooldown
    const wears = wearCount(item.id);
    mult *= Math.max(0.4, 1 - wears * 0.1);           // saturation
  }
  // Outfit-level: this exact combo recently used? penalize hard.
  const sig = outfitSignature(items);
  const recent = readOutfitWear().some(o => o.signature === sig && (Date.now() - o.ts) < COOLDOWN_DAYS * DAY);
  if (recent) mult *= 0.3;
  return mult;
}

/** Hard exclude items inside the cooldown window (used by "Recently worn" filter). */
export function isInCooldown(itemId: string): boolean {
  return daysSinceLastWorn(itemId) < COOLDOWN_DAYS;
}

/** Stats for the admin / profile view. */
export function frequencyStats() {
  const w = readWear();
  const cutoff = Date.now() - FREQUENCY_WINDOW_DAYS * DAY;
  const recent = w.filter(e => e.ts >= cutoff);
  const counts = recent.reduce<Record<string, number>>((acc, e) => {
    acc[e.itemId] = (acc[e.itemId] || 0) + 1;
    return acc;
  }, {});
  return {
    totalWears: w.length,
    recentWears: recent.length,
    uniqueItemsRecent: Object.keys(counts).length,
    perItem: counts,
  };
}
