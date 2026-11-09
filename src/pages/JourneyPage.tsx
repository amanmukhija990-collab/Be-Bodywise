import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { Eyebrow } from '../components/Eyebrow';
import { CATALOGUE_PRODUCTS } from '../data/catalogue';
import { evaluateShelfItem, parseDate, getTodayDateStr } from '../lib/statusEngine';
import { getLevelInfo } from '../lib/xpEngine';
import { 
  Flame, Trophy, Check, Lock, Star, ShieldAlert, Sparkles, CheckCircle2, ArrowRight 
} from 'lucide-react';
import confetti from 'canvas-confetti';

export const JourneyPage: React.FC = () => {
  const { user, logProductApplication, todayStr, addToast } = useApp();
  const navigate = useNavigate();

  const [selectedCalendarDate, setSelectedCalendarDate] = useState<string | null>(todayStr);

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
      title: 'Day one',
      subtitle: 'Baseline photo & first application',
      danger: false,
    },
    {
      day: 7,
      title: 'First week',
      subtitle: 'Habit is forming — skin & scalp adjusting',
      danger: false,
    },
    {
      day: 14,
      title: 'Adjustment exit',
      subtitle: 'Purging and shedding settle down',
      danger: false,
    },
    {
      day: 21,
      title: 'Danger zone begins',
      subtitle: 'Week 3: most people quit here. Not you.',
      danger: true,
    },
    {
      day: 42,
      title: 'Visible change',
      subtitle: 'First visible results for most products',
      danger: false,
    },
    {
      day: 70,
      title: 'Momentum',
      subtitle: 'Changes become easy to see in photos',
      danger: false,
    },
    {
      day: 90,
      title: 'Transformation',
      subtitle: 'Full 90-day results review',
      danger: false,
    },
  ];

  // Daily missions generated from shelf
  const dailyMissions = shelf.map(item => {
    const evalData = evaluateShelfItem(item, todayStr);
    const prodName = item.productId
      ? CATALOGUE_PRODUCTS.find(p => p.id === item.productId)?.name || 'Product'
      : item.manual?.name || 'Manual Formula';

    const isDone = item.logs.includes(todayStr);

    let phase = 'Adjustment';
    if (evalData.day >= 21 && evalData.day <= 60) phase = 'Lag phase';
    if (evalData.day > 60) phase = 'Visible results';

    return {
      id: `apply-${item.id}`,
      shelfItemId: item.id,
      title: `Apply ${prodName}`,
      subtitle: `${item.when} · Day ${evalData.day} · ${phase}`,
      xp: 10,
      isDone,
    };
  });

  // Weekly missions
  const todayMissions = user?.missions[todayStr] || [];
  const isDecoderDone = todayMissions.includes('weekly-decoder-review');
  const isMatchDone = (user?.oneTimeAwards || []).includes('match_done');

  const weeklyMissions = [
    {
      id: 'weekly-decoder-review',
      title: 'Run a Results Decoder review',
      subtitle: 'Get your personalised AI explanation.',
      xp: 25,
      isDone: isDecoderDone,
      action: () => navigate('/decoder'),
    },
    {
      id: 'weekly-product-match',
      title: 'Take the Personal Product Match',
      subtitle: 'Know which formulas truly suit you.',
      xp: 50,
      isDone: isMatchDone,
      action: () => navigate('/match'),
    },
  ];

  const totalMissionsCount = dailyMissions.length + weeklyMissions.length;
  const completedMissionsCount =
    dailyMissions.filter(m => m.isDone).length + weeklyMissions.filter(m => m.isDone).length;

  // 28-Day Consistency Calendar data
  const calendarCells = [];
  const allLogsSet = new Set<string>();
  shelf.forEach(item => {
    (item.logs || []).forEach(l => allLogsSet.add(l));
  });

  const now = new Date(todayStr);
  let totalActiveDaysIn28 = 0;

  for (let i = 27; i >= 0; i--) {
    const d = new Date(now);
    d.setDate(d.getDate() - i);
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const dayOfMonth = String(d.getDate()).padStart(2, '0');
    const dStr = `${y}-${m}-${dayOfMonth}`;

    // Count how many products were applied on this day
    let productsLoggedOnDay = 0;
    shelf.forEach(item => {
      if ((item.logs || []).includes(dStr)) {
        productsLoggedOnDay++;
      }
    });

    const isToday = dStr === todayStr;
    if (productsLoggedOnDay > 0) totalActiveDaysIn28++;

    calendarCells.push({
      dateStr: dStr,
      dayNum: d.getDate(),
      count: productsLoggedOnDay,
      isToday,
    });
  }

  const triggerMilestoneCelebration = () => {
    confetti({
      particleCount: 70,
      spread: 60,
      origin: { y: 0.6 },
      colors: ['#A46F39', '#E29D52', '#8EBEA6', '#2C5044'],
    });
  };

  return (
    <div className="w-full max-w-[1280px] mx-auto px-5 sm:px-8 py-10 md:py-14">
      {/* 1. Hero Banner (Ink 28px radius) */}
      <div className="rounded-[28px] bg-[#172319] text-white p-7 sm:p-10 border border-[#2E3E33] shadow-2xl mb-12 relative overflow-hidden">
        {/* Subtle radial glow */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#A46F39]/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8">
          {/* Left + Centre */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 flex-1">
            {/* Level Badge */}
            <div className="w-20 h-20 rounded-2xl bg-[#E29D52] text-[#172319] flex flex-col items-center justify-center shrink-0 shadow-lg shadow-[#E29D52]/20 border border-white/20">
              <span className="font-mono text-[9px] uppercase tracking-widest font-extrabold leading-none">
                LEVEL
              </span>
              <span className="font-serif font-black text-3xl leading-none mt-1">
                {levelInfo.level}
              </span>
            </div>

            {/* Level Title & XP Bar */}
            <div className="flex-1 w-full max-w-md">
              <span className="font-mono text-[10px] uppercase tracking-[0.2em] font-semibold text-[#E29D52] block mb-1">
                12 · THE CARE JOURNEY
              </span>
              <h1 className="font-serif font-medium text-2xl sm:text-3xl text-white mb-3">
                {levelInfo.title}
              </h1>

              {/* XP Bar */}
              <div className="w-full">
                <div className="flex items-center justify-between text-xs text-white/80 font-mono mb-1.5">
                  <span>{user?.xp || 0} XP</span>
                  <span className="text-[#E29D52]">{levelInfo.nextLevelXp} XP · {levelInfo.nextLevelTitle}</span>
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

          {/* Right: Three Frosted Stat Tiles */}
          <div className="flex flex-wrap sm:flex-nowrap items-center gap-3 w-full lg:w-auto">
            <div className="flex-1 sm:w-28 p-3.5 rounded-2xl bg-white/10 backdrop-blur-md border border-white/10 text-center">
              <div className="flex items-center justify-center gap-1 text-[#E29D52] mb-0.5">
                <Flame className="w-4 h-4 fill-current" />
                <span className="font-serif font-bold text-xl text-white leading-none">
                  {user?.streak || 0}
                </span>
              </div>
              <span className="font-mono text-[9px] uppercase tracking-wider text-white/70 block">
                DAY STREAK
              </span>
            </div>

            <div className="flex-1 sm:w-28 p-3.5 rounded-2xl bg-white/10 backdrop-blur-md border border-white/10 text-center">
              <div className="flex items-center justify-center gap-1 text-[#E29D52] mb-0.5">
                <Trophy className="w-4 h-4 text-[#E29D52]" />
                <span className="font-serif font-bold text-xl text-white leading-none">
                  {user?.bestStreak || 0}
                </span>
              </div>
              <span className="font-mono text-[9px] uppercase tracking-wider text-white/70 block">
                BEST STREAK
              </span>
            </div>

            <div className="flex-1 sm:w-28 p-3.5 rounded-2xl bg-white/10 backdrop-blur-md border border-white/10 text-center">
              <div className="font-serif font-bold text-xl text-white leading-none mb-0.5">
                {maxDay}
              </div>
              <span className="font-mono text-[9px] uppercase tracking-wider text-white/70 block mb-1.5">
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

      {/* Two Columns Below */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        {/* Left Column: 90-Day Path Timeline */}
        <div className="lg:col-span-7">
          <Eyebrow className="mb-2">YOUR 90-DAY PATH</Eyebrow>
          <h2 className="font-serif font-medium text-2xl sm:text-3xl text-[#172319] mb-8">
            Every milestone, one step at a time
          </h2>

          <div className="relative pl-6 sm:pl-8 border-l-2 border-[#E9E4D8] space-y-10 ml-4">
            {milestones.map(m => {
              const isPassed = maxDay >= m.day;
              const isCurrent = maxDay >= m.day && (milestones.find(next => next.day > m.day && maxDay < next.day) !== undefined || m.day === 90);

              return (
                <div key={m.day} className="relative group">
                  {/* Timeline Node */}
                  <div
                    className={`absolute -left-[35px] sm:-left-[43px] top-0 w-8 h-8 rounded-full flex items-center justify-center transition-all ${
                      isPassed
                        ? 'bg-[#E29D52] text-[#172319] shadow-md ring-4 ring-[#FAF7F0]'
                        : 'bg-[#F0EBE1] text-[#6B6F66] border border-[#E9E4D8]'
                    }`}
                  >
                    {isPassed ? (
                      <Check className="w-4 h-4 stroke-[3]" />
                    ) : (
                      <Lock className="w-3.5 h-3.5" />
                    )}
                  </div>

                  {/* Milestone Card */}
                  <div
                    className={`p-5 rounded-2xl border transition-all ${
                      isCurrent
                        ? 'bg-white border-[#A46F39] shadow-sm'
                        : isPassed
                        ? 'bg-white/80 border-[#E9E4D8]'
                        : 'bg-[#F5F1E8]/50 border-transparent opacity-60'
                    }`}
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2 mb-1">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-[10px] uppercase tracking-wider text-[#A46F39] font-bold">
                          DAY {m.day}
                        </span>
                        {isCurrent && (
                          <span className="px-2 py-0.5 rounded-full bg-[#172319] text-white font-mono text-[9px] uppercase font-bold">
                            YOU'RE HERE
                          </span>
                        )}
                        {m.danger && (
                          <span className="px-2.5 py-0.5 rounded-full bg-[#FFF0EB] text-[#B4492E] font-mono text-[9px] uppercase font-bold inline-flex items-center gap-1">
                            <ShieldAlert className="w-3 h-3" />
                            <span>DROPOUT ZONE</span>
                          </span>
                        )}
                      </div>

                      {isPassed && (
                        <button
                          onClick={triggerMilestoneCelebration}
                          className="text-[11px] font-sans font-semibold text-[#2C5044] hover:underline"
                        >
                          Achieved ✓
                        </button>
                      )}
                    </div>

                    <h3 className="font-serif font-bold text-lg text-[#172319] mb-1">
                      {m.title}
                    </h3>
                    <p className="font-sans text-xs text-[#6B6F66] leading-relaxed">
                      {m.subtitle}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Sticky Stack (Missions + Calendar) */}
        <div className="lg:col-span-5 flex flex-col gap-8 sticky top-24">
          {/* 1. Missions Card */}
          <div className="p-6 sm:p-7 rounded-[24px] bg-white border border-[#E9E4D8] shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div>
                <span className="font-mono text-[10px] uppercase tracking-widest text-[#6B6F66] font-bold block">
                  TODAY · {todayStr}
                </span>
                <h3 className="font-serif font-bold text-xl text-[#172319]">
                  Missions
                </h3>
              </div>
              <span className="font-mono text-xs font-semibold px-2.5 py-1 rounded-full bg-[#FAF7F0] border border-[#E9E4D8] text-[#172319]">
                {completedMissionsCount}/{totalMissionsCount} done
              </span>
            </div>

            {/* Daily Missions */}
            <div className="mb-6">
              <span className="font-mono text-[10px] uppercase tracking-wider text-[#A46F39] font-bold block mb-2.5">
                DAILY MISSIONS
              </span>

              {dailyMissions.length === 0 ? (
                <p className="font-sans text-xs text-[#6B6F66] italic">
                  Add products to your shelf to unlock daily ritual missions.
                </p>
              ) : (
                <div className="flex flex-col gap-2">
                  {dailyMissions.map(m => (
                    <div
                      key={m.id}
                      onClick={() => {
                        if (!m.isDone) logProductApplication(m.shelfItemId);
                      }}
                      className={`p-3.5 rounded-2xl border transition-all flex items-center justify-between gap-3 ${
                        m.isDone
                          ? 'bg-[#E8F1EC] border-[#C5E6D4]'
                          : 'bg-white border-[#E9E4D8] hover:border-[#A46F39] hover:shadow-2xs cursor-pointer'
                      }`}
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div
                          className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 ${
                            m.isDone
                              ? 'bg-[#2C5044] text-white'
                              : 'border border-[#E9E4D8] text-transparent hover:border-[#A46F39]'
                          }`}
                        >
                          <Check className="w-3.5 h-3.5 stroke-[3]" />
                        </div>
                        <div className="min-w-0">
                          <p className="font-sans font-semibold text-xs text-[#172319] truncate">
                            {m.title}
                          </p>
                          <p className="font-sans text-[10px] text-[#6B6F66] truncate">
                            {m.subtitle}
                          </p>
                        </div>
                      </div>

                      <span
                        className={`font-mono text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0 ${
                          m.isDone
                            ? 'bg-[#2C5044]/15 text-[#2C5044]'
                            : 'bg-[#FFF4E5] text-[#A46F39]'
                        }`}
                      >
                        ⚡ {m.xp}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Weekly Missions */}
            <div>
              <span className="font-mono text-[10px] uppercase tracking-wider text-[#A46F39] font-bold block mb-2.5">
                WEEKLY MISSIONS
              </span>
              <div className="flex flex-col gap-2">
                {weeklyMissions.map(m => (
                  <div
                    key={m.id}
                    onClick={() => {
                      if (!m.isDone && m.action) m.action();
                    }}
                    className={`p-3.5 rounded-2xl border transition-all flex items-center justify-between gap-3 ${
                      m.isDone
                        ? 'bg-[#E8F1EC] border-[#C5E6D4]'
                        : 'bg-white border-[#E9E4D8] hover:border-[#A46F39] hover:shadow-2xs cursor-pointer'
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div
                        className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 ${
                          m.isDone
                            ? 'bg-[#2C5044] text-white'
                            : 'border border-[#E9E4D8] text-transparent hover:border-[#A46F39]'
                        }`}
                      >
                        <Check className="w-3.5 h-3.5 stroke-[3]" />
                      </div>
                      <div className="min-w-0">
                        <p className="font-sans font-semibold text-xs text-[#172319] truncate">
                          {m.title}
                        </p>
                        <p className="font-sans text-[10px] text-[#6B6F66] truncate">
                          {m.subtitle}
                        </p>
                      </div>
                    </div>

                    <span
                      className={`font-mono text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0 ${
                        m.isDone
                          ? 'bg-[#2C5044]/15 text-[#2C5044]'
                          : 'bg-[#FFF4E5] text-[#A46F39]'
                      }`}
                    >
                      ⚡ {m.xp}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* 2. Consistency Calendar · 28 Days */}
          <div className="p-6 sm:p-7 rounded-[24px] bg-white border border-[#E9E4D8] shadow-sm">
            <span className="font-mono text-[10px] uppercase tracking-widest text-[#A46F39] font-bold block mb-3">
              CONSISTENCY CALENDAR · 28 DAYS
            </span>

            {/* 7x4 Grid of rounded squares */}
            <div className="grid grid-cols-7 gap-2 mb-4">
              {calendarCells.map((cell, idx) => {
                let bg = '#F0EBE1';
                if (cell.count === 1) bg = '#EADCC2';
                if (cell.count === 2) bg = '#E29D52';
                if (cell.count >= 3) bg = '#A46F39';

                const isSelected = selectedCalendarDate === cell.dateStr;

                return (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setSelectedCalendarDate(cell.dateStr)}
                    className={`aspect-square rounded-[10px] flex items-center justify-center transition-all cursor-pointer relative ${
                      isSelected
                        ? 'ring-2 ring-[#A46F39] scale-105 z-10 font-bold'
                        : cell.isToday
                        ? 'ring-1 ring-[#172319]'
                        : 'hover:scale-105'
                    }`}
                    style={{ backgroundColor: bg }}
                    title={`${cell.dateStr}: ${cell.count} products logged`}
                    aria-label={`Inspect logs for ${cell.dateStr}`}
                  >
                    <span className="font-mono text-[10px] text-[#172319]">
                      {cell.dayNum}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Selected Date Inspector Panel */}
            {selectedCalendarDate && (
              <div className="p-3.5 rounded-xl bg-[#FAF7F0] border border-[#E9E4D8] mb-4 text-left animate-in fade-in">
                <div className="flex items-center justify-between text-xs mb-1.5">
                  <span className="font-mono font-bold text-[#A46F39] uppercase text-[10px]">
                    LOGS FOR {selectedCalendarDate} {selectedCalendarDate === todayStr ? '(TODAY)' : ''}
                  </span>
                  <span className="text-[10px] font-mono text-[#6B6F66]">
                    {shelf.filter(item => (item.logs || []).includes(selectedCalendarDate)).length} APPLIED
                  </span>
                </div>

                {shelf.filter(item => (item.logs || []).includes(selectedCalendarDate)).length === 0 ? (
                  <p className="font-sans text-xs text-[#6B6F66] italic">
                    No applications recorded on this date.
                  </p>
                ) : (
                  <div className="flex flex-wrap gap-1.5">
                    {shelf
                      .filter(item => (item.logs || []).includes(selectedCalendarDate))
                      .map(item => {
                        const name = item.productId
                          ? CATALOGUE_PRODUCTS.find(p => p.id === item.productId)?.name
                          : item.manual?.name;
                        return (
                          <span
                            key={item.id}
                            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-white border border-[#E9E4D8] text-[11px] font-sans text-[#172319]"
                          >
                            <span className="text-[#2C5044]">✓</span>
                            <span>{name}</span>
                          </span>
                        );
                      })}
                  </div>
                )}
              </div>
            )}

            {/* Footer */}
            <div className="flex items-center justify-between text-xs text-[#6B6F66] pt-2 border-t border-[#E9E4D8]">
              <span className="font-sans font-medium text-[#172319]">
                {totalActiveDaysIn28} active days total
              </span>

              <div className="flex items-center gap-1 text-[10px] font-mono">
                <span>Less</span>
                <span className="w-2.5 h-2.5 rounded-sm bg-[#F0EBE1]" />
                <span className="w-2.5 h-2.5 rounded-sm bg-[#EADCC2]" />
                <span className="w-2.5 h-2.5 rounded-sm bg-[#E29D52]" />
                <span className="w-2.5 h-2.5 rounded-sm bg-[#A46F39]" />
                <span>More</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
