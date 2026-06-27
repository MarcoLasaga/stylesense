/**
 * StyleSense Store — localStorage-based persistence layer
 * Manages user wardrobe, outfits, preferences, and multi-user accounts
 */
import { WardrobeItem, UserProfile, SavedOutfit, OutfitHistory, GeneratedOutfit, UserRole, LaundryStatus, OutfitRating } from './types';

const KEYS = {
  profile: 'ss_profile',
  wardrobe: 'ss_wardrobe',
  savedOutfits: 'ss_saved_outfits',
  history: 'ss_history',
  auth: 'ss_auth',
  users: 'ss_users', // all registered user profiles
  allWardrobe: 'ss_all_wardrobe', // all users' wardrobe items
  allSavedOutfits: 'ss_all_saved_outfits',
};

// ── Default Admin Account ────────────────────────────────
const defaultAdmin: UserProfile = {
  id: 'admin_default',
  name: 'Admin',
  email: 'admin@stylesense.com',
  age: 30,
  gender: 'prefer-not-to-say',
  bodyType: 'average',
  currentSize: 'M',
  preferredStyles: ['casual'],
  favoriteColors: ['Black', 'White'],
  occasionPreference: ['everyday'],
  avatarInitial: 'A',
  role: 'admin',
  createdAt: 1700000000000,
};

const ADMIN_PASSWORD = 'admin123';

// Initialize default admin in users list
function ensureAdminExists(): void {
  const users = getAllUsers();
  if (!users.find(u => u.email === defaultAdmin.email)) {
    users.push(defaultAdmin);
    localStorage.setItem(KEYS.users, JSON.stringify(users));
    // Store admin password hash (simple for demo)
    localStorage.setItem('ss_pw_admin@stylesense.com', ADMIN_PASSWORD);
  }
}

// ── Profile ──────────────────────────────────────────────
const defaultProfile: UserProfile = {
  id: 'user_1',
  name: '',
  email: '',
  age: 22,
  gender: 'prefer-not-to-say',
  bodyType: 'average',
  currentSize: 'M',
  preferredStyles: ['casual'],
  favoriteColors: ['Black', 'White'],
  occasionPreference: ['everyday'],
  avatarInitial: '?',
  role: 'user',
  createdAt: Date.now(),
};

export const getProfile = (): UserProfile => {
  const s = localStorage.getItem(KEYS.profile);
  if (s) {
    const parsed = JSON.parse(s);
    // Backfill role for legacy profiles
    if (!parsed.role) parsed.role = 'user';
    if (!parsed.createdAt) parsed.createdAt = Date.now();
    if (!parsed.currentSize) parsed.currentSize = 'M';
    return parsed;
  }
  return defaultProfile;
};

export const saveProfile = (p: UserProfile): void => {
  localStorage.setItem(KEYS.profile, JSON.stringify(p));
  // Also update in users list
  const users = getAllUsers();
  const idx = users.findIndex(u => u.id === p.id);
  if (idx >= 0) users[idx] = p;
  else users.push(p);
  localStorage.setItem(KEYS.users, JSON.stringify(users));
};

// ── Auth ─────────────────────────────────────────────────
export const isLoggedIn = (): boolean => localStorage.getItem(KEYS.auth) === 'true';

export const isAdmin = (): boolean => {
  if (!isLoggedIn()) return false;
  return getProfile().role === 'admin';
};

export const login = (email: string, pw: string): boolean => {
  ensureAdminExists();
  const users = getAllUsers();
  const user = users.find(u => u.email === email);
  const storedPw = localStorage.getItem(`ss_pw_${email}`);

  if (user && storedPw === pw) {
    localStorage.setItem(KEYS.profile, JSON.stringify(user));
    localStorage.setItem(KEYS.auth, 'true');
    return true;
  }

  // If no users exist yet (first regular login), create account on the fly
  if (!user) {
    return false;
  }

  return false;
};

export const signup = (name: string, email: string, pw: string): boolean => {
  ensureAdminExists();
  const users = getAllUsers();
  if (users.find(u => u.email === email)) return false; // Email taken

  const p: UserProfile = {
    ...defaultProfile,
    id: 'user_' + Date.now(),
    name,
    email,
    avatarInitial: name.charAt(0).toUpperCase(),
    role: 'user',
    createdAt: Date.now(),
  };
  localStorage.setItem(`ss_pw_${email}`, pw);
  saveProfile(p);
  localStorage.setItem(KEYS.auth, 'true');
  return true;
};

export const logout = (): void => { localStorage.removeItem(KEYS.auth); };

// ── Users (Admin) ────────────────────────────────────────
export const getAllUsers = (): UserProfile[] => {
  ensureUsersStore();
  const s = localStorage.getItem(KEYS.users);
  return s ? JSON.parse(s) : [];
};

