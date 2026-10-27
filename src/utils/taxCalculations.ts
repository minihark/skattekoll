import { TaxSettings, TaxCalculationResult, Municipality } from '../types';

export const MUNICIPALITIES: Municipality[] = [
  { name: 'Göteborg', taxRate: 32.60 },
  { name: 'Stockholm', taxRate: 29.82 },
  { name: 'Malmö', taxRate: 32.42 },
  { name: 'Uppsala', taxRate: 32.70 },
  { name: 'Linköping', taxRate: 31.75 },
  { name: 'Västerås', taxRate: 31.24 },
  { name: 'Örebro', taxRate: 33.15 },
  { name: 'Helsingborg', taxRate: 31.52 },
  { name: 'Jönköping', taxRate: 33.45 },
  { name: 'Umeå', taxRate: 34.15 },
  { name: 'Lund', taxRate: 32.38 },
  { name: 'Rikssnitt (Sverige)', taxRate: 32.37 },
];

export const PRISBASBELOPP_2026 = 58800;
export const INKOMSTBASBELOPP_2026 = 80600; // Förhöjt IBB för 2026 K10-beräkning (4 IBB = 322 400 kr)
const STATLIG_SKATT_BRYTPUNKT = 615300; // Brytpunkt för statlig inkomstskatt 20%
const EGENAVGIFTER_RATE = 0.2897; // 28.97%
const ARBETSGIVARAVGIFTER_RATE = 0.3142; // 31.42%
const BOLAGSSKATT_RATE = 0.206; // 20.6%
export const FORENKLINGSREGELN_OLD_LIMIT = 209550; // Äldre 2.75 IBB
export const K10_GRUNDBELOPP_2026 = 4 * INKOMSTBASBELOPP_2026; // 322 400 kr (2026 års 3:12-reform: 4 IBB)
export const K10_LONAVDRAG_2026 = 8 * INKOMSTBASBELOPP_2026; // 644 800 kr (8 IBB avdrag vid lönebaserat utrymme)

/**
 * Calculates Swedish Grundavdrag for 2026 based on earned income
 */
export function calculateGrundavdrag(earnedIncome: number): number {
  const pbb = PRISBASBELOPP_2026;
  if (earnedIncome <= 0.99 * pbb) {
    return Math.round(0.423 * pbb);
  } else if (earnedIncome <= 2.72 * pbb) {
    return Math.round(0.423 * pbb + 0.20 * (earnedIncome - 0.99 * pbb));
  } else if (earnedIncome <= 3.11 * pbb) {
    return Math.round(0.77 * pbb);
  } else if (earnedIncome <= 7.88 * pbb) {
    return Math.round(0.77 * pbb - 0.10 * (earnedIncome - 3.11 * pbb));
  } else {
    return Math.round(0.293 * pbb);
  }
}

/**
 * Calculates Swedish Jobbskatteavdrag for 2026
 */
export function calculateJobbskatteavdrag(earnedIncome: number, municipalTaxRate: number): number {
  if (earnedIncome <= 0) return 0;
  const pbb = PRISBASBELOPP_2026;
  const t = municipalTaxRate / 100;
  const grundavdrag = calculateGrundavdrag(earnedIncome);

  let underlag = 0;
  if (earnedIncome <= 0.91 * pbb) {
    underlag = earnedIncome - grundavdrag;
  } else if (earnedIncome <= 3.24 * pbb) {
    underlag = 0.91 * pbb + 0.387 * (earnedIncome - 0.91 * pbb) - grundavdrag;
  } else if (earnedIncome <= 8.08 * pbb) {
    underlag = 1.81 * pbb + 0.128 * (earnedIncome - 3.24 * pbb) - grundavdrag;
  } else if (earnedIncome <= 13.54 * pbb) {
    underlag = 2.43 * pbb - grundavdrag;
  } else {
    // Avtrappning
    const standardMax = 2.43 * pbb - grundavdrag;
    const reduction = 0.03 * (earnedIncome - 13.54 * pbb);
    underlag = Math.max(0, standardMax - reduction);
  }

  const avdrag = Math.max(0, underlag * t);
  return Math.round(avdrag);
}

