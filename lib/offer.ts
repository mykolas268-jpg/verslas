/**
 * Single source of truth for the AI consultation offer. Data-driven so copy,
 * price and examples can change without touching the page layout.
 *
 * All user-facing strings are Lithuanian.
 */

export const offer = {
  price: 0,
  priceLabel: 'Nemokama',
  currency: '€',
  lengthLabel: '30 min.',
  deliveryLabel: 'per 1-2 darbo dienas',
} as const;

/** Short chips shown under the hero headline. */
export const offerHighlights: string[] = [
  `${offer.lengthLabel} pokalbis`,
  'Be įsipareigojimų',
  'Konkretūs patarimai tavo verslui',
  'Nuotoliniu būdu',
];

export interface OfferStep {
  title: string;
  description: string;
}

/** "Kaip tai veikia" - the four-step flow. */
export const offerSteps: OfferStep[] = [
  {
    title: 'Užpildai formą',
    description:
      'Parašyk keliais sakiniais, kuo užsiimi ir kur norėtum pritaikyti AI. Kuo konkrečiau - tuo geriau pasiruošim.',
  },
  {
    title: 'Susitariam laiką',
    description:
      'Per 1-2 darbo dienas atsiųsim patvirtinimą ir nuorodą į vaizdo skambutį.',
  },
  {
    title: '30 min. pokalbis',
    description:
      'Aptariam tavo verslo procesus ir parodom, kuriuos galima automatizuoti su AI jau šiandien. Be teorijos - tik tai, kas aktualu tau.',
  },
  {
    title: 'Gauni veiksmų planą',
    description:
      'Po pokalbio atsiųsim trumpą santrauką: ką daryti pirmiausia, kokius įrankius naudoti ir kur tikėtis didžiausio efekto.',
  },
];

/** What the consultation includes / excludes. */
export const offerIncludes: string[] = [
  '30 min. vaizdo skambutis (Google Meet / Zoom)',
  'Individualūs patarimai tavo verslo situacijai',
  'Konkrečių AI įrankių rekomendacijos',
  'Veiksmų planas po pokalbio el. paštu',
  'Be jokių įsipareigojimų',
];

export const offerExcludes: string[] = [
  'Techninė AI sistemų integracija',
  'Ilgalaikė priežiūra ar palaikymas',
  'Programavimo ar kūrimo darbai',
];

export interface UseCase {
  title: string;
  category: string;
  description: string;
  poster?: string;
  videoUrl?: string;
}

/**
 * "Kam tai tinka" - consultation use-case examples by industry.
 */
export const useCases: UseCase[] = [
  {
    title: 'AI klientų aptarnavimui',
    category: 'Paslaugų verslui',
    description:
      'Chatbot\'ai, automatiniai atsakymai, klientų užklausų rūšiavimas - parenkam tinkamiausią sprendimą tavo verslui.',
    poster: '/images/konsultacija-klientu-aptarnavimas.jpg',
  },
  {
    title: 'Turinio kūrimas su AI',
    category: 'Rinkodara',
    description:
      'Socialinių tinklų įrašai, straipsniai, reklaminiai tekstai - parodom, kaip kurti greičiau ir kokybiškiau.',
    poster: '/images/konsultacija-turinio-kurimas.jpg',
  },
  {
    title: 'Procesų automatizavimas',
    category: 'Operacijos',
    description:
      'Sąskaitų apdorojimas, ataskaitų generavimas, duomenų analizė - surandame, kur AI sutaupo daugiausia laiko.',
    poster: '/images/konsultacija-procesu-automatizavimas.jpg',
  },
  {
    title: 'AI strategija verslui',
    category: 'Strategija',
    description:
      'Nežinai, nuo ko pradėti? Padedame sudėlioti prioritetus ir pasirinkti pirmus žingsnius.',
    poster: '/images/konsultacija-ai-strategija.jpg',
  },
];
