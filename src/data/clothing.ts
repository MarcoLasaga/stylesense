// Sample clothing dataset for StyleSense
import { ClothingItem } from '../lib/types';

// Using placeholder image URLs with descriptive colors
const img = (category: string, color: string, id: number) =>
  `https://images.unsplash.com/photo-${id}?w=400&h=500&fit=crop`;

export const clothingItems: ClothingItem[] = [
  // TOPS
  {
    id: 't1', name: 'Classic White T-Shirt', category: 'tops', color: 'White', colorHex: '#FFFFFF',
    fabric: 'Cotton', style: 'casual', occasion: 'casual', price: 29.99, rating: 4.5,
    image: img('tops', 'white', 1521572163474),
    description: 'Essential crew neck tee in premium organic cotton. A wardrobe staple.',
    tags: ['basic', 'essential', 'layering']
  },
  {
    id: 't2', name: 'Black Hoodie', category: 'tops', color: 'Black', colorHex: '#1a1a1a',
    fabric: 'Cotton Blend', style: 'streetwear', occasion: 'casual', price: 59.99, rating: 4.7,
    image: img('tops', 'black', 1556821840000),
    description: 'Oversized hoodie with kangaroo pocket. Perfect for layering.',
    tags: ['cozy', 'oversized', 'streetwear']
  },
  {
    id: 't3', name: 'Navy Blazer', category: 'tops', color: 'Navy', colorHex: '#1B2A4A',
    fabric: 'Wool Blend', style: 'formal', occasion: 'work', price: 149.99, rating: 4.8,
    image: img('tops', 'navy', 1507003211169),
    description: 'Tailored single-breasted blazer. Sharp, sophisticated silhouette.',
    tags: ['tailored', 'professional', 'versatile']
  },
  {
    id: 't4', name: 'Striped Linen Shirt', category: 'tops', color: 'Blue', colorHex: '#5B8DB8',
    fabric: 'Linen', style: 'casual', occasion: 'casual', price: 49.99, rating: 4.3,
    image: img('tops', 'blue', 1596755094514),
    description: 'Relaxed-fit linen shirt with vertical stripes. Summer essential.',
    tags: ['summer', 'breathable', 'relaxed']
  },
  {
    id: 't5', name: 'Cream Knit Sweater', category: 'tops', color: 'Cream', colorHex: '#F5F0E8',
    fabric: 'Cashmere Blend', style: 'minimalist', occasion: 'casual', price: 89.99, rating: 4.6,
    image: img('tops', 'cream', 1434389677669),
    description: 'Soft knit sweater with ribbed trim. Luxuriously comfortable.',
    tags: ['cozy', 'winter', 'luxury']
  },
  {
    id: 't6', name: 'Olive Bomber Jacket', category: 'outerwear', color: 'Olive', colorHex: '#556B2F',
    fabric: 'Nylon', style: 'streetwear', occasion: 'casual', price: 99.99, rating: 4.4,
    image: img('outerwear', 'olive', 1551028719000),
    description: 'Classic bomber silhouette in military olive. Ribbed collar and cuffs.',
    tags: ['military', 'layering', 'transitional']
  },
  {
    id: 't7', name: 'Silk Blouse', category: 'tops', color: 'Rose', colorHex: '#C48B8B',
    fabric: 'Silk', style: 'classic', occasion: 'work', price: 119.99, rating: 4.5,
    image: img('tops', 'rose', 1485462537746),
    description: 'Elegant silk blouse with subtle draping. Day-to-night versatility.',
    tags: ['elegant', 'office', 'feminine']
  },
  {
    id: 't8', name: 'Graphic Tee', category: 'tops', color: 'Black', colorHex: '#1a1a1a',
    fabric: 'Cotton', style: 'streetwear', occasion: 'casual', price: 34.99, rating: 4.2,
    image: img('tops', 'black', 1503341504253),
    description: 'Bold graphic print tee. Statement piece for any casual outfit.',
    tags: ['statement', 'graphic', 'urban']
  },

  // BOTTOMS
  {
    id: 'b1', name: 'Slim Fit Jeans', category: 'bottoms', color: 'Blue', colorHex: '#3B5998',
    fabric: 'Denim', style: 'casual', occasion: 'casual', price: 69.99, rating: 4.6,
    image: img('bottoms', 'blue', 1542272604000),
    description: 'Classic slim-fit jeans with subtle stretch. Goes with everything.',
    tags: ['denim', 'essential', 'versatile']
  },
  {
    id: 'b2', name: 'Black Tailored Trousers', category: 'bottoms', color: 'Black', colorHex: '#1a1a1a',
    fabric: 'Wool Blend', style: 'formal', occasion: 'work', price: 89.99, rating: 4.7,
    image: img('bottoms', 'black', 1473966968600),
    description: 'High-waisted tailored trousers with pressed crease. Boardroom ready.',
    tags: ['tailored', 'professional', 'sharp']
  },
  {
    id: 'b3', name: 'Khaki Chinos', category: 'bottoms', color: 'Khaki', colorHex: '#C3B091',
    fabric: 'Cotton Twill', style: 'classic', occasion: 'casual', price: 59.99, rating: 4.4,
    image: img('bottoms', 'khaki', 1473966968600),
    description: 'Comfortable chinos in classic khaki. Smart casual versatility.',
    tags: ['smart-casual', 'comfortable', 'classic']
  },
  {
    id: 'b4', name: 'Pleated Midi Skirt', category: 'bottoms', color: 'Sage', colorHex: '#9CAF88',
    fabric: 'Polyester', style: 'classic', occasion: 'work', price: 54.99, rating: 4.3,
    image: img('bottoms', 'sage', 1583496661160),
    description: 'Flowing pleated skirt in muted sage. Elegant movement with every step.',
    tags: ['feminine', 'flowing', 'elegant']
  },
  {
    id: 'b5', name: 'Cargo Pants', category: 'bottoms', color: 'Olive', colorHex: '#556B2F',
    fabric: 'Cotton', style: 'streetwear', occasion: 'casual', price: 64.99, rating: 4.2,
    image: img('bottoms', 'olive', 1517438322000),
    description: 'Relaxed cargo pants with utility pockets. Urban adventure ready.',
    tags: ['utility', 'relaxed', 'urban']
  },
  {
    id: 'b6', name: 'Athletic Shorts', category: 'activewear', color: 'Gray', colorHex: '#808080',
    fabric: 'Polyester', style: 'sporty', occasion: 'sports', price: 34.99, rating: 4.5,
    image: img('activewear', 'gray', 1571019613454),
    description: 'Lightweight performance shorts with moisture-wicking technology.',
    tags: ['performance', 'breathable', 'workout']
  },

  // DRESSES
  {
    id: 'd1', name: 'Little Black Dress', category: 'dresses', color: 'Black', colorHex: '#1a1a1a',
    fabric: 'Silk Blend', style: 'classic', occasion: 'party', price: 129.99, rating: 4.8,
    image: img('dresses', 'black', 1515886153595),
    description: 'Timeless LBD with clean lines. The ultimate evening essential.',
    tags: ['timeless', 'evening', 'essential']
  },
  {
    id: 'd2', name: 'Floral Wrap Dress', category: 'dresses', color: 'Multi', colorHex: '#E8A87C',
    fabric: 'Viscose', style: 'bohemian', occasion: 'date', price: 79.99, rating: 4.5,
    image: img('dresses', 'floral', 1496747611176),
    description: 'Romantic floral wrap dress. Flattering silhouette for every body.',
    tags: ['romantic', 'flattering', 'feminine']
  },
  {
    id: 'd3', name: 'White Linen Dress', category: 'dresses', color: 'White', colorHex: '#FFFFFF',
    fabric: 'Linen', style: 'minimalist', occasion: 'outdoor', price: 89.99, rating: 4.4,
    image: img('dresses', 'white', 1515372169989),
    description: 'Breezy linen midi dress. Mediterranean summer vibes.',
    tags: ['summer', 'breezy', 'effortless']
  },

  // SHOES
  {
    id: 's1', name: 'White Sneakers', category: 'shoes', color: 'White', colorHex: '#FFFFFF',
    fabric: 'Leather', style: 'minimalist', occasion: 'casual', price: 109.99, rating: 4.7,
    image: img('shoes', 'white', 1542291026616),
    description: 'Clean white leather sneakers. The perfect finishing touch.',
    tags: ['clean', 'versatile', 'essential']
  },
  {
    id: 's2', name: 'Black Chelsea Boots', category: 'shoes', color: 'Black', colorHex: '#1a1a1a',
    fabric: 'Leather', style: 'classic', occasion: 'casual', price: 139.99, rating: 4.6,
    image: img('shoes', 'black', 1608256246000),
    description: 'Sleek Chelsea boots in smooth leather. Effortlessly cool.',
    tags: ['sleek', 'versatile', 'timeless']
  },
  {
    id: 's3', name: 'Running Shoes', category: 'shoes', color: 'Gray', colorHex: '#808080',
    fabric: 'Mesh', style: 'sporty', occasion: 'sports', price: 129.99, rating: 4.5,
    image: img('shoes', 'gray', 1539185441755),
    description: 'Lightweight running shoes with responsive cushioning.',
    tags: ['performance', 'lightweight', 'running']
  },
  {
    id: 's4', name: 'Heeled Sandals', category: 'shoes', color: 'Nude', colorHex: '#D2B48C',
    fabric: 'Leather', style: 'classic', occasion: 'party', price: 89.99, rating: 4.3,
    image: img('shoes', 'nude', 1543163521000),
    description: 'Strappy heeled sandals in nude leather. Elegant occasion wear.',
    tags: ['elegant', 'occasion', 'feminine']
  },

  // ACCESSORIES
  {
    id: 'a1', name: 'Leather Belt', category: 'accessories', color: 'Brown', colorHex: '#8B4513',
    fabric: 'Leather', style: 'classic', occasion: 'work', price: 49.99, rating: 4.4,
    image: img('accessories', 'brown', 1553062407000),
    description: 'Full-grain leather belt with brushed metal buckle.',
    tags: ['essential', 'quality', 'classic']
  },
  {
    id: 'a2', name: 'Silk Scarf', category: 'accessories', color: 'Multi', colorHex: '#C48B8B',
    fabric: 'Silk', style: 'classic', occasion: 'casual', price: 59.99, rating: 4.5,
    image: img('accessories', 'multi', 1601924582970),
    description: 'Luxurious silk scarf with artistic print. Style it your way.',
    tags: ['versatile', 'luxury', 'artistic']
  },
  {
    id: 'a3', name: 'Canvas Tote Bag', category: 'accessories', color: 'Cream', colorHex: '#F5F0E8',
    fabric: 'Canvas', style: 'casual', occasion: 'casual', price: 39.99, rating: 4.3,
    image: img('accessories', 'cream', 1548036328000),
    description: 'Spacious canvas tote for everyday carry. Simple and functional.',
    tags: ['everyday', 'spacious', 'sustainable']
  },

  // OUTERWEAR
  {
    id: 'o1', name: 'Camel Wool Coat', category: 'outerwear', color: 'Camel', colorHex: '#C19A6B',
    fabric: 'Wool', style: 'classic', occasion: 'work', price: 199.99, rating: 4.8,
    image: img('outerwear', 'camel', 1539533018000),
    description: 'Luxurious camel coat in pure wool. Timeless investment piece.',
    tags: ['investment', 'timeless', 'luxury']
  },
  {
    id: 'o2', name: 'Denim Jacket', category: 'outerwear', color: 'Blue', colorHex: '#4169E1',
    fabric: 'Denim', style: 'casual', occasion: 'casual', price: 79.99, rating: 4.5,
    image: img('outerwear', 'blue', 1551028719000),
    description: 'Classic denim jacket with a lived-in wash. Layer over anything.',
    tags: ['classic', 'layering', 'versatile']
  },
  {
    id: 'o3', name: 'Puffer Vest', category: 'outerwear', color: 'Black', colorHex: '#1a1a1a',
    fabric: 'Nylon', style: 'sporty', occasion: 'outdoor', price: 89.99, rating: 4.3,
    image: img('outerwear', 'black', 1544966503000),
    description: 'Lightweight puffer vest with down filling. Warmth without bulk.',
    tags: ['lightweight', 'warm', 'outdoor']
  },
];

