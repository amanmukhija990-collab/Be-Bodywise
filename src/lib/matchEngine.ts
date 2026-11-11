import { CatalogueProduct, MatchAnswers } from '../types';
import { CATALOGUE_PRODUCTS } from '../data/catalogue';

export interface MatchResult {
  product: CatalogueProduct;
  score: number;
  whyThisSuitsYou: string[];
}

export interface DiagnosticStepProduct {
  role: string;
  stepNumber: number;
  product: CatalogueProduct;
  why: string;
  howToUse: string;
}

export interface CustomerDiagnosticProfile {
  customerName: string;
  primaryCategory: 'hair' | 'skin' | 'body' | 'pcos' | 'nutrition';
  categoryTitle: string;
  personaType: string;
  biologicalType: string;
  rootCauseTitle: string;
  rootCauseDescription: string;
  severityScore: number;
  severityLevel: 'Mild' | 'Moderate' | 'Chronic';
  biologicalFactors: string[];
  lifestyleImpacts: { factor: string; impact: string }[];
  expectedTimeline: {
    week1: string;
    week4: string;
    week8: string;
    week12: string;
  };
  clinicalTips: string[];
  recommended3StepRoutine: DiagnosticStepProduct[];
  bundlePrice: number;
  originalPrice: number;
  discountPercentage: number;
}

