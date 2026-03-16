// Types for StyleSense — Personal Wardrobe Assistant

export type ClothingCategory = 'top' | 'bottom' | 'shoes' | 'outerwear' | 'accessories';

export type StyleType = 'casual' | 'formal' | 'sporty' | 'streetwear' | 'minimalist' | 'bohemian' | 'vintage' | 'classic';

export type OccasionType = 'school' | 'work' | 'gym' | 'party' | 'date' | 'outdoor' | 'everyday';

export type FabricType = 'cotton' | 'denim' | 'polyester' | 'wool' | 'silk' | 'linen' | 'leather' | 'knit' | 'nylon' | 'other';

export interface WardrobeItem {
  id: string;
  userId: string;
  name: string;
  category: ClothingCategory;
  color: string;
  colorHex: string;
  fabric: FabricType;
  style: StyleType;
  occasion: OccasionType;
  image: string; // base64 data URL or blob URL
  addedAt: number;
  wornCount: number;
  lastWorn?: number;
}

export type BodyType = 'slim' | 'athletic' | 'average' | 'curvy' | 'plus-size';
export type Gender = 'male' | 'female' | 'non-binary' | 'prefer-not-to-say';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  age: number;
  gender: Gender;
  bodyType: BodyType;
  preferredStyles: StyleType[];
  favoriteColors: string[];
  occasionPreference: OccasionType[];
  avatarInitial: string;
}

export interface GeneratedOutfit {
  id: string;
  userId: string;
  name: string;
  items: WardrobeItem[];
  occasion: OccasionType;
  style: StyleType;
  score: number;
  reason: string;
  createdAt: number;
}

export interface SavedOutfit {
  id: string;
  outfit: GeneratedOutfit;
  savedAt: number;
  wornDates: number[];
}

export interface OutfitHistory {
  outfitId: string;
  generatedAt: number;
  saved: boolean;
}

// For collaborative filtering — simulated community wardrobe patterns
export interface CommunityPattern {
  id: string;
  userName: string;
  preferredStyles: StyleType[];
  favoriteColors: string[];
  // Outfit patterns: arrays of [category, color, style] tuples
  outfitPatterns: { categories: ClothingCategory[]; colors: string[]; styles: StyleType[]; occasion: OccasionType }[];
}
