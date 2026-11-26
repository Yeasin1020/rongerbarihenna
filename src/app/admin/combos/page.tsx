'use client';

/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from 'react';
import { adminFetch, tk, toast } from '@/lib/admin';
import { effectivePrice } from '@/lib/utils';
import { Field, ImageInput, PageHeader, Toggle } from '@/components/admin/ui';

const EMPTY = { name: '', slug: '', description: '', image: '', price: 0, regularPrice: '', isActive: true, freeDelivery: false, sortOrder: 0, items: [] as any[] };

export default function CombosPage() {
  const [combos, setCombos] = useState<any[] | null>(null);
  const [products, setProducts] = useState<any[]>([]);
  const [form, setForm] = useState<any>(null);
  const [saving, setSaving] = useState(false);

  const load = () =>
    Promise.all([adminFetch('/admin/combos'), adminFetch('/admin/products')])
      .then(([c, p]) => {
        setCombos(c);
        setProducts(p);
      })
      .catch((e) => toast(e.message, 'error'));

  useEffect(() => {
    load();
  }, []);

  const openEdit = (c?: any) =>
    setForm(
      c
        ? { ...EMPTY, ...c, regularPrice: c.regularPrice ?? '', description: c.description ?? '', image: c.image ?? '', items: c.items.map((i: any) => ({ productId: i.productId, quantity: i.quantity })) }
        : { ...EMPTY, items: [] },
    );

  const set = (k: string, v: any) => setForm((f: any) => ({ ...f, [k]: v }));
  const regularAuto = (form?.items || []).reduce((s: number, it: any) => {
    const p = products.find((x) => x.id === Number(it.productId));
    return s + (p ? effectivePrice(p) * (Number(it.quantity) || 0) : 0);
  }, 0);

  const save = async () => {
    if (!form.name) return toast('Combo er naam din', 'error');
    if (!form.items.length) return toast('Kompokkhe ekta product add korun', 'error');
    setSaving(true);
    try {
      const body = {
        name: form.name,
        slug: form.slug || undefined,
        description: form.description,
        image: form.image,
        price: Number(form.price) || 0,
        regularPrice: form.regularPrice === '' ? 0 : Number(form.regularPrice),
        isActive: form.isActive,
        freeDelivery: !!form.freeDelivery,
        sortOrder: Number(form.sortOrder) || 0,
        items: form.items.filter((i: any) => i.productId).map((i: any) => ({ productId: Number(i.productId), quantity: Number(i.quantity) || 1 })),
      };
      await adminFetch(form.id ? `/admin/combos/${form.id}` : '/admin/combos', { method: form.id ? 'PATCH' : 'POST', body: JSON.stringify(body) });
      toast('Combo save hoyeche');
      setForm(null);
      load();
    } catch (e: any) {
      toast(e.message, 'error');
    } finally {
      setSaving(false);
    }
  };

  const remove = async (c: any) => {
    if (!confirm(`"${c.name}" combo delete korben?`)) return;
    try {
      await adminFetch(`/admin/combos/${c.id}`, { method: 'DELETE' });
      toast('Combo delete hoyeche');
      load();
    } catch (e: any) {
      toast(e.message, 'error');
    }
  };

  return (
    <div>
      <PageHeader title="Combos" desc="Kichu product eksathe kom dame — combo offer banan">
        <button className="a-btn" onClick={() => openEdit()}>+ Notun combo</button>
      </PageHeader>

      {form && (
        <div className="a-card mb-6 border-2 border-[#262d47]">
          <h2 className="mb-4 text-lg font-semibold">{form.id ? 'Combo edit' : 'Notun combo'}</h2>
          <div className="grid gap-6 lg:grid-cols-2">
            <div className="space-y-4">
              <Field label="Combo name *" value={form.name} onChange={(v) => set('name', v)} />
              <Field label="Description" textarea value={form.description} onChange={(v) => set('description', v)} />
              <ImageInput label="Combo image" value={form.image} onChange={(v) => set('image', v)} hint="Na dile prothom product er image dekhabe" />
              <Field label="URL slug (optional)" value={form.slug} onChange={(v) => set('slug', v)} />
            </div>
            <div className="space-y-4">
              <div>
                <div className="mb-2 flex items-center justify-between">
                  <span className="a-label !mb-0">Combo te ki ki thakbe *</span>
                  <button type="button" className="a-btn-light !py-1" onClick={() => set('items', [...form.items, { productId: products[0]?.id || '', quantity: 1 }])}>+ Product</button>
                </div>
                <div className="space-y-2">
                  {form.items.map((it: any, i: number) => (
                    <div key={i} className="flex gap-2">
                      <select className="a-input" value={it.productId} onChange={(e) => set('items', form.items.map((x: any, j: number) => (j === i ? { ...x, productId: Number(e.target.value) } : x)))}>
                        {products.map((p) => <option key={p.id} value={p.id}>{p.name} ({tk(effectivePrice(p))})</option>)}
                      </select>
                      <input type="number" min={1} className="a-input !w-20" value={it.quantity} onChange={(e) => set('items', form.items.map((x: any, j: number) => (j === i ? { ...x, quantity: e.target.value } : x)))} />
                      <button type="button" className="a-btn-light text-red-600" onClick={() => set('items', form.items.filter((_: any, j: number) => j !== i))}>✕</button>
                    </div>
                  ))}
                </div>
                {regularAuto > 0 && <p className="mt-2 text-xs text-stone-500">Alada kinle dam: <b>{tk(regularAuto)}</b> <button type="button" className="text-blue-600 underline" onClick={() => set('regularPrice', regularAuto)}>regular price e boshan</button></p>}
              </div>
              <div className="grid grid-cols-2 gap-3">
                <Field label="Combo price (৳) *" type="number" value={form.price} onChange={(v) => set('price', v)} />
                <Field label="Regular price (kete dekhabe)" type="number" value={form.regularPrice} onChange={(v) => set('regularPrice', v)} />
              </div>
              <Field label="Sort order" type="number" value={form.sortOrder} onChange={(v) => set('sortOrder', v)} />
              <Toggle label="Active (website e dekhabe)" checked={form.isActive} onChange={(v) => set('isActive', v)} />
              <Toggle label="Free delivery (ei combo nile delivery charge 0)" checked={!!form.freeDelivery} onChange={(v) => set('freeDelivery', v)} />
            </div>
          </div>
          <div className="mt-6 flex justify-end gap-2">
            <button className="a-btn-light" onClick={() => setForm(null)}>Cancel</button>
            <button className="a-btn" onClick={save} disabled={saving}>{saving ? 'Saving...' : 'Combo save korun'}</button>
          </div>
        </div>
      )}

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {combos?.map((c) => (
          <div key={c.id} className="a-card">
            <div className="flex items-start justify-between gap-2">
              <h3 className="font-semibold">{c.name}</h3>
              <div className="flex shrink-0 gap-1">
                {c.freeDelivery && <span className="rounded-full bg-[#eebd7a]/30 px-2 py-0.5 text-xs text-[#6b4a1d]">Free delivery</span>}
                <span className={`rounded-full px-2 py-0.5 text-xs ${c.isActive ? 'bg-green-100 text-green-800' : 'bg-stone-200'}`}>{c.isActive ? 'Active' : 'Hidden'}</span>
              </div>
            </div>
            <ul className="mt-2 text-sm text-stone-600">
              {c.items.map((i: any) => <li key={i.id}>• {i.product?.name} × {i.quantity}</li>)}
            </ul>
            <div className="mt-3"><b className="text-lg">{tk(c.price)}</b> {c.regularPrice > c.price && <span className="text-sm text-stone-400 line-through">{tk(c.regularPrice)}</span>}</div>
            <div className="mt-4 flex gap-2">
              <button className="a-btn-light !py-1 text-xs" onClick={() => { openEdit(c); window.scrollTo({ top: 0, behavior: 'smooth' }); }}>Edit</button>
              <button className="a-btn-light !py-1 text-xs text-red-600" onClick={() => remove(c)}>Delete</button>
            </div>
          </div>
        ))}
        {combos && !combos.length && <p className="text-stone-400">Kono combo nai. &quot;+ Notun combo&quot; e click korun.</p>}
      </div>
    </div>
  );
}
