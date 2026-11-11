import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { Eyebrow } from '../components/Eyebrow';
import { CircularProgressRing } from '../components/CircularProgressRing';
import { DaySelector } from '../components/DaySelector';
import { CATALOGUE_PRODUCTS } from '../data/catalogue';
import { evaluateShelfItem } from '../lib/statusEngine';
import { 
  Flame, Sparkles, Check, ArrowRight, Gauge, Layers, Sliders, Plus, CalendarCheck, CheckCircle2 
} from 'lucide-react';

export const DashboardPage: React.FC = () => {
  const { user, logProductApplication, unlogProductApplication, toggleMission, todayStr } = useApp();
  const navigate = useNavigate();

  const shelf = user?.shelf || [];

  let maxDay = 1;
  const unloggedProducts: any[] = [];
  const loggedProducts: any[] = [];

  shelf.forEach(item => {
    const evalData = evaluateShelfItem(item, todayStr);
    if (evalData.day > maxDay) {
      maxDay = evalData.day;
    }
    if (!item.logs.includes(todayStr)) {
      unloggedProducts.push(item);
    } else {
      loggedProducts.push(item);
    }
  });

  const firstName = user?.profile.firstName || 'Friend';
  const todayMissions = user?.missions[todayStr] || [];

  const handleLogAllPending = () => {
    unloggedProducts.forEach(item => {
      logProductApplication(item.id);
    });
  };

  return (
    <div className="w-full max-w-[1280px] mx-auto px-5 sm:px-8 py-8 md:py-12">
      {/* Greeting Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
        <div>
          <Eyebrow className="mb-2">PERSONAL RESULTS OVERVIEW</Eyebrow>
          <h1 className="font-serif font-medium text-3xl sm:text-4xl text-[#111827] dark:text-[#F4EFE6] leading-tight">
            Good morning, {firstName}.{' '}
            <span className="italic font-normal text-[#005995] dark:text-[#EB6200]">Day {maxDay}</span> of 90.
          </h1>
          <p className="font-sans text-sm sm:text-base text-[#64748B] dark:text-[#B1BAAF] mt-2 leading-relaxed">
            Track daily applications and watch clinical actives build towards visible results.
          </p>
        </div>

        {/* Action badges: Day Switcher, Streak, XP */}
        <div className="flex flex-wrap items-center gap-2.5">
          <DaySelector />

          <div className="flex items-center gap-2 px-3.5 py-2 rounded-full bg-white dark:bg-[#18281E] border border-[#E2E8F0] dark:border-[#243528] shadow-2xs">
            <Flame className="w-4 h-4 text-[#EB6200] fill-[#EB6200]" />
            <span className="font-sans font-bold text-sm text-[#111827] dark:text-[#F4EFE6]">{user?.streak || 0}</span>
            <span className="font-mono text-[10px] text-[#64748B] dark:text-[#B1BAAF] uppercase">STREAK</span>
          </div>

          <div className="flex items-center gap-2 px-3.5 py-2 rounded-full bg-white dark:bg-[#18281E] border border-[#E2E8F0] dark:border-[#243528] shadow-2xs">
            <Sparkles className="w-4 h-4 text-[#005995] dark:text-[#EB6200]" />
            <span className="font-sans font-bold text-sm text-[#111827] dark:text-[#F4EFE6]">{user?.xp || 0}</span>
            <span className="font-mono text-[10px] text-[#005995] dark:text-[#EB6200] uppercase font-bold">XP</span>
          </div>
        </div>
      </div>

      {/* Hero "Today's Routine Action" Card */}
      <div className="rounded-[28px] bg-[#143461] text-white p-7 sm:p-9 border border-[#225396] shadow-xl mb-10 relative overflow-hidden flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="max-w-xl">
          <span className="font-mono text-[10px] uppercase tracking-widest text-[#EB6200] font-semibold block mb-2">
            DAY {maxDay} · TODAY'S ROUTINE
          </span>
          {unloggedProducts.length > 0 ? (
            <>
              <h2 className="font-serif font-medium text-2xl sm:text-3xl text-white mb-2">
                {unloggedProducts.length} {unloggedProducts.length === 1 ? 'product needs' : 'products need'} logging today
              </h2>
              <p className="font-sans text-xs sm:text-sm text-white/70 leading-relaxed">
                Log your products today to maintain your {user?.streak || 0}-day streak and fuel continuous cellular renewal.
              </p>
            </>
          ) : (
            <>
              <h2 className="font-serif font-medium text-2xl sm:text-3xl text-white mb-2">
                ✓ All products logged for Day {maxDay}!
              </h2>
              <p className="font-sans text-xs sm:text-sm text-white/70 leading-relaxed">
                Great job staying consistent. Check your Results Decoder for weekly milestone updates.
              </p>
            </>
          )}
        </div>

        <div className="shrink-0 flex items-center gap-3">
          {unloggedProducts.length > 0 ? (
            <button
              onClick={handleLogAllPending}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#005995] hover:bg-[#004777] text-[#111827] hover:text-white font-sans font-semibold text-xs sm:text-sm transition-all cursor-pointer shadow-md"
            >
              <Check className="w-4 h-4" />
              <span>Log all for Day {maxDay}</span>
            </button>
          ) : (
            <Link
              to="/decoder"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#005995] hover:bg-[#004777] text-[#111827] hover:text-white font-sans font-semibold text-xs sm:text-sm transition-all cursor-pointer shadow-md"
            >
              <Gauge className="w-4 h-4" />
              <span>Open Decoder</span>
            </Link>
          )}
        </div>
      </div>

      {/* Shelf Status Strip */}
      <div className="bg-white rounded-[24px] border border-[#E2E8F0] p-6 sm:p-7 shadow-sm mb-10">
        <div className="flex items-center justify-between mb-5">
          <div>
            <span className="font-mono text-[10px] uppercase tracking-widest text-[#005995] font-bold block">
              MY SHELF · ACTIVE PRODUCTS
            </span>
            <h3 className="font-serif font-bold text-xl text-[#111827]">
              Product Consistency Clocks
            </h3>
          </div>
          <Link
            to="/shelf"
            className="text-xs font-semibold text-[#005995] hover:underline inline-flex items-center gap-1"
          >
            <span>Manage shelf</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {shelf.length === 0 ? (
          <div className="py-8 text-center">
            <p className="font-sans text-xs text-[#64748B] mb-3">No products on your shelf yet.</p>
            <Link
              to="/shelf"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#143461] text-white text-xs font-medium"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add products</span>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {shelf.map(item => {
              const evalData = evaluateShelfItem(item, todayStr);
              const name = item.productId
                ? CATALOGUE_PRODUCTS.find(p => p.id === item.productId)?.name || 'Product'
                : item.manual?.name || 'Manual Formula';
              const isLogged = item.logs.includes(todayStr);

              return (
                <div
                  key={item.id}
                  className="p-4 rounded-2xl bg-[#FAFBFD] border border-[#E2E8F0] hover:border-[#005995] transition-all flex flex-col justify-between"
                >
                  <div className="flex items-start justify-between gap-2 mb-3">
                    <div>
                      <h4 className="font-serif font-semibold text-xs sm:text-sm text-[#111827] line-clamp-1">
                        {name}
                      </h4>
                      <span className="font-mono text-[10px] text-[#64748B]">
                        {item.when} · {item.frequency}
                      </span>
                    </div>
                    <CircularProgressRing day={evalData.day} size={36} strokeWidth={2.5} />
                  </div>

                  <div>
                    <span
                      className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-sans font-medium"
                      style={{ backgroundColor: evalData.badgeBg, color: evalData.badgeText }}
                    >
                      <span
                        className="w-1.5 h-1.5 rounded-full"
                        style={{ backgroundColor: evalData.dotColor }}
                      />
                      <span>{evalData.badgeLabel}</span>
                    </span>

                    <div className="flex items-center justify-between mt-3 pt-2.5 border-t border-[#E2E8F0]/60 text-xs">
                      <span className="text-[11px] text-[#64748B]">
                        {evalData.consistency}% consistency
                      </span>

                      {isLogged ? (
                        <button
                          type="button"
                          onClick={() => unlogProductApplication(item.id)}
                          title="Click to unlog if marked by mistake"
                          className="inline-flex items-center gap-1 text-[10px] font-semibold text-[#198775] bg-[#EDFCF5] hover:bg-[#d5e7dc] px-2.5 py-1 rounded-full cursor-pointer transition-colors"
                        >
                          <Check className="w-3 h-3" />
                          <span>Applied</span>
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={() => logProductApplication(item.id)}
                          className="px-2.5 py-1 rounded-full bg-[#005995] hover:bg-[#004777] text-white text-[10px] font-semibold transition-all cursor-pointer shadow-2xs"
                        >
                          + Log for Day {maxDay}
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Today's Daily Missions Checklist */}
      <div className="bg-white rounded-[24px] border border-[#E2E8F0] p-6 sm:p-7 shadow-sm mb-10">
        <div className="flex items-center justify-between mb-4">
          <div>
            <span className="font-mono text-[10px] uppercase tracking-widest text-[#005995] font-bold block">
              DAILY MISSIONS
            </span>
            <h3 className="font-serif font-bold text-xl text-[#111827]">
              Check Off Today's Actions (Day {maxDay})
            </h3>
          </div>
          <span className="font-mono text-xs text-[#64748B] bg-[#FAFBFD] px-3 py-1 rounded-full border border-[#E2E8F0]">
            Tap any mission to check / uncheck
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
          {shelf.map(item => {
            const name = item.productId
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
                    : 'bg-[#FAFBFD] border-[#E2E8F0] hover:border-[#005995]'
                }`}
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <div
                    className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 ${
                      isDone
                        ? 'bg-[#005995] text-white'
                        : 'border border-[#E2E8F0] text-transparent bg-white'
                    }`}
                  >
                    <Check className="w-3.5 h-3.5 stroke-[3]" />
                  </div>
                  <div className="min-w-0">
                    <p className={`font-sans font-semibold text-xs text-[#111827] truncate ${isDone ? 'line-through text-[#198775]' : ''}`}>
                      Apply {name}
                    </p>
                    <p className="font-mono text-[10px] text-[#64748B]">
                      {item.when} · +10 XP
                    </p>
                  </div>
                </div>

                <span className={`font-mono text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0 ${
                  isDone ? 'bg-[#005995]/10 text-[#198775]' : 'bg-white border border-[#E2E8F0] text-[#111827]'
                }`}>
                  {isDone ? 'Done' : 'Pending'}
                </span>
              </div>
            );
          })}

          {/* Quick Bonus Habit Mission */}
          <div
            onClick={() => toggleMission('hydrate-8-glasses', 15)}
            className={`p-3.5 rounded-2xl border transition-all flex items-center justify-between gap-3 cursor-pointer ${
              todayMissions.includes('hydrate-8-glasses')
                ? 'bg-[#EDFCF5] border-[#C5E6D4]'
                : 'bg-[#FAFBFD] border-[#E2E8F0] hover:border-[#005995]'
            }`}
          >
            <div className="flex items-center gap-2.5 min-w-0">
              <div
                className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 ${
                  todayMissions.includes('hydrate-8-glasses')
                    ? 'bg-[#005995] text-white'
                    : 'border border-[#E2E8F0] text-transparent bg-white'
                }`}
              >
                <Check className="w-3.5 h-3.5 stroke-[3]" />
              </div>
              <div className="min-w-0">
                <p className={`font-sans font-semibold text-xs text-[#111827] truncate ${todayMissions.includes('hydrate-8-glasses') ? 'line-through text-[#198775]' : ''}`}>
                  Hydrate with 2.5L Water
                </p>
                <p className="font-mono text-[10px] text-[#64748B]">
                  Cellular hydration · +15 XP
                </p>
              </div>
            </div>

            <span className={`font-mono text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0 ${
              todayMissions.includes('hydrate-8-glasses') ? 'bg-[#005995]/10 text-[#198775]' : 'bg-white border border-[#E2E8F0] text-[#111827]'
            }`}>
              {todayMissions.includes('hydrate-8-glasses') ? 'Done' : 'Tap'}
            </span>
          </div>
        </div>
      </div>

      {/* 3 Simple Quick Navigation Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Link
          to="/match"
          className="p-6 rounded-[24px] bg-white border border-[#E2E8F0] hover:border-[#005995] hover:shadow-md transition-all group"
        >
          <div className="w-10 h-10 rounded-2xl bg-[#E6F5FF] flex items-center justify-center text-[#111827] group-hover:bg-[#A46F39] group-hover:text-white transition-colors mb-4">
            <Sliders className="w-5 h-5" />
          </div>
          <span className="font-mono text-[10px] uppercase tracking-wider text-[#005995] font-bold block mb-1">
            02 · ASSESSMENT
          </span>
          <h3 className="font-serif font-semibold text-lg text-[#111827] mb-1">
            Personal Product Match
          </h3>
          <p className="font-sans text-xs text-[#64748B] leading-relaxed">
            Find and rank clinical formulas that genuinely suit your skin, hair, and body goals.
          </p>
        </Link>

        <Link
          to="/shelf"
          className="p-6 rounded-[24px] bg-white border border-[#E2E8F0] hover:border-[#005995] hover:shadow-md transition-all group"
        >
          <div className="w-10 h-10 rounded-2xl bg-[#E6F5FF] flex items-center justify-center text-[#111827] group-hover:bg-[#A46F39] group-hover:text-white transition-colors mb-4">
            <Layers className="w-5 h-5" />
          </div>
          <span className="font-mono text-[10px] uppercase tracking-wider text-[#005995] font-bold block mb-1">
            04 · SINGLE TRUTH
          </span>
          <h3 className="font-serif font-semibold text-lg text-[#111827] mb-1">
            My Shelf
          </h3>
          <p className="font-sans text-xs text-[#64748B] leading-relaxed">
            Add or edit formulas, inspect start dates, and track your active consistency rates.
          </p>
        </Link>

        <Link
          to="/decoder"
          className="p-6 rounded-[24px] bg-white border border-[#E2E8F0] hover:border-[#005995] hover:shadow-md transition-all group"
        >
          <div className="w-10 h-10 rounded-2xl bg-[#E6F5FF] flex items-center justify-center text-[#111827] group-hover:bg-[#A46F39] group-hover:text-white transition-colors mb-4">
            <Gauge className="w-5 h-5" />
          </div>
          <span className="font-mono text-[10px] uppercase tracking-wider text-[#005995] font-bold block mb-1">
            11 · DECODING
          </span>
          <h3 className="font-serif font-semibold text-lg text-[#111827] mb-1">
            Results Decoder
          </h3>
          <p className="font-sans text-xs text-[#64748B] leading-relaxed">
            Log weekly check-ins and view timeline milestones week by week with honest clinical advice.
          </p>
        </Link>
      </div>
    </div>
  );
};
