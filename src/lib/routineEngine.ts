import { CatalogueProduct, ShelfItem } from '../types';
import { CATALOGUE_PRODUCTS } from '../data/catalogue';

export type PairVerdict = 'DUPLICATE' | 'OVERLAP' | 'CLASH' | 'COMPLEMENTARY';

export interface ShelfComparisonItem {
  shelfItemName: string;
  category: string;
  verdict: PairVerdict;
  reason: string;
}

export type OverallVerdict = 'GOOD' | 'CAUTION' | 'OVERLAP' | 'DUPLICATE';

export interface RoutineTestResult {
  overallVerdict: OverallVerdict;
  verdictTitle: string;
  verdictSubtitle: string;
  meterPositionPct: number; // 0 to 100 on the gradient meter
  meterColor: string;
  items: ShelfComparisonItem[];
}

// Known ingredient clashes / warnings
const CLASH_RULES: { activeA: string; activeB: string; warning: string }[] = [
  {
    activeA: 'Salicylic Acid',
    activeB: 'Glycolic Acid',
    warning: 'Combining strong BHA and AHA simultaneously can compromise moisture barrier. Alternate days or split AM/PM.',
  },
  {
    activeA: 'Salicylic Acid',
    activeB: 'Lactic Acid',
    warning: 'Concurrent acid exfoliation may cause sensitivity or peeling. Split AM/PM.',
  },
  {
    activeA: 'Vitamin C',
    activeB: 'Salicylic Acid',
    warning: 'High potency L-Ascorbic/Ethyl Ascorbic with BHA can destabilise skin pH. Use Vitamin C in AM, Salicylic in PM.',
  },
  {
    activeA: '3-O-Ethyl Ascorbic Acid',
    activeB: 'Salicylic Acid',
    warning: 'Layering active Vitamin C and BHA directly together may increase redness. Split AM/PM.',
  },
  {
    activeA: 'Retinol',
    activeB: 'Salicylic Acid',
    warning: 'Retinoids and Salicylic Acid cause excessive flaking if used together. Alternate nights.',
  },
  {
    activeA: 'Retinoid',
    activeB: 'Glycolic Acid',
    warning: 'Potent keratolytic clash. Use on alternate nights only.',
  },
];

function checkActivesClash(activesA: string[], activesB: string[]): string | null {
  for (const actA of activesA) {
    for (const actB of activesB) {
      for (const rule of CLASH_RULES) {
        const matchesA = actA.toLowerCase().includes(rule.activeA.toLowerCase());
        const matchesB = actB.toLowerCase().includes(rule.activeB.toLowerCase());
        const reverseMatchesA = actA.toLowerCase().includes(rule.activeB.toLowerCase());
        const reverseMatchesB = actB.toLowerCase().includes(rule.activeA.toLowerCase());

        if ((matchesA && matchesB) || (reverseMatchesA && reverseMatchesB)) {
          return rule.warning;
        }
      }
    }
  }
  return null;
}

function checkActivesDuplicate(activesA: string[], activesB: string[]): boolean {
  for (const a of activesA) {
    const aLower = a.toLowerCase();
    for (const b of activesB) {
      const bLower = b.toLowerCase();
      if (aLower === bLower || (aLower.length > 4 && bLower.includes(aLower)) || (bLower.length > 4 && aLower.includes(bLower))) {
        return true;
      }
    }
  }
  return false;
}

function checkPurposesOverlap(purposesA: string[], purposesB: string[]): boolean {
  return purposesA.some(p => purposesB.map(x => x.toLowerCase()).includes(p.toLowerCase()));
}