export function generateDiagnosticProfile(answers: MatchAnswers): CustomerDiagnosticProfile {
  const category = answers.primaryCategory || 
    (answers.focus.includes('body') ? 'body' : answers.focus.includes('hair') ? 'hair' : 'skin');
  const name = answers.customerName?.trim() || 'Wellness Seeker';
  const concernsList = answers.concerns || [];
  const severityStr = answers.severity || 'Moderate';
  const lifestyle = answers.lifestyle || {};

  const findProd = (id: string): CatalogueProduct => {
    return CATALOGUE_PRODUCTS.find(p => p.id === id) || CATALOGUE_PRODUCTS[0];
  };

  // Base severity computation
  let severityScore = 65;
  if (severityStr.includes('Heavy') || severityStr.includes('Severe') || severityStr.includes('Chronic')) {
    severityScore = 88;
  } else if (severityStr.includes('Mild') || severityStr.includes('Early')) {
    severityScore = 48;
  }

  // Generate Profile by Primary Category
  if (category === 'hair') {
    const isDandruff = concernsList.some(c => c.toLowerCase().includes('dandruff') || c.toLowerCase().includes('itch'));
    const isThinning = concernsList.some(c => c.toLowerCase().includes('thinning') || c.toLowerCase().includes('density'));
    
    const personaType = isThinning
      ? 'Follicular Miniaturization & DHT Sensitivity'
      : isDandruff
      ? 'Microbiome Sebum Imbalance with Malassezia Overgrowth'
      : 'Telogen Effluvium & Root Stress Dysregulation';

    const rootCause = isThinning
      ? 'Elevated 5-alpha reductase activity around the crown follicle sheath leads to shortened anagen (growth) phases, causing premature shedding and miniaturised fine hair strands.'
      : isDandruff
      ? 'Overactive sebaceous glands oxidize surface fatty acids, feeding Malassezia yeast and causing rapid epidermal flaking, itchiness, and weakened hair anchorage.'
      : 'Nutritional depletion of bio-available micronutrients (biotin, zinc, folic acid) paired with high cortisol shifts active follicles into the resting telogen phase.';

    const step1Prod = isDandruff ? findProd('prod-hair-3') : findProd('prod-hair-2');
    const step2Prod = findProd('prod-hair-1');
    const step3Prod = findProd('prod-hair-gummies');

    const bundle = [
      {
        stepNumber: 1,
        role: isDandruff ? 'Scalp Clarifying & Anti-Fungal Cleanse' : 'Follicle Strengthening Shampoo',
        product: step1Prod,
        why: isDandruff ? '1% Salicylic Acid clears micro-crusts while Piroctone Olamine targets fungal root triggers.' : 'Strengthens cuticles and minimises shower drag shedding with plant keratin.',
        howToUse: '2–3 times weekly in shower. Leave on scalp for 2 minutes before rinsing.',
      },
      {
        stepNumber: 2,
        role: 'Clinical Root Reactivation Serum',
        product: step2Prod,
        why: 'Procapil + Redensyl stimulates anagen cellular mitosis and anchors the hair bulb to scalp dermis.',
        howToUse: 'Apply 1ml dropper daily at bedtime directly to thinning partition lines. Massage gently; do not rinse.',
      },
      {
        stepNumber: 3,
        role: 'Inside-Out Follicle Nutrition',
        product: step3Prod,
        why: '5000mcg Sesbania Biotin, Zinc, and Keratin boosters feed the vascular papilla from within.',
        howToUse: 'Chew 1 delicious gummy daily after breakfast.',
      },
    ];

    const original = bundle.reduce((acc, s) => acc + (s.product.mrp || s.product.price * 1.25), 0);
    const selling = bundle.reduce((acc, s) => acc + s.product.price, 0);

    return {
      customerName: name,
      primaryCategory: 'hair',
      categoryTitle: 'Hair Biology & Scalp Density',
      personaType,
      biologicalType: 'Follicular Phase Deficiency (Type H-2)',
      rootCauseTitle: 'Scalp Micro-Vascular & Follicular Anchoring Impairment',
      rootCauseDescription: rootCause,
      severityScore,
      severityLevel: severityScore > 75 ? 'Chronic' : severityScore > 50 ? 'Moderate' : 'Mild',
      biologicalFactors: [
        'Shortened anagen (growth) phase cycle',
        'Scalp micro-inflammation around follicle bulbs',
        'Keratin sheath depletion from heat or styling friction',
        'Nutritional gap in elemental zinc and active biotin',
      ],
      lifestyleImpacts: [
        { factor: `Sleep: ${lifestyle.sleepHours || '6-7 hours'}`, impact: 'Cortisol elevation triggers resting telogen state' },
        { factor: `Water: ${lifestyle.waterIntake || '1-2L'}`, impact: 'Low hydration slows scalp blood circulation' },
        { factor: `Stress Level: ${lifestyle.stressLevel || 'Moderate'}`, impact: 'Triggers vasoconstriction in dermal capillaries' },
      ],
      expectedTimeline: {
        week1: 'Decreased scalp redness, itching relief, and normalized oil production.',
        week4: 'Noticeable 40–55% decrease in hair fall during shower and brushing.',
        week8: 'Emergence of fine baby hair fuzz along the hairline and crown partition.',
        week12: 'Thicker strand diameter and renewed structural density verified across scalp.',
      },
      clinicalTips: [
        'Avoid tight ponytails or friction-causing rubber bands that induce traction alopecia.',
        'Never apply scalp serums onto heavily oiled hair; active serums require clean scalp skin for trans-follicular absorption.',
        'Wash hair with lukewarm or cool water—hot water strips sebum and triggers reactive shedding.',
      ],
      recommended3StepRoutine: bundle,
      bundlePrice: Math.round(selling * 0.8), // 20% bundle discount
      originalPrice: Math.round(original),
      discountPercentage: 20,
    };
  }

  if (category === 'body') {
    const isBacne = concernsList.some(c => c.toLowerCase().includes('bacne') || c.toLowerCase().includes('acne'));
    const isStrawberry = concernsList.some(c => c.toLowerCase().includes('strawberry') || c.toLowerCase().includes('kp') || c.toLowerCase().includes('bumpy'));
    const isUnderarm = concernsList.some(c => c.toLowerCase().includes('underarm') || c.toLowerCase().includes('odour') || c.toLowerCase().includes('dark'));

    const personaType = isBacne
      ? 'Body Pore Hyper-Keratinization with Cutibacterium Biofilm'
      : isStrawberry
      ? 'Follicular Keratin Plugs & Micro-Texture Retention (KP)'
      : 'Friction-Induced Melanogenesis & Microbial Odour Cascade';

    const rootCause = isBacne
      ? 'Body skin is 3x thicker than facial skin with dense sebaceous networks. Friction from clothing and sweat traps sebum and dead keratin cells, creating deep follicular plugs that become inflamed pustules.'
      : isStrawberry
      ? 'Keratosis Pilaris occurs when excess keratin protein forms hard microscopic plugs at the mouth of hair follicles on arms and legs, leading to red or dark "strawberry" spots and rough texture.'
      : 'Shaving razor micro-friction and aluminium antiperspirants trigger reactive melanin production while surface Corynebacterium bacteria digest sweat into volatile fatty acid odour.';

    let step1Prod = findProd('prod-body-3'); // 1% Salicylic Acid Wash
    let step2Prod = isStrawberry ? findProd('prod-body-1') : isUnderarm ? findProd('prod-body-2') : findProd('prod-body-1');
    let step3Prod = isUnderarm ? findProd('prod-body-niacinamide-lotion') : findProd('prod-body-gummies');

    const bundle: DiagnosticStepProduct[] = [
      {
        stepNumber: 1,
        role: 'Micro-Exfoliating BHA Body Cleanse',
        product: step1Prod,
        why: '1% Salicylic Acid is lipophilic; it penetrates through body sebum into deep follicular pores to dissolve trapped debris and bacne plugs.',
        howToUse: 'Lather onto wet chest, back, and shoulders. Allow 1–2 minutes contact time in shower before rinsing.',
      },
      {
        stepNumber: 2,
        role: isStrawberry ? '10% AHA Chemical Resurfacing Lotion' : isUnderarm ? '4% AHA BHA Mandelic Roll-On' : '10% AHA Exfoliating Lotion',
        product: step2Prod,
        why: isStrawberry ? '8% Lactic + 2% Glycolic Acid gently dissolve keratin plugs, smoothing bumpy strawberry legs within 28 days.' : 'Mandelic Acid lowers pH to stop odour bacteria while Alpha Arbutin lightens friction darkening.',
        howToUse: 'Apply at night onto clean, dry skin. Do not apply immediately after razor shaving.',
      },
      {
        stepNumber: 3,
        role: isUnderarm ? 'Targeted Niacinamide Dark Spot Lotion' : 'Inside-Out Metabolic & Gut Support',
        product: step3Prod,
        why: isUnderarm ? '10% Niacinamide + Tranexamic Acid inhibit melanosome transfer on stubborn friction dark spots.' : 'Real unfiltered ACV gummies support digestive enzymes to reduce systemic skin inflammation and gut bloating.',
        howToUse: isUnderarm ? 'Smooth evenly over dark areas daily.' : 'Chew 1 gummy 20 minutes before breakfast.',
      },
    ];

    const original = bundle.reduce((acc, s) => acc + (s.product.mrp || s.product.price * 1.25), 0);
    const selling = bundle.reduce((acc, s) => acc + s.product.price, 0);

    return {
      customerName: name,
      primaryCategory: 'body',
      categoryTitle: 'Body Dermatology & Barrier Resurfacing',
      personaType,
      biologicalType: 'Epidermal Keratin Retention (Type B-1)',
      rootCauseTitle: 'Thickened Stratum Corneum & Follicular Sebum Retention',
      rootCauseDescription: rootCause,
      severityScore,
      severityLevel: severityScore > 75 ? 'Chronic' : severityScore > 50 ? 'Moderate' : 'Mild',
      biologicalFactors: [
        'Body skin turnover rate is slower (45 days vs 28 days on face)',
        'Frictional clothing traps moisture and triggers bacterial bloom',
        'Physical scrubs worsen KP by tearing follicular margins',
        'Aluminium salts in traditional roll-ons clog underarm apocrine glands',
      ],
      lifestyleImpacts: [
        { factor: 'Workout & Sweat Routine', impact: 'Delayed shower after workouts allows sebum crystallization' },
        { factor: 'Shaving / Hair Removal', impact: 'Dull razor blades cause micro-nicks and post-inflammatory pigmentation' },
        { factor: `Hydration: ${lifestyle.waterIntake || '1-2L'}`, impact: 'Dehydrated body skin over-produces keratin plugs' },
      ],
      expectedTimeline: {
        week1: 'Immediate reduction in underarm odour and surface redness; body feels softer.',
        week4: 'Active bacne spots dry out; rough strawberry bumpiness softens by 45%.',
        week8: 'Post-inflammatory brown marks fade; arm and leg texture becomes smooth to the touch.',
        week12: 'Clear, radiant body skin with resilient barrier and zero recurrences.',
      },
      clinicalTips: [
        'Always switch to breathable, loose cotton clothing immediately after exercising.',
        'Never physically scrub strawberry skin with harsh walnut/loofah sponges—use chemical AHA/BHA exfoliants instead.',
        'Wait 24–48 hours after waxing before applying AHA body lotions.',
      ],
      recommended3StepRoutine: bundle,
      bundlePrice: Math.round(selling * 0.8),
      originalPrice: Math.round(original),
      discountPercentage: 20,
    };
  }

  if (category === 'pcos') {
    const personaType = 'Insulin-Mediated Androgenic Hormone Dysregulation';
    const rootCause = 'Insulin resistance drives ovarian theca cells to overproduce free androgens (testosterone and DHT). This biological surge triggers jawline hormonal cystic acne, delayed/missed menstrual cycles, abdominal gut bloating, and sleep/mood fatigue.';

    const step1Prod = findProd('prod-skin-1'); // 2% Salicylic Face Serum for hormonal chin breakouts
    const step2Prod = findProd('prod-skin-2'); // 10% Niacinamide
    const step3Prod = findProd('prod-pcos-gummies'); // 40:1 Inositol PCOS Gummies

    const bundle: DiagnosticStepProduct[] = [
      {
        stepNumber: 1,
        role: 'Topical Hormonal Breakout Clarifier',
        product: step1Prod,
        why: 'Salicylic Acid unblocks deep cystic hormonal flare-ups along jawline, chin, and chest.',
        howToUse: 'Dab 2 drops directly onto jawline and chin breakout zones at night before moisturiser.',
      },
      {
        stepNumber: 2,
        role: 'Sebum & Redness Barrier Serum',
        product: step2Prod,
        why: '10% Niacinamide normalizes androgen-stimulated sebum flow and prevents post-breakout dark marks.',
        howToUse: 'Apply 3 drops across entire face every morning.',
      },
      {
        stepNumber: 3,
        role: 'Endocrine & Cycle Balancing Gummies',
        product: step3Prod,
        why: '40:1 Myo-Inositol to D-Chiro-Inositol ratio clinically proven to restore ovulatory regularity and cut cravings.',
        howToUse: 'Chew 2 gummies daily with breakfast. Recommended for a minimum 90-day continuous protocol.',
      },
    ];

    const original = bundle.reduce((acc, s) => acc + (s.product.mrp || s.product.price * 1.25), 0);
    const selling = bundle.reduce((acc, s) => acc + s.product.price, 0);

    return {
      customerName: name,
      primaryCategory: 'pcos',
      categoryTitle: 'Hormonal Wellness & Menstrual Rhythm',
      personaType,
      biologicalType: 'Endocrine-Metabolic Sensitivity (Type P-40)',
      rootCauseTitle: 'Insulin Resistance & Ovarian Androgen Imbalance',
      rootCauseDescription: rootCause,
      severityScore: Math.max(severityScore, 70),
      severityLevel: severityScore > 75 ? 'Chronic' : 'Moderate',
      biologicalFactors: [
        'Imbalanced 40:1 Inositol ratio affecting ovarian glucose signaling',
        'Excess free androgens stimulating lower-face sebaceous glands',
        'Gut dysbiosis contributing to systemic inflammation and PMS bloat',
        'Melatonin dysregulation affecting luteal phase sleep quality',
      ],
      lifestyleImpacts: [
        { factor: `Stress Index: ${lifestyle.stressLevel || 'High'}`, impact: 'Adrenal cortisol spikes compete with progesterone' },
        { factor: `Diet Pattern: ${lifestyle.dietType || 'Standard'}`, impact: 'Refined carbohydrates amplify insulin resistance spikes' },
        { factor: `Sleep: ${lifestyle.sleepHours || '6-7 hours'}`, impact: 'Sub-7 hour sleep reduces cellular insulin sensitivity by 30%' },
      ],
      expectedTimeline: {
        week1: 'Noticeable reduction in sugar cravings and daily afternoon energy crashes.',
        week4: 'PMS bloating and jawline inflammatory soreness calm significantly.',
        week8: 'Menstrual cycle timing begins to regularize toward standard 28–35 day intervals.',
        week12: 'Sustained hormonal equilibrium, clear facial skin, and improved vitality.',
      },
      clinicalTips: [
        'Pair 40:1 Inositol intake with consistent sleep hygiene to optimize metabolic circadian rhythm.',
        'Prioritize low-glycemic complex carbohydrates to minimize rapid insulin spikes after meals.',
        'Do not skip meals; erratic eating patterns trigger compensatory cortisol surges.',
      ],
      recommended3StepRoutine: bundle,
      bundlePrice: Math.round(selling * 0.8),
      originalPrice: Math.round(original),
      discountPercentage: 20,
    };
  }

  // Fallback: Skin & Face
  const isAcne = concernsList.some(c => c.toLowerCase().includes('acne') || c.toLowerCase().includes('breakout') || c.toLowerCase().includes('pore'));
  const isPigmentation = concernsList.some(c => c.toLowerCase().includes('pigment') || c.toLowerCase().includes('spot') || c.toLowerCase().includes('dull'));

  const personaType = isAcne
    ? 'Sebaceous Hyper-Secretory Skin with Cutibacterium Tendency'
    : isPigmentation
    ? 'Post-Inflammatory Hyperpigmentation & Oxidative Melanin Activity'
    : 'Compromised Lipid Barrier with Transepidermal Moisture Loss';

  const rootCause = isAcne
    ? 'Hyperactive sebaceous glands produce thick, sticky sebum that blocks follicular funnels, creating an anaerobic breeding ground for Cutibacterium acnes.'
    : isPigmentation
    ? 'UV exposure and past acne lesions trigger melanocytes to deposit dense melanin pigment clusters in the deeper dermal-epidermal junction.'
    : 'Depletion of intercellular ceramides and fatty acids allows environmental irritants to breach the skin barrier while hydration evaporates rapidly.';

  const step1Prod = isAcne ? findProd('prod-skin-1') : findProd('prod-skin-4');
  const step2Prod = isAcne ? findProd('prod-skin-2') : findProd('prod-skin-3');
  const step3Prod = findProd('prod-skin-gummies');

  const bundle: DiagnosticStepProduct[] = [
    {
      stepNumber: 1,
      role: isAcne ? 'BHA Pore Cleansing Active' : '15% Antioxidant Vitamin C Shield',
      product: step1Prod,
      why: isAcne ? '2% Salicylic Acid unclogs pore linings and controls surface lipid shine.' : '3-O-Ethyl Ascorbic Acid halts melanin synthesis and shields dermal collagen.',
      howToUse: isAcne ? 'Apply 3 drops at night on clean skin.' : 'Apply 3 drops every morning before moisturiser.',
    },
    {
      stepNumber: 2,
      role: isAcne ? '10% Niacinamide + Zinc Sebum Regulator' : 'Kojic + Alpha Arbutin Spot Corrector',
      product: step2Prod,
      why: isAcne ? 'Niacinamide reduces oiliness while Zinc PCA calms redness.' : 'Alpha Arbutin and Kojic Acid inhibit tyrosinase to erase stubborn dark marks.',
      howToUse: 'Smooth over target areas morning and evening.',
    },
    {
      stepNumber: 3,
      role: 'Dermal Radiance & Cellular Glutathione Gummies',
      product: step3Prod,
      why: 'Oral L-Glutathione, Hyaluronic Acid & Vitamin C amplify topical serum efficacy from within.',
      howToUse: 'Chew 1 gummy every morning after breakfast.',
    },
  ];

  const original = bundle.reduce((acc, s) => acc + (s.product.mrp || s.product.price * 1.25), 0);
  const selling = bundle.reduce((acc, s) => acc + s.product.price, 0);

  return {
    customerName: name,
    primaryCategory: 'skin',
    categoryTitle: 'Facial Dermatology & Barrier Science',
    personaType,
    biologicalType: 'Stratum Corneum Imbalance (Type S-3)',
    rootCauseTitle: 'Sebum-Lipid Dysregulation & Melanosome Transfer',
    rootCauseDescription: rootCause,
    severityScore,
    severityLevel: severityScore > 75 ? 'Chronic' : severityScore > 50 ? 'Moderate' : 'Mild',
    biologicalFactors: [
      'Elevated sebum production oxidizing pore openings',
      'Tyrosinase enzyme hyper-activity triggering dark spots',
      'Micro-barrier degradation leading to trans-epidermal water loss (TEWL)',
      'Sub-optimal antioxidant defenses against daily urban pollution',
    ],
    lifestyleImpacts: [
      { factor: `Sunscreen: ${lifestyle.waterIntake || 'Inconsistent'}`, impact: 'Unprotected UV exposure deepens existing melanin deposits' },
      { factor: `Stress: ${lifestyle.stressLevel || 'Moderate'}`, impact: 'Elevated corticotropin triggers facial sebocytes' },
      { factor: `Sleep: ${lifestyle.sleepHours || '7 hours'}`, impact: 'Nighttime cellular repair peak is reduced' },
    ],
    expectedTimeline: {
      week1: 'Oiliness is balanced throughout daytime; zero dry tightness after cleansing.',
      week4: 'Active pustules and redness flatten; skin texture feels significantly refined.',
      week8: 'Post-acne brown marks and sun spots visibly fade; tone becomes even and bright.',
      week12: 'Stable, luminous skin barrier resilient against recurring seasonal flare-ups.',
    },
    clinicalTips: [
      'Always follow active chemical acids with a broad-spectrum SPF 50 sunscreen.',
      'Do not pick or pop active breakouts—manual trauma forces pigment into deeper dermal layers, creating scars that take 6+ months to heal.',
      'Allow each serum layer 60 seconds to absorb before applying your barrier cream.',
    ],
    recommended3StepRoutine: bundle,
    bundlePrice: Math.round(selling * 0.8),
    originalPrice: Math.round(original),
    discountPercentage: 20,
  };
}

