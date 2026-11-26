'use client';

/* eslint-disable @typescript-eslint/no-explicit-any */
import { useRef, useState } from 'react';
import { toast, uploadImage } from '@/lib/admin';

export function PageHeader({ title, desc, children }: { title: string; desc?: string; children?: React.ReactNode }) {
  return (
    <div className="no-print mb-6 flex flex-wrap items-center justify-between gap-3">
      <div>
        <h1 className="text-2xl font-bold">{title}</h1>
        {desc && <p className="mt-1 text-sm text-stone-500">{desc}</p>}
      </div>
      <div className="flex flex-wrap gap-2">{children}</div>
    </div>
  );
}

export function Field({
  label,
  value,
  onChange,
  type = 'text',
  placeholder,
  hint,
  textarea,
  rows = 3,
}: {
  label: string;
  value: any;
  onChange: (v: any) => void;
  type?: string;
  placeholder?: string;
  hint?: string;
  textarea?: boolean;
  rows?: number;
}) {
  return (
    <label className="block">
      <span className="a-label">{label}</span>
      {textarea ? (
        <textarea className="a-input" rows={rows} value={value ?? ''} placeholder={placeholder} onChange={(e) => onChange(e.target.value)} />
      ) : (
        <input
          className="a-input"
          type={type}
          value={value ?? ''}
          placeholder={placeholder}
          onChange={(e) => onChange(type === 'number' ? (e.target.value === '' ? '' : Number(e.target.value)) : e.target.value)}
        />
      )}
      {hint && <span className="mt-1 block text-xs text-stone-500">{hint}</span>}
    </label>
  );
}

export function ColorField({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <label className="block">
      <span className="a-label">{label}</span>
      <div className="flex gap-2">
        <input type="color" value={value || '#000000'} onChange={(e) => onChange(e.target.value)} className="h-10 w-14 cursor-pointer rounded border" />
        <input className="a-input" value={value || ''} onChange={(e) => onChange(e.target.value)} />
      </div>
    </label>
  );
}

