import React from 'react';

interface EyebrowProps {
  children: React.ReactNode;
  color?: string;
  className?: string;
}

export const Eyebrow: React.FC<EyebrowProps> = ({
  children,
  color = 'text-[#005995]',
  className = '',
}) => {
  return (
    <div
      className={`font-mono text-[11px] font-semibold tracking-[0.16em] uppercase select-none ${color} ${className}`}
    >
      {children}
    </div>
  );
};
