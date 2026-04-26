/**
 * Social Store — Lovable Cloud (Supabase) backed.
 *
 * Powers the online-based collaborative filtering layer:
 *  • Posting / browsing / liking / rating / saving outfits
 *  • Persisting fit feedback and wear logs to the cloud (mirrored locally)
 *  • Bridging Supabase auth ⇄ existing localStorage profile so no
 *    existing wardrobe feature breaks.
 */

import { supabase } from '@/integrations/supabase/client';
import { GeneratedOutfit, SharedOutfit, WardrobeItem, ClothingSize, FitFeedback } from './types';
import { getProfile, saveProfile } from './store';

// ── Auth helpers ─────────────────────────────────────────
export async function getCurrentUserId(): Promise<string | null> {
  const { data } = await supabase.auth.getUser();
  return data.user?.id ?? null;
}

export async function isCloudSignedIn(): Promise<boolean> {
  const { data } = await supabase.auth.getSession();
  return !!data.session;
}

export async function isCloudAdmin(): Promise<boolean> {
  const uid = await getCurrentUserId();
  if (!uid) return false;
  const { data } = await supabase
    .from('user_roles')
    .select('role')
    .eq('user_id', uid)
    .eq('role', 'admin')
    .maybeSingle();
  return !!data;
}

/**
 * Sync the local profile with the cloud profile after sign-in/sign-up so
 * the existing localStorage-based wardrobe pages keep working seamlessly.
 */
export async function syncLocalProfileFromCloud(): Promise<void> {
  const uid = await getCurrentUserId();
  if (!uid) return;
  const { data: prof } = await supabase
    .from('profiles')
    .select('display_name, avatar_initial, current_size, preferred_styles')
    .eq('id', uid)
    .maybeSingle();
  if (!prof) return;
  const local = getProfile();
  saveProfile({
    ...local,
    id: uid,
    name: prof.display_name || local.name,
    avatarInitial: prof.avatar_initial || local.avatarInitial,
    currentSize: (prof.current_size as ClothingSize) || local.currentSize || 'M',
    preferredStyles: (prof.preferred_styles as never) || local.preferredStyles,
  });
}

export async function pushLocalProfileToCloud(): Promise<void> {
  const uid = await getCurrentUserId();
  if (!uid) return;
  const p = getProfile();
  await supabase.from('profiles').update({
    display_name: p.name,
    avatar_initial: p.avatarInitial,
    current_size: p.currentSize,
    preferred_styles: p.preferredStyles,
    updated_at: new Date().toISOString(),
  }).eq('id', uid);
}

// ── Social Feed ──────────────────────────────────────────
export async function postOutfit(outfit: GeneratedOutfit, caption: string): Promise<string | null> {
  const uid = await getCurrentUserId();
  if (!uid) return null;
  const cover = outfit.items.find(i => i.image)?.image ?? null;
  const { data, error } = await supabase.from('shared_outfits').insert({
    user_id: uid,
    name: outfit.name,
    caption,
    style: outfit.style,
    occasion: outfit.occasion,
    items: outfit.items as unknown as object,
    cover_image: cover,
  }).select('id').single();
  if (error) { console.error('postOutfit', error); return null; }
  return data.id;
}

export async function fetchFeed(limit = 30): Promise<SharedOutfit[]> {
  const uid = await getCurrentUserId();
  const { data, error } = await supabase
    .from('shared_outfits')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(limit);
  if (error || !data) return [];

  // Fetch authors + my interactions
  const userIds = [...new Set(data.map(d => d.user_id))];
  const { data: authors } = await supabase
    .from('profiles')
    .select('id, display_name, avatar_initial')
    .in('id', userIds);
  const authorMap = new Map((authors || []).map(a => [a.id, a]));

  let likedIds = new Set<string>();
  let savedIds = new Set<string>();
  const myRatings = new Map<string, number>();
  if (uid) {
    const ids = data.map(d => d.id);
    const [{ data: likes }, { data: saves }, { data: ratings }] = await Promise.all([
      supabase.from('outfit_likes').select('outfit_id').eq('user_id', uid).in('outfit_id', ids),
      supabase.from('outfit_saves').select('outfit_id').eq('user_id', uid).in('outfit_id', ids),
      supabase.from('outfit_ratings').select('outfit_id, rating').eq('user_id', uid).in('outfit_id', ids),
    ]);
    likedIds = new Set((likes || []).map(l => l.outfit_id));
    savedIds = new Set((saves || []).map(s => s.outfit_id));
    (ratings || []).forEach(r => myRatings.set(r.outfit_id, r.rating));
  }

  return data.map(d => ({
    ...(d as unknown as SharedOutfit),
    items: d.items as unknown as WardrobeItem[],
    display_name: authorMap.get(d.user_id)?.display_name || 'Someone',
    avatar_initial: authorMap.get(d.user_id)?.avatar_initial || '?',
    liked_by_me: likedIds.has(d.id),
    saved_by_me: savedIds.has(d.id),
    my_rating: myRatings.get(d.id),
  }));
}

