import React from 'react';
import { useApp } from '../context/AppContext';
import { CheckCircle2, Zap, Info, X } from 'lucide-react';

export const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useApp();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-2.5 max-w-sm pointer-events-none">
      {toasts.map(toast => {
        const isXp = toast.type === 'xp';
        const isInfo = toast.type === 'info';

        return (
          <div
            key={toast.id}
            className="pointer-events-auto flex items-start gap-3 px-4 py-3.5 rounded-2xl bg-[#ECFEF2] border border-[#C5E6D4] text-[#1F7A4D] shadow-lg shadow-[#172319]/5 transition-all duration-300 animate-in slide-in-from-bottom-3 fade-in"
          >
            <div className="shrink-0 mt-0.5">
              {isXp ? (
                <div className="w-5 h-5 rounded-full bg-[#E29D52] text-white flex items-center justify-center font-bold text-xs">
                  <Zap className="w-3.5 h-3.5 fill-current" />
                </div>
              ) : isInfo ? (
                <Info className="w-5 h-5 text-[#2C5044]" />
              ) : (
                <CheckCircle2 className="w-5 h-5 text-[#1F7A4D]" />
              )}
            </div>

            <div className="flex-1 min-w-0 pr-1">
              <p className="font-sans font-semibold text-sm leading-tight text-[#172319]">
                {toast.title}
              </p>
              {toast.message && (
                <p className="font-sans text-xs text-[#2C5044]/80 mt-1 leading-relaxed">
                  {toast.message}
                </p>
              )}
            </div>

            <button
              onClick={() => removeToast(toast.id)}
              className="text-[#1F7A4D]/60 hover:text-[#1F7A4D] transition-colors p-0.5"
              aria-label="Dismiss notification"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
};
