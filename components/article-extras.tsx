import type { ArticleSource, FaqItem } from '@/lib/posts';
import { formatDateLt } from '@/lib/format';

/** Visible FAQ rendered from `faq` frontmatter (mirrors the FAQPage JSON-LD). */
export function ArticleFaq({ items }: { items: FaqItem[] }) {
  if (items.length === 0) return null;

  return (
    <section aria-labelledby="duk">
      <h2 id="duk">Dažniausi klausimai</h2>
      {items.map((item) => (
        <div key={item.q}>
          <h3>{item.q}</h3>
          <p>{item.a}</p>
        </div>
      ))}
    </section>
  );
}

/** "Šaltiniai" list rendered from `sources` frontmatter. */
export function ArticleSources({ sources }: { sources: ArticleSource[] }) {
  if (sources.length === 0) return null;

  return (
    <section aria-labelledby="saltiniai">
      <h2 id="saltiniai">Šaltiniai</h2>
      <ol>
        {sources.map((source) => (
          <li key={source.url}>
            <a href={source.url} target="_blank" rel="noopener noreferrer">
              {source.title}
            </a>
            {source.publisher ? ` — ${source.publisher}` : null}
            {source.date ? `, ${formatDateLt(source.date)}` : null}
          </li>
        ))}
      </ol>
    </section>
  );
}
