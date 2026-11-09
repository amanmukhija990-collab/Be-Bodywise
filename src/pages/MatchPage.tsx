import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { Eyebrow } from '../components/Eyebrow';
import { Category, MatchAnswers } from '../types';
import { calculateProductMatches, MatchResult } from '../lib/matchEngine';
import { CATALOGUE_PRODUCTS } from '../data/catalogue';
import { Check, ArrowRight, ArrowLeft, RotateCcw, FlaskConical, Sparkles, Plus } from 'lucide-react';

export const MatchPage: React.FC = () => {
  const { user, completeProductMatch, addProductToShelf, addToast } = useApp();
  const navigate = useNavigate();

  // Load existing match or start fresh wizard
  const [showResults, setShowResults] = useState<boolean>(() => {
    return !!(user?.matchAnswers && user?.matchResults && user.matchResults.length > 0);
  });

  const [step, setStep] = useState<number>(1);

  // Form State
  const [selectedFocus, setSelectedFocus] = useState<Category[]>(['hair', 'skin']);
  const [skinType, setSkinType] = useState<string>('Combination');
  const [concerns, setConcerns] = useState<string[]>(['Dandruff & itchy scalp', 'Open pores & oiliness']);
  const [reactivity, setReactivity] = useState<string>('Rarely reacts');
  const [commitment, setCommitment] = useState<'minimal' | 'balanced' | 'complete'>('balanced');

  const [matchResults, setMatchResults] = useState<MatchResult[]>([]);

  // If user already had results, compute them
  useEffect(() => {
    if (user?.matchAnswers) {
      const results = calculateProductMatches(user.matchAnswers);
      setMatchResults(results);
    }
  }, [user]);

  const toggleFocus = (cat: Category) => {
    if (selectedFocus.includes(cat)) {
      if (selectedFocus.length > 1) {
        setSelectedFocus(selectedFocus.filter(c => c !== cat));
      }
    } else {
      setSelectedFocus([...selectedFocus, cat]);
    }
  };

  const toggleConcern = (concern: string) => {
    if (concerns.includes(concern)) {
      setConcerns(concerns.filter(c => c !== concern));
    } else {
      setConcerns([...concerns, concern]);
    }
  };

  const handleNext = () => {
    if (step === 1) {
      if (selectedFocus.includes('skin')) {
        setStep(2);
      } else {
        // Skip skin type step if skin wasn't selected
        setStep(3);
      }
    } else if (step === 2) {
      setStep(3);
    } else if (step === 3) {
      setStep(4);
    } else if (step === 4) {
      const answers: MatchAnswers = {
        focus: selectedFocus,
        skinType: selectedFocus.includes('skin') ? skinType : undefined,
        concerns,
        reactivity,
        commitment,
      };
      const results = calculateProductMatches(answers);
      setMatchResults(results);
      completeProductMatch(answers, results.map(r => r.product.id));
      setShowResults(true);
    }
  };

  const handleBack = () => {
    if (step === 4) {
      setStep(3);
    } else if (step === 3) {
      if (selectedFocus.includes('skin')) {
        setStep(2);
      } else {
        setStep(1);
      }
    } else if (step === 2) {
      setStep(1);
    }
  };

  const handleRetake = () => {
    setShowResults(false);
    setStep(1);
  };

  const isStepValid = () => {
    if (step === 1) return selectedFocus.length > 0;
    if (step === 2) return !!skinType;
    if (step === 3) return concerns.length > 0;
    if (step === 4) return !!reactivity && !!commitment;
    return true;
  };

  const handleAddShelf = (result: MatchResult) => {
    const isAlreadyOnShelf = user?.shelf.some(s => s.productId === result.product.id);
    if (isAlreadyOnShelf) {
      addToast('Already on shelf', `${result.product.name} is actively tracked on your shelf.`);
      return;
    }

    addProductToShelf(
      result.product.id,
      undefined,
      undefined,
      result.product.usage.when,
      result.product.usage.frequency,
      result.product.usage.instructions
    );

    addToast(
      `${result.product.name} added to My Shelf`,
      'Day 1 starts today on your 90-day verified timeline',
      'success'
    );
  };

  // RESULTS VIEW
  if (showResults) {
    return (
      <div className="w-full max-w-[1280px] mx-auto px-5 sm:px-8 py-10 md:py-14">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <Eyebrow className="mb-2">02 · PERSONAL PRODUCT MATCH</Eyebrow>
            <h1 className="font-serif font-medium text-3xl sm:text-4xl text-[#172319] leading-tight">
              Your formulas, <span className="italic font-normal text-[#A46F39]">matched.</span>
            </h1>
            <p className="font-sans text-sm sm:text-base text-[#6B6F66] mt-2 max-w-2xl leading-relaxed">
              Ranked for your profile, with the honest reason each one belongs in your routine.
            </p>
          </div>

          <button
            onClick={handleRetake}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-[#E9E4D8] bg-white hover:bg-[#F5F1E8] text-xs font-semibold text-[#172319] transition-all self-start sm:self-auto cursor-pointer shadow-2xs"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Retake assessment</span>
          </button>
        </div>

        {/* Profile Chips Summary */}
        <div className="flex flex-wrap items-center gap-2 mb-8">
          {selectedFocus.map(f => (
            <span
              key={f}
              className="px-3.5 py-1.5 rounded-full bg-[#172319] text-white font-sans text-xs font-medium capitalize"
            >
              {f}
            </span>
          ))}
          {selectedFocus.includes('skin') && (
            <span className="px-3.5 py-1.5 rounded-full border border-[#E9E4D8] bg-white text-[#172319] font-sans text-xs font-medium">
              {skinType} Skin
            </span>
          )}
          {concerns.slice(0, 3).map(c => (
            <span
              key={c}
              className="px-3.5 py-1.5 rounded-full border border-[#E9E4D8] bg-white text-[#6B6F66] font-sans text-xs"
            >
              {c}
            </span>
          ))}
        </div>

        {/* Ranked Match Cards */}
        <div className="flex flex-col gap-6">
          {matchResults.map((result, idx) => {
            const isBestMatch = idx === 0;
            const isOnShelf = user?.shelf.some(s => s.productId === result.product.id);

            return (
              <div
                key={result.product.id}
                className="p-6 sm:p-8 rounded-[24px] bg-white border border-[#E9E4D8] shadow-sm hover:shadow-md transition-all flex flex-col md:flex-row gap-6 sm:gap-8 relative overflow-hidden"
              >
                {/* Product Image */}
                <div className="w-full md:w-56 h-56 shrink-0 rounded-2xl overflow-hidden relative bg-[#F0EBE1]">
                  <img
                    src={result.product.image}
                    alt={result.product.name}
                    className="w-full h-full object-cover"
                  />
                  {isBestMatch && (
                    <div className="absolute top-3 left-3 px-3 py-1 rounded-full bg-[#172319] text-white font-mono text-[9px] uppercase tracking-wider font-bold shadow-md">
                      BEST MATCH
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    {/* Eyebrow & Match % */}
                    <div className="flex items-start justify-between gap-4 mb-2">
                      <span className="font-mono text-[10px] uppercase tracking-widest text-[#6B6F66] font-semibold">
                        {result.product.category} {result.product.sizeMl ? `· ${result.product.sizeMl} ML` : ''} · ₹{result.product.price}
                      </span>
                      <div className="text-right">
                        <span className="font-serif font-bold text-2xl text-[#172319]">
                          {result.score}%
                        </span>
                        <span className="font-mono text-[9px] uppercase tracking-widest text-[#6B6F66] block">
                          MATCH
                        </span>
                      </div>
                    </div>

                    {/* Product Name & Tagline */}
                    <h3 className="font-serif font-semibold text-xl sm:text-2xl text-[#172319] leading-snug mb-1">
                      {result.product.name}
                    </h3>
                    <p className="font-sans text-xs sm:text-sm text-[#6B6F66] mb-3">
                      {result.product.tagline}
                    </p>

                    {/* Thin progress bar sized to % */}
                    <div className="w-full h-1 bg-[#E9E4D8] rounded-full overflow-hidden mb-5">
                      <div
                        className="h-full bg-[#2C5044] rounded-full"
                        style={{ width: `${result.score}%` }}
                      />
                    </div>

                    {/* Why this suits you */}
                    <div className="p-4 rounded-xl bg-[#FAF7F0] border border-[#E9E4D8] mb-6">
                      <span className="font-mono text-[10px] uppercase tracking-widest text-[#A46F39] font-bold block mb-2.5">
                        WHY THIS SUITS YOU
                      </span>
                      <ul className="flex flex-col gap-2">
                        {result.whyThisSuitsYou.map((bullet, bIdx) => (
                          <li key={bIdx} className="flex items-start gap-2 text-xs text-[#172319] font-sans">
                            <Check className="w-3.5 h-3.5 text-[#2C5044] shrink-0 mt-0.5" />
                            <span>{bullet}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-wrap items-center gap-3 pt-2">
                    <button
                      onClick={() => navigate(`/routine-test?product=${result.product.slug}`)}
                      className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full border border-[#E9E4D8] hover:border-[#172319] bg-white text-xs font-semibold text-[#172319] transition-all cursor-pointer shadow-2xs"
                    >
                      <FlaskConical className="w-3.5 h-3.5 text-[#A46F39]" />
                      <span>Routine test first</span>
                    </button>

                    {isOnShelf ? (
                      <span className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-full bg-[#E8F1EC] text-[#2C5044] text-xs font-semibold shadow-2xs">
                        <Check className="w-3.5 h-3.5" />
                        <span>On your shelf</span>
                      </span>
                    ) : (
                      <button
                        onClick={() => handleAddShelf(result)}
                        className="inline-flex items-center gap-1.5 px-6 py-2.5 rounded-full bg-[#A46F39] hover:bg-[#8F5E2D] text-white text-xs font-semibold transition-all shadow-sm hover:-translate-y-0.5 cursor-pointer"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>I own it — add to shelf</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  // WIZARD VIEW
  const stepsList = [
    { num: 1, label: 'Focus' },
    { num: 2, label: 'Skin type' },
    { num: 3, label: 'Concerns' },
    { num: 4, label: 'Your routine' },
  ];

  return (
    <div className="w-full max-w-[1280px] mx-auto px-5 sm:px-8 py-10 md:py-14">
      {/* Header */}
      <div className="max-w-2xl mb-10">
        <Eyebrow className="mb-2">02 · PERSONAL PRODUCT MATCH</Eyebrow>
        <h1 className="font-serif font-medium text-3xl sm:text-4xl text-[#172319] leading-tight">
          Find what truly <span className="italic font-normal text-[#A46F39]">suits you.</span>
        </h1>
        <p className="font-sans text-sm sm:text-base text-[#6B6F66] mt-2 leading-relaxed">
          Four quick questions. We filter the catalogue down to what suits your hair, skin and body — before you spend a rupee.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left: Stepper */}
        <div className="lg:col-span-3 flex lg:flex-col gap-3 overflow-x-auto pb-2 lg:pb-0">
          {stepsList.map(s => {
            const isActive = step === s.num;
            const isCompleted = step > s.num;
            const isSkipped = s.num === 2 && !selectedFocus.includes('skin');

            return (
              <div
                key={s.num}
                className={`flex items-center gap-3 px-4 py-3 rounded-full transition-all shrink-0 ${
                  isActive ? 'bg-white shadow-sm border border-[#E9E4D8]' : 'opacity-70'
                }`}
              >
                <div
                  className={`w-7 h-7 rounded-full flex items-center justify-center font-mono text-xs font-bold ${
                    isCompleted
                      ? 'bg-[#2C5044] text-white'
                      : isActive
                      ? 'bg-[#A46F39] text-white'
                      : 'bg-[#E9E4D8] text-[#6B6F66]'
                  }`}
                >
                  {isCompleted ? <Check className="w-3.5 h-3.5" /> : s.num}
                </div>
                <span className={`font-sans text-xs font-medium ${isActive ? 'text-[#172319]' : 'text-[#6B6F66]'}`}>
                  {s.label} {isSkipped ? '(skipped)' : ''}
                </span>
              </div>
            );
          })}
        </div>

        {/* Right: Large White Wizard Card */}
        <div className="lg:col-span-9 bg-white border border-[#E9E4D8] rounded-[24px] p-6 sm:p-10 shadow-sm flex flex-col justify-between min-h-[480px]">
          <div>
            {/* Card Header */}
            <span className="font-mono text-[10px] uppercase tracking-widest text-[#A46F39] font-bold block mb-2">
              STEP {step} OF 4
            </span>

            {/* Step 1: Focus */}
            {step === 1 && (
              <div>
                <h2 className="font-serif font-medium text-2xl text-[#172319] mb-1">
                  What would you like to work on?
                </h2>
                <p className="font-sans text-xs sm:text-sm text-[#6B6F66] mb-6">
                  Pick one or more categories.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {[
                    { id: 'hair' as Category, title: 'Hair', desc: 'Fall, thinning, dandruff, frizz' },
                    { id: 'skin' as Category, title: 'Skin', desc: 'Acne, pores, spots, dryness' },
                    { id: 'body' as Category, title: 'Body', desc: 'Body acne, underarms, legs' },
                  ].map(item => {
                    const isSelected = selectedFocus.includes(item.id);
                    return (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => toggleFocus(item.id)}
                        className={`p-5 rounded-2xl border text-left transition-all relative cursor-pointer ${
                          isSelected
                            ? 'border-[#A46F39] bg-[#FFF9F2] shadow-sm'
                            : 'border-[#E9E4D8] hover:border-[#A46F39]/50'
                        }`}
                      >
                        {isSelected && (
                          <div className="absolute top-4 right-4 w-5 h-5 rounded-full bg-[#A46F39] text-white flex items-center justify-center">
                            <Check className="w-3.5 h-3.5" />
                          </div>
                        )}
                        <h3 className="font-serif font-semibold text-lg text-[#172319] mb-1">
                          {item.title}
                        </h3>
                        <p className="font-sans text-xs text-[#6B6F66] leading-relaxed">
                          {item.desc}
                        </p>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Step 2: Skin Type */}
            {step === 2 && (
              <div>
                <h2 className="font-serif font-medium text-2xl text-[#172319] mb-1">
                  What's your skin type?
                </h2>
                <p className="font-sans text-xs sm:text-sm text-[#6B6F66] mb-6">
                  Helps us calibrate active concentration and formulation base.
                </p>

                <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                  {['Dry', 'Oily', 'Combination', 'Normal', 'Sensitive'].map(st => {
                    const isSelected = skinType === st;
                    return (
                      <button
                        key={st}
                        type="button"
                        onClick={() => setSkinType(st)}
                        className={`py-4 px-3 rounded-2xl border text-center font-sans text-sm font-semibold transition-all cursor-pointer ${
                          isSelected
                            ? 'border-[#A46F39] bg-[#FFF9F2] text-[#172319] shadow-xs'
                            : 'border-[#E9E4D8] text-[#6B6F66] hover:border-[#172319]'
                        }`}
                      >
                        {st}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Step 3: Concerns */}
            {step === 3 && (
              <div>
                <h2 className="font-serif font-medium text-2xl text-[#172319] mb-1">
                  What's bothering you most?
                </h2>
                <p className="font-sans text-xs sm:text-sm text-[#6B6F66] mb-6">
                  Choose every concern that applies across your selected categories.
                </p>

                <div className="flex flex-col gap-5">
                  {selectedFocus.includes('hair') && (
                    <div>
                      <span className="font-mono text-[10px] uppercase tracking-wider text-[#A46F39] font-bold block mb-2">
                        HAIR
                      </span>
                      <div className="flex flex-wrap gap-2">
                        {['Hair fall', 'Thinning / low density', 'Dandruff & itchy scalp', 'Frizz & dryness'].map(c => {
                          const isSelected = concerns.includes(c);
                          return (
                            <button
                              key={c}
                              type="button"
                              onClick={() => toggleConcern(c)}
                              className={`px-4 py-2 rounded-full text-xs font-medium transition-all cursor-pointer ${
                                isSelected
                                  ? 'bg-[#172319] text-white shadow-xs'
                                  : 'bg-[#F0EBE1] text-[#172319] hover:bg-[#E9E4D8]'
                              }`}
                            >
                              {c}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {selectedFocus.includes('skin') && (
                    <div>
                      <span className="font-mono text-[10px] uppercase tracking-wider text-[#A46F39] font-bold block mb-2">
                        SKIN
                      </span>
                      <div className="flex flex-wrap gap-2">
                        {[
                          'Acne & breakouts',
                          'Open pores & oiliness',
                          'Pigmentation & dark spots',
                          'Dullness & uneven tone',
                          'Dryness & weak barrier',
                        ].map(c => {
                          const isSelected = concerns.includes(c);
                          return (
                            <button
                              key={c}
                              type="button"
                              onClick={() => toggleConcern(c)}
                              className={`px-4 py-2 rounded-full text-xs font-medium transition-all cursor-pointer ${
                                isSelected
                                  ? 'bg-[#172319] text-white shadow-xs'
                                  : 'bg-[#F0EBE1] text-[#172319] hover:bg-[#E9E4D8]'
                              }`}
                            >
                              {c}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {selectedFocus.includes('body') && (
                    <div>
                      <span className="font-mono text-[10px] uppercase tracking-wider text-[#A46F39] font-bold block mb-2">
                        BODY
                      </span>
                      <div className="flex flex-wrap gap-2">
                        {['Body acne', 'Underarm darkness', 'Rough / bumpy skin', 'Leg dryness'].map(c => {
                          const isSelected = concerns.includes(c);
                          return (
                            <button
                              key={c}
                              type="button"
                              onClick={() => toggleConcern(c)}
                              className={`px-4 py-2 rounded-full text-xs font-medium transition-all cursor-pointer ${
                                isSelected
                                  ? 'bg-[#172319] text-white shadow-xs'
                                  : 'bg-[#F0EBE1] text-[#172319] hover:bg-[#E9E4D8]'
                              }`}
                            >
                              {c}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Step 4: Routine commitment & reactivity */}
            {step === 4 && (
              <div>
                <h2 className="font-serif font-medium text-2xl text-[#172319] mb-1">
                  Tell us about your routine
                </h2>
                <p className="font-sans text-xs sm:text-sm text-[#6B6F66] mb-6">
                  Set tolerance and commitment so we don't recommend overload.
                </p>

                <div className="flex flex-col gap-6">
                  <div>
                    <span className="font-mono text-[10px] uppercase tracking-wider text-[#A46F39] font-bold block mb-2">
                      HOW REACTIVE IS YOUR SKIN TO NEW ACTIVES?
                    </span>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      {['Rarely reacts', 'Sometimes reacts', 'Reacts easily'].map(r => {
                        const isSelected = reactivity === r;
                        return (
                          <button
                            key={r}
                            type="button"
                            onClick={() => setReactivity(r)}
                            className={`p-3.5 rounded-xl border text-center font-sans text-xs font-semibold transition-all cursor-pointer ${
                              isSelected
                                ? 'border-[#A46F39] bg-[#FFF9F2] text-[#172319] shadow-xs'
                                : 'border-[#E9E4D8] text-[#6B6F66] hover:border-[#172319]'
                            }`}
                          >
                            {r}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div>
                    <span className="font-mono text-[10px] uppercase tracking-wider text-[#A46F39] font-bold block mb-2">
                      HOW MANY PRODUCTS DO YOU WANT TO COMMIT TO?
                    </span>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      {[
                        { id: 'minimal' as const, label: 'Minimal', sub: 'Top 3 essentials' },
                        { id: 'balanced' as const, label: 'Balanced', sub: '4 targeted products' },
                        { id: 'complete' as const, label: 'Complete', sub: 'Up to 6 products' },
                      ].map(c => {
                        const isSelected = commitment === c.id;
                        return (
                          <button
                            key={c.id}
                            type="button"
                            onClick={() => setCommitment(c.id)}
                            className={`p-4 rounded-xl border text-left transition-all cursor-pointer ${
                              isSelected
                                ? 'border-[#A46F39] bg-[#FFF9F2] shadow-xs'
                                : 'border-[#E9E4D8] hover:border-[#172319]'
                            }`}
                          >
                            <p className="font-serif font-bold text-sm text-[#172319]">{c.label}</p>
                            <p className="font-sans text-[11px] text-[#6B6F66]">{c.sub}</p>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Footer Controls */}
          <div className="pt-8 border-t border-[#E9E4D8] flex items-center justify-between gap-4 mt-8">
            <button
              type="button"
              onClick={handleBack}
              disabled={step === 1}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-semibold text-[#6B6F66] hover:text-[#172319] disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back</span>
            </button>

            <button
              type="button"
              onClick={handleNext}
              disabled={!isStepValid()}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#172319] hover:bg-[#2C5044] disabled:bg-[#8D918A] text-white font-sans font-medium text-xs sm:text-sm transition-all shadow-sm cursor-pointer disabled:cursor-not-allowed"
            >
              <span>{step === 4 ? 'See my matches' : 'Continue'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
