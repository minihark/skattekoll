import React from 'react';
import { TaxSettings } from '../types';
import { MUNICIPALITIES, formatSEK } from '../utils/taxCalculations';
import { Sparkles, Plus } from 'lucide-react';

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

  const addExpenseQuick = (amountMonthly: number) => {
    const delta = isMonthly ? amountMonthly : amountMonthly * 12;
    update('expenses', Math.max(0, settings.expenses + delta));
  };

  return (
    <div className="bg-white border border-[#E5E2DA] rounded-xl p-6 sm:p-7 shadow-xs space-y-6">
      
      {/* Header & Quick Presets */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-4 border-b border-[#E5E2DA]">
        <div>
          <h3 className="font-serif text-lg font-bold text-[#111827]">
            Fyll i månadens siffror
          </h3>
          <p className="text-xs text-[#4B5563]">
            Alla ändringar uppdaterar kalkylen och de tre säkra potterna i realtid.
          </p>
        </div>

        {/* Preset Chips */}
        <div className="flex flex-wrap items-center gap-1.5 text-xs font-mono">
          <span className="text-[11px] text-[#6B7280] mr-1 flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-[#14532D]" />
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
            className="px-2.5 py-1 rounded border border-[#E5E2DA] bg-[#F8F7F4] hover:bg-[#E5E2DA] text-[#111827] font-semibold transition text-[11px]"
          >
            Frilans 45k
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
            className="px-2.5 py-1 rounded border border-[#E5E2DA] bg-[#F8F7F4] hover:bg-[#E5E2DA] text-[#111827] font-semibold transition text-[11px]"
          >
            Konsult 85k
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
            className="px-2.5 py-1 rounded border border-[#E5E2DA] bg-[#F8F7F4] hover:bg-[#E5E2DA] text-[#111827] font-semibold transition text-[11px]"
          >
            Senior 130k
          </button>
        </div>
      </div>

      {/* Steg 1: Fakturerad intäkt */}
      <div className="space-y-2">
        <div className="flex justify-between items-baseline">
          <label className="text-xs font-mono font-bold text-[#111827] uppercase tracking-wider flex items-center gap-1.5">
            <span className="w-5 h-5 rounded-full bg-[#14532D] text-white flex items-center justify-center text-[10px]">1</span>
            <span>Fakturerad intäkt ({isMonthly ? 'per månad' : 'per år'})</span>
          </label>
          <span className="font-mono text-xs font-bold text-[#14532D]">
            {formatSEK(settings.revenue)} exkl. moms
          </span>
        </div>

        <div className="relative">
          <input
            type="number"
            min={0}
            step={1000}
            value={settings.revenue}
            onChange={(e) => update('revenue', Math.max(0, Number(e.target.value) || 0))}
            className="w-full px-3.5 py-2.5 rounded-lg border border-[#D1CDC2] bg-[#F8F7F4] font-mono text-lg font-bold text-[#111827] focus:outline-none focus:border-[#14532D] focus:bg-white transition"
            placeholder="0"
          />
          <div className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-mono text-[#6B7280]">
            SEK exkl. moms
          </div>
        </div>

        {/* Momssats väljare */}
        <div className="flex items-center justify-between text-xs pt-1">
          <span className="text-[#4B5563]">Moms på din faktura:</span>
          <div className="flex gap-1 font-mono">
            {[25, 12, 6, 0].map((rate) => (
              <button
                key={rate}
                type="button"
                onClick={() => update('vatRate', rate)}
                className={`px-2 py-0.5 rounded text-[11px] font-bold border transition ${
                  settings.vatRate === rate
                    ? 'bg-[#111827] text-white border-[#111827]'
                    : 'bg-[#F8F7F4] text-[#4B5563] border-[#E5E2DA] hover:border-[#D1CDC2]'
                }`}
              >
                {rate}%
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Steg 2: Avdragsgilla kostnader */}
      <div className="space-y-2 pt-2 border-t border-[#E5E2DA]">
        <div className="flex justify-between items-baseline">
          <label className="text-xs font-mono font-bold text-[#111827] uppercase tracking-wider flex items-center gap-1.5">
            <span className="w-5 h-5 rounded-full bg-[#1E3A8A] text-white flex items-center justify-center text-[10px]">2</span>
            <span>Avdragsgilla kostnader ({isMonthly ? 'per månad' : 'per år'})</span>
          </label>
          <span className="font-mono text-xs font-bold text-[#4B5563]">
            {formatSEK(settings.expenses)} exkl. moms
          </span>
        </div>

        <div className="relative">
          <input
            type="number"
            min={0}
            step={500}
            value={settings.expenses}
            onChange={(e) => update('expenses', Math.max(0, Number(e.target.value) || 0))}
            className="w-full px-3.5 py-2.5 rounded-lg border border-[#D1CDC2] bg-[#F8F7F4] font-mono text-lg font-bold text-[#111827] focus:outline-none focus:border-[#14532D] focus:bg-white transition"
            placeholder="0"
          />
          <div className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-mono text-[#6B7280]">
            SEK exkl. moms
          </div>
        </div>

        {/* Quick standard deduction adders */}
        <div className="flex flex-wrap items-center gap-1.5 pt-1">
          <span className="text-[11px] text-[#6B7280] font-mono">Lägg till standardutlägg:</span>
          <button
            type="button"
            onClick={() => addExpenseQuick(333)}
            className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-[#F8F7F4] hover:bg-[#E5E2DA] border border-[#E5E2DA] text-[#111827] text-[11px] font-mono transition"
            title="Skatteverkets schablon för hemmakontor (ca 4 000 kr/år)"
          >
            <Plus className="w-3 h-3 text-[#14532D]" />
            <span>Hemmakontor (+333 kr)</span>
          </button>
          <button
            type="button"
            onClick={() => addExpenseQuick(500)}
            className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-[#F8F7F4] hover:bg-[#E5E2DA] border border-[#E5E2DA] text-[#111827] text-[11px] font-mono transition"
            title="Arbetsmobil & bredband (500 kr/mån)"
          >
            <Plus className="w-3 h-3 text-[#14532D]" />
            <span>Mobil/Bredband (+500 kr)</span>
          </button>
          <button
            type="button"
            onClick={() => addExpenseQuick(1500)}
            className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-[#F8F7F4] hover:bg-[#E5E2DA] border border-[#E5E2DA] text-[#111827] text-[11px] font-mono transition"
            title="Dator & mjukvarulicenser (1 500 kr/mån)"
          >
            <Plus className="w-3 h-3 text-[#14532D]" />
            <span>Programvara (+1 500 kr)</span>
          </button>
        </div>
      </div>

      {/* Steg 3: Kommun & Skatteunderlag */}
      <div className="space-y-3 pt-3 border-t border-[#E5E2DA]">
        <div className="flex items-center justify-between">
          <label className="text-xs font-mono font-bold text-[#111827] uppercase tracking-wider flex items-center gap-1.5">
            <span className="w-5 h-5 rounded-full bg-[#4B5563] text-white flex items-center justify-center text-[10px]">3</span>
            <span>Hemkommun & Skattesats</span>
          </label>
          <span className="text-xs font-mono font-bold text-[#111827]">
            {settings.municipalTaxRate.toFixed(2)}%
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <select
              value={settings.municipality}
              onChange={(e) => {
                const name = e.target.value;
                const found = MUNICIPALITIES.find((m) => m.name === name);
                if (found) {
                  onChange({
                    ...settings,
                    municipality: found.name,
                    municipalTaxRate: found.taxRate,
                  });
                }
              }}
              className="w-full px-3 py-2 rounded-lg border border-[#D1CDC2] bg-[#F8F7F4] text-xs font-mono font-bold text-[#111827] focus:outline-none focus:border-[#14532D] focus:bg-white transition"
            >
              {MUNICIPALITIES.map((m) => (
                <option key={m.name} value={m.name}>
                  {m.name} ({m.taxRate.toFixed(2)}%)
                </option>
              ))}
            </select>
          </div>

          <div>
            <div className="relative">
              <input
                type="number"
                step="0.01"
                min="20"
                max="40"
                value={settings.municipalTaxRate}
                onChange={(e) => update('municipalTaxRate', Number(e.target.value) || 30.0)}
                className="w-full px-3 py-2 rounded-lg border border-[#D1CDC2] bg-[#F8F7F4] text-xs font-mono font-bold text-[#111827] focus:outline-none focus:border-[#14532D] focus:bg-white transition"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-mono text-[#6B7280]">
                % skatt
              </span>
            </div>
          </div>
        </div>

        {/* Schablonavdrag checkbox */}
        <div className="flex items-center justify-between p-3 rounded-lg bg-[#F8F7F4] border border-[#E5E2DA] text-xs">
          <div>
            <div className="font-bold text-[#111827]">
              25% Schablonavdrag för egenavgifter
            </div>
            <div className="text-[11px] text-[#4B5563]">
              Standard i svensk preliminärdeklaration (minskar underlaget för egenavgifter).
            </div>
          </div>
          <input
            type="checkbox"
            checked={settings.includeSchablonavdrag}
            onChange={(e) => update('includeSchablonavdrag', e.target.checked)}
            className="w-4 h-4 accent-[#14532D] rounded cursor-pointer"
          />
        </div>
      </div>

    </div>
  );
};
