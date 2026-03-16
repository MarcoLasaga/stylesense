// Types for the StyleSense application

export interface ClothingItem {
  id: string;
  name: string;
  category: ClothingCategory;
  color: string;
  colorHex: string;
  fabric: string;
  style: StyleType;
  occasion: OccasionType;
  image: string;
  description: string;
  price: number;
  rating: number;
  tags: string[];
}

export type ClothingCategory = 
  | 'tops' | 'bottoms' | 'dresses' | 'outerwear' 
  | 'shoes' | 'accessories' | 'activewear';

export type StyleType = 
  | 'casual' | 'formal' | 'streetwear' | 'minimalist' 
  | 'bohemian' | 'sporty' | 'vintage' | 'classic';

export type OccasionType = 
  | 'casual' | 'formal' | 'sports' | 'party' 
  | 'work' | 'date' | 'outdoor';

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
  favoriteCategories: ClothingCategory[];
  occasionPreference: OccasionType[];
}

export interface UserRating {
  userId: string;
  itemId: string;
  rating: number; // 1-5
  liked: boolean;
  timestamp: number;
}

export interface SavedOutfit {
  id: string;
  userId: string;
  name: string;
  items: string[]; // item IDs
  createdAt: number;
}

export interface Recommendation {
  item: ClothingItem;
  score: number;
  reason: string;
  algorithm: 'collaborative' | 'content-based' | 'hybrid';
}
