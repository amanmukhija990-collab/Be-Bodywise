import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { MatchAnswers } from '../types';
import { 
  calculateProductMatches, 
  generateDiagnosticProfile, 
  CustomerDiagnosticProfile, 
  MatchResult 
} from '../lib/matchEngine';
import { ProductImage } from '../components/ProductImage';
import { 
  Check, ArrowRight, ArrowLeft, RotateCcw, Sparkles, 
  ShoppingBag, ShieldCheck, Clock, Droplets, 
  Zap, Award, CheckCircle2, ChevronRight, Activity, 
  User, Flame, Shield, HelpCircle, FileText
} from 'lucide-react';

export const MatchPage: React.FC = () => {
  const { user, completeProductMatch, addToCart, setIsCartOpen, addToast } = useApp();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  // Primary category state from URL query or default
  const initialCategory = (searchParams.get('category') as any) || 'hair';

  // Step state: 1: Category -> 2: Goal -> 3: Symptoms & Triggers -> 4: Lifestyle & Modifiers -> 5: Customer Info -> 6: Analyzing -> 7: Diagnostic Report
  const [step, setStep] = useState<number>(1);
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [analysisProgress, setAnalysisProgress] = useState<number>(0);

  // Form states
  const [primaryCategory, setPrimaryCategory] = useState<'hair' | 'body' | 'pcos' | 'skin'>('hair');
  const [primaryGoal, setPrimaryGoal] = useState<string>('');
  const [selectedConcerns, setSelectedConcerns] = useState<string[]>([]);
  const [severity, setSeverity] = useState<string>('Moderate · Ongoing for 2–6 months');
  const [specificTriggers, setSpecificTriggers] = useState<string[]>([]);
  const [ageGroup, setAgeGroup] = useState<string>('25–34 years');
  const [waterIntake, setWaterIntake] = useState<string>('1.5 – 2.5 Litres');
  const [sleepHours, setSleepHours] = useState<string>('6 – 7 hours');
  const [stressLevel, setStressLevel] = useState<string>('Moderate daily stress');
  const [dietType, setDietType] = useState<string>('Vegetarian');
  const [customerName, setCustomerName] = useState<string>(user?.profile.firstName || '');
  const [customerEmail, setCustomerEmail] = useState<string>(user?.profile.email || '');

  // Computed results
  const [diagnosticReport, setDiagnosticReport] = useState<CustomerDiagnosticProfile | null>(null);
  const [rankedMatches, setRankedMatches] = useState<MatchResult[]>([]);

  // Auto-load saved assessment if the user has one on file and did not explicitly request a fresh retake
  useEffect(() => {
    const isRetakeRequested = searchParams.get('retake') === 'true';
    if (!isRetakeRequested && user?.matchAnswers && !diagnosticReport) {
      try {
        const profile = generateDiagnosticProfile(user.matchAnswers);
        const ranked = calculateProductMatches(user.matchAnswers);
        setDiagnosticReport(profile);
        setRankedMatches(ranked);
        setStep(7);
      } catch (e) {
        console.error('Failed to load saved assessment', e);
      }
    }
  }, [user, searchParams, diagnosticReport]);

  // Initialize category from URL query on mount
  useEffect(() => {
    const cat = searchParams.get('category');
    if (cat && ['hair', 'body', 'pcos', 'skin'].includes(cat)) {
      setPrimaryCategory(cat as any);
    }
  }, [searchParams]);

  // CATEGORY DEFINITIONS
  const WELLNESS_CATEGORIES = [
    {
      id: 'hair',
      title: 'Hair Health & Scalp',
      subtitle: 'Severe hair fall, receding density, crown thinning & stubborn dandruff',
      icon: '💇‍♀️',
      actives: 'Procapil + Redensyl + 5000mcg Biotin',
      stat: '94% Saw Reduced Shower Shedding',
      badge: 'Clinically Dosed',
    },
    {
      id: 'body',
      title: 'Body Care & Resurfacing',
      subtitle: 'Bacne, strawberry legs (KP), dark underarms & rough scaly skin',
      icon: '🧴',
      actives: '1% Salicylic Acid + 10% AHA + Mandelic',
      stat: 'Smooths Bumpy Skin in 28 Days',
      badge: 'Zero Micro-Tears',
    },
    {
      id: 'pcos',
      title: 'PCOS & Period Rhythm',
      subtitle: 'Delayed cycles, PMS gut bloating, hormonal chin breakouts & mood fatigue',
      icon: '🌸',
      actives: '40:1 Inositol + Chasteberry + Vitamin D3',
      stat: 'Over 10 Lakh+ Women Trusted',
      badge: 'Endocrine Support',
    },
    {
      id: 'skin',
      title: 'Facial Dermatology',
      subtitle: 'Stubborn acne, post-inflammatory dark spots, open pores & dullness',
      icon: '✨',
      actives: '2% BHA + 10% Niacinamide + Vit C',
      stat: 'Fades Pigmentation at the Root',
      badge: 'Dermatologist Approved',
    },
  ];

  // DYNAMIC GOALS BY CATEGORY
  const GOALS_BY_CATEGORY: Record<string, { id: string; label: string; desc: string }[]> = {
    hair: [
      { id: 'stop_fall', label: 'Drastically Reduce Daily Shower & Brush Shedding', desc: 'Target root follicle anchoring and cut down excessive breakage within 30 days' },
      { id: 'regrow_density', label: 'Awaken Dormant Follicles & Regrow Thinning Areas', desc: 'Stimulate cellular anagen growth along crown partition and hairline' },
      { id: 'clear_dandruff', label: 'Clear Flakes, Itchiness & Balances Scalp Sebum', desc: 'Eradicate Malassezia fungal root cause without stripping essential moisture' },
      { id: 'repair_frizz', label: 'Repair Dry, Frizzy & Chemically Damaged Strands', desc: 'Rebuild cuticle keratin bonds from thermal styling or color treatments' },
    ],
    body: [
      { id: 'clear_bacne', label: 'Clear Deep Back, Chest & Shoulder Breakouts (Bacne)', desc: 'Dissolve follicular plugs and prevent painful inflammatory cysts' },
      { id: 'smooth_kp', label: 'Smooth Rough Bumpy Strawberry Legs & Keratosis Pilaris (KP)', desc: 'Exfoliate hard keratin plugs on thighs and arms for baby-soft skin' },
      { id: 'underarm_care', label: 'Lighten Dark Underarms & Stop Odour All Day', desc: 'Aluminium-free Mandelic acid pH control that halts bacteria and fades pigmentation' },
      { id: 'severe_dryness', label: 'Deeply Hydrate Dry, Scaly, Peeling Body Skin', desc: '10% Urea medical-grade hydration that rebuilds the cracked barrier' },
    ],
    pcos: [
      { id: 'regularize_cycle', label: 'Restore Regular 28–35 Day Menstrual Cycles', desc: 'Clinically proven 40:1 Myo-Inositol to support natural ovulatory rhythm' },
      { id: 'hormonal_acne', label: 'Clear Hormonal Cystic Jawline & Chin Breakouts', desc: 'Normalize androgen-stimulated sebum flow and calm deep hormonal nodules' },
      { id: 'gut_bloating', label: 'Relieve Stubborn Abdominal Bloating & Water Retention', desc: 'Aid metabolic digestion and soothe inflammatory luteal phase bloat' },
      { id: 'energy_cravings', label: 'Curb Intense Afternoon Sugar Cravings & Brain Fog', desc: 'Enhance cellular insulin sensitivity to prevent erratic blood sugar crashes' },
    ],
    skin: [
      { id: 'clear_acne', label: 'Clear Active Acne & Prevent Recurring Flare-ups', desc: 'Cleanse deep pore funnels and control Cutibacterium bacterial colonization' },
      { id: 'fade_spots', label: 'Fade Post-Acne Dark Spots, Melasma & Sun Tan', desc: 'Inhibit tyrosinase enzyme activity to brighten stubborn melanin deposits' },
      { id: 'pore_sebum', label: 'Minimize Enlarged Open Pores & Daytime Oiliness', desc: 'Balance excessive sebaceous secretions with 10% Niacinamide + Zinc PCA' },
      { id: 'barrier_repair', label: 'Soothe Stinging Redness & Repair Compromised Barrier', desc: 'Replenish 5 essential ceramides and lock in deep transepidermal hydration' },
    ],
  };

  // DYNAMIC SYMPTOMS & TRIGGERS BY CATEGORY
  const SYMPTOMS_BY_CATEGORY: Record<string, { title: string; subtitle: string; options: string[] }[]> = {
    hair: [
      {
        title: 'Scalp Sebum Profile',
        subtitle: 'How does your scalp feel 24 hours after washing?',
        options: ['Oily & greasy at roots within 24h', 'Dry, tight and occasionally itchy', 'Noticeable white or yellowish flakes', 'Balanced and normal'],
      },
      {
        title: 'Daily Shedding Severity',
        subtitle: 'How many strands do you estimate shedding daily?',
        options: ['Mild (30–50 strands, mainly in brush)', 'Moderate (50–100 strands in shower & pillow)', 'Severe (>100 strands, visible thinning patches)'],
      },
      {
        title: 'Recent Scalp or Hair Treatments',
        subtitle: 'Have you undergone any chemical processing in the last 6 months?',
        options: ['Color or bleach treatment', 'Keratin or chemical straightening', 'Excessive blow drying / flat iron heat', 'Natural & virgin hair (no treatments)'],
      },
    ],
    body: [
      {
        title: 'Primary Breakout or Texture Areas',
        subtitle: 'Select the exact anatomical zones of concern',
        options: ['Upper back & shoulder blades', 'Chest & decolletage', 'Thighs & back of arms (strawberry KP)', 'Underarms (darkness / odour)'],
      },
      {
        title: 'Physical Sensation & Bump Type',
        subtitle: 'How do the spots feel to the touch?',
        options: ['Painful red cysts under the skin', 'Rough chicken-skin bumps that snag on clothes', 'Dark friction patches with rough skin', 'Surface whiteheads that burst easily'],
      },
      {
        title: 'Hair Removal & Shaving Habits',
        subtitle: 'How do you remove body hair in target areas?',
        options: ['Multi-blade disposable razor shaving', 'Hot or cold wax strips', 'Hair removal creams', 'No hair removal in these areas'],
      },
    ],
    pcos: [
      {
        title: 'Menstrual Cycle History',
        subtitle: 'How predictable has your period cycle been over the past 6 months?',
        options: ['Delayed (cycles last 35 to 50 days)', 'Severely erratic (missed periods for 2+ months)', 'Extremely painful with heavy cramping', 'Fairly regular but intense PMS symptoms'],
      },
      {
        title: 'Associated Biological Markers',
        subtitle: 'Select all co-occurring symptoms you experience',
        options: ['Deep jawline cystic acne before period', 'Unwanted hair on chin, upper lip or abdomen', 'Rapid abdominal weight gain & water retention', 'Sudden sugar cravings and mid-day energy dips'],
      },
      {
        title: 'Clinical Diagnostic Status',
        subtitle: 'Have you consulted an OB-GYN or had a pelvic ultrasound?',
        options: ['Clinically diagnosed with PCOS/PCOD', 'Suspected based on blood test/ultrasound', 'Self-identifying symptoms, not yet tested'],
      },
    ],
    skin: [
      {
        title: 'Primary Skin Type',
        subtitle: 'How does your mid-day T-zone look without makeup?',
        options: ['Oily all over with midday shine', 'Combination (oily T-zone, dry cheeks)', 'Dry and flaky with tightness', 'Highly sensitive & reactive to new products'],
      },
      {
        title: 'Breakout & Pigmentation Pattern',
        subtitle: 'What describes your current skin condition?',
        options: ['Active pustules and inflamed red pimples', 'Brown/grey marks left behind by past breakouts', 'Blackheads and enlarged pores around nose/cheeks', 'Dull, tired complexion with sun tan'],
      },
      {
        title: 'Daily Sun Protection Habit',
        subtitle: 'How consistently do you wear sunscreen outdoors?',
        options: ['Every single morning without fail', 'Only when sunny or spending hours outside', 'Rarely or never wear sunscreen'],
      },
    ],
  };

  // Toggle concern helper
  const toggleConcern = (concern: string) => {
    if (selectedConcerns.includes(concern)) {
      setSelectedConcerns(selectedConcerns.filter(c => c !== concern));
    } else {
      setSelectedConcerns([...selectedConcerns, concern]);
    }
  };

  // Toggle trigger helper
  const toggleTrigger = (trigger: string) => {
    if (specificTriggers.includes(trigger)) {
      setSpecificTriggers(specificTriggers.filter(t => t !== trigger));
    } else {
      setSpecificTriggers([...specificTriggers, trigger]);
    }
  };

  // Handle assessment submission and run clinical simulation
  const handleRunAssessment = () => {
    setIsAnalyzing(true);
    setAnalysisProgress(15);

    const answers: MatchAnswers = {
      focus: [primaryCategory === 'pcos' ? 'body' : (primaryCategory as any)],
      primaryCategory,
      primaryGoal,
      concerns: selectedConcerns.length > 0 ? selectedConcerns : [primaryGoal || 'Targeted Wellness'],
      severity,
      symptoms: specificTriggers,
      lifestyle: {
        ageGroup,
        waterIntake,
        sleepHours,
        stressLevel,
        dietType,
      },
      customerName: customerName || 'Wellness Seeker',
      reactivity: 'Rarely reacts',
      commitment: 'balanced',
    };

    // Animate progress simulation
    const interval = setInterval(() => {
      setAnalysisProgress(prev => {
        if (prev >= 95) {
          clearInterval(interval);
          return 100;
        }
        return prev + 25;
      });
    }, 450);

    setTimeout(() => {
      clearInterval(interval);
      const profile = generateDiagnosticProfile(answers);
      const ranked = calculateProductMatches(answers);

      setDiagnosticReport(profile);
      setRankedMatches(ranked);
      try {
        localStorage.setItem(
          'be_bodywise_assessment_recommendation',
          JSON.stringify({
            category: answers.primaryCategory,
            answers,
            recommendedProductIds: ranked.map(r => r.product.id),
            routineProductIds: profile.recommended3StepRoutine.map(r => r.product.id),
            routineNames: profile.recommended3StepRoutine.map(r => r.product.name),
            completedAt: Date.now(),
          })
        );
      } catch (e) {
        console.error('Failed to save assessment to localStorage', e);
      }
      completeProductMatch(answers, ranked.map(r => r.product.id));

      setIsAnalyzing(false);
      setStep(7); // Show diagnostic report
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 2200);
  };

  // Add Recommended Bundle to Shopping Bag
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

  // Retake Assessment
  const handleRetake = () => {
    if (user?.matchAnswers) {
      if (user.matchAnswers.primaryCategory && ['hair', 'body', 'pcos', 'skin'].includes(user.matchAnswers.primaryCategory as any)) {
        setPrimaryCategory(user.matchAnswers.primaryCategory as any);
      }
      if (user.matchAnswers.primaryGoal) setPrimaryGoal(user.matchAnswers.primaryGoal);
      if (user.matchAnswers.concerns) setSelectedConcerns(user.matchAnswers.concerns);
      if (user.matchAnswers.severity) setSeverity(user.matchAnswers.severity);
      if (user.matchAnswers.symptoms) setSpecificTriggers(user.matchAnswers.symptoms);
      if (user.matchAnswers.lifestyle?.ageGroup) setAgeGroup(user.matchAnswers.lifestyle.ageGroup);
      if (user.matchAnswers.lifestyle?.waterIntake) setWaterIntake(user.matchAnswers.lifestyle.waterIntake);
      if (user.matchAnswers.lifestyle?.sleepHours) setSleepHours(user.matchAnswers.lifestyle.sleepHours);
      if (user.matchAnswers.lifestyle?.stressLevel) setStressLevel(user.matchAnswers.lifestyle.stressLevel);
      if (user.matchAnswers.lifestyle?.dietType) setDietType(user.matchAnswers.lifestyle.dietType);
    }
    setStep(1);
    setDiagnosticReport(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // View Saved Assessment
  const handleViewSavedAssessment = () => {
    if (user?.matchAnswers) {
      const profile = generateDiagnosticProfile(user.matchAnswers);
      const ranked = calculateProductMatches(user.matchAnswers);
      setDiagnosticReport(profile);
      setRankedMatches(ranked);
      setStep(7);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // LOADING / ANALYZING STATE
  if (isAnalyzing) {
    return (
      <div className="min-h-[75vh] flex flex-col items-center justify-center px-6 py-20 bg-[#FAFBFD]">
        <div className="w-full max-w-md p-8 rounded-3xl bg-white border border-[#E2E8F0] shadow-xl text-center relative overflow-hidden">
          <div className="w-16 h-16 rounded-2xl bg-[#E6F5FF] text-[#005995] flex items-center justify-center mx-auto mb-6 animate-pulse">
            <Activity className="w-8 h-8 animate-spin" />
          </div>

          <span className="font-mono text-[11px] font-bold text-[#005995] uppercase tracking-widest block mb-2">
            DOCTOR-ENGINEERED DIAGNOSTIC ENGINE
          </span>

          <h2 className="font-serif font-bold text-2xl text-[#111827] mb-2">
            Decoding Your Biological Profile
          </h2>

          <p className="font-sans text-xs text-[#64748B] mb-6 leading-relaxed">
            Correlating your specific symptoms, lifestyle triggers, and {primaryCategory.toUpperCase()} biology against Be Bodywise clinical active formulations...
          </p>

          {/* Progress Bar */}
          <div className="w-full h-2.5 bg-[#F1F5F9] rounded-full overflow-hidden mb-3 p-0.5">
            <div 
              className="h-full bg-gradient-to-r from-[#005995] to-[#198775] rounded-full transition-all duration-300"
              style={{ width: `${analysisProgress}%` }}
            />
          </div>

          <div className="flex items-center justify-between text-[11px] font-mono text-[#64748B]">
            <span>Analyzing active synergy...</span>
            <span className="font-bold text-[#005995]">{analysisProgress}%</span>
          </div>
        </div>
      </div>
    );
  }

  // STEP 7: COMPREHENSIVE CUSTOMER PROFILE & CLINICAL DIAGNOSTIC REPORT
  if (step === 7 && diagnosticReport) {
    return (
      <div className="w-full max-w-[1240px] mx-auto px-5 sm:px-8 py-10 md:py-16">
        
        {/* Top Diagnostic Header Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4 pb-6 border-b border-[#E2E8F0]">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="px-3 py-1 rounded-full bg-[#E6F5FF] text-[#005995] font-mono text-[10px] font-bold uppercase tracking-wider border border-[#BADCF0]">
                CLINICALLY VERIFIED DIAGNOSIS
              </span>
              <span className="text-xs text-[#64748B] font-mono">
                ID: BBW-{Math.abs(diagnosticReport.customerName.length * 9471).toString(16).toUpperCase()}
              </span>
            </div>
            <h1 className="font-serif font-bold text-3xl sm:text-4xl text-[#111827] leading-tight">
              {diagnosticReport.customerName}&apos;s Biological Assessment & Blueprint
            </h1>
          </div>

          <button
            onClick={handleRetake}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full border border-[#005995] bg-[#005995] hover:bg-[#004777] text-white text-xs font-semibold transition-all cursor-pointer shadow-md self-start sm:self-auto"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Retake Assessment</span>
          </button>
        </div>

        {/* Saved Assessment Account Notice */}
        <div className="mb-8 p-3.5 sm:p-4 rounded-2xl bg-[#E6F5FF] border border-[#BADCF0] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2.5">
            <ShieldCheck className="w-4 h-4 text-[#005995] shrink-0" />
            <span className="text-[#005995]">
              <strong>Prescription on File:</strong> Showing your saved diagnostic assessment. Your information stays saved across sessions until you choose to retake it.
            </span>
          </div>
          <button
            type="button"
            onClick={handleRetake}
            className="shrink-0 text-xs font-bold text-[#005995] underline hover:text-[#004777] cursor-pointer self-start sm:self-auto"
          >
            Retake Now
          </button>
        </div>

        {/* SECTION A: "TELLS EVERYTHING ABOUT THE CUSTOMER" DIAGNOSTIC PERSONA CARD */}
        <div className="rounded-3xl bg-white border border-[#BADCF0] p-6 sm:p-8 shadow-md mb-10 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-[#E6F5FF]/60 via-transparent to-transparent pointer-events-none" />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start relative z-10">
            {/* Left Col: Persona Identification & Severity */}
            <div className="lg:col-span-5 border-b lg:border-b-0 lg:border-r border-[#E2E8F0] pb-6 lg:pb-0 lg:pr-8">
              <span className="font-mono text-[10px] uppercase font-bold tracking-widest text-[#005995] block mb-1">
                PATIENT BIOLOGICAL PROFILE
              </span>
              <h2 className="font-serif font-bold text-2xl text-[#111827] leading-snug mb-3">
                {diagnosticReport.personaType}
              </h2>
              
              <div className="p-3.5 rounded-2xl bg-[#FAFBFD] border border-[#E2E8F0] mb-5">
                <span className="font-mono text-[10px] uppercase text-[#64748B] font-semibold block mb-0.5">
                  Classified Biological Type
                </span>
                <span className="font-serif font-bold text-sm text-[#005995]">
                  {diagnosticReport.biologicalType}
                </span>
              </div>

              {/* Severity & Score Matrix */}
              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs font-sans">
                  <span className="text-[#64748B]">Clinical Severity Index:</span>
                  <span className="font-bold text-[#111827] flex items-center gap-1.5">
                    <span className={`w-2 h-2 rounded-full ${diagnosticReport.severityScore > 75 ? 'bg-[#EB6200]' : 'bg-[#198775]'}`} />
                    {diagnosticReport.severityLevel} ({diagnosticReport.severityScore}/100)
                  </span>
                </div>
                <div className="w-full h-2 bg-[#F1F5F9] rounded-full overflow-hidden">
                  <div 
                    className={`h-full rounded-full ${diagnosticReport.severityScore > 75 ? 'bg-[#EB6200]' : 'bg-[#005995]'}`}
                    style={{ width: `${diagnosticReport.severityScore}%` }}
                  />
                </div>
                <p className="text-[11px] text-[#64748B] font-sans leading-relaxed">
                  Calculated from your reported symptom frequency, duration, and lifestyle stress indicators.
                </p>
              </div>
            </div>

            {/* Right Col: Deep Biological Root Cause & Trigger Analysis */}
            <div className="lg:col-span-7 space-y-5">
              <div>
                <span className="font-mono text-[10px] uppercase font-bold tracking-widest text-[#005995] block mb-1">
                  PATHOPHYSIOLOGICAL ROOT CAUSE
                </span>
                <h3 className="font-serif font-semibold text-lg text-[#111827] mb-2">
                  {diagnosticReport.rootCauseTitle}
                </h3>
                <p className="font-sans text-xs sm:text-sm text-[#475569] leading-relaxed">
                  {diagnosticReport.rootCauseDescription}
                </p>
              </div>

              {/* Biological Contributing Factors */}
              <div>
                <span className="font-mono text-[10px] uppercase font-bold tracking-widest text-[#64748B] block mb-2">
                  KEY CELLULAR DRIVERS IDENTIFIED
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {diagnosticReport.biologicalFactors.map((factor, idx) => (
                    <div key={idx} className="flex items-start gap-2 text-xs text-[#334155] p-2 rounded-xl bg-[#FAFBFD] border border-[#F1F5F9]">
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#005995] shrink-0 mt-0.5" />
                      <span>{factor}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Lifestyle Correlation */}
              <div>
                <span className="font-mono text-[10px] uppercase font-bold tracking-widest text-[#64748B] block mb-2">
                  LIFESTYLE RISK FACTORS
                </span>
                <div className="flex flex-wrap gap-2">
                  {diagnosticReport.lifestyleImpacts.map((item, idx) => (
                    <div key={idx} className="p-2.5 rounded-xl bg-[#FFF7ED] border border-[#FFD699] text-xs">
                      <strong className="text-[#EB6200] block text-[11px] mb-0.5">{item.factor}</strong>
                      <span className="text-[#64748B] text-[11px]">{item.impact}</span>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          </div>
        </div>

        {/* SECTION B: TARGETED CLINICAL PRESCRIPTION PROTOCOL */}
        <div className="mb-14">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6">
            <div>
              <span className="font-mono text-xs font-bold uppercase tracking-widest text-[#005995] block mb-1">
                TARGETED CLINICAL FORMULATIONS
              </span>
              <h2 className="font-serif font-medium text-2xl sm:text-3xl text-[#111827]">
                Your Prescribed Formulations
              </h2>
              <p className="font-sans text-xs sm:text-sm text-[#64748B] mt-1">
                Formulated to work synergistically for your specific cellular profile and targeted wellness goals.
              </p>
            </div>

            {/* Quick Add Complete Routine to Bag */}
            <div className="flex items-center gap-3">
              <div className="text-right">
                <span className="font-serif font-bold text-xl text-[#111827]">
                  ₹{diagnosticReport.bundlePrice}
                </span>
                <span className="text-xs text-[#64748B] line-through block">
                  ₹{diagnosticReport.originalPrice}
                </span>
              </div>
              <button
                type="button"
                onClick={handleAddBundleToBag}
                className="px-6 py-3 rounded-full bg-[#005995] hover:bg-[#004777] text-white font-sans text-xs sm:text-sm font-semibold transition-all shadow-md hover:scale-105 cursor-pointer flex items-center gap-2"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>Add Recommended Bundle (Save 20%)</span>
              </button>
            </div>
          </div>

          {/* Prescribed Formulation Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {diagnosticReport.recommended3StepRoutine.map(stepItem => (
              <div 
                key={stepItem.product.id}
                className="rounded-3xl bg-white border border-[#E2E8F0] p-6 shadow-sm hover:shadow-md transition-all flex flex-col justify-between relative"
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

                  <div className="aspect-[4/3] w-full rounded-2xl overflow-hidden bg-[#FAFBFD] mb-4 border border-[#E2E8F0]">
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

                  <div className="p-3 rounded-xl bg-[#FAFBFD] border border-[#F1F5F9] text-[11px] text-[#475569] mb-4">
                    <strong className="text-[#111827] block mb-0.5">Doctor&apos;s Application Note:</strong>
                    {stepItem.howToUse}
                  </div>
                </div>

                <div className="pt-3 border-t border-[#F1F5F9] flex items-center gap-2">
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
                    className="px-3 py-2 rounded-full bg-[#FAFBFD] hover:bg-[#F1F5F9] text-[#64748B] text-xs font-semibold cursor-pointer border border-[#E2E8F0]"
                  >
                    Details
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* SECTION C: 90-DAY BIOLOGICAL TIMELINE DECODER */}
        <div className="rounded-3xl bg-white border border-[#E2E8F0] p-6 sm:p-8 shadow-sm mb-10">
          <span className="font-mono text-xs font-bold uppercase tracking-widest text-[#005995] block mb-1">
            PROJECTED TRANSFORMATION MILESTONES
          </span>
          <h2 className="font-serif font-medium text-2xl text-[#111827] mb-2">
            What to Expect Over 90 Days
          </h2>
          <p className="font-sans text-xs sm:text-sm text-[#64748B] mb-8">
            Biological change operates on cellular turn-around cycles. Here is your personalized response trajectory:
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-5 rounded-2xl bg-[#FAFBFD] border border-[#E2E8F0]">
              <span className="font-mono text-xs font-bold text-[#005995] block mb-1">DAY 1 – DAY 7</span>
              <h4 className="font-serif font-bold text-sm text-[#111827] mb-1">Cellular Adjustment</h4>
              <p className="font-sans text-xs text-[#64748B] leading-relaxed">
                {diagnosticReport.expectedTimeline.week1}
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-[#FAFBFD] border border-[#E2E8F0]">
              <span className="font-mono text-xs font-bold text-[#005995] block mb-1">DAY 8 – DAY 28</span>
              <h4 className="font-serif font-bold text-sm text-[#111827] mb-1">Visible Biological Shift</h4>
              <p className="font-sans text-xs text-[#64748B] leading-relaxed">
                {diagnosticReport.expectedTimeline.week4}
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-[#FAFBFD] border border-[#E2E8F0]">
              <span className="font-mono text-xs font-bold text-[#005995] block mb-1">DAY 29 – DAY 60</span>
              <h4 className="font-serif font-bold text-sm text-[#111827] mb-1">Structural Resurfacing</h4>
              <p className="font-sans text-xs text-[#64748B] leading-relaxed">
                {diagnosticReport.expectedTimeline.week8}
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-[#FAFBFD] border border-[#E2E8F0]">
              <span className="font-mono text-xs font-bold text-[#198775] block mb-1">DAY 61 – DAY 90</span>
              <h4 className="font-serif font-bold text-sm text-[#111827] mb-1">Sustained Equilibrium</h4>
              <p className="font-sans text-xs text-[#64748B] leading-relaxed">
                {diagnosticReport.expectedTimeline.week12}
              </p>
            </div>
          </div>
        </div>

        {/* SECTION D: DOCTOR'S CLINICAL GUIDANCE */}
        <div className="rounded-3xl bg-[#FAFBFD] border border-[#E2E8F0] p-6 sm:p-8">
          <div className="flex items-center gap-3 mb-4">
            <Award className="w-5 h-5 text-[#005995]" />
            <h3 className="font-serif font-bold text-lg text-[#111827]">
              Doctor&apos;s Clinical Dos & Don&apos;ts for {diagnosticReport.customerName}
            </h3>
          </div>
          <ul className="space-y-2.5">
            {diagnosticReport.clinicalTips.map((tip, idx) => (
              <li key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm text-[#475569]">
                <Check className="w-4 h-4 text-[#198775] shrink-0 mt-0.5" />
                <span>{tip}</span>
              </li>
            ))}
          </ul>
        </div>

      </div>
    );
  }

  // INTERACTIVE STEP-BY-STEP QUIZ FLOW
  return (
    <div className="w-full max-w-[960px] mx-auto px-5 sm:px-8 py-10 md:py-16">
      
      {/* Returning User Notification Banner */}
      {user?.matchAnswers && (
        <div className="max-w-xl mx-auto mb-6 p-3.5 rounded-2xl bg-[#E6F5FF] border border-[#BADCF0] flex items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-[#005995] shrink-0" />
            <span className="text-[#005995]">
              Active diagnostic assessment on file for <strong>{user.matchAnswers.customerName || user.profile.firstName}</strong>.
            </span>
          </div>
          <button
            type="button"
            onClick={handleViewSavedAssessment}
            className="shrink-0 px-3 py-1 rounded-full bg-[#005995] text-white font-semibold hover:bg-[#004777] transition-all text-[11px] cursor-pointer"
          >
            View Saved Assessment
          </button>
        </div>
      )}

      {/* Assessment Wizard Header */}
      <div className="text-center max-w-xl mx-auto mb-10">
        <span className="font-mono text-xs font-bold uppercase tracking-widest text-[#005995] block mb-2">
          WOMEN&apos;S CLINICAL WELLNESS TEST · STEP 0{step} OF 05
        </span>
        <h1 className="font-serif font-medium text-3xl sm:text-4xl text-[#111827] leading-tight mb-2">
          {step === 1 && 'Select Your Primary Wellness Concern'}
          {step === 2 && 'What Is Your Main Biological Goal?'}
          {step === 3 && 'Specific Triggers & Symptoms'}
          {step === 4 && 'Your Lifestyle & Biological Profile'}
          {step === 5 && 'Who Are We Formulating For?'}
        </h1>
        <p className="font-sans text-xs sm:text-sm text-[#64748B]">
          {step === 1 && 'Every woman is biochemically unique. Choose your focal category to dynamically calibrate clinical questions.'}
          {step === 2 && `Options dynamically customized for your ${primaryCategory.toUpperCase()} focus.`}
          {step === 3 && 'Select all matching indicators so our dermatological algorithm identifies your root cause.'}
          {step === 4 && 'Water, sleep, stress, and hormonal phases heavily influence treatment responsiveness.'}
          {step === 5 && 'Provide your name so we can generate your personalized diagnostic blueprint.'}
        </p>

        {/* Progress Bar */}
        <div className="w-full h-1.5 bg-[#E2E8F0] rounded-full overflow-hidden mt-6 max-w-xs mx-auto">
          <div 
            className="h-full bg-[#005995] rounded-full transition-all duration-300"
            style={{ width: `${(step / 5) * 100}%` }}
          />
        </div>
      </div>

      {/* STEP 1: CATEGORY SELECTION */}
      {step === 1 && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {WELLNESS_CATEGORIES.map(cat => {
              const isSelected = primaryCategory === cat.id;

              return (
                <div
                  key={cat.id}
                  onClick={() => {
                    setPrimaryCategory(cat.id as any);
                    setPrimaryGoal('');
                    setSelectedConcerns([]);
                    setSpecificTriggers([]);
                  }}
                  className={`p-6 rounded-3xl border-2 transition-all cursor-pointer flex flex-col justify-between group ${
                    isSelected
                      ? 'border-[#005995] bg-white shadow-md ring-2 ring-[#005995]/20'
                      : 'border-[#E2E8F0] bg-white hover:border-[#005995]/60 hover:shadow-2xs'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-3xl">{cat.icon}</span>
                      <span className="font-mono text-[9px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-[#FAFBFD] border border-[#E2E8F0] text-[#005995]">
                        {cat.badge}
                      </span>
                    </div>

                    <h3 className="font-serif font-bold text-lg text-[#111827] group-hover:text-[#005995] transition-colors mb-1.5">
                      {cat.title}
                    </h3>
                    <p className="font-sans text-xs text-[#64748B] leading-relaxed mb-4">
                      {cat.subtitle}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-[#F1F5F9] flex items-center justify-between text-[11px] font-mono text-[#005995]">
                    <span className="truncate">{cat.actives}</span>
                    <span className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 ${isSelected ? 'bg-[#005995] text-white' : 'border border-[#CBD5E1]'}`}>
                      {isSelected && <Check className="w-3 h-3" />}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="flex justify-end pt-4">
            <button
              type="button"
              onClick={() => setStep(2)}
              className="px-8 py-3.5 rounded-full bg-[#005995] hover:bg-[#004777] text-white font-sans text-sm font-semibold transition-all shadow-md flex items-center gap-2 cursor-pointer hover:scale-105 active:scale-95"
            >
              <span>Continue with {WELLNESS_CATEGORIES.find(c => c.id === primaryCategory)?.title}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 2: DYNAMIC PRIMARY GOAL */}
      {step === 2 && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 gap-3.5">
            {GOALS_BY_CATEGORY[primaryCategory]?.map(goal => {
              const isSelected = primaryGoal === goal.label;

              return (
                <div
                  key={goal.id}
                  onClick={() => setPrimaryGoal(goal.label)}
                  className={`p-5 rounded-2xl border-2 transition-all cursor-pointer flex items-start justify-between gap-4 ${
                    isSelected
                      ? 'border-[#005995] bg-white shadow-md ring-2 ring-[#005995]/20'
                      : 'border-[#E2E8F0] bg-white hover:border-[#005995]/60 hover:shadow-2xs'
                  }`}
                >
                  <div>
                    <h3 className="font-serif font-bold text-base text-[#111827] mb-1">
                      {goal.label}
                    </h3>
                    <p className="font-sans text-xs text-[#64748B] leading-relaxed">
                      {goal.desc}
                    </p>
                  </div>

                  <span className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 mt-1 ${isSelected ? 'bg-[#005995] text-white' : 'border border-[#CBD5E1]'}`}>
                    {isSelected && <Check className="w-3 h-3" />}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Timeline Need */}
          <div className="p-5 rounded-2xl bg-[#FAFBFD] border border-[#E2E8F0] mt-6">
            <span className="font-mono text-[10px] uppercase font-bold tracking-widest text-[#005995] block mb-2">
              HOW LONG HAVE YOU EXPERIENCED THIS CONCERN?
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              {[
                'Recent (Under 2 months)',
                'Ongoing (2–6 months)',
                'Chronic (Over 6 months)',
              ].map(item => (
                <button
                  key={item}
                  type="button"
                  onClick={() => setSeverity(item)}
                  className={`p-3 rounded-xl text-xs font-sans font-medium border text-left cursor-pointer transition-all ${
                    severity === item
                      ? 'bg-white border-[#005995] text-[#005995] font-semibold shadow-2xs'
                      : 'bg-white border-[#E2E8F0] text-[#64748B] hover:border-[#CBD5E1]'
                  }`}
                >
                  {item}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-between pt-4">
            <button
              type="button"
              onClick={() => setStep(1)}
              className="px-6 py-3 rounded-full border border-[#E2E8F0] bg-white hover:bg-[#FAFBFD] text-xs font-semibold text-[#111827] flex items-center gap-2 cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back</span>
            </button>

            <button
              type="button"
              onClick={() => setStep(3)}
              disabled={!primaryGoal}
              className={`px-8 py-3.5 rounded-full font-sans text-sm font-semibold transition-all flex items-center gap-2 ${
                primaryGoal
                  ? 'bg-[#005995] hover:bg-[#004777] text-white shadow-md cursor-pointer hover:scale-105 active:scale-95'
                  : 'bg-[#E2E8F0] text-[#94A3B8] cursor-not-allowed'
              }`}
            >
              <span>Next: Symptom Deep-Dive</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 3: DYNAMIC SYMPTOMS & TRIGGERS */}
      {step === 3 && (
        <div className="space-y-8">
          {SYMPTOMS_BY_CATEGORY[primaryCategory]?.map((section, sIdx) => (
            <div key={sIdx} className="p-6 rounded-3xl bg-white border border-[#E2E8F0] shadow-sm">
              <span className="font-mono text-[10px] uppercase font-bold tracking-widest text-[#005995] block mb-1">
                FACTOR 0{sIdx + 1}
              </span>
              <h3 className="font-serif font-bold text-lg text-[#111827] mb-1">
                {section.title}
              </h3>
              <p className="font-sans text-xs text-[#64748B] mb-4">
                {section.subtitle}
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {section.options.map((opt, oIdx) => {
                  const isChecked = selectedConcerns.includes(opt) || specificTriggers.includes(opt);

                  return (
                    <button
                      key={oIdx}
                      type="button"
                      onClick={() => {
                        toggleConcern(opt);
                        toggleTrigger(opt);
                      }}
                      className={`p-3.5 rounded-2xl text-left border transition-all cursor-pointer flex items-center justify-between gap-3 ${
                        isChecked
                          ? 'border-[#005995] bg-[#E6F5FF]/40 text-[#005995] font-semibold'
                          : 'border-[#E2E8F0] bg-white text-[#475569] hover:border-[#005995]/50'
                      }`}
                    >
                      <span className="text-xs font-sans">{opt}</span>
                      <span className={`w-4 h-4 rounded flex items-center justify-center shrink-0 ${isChecked ? 'bg-[#005995] text-white' : 'border border-[#CBD5E1]'}`}>
                        {isChecked && <Check className="w-3 h-3" />}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          ))}

          <div className="flex items-center justify-between pt-4">
            <button
              type="button"
              onClick={() => setStep(2)}
              className="px-6 py-3 rounded-full border border-[#E2E8F0] bg-white hover:bg-[#FAFBFD] text-xs font-semibold text-[#111827] flex items-center gap-2 cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back</span>
            </button>

            <button
              type="button"
              onClick={() => setStep(4)}
              className="px-8 py-3.5 rounded-full bg-[#005995] hover:bg-[#004777] text-white font-sans text-sm font-semibold transition-all shadow-md flex items-center gap-2 cursor-pointer hover:scale-105 active:scale-95"
            >
              <span>Next: Lifestyle Indicators</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 4: LIFESTYLE & BIOLOGICAL MODIFIERS */}
      {step === 4 && (
        <div className="space-y-6">
          <div className="p-6 rounded-3xl bg-white border border-[#E2E8F0] shadow-sm space-y-6">
            
            {/* Age Group */}
            <div>
              <label className="font-mono text-xs font-bold text-[#111827] uppercase tracking-wider block mb-2">
                1. Age Group
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                {['18–24 years', '25–34 years', '35–44 years', '45+ years'].map(item => (
                  <button
                    key={item}
                    type="button"
                    onClick={() => setAgeGroup(item)}
                    className={`py-2.5 px-3 rounded-xl text-xs font-sans text-center border cursor-pointer transition-all ${
                      ageGroup === item
                        ? 'bg-[#005995] text-white border-[#005995] font-semibold shadow-xs'
                        : 'bg-[#FAFBFD] text-[#64748B] border-[#E2E8F0] hover:border-[#CBD5E1]'
                    }`}
                  >
                    {item}
                  </button>
                ))}
              </div>
            </div>

            {/* Daily Water Intake */}
            <div>
              <label className="font-mono text-xs font-bold text-[#111827] uppercase tracking-wider block mb-2">
                2. Daily Water Hydration
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                {['Less than 1 Litre', '1.5 – 2.5 Litres', 'Over 3 Litres daily'].map(item => (
                  <button
                    key={item}
                    type="button"
                    onClick={() => setWaterIntake(item)}
                    className={`py-2.5 px-3 rounded-xl text-xs font-sans text-center border cursor-pointer transition-all ${
                      waterIntake === item
                        ? 'bg-[#005995] text-white border-[#005995] font-semibold shadow-xs'
                        : 'bg-[#FAFBFD] text-[#64748B] border-[#E2E8F0] hover:border-[#CBD5E1]'
                    }`}
                  >
                    {item}
                  </button>
                ))}
              </div>
            </div>

            {/* Sleep Duration */}
            <div>
              <label className="font-mono text-xs font-bold text-[#111827] uppercase tracking-wider block mb-2">
                3. Average Nightly Sleep
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                {['Under 6 hours (erratic)', '6 – 7 hours (standard)', '8+ hours (restorative)'].map(item => (
                  <button
                    key={item}
                    type="button"
                    onClick={() => setSleepHours(item)}
                    className={`py-2.5 px-3 rounded-xl text-xs font-sans text-center border cursor-pointer transition-all ${
                      sleepHours === item
                        ? 'bg-[#005995] text-white border-[#005995] font-semibold shadow-xs'
                        : 'bg-[#FAFBFD] text-[#64748B] border-[#E2E8F0] hover:border-[#CBD5E1]'
                    }`}
                  >
                    {item}
                  </button>
                ))}
              </div>
            </div>

            {/* Stress Index */}
            <div>
              <label className="font-mono text-xs font-bold text-[#111827] uppercase tracking-wider block mb-2">
                4. Daily Stress & Cortisol Load
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                {['High workload / frequent anxiety', 'Moderate daily stress', 'Low stress / balanced routine'].map(item => (
                  <button
                    key={item}
                    type="button"
                    onClick={() => setStressLevel(item)}
                    className={`py-2.5 px-3 rounded-xl text-xs font-sans text-center border cursor-pointer transition-all ${
                      stressLevel === item
                        ? 'bg-[#005995] text-white border-[#005995] font-semibold shadow-xs'
                        : 'bg-[#FAFBFD] text-[#64748B] border-[#E2E8F0] hover:border-[#CBD5E1]'
                    }`}
                  >
                    {item}
                  </button>
                ))}
              </div>
            </div>

            {/* Diet Pattern */}
            <div>
              <label className="font-mono text-xs font-bold text-[#111827] uppercase tracking-wider block mb-2">
                5. Dietary Nutrition Pattern
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                {['Vegetarian', 'Non-Vegetarian', 'Vegan / Plant-based', 'Gluten/Dairy Sensitive'].map(item => (
                  <button
                    key={item}
                    type="button"
                    onClick={() => setDietType(item)}
                    className={`py-2.5 px-3 rounded-xl text-xs font-sans text-center border cursor-pointer transition-all ${
                      dietType === item
                        ? 'bg-[#005995] text-white border-[#005995] font-semibold shadow-xs'
                        : 'bg-[#FAFBFD] text-[#64748B] border-[#E2E8F0] hover:border-[#CBD5E1]'
                    }`}
                  >
                    {item}
                  </button>
                ))}
              </div>
            </div>

          </div>

          <div className="flex items-center justify-between pt-4">
            <button
              type="button"
              onClick={() => setStep(3)}
              className="px-6 py-3 rounded-full border border-[#E2E8F0] bg-white hover:bg-[#FAFBFD] text-xs font-semibold text-[#111827] flex items-center gap-2 cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back</span>
            </button>

            <button
              type="button"
              onClick={() => setStep(5)}
              className="px-8 py-3.5 rounded-full bg-[#005995] hover:bg-[#004777] text-white font-sans text-sm font-semibold transition-all shadow-md flex items-center gap-2 cursor-pointer hover:scale-105 active:scale-95"
            >
              <span>Next: Customer Details</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 5: CUSTOMER INFORMATION */}
      {step === 5 && (
        <div className="space-y-6 max-w-lg mx-auto">
          <div className="p-8 rounded-3xl bg-white border border-[#E2E8F0] shadow-sm space-y-5">
            <div className="w-12 h-12 rounded-2xl bg-[#E6F5FF] text-[#005995] flex items-center justify-center mb-2">
              <User className="w-6 h-6" />
            </div>

            <h3 className="font-serif font-bold text-xl text-[#111827]">
              Final Step: Personalize Your Clinical Report
            </h3>
            <p className="font-sans text-xs text-[#64748B] leading-relaxed">
              We engineer your specific product matches and generate your 90-day biological blueprint under your personal diagnosis ID.
            </p>

            <div>
              <label className="font-mono text-xs font-bold text-[#111827] uppercase tracking-wider block mb-1.5">
                Your First Name *
              </label>
              <input
                type="text"
                required
                value={customerName}
                onChange={e => setCustomerName(e.target.value)}
                placeholder="e.g. Priya, Sneha"
                className="w-full px-4 py-3 rounded-xl border border-[#CBD5E1] bg-[#FAFBFD] text-sm font-sans focus:outline-none focus:ring-2 focus:ring-[#005995]"
              />
            </div>

            <div>
              <label className="font-mono text-xs font-bold text-[#111827] uppercase tracking-wider block mb-1.5">
                Email Address (Optional)
              </label>
              <input
                type="email"
                value={customerEmail}
                onChange={e => setCustomerEmail(e.target.value)}
                placeholder="to receive your doctor notes copy"
                className="w-full px-4 py-3 rounded-xl border border-[#CBD5E1] bg-[#FAFBFD] text-sm font-sans focus:outline-none focus:ring-2 focus:ring-[#005995]"
              />
            </div>

            <div className="pt-2 text-[11px] text-[#64748B] font-sans flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-[#198775] shrink-0" />
              <span>100% confidential. No spam. Doctor certified recommendation.</span>
            </div>
          </div>

          <div className="flex items-center justify-between pt-4">
            <button
              type="button"
              onClick={() => setStep(4)}
              className="px-6 py-3 rounded-full border border-[#E2E8F0] bg-white hover:bg-[#FAFBFD] text-xs font-semibold text-[#111827] flex items-center gap-2 cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back</span>
            </button>

            <button
              type="button"
              onClick={handleRunAssessment}
              disabled={!customerName.trim()}
              className={`px-8 py-3.5 rounded-full font-sans text-sm font-semibold transition-all flex items-center gap-2 ${
                customerName.trim()
                  ? 'bg-[#005995] hover:bg-[#004777] text-white shadow-md cursor-pointer hover:scale-105 active:scale-95'
                  : 'bg-[#E2E8F0] text-[#94A3B8] cursor-not-allowed'
              }`}
            >
              <Sparkles className="w-4 h-4 text-[#FFD699]" />
              <span>Analyze & Generate My Protocol</span>
            </button>
          </div>
        </div>
      )}

    </div>
  );
};
