import React from 'react';
import { TaxSettings, PeriodType, BusinessType } from '../types';
import { Calculator, Printer, Sparkles, BookOpen, Building2, User, ShieldCheck, FileText } from 'lucide-react';

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
    <header className="sticky top-0 z-40 bg-[#F8F7F4]/90 backdrop-blur-md border-b border-[#E5E2DA] px-4 py-3 print:hidden">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3">
        
        {/* Brand & Identity */}
        <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-start">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-[#14532D] text-white flex items-center justify-center shadow-xs">
              <Calculator className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-serif text-xl font-bold tracking-tight text-[#111827]">
                  SkatteKoll
                </span>
                <span className="font-mono text-[10px] font-semibold tracking-wider uppercase px-2 py-0.5 rounded bg-[#F0FDF4] text-[#14532D] border border-[#BBF7D0]">
                  2026 Regler
                </span>
              </div>
              <p className="text-[11px] text-[#4B5563] hidden sm:block">
                Nordisk kalkyl för säkert eget uttag och skattekonto-reserv
              </p>
            </div>
          </div>

          {/* Period Toggle on mobile */}
          <div className="flex md:hidden bg-[#E5E2DA]/60 p-1 rounded-lg border border-[#D1CDC2] text-xs font-mono">
            <button
              type="button"
              onClick={() => setPeriod('monthly')}
              className={`px-2.5 py-1 rounded font-bold transition ${
                settings.period === 'monthly'
                  ? 'bg-white text-[#111827] shadow-xs'
                  : 'text-[#4B5563]'
              }`}
            >
              Månad
            </button>
            <button
              type="button"
              onClick={() => setPeriod('yearly')}
              className={`px-2.5 py-1 rounded font-bold transition ${
                settings.period === 'yearly'
                  ? 'bg-white text-[#111827] shadow-xs'
                  : 'text-[#4B5563]'
              }`}
            >
              Helår
            </button>
          </div>
        </div>

        {/* Center / Period Switch for Desktop */}
        <div className="hidden md:flex items-center gap-2">
          <div className="flex bg-[#E5E2DA]/60 p-1 rounded-lg border border-[#D1CDC2] text-xs font-mono">
            <button
              type="button"
              onClick={() => setPeriod('monthly')}
              className={`px-3 py-1 rounded font-bold transition ${
                settings.period === 'monthly'
                  ? 'bg-white text-[#111827] shadow-xs'
                  : 'text-[#4B5563] hover:text-[#111827]'
              }`}
            >
              Månadsvis
            </button>
            <button
              type="button"
              onClick={() => setPeriod('yearly')}
              className={`px-3 py-1 rounded font-bold transition ${
                settings.period === 'yearly'
                  ? 'bg-white text-[#111827] shadow-xs'
                  : 'text-[#4B5563] hover:text-[#111827]'
              }`}
            >
              Helår (365 dagar)
            </button>
          </div>

          {/* Business Type selector */}
          <div className="flex bg-[#E5E2DA]/60 p-1 rounded-lg border border-[#D1CDC2] text-xs font-mono">
            <button
              type="button"
              onClick={() => setBusinessType('enskild_firma')}
              className={`flex items-center gap-1.5 px-3 py-1 rounded font-bold transition ${
                settings.businessType === 'enskild_firma'
                  ? 'bg-white text-[#111827] shadow-xs'
                  : 'text-[#4B5563] hover:text-[#111827]'
              }`}
            >
              <User className="w-3.5 h-3.5" />
              <span>Enskild firma</span>
            </button>
            <button
              type="button"
              onClick={() => setBusinessType('aktiebolag')}
              className={`flex items-center gap-1.5 px-3 py-1 rounded font-bold transition ${
                settings.businessType === 'aktiebolag'
                  ? 'bg-white text-[#111827] shadow-xs'
                  : 'text-[#4B5563] hover:text-[#111827]'
              }`}
            >
              <Building2 className="w-3.5 h-3.5" />
              <span>Aktiebolag (AB)</span>
            </button>
          </div>
        </div>

        {/* Right Tools & Drawers */}
        <div className="flex items-center gap-2 w-full md:w-auto justify-end text-xs font-mono">
          <button
            type="button"
            onClick={onOpenDeductionModal}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-[#E5E2DA] bg-white hover:bg-[#F8F7F4] text-[#111827] transition shadow-2xs"
            title="Skatteverkets schabloner för hemmakontor, milersättning, representation"
          >
            <BookOpen className="w-3.5 h-3.5 text-[#14532D]" />
            <span>Avdragsguide</span>
          </button>

          <button
            type="button"
            onClick={onOpenABModal}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-[#BFDBFE] bg-[#EFF6FF] hover:bg-[#DBEAFE] text-[#1E3A8A] font-bold transition shadow-2xs"
            title="Jämför enskild firma mot AB med nya 3:12-reglerna 2026"
          >
            <Building2 className="w-3.5 h-3.5 text-[#1D4ED8]" />
            <span>3:12 AB-kalkyl</span>
          </button>

          <a
            href="https://fakturacraft.apps.harkco.se"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden lg:flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-[#E5E2DA] bg-white hover:bg-[#F8F7F4] text-[#4B5563] hover:text-[#111827] transition shadow-2xs"
            title="Skapa fakturor med Swish QR & SIE4 i FakturaCraft"
          >
            <FileText className="w-3.5 h-3.5 text-[#1E3A8A]" />
            <span>FakturaCraft ↗</span>
          </a>

          <button
            type="button"
            onClick={() => window.print()}
            className="p-1.5 rounded-lg border border-[#E5E2DA] bg-white hover:bg-[#F8F7F4] text-[#4B5563] hover:text-[#111827] transition shadow-2xs"
            title="Skriv ut officiell skattespecifikation eller spara som PDF"
          >
            <Printer className="w-4 h-4" />
          </button>

          {isPro ? (
            <span className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[#F0FDF4] border border-[#BBF7D0] text-[#14532D] font-bold text-[11px]">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Pro</span>
            </span>
          ) : (
            <button
              type="button"
              onClick={onOpenProModal}
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-[#111827] hover:bg-black text-white font-bold text-[11px] transition shadow-xs"
            >
              <Sparkles className="w-3 h-3 text-[#FBBF24]" />
              <span>Lås upp Pro</span>
            </button>
          )}
        </div>

      </div>
    </header>
  );
};
