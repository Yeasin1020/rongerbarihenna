'use client';

/* eslint-disable @typescript-eslint/no-explicit-any */
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { adminFetch, tk, toast } from '@/lib/admin';
import { PageHeader } from '@/components/admin/ui';

export default function ProductsPage() {
  const [items, setItems] = useState<any[] | null>(null);
  const [search, setSearch] = useState('');

  const load = () =>
    adminFetch(`/admin/products${search ? `?search=${encodeURIComponent(search)}` : ''}`)
      .then(setItems)
      .catch((e) => toast(e.message, 'error'));

  useEffect(() => {
    const t = setTimeout(load, 300);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search]);

  const toggle = async (p: any) => {
    try {
      await adminFetch(`/admin/products/${p.id}`, { method: 'PATCH', body: JSON.stringify({ isActive: !p.isActive }) });
      load();
    } catch (e: any) {
      toast(e.message, 'error');
    }
  };

  const remove = async (p: any) => {
    if (!confirm(`"${p.name}" delete korben? Eta ar ferot ana jabe na. (Hide korte chaile Active off korun)`)) return;
    try {
      await adminFetch(`/admin/products/${p.id}`, { method: 'DELETE' });
      toast('Product delete hoyeche');
      load();
    } catch (e: any) {
      toast(e.message, 'error');
    }
  };

  return (
    <div>
      <PageHeader title="Products" desc="Product add, edit, price, stock, image — sob ekhane">
        <Link href="/admin/products/new" className="a-btn">+ Notun product</Link>
      </PageHeader>
      <input className="a-input mb-4 max-w-sm" placeholder="Product khujun" value={search} onChange={(e) => setSearch(e.target.value)} />
      <div className="a-card !p-0 overflow-x-auto">
        <table className="w-full min-w-[700px] text-sm">
          <thead className="bg-stone-50 text-left text-xs uppercase text-stone-500">
            <tr><th className="p-3">Product</th><th className="p-3">Price</th><th className="p-3">Stock</th><th className="p-3">Active</th><th className="p-3">Action</th></tr>
          </thead>
          <tbody>
            {items?.map((p) => (
              <tr key={p.id} className="border-t">
                <td className="p-3">
                  <div className="flex items-center gap-3">
                    <div className="h-12 w-12 shrink-0 overflow-hidden rounded-lg bg-stone-100">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      {p.images?.[0] ? <img src={p.images[0]} alt="" className="h-full w-full object-cover" /> : <span className="flex h-full items-center justify-center text-xs text-stone-400">No img</span>}
                    </div>
                    <div>
                      <div className="font-medium">{p.name} {p.isFeatured && <span className="text-xs text-yellow-600">★</span>} {p.freeDelivery && <span className="ml-1 rounded-full bg-[#eebd7a]/30 px-2 py-0.5 text-[11px] text-[#6b4a1d]">Free delivery</span>}</div>
                      <div className="text-xs text-stone-500">/{p.slug}</div>
                    </div>
                  </div>
                </td>
                <td className="p-3">
                  {p.salePrice && p.salePrice < p.price ? (
                    <><b>{tk(p.salePrice)}</b> <span className="text-xs text-stone-400 line-through">{tk(p.price)}</span></>
                  ) : (
                    <b>{tk(p.price)}</b>
                  )}
                </td>
                <td className={`p-3 ${p.stock <= 0 ? 'font-bold text-red-600' : p.stock <= 10 ? 'text-orange-600' : ''}`}>{p.stock}</td>
                <td className="p-3">
                  <button onClick={() => toggle(p)} className={`rounded-full px-3 py-1 text-xs font-semibold ${p.isActive ? 'bg-green-100 text-green-800' : 'bg-stone-200 text-stone-600'}`}>
                    {p.isActive ? 'Active' : 'Hidden'}
                  </button>
                </td>
                <td className="p-3">
                  <div className="flex gap-2">
                    <Link href={`/admin/products/${p.id}`} className="a-btn-light !px-3 !py-1 text-xs">Edit</Link>
                    <button onClick={() => remove(p)} className="a-btn-light !px-3 !py-1 text-xs text-red-600">Delete</button>
                  </div>
                </td>
              </tr>
            ))}
            {items && !items.length && <tr><td colSpan={5} className="p-10 text-center text-stone-400">Kono product nai</td></tr>}
            {!items && <tr><td colSpan={5} className="p-10 text-center text-stone-400">Loading...</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
}
