export interface LevelInfo {
  level: number;
  title: string;
  minXp: number;
  nextLevelXp: number;
  nextLevelTitle: string;
  progressPercent: number;
}

export const LEVELS = [
  { level: 1, title: 'Fresh Starter', minXp: 0 },
  { level: 2, title: 'Consistent Carer', minXp: 100 },
  { level: 3, title: 'Lag-Phase Survivor', minXp: 400 },
  { level: 4, title: 'Ritual Keeper', minXp: 800 },
  { level: 5, title: 'Results Realist', minXp: 1500 },
];

export function getLevelInfo(xp: number): LevelInfo {
  let currentLevel = LEVELS[0];
  let nextLevel = LEVELS[1];

  for (let i = 0; i < LEVELS.length; i++) {
    if (xp >= LEVELS[i].minXp) {
      currentLevel = LEVELS[i];
      nextLevel = LEVELS[i + 1] || { level: 6, title: 'Results Master', minXp: 2500 };
    }
  }

  const range = nextLevel.minXp - currentLevel.minXp;
  const earned = xp - currentLevel.minXp;
  const progressPercent = Math.min(100, Math.max(0, Math.round((earned / range) * 100)));

  return {
    level: currentLevel.level,
    title: currentLevel.title,
    minXp: currentLevel.minXp,
    nextLevelXp: nextLevel.minXp,
    nextLevelTitle: nextLevel.title,
    progressPercent,
  };
}
