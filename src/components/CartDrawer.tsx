import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { CATALOGUE_PRODUCTS } from '../data/catalogue';
import { ProductImage } from './ProductImage';
import { X, Plus, Minus, Trash2, ArrowRight, ShieldCheck, Check, Sparkles, ShoppingBag, AlertCircle, Lock } from 'lucide-react';
import confetti from 'canvas-confetti';

export const CartDrawer: React.FC = () => {
  const navigate = useNavigate();
  const { 
    cart, 
    addToCart,
    isCartOpen, 
    setIsCartOpen, 
    updateCartQuantity, 
    removeFromCart, 
    clearCart, 
    addProductToShelf, 
    user, 
    isLoggedIn,
    login,
    signup,
    addToast 
  } = useApp();

  const [couponCode, setCouponCode] = useState('');
  const [couponApplied, setCouponApplied] = useState(false);
  const [syncToShelf, setSyncToShelf] = useState(true);
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);

  // Authentication required for checkout state
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('login');
  const [authFirstName, setAuthFirstName] = useState('');
  const [authEmail, setAuthEmail] = useState('');
  const [authPassword, setAuthPassword] = useState('');
  const [authError, setAuthError] = useState<string | null>(null);
  const [authSubmitting, setAuthSubmitting] = useState(false);

  // Assessment recommendations resolution:
  // ONLY applies if the user is signed in/created an account AND actually took the test.
  // Will NEVER show before login or before creating a new account.
  const hasTakenAssessment = Boolean(
    isLoggedIn && 
    user && 
    user.matchResults && 
    user.matchResults.length > 0 && 
    user.matchAnswers
  );

  const recommendedProductIds: string[] = useMemo(() => {
    if (hasTakenAssessment && user?.matchResults) {
      return user.matchResults;
    }
    return [];
  }, [hasTakenAssessment, user?.matchResults]);

  const assessmentCategory = user?.matchAnswers?.primaryCategory || 'wellness';
  const assessmentCategoryTitle = 
    assessmentCategory === 'hair' ? 'Hair Health' :
    assessmentCategory === 'body' ? 'Body Care' :
    assessmentCategory === 'pcos' ? 'PCOS & Period Rhythm' :
    assessmentCategory === 'skin' ? 'Facial Dermatology' : 'Wellness';

  // Identify cart items that do not match the recommendation
  const mismatchedCartItems = useMemo(() => {
    if (!hasTakenAssessment || cart.length === 0) return [];
    return cart.filter(item => !recommendedProductIds.includes(item.productId));
  }, [hasTakenAssessment, cart, recommendedProductIds]);

  // Show mismatch message ONLY if logged-in user has taken the assessment test and items in cart do not match
  const hasMismatch = hasTakenAssessment && cart.length > 0 && mismatchedCartItems.length > 0;

  const mismatchedProductNames = useMemo(() => {
    return mismatchedCartItems
      .map(item => {
        const prod = CATALOGUE_PRODUCTS.find(p => p.id === item.productId);
        return prod?.name;
      })
      .filter(Boolean) as string[];
  }, [mismatchedCartItems]);

  const recommendedRoutineProducts = useMemo(() => {
    return recommendedProductIds
      .slice(0, 3)
      .map(id => CATALOGUE_PRODUCTS.find(p => p.id === id))
      .filter(Boolean);
  }, [recommendedProductIds]);

  const handleSwitchToPrescribed = () => {
    if (recommendedRoutineProducts.length === 0) return;
    clearCart();
    recommendedRoutineProducts.forEach(prod => {
      if (prod) {
        addToCart(prod.id, 1);
      }
    });
    confetti({
      particleCount: 50,
      spread: 50,
      origin: { y: 0.5 },
      colors: ['#005995', '#198775', '#BADCF0', '#D4924C'],
    });
    addToast(
      'Recommended Products Loaded',
      `Shopping bag updated with doctor-recommended ${assessmentCategoryTitle} formulas`,
      'success'
    );
  };

  const handleViewAssessment = () => {
    setIsCartOpen(false);
    navigate('/match');
  };

  if (!isCartOpen) return null;

  // Calculate totals
  let mrpTotal = 0;
  let sellingTotal = 0;

  const cartDetails = cart.map(item => {
    const product = CATALOGUE_PRODUCTS.find(p => p.id === item.productId);
    const price = product?.price || 449;
    const mrp = product?.mrp || Math.round(price * 1.25);
    mrpTotal += mrp * item.quantity;
    sellingTotal += price * item.quantity;
    return {
      ...item,
      product,
      itemTotal: price * item.quantity,
    };
  });

  const discountFromMrp = mrpTotal - sellingTotal;
  const couponDiscount = couponApplied ? Math.round(sellingTotal * 0.1) : 0;
  const freeShippingThreshold = 499;
  const isFreeShipping = sellingTotal >= freeShippingThreshold;
  const deliveryFee = isFreeShipping || cart.length === 0 ? 0 : 50;
  const finalTotal = Math.max(0, sellingTotal - couponDiscount + deliveryFee);
  const progressPercent = Math.min(100, Math.round((sellingTotal / freeShippingThreshold) * 100));

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (couponCode.trim().toUpperCase() === 'BODYWISE10') {
      setCouponApplied(true);
      addToast('Coupon applied!', '10% instant discount applied', 'success');
    } else {
      addToast('Invalid coupon', 'Use code BODYWISE10 for 10% off', 'info');
    }
  };

  const handleCompleteOrder = () => {
    setIsCheckingOut(true);
    setTimeout(() => {
      setIsCheckingOut(false);
      setOrderSuccess(true);
      confetti({
        particleCount: 70,
        spread: 60,
        origin: { y: 0.6 },
        colors: ['#005995', '#4292C7', '#BADCF0', '#D4924C', '#EB6200'],
      });

      // If user enabled sync to shelf, add products to their shelf
      if (syncToShelf && user) {
        cart.forEach(item => {
          const product = CATALOGUE_PRODUCTS.find(p => p.id === item.productId);
          if (product && !user.shelf.some(s => s.productId === product.id)) {
            addProductToShelf(
              product.id,
              undefined,
              undefined,
              product.usage.when,
              product.usage.frequency,
              product.usage.instructions
            );
          }
        });
      }

      clearCart();
    }, 1200);
  };

  const handleProceedToBuy = () => {
    // If user is not logged in, ask them to log in before placing order
    if (!isLoggedIn || !user) {
      setShowAuthModal(true);
      return;
    }
    handleCompleteOrder();
  };

  const handleAuthSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);

    if (authMode === 'signup') {
      if (!authFirstName.trim()) {
        setAuthError('Please enter your first name');
        return;
      }
      if (!authEmail.trim() || !authEmail.includes('@')) {
        setAuthError('Please enter a valid email address');
        return;
      }
      if (!authPassword || authPassword.length < 6) {
        setAuthError('Password must be at least 6 characters');
        return;
      }

      setAuthSubmitting(true);
      setTimeout(() => {
        signup(authFirstName, authEmail);
        setAuthSubmitting(false);
        setShowAuthModal(false);
        handleCompleteOrder();
      }, 400);
    } else {
      if (!authEmail.trim() || !authEmail.includes('@')) {
        setAuthError('Please enter a valid email address');
        return;
      }
      if (!authPassword || authPassword.length < 6) {
        setAuthError('Password must be at least 6 characters');
        return;
      }

      setAuthSubmitting(true);
      setTimeout(() => {
        login(authEmail);
        setAuthSubmitting(false);
        setShowAuthModal(false);
        handleCompleteOrder();
      }, 400);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-[#111827]/50 backdrop-blur-xs animate-in fade-in duration-200">
      {/* Click outside to close */}
      <div className="flex-1" onClick={() => setIsCartOpen(false)} />

      {/* Slideout Panel */}
      <div className="w-full max-w-[460px] bg-white h-full shadow-2xl flex flex-col justify-between border-l border-[#E2E8F0] animate-in slide-in-from-right duration-300">
        {/* Header */}
        <div className="p-5 border-b border-[#E2E8F0] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-[#005995]" />
            <h3 className="font-serif font-bold text-lg text-[#111827]">
              Your Shopping Bag ({cart.reduce((s, i) => s + i.quantity, 0)})
            </h3>
          </div>
          <button
            onClick={() => setIsCartOpen(false)}
            className="w-8 h-8 rounded-full bg-[#F0F6FA] flex items-center justify-center text-[#111827] hover:bg-[#E2E8F0] transition-colors cursor-pointer"
            aria-label="Close bag"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {orderSuccess ? (
          <div className="p-8 text-center flex-1 flex flex-col items-center justify-center">
            <div className="w-16 h-16 rounded-full bg-[#EDFCF5] text-[#198775] flex items-center justify-center mx-auto mb-4">
              <Check className="w-8 h-8 stroke-[3]" />
            </div>
            <h4 className="font-serif font-bold text-2xl text-[#111827] mb-2">
              Order Confirmed!
            </h4>
            <p className="font-sans text-xs text-[#64748B] max-w-xs mb-6">
              Thank you for trusting BeBodywise. Your clinical body care formulas are being prepared for dispatch.
            </p>
            {syncToShelf && (
              <div className="p-4 rounded-2xl bg-[#E6F5FF] border border-[#BADCF0] text-left text-xs mb-6 w-full">
                <span className="font-mono text-[9px] uppercase tracking-wider text-[#005995] font-bold block mb-1">
                  AUTOMATICALLY ADDED TO MY SHELF
                </span>
                <p className="font-sans text-[#111827]">
                  ✓ Products are now active on your care journey with Day 1 clinical timelines!
                </p>
              </div>
            )}
            <button
              onClick={() => {
                setOrderSuccess(false);
                setIsCartOpen(false);
              }}
              className="px-6 py-3 rounded-full bg-[#005995] text-white font-sans font-medium text-xs hover:bg-[#004777] transition-all cursor-pointer shadow-xs"
            >
              Continue exploring
            </button>
          </div>
        ) : (
          <>
            {/* Free Shipping Meter */}
            <div className="px-5 py-3 bg-[#F0F6FA] border-b border-[#E2E8F0]">
              <div className="flex items-center justify-between text-xs mb-1.5 font-sans">
                {isFreeShipping ? (
                  <span className="font-semibold text-[#198775] flex items-center gap-1">
                    <span>🎉 You've unlocked FREE Delivery!</span>
                  </span>
                ) : (
                  <span className="text-[#64748B]">
                    Add <strong className="text-[#111827]">₹{freeShippingThreshold - sellingTotal}</strong> more for FREE Shipping
                  </span>
                )}
                <span className="font-mono text-[10px] text-[#005995] font-bold">
                  {progressPercent}%
                </span>
              </div>
              <div className="w-full h-1.5 bg-[#E2E8F0] rounded-full overflow-hidden">
                <div
                  className="h-full bg-[#005995] rounded-full transition-all duration-300"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>

            {/* Cart Items List */}
            <div className="flex-1 overflow-y-auto p-5 space-y-4">
              {/* Product Mismatch Notification banner - shown ONLY if products do not match the Take Assessment recommendation */}
              {hasMismatch && (
                <div className="p-4 rounded-2xl bg-[#FFFBEB] border border-[#FDE68A] text-[#92400E] shadow-xs relative overflow-hidden transition-all animate-in fade-in duration-200">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-xl bg-[#FEF3C7] text-[#D97706] flex items-center justify-center shrink-0 mt-0.5 border border-[#FDE68A]">
                      <AlertCircle className="w-4 h-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-mono text-[9px] uppercase tracking-wider font-bold bg-[#FEF3C7] text-[#B45309] px-2 py-0.5 rounded-full border border-[#FDE68A]">
                          Assessment Mismatch
                        </span>
                      </div>
                      <h5 className="font-serif font-bold text-xs text-[#92400E] leading-tight">
                        Bag items do not match your Take Assessment recommendation
                      </h5>
                      <p className="font-sans text-[11px] text-[#A16207] mt-1.5 leading-relaxed">
                        Your diagnostic assessment prescribed doctor-formulated solutions for{' '}
                        <strong className="text-[#78350F]">{assessmentCategoryTitle}</strong>. 
                        {mismatchedProductNames.length === 1 ? (
                          <> The formula <strong className="text-[#78350F]">&ldquo;{mismatchedProductNames[0]}&rdquo;</strong> in your bag differs from your personalized prescription.</>
                        ) : (
                          <> {mismatchedProductNames.length} items in your bag differ from your assessment recommendations ({mismatchedProductNames.slice(0, 2).join(', ')}{mismatchedProductNames.length > 2 ? '…' : ''}).</>
                        )}
                      </p>

                      {/* Recommended products action buttons */}
                      <div className="mt-3 flex flex-wrap items-center gap-2 pt-2 border-t border-[#FDE68A]/60">
                        {recommendedRoutineProducts.length > 0 && (
                          <button
                            type="button"
                            onClick={handleSwitchToPrescribed}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#D97706] hover:bg-[#B45309] text-white text-[11px] font-sans font-semibold transition-colors cursor-pointer shadow-xs"
                          >
                            <Sparkles className="w-3 h-3" />
                            <span>Switch to Recommended Products</span>
                          </button>
                        )}
                        <button
                          type="button"
                          onClick={handleViewAssessment}
                          className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-white hover:bg-[#FEF3C7] text-[#92400E] border border-[#FDE68A] text-[11px] font-sans font-medium transition-colors cursor-pointer"
                        >
                          <span>Review Assessment</span>
                          <ArrowRight className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {cart.length === 0 ? (
                <div className="py-16 text-center text-[#64748B]">
                  <ShoppingBag className="w-12 h-12 text-[#CBD5E1] mx-auto mb-3" />
                  <p className="font-serif font-semibold text-lg text-[#111827] mb-1">
                    Your bag is empty
                  </p>
                  <p className="font-sans text-xs">
                    Explore our dermatologist-formulated body care solutions above.
                  </p>
                </div>
              ) : (
                cartDetails.map(item => {
                  if (!item.product) return null;
                  return (
                    <div
                      key={item.productId}
                      className="p-3.5 rounded-2xl bg-[#F8FAFC] border border-[#E2E8F0] flex items-start gap-3 relative"
                    >
                      <div className="w-16 h-16 rounded-xl overflow-hidden bg-white shrink-0 border border-[#E2E8F0]">
                        <ProductImage
                          src={item.product.image}
                          alt={item.product.name}
                          category={item.product.category}
                          className="w-full h-full"
                        />
                      </div>

                      <div className="flex-1 min-w-0 pr-6">
                        <h4 className="font-serif font-semibold text-xs text-[#111827] leading-snug line-clamp-2">
                          {item.product.name}
                        </h4>
                        <span className="font-mono text-[10px] text-[#64748B] block mt-0.5">
                          {item.product.sizeMl ? `${item.product.sizeMl}ml` : 'Full size'} · ₹{item.product.price}
                        </span>

                        <div className="flex items-center justify-between mt-2 pt-2 border-t border-[#E2E8F0]/60">
                          {/* Quantity selector */}
                          <div className="inline-flex items-center gap-2 bg-white px-2 py-0.5 rounded-full border border-[#E2E8F0] text-xs">
                            <button
                              type="button"
                              onClick={() => updateCartQuantity(item.productId, -1)}
                              className="text-[#64748B] hover:text-[#111827] cursor-pointer"
                              aria-label="Decrease quantity"
                            >
                              <Minus className="w-3 h-3" />
                            </button>
                            <span className="font-mono font-semibold text-xs text-[#111827]">
                              {item.quantity}
                            </span>
                            <button
                              type="button"
                              onClick={() => updateCartQuantity(item.productId, 1)}
                              className="text-[#64748B] hover:text-[#111827] cursor-pointer"
                              aria-label="Increase quantity"
                            >
                              <Plus className="w-3 h-3" />
                            </button>
                          </div>

                          {/* Line Total */}
                          <span className="font-mono font-bold text-xs text-[#005995]">
                            ₹{item.itemTotal}
                          </span>
                        </div>
                      </div>

                      {/* Remove item button */}
                      <button
                        onClick={() => removeFromCart(item.productId)}
                        className="absolute top-3 right-3 text-[#DC2626] hover:text-red-700 p-1 cursor-pointer"
                        aria-label="Remove item"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  );
                })
              )}
            </div>

            {/* Bottom Panel with Pricing & Checkout */}
            {cart.length > 0 && (
              <div className="p-5 border-t border-[#E2E8F0] bg-white space-y-3">
                {/* Coupon input */}
                <form onSubmit={handleApplyCoupon} className="flex items-center gap-2">
                  <input
                    type="text"
                    value={couponCode}
                    onChange={e => setCouponCode(e.target.value)}
                    placeholder="Enter code (e.g. BODYWISE10)"
                    className="flex-1 px-3 py-1.5 rounded-full bg-[#F8FAFC] border border-[#E2E8F0] text-xs uppercase tracking-wider focus:outline-none focus:ring-1 focus:ring-[#005995]"
                  />
                  <button
                    type="submit"
                    className="px-3.5 py-1.5 rounded-full bg-[#005995] text-white text-xs font-sans font-semibold hover:bg-[#004777] transition-colors cursor-pointer"
                  >
                    Apply
                  </button>
                </form>



                {/* Subtotals Breakdown */}
                <div className="space-y-1.5 pt-2 text-xs font-sans">
                  <div className="flex justify-between text-[#64748B]">
                    <span>Item Total (MRP)</span>
                    <span className="font-mono">₹{mrpTotal}</span>
                  </div>
                  {discountFromMrp > 0 && (
                    <div className="flex justify-between text-[#198775]">
                      <span>Catalog Discount</span>
                      <span className="font-mono">-₹{discountFromMrp}</span>
                    </div>
                  )}
                  {couponApplied && (
                    <div className="flex justify-between text-[#005995] font-semibold">
                      <span>Code BODYWISE10 (10% off)</span>
                      <span className="font-mono">-₹{couponDiscount}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-[#64748B]">
                    <span>Delivery Fee</span>
                    <span className="font-mono">
                      {deliveryFee === 0 ? <strong className="text-[#198775]">FREE</strong> : `₹${deliveryFee}`}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm font-bold text-[#111827] pt-2 border-t border-[#E2E8F0]">
                    <span>To Pay</span>
                    <span className="font-mono text-base text-[#005995]">₹{finalTotal}</span>
                  </div>
                </div>

                {/* Place Order CTA */}
                <button
                  type="button"
                  disabled={isCheckingOut}
                  onClick={handleProceedToBuy}
                  className="w-full py-3.5 rounded-full bg-[#005995] hover:bg-[#004777] disabled:bg-[#94A3B8] text-white font-sans font-semibold text-xs sm:text-sm transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
                >
                  {isCheckingOut ? (
                    <span>Processing order…</span>
                  ) : (
                    <>
                      {!isLoggedIn && <Lock className="w-3.5 h-3.5 opacity-80" />}
                      <span>{!isLoggedIn ? 'Sign In & Place Order' : 'Proceed to Buy'} · ₹{finalTotal}</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>

                {!isLoggedIn && (
                  <p className="text-[11px] text-center font-sans text-[#64748B]">
                    Please sign in to confirm delivery address & place order
                  </p>
                )}

                <div className="flex items-center justify-center gap-1.5 text-[10px] text-[#64748B]">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#198775]" />
                  <span>100% Secure Checkout · COD & UPI Accepted</span>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Sign In Required Modal Before Placing Order */}
      {showAuthModal && (
        <div 
          className="fixed inset-0 z-60 bg-[#111827]/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200"
          onClick={() => {
            setShowAuthModal(false);
            setAuthError(null);
          }}
        >
          <div 
            className="bg-white rounded-3xl w-full max-w-md p-6 sm:p-7 shadow-2xl border border-[#E2E8F0] relative overflow-hidden animate-in zoom-in-95 duration-200"
            onClick={e => e.stopPropagation()}
          >
            {/* Close button */}
            <button
              type="button"
              onClick={() => {
                setShowAuthModal(false);
                setAuthError(null);
              }}
              className="absolute top-4 right-4 w-8 h-8 rounded-full bg-[#F0F6FA] flex items-center justify-center text-[#64748B] hover:text-[#111827] hover:bg-[#E2E8F0] transition-colors cursor-pointer"
              aria-label="Close"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Header */}
            <div className="text-center mb-5">
              <div className="w-12 h-12 rounded-2xl bg-[#E6F5FF] text-[#005995] flex items-center justify-center mx-auto mb-3 border border-[#BADCF0]">
                <Lock className="w-6 h-6" />
              </div>
              <span className="font-mono text-[10px] font-bold text-[#005995] uppercase tracking-wider block mb-1">
                DELIVERY ACCOUNT REQUIRED
              </span>
              <h4 className="font-serif font-bold text-xl text-[#111827]">
                Sign in to place your order
              </h4>
              <p className="font-sans text-xs text-[#64748B] mt-1 max-w-xs mx-auto">
                You can add formulas freely to your bag as a guest, but an account is required to confirm your delivery address and dispatch your order.
              </p>
            </div>



            {/* Auth Tabs */}
            <div className="flex bg-[#F8FAFC] p-1 rounded-full border border-[#E2E8F0] mb-4">
              <button
                type="button"
                onClick={() => {
                  setAuthMode('login');
                  setAuthError(null);
                }}
                className={`flex-1 py-1.5 text-xs font-sans font-semibold rounded-full transition-all cursor-pointer ${
                  authMode === 'login'
                    ? 'bg-[#005995] text-white shadow-xs'
                    : 'text-[#64748B] hover:text-[#111827]'
                }`}
              >
                Sign In
              </button>
              <button
                type="button"
                onClick={() => {
                  setAuthMode('signup');
                  setAuthError(null);
                }}
                className={`flex-1 py-1.5 text-xs font-sans font-semibold rounded-full transition-all cursor-pointer ${
                  authMode === 'signup'
                    ? 'bg-[#005995] text-white shadow-xs'
                    : 'text-[#64748B] hover:text-[#111827]'
                }`}
              >
                Create Account
              </button>
            </div>

            {/* Auth Error */}
            {authError && (
              <div className="mb-3.5 p-2.5 rounded-xl bg-[#FEF2F2] border border-[#FECDD3] text-[#DC2626] text-xs font-sans text-center">
                {authError}
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleAuthSubmit} method="POST" action="#" className="space-y-3">
              {authMode === 'signup' && (
                <div>
                  <label htmlFor="drawer_firstname" className="block font-mono text-[10px] uppercase tracking-wider text-[#64748B] font-bold mb-1">
                    First name
                  </label>
                  <input
                    id="drawer_firstname"
                    name="given-name"
                    autoComplete="given-name"
                    type="text"
                    value={authFirstName}
                    onChange={e => setAuthFirstName(e.target.value)}
                    placeholder="e.g. Priya"
                    required
                    className="w-full px-3.5 py-2 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] text-xs focus:outline-none focus:ring-1 focus:ring-[#005995]"
                  />
                </div>
              )}

              <div>
                <label htmlFor="drawer_email" className="block font-mono text-[10px] uppercase tracking-wider text-[#64748B] font-bold mb-1">
                  Email address
                </label>
                <input
                  id="drawer_email"
                  name="email"
                  autoComplete="email"
                  type="email"
                  value={authEmail}
                  onChange={e => setAuthEmail(e.target.value)}
                  placeholder="name@example.com"
                  required
                  className="w-full px-3.5 py-2 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] text-xs focus:outline-none focus:ring-1 focus:ring-[#005995]"
                />
              </div>

              <div>
                <label htmlFor="drawer_password" className="block font-mono text-[10px] uppercase tracking-wider text-[#64748B] font-bold mb-1">
                  Password
                </label>
                <input
                  id="drawer_password"
                  name="password"
                  autoComplete={authMode === 'signup' ? 'new-password' : 'current-password'}
                  type="password"
                  value={authPassword}
                  onChange={e => setAuthPassword(e.target.value)}
                  placeholder="At least 6 characters"
                  required
                  className="w-full px-3.5 py-2 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] text-xs focus:outline-none focus:ring-1 focus:ring-[#005995]"
                />
              </div>

              <button
                type="submit"
                disabled={authSubmitting}
                className="w-full py-3 rounded-full bg-[#005995] hover:bg-[#004777] disabled:bg-[#94A3B8] text-white font-sans font-semibold text-xs transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer mt-2"
              >
                {authSubmitting ? (
                  <span>Signing in & confirming order…</span>
                ) : (
                  <>
                    <span>{authMode === 'signup' ? 'Create Account & Place Order' : 'Sign In & Place Order'}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </>
                )}
              </button>
            </form>

            {/* Footer link to full login page */}
            <div className="mt-4 pt-3 border-t border-[#E2E8F0] text-center">
              <button
                type="button"
                onClick={() => {
                  setShowAuthModal(false);
                  setIsCartOpen(false);
                  navigate('/login');
                }}
                className="text-xs font-sans text-[#64748B] hover:text-[#005995] transition-colors cursor-pointer"
              >
                Or go to full Sign In page →
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