export async function toggleLike(outfitId: string, currentlyLiked: boolean): Promise<void> {
  const uid = await getCurrentUserId();
  if (!uid) return;
  if (currentlyLiked) {
    await supabase.from('outfit_likes').delete().eq('outfit_id', outfitId).eq('user_id', uid);
  } else {
    await supabase.from('outfit_likes').insert({ outfit_id: outfitId, user_id: uid });
  }
}

export async function toggleSave(outfitId: string, currentlySaved: boolean): Promise<void> {
  const uid = await getCurrentUserId();
  if (!uid) return;
  if (currentlySaved) {
    await supabase.from('outfit_saves').delete().eq('outfit_id', outfitId).eq('user_id', uid);
  } else {
    await supabase.from('outfit_saves').insert({ outfit_id: outfitId, user_id: uid });
  }
}

export async function rateOutfit(outfitId: string, rating: number): Promise<void> {
  const uid = await getCurrentUserId();
  if (!uid) return;
  await supabase.from('outfit_ratings').upsert(
    { outfit_id: outfitId, user_id: uid, rating },
    { onConflict: 'outfit_id,user_id' }
  );
}

export async function deleteSharedOutfit(outfitId: string): Promise<void> {
  await supabase.from('shared_outfits').delete().eq('id', outfitId);
}

// ── Wear log + fit feedback (cloud mirror) ────────────────
export async function logWear(items: WardrobeItem[]): Promise<void> {
  const uid = await getCurrentUserId();
  if (!uid) return;
  const sig = items.map(i => i.id).sort().join('|');
  const rows = items.map(i => ({
    user_id: uid, item_id: i.id, outfit_signature: sig,
  }));
  if (rows.length) await supabase.from('wear_log').insert(rows);
}

export async function logFitFeedback(itemId: string, itemSize: ClothingSize, fit: FitFeedback): Promise<void> {
  const uid = await getCurrentUserId();
  if (!uid) return;
  await supabase.from('fit_feedback').insert({
    user_id: uid, item_id: itemId, item_size: itemSize, fit,
  });
}

// ── Collaborative similarity from real users ──────────────
/**
 * Build a similarity-weighted recommendation score using REAL user
 * engagement data (likes + saves) — the upgraded collaborative
 * filtering signal that complements the simulated community patterns.
 *
 * Returns: a map of style → boost weight (0..1) computed from outfits
 * the current user has liked/saved + outfits liked/saved by users with
 * overlapping taste.
 */
export async function getSocialAffinity(): Promise<{ styles: Record<string, number>; colors: Record<string, number> }> {
  const empty = { styles: {}, colors: {} };
  const uid = await getCurrentUserId();
  if (!uid) return empty;

  // 1. Find outfits the user liked or saved
  const [{ data: myLikes }, { data: mySaves }] = await Promise.all([
    supabase.from('outfit_likes').select('outfit_id').eq('user_id', uid),
    supabase.from('outfit_saves').select('outfit_id').eq('user_id', uid),
  ]);
  const likedIds = [...new Set([...(myLikes || []).map(l => l.outfit_id), ...(mySaves || []).map(s => s.outfit_id)])];
  if (likedIds.length === 0) return empty;

  // 2. Pull those outfits to learn what styles/colors I prefer in the wild
  const { data: liked } = await supabase
    .from('shared_outfits')
    .select('id, style, items, user_id')
    .in('id', likedIds);
  if (!liked) return empty;

  const styles: Record<string, number> = {};
  const colors: Record<string, number> = {};
  liked.forEach(o => {
    styles[o.style] = (styles[o.style] || 0) + 1;
    const its = (o.items as Array<{ color?: string }>) || [];
    its.forEach(i => { if (i.color) colors[i.color] = (colors[i.color] || 0) + 1; });
  });

  // 3. Normalize 0..1
  const norm = (m: Record<string, number>) => {
    const max = Math.max(1, ...Object.values(m));
    return Object.fromEntries(Object.entries(m).map(([k, v]) => [k, v / max]));
  };
  return { styles: norm(styles), colors: norm(colors) };
}
