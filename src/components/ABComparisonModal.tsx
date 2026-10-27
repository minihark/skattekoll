import React, { useState } from 'react';
import { TaxCalculationResult, PeriodType } from '../types';
import {
  formatSEK,
  FORENKLINGSREGELN_OLD_LIMIT,
  K10_GRUNDBELOPP_2026,
  K10_LONAVDRAG_2026,
} from '../utils/taxCalculations';
import { X, Building2, TrendingUp, ShieldCheck, Printer, Copy, Check, Sparkles } from 'lucide-react';

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
  const [ownershipPct, setOwnershipPct] = useState<number>(100);
  const [extraPayrollYearly, setExtraPayrollYearly] = useState<number>(0);
  const [copiedSummary, setCopiedSummary] = useState<boolean>(false);

  if (!isOpen) return null;

  const ab = results.abSimulation;
  const isAdvantage = ab.differenceVsEnskildFirma > 0;
  const divisor = period === 'monthly' ? 12 : 1;
  const p = (amt: number) => formatSEK(amt / divisor);

  const share = Math.max(1, Math.min(100, ownershipPct)) / 100;
  const totalCompanyPayroll = ab.salaryYearly + extraPayrollYearly;

  // 1. Old Förenklingsregeln (2.75 IBB)
  const oldForenklingSpace = Math.round(FORENKLINGSREGELN_OLD_LIMIT * share);
  // 2. 2026 Grundbelopp (4 IBB = 322 400 kr)
  const grundbelopp2026Space = Math.round(K10_GRUNDBELOPP_2026 * share);
  // 3. 2026 Reform with Lönebaserat utrymme (4 IBB + 50% of owner's share of payroll above 8 IBB)
  const lonebaseratTillägg2026 = Math.max(
    0,
    Math.round(0.5 * (totalCompanyPayroll * share - K10_LONAVDRAG_2026 * share))
  );
  const totalReform2026Space = grundbelopp2026Space + lonebaseratTillägg2026;
  // 4. Classic Huvudregel (50% of payroll when salary requirement met)
  const classicHuvudregelSpace = Math.round(0.5 * totalCompanyPayroll * share);

  const handleCopyK10 = async () => {
    const summary = [
      `SKATTEKOLL 2026 — K10 & FÖRETAGSFORMSJÄMFÖRELSE`,
      `Vinst före skatt (Helår): ${formatSEK(results.profitBeforeTaxYearly)}`,
      `Enskild Firma Netto i handen: ${formatSEK(results.safeNetPayoutYearly)}/år (${formatSEK(results.safeNetPayoutMonthly)}/mån)`,
      `Aktiebolag (Lön + 20% Utdelning) Netto: ${formatSEK(ab.netInPocket)}/år`,
      `Skillnad AB vs EF: ${ab.differenceVsEnskildFirma >= 0 ? '+' : ''}${formatSEK(ab.differenceVsEnskildFirma)}/år`,
      ``,
      `3:12 K10 GRÄNSBELOPP (Ägarandel ${ownershipPct}%, Löneunderlag ${formatSEK(totalCompanyPayroll)}):`,
      `• Äldre Förenklingsregel (2,75 IBB): ${formatSEK(oldForenklingSpace)} (Netto efter 20% skatt: ${formatSEK(oldForenklingSpace * 0.8)})`,
      `• Nya 2026 Grundbelopp (4 IBB): ${formatSEK(grundbelopp2026Space)} (Netto efter 20% skatt: ${formatSEK(grundbelopp2026Space * 0.8)})`,
      `• 2026 Grundbelopp + Lönebaserat utrymme: ${formatSEK(totalReform2026Space)} (Netto efter 20% skatt: ${formatSEK(totalReform2026Space * 0.8)})`,
    ].join('\n');
    try {
      await navigator.clipboard.writeText(summary);
      setCopiedSummary(true);
      setTimeout(() => setCopiedSummary(false), 2200);
    } catch {}
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200 overflow-y-auto print:hidden">
      <div className="relative w-full max-w-3xl bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl overflow-hidden text-slate-100 my-6">
        
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
            <span>Företagsforms- & 3:12 K10-Studio (2026)</span>
          </div>

          <h2 className="text-2xl font-bold tracking-tight">
            Enskild Firma vs Aktiebolag + Nya 3:12-reglerna
          </h2>
          <p className="text-teal-100 text-xs sm:text-sm mt-1 max-w-2xl">
            Jämför netto i handen samt ditt lågbeskattade K10-utdelningsutrymme (20% skatt) enligt 2026 års 3:12-reform (Grundbelopp 4 IBB = 322 400 kr).
          </p>
        </div>

        <div className="p-6 space-y-6 max-h-[80vh] overflow-y-auto">
          
          {/* Winner comparison banner */}
          <div className="p-4 rounded-xl bg-teal-950/50 border border-teal-500/40 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-teal-500/20 text-teal-400 flex items-center justify-center font-bold">
                <TrendingUp className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xs font-medium text-teal-300">
                  {isAdvantage ? 'Ekonomisk fördel med Aktiebolag (inkl. 2026 K10)' : 'Enskild Firma är förmånligast vid nuvarande vinstnivå'}
                </div>
                <div className="text-2xl font-black font-mono text-white">
                  {isAdvantage ? `+${p(ab.differenceVsEnskildFirma)}` : '0 kr extra'}
                  <span className="text-xs font-normal text-slate-400 ml-1">
                    ({period === 'monthly' ? 'per månad' : 'per år'})
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleCopyK10}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-teal-500/40 text-teal-200 text-xs font-semibold transition"
              >
                {copiedSummary ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedSummary ? 'Kopierat!' : 'Kopiera K10'}</span>
              </button>
              <button
                type="button"
                onClick={() => window.print()}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-teal-500 hover:bg-teal-400 text-slate-950 text-xs font-bold transition"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Revisors-PDF</span>
              </button>
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
                  3:12 (4 IBB)
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
                {ab.retainedEarningsYearly > 0 && (
                  <div className="flex justify-between text-amber-300/90 text-[11px]">
                    <span>Kvar i bolaget (balanserad vinst):</span>
                    <span className="font-mono">{p(ab.retainedEarningsYearly)}</span>
                  </div>
                )}
              </div>

              <div className="pt-2 border-t border-slate-800 flex justify-between font-bold text-teal-300 text-sm">
                <span>Totalt netto i handen:</span>
                <span className="font-mono">{p(ab.netInPocket)}</span>
              </div>
            </div>

          </div>

          {/* 2026 3:12 K10 Scenario Comparator */}
          <div className="p-4 rounded-xl bg-slate-950/90 border border-emerald-500/30 space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-emerald-400" />
                <h3 className="text-sm font-bold text-white">
                  3:12 K10-Jämförare: Förenklingsregel vs 2026 Grundbelopp (4 IBB) & Löneunderlag
                </h3>
              </div>
              <span className="text-[11px] font-mono text-emerald-300 bg-emerald-950/80 border border-emerald-500/30 px-2 py-0.5 rounded">
                IBB 2026: 80 600 kr
              </span>
            </div>

            {/* Interactive Controls for Ownership % and Extra Payroll */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs bg-slate-900/80 p-3 rounded-xl border border-slate-800">
              <div className="space-y-1.5">
                <div className="flex justify-between text-slate-300 font-medium">
                  <span>Din ägarandel i bolaget:</span>
                  <span className="font-mono font-bold text-emerald-400">{ownershipPct}%</span>
                </div>
                <div className="flex gap-1.5">
                  {[25, 50, 100].map((pct) => (
                    <button
                      key={pct}
                      type="button"
                      onClick={() => setOwnershipPct(pct)}
                      className={`flex-1 py-1 rounded font-mono text-xs font-bold transition ${
                        ownershipPct === pct
                          ? 'bg-emerald-500 text-slate-950'
                          : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
                      }`}
                    >
                      {pct}%
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-1.5">
                <div className="flex justify-between text-slate-300 font-medium">
                  <span>Övriga löner i AB (anställda/helår):</span>
                  <span className="font-mono font-bold text-teal-300">{formatSEK(extraPayrollYearly)}</span>
                </div>
                <div className="flex gap-1.5">
                  {[0, 600000, 1200000, 2400000].map((sal) => (
                    <button
                      key={sal}
                      type="button"
                      onClick={() => setExtraPayrollYearly(sal)}
                      className={`flex-1 py-1 rounded font-mono text-[11px] font-bold transition ${
                        extraPayrollYearly === sal
                          ? 'bg-teal-400 text-slate-950'
                          : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
                      }`}
                    >
                      {sal === 0 ? '0 kr' : `${sal / 1000}k`}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* 3-Column Rule Comparison Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div className="p-3 rounded-xl bg-slate-900/70 border border-slate-800 space-y-1.5">
                <div className="text-[11px] font-semibold text-slate-400">
                  Äldre Förenklingsregel (2,75 IBB)
                </div>
                <div className="text-lg font-black font-mono text-slate-200">
                  {formatSEK(oldForenklingSpace)}
                </div>
                <div className="text-[11px] text-slate-400">
                  Netto efter 20% skatt:{' '}
                  <strong className="text-white font-mono">{formatSEK(oldForenklingSpace * 0.8)}</strong>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-emerald-950/30 border border-emerald-500/40 space-y-1.5">
                <div className="text-[11px] font-bold text-emerald-300 flex items-center justify-between">
                  <span>Nya Grundbelopp (4 IBB)</span>
                  <span className="text-[10px] px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-300">
                    +{formatSEK(grundbelopp2026Space - oldForenklingSpace)}
                  </span>
                </div>
                <div className="text-lg font-black font-mono text-emerald-300">
                  {formatSEK(grundbelopp2026Space)}
                </div>
                <div className="text-[11px] text-slate-300">
                  Netto efter 20% skatt:{' '}
                  <strong className="text-emerald-300 font-mono">{formatSEK(grundbelopp2026Space * 0.8)}</strong>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-teal-950/30 border border-teal-500/40 space-y-1.5">
                <div className="text-[11px] font-bold text-teal-300">
                  2026 Grund + Lönebaserat (50% &gt; 8 IBB)
                </div>
                <div className="text-lg font-black font-mono text-teal-200">
                  {formatSEK(totalReform2026Space)}
                </div>
                <div className="text-[11px] text-slate-300">
                  Netto efter 20% skatt:{' '}
                  <strong className="text-teal-300 font-mono">{formatSEK(totalReform2026Space * 0.8)}</strong>
                  <div className="text-[10px] text-slate-500 mt-0.5">
                    (Klassisk 50% löneregel: {formatSEK(classicHuvudregelSpace)})
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Key Takeaway */}
          <div className="p-4 rounded-xl bg-slate-800/40 border border-slate-800 text-xs text-slate-300 space-y-2">
            <div className="font-bold text-white flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Sammanfattning av 2026 års 3:12-reform (K10)</span>
            </div>
            <ul className="space-y-1 text-slate-400 text-[11px] list-disc list-inside">
              <li><strong>Grundbeloppet höjs till 4 IBB (322 400 kr/år)</strong> från tidigare 2,75 IBB (209 550 kr) — helt utan löneuttagskrav.</li>
              <li><strong>Slopat löneuttagskrav för lönebaserat utrymme:</strong> Alla delägare får räkna 50% av sin andel av bolagets löner över 8 IBB (644 800 kr) ovanpå grundbeloppet.</li>
              <li>När din vinst överstiger <strong>~55 000 – 65 000 kr/månad</strong> ger Aktiebolag en tydlig skattefördel via 20% utdelningsskatt.</li>
            </ul>
          </div>

        </div>

      </div>
    </div>
  );
};
