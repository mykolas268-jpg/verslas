import Link from 'next/link';
import type { ComponentPropsWithoutRef } from 'react';
import { Callout } from './callout';
import { ProseImage } from './prose-image';

function MdxLink({ href = '', children, ...rest }: ComponentPropsWithoutRef<'a'>) {
  const isInternal = href.startsWith('/') || href.startsWith('#');
  if (isInternal) {
    return (
      <Link href={href} {...rest}>
        {children}
      </Link>
    );
  }
  return (
    <a href={href} target="_blank" rel="noopener noreferrer" {...rest}>
      {children}
    </a>
  );
}

function MdxImage({ src, alt }: ComponentPropsWithoutRef<'img'>) {
  return <ProseImage src={typeof src === 'string' ? src : ''} alt={alt ?? ''} />;
}

/**
 * Component map handed to the MDX compiler. Markdown links route through
 * next/link (internal) or open safely in a new tab (external); markdown images
 * become captioned <ProseImage>; and authors can use <Callout>/<ProseImage>
 * directly in their .mdx files.
 */
export const mdxComponents = {
  a: MdxLink,
  img: MdxImage,
  Callout,
  ProseImage,
};
