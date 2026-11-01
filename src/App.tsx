import React, { useState, useEffect, useMemo } from 'react';
import { TaxSettings } from './types';
import { calculateTaxes, formatSEK } from './utils/taxCalculations';
import { Navbar } from './components/Navbar';
import { SafePayoutHero } from './components/SafePayoutHero';
import { InputControls } from './components/InputControls';
import { TaxWaterfall } from './components/TaxWaterfall';
import { ProModal } from './components/ProModal';
import { DeductionModal } from './components/DeductionModal';
import { ABComparisonModal } from './components/ABComparisonModal';
import { ShieldCheck, RotateCcw } from 'lucide-react';

const DEFAULT_SETTINGS: TaxSettings = {
  businessType: 'enskild_firma',
  period: 'monthly',
  revenue: 65000,
  vatRate: 25,
  expenses: 6000,
  expensesVatRate: 25,
  municipality: 'Göteborg',
  municipalTaxRate: 32.60,
  includeSchablonavdrag: true,
  otherIncomeYearly: 0,
  isPro: false,
};

export const App: React.FC = () => {
  const [settings, setSettings] = useState<TaxSettings>(() => {
    const saved = localStorage.getItem('skattekoll_settings');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return DEFAULT_SETTINGS;
      }
    }
    return DEFAULT_SETTINGS;
  });

  const [isPro, setIsPro] = useState<boolean>(() => {
    return localStorage.getItem('skattekoll_pro') === 'true';
  });

  const [isProModalOpen, setIsProModalOpen] = useState(false);
  const [isDeductionModalOpen, setIsDeductionModalOpen] = useState(false);
  const [isABModalOpen, setIsABModalOpen] = useState(false);

  useEffect(() => {
    localStorage.setItem('skattekoll_settings', JSON.stringify(settings));
  }, [settings]);

  const results = useMemo(() => calculateTaxes(settings), [settings]);

  const handleReset = () => {
    if (window.confirm('Vill du återställa kalkylen till standardvärden?')) {
      setSettings(DEFAULT_SETTINGS);
    }
  };

  const handleUpgradeSuccess = () => {
    setIsPro(true);
    setIsProModalOpen(false);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F8F7F4] text-[#111827] font-sans selection:bg-[#14532D] selection:text-white">
      
      {/* Header */}
      <Navbar
        settings={settings}
        onChange={setSettings}
        isPro={isPro}
        onOpenProModal={() => setIsProModalOpen(true)}
        onOpenDeductionModal={() => setIsDeductionModalOpen(true)}
        onOpenABModal={() => setIsABModalOpen(true)}
      />

      {/* Main Workspace */}
      <main className="flex-1 max-w-6xl w-full mx-auto p-4 sm:p-6 lg:p-8 space-y-6 print:hidden">
        
        {/* Hero: Safe Payout & The Three Pots */}
        <SafePayoutHero
          results={results}
          period={settings.period}
          businessType={settings.businessType}
          onOpenABModal={() => setIsABModalOpen(true)}
        />

        {/* Dual Column Workspace */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* Left Column: Interactive Input Controls */}
          <div className="lg:col-span-6 space-y-3">
            <div className="flex items-center justify-between pb-1">
              <div>
                <h3 className="font-serif text-lg font-bold text-[#111827]">
                  Intäkter & Avdrag
                </h3>
                <p className="text-xs text-[#4B5563]">
                  Justera intäkt och avdragsgilla utlägg för månadens beräkning.
                </p>
              </div>
              <button
                type="button"
                onClick={handleReset}
                className="inline-flex items-center gap-1 text-xs font-mono text-[#6B7280] hover:text-[#111827] transition p-1"
                title="Återställ kalkyl till standardvärden"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Återställ</span>
              </button>
            </div>

            <InputControls settings={settings} onChange={setSettings} />
          </div>

          {/* Right Column: Visual Tax Waterfall */}
          <div className="lg:col-span-6 space-y-3">
            <div className="flex items-center justify-between pb-1">
              <div>
                <h3 className="font-serif text-lg font-bold text-[#111827]">
                  Skatteberäkning (2026)
                </h3>
                <p className="text-xs text-[#4B5563]">
                  Officiell specifikation av egenavgifter och inkomstskatt.
                </p>
              </div>
              <span className="text-[11px] text-[#14532D] font-mono font-semibold bg-[#F0FDF4] px-2 py-0.5 rounded border border-[#BBF7D0]">
                Live kalkyl
              </span>
            </div>

            <TaxWaterfall results={results} period={settings.period} />
          </div>

        </div>

      </main>

      {/* Footer */}
      <footer className="border-t border-[#E5E2DA] bg-[#F8F7F4] py-6 px-4 mt-8 print:hidden text-xs text-[#6B7280] font-mono">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-[#14532D]" />
            <span>
              <strong>100% Klientintegritet:</strong> Inga siffror eller företagsdata skickas till externa servrar. Allt räknas lokalt i din webbläsare.
            </span>
          </div>

          <div className="flex items-center gap-3 text-[#6B7280]">
            <a
              href="https://vakt.apps.harkco.se"
              target="_blank"
              rel="noopener noreferrer"
              title="SkatteKoll Status på Harkco Vakt"
              className="inline-block hover:opacity-90 transition-opacity"
            >
              <img
                src="https://vakt.apps.harkco.se/badge/skattekoll.svg"
                alt="SkatteKoll: operational"
                height="20"
                className="h-5 inline-block"
                onError={(e) => { e.currentTarget.style.display = 'none'; }}
              />
            </a>
            <span>•</span>
            <span>Skatteverket 2026</span>
            <span>•</span>
            <span>Harkco Studio</span>
          </div>
        </div>
      </footer>

      {/* Printable A4 Accountant & K10 Summary */}
      <div id="skattekoll-printable-spec" className="hidden print:block p-8 bg-white text-[#111827] space-y-6 font-mono">
        <div className="border-b-2 border-[#111827] pb-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-black uppercase tracking-tight">
              SKATTEKOLL 2026 — SKATTE- & 3:12 K10-UNDERLAG
            </h1>
            <p className="text-sm font-semibold text-[#4B5563] mt-1">
              Kommun: {settings.municipality} ({settings.municipalTaxRate.toFixed(2)}%) • Företagsform: {settings.businessType === 'aktiebolag' ? 'Aktiebolag (AB)' : 'Enskild Firma (EF)'}
            </p>
          </div>
          <div className="text-right font-mono text-xs text-[#6B7280]">
            <div>Datum: {new Date().toLocaleDateString('sv-SE')}</div>
            <div>PBB 2026: 58 800 kr • IBB 2026: 80 600 kr</div>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4 border-b border-[#E5E2DA] pb-4">
          <div className="p-3 border border-[#D1CDC2] rounded-lg">
            <div className="text-[11px] uppercase text-[#6B7280]">Vinst före skatt (Helår)</div>
            <div className="text-xl font-black mt-0.5">{formatSEK(results.profitBeforeTaxYearly)}</div>
          </div>
          <div className="p-3 border border-[#BBF7D0] bg-[#F0FDF4] rounded-lg">
            <div className="text-[11px] uppercase text-[#14532D]">Netto i handen (Enskild Firma)</div>
            <div className="text-xl font-black text-[#14532D] mt-0.5">{formatSEK(results.safeNetPayoutYearly)}</div>
            <div className="text-[11px] text-[#166534]">{formatSEK(results.safeNetPayoutMonthly)}/mån</div>
          </div>
          <div className="p-3 border border-[#BFDBFE] bg-[#EFF6FF] rounded-lg">
            <div className="text-[11px] uppercase text-[#1E3A8A]">Netto i handen (Aktiebolag + K10)</div>
            <div className="text-xl font-black text-[#1E3A8A] mt-0.5">{formatSEK(results.abSimulation.netInPocket)}</div>
            <div className="text-[11px] text-[#1E40AF]">
              Diff vs EF: {results.abSimulation.differenceVsEnskildFirma >= 0 ? '+' : ''}{formatSEK(results.abSimulation.differenceVsEnskildFirma)}/år
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-6 text-xs">
          <div className="space-y-2 border border-[#E5E2DA] rounded-lg p-4">
            <div className="font-bold text-sm uppercase border-b border-[#E5E2DA] pb-1 text-[#111827]">
              Enskild Firma (EF) — Helårsspecifikation
            </div>
            <div className="flex justify-between"><span>Omsättning (exkl. moms):</span><span>{formatSEK(results.revenueYearly)}</span></div>
            <div className="flex justify-between"><span>Kostnader (exkl. moms):</span><span>-{formatSEK(results.expensesYearly)}</span></div>
            <div className="flex justify-between"><span>Egenavgifter (28,97%):</span><span>-{formatSEK(results.egenavgifter)}</span></div>
            <div className="flex justify-between"><span>Slutlig inkomstskatt:</span><span>-{formatSEK(results.totalInkomstskatt)}</span></div>
            <div className="flex justify-between font-bold border-t border-[#E5E2DA] pt-1 text-[#14532D]"><span>Säkert uttag (Netto):</span><span>{formatSEK(results.safeNetPayoutYearly)}</span></div>
            <div className="flex justify-between text-[#581C87]"><span>Momskonto-reserv:</span><span>{formatSEK(results.netVatToPay)}</span></div>
          </div>

          <div className="space-y-2 border border-[#E5E2DA] rounded-lg p-4">
            <div className="font-bold text-sm uppercase border-b border-[#E5E2DA] pb-1 text-[#111827]">
              Aktiebolag (AB) & 2026 3:12 K10
            </div>
            <div className="flex justify-between"><span>Bruttolön (upp till brytpunkt):</span><span>{formatSEK(results.abSimulation.salaryYearly)}</span></div>
            <div className="flex justify-between"><span>Arbetsgivaravgifter (31,42%):</span><span>{formatSEK(results.abSimulation.arbetsgivaravgifter)}</span></div>
            <div className="flex justify-between"><span>Bolagsskatt (20,6%):</span><span>{formatSEK(results.abSimulation.bolagsskatt)}</span></div>
            <div className="flex justify-between"><span>K10 Utdelning (Grundbelopp 4 IBB):</span><span>{formatSEK(results.abSimulation.dividends)}</span></div>
            <div className="flex justify-between"><span>Kapitalskatt på utdelning (20%):</span><span>-{formatSEK(results.abSimulation.dividendTax)}</span></div>
            <div className="flex justify-between font-bold border-t border-[#E5E2DA] pt-1 text-[#1E3A8A]"><span>Totalt netto i handen (Lön + Utd):</span><span>{formatSEK(results.abSimulation.netInPocket)}</span></div>
          </div>
        </div>
      </div>

      {/* Modals */}
      <ProModal
        isOpen={isProModalOpen}
        onClose={() => setIsProModalOpen(false)}
        onUpgradeSuccess={handleUpgradeSuccess}
        isPro={isPro}
      />

      <DeductionModal
        isOpen={isDeductionModalOpen}
        onClose={() => setIsDeductionModalOpen(false)}
      />

      <ABComparisonModal
        isOpen={isABModalOpen}
        onClose={() => setIsABModalOpen(false)}
        results={results}
        period={settings.period}
      />

    </div>
  );
};

export default App;