export function Toggle({ label, checked, onChange }: { label: string; checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <label className="flex cursor-pointer items-center gap-3">
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={`relative h-6 w-11 rounded-full transition ${checked ? 'bg-green-600' : 'bg-stone-300'}`}
      >
        <span className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition ${checked ? 'left-[22px]' : 'left-0.5'}`} />
      </button>
      <span className="text-sm font-medium">{label}</span>
    </label>
  );
}

export function ImageInput({ label, value, onChange, hint }: { label: string; value?: string; onChange: (v: string) => void; hint?: string }) {
  const ref = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const pick = async (f?: File) => {
    if (!f) return;
    setBusy(true);
    try {
      onChange(await uploadImage(f));
      toast('Image upload hoyeche');
    } catch (e: any) {
      toast(e.message, 'error');
    } finally {
      setBusy(false);
      if (ref.current) ref.current.value = '';
    }
  };
  return (
    <div>
      <span className="a-label">{label}</span>
      <div className="flex items-start gap-3">
        <div className="flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-lg border bg-stone-50">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          {value ? <img src={value} alt="" className="h-full w-full object-cover" /> : <span className="text-xs text-stone-400">Chobi nai</span>}
        </div>
        <div className="flex-1 space-y-2">
          <input className="a-input" placeholder="Image URL ba upload korun" value={value || ''} onChange={(e) => onChange(e.target.value)} />
          <div className="flex gap-2">
            <button type="button" className="a-btn-light !py-1.5" disabled={busy} onClick={() => ref.current?.click()}>
              {busy ? 'Uploading...' : 'Upload'}
            </button>
            {value && (
              <button type="button" className="a-btn-light !py-1.5 text-red-600" onClick={() => onChange('')}>
                Remove
              </button>
            )}
          </div>
          {hint && <span className="block text-xs text-stone-500">{hint}</span>}
        </div>
      </div>
      <input ref={ref} type="file" accept="image/*" hidden onChange={(e) => pick(e.target.files?.[0])} />
    </div>
  );
}

export function ImagesInput({ label, value = [], onChange }: { label: string; value?: string[]; onChange: (v: string[]) => void }) {
  const ref = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const pick = async (files: FileList | null) => {
    if (!files?.length) return;
    setBusy(true);
    try {
      const urls: string[] = [];
      for (const f of Array.from(files)) urls.push(await uploadImage(f));
      onChange([...value, ...urls]);
      toast(`${urls.length} ta image upload hoyeche`);
    } catch (e: any) {
      toast(e.message, 'error');
    } finally {
      setBusy(false);
      if (ref.current) ref.current.value = '';
    }
  };
  const move = (i: number, d: number) => {
    const arr = [...value];
    const j = i + d;
    if (j < 0 || j >= arr.length) return;
    [arr[i], arr[j]] = [arr[j], arr[i]];
    onChange(arr);
  };
  return (
    <div>
      <span className="a-label">{label}</span>
      <div className="flex flex-wrap gap-3">
        {value.map((src, i) => (
          <div key={src + i} className="group relative h-24 w-24 overflow-hidden rounded-lg border">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={src} alt="" className="h-full w-full object-cover" />
            {i === 0 && <span className="absolute left-1 top-1 rounded bg-black/70 px-1 text-[10px] text-white">Main</span>}
            <div className="absolute inset-x-0 bottom-0 flex justify-between bg-black/60 p-1 opacity-0 transition group-hover:opacity-100">
              <button type="button" className="px-1 text-xs text-white" onClick={() => move(i, -1)}>◀</button>
              <button type="button" className="px-1 text-xs text-red-300" onClick={() => onChange(value.filter((_, x) => x !== i))}>✕</button>
              <button type="button" className="px-1 text-xs text-white" onClick={() => move(i, 1)}>▶</button>
            </div>
          </div>
        ))}
        <button type="button" disabled={busy} onClick={() => ref.current?.click()} className="flex h-24 w-24 items-center justify-center rounded-lg border-2 border-dashed text-sm text-stone-500 hover:bg-stone-50">
          {busy ? '...' : '+ Add'}
        </button>
      </div>
      <input ref={ref} type="file" accept="image/*" multiple hidden onChange={(e) => pick(e.target.files)} />
    </div>
  );
}

export type FieldSpec = { key: string; label: string; type?: 'text' | 'textarea' | 'number' | 'image' };

/** List edit korar jonno (features, FAQ, testimonial etc.) */
export function ArrayEditor({
  label,
  items = [],
  onChange,
  fields,
  newItem,
}: {
  label: string;
  items?: any[];
  onChange: (v: any[]) => void;
  fields: FieldSpec[];
  newItem: any;
}) {
  const update = (i: number, key: string, v: any) => onChange(items.map((it, x) => (x === i ? { ...it, [key]: v } : it)));
  const move = (i: number, d: number) => {
    const arr = [...items];
    const j = i + d;
    if (j < 0 || j >= arr.length) return;
    [arr[i], arr[j]] = [arr[j], arr[i]];
    onChange(arr);
  };
  return (
    <div>
      <div className="mb-2 flex items-center justify-between">
        <span className="a-label !mb-0">{label}</span>
        <button type="button" className="a-btn-light !py-1" onClick={() => onChange([...items, { ...newItem }])}>+ Add</button>
      </div>
      <div className="space-y-3">
        {items.map((it, i) => (
          <div key={i} className="rounded-lg border bg-stone-50 p-3">
            <div className="mb-2 flex items-center justify-between text-xs text-stone-500">
              <span>#{i + 1}</span>
              <div className="flex gap-1">
                <button type="button" className="rounded border bg-white px-2" onClick={() => move(i, -1)}>↑</button>
                <button type="button" className="rounded border bg-white px-2" onClick={() => move(i, 1)}>↓</button>
                <button type="button" className="rounded border bg-white px-2 text-red-600" onClick={() => onChange(items.filter((_, x) => x !== i))}>Delete</button>
              </div>
            </div>
            <div className="grid gap-3 md:grid-cols-2">
              {fields.map((f) =>
                f.type === 'image' ? (
                  <div key={f.key} className="md:col-span-2">
                    <ImageInput label={f.label} value={it[f.key]} onChange={(v) => update(i, f.key, v)} />
                  </div>
                ) : (
                  <div key={f.key} className={f.type === 'textarea' ? 'md:col-span-2' : ''}>
                    <Field label={f.label} type={f.type === 'number' ? 'number' : 'text'} textarea={f.type === 'textarea'} value={it[f.key]} onChange={(v) => update(i, f.key, v)} />
                  </div>
                ),
              )}
            </div>
          </div>
        ))}
        {!items.length && <p className="text-sm text-stone-400">Kichu nai. &quot;+ Add&quot; e click korun.</p>}
      </div>
    </div>
  );
}

export function StringListEditor({ label, items = [], onChange, placeholder }: { label: string; items?: string[]; onChange: (v: string[]) => void; placeholder?: string }) {
  return (
    <div>
      <div className="mb-2 flex items-center justify-between">
        <span className="a-label !mb-0">{label}</span>
        <button type="button" className="a-btn-light !py-1" onClick={() => onChange([...items, ''])}>+ Add</button>
      </div>
      <div className="space-y-2">
        {items.map((v, i) => (
          <div key={i} className="flex gap-2">
            <input className="a-input" value={v} placeholder={placeholder} onChange={(e) => onChange(items.map((x, j) => (j === i ? e.target.value : x)))} />
            <button type="button" className="a-btn-light text-red-600" onClick={() => onChange(items.filter((_, j) => j !== i))}>✕</button>
          </div>
        ))}
      </div>
    </div>
  );
}

export function Tabs({ tabs, active, onChange }: { tabs: { key: string; label: string }[]; active: string; onChange: (k: string) => void }) {
  return (
    <div className="no-print mb-4 flex gap-1 overflow-x-auto border-b">
      {tabs.map((t) => (
        <button
          key={t.key}
          type="button"
          onClick={() => onChange(t.key)}
          className={`whitespace-nowrap border-b-2 px-4 py-2 text-sm font-medium ${active === t.key ? 'border-[#262d47] text-stone-900' : 'border-transparent text-stone-500 hover:text-stone-800'}`}
        >
          {t.label}
        </button>
      ))}
    </div>
  );
}

export function StatusBadge({ status, map }: { status: string; map: Record<string, { label: string; cls: string }> }) {
  const s = map[status] || { label: status, cls: 'bg-stone-100' };
  return <span className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-semibold ${s.cls}`}>{s.label}</span>;
}

