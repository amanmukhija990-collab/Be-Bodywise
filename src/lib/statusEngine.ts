import { CatalogueProduct, CheckInRecord, ShelfItem, Status } from '../types';
import { CATALOGUE_PRODUCTS } from '../data/catalogue';

export function getTodayDateStr(): string {
  // Return YYYY-MM-DD
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function parseDate(dateStr: string): Date {
  const [y, m, d] = dateStr.split('-').map(Number);
  return new Date(y, m - 1, d);
}

export function daysBetween(fromStr: string, toStr: string): number {
  const from = parseDate(fromStr);
  const to = parseDate(toStr);
  const diffTime = to.getTime() - from.getTime();
  return Math.floor(diffTime / (1000 * 60 * 60 * 24));
}

export function calculateDayNumber(startDate: string, referenceDateStr?: string): number {
  const today = referenceDateStr || getTodayDateStr();
  const diff = daysBetween(startDate, today);
  return Math.max(1, diff + 1);
}

export function getExpectedUses(frequency: string, daysOnShelf: number): number {
  const windowDays = Math.min(28, Math.max(1, daysOnShelf));
  const lower = frequency.toLowerCase();
  if (lower.includes('daily')) {
    return windowDays;
  }
  if (lower.includes('2+') || lower.includes('twice')) {
    const weeks = Math.max(1, Math.ceil(windowDays / 7));
    return Math.min(windowDays, weeks * 2);
  }
  if (lower.includes('weekly')) {
    return Math.max(1, Math.ceil(windowDays / 7));
  }
  return windowDays;
}

export function calculateConsistency(item: ShelfItem, referenceDateStr?: string): {
  percentage: number;
  loggedUses28d: number;
  expectedUses28d: number;
} {
  const today = referenceDateStr || getTodayDateStr();
  const dayNum = calculateDayNumber(item.startDate, today);
  const expected = getExpectedUses(item.frequency, dayNum);

  // Count logs within the last 28 days
  const twentyEightDaysAgo = new Date(parseDate(today).getTime() - 28 * 24 * 60 * 60 * 1000);
  const logsInWindow = (item.logs || []).filter(logDate => {
    const d = parseDate(logDate);
    return d >= twentyEightDaysAgo && d <= parseDate(today);
  }).length;

  if (expected === 0) {
    return { percentage: 100, loggedUses28d: logsInWindow, expectedUses28d: 1 };
  }

  // Cap at 100% or allow slightly higher if logged more
  const pct = Math.min(100, Math.round((logsInWindow / expected) * 100));
  return {
    percentage: isNaN(pct) ? 100 : pct,
    loggedUses28d: logsInWindow,
    expectedUses28d: expected,
  };
}

export interface StatusEvaluation {
  status: Status;
  headline: string;
  badgeLabel: string;
  badgeBg: string;
  badgeText: string;
  dotColor: string;
  explanation: string;
  nextSteps: string[];
  day: number;
  consistency: number;
  loggedUses: number;
  expectedUses: number;
  product: CatalogueProduct | null;
}

export function evaluateShelfItem(item: ShelfItem, referenceDateStr?: string): StatusEvaluation {
  const today = referenceDateStr || getTodayDateStr();
  const day = calculateDayNumber(item.startDate, today);
  const { percentage: consistency, loggedUses28d, expectedUses28d } = calculateConsistency(item, today);

  const matchedProduct = item.productId
    ? CATALOGUE_PRODUCTS.find(p => p.id === item.productId) || null
    : null;

  const timeline = matchedProduct?.timeline || {
    adjustmentDays: 7,
    firstChangeDay: 21,
    fullResultDay: 60,
  };

  const checkIns = item.checkIns || [];
  const sortedCheckIns = [...checkIns].sort(
    (a, b) => parseDate(b.date).getTime() - parseDate(a.date).getTime()
  );
  const latestCheckIn = sortedCheckIns[0];

  // 14 days window for irritation
  const fourteenDaysAgo = new Date(parseDate(today).getTime() - 14 * 24 * 60 * 60 * 1000);
  const recentIrritation = checkIns.some(c => c.irritation && parseDate(c.date) >= fourteenDaysAgo);

  let status: Status = 'too_early';

  // Rule 1: Consider professional help
  if (
    recentIrritation ||
    (day >= timeline.fullResultDay + 14 &&
      latestCheckIn &&
      latestCheckIn.score <= 1 &&
      consistency >= 80)
  ) {
    status = 'professional_help';
  }
  // Rule 2: Review usage
  else if (day > 14 && consistency < 60) {
    status = 'review_usage';
  }
  // Rule 3: On track
  else if (latestCheckIn && latestCheckIn.score >= 2 && consistency >= 70) {
    status = 'on_track';
  }
  // Rule 4: Too early
  else if (day < timeline.firstChangeDay) {
    status = 'too_early';
  }
  // Rule 5: Expected lag phase
  else {
    status = 'lag_phase';
  }

  // Format headlines & badges
  let headline = "It is still too early.";
  let badgeLabel = "Too early";
  let badgeBg = "#EEEAFB";
  let badgeText = "#5B4BC4";
  let dotColor = "#5B4BC4";
  let explanation = `Day ${day} of a product that typically shows first change around day ${timeline.firstChangeDay}. `;

  if (status === 'too_early') {
    headline = "It is still too early.";
    badgeLabel = "Too early";
    badgeBg = "#EEEAFB";
    badgeText = "#5B4BC4";
    dotColor = "#5B4BC4";
    if (day <= timeline.adjustmentDays) {
      explanation += `The first ${timeline.adjustmentDays} days are about your ${item.when === 'Shower' ? 'scalp or skin' : 'skin'} adjusting — no visible result is expected yet.`;
    } else {
      explanation += `You are building cellular momentum. The active ingredients are working beneath the surface before outward signs appear.`;
    }
  } else if (status === 'lag_phase') {
    headline = "You are in the expected lag phase.";
    badgeLabel = "Expected lag phase";
    badgeBg = "#E6F5FF";
    badgeText = "#B86E1D";
    dotColor = "#E29D52";
    explanation = `Day ${day} is in the classic dropout danger zone (Weeks 3–8). Most people quit here because outward changes are subtle, even though deep follicle and cellular pathways are actively shifting.`;
  } else if (status === 'on_track') {
    headline = "You are on track.";
    badgeLabel = "On track";
    badgeBg = "#EDFCF5";
    badgeText = "#2C5044";
    dotColor = "#2C5044";
    explanation = `Day ${day} with ${consistency}% consistency and positive check-in scores. The active formulation is responding well with your routine.`;
  } else if (status === 'review_usage') {
    headline = "Let's review how you're using it.";
    badgeLabel = "Review usage";
    badgeBg = "#FFF0EB";
    badgeText = "#C25324";
    dotColor = "#E05A2B";
    explanation = `Day ${day} with ${consistency}% consistency. At this consistency rate, the concentration of actives drops below therapeutic thresholds, making results take much longer.`;
  } else if (status === 'professional_help') {
    headline = "Consider professional help.";
    badgeLabel = "Consider professional help";
    badgeBg = "#FBEBE8";
    badgeText = "#B4492E";
    dotColor = "#B4492E";
    explanation = recentIrritation
      ? `You reported recent redness, stinging, or unusual shedding. We strongly recommend pausing application and consulting a certified dermatologist.`
      : `Day ${day} is well past the expected full response window (${timeline.fullResultDay} days) despite good consistency. A dermatologist can assess whether an in-clinic protocol or prescription active is better suited.`;
  }

  // Actionable next steps
  const nextSteps: string[] = [];
  if (status === 'too_early') {
    nextSteps.push(`Keep applying ${item.frequency.toLowerCase()} (${item.when}) exactly as instructed.`);
    nextSteps.push(`Take a clear baseline photo in neutral morning light today.`);
    nextSteps.push(`Book a quick self check-in on Day ${Math.min(day + 7, timeline.firstChangeDay)}.`);
  } else if (status === 'lag_phase') {
    nextSteps.push(`Protect your streak. Week 4–6 is where 70% of people prematurely stop.`);
    nextSteps.push(`Compare your skin or scalp today against your Day 1 baseline photo.`);
    nextSteps.push(`Complete your weekly check-in to track texture, oiliness, and shedding trends.`);
  } else if (status === 'on_track') {
    nextSteps.push(`Do not increase dosage or layer competing actives — your current routine is working.`);
    nextSteps.push(`Document your progress photo in the same lighting.`);
    nextSteps.push(`Maintain consistency through Day ${timeline.fullResultDay} for consolidated results.`);
  } else if (status === 'review_usage') {
    nextSteps.push(`Set a daily phone reminder or pair application with an existing ritual (e.g. brushing teeth).`);
    nextSteps.push(`Check contact time: if this is a wash-off product, let it sit for the full 2–3 minutes.`);
    nextSteps.push(`Aim to log at least 5 days this week to rebuild therapeutic active levels.`);
  } else {
    nextSteps.push(`Temporarily pause this product to allow your skin/scalp barrier to reset.`);
    nextSteps.push(`Use only gentle, fragrance-free barrier moisturisers and SPF.`);
    nextSteps.push(`Schedule an appointment with a dermatologist with your 90-day history log.`);
  }

  return {
    status,
    headline,
    badgeLabel,
    badgeBg,
    badgeText,
    dotColor,
    explanation,
    nextSteps,
    day,
    consistency,
    loggedUses: loggedUses28d,
    expectedUses: expectedUses28d,
    product: matchedProduct,
  };
}

export function generateFallbackAiExplanation(evaluation: StatusEvaluation, item: ShelfItem): string {
  const prodName = evaluation.product?.name || item.manual?.name || 'this formula';
  const actives = evaluation.product?.actives?.join(', ') || item.manual?.actives?.join(', ') || 'verified clinical actives';
  const day = evaluation.day;
  const firstChange = evaluation.product?.timeline.firstChangeDay || 21;
  const fullResult = evaluation.product?.timeline.fullResultDay || 60;

  if (evaluation.status === 'too_early') {
    return `It is Day ${day}, so no visible change is exactly what we expect. ${actives} operates at a cellular level, targeting the underlying biochemical triggers before surface signs show. Visible change typically begins around Day ${firstChange}, with consolidated results around Day ${fullResult}.\n\nThis week, keep your application steady and resist the urge to apply more than the recommended dose. Take a high-resolution baseline photo in natural morning light so you have an objective comparison point for Day 21.`;
  }
  if (evaluation.status === 'lag_phase') {
    return `You have arrived at Day ${day}, entering the crucial lag window. The active ingredients (${actives}) are already altering follicle dynamics or epidermal renewal, but outward transformation is subtle. This is the exact phase where most routines are prematurely abandoned.\n\nCommit to remaining consistent for the next 14 days. Look for early secondary markers—such as calmer oil production, reduced scalp itch, or smoother texture—rather than final density or spot clearance.`;
  }
  if (evaluation.status === 'on_track') {
    return `At Day ${day} with ${evaluation.consistency}% consistency, your results trajectory is solid. The synergy of ${actives} is clearly taking hold as reflected in your positive check-in scores.\n\nKeep your technique identical. Do not introduce new harsh exfoliants or change frequency; steady bio-accumulation over the next 30 days will deepen these visible improvements.`;
  }
  if (evaluation.status === 'review_usage') {
    return `At Day ${day}, your recorded consistency is ${evaluation.consistency}%. Because ${actives} relies on regular cellular exposure to inhibit problem pathways, erratic application creates pauses in progress that feel like formulation failure.\n\nThis week, anchor application directly to an existing daily habit. Re-check the recommended contact time and ensure you are using the full recommended dosage.`;
  }
  return `At Day ${day}, your logged feedback suggests elevated sensitivity or stalled progress. When skin or scalp barriers react with persistent redness or when a formula shows zero shift after ${fullResult} days of disciplined use, professional evaluation is the wisest next move.\n\nPause active exfoliation or concentrated serums. Prioritise a neutral barrier cream and consult a certified dermatologist with your shelf log as reference.`;
}
