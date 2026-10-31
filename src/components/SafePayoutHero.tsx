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
    <div className="bg-white border border-[#E5E2DA] rounded-xl p-6 sm:p-8 shadow-xs relative overflow-hidden">
      
      {/* Top Ledger Header & Safe Payout */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-[#E5E2DA]">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-[#F0FDF4] border border-[#BBF7D0] text-[#14532D] text-xs font-mono font-bold uppercase tracking-wider mb-2.5">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Säkert eget uttag ({periodLabel})</span>
          </div>

          <div className="flex items-baseline gap-2">
            <h1 className="text-4xl sm:text-5xl font-black font-mono tracking-tight text-[#14532D]">
              {formatSEK(payoutAmount)}
            </h1>
          </div>

          <p className="text-[#4B5563] text-xs sm:text-sm mt-2 max-w-xl leading-relaxed">
            Detta belopp kan du föra över till ditt privata bankkonto idag. Skatter, egenavgifter och moms är redan fullt reserverade i kalkylen.
          </p>
        </div>

        {/* Quick Stats Pill */}
        <div className="flex flex-wrap sm:flex-col items-start sm:items-end gap-2.5 shrink-0">
          <div className="px-3.5 py-2 rounded-lg bg-[#F8F7F4] border border-[#E5E2DA] text-right">
            <div className="text-[11px] text-[#4B5563] font-medium">Effektiv skattesats på vinst</div>
            <div className="text-lg font-bold font-mono text-[#14532D]">
              {results.effectiveTaxRate}%
            </div>
          </div>

          {businessType === 'enskild_firma' && results.abSimulation.differenceVsEnskildFirma > 10000 && (
            <button
              type="button"
              onClick={onOpenABModal}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#EFF6FF] border border-[#BFDBFE] text-[#1E3A8A] text-xs font-mono font-bold hover:bg-[#DBEAFE] transition"
            >
              <TrendingUp className="w-3.5 h-3.5 text-[#1D4ED8]" />
              <span>+{formatSEK(results.abSimulation.differenceVsEnskildFirma / (period === 'monthly' ? 12 : 1))} / {period === 'monthly' ? 'mån' : 'år'} med AB</span>
              <ArrowRight className="w-3 h-3 ml-0.5" />
            </button>
          )}
        </div>
      </div>

      {/* The Three Pots Breakdown */}
      <div className="pt-6">
        <div className="text-xs font-mono font-bold text-[#111827] uppercase tracking-wider mb-3 flex items-center justify-between">
          <span className="flex items-center gap-2">
            <span>De tre säkra kontopotterna ({periodLabel})</span>
            <span title="Dela upp dina inkomster i dessa tre potter så slipper du kvarskatt">
              <HelpCircle className="w-3.5 h-3.5 text-[#9CA3AF] cursor-help" />
            </span>
          </span>
          <span className="text-[11px] font-normal text-[#6B7280]">
            Skatteverket Inkomstår 2026
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          
          {/* Pot 1: Personal Wallet */}
          <div className="p-4 rounded-xl bg-[#F0FDF4] border border-[#BBF7D0] relative group hover:border-[#86EFAC] transition">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold font-mono text-[#14532D] flex items-center gap-1.5">
                <Wallet className="w-4 h-4" />
                <span>1. Ditt Privatkonto</span>
              </span>
              <span className="text-[10px] font-mono font-bold text-[#14532D] bg-[#DCFCE7] px-2 py-0.5 rounded">
                Dina pengar
              </span>
            </div>
            <div className="text-2xl font-bold font-mono text-[#14532D] mt-1">
              {formatSEK(results.pots.safePersonalPayout)}
            </div>
            <p className="text-[11px] text-[#166534] mt-2 leading-relaxed">
              Fria pengar att överföra till ditt personliga konto för privat konsumtion, hyra och sparande.
            </p>
          </div>

          {/* Pot 2: Tax Reserve */}
          <div className="p-4 rounded-xl bg-[#EFF6FF] border border-[#BFDBFE] relative group hover:border-[#93C5FD] transition">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold font-mono text-[#1E3A8A] flex items-center gap-1.5">
                <Landmark className="w-4 h-4" />
                <span>2. Skattekonto-reserv</span>
              </span>
              <span className="text-[10px] font-mono font-bold text-[#1E3A8A] bg-[#DBEAFE] px-2 py-0.5 rounded">
                F-skatt & Egenavgifter
              </span>
            </div>
            <div className="text-2xl font-bold font-mono text-[#1E3A8A] mt-1">
              {formatSEK(results.pots.taxReserve)}
            </div>
            <p className="text-[11px] text-[#1E40AF] mt-2 leading-relaxed">
              Låt ligga kvar på företagskontot för egenavgifter och inkomstskatt (dras månadsvis den 12:e).
            </p>
          </div>

          {/* Pot 3: VAT Reserve */}
          <div className="p-4 rounded-xl bg-[#FAF5FF] border border-[#E9D5FF] relative group hover:border-[#D8B4FE] transition">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold font-mono text-[#581C87] flex items-center gap-1.5">
                <Receipt className="w-4 h-4" />
                <span>3. Momskonto-reserv</span>
              </span>
              <span className="text-[10px] font-mono font-bold text-[#581C87] bg-[#F3E8FF] px-2 py-0.5 rounded">
                Momsdeklaration
              </span>
            </div>
            <div className="text-2xl font-bold font-mono text-[#581C87] mt-1">
              {formatSEK(results.pots.vatReserve)}
            </div>
            <p className="text-[11px] text-[#6B21A8] mt-2 leading-relaxed">
              Inbetald nettomoms som tillhör staten och redovisas i din kvartals- eller årsmomsdeklaration.
            </p>
          </div>

        </div>
      </div>

    </div>
  );
};
