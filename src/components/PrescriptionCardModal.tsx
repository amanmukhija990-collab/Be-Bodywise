import React from 'react';
import { useApp } from '../context/AppContext';
import { getLevelInfo } from '../lib/xpEngine';
import { CATALOGUE_PRODUCTS } from '../data/catalogue';
import { evaluateShelfItem } from '../lib/statusEngine';
import { ShelfItem } from '../types';
import { X, Printer, ShieldCheck, Sparkles, CheckCircle2, Award } from 'lucide-react';

interface PrescriptionCardModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedItemId?: string;
}

export const PrescriptionCardModal: React.FC<PrescriptionCardModalProps> = ({
  isOpen,
  onClose,
  selectedItemId,
}) => {
  const { user, todayStr } = useApp();

  if (!isOpen || !user) return null;

  const levelInfo = getLevelInfo(user.xp);
  const shelf: ShelfItem[] = user.shelf || [];
  const targetItem = selectedItemId ? shelf.find(s => s.id === selectedItemId) : shelf[0];
  const targetEval = targetItem ? evaluateShelfItem(targetItem, todayStr) : null;

  const todayDisplay = new Date().toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });

  const handlePrint = () => {
    window.print();
  };

  const accountKey = user.profile.email 
    ? user.profile.email.split('@')[0].toUpperCase().slice(-6)
    : 'BW9001';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-2xl bg-white dark:bg-[#18281E] rounded-3xl border border-[#E2E8F0] dark:border-[#243528] shadow-2xl overflow-hidden flex flex-col max-h-[92vh]"
        onClick={e => e.stopPropagation()}
      >
        {/* Modal Header Actions */}
        <div className="px-6 py-4 bg-[#F0F6FA]/70 dark:bg-[#152219] border-b border-[#E2E8F0] dark:border-[#243528] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-[#198775] dark:text-[#8EBEA6]" />
            <span className="font-mono text-xs uppercase tracking-wider text-[#64748B] dark:text-[#B1BAAF] font-semibold">
              Certified Regimen Passport · ISO-BW-90
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white dark:bg-[#1E3226] border border-[#E2E8F0] dark:border-[#334938] text-xs font-sans font-medium text-[#111827] dark:text-[#F4EFE6] hover:bg-[#FAFBFD] dark:hover:bg-[#243528] transition-colors shadow-2xs cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5 text-[#005995] dark:text-[#EB6200]" />
              <span>Print / Save PDF</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-full hover:bg-black/5 dark:hover:bg-white/10 text-[#64748B] dark:text-[#B1BAAF] transition-colors cursor-pointer"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Card Body */}
        <div className="p-6 md:p-8 overflow-y-auto space-y-6 print:p-0 print:border-none">
          {/* Passport Header with Seal */}
          <div className="relative border-b-2 border-dashed border-[#E2E8F0] dark:border-[#243528] pb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-[#005995]/10 dark:bg-[#8EBEA6]/20 text-[#198775] dark:text-[#8EBEA6] font-mono text-[11px] font-bold tracking-widest uppercase mb-2">
                BE BODYWISE CLINICAL ATELIER
              </div>
              <h2 className="font-serif text-2xl md:text-3xl font-semibold text-[#111827] dark:text-[#F4EFE6]">
                90-Day Regimen Prescription Card
              </h2>
              <p className="font-sans text-xs text-[#64748B] dark:text-[#B1BAAF] mt-1">
                Issued for {user.profile.firstName} · Account Key #{accountKey}
              </p>
            </div>

            {/* Verification Seal Badge */}
            <div className="shrink-0 flex items-center gap-3 bg-[#FAFBFD] dark:bg-[#152219] border border-[#E2E8F0] dark:border-[#243528] rounded-2xl p-3.5 shadow-2xs">
              <div className="w-12 h-12 rounded-xl bg-[#005995] dark:bg-[#8EBEA6] flex items-center justify-center text-white dark:text-[#0E1611]">
                <Award className="w-6 h-6" />
              </div>
              <div className="text-right sm:text-left">
                <span className="block font-mono text-[10px] uppercase tracking-wider text-[#005995] dark:text-[#EB6200] font-bold">
                  Verified Protocol
                </span>
                <span className="block font-serif text-sm font-semibold text-[#111827] dark:text-[#F4EFE6]">
                  {targetEval ? `Phase: Week ${Math.floor(targetEval.day / 7) + 1} of 13` : 'Phase: Week 1–13'}
                </span>
                <span className="block font-mono text-[9px] text-[#64748B] dark:text-[#B1BAAF]">
                  Validated: {todayDisplay}
                </span>
              </div>
            </div>
          </div>

          {/* Patient Meta Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 py-3 px-4 rounded-2xl bg-[#FAFBFD] dark:bg-[#152219] border border-[#E2E8F0] dark:border-[#243528]">
            <div>
              <span className="block font-mono text-[10px] uppercase text-[#64748B] dark:text-[#B1BAAF] font-medium">Care Tier</span>
              <span className="font-sans text-xs font-semibold text-[#111827] dark:text-[#F4EFE6]">{levelInfo.title}</span>
            </div>
            <div>
              <span className="block font-mono text-[10px] uppercase text-[#64748B] dark:text-[#B1BAAF] font-medium">Active Streak</span>
              <span className="font-sans text-xs font-semibold text-[#111827] dark:text-[#F4EFE6]">{user.streak} Days Logged</span>
            </div>
            <div>
              <span className="block font-mono text-[10px] uppercase text-[#64748B] dark:text-[#B1BAAF] font-medium">Lag Phase Risk</span>
              <span className="font-sans text-xs font-semibold text-[#198775] dark:text-[#8EBEA6]">Monitored · Low</span>
            </div>
            <div>
              <span className="block font-mono text-[10px] uppercase text-[#64748B] dark:text-[#B1BAAF] font-medium">Clinical Cycle</span>
              <span className="font-sans text-xs font-semibold text-[#111827] dark:text-[#F4EFE6]">90-Day Standard</span>
            </div>
          </div>

          {/* Active Shelf Regimen Table */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-serif text-lg font-semibold text-[#111827] dark:text-[#F4EFE6] flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#005995] dark:text-[#EB6200]" />
                Prescribed Actives & Application Timing
              </h3>
              <span className="font-mono text-[11px] text-[#64748B] dark:text-[#B1BAAF]">
                {shelf.length} Active Formulations
              </span>
            </div>

            <div className="border border-[#E2E8F0] dark:border-[#243528] rounded-2xl overflow-hidden divide-y divide-[#E2E8F0] dark:divide-[#243528]">
              {shelf.map(item => {
                const evalData = evaluateShelfItem(item, todayStr);
                const catalogueMatch = item.productId
                  ? CATALOGUE_PRODUCTS.find(p => p.id === item.productId)
                  : null;

                const name = catalogueMatch?.name || item.manual?.name || 'Formulation';
                const category = catalogueMatch?.category || item.manual?.category || 'skin';
                const actives = catalogueMatch?.actives || item.manual?.actives || [];

                return (
                  <div key={item.id} className="p-3.5 bg-white dark:bg-[#18281E] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-semibold text-sm text-[#111827] dark:text-[#F4EFE6]">
                          {name}
                        </span>
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-mono uppercase bg-[#F0F6FA] dark:bg-[#243528] text-[#198775] dark:text-[#8EBEA6] font-medium">
                          {category}
                        </span>
                      </div>
                      <p className="text-[#64748B] dark:text-[#B1BAAF]">
                        <span className="font-medium text-[#111827] dark:text-[#F4EFE6]">Active Actives:</span> {actives.join(', ') || 'Synergistic botanicals'}
                      </p>
                    </div>

                    <div className="flex items-center gap-4 text-right shrink-0">
                      <div>
                        <span className="block font-mono text-[10px] text-[#64748B] dark:text-[#B1BAAF] uppercase">Frequency</span>
                        <span className="font-medium text-[#111827] dark:text-[#F4EFE6] capitalize">{item.frequency}</span>
                      </div>
                      <div>
                        <span className="block font-mono text-[10px] text-[#64748B] dark:text-[#B1BAAF] uppercase">Cycle Day</span>
                        <span className="font-semibold text-[#005995] dark:text-[#EB6200]">Day {evalData.day} / 90</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Clinical Rules of Engagement */}
          <div className="p-4 rounded-2xl bg-[#F0F6FA]/60 dark:bg-[#152219] border border-[#E2E8F0] dark:border-[#243528] space-y-2">
            <h4 className="font-serif text-sm font-semibold text-[#111827] dark:text-[#F4EFE6]">
              Clinical Rules for Biological Efficacy
            </h4>
            <ul className="space-y-1.5 text-xs text-[#64748B] dark:text-[#B1BAAF]">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#198775] dark:text-[#8EBEA6] shrink-0 mt-0.5" />
                <span><strong>Observe the 28-day lag phase:</strong> Cellular turnover takes 28 days minimum. Premature product switching interrupts metabolic adaptation.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#198775] dark:text-[#8EBEA6] shrink-0 mt-0.5" />
                <span><strong>Respect contact times:</strong> Wash-off actives (Salicylic acid, Ketoconazole) require at least 3 minutes of scalp contact before rinsing.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#198775] dark:text-[#8EBEA6] shrink-0 mt-0.5" />
                <span><strong>Sun protection mandatory:</strong> AHA/BHA chemical exfoliants increase photosensitivity. Apply mineral SPF 50 daily.</span>
              </li>
            </ul>
          </div>

          {/* Disclaimer Footer */}
          <div className="pt-3 border-t border-[#E2E8F0] dark:border-[#243528] text-[11px] text-[#64748B] dark:text-[#B1BAAF] flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <p>
              *Educational wellness guidance. Not a substitute for in-person dermatological or medical diagnosis.
            </p>
            <div className="font-mono text-[10px] text-[#005995] dark:text-[#EB6200] font-semibold">
              DOCUMENT NO: BW-REC-892104
            </div>
          </div>
        </div>

        {/* Modal Bottom Actions */}
        <div className="px-6 py-4 bg-[#FAFBFD] dark:bg-[#152219] border-t border-[#E2E8F0] dark:border-[#243528] flex items-center justify-end gap-3">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-full border border-[#E2E8F0] dark:border-[#243528] text-xs font-sans font-medium text-[#111827] dark:text-[#F4EFE6] hover:bg-black/5 transition-colors cursor-pointer"
          >
            Close
          </button>
          <button
            onClick={handlePrint}
            className="px-6 py-2 rounded-full bg-[#005995] dark:bg-[#8EBEA6] hover:bg-[#005995] dark:hover:bg-[#A3CEB8] text-white dark:text-[#0E1611] text-xs font-sans font-semibold transition-all shadow-xs flex items-center gap-1.5 cursor-pointer"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print Prescription</span>
          </button>
        </div>
      </div>
    </div>
  );
};
