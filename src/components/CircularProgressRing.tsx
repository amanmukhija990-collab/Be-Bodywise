import React from 'react';

interface CircularProgressRingProps {
  day: number;
  totalDays?: number;
  size?: number;
  strokeWidth?: number;
  strokeColor?: string;
  className?: string;
}

export const CircularProgressRing: React.FC<CircularProgressRingProps> = ({
  day,
  totalDays = 90,
  size = 54,
  strokeWidth = 3.5,
  strokeColor,
  className = '',
}) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const progress = Math.min(1, Math.max(0, day / totalDays));
  const strokeDashoffset = circumference - progress * circumference;

  // Dynamic stroke color based on day phase if not specified
  const ringColor = strokeColor || (
    day <= 7 ? '#4292C7' : day <= 42 ? '#005995' : '#143461'
  );

  return (
    <div
      className={`relative inline-flex items-center justify-center shrink-0 ${className}`}
      style={{ width: size, height: size }}
    >
      <svg width={size} height={size} className="-rotate-90">
        {/* Background track */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="#E2E8F0"
          strokeWidth={strokeWidth}
          fill="transparent"
        />
        {/* Progress stroke */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={ringColor}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          fill="transparent"
          className="transition-all duration-700 ease-out"
        />
      </svg>
      {/* Day / 90 Centered Text */}
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center select-none pointer-events-none">
        <span className="font-serif font-bold text-[14px] leading-none text-[#111827]">
          {day}
        </span>
        <span className="font-mono text-[8px] text-[#64748B] leading-none mt-0.5">
          /{totalDays}
        </span>
      </div>
    </div>
  );
};
