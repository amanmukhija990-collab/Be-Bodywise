import React, { useState, useMemo } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { CATALOGUE_PRODUCTS } from '../data/catalogue';
import { CATEGORIES_DATA, getCategoryById } from '../data/categoriesData';
import { ProductImage } from '../components/ProductImage';
import { 
  ArrowRight, Star, ShoppingBag, ShieldCheck, Sparkles, 
  Clock, ChevronRight, ChevronDown, CheckCircle2, ArrowLeft,
  Filter, HelpCircle, Heart, Shield
} from 'lucide-react';

export const CategoryPage: React.FC = () => {
  const { categoryId = 'hair' } = useParams<{ categoryId: string }>();
  const navigate = useNavigate();
  const { addToCart, addToast, setIsCartOpen } = useApp();

  const category = getCategoryById(categoryId) || CATEGORIES_DATA[0];

  const [selectedConcern, setSelectedConcern] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'featured' | 'rating' | 'price-low' | 'price-high'>('featured');
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  // Products matching this category
  const categoryProducts = useMemo(() => {
    return CATALOGUE_PRODUCTS.filter(product => {
      const catId = category.id.toLowerCase();
      
      let matchesCategory = false;
      if (catId === 'hair') {
        matchesCategory = product.category === 'hair';
      } else if (catId === 'body' || catId === 'body-care') {
        matchesCategory = product.category === 'body';
      } else if (catId === 'face' || catId === 'skin') {
        matchesCategory = product.category === 'skin';
      } else if (catId === 'winter' || catId === 'winter-care') {
        matchesCategory = product.id.includes('urea') || 
          product.slug.includes('urea') || 
          product.name.toLowerCase().includes('ceramide') ||
          product.concerns.some(c => c.toLowerCase().includes('dryness'));
      } else if (catId === 'health-fitness' || catId === 'pcos' || catId === 'gummies') {
        matchesCategory = product.id.includes('gummies') || 
          product.id.includes('pcos') || 
          product.concerns.some(c => c.toLowerCase().includes('pcos') || c.toLowerCase().includes('hormonal') || c.toLowerCase().includes('bloating')) ||
          product.name.toLowerCase().includes('gummies');
      } else if (catId === 'special-offers' || catId === 'kits' || catId === 'offers') {
        matchesCategory = Boolean(product.mrp && product.mrp > product.price) || 
          product.id === 'prod-body-3' || product.id === 'prod-body-1' || product.id === 'prod-body-2';
      } else if (catId === 'sun' || catId === 'sun-protection') {
        matchesCategory = product.purposes.includes('sun_protection') || 
          product.name.toLowerCase().includes('sunscreen') || 
          product.slug.includes('spf');
      } else {
        matchesCategory = product.category === catId;
      }

      if (!matchesCategory) return false;

      // Filter by concern if selected
      if (selectedConcern !== 'all') {
        const q = selectedConcern.toLowerCase();
        const matchesConcern = product.concerns.some(c => c.toLowerCase().includes(q)) ||
                               product.purposes.some(p => p.toLowerCase().includes(q)) ||
                               product.name.toLowerCase().includes(q) ||
                               product.tagline.toLowerCase().includes(q);
        if (!matchesConcern) return false;
      }

      return true;
    }).sort((a, b) => {
      if (sortBy === 'rating') return (b.rating || 4.8) - (a.rating || 4.8);
      if (sortBy === 'price-low') return a.price - b.price;
      if (sortBy === 'price-high') return b.price - a.price;
      return 0;
    });
  }, [category.id, selectedConcern, sortBy]);

  const handleAddToCart = (productId: string, productName: string) => {
    addToCart(productId, 1);
    addToast('Added to Shopping Bag!', `${productName} added to your bag`, 'success');
  };

  return (
    <div className="w-full flex flex-col bg-[#FAFBFD] min-h-screen selection:bg-[#005995]/20 selection:text-[#005995]">
      
      {/* Breadcrumb Navigation */}
      <div className="border-b border-[#E2E8F0] bg-white py-3">
        <div className="max-w-[1280px] mx-auto px-5 sm:px-8 flex items-center gap-2 text-xs font-sans text-[#64748B]">
          <Link to="/" className="hover:text-[#005995] transition-colors">
            Home
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-[#CBD5E1]" />
          <Link to="/shop/all" className="hover:text-[#005995] transition-colors">
            Shop by Category
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-[#CBD5E1]" />
          <span className="font-semibold text-[#111827]">
            {category.name}
          </span>
        </div>
      </div>

      {/* Category Hero Banner */}
      <section className="relative border-b border-[#E2E8F0] bg-gradient-to-b from-[#E6F5FF]/50 via-white to-white py-10 sm:py-16">
        <div className="max-w-[1280px] mx-auto px-5 sm:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            {/* Left: Category Editorial Info */}
            <div className="lg:col-span-8 flex flex-col items-start">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-[#BADCF0] text-[#005995] font-mono text-[11px] font-bold uppercase tracking-wider mb-3 shadow-2xs">
                <Sparkles className="w-3.5 h-3.5 text-[#005995]" />
                <span>{category.badge}</span>
              </div>

              <h1 className="font-serif font-medium text-3xl sm:text-5xl text-[#111827] leading-[1.15] mb-4">
                {category.headline}
              </h1>

              <p className="font-sans text-sm sm:text-base text-[#64748B] max-w-2xl leading-relaxed mb-6">
                {category.description}
              </p>

              {/* Doctor Note Box */}
              <div className="p-4 rounded-2xl bg-[#F0F6FA] border border-[#BADCF0] flex items-start gap-3 max-w-2xl mb-8">
                <ShieldCheck className="w-5 h-5 text-[#005995] shrink-0 mt-0.5" />
                <div>
                  <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-[#005995] block mb-0.5">
                    CLINICAL PHARMACOLOGY NOTE
                  </span>
                  <p className="font-sans text-xs text-[#334155] leading-relaxed">
                    {category.doctorNote}
                  </p>
                </div>
              </div>

              {/* Action CTAs */}
              <div className="flex flex-wrap items-center gap-3">
                <Link
                  to={`/match?category=${category.id === 'pcos' ? 'pcos' : category.id === 'hair' ? 'hair' : 'body'}`}
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#005995] hover:bg-[#004777] text-white font-sans text-xs sm:text-sm font-semibold transition-all shadow-md hover:-translate-y-0.5 cursor-pointer"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Take {category.shortName} Assessment</span>
                </Link>

                <a
                  href="#catalog"
                  className="inline-flex items-center gap-1.5 px-6 py-3 rounded-full bg-white hover:bg-[#FAFBFD] border border-[#E2E8F0] text-[#111827] font-sans text-xs sm:text-sm font-semibold transition-all hover:border-[#005995] shadow-2xs cursor-pointer"
                >
                  <span>Browse {categoryProducts.length} Formulations</span>
                  <ArrowRight className="w-4 h-4 text-[#005995]" />
                </a>
              </div>
            </div>

            {/* Right: Featured Category Packshot */}
            <div className="lg:col-span-4 flex justify-center">
              <div className="relative w-full max-w-[280px] aspect-[4/3] sm:aspect-square rounded-2xl bg-white border border-[#BADCF0] shadow-xl p-4 overflow-hidden group">
                <img
                  src={category.image}
                  alt={category.name}
                  className="w-full h-full object-cover rounded-xl group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none rounded-2xl" />
                <div className="absolute bottom-4 left-4 right-4 text-white">
                  <span className="font-mono text-[9px] uppercase tracking-wider font-bold bg-[#005995] px-2 py-0.5 rounded-full inline-block mb-1">
                    BE BODYWISE OFFICIAL
                  </span>
                  <h3 className="font-serif font-bold text-lg text-white leading-tight">
                    {category.name}
                  </h3>
                  <p className="font-sans text-xs text-white/80 line-clamp-1">
                    {category.tagline}
                  </p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Category Switcher Tabs (All 8 Categories) */}
      <section className="bg-white border-b border-[#E2E8F0] sticky top-[72px] z-30 shadow-2xs">
        <div className="max-w-[1280px] mx-auto px-5 sm:px-8">
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-3">
            <span className="font-mono text-[10px] uppercase font-bold text-[#64748B] shrink-0 mr-1 flex items-center gap-1">
              <Filter className="w-3 h-3 text-[#005995]" />
              <span>Categories:</span>
            </span>
            {CATEGORIES_DATA.map(cat => {
              const isActive = cat.id === category.id;
              return (
                <Link
                  key={cat.id}
                  to={cat.path}
                  className={`px-4 py-2 rounded-full text-xs font-sans font-medium whitespace-nowrap transition-all flex items-center gap-1.5 ${
                    isActive
                      ? 'bg-[#005995] text-white shadow-xs font-semibold'
                      : 'bg-[#F0F6FA] text-[#64748B] hover:bg-white hover:text-[#005995] border border-transparent hover:border-[#E2E8F0]'
                  }`}
                >
                  <span>{cat.name}</span>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* Product Catalog Section */}
      <section id="catalog" className="py-12 sm:py-16 scroll-mt-28">
        <div className="max-w-[1280px] mx-auto px-5 sm:px-8">
          
          {/* Controls Bar: Concern Chips & Sort */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 pb-4 border-b border-[#E2E8F0]">
            {/* Concern Chips */}
            <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1">
              <button
                type="button"
                onClick={() => setSelectedConcern('all')}
                className={`px-3.5 py-1.5 rounded-full text-xs font-sans font-medium whitespace-nowrap transition-all cursor-pointer ${
                  selectedConcern === 'all'
                    ? 'bg-[#111827] text-white font-semibold shadow-2xs'
                    : 'bg-white text-[#64748B] hover:text-[#111827] border border-[#E2E8F0]'
                }`}
              >
                All {category.shortName} ({categoryProducts.length})
              </button>
              {category.targetConcerns.map(concern => (
                <button
                  key={concern}
                  type="button"
                  onClick={() => setSelectedConcern(concern)}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-sans font-medium whitespace-nowrap transition-all cursor-pointer ${
                    selectedConcern === concern
                      ? 'bg-[#005995] text-white font-semibold shadow-2xs'
                      : 'bg-white text-[#64748B] hover:text-[#005995] border border-[#E2E8F0]'
                  }`}
                >
                  {concern}
                </button>
              ))}
            </div>

            {/* Sort Dropdown */}
            <div className="flex items-center gap-2 shrink-0 self-end md:self-auto">
              <span className="font-sans text-xs text-[#64748B]">Sort by:</span>
              <select
                value={sortBy}
                onChange={e => setSortBy(e.target.value as any)}
                className="px-3 py-1.5 rounded-full bg-white border border-[#E2E8F0] text-xs font-sans text-[#111827] outline-none cursor-pointer focus:ring-1 focus:ring-[#005995]"
              >
                <option value="featured">Featured</option>
                <option value="rating">Highest Rated</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
              </select>
            </div>
          </div>

          {/* Product Grid */}
          {categoryProducts.length === 0 ? (
            <div className="py-16 text-center bg-white rounded-3xl border border-[#E2E8F0] p-8 max-w-md mx-auto">
              <p className="font-serif font-semibold text-lg text-[#111827] mb-1">
                No formulations match this concern
              </p>
              <p className="font-sans text-xs text-[#64748B] mb-4">
                Try resetting your concern filter to view all products in {category.name}.
              </p>
              <button
                type="button"
                onClick={() => setSelectedConcern('all')}
                className="px-5 py-2 rounded-full bg-[#005995] text-white text-xs font-semibold cursor-pointer shadow-xs"
              >
                View All {category.name}
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {categoryProducts.map(product => {
                const mrp = product.mrp || Math.round(product.price * 1.25);
                const discount = Math.round(((mrp - product.price) / mrp) * 100);

                return (
                  <div
                    key={product.id}
                    onClick={() => navigate(`/product/${product.slug}`)}
                    className="bg-white rounded-2xl border border-[#E2E8F0] overflow-hidden shadow-2xs hover:shadow-xl hover:border-[#005995] transition-all flex flex-col justify-between group cursor-pointer"
                  >
                    <div>
                      {/* Image Packshot */}
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

                      {/* Content details */}
                      <div className="p-4">
                        <span className="font-mono text-[10px] uppercase font-bold tracking-wider text-[#005995] block mb-1 truncate">
                          {product.actives.slice(0, 3).join(' · ')}
                        </span>

                        <h3 className="font-serif font-bold text-sm text-[#111827] leading-snug line-clamp-1 mb-1 group-hover:text-[#005995] transition-colors">
                          {product.name}
                        </h3>

                        <p className="font-sans text-xs text-[#64748B] leading-relaxed line-clamp-2 mb-3 min-h-[32px]">
                          {product.tagline}
                        </p>

                        <div className="flex items-center gap-1.5 text-[11px] text-[#64748B] font-sans pb-1">
                          <Clock className="w-3 h-3 text-[#005995]" />
                          <span>First visible change: <strong>Day {product.timeline.firstChangeDay}</strong></span>
                        </div>
                      </div>
                    </div>

                    {/* Bottom: Price & Add to Bag */}
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
          )}

        </div>
      </section>

      {/* Clinical FAQs Section for this Category */}
      <section className="py-14 sm:py-20 bg-white border-t border-b border-[#E2E8F0]">
        <div className="max-w-[800px] mx-auto px-5 sm:px-8">
          <div className="text-center mb-10">
            <span className="font-mono text-xs font-bold uppercase tracking-widest text-[#005995] block mb-2">
              FREQUENTLY ASKED QUESTIONS
            </span>
            <h2 className="font-serif font-medium text-2xl sm:text-3xl text-[#111827]">
              Doctor Guidance: {category.name}
            </h2>
            <p className="font-sans text-xs sm:text-sm text-[#64748B] mt-2">
              Everything you need to know about biological timelines, safety protocols, and active ingredient synergy.
            </p>
          </div>

          <div className="flex flex-col gap-3">
            {category.faqs.map((faq, idx) => {
              const isOpen = openFaq === idx;
              return (
                <div
                  key={idx}
                  className="rounded-2xl border border-[#E2E8F0] overflow-hidden transition-all bg-[#FAFBFD]"
                >
                  <button
                    type="button"
                    onClick={() => setOpenFaq(isOpen ? null : idx)}
                    className="w-full p-4 sm:p-5 text-left flex items-center justify-between gap-4 cursor-pointer hover:bg-white transition-colors"
                  >
                    <span className="font-serif font-semibold text-sm sm:text-base text-[#111827]">
                      {faq.q}
                    </span>
                    <ChevronDown className={`w-4 h-4 text-[#005995] shrink-0 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                  </button>
                  {isOpen && (
                    <div className="px-4 sm:px-5 pb-5 pt-1 text-xs sm:text-sm text-[#64748B] font-sans leading-relaxed border-t border-[#E2E8F0]/50 bg-white">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Bottom CTA: Take Personalized Assessment */}
      <section className="py-14 bg-gradient-to-r from-[#005995] to-[#143461] text-white">
        <div className="max-w-[1000px] mx-auto px-5 sm:px-8 text-center">
          <span className="font-mono text-xs font-bold uppercase tracking-widest text-[#BADCF0] block mb-2">
            FREE MEDICAL EVALUATION
          </span>
          <h2 className="font-serif font-medium text-2xl sm:text-4xl text-white mb-4">
            Not sure which {category.name} formulation fits your type?
          </h2>
          <p className="font-sans text-sm text-white/80 max-w-xl mx-auto leading-relaxed mb-6">
            Take our 2-minute clinical assessment to decode your specific symptoms and receive a doctor-prescribed daily routine.
          </p>
          <Link
            to={`/match?category=${category.id === 'pcos' ? 'pcos' : category.id === 'hair' ? 'hair' : 'body'}`}
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-white text-[#005995] hover:bg-[#F0F6FA] font-sans font-semibold text-sm shadow-lg hover:scale-105 transition-all"
          >
            <Sparkles className="w-4 h-4" />
            <span>Take {category.shortName} Assessment →</span>
          </Link>
        </div>
      </section>

    </div>
  );
};
