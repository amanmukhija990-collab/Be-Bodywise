import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { CATALOGUE_PRODUCTS } from '../data/catalogue';
import { soundEffects } from '../lib/soundEffects';
import { Play, Pause, RotateCcw, Check, X, Clock, Sparkles } from 'lucide-react';

import { ShelfItem } from '../types';

interface ContactTimerModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultShelfItemId?: string;
  shelfItem?: ShelfItem | null;
}

export const ContactTimerModal: React.FC<ContactTimerModalProps> = ({
  isOpen,
  onClose,
  defaultShelfItemId,
  shelfItem,
}) => {
  const { user, logProductApplication, addToast } = useApp();
  const shelf = user?.shelf || [];

  const initialId = shelfItem?.id || defaultShelfItemId || (shelf[0]?.id || '');
  const [selectedItemId, setSelectedItemId] = useState<string>(initialId);

  const [durationSeconds, setDurationSeconds] = useState<number>(180); // 3 minutes default
  const [secondsRemaining, setSecondsRemaining] = useState<number>(180);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [isCompleted, setIsCompleted] = useState<boolean>(false);

  // Sync selected shelf item if changed
  useEffect(() => {
    if (shelfItem?.id) {
      setSelectedItemId(shelfItem.id);
    } else if (defaultShelfItemId) {
      setSelectedItemId(defaultShelfItemId);
    } else if (shelf.length > 0 && !selectedItemId) {
      setSelectedItemId(shelf[0].id);
    }
  }, [shelfItem, defaultShelfItemId, shelf]);

  // Timer countdown loop
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isRunning && secondsRemaining > 0) {
      interval = setInterval(() => {
        setSecondsRemaining(prev => {
          if (prev <= 1) {
            setIsRunning(false);
            setIsCompleted(true);
            soundEffects.playChime();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isRunning, secondsRemaining]);

  if (!isOpen) return null;

  const selectedItem = shelf.find(s => s.id === selectedItemId);
  const productName = selectedItem?.productId
    ? CATALOGUE_PRODUCTS.find(p => p.id === selectedItem.productId)?.name || 'Wash-off Product'
    : selectedItem?.manual?.name || 'Treatment Formulation';

  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const remainder = secs % 60;
    return `${mins}:${String(remainder).padStart(2, '0')}`;
  };

  const handleStartPause = () => {
    soundEffects.playTap();
    setIsRunning(!isRunning);
  };

  const handleReset = (newDuration?: number) => {
    const target = newDuration !== undefined ? newDuration : durationSeconds;
    setIsRunning(false);
    setIsCompleted(false);
    setSecondsRemaining(target);
    if (newDuration !== undefined) {
      setDurationSeconds(newDuration);
    }
  };

  const handleLogAndClose = () => {
    if (selectedItemId) {
      logProductApplication(selectedItemId);
      addToast('Application Logged', `${productName} contact treatment completed`, 'success');
    }
    onClose();
  };

  const progressPercent = Math.min(100, Math.round(((durationSeconds - secondsRemaining) / durationSeconds) * 100));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#005995]/70 backdrop-blur-sm animate-in fade-in">
      <div className="bg-white dark:bg-[#152219] rounded-[28px] max-w-md w-full p-6 sm:p-8 shadow-2xl border border-[#E2E8F0] dark:border-[#243528] relative text-center">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 w-8 h-8 rounded-full bg-[#F0F6FA] dark:bg-[#1C2920] text-[#111827] dark:text-white flex items-center justify-center hover:bg-[#E2E8F0] transition-colors"
          aria-label="Close contact timer"
        >
          <X className="w-4 h-4" />
        </button>

        <span className="font-mono text-[10px] uppercase tracking-widest text-[#005995] font-bold block mb-1">
          CLINICAL CONTACT TIME STOPWATCH
        </span>
        <h3 className="font-serif font-bold text-xl sm:text-2xl text-[#111827] dark:text-[#F7F4EC] mb-1">
          Active Absorption Timer
        </h3>
        <p className="font-sans text-xs text-[#64748B] dark:text-[#A2A89C] mb-5">
          Allowing full contact time ensures active molecules dissolve biofilms before rinsing.
        </p>

        {/* Product selector dropdown */}
        <div className="mb-6 text-left">
          <label className="block font-mono text-[10px] uppercase text-[#64748B] dark:text-[#A2A89C] tracking-wider mb-1 font-semibold">
            SELECT FORMULA ON SHELF
          </label>
          <select
            value={selectedItemId}
            onChange={e => {
              setSelectedItemId(e.target.value);
              handleReset();
            }}
            className="w-full px-3.5 py-2 rounded-xl bg-[#FAFBFD] dark:bg-[#0E1611] border border-[#E2E8F0] dark:border-[#243528] text-xs font-sans text-[#111827] dark:text-white outline-none cursor-pointer"
          >
            {shelf.map(item => {
              const name = item.productId
                ? CATALOGUE_PRODUCTS.find(p => p.id === item.productId)?.name
                : item.manual?.name;
              return (
                <option key={item.id} value={item.id}>
                  {name} ({item.when})
                </option>
              );
            })}
          </select>
        </div>

        {/* Circular Countdown Display */}
        <div className="relative w-48 h-48 mx-auto my-6 flex items-center justify-center">
          <svg className="w-full h-full -rotate-90">
            <circle
              cx="96"
              cy="96"
              r="84"
              stroke="#E2E8F0"
              strokeWidth="8"
              fill="transparent"
              className="dark:stroke-[#243528]"
            />
            <circle
              cx="96"
              cy="96"
              r="84"
              stroke={isCompleted ? '#2C5044' : '#A46F39'}
              strokeWidth="8"
              strokeDasharray={2 * Math.PI * 84}
              strokeDashoffset={2 * Math.PI * 84 - (progressPercent / 100) * (2 * Math.PI * 84)}
              strokeLinecap="round"
              fill="transparent"
              className="transition-all duration-300"
            />
          </svg>

          {/* Time text centered */}
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="font-serif font-black text-4xl text-[#111827] dark:text-white tracking-tight">
              {formatTime(secondsRemaining)}
            </span>
            <span className="font-mono text-[10px] uppercase tracking-wider text-[#64748B] dark:text-[#A2A89C] mt-1">
              {isCompleted ? '✓ Completed' : isRunning ? 'Absorbing...' : 'Paused'}
            </span>
          </div>
        </div>

        {/* Preset Duration Buttons */}
        <div className="flex items-center justify-center gap-2 mb-6">
          {[
            { label: '1 Min', secs: 60 },
            { label: '2 Mins', secs: 120 },
            { label: '3 Mins (Recommended)', secs: 180 },
            { label: '5 Mins', secs: 300 },
          ].map(p => (
            <button
              key={p.secs}
              type="button"
              onClick={() => handleReset(p.secs)}
              className={`px-2.5 py-1 rounded-full font-mono text-[10px] transition-all cursor-pointer ${
                durationSeconds === p.secs
                  ? 'bg-[#005995] dark:bg-white text-white dark:text-[#111827] font-bold'
                  : 'bg-[#E6F5FF] dark:bg-[#1C2920] text-[#111827] dark:text-white hover:bg-[#E2E8F0]'
              }`}
            >
              {p.label}
            </button>
          ))}
        </div>

        {/* Controls */}
        <div className="flex items-center justify-center gap-3">
          <button
            type="button"
            onClick={handleStartPause}
            className={`flex-1 inline-flex items-center justify-center gap-2 py-3 px-6 rounded-full font-sans font-semibold text-xs sm:text-sm text-white transition-all shadow-md cursor-pointer ${
              isRunning
                ? 'bg-[#B4492E] hover:bg-[#8F351F]'
                : 'bg-[#005995] hover:bg-[#004777]'
            }`}
          >
            {isRunning ? (
              <>
                <Pause className="w-4 h-4" />
                <span>Pause</span>
              </>
            ) : (
              <>
                <Play className="w-4 h-4 fill-current" />
                <span>{secondsRemaining === durationSeconds ? 'Start Timer' : 'Resume'}</span>
              </>
            )}
          </button>

          <button
            type="button"
            onClick={() => handleReset()}
            className="w-11 h-11 rounded-full border border-[#E2E8F0] dark:border-[#243528] flex items-center justify-center text-[#111827] dark:text-white hover:bg-[#F0F6FA] dark:hover:bg-[#1C2920] transition-colors"
            title="Reset Timer"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>

        {/* Completed Log Button */}
        {isCompleted && (
          <div className="mt-5 pt-4 border-t border-[#E2E8F0] dark:border-[#243528] animate-in fade-in">
            <button
              type="button"
              onClick={handleLogAndClose}
              className="w-full inline-flex items-center justify-center gap-2 py-3 px-6 rounded-full bg-[#005995] hover:bg-[#203B31] text-white font-sans font-bold text-xs shadow-md cursor-pointer"
            >
              <Check className="w-4 h-4 stroke-[3]" />
              <span>Log Application & Award +10 XP</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
