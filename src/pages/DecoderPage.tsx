import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { Eyebrow } from '../components/Eyebrow';
import { CircularProgressRing } from '../components/CircularProgressRing';
import { CATALOGUE_PRODUCTS } from '../data/catalogue';
import { evaluateShelfItem, generateFallbackAiExplanation, StatusEvaluation } from '../lib/statusEngine';
import { ShelfItem } from '../types';
import { Sparkles, RotateCw, CheckCircle2, AlertTriangle, ArrowRight, Calendar, Plus } from 'lucide-react';

export const DecoderPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { user, saveCheckIn, completeWeeklyDecoderMission, todayStr, addToast } = useApp();

  const shelf = user?.shelf || [];

  // Selected item ID from URL query ?item= or default to first shelf item
  const selectedItemId = searchParams.get('item') || (shelf[0]?.id || '');

  const selectedItem: ShelfItem | undefined = shelf.find(s => s.id === selectedItemId) || shelf[0];

  // Weekly check-in form state
  const [checkInScore, setCheckInScore] = useState<0 | 1 | 2 | 3 | 4>(1);
  const [irritation, setIrritation] = useState<boolean>(false);
  const [checkInNote, setCheckInNote] = useState<string>('');

  // AI explanation state
  const [aiExplanation, setAiExplanation] = useState<string>('');
  const [aiLoading, setAiLoading] = useState<boolean>(false);

  // Interactive Before/After Split comparison state
  const [splitSliderPos, setSplitSliderPos] = useState<number>(50);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);

  const toggleStepCompleted = (idx: number) => {
    if (completedSteps.includes(idx)) {
      setCompletedSteps(completedSteps.filter(i => i !== idx));
    } else {
      setCompletedSteps([...completedSteps, idx]);
    }
  };

  // Sync search param when selecting an item
  const handleSelectItem = (id: string) => {
    setSearchParams({ item: id });
  };

  const evaluation: StatusEvaluation | null = selectedItem
    ? evaluateShelfItem(selectedItem, todayStr)
    : null;

  // Load AI explanation whenever selected item changes
  const fetchAiExplanation = async () => {
    if (!selectedItem || !evaluation) return;
    setAiLoading(true);

    const productName = evaluation.product?.name || selectedItem.manual?.name || 'Active Formulation';
    const category = evaluation.product?.category || selectedItem.manual?.category || 'skin';
    const actives = evaluation.product?.actives || selectedItem.manual?.actives || [];

    try {
      const res = await fetch('/api/decoder/explain', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productName,
          category,
          actives,
          day: evaluation.day,
          consistency: evaluation.consistency,
          status: evaluation.status,
          checkInHistory: selectedItem.checkIns || [],
          timeline: evaluation.product?.timeline,
        }),
      });

      const data = await res.json();
      if (data && data.explanation && !data.fallback) {
        setAiExplanation(data.explanation);
      } else {
        // Fallback to deterministic medical-grade clinical template
        setAiExplanation(generateFallbackAiExplanation(evaluation, selectedItem));
      }
      completeWeeklyDecoderMission();
    } catch (e) {
      // Fallback
      setAiExplanation(generateFallbackAiExplanation(evaluation, selectedItem));
      completeWeeklyDecoderMission();
    } finally {
      setAiLoading(false);
    }
  };

  useEffect(() => {
    if (selectedItem) {
      fetchAiExplanation();
    }
  }, [selectedItem?.id]);

  const handleSaveCheckInSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedItem) return;

    saveCheckIn(selectedItem.id, {
      score: checkInScore,
      irritation,
      note: checkInNote.trim() || undefined,
    });

    setCheckInNote('');
    // Refresh explanation after check in
    setTimeout(() => {
      fetchAiExplanation();
    }, 200);
  };

  if (!shelf || shelf.length === 0) {
    return (
      <div className="w-full max-w-[1280px] mx-auto px-5 sm:px-8 py-16 text-center">
        <div className="max-w-md mx-auto bg-white rounded-3xl p-10 border border-[#E9E4D8] shadow-sm">
          <Eyebrow className="mb-2">11 · PERSONAL RESULTS DECODER</Eyebrow>
          <h2 className="font-serif font-bold text-2xl text-[#172319] mb-3">
            No products on your shelf yet
          </h2>
          <p className="font-sans text-sm text-[#6B6F66] mb-6">
            Add a product with its start date to unlock its verified biological timeline and honest status evaluation.
          </p>
          <Link
            to="/shelf"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#172319] text-white text-xs font-semibold hover:bg-[#2C5044] transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Go to My Shelf</span>
          </Link>
        </div>
      </div>
    );
  }

  const productName = evaluation?.product?.name || selectedItem?.manual?.name || 'Selected Product';

  return (
    <div className="w-full max-w-[1280px] mx-auto px-5 sm:px-8 py-10 md:py-14">
      {/* Header */}
      <div className="max-w-2xl mb-10">
        <Eyebrow className="mb-2">11 · PERSONAL RESULTS DECODER</Eyebrow>
        <h1 className="font-serif font-medium text-3xl sm:text-4xl text-[#172319] leading-tight">
          Is it working? Here's the <span className="italic font-normal text-[#A46F39]">honest</span> answer.
        </h1>
        <p className="font-sans text-sm sm:text-base text-[#6B6F66] mt-2 leading-relaxed">
          Your start date + the product's verified timeline + your consistency + your own check-ins, decoded into one clear status.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Shelf List */}
        <div className="lg:col-span-4 flex flex-col gap-3">
          <span className="font-mono text-[10px] uppercase tracking-widest text-[#6B6F66] font-bold block mb-1">
            PRODUCTS ON MY SHELF ({shelf.length})
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
                    ? 'bg-white border-2 border-[#172319] shadow-md -translate-y-0.5'
                    : 'bg-white/80 border border-[#E9E4D8] hover:bg-white hover:border-[#A46F39]/50'
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <CircularProgressRing day={evalItem.day} size={42} strokeWidth={3} />
                  <div className="min-w-0">
                    <h4 className="font-serif font-semibold text-xs sm:text-sm text-[#172319] truncate">
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
                    isSelected ? 'text-[#172319] translate-x-1' : 'text-[#6B6F66]/40'
                  }`}
                />
              </button>
            );
          })}
        </div>

        {/* Right Column: Verdict Card + Check-ins + AI Explanation */}
        {evaluation && selectedItem && (
          <div className="lg:col-span-8 flex flex-col gap-6">
            {/* 1. Main Verdict Card */}
            <div className="p-7 sm:p-9 rounded-[24px] bg-white border border-[#E9E4D8] shadow-sm">
              {/* Status Chip + Mono Name */}
              <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
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

                <span className="font-mono text-[10px] uppercase tracking-wider text-[#6B6F66] font-semibold">
                  {productName}
                </span>
              </div>

              {/* Big Serif Quote Headline */}
              <h2 className="font-serif font-medium text-2xl sm:text-3xl lg:text-4xl text-[#172319] leading-tight mb-4">
                "{evaluation.headline}"
              </h2>

              {/* Explanation Paragraph */}
              <p className="font-sans text-sm sm:text-base text-[#6B6F66] leading-relaxed mb-8 max-w-2xl">
                {evaluation.explanation}
              </p>

              {/* Three Stat Numerals */}
              <div className="pt-6 border-t border-[#E9E4D8] grid grid-cols-3 gap-4">
                <div>
                  <p className="font-serif font-bold text-3xl sm:text-4xl text-[#172319]">
                    {evaluation.day}
                  </p>
                  <p className="font-mono text-[10px] sm:text-[11px] uppercase tracking-wider text-[#6B6F66] mt-1 font-semibold">
                    DAY ON PRODUCT
                  </p>
                </div>

                <div>
                  <p className="font-serif font-bold text-3xl sm:text-4xl text-[#172319]">
                    {evaluation.consistency}%
                  </p>
                  <p className="font-mono text-[10px] sm:text-[11px] uppercase tracking-wider text-[#6B6F66] mt-1 font-semibold">
                    CONSISTENCY
                  </p>
                </div>

                <div>
                  <p className="font-serif font-bold text-3xl sm:text-4xl text-[#172319]">
                    {evaluation.loggedUses}/{evaluation.expectedUses}
                  </p>
                  <p className="font-mono text-[10px] sm:text-[11px] uppercase tracking-wider text-[#6B6F66] mt-1 font-semibold">
                    USES · 28 DAYS
                  </p>
                </div>
              </div>
            </div>

            {/* Interactive Before & After Visual Progression Split Card */}
            <div className="p-6 sm:p-7 rounded-[24px] bg-white border border-[#E9E4D8] shadow-sm">
              <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
                <div>
                  <span className="font-mono text-[10px] uppercase tracking-widest text-[#A46F39] font-bold block">
                    BIOLOGICAL PROGRESSION VISUALIZER
                  </span>
                  <h3 className="font-serif font-bold text-lg text-[#172319]">
                    Day 1 Baseline vs. Day 90 Clinical Transformation
                  </h3>
                </div>
                <div className="font-mono text-xs text-[#6B6F66] bg-[#F5F1E8] px-3 py-1 rounded-full">
                  Scrub to compare: {splitSliderPos}%
                </div>
              </div>

              {/* Split view frame */}
              <div className="relative w-full h-56 sm:h-64 rounded-2xl overflow-hidden select-none border border-[#E9E4D8] bg-[#F0EBE1]">
                {/* Background image: After/Transformation */}
                <img
                  src={evaluation.product?.image || 'https://images.unsplash.com/photo-1617897903246-719242758050?auto=format&fit=crop&w=800&q=80'}
                  alt="Day 90 Target State"
                  className="absolute inset-0 w-full h-full object-cover filter brightness-105 contrast-105"
                />
                <div className="absolute top-3 right-3 px-3 py-1 rounded-full bg-[#172319]/80 backdrop-blur-md text-white font-mono text-[10px] uppercase tracking-wider font-bold">
                  Day 90 (Projected Target)
                </div>

                {/* Foreground clipped image: Day 1 Baseline */}
                <div
                  className="absolute inset-y-0 left-0 overflow-hidden"
                  style={{ width: `${splitSliderPos}%` }}
                >
                  <img
                    src="https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=800&q=80"
                    alt="Day 1 Baseline"
                    className="absolute inset-0 w-full h-full object-cover max-w-none filter grayscale-[30%] brightness-95"
                    style={{ width: '100%', height: '100%', minWidth: '600px' }}
                  />
                  <div className="absolute top-3 left-3 px-3 py-1 rounded-full bg-[#A46F39]/90 backdrop-blur-md text-white font-mono text-[10px] uppercase tracking-wider font-bold">
                    Day 1 (Baseline)
                  </div>
                </div>

                {/* Vertical Divider Line with Knob */}
                <div
                  className="absolute inset-y-0 w-0.5 bg-white shadow-lg pointer-events-none"
                  style={{ left: `${splitSliderPos}%` }}
                >
                  <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-7 h-7 rounded-full bg-white text-[#172319] shadow-md border-2 border-[#172319] flex items-center justify-center text-xs font-bold font-mono">
                    ↔
                  </div>
                </div>

                {/* Range input overlay for smooth scrubbing */}
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={splitSliderPos}
                  onChange={e => setSplitSliderPos(Number(e.target.value))}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-ew-resize z-20"
                  aria-label="Drag before and after split slider"
                />
              </div>

              <p className="font-sans text-xs text-[#6B6F66] mt-3">
                Drag slider to inspect how clinical active consistency bridges Day 1 baseline with Day 90 cellular transformation.
              </p>
            </div>

            {/* 2. Side-by-Side: Next Steps & Weekly Check-in */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Next Steps & Check-in History */}
              <div className="p-6 sm:p-7 rounded-[24px] bg-white border border-[#E9E4D8] shadow-sm flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="font-mono text-[10px] uppercase tracking-widest text-[#A46F39] font-bold">
                      NEXT STEPS · TAP TO COMPLETE
                    </span>
                    <span className="text-[11px] font-mono text-[#6B6F66]">
                      {completedSteps.length}/{evaluation.nextSteps.length}
                    </span>
                  </div>

                  <ul className="flex flex-col gap-2.5 mb-6">
                    {evaluation.nextSteps.map((step, idx) => {
                      const isStepDone = completedSteps.includes(idx);
                      return (
                        <li
                          key={idx}
                          onClick={() => toggleStepCompleted(idx)}
                          className={`flex items-start gap-2.5 text-xs p-2.5 rounded-xl border transition-all cursor-pointer ${
                            isStepDone
                              ? 'bg-[#E8F1EC] border-[#C5E6D4] text-[#2C5044] line-through'
                              : 'bg-[#FAF7F0] border-[#E9E4D8] text-[#172319] hover:border-[#A46F39]'
                          }`}
                        >
                          <span
                            className={`w-4 h-4 rounded-full font-mono text-[10px] font-bold flex items-center justify-center shrink-0 mt-0.5 ${
                              isStepDone ? 'bg-[#2C5044] text-white' : 'bg-white border border-[#E9E4D8]'
                            }`}
                          >
                            {isStepDone ? '✓' : idx + 1}
                          </span>
                          <span className="leading-relaxed select-none">{step}</span>
                        </li>
                      );
                    })}
                  </ul>

                  {/* History */}
                  <span className="font-mono text-[10px] uppercase tracking-widest text-[#6B6F66] font-bold block mb-2 pt-4 border-t border-[#E9E4D8]">
                    CHECK-IN HISTORY
                  </span>
                  <div className="flex flex-col gap-2 max-h-36 overflow-y-auto pr-1">
                    {(selectedItem.checkIns || []).length === 0 ? (
                      <p className="font-sans text-xs text-[#6B6F66] italic">
                        No check-ins recorded yet.
                      </p>
                    ) : (
                      (selectedItem.checkIns || []).map((ci, cIdx) => (
                        <div key={cIdx} className="text-xs bg-[#FAF7F0] p-2.5 rounded-xl border border-[#E9E4D8]">
                          <div className="flex items-center justify-between text-[11px] mb-1">
                            <span className="font-semibold text-[#172319]">
                              📍 Day {ci.date === todayStr ? evaluation.day : 'Check-in'} — {
                                ci.score === 0 ? 'Worse' : ci.score === 1 ? 'No change' : ci.score === 2 ? 'Slight shift' : ci.score === 3 ? 'Noticeable change' : 'Significant'
                              }
                            </span>
                            <span className="font-mono text-[10px] text-[#6B6F66]">{ci.date}</span>
                          </div>
                          {ci.irritation && (
                            <p className="text-[10px] text-[#B4492E] font-medium mb-1">
                              ⚠️ Irritation reported
                            </p>
                          )}
                          {ci.note && (
                            <p className="text-[11px] text-[#6B6F66] italic leading-tight">
                              "{ci.note}"
                            </p>
                          )}
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>

              {/* Weekly Check-in Form */}
              <div className="p-6 sm:p-7 rounded-[24px] bg-white border border-[#E9E4D8] shadow-sm">
                <span className="font-mono text-[10px] uppercase tracking-widest text-[#A46F39] font-bold block mb-1">
                  WEEKLY CHECK-IN · +40 XP
                </span>
                <h3 className="font-serif font-semibold text-lg text-[#172319] mb-4">
                  What are you seeing?
                </h3>

                <form onSubmit={handleSaveCheckInSubmit} className="flex flex-col gap-4">
                  {/* 5-segment scale */}
                  <div>
                    <label className="block font-mono text-[10px] uppercase text-[#6B6F66] tracking-wider mb-2">
                      OBSERVED CHANGE
                    </label>
                    <div className="grid grid-cols-5 gap-1 bg-[#F5F1E8] p-1 rounded-xl">
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
                            className={`py-2 rounded-lg font-sans text-[11px] font-semibold transition-all cursor-pointer ${
                              isSelected
                                ? 'bg-[#172319] text-white shadow-2xs'
                                : 'text-[#6B6F66] hover:text-[#172319]'
                            }`}
                          >
                            {s.label}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Irritation Checkbox */}
                  <label className="flex items-start gap-2.5 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={irritation}
                      onChange={e => setIrritation(e.target.checked)}
                      className="mt-0.5 rounded border-[#E9E4D8] text-[#A46F39] focus:ring-[#A46F39]"
                    />
                    <span className="font-sans text-xs text-[#172319] leading-tight">
                      I've had irritation, redness, burning or unusual shedding
                    </span>
                  </label>

                  {/* Note textarea */}
                  <div>
                    <label className="block font-mono text-[10px] uppercase text-[#6B6F66] tracking-wider mb-1">
                      NOTE (OPTIONAL)
                    </label>
                    <textarea
                      rows={2}
                      value={checkInNote}
                      onChange={e => setCheckInNote(e.target.value)}
                      placeholder="e.g. less hair in the shower drain, or calmer cheek redness"
                      className="w-full px-3 py-2 rounded-xl bg-[#FAF7F0] border border-[#E9E4D8] text-xs focus:ring-2 focus:ring-[#A46F39] outline-none"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-2.5 px-4 rounded-full bg-[#A46F39] hover:bg-[#8F5E2D] text-white font-sans text-xs font-semibold transition-all shadow-sm cursor-pointer"
                  >
                    Save check-in
                  </button>
                </form>
              </div>
            </div>

            {/* 3. Personalised Explanation (Full-width Dark Ink Card) */}
            <div className="p-7 sm:p-9 rounded-[28px] bg-[#172319] text-white border border-[#2E3E33] shadow-xl relative overflow-hidden">
              <div className="flex items-center justify-between gap-4 mb-4">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-[#E29D52]" />
                  <span className="font-mono text-[10px] uppercase tracking-[0.2em] font-semibold text-[#E29D52]">
                    PERSONALISED EXPLANATION · CLINICAL AI
                  </span>
                </div>

                <button
                  type="button"
                  onClick={fetchAiExplanation}
                  disabled={aiLoading}
                  className="inline-flex items-center gap-1.5 text-xs text-white/60 hover:text-white transition-colors cursor-pointer"
                >
                  <RotateCw className={`w-3.5 h-3.5 ${aiLoading ? 'animate-spin' : ''}`} />
                  <span>Regenerate</span>
                </button>
              </div>

              {aiLoading ? (
                <div className="space-y-3 py-4 animate-pulse">
                  <div className="h-4 bg-white/10 rounded-md w-full" />
                  <div className="h-4 bg-white/10 rounded-md w-5/6" />
                  <div className="h-4 bg-white/10 rounded-md w-4/6" />
                  <div className="h-4 bg-white/10 rounded-md w-full pt-2" />
                  <div className="h-4 bg-white/10 rounded-md w-3/4" />
                </div>
              ) : (
                <div className="font-sans text-sm sm:text-base text-white/80 leading-relaxed space-y-4">
                  {aiExplanation.split('\n\n').map((paragraph, pIdx) => (
                    <p key={pIdx}>{paragraph}</p>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
