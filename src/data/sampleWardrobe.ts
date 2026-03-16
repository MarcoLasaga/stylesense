/**
 * Sample wardrobe items to pre-populate for demo purposes.
 * Users can delete these and add their own.
 */
import { WardrobeItem } from '../lib/types';

export const sampleWardrobe: WardrobeItem[] = [
  {
    id: 'sample_1', userId: 'demo', name: 'Black Hoodie', category: 'top',
    color: 'Black', colorHex: '#1a1a1a', fabric: 'cotton', style: 'casual', occasion: 'everyday',
    image: '', addedAt: Date.now(), wornCount: 5,
  },
  {
    id: 'sample_2', userId: 'demo', name: 'White T-Shirt', category: 'top',
    color: 'White', colorHex: '#FFFFFF', fabric: 'cotton', style: 'casual', occasion: 'everyday',
    image: '', addedAt: Date.now(), wornCount: 8,
  },
  {
    id: 'sample_3', userId: 'demo', name: 'Navy Blazer', category: 'top',
    color: 'Navy', colorHex: '#1B2A4A', fabric: 'wool', style: 'formal', occasion: 'work',
    image: '', addedAt: Date.now(), wornCount: 3,
  },
  {
    id: 'sample_4', userId: 'demo', name: 'Striped Button-Up', category: 'top',
    color: 'Blue', colorHex: '#5B8DB8', fabric: 'cotton', style: 'classic', occasion: 'work',
    image: '', addedAt: Date.now(), wornCount: 4,
  },
  {
    id: 'sample_5', userId: 'demo', name: 'Blue Jeans', category: 'bottom',
    color: 'Blue', colorHex: '#3B5998', fabric: 'denim', style: 'casual', occasion: 'everyday',
    image: '', addedAt: Date.now(), wornCount: 10,
  },
  {
    id: 'sample_6', userId: 'demo', name: 'Black Chinos', category: 'bottom',
    color: 'Black', colorHex: '#1a1a1a', fabric: 'cotton', style: 'classic', occasion: 'work',
    image: '', addedAt: Date.now(), wornCount: 6,
  },
  {
    id: 'sample_7', userId: 'demo', name: 'Gray Joggers', category: 'bottom',
    color: 'Gray', colorHex: '#808080', fabric: 'cotton', style: 'sporty', occasion: 'gym',
    image: '', addedAt: Date.now(), wornCount: 7,
  },
  {
    id: 'sample_8', userId: 'demo', name: 'White Sneakers', category: 'shoes',
    color: 'White', colorHex: '#FFFFFF', fabric: 'leather', style: 'casual', occasion: 'everyday',
    image: '', addedAt: Date.now(), wornCount: 12,
  },
  {
    id: 'sample_9', userId: 'demo', name: 'Black Dress Shoes', category: 'shoes',
    color: 'Black', colorHex: '#1a1a1a', fabric: 'leather', style: 'formal', occasion: 'work',
    image: '', addedAt: Date.now(), wornCount: 4,
  },
  {
    id: 'sample_10', userId: 'demo', name: 'Running Shoes', category: 'shoes',
    color: 'Gray', colorHex: '#808080', fabric: 'nylon', style: 'sporty', occasion: 'gym',
    image: '', addedAt: Date.now(), wornCount: 9,
  },
  {
    id: 'sample_11', userId: 'demo', name: 'Denim Jacket', category: 'outerwear',
    color: 'Blue', colorHex: '#4169E1', fabric: 'denim', style: 'casual', occasion: 'outdoor',
    image: '', addedAt: Date.now(), wornCount: 3,
  },
  {
    id: 'sample_12', userId: 'demo', name: 'Gray Wool Coat', category: 'outerwear',
    color: 'Gray', colorHex: '#808080', fabric: 'wool', style: 'classic', occasion: 'work',
    image: '', addedAt: Date.now(), wornCount: 2,
  },
];
