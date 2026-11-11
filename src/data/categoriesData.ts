export interface CategoryData {
  id: string;
  name: string;
  shortName: string;
  path: string;
  tagline: string;
  headline: string;
  description: string;
  badge: string;
  image: string;
  accent: string;
  bg: string;
  border: string;
  doctorNote: string;
  subcategories: string[];
  targetConcerns: string[];
  faqs: { q: string; a: string }[];
}

export const NAV_DROPDOWN_CATEGORIES = [
  { name: 'Hair', path: '/category/hair', id: 'hair' },
  { name: 'Body Care', path: '/category/body', id: 'body' },
  { name: 'Winter Care', path: '/category/winter', id: 'winter' },
  { name: 'Health & Fitness', path: '/category/health-fitness', id: 'health-fitness' },
  { name: 'Special Offers Unlocked', path: '/category/special-offers', id: 'special-offers' },
  { name: 'Sun Protection', path: '/category/sun', id: 'sun' },
  { name: 'Face', path: '/category/face', id: 'face' },
];

export const CATEGORIES_DATA: CategoryData[] = [
  {
    id: 'hair',
    name: 'Hair',
    shortName: 'Hair',
    path: '/category/hair',
    tagline: 'Growth Serums, Shampoos & Biotin',
    headline: 'Clinical Trichology for Hair Fall & Density Rebuilding',
    description: 'Science-backed formulations powered by Procapil, Redensyl, and 5000mcg Sesbania Biotin engineered to reactivate dormant hair follicles and cut shower shedding.',
    badge: 'PROCAPIL + BIOTIN',
    image: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=700&q=80',
    accent: 'text-[#005995]',
    bg: 'bg-[#F0F6FA]',
    border: 'border-[#BADCF0]',
    doctorNote: 'Topical follicle activators work in synergy with oral biotin and keratin micronutrients to stimulate the hair anagen phase within 60–90 days.',
    subcategories: ['All Hair', 'Hair Growth Serums', 'Hair Fall Shampoos', 'Anti-Dandruff', 'Biotin Gummies'],
    targetConcerns: ['Hair Fall', 'Thinning & Density', 'Dandruff & Itch', 'Frizz & Breakage'],
    faqs: [
      {
        q: 'How does Procapil and Redensyl help in hair regrowth?',
        a: 'Procapil targets dihydrotestosterone (DHT) binding at the hair bulb while improving micro-circulation. Redensyl awakens stem cells within dormant hair follicles to kickstart new anagen growth cycles.'
      },
      {
        q: 'How long before I notice less shower shedding?',
        a: 'Most users report a measurable decrease in daily shower hair fall between Weeks 3 and 4, followed by visible new baby hair growth and density by Month 3.'
      },
      {
        q: 'Can I take Biotin Hair Gummies alongside the scalp serum?',
        a: 'Yes, this is our doctor-recommended inside-and-out protocol. Gummies supply internal building blocks (Biotin, Zinc, Vit A/C/E), while the serum works topically at the root.'
      }
    ]
  },
  {
    id: 'body',
    name: 'Body Care',
    shortName: 'Body',
    path: '/category/body',
    tagline: 'Bacne, KP & Underarm Roll-Ons',
    headline: 'Dermatologist-Approved Active Body Care for Stubborn Bacne & KP',
    description: 'Clinical concentrations of Salicylic Acid, Lactic Acid, and Mandelic Acid formulated specifically for thicker body skin to clear folliculitis, bumpy strawberry legs, and dark spots.',
    badge: '1% BHA + 10% AHA',
    image: 'https://i.mscwlns.co/media/misc/pdp_rcl/1-salicylic-acid-body-wash/250ml%20-%20Hero_iihi7g.jpg?tr=w-600',
    accent: 'text-[#005995]',
    bg: 'bg-[#E6F5FF]',
    border: 'border-[#BADCF0]',
    doctorNote: 'Body skin is 3x thicker than facial skin with a denser distribution of sweat and sebaceous glands. Mild face washes cannot penetrate deep follicular plugs.',
    subcategories: ['All Body Care', 'Acne Body Washes', 'AHA Body Lotions', 'Underarm Roll-Ons', 'Urea Dryness Lotions'],
    targetConcerns: ['Body Acne & Bacne', 'Strawberry Legs (KP)', 'Underarm Odour & Darkness', 'Severe Dryness'],
    faqs: [
      {
        q: 'How does 1% Salicylic Acid clear back acne without dryness?',
        a: 'Salicylic Acid is lipid-soluble, allowing it to penetrate through sebum straight into clogged body pores. We combine it with soothing Tea Tree and Chamomile to prevent dehydration.'
      },
      {
        q: 'What is the fastest way to smooth rough strawberry legs?',
        a: 'Our 10% AHA Exfoliating Lotion loosens dead keratin plugs around hair follicles in 14–21 days. Apply nightly on dry skin after your shower.'
      },
      {
        q: 'Why is the 4% AHA Roll-On superior to traditional deodorants?',
        a: 'It uses Mandelic Acid to lower underarm pH so odour-causing bacteria cannot survive, avoiding pore-clogging aluminium salts while Alpha Arbutin fades friction hyperpigmentation.'
      }
    ]
  },
  {
    id: 'winter',
    name: 'Winter Care',
    shortName: 'Winter',
    path: '/category/winter',
    tagline: '10% Urea & Barrier Restoring',
    headline: 'Intensive Keratolytic & Barrier Repair Formulations for Dry Season',
    description: 'Medical-grade 10% Hydrovance Urea and 5 essential ceramides engineered to penetrate thick scaly skin, soften cracked heels, and seal moisture in freezing weather.',
    badge: '10% UREA + CERAMIDES',
    image: 'https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?auto=format&fit=crop&w=700&q=80',
    accent: 'text-[#005995]',
    bg: 'bg-[#EEF8FF]',
    border: 'border-[#BADCF0]',
    doctorNote: 'Urea is an endogenous Natural Moisturising Factor (NMF) that acts as both a humectant and a gentle keratolytic agent to dissolve hardened dead cells.',
    subcategories: ['All Winter Care', '10% Urea Body Lotion', 'Ceramide Restoring Cream', '10% AHA Exfoliator'],
    targetConcerns: ['Severe Dryness & Flakes', 'Cracked Heels & Elbows', 'Weakened Moisture Barrier', 'Tight & Itchy Skin'],
    faqs: [
      {
        q: 'Why is Urea better than ordinary body lotion for severe dryness?',
        a: 'Ordinary lotions only provide surface lubrication. Urea penetrates into deeper epidermal layers to bind water and break apart dry, scaly keratin crusts.'
      },
      {
        q: 'Can the Ceramide Restoring Cream be used on reactive sensitive skin?',
        a: 'Yes, it contains 5 skin-identical ceramides, hyaluronic acid, and colloidal oat extract with zero fragrance, specifically tested for compromised barriers.'
      }
    ]
  },
  {
    id: 'health-fitness',
    name: 'Health & Fitness',
    shortName: 'Fitness',
    path: '/category/health-fitness',
    tagline: 'PCOS Hormonal Balance, ACV & Gut Wellness',
    headline: 'Clinical Nutraceuticals for Hormonal Equilibrium & Daily Vitality',
    description: 'Doctor-engineered wellness gummies, 40:1 Inositol, and raw unfiltered Apple Cider Vinegar formulated to relieve PMS bloating, regulate cycles, and boost metabolic health.',
    badge: 'DOCTOR NUTRACEUTICALS',
    image: '/assets/aistudio/image_f1e273ce.png',
    accent: 'text-[#EB6200]',
    bg: 'bg-[#FFF7ED]',
    border: 'border-[#FFD699]',
    doctorNote: 'Internal hormonal balance and digestive gut flora directly dictate skin flare-ups, follicle strength, and daily energy levels.',
    subcategories: ['All Health & Fitness', 'PCOS & Period Care', 'ACV Gut & Metabolism', 'Biotin Follicle Gummies', 'Glutathione Radiance'],
    targetConcerns: ['Hormonal Imbalance & PCOS', 'Irregular Cycles', 'Gut Bloating & Sluggish Metabolism', 'Daily Nutrient Gaps'],
    faqs: [
      {
        q: 'How does 40:1 Myo-Inositol support PCOS and hormonal balance?',
        a: 'The 40:1 physiological ratio of Myo to D-Chiro Inositol restores ovarian insulin signaling, supporting ovulation regularity and curbing hormonal breakouts.'
      },
      {
        q: 'When is the best time to take ACV Gut & Metabolism Gummies?',
        a: 'Chew 1 gummy 20 minutes before breakfast or your heaviest meal of the day to prime digestion and support stable blood sugar levels.'
      }
    ]
  },
  {
    id: 'special-offers',
    name: 'Special Offers Unlocked',
    shortName: 'Offers',
    path: '/category/special-offers',
    tagline: 'Doctor Regimen Bundles & Value Savings',
    headline: 'Curated Multi-Step Regimens with Exclusive Value Discounts',
    description: 'Clinically paired synergistic kits and limited-time value packs designed to deliver maximum results with up to 25% automatic bundle savings.',
    badge: 'UP TO 25% OFF',
    image: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=700&q=80',
    accent: 'text-[#16A34A]',
    bg: 'bg-[#F0FDF4]',
    border: 'border-[#BBF7D0]',
    doctorNote: 'Clinical regimens deliver 2.4x higher adherence and measurable biological transformation because multiple active ingredients address root causes simultaneously.',
    subcategories: ['All Special Offers', '3-Step Body Acne Kit', 'Hair Density Growth Pack', 'Clear Skin Daily Trio'],
    targetConcerns: ['Complete Body Acne Routine', 'Maximum Hair Growth', 'Complete Morning Skincare', 'Bundle Value Savings'],
    faqs: [
      {
        q: 'Do special offer bundles include free delivery and samples?',
        a: 'Yes, all special offer bundles qualify for complimentary priority shipping and a customized routine tracker.'
      },
      {
        q: 'Are the products full-sized in the special offers?',
        a: 'All our kits contain full-sized 250ml washes, 200ml lotions, and 60ml serums—never sample minis.'
      }
    ]
  },
  {
    id: 'sun',
    name: 'Sun Protection',
    shortName: 'Sun',
    path: '/category/sun',
    tagline: 'SPF 50 PA++++ Invisible UV Defense',
    headline: 'Broad Spectrum Non-Comedogenic Sunscreens for Face & Body',
    description: 'Zero white cast, lightweight mineral and hybrid UV shields that protect against UVA/UVB photo-aging, sun tanning, and persistent hyperpigmentation.',
    badge: 'ZERO WHITE CAST',
    image: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=700&q=80',
    accent: 'text-[#CA8A04]',
    bg: 'bg-[#FEFCE8]',
    border: 'border-[#FEF08A]',
    doctorNote: 'UV exposure triggers up to 80% of visible skin aging and darkens post-inflammatory marks. Daily broad-spectrum SPF 50 is non-negotiable.',
    subcategories: ['All Sun Protection', 'Face Matte Sunscreen', '360° Body Spray SPF 50', 'Water-Resistant UV Defense'],
    targetConcerns: ['Sun Tan & Sun Burn', 'Photo-Aging & Fine Lines', 'Dark Spot Darkening', 'Outdoor UV Protection'],
    faqs: [
      {
        q: 'Does the Mineral Matte SPF 50 leave a white cast on dusky skin tones?',
        a: 'No, our formula is micro-milled and formulated specifically for Indian skin tones with an invisible velvet-matte dry finish.'
      },
      {
        q: 'How do I use the 360° Body Sunscreen Spray?',
        a: 'Hold the canister 15 cm from skin and mist generously over exposed arms, neck, and legs. Reapply every 2–3 hours if swimming or sweating.'
      }
    ]
  },
  {
    id: 'face',
    name: 'Face',
    shortName: 'Face',
    path: '/category/face',
    tagline: 'Salicylic, Niacinamide & Vit C',
    headline: 'High-Performance Facial Actives for Acne, Pores & Pigmentation',
    description: 'Concentrated clinical actives including 2% BHA, 10% Niacinamide, and 15% Vitamin C engineered to restore texture, regulate sebum, and fade post-blemish scarring.',
    badge: 'CLINICAL ACTIVES',
    image: 'https://images.unsplash.com/photo-1601049541289-9b1b7bbbfe19?auto=format&fit=crop&w=700&q=80',
    accent: 'text-[#005995]',
    bg: 'bg-[#FAFBFD]',
    border: 'border-[#E2E8F0]',
    doctorNote: 'Targeted serums should be layered from lowest viscosity to highest, allowing 60 seconds between steps for optimum active absorption.',
    subcategories: ['All Face Care', 'BHA Acne Serums', 'Niacinamide Serums', 'Vitamin C Brightening', 'Ceramide Creams', 'Matte Sunscreens'],
    targetConcerns: ['Active Acne & Blackheads', 'Enlarged Pores & Oiliness', 'Dark Spots & Pigmentation', 'Barrier Tightness'],
    faqs: [
      {
        q: 'Can I use 10% Niacinamide and 2% Salicylic Acid in the same routine?',
        a: 'Yes, they complement each other exceptionally well. Apply 2% Salicylic Acid PM to clear pores, and 10% Niacinamide AM to control oil and support your moisture barrier.'
      },
      {
        q: 'How long until post-acne dark marks fade with Kojic + Arbutin?',
        a: 'Melanin turnover in facial skin averages 28 to 45 days. You will observe gradual lightening starting around Week 3 with consistent daily evening application.'
      }
    ]
  }
];

export function getCategoryById(id: string): CategoryData | undefined {
  const norm = id.toLowerCase().trim();
  if (norm === 'face' || norm === 'skin') {
    return CATEGORIES_DATA.find(c => c.id === 'face');
  }
  if (norm === 'body' || norm === 'body-care') {
    return CATEGORIES_DATA.find(c => c.id === 'body');
  }
  if (norm === 'winter' || norm === 'winter-care') {
    return CATEGORIES_DATA.find(c => c.id === 'winter');
  }
  if (norm === 'health-fitness' || norm === 'health' || norm === 'fitness' || norm === 'pcos' || norm === 'gummies') {
    return CATEGORIES_DATA.find(c => c.id === 'health-fitness');
  }
  if (norm === 'special-offers' || norm === 'offers' || norm === 'special-offers-unlocked' || norm === 'kits') {
    return CATEGORIES_DATA.find(c => c.id === 'special-offers');
  }
  if (norm === 'sun' || norm === 'sun-protection') {
    return CATEGORIES_DATA.find(c => c.id === 'sun');
  }
  return CATEGORIES_DATA.find(c => c.id.toLowerCase() === norm);
}
