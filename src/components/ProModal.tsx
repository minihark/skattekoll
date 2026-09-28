import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { X, Sparkles, ShieldCheck, FileText, Check, ArrowRight, Smartphone, CreditCard, Lock } from 'lucide-react';

interface ProModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUpgradeSuccess: () => void;
  isPro: boolean;
}

export const ProModal: React.FC<ProModalProps> = ({
  isOpen,
  onClose,
  onUpgradeSuccess,
  isPro,
}) => {
  const [licenseKey, setLicenseKey] = useState('');
  const [licenseError, setLicenseError] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedMethod, setSelectedMethod] = useState<'swish' | 'card'>('swish');

  if (!isOpen) return null;

  const triggerConfetti = () => {
    confetti({
      particleCount: 130,
      spread: 75,
      origin: { y: 0.6 },
      colors: ['#10b981', '#059669', '#3b82f6', '#f59e0b'],
    });
  };

  const handleSimulatedPayment = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      triggerConfetti();
      localStorage.setItem('skattekoll_pro', 'true');
      localStorage.setItem('skattekoll_pro_key', 'HARKCO-SWISH-PRO-LIFETIME');
      onUpgradeSuccess();
    }, 1200);
  };

  const handleApplyKey = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanKey = licenseKey.trim().toUpperCase();
    if (!cleanKey) return;

    if (cleanKey.includes('PRO') || cleanKey.startsWith('HARKCO') || cleanKey.length >= 8) {
      setLicenseError('');
      triggerConfetti();
      localStorage.setItem('skattekoll_pro', 'true');
      localStorage.setItem('skattekoll_pro_key', cleanKey);
      onUpgradeSuccess();
    } else {
      setLicenseError('Ogiltig licensnyckel. Testa t.ex. "HARKCO-PRO-2026"');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-xl bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl overflow-hidden text-slate-100">
        
        {/* Banner */}
        <div className="bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 p-6 text-white relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 rounded-full bg-black/20 hover:bg-black/40 text-white/80 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/20 text-xs font-semibold uppercase tracking-wider backdrop-blur-md mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Engångsköp • Livstidslicens</span>
          </div>

          <h2 className="text-2xl font-bold tracking-tight">SkatteKoll Pro</h2>
          <p className="text-emerald-100 text-xs sm:text-sm mt-1 max-w-md">
            Skapad för svenska konsulter och frilansare som vill ha total kontroll på skattekontot och slippa prenumerationer.
          </p>
        </div>

        <div className="p-6 space-y-6">
          
          {/* Pricing Box */}
          <div className="flex items-baseline justify-between p-4 rounded-xl bg-slate-800/60 border border-emerald-500/30">
            <div>
              <div className="text-xs font-medium text-emerald-400 uppercase tracking-wider">Engångsavgift</div>
              <div className="text-3xl font-bold text-white">149 kr <span className="text-sm font-normal text-slate-400">inkl. moms</span></div>
            </div>
            <div className="text-right">
              <div className="text-xs text-slate-400 line-through">299 kr</div>
              <div className="text-xs font-semibold text-emerald-400">0 kr/månad efter köp</div>
            </div>
          </div>

          {/* Feature List */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
            <div className="flex items-start gap-2.5 p-3 rounded-lg bg-slate-800/40 border border-slate-800">
              <FileText className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
              <div>
                <div className="font-medium text-slate-200">Export av PDF Skatterapport</div>
                <div className="text-xs text-slate-400">Perfekt underlag till din redovisningskonsult.</div>
              </div>
            </div>

            <div className="flex items-start gap-2.5 p-3 rounded-lg bg-slate-800/40 border border-slate-800">
              <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
              <div>
                <div className="font-medium text-slate-200">Fullt Avdragslexikon 2026</div>
                <div className="text-xs text-slate-400">Uppdaterade schabloner och avdragsregler.</div>
              </div>
            </div>

            <div className="flex items-start gap-2.5 p-3 rounded-lg bg-slate-800/40 border border-slate-800">
              <Lock className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
              <div>
                <div className="font-medium text-slate-200">100% Privat i webbläsaren</div>
                <div className="text-xs text-slate-400">Dina intäkter skickas aldrig till servrar.</div>
              </div>
            </div>

            <div className="flex items-start gap-2.5 p-3 rounded-lg bg-slate-800/40 border border-slate-800">
              <Sparkles className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
              <div>
                <div className="font-medium text-slate-200">Framtida uppdateringar</div>
                <div className="text-xs text-slate-400">Automatiskt anpassad för kommande skatteår.</div>
              </div>
            </div>
          </div>

          {!isPro ? (
            <div className="space-y-4 pt-2">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setSelectedMethod('swish')}
                  className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl border font-medium text-sm transition-all ${
                    selectedMethod === 'swish'
                      ? 'bg-red-950/40 border-red-500/80 text-red-300 ring-1 ring-red-500/50'
                      : 'bg-slate-800/50 border-slate-700 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <Smartphone className="w-4 h-4 text-red-500" />
                  <span>Swish (149 kr)</span>
                </button>

                <button
                  type="button"
                  onClick={() => setSelectedMethod('card')}
                  className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl border font-medium text-sm transition-all ${
                    selectedMethod === 'card'
                      ? 'bg-emerald-950/40 border-emerald-500/80 text-emerald-300 ring-1 ring-emerald-500/50'
                      : 'bg-slate-800/50 border-slate-700 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <CreditCard className="w-4 h-4 text-emerald-500" />
                  <span>Kort / Apple Pay</span>
                </button>
              </div>

              <button
                type="button"
                onClick={handleSimulatedPayment}
                disabled={isProcessing}
                className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-semibold flex items-center justify-center gap-2 shadow-lg shadow-emerald-900/30 transition-all active:scale-[0.99] disabled:opacity-60"
              >
                {isProcessing ? (
                  <span className="inline-flex items-center gap-2">
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Initierar säker betalning...</span>
                  </span>
                ) : (
                  <>
                    <span>Aktivera SkatteKoll Pro Direkt (149 kr)</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>

              {/* License key input */}
              <div className="pt-2 border-t border-slate-800">
                <form onSubmit={handleApplyKey} className="flex gap-2">
                  <input
                    type="text"
                    value={licenseKey}
                    onChange={(e) => {
                      setLicenseKey(e.target.value);
                      setLicenseError('');
                    }}
                    placeholder="Har du en licensnyckel? (t.ex. HARKCO-PRO-2026)"
                    className="flex-1 bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                  />
                  <button
                    type="submit"
                    className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-xs font-medium text-slate-300 rounded-lg transition-colors"
                  >
                    Aktivera
                  </button>
                </form>
                {licenseError && (
                  <p className="text-red-400 text-xs mt-1.5">{licenseError}</p>
                )}
              </div>
            </div>
          ) : (
            <div className="p-4 rounded-xl bg-emerald-950/40 border border-emerald-500/50 text-center space-y-2">
              <div className="inline-flex p-2 rounded-full bg-emerald-500/20 text-emerald-400">
                <Check className="w-6 h-6" />
              </div>
              <h3 className="font-semibold text-emerald-300">Du har SkatteKoll Pro aktiverat!</h3>
              <p className="text-xs text-emerald-200/80">
                Alla funktioner är upplåsta. Full tillgång till skatterapporter, avdragslexikon och framtida skatteår.
              </p>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
