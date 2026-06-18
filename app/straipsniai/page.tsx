import type { Metadata } from 'next';
import { getAllPostsMeta, getAllTags } from '@/lib/posts';
import { ArticleSearch } from '@/components/article-search';
import { PageHeader } from '@/components/page-header';
import { CTA } from '@/components/cta';
import { Reveal } from '@/components/reveal';

export const metadata: Metadata = {
  title: 'Straipsniai',
  description:
    'Visi „verslas.ai“ straipsniai apie dirbtinio intelekto pritaikymą versle. Ieškok pagal raktažodį ar temą.',
  alternates: { canonical: '/straipsniai' },
};

export default function StraipsniaiPage() {
  const posts = getAllPostsMeta();
  const tags = getAllTags();

  return (
    <div className="mx-auto max-w-content px-5 py-12 sm:px-8 sm:py-16">
      <Reveal>
        <PageHeader
          eyebrow="Tinklaraštis"
          title="Straipsniai"
          description="Praktiniai pavyzdžiai, kaip dirbtinis intelektas padeda realiems verslams. Ieškok pagal raktažodį arba filtruok pagal temą."
        />
      </Reveal>

      <div className="mt-10">
        <ArticleSearch posts={posts} tags={tags} />
      </div>

      <Reveal>
        <div className="pt-20">
          <CTA />
        </div>
      </Reveal>
    </div>
  );
}
