import { UserState } from '../types';
import { getTodayDateStr } from '../lib/statusEngine';

function getDateNDaysAgo(n: number): string {
  const d = new Date();
  d.setDate(d.getDate() - n);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function createDemoUser(): UserState {
  const today = getTodayDateStr();

  // Generate logs for a 24-day streak up to today
  const streakLogs: string[] = [];
  for (let i = 0; i < 24; i++) {
    streakLogs.push(getDateNDaysAgo(i));
  }

  // Pre-populate 4 shelf items matching all 4 core decoder states
  return {
    profile: {
      firstName: 'Aanya',
      email: 'aanya@example.com',
    },
    xp: 865, // LV 4: Ritual Keeper
    streak: 24,
    bestStreak: 24,
    missions: {
      [today]: ['apply-shelf-1', 'weekly-decoder-review'],
    },
    oneTimeAwards: ['match_done'],
    matchAnswers: {
      focus: ['hair', 'skin'],
      skinType: 'Oily',
      concerns: ['Dandruff & itchy scalp', 'Open pores & oiliness', 'Acne & breakouts'],
      reactivity: 'Rarely reacts',
      commitment: 'balanced',
    },
    matchResults: ['prod-hair-3', 'prod-skin-2', 'prod-hair-1', 'prod-skin-1'],
    shelf: [
      {
        id: 'shelf-1',
        productId: 'prod-hair-3', // Scalp Clarify Anti-Dandruff Shampoo
        startDate: today, // Day 1 -> Status: "Too early"
        when: 'Shower',
        frequency: '2+ a week',
        instructions: 'Lather on the scalp and leave for 3–5 minutes before rinsing. Use twice a week.',
        logs: [today],
        checkIns: [
          {
            date: today,
            score: 1, // No change
            irritation: false,
            note: 'Day 1 baseline: mild flaking on crown, scalp slightly dry.',
          },
        ],
      },
      {
        id: 'shelf-2',
        productId: 'prod-hair-1', // Procapil + Redensyl Hair Growth Serum
        startDate: getDateNDaysAgo(36), // Day 37 -> Status: "Expected lag phase"
        when: 'PM',
        frequency: 'Daily',
        instructions: 'Apply 1ml with dropper directly onto clean, dry scalp areas showing thinning. Gently massage for 1–2 minutes.',
        logs: streakLogs,
        checkIns: [
          {
            date: getDateNDaysAgo(35),
            score: 1,
            irritation: false,
            note: 'Baseline application on temple thinning.',
          },
          {
            date: getDateNDaysAgo(21),
            score: 1,
            irritation: false,
            note: 'No visible change yet, but shedding in shower has stabilised.',
          },
          {
            date: getDateNDaysAgo(7),
            score: 1,
            irritation: false,
            note: 'Week 5 check-in: feeling tempted to quit, but staying consistent.',
          },
        ],
      },
      {
        id: 'shelf-3',
        productId: 'prod-skin-2', // 10% Niacinamide Clarifying Serum
        startDate: getDateNDaysAgo(51), // Day 52 -> Status: "On track"
        when: 'AM',
        frequency: 'Daily',
        instructions: 'Gently press 3–4 drops into face and neck every morning. Follow with moisturiser and sunscreen.',
        logs: streakLogs,
        checkIns: [
          {
            date: getDateNDaysAgo(45),
            score: 1,
            irritation: false,
          },
          {
            date: getDateNDaysAgo(28),
            score: 2,
            irritation: false,
            note: 'Mid-day T-zone oiliness noticeably calmer.',
          },
          {
            date: getDateNDaysAgo(5),
            score: 3,
            irritation: false,
            note: 'Noticeable refining around nose and cheek pores. Makeup glides on smoothly.',
          },
        ],
      },
      {
        id: 'shelf-4',
        productId: 'prod-skin-1', // 2% Salicylic Acid Face Serum
        startDate: getDateNDaysAgo(23), // Day 24, low consistency -> Status: "Review usage"
        when: 'PM',
        frequency: 'Daily',
        instructions: 'Apply 2–3 drops onto clean skin at night before moisturiser.',
        logs: [getDateNDaysAgo(22), getDateNDaysAgo(20), getDateNDaysAgo(14), getDateNDaysAgo(12)],
        checkIns: [
          {
            date: getDateNDaysAgo(18),
            score: 1,
            irritation: false,
            note: 'Missed several days due to late work hours.',
          },
        ],
      },
    ],
  };
}
