// Types for StyleSense — Personal Wardrobe Assistant

export type ClothingCategory = 'top' | 'bottom' | 'shoes' | 'outerwear' | 'accessories';

export type StyleType = 'casual' | 'formal' | 'sporty' | 'streetwear' | 'minimalist' | 'bohemian' | 'vintage' | 'classic';

export type OccasionType = 'school' | 'work' | 'gym' | 'party' | 'date' | 'outdoor' | 'everyday';

export type FabricType = 'cotton' | 'denim' | 'polyester' | 'wool' | 'silk' | 'linen' | 'leather' | 'knit' | 'nylon' | 'other';

export type ClothingSize = 'XS' | 'S' | 'M' | 'L' | 'XL' | 'XXL';
export const ALL_SIZES: ClothingSize[] = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];

export type FitFeedback = 'too_tight' | 'perfect' | 'too_loose';

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
  size: ClothingSize;
  image: string; // base64 data URL or blob URL
  addedAt: number;
  wornCount: number;
  lastWorn?: number;
}

export type BodyType = 'slim' | 'athletic' | 'average' | 'curvy' | 'plus-size';
export type Gender = 'male' | 'female' | 'non-binary' | 'prefer-not-to-say';
export type UserRole = 'user' | 'admin';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  age: number;
  gender: Gender;
  bodyType: BodyType;
  currentSize: ClothingSize;
  preferredStyles: StyleType[];
  favoriteColors: string[];
  occasionPreference: OccasionType[];
  avatarInitial: string;
  role: UserRole;
  createdAt: number;
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
  outfitPatterns: { categories: ClothingCategory[]; colors: string[]; styles: StyleType[]; occasion: OccasionType }[];
}

// ── Weather context ─────────────────────────────────────
export interface WeatherContext {
  tempC: number;
  condition: 'hot' | 'warm' | 'mild' | 'cool' | 'cold';
  precipitation: 'none' | 'rain' | 'snow';
  description: string;
  city?: string;
  // Advanced weather intelligence (optional)
  humidity?: number;
  windKph?: number;
  rainProbability?: number;
  uvIndex?: number;
}

// ── Social feed (Lovable Cloud) ─────────────────────────
export interface SharedOutfit {
  id: string;
  user_id: string;
  name: string;
  caption: string | null;
  style: string;
  occasion: string;
  items: WardrobeItem[];
  cover_image: string | null;
  like_count: number;
  rating_avg: number;
  rating_count: number;
  save_count: number;
  created_at: string;
  display_name?: string;
  avatar_initial?: string;
  liked_by_me?: boolean;
  saved_by_me?: boolean;
  my_rating?: number;
}

// ── Recommendation explanation (for transparency view) ───
export interface RecommendationBreakdown {
  contentScore: number;
  collaborativeScore: number;
  trendScore: number;
  frequencyPenalty: number;
  weatherFit: number;
  fashionScore?: number;
  finalScore: number;
  factors: string[];
  // Normalised % contributions for the Explainable Panel
  contributions?: {
    userPreference: number;
    wardrobeCompatibility: number;
    collaborative: number;
    trend: number;
    weather: number;
    frequency: number;
    fashionRules: number;
  };
}
