/**
 * Single source of truth for the reklaminis-video offer. Data-driven so copy,
 * price and examples can change without touching the page layout.
 *
 * All user-facing strings are Lithuanian.
 */

export const offer = {
  price: 99,
  currency: '€',
  lengthLabel: '20–30 sek.',
  deliveryLabel: '4 darbo dienos',
  revisions: 1,
} as const;

/** Short chips shown under the hero headline. */
export const offerHighlights: string[] = [
  `${offer.lengthLabel} klipas`,
  `Paruošta per ${offer.deliveryLabel}`,
  'Subtitrai lietuviškai',
  'Vertikalus arba horizontalus',
];

export interface OfferStep {
  title: string;
  description: string;
}

/** "Kaip tai veikia" — the four-step flow. */
export const offerSteps: OfferStep[] = [
  {
    title: 'Parašai, ką reklamuoji',
    description:
      'Užpildai trumpą formą: produktas ar paslauga, viena žinutė ir kur klipą naudosi. Užtenka kelių sakinių.',
  },
  {
    title: 'Paruošiam klipą',
    description: `Sumontuojam ${offer.lengthLabel} klipą su tekstu, muzika ir subtitrais lietuviškai. Iš tavo nuotraukų ar mūsų medžiagos.`,
  },
  {
    title: 'Peržiūri ir pataisom',
    description: `Atsiunčiam pavyzdį. Vienas taisymų ratas įskaičiuotas — pakeičiam tekstą, muziką ar tempą, kol tinka.`,
  },
  {
    title: 'Kelia į reklamą',
    description:
      'Gauni paruoštą failą tinkamu formatu „Instagram", „TikTok" ar „Facebook" reklamai. Visos teisės — tavo.',
  },
];

/** What 99 € includes / excludes — kept explicit so there are no surprises. */
export const offerIncludes: string[] = [
  `Vienas ${offer.lengthLabel} reklaminis klipas`,
  'Tekstas, muzika ir subtitrai lietuviškai',
  'Vertikalus (9:16) arba horizontalus (16:9) formatas',
  `Paruošta per ${offer.deliveryLabel}`,
  'Vienas taisymų ratas',
];

export const offerExcludes: string[] = [
  'Gyvas filmavimas su kamera vietoje',
  'Aktoriai ar balso įgarsinimas įrašų studijoje',
  'Licencijuota muzika didelėms TV kampanijoms',
];

export interface UseCase {
  title: string;
  category: string;
  description: string;
  /**
   * Illustrative poster from /public/images (dark, portrait-friendly assets
   * only). Omit to fall back to the accent-gradient tile.
   */
  poster?: string;
  /** Set when a real clip exists (YouTube/Vimeo/MP4 URL). Falsy → poster only. */
  videoUrl?: string;
}

/**
 * "Ką galime padaryti" — capability examples by use-case, NOT a claimed
 * client portfolio. Posters are illustrations; add `videoUrl` to a card once a
 * real sample clip is ready and it becomes a playable example.
 */
export const useCases: UseCase[] = [
  {
    title: 'Nekilnojamojo turto apžvalga',
    category: 'Brokeriams',
    description:
      'Buto ar namo video turas iš nuotraukų — daugiau peržiūrų nei dešimt statiškų kadrų.',
    poster: '/images/ai-video-turai-brokeriams.webp',
  },
  {
    title: 'Produkto klipas e-parduotuvei',
    category: 'E-prekyba',
    description:
      'Trumpas klipas kiekvienam populiariam produktui iš turimų nuotraukų.',
    poster: '/images/ai-produktu-aprasymai.svg',
  },
  {
    title: 'Nuolatinis turinio srautas',
    category: 'Soc. tinklai',
    description:
      'Keli klipai per mėnesį — akcija, naujiena, sezono pasiūlymas.',
    poster: '/images/ai-video-turu-srautas.webp',
  },
  {
    title: 'Paslaugos pristatymas',
    category: 'Paslaugų verslui',
    description:
      'Aiški žinutė apie paslaugą ir kvietimas registruotis — klinikoms, salonams, meistrams.',
  },
];
