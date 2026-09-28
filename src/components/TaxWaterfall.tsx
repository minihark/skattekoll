import React from 'react';
import { TaxCalculationResult, PeriodType } from '../types';
import { formatSEK } from '../utils/taxCalculations';
import { Layers, ArrowDown, ArrowUp, CheckCircle2 } from 'lucide-react';

interface TaxWaterfallProps {
  results: TaxCalculationResult;
  period: PeriodType;
}

export const TaxWaterfall: React.FC<TaxWaterfallProps> = ({ results, period }) => {
  const divisor = period === 'monthly' ? 12 : 1;
  const p = (amt: number) => formatSEK(amt / divisor);

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
      <div className="flex items-center justify-between pb-3 border-b border-slate-800">
        <div className="flex items-center gap-2 text-sm font-bold text-white">
          <Layers className="w-4 h-4 text-emerald-400" />
          <span>Skatte-kaskaden: Vart tar varje krona vägen?</span>
        </div>
        <span className="text-[11px] text-slate-400 font-mono">
          {period === 'monthly' ? 'Månadsvärden' : 'Årsvärden'}
        </span>
      </div>

      <div className="space-y-2 text-xs">
        
        {/* 1. Invoiced Revenue */}
        <div className="flex justify-between items-center p-2.5 rounded-lg bg-slate-950/80 border border-slate-800/80">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
            <span className="font-semibold text-slate-200">Fakturerad intäkt (exkl. moms)</span>
          </div>
          <span className="font-mono font-bold text-emerald-400">
            {p(results.revenueYearly)}
          </span>
        </div>

        {/* 2. Expenses */}
        {results.expensesYearly > 0 && (
          <div className="flex justify-between items-center p-2 rounded-lg bg-slate-950/40 text-slate-400 pl-6">
            <div className="flex items-center gap-1.5">
              <ArrowDown className="w-3 h-3 text-slate-500" />
              <span>Avdragsgilla kostnader i firman</span>
            </div>
            <span className="font-mono text-slate-300">
              -{p(results.expensesYearly)}
            </span>
          </div>
        )}

        {/* 3. Profit */}
        <div className="flex justify-between items-center p-2.5 rounded-lg bg-slate-800/50 border border-slate-700/60 font-semibold">
          <span className="text-slate-200">= Resultat före skatt & avgifter</span>
          <span className="font-mono text-white">
            {p(results.profitBeforeTaxYearly)}
          </span>
        </div>

        {/* 4. Egenavgifter Breakdown */}
        <div className="pl-4 space-y-1.5 border-l-2 border-slate-800 my-2 text-[11px]">
          <div className="flex justify-between items-center text-slate-400">
            <div className="flex items-center gap-1.5">
              <ArrowDown className="w-3 h-3 text-blue-400" />
              <span>Egenavgifter (28.97% med nedsättning)</span>
            </div>
            <span className="font-mono text-blue-400 font-medium">
              -{p(results.egenavgifter)}
            </span>
          </div>

          <div className="flex justify-between items-center text-slate-500 text-[10px]">
            <span>(Underlag efter 25% schablonavdrag)</span>
            <span className="font-mono">{p(results.egenavgifterBase)}</span>
          </div>
        </div>

        {/* 5. Taxable Earned Income */}
        <div className="flex justify-between items-center p-2 rounded-lg bg-slate-950/60 text-slate-300">
          <span>= Skattepliktig förvärvsinkomst</span>
          <span className="font-mono">{p(results.taxableIncome)}</span>
        </div>

        {/* 6. Income Tax Breakdown */}
        <div className="pl-4 space-y-1.5 border-l-2 border-slate-800 my-2 text-[11px]">
          <div className="flex justify-between items-center text-slate-400">
            <span>Skattefritt grundavdrag</span>
            <span className="font-mono text-emerald-400">-{p(results.grundavdrag)}</span>
          </div>

          <div className="flex justify-between items-center text-slate-400">
            <div className="flex items-center gap-1.5">
              <ArrowDown className="w-3 h-3 text-red-400" />
              <span>Kommunalskatt</span>
            </div>
            <span className="font-mono text-red-400">-{p(results.kommunalskatt)}</span>
          </div>

          {results.statligSkatt > 0 && (
            <div className="flex justify-between items-center text-slate-400">
              <div className="flex items-center gap-1.5">
                <ArrowDown className="w-3 h-3 text-amber-400" />
                <span>Statlig inkomstskatt (20% över 615 300 kr)</span>
              </div>
              <span className="font-mono text-amber-400">-{p(results.statligSkatt)}</span>
            </div>
          )}

          <div className="flex justify-between items-center text-slate-400">
            <div className="flex items-center gap-1.5">
              <ArrowUp className="w-3 h-3 text-emerald-400" />
              <span className="text-emerald-400 font-medium">Jobbskatteavdrag (Skattereduktion)</span>
            </div>
            <span className="font-mono text-emerald-400 font-medium">+{p(results.jobbskatteavdrag)}</span>
          </div>

          <div className="flex justify-between items-center text-slate-300 pt-1 border-t border-slate-800/80 font-medium">
            <span>Total inkomstskatt</span>
            <span className="font-mono text-red-400">-{p(results.totalInkomstskatt)}</span>
          </div>
        </div>

        {/* Final Hero Result */}
        <div className="flex justify-between items-center p-3.5 rounded-xl bg-gradient-to-r from-emerald-950/80 to-teal-950/80 border border-emerald-500/50 mt-3 shadow-lg">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-400" />
            <div>
              <div className="text-xs font-bold text-white uppercase tracking-tight">
                Netto i plånboken (Säkert eget uttag)
              </div>
              <div className="text-[10px] text-emerald-300/80">
                100% skattat och klart
              </div>
            </div>
          </div>
          <span className="text-xl font-black font-mono text-emerald-300">
            {p(results.safeNetPayoutYearly)}
          </span>
        </div>

      </div>
    </div>
  );
};
