export type BusinessType = 'enskild_firma' | 'aktiebolag';
export type PeriodType = 'monthly' | 'yearly';

export interface TaxSettings {
  businessType: BusinessType;
  period: PeriodType;
  revenue: number; // exkl. moms
  vatRate: number; // 25, 12, 6, 0
  expenses: number; // exkl. moms
  expensesVatRate: number; // 25, 12, 6, 0
  municipality: string;
  municipalTaxRate: number; // e.g. 32.60 for Göteborg
  includeSchablonavdrag: boolean; // 25% standard for enskild firma
  otherIncomeYearly: number; // Annan anställning / lön som påverkar brytpunkt
  isPro: boolean;
}

export interface TaxCalculationResult {
  revenueYearly: number;
  expensesYearly: number;
  profitBeforeTaxYearly: number;
  
  // VAT
  outgoingVat: number;
  incomingVat: number;
  netVatToPay: number;

  // Enskild Firma breakdown
  schablonAvdrag: number;
  egenavgifterBase: number;
  egenavgifter: number;
  egenavgifterNedsattning: number;
  taxableIncome: number;
  grundavdrag: number;
  taxableAfterGrundavdrag: number;
  kommunalskatt: number;
  statligSkatt: number;
  jobbskatteavdrag: number;
  totalInkomstskatt: number;

  // Safe Cash Payout
  safeNetPayoutYearly: number;
  safeNetPayoutMonthly: number;
  effectiveTaxRate: number; // % av vinsten

  // Three Pots Distribution
  pots: {
    safePersonalPayout: number; // Fria pengar till privatkonto
    taxReserve: number; // Egenavgifter + Inkomstskatt till skattekontot
    vatReserve: number; // Moms att hålla på momskontot
  };

  // Aktiebolag alternative simulation
  abSimulation: {
    salaryYearly: number;
    salaryTaxes: number;
    arbetsgivaravgifter: number;
    bolagsskatt: number;
    dividends: number;
    dividendTax: number;
    netInPocket: number;
    differenceVsEnskildFirma: number;
  };
}

export interface Municipality {
  name: string;
  taxRate: number;
}
