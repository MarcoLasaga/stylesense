/**
 * StyleSense Recommendation Engine
 * 
 * Implements two recommendation algorithms:
 * 
 * 1. COLLABORATIVE FILTERING (User-Based)
 *    - Finds users with similar rating patterns using cosine similarity
 *    - Recommends items that similar users rated highly
 *    - Works best when there's enough user interaction data
 * 
 * 2. CONTENT-BASED FILTERING
 *    - Analyzes clothing attributes (color, style, fabric, category, occasion)
 *    - Compares item features with user's preferred attributes
 *    - Scores items based on attribute match percentage
 * 
 * The final recommendations use a HYBRID approach, combining scores from both.
 */

import { ClothingItem, UserProfile, UserRating, Recommendation } from './types';
import { clothingItems, simulatedUsers, SimulatedUser } from '../data/clothing';

// ============================================================
// COLLABORATIVE FILTERING
// ============================================================

/**
 * Compute cosine similarity between two users based on their ratings.
 * 
 * Cosine similarity measures the angle between two rating vectors.
 * A value of 1 means identical preferences, 0 means no overlap.
 * 
 * Formula: cos(θ) = (A · B) / (||A|| × ||B||)
 */
function cosineSimilarity(
  ratingsA: Record<string, number>,
  ratingsB: Record<string, number>
): number {
  // Find items both users have rated
  const commonItems = Object.keys(ratingsA).filter(id => id in ratingsB);
  
  if (commonItems.length === 0) return 0;

  // Calculate dot product and magnitudes
  let dotProduct = 0;
  let magnitudeA = 0;
  let magnitudeB = 0;

  commonItems.forEach(itemId => {
    dotProduct += ratingsA[itemId] * ratingsB[itemId];
    magnitudeA += ratingsA[itemId] ** 2;
    magnitudeB += ratingsB[itemId] ** 2;
  });

  magnitudeA = Math.sqrt(magnitudeA);
  magnitudeB = Math.sqrt(magnitudeB);

  if (magnitudeA === 0 || magnitudeB === 0) return 0;

  return dotProduct / (magnitudeA * magnitudeB);
}

/**
 * Find the most similar users to the current user.
 * Returns users sorted by similarity score (highest first).
 */
function findSimilarUsers(
  currentUserRatings: Record<string, number>,
  allUsers: SimulatedUser[],
  topN: number = 3
): { user: SimulatedUser; similarity: number }[] {
  const similarities = allUsers.map(user => ({
    user,
    similarity: cosineSimilarity(currentUserRatings, user.ratings)
  }));

  // Sort by similarity (descending) and take top N
  return similarities
    .filter(s => s.similarity > 0)
    .sort((a, b) => b.similarity - a.similarity)
    .slice(0, topN);
}

/**
 * Generate collaborative filtering recommendations.
 * 
 * Steps:
 * 1. Build the current user's rating vector from their interactions
 * 2. Find the top 3 most similar users (cosine similarity)
 * 3. Collect items those users rated highly but the current user hasn't seen
 * 4. Score items by: similar user's rating × similarity weight
 */
export function collaborativeFilteringRecommend(
  userRatings: UserRating[],
  allItems: ClothingItem[],
  topN: number = 10
): Recommendation[] {
  // Build current user's rating map
  const currentRatings: Record<string, number> = {};
  userRatings.forEach(r => {
    currentRatings[r.itemId] = r.rating;
  });

  // Find similar users among simulated users
  const similarUsers = findSimilarUsers(currentRatings, simulatedUsers);

  if (similarUsers.length === 0) return [];

  // Collect candidate items from similar users
  const candidateScores: Record<string, { score: number; source: string }> = {};

  similarUsers.forEach(({ user, similarity }) => {
    Object.entries(user.ratings).forEach(([itemId, rating]) => {
      // Skip items user already rated
      if (itemId in currentRatings) return;
      
      // Weighted score = rating × similarity
      const weightedScore = rating * similarity;
      
      if (!candidateScores[itemId]) {
        candidateScores[itemId] = { score: 0, source: user.name };
      }
      candidateScores[itemId].score += weightedScore;
    });
  });

  // Convert to recommendations
  const recommendations: Recommendation[] = Object.entries(candidateScores)
    .map(([itemId, { score, source }]) => {
      const item = allItems.find(i => i.id === itemId);
      if (!item) return null;
      return {
        item,
        score: Math.min(score / 5, 1), // Normalize to 0-1
        reason: `Users with similar taste liked this`,
        algorithm: 'collaborative' as const
      };
    })
    .filter((r): r is Recommendation => r !== null)
    .sort((a, b) => b.score - a.score)
    .slice(0, topN);

  return recommendations;
}

// ============================================================
// CONTENT-BASED FILTERING
// ============================================================

/**
 * Calculate how well a clothing item matches user preferences.
 * 
 * Checks 5 attributes with equal weighting:
 * - Color match (20%)
 * - Style match (20%)
 * - Category match (20%)
 * - Occasion match (20%)
 * - Fabric preference bonus (20%)
 * 
 * Returns a score between 0 and 1.
 */
