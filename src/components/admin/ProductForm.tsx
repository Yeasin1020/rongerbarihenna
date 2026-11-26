'use client';

/* eslint-disable @typescript-eslint/no-explicit-any */
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { adminFetch, toast } from '@/lib/admin';
import { Field, ImagesInput, PageHeader, Toggle } from './ui';

const EMPTY = {
  name: '',
  slug: '',
  shortDesc: '',
  description: '',
  price: 0,
  salePrice: '',
  stock: 100,
  sku: '',
  images: [] as string[],
  isActive: true,
  isFeatured: false,
  freeDelivery: false,
  sortOrder: 0,
  metaTitle: '',
  metaDesc: '',
};

export default function ProductForm({ id }: { id?: string }) {
  const router = useRouter();
  const [p, setP] = useState<any>(id ? null : EMPTY);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!id) return;
    adminFetch(`/admin/products/${id}`)
      .then((d) => setP({ ...EMPTY, ...d, salePrice: d.salePrice ?? '', sku: d.sku ?? '', shortDesc: d.shortDesc ?? '', description: d.description ?? '', metaTitle: d.metaTitle ?? '', metaDesc: d.metaDesc ?? '' }))
      .catch((e) => toast(e.message, 'error'));
  }, [id]);

  const set = (k: string, v: any) => setP((x: any) => ({ ...x, [k]: v }));

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const body = {
        ...p,
        price: Number(p.price) || 0,
        salePrice: p.salePrice === '' || p.salePrice == null ? 0 : Number(p.salePrice),
        stock: Number(p.stock) || 0,
        sortOrder: Number(p.sortOrder) || 0,
      };
      delete body.id;
      delete body.createdAt;
      delete body.updatedAt;
      if (!body.slug) delete body.slug;
      await adminFetch(id ? `/admin/products/${id}` : '/admin/products', { method: id ? 'PATCH' : 'POST', body: JSON.stringify(body) });
      toast(id ? 'Product update hoyeche' : 'Product add hoyeche');
      router.push('/admin/products');
    } catch (e: any) {
      toast(e.message, 'error');
      setSaving(false);
    }
  };

  if (!p) return <p className="text-stone-500">Loading...</p>;

  return (
    <form onSubmit={save}>
      <PageHeader title={id ? 'Product edit' : 'Notun product'}>
        <Link href="/admin/products" className="a-btn-light">Cancel</Link>
        <button className="a-btn" disabled={saving}>{saving ? 'Saving...' : 'Save'}</button>
      </PageHeader>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <div className="a-card space-y-4">
            <Field label="Product name *" value={p.name} onChange={(v) => set('name', v)} />
            <Field label="Choto description (card e dekhabe)" value={p.shortDesc} onChange={(v) => set('shortDesc', v)} />
            <Field label="Full description" textarea rows={7} value={p.description} onChange={(v) => set('description', v)} hint="Notun line dile website eo notun line e dekhabe" />
          </div>
          <div className="a-card">
            <ImagesInput label="Product images (prothom ta main image)" value={p.images} onChange={(v) => set('images', v)} />
          </div>
          <div className="a-card space-y-4">
            <h3 className="font-semibold">SEO (optional)</h3>
            <Field label="URL slug" value={p.slug} onChange={(v) => set('slug', v)} placeholder="organic-mehedi-cone" hint="Faka rakhle naam theke auto banabe. English e dile valo." />
            <Field label="Meta title" value={p.metaTitle} onChange={(v) => set('metaTitle', v)} />
            <Field label="Meta description" textarea value={p.metaDesc} onChange={(v) => set('metaDesc', v)} />
          </div>
        </div>

        <div className="space-y-6">
          <div className="a-card space-y-4">
            <h3 className="font-semibold">Price & stock</h3>
            <Field label="Regular price (৳) *" type="number" value={p.price} onChange={(v) => set('price', v)} />
            <Field label="Offer / sale price (৳)" type="number" value={p.salePrice} onChange={(v) => set('salePrice', v)} hint="Faka rakhle regular price e bikri hobe" />
            <Field label="Stock" type="number" value={p.stock} onChange={(v) => set('stock', v)} />
            <Field label="SKU (optional)" value={p.sku} onChange={(v) => set('sku', v)} />
          </div>
          <div className="a-card space-y-4">
            <Toggle label="Active (website e dekhabe)" checked={p.isActive} onChange={(v) => set('isActive', v)} />
            <Toggle label="Featured ★" checked={p.isFeatured} onChange={(v) => set('isFeatured', v)} />
            <Toggle label="Free delivery (ei product order e thakle delivery charge 0)" checked={!!p.freeDelivery} onChange={(v) => set('freeDelivery', v)} />
            <Field label="Sort order (choto number age dekhabe)" type="number" value={p.sortOrder} onChange={(v) => set('sortOrder', v)} />
          </div>
        </div>
      </div>
    </form>
  );
}
