import React, { useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { Eyebrow } from '../components/Eyebrow';
import { CircularProgressRing } from '../components/CircularProgressRing';
import { CATALOGUE_PRODUCTS } from '../data/catalogue';
import { evaluateShelfItem, StatusEvaluation, parseDate, daysBetween } from '../lib/statusEngine';
import { ShelfItem, CheckInRecord } from '../types';
import { DaySelector } from '../components/DaySelector';
import { ProductImage } from '../components/ProductImage';
import { 
  Sparkles, CheckCircle2, AlertTriangle, ArrowRight, Plus, ShieldCheck, Check, Calendar, ChevronDown 
} from 'lucide-react';

interface WeekMilestone {
  weekNum: number;
  label: string;
  daysRange: string;
  advisorExpectation: string;
  minDay: number;
  maxDay: number;
}

const WEEK_MILESTONES: WeekMilestone[] = [
  {
    weekNum: 1,
    label: 'Week 1',
    daysRange: 'Days 1 – 7',
    advisorExpectation: 'Cellular adjustment phase. Mild tingling or gentle purging is normal as actives penetrate follicular pores. Focus on barrier comfort and daily habit consistency. No surface transformation expected yet.',
    minDay: 1,
    maxDay: 7,
  },
  {
    weekNum: 2,
    label: 'Week 2',
    daysRange: 'Days 8 – 14',
    advisorExpectation: 'Sebum balance stabilization. Excess surface oiliness begins to level out, and initial adjustment sensitivity decreases. Hair follicles are receiving steady nutritional actives.',
    minDay: 8,
    maxDay: 14,
  },
  {
    weekNum: 3,
    label: 'Week 3',
    daysRange: 'Days 15 – 21',
    advisorExpectation: 'Texture refining and barrier consolidation. Active ingredients accelerate micro-turnover. The dropout hazard is highest here — stay consistent even if surface changes seem subtle.',
    minDay: 15,
    maxDay: 21,
  },
  {
    weekNum: 4,
    label: 'Week 4',
    daysRange: 'Days 22 – 28',
    advisorExpectation: 'First full epidermal cycle turnover complete. Calmer breakout recurrence, early reduction in shower hair fall, and noticeable smoothness on touch.',
    minDay: 22,
    maxDay: 28,
  },
  {
    weekNum: 5,
    label: 'Weeks 5 – 8',
    daysRange: 'Days 29 – 56',
    advisorExpectation: 'Active biological remodeling. Visible fading of stubborn dark spots, reduction in shedding by up to 40%, and baby hairs starting to sprout along thinning areas.',
    minDay: 29,
    maxDay: 56,
  },
  {
    weekNum: 9,
    label: 'Weeks 9 – 12',
    daysRange: 'Days 57 – 90',
    advisorExpectation: 'Peak clinical efficacy. Robust stratum corneum barrier, uniform pigmentation tone, and maximum follicle anchorage. Long-term maintenance mode begins.',
    minDay: 57,
    maxDay: 90,
  },
];

export const DecoderPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { user, saveCheckIn, completeWeeklyDecoderMission, todayStr } = useApp();

  const shelf = user?.shelf || [];

  // Selected item ID from URL query ?item= or default to first shelf item
  const selectedItemId = searchParams.get('item') || (shelf[0]?.id || '');
  const selectedItem: ShelfItem | undefined = shelf.find(s => s.id === selectedItemId) || shelf[0];

  // Daily check-in form state
  const [checkInScore, setCheckInScore] = useState<0 | 1 | 2 | 3 | 4>(1);
  const [irritation, setIrritation] = useState<boolean>(false);
  const [checkInNote, setCheckInNote] = useState<string>('');
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);

  const toggleStepCompleted = (idx: number) => {
    if (completedSteps.includes(idx)) {
      setCompletedSteps(completedSteps.filter(i => i !== idx));
    } else {
      setCompletedSteps([...completedSteps, idx]);
    }
  };

  const handleSelectItem = (id: string) => {
    setSearchParams({ item: id });
  };

  const evaluation: StatusEvaluation | null = selectedItem
    ? evaluateShelfItem(selectedItem, todayStr)
    : null;

  const handleSaveCheckInSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedItem) return;

    saveCheckIn(selectedItem.id, {
      score: checkInScore,
      irritation,
      note: checkInNote.trim() || undefined,
    });

    setCheckInNote('');
    completeWeeklyDecoderMission();
  };

  if (!shelf || shelf.length === 0) {
    return (
      <div className="w-full max-w-[1280px] mx-auto px-5 sm:px-8 py-16 text-center">
        <div className="max-w-md mx-auto bg-white rounded-3xl p-10 border border-[#E2E8F0] shadow-sm">
          <Eyebrow className="mb-2">11 · PERSONAL RESULTS DECODER</Eyebrow>
          <h2 className="font-serif font-bold text-2xl text-[#111827] mb-3">
            No products on your shelf yet
          </h2>
          <p className="font-sans text-sm text-[#64748B] mb-6">
            Add a product with its start date to unlock its verified biological timeline and honest status evaluation.
          </p>
          <Link
            to="/shelf"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#143461] text-white text-xs font-semibold hover:bg-[#005995] transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Go to My Shelf</span>
          </Link>
        </div>
      </div>
    );
  }

  const productName = evaluation?.product?.name || selectedItem?.manual?.name || 'Selected Product';
  const itemStartDate = selectedItem?.startDate || todayStr;

  // Calculate which week each check-in belongs to based on days from startDate
  const getDayNumberForDate = (dateStr: string): number => {
    const diff = daysBetween(itemStartDate, dateStr);
    return Math.max(1, diff + 1);
  };

  const checkIns = selectedItem?.checkIns || [];

  return (
    <div className="w-full max-w-[1280px] mx-auto px-5 sm:px-8 py-8 md:py-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
        <div className="max-w-2xl">
          <Eyebrow className="mb-2">11 · PERSONAL RESULTS DECODER</Eyebrow>
          <h1 className="font-serif font-medium text-3xl sm:text-4xl text-[#111827] dark:text-[#F4EFE6] leading-tight">
            Is it working? Here's the <span className="italic font-normal text-[#005995] dark:text-[#EB6200]">honest</span> answer.
          </h1>
          <p className="font-sans text-sm sm:text-base text-[#64748B] dark:text-[#B1BAAF] mt-2 leading-relaxed">
            Your start date + verified biological timeline + your daily logs, decoded into one honest clinical status.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <DaySelector />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Shelf Selector */}
        <div className="lg:col-span-4 flex flex-col gap-3">
          <span className="font-mono text-[10px] uppercase tracking-widest text-[#64748B] font-bold block mb-1">
            SELECT FORMULA ({shelf.length})
          </span>

          {shelf.map(item => {
            const isSelected = item.id === selectedItemId;
            const evalItem = evaluateShelfItem(item, todayStr);
            const name = item.productId
              ? CATALOGUE_PRODUCTS.find(p => p.id === item.productId)?.name || 'Product'
              : item.manual?.name || 'Manual Formula';

            return (
              <button
                key={item.id}
                type="button"
                onClick={() => handleSelectItem(item.id)}
                className={`p-4 rounded-2xl text-left transition-all flex items-center justify-between gap-3 cursor-pointer ${
                  isSelected
                    ? 'bg-white border-2 border-[#005995] shadow-md -translate-y-0.5'
                    : 'bg-white/80 border border-[#E2E8F0] hover:bg-white hover:border-[#005995]/50'
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <CircularProgressRing day={evalItem.day} size={42} strokeWidth={3} />
                  <div className="min-w-0">
                    <h4 className="font-serif font-semibold text-xs sm:text-sm text-[#111827] truncate">
                      {name}
                    </h4>
                    <span
                      className="inline-flex items-center gap-1 text-[10px] font-sans font-medium mt-1"
                      style={{ color: evalItem.badgeText }}
                    >
                      <span
                        className="w-1.5 h-1.5 rounded-full shrink-0"
                        style={{ backgroundColor: evalItem.dotColor }}
                      />
                      <span>{evalItem.badgeLabel}</span>
                    </span>
                  </div>
                </div>

                <ArrowRight
                  className={`w-4 h-4 shrink-0 transition-transform ${
                    isSelected ? 'text-[#111827] translate-x-1' : 'text-[#64748B]/40'
                  }`}
                />
              </button>
            );
          })}
        </div>

        {/* Right Column: Verdict Card + Daily Check-in + Week-by-Week History */}
        {evaluation && selectedItem && (
          <div className="lg:col-span-8 flex flex-col gap-6">
            {/* 1. Main Verdict Card */}
            <div className="p-7 sm:p-9 rounded-[24px] bg-white border border-[#E2E8F0] shadow-sm">
              <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
                <span
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-sans font-medium"
                  style={{ backgroundColor: evaluation.badgeBg, color: evaluation.badgeText }}
                >
                  <span
                    className="w-2 h-2 rounded-full"
                    style={{ backgroundColor: evaluation.dotColor }}
                  />
                  <span>{evaluation.badgeLabel}</span>
                </span>

                <span className="font-mono text-[10px] uppercase tracking-wider text-[#64748B] font-semibold">
                  {productName}
                </span>
              </div>

              <h2 className="font-serif font-medium text-2xl sm:text-3xl text-[#111827] leading-tight mb-3">
                "{evaluation.headline}"
              </h2>

              <p className="font-sans text-sm sm:text-base text-[#64748B] leading-relaxed mb-6 max-w-2xl">
                {evaluation.explanation}
              </p>

              <div className="pt-6 border-t border-[#E2E8F0] grid grid-cols-3 gap-4">
                <div>
                  <p className="font-serif font-bold text-3xl sm:text-4xl text-[#111827]">
                    Day {evaluation.day}
                  </p>
                  <p className="font-mono text-[10px] uppercase tracking-wider text-[#64748B] mt-1 font-semibold">
                    OF 90 DAYS
                  </p>
                </div>

                <div>
                  <p className="font-serif font-bold text-3xl sm:text-4xl text-[#111827]">
                    {evaluation.consistency}%
                  </p>
                  <p className="font-mono text-[10px] uppercase tracking-wider text-[#64748B] mt-1 font-semibold">
                    CONSISTENCY RATE
                  </p>
                </div>

                <div>
                  <p className="font-serif font-bold text-3xl sm:text-4xl text-[#111827]">
                    {evaluation.loggedUses}/{evaluation.expectedUses}
                  </p>
                  <p className="font-mono text-[10px] uppercase tracking-wider text-[#64748B] mt-1 font-semibold">
                    USES LOGGED
                  </p>
                </div>
              </div>
            </div>

            {/* 2. Side-by-Side: Daily Check-in Form & Next Action Protocol */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Daily Check-in Form */}
              <div className="p-6 rounded-[24px] bg-white border border-[#E2E8F0] shadow-sm flex flex-col justify-between">
                <div>
                  <span className="font-mono text-[10px] uppercase tracking-widest text-[#005995] font-bold block mb-1">
                    DAILY CHECK-IN · DAY {evaluation.day}
                  </span>
                  <h3 className="font-serif font-semibold text-lg text-[#111827] mb-3">
                    Record what you're noticing
                  </h3>

                  <form onSubmit={handleSaveCheckInSubmit} className="flex flex-col gap-4">
                    <div>
                      <label className="block font-mono text-[10px] uppercase text-[#64748B] tracking-wider mb-1.5">
                        OBSERVED CHANGE
                      </label>
                      <div className="grid grid-cols-5 gap-1 bg-[#F0F6FA] p-1 rounded-xl">
                        {[
                          { score: 0 as const, label: '0 Worse' },
                          { score: 1 as const, label: '1 None' },
                          { score: 2 as const, label: '2 Slight' },
                          { score: 3 as const, label: '3 Notice' },
                          { score: 4 as const, label: '4 High' },
                        ].map(s => {
                          const isSelected = checkInScore === s.score;
                          return (
                            <button
                              key={s.score}
                              type="button"
                              onClick={() => setCheckInScore(s.score)}
                              className={`py-2 rounded-lg font-sans text-[10px] font-semibold transition-all cursor-pointer ${
                                isSelected
                                  ? 'bg-[#143461] text-white shadow-2xs'
                                  : 'text-[#64748B] hover:text-[#111827]'
                              }`}
                            >
                              {s.label}
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    <label className="flex items-start gap-2.5 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={irritation}
                        onChange={e => setIrritation(e.target.checked)}
                        className="mt-0.5 rounded border-[#E2E8F0] text-[#005995] focus:ring-[#005995]"
                      />
                      <span className="font-sans text-xs text-[#111827] leading-tight">
                        Report irritation, redness, burning or unusual shedding
                      </span>
                    </label>

                    <div>
                      <label className="block font-mono text-[10px] uppercase text-[#64748B] tracking-wider mb-1">
                        NOTE (OPTIONAL)
                      </label>
                      <textarea
                        rows={2}
                        value={checkInNote}
                        onChange={e => setCheckInNote(e.target.value)}
                        placeholder="e.g. less hair in shower, smoother cheek texture..."
                        className="w-full px-3 py-2 rounded-xl bg-[#FAFBFD] border border-[#E2E8F0] text-xs focus:ring-2 focus:ring-[#005995] outline-none"
                      />
                    </div>

                    <button
                      type="submit"
                      className="w-full py-2.5 px-4 rounded-full bg-[#005995] hover:bg-[#004777] text-white font-sans text-xs font-semibold transition-all shadow-sm cursor-pointer"
                    >
                      Save check-in for Day {evaluation.day} (+40 XP)
                    </button>
                  </form>
                </div>
              </div>

              {/* Action Protocol Checklist */}
              <div className="p-6 rounded-[24px] bg-white border border-[#E2E8F0] shadow-sm flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="font-mono text-[10px] uppercase tracking-widest text-[#005995] font-bold">
                      ACTION PROTOCOL · TAP TO CHECK
                    </span>
                    <span className="text-[11px] font-mono text-[#64748B]">
                      {completedSteps.length}/{evaluation.nextSteps.length}
                    </span>
                  </div>

                  <ul className="flex flex-col gap-2.5">
                    {evaluation.nextSteps.map((step, idx) => {
                      const isStepDone = completedSteps.includes(idx);
                      return (
                        <li
                          key={idx}
                          onClick={() => toggleStepCompleted(idx)}
                          className={`flex items-start gap-2.5 text-xs p-2.5 rounded-xl border transition-all cursor-pointer ${
                            isStepDone
                              ? 'bg-[#EDFCF5] border-[#C5E6D4] text-[#198775] line-through'
                              : 'bg-[#FAFBFD] border-[#E2E8F0] text-[#111827] hover:border-[#005995]'
                          }`}
                        >
                          <span
                            className={`w-4 h-4 rounded-full font-mono text-[10px] font-bold flex items-center justify-center shrink-0 mt-0.5 ${
                              isStepDone ? 'bg-[#005995] text-white' : 'bg-white border border-[#E2E8F0]'
                            }`}
                          >
                            {isStepDone ? '✓' : idx + 1}
                          </span>
                          <span className="leading-relaxed select-none">{step}</span>
                        </li>
                      );
                    })}
                  </ul>
                </div>

                <div className="mt-4 pt-3 border-t border-[#E2E8F0] text-[11px] text-[#64748B]">
                  <span>Current Clinical Phase: </span>
                  <span className="font-semibold text-[#111827]">{evaluation.badgeLabel}</span>
                </div>
              </div>
            </div>

            {/* 3. Check-In History Week by Week with Advisor Guidance */}
            <div className="p-7 rounded-[24px] bg-white border border-[#E2E8F0] shadow-sm">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <span className="font-mono text-[10px] uppercase tracking-widest text-[#005995] font-bold block">
                    TIMELINE PROGRESSION
                  </span>
                  <h3 className="font-serif font-bold text-xl text-[#111827]">
                    Check-in History & Advisor Expectations Week by Week
                  </h3>
                </div>
                <span className="font-mono text-xs text-[#64748B] bg-[#FAFBFD] px-3 py-1 rounded-full border border-[#E2E8F0]">
                  {checkIns.length} check-ins logged
                </span>
              </div>

              <div className="space-y-6">
                {WEEK_MILESTONES.map(wm => {
                  const isCurrentWeek = evaluation.day >= wm.minDay && evaluation.day <= wm.maxDay;
                  const isPastWeek = evaluation.day > wm.maxDay;

                  // Find check-ins that fall within this milestone window
                  const matchingCheckIns = checkIns.filter(ci => {
                    const dayNum = getDayNumberForDate(ci.date);
                    return dayNum >= wm.minDay && dayNum <= wm.maxDay;
                  });

                  return (
                    <div
                      key={wm.weekNum}
                      className={`p-5 rounded-2xl border transition-all ${
                        isCurrentWeek
                          ? 'bg-[#E6F5FF]/40 border-[#005995] ring-2 ring-[#005995]/20'
                          : isPastWeek
                          ? 'bg-white border-[#E2E8F0]'
                          : 'bg-[#F0F6FA]/50 border-transparent opacity-70'
                      }`}
                    >
                      {/* Week Header */}
                      <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                        <div className="flex items-center gap-2.5">
                          <span className="font-serif font-bold text-base text-[#111827]">
                            {wm.label}
                          </span>
                          <span className="font-mono text-[10px] text-[#64748B] uppercase bg-white px-2 py-0.5 rounded-full border border-[#E2E8F0]">
                            {wm.daysRange}
                          </span>
                          {isCurrentWeek && (
                            <span className="px-2 py-0.5 rounded-full bg-[#143461] text-white font-mono text-[9px] uppercase font-bold">
                              CURRENT WEEK
                            </span>
                          )}
                        </div>

                        <span className="font-mono text-[10px] text-[#64748B]">
                          {matchingCheckIns.length} {matchingCheckIns.length === 1 ? 'record' : 'records'}
                        </span>
                      </div>

                      {/* Clinical Advisor Expectation Box */}
                      <div className="p-3.5 rounded-xl bg-white border border-[#E2E8F0] mb-3 text-xs">
                        <span className="font-mono text-[9px] uppercase font-bold tracking-wider text-[#005995] block mb-1">
                          CLINICAL ADVISOR · WHAT SHOULD BE VISIBLE
                        </span>
                        <p className="font-sans text-xs text-[#111827] leading-relaxed">
                          {wm.advisorExpectation}
                        </p>
                      </div>

                      {/* Render recorded check-ins for this week */}
                      {matchingCheckIns.length > 0 ? (
                        <div className="flex flex-col gap-2 pt-1">
                          {matchingCheckIns.map((ci, cIdx) => {
                            const ciDay = getDayNumberForDate(ci.date);
                            const scoreLabel =
                              ci.score === 0 ? 'Worse' : ci.score === 1 ? 'No change' : ci.score === 2 ? 'Slight shift' : ci.score === 3 ? 'Noticeable change' : 'Significant improvement';

                            return (
                              <div
                                key={cIdx}
                                className="p-3 rounded-xl bg-white border border-[#E2E8F0] text-xs flex flex-col gap-1"
                              >
                                <div className="flex items-center justify-between text-[11px]">
                                  <span className="font-semibold text-[#111827]">
                                    Day {ciDay} Observation: <span className="text-[#005995] font-normal">{scoreLabel}</span>
                                  </span>
                                  <span className="font-mono text-[10px] text-[#64748B]">{ci.date}</span>
                                </div>

                                {ci.irritation && (
                                  <span className="text-[10px] text-[#B4492E] font-medium inline-flex items-center gap-1">
                                    <AlertTriangle className="w-3 h-3" />
                                    <span>Irritation reported</span>
                                  </span>
                                )}

                                {ci.note && (
                                  <p className="text-[11px] text-[#64748B] italic leading-relaxed">
                                    "{ci.note}"
                                  </p>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      ) : (
                        <p className="font-sans text-[11px] text-[#64748B] italic px-1">
                          {isPastWeek
                            ? 'No check-ins were recorded during this week.'
                            : isCurrentWeek
                            ? 'Submit a check-in above to record your observation for this week.'
                            : 'Upcoming milestone.'}
                        </p>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
