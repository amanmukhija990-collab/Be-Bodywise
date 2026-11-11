import React, { useState, useEffect } from 'react';
import { Eyebrow } from './Eyebrow';
import { Activity, ShieldCheck, Zap, Sparkles, ChevronRight } from 'lucide-react';

interface BiologicalLayerSimulatorProps {
  initialDay?: number;
  currentDay?: number;
  className?: string;
}

export const BiologicalLayerSimulator: React.FC<BiologicalLayerSimulatorProps> = ({
  initialDay = 28,
  currentDay,
  className = '',
}) => {
  const [day, setDay] = useState<number>(currentDay ?? initialDay);
  const [activeTab, setActiveTab] = useState<'skin' | 'hair'>('skin');

  useEffect(() => {
    if (currentDay !== undefined) {
      setDay(currentDay);
    }
  }, [currentDay]);

  // Calculate biological markers based on day
  const barrierStrength = Math.min(98, Math.round(45 + (day / 90) * 50));
  const activeAccumulation = Math.min(95, Math.round(day <= 7 ? day * 4 : 28 + (day / 90) * 65));
  const inflammationReduction = Math.min(92, Math.round(15 + (day / 90) * 75));
  const sheddingReduction = Math.min(88, Math.round(day <= 14 ? 20 : 35 + ((day - 14) / 76) * 53));

  // Determine biological phase
  let phaseName = 'Phase 1: Acclimation & Barrier Shielding';
  let phaseDescription = 'Surface microbiome balances. Epidermal lipids begin reorganizing. No visible surface changes expected yet.';
  let phaseColor = '#5B4BC4'; // Lavender/Indigo
  let phaseStatus = 'Too Early to Judge';

  if (day > 14 && day <= 50) {
    phaseName = 'Phase 2: Cellular Turnover & Lag Anchor';
    phaseDescription = 'Active ingredients reach steady-state dermal concentration. The 28-day skin cycle sheds old micro-comedones. This is where 68% of people prematurely quit.';
    phaseColor = '#E29D52'; // Amber
    phaseStatus = 'Dropout Danger Zone';
  } else if (day > 50 && day <= 75) {
    phaseName = 'Phase 3: Deep Follicular & Dermal Remodeling';
    phaseDescription = 'Anagen hair growth phase is stimulated. Melanin synthesis clusters dissolve. Pores visibly refine as sebum oxidation halts.';
    phaseColor = '#8EBEA6'; // Mint/Sage
    phaseStatus = 'Visible Shifts Emergent';
  } else if (day > 75) {
    phaseName = 'Phase 4: Structural Clinical Consolidation';
    phaseDescription = 'Full clinical endpoints reached. New follicle tensile strength consolidated. Epidermal barrier resilience permanently fortified.';
    phaseColor = '#2C5044'; // Forest
    phaseStatus = 'Verified Transformation';
  }

  const milestones = [
    { targetDay: 1, label: 'Day 1 Baseline' },
    { targetDay: 14, label: 'Day 14 Purge Check' },
    { targetDay: 28, label: 'Day 28 Skin Cycle' },
    { targetDay: 50, label: 'Day 50 Danger Peak' },
    { targetDay: 70, label: 'Day 70 Visible Shift' },
    { targetDay: 90, label: 'Day 90 Full Results' },
  ];

  return (
    <div className={`p-6 sm:p-8 rounded-[28px] bg-white dark:bg-[#152219] border border-[#E2E8F0] dark:border-[#243528] shadow-sm transition-all ${className}`}>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <Eyebrow className="mb-1">CELLULAR TIMELINE LAB</Eyebrow>
          <h3 className="font-serif font-bold text-xl sm:text-2xl text-[#111827] dark:text-[#F7F4EC]">
            Interactive 90-Day Biological Simulator
          </h3>
          <p className="font-sans text-xs sm:text-sm text-[#64748B] dark:text-[#A2A89C] mt-0.5">
            Scrub through time to see how clinical actives reshape the dermal & follicular matrix.
          </p>
        </div>

        {/* Biological Tissue Switcher */}
        <div className="inline-flex items-center bg-[#E6F5FF] dark:bg-[#1A281E] p-1 rounded-full border border-[#E2E8F0] dark:border-[#243528] self-start sm:self-auto">
          <button
            onClick={() => setActiveTab('skin')}
            className={`px-4 py-1.5 rounded-full font-sans text-xs font-semibold transition-all cursor-pointer ${
              activeTab === 'skin'
                ? 'bg-white dark:bg-[#005995] text-[#111827] dark:text-white shadow-xs'
                : 'text-[#64748B] dark:text-[#A2A89C] hover:text-[#111827]'
            }`}
          >
            Skin Barrier Matrix
          </button>
          <button
            onClick={() => setActiveTab('hair')}
            className={`px-4 py-1.5 rounded-full font-sans text-xs font-semibold transition-all cursor-pointer ${
              activeTab === 'hair'
                ? 'bg-white dark:bg-[#005995] text-[#111827] dark:text-white shadow-xs'
                : 'text-[#64748B] dark:text-[#A2A89C] hover:text-[#111827]'
            }`}
          >
            Scalp & Follicle Bulb
          </button>
        </div>
      </div>

      {/* Main Interactive Cross-Section Visualizer */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center mb-8">
        {/* Left: Dynamic Biological SVG Cross-Section */}
        <div className="lg:col-span-7 bg-[#FAFBFD] dark:bg-[#0E1611] rounded-2xl p-6 border border-[#E2E8F0] dark:border-[#243528] relative overflow-hidden flex flex-col justify-between min-h-[280px]">
          {/* Phase Badge */}
          <div className="flex items-center justify-between gap-3 mb-4 z-10">
            <span
              className="px-3 py-1 rounded-full text-[10px] font-mono uppercase font-bold tracking-wider"
              style={{ backgroundColor: `${phaseColor}20`, color: phaseColor }}
            >
              ● {phaseStatus}
            </span>
            <span className="font-mono text-xs font-bold text-[#111827] dark:text-white">
              DAY {day} OF 90
            </span>
          </div>

          {/* SVG Diagram Representation */}
          <div className="w-full my-auto py-2">
            {activeTab === 'skin' ? (
              <div className="space-y-3">
                {/* Stratum Corneum Surface Layer */}
                <div>
                  <div className="flex justify-between text-[11px] font-mono text-[#64748B] dark:text-[#A2A89C] mb-1">
                    <span>1. Stratum Corneum (Lipid Barrier)</span>
                    <span>{barrierStrength}% Integrity</span>
                  </div>
                  <div className="w-full h-4 rounded-md overflow-hidden bg-amber-100 dark:bg-amber-950/40 border border-amber-300 dark:border-amber-800/40 relative">
                    <div
                      className="h-full bg-gradient-to-r from-[#A46F39] to-[#8EBEA6] rounded-md transition-all duration-300"
                      style={{ width: `${barrierStrength}%` }}
                    />
                  </div>
                </div>

                {/* Epidermal Cellular Matrix */}
                <div>
                  <div className="flex justify-between text-[11px] font-mono text-[#64748B] dark:text-[#A2A89C] mb-1">
                    <span>2. Epidermis (Active Bio-accumulation)</span>
                    <span>{activeAccumulation}% Saturated</span>
                  </div>
                  <div className="w-full h-4 rounded-md overflow-hidden bg-emerald-100 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-800/40 relative">
                    <div
                      className="h-full bg-gradient-to-r from-[#2C5044] to-[#8EBEA6] rounded-md transition-all duration-300"
                      style={{ width: `${activeAccumulation}%` }}
                    />
                  </div>
                </div>

                {/* Subsurface Dermal Inflammation */}
                <div>
                  <div className="flex justify-between text-[11px] font-mono text-[#64748B] dark:text-[#A2A89C] mb-1">
                    <span>3. Dermis (Inflammation Cleared)</span>
                    <span>{inflammationReduction}% Resolved</span>
                  </div>
                  <div className="w-full h-4 rounded-md overflow-hidden bg-rose-100 dark:bg-rose-950/40 border border-rose-300 dark:border-rose-800/40 relative">
                    <div
                      className="h-full bg-gradient-to-r from-rose-500 to-[#2C5044] rounded-md transition-all duration-300"
                      style={{ width: `${inflammationReduction}%` }}
                    />
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                {/* Follicular Anagen Stimulation */}
                <div>
                  <div className="flex justify-between text-[11px] font-mono text-[#64748B] dark:text-[#A2A89C] mb-1">
                    <span>1. Anagen (Growth Phase) Activation</span>
                    <span>{activeAccumulation}% Activated</span>
                  </div>
                  <div className="w-full h-4 rounded-md overflow-hidden bg-amber-100 dark:bg-amber-950/40 border border-amber-300 dark:border-amber-800/40">
                    <div
                      className="h-full bg-gradient-to-r from-[#E29D52] to-[#2C5044] rounded-md transition-all duration-300"
                      style={{ width: `${activeAccumulation}%` }}
                    />
                  </div>
                </div>

                {/* Shower Shedding Reduction */}
                <div>
                  <div className="flex justify-between text-[11px] font-mono text-[#64748B] dark:text-[#A2A89C] mb-1">
                    <span>2. Follicle Anchorage & Shedding Relief</span>
                    <span>{sheddingReduction}% Stabilized</span>
                  </div>
                  <div className="w-full h-4 rounded-md overflow-hidden bg-emerald-100 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-800/40">
                    <div
                      className="h-full bg-gradient-to-r from-[#8EBEA6] to-[#2C5044] rounded-md transition-all duration-300"
                      style={{ width: `${sheddingReduction}%` }}
                    />
                  </div>
                </div>

                {/* Scalp Sebum & Flake Clearance */}
                <div>
                  <div className="flex justify-between text-[11px] font-mono text-[#64748B] dark:text-[#A2A89C] mb-1">
                    <span>3. Scalp Microbiome & Clarity</span>
                    <span>{barrierStrength}% Restored</span>
                  </div>
                  <div className="w-full h-4 rounded-md overflow-hidden bg-blue-100 dark:bg-blue-950/40 border border-blue-300 dark:border-blue-800/40">
                    <div
                      className="h-full bg-gradient-to-r from-blue-400 to-[#2C5044] rounded-md transition-all duration-300"
                      style={{ width: `${barrierStrength}%` }}
                    />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Phase summary footer */}
          <div className="mt-4 pt-3 border-t border-[#E2E8F0] dark:border-[#243528]">
            <p className="font-serif font-bold text-sm text-[#111827] dark:text-[#F7F4EC]">
              {phaseName}
            </p>
            <p className="font-sans text-xs text-[#64748B] dark:text-[#A2A89C] mt-0.5 leading-relaxed">
              {phaseDescription}
            </p>
          </div>
        </div>

        {/* Right: Key Biomarker Telemetry Gauges */}
        <div className="lg:col-span-5 flex flex-col gap-3">
          <div className="p-4 rounded-2xl bg-[#FAFBFD] dark:bg-[#0E1611] border border-[#E2E8F0] dark:border-[#243528] flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-[#005995]/15 text-[#198775] dark:text-[#8EBEA6] flex items-center justify-center">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <p className="font-sans font-semibold text-xs text-[#111827] dark:text-white">
                  Moisture Barrier Shield
                </p>
                <p className="font-mono text-[10px] text-[#64748B] dark:text-[#A2A89C]">
                  Trans-Epidermal Water Loss
                </p>
              </div>
            </div>
            <span className="font-serif font-bold text-lg text-[#111827] dark:text-white">
              {barrierStrength}%
            </span>
          </div>

          <div className="p-4 rounded-2xl bg-[#FAFBFD] dark:bg-[#0E1611] border border-[#E2E8F0] dark:border-[#243528] flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-[#A46F39]/15 text-[#005995] dark:text-[#EB6200] flex items-center justify-center">
                <Zap className="w-5 h-5" />
              </div>
              <div>
                <p className="font-sans font-semibold text-xs text-[#111827] dark:text-white">
                  Cellular Bio-Accumulation
                </p>
                <p className="font-mono text-[10px] text-[#64748B] dark:text-[#A2A89C]">
                  Therapeutic Threshold Level
                </p>
              </div>
            </div>
            <span className="font-serif font-bold text-lg text-[#111827] dark:text-white">
              {activeAccumulation}%
            </span>
          </div>

          <div className="p-4 rounded-2xl bg-[#FAFBFD] dark:bg-[#0E1611] border border-[#E2E8F0] dark:border-[#243528] flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-[#5B4BC4]/15 text-[#5B4BC4] dark:text-[#ABA1F5] flex items-center justify-center">
                <Activity className="w-5 h-5" />
              </div>
              <div>
                <p className="font-sans font-semibold text-xs text-[#111827] dark:text-white">
                  Micro-Inflammation Resolution
                </p>
                <p className="font-mono text-[10px] text-[#64748B] dark:text-[#A2A89C]">
                  Erythema & Shedding Control
                </p>
              </div>
            </div>
            <span className="font-serif font-bold text-lg text-[#111827] dark:text-white">
              {inflammationReduction}%
            </span>
          </div>
        </div>
      </div>

      {/* Interactive Day Scrubber Slider */}
      <div className="p-5 rounded-2xl bg-[#FAFBFD] dark:bg-[#0E1611] border border-[#E2E8F0] dark:border-[#243528]">
        <div className="flex items-center justify-between mb-2">
          <span className="font-mono text-[10px] uppercase tracking-wider text-[#005995] font-bold">
            SCRUB 90-DAY CLINICAL TIMELINE
          </span>
          <span className="font-mono text-xs font-bold text-[#111827] dark:text-white">
            Current Position: Day {day} / 90
          </span>
        </div>

        <input
          type="range"
          min="1"
          max="90"
          value={day}
          onChange={e => setDay(Number(e.target.value))}
          className="w-full h-2 bg-[#E2E8F0] dark:bg-[#243528] rounded-lg appearance-none cursor-pointer accent-[#005995]"
          aria-label="Biological timeline day slider"
        />

        {/* Milestone Quick Jump Buttons */}
        <div className="flex flex-wrap items-center gap-1.5 mt-4 pt-3 border-t border-[#E2E8F0] dark:border-[#243528]">
          <span className="font-mono text-[10px] uppercase text-[#64748B] dark:text-[#A2A89C] mr-1">
            Jump to:
          </span>
          {milestones.map(m => (
            <button
              key={m.targetDay}
              onClick={() => setDay(m.targetDay)}
              className={`px-2.5 py-1 rounded-full font-mono text-[10px] transition-all cursor-pointer ${
                day === m.targetDay
                  ? 'bg-[#005995] dark:bg-white text-white dark:text-[#111827] font-bold shadow-xs'
                  : 'bg-white dark:bg-[#1A281E] border border-[#E2E8F0] dark:border-[#243528] text-[#111827] dark:text-[#F7F4EC] hover:border-[#005995]'
              }`}
            >
              {m.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
