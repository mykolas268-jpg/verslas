'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import type { ChangeEvent } from 'react';
import { useRouter } from 'next/navigation';
import type { AdminPostDraft } from '@/lib/admin/service';
import { slugify } from '@/lib/admin/slug';
import { IconArrowRight } from '@/components/icons';

const todayIso = () => new Date().toISOString().slice(0, 10);

interface PostEditorProps {
  mode: 'create' | 'edit';
  initial?: AdminPostDraft;
}

const fieldLabel = 'mb-1.5 block text-sm font-medium text-ink';

export function PostEditor({ mode, initial }: PostEditorProps) {
  const router = useRouter();

  const [title, setTitle] = useState(initial?.title ?? '');
  const [slug, setSlug] = useState(initial?.slug ?? '');
  const [slugTouched, setSlugTouched] = useState(mode === 'edit');
  const [date, setDate] = useState(initial?.date || todayIso());
  const [excerpt, setExcerpt] = useState(initial?.excerpt ?? '');
  const [tags, setTags] = useState((initial?.tags ?? []).join(', '));
  const [cover, setCover] = useState(initial?.cover ?? '');
  const [draft, setDraft] = useState(initial?.draft ?? true);
  const [body, setBody] = useState(initial?.body ?? '');

  const [previewHtml, setPreviewHtml] = useState('');
  const [previewError, setPreviewError] = useState('');
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Auto-generate the slug from the title until the user edits it (create only).
  useEffect(() => {
    if (mode === 'create' && !slugTouched) {
      setSlug(slugify(title));
    }
  }, [title, slugTouched, mode]);

  const fetchPreview = useCallback(async (value: string) => {
    try {
      const res = await fetch('/api/admin/preview', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ body: value }),
      });
      const data = await res.json();
      if (res.ok) {
        setPreviewHtml(data.html);
        setPreviewError('');
      } else {
        setPreviewError(data.error ?? 'Peržiūros klaida.');
      }
    } catch {
      setPreviewError('Peržiūros klaida.');
    }
  }, []);

  // Debounced live preview.
  useEffect(() => {
    const id = setTimeout(() => fetchPreview(body), 500);
    return () => clearTimeout(id);
  }, [body, fetchPreview]);

  async function onUpload(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setError('');
    try {
      const formData = new FormData();
      formData.append('file', file);
      const res = await fetch('/api/admin/upload', { method: 'POST', body: formData });
      const data = await res.json();
      if (res.ok) {
        setCover(data.path);
      } else {
        setError(data.error ?? 'Nepavyko įkelti paveikslo.');
      }
    } catch {
      setError('Tinklo klaida įkeliant paveikslą.');
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  }

  async function save() {
    setSaving(true);
    setError('');
    const payload = {
      title,
      slug: mode === 'create' ? slug : initial?.slug,
      date,
      excerpt,
      tags: tags
        .split(',')
        .map((tag) => tag.trim())
        .filter(Boolean),
      cover,
      draft,
      body,
    };
    try {
      const url =
        mode === 'create' ? '/api/admin/posts' : `/api/admin/posts/${initial?.slug}`;
      const res = await fetch(url, {
        method: mode === 'create' ? 'POST' : 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (res.ok) {
        router.push('/admin');
        router.refresh();
        return;
      }
      setError(data.error ?? 'Nepavyko išsaugoti.');
    } catch {
      setError('Tinklo klaida. Pabandyk dar kartą.');
    } finally {
      setSaving(false);
    }
  }

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="font-serif text-3xl">
          {mode === 'create' ? 'Naujas straipsnis' : 'Redaguoti straipsnį'}
        </h1>
        <div className="flex items-center gap-3">
          <label className="flex cursor-pointer items-center gap-2 text-sm text-ink">
            <input
              type="checkbox"
              checked={draft}
              onChange={(event) => setDraft(event.target.checked)}
              className="h-4 w-4 accent-[rgb(var(--color-accent))]"
            />
            Juodraštis
          </label>
          <button
            type="button"
            onClick={save}
            disabled={saving}
            className="btn-accent disabled:opacity-60"
          >
            {saving ? 'Saugoma…' : draft ? 'Išsaugoti juodraštį' : 'Publikuoti'}
            <IconArrowRight size={18} />
          </button>
        </div>
      </div>

      {error ? (
        <p
          role="alert"
          className="mt-4 rounded-xl border border-accent/40 bg-accent/10 px-4 py-3 text-sm text-ink"
        >
          {error}
        </p>
      ) : null}

      <div className="mt-6 grid gap-8 lg:grid-cols-2">
        {/* Editor */}
        <div className="space-y-5">
          <div>
            <label htmlFor="f-title" className={fieldLabel}>
              Antraštė
            </label>
            <input
              id="f-title"
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              className="field !rounded-xl"
              placeholder="Straipsnio antraštė"
            />
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label htmlFor="f-slug" className={fieldLabel}>
                Nuoroda (slug)
              </label>
              <input
                id="f-slug"
                value={slug}
                onChange={(event) => {
                  setSlug(event.target.value);
                  setSlugTouched(true);
                }}
                disabled={mode === 'edit'}
                className="field !rounded-xl font-mono text-sm disabled:opacity-60"
                placeholder="straipsnio-nuoroda"
              />
            </div>
            <div>
              <label htmlFor="f-date" className={fieldLabel}>
                Data
              </label>
              <input
                id="f-date"
                type="date"
                value={date}
                onChange={(event) => setDate(event.target.value)}
                className="field !rounded-xl"
              />
            </div>
          </div>

          <div>
            <label htmlFor="f-excerpt" className={fieldLabel}>
              Santrauka
            </label>
            <textarea
              id="f-excerpt"
              value={excerpt}
              onChange={(event) => setExcerpt(event.target.value)}
              rows={2}
              className="field !rounded-xl"
              placeholder="Trumpas aprašymas kortelėms ir „Google“."
            />
          </div>

          <div>
            <label htmlFor="f-tags" className={fieldLabel}>
              Žymos (atskirtos kableliais)
            </label>
            <input
              id="f-tags"
              value={tags}
              onChange={(event) => setTags(event.target.value)}
              className="field !rounded-xl"
              placeholder="Rinkodara, Promptai"
            />
          </div>

          <div>
            <label htmlFor="f-cover" className={fieldLabel}>
              Viršelio paveikslas (nebūtina)
            </label>
            <div className="flex flex-wrap items-center gap-3">
              <input
                id="f-cover"
                value={cover}
                onChange={(event) => setCover(event.target.value)}
                className="field !rounded-xl flex-1 font-mono text-sm"
                placeholder="/images/virselis.svg"
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={uploading}
                className="rounded-full border border-line bg-card px-4 py-2.5 text-sm text-ink transition-colors hover:bg-surface disabled:opacity-60"
              >
                {uploading ? 'Keliama…' : 'Įkelti'}
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={onUpload}
                className="hidden"
              />
            </div>
          </div>

          <div>
            <label htmlFor="f-body" className={fieldLabel}>
              Turinys (Markdown / MDX)
            </label>
            <textarea
              id="f-body"
              value={body}
              onChange={(event) => setBody(event.target.value)}
              rows={22}
              spellCheck={false}
              className="field !rounded-xl min-h-[480px] font-mono text-sm leading-relaxed"
              placeholder={'## Antraštė\n\nTekstas su **paryškinimu**…\n\n<Callout type="tip">\n\nPatarimas.\n\n</Callout>'}
            />
          </div>
        </div>

        {/* Live preview */}
        <div className="lg:sticky lg:top-24 lg:self-start">
          <div className="mb-2 flex items-center justify-between">
            <span className="text-sm font-medium text-muted">Peržiūra</span>
            {previewError ? (
              <span className="text-xs text-amber-700 dark:text-amber-300">
                {previewError}
              </span>
            ) : null}
          </div>
          <div className="max-h-[calc(100vh-9rem)] overflow-y-auto rounded-2xl border border-line bg-card p-6">
            <div
              className="prose max-w-none prose-headings:font-serif prose-pre:m-0 prose-pre:bg-transparent prose-pre:p-0"
              // Preview HTML is compiled from the author's own MDX (trusted admin).
              dangerouslySetInnerHTML={{ __html: previewHtml }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
