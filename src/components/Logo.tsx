import React, { useState } from 'react';
import { Link } from 'react-router-dom';

interface LogoProps {
  inverted?: boolean;
  to?: string;
  className?: string;
}

export const Logo: React.FC<LogoProps> = ({ inverted = false, to = '/', className = '' }) => {
  const [imgError, setImgError] = useState(false);

  // Official Be Bodywise logo assets extracted directly from bebodywise.com/shop/winter-care
  const logoSrc = inverted
    ? 'https://i.mscwlns.co/media/misc/others/white-h-logo_9d2hg6.png?tr=w-300'
    : 'https://i.mscwlns.co/media/misc/others/BB%20logo%20black_ciw2ao.png?tr=w-300';

  const content = (
    <div className={`flex items-center gap-2.5 sm:gap-3 select-none group ${className}`}>
      {!imgError ? (
        <img
          src={logoSrc}
          alt="Be Bodywise"
          onError={() => setImgError(true)}
          className={`h-7 sm:h-8 w-auto object-contain transition-transform group-hover:scale-[1.02] ${
            inverted ? 'brightness-0 invert' : ''
          }`}
          loading="eager"
        />
      ) : (
        <div className="flex items-baseline gap-1">
          <span className="font-serif italic text-xs tracking-wider uppercase text-[#005995] font-bold">be</span>
          <span className="font-serif text-lg sm:text-xl tracking-tight font-semibold text-[#111827]">bodywise</span>
        </div>
      )}

    </div>
  );

  return to ? <Link to={to} className="inline-block">{content}</Link> : content;
};

