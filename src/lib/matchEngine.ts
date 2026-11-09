import { CatalogueProduct, MatchAnswers } from '../types';
import { CATALOGUE_PRODUCTS } from '../data/catalogue';

export interface MatchResult {
  product: CatalogueProduct;
  score: number;
  whyThisSuitsYou: string[];
}

export function calculateProductMatches(answers: MatchAnswers): MatchResult[] {
  const { focus, skinType, concerns, reactivity, commitment } = answers;

  const countToReturn = commitment === 'minimal' ? 3 : commitment === 'balanced' ? 4 : 6;

  const userReactivityNum = reactivity.includes('Rarely') ? 1 : reactivity.includes('Sometimes') ? 2 : 3;

  const results: MatchResult[] = CATALOGUE_PRODUCTS.map(product => {
    // 1. Focus / Category Fit (20%)
    const categoryFit = focus.includes(product.category) ? 1.0 : 0.1;

    // 2. Concern Overlap (40%)
    let concernMatches = 0;
    if (concerns.length > 0) {
      concernMatches = product.concerns.filter(c => concerns.includes(c)).length;
    }
    const concernScore = concerns.length > 0
      ? Math.min(1.0, concernMatches / Math.min(2, concerns.length))
      : 0.5;

    // 3. Skin-type Fit (15%)
    let skinTypeScore = 0.8;
    if (product.category === 'skin' && skinType) {
      if (product.skinTypes && product.skinTypes.includes(skinType)) {
        skinTypeScore = 1.0;
      } else {
        skinTypeScore = 0.4;
      }
    }

    // 4. Reactivity tolerance (15%)
    // If user reacts easily (3), products with high reactivity (2 or 3) score lower unless gentle (1)
    let reactivityScore = 0.8;
    if (userReactivityNum === 3) {
      reactivityScore = product.reactivity === 1 ? 1.0 : 0.5;
    } else if (userReactivityNum === 2) {
      reactivityScore = product.reactivity <= 2 ? 1.0 : 0.7;
    } else {
      reactivityScore = 1.0;
    }

    // 5. Timeline / Commitment fit (10%)
    const timelineFit = 0.9;

    const rawScore = 100 * (
      concernScore * 0.40 +
      categoryFit * 0.20 +
      skinTypeScore * 0.15 +
      reactivityScore * 0.15 +
      timelineFit * 0.10
    );

    // Clamped 40 - 98
    const clampedScore = Math.min(98, Math.max(40, Math.round(rawScore)));

    // Generate the 3 bullets for "Why this suits you"
    const matchedConcern = product.concerns.find(c => concerns.includes(c)) || product.concerns[0] || 'balanced wellness';
    const firstChangeWeek = Math.ceil(product.timeline.firstChangeDay / 7);

    const whyThisSuitsYou = [
      `Targets your concern: ${matchedConcern.toLowerCase()}`,
      `Key actives: ${product.actives.slice(0, 2).join(', ')}`,
      `Realistic timeline: first visible change around week ${firstChangeWeek}`,
    ];

    return {
      product,
      score: clampedScore,
      whyThisSuitsYou,
    };
  });

  // Sort descending by score
  results.sort((a, b) => b.score - a.score);

  return results.slice(0, countToReturn);
}
