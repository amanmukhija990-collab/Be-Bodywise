import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { Eyebrow } from '../components/Eyebrow';
import { CircularProgressRing } from '../components/CircularProgressRing';
import { CATALOGUE_PRODUCTS } from '../data/catalogue';
import { evaluateShelfItem, getTodayDateStr } from '../lib/statusEngine';
import { getLevelInfo } from '../lib/xpEngine';
import { 
  Flame, Sparkles, Check, ArrowRight, Gauge, Layers, Sliders, Calendar, Plus 
} from 'lucide-react';

export const DashboardPage: React.FC = () => {
  const { user, logProductApplication, todayStr } = useApp();
  const navigate = useNavigate();

  const shelf = user?.shelf || [];

  let maxDay = 1;
  let unloggedTodayItem: any = null;

  shelf.forEach(item => {
    const evalData = evaluateShelfItem(item, todayStr);
    if (evalData.day > maxDay) {
      maxDay = evalData.day;
    }
    if (!item.logs.includes(todayStr) && !unloggedTodayItem) {
      unloggedTodayItem = item;
    }
  });

  const levelInfo = getLevelInfo(user?.xp || 0);

  const firstName = user?.profile.firstName || 'Friend';

  return (
    <div className="w-full max-w-[1280px] mx-auto px-5 sm:px-8 py-10 md:py-14">
      {/* Greeting Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
        <div>
          <Eyebrow className="mb-2">PERSONAL RESULTS OVERVIEW</Eyebrow>
          <h1 className="font-serif font-medium text-3xl sm:text-4xl text-[#172319] leading-tight">
            Good morning, {firstName}.{' '}
            <span className="italic font-normal text-[#A46F39]">Day {maxDay}</span> of your 90.
          </h1>
          <p className="font-sans text-sm sm:text-base text-[#6B6F66] mt-2 leading-relaxed">
            Your daily consistency keeps biological actives above clinical efficacy thresholds.
          </p>
        </div>

        {/* Quick Streak + Level Display */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-[#E9E4D8] shadow-2xs">
            <Flame className="w-4 h-4 text-[#E29D52] fill-[#E29D52]" />
            <span className="font-sans font-bold text-sm text-[#172319]">{user?.streak || 0}</span>
            <span className="font-mono text-[10px] text-[#6B6F66] uppercase">STREAK</span>
          </div>

          <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-[#E9E4D8] shadow-2xs">
            <Sparkles className="w-4 h-4 text-[#A46F39]" />
            <span className="font-sans font-bold text-sm text-[#172319]">{user?.xp || 0}</span>
            <span className="font-mono text-[10px] text-[#A46F39] uppercase font-bold">XP</span>
          </div>
        </div>
      </div>

      {/* Hero "Next Best Action" Dark Card */}
      <div className="rounded-[28px] bg-[#172319] text-white p-7 sm:p-9 border border-[#2E3E33] shadow-xl mb-10 relative overflow-hidden flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="max-w-xl">
          <span className="font-mono text-[10px] uppercase tracking-widest text-[#E29D52] font-semibold block mb-2">
            NEXT BEST ACTION
          </span>
          {unloggedTodayItem ? (
            <>
              <h2 className="font-serif font-medium text-2xl text-white mb-2">
                Log today's application to protect your {user?.streak}-day streak
              </h2>
              <p className="font-sans text-xs sm:text-sm text-white/70 leading-relaxed">
                Consistency is the single biggest predictor of whether a clinical formula reaches visible results.
              </p>
            </>
          ) : (
            <>
              <h2 className="font-serif font-medium text-2xl text-white mb-2">
                All daily applications completed for today!
              </h2>
              <p className="font-sans text-xs sm:text-sm text-white/70 leading-relaxed">
                Check the Results Decoder for your verified biological milestones and next weekly review.
              </p>
            </>
          )}
        </div>

        <div className="shrink-0 flex items-center gap-3">
          {unloggedTodayItem ? (
            <button
              onClick={() => logProductApplication((unloggedTodayItem as any).id)}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#E29D52] hover:bg-[#A46F39] text-[#172319] hover:text-white font-sans font-semibold text-xs transition-all cursor-pointer shadow-md"
            >
              <Check className="w-4 h-4" />
              <span>Log application now</span>
            </button>
          ) : (
            <Link
              to="/decoder"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#E29D52] hover:bg-[#A46F39] text-[#172319] hover:text-white font-sans font-semibold text-xs transition-all cursor-pointer shadow-md"
            >
              <Gauge className="w-4 h-4" />
              <span>Open Decoder</span>
            </Link>
          )}
        </div>
      </div>

      {/* Shelf Status Strip */}
      <div className="bg-white rounded-[24px] border border-[#E9E4D8] p-6 sm:p-7 shadow-sm mb-10">
        <div className="flex items-center justify-between mb-5">
          <div>
            <span className="font-mono text-[10px] uppercase tracking-widest text-[#A46F39] font-bold block">
              MY SHELF STATUS STRIP
            </span>
            <h3 className="font-serif font-bold text-xl text-[#172319]">
              Live Product Clocks
            </h3>
          </div>
          <Link
            to="/shelf"
            className="text-xs font-semibold text-[#A46F39] hover:underline inline-flex items-center gap-1"
          >
            <span>Manage shelf</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {shelf.length === 0 ? (
          <div className="py-8 text-center">
            <p className="font-sans text-xs text-[#6B6F66] mb-3">No products on your shelf yet.</p>
            <Link
              to="/shelf"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#172319] text-white text-xs font-medium"
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

              return (
                <div
                  key={item.id}
                  onClick={() => navigate(`/decoder?item=${item.id}`)}
                  className="p-4 rounded-2xl bg-[#FAF7F0] border border-[#E9E4D8] hover:border-[#172319] hover:shadow-2xs transition-all cursor-pointer flex flex-col justify-between"
                >
                  <div className="flex items-start justify-between gap-2 mb-3">
                    <h4 className="font-serif font-semibold text-xs sm:text-sm text-[#172319] line-clamp-1">
                      {name}
                    </h4>
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
                    <div className="flex items-center justify-between mt-3 pt-2 border-t border-[#E9E4D8]/60 text-xs">
                      <span className="text-[11px] text-[#6B6F66]">
                        {evalData.consistency}% consistency
                      </span>
                      {item.logs.includes(todayStr) ? (
                        <span className="text-[10px] font-semibold text-[#2C5044] bg-[#E8F1EC] px-2 py-0.5 rounded-full">
                          ✓ Applied
                        </span>
                      ) : (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            logProductApplication(item.id);
                          }}
                          className="px-2.5 py-0.5 rounded-full bg-[#172319] hover:bg-[#2C5044] text-white text-[10px] font-semibold transition-all cursor-pointer shadow-2xs"
                        >
                          + Log today
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

      {/* 3 Quick-Link Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Link
          to="/match"
          className="p-6 rounded-[24px] bg-white border border-[#E9E4D8] hover:border-[#A46F39] hover:shadow-md transition-all group"
        >
          <div className="w-10 h-10 rounded-2xl bg-[#F0EBE1] flex items-center justify-center text-[#172319] group-hover:bg-[#A46F39] group-hover:text-white transition-colors mb-4">
            <Sliders className="w-5 h-5" />
          </div>
          <span className="font-mono text-[10px] uppercase tracking-wider text-[#A46F39] font-bold block mb-1">
            02 · PRE-PURCHASE
          </span>
          <h3 className="font-serif font-semibold text-lg text-[#172319] mb-1">
            Personal Product Match
          </h3>
          <p className="font-sans text-xs text-[#6B6F66] leading-relaxed">
            Find and rank clinical formulas that genuinely suit your skin, hair, and body goals.
          </p>
        </Link>

        <Link
          to="/routine-test"
          className="p-6 rounded-[24px] bg-white border border-[#E9E4D8] hover:border-[#A46F39] hover:shadow-md transition-all group"
        >
          <div className="w-10 h-10 rounded-2xl bg-[#F0EBE1] flex items-center justify-center text-[#172319] group-hover:bg-[#A46F39] group-hover:text-white transition-colors mb-4">
            <Layers className="w-5 h-5" />
          </div>
          <span className="font-mono text-[10px] uppercase tracking-wider text-[#A46F39] font-bold block mb-1">
            03 · PRE-PURCHASE
          </span>
          <h3 className="font-serif font-semibold text-lg text-[#172319] mb-1">
            Routine Test
          </h3>
          <p className="font-sans text-xs text-[#6B6F66] leading-relaxed">
            Test any candidate formula against what's already on your shelf to prevent clashes.
          </p>
        </Link>

        <Link
          to="/decoder"
          className="p-6 rounded-[24px] bg-white border border-[#E9E4D8] hover:border-[#A46F39] hover:shadow-md transition-all group"
        >
          <div className="w-10 h-10 rounded-2xl bg-[#F0EBE1] flex items-center justify-center text-[#172319] group-hover:bg-[#A46F39] group-hover:text-white transition-colors mb-4">
            <Gauge className="w-5 h-5" />
          </div>
          <span className="font-mono text-[10px] uppercase tracking-wider text-[#A46F39] font-bold block mb-1">
            11 · DECODING
          </span>
          <h3 className="font-serif font-semibold text-lg text-[#172319] mb-1">
            Results Decoder
          </h3>
          <p className="font-sans text-xs text-[#6B6F66] leading-relaxed">
            Get the honest status: whether it is too early, in the lag phase, or on track.
          </p>
        </Link>
      </div>
    </div>
  );
};
