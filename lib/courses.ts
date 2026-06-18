/**
 * Course catalogue. Data-driven so real courses can be dropped in later with
 * no layout changes — flip `status` to 'available' and add an `href`.
 *
 * TODO: replace these placeholder entries with real course data.
 */

export type CourseStatus = 'available' | 'coming-soon';

export interface Course {
  slug: string;
  title: string;
  summary: string;
  level: string;
  duration: string;
  topics: string[];
  status: CourseStatus;
  /** Set when status is 'available'. */
  href?: string;
}

export const courses: Course[] = [
  {
    slug: 'ai-pagrindai-verslui',
    title: 'AI pagrindai verslui',
    summary:
      'Nuo nulio iki pirmų realių rezultatų: kaip kalbėti su modeliais, kurti promptus ir pritaikyti juos kasdienėms verslo užduotims.',
    level: 'Pradedantiesiems',
    duration: '6 savaitės',
    topics: ['Promptai', 'Automatizavimas', 'Klientų aptarnavimas'],
    status: 'coming-soon',
  },
  {
    slug: 'ai-rinkodara-ir-turinys',
    title: 'AI rinkodarai ir turiniui',
    summary:
      'Produktų aprašymai, socialiniai tinklai, naujienlaiškiai ir SEO tekstai — kaip su AI kurti vientiso tono turinį dideliais kiekiais.',
    level: 'Vidutinis lygis',
    duration: '4 savaitės',
    topics: ['Rinkodara', 'Turinys', 'SEO'],
    status: 'coming-soon',
  },
  {
    slug: 'ai-procesu-automatizavimas',
    title: 'Procesų automatizavimas su AI',
    summary:
      'Kaip sujungti AI su įrankiais, kuriuos jau naudoji, ir automatizuoti pasikartojančius darbus — be programavimo patirties.',
    level: 'Pažengusiems',
    duration: '5 savaitės',
    topics: ['Automatizavimas', 'Integracijos', 'Procesai'],
    status: 'coming-soon',
  },
];
