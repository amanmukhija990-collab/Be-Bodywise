import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { Eyebrow } from '../components/Eyebrow';
import { CatalogueProduct } from '../types';
import { CATALOGUE_PRODUCTS } from '../data/catalogue';
import { runRoutineTest, RoutineTestResult } from '../lib/routineEngine';
import { Search, FlaskConical, Plus, Check, AlertTriangle, AlertCircle, Sparkles } from 'lucide-react';

export const RoutineTestPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const { user, addProductToShelf, addToast } = useApp();

  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCandidate, setSelectedCandidate] = useState<CatalogueProduct | null>(null);
  const [testResult, setTestResult] = useState<RoutineTestResult | null>(null);

  // Check URL param ?product=slug
  useEffect(() => {
    const productSlug = searchParams.get('product');
    if (productSlug) {
      const match = CATALOGUE_PRODUCTS.find(p => p.slug === productSlug);
      if (match) {
        setSelectedCandidate(match);
        setTestResult(null); // Reset until user clicks or runs test
      }
    }
  }, [searchParams]);

  // Filter catalogue
  const filteredProducts = CATALOGUE_PRODUCTS.filter(product => {
    if (filterCategory !== 'all' && product.category !== filterCategory) {
      return false;
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = product.name.toLowerCase().includes(q);
      const matchCategory = product.category.toLowerCase().includes(q);
      const matchActives = product.actives.some(a => a.toLowerCase().includes(q));
      return matchName || matchCategory || matchActives;
    }
    return true;
  });

  const handleRunTest = () => {
    if (!selectedCandidate) return;
    const result = runRoutineTest(selectedCandidate, user?.shelf || []);
    setTestResult(result);
  };

  const handleAddCandidateToShelf = () => {
    if (!selectedCandidate) return;
    const isAlreadyOnShelf = user?.shelf.some(s => s.productId === selectedCandidate.id);
    if (isAlreadyOnShelf) {
      addToast('Already on shelf', `${selectedCandidate.name} is already on your shelf.`);
      return;
    }

    addProductToShelf(
      selectedCandidate.id,
      undefined,
      undefined,
      selectedCandidate.usage.when,
      selectedCandidate.usage.frequency,
      selectedCandidate.usage.instructions
    );

    addToast(
      `${selectedCandidate.name} added to My Shelf`,
      'Start date logged as Day 1',
      'success'
    );

    // Re-run test against updated shelf
    setTimeout(() => {
      if (selectedCandidate) {
        const updated = runRoutineTest(selectedCandidate, user?.shelf || []);
        setTestResult(updated);
      }
    }, 100);
  };

  const shelfCount = user?.shelf.length || 0;

  return (
    <div className="w-full max-w-[1280px] mx-auto px-5 sm:px-8 py-10 md:py-14">
      {/* Header */}
      <div className="max-w-2xl mb-10">
        <Eyebrow className="mb-2">03 · ROUTINE TEST</Eyebrow>
        <h1 className="font-serif font-medium text-3xl sm:text-4xl text-[#172319] leading-tight">
          Test it against your shelf <span className="italic font-normal text-[#A46F39]">before</span> you buy.
        </h1>
        <p className="font-sans text-sm sm:text-base text-[#6B6F66] mt-2 leading-relaxed">
          Pick any product you're considering. We compare its purpose and actives with everything on My Shelf and flag duplicates, overlapping purposes and active clashes.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Catalogue Search & Grid */}
        <div className="lg:col-span-7 flex flex-col gap-6">
          {/* Filter Bar */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
            {/* Segmented Category Pills */}
            <div className="inline-flex items-center bg-[#F0EBE1] p-1 rounded-full border border-[#E9E4D8]">
              {['all', 'hair', 'skin', 'body'].map(cat => (
                <button
                  key={cat}
                  onClick={() => setFilterCategory(cat)}
                  className={`px-4 py-1.5 rounded-full font-sans text-xs font-semibold capitalize transition-all cursor-pointer ${
                    filterCategory === cat
                      ? 'bg-white text-[#172319] shadow-xs'
                      : 'text-[#6B6F66] hover:text-[#172319]'
                  }`}
                >
                  {cat === 'all' ? 'All' : cat}
                </button>
              ))}
            </div>

            {/* Search Input */}
            <div className="relative flex-1 sm:max-w-xs">
              <Search className="w-4 h-4 text-[#6B6F66] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search product or active"
                className="w-full pl-9 pr-4 py-2 rounded-full bg-white border border-[#E9E4D8] text-xs focus:outline-none focus:ring-2 focus:ring-[#A46F39] transition-all"
              />
            </div>
          </div>

          {/* Product Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {filteredProducts.map(product => {
              const isSelected = selectedCandidate?.id === product.id;
              const isOnShelf = user?.shelf.some(s => s.productId === product.id);

              return (
                <button
                  key={product.id}
                  type="button"
                  onClick={() => {
                    setSelectedCandidate(product);
                    setTestResult(null);
                  }}
                  className={`p-3 rounded-2xl bg-white border text-left transition-all relative flex flex-col justify-between cursor-pointer group ${
                    isSelected
                      ? 'border-[#A46F39] ring-2 ring-[#A46F39]/20 shadow-sm -translate-y-0.5'
                      : 'border-[#E9E4D8] hover:border-[#172319]/40 hover:shadow-2xs'
                  }`}
                >
                  <div>
                    {/* Thumbnail */}
                    <div className="w-full aspect-[4/3] rounded-xl overflow-hidden bg-[#F0EBE1] mb-2.5 relative">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      {isOnShelf && (
                        <div className="absolute top-2 right-2 px-2 py-0.5 rounded-full bg-[#E8F1EC] text-[#2C5044] font-mono text-[9px] uppercase font-bold shadow-xs">
                          On shelf
                        </div>
                      )}
                    </div>

                    <span className="font-mono text-[10px] uppercase tracking-wider text-[#A46F39] font-semibold block mb-1">
                      {product.category} · ₹{product.price}
                    </span>

                    <h4 className="font-sans font-semibold text-xs sm:text-sm text-[#172319] leading-snug line-clamp-2">
                      {product.name}
                    </h4>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right Column: Sticky Candidate & Test Panel */}
        <div className="lg:col-span-5 sticky top-24">
          <div className="bg-white border border-[#E9E4D8] rounded-[24px] p-6 sm:p-7 shadow-sm">
            <span className="font-mono text-[10px] uppercase tracking-widest text-[#A46F39] font-bold block mb-4">
              CANDIDATE PRODUCT
            </span>

            {selectedCandidate ? (
              <div>
                <div className="flex items-start gap-4 mb-5">
                  <div className="w-16 h-16 rounded-xl overflow-hidden bg-[#F0EBE1] shrink-0 border border-[#E9E4D8]">
                    <img
                      src={selectedCandidate.image}
                      alt={selectedCandidate.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <h3 className="font-serif font-semibold text-base text-[#172319] leading-snug">
                      {selectedCandidate.name}
                    </h3>
                    <p className="font-mono text-[10px] uppercase text-[#6B6F66] tracking-wide mt-1">
                      {selectedCandidate.actives.join(' · ')}
                    </p>
                  </div>
                </div>

                {/* Shelf comparison count box */}
                <div className="p-4 rounded-xl bg-[#F0EBE1] border border-[#E9E4D8] mb-5">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-mono text-[10px] uppercase tracking-wider text-[#172319] font-bold">
                      TESTING AGAINST MY SHELF · {shelfCount}
                    </span>
                    <Link to="/shelf" className="text-[11px] font-semibold text-[#A46F39] hover:underline">
                      View shelf
                    </Link>
                  </div>

                  {shelfCount === 0 ? (
                    <p className="font-sans text-xs text-[#6B6F66] leading-relaxed">
                      Your shelf is empty —{' '}
                      <Link to="/shelf" className="text-[#A46F39] font-semibold underline">
                        add what you own
                      </Link>{' '}
                      for an accurate clash test.
                    </p>
                  ) : (
                    <div className="flex flex-wrap gap-1.5">
                      {user?.shelf.map(item => {
                        const name = item.productId
                          ? CATALOGUE_PRODUCTS.find(p => p.id === item.productId)?.name || 'Shelf Item'
                          : item.manual?.name || 'Manual Item';
                        return (
                          <span
                            key={item.id}
                            className="px-2.5 py-1 rounded-full bg-white border border-[#E9E4D8] text-[10px] font-medium text-[#172319] truncate max-w-[200px]"
                          >
                            {name}
                          </span>
                        );
                      })}
                    </div>
                  )}
                </div>

                {/* Run Test Button */}
                <button
                  type="button"
                  onClick={handleRunTest}
                  className="w-full inline-flex items-center justify-center gap-2 py-3 px-6 rounded-full bg-[#172319] hover:bg-[#2C5044] text-white font-sans font-medium text-xs sm:text-sm transition-all shadow-sm hover:-translate-y-0.5 cursor-pointer"
                >
                  <FlaskConical className="w-4 h-4 text-[#E29D52]" />
                  <span>Run Routine Test</span>
                </button>

                {/* Test Results Output */}
                {testResult && (
                  <div className="mt-7 pt-6 border-t border-[#E9E4D8] animate-in fade-in slide-in-from-top-3">
                    {/* Gradient Meter */}
                    <div className="mb-4">
                      <div className="relative w-full h-3 rounded-full bg-gradient-to-r from-[#2C5044] via-[#D9822B] via-[#E05A2B] to-[#B4492E] overflow-visible">
                        {/* Dot marker */}
                        <div
                          className="absolute top-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-white border-2 border-[#172319] shadow-md transition-all duration-500"
                          style={{ left: `calc(${testResult.meterPositionPct}% - 8px)` }}
                        />
                      </div>

                      {/* Ticks */}
                      <div className="flex justify-between font-mono text-[8px] uppercase tracking-widest text-[#6B6F66] mt-2 px-1">
                        <span>GOOD</span>
                        <span>CAUTION</span>
                        <span>OVERLAP</span>
                        <span>DUPLICATE</span>
                      </div>
                    </div>

                    {/* Verdict Pill & Headline */}
                    <div className="flex items-center gap-2 mb-1.5">
                      <span
                        className="px-3 py-1 rounded-full text-[10px] font-mono uppercase font-bold tracking-wider"
                        style={{
                          backgroundColor:
                            testResult.overallVerdict === 'GOOD'
                              ? '#E8F1EC'
                              : testResult.overallVerdict === 'CAUTION'
                              ? '#FFF4E5'
                              : testResult.overallVerdict === 'OVERLAP'
                              ? '#FFF0EB'
                              : '#FBEBE8',
                          color: testResult.meterColor,
                        }}
                      >
                        ✓ {testResult.overallVerdict}
                      </span>
                    </div>

                    <h4 className="font-serif font-bold text-lg text-[#172319] mb-1">
                      {testResult.verdictTitle}
                    </h4>
                    <p className="font-sans text-xs text-[#6B6F66] leading-relaxed mb-5">
                      {testResult.verdictSubtitle}
                    </p>

                    {/* Shelf Pair Details */}
                    {testResult.items.length > 0 && (
                      <div className="flex flex-col gap-2.5 mb-6">
                        {testResult.items.map((item, idx) => (
                          <div
                            key={idx}
                            className="p-3 rounded-xl bg-[#FAF7F0] border border-[#E9E4D8] text-xs"
                          >
                            <div className="flex items-center justify-between gap-2 mb-1">
                              <span className="font-sans font-semibold text-[#172319]">
                                {item.shelfItemName}
                              </span>
                              <span
                                className={`font-mono text-[9px] uppercase font-bold tracking-wider px-2 py-0.5 rounded ${
                                  item.verdict === 'COMPLEMENTARY'
                                    ? 'bg-[#E8F1EC] text-[#2C5044]'
                                    : item.verdict === 'CLASH'
                                    ? 'bg-[#FFF4E5] text-[#D9822B]'
                                    : item.verdict === 'OVERLAP'
                                    ? 'bg-[#FFF0EB] text-[#E05A2B]'
                                    : 'bg-[#FBEBE8] text-[#B4492E]'
                                }`}
                              >
                                {item.verdict}
                              </span>
                            </div>
                            <p className="font-sans text-[11px] text-[#6B6F66]">
                              {item.reason}
                            </p>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Actionable Layering Strategy Protocol */}
                    <div className="p-4 rounded-xl bg-[#FAF7F0] border border-[#E9E4D8] mb-5 text-left">
                      <div className="flex items-center gap-1.5 text-xs font-semibold text-[#172319] mb-1">
                        <Sparkles className="w-3.5 h-3.5 text-[#A46F39]" />
                        <span>Recommended Layering Strategy</span>
                      </div>
                      <p className="font-sans text-xs text-[#6B6F66] leading-relaxed">
                        {selectedCandidate.usage.when === 'AM'
                          ? 'Slot this formula into your morning ritual after cleansing. Let absorb for 60 seconds before locking with moisturiser and broad-spectrum SPF.'
                          : selectedCandidate.usage.when === 'PM'
                          ? 'Apply in your evening ritual on dry, clean skin. If using targeted exfoliating acids or peeling solutions, space across alternate evenings.'
                          : 'Apply during shower on damp scalp/skin. Maintain 2–3 minutes contact time before rinsing clean.'}
                      </p>
                    </div>

                    {/* Add to Shelf Button */}
                    <button
                      type="button"
                      onClick={handleAddCandidateToShelf}
                      className="w-full inline-flex items-center justify-center gap-2 py-3 px-6 rounded-full bg-[#A46F39] hover:bg-[#8F5E2D] text-white font-sans font-medium text-xs sm:text-sm transition-all shadow-md shadow-[#A46F39]/20 hover:-translate-y-0.5 cursor-pointer"
                    >
                      <Plus className="w-4 h-4" />
                      <span>+ Bought it — add to shelf</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="py-12 text-center text-[#6B6F66]">
                <FlaskConical className="w-10 h-10 text-[#6B6F66]/30 mx-auto mb-3" />
                <p className="font-serif italic text-base text-[#172319] mb-1">
                  Pick a candidate product on the left
                </p>
                <p className="font-sans text-xs">
                  We'll compare its formulation base against everything you own.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
