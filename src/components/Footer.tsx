import React from 'react';
import { Link } from 'react-router-dom';
import { Logo } from './Logo';
import { ShieldCheck, Truck, RefreshCw, Award } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="w-full border-t border-[#E2E8F0] bg-[#FAFBFD] pt-14 pb-10 mt-auto">
      <div className="max-w-[1280px] mx-auto px-5 sm:px-8">
        {/* Trust Badges Strip */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pb-12 mb-12 border-b border-[#E2E8F0]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#E6F5FF] text-[#005995] flex items-center justify-center shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <p className="font-serif font-bold text-xs sm:text-sm text-[#111827]">Doctor Curated</p>
              <p className="font-sans text-[11px] text-[#64748B]">Formulated by dermatologists</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#E6F5FF] border border-[#BADCF0] text-[#005995] flex items-center justify-center shrink-0">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <p className="font-serif font-bold text-xs sm:text-sm text-[#111827]">Free Shipping</p>
              <p className="font-sans text-[11px] text-[#64748B]">On orders above ₹499</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#FFF7ED] text-[#EB6200] flex items-center justify-center shrink-0">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <p className="font-serif font-bold text-xs sm:text-sm text-[#111827]">100% Proven Actives</p>
              <p className="font-sans text-[11px] text-[#64748B]">No token concentrations</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#EDFCF5] text-[#198775] flex items-center justify-center shrink-0">
              <RefreshCw className="w-5 h-5" />
            </div>
            <div>
              <p className="font-serif font-bold text-xs sm:text-sm text-[#111827]">90-Day Tracker</p>
              <p className="font-sans text-[11px] text-[#64748B]">Results Decoder integrated</p>
            </div>
          </div>
        </div>

        {/* Links Column Grid */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 mb-12">
          {/* Brand info */}
          <div className="col-span-2">
            <Logo to="/" />
            <p className="font-sans text-xs text-[#64748B] mt-3 max-w-sm leading-relaxed">
              BeBodywise is India's leading science-backed personal care platform for women. Doctor-formulated solutions for body acne, strawberry legs, underarm care, and hair health.
            </p>
            <p className="font-mono text-[10px] text-[#005995] mt-3 uppercase tracking-wider font-semibold">
              Certified ISO 9001 · GMP Certified Formulations
            </p>
          </div>

          {/* Shop Body Care */}
          <div>
            <span className="font-mono text-[10px] uppercase font-bold tracking-wider text-[#111827] block mb-3">
              BODY CARE SOLUTIONS
            </span>
            <ul className="space-y-2 text-xs font-sans text-[#64748B]">
              <li><a href="#products" className="hover:text-[#005995] transition-colors">Salicylic Bacne Wash</a></li>
              <li><a href="#products" className="hover:text-[#005995] transition-colors">10% AHA Exfoliating Lotion</a></li>
              <li><a href="#products" className="hover:text-[#005995] transition-colors">AHA Underarm Roll-On</a></li>
              <li><a href="#products" className="hover:text-[#005995] transition-colors">10% Urea Body Lotion</a></li>
              <li><a href="#products" className="hover:text-[#005995] transition-colors">ACV Gut Metabolism Gummies</a></li>
            </ul>
          </div>

          {/* Connected System */}
          <div>
            <span className="font-mono text-[10px] uppercase font-bold tracking-wider text-[#111827] block mb-3">
              RESULTS SYSTEM
            </span>
            <ul className="space-y-2 text-xs font-sans text-[#64748B]">
              <li><Link to="/match" className="hover:text-[#005995] transition-colors">Product Match Assessment</Link></li>
            </ul>
          </div>

          {/* Trust & Medical */}
          <div>
            <span className="font-mono text-[10px] uppercase font-bold tracking-wider text-[#111827] block mb-3">
              OUR STANDARDS
            </span>
            <ul className="space-y-2 text-xs font-sans text-[#64748B]">
              <li><span>pH 5.5 Skin Balanced</span></li>
              <li><span>Zero Parabens & SLS</span></li>
              <li><span>Cruelty-Free Certified</span></li>
              <li><span>Dermatologist Approved</span></li>
              <li><span>Clean Formulation Actives</span></li>
            </ul>
          </div>
        </div>

        {/* Disclaimer & Bottom Bar */}
        <div className="pt-8 border-t border-[#E2E8F0] flex flex-col md:flex-row items-center justify-between gap-4 text-[11px] text-[#64748B] font-sans">
          <p>© {new Date().getFullYear()} BeBodywise (Mosaic Wellness). All rights reserved.</p>
          <p className="text-center md:text-right max-w-lg">
            Cosmetic formulations and wellness supplements. Not intended to diagnose, treat, cure, or prevent any medical disease. Consult a doctor for chronic concerns.
          </p>
        </div>
      </div>
    </footer>
  );
};
