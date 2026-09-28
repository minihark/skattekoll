import React from 'react';
import { TaxSettings, PeriodType, BusinessType } from '../types';
import { Calculator, Printer, Sparkles, Check, BookOpen, Building2, User } from 'lucide-react';

interface NavbarProps {
  settings: TaxSettings;
  onChange: (updated: TaxSettings) => void;
  isPro: boolean;
  onOpenProModal: () => void;
  onOpenDeductionModal: () => void;
  onOpenABModal: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  settings,
  onChange,
  isPro,
  onOpenProModal,
  onOpenDeductionModal,
  onOpenABModal,
}) => {
  const setPeriod = (period: PeriodType) => {
    if (period === settings.period) return;
    const factor = period === 'monthly' ? 1 / 12 : 12;
    onChange({
      ...settings,
      period,
      revenue: Math.round(settings.revenue * factor),
      expenses: Math.round(settings.expenses * factor),
    });
  };

  const setBusinessType = (businessType: BusinessType) => {
    onChange({ ...settings, businessType });
  };

  return (
    <header className="sticky top-0 z-40 bg-slate-900/90 backdrop-blur-md border-b border-slate-800 px-4 py-3 print:hidden">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
        
        {/* Brand */}
        <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-start">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white shadow-md shadow-emerald-900/40">
              <Calculator className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-1.5 font-bold text-sm text-slate-100 tracking-tight">
                <span>SkatteKoll</span>
                <span className="text-[10px] px-1.5 py-0.2 rounded bg-emerald-950 border border-emerald-500/40 text-emerald-400 font-semibold">
                  2026
                </span>
              </div>
              <div className="text-[10px] text-slate-400">
                Svensk frilans- & uttagskalkyl
              </div>
            </div>
          </div>

          {/* Period Toggle */}
          <div className="flex bg-slate-950 p-1 rounded-lg border border-slate-800 text-xs">
            <button
              type="button"
              onClick={() => setPeriod('monthly')}
              className={`px-3 py-1 rounded-md font-medium transition-colors ${
                settings.period === 'monthly'
                  ? 'bg-slate-800 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Månad
            </button>
            <button
              type="button"
              onClick={() => setPeriod('yearly')}
              className={`px-3 py-1 rounded-md font-medium transition-colors ${
                settings.period === 'yearly'
                  ? 'bg-slate-800 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Helår
            </button>
          </div>
        </div>

        {/* Right Action Controls */}
        <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto justify-end text-xs">
          
          {/* Business Type selector */}
          <div className="flex bg-slate-950 p-1 rounded-lg border border-slate-800 text-xs">
            <button
              type="button"
              onClick={() => setBusinessType('enskild_firma')}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md font-medium transition-colors ${
                settings.businessType === 'enskild_firma'
                  ? 'bg-slate-800 text-white'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <User className="w-3.5 h-3.5 text-emerald-400" />
              <span>Enskild Firma</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setBusinessType('aktiebolag');
                onOpenABModal();
              }}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md font-medium transition-colors ${
                settings.businessType === 'aktiebolag'
                  ? 'bg-slate-800 text-white'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Building2 className="w-3.5 h-3.5 text-teal-400" />
              <span>Aktiebolag (AB)</span>
            </button>
          </div>

          {/* Deductions & Dates Guide */}
          <button
            type="button"
            onClick={onOpenDeductionModal}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-750 border border-slate-700 text-slate-200 rounded-lg transition-colors font-medium"
          >
            <BookOpen className="w-3.5 h-3.5 text-emerald-400" />
            <span>Avdrag & Kalender</span>
          </button>

          {/* Print / PDF Button */}
          <button
            type="button"
            onClick={() => window.print()}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 rounded-lg transition-colors font-semibold"
            title="Skriv ut eller spara som PDF"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Skriv ut / PDF</span>
          </button>

          {/* Pro Pill */}
          {isPro ? (
            <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-950/80 border border-emerald-500/40 text-emerald-400 font-semibold text-xs">
              <Check className="w-3.5 h-3.5" />
              <span>Pro Aktiv</span>
            </div>
          ) : (
            <button
              type="button"
              onClick={onOpenProModal}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-gradient-to-r from-amber-500 to-emerald-500 hover:from-amber-400 hover:to-emerald-400 text-slate-950 font-bold shadow-md transition-all active:scale-[0.98]"
            >
              <Sparkles className="w-3.5 h-3.5 fill-current" />
              <span>Uppgradera Pro (149 kr)</span>
            </button>
          )}

        </div>

      </div>
    </header>
  );
};
