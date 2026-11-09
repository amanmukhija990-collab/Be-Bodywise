import React from 'react';
import { Logo } from './Logo';

export const Footer: React.FC = () => {
  return (
    <footer className="w-full border-t border-[#E9E4D8] bg-[#FAF7F0] py-10 mt-auto">
      <div className="max-w-[1280px] mx-auto px-5 sm:px-8 flex flex-col md:flex-row items-center justify-between gap-6">
        <Logo to="/" />
        <p className="font-sans text-xs text-[#6B6F66] text-center md:text-right max-w-lg leading-relaxed">
          Guidance only — not a medical diagnosis. Consult a dermatologist for persistent concerns.
          All formulations verified against published clinical timelines.
        </p>
      </div>
    </footer>
  );
};
