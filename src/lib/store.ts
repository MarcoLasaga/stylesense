/**
 * StyleSense Store — localStorage-based persistence layer
 * Manages user wardrobe, outfits, and preferences
 */
import { WardrobeItem, UserProfile, SavedOutfit, OutfitHistory, GeneratedOutfit } from './types';

const KEYS = {
  profile: 'ss_profile',
  wardrobe: 'ss_wardrobe',
  savedOutfits: 'ss_saved_outfits',
  history: 'ss_history',
  auth: 'ss_auth',
};

// ── Profile ──────────────────────────────────────────────
const defaultProfile: UserProfile = {
  id: 'user_1',
  name: '',
  email: '',
  age: 22,
  gender: 'prefer-not-to-say',
  bodyType: 'average',
  preferredStyles: ['casual'],
  favoriteColors: ['Black', 'White'],
  occasionPreference: ['everyday'],
  avatarInitial: '?',
};

export const getProfile = (): UserProfile => {
  const s = localStorage.getItem(KEYS.profile);
  return s ? JSON.parse(s) : defaultProfile;
};

export const saveProfile = (p: UserProfile): void => {
  localStorage.setItem(KEYS.profile, JSON.stringify(p));
};

// ── Auth ─────────────────────────────────────────────────
export const isLoggedIn = (): boolean => localStorage.getItem(KEYS.auth) === 'true';

export const login = (email: string, _pw: string): boolean => {
  const p = getProfile();
  p.email = email;
  saveProfile(p);
  localStorage.setItem(KEYS.auth, 'true');
  return true;
};

export const signup = (name: string, email: string, _pw: string): boolean => {
  const p: UserProfile = {
    ...defaultProfile,
    id: 'user_' + Date.now(),
    name,
    email,
    avatarInitial: name.charAt(0).toUpperCase(),
  };
  saveProfile(p);
  localStorage.setItem(KEYS.auth, 'true');
  return true;
};

export const logout = (): void => { localStorage.removeItem(KEYS.auth); };

// ── Wardrobe ─────────────────────────────────────────────
export const getWardrobe = (): WardrobeItem[] => {
  const s = localStorage.getItem(KEYS.wardrobe);
  return s ? JSON.parse(s) : [];
};

export const addWardrobeItem = (item: WardrobeItem): void => {
  const w = getWardrobe();
  w.push(item);
  localStorage.setItem(KEYS.wardrobe, JSON.stringify(w));
};

export const updateWardrobeItem = (item: WardrobeItem): void => {
  const w = getWardrobe().map(i => i.id === item.id ? item : i);
  localStorage.setItem(KEYS.wardrobe, JSON.stringify(w));
};

export const deleteWardrobeItem = (id: string): void => {
  const w = getWardrobe().filter(i => i.id !== id);
  localStorage.setItem(KEYS.wardrobe, JSON.stringify(w));
};

// ── Saved Outfits ────────────────────────────────────────
export const getSavedOutfits = (): SavedOutfit[] => {
  const s = localStorage.getItem(KEYS.savedOutfits);
  return s ? JSON.parse(s) : [];
};

export const saveOutfit = (outfit: GeneratedOutfit): void => {
  const saved = getSavedOutfits();
  saved.push({ id: outfit.id, outfit, savedAt: Date.now(), wornDates: [] });
  localStorage.setItem(KEYS.savedOutfits, JSON.stringify(saved));
};

export const removeSavedOutfit = (id: string): void => {
  const saved = getSavedOutfits().filter(o => o.id !== id);
  localStorage.setItem(KEYS.savedOutfits, JSON.stringify(saved));
};

export const markOutfitWorn = (id: string): void => {
  const saved = getSavedOutfits().map(o => {
    if (o.id === id) {
      o.wornDates.push(Date.now());
      // Also increment worn count on items
      o.outfit.items.forEach(item => {
        const w = getWardrobe();
        const found = w.find(i => i.id === item.id);
        if (found) {
          found.wornCount++;
          found.lastWorn = Date.now();
          updateWardrobeItem(found);
        }
      });
    }
    return o;
  });
  localStorage.setItem(KEYS.savedOutfits, JSON.stringify(saved));
};

// ── History ──────────────────────────────────────────────
export const getHistory = (): OutfitHistory[] => {
  const s = localStorage.getItem(KEYS.history);
  return s ? JSON.parse(s) : [];
};

export const addHistory = (entry: OutfitHistory): void => {
  const h = getHistory();
  h.push(entry);
  localStorage.setItem(KEYS.history, JSON.stringify(h));
};
