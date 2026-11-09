import React from 'react';
import { Link } from 'react-router-dom';

interface LogoProps {
  inverted?: boolean;
  to?: string;
  className?: string;
}

export const Logo: React.FC<LogoProps> = ({ inverted = false, to = '/', className = '' }) => {
  const content = (
    <div className={`flex items-center gap-3 select-none group ${className}`}>
      {/* Brand Badge */}
      <div
        className={`w-9 h-9 rounded-xl flex items-center justify-center transition-transform group-hover:scale-105 shadow-xs ${
          inverted ? 'bg-[#E29D52]' : 'bg-[#172319]'
        }`}
      >
        {/* Amber or dark leaf glyph */}
        <svg
          viewBox="0 0 24 24"
          fill="none"
          className={`w-5 h-5 ${inverted ? 'text-[#172319]' : 'text-[#E29D52]'}`}
        >
          <path
            d="M19.5 4.5C13.5 4.5 7.5 8.5 7.5 15.5C7.5 17.5 8.5 19.5 10.5 19.5C17.5 19.5 19.5 10.5 19.5 4.5Z"
            fill="currentColor"
          />
          <path
            d="M7.5 15.5C4.5 15.5 3 18.5 3 21"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </svg>
      </div>

      {/* Wordmark and mono caption */}
      <div className="flex flex-col text-left">
        <span
          className={`font-sans font-semibold text-[17px] tracking-tight leading-none lowercase ${
            inverted ? 'text-white' : 'text-[#172319]'
          }`}
        >
          be bodywise
        </span>
        <span
          className={`font-mono text-[9px] uppercase tracking-[0.2em] font-medium mt-1 leading-none ${
            inverted ? 'text-[#E29D52]' : 'text-[#6B6F66]'
          }`}
        >
          RESULTS SYSTEM
        </span>
      </div>
    </div>
  );

  return to ? <Link to={to} className="inline-block">{content}</Link> : content;
};
