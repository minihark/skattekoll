import React from 'react';
import { TaxCalculationResult, PeriodType } from '../types';
import { formatSEK } from '../utils/taxCalculations';
import { ArrowDown, ArrowUp, CheckCircle2 } from 'lucide-react';

interface TaxWaterfallProps {
  results: TaxCalculationResult;
  period: PeriodType;
}

export const TaxWaterfall: React.FC<TaxWaterfallProps> = ({ results, period }) => {
  const divisor = period === 'monthly' ? 12 : 1;
  const p = (amt: number) => formatSEK(amt / divisor);
  const totalTaxBurden = results.egenavgifter + results.totalInkomstskatt;

  return (
    <div className="bg-white border border-[#E5E2DA] rounded-xl p-6 sm:p-7 shadow-xs space-y-4">
      
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-[#E5E2DA]">
        <div>
          <h3 className="font-serif text-lg font-bold text-[#111827]">
            Specifikation: Skattekaskaden
          </h3>
          <p className="text-xs text-[#4B5563]">
            Exakt hur varje fakturerad krona fördelas enligt Skatteverkets 2026-regler.
          </p>
        </div>
        <span className="text-[11px] font-mono font-semibold px-2 py-0.5 rounded bg-[#F8F7F4] border border-[#E5E2DA] text-[#4B5563]">
          {period === 'monthly' ? 'Månadsvärden' : 'Årsvärden'}
        </span>
      </div>

      <div className="space-y-2 text-xs">
        
        {/* 1. Invoiced Revenue */}
        <div className="flex justify-between items-center p-2.5 rounded-lg bg-[#F8F7F4] border border-[#E5E2DA]">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#14532D]" />
            <span className="font-bold text-[#111827]">1. Fakturerad intäkt (exkl. moms)</span>
          </div>
          <span className="font-mono font-bold text-sm text-[#14532D]">
            {p(results.revenueYearly)}
          </span>
        </div>

        {/* 2. Expenses */}
        {results.expensesYearly > 0 && (
          <div className="flex justify-between items-center p-2 rounded-lg bg-[#F8F7F4]/60 text-[#4B5563] pl-6 border border-dashed border-[#E5E2DA]">
            <div className="flex items-center gap-1.5">
              <ArrowDown className="w-3.5 h-3.5 text-[#DC2626]" />
              <span>Avdragsgilla kostnader i verksamheten</span>
            </div>
            <span className="font-mono font-semibold text-[#DC2626]">
              -{p(results.expensesYearly)}
            </span>
          </div>
        )}

        {/* 3. Profit */}
        <div className="flex justify-between items-center p-2.5 rounded-lg bg-[#F8F7F4] border border-[#D1CDC2] font-bold">
          <span className="text-[#111827]">= Resultat före skatt & egenavgifter</span>
          <span className="font-mono text-[#111827]">
            {p(results.profitBeforeTaxYearly)}
          </span>
        </div>

        {/* 4. Egenavgifter Breakdown */}
        <div className="pl-4 space-y-1.5 border-l-2 border-[#BFDBFE] my-2 text-[11px]">
          <div className="flex justify-between items-center text-[#1E3A8A]">
            <div className="flex items-center gap-1.5">
              <ArrowDown className="w-3 h-3 text-[#1D4ED8]" />
              <span className="font-semibold">Egenavgifter (28.97% med reg. nedsättning)</span>
            </div>
            <span className="font-mono font-bold text-[#1E3A8A]">
              -{p(results.egenavgifter)}
            </span>
          </div>

          <div className="flex justify-between items-center text-[#6B7280] text-[10px] font-mono">
            <span>Underlag efter 25% schablonavdrag:</span>
            <span>{p(results.egenavgifterBase)}</span>
          </div>
        </div>

        {/* 5. Taxable Earned Income */}
        <div className="flex justify-between items-center p-2 rounded-lg bg-[#F8F7F4] text-[#111827] border border-[#E5E2DA]">
          <span className="font-semibold">= Skattepliktig förvärvsinkomst</span>
          <span className="font-mono font-bold">{p(results.taxableIncome)}</span>
        </div>

        {/* 6. Income Tax Breakdown */}
        <div className="pl-4 space-y-1.5 border-l-2 border-[#E5E2DA] my-2 text-[11px]">
          <div className="flex justify-between items-center text-[#4B5563]">
            <span>Skattefritt grundavdrag</span>
            <span className="font-mono font-semibold text-[#14532D]">-{p(results.grundavdrag)}</span>
          </div>

          <div className="flex justify-between items-center text-[#4B5563]">
            <div className="flex items-center gap-1.5">
              <ArrowDown className="w-3 h-3 text-[#DC2626]" />
              <span>Kommunalskatt ({results.taxableIncome > results.grundavdrag ? 'aktiv' : '0 kr'})</span>
            </div>
            <span className="font-mono font-semibold text-[#DC2626]">-{p(results.kommunalskatt)}</span>
          </div>

          {results.statligSkatt > 0 && (
            <div className="flex justify-between items-center text-[#DC2626]">
              <div className="flex items-center gap-1.5">
                <ArrowDown className="w-3 h-3 text-[#DC2626]" />
                <span className="font-bold">Statlig inkomstskatt (20% över 615 300 kr)</span>
              </div>
              <span className="font-mono font-bold">-{p(results.statligSkatt)}</span>
            </div>
          )}

          <div className="flex justify-between items-center text-[#14532D]">
            <div className="flex items-center gap-1.5">
              <ArrowUp className="w-3 h-3 text-[#14532D]" />
              <span className="font-semibold">Jobbskatteavdrag 2026 (skattereduktion)</span>
            </div>
            <span className="font-mono font-bold">+{p(results.jobbskatteavdrag)}</span>
          </div>

          <div className="flex justify-between items-center text-[#111827] pt-1 border-t border-[#E5E2DA] font-semibold">
            <span>= Slutlig inkomstskatt</span>
            <span className="font-mono font-bold">-{p(results.totalInkomstskatt)}</span>
          </div>
        </div>

        {/* 7. Total Tax & Safe Payout */}
        <div className="p-3 rounded-lg bg-[#F8F7F4] border border-[#D1CDC2] space-y-2 mt-3">
          <div className="flex justify-between items-center text-xs text-[#4B5563]">
            <span>Total skattebörda (Egenavgifter + Skatt)</span>
            <span className="font-mono font-bold text-[#DC2626]">
              -{p(totalTaxBurden)}
            </span>
          </div>

          <div className="flex justify-between items-center pt-2 border-t border-[#E5E2DA] text-sm font-bold">
            <span className="flex items-center gap-1.5 text-[#14532D]">
              <CheckCircle2 className="w-4 h-4 text-[#14532D]" />
              <span>Säkert Netto i plånboken</span>
            </span>
            <span className="font-mono text-base font-black text-[#14532D]">
              {p(results.safeNetPayoutYearly)}
            </span>
          </div>
        </div>

      </div>
    </div>
  );
};
