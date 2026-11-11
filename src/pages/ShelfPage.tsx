import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { Eyebrow } from '../components/Eyebrow';
import { CircularProgressRing } from '../components/CircularProgressRing';
import { CATALOGUE_PRODUCTS } from '../data/catalogue';
import { evaluateShelfItem, parseDate } from '../lib/statusEngine';
import { Category, ManualProduct } from '../types';
import { ProductImage } from '../components/ProductImage';
import { 
  Plus, MoreVertical, BookOpen, Edit2, Gauge, Check, X, Search, Sparkles, Trash2, Calendar 
} from 'lucide-react';

export const ShelfPage: React.FC = () => {
  const { 
    user, 
    logProductApplication, 
    unlogProductApplication,
    addProductToShelf, 
    removeProductFromShelf, 
    updateShelfItemStartDate, 
    todayStr, 
    addToast 
  } = useApp();
  const navigate = useNavigate();

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [modalTab, setModalTab] = useState<'catalogue' | 'manual'>('catalogue');

  // Catalogue search in modal
  const [catalogueSearch, setCatalogueSearch] = useState('');

  // Manual form state
  const [manualName, setManualName] = useState('');
  const [manualCategory, setManualCategory] = useState<Category>('skin');
  const [manualFrequency, setManualFrequency] = useState('Daily');
  const [manualWhen, setManualWhen] = useState('AM');
  const [manualActives, setManualActives] = useState('');
  const [manualPurposes, setManualPurposes] = useState<string[]>([]);
  const [manualInstructions, setManualInstructions] = useState('');
  const [manualStartDate, setManualStartDate] = useState(todayStr);

  // Active dropdown menu state
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);

  // Edit date dialog state
  const [editingDateItemId, setEditingDateItemId] = useState<string | null>(null);
  const [editDateValue, setEditDateValue] = useState('');

  // Shelf filtering state
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [shelfSearch, setShelfSearch] = useState<string>('');

  const shelf = user?.shelf || [];

  // Compute stat metrics
  const totalProducts = shelf.length;
  let totalConsistency = 0;
  let loggedTodayCount = 0;

  shelf.forEach(item => {
    const evalData = evaluateShelfItem(item, todayStr);
    totalConsistency += evalData.consistency;
    if (item.logs.includes(todayStr)) {
      loggedTodayCount++;
    }
  });

  const avgConsistency = totalProducts > 0 ? Math.round(totalConsistency / totalProducts) : 100;

  const formatDateDisplay = (dateStr: string) => {
    try {
      const d = parseDate(dateStr);
      return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
    } catch {
      return dateStr;
    }
  };

  const handleAddCatalogueItem = (prodId: string) => {
    const product = CATALOGUE_PRODUCTS.find(p => p.id === prodId);
    if (!product) return;

    addProductToShelf(
      product.id,
      undefined,
      todayStr,
      product.usage.when,
      product.usage.frequency,
      product.usage.instructions
    );

    addToast(
      `${product.name} is on your shelf`,
      'Day 1 begins today',
      'success'
    );
    setIsAddModalOpen(false);
  };

  const handleAddManualProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!manualName.trim()) return;

    const manualData: ManualProduct = {
      name: manualName.trim(),
      category: manualCategory,
      actives: manualActives.split(',').map(s => s.trim()).filter(Boolean),
      purposes: manualPurposes,
    };

    addProductToShelf(
      undefined,
      manualData,
      manualStartDate || todayStr,
      manualWhen,
      manualFrequency,
      manualInstructions
    );

    addToast(
      `${manualData.name} added to My Shelf`,
      'Custom formulation added',
      'success'
    );

    // Reset form
    setManualName('');
    setManualActives('');
    setManualPurposes([]);
    setManualInstructions('');
    setIsAddModalOpen(false);
  };

  const togglePurpose = (p: string) => {
    if (manualPurposes.includes(p)) {
      setManualPurposes(manualPurposes.filter(x => x !== p));
    } else {
      setManualPurposes([...manualPurposes, p]);
    }
  };

  const handleSaveEditedDate = () => {
    if (editingDateItemId && editDateValue) {
      updateShelfItemStartDate(editingDateItemId, editDateValue);
      setEditingDateItemId(null);
    }
  };

  const filteredShelf = shelf.filter(item => {
    const evalData = evaluateShelfItem(item, todayStr);
    const cat = item.productId
      ? CATALOGUE_PRODUCTS.find(p => p.id === item.productId)?.category
      : item.manual?.category;
    if (filterCategory !== 'all' && cat !== filterCategory) return false;
    if (filterStatus !== 'all' && evalData.status !== filterStatus) return false;
    if (shelfSearch.trim()) {
      const q = shelfSearch.toLowerCase();
      const name = item.productId
        ? CATALOGUE_PRODUCTS.find(p => p.id === item.productId)?.name
        : item.manual?.name;
      const actives = item.productId
        ? CATALOGUE_PRODUCTS.find(p => p.id === item.productId)?.actives.join(' ')
        : item.manual?.actives.join(' ');
      if (!name?.toLowerCase().includes(q) && !actives?.toLowerCase().includes(q)) return false;
    }
    return true;
  });

  return (
    <div className="w-full max-w-[1280px] mx-auto px-5 sm:px-8 py-8 md:py-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
        <div>
          <Eyebrow className="mb-2">04 · MY SHELF · SINGLE SOURCE OF TRUTH</Eyebrow>
          <h1 className="font-serif font-medium text-3xl sm:text-4xl text-[#111827] leading-tight">
            Everything you own, <span className="italic font-normal text-[#005995]">on the clock.</span>
          </h1>
          <p className="font-sans text-sm sm:text-base text-[#64748B] mt-2 max-w-2xl leading-relaxed">
            Each formula keeps its start date, usage schedule and consistency logs. The Decoder reads directly from here.
          </p>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#005995] hover:bg-[#004777] text-white font-sans font-medium text-sm transition-all shadow-md shadow-[#A46F39]/20 hover:-translate-y-0.5 self-start sm:self-auto cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Add product</span>
        </button>
      </div>

      {/* Stat Cards (3) */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <div className="p-5 rounded-[22px] bg-white border border-[#E2E8F0] shadow-2xs">
          <p className="font-serif font-bold text-3xl text-[#111827]">
            {totalProducts}
          </p>
          <p className="font-mono text-[10px] uppercase tracking-widest text-[#64748B] mt-1 font-semibold">
            SHELF FORMULAS
          </p>
        </div>

        <div className="p-5 rounded-[22px] bg-white border border-[#E2E8F0] shadow-2xs">
          <p className="font-serif font-bold text-3xl text-[#111827]">
            {avgConsistency}%
          </p>
          <p className="font-mono text-[10px] uppercase tracking-widest text-[#64748B] mt-1 font-semibold">
            AVERAGE CONSISTENCY
          </p>
        </div>

        <div className="p-5 rounded-[22px] bg-white border border-[#E2E8F0] shadow-2xs">
          <p className="font-serif font-bold text-3xl text-[#111827]">
            {loggedTodayCount}/{totalProducts}
          </p>
          <p className="font-mono text-[10px] uppercase tracking-widest text-[#64748B] mt-1 font-semibold">
            APPLIED TODAY
          </p>
        </div>
      </div>

      {/* Filter and Search Toolbar */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 mb-8">
        <div className="flex flex-wrap items-center gap-2">
          {/* Category Tabs */}
          <div className="inline-flex items-center bg-[#E6F5FF] p-1 rounded-full border border-[#E2E8F0]">
            {[
              { id: 'all', label: 'All' },
              { id: 'hair', label: 'Hair' },
              { id: 'skin', label: 'Skin' },
              { id: 'body', label: 'Body' },
            ].map(cat => (
              <button
                key={cat.id}
                onClick={() => setFilterCategory(cat.id)}
                className={`px-3.5 py-1.5 rounded-full font-sans text-xs font-semibold capitalize transition-all cursor-pointer ${
                  filterCategory === cat.id
                    ? 'bg-white text-[#111827] shadow-xs'
                    : 'text-[#64748B] hover:text-[#111827]'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Status Dropdown Filter */}
          <select
            value={filterStatus}
            onChange={e => setFilterStatus(e.target.value)}
            className="px-3 py-1.5 rounded-full bg-white border border-[#E2E8F0] text-xs font-sans text-[#111827] outline-none cursor-pointer focus:ring-2 focus:ring-[#005995]"
          >
            <option value="all">All Statuses</option>
            <option value="too_early">Too early</option>
            <option value="lag_phase">Expected lag phase</option>
            <option value="on_track">On track</option>
            <option value="review_usage">Review usage</option>
          </select>
        </div>

        {/* Search */}
        <div className="relative w-full md:w-64">
          <Search className="w-3.5 h-3.5 text-[#64748B] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={shelfSearch}
            onChange={e => setShelfSearch(e.target.value)}
            placeholder="Search shelf formulas…"
            className="w-full pl-8 pr-3 py-1.5 rounded-full bg-white border border-[#E2E8F0] text-xs text-[#111827] focus:outline-none focus:ring-2 focus:ring-[#005995]"
          />
        </div>
      </div>

      {/* Product Cards Grid */}
      {totalProducts === 0 ? (
        <div className="bg-white rounded-3xl border border-[#E2E8F0] p-12 text-center max-w-xl mx-auto shadow-sm">
          <div className="w-14 h-14 rounded-full bg-[#FAFBFD] flex items-center justify-center mx-auto mb-4 text-[#005995]">
            <Sparkles className="w-6 h-6" />
          </div>
          <h3 className="font-serif font-semibold text-2xl text-[#111827] mb-2">
            Your shelf is waiting
          </h3>
          <p className="font-sans text-sm text-[#64748B] mb-6">
            Add what you currently use so we can set your 90-day clocks and consistency schedules.
          </p>
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#143461] text-white text-xs font-semibold hover:bg-[#005995] transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Add your first product</span>
          </button>
        </div>
      ) : filteredShelf.length === 0 ? (
        <div className="bg-white rounded-3xl border border-[#E2E8F0] p-10 text-center max-w-md mx-auto shadow-2xs">
          <p className="font-serif font-semibold text-lg text-[#111827] mb-1">
            No formulas match your filters
          </p>
          <p className="font-sans text-xs text-[#64748B] mb-4">
            Try resetting your category or status filter to see all active shelf items.
          </p>
          <button
            onClick={() => {
              setFilterCategory('all');
              setFilterStatus('all');
              setShelfSearch('');
            }}
            className="px-4 py-2 rounded-full border border-[#E2E8F0] text-xs font-semibold text-[#111827] hover:bg-[#F0F6FA]"
          >
            Reset filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredShelf.map(item => {
            const evalData = evaluateShelfItem(item, todayStr);
            const isLoggedToday = item.logs.includes(todayStr);

            const productName = item.productId
              ? CATALOGUE_PRODUCTS.find(p => p.id === item.productId)?.name || 'Product'
              : item.manual?.name || 'Manual Formula';

            const category = item.productId
              ? CATALOGUE_PRODUCTS.find(p => p.id === item.productId)?.category || 'skin'
              : item.manual?.category || 'skin';

            const image = item.productId
              ? CATALOGUE_PRODUCTS.find(p => p.id === item.productId)?.image
              : 'https://images.unsplash.com/photo-1601049541289-9b1b7bbbfe19?auto=format&fit=crop&w=600&q=80';

            const isCatalogue = !!item.productId;

            return (
              <div
                key={item.id}
                className="bg-white rounded-[24px] border border-[#E2E8F0] overflow-hidden shadow-2xs hover:shadow-md transition-all flex flex-col justify-between relative"
              >
                <div>
                  {/* Top Image + Category Pill + Menu */}
                  <div className="relative h-48 w-full bg-[#E6F5FF] overflow-hidden">
                    <ProductImage
                      src={image}
                      alt={productName}
                      category={category}
                      className="w-full h-full"
                    />
                    <div className="absolute top-3 left-3 px-3 py-1 rounded-full bg-white/90 backdrop-blur-md text-[#111827] font-mono text-[9px] uppercase tracking-wider font-bold shadow-xs z-10">
                      {category}
                    </div>

                    {/* Menu button */}
                    <div className="absolute top-3 right-3">
                      <button
                        onClick={() => setActiveMenuId(activeMenuId === item.id ? null : item.id)}
                        className="w-8 h-8 rounded-full bg-white/90 backdrop-blur-md flex items-center justify-center text-[#111827] hover:bg-white shadow-xs transition-colors cursor-pointer"
                        aria-label="Options"
                      >
                        <MoreVertical className="w-4 h-4" />
                      </button>

                      {/* Dropdown menu */}
                      {activeMenuId === item.id && (
                        <div className="absolute right-0 mt-2 w-48 bg-white rounded-2xl shadow-xl border border-[#E2E8F0] p-1.5 z-30 animate-in fade-in zoom-in-95">
                          <button
                            onClick={() => {
                              setEditingDateItemId(item.id);
                              setEditDateValue(item.startDate);
                              setActiveMenuId(null);
                            }}
                            className="w-full flex items-center gap-2 px-3 py-2 text-xs text-[#111827] rounded-xl hover:bg-[#F0F6FA] transition-colors text-left"
                          >
                            <Calendar className="w-3.5 h-3.5 text-[#005995]" />
                            <span>Edit start date</span>
                          </button>
                          <button
                            onClick={() => {
                              navigate(`/decoder?item=${item.id}`);
                              setActiveMenuId(null);
                            }}
                            className="w-full flex items-center gap-2 px-3 py-2 text-xs text-[#111827] rounded-xl hover:bg-[#F0F6FA] transition-colors text-left"
                          >
                            <Gauge className="w-3.5 h-3.5 text-[#198775]" />
                            <span>View in Decoder</span>
                          </button>
                          <button
                            onClick={() => {
                              removeProductFromShelf(item.id);
                              setActiveMenuId(null);
                            }}
                            className="w-full flex items-center gap-2 px-3 py-2 text-xs text-[#B4492E] rounded-xl hover:bg-[#FBEBE8] transition-colors text-left"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                            <span>Remove from shelf</span>
                          </button>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Body Content */}
                  <div className="p-6">
                    {/* Title & Progress Ring */}
                    <div className="flex items-start justify-between gap-3 mb-3">
                      <div>
                        <h3 className="font-serif font-semibold text-lg text-[#111827] leading-snug line-clamp-1">
                          {productName}
                        </h3>
                        <div className="flex items-center gap-1.5 text-xs text-[#64748B] mt-1 font-sans">
                          {isCatalogue ? (
                            <BookOpen className="w-3.5 h-3.5 text-[#64748B]" />
                          ) : (
                            <Edit2 className="w-3.5 h-3.5 text-[#64748B]" />
                          )}
                          <span>Started {formatDateDisplay(item.startDate)}</span>
                        </div>
                      </div>

                      <CircularProgressRing day={evalData.day} />
                    </div>

                    {/* Chips Row: Status + Timing + Frequency */}
                    <div className="flex flex-wrap items-center gap-2 mb-4">
                      <span
                        className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-sans font-medium"
                        style={{ backgroundColor: evalData.badgeBg, color: evalData.badgeText }}
                      >
                        <span
                          className="w-1.5 h-1.5 rounded-full shrink-0"
                          style={{ backgroundColor: evalData.dotColor }}
                        />
                        <span>{evalData.badgeLabel}</span>
                      </span>

                      <span className="px-2.5 py-1 rounded-full bg-[#F0F6FA] text-[#111827] font-sans text-[11px] font-medium">
                        {item.when}
                      </span>

                      <span className="px-2.5 py-1 rounded-full bg-[#F0F6FA] text-[#111827] font-sans text-[11px] font-medium">
                        {item.frequency}
                      </span>
                    </div>

                    {/* Instructions */}
                    <p className="font-sans text-xs text-[#64748B] leading-relaxed line-clamp-2 mb-4">
                      {item.instructions || 'Apply as directed.'}
                    </p>

                    {/* Consistency Progress Bar */}
                    <div className="pt-2 border-t border-[#E2E8F0]/80 mb-4">
                      <div className="flex items-center justify-between text-xs mb-1.5">
                        <span className="font-sans text-[#64748B]">Consistency</span>
                        <span className="font-sans font-semibold text-[#111827]">
                          {evalData.consistency}% ({item.logs?.length || 0} days)
                        </span>
                      </div>
                      <div className="w-full h-1.5 bg-[#E2E8F0] rounded-full overflow-hidden">
                        <div
                          className="h-full bg-[#005995] rounded-full transition-all duration-500"
                          style={{ width: `${evalData.consistency}%` }}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="p-6 pt-0 flex items-center gap-2.5">
                  {isLoggedToday ? (
                    <button
                      type="button"
                      onClick={() => unlogProductApplication(item.id)}
                      className="flex-1 inline-flex items-center justify-center gap-2 py-3 px-4 rounded-full font-sans text-xs font-semibold bg-[#EDFCF5] hover:bg-[#d5e7dc] text-[#198775] transition-all shadow-xs cursor-pointer"
                      title="Click to unmark if logged by accident"
                    >
                      <Check className="w-4 h-4" />
                      <span>✓ Applied today (tap to unlog)</span>
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => logProductApplication(item.id)}
                      className="flex-1 inline-flex items-center justify-center gap-2 py-3 px-4 rounded-full font-sans text-xs font-semibold bg-[#005995] hover:bg-[#004777] text-white hover:-translate-y-0.5 transition-all shadow-xs cursor-pointer"
                    >
                      <span>+ Log today's application</span>
                    </button>
                  )}

                  <button
                    type="button"
                    onClick={() => navigate(`/decoder?item=${item.id}`)}
                    className="w-10 h-10 rounded-full border border-[#E2E8F0] hover:border-[#005995] flex items-center justify-center text-[#111827] hover:bg-[#F0F6FA] transition-colors shrink-0 shadow-2xs cursor-pointer"
                    title="View in Results Decoder"
                  >
                    <Gauge className="w-4 h-4 text-[#005995]" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ADD TO MY SHELF MODAL (Barcode scanner removed as requested) */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#005995]/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-[24px] max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 sm:p-8 shadow-2xl border border-[#E2E8F0] relative">
            {/* Modal Header */}
            <div className="flex items-start justify-between gap-4 mb-6">
              <div>
                <h3 className="font-serif font-semibold text-2xl text-[#111827]">
                  Add to My Shelf
                </h3>
                <p className="font-sans text-xs sm:text-sm text-[#64748B] mt-1">
                  Choose from our verified clinical catalogue or record your own custom formula.
                </p>
              </div>

              <button
                onClick={() => setIsAddModalOpen(false)}
                className="w-8 h-8 rounded-full bg-[#F0F6FA] text-[#111827] flex items-center justify-center hover:bg-[#E2E8F0] transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Segmented Tabs (Catalogue vs Manual) */}
            <div className="inline-flex w-full bg-[#E6F5FF] p-1 rounded-full border border-[#E2E8F0] mb-6">
              <button
                onClick={() => setModalTab('catalogue')}
                className={`flex-1 py-2 rounded-full font-sans text-xs font-semibold transition-all cursor-pointer ${
                  modalTab === 'catalogue'
                    ? 'bg-white text-[#111827] shadow-xs'
                    : 'text-[#64748B] hover:text-[#111827]'
                }`}
              >
                From Catalogue
              </button>
              <button
                onClick={() => setModalTab('manual')}
                className={`flex-1 py-2 rounded-full font-sans text-xs font-semibold transition-all cursor-pointer ${
                  modalTab === 'manual'
                    ? 'bg-white text-[#111827] shadow-xs'
                    : 'text-[#64748B] hover:text-[#111827]'
                }`}
              >
                Custom Product
              </button>
            </div>

            {/* TAB 1: CATALOGUE */}
            {modalTab === 'catalogue' && (
              <div>
                <div className="relative mb-4">
                  <Search className="w-4 h-4 text-[#64748B] absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={catalogueSearch}
                    onChange={e => setCatalogueSearch(e.target.value)}
                    placeholder="Search gummies, serum, shampoo, niacinamide…"
                    className="w-full pl-9 pr-4 py-2.5 rounded-full bg-[#FAFBFD] border border-[#E2E8F0] text-xs focus:outline-none focus:ring-2 focus:ring-[#005995]"
                  />
                </div>

                <div className="flex flex-col gap-2.5 max-h-[380px] overflow-y-auto pr-1">
                  {CATALOGUE_PRODUCTS.filter(p => {
                    const q = catalogueSearch.toLowerCase();
                    return (
                      p.name.toLowerCase().includes(q) ||
                      p.category.toLowerCase().includes(q) ||
                      p.actives.some(a => a.toLowerCase().includes(q))
                    );
                  }).map(prod => {
                    const isAlreadyOnShelf = shelf.some(s => s.productId === prod.id);

                    return (
                      <div
                        key={prod.id}
                        className={`p-3 rounded-2xl border transition-all flex items-center justify-between gap-4 ${
                          isAlreadyOnShelf
                            ? 'bg-[#FAFBFD] border-[#E2E8F0] opacity-60'
                            : 'bg-white border-[#E2E8F0] hover:border-[#005995] hover:shadow-xs cursor-pointer'
                        }`}
                        onClick={() => {
                          if (!isAlreadyOnShelf) handleAddCatalogueItem(prod.id);
                        }}
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <ProductImage
                            src={prod.image}
                            alt={prod.name}
                            category={prod.category}
                            className="w-12 h-12 rounded-xl shrink-0"
                          />
                          <div className="min-w-0">
                            <p className="font-sans font-semibold text-xs sm:text-sm text-[#111827] truncate">
                              {prod.name}
                            </p>
                            <p className="font-mono text-[10px] text-[#64748B] uppercase truncate">
                              {prod.category} · {prod.actives.slice(0, 2).join(' + ')} · ₹{prod.price}
                            </p>
                          </div>
                        </div>

                        {isAlreadyOnShelf ? (
                          <span className="font-mono text-[10px] uppercase font-bold text-[#64748B] shrink-0">
                            On shelf
                          </span>
                        ) : (
                          <span className="px-3 py-1 rounded-full bg-[#FAFBFD] text-[#005995] font-mono text-[10px] font-bold uppercase hover:bg-[#A46F39] hover:text-white transition-colors shrink-0">
                            + Add
                          </span>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* TAB 2: MANUAL */}
            {modalTab === 'manual' && (
              <form onSubmit={handleAddManualProduct} className="flex flex-col gap-4 text-left">
                <div>
                  <label className="block font-mono text-[10px] uppercase tracking-wider text-[#111827] font-bold mb-1">
                    PRODUCT NAME *
                  </label>
                  <input
                    type="text"
                    required
                    value={manualName}
                    onChange={e => setManualName(e.target.value)}
                    placeholder="e.g. My Vitamin C 20% Serum"
                    className="w-full px-4 py-2.5 rounded-xl bg-[#FAFBFD] border border-[#E2E8F0] text-xs focus:ring-2 focus:ring-[#005995] outline-none"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-mono text-[10px] uppercase tracking-wider text-[#111827] font-bold mb-1">
                      CATEGORY
                    </label>
                    <select
                      value={manualCategory}
                      onChange={e => setManualCategory(e.target.value as Category)}
                      className="w-full px-4 py-2.5 rounded-xl bg-[#FAFBFD] border border-[#E2E8F0] text-xs focus:ring-2 focus:ring-[#005995] outline-none"
                    >
                      <option value="skin">Skin</option>
                      <option value="hair">Hair</option>
                      <option value="body">Body</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-mono text-[10px] uppercase tracking-wider text-[#111827] font-bold mb-1">
                      FREQUENCY
                    </label>
                    <select
                      value={manualFrequency}
                      onChange={e => setManualFrequency(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl bg-[#FAFBFD] border border-[#E2E8F0] text-xs focus:ring-2 focus:ring-[#005995] outline-none"
                    >
                      <option value="Daily">Daily</option>
                      <option value="2+ a week">2+ a week</option>
                      <option value="Weekly">Weekly</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block font-mono text-[10px] uppercase tracking-wider text-[#111827] font-bold mb-2">
                    WHAT IS IT FOR?
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {[
                      'Acne & breakouts',
                      'Open pores & oiliness',
                      'Pigmentation & dark spots',
                      'Dullness & uneven tone',
                      'Dryness & weak barrier',
                      'Hair fall',
                      'Dandruff & itchy scalp',
                    ].map(p => {
                      const isSelected = manualPurposes.includes(p);
                      return (
                        <button
                          key={p}
                          type="button"
                          onClick={() => togglePurpose(p)}
                          className={`px-3 py-1.5 rounded-full text-[11px] font-sans font-medium transition-all cursor-pointer ${
                            isSelected
                              ? 'bg-[#005995] text-white shadow-2xs'
                              : 'bg-[#E6F5FF] text-[#111827] hover:bg-[#E2E8F0]'
                          }`}
                        >
                          {p}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-mono text-[10px] uppercase tracking-wider text-[#111827] font-bold mb-1">
                      KEY ACTIVES
                    </label>
                    <input
                      type="text"
                      value={manualActives}
                      onChange={e => setManualActives(e.target.value)}
                      placeholder="e.g. Vitamin C, Ferulic Acid"
                      className="w-full px-4 py-2.5 rounded-xl bg-[#FAFBFD] border border-[#E2E8F0] text-xs focus:ring-2 focus:ring-[#005995] outline-none"
                    />
                  </div>

                  <div>
                    <label className="block font-mono text-[10px] uppercase tracking-wider text-[#111827] font-bold mb-1">
                      WHEN
                    </label>
                    <select
                      value={manualWhen}
                      onChange={e => setManualWhen(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl bg-[#FAFBFD] border border-[#E2E8F0] text-xs focus:ring-2 focus:ring-[#005995] outline-none"
                    >
                      <option value="AM">AM</option>
                      <option value="PM">PM</option>
                      <option value="Shower">Shower</option>
                      <option value="Any">Any time</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block font-mono text-[10px] uppercase tracking-wider text-[#111827] font-bold mb-1">
                    START DATE
                  </label>
                  <input
                    type="date"
                    value={manualStartDate}
                    onChange={e => setManualStartDate(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-[#FAFBFD] border border-[#E2E8F0] text-xs focus:ring-2 focus:ring-[#005995] outline-none"
                  />
                </div>

                <div>
                  <label className="block font-mono text-[10px] uppercase tracking-wider text-[#111827] font-bold mb-1">
                    INSTRUCTIONS (OPTIONAL)
                  </label>
                  <textarea
                    rows={2}
                    value={manualInstructions}
                    onChange={e => setManualInstructions(e.target.value)}
                    placeholder="How much, where, and for how long..."
                    className="w-full px-4 py-2.5 rounded-xl bg-[#FAFBFD] border border-[#E2E8F0] text-xs focus:ring-2 focus:ring-[#005995] outline-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={!manualName.trim()}
                  className="w-full mt-3 py-3 px-6 rounded-full bg-[#005995] hover:bg-[#004777] disabled:bg-[#8D918A] text-white font-sans text-xs font-semibold transition-all shadow-md cursor-pointer disabled:cursor-not-allowed"
                >
                  Add manual product
                </button>
              </form>
            )}
          </div>
        </div>
      )}

      {/* EDIT START DATE DIALOG */}
      {editingDateItemId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#005995]/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-xl border border-[#E2E8F0]">
            <h4 className="font-serif font-bold text-lg text-[#111827] mb-1">
              Edit Start Date
            </h4>
            <p className="font-sans text-xs text-[#64748B] mb-4">
              Updating the start date recalculates your Day count and verified timeline position.
            </p>
            <input
              type="date"
              value={editDateValue}
              onChange={e => setEditDateValue(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl bg-[#FAFBFD] border border-[#E2E8F0] text-xs focus:ring-2 focus:ring-[#005995] outline-none mb-4"
            />
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setEditingDateItemId(null)}
                className="px-4 py-2 rounded-full border border-[#E2E8F0] text-xs font-semibold text-[#64748B]"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSaveEditedDate}
                className="px-5 py-2 rounded-full bg-[#143461] text-white text-xs font-semibold hover:bg-[#005995]"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
