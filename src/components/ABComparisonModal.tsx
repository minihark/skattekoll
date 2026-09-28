import React from 'react';
import { TaxCalculationResult, PeriodType } from '../types';
import { formatSEK } from '../utils/taxCalculations';
import { X, Building2, TrendingUp, ShieldCheck } from 'lucide-react';

interface ABComparisonModalProps {
  isOpen: boolean;
  onClose: () => void;
  results: TaxCalculationResult;
  period: PeriodType;
}

export const ABComparisonModal: React.FC<ABComparisonModalProps> = ({
  isOpen,
  onClose,
  results,
  period,
}) => {
  if (!isOpen) return null;

  const ab = results.abSimulation;
  const isAdvantage = ab.differenceVsEnskildFirma > 0;
  const divisor = period === 'monthly' ? 12 : 1;
  const p = (amt: number) => formatSEK(amt / divisor);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl overflow-hidden text-slate-100">
        
        {/* Banner */}
        <div className="bg-gradient-to-r from-teal-700 via-teal-600 to-emerald-600 p-6 text-white relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 rounded-full bg-black/20 hover:bg-black/40 text-white/80 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/20 text-xs font-semibold uppercase tracking-wider backdrop-blur-md mb-2">
            <Building2 className="w-3.5 h-3.5" />
            <span>Företagsforms-jämförelse</span>
          </div>

          <h2 className="text-2xl font-bold tracking-tight">
            Enskild Firma vs Aktiebolag
          </h2>
          <p className="text-teal-100 text-xs sm:text-sm mt-1 max-w-lg">
            Se hur mycket mer du behåller i plånboken med optimal lön och 3:12-utdelning (20% skatt).
          </p>
        </div>

        <div className="p-6 space-y-6">
          
          {/* Winner comparison banner */}
          <div className="p-4 rounded-xl bg-teal-950/50 border border-teal-500/40 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-teal-500/20 text-teal-400 flex items-center justify-center font-bold">
                <TrendingUp className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xs font-medium text-teal-300">
                  {isAdvantage ? 'Ekonomisk fördel med Aktiebolag' : 'Enskild Firma är förmånligast just nu'}
                </div>
                <div className="text-2xl font-black font-mono text-white">
                  {isAdvantage ? `+${p(ab.differenceVsEnskildFirma)}` : '0 kr extra'}
                  <span className="text-xs font-normal text-slate-400 ml-1">
                    ({period === 'monthly' ? 'per månad' : 'per år'})
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Side-by-side breakdown */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            
            {/* Enskild Firma */}
            <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 space-y-3">
              <div className="font-bold text-slate-200 text-sm border-b border-slate-800 pb-2">
                Enskild Firma
              </div>

              <div className="space-y-1.5 text-slate-400">
                <div className="flex justify-between">
                  <span>Vinst före skatt:</span>
                  <span className="font-mono text-white">{p(results.profitBeforeTaxYearly)}</span>
                </div>
                <div className="flex justify-between text-blue-400">
                  <span>Egenavgifter:</span>
                  <span className="font-mono">-{p(results.egenavgifter)}</span>
                </div>
                <div className="flex justify-between text-red-400">
                  <span>Inkomstskatt:</span>
                  <span className="font-mono">-{p(results.totalInkomstskatt)}</span>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-800 flex justify-between font-bold text-emerald-400 text-sm">
                <span>Netto i handen:</span>
                <span className="font-mono">{p(results.safeNetPayoutYearly)}</span>
              </div>
            </div>

            {/* Aktiebolag */}
            <div className="p-4 rounded-xl bg-slate-950/70 border border-teal-500/40 space-y-3 relative">
              <div className="font-bold text-teal-300 text-sm border-b border-slate-800 pb-2 flex items-center justify-between">
                <span>Aktiebolag (AB)</span>
                <span className="text-[10px] bg-teal-950 border border-teal-500/40 text-teal-300 px-1.5 py-0.5 rounded font-mono">
                  3:12 Optimerad
                </span>
              </div>

              <div className="space-y-1.5 text-slate-400">
                <div className="flex justify-between">
                  <span>Netto lön (upp till brytpunkt):</span>
                  <span className="font-mono text-white">{p(ab.salaryYearly - ab.salaryTaxes)}</span>
                </div>
                <div className="flex justify-between text-purple-400">
                  <span>Utdelning (20% skatt):</span>
                  <span className="font-mono">+{p(ab.dividends - ab.dividendTax)}</span>
                </div>
                <div className="flex justify-between text-slate-500 text-[10px]">
                  <span>(Bolagsskatt 20.6% betald)</span>
                  <span className="font-mono">{p(ab.bolagsskatt)}</span>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-800 flex justify-between font-bold text-teal-300 text-sm">
                <span>Totalt netto i handen:</span>
                <span className="font-mono">{p(ab.netInPocket)}</span>
              </div>
            </div>

          </div>

          {/* Key Takeaway */}
          <div className="p-4 rounded-xl bg-slate-800/40 border border-slate-800 text-xs text-slate-300 space-y-2">
            <div className="font-bold text-white flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>När är det dags att byta till AB?</span>
            </div>
            <ul className="space-y-1 text-slate-400 text-[11px] list-disc list-inside">
              <li>När din vinst överstiger <strong>~55 000 – 65 000 kr/månad</strong> börjar Aktiebolag ge en tydlig skattefördel via 3:12-utdelning.</li>
              <li>AB ger begränsat personligt ekonomiskt ansvar (ingen personlig konkursrisk vid affärsrisker).</li>
              <li>Kräver 25 000 kr i aktiekapital vid start och lite mer formell årsredovisning.</li>
            </ul>
          </div>

        </div>

      </div>
    </div>
  );
};
