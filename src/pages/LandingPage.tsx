import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { Eyebrow } from '../components/Eyebrow';
import { ArrowRight, Check, Flame, Sparkles, Layers, Sliders, Calendar, ArrowUpRight } from 'lucide-react';

export const LandingPage: React.FC = () => {
  const { loginAsDemo } = useApp();
  const navigate = useNavigate();

  const handleDemoClick = () => {
    loginAsDemo();
    navigate('/dashboard');
  };

  const [activeCurveWeek, setActiveCurveWeek] = useState<number>(4);

  const curveBars = [
    { week: 'W1', height: 28, color: '#2E3E33', phase: 'Adjustment', detail: 'Microbiome equilibration. Skin and scalp pH adapt to active formulation. Zero surface visible changes are expected yet.' },
    { week: 'W2', height: 35, color: '#2E3E33', phase: 'Adjustment', detail: 'Initial cellular turnover acceleration. Possible transient purging as congested micro-comedones clear outward.' },
    { week: 'W3', height: 42, color: '#E29D52', phase: 'Dropout Danger Zone', detail: 'Critical week: 68% of users quit here feeling "nothing is happening", precisely when deep follicular pathways are active.' },
    { week: 'W4', height: 48, color: '#E29D52', phase: 'Dropout Danger Zone', detail: 'First 28-day skin cycle completes. Subsurface inflammation calms; sebum production begins regulating.' },
    { week: 'W5', height: 55, color: '#E29D52', phase: 'Dropout Danger Zone', detail: 'Bio-accumulation phase. Actives maintain stable therapeutic concentrations in the dermis and hair matrix.' },
    { week: 'W6', height: 62, color: '#E29D52', phase: 'Dropout Danger Zone', detail: 'Secondary indicators surface: shower hair fall stabilizes, scalp itching ceases, skin barrier hydration increases.' },
    { week: 'W7', height: 70, color: '#E29D52', phase: 'Dropout Danger Zone', detail: 'Follicular anagen-phase stimulation. Pore walls tighten as accumulated sebum oxidation diminishes.' },
    { week: 'W8', height: 78, color: '#E29D52', phase: 'Transition to Visible', detail: 'Exiting the danger zone. Consistency over the past 56 days now triggers unmistakable physical transformation.' },
    { week: 'W9', height: 86, color: '#8EBEA6', phase: 'Visible Results', detail: 'High-contrast differences become visible in standard baseline comparison photography.' },
    { week: 'W10', height: 92, color: '#8EBEA6', phase: 'Visible Results', detail: 'Post-inflammatory hyperpigmentation fades; hair shaft diameter and tensile strength improve.' },
    { week: 'W11', height: 96, color: '#8EBEA6', phase: 'Visible Results', detail: 'Structural consolidation. Keratin synthesis and collagen support matrices visibly strengthen.' },
    { week: 'W12', height: 100, color: '#8EBEA6', phase: 'Visible Results', detail: 'Dermatological endpoints reached. Scalp density, texture uniformity, and barrier lipid levels normalized.' },
    { week: 'W13', height: 104, color: '#8EBEA6', phase: 'Consolidated Transformation', detail: '90-day biological completion. Transition to maintenance frequency with documented clinical proof.' },
  ];

  return (
    <div className="w-full flex flex-col bg-[#FAF7F0] overflow-x-hidden">
      {/* 1. HERO SECTION */}
      <section className="relative pt-12 md:pt-20 pb-16 md:pb-24 border-b border-[#E9E4D8]">
        <div className="max-w-[1280px] mx-auto px-6 md:px-12 grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Left Column: Headlines & CTAs */}
          <div className="lg:col-span-7 flex flex-col items-start">
            <Eyebrow className="mb-4">
              THE 90-DAY RESULTS SYSTEM · BE BODYWISE
            </Eyebrow>

            <h1 className="font-serif font-medium text-4xl sm:text-5xl lg:text-[68px] leading-[1.06] tracking-[-0.02em] text-[#172319] mb-6">
              Most products don't fail.{' '}
              <br className="hidden sm:inline" />
              They're judged{' '}
              <span className="italic font-normal text-[#A46F39]">too early.</span>
            </h1>

            <p className="font-sans text-base sm:text-lg text-[#6B6F66] max-w-xl leading-relaxed mb-8">
              One connected system that starts before you buy and stays with you through the critical 90-day results window — so you always know whether it's too early, on track, or time to change something.
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap items-center gap-4 mb-14">
              <Link
                to="/signup"
                className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full bg-[#A46F39] hover:bg-[#8F5E2D] text-white font-sans font-medium text-sm transition-all shadow-md shadow-[#A46F39]/20 hover:-translate-y-0.5 active:translate-y-0"
              >
                <span>Find my product match</span>
                <ArrowRight className="w-4 h-4" />
              </Link>

              <button
                onClick={handleDemoClick}
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full bg-white hover:bg-[#F5F1E8] border border-[#E9E4D8] text-[#172319] font-sans font-medium text-sm transition-all hover:-translate-y-0.5 shadow-2xs"
              >
                <span>Explore the live demo</span>
              </button>
            </div>

            {/* Stat Row */}
            <div className="w-full pt-8 border-t border-[#E9E4D8] grid grid-cols-3 gap-4">
              <div>
                <p className="font-serif font-bold text-3xl sm:text-4xl text-[#172319]">90</p>
                <p className="font-mono text-[10px] sm:text-[11px] uppercase tracking-[0.16em] text-[#6B6F66] mt-1">
                  DAYS DECODED
                </p>
              </div>
              <div>
                <p className="font-serif font-bold text-3xl sm:text-4xl text-[#172319]">5</p>
                <p className="font-mono text-[10px] sm:text-[11px] uppercase tracking-[0.16em] text-[#6B6F66] mt-1">
                  CONNECTED TOOLS
                </p>
              </div>
              <div>
                <p className="font-serif font-bold text-3xl sm:text-4xl text-[#172319]">4</p>
                <p className="font-mono text-[10px] sm:text-[11px] uppercase tracking-[0.16em] text-[#6B6F66] mt-1">
                  ROOT CAUSES FIXED
                </p>
              </div>
            </div>
          </div>

          {/* Right Column: Arch-cropped portrait + floating cards */}
          <div className="lg:col-span-5 relative flex justify-center items-center py-6">
            <div className="relative w-full max-w-[400px]">
              {/* Arch container */}
              <div className="w-full h-[480px] sm:h-[530px] rounded-t-[200px] rounded-b-[28px] overflow-hidden shadow-2xl border-4 border-white bg-[#F0EBE1] relative">
                <img
                  src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=800&q=85"
                  alt="Woman in natural golden-hour portrait"
                  className="w-full h-full object-cover object-top"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#172319]/30 via-transparent to-transparent pointer-events-none" />
              </div>

              {/* Floating Card 1: Top-Left Glass Card */}
              <div className="absolute -top-4 -left-6 sm:-left-10 bg-white/95 backdrop-blur-md border border-[#E9E4D8] p-4 rounded-2xl shadow-xl max-w-[240px] animate-pulse">
                <span className="font-mono text-[9px] uppercase tracking-widest text-[#A46F39] font-bold block mb-1">
                  RESULTS DECODER · DAY 45
                </span>
                <p className="font-serif italic text-xs text-[#172319] leading-snug mb-2.5">
                  "You are in the expected lag phase."
                </p>
                <div className="flex gap-1 h-1.5 w-full">
                  <div className="flex-1 bg-[#2C5044] rounded-full" />
                  <div className="flex-1 bg-[#E29D52] rounded-full" />
                  <div className="flex-1 bg-[#E9E4D8] rounded-full" />
                  <div className="flex-1 bg-[#E9E4D8] rounded-full" />
                </div>
              </div>

              {/* Floating Card 2: Bottom-Right Dark Pill */}
              <div className="absolute -bottom-5 -right-4 sm:-right-8 bg-[#172319] text-white px-4 py-3 rounded-2xl shadow-xl flex items-center gap-3 border border-[#2E3E33]">
                <div className="w-9 h-9 rounded-full bg-[#E29D52]/20 text-[#E29D52] flex items-center justify-center shrink-0">
                  <Flame className="w-5 h-5 fill-current" />
                </div>
                <div>
                  <p className="font-serif font-bold text-base leading-tight">24 days</p>
                  <p className="font-mono text-[9px] uppercase tracking-wider text-[#E29D52]">
                    STREAK · LV 4 RITUAL KEEPER
                  </p>
                </div>
              </div>

              {/* Floating Card 3: Bottom-Left White Pill */}
              <div className="absolute bottom-16 -left-6 sm:-left-10 bg-white border border-[#E9E4D8] px-4 py-2.5 rounded-full shadow-lg flex items-center gap-2.5">
                <span className="font-serif font-bold text-lg text-[#2C5044]">96%</span>
                <div className="leading-tight">
                  <p className="font-sans font-semibold text-xs text-[#172319]">10% Niacinamide Serum</p>
                  <p className="font-sans text-[10px] text-[#6B6F66]">Matched to oily, combination skin</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. MARQUEE BAND */}
      <div className="w-full bg-[#172319] text-white py-4 overflow-hidden border-y border-[#2E3E33]">
        <div className="animate-marquee whitespace-nowrap flex items-center text-sm font-serif">
          {[...Array(3)].map((_, idx) => (
            <span key={idx} className="flex items-center gap-6 px-4">
              <span>Too early</span>
              <span className="text-[#E29D52]">✦</span>
              <span>Expected lag phase</span>
              <span className="text-[#E29D52]">✦</span>
              <span>Review usage</span>
              <span className="text-[#E29D52]">✦</span>
              <span>On track</span>
              <span className="text-[#E29D52]">✦</span>
              <span>Consider professional help</span>
              <span className="text-[#E29D52]">✦</span>
              <span className="font-mono text-xs uppercase tracking-widest text-[#E29D52]">Day 1 → Day 90</span>
              <span className="text-[#E29D52]">✦</span>
            </span>
          ))}
        </div>
      </div>

      {/* 3. SECTION #why — "WHY IT DIDN'T WORK" */}
      <section id="why" className="py-24 max-w-[1280px] mx-auto px-6 md:px-12 scroll-mt-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          <div className="lg:col-span-5">
            <Eyebrow className="mb-3">ROOT CAUSE BREAKDOWN</Eyebrow>
            <h2 className="font-serif font-medium text-3xl sm:text-4xl text-[#172319] leading-tight mb-5">
              Four factors drive almost every{' '}
              <span className="italic font-normal text-[#A46F39]">"I saw nothing."</span>
            </h2>
            <p className="font-sans text-base text-[#6B6F66] leading-relaxed mb-6">
              No formulation changes. The system improves selection, usage, expectations and consistency — the four things that decide whether results ever get the chance to appear.
            </p>
            <div className="p-5 rounded-2xl bg-[#F5F1E8] border border-[#E9E4D8]">
              <p className="font-serif italic text-sm text-[#172319] mb-1">
                "Clinical actives take 21–60 days to shift follicular and cellular cycles. Quitting at week 3 isn't product failure — it's premature judgment."
              </p>
              <p className="font-mono text-[10px] text-[#A46F39] uppercase tracking-wider font-semibold">
                — CLINICAL RESULTS TIMELINE STUDY
              </p>
            </div>
          </div>

          <div className="lg:col-span-7 flex flex-col gap-4">
            {/* 01 Selection Accuracy */}
            <div className="p-6 rounded-2xl bg-white border border-[#E9E4D8] shadow-2xs hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between gap-4 mb-2">
                <h3 className="font-serif font-semibold text-lg text-[#172319]">
                  Selection accuracy
                </h3>
                <span className="font-mono text-sm font-bold text-[#A46F39]">01</span>
              </div>
              <p className="font-sans text-sm text-[#6B6F66] mb-3">
                The product never suited her hair, skin or body in the first place.
              </p>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#E8F1EC] text-[#2C5044] font-sans text-xs font-medium">
                <Check className="w-3.5 h-3.5" />
                <span>Solved by Product Match + Routine Test</span>
              </span>
            </div>

            {/* 02 Usage Correctness */}
            <div className="p-6 rounded-2xl bg-white border border-[#E9E4D8] shadow-2xs hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between gap-4 mb-2">
                <h3 className="font-serif font-semibold text-lg text-[#172319]">
                  Usage correctness
                </h3>
                <span className="font-mono text-sm font-bold text-[#A46F39]">02</span>
              </div>
              <p className="font-sans text-sm text-[#6B6F66] mb-3">
                Right product, wrong amount, wrong time, or wrong contact time on skin.
              </p>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#E8F1EC] text-[#2C5044] font-sans text-xs font-medium">
                <Check className="w-3.5 h-3.5" />
                <span>Solved by My Shelf instructions</span>
              </span>
            </div>

            {/* 03 Expectation Setting */}
            <div className="p-6 rounded-2xl bg-white border border-[#E9E4D8] shadow-2xs hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between gap-4 mb-2">
                <h3 className="font-serif font-semibold text-lg text-[#172319]">
                  Expectation setting
                </h3>
                <span className="font-mono text-sm font-bold text-[#A46F39]">03</span>
              </div>
              <p className="font-sans text-sm text-[#6B6F66] mb-3">
                Judged at week 1 when the verified biological timeline says week 6.
              </p>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#E8F1EC] text-[#2C5044] font-sans text-xs font-medium">
                <Check className="w-3.5 h-3.5" />
                <span>Solved by Results Decoder</span>
              </span>
            </div>

            {/* 04 Consistency */}
            <div className="p-6 rounded-2xl bg-white border border-[#E9E4D8] shadow-2xs hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between gap-4 mb-2">
                <h3 className="font-serif font-semibold text-lg text-[#172319]">
                  Consistency
                </h3>
                <span className="font-mono text-sm font-bold text-[#A46F39]">04</span>
              </div>
              <p className="font-sans text-sm text-[#6B6F66] mb-3">
                Skipped days and quitting during the natural lag-phase dip.
              </p>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#E8F1EC] text-[#2C5044] font-sans text-xs font-medium">
                <Check className="w-3.5 h-3.5" />
                <span>Solved by Care Journey</span>
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* 4. SECTION #system — BENTO GRID */}
      <section id="system" className="py-24 bg-[#F5F1E8] border-y border-[#E9E4D8] scroll-mt-20">
        <div className="max-w-[1280px] mx-auto px-6 md:px-12">
          <div className="max-w-2xl mb-12">
            <Eyebrow className="mb-3">ONE CONNECTED SYSTEM · 02 · 03 · 04 · 11 · 12</Eyebrow>
            <h2 className="font-serif font-medium text-3xl sm:text-5xl text-[#172319] leading-tight">
              My Shelf is the single source of truth.{' '}
              <span className="italic font-normal text-[#A46F39]">Everything else reads from it.</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Bento Card 1: My Shelf (Dark tall card) */}
            <div className="lg:row-span-2 p-8 rounded-3xl bg-[#172319] text-white flex flex-col justify-between relative overflow-hidden group shadow-xl">
              <div className="relative z-10">
                <span className="font-mono text-[10px] uppercase tracking-widest text-[#E29D52] font-semibold block mb-2">
                  04 · OWNERSHIP & SETUP
                </span>
                <h3 className="font-serif font-medium text-3xl text-white mb-3">
                  My Shelf
                </h3>
                <p className="font-sans text-sm text-white/70 leading-relaxed mb-6">
                  Every product you own with its exact start date, specific contact instructions, 28-day consistency meter, and daily logging.
                </p>
              </div>

              {/* Visual preview inside card */}
              <div className="relative z-10 p-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/10 mb-6">
                <div className="flex items-center justify-between text-xs text-white/80 mb-2">
                  <span>Scalp Clarify Shampoo</span>
                  <span className="font-mono text-[#E29D52]">Day 1 / 90</span>
                </div>
                <div className="w-full bg-white/20 h-2 rounded-full overflow-hidden">
                  <div className="bg-[#E29D52] h-full w-[12%]" />
                </div>
                <p className="font-sans text-[11px] text-white/60 mt-2">
                  Consistency: 100% · Status: Too early
                </p>
              </div>

              <Link
                to="/shelf"
                className="relative z-10 inline-flex items-center justify-center gap-2 py-3 px-6 rounded-full bg-[#E29D52] text-[#172319] font-sans font-semibold text-sm hover:bg-[#A46F39] hover:text-white transition-colors"
              >
                <span>Open My Shelf</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            {/* Bento Card 2: Personal Product Match */}
            <div className="p-7 rounded-3xl bg-white border border-[#E9E4D8] flex flex-col justify-between shadow-2xs hover:shadow-md transition-shadow group">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="font-mono text-[10px] uppercase tracking-widest text-[#A46F39] font-semibold">
                    02 · PRE-PURCHASE
                  </span>
                  <div className="w-8 h-8 rounded-full bg-[#F0EBE1] flex items-center justify-center group-hover:bg-[#A46F39] group-hover:text-white transition-colors">
                    <Sliders className="w-4 h-4" />
                  </div>
                </div>
                <h3 className="font-serif font-semibold text-xl text-[#172319] mb-2">
                  Personal Product Match
                </h3>
                <p className="font-sans text-sm text-[#6B6F66] leading-relaxed">
                  A short 4-step assessment matches your hair, skin, and body profile to the formulas that genuinely suit you — with an honest "why this suits you."
                </p>
              </div>
              <Link
                to="/match"
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#A46F39] hover:text-[#8F5E2D] mt-6"
              >
                <span>Take the assessment</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {/* Bento Card 3: Routine Test */}
            <div className="p-7 rounded-3xl bg-white border border-[#E9E4D8] flex flex-col justify-between shadow-2xs hover:shadow-md transition-shadow group">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="font-mono text-[10px] uppercase tracking-widest text-[#A46F39] font-semibold">
                    03 · PRE-PURCHASE
                  </span>
                  <div className="w-8 h-8 rounded-full bg-[#F0EBE1] flex items-center justify-center group-hover:bg-[#A46F39] group-hover:text-white transition-colors">
                    <Layers className="w-4 h-4" />
                  </div>
                </div>
                <h3 className="font-serif font-semibold text-xl text-[#172319] mb-2">
                  Routine Test
                </h3>
                <p className="font-sans text-sm text-[#6B6F66] leading-relaxed">
                  Test any candidate product against what's already on your shelf before buying. Instantly flags active clashes, duplicate actives, and overlapping purposes.
                </p>
              </div>
              <Link
                to="/routine-test"
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#A46F39] hover:text-[#8F5E2D] mt-6"
              >
                <span>Test a product</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {/* Bento Card 4: Results Decoder */}
            <div className="p-7 rounded-3xl bg-white border border-[#E9E4D8] flex flex-col justify-between shadow-2xs hover:shadow-md transition-shadow group">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="font-mono text-[10px] uppercase tracking-widest text-[#A46F39] font-semibold">
                    11 · DECODING
                  </span>
                  <div className="w-8 h-8 rounded-full bg-[#F0EBE1] flex items-center justify-center group-hover:bg-[#A46F39] group-hover:text-white transition-colors">
                    <Sparkles className="w-4 h-4" />
                  </div>
                </div>
                <h3 className="font-serif font-semibold text-xl text-[#172319] mb-2">
                  Results Decoder
                </h3>
                <p className="font-sans text-sm text-[#6B6F66] leading-relaxed">
                  Answers the question: "Is it working yet?" Decodes your start date, verified timeline, consistency, and check-ins into plain, reassuring reality.
                </p>
              </div>
              <Link
                to="/decoder"
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#A46F39] hover:text-[#8F5E2D] mt-6"
              >
                <span>View decoder</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {/* Bento Card 5: Care Journey */}
            <div className="p-7 rounded-3xl bg-white border border-[#E9E4D8] flex flex-col justify-between shadow-2xs hover:shadow-md transition-shadow group">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="font-mono text-[10px] uppercase tracking-widest text-[#A46F39] font-semibold">
                    12 · RETENTION
                  </span>
                  <div className="w-8 h-8 rounded-full bg-[#F0EBE1] flex items-center justify-center group-hover:bg-[#A46F39] group-hover:text-white transition-colors">
                    <Calendar className="w-4 h-4" />
                  </div>
                </div>
                <h3 className="font-serif font-semibold text-xl text-[#172319] mb-2">
                  Care Journey
                </h3>
                <p className="font-sans text-sm text-[#6B6F66] leading-relaxed">
                  Gamified 90-day progress: XP, 5 levels, daily ritual missions, milestone path, and a 28-day consistency calendar to carry you past the dropout window.
                </p>
              </div>
              <Link
                to="/journey"
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#A46F39] hover:text-[#8F5E2D] mt-6"
              >
                <span>Explore the journey</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 5. SECTION #curve — THE 90-DAY CURVE (Dark ink full-bleed) */}
      <section id="curve" className="py-24 bg-[#172319] text-white border-b border-[#2E3E33] scroll-mt-20">
        <div className="max-w-[1280px] mx-auto px-6 md:px-12 text-center">
          <Eyebrow color="text-[#E29D52]" className="mb-3">
            THE 90-DAY CURVE
          </Eyebrow>
          <h2 className="font-serif font-medium text-3xl sm:text-5xl text-white leading-tight max-w-3xl mx-auto mb-6">
            Weeks 3–8 are where results are won —{' '}
            <span className="italic font-normal text-[#E29D52]">or abandoned.</span>
          </h2>
          <p className="font-sans text-base text-white/70 max-w-xl mx-auto mb-16 leading-relaxed">
            Most users quit right in the middle because surface changes are quiet while cellular repair is loudest. Here is what actually happens week by week:
          </p>

          {/* 13 Rounded Vertical Bars */}
          <div className="max-w-4xl mx-auto bg-white/5 p-6 sm:p-10 rounded-3xl border border-white/10 backdrop-blur-md">
            <div className="flex items-end justify-between gap-1.5 sm:gap-3 h-64 sm:h-72 mb-6 px-1">
              {curveBars.map((bar, idx) => {
                const isActive = activeCurveWeek === idx + 1;
                return (
                  <button
                    key={bar.week}
                    type="button"
                    onClick={() => setActiveCurveWeek(idx + 1)}
                    className="flex-1 flex flex-col items-center h-full justify-end group cursor-pointer focus:outline-none"
                    aria-label={`View clinical phase for ${bar.week}`}
                  >
                    <div
                      className={`w-full rounded-t-lg transition-all duration-300 ${
                        isActive
                          ? 'ring-2 ring-white scale-105 brightness-125'
                          : 'hover:brightness-110 opacity-75 hover:opacity-100'
                      }`}
                      style={{
                        height: `${(bar.height / 110) * 100}%`,
                        backgroundColor: bar.color,
                      }}
                    />
                    <span
                      className={`font-mono text-[10px] sm:text-[11px] mt-3 transition-colors ${
                        isActive ? 'text-[#E29D52] font-bold' : 'text-white/60'
                      }`}
                    >
                      {bar.week}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Interactive Clinical Insight Panel */}
            <div className="p-5 rounded-2xl bg-white/10 border border-white/15 text-left mb-6 transition-all duration-300">
              <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-bold text-[#E29D52] uppercase">
                    WEEK {activeCurveWeek} ({activeCurveWeek * 7 - 6}–{activeCurveWeek * 7} DAYS)
                  </span>
                  <span
                    className="px-2.5 py-0.5 rounded-full text-[10px] font-mono uppercase font-bold"
                    style={{
                      backgroundColor:
                        activeCurveWeek <= 2
                          ? '#2E3E33'
                          : activeCurveWeek <= 8
                          ? '#E29D52'
                          : '#8EBEA6',
                      color: activeCurveWeek <= 2 ? '#8EBEA6' : '#172319',
                    }}
                  >
                    {curveBars[activeCurveWeek - 1]?.phase}
                  </span>
                </div>
                <span className="font-sans text-[11px] text-white/50">
                  Tap any bar to inspect clinical milestones
                </span>
              </div>
              <p className="font-sans text-sm text-white/90 leading-relaxed">
                {curveBars[activeCurveWeek - 1]?.detail}
              </p>
            </div>

            {/* Legend */}
            <div className="pt-4 border-t border-white/10 flex flex-wrap items-center justify-center gap-6 text-xs text-white/80">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-[#2E3E33]" />
                <span>W1–W2: Adjustment & Purging</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-[#E29D52]" />
                <span className="font-semibold text-[#E29D52]">W3–W8: Dropout Danger Zone</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-[#8EBEA6]" />
                <span>W9–W13: Visible & Lasting Results</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. CTA BAND */}
      <section className="py-20 max-w-[1280px] mx-auto px-6 md:px-12">
        <div className="p-10 sm:p-16 rounded-[28px] bg-gradient-to-br from-[#EADCC2] to-[#EAC598] text-[#172319] shadow-xl border border-[#DFCEB1] flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="max-w-xl text-left">
            <h2 className="font-serif font-medium text-3xl sm:text-4xl text-[#172319] leading-tight mb-3">
              Know where you are on day 1, day 18 and day 90.
            </h2>
            <p className="font-sans text-base text-[#172319]/80 leading-relaxed">
              Take the 60-second match, build your shelf and let the Decoder do the worrying.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-4 shrink-0 w-full md:w-auto">
            <Link
              to="/signup"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full bg-[#172319] hover:bg-[#2C5044] text-white font-sans font-medium text-sm transition-all shadow-md hover:-translate-y-0.5"
            >
              <span>Create my account</span>
              <ArrowUpRight className="w-4 h-4" />
            </Link>

            <button
              onClick={handleDemoClick}
              className="font-sans text-sm font-semibold text-[#172319] hover:text-[#A46F39] underline underline-offset-4 transition-colors"
            >
              Try the demo account
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
