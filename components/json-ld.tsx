/**
 * Renders a JSON-LD structured-data script. The payload is fully controlled by
 * us (no user input), so serializing it inline is safe.
 */
export function JsonLd({ data }: { data: Record<string, unknown> }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
