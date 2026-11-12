import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { Logo } from './Logo';
import { getLevelInfo } from '../lib/xpEngine';
import { CATEGORIES_DATA, NAV_DROPDOWN_CATEGORIES } from '../data/categoriesData';
import { Menu, X, LogOut, Sparkles, User as UserIcon, ShoppingBag, ChevronDown, ArrowRight, Package } from 'lucide-react';

export const Navbar: React.FC = () => {
  const { user, isLoggedIn, logout, cartItemCount, setIsCartOpen } = useApp();
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [categoryDropdownOpen, setCategoryDropdownOpen] = useState(false);
  const [mobileCategoryOpen, setMobileCategoryOpen] = useState(false);
  const [activeSection, setActiveSection] = useState<string>('');
  const dropdownTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const isLanding = location.pathname === '/';

  // Scroll spy on landing page
  useEffect(() => {
    if (!isLanding) return;

    const handleScroll = () => {
      const sections = ['why', 'system', 'curve'];
      const scrollPos = window.scrollY + 180;
      for (const id of sections) {
        const el = document.getElementById(id);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPos >= top && scrollPos < top + height) {
            setActiveSection(id);
            return;
          }
        }
      }
      setActiveSection('');
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isLanding]);

  // Close menus on route change
  useEffect(() => {
    setMobileMenuOpen(false);
    setUserDropdownOpen(false);
    setCategoryDropdownOpen(false);
    setMobileCategoryOpen(false);
  }, [location.pathname]);

  const levelInfo = user ? getLevelInfo(user.xp) : null;

  const appNavLinks = [
    { name: 'Shop by Category', path: '/shop/all' },
    { name: 'Take Assessment', path: '/match' },
  ];

  return (
    <header className="sticky top-0 z-40 w-full bg-[#FAFBFD]/95 backdrop-blur-md border-b border-[#E2E8F0] transition-all">
      <div className="max-w-[1280px] mx-auto px-5 sm:px-8 h-[72px] flex items-center justify-between gap-4">
        {/* Left: Logo */}
        <Logo to="/" />

        {/* Center: Navigation Links */}
        {isLoggedIn ? (
          <nav className="hidden lg:flex items-center gap-1 bg-[#F0F6FA] p-1.5 rounded-full border border-[#E2E8F0]">
            <div
              className="relative"
              onMouseEnter={() => {
                if (dropdownTimeoutRef.current) clearTimeout(dropdownTimeoutRef.current);
                setCategoryDropdownOpen(true);
              }}
              onMouseLeave={() => {
                dropdownTimeoutRef.current = setTimeout(() => {
                  setCategoryDropdownOpen(false);
                }, 200);
              }}
            >
              <button
                type="button"
                onClick={() => setCategoryDropdownOpen(!categoryDropdownOpen)}
                className={`text-[13px] font-sans font-medium px-4 py-2 rounded-full transition-all duration-200 select-none flex items-center gap-1.5 cursor-pointer ${
                  location.pathname.startsWith('/category/')
                    ? 'bg-[#005995] text-white shadow-xs font-semibold'
                    : 'text-[#111827]/80 hover:text-[#005995] hover:bg-white'
                }`}
              >
                <span>Shop By Category</span>
                <span className="text-[9px]">
                  {categoryDropdownOpen ? '▲' : '▼'}
                </span>
              </button>

              {categoryDropdownOpen && (
                <div 
                  className="absolute top-full left-0 pt-1.5 z-50 w-64 animate-in fade-in zoom-in-95"
                  onMouseEnter={() => {
                    if (dropdownTimeoutRef.current) clearTimeout(dropdownTimeoutRef.current);
                  }}
                  onMouseLeave={() => {
                    dropdownTimeoutRef.current = setTimeout(() => {
                      setCategoryDropdownOpen(false);
                    }, 200);
                  }}
                >
                  <div className="bg-white rounded-b-2xl shadow-xl border border-[#E2E8F0] border-t-0 py-2 flex flex-col">
                    {NAV_DROPDOWN_CATEGORIES.map(item => (
                      <Link
                        key={item.id}
                        to={item.path}
                        onClick={() => setCategoryDropdownOpen(false)}
                        className="px-6 py-3.5 text-[15px] sm:text-[16px] font-sans font-medium text-[#4B5563] hover:text-[#111827] hover:bg-[#F8FAFC] transition-colors text-left"
                      >
                        {item.name}
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <Link
              to="/match"
              className={`text-[13px] font-sans font-medium px-4 py-2 rounded-full transition-all duration-200 select-none ${
                location.pathname === '/match'
                  ? 'bg-[#005995] text-white shadow-xs font-semibold'
                  : 'text-[#111827]/80 hover:text-[#005995] hover:bg-white'
              }`}
            >
              Take Assessment
            </Link>
          </nav>
        ) : (
          <nav className="hidden md:flex items-center gap-8">
            {/* Shop By Category with Dropdown */}
            <div
              className="relative"
              onMouseEnter={() => {
                if (dropdownTimeoutRef.current) clearTimeout(dropdownTimeoutRef.current);
                setCategoryDropdownOpen(true);
              }}
              onMouseLeave={() => {
                dropdownTimeoutRef.current = setTimeout(() => {
                  setCategoryDropdownOpen(false);
                }, 200);
              }}
            >
              <button
                type="button"
                onClick={() => setCategoryDropdownOpen(!categoryDropdownOpen)}
                className="flex items-center gap-1.5 text-[15px] font-sans text-[#111827] font-semibold hover:text-[#005995] transition-colors whitespace-nowrap shrink-0 py-2 cursor-pointer group"
                aria-expanded={categoryDropdownOpen}
              >
                <span>Shop By Category</span>
                <span className="text-[9px] text-[#111827] transition-transform">
                  {categoryDropdownOpen ? '▲' : '▼'}
                </span>
              </button>

              {/* Vertical Dropdown Menu as shown in screenshot */}
              {categoryDropdownOpen && (
                <div 
                  className="absolute top-full left-0 pt-1.5 z-50 w-64 animate-in fade-in zoom-in-95"
                  onMouseEnter={() => {
                    if (dropdownTimeoutRef.current) clearTimeout(dropdownTimeoutRef.current);
                  }}
                  onMouseLeave={() => {
                    dropdownTimeoutRef.current = setTimeout(() => {
                      setCategoryDropdownOpen(false);
                    }, 200);
                  }}
                >
                  <div className="bg-white rounded-b-2xl shadow-xl border border-[#E2E8F0] border-t-0 py-2 flex flex-col">
                    {NAV_DROPDOWN_CATEGORIES.map(item => (
                      <Link
                        key={item.id}
                        to={item.path}
                        onClick={() => setCategoryDropdownOpen(false)}
                        className="px-6 py-3.5 text-[15px] sm:text-[16px] font-sans font-medium text-[#4B5563] hover:text-[#111827] hover:bg-[#F8FAFC] transition-colors text-left"
                      >
                        {item.name}
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <a
              href="/#bestsellers"
              onClick={(e) => {
                if (location.pathname === '/') {
                  e.preventDefault();
                  document.getElementById('bestsellers')?.scrollIntoView({ behavior: 'smooth' });
                }
              }}
              className="text-[14px] font-sans text-[#64748B] hover:text-[#005995] transition-colors whitespace-nowrap shrink-0"
            >
              Best Sellers
            </a>
            <Link
              to="/match"
              className="text-[14px] font-sans text-[#64748B] hover:text-[#005995] transition-colors whitespace-nowrap shrink-0"
            >
              Take Assessment
            </Link>
          </nav>
        )}

        {/* Right side */}
        <div className="flex items-center gap-3">
          {isLoggedIn && user ? (
            <div className="flex items-center gap-2.5">
              {/* Avatar Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="w-9 h-9 rounded-full bg-[#005995] text-white font-serif font-semibold text-[15px] flex items-center justify-center hover:ring-2 hover:ring-[#4292C7] transition-all shadow-xs cursor-pointer"
                  aria-label="User profile menu"
                >
                  {user.profile.firstName.charAt(0).toUpperCase()}
                </button>

                {userDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-xl border border-[#E2E8F0] p-3 z-50 animate-in fade-in zoom-in-95">
                    <div className="px-3 py-2 border-b border-[#F0F6FA]">
                      <p className="font-serif font-semibold text-[#111827] leading-tight">
                        {user.profile.firstName}
                      </p>
                      <p className="font-sans text-xs text-[#64748B] truncate mt-0.5">
                        {user.profile.email}
                      </p>
                      <div className="mt-2 inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-[#E6F5FF] text-[#005995] font-mono text-[10px] uppercase font-bold border border-[#BADCF0]">
                        {levelInfo?.title} · {user.xp} XP
                      </div>
                    </div>

                    <div className="py-1">
                      <Link
                        to="/orders"
                        onClick={() => setUserDropdownOpen(false)}
                        className="flex items-center gap-2.5 px-3 py-2 text-sm text-[#111827] rounded-xl hover:bg-[#F0F6FA] hover:text-[#005995] transition-colors"
                      >
                        <Package className="w-4 h-4 text-[#005995]" />
                        <span>Your Orders</span>
                      </Link>

                      <button
                        onClick={() => {
                          logout();
                          setUserDropdownOpen(false);
                          navigate('/');
                        }}
                        className="w-full flex items-center gap-2.5 px-3 py-2 text-sm text-[#DC2626] rounded-xl hover:bg-[#FEF2F2] transition-colors text-left mt-1 cursor-pointer"
                      >
                        <LogOut className="w-4 h-4" />
                        <span>Sign out</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Shopping Bag Button */}
              <button
                type="button"
                onClick={() => setIsCartOpen(true)}
                className="relative p-2 rounded-full text-[#111827] hover:bg-[#E6F5FF] hover:text-[#005995] transition-colors cursor-pointer"
                aria-label={`Open shopping bag, ${cartItemCount} items`}
              >
                <ShoppingBag className="w-5 h-5" />
                {cartItemCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-[#005995] text-white font-mono text-[10px] font-bold flex items-center justify-center shadow-xs animate-in zoom-in">
                    {cartItemCount}
                  </span>
                )}
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              {/* Shopping Bag Button */}
              <button
                type="button"
                onClick={() => setIsCartOpen(true)}
                className="relative p-2 rounded-full text-[#111827] hover:bg-[#E6F5FF] hover:text-[#005995] transition-colors cursor-pointer"
                aria-label={`Open shopping bag, ${cartItemCount} items`}
              >
                <ShoppingBag className="w-5 h-5" />
                {cartItemCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-[#005995] text-white font-mono text-[10px] font-bold flex items-center justify-center shadow-xs animate-in zoom-in">
                    {cartItemCount}
                  </span>
                )}
              </button>

              <Link
                to="/login"
                className="text-sm font-sans font-medium text-[#111827] hover:text-[#005995] transition-colors whitespace-nowrap shrink-0"
              >
                Sign in
              </Link>
              <Link
                to="/signup"
                className="px-5 py-2 rounded-full bg-[#005995] hover:bg-[#004777] text-white text-sm font-sans font-semibold transition-all shadow-xs hover:-translate-y-0.5 whitespace-nowrap shrink-0"
              >
                Start free
              </Link>
            </div>
          )}

          {/* Mobile hamburger button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 rounded-xl text-[#111827] hover:bg-[#E6F5FF] transition-colors"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-[#E2E8F0] bg-[#FAFBFD] px-6 py-5 shadow-lg animate-in slide-in-from-top-2">
          {isLoggedIn ? (
            <div className="flex flex-col gap-2">
              {/* Shop By Category Accordion */}
              <div>
                <button
                  type="button"
                  onClick={() => setMobileCategoryOpen(!mobileCategoryOpen)}
                  className="w-full flex items-center justify-between px-3 py-2 text-sm text-[#111827] font-semibold hover:text-[#005995]"
                >
                  <span>Shop By Category</span>
                  <span className="text-[9px] text-[#111827]">
                    {mobileCategoryOpen ? '▲' : '▼'}
                  </span>
                </button>
                {mobileCategoryOpen && (
                  <div className="pl-3 pr-2 py-2 flex flex-col gap-1 bg-[#F8FAFC] rounded-2xl my-1 border border-[#E2E8F0]">
                    {NAV_DROPDOWN_CATEGORIES.map(item => (
                      <Link
                        key={item.id}
                        to={item.path}
                        onClick={() => setMobileMenuOpen(false)}
                        className="px-3 py-2 rounded-xl text-sm font-medium text-[#4B5563] hover:text-[#111827] hover:bg-white transition-colors"
                      >
                        {item.name}
                      </Link>
                    ))}
                  </div>
                )}
              </div>

              <Link
                to="/orders"
                onClick={() => setMobileMenuOpen(false)}
                className="px-3 py-2 text-sm text-[#111827] hover:text-[#005995] font-medium"
              >
                Your Orders
              </Link>

              <Link
                to="/match"
                onClick={() => setMobileMenuOpen(false)}
                className="px-3 py-2 text-sm text-[#005995] font-semibold hover:underline"
              >
                Take Assessment →
              </Link>

              <button
                type="button"
                onClick={() => {
                  logout();
                  setMobileMenuOpen(false);
                  navigate('/');
                }}
                className="px-3 py-2 text-sm text-[#DC2626] font-medium text-left hover:bg-[#FEF2F2] rounded-xl flex items-center gap-2 mt-1 cursor-pointer"
              >
                <LogOut className="w-4 h-4" />
                <span>Sign out</span>
              </button>
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              {/* Shop By Category Accordion */}
              <div>
                <button
                  type="button"
                  onClick={() => setMobileCategoryOpen(!mobileCategoryOpen)}
                  className="w-full flex items-center justify-between px-3 py-2 text-sm text-[#111827] font-semibold hover:text-[#005995]"
                >
                  <span>Shop By Category</span>
                  <span className="text-[9px] text-[#111827]">
                    {mobileCategoryOpen ? '▲' : '▼'}
                  </span>
                </button>
                {mobileCategoryOpen && (
                  <div className="pl-3 pr-2 py-2 flex flex-col gap-1 bg-[#F8FAFC] rounded-2xl my-1 border border-[#E2E8F0]">
                    {NAV_DROPDOWN_CATEGORIES.map(item => (
                      <Link
                        key={item.id}
                        to={item.path}
                        onClick={() => setMobileMenuOpen(false)}
                        className="px-3 py-2 rounded-xl text-sm font-medium text-[#4B5563] hover:text-[#111827] hover:bg-white transition-colors"
                      >
                        {item.name}
                      </Link>
                    ))}
                  </div>
                )}
              </div>

              <a
                href="/#bestsellers"
                onClick={() => setMobileMenuOpen(false)}
                className="px-3 py-2 text-sm text-[#111827] hover:text-[#005995]"
              >
                Best Sellers
              </a>
              <Link
                to="/match"
                onClick={() => setMobileMenuOpen(false)}
                className="px-3 py-2 text-sm text-[#005995] font-semibold hover:underline"
              >
                Take Assessment →
              </Link>
              <div className="pt-3 border-t border-[#E2E8F0] flex flex-col gap-2">
                <Link
                  to="/login"
                  className="w-full text-center py-2.5 rounded-full border border-[#E2E8F0] text-sm font-medium text-[#111827] hover:bg-white"
                >
                  Sign in
                </Link>
                <Link
                  to="/signup"
                  className="w-full text-center py-2.5 rounded-full bg-[#005995] hover:bg-[#004777] text-white text-sm font-semibold shadow-xs"
                >
                  Find my product match →
                </Link>
              </div>
            </div>
          )}
        </div>
      )}
    </header>
  );
};