function contentMatchScore(
  item: ClothingItem,
  profile: UserProfile
): { score: number; reasons: string[] } {
  let score = 0;
  const reasons: string[] = [];

  // Color match (0.2 weight)
  if (profile.favoriteColors.some(c => 
    c.toLowerCase() === item.color.toLowerCase()
  )) {
    score += 0.2;
    reasons.push(`Matches your favorite color: ${item.color}`);
  }

  // Style match (0.25 weight)
  if (profile.preferredStyles.includes(item.style)) {
    score += 0.25;
    reasons.push(`Matches your preferred style: ${item.style}`);
  }

  // Category match (0.2 weight)
  if (profile.favoriteCategories.includes(item.category)) {
    score += 0.2;
    reasons.push(`In your favorite category: ${item.category}`);
  }

  // Occasion match (0.2 weight)
  if (profile.occasionPreference.includes(item.occasion)) {
    score += 0.2;
    reasons.push(`Perfect for: ${item.occasion}`);
  }

  // High rating bonus (0.15 weight)
  if (item.rating >= 4.5) {
    score += 0.15;
    reasons.push('Highly rated by the community');
  }

  return { score: Math.min(score, 1), reasons };
}

/**
 * Generate content-based recommendations.
 * 
 * Compares each clothing item's attributes with the user's profile
 * preferences and returns items with the highest match scores.
 */
export function contentBasedRecommend(
  profile: UserProfile,
  allItems: ClothingItem[],
  excludeIds: string[] = [],
  topN: number = 10
): Recommendation[] {
  const scored = allItems
    .filter(item => !excludeIds.includes(item.id))
    .map(item => {
      const { score, reasons } = contentMatchScore(item, profile);
      return {
        item,
        score,
        reason: reasons.length > 0 ? reasons[0] : 'Based on your profile',
        algorithm: 'content-based' as const
      };
    })
    .filter(r => r.score > 0.2) // Minimum relevance threshold
    .sort((a, b) => b.score - a.score)
    .slice(0, topN);

  return scored;
}

// ============================================================
// HYBRID RECOMMENDATION ENGINE
// ============================================================

/**
 * Generate hybrid recommendations combining both algorithms.
 * 
 * - 40% weight: Collaborative filtering score
 * - 60% weight: Content-based filtering score
 * 
 * Content-based gets higher weight as it works even with limited
 * interaction data (cold-start problem solution).
 */
export function getRecommendations(
  profile: UserProfile,
  userRatings: UserRating[],
  topN: number = 12
): Recommendation[] {
  const allItems = clothingItems;
  
  // Get rated item IDs to exclude from content-based
  const ratedItemIds = userRatings.map(r => r.itemId);

  // Get recommendations from both algorithms
  const collaborative = collaborativeFilteringRecommend(userRatings, allItems, topN);
  const contentBased = contentBasedRecommend(profile, allItems, [], topN);

  // Merge scores with hybrid weighting
  const scoreMap: Record<string, Recommendation> = {};

  // Add content-based scores (60% weight)
  contentBased.forEach(rec => {
    scoreMap[rec.item.id] = {
      ...rec,
      score: rec.score * 0.6,
      algorithm: 'hybrid'
    };
  });

  // Add collaborative scores (40% weight)  
  collaborative.forEach(rec => {
    if (scoreMap[rec.item.id]) {
      scoreMap[rec.item.id].score += rec.score * 0.4;
      scoreMap[rec.item.id].reason = `${rec.reason} • ${scoreMap[rec.item.id].reason}`;
    } else {
      scoreMap[rec.item.id] = {
        ...rec,
        score: rec.score * 0.4,
        algorithm: 'collaborative'
      };
    }
  });

  // If we have very few results, add some popular items
  if (Object.keys(scoreMap).length < 4) {
    allItems
      .filter(item => !scoreMap[item.id])
      .sort((a, b) => b.rating - a.rating)
      .slice(0, 6)
      .forEach(item => {
        scoreMap[item.id] = {
          item,
          score: item.rating / 10,
          reason: 'Trending & highly rated',
          algorithm: 'content-based'
        };
      });
  }

  return Object.values(scoreMap)
    .sort((a, b) => b.score - a.score)
    .slice(0, topN);
}

/**
 * Generate outfit combinations (top + bottom + shoes).
 * Ensures style and occasion compatibility.
 */
export function generateOutfits(
  profile: UserProfile,
  count: number = 3
): { top: ClothingItem; bottom: ClothingItem; shoes: ClothingItem; score: number }[] {
  const tops = clothingItems.filter(i => i.category === 'tops' || i.category === 'outerwear');
  const bottoms = clothingItems.filter(i => i.category === 'bottoms' || i.category === 'dresses' || i.category === 'activewear');
  const shoes = clothingItems.filter(i => i.category === 'shoes');

  const outfits: { top: ClothingItem; bottom: ClothingItem; shoes: ClothingItem; score: number }[] = [];

  // Generate combinations and score them
  for (const top of tops) {
    for (const bottom of bottoms) {
      for (const shoe of shoes) {
        // Style compatibility check
        const styleMatch = top.style === bottom.style || top.occasion === bottom.occasion;
        const occasionMatch = top.occasion === shoe.occasion || bottom.occasion === shoe.occasion;
        
        if (!styleMatch && !occasionMatch) continue;

        // Score based on profile match
        const topScore = contentMatchScore(top, profile).score;
        const bottomScore = contentMatchScore(bottom, profile).score;
        const shoeScore = contentMatchScore(shoe, profile).score;
        const avgScore = (topScore + bottomScore + shoeScore) / 3;

        // Bonus for style consistency
        const consistencyBonus = top.style === bottom.style && bottom.style === shoe.style ? 0.2 : 0;

        outfits.push({
          top, bottom, shoes: shoe,
          score: avgScore + consistencyBonus
        });
      }
    }
  }

  return outfits
    .sort((a, b) => b.score - a.score)
    .slice(0, count);
}
