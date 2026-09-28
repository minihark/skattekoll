import React from 'react';
import { TaxCalculationResult, PeriodType, BusinessType } from '../types';
import { formatSEK } from '../utils/taxCalculations';
import { Wallet, Landmark, Receipt, ArrowRight, ShieldCheck, TrendingUp, HelpCircle } from 'lucide-react';

interface SafePayoutHeroProps {
  results: TaxCalculationResult;
  period: PeriodType;
  businessType: BusinessType;
  onOpenABModal?: () => void;
}

export const SafePayoutHero: React.FC<SafePayoutHeroProps> = ({
  results,
  period,
  businessType,
  onOpenABModal,
}) => {
  const periodLabel = period === 'monthly' ? 'per månad' : 'per år';
  const payoutAmount = period === 'monthly' ? results.pots.safePersonalPayout : results.safeNetPayoutYearly;

  return (
    <div className="bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
      
      {/* Background glow accent */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-teal-500/5 rounded-full blur-3xl pointer-events-none" />

      {/* Hero Header & Safe Payout */}
      <div className="relative z-10 flex flex-col md:flex-row md:items-end justify-between gap-6 pb-8 border-b border-slate-800/80">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-950/80 border border-emerald-500/30 text-emerald-400 text-xs font-semibold uppercase tracking-wider mb-3">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Säkert eget uttag ({periodLabel})</span>
          </div>
          <div className="flex items-baseline gap-2">
            <h1 className="text-4xl sm:text-5xl font-black font-mono tracking-tight text-white">
              {formatSEK(payoutAmount)}
            </h1>
          </div>
          <p className="text-slate-400 text-xs sm:text-sm mt-2 max-w-lg leading-relaxed">
            Detta belopp kan du föra över till ditt privata bankkonto idag. Skatter, egenavgifter och moms är redan fullt reserverade.
          </p>
        </div>

        {/* Quick Stats Pill */}
        <div className="flex flex-wrap sm:flex-col items-start sm:items-end gap-3 shrink-0">
          <div className="px-3.5 py-2 rounded-xl bg-slate-800/70 border border-slate-700/60 text-right">
            <div className="text-[11px] text-slate-400 font-medium">Effektiv skattesats på vinst</div>
            <div className="text-lg font-bold font-mono text-emerald-400">
              {results.effectiveTaxRate}%
            </div>
          </div>

          {businessType === 'enskild_firma' && results.abSimulation.differenceVsEnskildFirma > 10000 && (
            <button
              type="button"
              onClick={onOpenABModal}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-teal-950/70 border border-teal-500/40 text-teal-300 text-xs font-medium hover:bg-teal-900/60 transition-colors"
            >
              <TrendingUp className="w-3.5 h-3.5 text-teal-400" />
              <span>+{formatSEK(results.abSimulation.differenceVsEnskildFirma / (period === 'monthly' ? 12 : 1))} / {period === 'monthly' ? 'mån' : 'år'} med AB</span>
              <ArrowRight className="w-3 h-3 ml-0.5" />
            </button>
          )}
        </div>
      </div>

      {/* The Three Pots Breakdown */}
      <div className="relative z-10 pt-6">
        <div className="text-xs font-semibold text-slate-300 uppercase tracking-wider mb-4 flex items-center gap-2">
          <span>De tre säkra kontopotterna ({periodLabel})</span>
          <span title="Dela upp dina inkomster i dessa tre potter så slipper du kvarskatt">
            <HelpCircle className="w-3.5 h-3.5 text-slate-500 cursor-help" />
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          
          {/* Pot 1: Personal Wallet */}
          <div className="p-4 rounded-xl bg-slate-950/80 border border-emerald-500/30 relative group hover:border-emerald-500/60 transition-colors">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-emerald-400 flex items-center gap-1.5">
                <Wallet className="w-4 h-4" />
                <span>1. Ditt Privatkonto</span>
              </span>
              <span className="text-[10px] font-mono text-emerald-300/80 bg-emerald-950/70 px-2 py-0.5 rounded">
                Dina pengar
              </span>
            </div>
            <div className="text-2xl font-bold font-mono text-white mt-1">
              {formatSEK(results.pots.safePersonalPayout)}
            </div>
            <p className="text-[11px] text-slate-400 mt-2 leading-relaxed">
              Fria pengar att överföra till ditt personliga lönekonto för privat konsumtion och sparande.
            </p>
          </div>

          {/* Pot 2: Tax Reserve */}
          <div className="p-4 rounded-xl bg-slate-950/80 border border-blue-500/30 relative group hover:border-blue-500/60 transition-colors">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-blue-400 flex items-center gap-1.5">
                <Landmark className="w-4 h-4" />
                <span>2. Skattekonto-reserv</span>
              </span>
              <span className="text-[10px] font-mono text-blue-300/80 bg-blue-950/70 px-2 py-0.5 rounded">
                F-skatt
              </span>
            </div>
            <div className="text-2xl font-bold font-mono text-white mt-1">
              {formatSEK(results.pots.taxReserve)}
            </div>
            <p className="text-[11px] text-slate-400 mt-2 leading-relaxed">
              Låt ligga kvar på företagskontot för egenavgifter och inkomstskatt (dras månadsvis den 12:e).
            </p>
          </div>

          {/* Pot 3: VAT Reserve */}
          <div className="p-4 rounded-xl bg-slate-950/80 border border-purple-500/30 relative group hover:border-purple-500/60 transition-colors">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-purple-400 flex items-center gap-1.5">
                <Receipt className="w-4 h-4" />
                <span>3. Momskonto-reserv</span>
              </span>
              <span className="text-[10px] font-mono text-purple-300/80 bg-purple-950/70 px-2 py-0.5 rounded">
                Moms
              </span>
            </div>
            <div className="text-2xl font-bold font-mono text-white mt-1">
              {formatSEK(results.pots.vatReserve)}
            </div>
            <p className="text-[11px] text-slate-400 mt-2 leading-relaxed">
              Inbetald nettomoms som tillhör staten och betalas vid din kvartals- eller årsmomsdeklaration.
            </p>
          </div>

        </div>
      </div>

    </div>
  );
};
