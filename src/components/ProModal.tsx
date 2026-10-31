import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { X, Sparkles, Check, ArrowRight, Smartphone, CreditCard } from 'lucide-react';

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
      colors: ['#14532D', '#16A34A', '#1E3A8A', '#F59E0B'],
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
    }, 1000);
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="relative w-full max-w-lg bg-white border border-[#D1CDC2] rounded-xl shadow-xl overflow-hidden text-[#111827]">
        
        {/* Banner */}
        <div className="bg-[#F8F7F4] p-6 border-b border-[#E5E2DA] relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 rounded-lg border border-[#E5E2DA] bg-white hover:bg-[#F8F7F4] text-[#4B5563] hover:text-[#111827] transition"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-[#F0FDF4] border border-[#BBF7D0] text-[#14532D] text-xs font-mono font-bold uppercase tracking-wider mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Engångsköp • 149 kr</span>
          </div>

          <h2 className="font-serif text-2xl font-bold tracking-tight text-[#111827]">
            SkatteKoll Pro
          </h2>
          <p className="text-xs text-[#4B5563] mt-1 max-w-sm">
            Ett engångsköp för svenska konsulter och frilansare. 100% fri från annonser och prenumerationer.
          </p>
        </div>

        {/* Feature list */}
        <div className="p-6 space-y-5 bg-white">
          <ul className="space-y-2.5 text-xs text-[#111827]">
            <li className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-full bg-[#F0FDF4] border border-[#BBF7D0] flex items-center justify-center text-[#14532D]">
                <Check className="w-3 h-3" />
              </div>
              <span><strong>Komplett avdragslexikon 2026</strong> med alla schabloner och undantag</span>
            </li>
            <li className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-full bg-[#F0FDF4] border border-[#BBF7D0] flex items-center justify-center text-[#14532D]">
                <Check className="w-3 h-3" />
              </div>
              <span><strong>Professionell PDF-skatterapport</strong> att ta till revisorn eller banken</span>
            </li>
            <li className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-full bg-[#F0FDF4] border border-[#BBF7D0] flex items-center justify-center text-[#14532D]">
                <Check className="w-3 h-3" />
              </div>
              <span><strong>Automatiska uppdateringar</strong> för framtida skatteår och 3:12-ändringar</span>
            </li>
            <li className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-full bg-[#F0FDF4] border border-[#BBF7D0] flex items-center justify-center text-[#14532D]">
                <Check className="w-3 h-3" />
              </div>
              <span><strong>100% lokal klientintegritet</strong> — inga ekonomiska data lämnar din dator</span>
            </li>
          </ul>

          {/* Payment Method Switcher */}
          <div className="pt-2">
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setSelectedMethod('swish')}
                className={`flex-1 py-2 px-3 rounded-lg border text-xs font-mono font-bold flex items-center justify-center gap-2 transition ${
                  selectedMethod === 'swish'
                    ? 'border-[#14532D] bg-[#F0FDF4] text-[#14532D]'
                    : 'border-[#E5E2DA] bg-[#F8F7F4] text-[#4B5563]'
                }`}
              >
                <Smartphone className="w-4 h-4" />
                <span>Swish (149 kr)</span>
              </button>
              <button
                type="button"
                onClick={() => setSelectedMethod('card')}
                className={`flex-1 py-2 px-3 rounded-lg border text-xs font-mono font-bold flex items-center justify-center gap-2 transition ${
                  selectedMethod === 'card'
                    ? 'border-[#14532D] bg-[#F0FDF4] text-[#14532D]'
                    : 'border-[#E5E2DA] bg-[#F8F7F4] text-[#4B5563]'
                }`}
              >
                <CreditCard className="w-4 h-4" />
                <span>Kortbetalning</span>
              </button>
            </div>

            <button
              type="button"
              onClick={handleSimulatedPayment}
              disabled={isProcessing}
              className="w-full mt-3 py-2.5 px-4 rounded-lg bg-[#14532D] hover:bg-[#166534] text-white font-mono font-bold text-xs flex items-center justify-center gap-2 shadow-xs transition"
            >
              {isProcessing ? (
                <span>Aktiverar livstidslicens...</span>
              ) : (
                <>
                  <span>Lås upp livstidslicens (149 kr)</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </>
              )}
            </button>
          </div>

          {/* License key input */}
          <form onSubmit={handleApplyKey} className="pt-3 border-t border-[#E5E2DA] space-y-2">
            <div className="flex justify-between items-center text-[11px] font-mono text-[#6B7280]">
              <span>Har du redan en licensnyckel?</span>
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="T.ex. HARKCO-PRO-2026"
                value={licenseKey}
                onChange={(e) => setLicenseKey(e.target.value)}
                className="flex-1 px-3 py-1.5 rounded-lg border border-[#D1CDC2] bg-[#F8F7F4] text-xs font-mono text-[#111827] focus:outline-none focus:border-[#14532D]"
              />
              <button
                type="submit"
                className="px-3 py-1.5 rounded-lg bg-[#111827] hover:bg-black text-white text-xs font-mono font-bold transition"
              >
                Aktivera
              </button>
            </div>
            {licenseError && (
              <p className="text-[11px] font-mono text-[#DC2626]">{licenseError}</p>
            )}
          </form>

        </div>

      </div>
    </div>
  );
};
