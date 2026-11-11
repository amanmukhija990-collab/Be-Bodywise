import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { Calendar, ChevronDown, ChevronLeft, ChevronRight, Sparkles, Check } from 'lucide-react';

interface DaySelectorProps {
  className?: string;
  compact?: boolean;
}

export const DaySelector: React.FC<DaySelectorProps> = ({ className = '', compact = false }) => {
  const { currentDay, setSimulatedDay, user } = useApp();
  const [isOpen, setIsOpen] = useState(false);
  const [sliderVal, setSliderVal] = useState<number>(currentDay);
  const popoverRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setSliderVal(currentDay);
  }, [currentDay]);

  // Close on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (popoverRef.current && !popoverRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  const handleStep = (delta: number, e: React.MouseEvent) => {
    e.stopPropagation();
    const next = Math.max(1, Math.min(90, currentDay + delta));
    setSimulatedDay(next);
  };

  const handleApply = (day: number) => {
    setSimulatedDay(day);
    setIsOpen(false);
  };

  const PRESETS = [
    { day: 1, label: 'Day 1', phase: 'Fresh Start' },
    { day: 2, label: 'Day 2', phase: 'Acclimation' },
    { day: 7, label: 'Day 7', phase: 'End of W1' },
    { day: 21, label: 'Day 21', phase: 'Lag Phase' },
    { day: 28, label: 'Day 28', phase: 'Cycle 1' },
    { day: 52, label: 'Day 52', phase: 'Mid-Cycle' },
    { day: 90, label: 'Day 90', phase: 'Clinical Goal' },
  ];

  return (
    <div className={`relative inline-block ${className}`} ref={popoverRef}>
      {/* Control Pill Button */}
      <div className="flex items-center bg-[#E6F5FF] border border-[#BADCF0] rounded-full p-0.5 shadow-2xs hover:border-[#005995]/60 transition-colors">
        <button
          type="button"
          onClick={(e) => handleStep(-1, e)}
          disabled={currentDay <= 1}
          className="w-7 h-7 rounded-full flex items-center justify-center text-[#005995] hover:bg-white disabled:opacity-30 disabled:hover:bg-transparent transition-colors cursor-pointer"
          title="Previous day"
          aria-label="Previous day"
        >
          <ChevronLeft className="w-3.5 h-3.5" />
        </button>

        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-1.5 px-2.5 py-1 text-xs font-sans font-bold text-[#005995] hover:text-[#004777] transition-colors cursor-pointer"
          title="Change active simulation day (1 to 90)"
        >
          <Calendar className="w-3.5 h-3.5 text-[#005995]" />
          <span className="font-sans font-bold">Day {currentDay}</span>
          {!compact && (
            <span className="font-mono text-[10px] text-[#64748B] font-normal">/ 90</span>
          )}
          <ChevronDown className="w-3 h-3 text-[#64748B]" />
        </button>

        <button
          type="button"
          onClick={(e) => handleStep(1, e)}
          disabled={currentDay >= 90}
          className="w-7 h-7 rounded-full flex items-center justify-center text-[#005995] hover:bg-white disabled:opacity-30 disabled:hover:bg-transparent transition-colors cursor-pointer"
          title="Next day"
          aria-label="Next day"
        >
          <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Popover Menu with Slider and Presets */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-3xl shadow-2xl border border-[#E2E8F0] p-5 z-50 animate-in fade-in zoom-in-95">
          <div className="flex items-center justify-between mb-3 pb-3 border-b border-[#F0F6FA]">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-[#E6F5FF] flex items-center justify-center text-[#005995]">
                <Calendar className="w-4 h-4" />
              </div>
              <div>
                <h4 className="font-serif font-semibold text-sm text-[#111827]">
                  Change Journey Day
                </h4>
                <p className="font-sans text-[11px] text-[#64748B]">
                  Sets all clocks, check-ins, and decoder statuses
                </p>
              </div>
            </div>
            <span className="font-mono text-xs font-bold px-2.5 py-1 rounded-full bg-[#005995] text-white">
              Day {sliderVal}
            </span>
          </div>

          {/* Range Slider */}
          <div className="mb-5">
            <div className="flex justify-between text-[11px] font-mono text-[#64748B] mb-1.5 font-medium">
              <span>Day 1 (Start)</span>
              <span>Day 45</span>
              <span>Day 90 (Goal)</span>
            </div>
            <input
              type="range"
              min="1"
              max="90"
              value={sliderVal}
              onChange={(e) => setSliderVal(parseInt(e.target.value, 10))}
              onMouseUp={() => setSimulatedDay(sliderVal)}
              onTouchEnd={() => setSimulatedDay(sliderVal)}
              className="w-full accent-[#005995] h-2 bg-[#E2E8F0] rounded-lg cursor-pointer"
            />
          </div>

          {/* Quick Preset Buttons */}
          <div className="mb-4">
            <span className="block font-mono text-[10px] uppercase tracking-wider text-[#64748B] font-semibold mb-2">
              Quick Clinical Presets
            </span>
            <div className="grid grid-cols-4 gap-1.5">
              {PRESETS.map((p) => {
                const isActive = currentDay === p.day;
                return (
                  <button
                    key={p.day}
                    type="button"
                    onClick={() => handleApply(p.day)}
                    className={`px-2 py-2 rounded-xl text-center text-xs transition-all cursor-pointer ${
                      isActive
                        ? 'bg-[#005995] text-white font-semibold shadow-xs'
                        : 'bg-[#F8FAFC] hover:bg-[#E6F5FF] text-[#111827] border border-[#E2E8F0]'
                    }`}
                  >
                    <span className="block font-sans font-bold leading-none">{p.label}</span>
                    <span className={`block font-mono text-[9px] mt-1 truncate ${isActive ? 'text-[#BADCF0]' : 'text-[#64748B]'}`}>
                      {p.phase}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Manual Input + Apply Button */}
          <div className="pt-3 border-t border-[#F0F6FA] flex items-center justify-between gap-3">
            <div className="flex items-center gap-1 text-xs">
              <span className="text-[#64748B]">Custom:</span>
              <input
                type="number"
                min="1"
                max="90"
                value={sliderVal}
                onChange={(e) => {
                  const val = parseInt(e.target.value, 10);
                  if (!isNaN(val)) setSliderVal(Math.max(1, Math.min(90, val)));
                }}
                className="w-14 px-2 py-1 rounded-lg border border-[#E2E8F0] font-mono text-center font-bold text-xs text-[#111827]"
              />
            </div>
            <button
              type="button"
              onClick={() => handleApply(sliderVal)}
              className="px-4 py-1.5 rounded-full bg-[#005995] hover:bg-[#004777] text-white font-sans font-semibold text-xs transition-colors cursor-pointer shadow-xs"
            >
              Apply Day {sliderVal}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