function ensureUsersStore() {
  if (!localStorage.getItem(KEYS.users)) {
    localStorage.setItem(KEYS.users, JSON.stringify([]));
  }
}

export const deleteUser = (userId: string): void => {
  const users = getAllUsers().filter(u => u.id !== userId && u.email !== 'admin@stylesense.com');
  localStorage.setItem(KEYS.users, JSON.stringify(users));
  // Also remove their wardrobe items
  const allItems = getAllWardrobeItems().filter(i => i.userId !== userId);
  localStorage.setItem(KEYS.allWardrobe, JSON.stringify(allItems));
};

// ── Wardrobe ─────────────────────────────────────────────
export const getWardrobe = (): WardrobeItem[] => {
  const s = localStorage.getItem(KEYS.wardrobe);
  return s ? JSON.parse(s) : [];
};

export const addWardrobeItem = (item: WardrobeItem): void => {
  const w = getWardrobe();
  w.push(item);
  localStorage.setItem(KEYS.wardrobe, JSON.stringify(w));
  // Also add to global wardrobe
  const all = getAllWardrobeItems();
  all.push(item);
  localStorage.setItem(KEYS.allWardrobe, JSON.stringify(all));
};

export const updateWardrobeItem = (item: WardrobeItem): void => {
  const w = getWardrobe().map(i => i.id === item.id ? item : i);
  localStorage.setItem(KEYS.wardrobe, JSON.stringify(w));
  // Update in global
  const all = getAllWardrobeItems().map(i => i.id === item.id ? item : i);
  localStorage.setItem(KEYS.allWardrobe, JSON.stringify(all));
};

export const deleteWardrobeItem = (id: string): void => {
  const w = getWardrobe().filter(i => i.id !== id);
  localStorage.setItem(KEYS.wardrobe, JSON.stringify(w));
  const all = getAllWardrobeItems().filter(i => i.id !== id);
  localStorage.setItem(KEYS.allWardrobe, JSON.stringify(all));
};

// All wardrobe items across all users (admin view)
export const getAllWardrobeItems = (): WardrobeItem[] => {
  const s = localStorage.getItem(KEYS.allWardrobe);
  return s ? JSON.parse(s) : [];
};

// ── Saved Outfits ────────────────────────────────────────
export const getSavedOutfits = (): SavedOutfit[] => {
  const s = localStorage.getItem(KEYS.savedOutfits);
  return s ? JSON.parse(s) : [];
};

export const saveOutfit = (outfit: GeneratedOutfit): void => {
  const saved = getSavedOutfits();
  const entry: SavedOutfit = { id: outfit.id, outfit, savedAt: Date.now(), wornDates: [] };
  saved.push(entry);
  localStorage.setItem(KEYS.savedOutfits, JSON.stringify(saved));
  // Global saved outfits
  const all = getAllSavedOutfits();
  all.push(entry);
  localStorage.setItem(KEYS.allSavedOutfits, JSON.stringify(all));
};

export const removeSavedOutfit = (id: string): void => {
  const saved = getSavedOutfits().filter(o => o.id !== id);
  localStorage.setItem(KEYS.savedOutfits, JSON.stringify(saved));
};

export const markOutfitWorn = (id: string): void => {
  const saved = getSavedOutfits().map(o => {
    if (o.id === id) {
      o.wornDates.push(Date.now());
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

export const getAllSavedOutfits = (): SavedOutfit[] => {
  const s = localStorage.getItem(KEYS.allSavedOutfits);
  return s ? JSON.parse(s) : [];
};

// ── Favorites & ratings ─────────────────────────────────
export const toggleFavoriteOutfit = (id: string): boolean => {
  let next = false;
  const saved = getSavedOutfits().map(o => {
    if (o.id === id) { o.favorite = !o.favorite; next = !!o.favorite; }
    return o;
  });
  localStorage.setItem(KEYS.savedOutfits, JSON.stringify(saved));
  return next;
};

export const rateSavedOutfit = (id: string, rating: OutfitRating): void => {
  const saved = getSavedOutfits().map(o => {
    if (o.id === id) o.ratings = [...(o.ratings ?? []), rating];
    return o;
  });
  localStorage.setItem(KEYS.savedOutfits, JSON.stringify(saved));
};

export const toggleFavoriteItem = (id: string): boolean => {
  const w = getWardrobe();
  const item = w.find(i => i.id === id);
  if (!item) return false;
  item.favorite = !item.favorite;
  updateWardrobeItem(item);
  return !!item.favorite;
};

export const setLaundryStatus = (id: string, status: LaundryStatus): void => {
  const w = getWardrobe();
  const item = w.find(i => i.id === id);
  if (!item) return;
  item.laundryStatus = status;
  updateWardrobeItem(item);
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

// Initialize admin on module load
ensureAdminExists();
