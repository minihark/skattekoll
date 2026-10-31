import React from 'react';
import { DEDUCTIONS_2026, SKATTE_CALENDAR_2026 } from '../utils/deductionGuide';
import { X, BookOpen, Calendar, CheckCircle } from 'lucide-react';

interface DeductionModalProps {
  isOpen: boolean;
  onClose: () => void;
  activeTab?: 'deductions' | 'calendar';
}

export const DeductionModal: React.FC<DeductionModalProps> = ({
  isOpen,
  onClose,
  activeTab = 'deductions',
}) => {
  const [tab, setTab] = React.useState<'deductions' | 'calendar'>(activeTab);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="relative w-full max-w-3xl bg-white border border-[#D1CDC2] rounded-xl shadow-xl overflow-hidden text-[#111827] max-h-[90vh] flex flex-col">
        
        {/* Header */}
        <div className="bg-[#F8F7F4] p-6 border-b border-[#E5E2DA] relative shrink-0">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 rounded-lg border border-[#E5E2DA] bg-white hover:bg-[#F8F7F4] text-[#4B5563] hover:text-[#111827] transition"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2 mb-2">
            <span className="px-2.5 py-0.5 rounded bg-[#F0FDF4] border border-[#BBF7D0] text-[#14532D] text-xs font-mono font-bold uppercase tracking-wider">
              Skatteverket 2026
            </span>
          </div>

          <h2 className="font-serif text-2xl font-bold tracking-tight text-[#111827]">
            Avdragslexikon & Skattekalender
          </h2>
          <p className="text-xs text-[#4B5563] mt-1">
            Officiella schabloner och viktiga datum för svenska enskilda firmor och konsulter.
          </p>

          {/* Tab selector */}
          <div className="flex gap-2 mt-4 font-mono text-xs">
            <button
              onClick={() => setTab('deductions')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-bold border transition ${
                tab === 'deductions'
                  ? 'bg-[#14532D] text-white border-[#14532D] shadow-xs'
                  : 'bg-white text-[#4B5563] border-[#E5E2DA] hover:border-[#D1CDC2]'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>Avdragslexikon</span>
            </button>
            <button
              onClick={() => setTab('calendar')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-bold border transition ${
                tab === 'calendar'
                  ? 'bg-[#14532D] text-white border-[#14532D] shadow-xs'
                  : 'bg-white text-[#4B5563] border-[#E5E2DA] hover:border-[#D1CDC2]'
              }`}
            >
              <Calendar className="w-3.5 h-3.5" />
              <span>Skattekalender 2026</span>
            </button>
          </div>
        </div>

        {/* Content list */}
        <div className="p-6 overflow-y-auto space-y-4 flex-1 bg-white">
          {tab === 'deductions' ? (
            <div className="space-y-3">
              {DEDUCTIONS_2026.map((item) => (
                <div
                  key={item.id}
                  className="p-4 rounded-xl border border-[#E5E2DA] bg-[#F8F7F4]/50 hover:bg-[#F8F7F4] transition"
                >
                  <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-1 pb-1">
                    <h3 className="font-bold text-sm text-[#111827]">{item.title}</h3>
                    <span className="font-mono text-xs font-bold text-[#14532D] shrink-0">
                      {item.amountText}
                    </span>
                  </div>
                  <p className="text-xs text-[#4B5563] leading-relaxed mt-1">
                    {item.description}
                  </p>
                  <div className="mt-2.5 pt-2 border-t border-[#E5E2DA] flex items-center gap-1.5 text-[11px] text-[#6B7280]">
                    <CheckCircle className="w-3 h-3 text-[#14532D]" />
                    <span><strong>Regel:</strong> {item.skatteverketRule}</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-3">
              {SKATTE_CALENDAR_2026.map((event, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-xl border border-[#E5E2DA] bg-[#F8F7F4]/50 hover:bg-[#F8F7F4] flex items-start gap-3 transition"
                >
                  <div className="px-2.5 py-1.5 rounded-lg bg-white border border-[#D1CDC2] text-center font-mono shrink-0 min-w-[100px]">
                    <div className="text-[10px] uppercase font-bold text-[#6B7280]">
                      Förfallodag
                    </div>
                    <div className="text-xs font-black text-[#111827] mt-0.5">
                      {event.date}
                    </div>
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold text-sm text-[#111827]">{event.title}</h3>
                      {event.important && (
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#F0FDF4] text-[#14532D] border border-[#BBF7D0]">
                          Viktig
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-[#4B5563] leading-relaxed">
                      {event.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-[#F8F7F4] border-t border-[#E5E2DA] flex items-center justify-between text-xs font-mono text-[#6B7280]">
          <span>Källa: Skatteverket Handledning 2026</span>
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
