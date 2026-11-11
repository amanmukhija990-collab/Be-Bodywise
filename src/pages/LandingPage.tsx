import React, { useState, useMemo, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { CATALOGUE_PRODUCTS } from '../data/catalogue';
import { ProductImage } from '../components/ProductImage';
import { 
  ArrowRight, Check, Star, ShoppingBag, ShieldCheck, Sparkles, 
  Search, Droplets, Clock, Heart, Award, ChevronDown, ChevronLeft, 
  ChevronRight, CheckCircle2, Flame, Shield, Layers, RefreshCw, Zap,
  CheckCircle, HelpCircle
} from 'lucide-react';

export type CategoryFilterType = 'all' | 'hair' | 'body' | 'winter' | 'health-fitness' | 'special-offers' | 'sun' | 'face' | 'skin' | 'pcos' | 'gummies' | 'kits';

export const LandingPage: React.FC = () => {
  const { addToCart, addToast, setIsCartOpen } = useApp();
  const navigate = useNavigate();
  const location = useLocation();

  // State for Hero Slideshow (Minimalist style)
  const [currentSlide, setCurrentSlide] = useState(0);

  // Best Sellers Filter & Search states
  const [activeCategoryTab, setActiveCategoryTab] = useState<CategoryFilterType>('all');
  const [selectedConcern, setSelectedConcern] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sortBy, setSortBy] = useState<'featured' | 'rating' | 'price-low' | 'price-high'>('featured');
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  // Auto-scroll to #categories or /shop/all
  useEffect(() => {
    if (location.pathname === '/shop/all' || location.hash === '#categories') {
      const timer = setTimeout(() => {
        document.getElementById('categories')?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [location.pathname, location.hash]);

  // Horizontal Carousel Refs for Our Best Sellers and Shop by Concerns
  const bestSellersRef = useRef<HTMLDivElement>(null);
  const concernsRef = useRef<HTMLDivElement>(null);

  const scrollBestSellers = (direction: 'left' | 'right') => {
    if (bestSellersRef.current) {
      const scrollAmount = direction === 'left' ? -340 : 340;
      bestSellersRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  const scrollConcerns = (direction: 'left' | 'right') => {
    if (concernsRef.current) {
      const scrollAmount = direction === 'left' ? -380 : 380;
      concernsRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  // Hero Slides showcasing Be Bodywise Flagship Formulations
  const HERO_SLIDES = [
    {
      id: 'slide-body',
      tagline: '1% SALICYLIC ACID + 10% AHA',
      headline: 'Science-Backed Body Care for Stubborn Bacne & Strawberry Legs',
      subtext: 'Clinical concentrations of BHA & Lactic Acid that dissolve follicular plugs and resurface rough keratosis pilaris in 28 days.',
      ctaText: 'Shop Body Solutions',
      ctaLink: '#bestsellers',
      secondaryText: 'Take Assessment',
      secondaryLink: '/match?category=body',
      featuredProduct: CATALOGUE_PRODUCTS.find(p => p.id === 'prod-body-3') || CATALOGUE_PRODUCTS[0],
      stat: '94% Saw Reduced Breakouts in 4 Weeks',
    },
    {
      id: 'slide-hair',
      tagline: 'PROCAPIL + REDENSYL + BIOTIN',
      headline: 'Reactivate Dormant Follicles & Reduce Shower Shedding',
      subtext: 'Targeted scalp serum combined with 5000mcg Sesbania Biotin chewable gummies to nourish roots and rebuild hair density.',
      ctaText: 'Explore Hair Formulations',
      ctaLink: '#bestsellers',
      secondaryText: 'Take Assessment',
      secondaryLink: '/match?category=hair',
      featuredProduct: CATALOGUE_PRODUCTS.find(p => p.id === 'prod-hair-1') || CATALOGUE_PRODUCTS[1],
      stat: '89% Reported Visible Density Growth',
    },
    {
      id: 'slide-gummies',
      tagline: '40:1 MYO-INOSITOL & ACTIVE ACV',
      headline: 'Clinical Wellness Gummies for Hormonal & Gut Balance',
      subtext: 'Delicious, sugar-free nutraceutical gummies engineered with proven botanicals to calm hormonal acne, PMS bloating, and gut dysbiosis.',
      ctaText: 'Discover Wellness Gummies',
      ctaLink: '#bestsellers',
      secondaryText: 'Take Assessment',
      secondaryLink: '/match?category=pcos',
      featuredProduct: CATALOGUE_PRODUCTS.find(p => p.id === 'prod-pcos-gummies') || CATALOGUE_PRODUCTS[2],
      stat: 'Over 10 Lakh+ Women Trusted',
    },
  ];

  // Auto-advance hero slides
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide(prev => (prev + 1) % HERO_SLIDES.length);
    }, 6500);
    return () => clearInterval(timer);
  }, [HERO_SLIDES.length]);

  // Categories data for "All Categories" section (matching official Be Bodywise navigation)
  const CATEGORIES = [
    {
      id: 'hair',
      filterKey: 'hair' as CategoryFilterType,
      name: 'Hair',
      tagline: 'Growth Serums, Shampoos & Biotin',
      count: '5 Formulations',
      image: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=700&q=80',
      badge: 'PROCAPIL + BIOTIN',
      bg: 'bg-[#F0F6FA]',
      border: 'border-[#BADCF0]',
      accent: 'text-[#005995]',
    },
    {
      id: 'body',
      filterKey: 'body' as CategoryFilterType,
      name: 'Body Care',
      tagline: 'Bacne, KP & Underarm Roll-Ons',
      count: '7 Formulations',
      image: 'https://i.mscwlns.co/media/misc/pdp_rcl/1-salicylic-acid-body-wash/250ml%20-%20Hero_iihi7g.jpg?tr=w-600',
      badge: '1% BHA + 10% AHA',
      bg: 'bg-[#E6F5FF]',
      border: 'border-[#BADCF0]',
      accent: 'text-[#005995]',
    },
    {
      id: 'winter',
      filterKey: 'winter' as CategoryFilterType,
      name: 'Winter Care',
      tagline: '10% Urea & Barrier Restoring',
      count: '3 Formulations',
      image: 'https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?auto=format&fit=crop&w=700&q=80',
      badge: '10% UREA + CERAMIDES',
      bg: 'bg-[#EEF8FF]',
      border: 'border-[#BADCF0]',
      accent: 'text-[#005995]',
    },
    {
      id: 'health-fitness',
      filterKey: 'health-fitness' as CategoryFilterType,
      name: 'Health & Fitness',
      tagline: 'PCOS Hormonal Balance, ACV & Gut Wellness',
      count: '4 Formulations',
      image: '/assets/aistudio/image_f1e273ce.png',
      badge: 'DOCTOR NUTRACEUTICALS',
      bg: 'bg-[#FFF7ED]',
      border: 'border-[#FFD699]',
      accent: 'text-[#EB6200]',
    },
    {
      id: 'special-offers',
      filterKey: 'special-offers' as CategoryFilterType,
      name: 'Special Offers Unlocked',
      tagline: '3-Step Routine & Defense Packs',
      count: '4 Curated Sets',
      image: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=700&q=80',
      badge: 'UP TO 25% OFF',
      bg: 'bg-[#F0FDF4]',
      border: 'border-[#BBF7D0]',
      accent: 'text-[#16A34A]',
    },
    {
      id: 'sun',
      filterKey: 'sun' as CategoryFilterType,
      name: 'Sun Protection',
      tagline: 'SPF 50 PA++++ Invisible UV Defense',
      count: '2 Formulations',
      image: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=700&q=80',
      badge: 'ZERO WHITE CAST',
      bg: 'bg-[#FEFCE8]',
      border: 'border-[#FEF08A]',
      accent: 'text-[#CA8A04]',
    },
    {
      id: 'face',
      filterKey: 'face' as CategoryFilterType,
      name: 'Face',
      tagline: 'Salicylic, Niacinamide & Vit C',
      count: '6 Formulations',
      image: 'https://images.unsplash.com/photo-1601049541289-9b1b7bbbfe19?auto=format&fit=crop&w=700&q=80',
      badge: 'CLINICAL ACTIVES',
      bg: 'bg-[#FAFBFD]',
      border: 'border-[#E2E8F0]',
      accent: 'text-[#005995]',
    },
  ];

  // Clinical Concerns data for "Shop by Concern" (Contextual Problem-Solver Matrix)
  const CONCERNS = [
    {
      id: 'acne',
      title: 'Body Acne & Bacne',
      subtitle: 'Clear clogged back & chest pores with micro-exfoliating BHA',
      targetArea: 'Back & Chest',
      activeHero: '1% Salicylic Acid + Tea Tree',
      contextImage: 'https://images.unsplash.com/photo-1515377905703-c4788e51af15?auto=format&fit=crop&w=800&q=80',
      productThumbnail: 'https://i.mscwlns.co/media/misc/pdp_rcl/1-salicylic-acid-body-wash/250ml%20-%20Hero_iihi7g.jpg?tr=w-600',
      productName: '1% Salicylic Acid Body Wash',
      category: 'body',
      count: '3 Formulations',
      filterKey: 'acne',
    },
    {
      id: 'strawberry',
      title: 'Strawberry Legs & KP',
      subtitle: 'Resurface bumpy, rough follicle texture in 28 days',
      targetArea: 'Legs & Arms',
      activeHero: '10% AHA (Lactic + Glycolic)',
      contextImage: '/assets/strawberry_legs.jpg',
      productThumbnail: 'https://i.mscwlns.co/media/misc/others/Body%20Care%20%5BSelected%5D%20%284%29_gijo2j.png?tr=w-600',
      productName: '10% AHA Exfoliating Scrub',
      category: 'body',
      count: '3 Formulations',
      filterKey: 'strawberry',
    },
    {
      id: 'hairfall',
      title: 'Hair Fall & Thinning',
      subtitle: 'Re-energize dormant follicles and cut shower shedding',
      targetArea: 'Scalp & Roots',
      activeHero: 'Procapil + Redensyl + Biotin',
      contextImage: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=800&q=80',
      productThumbnail: 'https://i.mscwlns.co/media/misc/others/AppThumbnail_HGP_6ebs2q.jpg?tr=w-600',
      productName: 'Procapil + Redensyl Hair Pack',
      category: 'hair',
      count: '4 Formulations',
      filterKey: 'hair',
    },
    {
      id: 'underarm',
      title: 'Underarm Darkness & Odour',
      subtitle: 'Aluminium-free 24h freshness & brightening roll-on',
      targetArea: 'Underarms',
      activeHero: '4% Mandelic Acid + Alpha Arbutin',
      contextImage: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?auto=format&fit=crop&w=800&q=80',
      productThumbnail: 'https://i.mscwlns.co/media/misc/pdp_rcl/6-aha-bha-underarm-roll-on-flora-75ml/AppThumbnail_6%25UARO_Flora_75ml_9u2iwy.jpg?tr=w-600',
      productName: '4% Mandelic Acid Roll-On',
      category: 'body',
      count: '2 Formulations',
      filterKey: 'underarm',
    },
    {
      id: 'dryness',
      title: 'Severe Dryness & Scales',
      subtitle: 'Deep clinical hydration & barrier repair for dry skin',
      targetArea: 'Flaky & Scaly Skin',
      activeHero: '10% Hydrovance Urea',
      contextImage: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=800&q=80',
      productThumbnail: 'https://i.mscwlns.co/media/misc/others/AppThumbnail_NiaLotion_250ml_3xpl85.jpg?tr=w-600',
      productName: '10% Hydrovance Urea Lotion',
      category: 'body',
      count: '3 Formulations',
      filterKey: 'dryness',
    },
    {
      id: 'pcos',
      title: 'Hormonal Balance & Gut Bloat',
      subtitle: 'Chewable daily endocrine & metabolic wellness support',
      targetArea: 'Gut & Metabolism',
      activeHero: '40:1 Inositol + Unfiltered ACV',
      contextImage: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=800&q=80',
      productThumbnail: '/assets/aistudio/image_f1e273ce.png',
      productName: 'Multivitamin & Gut Gummies',
      category: 'body',
      count: '2 Formulations',
      filterKey: 'gummies',
    },
  ];

  // Filtered Best Sellers products list
  const filteredProducts = useMemo(() => {
    return CATALOGUE_PRODUCTS.filter(product => {
      // Category tab
      if (activeCategoryTab !== 'all') {
        if (activeCategoryTab === 'hair') {
          if (product.category !== 'hair') return false;
        } else if (activeCategoryTab === 'body') {
          if (product.category !== 'body') return false;
        } else if (activeCategoryTab === 'face' || activeCategoryTab === 'skin') {
          if (product.category !== 'skin') return false;
        } else if (activeCategoryTab === 'winter') {
          const isWinter = product.id.includes('urea') || 
            product.slug.includes('urea') || 
            product.name.toLowerCase().includes('ceramide') ||
            product.concerns.some(c => c.toLowerCase().includes('dryness'));
          if (!isWinter) return false;
        } else if (activeCategoryTab === 'health-fitness' || activeCategoryTab === 'pcos' || activeCategoryTab === 'gummies') {
          const isHealth = product.id.includes('gummies') || 
            product.id.includes('pcos') || 
            product.concerns.some(c => c.toLowerCase().includes('pcos') || c.toLowerCase().includes('hormonal') || c.toLowerCase().includes('bloating')) ||
            product.name.toLowerCase().includes('gummies');
          if (!isHealth) return false;
        } else if (activeCategoryTab === 'special-offers' || activeCategoryTab === 'kits') {
          const isOffer = Boolean(product.mrp && product.mrp > product.price) || 
            product.id === 'prod-body-3' || product.id === 'prod-body-1' || product.id === 'prod-body-2';
          if (!isOffer) return false;
        } else if (activeCategoryTab === 'sun') {
          const isSun = product.purposes.includes('sun_protection') || 
            product.name.toLowerCase().includes('sunscreen') || 
            product.slug.includes('spf');
          if (!isSun) return false;
        } else if (product.category !== activeCategoryTab) {
          return false;
        }
      }

      // Concern filter
      if (selectedConcern !== 'all') {
        const q = selectedConcern.toLowerCase();
        const matchesConcern = product.concerns.some(c => c.toLowerCase().includes(q)) ||
                               product.purposes.some(p => p.toLowerCase().includes(q)) ||
                               product.name.toLowerCase().includes(q);
        if (!matchesConcern) return false;
      }

      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesName = product.name.toLowerCase().includes(q);
        const matchesActives = product.actives.some(a => a.toLowerCase().includes(q));
        const matchesTagline = product.tagline.toLowerCase().includes(q);
        if (!matchesName && !matchesActives && !matchesTagline) return false;
      }

      return true;
    }).sort((a, b) => {
      if (sortBy === 'rating') return (b.rating || 4.8) - (a.rating || 4.8);
      if (sortBy === 'price-low') return a.price - b.price;
      if (sortBy === 'price-high') return b.price - a.price;
      return 0;
    });
  }, [activeCategoryTab, selectedConcern, searchQuery, sortBy]);

  // Handler to add a single product to bag with immediate drawer feedback
  const handleAddToCart = (productId: string, productName: string) => {
    addToCart(productId, 1);
    addToast('Added to Shopping Bag!', `${productName} added to your bag`, 'success');
  };

  // Handler to add the complete 3-Step Routine bundle
  const handleAddBundleToBag = () => {
    addToCart('prod-body-3', 1); // 1% Salicylic Acid Body Wash
    addToCart('prod-body-1', 1); // 10% AHA Exfoliating Lotion
    addToCart('prod-body-2', 1); // 4% AHA Underarm Roll-On
    addToast('3-Step Clinical Routine Added!', 'Bundle discount automatically applied in bag', 'success');
    setIsCartOpen(true);
  };

  // FAQ list (Minimalist transparent educational answers)
  const faqs = [
    {
      q: 'How long does it take to see visible results on body acne and bacne?',
      a: 'Because body skin is 3x thicker than facial skin, topical BHA (1% Salicylic Acid) requires 14–21 days of daily use to dissolve deep follicular plugs. By Day 28–45, surface inflammation subsides and recurring breakout frequency drops significantly. You can track this exact biological progression in our integrated Results Decoder.',
    },
    {
      q: 'Can I use the 10% AHA Exfoliating Body Lotion immediately after shaving or waxing?',
      a: 'We advise waiting 24 to 48 hours after shaving or waxing before applying exfoliating chemical acids (Lactic and Glycolic Acid). Freshly exfoliated or micro-abraded skin can experience temporary stinging. Start 2–3 nights weekly on dry skin.',
    },
    {
      q: 'How does the AHA Underarm Roll-On prevent odour without harmful aluminium salts?',
      a: 'Traditional antiperspirants plug sweat glands with aluminium salts. Our clinical formula uses 3% Mandelic Acid to lower the underarm surface pH. Odour-causing bacteria cannot survive in this acidic environment, keeping you fresh all day while Alpha Arbutin gently lightens friction darkening.',
    },
    {
      q: 'Why does Be Bodywise formulate chewable nutraceutical gummies alongside topical treatments?',
      a: 'Persistent body breakouts, hormonal jawline flare-ups, and severe hair shedding are often rooted in internal factors: insulin resistance, DHT sensitivity, and gut dysbiosis. Pairing topical clinical actives with targeted oral nutrition (such as 40:1 Inositol or Sesbania Biotin) creates a dual-action inside-and-out protocol.',
    },
    {
      q: 'What is the 90-Day Results System and how does it integrate with my order?',
      a: 'Skincare actives follow proven biological renewal cycles (28-day epidermal turnover, 90-day hair follicle anagen phase). Every order automatically connects to your personal My Shelf dashboard with day-by-day guidance, routine clash tests, and check-in timeline tracking.',
    },
  ];

  const activeSlide = HERO_SLIDES[currentSlide];

  return (
    <div className="w-full flex flex-col bg-[#FAFBFD] overflow-x-hidden selection:bg-[#005995]/20 selection:text-[#005995]">
      
      {/* ============================================================ */}
      {/* 2. HERO SLIDESHOW / EDITORIAL SHOWCASE (Minimalist Architecture) */}
      {/* ============================================================ */}
      <section className="relative border-b border-[#E2E8F0] bg-gradient-to-b from-[#E6F5FF]/60 via-[#FAFBFD] to-[#FAFBFD] py-10 sm:py-16 overflow-hidden">
        <div className="max-w-[1280px] mx-auto px-5 sm:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            
            {/* Left Column: Editorial Headline & Actions */}
            <div className="lg:col-span-7 flex flex-col items-start">
              {/* Active tag / kicker */}
              <div className="inline-flex items-center gap-2 text-xs font-mono font-bold tracking-widest uppercase text-[#005995] mb-3">
                <Sparkles className="w-3.5 h-3.5 text-[#005995]" />
                <span>{activeSlide.tagline}</span>
              </div>

              {/* Main Headline */}
              <h1 className="font-serif font-medium text-3xl sm:text-5xl lg:text-[54px] leading-[1.1] tracking-[-0.02em] text-[#111827] mb-5 text-balance">
                {activeSlide.headline}
              </h1>

              {/* Subtext description */}
              <p className="font-sans text-sm sm:text-base text-[#64748B] max-w-xl leading-relaxed mb-8">
                {activeSlide.subtext}
              </p>

              {/* Trust Metric Box */}
              <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-xl bg-white border border-[#BADCF0] text-xs font-medium text-[#005995] mb-8 shadow-2xs">
                <ShieldCheck className="w-4 h-4 text-[#005995]" />
                <span>{activeSlide.stat}</span>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
                <a
                  href={activeSlide.ctaLink}
                  className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-full bg-[#005995] hover:bg-[#004777] text-white font-sans font-semibold text-xs sm:text-sm transition-all shadow-md hover:-translate-y-0.5 cursor-pointer w-full sm:w-auto"
                >
                  <ShoppingBag className="w-4 h-4 text-white" />
                  <span>{activeSlide.ctaText}</span>
                </a>

                <Link
                  to={activeSlide.secondaryLink}
                  className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-full bg-white hover:bg-[#E6F5FF] border border-[#E2E8F0] text-[#005995] font-sans font-semibold text-xs sm:text-sm transition-all hover:-translate-y-0.5 shadow-2xs cursor-pointer w-full sm:w-auto"
                >
                  <span>{activeSlide.secondaryText}</span>
                  <ArrowRight className="w-4 h-4 text-[#005995]" />
                </Link>
              </div>

              {/* Slide Navigation Dots */}
              <div className="flex items-center gap-2 mt-8">
                {HERO_SLIDES.map((slide, idx) => (
                  <button
                    key={slide.id}
                    onClick={() => setCurrentSlide(idx)}
                    className={`h-2 rounded-full transition-all cursor-pointer ${
                      idx === currentSlide
                        ? 'w-8 bg-[#005995]'
                        : 'w-2 bg-[#BADCF0] hover:bg-[#005995]/50'
                    }`}
                    aria-label={`Go to slide ${idx + 1}`}
                  />
                ))}
              </div>
            </div>

            {/* Right Column: Featured Product Spotlight Card (Reduced by 30%) */}
            <div className="lg:col-span-5 relative flex justify-center">
              <div 
                onClick={() => navigate(`/product/${activeSlide.featuredProduct.slug}`)}
                className="w-full max-w-[294px] rounded-2xl bg-white border border-[#E2E8F0] p-4 shadow-lg relative overflow-hidden transition-all hover:shadow-xl hover:border-[#005995] cursor-pointer group"
              >
                <div className="relative aspect-square w-full rounded-xl overflow-hidden bg-white mb-3 border border-[#E2E8F0]">
                  <ProductImage
                    src={activeSlide.featuredProduct.image}
                    alt={activeSlide.featuredProduct.name}
                    category={activeSlide.featuredProduct.category}
                    className="w-full h-full object-contain p-2 group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-2 left-2 px-2 py-0.5 rounded-full bg-[#005995] text-white font-mono text-[8px] uppercase tracking-wider font-bold">
                    #1 BEST SELLER
                  </div>
                  <div className="absolute top-2 right-2 px-2 py-0.5 rounded-full bg-white/95 backdrop-blur-md text-[#111827] font-sans text-[10px] font-semibold shadow-xs flex items-center gap-1 border border-[#E2E8F0]">
                    <Star className="w-3 h-3 fill-[#EB6200] text-[#EB6200]" />
                    <span>{activeSlide.featuredProduct.rating || 4.8}★</span>
                  </div>
                </div>

                <div>
                  <span className="font-mono text-[9px] uppercase font-bold text-[#005995] tracking-wider block mb-1 truncate">
                    {activeSlide.featuredProduct.sizeMl ? `${activeSlide.featuredProduct.sizeMl}ml` : 'Full size'} · {activeSlide.featuredProduct.actives.slice(0, 2).join(' + ')}
                  </span>
                  <h3 className="font-serif font-bold text-sm text-[#111827] mb-1 line-clamp-1 group-hover:text-[#005995] transition-colors">
                    {activeSlide.featuredProduct.name}
                  </h3>
                  <p className="font-sans text-[11px] text-[#64748B] leading-snug mb-3 line-clamp-2">
                    {activeSlide.featuredProduct.tagline}
                  </p>

                  <div className="flex items-center justify-between pt-2.5 border-t border-[#E2E8F0]">
                    <div className="flex items-baseline gap-1.5">
                      <span className="font-serif font-bold text-lg text-[#111827]">
                        ₹{activeSlide.featuredProduct.price}
                      </span>
                      {activeSlide.featuredProduct.mrp && (
                        <span className="text-[11px] text-[#64748B] line-through">
                          ₹{activeSlide.featuredProduct.mrp}
                        </span>
                      )}
                      <span className="text-[9px] font-semibold text-[#198775] bg-[#EDFCF5] px-1.5 py-0.5 rounded-full">
                        SAVE {Math.round((((activeSlide.featuredProduct.mrp || activeSlide.featuredProduct.price * 1.25) - activeSlide.featuredProduct.price) / (activeSlide.featuredProduct.mrp || activeSlide.featuredProduct.price * 1.25)) * 100)}%
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleAddToCart(activeSlide.featuredProduct.id, activeSlide.featuredProduct.name);
                      }}
                      className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-[#005995] hover:bg-[#004777] text-white font-sans text-[11px] font-semibold transition-all shadow-xs hover:scale-105 cursor-pointer"
                    >
                      <ShoppingBag className="w-3 h-3" />
                      <span>Add to Bag</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* 3. ALL CATEGORIES (Be Bodywise shop/all Structure) */}
      {/* ============================================================ */}
      <section id="categories" className="py-14 sm:py-20 border-b border-[#E2E8F0] bg-[#FAFBFD] scroll-mt-20">
        <div className="max-w-[1280px] mx-auto px-5 sm:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
            <div>
              <span className="font-mono text-xs font-bold uppercase tracking-widest text-[#005995] block mb-2">
                DOCTOR CURATED ACTIVES
              </span>
              <h2 className="font-serif font-medium text-3xl sm:text-4xl text-[#111827]">
                All Categories
              </h2>
            </div>
            <div className="flex items-center gap-3">
              <p className="font-sans text-xs sm:text-sm text-[#64748B] max-w-md">
                Explore science-backed formulations segmented by hair density, body acne, facial actives, hormonal wellness, and barrier repair.
              </p>
              <button
                type="button"
                onClick={() => {
                  setActiveCategoryTab('all');
                  setSelectedConcern('all');
                  document.getElementById('bestsellers')?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="hidden sm:inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-white border border-[#E2E8F0] text-xs font-semibold text-[#005995] hover:border-[#005995] shadow-2xs whitespace-nowrap cursor-pointer transition-all shrink-0"
              >
                <span>View All 20+</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6">
            {CATEGORIES.map(cat => {
              const isSelected = activeCategoryTab === cat.filterKey;

              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => {
                    setActiveCategoryTab(cat.filterKey);
                    setSelectedConcern('all');
                    document.getElementById('bestsellers')?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className={`p-4 sm:p-5 rounded-2xl border text-left transition-all group flex flex-col justify-between cursor-pointer bg-white overflow-hidden shadow-2xs hover:shadow-lg ${
                    isSelected 
                      ? 'border-[#005995] ring-2 ring-[#005995]/20 shadow-sm' 
                      : 'border-[#E2E8F0] hover:border-[#005995]'
                  }`}
                >
                  <div>
                    {/* Category Thumbnail Packshot */}
                    <div className="relative aspect-[4/3] w-full rounded-xl overflow-hidden bg-[#FAFBFD] mb-4 border border-[#E2E8F0]">
                      <img
                        src={cat.image}
                        alt={cat.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        loading="lazy"
                      />
                      <div className="absolute top-2 left-2 px-2 py-0.5 rounded-full bg-white/95 backdrop-blur-md text-[#005995] font-mono text-[8px] font-bold uppercase tracking-wider border border-[#BADCF0] shadow-2xs">
                        {cat.badge}
                      </div>
                    </div>

                    <div className="flex items-center justify-between gap-1.5 mb-1">
                      <h3 className="font-serif font-bold text-base text-[#111827] group-hover:text-[#005995] transition-colors line-clamp-1">
                        {cat.name}
                      </h3>
                      <span className="font-mono text-[10px] text-[#005995] font-semibold uppercase tracking-wider shrink-0">
                        {cat.count}
                      </span>
                    </div>

                    <p className="font-sans text-xs text-[#64748B] line-clamp-1 mb-3">
                      {cat.tagline}
                    </p>
                  </div>

                  <div className="pt-2.5 border-t border-[#F1F5F9] flex items-center justify-end text-xs font-semibold">
                    <Link
                      to={`/category/${cat.id}`}
                      onClick={(e) => e.stopPropagation()}
                      className="text-xs font-sans font-semibold text-[#005995] hover:underline flex items-center gap-1"
                      title={`Open full ${cat.name} page`}
                    >
                      <span>Full Page</span>
                      <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
                    </Link>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* 4. OUR BEST SELLERS (Minimalist Tabbed Product Catalog) */}
      {/* ============================================================ */}
      <section id="bestsellers" className="py-16 sm:py-24 border-b border-[#E2E8F0] bg-white scroll-mt-20">
        <div className="max-w-[1280px] mx-auto px-5 sm:px-8">
          
          {/* Section Header */}
          <div className="text-center max-w-2xl mx-auto mb-10">
            <span className="font-mono text-xs font-bold uppercase tracking-widest text-[#005995] block mb-2">
              DOCTOR CURATED ACTIVES
            </span>
            <h2 className="font-serif font-medium text-3xl sm:text-4xl text-[#111827] leading-tight mb-3">
              Our Best Sellers
            </h2>
            <p className="font-sans text-sm text-[#64748B] leading-relaxed">
              Every formula is clinically dosed with active concentrations to deliver visible biological transformation within 90 days.
            </p>
          </div>

          {/* Minimalist Category Tabs & Controls */}
          <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 mb-10 pb-4 border-b border-[#E2E8F0]">
            
            {/* Category Filter Pills (Functional Buttons) */}
            <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1">
              {[
                { id: 'all', label: 'All Formulations' },
                { id: 'hair', label: 'Hair' },
                { id: 'body', label: 'Body Care' },
                { id: 'winter', label: 'Winter Care' },
                { id: 'health-fitness', label: 'Health & Fitness' },
                { id: 'special-offers', label: 'Special Offers Unlocked' },
                { id: 'sun', label: 'Sun Protection' },
                { id: 'face', label: 'Face' },
              ].map(tab => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveCategoryTab(tab.id as CategoryFilterType)}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-sans font-medium whitespace-nowrap transition-all cursor-pointer ${
                    activeCategoryTab === tab.id
                      ? 'bg-[#005995] text-white shadow-xs font-semibold'
                      : 'bg-[#F0F6FA] text-[#64748B] hover:bg-white hover:text-[#005995] border border-transparent hover:border-[#E2E8F0]'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Search, Sort and Carousel controls */}
            <div className="flex items-center gap-2.5">
              <div className="relative flex-1 md:w-52">
                <Search className="w-3.5 h-3.5 text-[#64748B] absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  placeholder="Search active (e.g. BHA)..."
                  className="w-full pl-8 pr-3 py-1.5 rounded-full bg-[#FAFBFD] border border-[#E2E8F0] text-xs focus:outline-none focus:ring-2 focus:ring-[#005995] transition-all"
                />
              </div>

              <select
                value={sortBy}
                onChange={e => setSortBy(e.target.value as any)}
                className="px-3 py-1.5 rounded-full bg-[#FAFBFD] border border-[#E2E8F0] text-xs font-sans text-[#111827] outline-none cursor-pointer focus:ring-1 focus:ring-[#005995]"
              >
                <option value="featured">Featured</option>
                <option value="rating">Top Rated</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
              </select>
            </div>
          </div>

          {/* Horizontal Carousel Track (No Vertical Scroll) */}
          {filteredProducts.length === 0 ? (
            <div className="py-16 text-center bg-[#FAFBFD] rounded-3xl border border-[#E2E8F0] p-8 max-w-md mx-auto">
              <p className="font-serif font-semibold text-lg text-[#111827] mb-1">
                No matching formulations found
              </p>
              <p className="font-sans text-xs text-[#64748B] mb-4">
                Try clearing your search query or reset category filter.
              </p>
              <button
                type="button"
                onClick={() => {
                  setSearchQuery('');
                  setActiveCategoryTab('all');
                  setSelectedConcern('all');
                }}
                className="px-5 py-2 rounded-full bg-[#005995] text-white text-xs font-semibold cursor-pointer shadow-xs"
              >
                Reset All Filters
              </button>
            </div>
          ) : (
            <div className="relative group">
              {/* Floating Left and Right Arrow Buttons on Sides */}
              <button
                type="button"
                onClick={() => scrollBestSellers('left')}
                className="absolute left-0 sm:-left-5 top-1/2 -translate-y-1/2 z-20 w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-white/95 backdrop-blur-md text-[#111827] hover:text-[#005995] border border-[#E2E8F0] shadow-md hover:shadow-xl hover:border-[#005995] flex items-center justify-center transition-all cursor-pointer active:scale-95"
                aria-label="Scroll left"
                title="Previous formulations"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                type="button"
                onClick={() => scrollBestSellers('right')}
                className="absolute right-0 sm:-right-5 top-1/2 -translate-y-1/2 z-20 w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-white/95 backdrop-blur-md text-[#111827] hover:text-[#005995] border border-[#E2E8F0] shadow-md hover:shadow-xl hover:border-[#005995] flex items-center justify-center transition-all cursor-pointer active:scale-95"
                aria-label="Scroll right"
                title="Next formulations"
              >
                <ChevronRight className="w-5 h-5" />
              </button>

              <div
                ref={bestSellersRef}
                className="flex items-stretch gap-6 overflow-x-auto scroll-smooth scrollbar-none snap-x snap-mandatory pb-4 pt-1 px-1 -mx-2 sm:mx-0"
                style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
              >
                {filteredProducts.map(product => {
                  const mrp = product.mrp || Math.round(product.price * 1.25);
                  const discount = Math.round(((mrp - product.price) / mrp) * 100);

                  return (
                    <div
                      key={product.id}
                      onClick={() => navigate(`/product/${product.slug}`)}
                      className="w-[280px] sm:w-[290px] shrink-0 snap-start bg-white rounded-2xl border border-[#E2E8F0] overflow-hidden shadow-2xs hover:shadow-lg hover:border-[#005995] transition-all flex flex-col justify-between group cursor-pointer"
                    >
                      {/* Top: Product Image with Badge and Quick Rating */}
                      <div>
                        <div className="relative aspect-[4/3] w-full bg-[#FAFBFD] overflow-hidden border-b border-[#E2E8F0]">
                          <ProductImage
                            src={product.image}
                            alt={product.name}
                            category={product.category}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                          <div className="absolute top-3 left-3 px-2 py-0.5 rounded-full bg-white/95 backdrop-blur-md text-[#111827] font-sans text-[11px] font-semibold shadow-xs flex items-center gap-1 border border-[#E2E8F0]">
                            <Star className="w-3 h-3 fill-[#EB6200] text-[#EB6200]" />
                            <span>{product.rating || 4.8}★</span>
                            <span className="text-[#64748B] text-[10px]">({product.reviewCount || 1200})</span>
                          </div>

                          {discount > 0 && (
                            <div className="absolute top-3 right-3 px-2 py-0.5 rounded-full bg-[#198775] text-white font-mono text-[9px] font-bold uppercase tracking-wider shadow-xs">
                              {discount}% OFF
                            </div>
                          )}
                        </div>

                        {/* Content Details */}
                        <div className="p-4">
                          {/* Actives Kicker */}
                          <span className="font-mono text-[10px] uppercase font-bold tracking-wider text-[#005995] block mb-1 truncate">
                            {product.actives.slice(0, 3).join(' · ')}
                          </span>

                          {/* Title */}
                          <h3 className="font-serif font-bold text-sm text-[#111827] leading-snug line-clamp-1 mb-1 group-hover:text-[#005995] transition-colors">
                            {product.name}
                          </h3>

                          {/* Tagline / Subtitle */}
                          <p className="font-sans text-xs text-[#64748B] leading-relaxed line-clamp-2 mb-3 min-h-[32px]">
                            {product.tagline}
                          </p>

                          {/* Biological timeline note */}
                          <div className="flex items-center gap-1.5 text-[11px] text-[#64748B] font-sans pb-2">
                            <Clock className="w-3 h-3 text-[#005995]" />
                            <span>First visible change: <strong>Day {product.timeline.firstChangeDay}</strong></span>
                          </div>
                        </div>
                      </div>

                      {/* Bottom: Price & Add to Bag CTA */}
                      <div className="p-4 pt-0">
                        <div className="flex items-baseline justify-between mb-3 pt-2.5 border-t border-[#E2E8F0]">
                          <div className="flex items-baseline gap-1.5">
                            <span className="font-serif font-bold text-lg text-[#111827]">
                              ₹{product.price}
                            </span>
                            {product.mrp && (
                              <span className="text-xs text-[#64748B] line-through">
                                ₹{product.mrp}
                              </span>
                            )}
                          </div>
                          <span className="font-mono text-[10px] text-[#64748B]">
                            {product.sizeMl ? `${product.sizeMl}ml` : '60 gummies'}
                          </span>
                        </div>

                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleAddToCart(product.id, product.name);
                          }}
                          className="w-full py-2.5 px-3 rounded-full bg-[#005995] hover:bg-[#004777] text-white font-sans text-xs font-semibold transition-all shadow-xs flex items-center justify-center gap-1.5 cursor-pointer active:scale-95"
                        >
                          <ShoppingBag className="w-3.5 h-3.5" />
                          <span>Add to Bag</span>
                        </button>
                      </div>

                    </div>
                  );
                })}
              </div>
            </div>
          )}

        </div>
      </section>

      {/* ============================================================ */}
      {/* 5. SHOP BY CONCERNS (Minimalist Problem-Solver Matrix) */}
      {/* ============================================================ */}
      <section className="py-16 sm:py-20 border-b border-[#E2E8F0] bg-[#FAFBFD]">
        <div className="max-w-[1280px] mx-auto px-5 sm:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
            <div>
              <span className="font-mono text-xs font-bold uppercase tracking-widest text-[#005995] block mb-1">
                TARGETED CLINICAL SOLUTIONS
              </span>
              <h2 className="font-serif font-medium text-3xl sm:text-4xl text-[#111827]">
                Shop by Concerns
              </h2>
              <p className="font-sans text-xs sm:text-sm text-[#64748B] mt-1.5 max-w-xl">
                Select your primary skin, body, or scalp issue to focus directly on dermatologically matched solutions.
              </p>
            </div>
          </div>

          {/* Horizontal Carousel Track (No Vertical Scroll) */}
          <div className="relative group">
            {/* Floating Left and Right Arrow Buttons on Sides */}
            <button
              type="button"
              onClick={() => scrollConcerns('left')}
              className="absolute left-0 sm:-left-5 top-1/2 -translate-y-1/2 z-20 w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-white/95 backdrop-blur-md text-[#111827] hover:text-[#005995] border border-[#E2E8F0] shadow-md hover:shadow-xl hover:border-[#005995] flex items-center justify-center transition-all cursor-pointer active:scale-95"
              aria-label="Scroll left"
              title="Previous concerns"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              type="button"
              onClick={() => scrollConcerns('right')}
              className="absolute right-0 sm:-right-5 top-1/2 -translate-y-1/2 z-20 w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-white/95 backdrop-blur-md text-[#111827] hover:text-[#005995] border border-[#E2E8F0] shadow-md hover:shadow-xl hover:border-[#005995] flex items-center justify-center transition-all cursor-pointer active:scale-95"
              aria-label="Scroll right"
              title="Next concerns"
            >
              <ChevronRight className="w-5 h-5" />
            </button>

            <div
              ref={concernsRef}
              className="flex items-stretch gap-6 overflow-x-auto scroll-smooth scrollbar-none snap-x snap-mandatory pb-4 pt-1 px-1 -mx-2 sm:mx-0"
              style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
              {CONCERNS.map(concern => (
                <div
                  key={concern.id}
                  onClick={() => {
                    setSelectedConcern(concern.filterKey);
                    document.getElementById('bestsellers')?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="w-[310px] sm:w-[350px] shrink-0 snap-start rounded-2xl bg-white border border-[#E2E8F0] hover:border-[#005995] hover:shadow-xl transition-all duration-300 cursor-pointer group flex flex-col justify-between overflow-hidden"
                >
                  <div>
                    {/* Contextual Concern Visual Header */}
                    <div className="relative aspect-[16/10] w-full overflow-hidden bg-[#FAFBFD]">
                      <img
                        src={concern.contextImage}
                        alt={`${concern.title} context - ${concern.targetArea}`}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                        loading="lazy"
                      />

                      {/* Subtle aesthetic gradient overlay for legibility */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/15 to-transparent pointer-events-none" />

                      {/* Top Badges: Target Area & Count */}
                      <div className="absolute top-3 left-3 flex flex-wrap gap-1.5 items-center">
                        <span className="px-2.5 py-1 rounded-md bg-white/95 backdrop-blur-md text-[#005995] font-mono text-[9px] font-bold uppercase tracking-wider border border-[#BADCF0] shadow-2xs">
                          TARGET: {concern.targetArea}
                        </span>
                      </div>

                      <div className="absolute top-3 right-3">
                        <span className="px-2.5 py-0.5 rounded-full bg-[#143461]/90 backdrop-blur-md text-white font-mono text-[9px] font-bold uppercase shadow-2xs">
                          {concern.count}
                        </span>
                      </div>

                      {/* Bottom Active Formulation Protocol over image */}
                      <div className="absolute bottom-3 left-3 right-16">
                        <p className="font-mono text-[10px] text-white font-semibold tracking-wide drop-shadow-sm truncate">
                          ACTIVE: {concern.activeHero}
                        </p>
                      </div>

                      {/* Matched Product Packshot Inset */}
                      <div 
                        className="absolute bottom-2.5 right-2.5 w-12 h-12 bg-white/95 backdrop-blur-md rounded-xl border border-white/80 shadow-md p-1 flex items-center justify-center group-hover:scale-110 transition-transform"
                        title={`Matched Solution: ${concern.productName}`}
                      >
                        <img
                          src={concern.productThumbnail}
                          alt={concern.productName}
                          className="w-full h-full object-contain"
                          loading="lazy"
                        />
                      </div>
                    </div>

                    {/* Card Content */}
                    <div className="p-5">
                      <h3 className="font-serif font-bold text-lg text-[#111827] group-hover:text-[#005995] transition-colors mb-1.5 leading-snug">
                        {concern.title}
                      </h3>
                      <p className="font-sans text-xs text-[#64748B] leading-relaxed">
                        {concern.subtitle}
                      </p>
                    </div>
                  </div>

                  <div className="px-5 pb-5 pt-3 border-t border-[#F1F5F9] flex items-center justify-center text-xs font-semibold text-[#005995] group-hover:text-[#143461]">
                    <span>Explore Matched Solutions</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* 6. NEW LAUNCHES & CLINICAL INNOVATION (Minimalist Split Feature) */}
      {/* ============================================================ */}
      <section className="py-16 sm:py-24 border-b border-[#E2E8F0] bg-white">
        <div className="max-w-[1280px] mx-auto px-5 sm:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            
            {/* Left Column: Innovation Details */}
            <div className="lg:col-span-6">
              <span className="font-mono text-xs font-bold uppercase tracking-widest text-[#005995] block mb-2">
                NEW CLINICAL INNOVATION
              </span>
              <h2 className="font-serif font-medium text-3xl sm:text-4xl text-[#111827] leading-tight mb-4">
                1% Salicylic & Ceramide 2-in-1 Dual Body Wash
              </h2>
              <p className="font-sans text-sm text-[#64748B] leading-relaxed mb-6">
                Most anti-acne body washes strip the dermal moisture barrier, causing rebound sebum secretion and worsening chest and back breakouts. Our breakthrough formulation suspends 1% encapsulated Salicylic Acid in a skin-identical Ceramide NP & AP complex.
              </p>

              <div className="space-y-3 mb-8">
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-[#198775] shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-xs font-sans text-[#111827] block">Pore Unclogging without Peeling</strong>
                    <span className="text-xs font-sans text-[#64748B]">Dissolves follicular sebum while ceramides reinforce natural lipid seals.</span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-[#198775] shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-xs font-sans text-[#111827] block">pH 5.5 Acid-Balanced</strong>
                    <span className="text-xs font-sans text-[#64748B]">Protects natural body microbiome to discourage Cutibacterium acnes overgrowth.</span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-[#198775] shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-xs font-sans text-[#111827] block">Non-Drying Daily Formula</strong>
                    <span className="text-xs font-sans text-[#64748B]">Suitable for sensitive, eczema-prone, and reactive skin areas.</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <button
                  type="button"
                  onClick={() => handleAddToCart('prod-body-salicylic-ceramide', '1% Salicylic & Ceramide 2-in-1 Body Wash')}
                  className="px-6 py-3 rounded-full bg-[#005995] hover:bg-[#004777] text-white font-sans text-xs sm:text-sm font-semibold transition-all shadow-xs cursor-pointer"
                >
                  Buy Now · ₹499
                </button>
                <Link
                  to="/product/1-salicylic-ceramide-2in1-body-wash"
                  className="text-xs font-sans font-semibold text-[#005995] hover:underline"
                >
                  View Product Details →
                </Link>
              </div>
            </div>

            {/* Right Column: Visual Feature Grid */}
            <div className="lg:col-span-6 grid grid-cols-2 gap-4">
              <div className="p-6 rounded-2xl bg-[#F0F6FA] border border-[#E2E8F0]">
                <span className="font-mono text-3xl font-bold text-[#005995] block mb-1">94%</span>
                <h4 className="font-serif font-semibold text-sm text-[#111827] mb-1">Acne Clearance</h4>
                <p className="font-sans text-[11px] text-[#64748B]">Saw visible reduction in active back and chest pustules within 4 weeks.</p>
              </div>

              <div className="p-6 rounded-2xl bg-[#E6F5FF] border border-[#BADCF0]">
                <span className="font-mono text-3xl font-bold text-[#005995] block mb-1">0%</span>
                <h4 className="font-serif font-semibold text-sm text-[#111827] mb-1">Dry Flaking</h4>
                <p className="font-sans text-[11px] text-[#64748B]">Zero barrier disruption reported due to active oat beta glucan and ceramides.</p>
              </div>

              <div className="p-6 rounded-2xl bg-[#FAFBFD] border border-[#E2E8F0]">
                <span className="font-mono text-3xl font-bold text-[#005995] block mb-1">24h</span>
                <h4 className="font-serif font-semibold text-sm text-[#111827] mb-1">Microbiome Shield</h4>
                <p className="font-sans text-[11px] text-[#64748B]">Continuous skin barrier hydration verified via TEWL measurement.</p>
              </div>

              <div className="p-6 rounded-2xl bg-[#FFF7ED] border border-[#FFD699]">
                <span className="font-mono text-3xl font-bold text-[#EB6200] block mb-1">100%</span>
                <h4 className="font-serif font-semibold text-sm text-[#111827] mb-1">Transparent Actives</h4>
                <p className="font-sans text-[11px] text-[#64748B]">Every active percentage openly declared on bottle and packaging.</p>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* 7. BRAND PILLARS (Minimalist "The future of personal care is here") */}
      {/* ============================================================ */}
      <section className="py-16 sm:py-24 border-b border-[#E2E8F0] bg-[#FAFBFD]">
        <div className="max-w-[1280px] mx-auto px-5 sm:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="font-mono text-xs font-bold uppercase tracking-widest text-[#005995] block mb-2">
              OUR CLINICAL CONSTITUTION
            </span>
            <h2 className="font-serif font-medium text-3xl sm:text-4xl text-[#111827] mb-3">
              The future of personal care is here
            </h2>
            <p className="font-sans text-sm text-[#64748B]">
              We believe women deserve scientific integrity, biological truth, and genuine clinical concentrations instead of marketing promises.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="p-7 rounded-2xl bg-white border border-[#E2E8F0] shadow-2xs">
              <div className="w-10 h-10 rounded-xl bg-[#E6F5FF] text-[#005995] flex items-center justify-center mb-5 border border-[#BADCF0]">
                <Layers className="w-5 h-5" />
              </div>
              <h3 className="font-serif font-bold text-lg text-[#111827] mb-2">
                Transparency
              </h3>
              <p className="font-sans text-xs text-[#64748B] leading-relaxed">
                Full disclosure of active percentages (1% Salicylic, 10% AHA, 5000mcg Biotin). We never use token "fairy dusting" or hide behind proprietary blends.
              </p>
            </div>

            <div className="p-7 rounded-2xl bg-white border border-[#E2E8F0] shadow-2xs">
              <div className="w-10 h-10 rounded-xl bg-[#EDFCF5] text-[#198775] flex items-center justify-center mb-5 border border-[#ACCDBE]">
                <RefreshCw className="w-5 h-5" />
              </div>
              <h3 className="font-serif font-bold text-lg text-[#111827] mb-2">
                Biological Efficacy
              </h3>
              <p className="font-sans text-xs text-[#64748B] leading-relaxed">
                Formulated according to human skin renewal cycles (28-day epidermal cycle, 90-day hair follicle cycle) with tracked clinical timelines.
              </p>
            </div>

            <div className="p-7 rounded-2xl bg-white border border-[#E2E8F0] shadow-2xs">
              <div className="w-10 h-10 rounded-xl bg-[#FFF7ED] text-[#EB6200] flex items-center justify-center mb-5 border border-[#FFD699]">
                <Award className="w-5 h-5" />
              </div>
              <h3 className="font-serif font-bold text-lg text-[#111827] mb-2">
                Affordable Integrity
              </h3>
              <p className="font-sans text-xs text-[#64748B] leading-relaxed">
                Premium, medical-grade active formulations sourced from top global laboratories and made accessible directly without luxury markups.
              </p>
            </div>

            <div className="p-7 rounded-2xl bg-white border border-[#E2E8F0] shadow-2xs">
              <div className="w-10 h-10 rounded-xl bg-[#EEF8FF] text-[#005995] flex items-center justify-center mb-5 border border-[#BADCF0]">
                <Shield className="w-5 h-5" />
              </div>
              <h3 className="font-serif font-bold text-lg text-[#111827] mb-2">
                Derm Approved
              </h3>
              <p className="font-sans text-xs text-[#64748B] leading-relaxed">
                pH 5.5 balanced, non-comedogenic, cruelty-free, and thoroughly tested for high safety across Indian weather and skin phototypes.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* 8. MINIMALIST TRUST CIRCLE (Verified Community Reviews) */}
      {/* ============================================================ */}
      <section className="py-16 sm:py-20 border-b border-[#E2E8F0] bg-white">
        <div className="max-w-[1280px] mx-auto px-5 sm:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-12">
            <div>
              <span className="font-mono text-xs font-bold uppercase tracking-widest text-[#005995] block mb-2">
                REAL WOMEN · REAL TIMELINES
              </span>
              <h2 className="font-serif font-medium text-3xl sm:text-4xl text-[#111827]">
                Be Bodywise Trust Circle
              </h2>
            </div>
            <p className="font-sans text-xs sm:text-sm text-[#64748B] max-w-md">
              Over 10 Lakh+ women have tracked their 90-day results journey with verified medical milestones.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 rounded-2xl bg-[#FAFBFD] border border-[#E2E8F0] flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-1 mb-3 text-[#EB6200]">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-current" />
                  ))}
                </div>
                <p className="font-serif italic text-sm text-[#111827] leading-relaxed mb-4">
                  "I struggled with stubborn strawberry legs and bacne for 4 years. The 1% Salicylic wash plus the 10% AHA lotion cleared up my bumpy skin completely by Day 42. Having the day-by-day tracker kept me consistent."
                </p>
              </div>
              <div className="pt-3 border-t border-[#E2E8F0]">
                <p className="font-sans font-semibold text-xs text-[#111827]">Priya M., Mumbai</p>
                <p className="font-mono text-[10px] text-[#005995]">Verified Buyer · Day 52 Milestones</p>
              </div>
            </div>

            <div className="p-6 rounded-2xl bg-[#FAFBFD] border border-[#E2E8F0] flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-1 mb-3 text-[#EB6200]">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-current" />
                  ))}
                </div>
                <p className="font-serif italic text-sm text-[#111827] leading-relaxed mb-4">
                  "The AHA Roll-on is magical. No dark friction marks and zero odour even after gym workouts. It doesn't plug pores like normal aluminium roll-ons. Reordering my 3rd bottle now!"
                </p>
              </div>
              <div className="pt-3 border-t border-[#E2E8F0]">
                <p className="font-sans font-semibold text-xs text-[#111827]">Ananya S., Bengaluru</p>
                <p className="font-mono text-[10px] text-[#005995]">Verified Buyer · Day 64 Milestones</p>
              </div>
            </div>

            <div className="p-6 rounded-2xl bg-[#FAFBFD] border border-[#E2E8F0] flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-1 mb-3 text-[#EB6200]">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-current" />
                  ))}
                </div>
                <p className="font-serif italic text-sm text-[#111827] leading-relaxed mb-4">
                  "As a dermatologist, I appreciate that Be Bodywise declares actual active percentages. The 10% Urea lotion softens severe winter heel cracks and thick keratosis faster than luxury brands."
                </p>
              </div>
              <div className="pt-3 border-t border-[#E2E8F0]">
                <p className="font-sans font-semibold text-xs text-[#111827]">Dr. Radhika K., Delhi</p>
                <p className="font-mono text-[10px] text-[#005995]">Verified Medical Buyer · Day 90</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* 9. WOMEN'S WELLNESS DIAGNOSTIC ASSESSMENT HUB */}
      {/* ============================================================ */}
      <section className="py-16 sm:py-24 bg-[#143461] text-white border-b border-[#225396] relative overflow-hidden">
        <div className="max-w-[1280px] mx-auto px-5 sm:px-8 relative z-10">
          
          <div className="text-center max-w-2xl mx-auto mb-10">
            <span className="font-mono text-xs font-bold uppercase tracking-widest text-[#BADCF0] block mb-2">
              ADAPTIVE CLINICAL DIAGNOSTIC TEST
            </span>
            <h2 className="font-serif font-medium text-3xl sm:text-4xl text-white leading-tight mb-3">
              Know Everything About Your Biological Type & Needs
            </h2>
            <p className="font-sans text-xs sm:text-sm text-[#BADCF0] leading-relaxed">
              Our dynamic assessment adapts questions and options based on your answers to decode your root causes and formulate your doctor-verified 3-step Be Bodywise prescription routine.
            </p>
          </div>

          {/* Category Assessment Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
            {[
              {
                id: 'hair',
                icon: '💇‍♀️',
                title: 'Hair Health',
                subtitle: 'Shedding, dormant follicles & scalp sebum imbalance',
                query: 'hair',
              },
              {
                id: 'body',
                icon: '🧴',
                title: 'Body Care',
                subtitle: 'Bacne, strawberry legs (KP) & dark underarms',
                query: 'body',
              },
              {
                id: 'pcos',
                icon: '🌸',
                title: 'PCOS & Hormones',
                subtitle: 'Delayed cycles, PMS gut bloating & hormonal acne',
                query: 'pcos',
              },
              {
                id: 'skin',
                icon: '✨',
                title: 'Skin & Face',
                subtitle: 'Active breakouts, dark spots & barrier repair',
                query: 'skin',
              },
            ].map(cat => (
              <Link
                key={cat.id}
                to={`/match?category=${cat.query}`}
                className="p-6 rounded-2xl bg-[#0F2748] border border-[#225396] hover:border-[#BADCF0] hover:bg-[#183d73] transition-all flex flex-col justify-between group cursor-pointer"
              >
                <div>
                  <span className="text-3xl block mb-3">{cat.icon}</span>
                  <h3 className="font-serif font-bold text-base text-white group-hover:text-[#BADCF0] transition-colors mb-1">
                    {cat.title}
                  </h3>
                  <p className="font-sans text-xs text-[#BADCF0]/80 leading-relaxed">
                    {cat.subtitle}
                  </p>
                </div>

                <div className="pt-4 mt-4 border-t border-[#225396]/60 flex items-center justify-between text-xs font-semibold text-[#BADCF0]">
                  <span>Start Test</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>
            ))}
          </div>

          {/* Central Call to Action */}
          <div className="p-6 sm:p-8 rounded-3xl bg-[#0F2748]/80 border border-[#225396] flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-[#005995] text-white flex items-center justify-center shrink-0">
                <Sparkles className="w-6 h-6 text-[#FFD699]" />
              </div>
              <div>
                <strong className="font-serif font-bold text-base text-white block">
                  Takes less than 3 minutes · 100% Free & Doctor-Formulated
                </strong>
                <span className="text-xs text-[#BADCF0] font-sans">
                  Get your biological health persona, identified lifestyle triggers, and 20% routine discount.
                </span>
              </div>
            </div>

            <Link
              to="/match"
              className="px-8 py-3.5 rounded-full bg-white hover:bg-[#FAFBFD] text-[#143461] font-sans font-bold text-xs sm:text-sm transition-all shadow-md hover:scale-105 active:scale-95 shrink-0"
            >
              Take Comprehensive Assessment →
            </Link>
          </div>

        </div>
      </section>

      {/* ============================================================ */}
      {/* 10. TRANSPARENCY FAQ ACCORDION (Minimalist Educational Hub) */}
      {/* ============================================================ */}
      <section className="py-16 sm:py-24 bg-[#FAFBFD]">
        <div className="max-w-[840px] mx-auto px-5 sm:px-8">
          <div className="text-center mb-12">
            <span className="font-mono text-xs font-bold uppercase tracking-widest text-[#005995] block mb-2">
              FREQUENTLY ASKED QUESTIONS
            </span>
            <h2 className="font-serif font-medium text-3xl text-[#111827]">
              Understanding Your Active Formulations
            </h2>
          </div>

          <div className="space-y-3">
            {faqs.map((faq, idx) => {
              const isOpen = openFaq === idx;
              return (
                <div
                  key={idx}
                  className="rounded-2xl bg-white border border-[#E2E8F0] overflow-hidden transition-all shadow-2xs"
                >
                  <button
                    type="button"
                    onClick={() => setOpenFaq(isOpen ? null : idx)}
                    className="w-full p-5 text-left flex items-center justify-between gap-4 font-serif font-semibold text-sm sm:text-base text-[#111827] cursor-pointer hover:text-[#005995]"
                  >
                    <span>{faq.q}</span>
                    <ChevronDown className={`w-4 h-4 text-[#005995] shrink-0 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                  </button>
                  {isOpen && (
                    <div className="px-5 pb-5 pt-1 text-xs text-[#64748B] font-sans leading-relaxed border-t border-[#E2E8F0]/50 animate-in fade-in">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

    </div>
  );
};
