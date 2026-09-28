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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-3xl bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl overflow-hidden text-slate-100 max-h-[90vh] flex flex-col">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-slate-800 to-slate-900 p-6 border-b border-slate-800 relative shrink-0">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2 mb-2">
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-950 border border-emerald-500/40 text-emerald-400 text-xs font-semibold uppercase tracking-wider">
              Skatteverket 2026
            </span>
          </div>

          <h2 className="text-xl font-bold tracking-tight text-white">
            Avdragslexikon & Skattekalender
          </h2>
          <p className="text-slate-400 text-xs mt-1">
            Officiella schabloner och viktiga datum för svenska enskilda firmor och konsulter.
          </p>

          {/* Tab selector */}
          <div className="flex gap-2 mt-4">
            <button
              onClick={() => setTab('deductions')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                tab === 'deductions'
                  ? 'bg-emerald-600 text-white'
                  : 'bg-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>Avdragslexikon</span>
            </button>
            <button
              onClick={() => setTab('calendar')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                tab === 'calendar'
                  ? 'bg-emerald-600 text-white'
                  : 'bg-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              <Calendar className="w-3.5 h-3.5" />
              <span>Skattekalender 2026</span>
            </button>
          </div>
        </div>

        {/* Content list */}
        <div className="p-6 overflow-y-auto space-y-4 flex-1">
          {tab === 'deductions' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {DEDUCTIONS_2026.map((item) => (
                <div
                  key={item.id}
                  className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 space-y-2 hover:border-slate-700 transition-colors"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <span className="text-[10px] font-semibold text-emerald-400 uppercase tracking-wider block">
                        {item.category}
                      </span>
                      <h4 className="text-sm font-bold text-slate-100">{item.title}</h4>
                    </div>
                    <span className="px-2 py-0.5 rounded bg-emerald-950/80 border border-emerald-500/40 text-emerald-300 font-mono text-xs shrink-0 font-semibold">
                      {item.amountText}
                    </span>
                  </div>

                  <p className="text-xs text-slate-400 leading-relaxed">
                    {item.description}
                  </p>

                  <div className="pt-2 border-t border-slate-800/80 text-[11px] text-slate-500 flex items-start gap-1">
                    <CheckCircle className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                    <span>{item.skatteverketRule}</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-3">
              {SKATTE_CALENDAR_2026.map((event, index) => (
                <div
                  key={index}
                  className={`p-4 rounded-xl border flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                    event.important
                      ? 'bg-amber-950/20 border-amber-500/40'
                      : 'bg-slate-950/70 border-slate-800'
                  }`}
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-emerald-400">
                        {event.date}
                      </span>
                      {event.important && (
                        <span className="px-1.5 py-0.2 rounded text-[10px] bg-amber-500/20 text-amber-300 border border-amber-500/30 font-semibold">
                          Viktigt
                        </span>
                      )}
                    </div>
                    <h4 className="text-sm font-bold text-white">{event.title}</h4>
                    <p className="text-xs text-slate-400">{event.description}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