// Simulated users for collaborative filtering
export interface SimulatedUser {
  id: string;
  name: string;
  preferredStyles: string[];
  favoriteColors: string[];
  ratings: Record<string, number>; // itemId -> rating
}

export const simulatedUsers: SimulatedUser[] = [
  {
    id: 'sim1', name: 'Alex', preferredStyles: ['casual', 'streetwear'],
    favoriteColors: ['Black', 'White', 'Olive'],
    ratings: { t1: 5, t2: 5, t8: 4, b1: 5, b5: 4, s1: 5, o2: 4, 't6': 5 }
  },
  {
    id: 'sim2', name: 'Jordan', preferredStyles: ['formal', 'classic'],
    favoriteColors: ['Navy', 'Black', 'White'],
    ratings: { t3: 5, t7: 4, b2: 5, d1: 5, s2: 4, o1: 5, a1: 4 }
  },
  {
    id: 'sim3', name: 'Sam', preferredStyles: ['minimalist', 'casual'],
    favoriteColors: ['White', 'Cream', 'Gray'],
    ratings: { t1: 5, t5: 5, b3: 4, d3: 5, s1: 5, a3: 4 }
  },
  {
    id: 'sim4', name: 'Taylor', preferredStyles: ['bohemian', 'casual'],
    favoriteColors: ['Rose', 'Multi', 'Sage'],
    ratings: { t4: 4, t7: 3, d2: 5, b4: 5, a2: 5, s4: 4, d3: 4 }
  },
  {
    id: 'sim5', name: 'Morgan', preferredStyles: ['sporty', 'streetwear'],
    favoriteColors: ['Black', 'Gray', 'Olive'],
    ratings: { t2: 4, t8: 5, b5: 5, b6: 5, s3: 5, o3: 4, 't6': 4 }
  },
  {
    id: 'sim6', name: 'Casey', preferredStyles: ['classic', 'minimalist'],
    favoriteColors: ['Camel', 'Cream', 'Navy'],
    ratings: { t3: 4, t5: 5, b2: 4, b3: 5, o1: 5, s2: 5, a1: 5 }
  },
];
