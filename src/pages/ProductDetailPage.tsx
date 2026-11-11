import React, { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { CATALOGUE_PRODUCTS } from '../data/catalogue';
import { ProductImage } from '../components/ProductImage';
import {
  Star, ShieldCheck, ShoppingBag, ArrowLeft, ArrowRight, Clock,
  Sparkles, Check, CheckCircle2, Droplets, AlertCircle, ChevronDown,
  ChevronUp, Truck, RefreshCw, Award, ThumbsUp, HelpCircle, Info,
  Share2, Heart
} from 'lucide-react';

export const ProductDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { addToCart, addToast, setIsCartOpen } = useApp();

  // Scroll to top whenever slug changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [slug]);

  // Find the product by slug or id
  const product = useMemo(() => {
    return CATALOGUE_PRODUCTS.find(p => p.slug === slug || p.id === slug);
  }, [slug]);

  // Gallery state (main preview + gallery thumbnail options)
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  // Variant selector: Standard vs Value Pack
  const [selectedVariant, setSelectedVariant] = useState<'standard' | 'value'>('standard');
  const [quantity, setQuantity] = useState(1);

  // Deep-dive tabs state
  const [activeTab, setActiveTab] = useState<'effective' | 'howToUse' | 'ingredients' | 'clinical' | 'faqs'>('effective');

  // FAQ accordion toggle state
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  // If product not found
  if (!product) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center px-4 py-16 text-center bg-[#FAFBFD]">
        <div className="w-16 h-16 rounded-full bg-[#E6F5FF] text-[#005995] flex items-center justify-center mb-4">
          <AlertCircle className="w-8 h-8" />
        </div>
        <h1 className="font-serif font-bold text-2xl text-[#111827] mb-2">Formulation Not Found</h1>
        <p className="font-sans text-sm text-[#64748B] max-w-md mb-6">
          The requested clinical formulation could not be located in our verified dermatological catalogue.
        </p>
        <Link
          to="/"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#005995] text-white font-sans font-semibold text-sm hover:bg-[#004777] transition-all shadow-md"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Best Sellers</span>
        </Link>
      </div>
    );
  }

  // Pricing calculations
  const basePrice = product.price;
  const baseMrp = product.mrp || Math.round(basePrice * 1.25);
  
  // Value pack offers 2x quantity for 1.7x price (15-20% extra savings)
  const isValuePack = selectedVariant === 'value';
  const unitPrice = isValuePack ? Math.round(basePrice * 1.75) : basePrice;
  const unitMrp = isValuePack ? Math.round(baseMrp * 2) : baseMrp;
  const totalPrice = unitPrice * quantity;
  const discountPercent = Math.round(((unitMrp - unitPrice) / unitMrp) * 100);

  // Gallery images array (Main packshot + Texture / In-use lifestyle references)
  const galleryImages = [
    { src: product.image, label: 'Hero Packshot', caption: 'Clinical Formulation' },
    { 
      src: product.category === 'hair'
        ? 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=800&q=80'
        : product.category === 'body'
          ? 'https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=800&q=80'
          : 'https://images.unsplash.com/photo-1601049541289-9b1b7bbbfe19?auto=format&fit=crop&w=800&q=80',
      label: 'Texture & Consistency',
      caption: 'Lightweight & Non-Sticky'
    },
    { 
      src: 'https://images.unsplash.com/photo-1515377905703-c4788e51af15?auto=format&fit=crop&w=800&q=80',
      label: 'Clinical Application',
      caption: 'Targeted Dermal Absorption'
    },
    {
      src: '/assets/aistudio/image_f1e273ce.png',
      label: 'Doctor Recommended',
      caption: 'Be Bodywise Standard'
    }
  ];

  // Verified Customer Reviews tailored to this formulation
  const reviews = [
    {
      id: 1,
      author: 'Ananya Sharma',
      verified: true,
      rating: 5,
      date: 'Verified Purchase · 2 weeks ago',
      title: 'Remarkable results in 21 days!',
      content: `I struggled with persistent bacne and rough bumps for over two years. Within 3 weeks of daily use, existing bumps dried up and new breakouts completely stopped. It doesn’t dry out my skin like other benzoyl peroxide cleansers.`,
      helpfulCount: 42,
    },
    {
      id: 2,
      author: 'Pooja Iyer',
      verified: true,
      rating: 5,
      date: 'Verified Purchase · 1 month ago',
      title: 'Gentle, zero stinging, pure science.',
      content: `The pH 5.5 formulation makes an enormous difference. My skin barrier remained hydrated throughout winter. Truly worth every rupee!`,
      helpfulCount: 29,
    },
    {
      id: 3,
      author: 'Rhea Sengupta',
      verified: true,
      rating: 4,
      date: 'Verified Purchase · 3 weeks ago',
      title: 'Visible skin smoothing on legs & back',
      content: `Consistent daily use is key. By Day 28 my strawberry legs felt noticeably smoother and post-inflammatory marks have faded significantly.`,
      helpfulCount: 18,
    },
  ];

  // Compatible complementary products from catalogue
  const relatedProducts = CATALOGUE_PRODUCTS.filter(p => p.id !== product.id && (p.category === product.category || p.category === 'body')).slice(0, 3);

  // Handlers for cart actions
  const handleAddToCart = () => {
    addToCart(product.id, quantity);
    addToast('Added to Shopping Bag!', `${quantity}x ${product.name} added to your bag`, 'success');
  };

  const handleBuyNow = () => {
    addToCart(product.id, quantity);
    setIsCartOpen(true);
  };

  // Dynamic FAQs tailored to this formulation
  const faqs = [
    {
      q: `How long before I see visible clinical results with ${product.name}?`,
      a: `Because biological epidermal renewal takes 28 days (and follicle cycles 90 days), noticeable changes typically manifest around Day ${product.timeline.firstChangeDay}. Full biological results peak at Day ${product.timeline.fullResultDay} with consistent daily usage.`,
    },
    {
      q: `Can I pair this formulation with other active chemical exfoliants or serums?`,
      a: `Yes, but space them out. If using exfoliating acids, we recommend applying this formula in your ${product.usage.when} routine, and alternating high-strength peelings or retinoids on separate evenings to prevent barrier irritation.`,
    },
    {
      q: `Is ${product.name} suitable for sensitive or easily irritated skin?`,
      a: `Formulated at skin-identical pH 5.5 with gentle botanical buffers, it is dermatologically tested for all skin types. We always recommend performing a 24-hour patch test behind your ear or on the inner elbow before first application.`,
    },
    {
      q: `What is the correct storage procedure to protect active concentrations?`,
      a: `Store in a cool, dry place away from direct sunlight and extreme steam. Ensure the cap is securely sealed after each application to prevent oxidation of active ingredients.`,
    },
  ];

  return (
    <div className="w-full flex flex-col bg-[#FAFBFD] min-h-screen">
      
      {/* ============================================================ */}
      {/* 1. BREADCRUMBS BAR */}
      {/* ============================================================ */}
      <div className="border-b border-[#E2E8F0] bg-white py-3">
        <div className="max-w-[1280px] mx-auto px-5 sm:px-8">
          <nav className="flex items-center gap-2 text-xs font-sans text-[#64748B]">
            <Link to="/" className="hover:text-[#005995] transition-colors">Home</Link>
            <span className="text-[#CBD5E1]">/</span>
            <Link to="/#bestsellers" className="hover:text-[#005995] transition-colors">Best Sellers</Link>
            <span className="text-[#CBD5E1]">/</span>
            <span className="uppercase tracking-wider font-mono text-[10px] text-[#005995] font-semibold">{product.category}</span>
            <span className="text-[#CBD5E1]">/</span>
            <span className="text-[#111827] font-medium truncate max-w-[200px] sm:max-w-none">{product.name}</span>
          </nav>
        </div>
      </div>

      {/* ============================================================ */}
      {/* 2. MAIN PRODUCT HERO BUY SECTION (Minimalist 2-Column Architecture) */}
      {/* ============================================================ */}
      <section className="py-8 sm:py-12 border-b border-[#E2E8F0] bg-white">
        <div className="max-w-[1280px] mx-auto px-5 sm:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14">
            
            {/* ================= LEFT COLUMN: INTERACTIVE GALLERY ================= */}
            <div className="lg:col-span-6 flex flex-col">
              {/* Main Feature Display Card */}
              <div className="relative aspect-square w-full rounded-2xl bg-[#FAFBFD] border border-[#E2E8F0] overflow-hidden p-6 flex items-center justify-center shadow-2xs group">
                {selectedImageIndex === 0 ? (
                  <ProductImage
                    src={product.image}
                    alt={product.name}
                    category={product.category}
                    className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500"
                  />
                ) : (
                  <img
                    src={galleryImages[selectedImageIndex].src}
                    alt={galleryImages[selectedImageIndex].label}
                    className="w-full h-full object-cover rounded-xl"
                  />
                )}

                {/* Overlaid Clinical Badges */}
                <div className="absolute top-4 left-4 flex flex-col gap-1.5 items-start">
                  <span className="px-2.5 py-1 rounded-md bg-white/95 backdrop-blur-md text-[#005995] font-mono text-[10px] font-bold uppercase tracking-wider border border-[#BADCF0] shadow-2xs">
                    {product.actives[0]}
                  </span>
                  <span className="px-2 py-0.5 rounded-full bg-[#143461] text-white font-mono text-[9px] font-bold uppercase">
                    DOCTOR CURATED
                  </span>
                </div>

                {discountPercent > 0 && (
                  <div className="absolute top-4 right-4 px-2.5 py-1 rounded-full bg-[#198775] text-white font-mono text-[10px] font-bold uppercase tracking-wider shadow-xs">
                    {discountPercent}% OFF
                  </div>
                )}

                {/* Image caption watermark */}
                <div className="absolute bottom-3 left-4 text-[11px] font-sans text-[#64748B] bg-white/90 backdrop-blur-xs px-2.5 py-0.5 rounded-md border border-[#E2E8F0]">
                  {galleryImages[selectedImageIndex].caption}
                </div>
              </div>

              {/* Thumbnail Strip */}
              <div className="grid grid-cols-4 gap-3 mt-4">
                {galleryImages.map((img, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setSelectedImageIndex(idx)}
                    className={`aspect-square rounded-xl overflow-hidden bg-[#FAFBFD] border-2 transition-all p-1.5 cursor-pointer ${
                      selectedImageIndex === idx
                        ? 'border-[#005995] shadow-xs ring-2 ring-[#005995]/20'
                        : 'border-[#E2E8F0] hover:border-[#BADCF0]'
                    }`}
                  >
                    <img
                      src={img.src}
                      alt={img.label}
                      className="w-full h-full object-contain rounded-lg"
                    />
                  </button>
                ))}
              </div>

              {/* Clinical Trust Badges Strip Under Gallery */}
              <div className="grid grid-cols-3 gap-3 mt-6 pt-6 border-t border-[#F1F5F9] text-center">
                <div className="p-3 rounded-xl bg-[#FAFBFD] border border-[#E2E8F0]">
                  <Award className="w-5 h-5 text-[#005995] mx-auto mb-1" />
                  <p className="font-serif font-bold text-xs text-[#111827]">100% Proven</p>
                  <p className="font-sans text-[10px] text-[#64748B]">Clinical grade actives</p>
                </div>
                <div className="p-3 rounded-xl bg-[#FAFBFD] border border-[#E2E8F0]">
                  <ShieldCheck className="w-5 h-5 text-[#005995] mx-auto mb-1" />
                  <p className="font-serif font-bold text-xs text-[#111827]">Derm Tested</p>
                  <p className="font-sans text-[10px] text-[#64748B]">pH 5.5 balanced</p>
                </div>
                <div className="p-3 rounded-xl bg-[#FAFBFD] border border-[#E2E8F0]">
                  <RefreshCw className="w-5 h-5 text-[#005995] mx-auto mb-1" />
                  <p className="font-serif font-bold text-xs text-[#111827]">28-Day Curve</p>
                  <p className="font-sans text-[10px] text-[#64748B]">Real biological turnover</p>
                </div>
              </div>
            </div>

            {/* ================= RIGHT COLUMN: PRODUCT DETAILS & BUY BOX ================= */}
            <div className="lg:col-span-6 flex flex-col justify-start">
              
              {/* Star Rating & Review Link */}
              <div className="flex items-center gap-2 mb-2">
                <div className="flex items-center gap-1 text-[#EB6200]">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-[#EB6200]" />
                  ))}
                </div>
                <span className="font-sans text-xs font-bold text-[#111827]">
                  {product.rating || 4.8} / 5
                </span>
                <span className="text-xs text-[#64748B]">
                  ({product.reviewCount || 2410} verified reviews)
                </span>
                <span className="text-[#CBD5E1]">·</span>
                <span className="text-xs font-semibold text-[#198775]">98% Recommended</span>
              </div>

              {/* Product Title */}
              <h1 className="font-serif font-bold text-2xl sm:text-3xl text-[#111827] leading-tight mb-2">
                {product.name}
              </h1>

              {/* Scientific Tagline */}
              <p className="font-mono text-xs font-semibold text-[#005995] tracking-wide uppercase mb-3">
                {product.tagline}
              </p>

              {/* Clinical Description */}
              <p className="font-sans text-sm text-[#475569] leading-relaxed mb-4">
                Formulated at targeted therapeutic concentrations to treat root biological causes without compromising the skin moisture barrier or hair follicle health.
              </p>

              {/* Dermatologist Endorsement Quote */}
              <div className="p-3.5 rounded-xl bg-[#E6F5FF]/60 border border-[#BADCF0] mb-5">
                <p className="font-sans italic text-xs text-[#143461] leading-relaxed">
                  "Most body formulations use token active levels. Be Bodywise uses calibrated clinical concentrations with balanced pH 5.5 to effectively unclog pores and rebuild cellular density."
                </p>
                <p className="font-sans text-[11px] font-bold text-[#005995] mt-1.5 not-italic">
                  — Dr. A. Sharma, MD Dermatology (Clinical Advisory Board)
                </p>
              </div>

              {/* Minimalist 4-Pill Specs Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-6">
                <div className="p-2 rounded-lg bg-[#FAFBFD] border border-[#E2E8F0] text-center">
                  <span className="font-mono text-[10px] text-[#64748B] block">FRAGRANCE</span>
                  <span className="font-sans text-xs font-bold text-[#111827]">Zero Allergen</span>
                </div>
                <div className="p-2 rounded-lg bg-[#FAFBFD] border border-[#E2E8F0] text-center">
                  <span className="font-mono text-[10px] text-[#64748B] block">COMEDOGENIC</span>
                  <span className="font-sans text-xs font-bold text-[#111827]">Non-Clogging</span>
                </div>
                <div className="p-2 rounded-lg bg-[#FAFBFD] border border-[#E2E8F0] text-center">
                  <span className="font-mono text-[10px] text-[#64748B] block">SKIN-pH</span>
                  <span className="font-sans text-xs font-bold text-[#111827]">5.5 Balanced</span>
                </div>
                <div className="p-2 rounded-lg bg-[#FAFBFD] border border-[#E2E8F0] text-center">
                  <span className="font-mono text-[10px] text-[#64748B] block">SULFATES</span>
                  <span className="font-sans text-xs font-bold text-[#111827]">0% SLS/Parabens</span>
                </div>
              </div>

              {/* Variant / Size Selector */}
              <div className="mb-6">
                <label className="font-sans text-xs font-bold text-[#111827] block mb-2">
                  Select Size / Supply:
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setSelectedVariant('standard')}
                    className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                      selectedVariant === 'standard'
                        ? 'border-[#005995] bg-[#E6F5FF]/50 ring-1 ring-[#005995]'
                        : 'border-[#E2E8F0] bg-white hover:border-[#BADCF0]'
                    }`}
                  >
                    <span className="font-serif font-bold text-xs sm:text-sm text-[#111827] block">
                      {product.sizeMl ? `${product.sizeMl} ml` : '60 Gummies'}
                    </span>
                    <span className="font-sans text-[11px] text-[#64748B] block mt-0.5">
                      Standard Single Unit
                    </span>
                    <span className="font-mono text-xs font-bold text-[#005995] mt-1 block">
                      ₹{basePrice}
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setSelectedVariant('value')}
                    className={`p-3 rounded-xl border text-left transition-all relative cursor-pointer ${
                      selectedVariant === 'value'
                        ? 'border-[#005995] bg-[#E6F5FF]/50 ring-1 ring-[#005995]'
                        : 'border-[#E2E8F0] bg-white hover:border-[#BADCF0]'
                    }`}
                  >
                    <span className="absolute -top-2 right-2 px-1.5 py-0.5 rounded-full bg-[#198775] text-white font-mono text-[9px] font-bold uppercase tracking-wider">
                      SAVE 20%
                    </span>
                    <span className="font-serif font-bold text-xs sm:text-sm text-[#111827] block">
                      {product.sizeMl ? `${product.sizeMl * 2} ml` : '120 Gummies'}
                    </span>
                    <span className="font-sans text-[11px] text-[#64748B] block mt-0.5">
                      2-Month Clinical Duo
                    </span>
                    <span className="font-mono text-xs font-bold text-[#005995] mt-1 block">
                      ₹{Math.round(basePrice * 1.75)}
                    </span>
                  </button>
                </div>
              </div>

              {/* Price Block */}
              <div className="p-4 rounded-xl bg-[#FAFBFD] border border-[#E2E8F0] mb-6">
                <div className="flex items-baseline gap-3 mb-1">
                  <span className="font-serif font-bold text-3xl text-[#111827]">
                    ₹{unitPrice}
                  </span>
                  <span className="font-sans text-base text-[#64748B] line-through">
                    ₹{unitMrp}
                  </span>
                  <span className="px-2 py-0.5 rounded-md bg-[#EDFCF5] text-[#198775] font-mono text-xs font-bold">
                    {discountPercent}% OFF
                  </span>
                </div>
                <p className="font-sans text-xs text-[#64748B]">
                  Inclusive of all taxes · Free delivery on prepaid orders above ₹499
                </p>
              </div>

              {/* Quantity Stepper + Primary Purchase CTAs */}
              <div className="flex flex-col sm:flex-row items-center gap-3 mb-6">
                {/* Quantity Stepper */}
                <div className="flex items-center justify-between border border-[#E2E8F0] rounded-full p-1 bg-white w-full sm:w-32 h-[48px] shrink-0">
                  <button
                    type="button"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-9 h-9 rounded-full flex items-center justify-center text-[#111827] hover:bg-[#F0F6FA] text-base font-bold transition-colors cursor-pointer"
                  >
                    -
                  </button>
                  <span className="font-mono text-sm font-bold text-[#111827]">{quantity}</span>
                  <button
                    type="button"
                    onClick={() => setQuantity(quantity + 1)}
                    className="w-9 h-9 rounded-full flex items-center justify-center text-[#111827] hover:bg-[#F0F6FA] text-base font-bold transition-colors cursor-pointer"
                  >
                    +
                  </button>
                </div>

                {/* Primary Add to Bag */}
                <button
                  type="button"
                  onClick={handleAddToCart}
                  className="flex-1 h-[48px] rounded-full bg-[#005995] hover:bg-[#004777] text-white font-sans font-semibold text-sm transition-all shadow-md hover:-translate-y-0.5 flex items-center justify-center gap-2 cursor-pointer w-full"
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>Add to Bag — ₹{totalPrice}</span>
                </button>

                {/* Buy Now Direct Button */}
                <button
                  type="button"
                  onClick={handleBuyNow}
                  className="h-[48px] px-6 rounded-full bg-[#143461] hover:bg-[#0D2342] text-white font-sans font-semibold text-sm transition-all shadow-xs hover:-translate-y-0.5 flex items-center justify-center gap-1.5 cursor-pointer w-full sm:w-auto shrink-0"
                >
                  <span>Buy Now</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>

              {/* Shipping & Delivery Promise Strip */}
              <div className="space-y-2 pt-2 border-t border-[#F1F5F9] text-xs font-sans text-[#64748B]">
                <div className="flex items-center gap-2">
                  <Truck className="w-4 h-4 text-[#005995]" />
                  <span>Dispatched in 24 hours · Delivered in <strong>2–4 business days</strong> across India</span>
                </div>
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-[#198775]" />
                  <span>100% Doctor-Curated Genuine Formulations directly from GMP lab</span>
                </div>
              </div>

            </div>
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* 3. CLINICAL DEEP-DIVE TABS (Minimalist Architecture) */}
      {/* ============================================================ */}
      <section className="py-12 sm:py-16 border-b border-[#E2E8F0] bg-[#FAFBFD]">
        <div className="max-w-[1280px] mx-auto px-5 sm:px-8">
          
          {/* Segmented Tab Navigation Bar */}
          <div className="flex items-center gap-2 border-b border-[#E2E8F0] pb-4 mb-8 overflow-x-auto scrollbar-none">
            {[
              { id: 'effective', label: 'What Makes It Effective' },
              { id: 'howToUse', label: 'How to Use & Routine' },
              { id: 'ingredients', label: 'Ingredients Breakdown' },
              { id: 'clinical', label: 'Consumer Study Results' },
              { id: 'faqs', label: 'Frequently Asked Questions' },
            ].map(tab => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-4 py-2 rounded-full text-xs font-sans font-semibold whitespace-nowrap transition-all cursor-pointer ${
                  activeTab === tab.id
                    ? 'bg-[#005995] text-white shadow-xs'
                    : 'text-[#64748B] hover:text-[#005995] hover:bg-white'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* TAB 1: What Makes It Effective */}
          {activeTab === 'effective' && (
            <div className="bg-white rounded-2xl border border-[#E2E8F0] p-6 sm:p-8 shadow-2xs">
              <h2 className="font-serif font-bold text-xl text-[#111827] mb-4">
                The Science of {product.name}
              </h2>
              <p className="font-sans text-sm text-[#475569] leading-relaxed mb-6">
                Formulated using pure active molecules calibrated for rapid cellular penetrance. Unlike cosmetic masking agents, this formula directly alters the dermal and follicular micro-environment.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {product.actives.map((active, i) => (
                  <div key={i} className="p-5 rounded-xl bg-[#FAFBFD] border border-[#E2E8F0]">
                    <span className="font-mono text-xs font-bold uppercase tracking-wider text-[#005995] block mb-1">
                      ACTIVE {i + 1}
                    </span>
                    <h3 className="font-serif font-bold text-base text-[#111827] mb-2">{active}</h3>
                    <p className="font-sans text-xs text-[#64748B] leading-relaxed">
                      Clinically proven biological agent that directly regulates cellular renewal, dissolves lipid plugs, and restores dermal balance.
                    </p>
                  </div>
                ))}
              </div>

              <div className="mt-8 p-4 rounded-xl bg-[#E6F5FF]/60 border border-[#BADCF0] flex items-start gap-3">
                <Info className="w-5 h-5 text-[#005995] shrink-0 mt-0.5" />
                <p className="font-sans text-xs text-[#143461] leading-relaxed">
                  <strong>pH 5.5 Scientific Rationale:</strong> Skin naturally functions at an acidic pH between 4.7 and 5.5. Cleansers with alkaline pH disrupt the acid mantle, allowing opportunistic bacteria to trigger breakouts. Be Bodywise maintains exact biological pH equilibrium.
                </p>
              </div>
            </div>
          )}

          {/* TAB 2: How To Use & Routine */}
          {activeTab === 'howToUse' && (
            <div className="bg-white rounded-2xl border border-[#E2E8F0] p-6 sm:p-8 shadow-2xs">
              <h2 className="font-serif font-bold text-xl text-[#111827] mb-4">
                Recommended Dermatological Routine
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="p-5 rounded-xl bg-[#FAFBFD] border border-[#E2E8F0]">
                  <span className="font-mono text-[10px] text-[#64748B] uppercase block mb-1">STEP 1</span>
                  <h3 className="font-serif font-bold text-sm text-[#111827] mb-1">Application Time</h3>
                  <p className="font-sans text-xs text-[#005995] font-semibold">{product.usage.when}</p>
                  <p className="font-sans text-xs text-[#64748B] mt-2">Optimal time window for maximum active absorption without phototoxicity.</p>
                </div>

                <div className="p-5 rounded-xl bg-[#FAFBFD] border border-[#E2E8F0]">
                  <span className="font-mono text-[10px] text-[#64748B] uppercase block mb-1">STEP 2</span>
                  <h3 className="font-serif font-bold text-sm text-[#111827] mb-1">Frequency</h3>
                  <p className="font-sans text-xs text-[#005995] font-semibold">{product.usage.frequency}</p>
                  <p className="font-sans text-xs text-[#64748B] mt-2">Maintains steady biological active concentrations in target tissue.</p>
                </div>

                <div className="p-5 rounded-xl bg-[#FAFBFD] border border-[#E2E8F0]">
                  <span className="font-mono text-[10px] text-[#64748B] uppercase block mb-1">STEP 3</span>
                  <h3 className="font-serif font-bold text-sm text-[#111827] mb-1">Follow-Up Care</h3>
                  <p className="font-sans text-xs text-[#005995] font-semibold">Moisturise & Protect</p>
                  <p className="font-sans text-xs text-[#64748B] mt-2">Seal hydration with a ceramide lotion; wear broad spectrum SPF 50 during daytime.</p>
                </div>
              </div>

              <div className="p-5 rounded-xl bg-[#FAFBFD] border border-[#E2E8F0]">
                <h3 className="font-serif font-bold text-sm text-[#111827] mb-2">Step-by-Step Instructions:</h3>
                <p className="font-sans text-sm text-[#475569] leading-relaxed">
                  {product.usage.instructions}
                </p>
              </div>
            </div>
          )}

          {/* TAB 3: Ingredients Breakdown */}
          {activeTab === 'ingredients' && (
            <div className="bg-white rounded-2xl border border-[#E2E8F0] p-6 sm:p-8 shadow-2xs">
              <h2 className="font-serif font-bold text-xl text-[#111827] mb-2">
                Complete Active Transparency
              </h2>
              <p className="font-sans text-xs sm:text-sm text-[#64748B] mb-6">
                Zero proprietary secrecy. Here is exactly what is inside this clinical formulation and why each compound was selected.
              </p>

              <div className="divide-y divide-[#E2E8F0]">
                {product.actives.map((active, idx) => (
                  <div key={idx} className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div>
                      <p className="font-serif font-bold text-sm text-[#111827]">{active}</p>
                      <p className="font-sans text-xs text-[#64748B]">Primary functional active agent</p>
                    </div>
                    <span className="px-3 py-1 rounded-full bg-[#E6F5FF] text-[#005995] font-mono text-[11px] font-bold border border-[#BADCF0] self-start sm:self-auto">
                      Therapeutic Grade
                    </span>
                  </div>
                ))}
              </div>

              <div className="mt-8 pt-6 border-t border-[#E2E8F0] text-xs font-sans text-[#64748B] leading-relaxed">
                <strong>Base excipients:</strong> Purified Aqua, Glycerin, Sodium Cocoyl Isethionate, Cocamidopropyl Betaine, Decyl Glucoside, Tocopheryl Acetate (Vitamin E), Phenoxyethanol, Ethylhexylglycerin.
              </div>
            </div>
          )}

          {/* TAB 4: Consumer Study Results */}
          {activeTab === 'clinical' && (
            <div className="bg-white rounded-2xl border border-[#E2E8F0] p-6 sm:p-8 shadow-2xs">
              <h2 className="font-serif font-bold text-xl text-[#111827] mb-2">
                4-Week Dermatological Study Results
              </h2>
              <p className="font-sans text-xs sm:text-sm text-[#64748B] mb-8">
                Conducted over 28 days with 120 female participants experiencing recurring follicular body breakouts and skin texture irregularities.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="p-6 rounded-2xl bg-[#E6F5FF]/60 border border-[#BADCF0] text-center">
                  <span className="font-serif font-bold text-4xl text-[#005995] block mb-2">94%</span>
                  <p className="font-sans text-xs text-[#143461] font-semibold">Saw visible reduction in active back and chest breakouts within 28 days</p>
                </div>
                <div className="p-6 rounded-2xl bg-[#E6F5FF]/60 border border-[#BADCF0] text-center">
                  <span className="font-serif font-bold text-4xl text-[#005995] block mb-2">91%</span>
                  <p className="font-sans text-xs text-[#143461] font-semibold">Reported smooth, bump-free skin texture without dryness or flaking</p>
                </div>
                <div className="p-6 rounded-2xl bg-[#E6F5FF]/60 border border-[#BADCF0] text-center">
                  <span className="font-serif font-bold text-4xl text-[#005995] block mb-2">96%</span>
                  <p className="font-sans text-xs text-[#143461] font-semibold">Felt excess surface sebum and sweat odour remained neutralised all day</p>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-[#FAFBFD] border border-[#E2E8F0]">
                <p className="font-sans text-xs text-[#64748B] leading-relaxed">
                  *Third-party independent consumer study monitored under clinical dermatology supervision. Results may vary depending on biological compliance and routine consistency.
                </p>
              </div>
            </div>
          )}

          {/* TAB 5: FAQs */}
          {activeTab === 'faqs' && (
            <div className="bg-white rounded-2xl border border-[#E2E8F0] p-6 sm:p-8 shadow-2xs">
              <h2 className="font-serif font-bold text-xl text-[#111827] mb-6">
                Frequently Asked Questions
              </h2>

              <div className="space-y-3">
                {faqs.map((faq, idx) => (
                  <div
                    key={idx}
                    className="border border-[#E2E8F0] rounded-xl overflow-hidden transition-colors"
                  >
                    <button
                      type="button"
                      onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                      className="w-full p-4 flex items-center justify-between text-left font-serif font-bold text-sm text-[#111827] hover:text-[#005995] cursor-pointer"
                    >
                      <span>{faq.q}</span>
                      {openFaq === idx ? (
                        <ChevronUp className="w-4 h-4 text-[#005995] shrink-0" />
                      ) : (
                        <ChevronDown className="w-4 h-4 text-[#64748B] shrink-0" />
                      )}
                    </button>

                    {openFaq === idx && (
                      <div className="px-4 pb-4 pt-1 font-sans text-xs sm:text-sm text-[#64748B] leading-relaxed border-t border-[#F1F5F9] bg-[#FAFBFD]">
                        {faq.a}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>
      </section>

      {/* ============================================================ */}
      {/* 4. VERIFIED CUSTOMER REVIEWS (Minimalist Review Matrix) */}
      {/* ============================================================ */}
      <section className="py-12 sm:py-16 border-b border-[#E2E8F0] bg-white">
        <div className="max-w-[1280px] mx-auto px-5 sm:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 pb-6 border-b border-[#E2E8F0] gap-4">
            <div>
              <span className="font-mono text-xs font-bold uppercase tracking-widest text-[#005995] block mb-1">
                REAL WOMEN, CLINICAL OUTCOMES
              </span>
              <h2 className="font-serif font-medium text-2xl sm:text-3xl text-[#111827]">
                Customer Ratings & Experiences
              </h2>
            </div>
            <div className="flex items-center gap-3">
              <div className="text-right">
                <span className="font-serif font-bold text-3xl text-[#111827] block leading-none">
                  {product.rating || 4.8}
                </span>
                <span className="font-sans text-[11px] text-[#64748B]">out of 5 stars</span>
              </div>
              <div className="flex items-center gap-1 text-[#EB6200]">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-[#EB6200]" />
                ))}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {reviews.map(review => (
              <div
                key={review.id}
                className="p-6 rounded-2xl bg-[#FAFBFD] border border-[#E2E8F0] flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-1 text-[#EB6200]">
                      {[...Array(review.rating)].map((_, i) => (
                        <Star key={i} className="w-3.5 h-3.5 fill-[#EB6200]" />
                      ))}
                    </div>
                    <span className="font-mono text-[10px] text-[#198775] font-bold uppercase">
                      ✓ Verified Buyer
                    </span>
                  </div>

                  <h3 className="font-serif font-bold text-base text-[#111827] mb-2 leading-snug">
                    "{review.title}"
                  </h3>
                  <p className="font-sans text-xs text-[#475569] leading-relaxed mb-4">
                    {review.content}
                  </p>
                </div>

                <div className="pt-4 border-t border-[#E2E8F0] flex items-center justify-between text-xs text-[#64748B]">
                  <span className="font-semibold text-[#111827]">{review.author}</span>
                  <span>{review.date}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* 5. YOU MIGHT ALSO LIKE (Complementary Clinical Formulations) */}
      {/* ============================================================ */}
      <section className="py-12 sm:py-16 bg-[#FAFBFD]">
        <div className="max-w-[1280px] mx-auto px-5 sm:px-8">
          <div className="text-center max-w-xl mx-auto mb-10">
            <span className="font-mono text-xs font-bold uppercase tracking-widest text-[#005995] block mb-1">
              SYNERGISTIC PROTOCOLS
            </span>
            <h2 className="font-serif font-medium text-2xl sm:text-3xl text-[#111827]">
              You Might Also Like
            </h2>
            <p className="font-sans text-xs sm:text-sm text-[#64748B] mt-1.5">
              Formulations designed to pair seamlessly with {product.name} without ingredient conflicts.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {relatedProducts.map(relProduct => (
              <div
                key={relProduct.id}
                onClick={() => navigate(`/product/${relProduct.slug}`)}
                className="bg-white rounded-2xl border border-[#E2E8F0] overflow-hidden shadow-2xs hover:shadow-md hover:border-[#005995] transition-all cursor-pointer group flex flex-col justify-between"
              >
                <div>
                  <div className="relative aspect-[4/3] w-full bg-[#FAFBFD] overflow-hidden border-b border-[#E2E8F0]">
                    <ProductImage
                      src={relProduct.image}
                      alt={relProduct.name}
                      category={relProduct.category}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-3 left-3 px-2 py-0.5 rounded-full bg-white/95 backdrop-blur-md text-[#111827] font-sans text-[11px] font-semibold flex items-center gap-1 border border-[#E2E8F0]">
                      <Star className="w-3 h-3 fill-[#EB6200] text-[#EB6200]" />
                      <span>{relProduct.rating || 4.8}★</span>
                    </div>
                  </div>

                  <div className="p-4">
                    <span className="font-mono text-[10px] uppercase font-bold text-[#005995] block mb-1 truncate">
                      {relProduct.actives.slice(0, 2).join(' · ')}
                    </span>
                    <h3 className="font-serif font-bold text-sm text-[#111827] leading-snug line-clamp-1 mb-1 group-hover:text-[#005995] transition-colors">
                      {relProduct.name}
                    </h3>
                    <p className="font-sans text-xs text-[#64748B] line-clamp-2">
                      {relProduct.tagline}
                    </p>
                  </div>
                </div>

                <div className="p-4 pt-0">
                  <div className="flex items-center justify-between pt-3 border-t border-[#E2E8F0]">
                    <span className="font-serif font-bold text-base text-[#111827]">
                      ₹{relProduct.price}
                    </span>
                    <span className="text-xs font-semibold text-[#005995] flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
                      View Details <ArrowRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* 6. FIXED BOTTOM ACTION BAR ON MOBILE */}
      {/* ============================================================ */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-[#E2E8F0] p-3 shadow-lg flex items-center justify-between gap-3">
        <div>
          <span className="font-serif font-bold text-lg text-[#111827] leading-tight block">
            ₹{totalPrice}
          </span>
          <span className="font-sans text-[10px] text-[#64748B] truncate block max-w-[150px]">
            {product.name}
          </span>
        </div>
        <button
          type="button"
          onClick={handleAddToCart}
          className="flex-1 py-2.5 px-4 rounded-full bg-[#005995] text-white font-sans font-semibold text-xs transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
        >
          <ShoppingBag className="w-3.5 h-3.5" />
          <span>Add to Bag</span>
        </button>
      </div>

    </div>
  );
};
