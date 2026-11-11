import React, { useState } from 'react';
import { Sparkles, Pill } from 'lucide-react';

interface ProductImageProps {
  src?: string;
  alt: string;
  className?: string;
  category?: 'hair' | 'skin' | 'body' | string;
  isGummy?: boolean;
}

const resolveGummyImage = (altText: string, currentSrc?: string): string => {
  if (currentSrc && currentSrc.startsWith('/assets/gummies_')) {
    return currentSrc;
  }
  const lower = (altText || '').toLowerCase();
  if (lower.includes('hair') || lower.includes('biotin')) return '/assets/gummies_hair.png';
  if (lower.includes('skin') || lower.includes('glow') || lower.includes('clarifying') || lower.includes('peach')) return '/assets/gummies_skin.png';
  if (lower.includes('acv') || lower.includes('gut') || lower.includes('metabolism') || lower.includes('cider') || lower.includes('vinegar')) return '/assets/gummies_acv.png';
  if (lower.includes('pcos') || lower.includes('period') || lower.includes('hormonal') || lower.includes('balance')) return '/assets/gummies_pcos.png';
  return '/assets/gummies_hair.png';
};

export const ProductImage: React.FC<ProductImageProps> = ({
  src,
  alt,
  className = '',
  category = 'skin',
  isGummy = false,
}) => {
  const isGummies = isGummy || alt.toLowerCase().includes('gummi');
  const targetGummySrc = resolveGummyImage(alt, src);
  const initialSrc = isGummies ? targetGummySrc : (src || '');

  const [currentSrc, setCurrentSrc] = useState<string>(initialSrc);
  const [hasError, setHasError] = useState(false);
  const [loaded, setLoaded] = useState(false);

  React.useEffect(() => {
    const isG = isGummy || alt.toLowerCase().includes('gummi');
    const target = isG ? resolveGummyImage(alt, src) : (src || '');
    setCurrentSrc(target);
    setHasError(false);
    setLoaded(false);
  }, [src, alt, isGummy]);

  const handleError = () => {
    if (isGummies && currentSrc !== targetGummySrc) {
      setCurrentSrc(targetGummySrc);
      return;
    }

    // Try secondary reliable skincare images before failing
    if (category === 'hair' && currentSrc !== 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=700&q=80') {
      setCurrentSrc('https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=700&q=80');
      return;
    }
    if (category === 'body' && currentSrc !== '/assets/strawberry_legs.jpg') {
      setCurrentSrc('/assets/strawberry_legs.jpg');
      return;
    }
    if (currentSrc !== 'https://images.unsplash.com/photo-1601049541289-9b1b7bbbfe19?auto=format&fit=crop&w=700&q=80') {
      setCurrentSrc('https://images.unsplash.com/photo-1601049541289-9b1b7bbbfe19?auto=format&fit=crop&w=700&q=80');
      return;
    }

    setHasError(true);
  };

  if (hasError) {
    const bgGradient =
      category === 'hair'
        ? 'from-[#EEF8FF] via-[#E6F5FF] to-[#BADCF0]'
        : category === 'body'
        ? 'from-[#EDFCF5] via-[#E6F5FF] to-[#BADCF0]'
        : 'from-[#FFF7ED] via-[#E6F5FF] to-[#BADCF0]';

    const accentColor =
      category === 'hair' ? 'text-[#005995]' : category === 'body' ? 'text-[#198775]' : 'text-[#EB6200]';

    return (
      <div
        className={`relative flex flex-col items-center justify-center p-4 bg-gradient-to-br ${bgGradient} text-[#111827] select-none overflow-hidden ${className}`}
      >
        <div className="absolute inset-0 bg-white/30 backdrop-blur-[1px]" />
        <div className="relative z-10 flex flex-col items-center text-center">
          <div className={`w-12 h-12 rounded-2xl bg-white/90 shadow-xs flex items-center justify-center mb-2.5 ${accentColor}`}>
            {isGummies ? <Sparkles className="w-6 h-6 text-[#165548]" /> : <Pill className="w-6 h-6" />}
          </div>
          <span className="font-serif font-semibold text-xs text-[#111827] line-clamp-2 px-2 max-w-[160px] leading-snug">
            {alt}
          </span>
          <span className="font-mono text-[9px] uppercase tracking-wider text-[#005995] mt-1 font-bold">
            {isGummies ? 'Active Gummies' : `Clinical ${category}`}
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className={`relative overflow-hidden bg-[#F0F6FA] ${className}`}>
      {!loaded && (
        <div className="absolute inset-0 bg-[#E6F5FF] animate-pulse flex items-center justify-center">
          <span className="font-mono text-[9px] uppercase text-[#64748B]/50 tracking-wider">Loading</span>
        </div>
      )}
      <img
        src={currentSrc}
        alt={alt}
        loading="lazy"
        onLoad={() => setLoaded(true)}
        onError={handleError}
        className={`w-full h-full object-cover transition-opacity duration-300 ${
          loaded ? 'opacity-100' : 'opacity-0'
        }`}
      />
    </div>
  );
};