export function calculateProductMatches(answers: MatchAnswers): MatchResult[] {
  const { focus, skinType, concerns, reactivity, commitment } = answers;

  const countToReturn = commitment === 'minimal' ? 3 : commitment === 'balanced' ? 4 : 6;

  const userReactivityNum = reactivity.includes('Rarely') ? 1 : reactivity.includes('Sometimes') ? 2 : 3;

  const results: MatchResult[] = CATALOGUE_PRODUCTS.map(product => {
    // 1. Focus / Category Fit (20%)
    const categoryFit = focus.includes(product.category) ? 1.0 : 0.1;

    // 2. Concern Overlap (40%)
    let concernMatches = 0;
    if (concerns.length > 0) {
      concernMatches = product.concerns.filter(c => concerns.includes(c)).length;
    }
    const concernScore = concerns.length > 0
      ? Math.min(1.0, concernMatches / Math.min(2, concerns.length))
      : 0.5;

    // 3. Skin-type Fit (15%)
    let skinTypeScore = 0.8;
    if (product.category === 'skin' && skinType) {
      if (product.skinTypes && product.skinTypes.includes(skinType)) {
        skinTypeScore = 1.0;
      } else {
        skinTypeScore = 0.4;
      }
    }

    // 4. Reactivity tolerance (15%)
    // If user reacts easily (3), products with high reactivity (2 or 3) score lower unless gentle (1)
    let reactivityScore = 0.8;
    if (userReactivityNum === 3) {
      reactivityScore = product.reactivity === 1 ? 1.0 : 0.5;
    } else if (userReactivityNum === 2) {
      reactivityScore = product.reactivity <= 2 ? 1.0 : 0.7;
    } else {
      reactivityScore = 1.0;
    }

    // 5. Timeline / Commitment fit (10%)
    const timelineFit = 0.9;

    const rawScore = 100 * (
      concernScore * 0.40 +
      categoryFit * 0.20 +
      skinTypeScore * 0.15 +
      reactivityScore * 0.15 +
      timelineFit * 0.10
    );

    // Clamped 40 - 98
    const clampedScore = Math.min(98, Math.max(40, Math.round(rawScore)));

    // Generate the 3 bullets for "Why this suits you"
    const matchedConcern = product.concerns.find(c => concerns.includes(c)) || product.concerns[0] || 'balanced wellness';
    const firstChangeWeek = Math.ceil(product.timeline.firstChangeDay / 7);

    const whyThisSuitsYou = [
      `Targets your concern: ${matchedConcern.toLowerCase()}`,
      `Key actives: ${product.actives.slice(0, 2).join(', ')}`,
      `Realistic timeline: first visible change around week ${firstChangeWeek}`,
    ];

    return {
      product,
      score: clampedScore,
      whyThisSuitsYou,
    };
  });

  // Sort descending by score
  results.sort((a, b) => b.score - a.score);

  return results.slice(0, countToReturn);
}
