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
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100 font-sans selection:bg-emerald-500 selection:text-white">
      
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
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 space-y-8 print:hidden">
        
        {/* Hero: Safe Payout & The Three Pots */}
        <SafePayoutHero
          results={results}
          period={settings.period}
          businessType={settings.businessType}
          onOpenABModal={() => setIsABModalOpen(true)}
        />

        {/* Dual Column Workspace */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Interactive Input Controls */}
          <div className="lg:col-span-6 space-y-4">
            <div className="flex items-center justify-between pb-1">
              <div>
                <h3 className="text-base font-bold text-white">Intäkter & Avdrag</h3>
                <p className="text-xs text-slate-400">
                  Dra i reglagen för att se effekten på ditt säkra uttag direkt.
                </p>
              </div>
              <button
                type="button"
                onClick={handleReset}
                className="inline-flex items-center gap-1 text-xs text-slate-400 hover:text-slate-200 transition-colors p-1"
                title="Återställ kalkyl"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Återställ</span>
              </button>
            </div>

            <InputControls settings={settings} onChange={setSettings} />
          </div>

          {/* Right Column: Visual Tax Waterfall */}
          <div className="lg:col-span-6 space-y-4">
            <div className="flex items-center justify-between pb-1">
              <div>
                <h3 className="text-base font-bold text-white">Skatteberäkning (2026)</h3>
                <p className="text-xs text-slate-400">
                  Fullständig kaskad enligt Skatteverkets officiella regler.
                </p>
              </div>
              <span className="text-[11px] text-emerald-400 font-mono bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-500/30">
                Live kalkyl
              </span>
            </div>

            <TaxWaterfall results={results} period={settings.period} />
          </div>

        </div>

      </main>

      {/* Footer */}
      <footer className="bg-slate-900/50 border-t border-slate-800 py-6 px-4 mt-12 print:hidden text-xs text-slate-400">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>
              <strong>100% Klient-integritet:</strong> Inga siffror eller företagsdata skickas till externa servrar. Allt räknas lokalt i din webbläsare.
            </span>
          </div>

          <div className="flex items-center gap-4 text-slate-500">
            <span>Skatteverket 2026 regler</span>
            <span>•</span>
            <span>Harkco Lab</span>
          </div>
        </div>
      </footer>

      {/* Printable A4 Accountant & K10 Summary */}
      <div className="hidden print:block p-8 bg-white text-slate-900 space-y-6 font-sans">
        <div className="border-b-2 border-slate-900 pb-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-black uppercase">
              SKATTEKOLL 2026 — SKATTE- & 3:12 K10-UNDERLAG
            </h1>
            <p className="text-sm font-semibold text-slate-600">
              Kommun: {settings.municipality} ({settings.municipalTaxRate.toFixed(2)}%) • Val: {settings.businessType === 'aktiebolag' ? 'Aktiebolag (AB)' : 'Enskild Firma (EF)'}
            </p>
          </div>
          <div className="text-right font-mono text-xs text-slate-600">
            <div>Datum: {new Date().toLocaleDateString('sv-SE')}</div>
            <div>PBB 2026: 58 800 kr • IBB 2026: 80 600 kr</div>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4 font-mono border-b border-slate-300 pb-4">
          <div className="p-3 border border-slate-300 rounded">
            <div className="text-[11px] uppercase text-slate-500">Vinst före skatt (Helår)</div>
            <div className="text-xl font-black">{formatSEK(results.profitBeforeTaxYearly)}</div>
          </div>
          <div className="p-3 border border-slate-300 rounded">
            <div className="text-[11px] uppercase text-slate-500">Netto i handen (Enskild Firma)</div>
            <div className="text-xl font-black">{formatSEK(results.safeNetPayoutYearly)}</div>
            <div className="text-[11px] text-slate-500">{formatSEK(results.safeNetPayoutMonthly)}/mån</div>
          </div>
          <div className="p-3 border border-slate-300 rounded">
            <div className="text-[11px] uppercase text-slate-500">Netto i handen (Aktiebolag + K10)</div>
            <div className="text-xl font-black">{formatSEK(results.abSimulation.netInPocket)}</div>
            <div className="text-[11px] text-slate-500">
              Diff vs EF: {results.abSimulation.differenceVsEnskildFirma >= 0 ? '+' : ''}{formatSEK(results.abSimulation.differenceVsEnskildFirma)}/år
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-6 text-xs font-mono">
          <div className="space-y-2 border border-slate-300 rounded p-4">
            <div className="font-bold text-sm uppercase border-b border-slate-200 pb-1">
              Enskild Firma (EF) — Helår
            </div>
            <div className="flex justify-between"><span>Omsättning (exkl. moms):</span><span>{formatSEK(results.revenueYearly)}</span></div>
            <div className="flex justify-between"><span>Kostnader (exkl. moms):</span><span>-{formatSEK(results.expensesYearly)}</span></div>
            <div className="flex justify-between"><span>Egenavgifter:</span><span>-{formatSEK(results.egenavgifter)}</span></div>
            <div className="flex justify-between"><span>Slutlig inkomstskatt:</span><span>-{formatSEK(results.totalInkomstskatt)}</span></div>
            <div className="flex justify-between font-bold border-t border-slate-200 pt-1"><span>Säkert uttag (Netto):</span><span>{formatSEK(results.safeNetPayoutYearly)}</span></div>
            <div className="flex justify-between text-slate-500"><span>Momsreserv (Netto):</span><span>{formatSEK(results.netVatToPay)}</span></div>
          </div>

          <div className="space-y-2 border border-slate-300 rounded p-4">
            <div className="font-bold text-sm uppercase border-b border-slate-200 pb-1">
              Aktiebolag (AB) & 2026 3:12 K10 — Helår
            </div>
            <div className="flex justify-between"><span>Bruttolön (upp till brytpunkt):</span><span>{formatSEK(results.abSimulation.salaryYearly)}</span></div>
            <div className="flex justify-between"><span>Arbetsgivaravgifter (31,42%):</span><span>{formatSEK(results.abSimulation.arbetsgivaravgifter)}</span></div>
            <div className="flex justify-between"><span>Bolagsskatt (20,6%):</span><span>{formatSEK(results.abSimulation.bolagsskatt)}</span></div>
            <div className="flex justify-between"><span>K10 Utdelning (Grundbelopp 4 IBB):</span><span>{formatSEK(results.abSimulation.dividends)}</span></div>
            <div className="flex justify-between"><span>Kapitalskatt på utdelning (20%):</span><span>-{formatSEK(results.abSimulation.dividendTax)}</span></div>
            <div className="flex justify-between font-bold border-t border-slate-200 pt-1"><span>Totalt netto i handen (Lön + Utd):</span><span>{formatSEK(results.abSimulation.netInPocket)}</span></div>
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
