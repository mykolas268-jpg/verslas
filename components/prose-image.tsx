import Image from 'next/image';

interface ProseImageProps {
  src: string;
  alt: string;
  caption?: string;
  width?: number;
  height?: number;
}

/**
 * Image with an optional caption for use inside MDX articles. Uses next/image
 * for sizing + lazy-loading; pass real intrinsic dimensions where known.
 */
export function ProseImage({
  src,
  alt,
  caption,
  width = 1200,
  height = 750,
}: ProseImageProps) {
  return (
    <figure className="my-8">
      <div className="overflow-hidden rounded-2xl border border-line bg-surface">
        <Image
          src={src}
          alt={alt}
          width={width}
          height={height}
          sizes="(max-width: 768px) 100vw, 768px"
          className="h-auto w-full"
        />
      </div>
      {caption ? (
        <figcaption className="mt-3 text-center text-sm text-muted">
          {caption}
        </figcaption>
      ) : null}
    </figure>
  );
}
