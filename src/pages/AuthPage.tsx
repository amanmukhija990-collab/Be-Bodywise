import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { Logo } from '../components/Logo';
import { Eyebrow } from '../components/Eyebrow';
import { ArrowRight, Flame, Wand2 } from 'lucide-react';

export const AuthPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { login, signup } = useApp();

  const isSignup = location.pathname === '/signup';

  const [firstName, setFirstName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<{ firstName?: string; email?: string; password?: string }>({});
  const [loading, setLoading] = useState(false);

  const validate = () => {
    const errs: { firstName?: string; email?: string; password?: string } = {};
    if (isSignup && !firstName.trim()) {
      errs.firstName = 'First name is required';
    }
    if (!email.trim() || !email.includes('@')) {
      errs.email = 'Please enter a valid email address';
    }
    if (!password || password.length < 6) {
      errs.password = 'Password must be at least 6 characters';
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      if (isSignup) {
        signup(firstName, email);
      } else {
        login(email);
      }
      navigate('/');
    }, 400);
  };

  return (
    <div className="min-h-screen w-full flex flex-col lg:flex-row bg-[#FAFBFD]">
      {/* LEFT PANEL (Dark ink, shared portrait) */}
      <div className="relative w-full lg:w-1/2 min-h-[380px] lg:min-h-screen bg-[#005995] p-8 sm:p-14 flex flex-col justify-between overflow-hidden">
        {/* Background Image with dark overlay */}
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=1200&q=80"
            alt="Warm golden-hour portrait"
            onError={(e) => {
              (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=1200&q=80";
            }}
            className="w-full h-full object-cover object-top filter blur-[2px] opacity-25 scale-105"
          />
          <div className="absolute inset-0 bg-[#005995]/80" />
        </div>

        {/* Top: Inverted Logo */}
        <div className="relative z-10">
          <Logo inverted to="/" />
        </div>

        {/* Center: Headline & Subtitle */}
        <div className="relative z-10 my-auto py-8 max-w-lg">
          <span className="font-mono text-[11px] uppercase tracking-[0.2em] font-semibold text-[#EB6200] block mb-3">
            DAY 1 → DAY 90
          </span>
          <h1 className="font-serif font-medium text-3xl sm:text-4xl lg:text-5xl text-white leading-[1.12] mb-5">
            Stop guessing whether it's{' '}
            <span className="italic font-normal text-[#EB6200]">working.</span>
          </h1>
          <p className="font-sans text-base text-white/70 leading-relaxed mb-8">
            Your shelf, your start dates and your check-ins — decoded against each product's verified timeline.
          </p>

          {/* Frosted Glass Testimonial Card */}
          <div className="p-4 sm:p-5 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15 shadow-xl max-w-md">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-[#E29D52]/20 text-[#EB6200] flex items-center justify-center shrink-0 mt-0.5">
                <Flame className="w-4 h-4 fill-current" />
              </div>
              <div>
                <p className="font-serif font-semibold text-sm sm:text-base text-white leading-snug">
                  "Day 45 — I almost quit at week 3."
                </p>
                <p className="font-sans text-xs text-white/60 mt-1">
                  The Care Journey kept me going through the lag phase.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Notice */}
        <div className="relative z-10 text-[10px] font-mono text-white/40 tracking-widest uppercase">
          {isSignup ? 'GUIDANCE ONLY · NOT A MEDICAL DIAGNOSIS' : 'BE BODYWISE · RESULTS SYSTEM'}
        </div>
      </div>

      {/* RIGHT PANEL (Cream form) */}
      <div className="w-full lg:w-1/2 p-6 sm:p-12 lg:p-16 flex items-center justify-center">
        <div className="w-full max-w-[420px]">
          <Eyebrow className="mb-2">
            {isSignup ? 'CREATE YOUR ACCOUNT' : 'WELCOME BACK'}
          </Eyebrow>

          <h2 className="font-serif font-medium text-2xl sm:text-3xl text-[#111827] mb-2 leading-tight">
            {isSignup ? 'Begin your 90-day journey' : 'Sign in to your results system'}
          </h2>

          <p className="font-sans text-sm text-[#64748B] mb-8">
            {isSignup
              ? 'Start with a clean shelf and honest clinical expectations.'
              : 'Continue tracking your verified product timelines.'}
          </p>

          <form onSubmit={handleSubmit} method="POST" action="#" className="flex flex-col gap-5">
            {isSignup && (
              <div>
                <label htmlFor="auth_firstname" className="block font-mono text-[10px] uppercase tracking-wider text-[#111827] font-bold mb-1.5">
                  First name
                </label>
                <input
                  id="auth_firstname"
                  name="given-name"
                  autoComplete="given-name"
                  type="text"
                  value={firstName}
                  onChange={e => setFirstName(e.target.value)}
                  placeholder="Priya"
                  className={`w-full px-4 py-3 rounded-xl bg-white border ${
                    errors.firstName ? 'border-[#B4492E]' : 'border-[#E2E8F0]'
                  } text-sm focus:outline-none focus:ring-2 focus:ring-[#005995] transition-all`}
                />
                {errors.firstName && (
                  <p className="font-sans text-xs text-[#B4492E] mt-1">{errors.firstName}</p>
                )}
              </div>
            )}

            <div>
              <label htmlFor="auth_email" className="block font-mono text-[10px] uppercase tracking-wider text-[#111827] font-bold mb-1.5">
                Email
              </label>
              <input
                id="auth_email"
                name="email"
                autoComplete="email"
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="you@example.com"
                className={`w-full px-4 py-3 rounded-xl bg-white border ${
                  errors.email ? 'border-[#B4492E]' : 'border-[#E2E8F0]'
                } text-sm focus:outline-none focus:ring-2 focus:ring-[#005995] transition-all`}
              />
              {errors.email && (
                <p className="font-sans text-xs text-[#B4492E] mt-1">{errors.email}</p>
              )}
            </div>

            <div>
              <label htmlFor="auth_password" className="block font-mono text-[10px] uppercase tracking-wider text-[#111827] font-bold mb-1.5">
                Password
              </label>
              <input
                id="auth_password"
                name="password"
                autoComplete={isSignup ? 'new-password' : 'current-password'}
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder={isSignup ? 'At least 6 characters' : 'Your password'}
                className={`w-full px-4 py-3 rounded-xl bg-white border ${
                  errors.password ? 'border-[#B4492E]' : 'border-[#E2E8F0]'
                } text-sm focus:outline-none focus:ring-2 focus:ring-[#005995] transition-all`}
              />
              {errors.password && (
                <p className="font-sans text-xs text-[#B4492E] mt-1">{errors.password}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full inline-flex items-center justify-center gap-2 py-3.5 px-6 rounded-full bg-[#005995] hover:bg-[#004777] disabled:bg-[#8D918A] text-white font-sans font-medium text-sm transition-all shadow-md shadow-[#A46F39]/20 hover:-translate-y-0.5 mt-2 cursor-pointer"
            >
              <span>{isSignup ? 'Create account' : 'Sign in'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-[#E2E8F0] text-center">
            {isSignup ? (
              <p className="font-sans text-xs text-[#64748B]">
                Already have an account?{' '}
                <Link to="/login" className="font-semibold text-[#111827] hover:underline">
                  Sign in
                </Link>
              </p>
            ) : (
              <p className="font-sans text-xs text-[#64748B]">
                New here?{' '}
                <Link to="/signup" className="font-semibold text-[#111827] hover:underline">
                  Create an account
                </Link>
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
