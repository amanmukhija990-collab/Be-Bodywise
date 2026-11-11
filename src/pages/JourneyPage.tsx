import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { Eyebrow } from '../components/Eyebrow';
import { CATALOGUE_PRODUCTS } from '../data/catalogue';
import { evaluateShelfItem } from '../lib/statusEngine';
import { getLevelInfo } from '../lib/xpEngine';
import { 
  Flame, Trophy, Check, Lock, ShieldAlert, Sparkles, Plus 
} from 'lucide-react';
import confetti from 'canvas-confetti';

export const JourneyPage: React.FC = () => {
  const { 
    user, 
    logProductApplication, 
    unlogProductApplication, 
    toggleMission, 
    todayStr 
  } = useApp();
  const navigate = useNavigate();

  const shelf = user?.shelf || [];

  // Determine current max day across all shelf products (or default to 1)
  let maxDay = 1;
  shelf.forEach(item => {
    const evalData = evaluateShelfItem(item, todayStr);
    if (evalData.day > maxDay) {
      maxDay = evalData.day;
    }
  });

  const levelInfo = getLevelInfo(user?.xp || 0);

  // 90-Day Milestones
  const milestones = [
    {
      day: 1,
      title: 'Day 1 · Baseline Point',
      subtitle: 'Starting your verified 90-day biological clock.',
      danger: false,
    },
    {
      day: 7,
      title: 'Day 7 · First Week',
      subtitle: 'Cellular habit formed; skin and scalp acclimating to actives.',
      danger: false,
    },
    {
      day: 14,
      title: 'Day 14 · Adjustment Exit',
      subtitle: 'Initial shedding and purge sensitivity settle down.',
      danger: false,
    },
    {
      day: 21,
      title: 'Day 21 · Danger Zone',
      subtitle: 'Week 3: most people quit right here before turnover. Not you.',
      danger: true,
    },
    {
      day: 42,
      title: 'Day 42 · Visible Shift',
      subtitle: 'First visible clinical changes emerge in tone and root density.',
      danger: false,
    },
    {
      day: 70,
      title: 'Day 70 · Peak Momentum',
      subtitle: 'Sustained cellular renewal clearly visible in comparative photos.',
      danger: false,
    },
    {
      day: 90,
      title: 'Day 90 · Transformation',
      subtitle: 'Full 90-day biological transformation complete.',
      danger: false,
    },
  ];

  const todayMissions = user?.missions[todayStr] || [];

  // Self-selectable weekly missions
  const weeklyMissionsList = [
    {
      id: 'weekly-decoder-review',
      title: 'Complete Weekly Decoder Review',
      subtitle: 'Inspect your active timeline phase and check in.',
      xp: 25,
      action: () => navigate('/decoder'),
    },
    {
      id: 'weekly-shelf-audit',
      title: 'Shelf & Expiry Check',
      subtitle: 'Verify bottle levels and store in cool dry space.',
      xp: 20,
    },
    {
      id: 'weekly-product-match',
      title: 'Take the Personal Product Match',
      subtitle: 'Refine your personalized formula ranking.',
      xp: 30,
      action: () => navigate('/match'),
    },
  ];

  const triggerMilestoneCelebration = () => {
    confetti({
      particleCount: 60,
      spread: 60,
      origin: { y: 0.6 },
      colors: ['#A46F39', '#E29D52', '#8EBEA6', '#2C5044'],
    });
  };

  return (
    <div className="w-full max-w-[1280px] mx-auto px-5 sm:px-8 py-8 md:py-12">
      {/* 1. Hero Banner */}
      <div className="rounded-[28px] bg-[#143461] text-white p-7 sm:p-9 border border-[#225396] shadow-2xl mb-10 relative overflow-hidden">
        <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5 flex-1">
            <div className="w-18 h-18 rounded-2xl bg-[#E29D52] text-[#111827] flex flex-col items-center justify-center shrink-0 shadow-lg border border-white/20">
              <span className="font-mono text-[9px] uppercase tracking-widest font-extrabold leading-none">
                LEVEL
              </span>
              <span className="font-serif font-black text-2xl leading-none mt-1">
                {levelInfo.level}
              </span>
            </div>

            <div className="flex-1 w-full max-w-md">
              <span className="font-mono text-[10px] uppercase tracking-[0.2em] font-semibold text-[#EB6200] block mb-1">
                12 · THE CARE JOURNEY
              </span>
              <h1 className="font-serif font-medium text-2xl sm:text-3xl text-white mb-2">
                {levelInfo.title}
              </h1>

              <div className="w-full">
                <div className="flex items-center justify-between text-xs text-white/80 font-mono mb-1">
                  <span>{user?.xp || 0} XP</span>
                  <span className="text-[#EB6200]">{levelInfo.nextLevelXp} XP · {levelInfo.nextLevelTitle}</span>
                </div>
                <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-[#E29D52] rounded-full transition-all duration-700"
                    style={{ width: `${levelInfo.progressPercent}%` }}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap sm:flex-nowrap items-center gap-3 w-full lg:w-auto">
            <div className="flex-1 sm:w-28 p-3 rounded-2xl bg-white/10 backdrop-blur-md border border-white/10 text-center">
              <div className="flex items-center justify-center gap-1 text-[#EB6200] mb-0.5">
                <Flame className="w-4 h-4 fill-current" />
                <span className="font-serif font-bold text-xl text-white leading-none">
                  {user?.streak || 0}
                </span>
              </div>
              <span className="font-mono text-[9px] uppercase tracking-wider text-white/70 block">
                DAY STREAK
              </span>
            </div>

            <div className="flex-1 sm:w-28 p-3 rounded-2xl bg-white/10 backdrop-blur-md border border-white/10 text-center">
              <div className="flex items-center justify-center gap-1 text-[#EB6200] mb-0.5">
                <Trophy className="w-4 h-4 text-[#EB6200]" />
                <span className="font-serif font-bold text-xl text-white leading-none">
                  {user?.bestStreak || 0}
                </span>
              </div>
              <span className="font-mono text-[9px] uppercase tracking-wider text-white/70 block">
                BEST STREAK
              </span>
            </div>

            <div className="flex-1 sm:w-28 p-3 rounded-2xl bg-white/10 backdrop-blur-md border border-white/10 text-center">
              <div className="font-serif font-bold text-xl text-white leading-none mb-0.5">
                Day {maxDay}
              </div>
              <span className="font-mono text-[9px] uppercase tracking-wider text-white/70 block mb-1">
                OF 90 DAYS
              </span>
              <div className="w-full h-1 bg-white/20 rounded-full overflow-hidden">
                <div
                  className="h-full bg-[#8EBEA6] rounded-full"
                  style={{ width: `${Math.min(100, (maxDay / 90) * 100)}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Simplified Consistency Planner & 90-Day Path */}
        <div className="lg:col-span-7 flex flex-col gap-8">
          {/* SIMPLIFIED CONSISTENCY PLANNER: Shows exactly how many days consistent with each product */}
          <div className="p-6 sm:p-7 rounded-[24px] bg-white border border-[#E2E8F0] shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div>
                <span className="font-mono text-[10px] uppercase tracking-widest text-[#005995] font-bold block">
                  CONSISTENCY PLANNER
                </span>
                <h2 className="font-serif font-bold text-xl sm:text-2xl text-[#111827]">
                  How Many Days You've Been Consistent
                </h2>
              </div>
              <span className="font-mono text-xs text-[#64748B] bg-[#FAFBFD] px-3 py-1 rounded-full border border-[#E2E8F0]">
                {shelf.length} {shelf.length === 1 ? 'Product' : 'Products'}
              </span>
            </div>

            <p className="font-sans text-xs sm:text-sm text-[#64748B] mb-6 leading-relaxed">
              Your direct consistency count per formula. High consistency keeps biological active concentrations above clinical thresholds.
            </p>

            {shelf.length === 0 ? (
              <p className="text-xs text-[#64748B] italic py-4">
                No products on your shelf yet. Add formulas to start tracking consistency.
              </p>
            ) : (
              <div className="space-y-4">
                {shelf.map(item => {
                  const evalData = evaluateShelfItem(item, todayStr);
                  const prodName = item.productId
                    ? CATALOGUE_PRODUCTS.find(p => p.id === item.productId)?.name || 'Product'
                    : item.manual?.name || 'Manual Formula';
                  const isLoggedToday = item.logs.includes(todayStr);
                  const totalDaysActive = evalData.day;
                  const daysLogged = item.logs?.length || 0;

                  return (
                    <div
                      key={item.id}
                      className="p-4 rounded-2xl bg-[#FAFBFD] border border-[#E2E8F0] flex flex-col gap-3"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <h3 className="font-serif font-semibold text-sm sm:text-base text-[#111827]">
                            {prodName}
                          </h3>
                          <p className="font-mono text-[10px] text-[#64748B] mt-0.5">
                            {item.when} · {item.frequency} · Started Day 1
                          </p>
                        </div>

                        <div className="text-right">
                          <p className="font-serif font-bold text-base sm:text-lg text-[#111827]">
                            {daysLogged} of {totalDaysActive} days
                          </p>
                          <span className="font-mono text-[10px] font-semibold text-[#005995]">
                            {evalData.consistency}% consistent
                          </span>
                        </div>
                      </div>

                      {/* Progress Bar */}
                      <div className="w-full h-2 bg-[#E2E8F0] rounded-full overflow-hidden">
                        <div
                          className="h-full bg-[#005995] rounded-full transition-all duration-500"
                          style={{ width: `${evalData.consistency}%` }}
                        />
                      </div>

                      {/* Bottom status and direct toggle button */}
                      <div className="flex items-center justify-between pt-1 text-xs">
                        <span className="text-[11px] text-[#64748B]">
                          {isLoggedToday ? '✓ Recorded for today' : '⚠️ Pending for today'}
                        </span>

                        {isLoggedToday ? (
                          <button
                            type="button"
                            onClick={() => unlogProductApplication(item.id)}
                            className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-[#EDFCF5] hover:bg-[#d5e7dc] text-[#198775] text-[10px] font-semibold transition-colors cursor-pointer"
                            title="Click to unmark"
                          >
                            <Check className="w-3 h-3" />
                            <span>Logged today (tap to undo)</span>
                          </button>
                        ) : (
                          <button
                            type="button"
                            onClick={() => logProductApplication(item.id)}
                            className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-[#005995] hover:bg-[#004777] text-white text-[10px] font-semibold transition-all cursor-pointer shadow-2xs"
                          >
                            <Plus className="w-3 h-3" />
                            <span>Log for today</span>
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* 90-Day Path Timeline */}
          <div>
            <Eyebrow className="mb-2">90-DAY PROGRESSION PATH</Eyebrow>
            <h3 className="font-serif font-medium text-2xl text-[#111827] mb-6">
              Milestone Roadmap
            </h3>

            <div className="relative pl-6 sm:pl-8 border-l-2 border-[#E2E8F0] space-y-6 ml-3">
              {milestones.map(m => {
                const isPassed = maxDay >= m.day;
                const isCurrent =
                  maxDay >= m.day &&
                  (milestones.find(next => next.day > m.day && maxDay < next.day) !== undefined || m.day === 90);

                return (
                  <div key={m.day} className="relative">
                    <div
                      className={`absolute -left-[35px] sm:-left-[43px] top-0 w-8 h-8 rounded-full flex items-center justify-center transition-all ${
                        isPassed
                          ? 'bg-[#E29D52] text-[#111827] shadow-md ring-4 ring-[#FAFBFD]'
                          : 'bg-[#E6F5FF] text-[#64748B] border border-[#E2E8F0]'
                      }`}
                    >
                      {isPassed ? (
                        <Check className="w-4 h-4 stroke-[3]" />
                      ) : (
                        <Lock className="w-3.5 h-3.5" />
                      )}
                    </div>

                    <div
                      className={`p-4 rounded-2xl border transition-all ${
                        isCurrent
                          ? 'bg-white border-[#A46F39] shadow-sm'
                          : isPassed
                          ? 'bg-white/80 border-[#E2E8F0]'
                          : 'bg-[#F0F6FA]/50 border-transparent opacity-60'
                      }`}
                    >
                      <div className="flex flex-wrap items-center justify-between gap-2 mb-1">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-[10px] uppercase tracking-wider text-[#005995] font-bold">
                            DAY {m.day}
                          </span>
                          {isCurrent && (
                            <span className="px-2 py-0.5 rounded-full bg-[#143461] text-white font-mono text-[9px] uppercase font-bold">
                              YOU'RE HERE
                            </span>
                          )}
                          {m.danger && (
                            <span className="px-2 py-0.5 rounded-full bg-[#FFF0EB] text-[#B4492E] font-mono text-[9px] uppercase font-bold inline-flex items-center gap-1">
                              <ShieldAlert className="w-3 h-3" />
                              <span>DROPOUT ZONE</span>
                            </span>
                          )}
                        </div>

                        {isPassed && (
                          <button
                            onClick={triggerMilestoneCelebration}
                            className="text-[11px] font-sans font-semibold text-[#198775] hover:underline"
                          >
                            Achieved ✓
                          </button>
                        )}
                      </div>

                      <h4 className="font-serif font-bold text-base text-[#111827]">
                        {m.title}
                      </h4>
                      <p className="font-sans text-xs text-[#64748B] mt-0.5">
                        {m.subtitle}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Column: User-Selectable Daily & Weekly Missions */}
        <div className="lg:col-span-5 flex flex-col gap-6 sticky top-24">
          <div className="p-6 sm:p-7 rounded-[24px] bg-white border border-[#E2E8F0] shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div>
                <span className="font-mono text-[10px] uppercase tracking-widest text-[#64748B] font-bold block">
                  TODAY · DAY {maxDay}
                </span>
                <h3 className="font-serif font-bold text-xl text-[#111827]">
                  Daily & Weekly Missions
                </h3>
              </div>
              <span className="font-mono text-xs text-[#005995] font-semibold bg-[#FAFBFD] px-2.5 py-1 rounded-full border border-[#E2E8F0]">
                Select yourself each day
              </span>
            </div>

            <p className="font-sans text-xs text-[#64748B] mb-5 leading-relaxed">
              Check off your daily applications and weekly ritual reviews as you complete them.
            </p>

            {/* Daily Missions */}
            <div className="mb-6">
              <span className="font-mono text-[10px] uppercase tracking-wider text-[#005995] font-bold block mb-2.5">
                DAILY MISSIONS · TAP TO CHECK
              </span>

              {shelf.length === 0 ? (
                <p className="font-sans text-xs text-[#64748B] italic">
                  Add products to your shelf to unlock daily ritual missions.
                </p>
              ) : (
                <div className="flex flex-col gap-2">
                  {shelf.map(item => {
                    const prodName = item.productId
                      ? CATALOGUE_PRODUCTS.find(p => p.id === item.productId)?.name || 'Product'
                      : item.manual?.name || 'Manual Formula';
                    const isDone = item.logs.includes(todayStr);

                    return (
                      <div
                        key={item.id}
                        onClick={() => {
                          if (isDone) {
                            unlogProductApplication(item.id);
                          } else {
                            logProductApplication(item.id);
                          }
                        }}
                        className={`p-3.5 rounded-2xl border transition-all flex items-center justify-between gap-3 cursor-pointer ${
                          isDone
                            ? 'bg-[#EDFCF5] border-[#C5E6D4]'
                            : 'bg-white border-[#E2E8F0] hover:border-[#005995] hover:shadow-2xs'
                        }`}
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <div
                            className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 ${
                              isDone
                                ? 'bg-[#005995] text-white'
                                : 'border border-[#E2E8F0] text-transparent hover:border-[#005995]'
                            }`}
                          >
                            <Check className="w-3.5 h-3.5 stroke-[3]" />
                          </div>
                          <div className="min-w-0">
                            <p className={`font-sans font-semibold text-xs text-[#111827] truncate ${isDone ? 'line-through text-[#198775]' : ''}`}>
                              Apply {prodName}
                            </p>
                            <p className="font-sans text-[10px] text-[#64748B] truncate">
                              {item.when} · {item.frequency}
                            </p>
                          </div>
                        </div>

                        <span
                          className={`font-mono text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0 ${
                            isDone
                              ? 'bg-[#005995]/15 text-[#198775]'
                              : 'bg-[#E6F5FF] text-[#005995]'
                          }`}
                        >
                          ⚡ +10 XP
                        </span>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Weekly Missions */}
            <div>
              <span className="font-mono text-[10px] uppercase tracking-wider text-[#005995] font-bold block mb-2.5">
                WEEKLY MISSIONS · TAP TO CHECK
              </span>

              <div className="flex flex-col gap-2">
                {weeklyMissionsList.map(m => {
                  const isDone = todayMissions.includes(m.id);

                  return (
                    <div
                      key={m.id}
                      onClick={() => {
                        toggleMission(m.id, m.xp);
                      }}
                      className={`p-3.5 rounded-2xl border transition-all flex items-center justify-between gap-3 cursor-pointer ${
                        isDone
                          ? 'bg-[#EDFCF5] border-[#C5E6D4]'
                          : 'bg-white border-[#E2E8F0] hover:border-[#005995] hover:shadow-2xs'
                      }`}
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div
                          className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 ${
                            isDone
                              ? 'bg-[#005995] text-white'
                              : 'border border-[#E2E8F0] text-transparent hover:border-[#005995]'
                          }`}
                        >
                          <Check className="w-3.5 h-3.5 stroke-[3]" />
                        </div>
                        <div className="min-w-0">
                          <p className={`font-sans font-semibold text-xs text-[#111827] truncate ${isDone ? 'line-through text-[#198775]' : ''}`}>
                            {m.title}
                          </p>
                          <p className="font-sans text-[10px] text-[#64748B] truncate">
                            {m.subtitle}
                          </p>
                        </div>
                      </div>

                      <span
                        className={`font-mono text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0 ${
                          isDone
                            ? 'bg-[#005995]/15 text-[#198775]'
                            : 'bg-[#E6F5FF] text-[#005995]'
                        }`}
                      >
                        ⚡ +{m.xp} XP
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
