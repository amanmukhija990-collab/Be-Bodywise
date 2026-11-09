import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { Logo } from './Logo';
import { getLevelInfo } from '../lib/xpEngine';
import { Menu, X, Flame, LogOut, Sparkles, User as UserIcon, Volume2, VolumeX } from 'lucide-react';

export const Navbar: React.FC = () => {
  const { user, isLoggedIn, logout, loginAsDemo, soundEnabled, toggleSound } = useApp();
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [activeSection, setActiveSection] = useState<string>('');

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
  }, [location.pathname]);

  const levelInfo = user ? getLevelInfo(user.xp) : null;

  const appNavLinks = [
    { name: 'Overview', path: '/dashboard' },
    { name: 'Product Match', path: '/match' },
    { name: 'Routine Test', path: '/routine-test' },
    { name: 'My Shelf', path: '/shelf' },
    { name: 'Results Decoder', path: '/decoder' },
    { name: 'Care Journey', path: '/journey' },
  ];

  return (
    <header className="sticky top-0 z-40 w-full bg-[#FAF7F0]/95 backdrop-blur-md border-b border-[#E9E4D8] transition-all">
      <div className="max-w-[1280px] mx-auto px-5 sm:px-8 h-[72px] flex items-center justify-between gap-4">
        {/* Left: Logo */}
        <Logo to={isLoggedIn ? '/dashboard' : '/'} />

        {/* Center: Navigation Links */}
        {isLoggedIn ? (
          <nav className="hidden lg:flex items-center gap-1 bg-[#F5F1E8] p-1.5 rounded-full border border-[#E9E4D8]">
            {appNavLinks.map(link => {
              const isActive = location.pathname === link.path;
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`text-[13px] font-sans font-medium px-4 py-2 rounded-full transition-all duration-200 select-none ${
                    isActive
                      ? 'bg-[#172319] text-white shadow-xs'
                      : 'text-[#172319]/80 hover:text-[#172319] hover:bg-white/60'
                  }`}
                >
                  {link.name}
                </Link>
              );
            })}
          </nav>
        ) : (
          <nav className="hidden md:flex items-center gap-8">
            <a
              href="#why"
              className={`text-[14px] font-sans transition-colors ${
                activeSection === 'why' ? 'text-[#A46F39] font-medium' : 'text-[#6B6F66] hover:text-[#172319]'
              }`}
            >
              Why it "didn't work"
            </a>
            <a
              href="#system"
              className={`text-[14px] font-sans transition-colors ${
                activeSection === 'system' ? 'text-[#A46F39] font-medium' : 'text-[#6B6F66] hover:text-[#172319]'
              }`}
            >
              The system
            </a>
            <a
              href="#curve"
              className={`text-[14px] font-sans transition-colors ${
                activeSection === 'curve' ? 'text-[#A46F39] font-medium' : 'text-[#6B6F66] hover:text-[#172319]'
              }`}
            >
              The 90-day curve
            </a>
          </nav>
        )}

        {/* Right side */}
        <div className="flex items-center gap-3">
          {isLoggedIn && user ? (
            <div className="flex items-center gap-2.5">
              {/* Streak + Level Chip */}
              <Link
                to="/journey"
                className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#F0EBE1] border border-[#E9E4D8] hover:border-[#A46F39]/50 transition-colors group cursor-pointer shadow-2xs"
                title={`${user.streak} day streak · Level ${levelInfo?.level} ${levelInfo?.title}`}
              >
                <div className="flex items-center gap-1 font-sans text-xs font-semibold text-[#172319]">
                  <Flame className="w-3.5 h-3.5 text-[#E29D52] fill-[#E29D52] transition-transform group-hover:scale-110" />
                  <span>{user.streak}</span>
                </div>
                <span className="w-1 h-1 rounded-full bg-[#172319]/20" />
                <span className="font-mono text-[10px] font-semibold text-[#A46F39] uppercase tracking-wider">
                  LV {levelInfo?.level}
                </span>
              </Link>

              {/* Sound Toggle Button */}
              <button
                type="button"
                onClick={toggleSound}
                className="w-9 h-9 rounded-full bg-[#F0EBE1] border border-[#E9E4D8] flex items-center justify-center text-[#6B6F66] hover:text-[#172319] hover:border-[#A46F39]/40 transition-colors shadow-2xs cursor-pointer"
                title={soundEnabled ? 'Sound feedback active' : 'Sound feedback muted'}
                aria-label="Toggle sound feedback"
              >
                {soundEnabled ? (
                  <Volume2 className="w-4 h-4 text-[#A46F39]" />
                ) : (
                  <VolumeX className="w-4 h-4 text-[#6B6F66]" />
                )}
              </button>

              {/* Avatar Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="w-9 h-9 rounded-full bg-[#2C5044] text-white font-serif font-semibold text-[15px] flex items-center justify-center hover:ring-2 hover:ring-[#A46F39] transition-all shadow-xs"
                  aria-label="User profile menu"
                >
                  {user.profile.firstName.charAt(0).toUpperCase()}
                </button>

                {userDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-xl border border-[#E9E4D8] p-3 z-50 animate-in fade-in zoom-in-95">
                    <div className="px-3 py-2 border-b border-[#F0EBE1]">
                      <p className="font-serif font-semibold text-[#172319] leading-tight">
                        {user.profile.firstName}
                      </p>
                      <p className="font-sans text-xs text-[#6B6F66] truncate mt-0.5">
                        {user.profile.email}
                      </p>
                      <div className="mt-2 inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-[#FFF4E5] text-[#A46F39] font-mono text-[10px] uppercase font-semibold">
                        {levelInfo?.title} · {user.xp} XP
                      </div>
                    </div>

                    <div className="py-1">
                      <Link
                        to="/journey"
                        className="flex items-center gap-2.5 px-3 py-2 text-sm text-[#172319] rounded-xl hover:bg-[#F5F1E8] transition-colors"
                      >
                        <Sparkles className="w-4 h-4 text-[#A46F39]" />
                        <span>Care Journey & XP</span>
                      </Link>

                      <button
                        onClick={() => {
                          loginAsDemo();
                          setUserDropdownOpen(false);
                        }}
                        className="w-full flex items-center gap-2.5 px-3 py-2 text-sm text-[#172319] rounded-xl hover:bg-[#F5F1E8] transition-colors text-left"
                      >
                        <UserIcon className="w-4 h-4 text-[#2C5044]" />
                        <span>Reset to Aanya (Demo)</span>
                      </button>

                      <button
                        onClick={() => {
                          logout();
                          navigate('/login');
                        }}
                        className="w-full flex items-center gap-2.5 px-3 py-2 text-sm text-[#B4492E] rounded-xl hover:bg-[#FBEBE8] transition-colors text-left mt-1"
                      >
                        <LogOut className="w-4 h-4" />
                        <span>Sign out</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-4">
              <Link
                to="/login"
                className="text-sm font-sans font-medium text-[#172319] hover:text-[#A46F39] transition-colors"
              >
                Sign in
              </Link>
              <Link
                to="/signup"
                className="px-5 py-2 rounded-full bg-[#172319] hover:bg-[#2C5044] text-white text-sm font-sans font-medium transition-all shadow-xs hover:-translate-y-0.5"
              >
                Start free
              </Link>
            </div>
          )}

          {/* Mobile hamburger button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 rounded-xl text-[#172319] hover:bg-[#F0EBE1] transition-colors"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-[#E9E4D8] bg-[#FAF7F0] px-6 py-5 shadow-lg animate-in slide-in-from-top-2">
          {isLoggedIn ? (
            <div className="flex flex-col gap-1.5">
              {appNavLinks.map(link => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`px-4 py-2.5 rounded-xl text-sm font-medium ${
                    location.pathname === link.path
                      ? 'bg-[#172319] text-white'
                      : 'text-[#172319] hover:bg-[#F0EBE1]'
                  }`}
                >
                  {link.name}
                </Link>
              ))}
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              <a href="#why" className="px-3 py-2 text-sm text-[#172319]">
                Why it "didn't work"
              </a>
              <a href="#system" className="px-3 py-2 text-sm text-[#172319]">
                The system
              </a>
              <a href="#curve" className="px-3 py-2 text-sm text-[#172319]">
                The 90-day curve
              </a>
              <div className="pt-3 border-t border-[#E9E4D8] flex flex-col gap-2">
                <Link
                  to="/login"
                  className="w-full text-center py-2.5 rounded-full border border-[#E9E4D8] text-sm font-medium text-[#172319]"
                >
                  Sign in
                </Link>
                <Link
                  to="/signup"
                  className="w-full text-center py-2.5 rounded-full bg-[#A46F39] text-white text-sm font-medium"
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