/**
 * Main tax calculator running full Swedish fiscal simulation
 */
export function calculateTaxes(settings: TaxSettings): TaxCalculationResult {
  const multiplier = settings.period === 'monthly' ? 12 : 1;
  const revenueYearly = Math.max(0, settings.revenue * multiplier);
  const expensesYearly = Math.max(0, settings.expenses * multiplier);

  // 1. VAT Calculations
  const outgoingVat = revenueYearly * (settings.vatRate / 100);
  const incomingVat = expensesYearly * (settings.expensesVatRate / 100);
  const netVatToPay = Math.max(0, outgoingVat - incomingVat);

  // 2. Business Profit before tax
  const profitBeforeTaxYearly = Math.max(0, revenueYearly - expensesYearly);

  // 3. Enskild Firma - Egenavgifter
  let schablonAvdrag = 0;
  let egenavgifterBase = profitBeforeTaxYearly;

  if (settings.includeSchablonavdrag && profitBeforeTaxYearly > 0) {
    schablonAvdrag = Math.round(profitBeforeTaxYearly * 0.25);
    egenavgifterBase = profitBeforeTaxYearly - schablonAvdrag;
  }

  // Egenavgifter rate with nedsättning (7.5% upp till 15 000 kr)
  let rawEgenavgifter = egenavgifterBase * EGENAVGIFTER_RATE;
  let nedsattning = Math.min(15000, egenavgifterBase * 0.075);
  let egenavgifter = Math.max(0, Math.round(rawEgenavgifter - nedsattning));

  // 4. Inkomstskatt
  const taxableIncome = Math.max(0, profitBeforeTaxYearly - egenavgifter);
  const totalEarnedIncome = taxableIncome + (settings.otherIncomeYearly || 0);

  const grundavdrag = calculateGrundavdrag(totalEarnedIncome);
  const taxableAfterGrundavdrag = Math.max(0, totalEarnedIncome - grundavdrag);

  // Kommunalskatt
  const kommunalskatt = Math.round(taxableAfterGrundavdrag * (settings.municipalTaxRate / 100));

  // Statlig inkomstskatt (20% ovanför brytpunkten)
  let statligSkatt = 0;
  if (taxableAfterGrundavdrag > STATLIG_SKATT_BRYTPUNKT) {
    statligSkatt = Math.round((taxableAfterGrundavdrag - STATLIG_SKATT_BRYTPUNKT) * 0.20);
  }

  // Jobbskatteavdrag
  const jobbskatteavdrag = calculateJobbskatteavdrag(totalEarnedIncome, settings.municipalTaxRate);

  // Slutlig inkomstskatt
  const totalInkomstskatt = Math.max(0, Math.round(kommunalskatt + statligSkatt - jobbskatteavdrag));

  // 5. Safe Cash Payout (Pengar i plånboken)
  const totalTaxYearly = egenavgifter + totalInkomstskatt;
  const safeNetPayoutYearly = Math.max(0, profitBeforeTaxYearly - totalTaxYearly);
  const safeNetPayoutMonthly = Math.round(safeNetPayoutYearly / 12);

  const effectiveTaxRate = profitBeforeTaxYearly > 0
    ? +((totalTaxYearly / profitBeforeTaxYearly) * 100).toFixed(1)
    : 0;

  // Pots per selected period (monthly or yearly)
  const periodDivisor = settings.period === 'monthly' ? 12 : 1;
  const pots = {
    safePersonalPayout: Math.round(safeNetPayoutYearly / periodDivisor),
    taxReserve: Math.round(totalTaxYearly / periodDivisor),
    vatReserve: Math.round(netVatToPay / periodDivisor),
  };

  // 6. Aktiebolag Comparison Simulation (2026 3:12 K10 Reform: Grundbelopp 4 IBB = 322 400 kr)
  // In an AB with same profit: Pay salary up to brytpunkt (~51 275 kr/mån), rest as 3:12 low-tax dividend (20%)
  const abProfit = profitBeforeTaxYearly;
  let abSalary = 0;
  let abArbetsgivaravgifter = 0;
  let abBolagsskatt = 0;
  let profitAfterTax = 0;
  let abDividends = 0;
  let abDividendTax = 0;
  let abSalaryTaxes = 0;
  let abNetSalary = 0;

  if (abProfit > 0) {
    // Optimal salary up to brytpunkt
    const maxSalaryPossible = abProfit / (1 + ARBETSGIVARAVGIFTER_RATE);
    abSalary = Math.min(STATLIG_SKATT_BRYTPUNKT, maxSalaryPossible);
    abArbetsgivaravgifter = Math.round(abSalary * ARBETSGIVARAVGIFTER_RATE);

    // Salary tax
    const salGrundavdrag = calculateGrundavdrag(abSalary);
    const salTaxable = Math.max(0, abSalary - salGrundavdrag);
    const salKommunal = salTaxable * (settings.municipalTaxRate / 100);
    const salJobbavdrag = calculateJobbskatteavdrag(abSalary, settings.municipalTaxRate);
    abSalaryTaxes = Math.max(0, Math.round(salKommunal - salJobbavdrag));
    abNetSalary = abSalary - abSalaryTaxes;

    // Remaining profit in AB taxed at 20.6%
    const remainingProfit = Math.max(0, abProfit - abSalary - abArbetsgivaravgifter);
    abBolagsskatt = Math.round(remainingProfit * BOLAGSSKATT_RATE);
    profitAfterTax = Math.max(0, remainingProfit - abBolagsskatt);

    // Dividends up to 2026 Grundbelopp (4 IBB = 322 400 kr) at 20% tax
    abDividends = Math.min(K10_GRUNDBELOPP_2026, profitAfterTax);
    abDividendTax = Math.round(abDividends * 0.20);
  }

  const k10HuvudregelClassicLimit = Math.round(abSalary * 0.5);
  const retainedEarningsYearly = Math.max(0, Math.round(profitAfterTax - abDividends));
  const abNetDividends = abDividends - abDividendTax;
  const abNetTotal = Math.round(abNetSalary + abNetDividends);
  const differenceVsEnskildFirma = abNetTotal - safeNetPayoutYearly;

  return {
    revenueYearly,
    expensesYearly,
    profitBeforeTaxYearly,
    outgoingVat,
    incomingVat,
    netVatToPay,
    schablonAvdrag,
    egenavgifterBase,
    egenavgifter,
    egenavgifterNedsattning: nedsattning,
    taxableIncome,
    grundavdrag,
    taxableAfterGrundavdrag,
    kommunalskatt,
    statligSkatt,
    jobbskatteavdrag,
    totalInkomstskatt,
    safeNetPayoutYearly,
    safeNetPayoutMonthly,
    effectiveTaxRate,
    pots,
    abSimulation: {
      salaryYearly: Math.round(abSalary),
      salaryTaxes: abSalaryTaxes,
      arbetsgivaravgifter: abArbetsgivaravgifter,
      bolagsskatt: abBolagsskatt,
      profitAfterCorporateTax: Math.round(profitAfterTax),
      k10ForenklingsregelLimit: FORENKLINGSREGELN_OLD_LIMIT,
      k10Grundbelopp2026Limit: K10_GRUNDBELOPP_2026,
      k10HuvudregelClassicLimit,
      dividends: Math.round(abDividends),
      dividendTax: abDividendTax,
      retainedEarningsYearly,
      netInPocket: abNetTotal,
      differenceVsEnskildFirma,
    }
  };
}

export function formatSEK(amount: number): string {
  return new Intl.NumberFormat('sv-SE', {
    maximumFractionDigits: 0,
  }).format(Math.round(amount)) + ' kr';
}
