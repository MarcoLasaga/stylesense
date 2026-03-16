/**
 * User store - manages user state with localStorage
 */
import { UserProfile, UserRating, SavedOutfit } from './types';

const STORAGE_KEYS = {
  profile: 'stylesense_profile',
  ratings: 'stylesense_ratings',
  outfits: 'stylesense_outfits',
  auth: 'stylesense_auth',
};

// Default profile for new users
const defaultProfile: UserProfile = {
  id: 'user1',
  name: '',
  email: '',
  age: 25,
  gender: 'prefer-not-to-say',
  bodyType: 'average',
  preferredStyles: ['casual'],
  favoriteColors: ['Black', 'White'],
  favoriteCategories: ['tops', 'bottoms'],
  occasionPreference: ['casual'],
};

export function getProfile(): UserProfile {
  const stored = localStorage.getItem(STORAGE_KEYS.profile);
  return stored ? JSON.parse(stored) : defaultProfile;
}

export function saveProfile(profile: UserProfile): void {
  localStorage.setItem(STORAGE_KEYS.profile, JSON.stringify(profile));
}

export function getRatings(): UserRating[] {
  const stored = localStorage.getItem(STORAGE_KEYS.ratings);
  return stored ? JSON.parse(stored) : [];
}

export function addRating(rating: UserRating): void {
  const ratings = getRatings();
  const existing = ratings.findIndex(r => r.itemId === rating.itemId && r.userId === rating.userId);
  if (existing >= 0) {
    ratings[existing] = rating;
  } else {
    ratings.push(rating);
  }
  localStorage.setItem(STORAGE_KEYS.ratings, JSON.stringify(ratings));
}

export function getSavedOutfits(): SavedOutfit[] {
  const stored = localStorage.getItem(STORAGE_KEYS.outfits);
  return stored ? JSON.parse(stored) : [];
}

export function saveOutfit(outfit: SavedOutfit): void {
  const outfits = getSavedOutfits();
  outfits.push(outfit);
  localStorage.setItem(STORAGE_KEYS.outfits, JSON.stringify(outfits));
}

export function removeOutfit(outfitId: string): void {
  const outfits = getSavedOutfits().filter(o => o.id !== outfitId);
  localStorage.setItem(STORAGE_KEYS.outfits, JSON.stringify(outfits));
}

export function isLoggedIn(): boolean {
  return localStorage.getItem(STORAGE_KEYS.auth) === 'true';
}

export function login(email: string, _password: string): boolean {
  // Simulated auth - in production, this would validate against a backend
  const profile = getProfile();
  profile.email = email;
  saveProfile(profile);
  localStorage.setItem(STORAGE_KEYS.auth, 'true');
  return true;
}

export function signup(name: string, email: string, _password: string): boolean {
  const profile: UserProfile = {
    ...defaultProfile,
    name,
    email,
    id: 'user_' + Date.now(),
  };
  saveProfile(profile);
  localStorage.setItem(STORAGE_KEYS.auth, 'true');
  return true;
}

export function logout(): void {
  localStorage.removeItem(STORAGE_KEYS.auth);
}
