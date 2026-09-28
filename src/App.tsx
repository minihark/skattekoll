import React, { useState, useEffect, useMemo } from 'react';
import { TaxSettings } from './types';
import { calculateTaxes } from './utils/taxCalculations';
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
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 space-y-8">
        
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
