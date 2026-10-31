import React, { useState } from 'react';
import { TaxCalculationResult, PeriodType } from '../types';
import {
  formatSEK,
  FORENKLINGSREGELN_OLD_LIMIT,
  K10_GRUNDBELOPP_2026,
  K10_LONAVDRAG_2026,
} from '../utils/taxCalculations';
import { X, Building2, Copy, Check } from 'lucide-react';

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
  const [ownershipPct] = useState<number>(100);
  const [extraPayrollYearly] = useState<number>(0);
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-150 overflow-y-auto print:hidden">
      <div className="relative w-full max-w-3xl bg-white border border-[#D1CDC2] rounded-xl shadow-xl overflow-hidden text-[#111827] my-6 flex flex-col">
        
        {/* Header */}
        <div className="bg-[#F8F7F4] p-6 border-b border-[#E5E2DA] relative shrink-0">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 rounded-lg border border-[#E5E2DA] bg-white hover:bg-[#F8F7F4] text-[#4B5563] hover:text-[#111827] transition"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2 mb-2">
            <span className="px-2.5 py-0.5 rounded bg-[#EFF6FF] border border-[#BFDBFE] text-[#1E3A8A] text-xs font-mono font-bold uppercase tracking-wider">
              3:12 Reformen 2026
            </span>
          </div>

          <h2 className="font-serif text-2xl font-bold tracking-tight text-[#111827]">
            Enskild Firma vs Aktiebolag (AB)
          </h2>
          <p className="text-xs text-[#4B5563] mt-1">
            Realtidsjämförelse baserad på brytpunkt för statlig skatt (615 300 kr) och 20% schablonutdelning.
          </p>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 bg-white">
          
          {/* Comparison Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            {/* Enskild Firma Card */}
            <div className="p-5 rounded-xl border border-[#E5E2DA] bg-[#F8F7F4]/60 space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-bold text-sm text-[#111827]">Enskild Firma</span>
                <span className="text-[11px] font-mono text-[#4B5563]">Nuvarande form</span>
              </div>

              <div>
                <div className="text-[11px] text-[#6B7280]">Netto i plånboken ({period === 'monthly' ? 'per månad' : 'per år'})</div>
                <div className="text-2xl font-black font-mono text-[#111827] mt-0.5">
                  {p(results.safeNetPayoutYearly)}
                </div>
              </div>

              <div className="text-xs text-[#4B5563] space-y-1 pt-2 border-t border-[#E5E2DA]">
                <div className="flex justify-between">
                  <span>Egenavgifter:</span>
                  <span className="font-mono">{p(results.egenavgifter)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Inkomstskatt:</span>
                  <span className="font-mono">{p(results.totalInkomstskatt)}</span>
                </div>
              </div>
            </div>

            {/* Aktiebolag Card */}
            <div className={`p-5 rounded-xl border space-y-3 ${
              isAdvantage
                ? 'border-[#BBF7D0] bg-[#F0FDF4]/70'
                : 'border-[#E5E2DA] bg-[#F8F7F4]/60'
            }`}>
              <div className="flex items-center justify-between">
                <span className="font-bold text-sm text-[#111827]">Aktiebolag (AB)</span>
                {isAdvantage && (
                  <span className="text-[11px] font-mono font-bold text-[#14532D] bg-[#DCFCE7] px-2 py-0.5 rounded">
                    +{p(ab.differenceVsEnskildFirma)} mer netto!
                  </span>
                )}
              </div>

              <div>
                <div className="text-[11px] text-[#14532D]">Netto i plånboken (Lön + 20% Utdelning)</div>
                <div className="text-2xl font-black font-mono text-[#14532D] mt-0.5">
                  {p(ab.netInPocket)}
                </div>
              </div>

              <div className="text-xs text-[#4B5563] space-y-1 pt-2 border-t border-[#E5E2DA]">
                <div className="flex justify-between">
                  <span>Årslön i AB:</span>
                  <span className="font-mono">{formatSEK(ab.salaryYearly)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Årlig utdelning (20% skatt):</span>
                  <span className="font-mono">{formatSEK(ab.dividends)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Bolagsskatt (20.6%):</span>
                  <span className="font-mono">{formatSEK(ab.bolagsskatt)}</span>
                </div>
              </div>
            </div>

          </div>

          {/* 3:12 K10 Gränsbelopp Specs */}
          <div className="p-5 rounded-xl border border-[#BFDBFE] bg-[#EFF6FF]/40 space-y-3">
            <div className="flex items-center justify-between">
              <div className="font-bold text-sm text-[#1E3A8A] flex items-center gap-1.5">
                <Building2 className="w-4 h-4 text-[#1D4ED8]" />
                <span>Nya 3:12-reglerna 2026 (K10 Blankett)</span>
              </div>
              <span className="text-[11px] font-mono font-semibold text-[#1E3A8A]">
                1 IBB 2026 = 80 600 kr
              </span>
            </div>

            <p className="text-xs text-[#4B5563] leading-relaxed">
              Från 2026 höjs schablongränsbeloppet (förenklingsregeln) från 2,75 IBB till <strong>4 IBB ({formatSEK(K10_GRUNDBELOPP_2026)})</strong>. Dessutom får du räkna lönebaserat utrymme för anställda utan spärregler.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-2 text-xs font-mono">
              <div className="p-2.5 rounded-lg bg-white border border-[#E5E2DA]">
                <div className="text-[10px] text-[#6B7280]">Äldre förenklingsregel (2,75 IBB)</div>
                <div className="text-sm font-bold text-[#111827] mt-0.5">{formatSEK(oldForenklingSpace)}</div>
              </div>
              <div className="p-2.5 rounded-lg bg-white border border-[#BFDBFE]">
                <div className="text-[10px] text-[#1E3A8A]">Nya 2026 Grundbelopp (4 IBB)</div>
                <div className="text-sm font-bold text-[#1E3A8A] mt-0.5">{formatSEK(grundbelopp2026Space)}</div>
              </div>
              <div className="p-2.5 rounded-lg bg-white border border-[#BBF7D0]">
                <div className="text-[10px] text-[#14532D]">Inkl. lönebaserat utrymme</div>
                <div className="text-sm font-bold text-[#14532D] mt-0.5">{formatSEK(totalReform2026Space)}</div>
              </div>
            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="p-4 bg-[#F8F7F4] border-t border-[#E5E2DA] flex items-center justify-between text-xs font-mono">
          <button
            type="button"
            onClick={handleCopyK10}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[#E5E2DA] bg-white hover:bg-[#F8F7F4] text-[#111827] font-semibold transition"
          >
            {copiedSummary ? <Check className="w-3.5 h-3.5 text-[#14532D]" /> : <Copy className="w-3.5 h-3.5 text-[#6B7280]" />}
            <span>{copiedSummary ? 'Kopierat!' : 'Kopiera K10-sammanfattning'}</span>
          </button>

          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-[#111827] hover:bg-black text-white font-bold transition"
          >
            Stäng
          </button>
        </div>

      </div>
    </div>
  );
};
