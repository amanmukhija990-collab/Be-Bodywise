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
            className="pointer-events-auto flex items-start gap-3 px-4 py-3.5 rounded-2xl bg-white border border-[#BADCF0] text-[#005995] shadow-lg shadow-[#005995]/10 transition-all duration-300 animate-in slide-in-from-bottom-3 fade-in"
          >
            <div className="shrink-0 mt-0.5">
              {isXp ? (
                <div className="w-5 h-5 rounded-full bg-[#EB6200] text-white flex items-center justify-center font-bold text-xs">
                  <Zap className="w-3.5 h-3.5 fill-current" />
                </div>
              ) : isInfo ? (
                <Info className="w-5 h-5 text-[#005995]" />
              ) : (
                <CheckCircle2 className="w-5 h-5 text-[#198775]" />
              )}
            </div>

            <div className="flex-1 min-w-0 pr-1">
              <p className="font-sans font-semibold text-sm leading-tight text-[#111827]">
                {toast.title}
              </p>
              {toast.message && (
                <p className="font-sans text-xs text-[#64748B] mt-1 leading-relaxed">
                  {toast.message}
                </p>
              )}
            </div>

            <button
              onClick={() => removeToast(toast.id)}
              className="text-[#64748B] hover:text-[#111827] transition-colors p-0.5 cursor-pointer"
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
