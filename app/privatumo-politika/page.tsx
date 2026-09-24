import type { Metadata } from 'next';
import { PageHeader } from '@/components/page-header';
import { formatDateLt } from '@/lib/format';
import { siteConfig } from '@/lib/site';

/**
 * Describes the processing that actually happens today. Update it (and
 * UPDATED) whenever analytics, a form backend or a new processor goes live.
 */
const UPDATED = '2026-09-24';

export const metadata: Metadata = {
  title: 'Privatumo politika',
  description:
    'Kaip „verslas.ai“ tvarko asmens duomenis: kokius duomenis gauname, kodėl, kam juos perduodame, kiek laiko saugome ir kokias teises turite.',
  alternates: { canonical: '/privatumo-politika' },
};

export default function PrivacyPolicyPage() {
  const email = siteConfig.contactEmail;

  return (
    <div className="mx-auto max-w-content px-5 py-12 sm:px-8 sm:py-16">
      <PageHeader eyebrow="Teisinė informacija" title="Privatumo politika" />

      <div className="prose mt-10 max-w-prose prose-headings:font-serif">
        <p className="text-sm text-muted">
          Paskutinį kartą atnaujinta{' '}
          <time dateTime={UPDATED}>{formatDateLt(UPDATED)}</time>
        </p>

        <h2>Kas tvarko jūsų duomenis</h2>
        <p>
          Duomenų valdytojas — {siteConfig.publisher.legalName}, valdanti
          svetainę verslas.ai. Kontaktai: <a href={`mailto:${email}`}>{email}</a>.
        </p>

        <h2>Kokius duomenis gauname ir kodėl</h2>
        <h3>Kai rašote mums arba naudojate užsakymo ar laukiančiųjų sąrašo formą</h3>
        <p>
          Šiuo metu svetainės formos duomenų nesaugo ir niekam neperduoda: jos
          atidaro jūsų el. pašto programą su paruoštu laišku. Gavę laišką,
          tvarkome jame pateiktus duomenis — vardą, el. pašto adresą, telefono
          numerį (jei jį nurodote) ir žinutės turinį —, kad atsakytume į
          užklausą ir suteiktume paslaugą. Teisinis pagrindas — veiksmai prieš
          sudarant sutartį ir sutarties vykdymas (BDAR 6 straipsnio 1 dalies b
          punktas).
        </p>
        <h3>Techniniai duomenys</h3>
        <p>
          Svetainę talpina Vercel Inc. Jums lankantis svetainėje, prieglobos
          paslaugų teikėjas serverių žurnaluose ribotą laiką saugo techninius
          duomenis (pavyzdžiui, IP adresą, naršyklės tipą, užklausos laiką),
          reikalingus svetainės veikimui ir saugumui užtikrinti. Teisinis
          pagrindas — teisėtas interesas užtikrinti svetainės veikimą ir
          saugumą (BDAR 6 straipsnio 1 dalies f punktas).
        </p>
        <h3>Slapukai ir naršyklės saugykla</h3>
        <p>
          Nenaudojame analitikos ar reklamos slapukų. Svetainė jūsų naršyklėje
          (localStorage) išsaugo tik pasirinktą šviesų arba tamsų režimą; ši
          informacija mums neperduodama.
        </p>

        <h2>Kam perduodame duomenis</h2>
        <ul>
          <li>Vercel Inc. — svetainės prieglobos paslaugos (JAV).</li>
          <li>El. pašto paslaugų teikėjui, per kurį gauname ir siunčiame laiškus.</li>
        </ul>
        <p>
          Duomenų neparduodame ir nenaudojame reklamai. Kai duomenys
          perduodami už Europos ekonominės erdvės ribų (pavyzdžiui, į JAV),
          taikomos BDAR numatytos apsaugos priemonės, pavyzdžiui, Europos
          Komisijos patvirtintos standartinės sutarčių sąlygos.
        </p>

        <h2>Kiek laiko saugome</h2>
        <p>
          Užklausų laiškus saugome tol, kol reikia atsakyti į užklausą ir
          suteikti paslaugą. Su sutartimis ir apskaita susijusius dokumentus
          saugome tiek, kiek reikalauja Lietuvos Respublikos teisės aktai.
        </p>

        <h2>Jūsų teisės</h2>
        <p>
          Turite teisę susipažinti su savo duomenimis, juos ištaisyti, ištrinti,
          apriboti jų tvarkymą, nesutikti su tvarkymu ir gauti savo duomenis
          perkeliamu formatu. Kreipkitės <a href={`mailto:${email}`}>{email}</a> —
          atsakysime ne vėliau kaip per mėnesį.
        </p>
        <p>
          Jei manote, kad jūsų duomenys tvarkomi netinkamai, galite pateikti
          skundą Valstybinei duomenų apsaugos inspekcijai (
          <a href="https://vdai.lrv.lt" target="_blank" rel="noopener noreferrer">
            vdai.lrv.lt
          </a>
          ).
        </p>

        <h2>Pakeitimai</h2>
        <p>
          Pasikeitus duomenų tvarkymui (pavyzdžiui, įdiegus lankomumo
          statistiką ar naują užklausų formą), šią politiką atnaujinsime ir
          nurodysime atnaujinimo datą.
        </p>
      </div>
    </div>
  );
}
