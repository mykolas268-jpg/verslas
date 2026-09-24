import type { Metadata } from 'next';
import Link from 'next/link';
import { PageHeader } from '@/components/page-header';
import { formatDateLt } from '@/lib/format';
import { siteConfig } from '@/lib/site';

const UPDATED = '2026-09-24';

export const metadata: Metadata = {
  title: 'Kaip rengiame straipsnius',
  description:
    'Kaip „verslas.ai“ rengia straipsnius: šaltiniai ir faktų tikrinimas, dirbtinio intelekto pagalba, žmogaus peržiūra, taisymai ir atsakomybė.',
  alternates: { canonical: '/kaip-rengiame-straipsnius' },
};

export default function EditorialPolicyPage() {
  return (
    <div className="mx-auto max-w-content px-5 py-12 sm:px-8 sm:py-16">
      <PageHeader
        eyebrow="Redakcinė politika"
        title="Kaip rengiame straipsnius"
        description="Trumpai ir atvirai: iš kur imame informaciją, kaip naudojame dirbtinį intelektą ir kas atsako už tai, kas paskelbta."
      />

      <div className="prose mt-10 max-w-prose prose-headings:font-serif">
        <p className="text-sm text-muted">
          Atnaujinta{' '}
          <time dateTime={UPDATED}>{formatDateLt(UPDATED)}</time>
        </p>

        <h2>Kas atsako už turinį</h2>
        <p>
          „verslas.ai“ leidžia {siteConfig.publisher.legalName}. Už straipsnių
          turinį atsako {siteConfig.publisher.editor}: jis peržiūri ir
          patvirtina kiekvieną straipsnį prieš paskelbimą.
        </p>

        <h2>Kaip naudojame dirbtinį intelektą</h2>
        <p>
          Straipsniams rengti naudojame dirbtinio intelekto (DI) įrankius. Jie
          padeda surinkti informaciją iš šaltinių, parengti juodraštį ir
          patikrinti kalbą. DI nieko nepublikuoja savarankiškai — kiekvieną
          straipsnį prieš paskelbimą peržiūri ir patvirtina žmogus.
        </p>
        <p>
          Nuo 2026 m. rugsėjo straipsniai, kuriems rengti naudotas DI, pažymėti
          eilute po antrašte.
        </p>

        <h2>Šaltiniai ir faktai</h2>
        <ul>
          <li>
            Faktus — kainas, datas, versijas, prieinamumą Lietuvoje ir ES —
            tikriname pirminiuose šaltiniuose: gamintojų pranešimuose,
            dokumentacijoje, kainų puslapiuose. Jei pirminio šaltinio nėra,
            remiamės bent dviem nepriklausomais patikimais šaltiniais.
          </li>
          <li>
            Ko nepavyksta patvirtinti, neskelbiame arba aiškiai pažymime kaip
            nepatvirtintą informaciją.
          </li>
          <li>Naudotus šaltinius nurodome straipsnio pabaigoje.</li>
          <li>
            Kainas nurodome originalia valiuta. Jei perskaičiuojame į eurus,
            nurodome kursą ir datą.
          </li>
        </ul>

        <h2>Pavyzdžiai ir nuomonės</h2>
        <p>
          Iliustraciniai pavyzdžiai (pvz., „įsivaizduokime kavinę…“) visada
          aiškiai pažymėti kaip pavyzdžiai. Savo nuomonę ir rekomendacijas
          atskiriame nuo faktų. Neskelbiame išgalvotų atsiliepimų, citatų ar
          klientų istorijų.
        </p>

        <h2>Datos ir atnaujinimai</h2>
        <p>
          Kiekviename straipsnyje nurodyta paskelbimo data. Kai straipsnį iš
          esmės atnaujiname — pavyzdžiui, pasikeitė kaina ar prieinamumas —,
          nurodome atnaujinimo datą ir trumpai parašome, kas pasikeitė.
        </p>

        <h2>Klaidos ir taisymai</h2>
        <p>
          Pastebėjai klaidą? Parašyk mums{' '}
          <a href={`mailto:${siteConfig.contactEmail}`}>{siteConfig.contactEmail}</a>.
          Faktines klaidas taisome kuo greičiau ir straipsnyje pažymime, kas
          pataisyta.
        </p>

        <h2>Komercinis interesas</h2>
        <p>
          „verslas.ai“ teikia mokamas paslaugas, pavyzdžiui,{' '}
          <Link href="/reklaminis-video">reklaminio video kūrimą</Link>.
          Straipsniuose kartais paminime savo paslaugas — tai visada aiškiai
          matyti. Jei straipsnyje būtų remiamo turinio, jis bus aiškiai
          pažymėtas.
        </p>
      </div>
    </div>
  );
}
