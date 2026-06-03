/**
 * StyleSense — Feedback Learning System
 *
 * Captures explicit user feedback on recommendations and feeds it back
 * into the recommendation engine as a personalised affinity vector.
 *
 * Storage: localStorage (per-device). Aggregated counts per style and
 * per color are converted to a normalised weight map used by the hybrid
 * recommendation pipeline (see recommendation.ts).
 */

import { GeneratedOutfit, StyleType } from './types';

export type FeedbackAction = 'wore' | 'loved' | 'saved' | 'disliked' | 'banned';

export interface FeedbackEvent {
  outfitSignature: string;        // sorted item-id list, identifies the combo
  action: FeedbackAction;
  styles: StyleType[];
  colors: string[];
  occasion: string;
  at: number;
}

const KEY = 'ss_feedback_events';
const BAN_KEY = 'ss_feedback_bans'; // ban list of outfit signatures

const WEIGHTS: Record<FeedbackAction, number> = {
  loved: 2,
  wore: 1.5,
  saved: 1,
  disliked: -1.5,
  banned: -3,
};

function read(): FeedbackEvent[] {
  try { return JSON.parse(localStorage.getItem(KEY) || '[]'); }
  catch { return []; }
}

function write(evts: FeedbackEvent[]) {
  localStorage.setItem(KEY, JSON.stringify(evts.slice(-500))); // cap history
}

export function outfitSignature(outfit: GeneratedOutfit): string {
  return outfit.items.map(i => i.id).sort().join('|');
}

export function recordFeedback(outfit: GeneratedOutfit, action: FeedbackAction) {
  const evts = read();
  const sig = outfitSignature(outfit);
  evts.push({
    outfitSignature: sig,
    action,
    styles: outfit.items.map(i => i.style),
    colors: outfit.items.map(i => i.color),
    occasion: outfit.occasion,
    at: Date.now(),
  });
  write(evts);
  if (action === 'banned') {
    const bans = getBanList();
    if (!bans.includes(sig)) {
      bans.push(sig);
      localStorage.setItem(BAN_KEY, JSON.stringify(bans));
    }
  }
}

export function getBanList(): string[] {
  try { return JSON.parse(localStorage.getItem(BAN_KEY) || '[]'); }
  catch { return []; }
}

export function getAllFeedback(): FeedbackEvent[] {
  return read();
}

/**
 * Aggregate feedback into a normalised affinity map used during scoring.
 * Returns weights in roughly [-1, 1] per style/color.
 */
export function getFeedbackAffinity(): { styles: Record<string, number>; colors: Record<string, number> } {
  const evts = read();
  const styles: Record<string, number> = {};
  const colors: Record<string, number> = {};
  for (const e of evts) {
    const w = WEIGHTS[e.action] ?? 0;
    // Decay older events (half-life ~30 days)
    const ageDays = (Date.now() - e.at) / (1000 * 60 * 60 * 24);
    const decay = Math.pow(0.5, ageDays / 30);
    const eff = w * decay;
    for (const s of e.styles) styles[s] = (styles[s] || 0) + eff;
    for (const c of e.colors) colors[c] = (colors[c] || 0) + eff;
  }
  // Normalise
  const norm = (m: Record<string, number>) => {
    const max = Math.max(1, ...Object.values(m).map(v => Math.abs(v)));
    return Object.fromEntries(Object.entries(m).map(([k, v]) => [k, v / max]));
  };
  return { styles: norm(styles), colors: norm(colors) };
}

export function getFeedbackStats() {
  const evts = read();
  const byAction: Record<FeedbackAction, number> = {
    wore: 0, loved: 0, saved: 0, disliked: 0, banned: 0,
  };
  for (const e of evts) byAction[e.action] = (byAction[e.action] || 0) + 1;
  const positive = byAction.loved + byAction.wore + byAction.saved;
  const negative = byAction.disliked + byAction.banned;
  const total = positive + negative;
  return {
    total: evts.length,
    byAction,
    acceptanceRate: total > 0 ? positive / total : 0,
    rejectionRate: total > 0 ? negative / total : 0,
  };
}
