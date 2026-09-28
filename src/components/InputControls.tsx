import { TaxSettings } from '../types';
import { MUNICIPALITIES, formatSEK } from '../utils/taxCalculations';
import { Sliders, Sparkles } from 'lucide-react';

interface InputControlsProps {
  settings: TaxSettings;
  onChange: (updated: TaxSettings) => void;
}

export const InputControls: React.FC<InputControlsProps> = ({ settings, onChange }) => {
  const isMonthly = settings.period === 'monthly';

  const update = <K extends keyof TaxSettings>(key: K, value: TaxSettings[K]) => {
    onChange({ ...settings, [key]: value });
  };

  const applyPreset = (preset: {
    revenue: number;
    expenses: number;
    municipality: string;
    taxRate: number;
    otherIncome: number;
  }) => {
    onChange({
      ...settings,
      revenue: preset.revenue,
      expenses: preset.expenses,
      municipality: preset.municipality,
      municipalTaxRate: preset.taxRate,
      otherIncomeYearly: preset.otherIncome,
    });
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
      
      {/* Header & Quick Presets */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-4 border-b border-slate-800">
        <div className="flex items-center gap-2 text-sm font-bold text-white">
          <Sliders className="w-4 h-4 text-emerald-400" />
          <span>Fyll i dina siffror</span>
        </div>

        {/* Preset Chips */}
        <div className="flex flex-wrap items-center gap-1.5 text-xs">
          <span className="text-[11px] text-slate-400 mr-1 flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-amber-400" />
            Snabbval:
          </span>
          <button
            type="button"
            onClick={() =>
              applyPreset({
                revenue: isMonthly ? 45000 : 540000,
                expenses: isMonthly ? 5000 : 60000,
                municipality: 'Göteborg',
                taxRate: 32.60,
                otherIncome: 0,
              })
            }
            className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors text-[11px]"
          >
            Frilans (45k)
          </button>
          <button
            type="button"
            onClick={() =>
              applyPreset({
                revenue: isMonthly ? 85000 : 1020000,
                expenses: isMonthly ? 8000 : 96000,
                municipality: 'Stockholm',
                taxRate: 29.82,
                otherIncome: 0,
              })
            }
            className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors text-[11px]"
          >
            Konsult (85k)
          </button>
          <button
            type="button"
            onClick={() =>
              applyPreset({
                revenue: isMonthly ? 130000 : 1560000,
                expenses: isMonthly ? 12000 : 144000,
                municipality: 'Göteborg',
                taxRate: 32.60,
                otherIncome: 0,
              })
            }
            className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors text-[11px]"
          >
            Senior (130k)
          </button>
        </div>
      </div>

      {/* 1. Invoiced Revenue */}
      <div className="space-y-2">
        <div className="flex justify-between items-baseline">
          <label className="text-xs font-semibold text-slate-200">
            Fakturerad intäkt (exkl. moms)
          </label>
          <div className="flex items-center gap-2">
            <span className="text-lg font-bold font-mono text-emerald-400">
              {formatSEK(settings.revenue)}
            </span>
            <span className="text-xs text-slate-400">/ {isMonthly ? 'mån' : 'år'}</span>
          </div>
        </div>

        <input
          type="range"
          min={10000}
          max={isMonthly ? 250000 : 3000000}
          step={isMonthly ? 1000 : 10000}
          value={settings.revenue}
          onChange={(e) => update('revenue', parseFloat(e.target.value) || 0)}
          className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-500"
        />

        <div className="flex items-center justify-between text-[11px] text-slate-500">
          <span>{formatSEK(10000)}</span>
          <input
            type="number"
            value={settings.revenue}
            onChange={(e) => update('revenue', parseFloat(e.target.value) || 0)}
            className="w-32 bg-slate-950 border border-slate-800 rounded px-2 py-1 text-right font-mono text-slate-200 focus:border-emerald-500 focus:outline-none"
          />
          <span>{formatSEK(isMonthly ? 250000 : 3000000)}</span>
        </div>
      </div>

      {/* 2. Business Expenses */}
      <div className="space-y-2">
        <div className="flex justify-between items-baseline">
          <label className="text-xs font-semibold text-slate-200">
            Avdragsgilla kostnader (exkl. moms)
          </label>
          <div className="flex items-center gap-2">
            <span className="text-lg font-bold font-mono text-slate-200">
              {formatSEK(settings.expenses)}
            </span>
            <span className="text-xs text-slate-400">/ {isMonthly ? 'mån' : 'år'}</span>
          </div>
        </div>

        <input
          type="range"
          min={0}
          max={isMonthly ? 50000 : 600000}
          step={isMonthly ? 500 : 5000}
          value={settings.expenses}
          onChange={(e) => update('expenses', parseFloat(e.target.value) || 0)}
          className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-slate-400"
        />

        <div className="flex items-center justify-between text-[11px] text-slate-500">
          <span>0 kr</span>
          <input
            type="number"
            value={settings.expenses}
            onChange={(e) => update('expenses', parseFloat(e.target.value) || 0)}
            className="w-32 bg-slate-950 border border-slate-800 rounded px-2 py-1 text-right font-mono text-slate-200 focus:border-emerald-500 focus:outline-none"
          />
          <span>{formatSEK(isMonthly ? 50000 : 600000)}</span>
        </div>
      </div>

      {/* 3. Municipality & VAT Settings Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
        
        {/* Municipality Picker */}
        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1.5">
            Kommunalskatt
          </label>
          <div className="flex gap-2">
            <select
              value={settings.municipality}
              onChange={(e) => {
                const found = MUNICIPALITIES.find((m) => m.name === e.target.value);
                if (found) {
                  onChange({
                    ...settings,
                    municipality: found.name,
                    municipalTaxRate: found.taxRate,
                  });
                }
              }}
              className="flex-1 bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-200 focus:border-emerald-500 focus:outline-none"
            >
              {MUNICIPALITIES.map((m) => (
                <option key={m.name} value={m.name}>
                  {m.name} ({m.taxRate}%)
                </option>
              ))}
            </select>
            <input
              type="number"
              step="0.01"
              value={settings.municipalTaxRate}
              onChange={(e) => update('municipalTaxRate', parseFloat(e.target.value) || 32)}
              className="w-20 bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-2 text-xs font-mono text-center text-slate-200 focus:border-emerald-500 focus:outline-none"
            />
          </div>
        </div>

        {/* VAT Rate */}
        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1.5">
            Moms på din försäljning
          </label>
          <div className="flex gap-2">
            {[25, 12, 6, 0].map((rate) => (
              <button
                key={rate}
                type="button"
                onClick={() => update('vatRate', rate)}
                className={`flex-1 py-2 rounded-lg border text-xs font-medium transition-all ${
                  settings.vatRate === rate
                    ? 'bg-emerald-950/80 border-emerald-500 text-emerald-300'
                    : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
                }`}
              >
                {rate}%
              </button>
            ))}
          </div>
        </div>

      </div>

      {/* 4. Other Salary / Employment Income */}
      <div className="pt-2 border-t border-slate-800">
        <div className="flex items-center justify-between mb-1">
          <label className="text-xs font-medium text-slate-400">
            Annan anställningsinkomst (per år)
          </label>
          <span className="text-[11px] font-mono text-slate-400">
            {formatSEK(settings.otherIncomeYearly)}
          </span>
        </div>
        <p className="text-[10px] text-slate-500 mb-2">
          Om du har vanlig anställning vid sidan om firman påverkar det när du når brytpunkten för statlig inkomstskatt (615 300 kr).
        </p>
        <input
          type="number"
          step="5000"
          value={settings.otherIncomeYearly}
          onChange={(e) => update('otherIncomeYearly', parseFloat(e.target.value) || 0)}
          placeholder="t.ex. 360 000 kr"
          className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-xs font-mono text-slate-200 focus:border-emerald-500 focus:outline-none"
        />
      </div>

    </div>
  );
};
