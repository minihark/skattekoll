export interface DeductionItem {
  id: string;
  category: string;
  title: string;
  amountText: string;
  description: string;
  skatteverketRule: string;
}

export const DEDUCTIONS_2026: DeductionItem[] = [
  {
    id: 'hemmakontor',
    category: 'Kontor & Lokaler',
    title: 'Schablonavdrag för Hemmakontor',
    amountText: '2 000 kr el. 4 000 kr/år',
    description: 'Om du arbetar minst 800 timmar per år hemma och saknar separat kontor kan du göra schablonavdrag utan kvitton.',
    skatteverketRule: '2 000 kr/år för lägenhet (bostadsrätt/hyresrätt), 4 000 kr/år för villa/fastighet.',
  },
  {
    id: 'milersattning',
    category: 'Resor & Transport',
    title: 'Milersättning för tjänsteresor med privat bil',
    amountText: '25 kr / mil',
    description: 'Kör du din privata bil i näringsverksamheten drar du av 25 kr per mil som en kostnad i företaget.',
    skatteverketRule: 'Förutsätter körjournal med datum, mätarställning, resväg och affärssyfte.',
  },
  {
    id: 'traktamente',
    category: 'Resor & Transport',
    title: 'Skattefritt Traktamente (Inrikes tjänsteresa)',
    amountText: '290 kr / heldag',
    description: 'Schablonersättning för ökade levnadskostnader vid tjänsteresa med övernattning minst 50 km från hemmet.',
    skatteverketRule: 'Heldag (avresa före 12.00 el. hemkomst efter 19.00): 290 kr. Halvdag: 145 kr.',
  },
  {
    id: 'inventarier',
    category: 'Utrustning & IT',
    title: 'Direktavdrag för dator, telefon & skärmar',
    amountText: 'Upp till 29 400 kr / pryl',
    description: 'Inventarier av mindre värde (under ett halvt prisbasbelopp) kan dras av direkt som kostnad samma år istället för avskrivning.',
    skatteverketRule: 'För 2026 är gränsen 29 400 kr exklusive moms.',
  },
  {
    id: 'bredband',
    category: 'Utrustning & IT',
    title: 'Mobilabonnemang & Bredband',
    amountText: 'Faktisk merkostnad (ofta 50%)',
    description: 'Företagsanknutna mobilsamtal och internetuppkoppling som behövs för verksamheten är avdragsgillt.',
    skatteverketRule: 'Om bredbandet står på bostaden krävs att det är ett särskilt tecknat företagsabonnemang eller merkostnad.',
  },
  {
    id: 'representation',
    category: 'Marknadsföring',
    title: 'Enklare förtäring & Kundmöten',
    amountText: 'Max 60 kr + moms / person',
    description: 'Kaffe, smörgås, fralla eller bulle i samband med affärsmöte är avdragsgillt. Måltider medger enbart momsavdrag.',
    skatteverketRule: 'Momsavdrag medges på representationsmåltid upp till 300 kr exkl. moms per person.',
  },
];

export interface TaxCalendarEvent {
  date: string;
  title: string;
  description: string;
  important: boolean;
}

export const SKATTE_CALENDAR_2026: TaxCalendarEvent[] = [
  {
    date: '12:e varje månad',
    title: 'F-skatt / Preliminärskatt förfallodag',
    description: 'Den debiterade preliminärskatten ska vara bokförd på Skatteverkets bankgiro senast den 12:e.',
    important: true,
  },
  {
    date: '12 Maj 2026',
    title: 'Momsdeklaration (Kvartal 1)',
    description: 'Inlämning och betalning av moms för januari–mars.',
    important: false,
  },
  {
    date: '2 Maj 2026',
    title: 'Inkomstdeklaration 1 med NE-bilaga',
    description: 'Sista dagen att lämna privat inkomstdeklaration och näringsbilaga (NE) för föregående inkomstår.',
    important: true,
  },
  {
    date: '17 Augusti 2026',
    title: 'Momsdeklaration (Kvartal 2)',
    description: 'Inlämning och betalning av moms för april–juni.',
    important: false,
  },
  {
    date: '12 November 2026',
    title: 'Momsdeklaration (Kvartal 3)',
    description: 'Inlämning och betalning av moms för juli–september.',
    important: false,
  },
  {
    date: '12 Februari 2027',
    title: 'Momsdeklaration (Kvartal 4)',
    description: 'Inlämning och betalning av moms för oktober–december.',
    important: false,
  },
];