/** Gallery er chobi: onek gula eksathe upload, caption, sajano, delete */
export function GalleryItemsEditor({ items = [], onChange }: { items?: { image: string; caption: string }[]; onChange: (v: { image: string; caption: string }[]) => void }) {
  const ref = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState<string | null>(null);
  const [url, setUrl] = useState('');

  const pick = async (files: FileList | null) => {
    if (!files?.length) return;
    const list = Array.from(files);
    const added: { image: string; caption: string }[] = [];
    try {
      for (let i = 0; i < list.length; i++) {
        setBusy(`${i + 1}/${list.length} upload hocche…`);
        added.push({ image: await uploadImage(list[i]), caption: '' });
      }
      toast(`${added.length} ta chobi add hoyeche — Save korte bhulben na`);
    } catch (e: any) {
      toast(e.message, 'error');
    } finally {
      if (added.length) onChange([...items, ...added]);
      setBusy(null);
      if (ref.current) ref.current.value = '';
    }
  };
  const move = (i: number, d: number) => {
    const arr = [...items];
    const j = i + d;
    if (j < 0 || j >= arr.length) return;
    [arr[i], arr[j]] = [arr[j], arr[i]];
    onChange(arr);
  };

  return (
    <div>
      <div className="flex flex-wrap items-center gap-2">
        <button type="button" className="a-btn" disabled={!!busy} onClick={() => ref.current?.click()}>
          {busy || 'Chobi upload (onek gula eksathe)'}
        </button>
        <div className="flex min-w-[240px] flex-1 gap-2">
          <input className="a-input" placeholder="Ba chobir link paste korun" value={url} onChange={(e) => setUrl(e.target.value)} />
          <button
            type="button"
            className="a-btn-light"
            disabled={!url.trim()}
            onClick={() => {
              onChange([...items, { image: url.trim(), caption: '' }]);
              setUrl('');
            }}
          >
            Add
          </button>
        </div>
      </div>
      <input ref={ref} type="file" accept="image/*" multiple hidden onChange={(e) => pick(e.target.files)} />

      <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
        {items.map((it, i) => (
          <div key={it.image + i} className="overflow-hidden rounded-lg border border-stone-200 bg-white">
            <div className="relative aspect-square bg-stone-100">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={it.image} alt="" className="h-full w-full object-cover" loading="lazy" />
              <span className="absolute left-1.5 top-1.5 rounded bg-black/60 px-1.5 text-[11px] text-white">{i + 1}</span>
            </div>
            <div className="space-y-1.5 p-2">
              <input
                className="a-input !py-1.5 !text-xs"
                placeholder="Caption (optional)"
                value={it.caption || ''}
                onChange={(e) => onChange(items.map((x, j) => (j === i ? { ...x, caption: e.target.value } : x)))}
              />
              <div className="flex justify-between text-xs">
                <div className="flex gap-1">
                  <button type="button" className="rounded border border-stone-300 px-2 py-0.5" onClick={() => move(i, -1)} aria-label="Age">←</button>
                  <button type="button" className="rounded border border-stone-300 px-2 py-0.5" onClick={() => move(i, 1)} aria-label="Pore">→</button>
                </div>
                <button type="button" className="rounded px-2 py-0.5 text-red-700 hover:bg-red-50" onClick={() => onChange(items.filter((_, j) => j !== i))}>
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
      {!items.length && <p className="mt-3 text-sm text-stone-400">Ei gallery te ekhono chobi nai.</p>}
    </div>
  );
}
