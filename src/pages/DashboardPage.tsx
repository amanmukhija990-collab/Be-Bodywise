import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { Eyebrow } from '../components/Eyebrow';
import { ProductImage } from '../components/ProductImage';
import { generateDiagnosticProfile, CustomerDiagnosticProfile } from '../lib/matchEngine';
import { 
  Sparkles, 
  ShoppingBag, 
  ArrowRight, 
  Check, 
  ShieldCheck, 
  Sliders, 
  Package, 
  Flame,
  ExternalLink
} from 'lucide-react';

export const DashboardPage: React.FC = () => {
  const { user, addToCart, setIsCartOpen, addToast, toggleMission, todayStr } = useApp();
  const navigate = useNavigate();

  const firstName = user?.profile.firstName || 'Friend';
  const todayMissions = user?.missions?.[todayStr] || [];

  // Check user assessment answers on profile or localStorage
  const savedAnswers = React.useMemo(() => {
    if (user?.matchAnswers) return user.matchAnswers;
    try {
      const raw = localStorage.getItem('be_bodywise_assessment_recommendation');
      if (raw) {
        const parsed = JSON.parse(raw);
        return parsed.answers || null;
      }
    } catch {
      // ignore
    }
    return null;
  }, [user]);

  const diagnosticReport: CustomerDiagnosticProfile | null = React.useMemo(() => {
    if (!savedAnswers) return null;
    try {
      return generateDiagnosticProfile(savedAnswers);
    } catch {
      return null;
    }
  }, [savedAnswers]);

  // Add Complete Recommended Bundle to Shopping Bag
  const handleAddBundleToBag = () => {
    if (!diagnosticReport) return;
    diagnosticReport.recommended3StepRoutine.forEach(stepItem => {
      addToCart(stepItem.product.id, 1);
    });
    addToast(
      'Recommended Formulations Added to Bag!',
      'Bundle discount automatically applied in bag',
      'success'
    );
    setIsCartOpen(true);
  };

  const DAILY_ROUTINE_ACTIONS = [
    {
      id: 'routine-step-1',
      title: 'Morning Formulation Application',
      desc: 'Active topical prep and cleansing',
      xp: 10,
    },
    {
      id: 'routine-step-2',
      title: 'Targeted Active Treatment',
      desc: 'Concentrated serum absorbed into skin or scalp',
      xp: 10,
    },
    {
      id: 'routine-step-3',
      title: 'Daily Nutraceutical Support',
      desc: 'Oral chewable gummies or cellular nutrition',
      xp: 10,
    },
    {
      id: 'hydrate-daily',
      title: 'Daily Hydration: 2.5L Water Intake',
      desc: 'Cellular hydration and dermal flush',
      xp: 15,
    },
  ];

  return (
    <div className="w-full max-w-[1280px] mx-auto px-5 sm:px-8 py-8 md:py-12">
      {/* Greeting Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
        <div>
          <Eyebrow className="mb-2">PERSONAL CLINICAL PORTAL</Eyebrow>
          <h1 className="font-serif font-medium text-3xl sm:text-4xl text-[#111827] leading-tight">
            Good morning, {firstName}.
          </h1>
          <p className="font-sans text-sm sm:text-base text-[#64748B] mt-2 leading-relaxed">
            Welcome to your doctor-engineered wellness portal. Access your personalized recommendations, track daily care actions, and manage orders.
          </p>
        </div>

        {/* Action badges: Streak & XP */}
        <div className="flex flex-wrap items-center gap-2.5">
          <div className="flex items-center gap-2 px-3.5 py-2 rounded-full bg-white border border-[#E2E8F0] shadow-2xs">
            <Flame className="w-4 h-4 text-[#EB6200] fill-[#EB6200]" />
            <span className="font-sans font-bold text-sm text-[#111827]">{user?.streak || 0}</span>
            <span className="font-mono text-[10px] text-[#64748B] uppercase">STREAK</span>
          </div>

          <div className="flex items-center gap-2 px-3.5 py-2 rounded-full bg-white border border-[#E2E8F0] shadow-2xs">
            <Sparkles className="w-4 h-4 text-[#005995]" />
            <span className="font-sans font-bold text-sm text-[#111827]">{user?.xp || 0}</span>
            <span className="font-mono text-[10px] text-[#005995] uppercase font-bold">XP</span>
          </div>
        </div>
      </div>

      {/* SECTION 1: PRESCRIBED FORMULATIONS */}
      {diagnosticReport ? (
        <div className="rounded-[28px] bg-white border border-[#BADCF0] p-6 sm:p-9 shadow-md mb-12 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-[#E6F5FF]/60 via-transparent to-transparent pointer-events-none" />

          {/* Header */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-8 pb-6 border-b border-[#E2E8F0] relative z-10">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="px-3 py-1 rounded-full bg-[#E6F5FF] text-[#005995] font-mono text-[10px] font-bold uppercase tracking-wider border border-[#BADCF0]">
                  DOCTOR-RECOMMENDED FORMULATIONS
                </span>
                <span className="text-xs text-[#64748B] font-mono">
                  ACTIVE ON FILE
                </span>
              </div>
              <h2 className="font-serif font-bold text-2xl sm:text-3xl text-[#111827] leading-tight">
                {diagnosticReport.customerName}&apos;s Prescribed Formulations
              </h2>
              <p className="font-sans text-xs sm:text-sm text-[#64748B] mt-1 max-w-xl">
                Targeted clinical solutions matched specifically for your <strong>{diagnosticReport.personaType}</strong> goals and biological profile.
              </p>
            </div>

            {/* Actions: View Assessment + Add to Bag */}
            <div className="flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={() => navigate('/match')}
                className="inline-flex items-center gap-2 px-5 py-3 rounded-full bg-white hover:bg-[#F0F6FA] text-[#005995] border border-[#005995] font-sans text-xs sm:text-sm font-semibold transition-all cursor-pointer shadow-2xs hover:scale-102"
              >
                <ExternalLink className="w-4 h-4" />
                <span>View Full Assessment</span>
              </button>

              <button
                type="button"
                onClick={handleAddBundleToBag}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#005995] hover:bg-[#004777] text-white font-sans text-xs sm:text-sm font-semibold transition-all shadow-md hover:scale-102 cursor-pointer"
              >
                <ShoppingBag className="w-4 h-4 text-white" />
                <span>Add Recommended Bundle (₹{diagnosticReport.bundlePrice})</span>
              </button>
            </div>
          </div>

          {/* Product Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative z-10">
            {diagnosticReport.recommended3StepRoutine.map(stepItem => (
              <div 
                key={stepItem.product.id}
                className="rounded-3xl bg-[#FAFBFD] border border-[#E2E8F0] p-6 shadow-2xs hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="px-3 py-1 rounded-full bg-[#143461] text-white font-mono text-[9px] uppercase tracking-wider font-bold">
                      {stepItem.role}
                    </span>
                    <span className="font-serif font-bold text-base text-[#111827]">
                      ₹{stepItem.product.price}
                    </span>
                  </div>

                  <div className="aspect-[4/3] w-full rounded-2xl overflow-hidden bg-white mb-4 border border-[#E2E8F0]">
                    <ProductImage
                      src={stepItem.product.image}
                      alt={stepItem.product.name}
                      category={stepItem.product.category}
                      className="w-full h-full object-cover p-2"
                    />
                  </div>

                  <span className="font-mono text-[10px] uppercase font-bold text-[#005995] block mb-1">
                    {stepItem.product.actives.slice(0, 3).join(' · ')}
                  </span>

                  <h3 className="font-serif font-bold text-base text-[#111827] mb-2 leading-snug">
                    {stepItem.product.name}
                  </h3>

                  <p className="font-sans text-xs text-[#64748B] mb-3 leading-relaxed">
                    <strong>Why matched:</strong> {stepItem.why}
                  </p>

                  <div className="p-3 rounded-xl bg-white border border-[#F1F5F9] text-[11px] text-[#475569] mb-4">
                    <strong className="text-[#111827] block mb-0.5">Doctor&apos;s Application Note:</strong>
                    {stepItem.howToUse}
                  </div>
                </div>

                <div className="pt-3 border-t border-[#E2E8F0] flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      addToCart(stepItem.product.id, 1);
                      addToast('Added to bag', `${stepItem.product.name} added to your bag`, 'success');
                    }}
                    className="flex-1 py-2 rounded-full border border-[#005995] text-[#005995] hover:bg-[#E6F5FF] font-sans text-xs font-semibold transition-all cursor-pointer text-center"
                  >
                    Add This Item
                  </button>

                  <button
                    type="button"
                    onClick={() => navigate(`/product/${stepItem.product.slug}`)}
                    className="px-3 py-2 rounded-full bg-white hover:bg-[#F1F5F9] text-[#64748B] text-xs font-semibold cursor-pointer border border-[#E2E8F0]"
                  >
                    Details
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        /* When No Assessment On File Yet */
        <div className="rounded-[28px] bg-[#143461] text-white p-7 sm:p-10 border border-[#225396] shadow-xl mb-12 relative overflow-hidden">
          <div className="max-w-2xl relative z-10">
            <span className="font-mono text-[10px] uppercase tracking-widest text-[#EB6200] font-semibold block mb-2">
              DOCTOR-ENGINEERED DIAGNOSTIC SYSTEM
            </span>
            <h2 className="font-serif font-medium text-2xl sm:text-4xl text-white mb-3 leading-tight">
              Find Your Personalized Product Match
            </h2>
            <p className="font-sans text-xs sm:text-sm text-white/80 leading-relaxed mb-6">
              Every woman&apos;s biological profile is unique. Complete our 2-minute clinical assessment to diagnose your root cause and unlock your targeted doctor-formulated recommendations.
            </p>

            <button
              type="button"
              onClick={() => navigate('/match')}
              className="inline-flex items-center gap-2.5 px-7 py-3.5 rounded-full bg-[#005995] hover:bg-[#004777] text-white font-sans font-semibold text-xs sm:text-sm transition-all shadow-md hover:scale-105 cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-white" />
              <span>Take Product Match Assessment</span>
              <ArrowRight className="w-4 h-4 text-white" />
            </button>
          </div>

          {/* Clinical Pillars Preview */}
          <div className="mt-8 pt-8 border-t border-white/10 grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs text-white/70">
            <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
              <span className="font-mono text-[10px] uppercase text-[#BADCF0] font-bold block mb-1">
                PRECISION ACTIVES
              </span>
              <p className="font-sans text-xs text-white font-medium mb-1">Therapeutic Dosing</p>
              <p className="text-[11px] leading-relaxed">Formulated at active percentages tested for optimal bioavailability.</p>
            </div>

            <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
              <span className="font-mono text-[10px] uppercase text-[#BADCF0] font-bold block mb-1">
                ROOT CAUSE TARGETING
              </span>
              <p className="font-sans text-xs text-white font-medium mb-1">Dual Action</p>
              <p className="text-[11px] leading-relaxed">Topical active treatments paired with targeted nutraceutical support.</p>
            </div>

            <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
              <span className="font-mono text-[10px] uppercase text-[#BADCF0] font-bold block mb-1">
                DERMATOLOGIST VERIFIED
              </span>
              <p className="font-sans text-xs text-white font-medium mb-1">Safe Formulations</p>
              <p className="text-[11px] leading-relaxed">Non-comedogenic, pH-balanced, and zero micro-tears.</p>
            </div>
          </div>
        </div>
      )}

      {/* SECTION 2: TODAY'S CARE ACTIONS CHECKLIST */}
      <div className="bg-white rounded-[24px] border border-[#E2E8F0] p-6 sm:p-7 shadow-sm mb-12">
        <div className="flex items-center justify-between mb-5 pb-4 border-b border-[#F0F6FA]">
          <div>
            <span className="font-mono text-[10px] uppercase tracking-widest text-[#005995] font-bold block">
              DAILY PROTOCOL
            </span>
            <h3 className="font-serif font-bold text-xl text-[#111827]">
              Today&apos;s Care Actions & Wellness Habits
            </h3>
          </div>
          <span className="font-mono text-xs text-[#64748B] bg-[#FAFBFD] px-3 py-1 rounded-full border border-[#E2E8F0]">
            Tap any action to check / uncheck
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3.5">
          {DAILY_ROUTINE_ACTIONS.map(action => {
            const isDone = todayMissions.includes(action.id);

            return (
              <div
                key={action.id}
                onClick={() => toggleMission(action.id, action.xp)}
                className={`p-4 rounded-2xl border transition-all flex flex-col justify-between gap-3 cursor-pointer select-none ${
                  isDone
                    ? 'bg-[#EDFCF5] border-[#C5E6D4]'
                    : 'bg-[#FAFBFD] border-[#E2E8F0] hover:border-[#005995] hover:shadow-2xs'
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div
                    className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${
                      isDone
                        ? 'bg-[#005995] text-white'
                        : 'border border-[#CBD5E1] text-transparent bg-white'
                    }`}
                  >
                    <Check className="w-3.5 h-3.5 stroke-[3]" />
                  </div>

                  <span className={`font-mono text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    isDone ? 'bg-[#005995]/10 text-[#198775]' : 'bg-white border border-[#E2E8F0] text-[#64748B]'
                  }`}>
                    {isDone ? 'Done' : `+${action.xp} XP`}
                  </span>
                </div>

                <div>
                  <p className={`font-sans font-semibold text-xs text-[#111827] leading-snug mb-1 ${isDone ? 'line-through text-[#198775]' : ''}`}>
                    {action.title}
                  </p>
                  <p className="font-sans text-[11px] text-[#64748B] leading-relaxed">
                    {action.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* SECTION 3: QUICK NAVIGATION CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div
          onClick={() => navigate('/match')}
          className="p-6 rounded-[24px] bg-white border border-[#E2E8F0] hover:border-[#005995] hover:shadow-md transition-all group cursor-pointer"
        >
          <div className="w-10 h-10 rounded-2xl bg-[#E6F5FF] flex items-center justify-center text-[#005995] group-hover:bg-[#005995] group-hover:text-white transition-colors mb-4">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <span className="font-mono text-[10px] uppercase tracking-wider text-[#005995] font-bold block mb-1">
            01 · RECOMMENDATIONS
          </span>
          <h3 className="font-serif font-semibold text-lg text-[#111827] mb-1">
            Matched Formulations
          </h3>
          <p className="font-sans text-xs text-[#64748B] leading-relaxed mb-4">
            View your clinical formulation blueprint, application timings, and synergistic active ingredients.
          </p>
          <span className="text-xs font-semibold text-[#005995] inline-flex items-center gap-1 group-hover:translate-x-1 transition-transform">
            <span>View Recommendations</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </span>
        </div>

        <div
          onClick={() => navigate('/match?retake=true')}
          className="p-6 rounded-[24px] bg-white border border-[#E2E8F0] hover:border-[#005995] hover:shadow-md transition-all group cursor-pointer"
        >
          <div className="w-10 h-10 rounded-2xl bg-[#E6F5FF] flex items-center justify-center text-[#005995] group-hover:bg-[#005995] group-hover:text-white transition-colors mb-4">
            <Sliders className="w-5 h-5" />
          </div>
          <span className="font-mono text-[10px] uppercase tracking-wider text-[#005995] font-bold block mb-1">
            02 · ASSESSMENT
          </span>
          <h3 className="font-serif font-semibold text-lg text-[#111827] mb-1">
            Product Match Assessment
          </h3>
          <p className="font-sans text-xs text-[#64748B] leading-relaxed mb-4">
            Retake or update your goals and symptoms to re-calibrate your doctor-formulated recommendations.
          </p>
          <span className="text-xs font-semibold text-[#005995] inline-flex items-center gap-1 group-hover:translate-x-1 transition-transform">
            <span>Retake Assessment</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </span>
        </div>

        <div
          onClick={() => navigate('/orders')}
          className="p-6 rounded-[24px] bg-white border border-[#E2E8F0] hover:border-[#005995] hover:shadow-md transition-all group cursor-pointer"
        >
          <div className="w-10 h-10 rounded-2xl bg-[#E6F5FF] flex items-center justify-center text-[#005995] group-hover:bg-[#005995] group-hover:text-white transition-colors mb-4">
            <Package className="w-5 h-5" />
          </div>
          <span className="font-mono text-[10px] uppercase tracking-wider text-[#005995] font-bold block mb-1">
            03 · YOUR ORDERS
          </span>
          <h3 className="font-serif font-semibold text-lg text-[#111827] mb-1">
            Orders & Tracking
          </h3>
          <p className="font-sans text-xs text-[#64748B] leading-relaxed mb-4">
            Track package shipments, view itemized invoices, and check dispatch timelines for all orders.
          </p>
          <span className="text-xs font-semibold text-[#005995] inline-flex items-center gap-1 group-hover:translate-x-1 transition-transform">
            <span>Track Orders</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </span>
        </div>
      </div>
    </div>
  );
};