export function runRoutineTest(candidate: CatalogueProduct, shelf: ShelfItem[]): RoutineTestResult {
  if (!shelf || shelf.length === 0) {
    return {
      overallVerdict: 'GOOD',
      verdictTitle: 'Good addition',
      verdictSubtitle: 'Your shelf is currently empty. This is a clean baseline to begin Day 1.',
      meterPositionPct: 12,
      meterColor: '#2C5044',
      items: [],
    };
  }

  const comparisonItems: ShelfComparisonItem[] = [];

  for (const item of shelf) {
    let shelfName = '';
    let shelfCategory = '';
    let shelfActives: string[] = [];
    let shelfPurposes: string[] = [];

    if (item.productId) {
      const catProd = CATALOGUE_PRODUCTS.find(p => p.id === item.productId);
      if (catProd) {
        shelfName = catProd.name;
        shelfCategory = catProd.category;
        shelfActives = catProd.actives;
        shelfPurposes = catProd.purposes;
      }
    } else if (item.manual) {
      shelfName = item.manual.name;
      shelfCategory = item.manual.category;
      shelfActives = item.manual.actives;
      shelfPurposes = item.manual.purposes;
    }

    if (!shelfName) continue;

    // Check same product exact duplicate
    if (item.productId && item.productId === candidate.id) {
      comparisonItems.push({
        shelfItemName: shelfName,
        category: shelfCategory,
        verdict: 'DUPLICATE',
        reason: 'Identical product already present on your shelf.',
      });
      continue;
    }

    // Check actives clash
    const clashWarning = checkActivesClash(candidate.actives, shelfActives);
    if (clashWarning) {
      comparisonItems.push({
        shelfItemName: shelfName,
        category: shelfCategory,
        verdict: 'CLASH',
        reason: clashWarning,
      });
      continue;
    }

    // Check duplicate actives + purpose
    const hasSameActives = checkActivesDuplicate(candidate.actives, shelfActives);
    const hasSamePurpose = checkPurposesOverlap(candidate.purposes, shelfPurposes);

    if (hasSameActives && hasSamePurpose) {
      comparisonItems.push({
        shelfItemName: shelfName,
        category: shelfCategory,
        verdict: 'DUPLICATE',
        reason: 'Shares primary actives and identical purpose. You do not need both.',
      });
    } else if (hasSamePurpose) {
      comparisonItems.push({
        shelfItemName: shelfName,
        category: shelfCategory,
        verdict: 'OVERLAP',
        reason: 'Targets a similar concern with different actives. Monitor tolerance before layering.',
      });
    } else if (hasSameActives) {
      comparisonItems.push({
        shelfItemName: shelfName,
        category: shelfCategory,
        verdict: 'OVERLAP',
        reason: 'Shares active ingredient. Watch total daily exposure to prevent overloading.',
      });
    } else {
      comparisonItems.push({
        shelfItemName: shelfName,
        category: shelfCategory,
        verdict: 'COMPLEMENTARY',
        reason: 'Different purpose — no chemical conflict.',
      });
    }
  }

  // Determine overall verdict based on worst pair
  const hasDuplicate = comparisonItems.some(i => i.verdict === 'DUPLICATE');
  const hasClash = comparisonItems.some(i => i.verdict === 'CLASH');
  const hasOverlap = comparisonItems.some(i => i.verdict === 'OVERLAP');

  let overallVerdict: OverallVerdict = 'GOOD';
  let verdictTitle = 'Good addition';
  let verdictSubtitle = 'No duplicates or clashes with what you own.';
  let meterPositionPct = 12; // Good (green)
  let meterColor = '#2C5044';

  if (hasDuplicate) {
    overallVerdict = 'DUPLICATE';
    verdictTitle = 'Redundant duplicate';
    verdictSubtitle = 'This duplicates formulas or purposes already on your shelf.';
    meterPositionPct = 88; // Red
    meterColor = '#B4492E';
  } else if (hasOverlap) {
    overallVerdict = 'OVERLAP';
    verdictTitle = 'Overlapping routine';
    verdictSubtitle = 'Targets similar concerns as products you already have.';
    meterPositionPct = 63; // Orange
    meterColor = '#E05A2B';
  } else if (hasClash) {
    overallVerdict = 'CAUTION';
    verdictTitle = 'Use with caution';
    verdictSubtitle = 'Contains actives that require separation (AM/PM or alternate days).';
    meterPositionPct = 38; // Yellow
    meterColor = '#D9822B';
  }

  return {
    overallVerdict,
    verdictTitle,
    verdictSubtitle,
    meterPositionPct,
    meterColor,
    items: comparisonItems,
  };
}
