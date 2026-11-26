'use client';

/* eslint-disable @typescript-eslint/no-explicit-any */
import Link from 'next/link';
import { use, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { adminFetch, fmtDate, STATUS, tk, toast } from '@/lib/admin';
import { Field, PageHeader, StatusBadge } from '@/components/admin/ui';
import { whatsappLink } from '@/lib/utils';

export default function OrderDetail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const [o, setO] = useState<any>(null);
  const [edit, setEdit] = useState<any>({});
  const [saving, setSaving] = useState(false);

  const load = () =>
    adminFetch(`/admin/orders/${id}`)
      .then((d) => {
        setO(d);
        setEdit({
          customerName: d.customerName,
          phone: d.phone,
          address: d.address,
          area: d.area,
          deliveryCharge: d.deliveryCharge,
          discount: d.discount,
          adminNote: d.adminNote || '',
          status: d.status,
        });
      })
      .catch((e) => toast(e.message, 'error'));

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const save = async () => {
    setSaving(true);
    try {
      await adminFetch(`/admin/orders/${id}`, {
        method: 'PATCH',
        body: JSON.stringify({ ...edit, deliveryCharge: Number(edit.deliveryCharge) || 0, discount: Number(edit.discount) || 0 }),
      });
      toast('Order update hoyeche');
      load();
    } catch (e: any) {
      toast(e.message, 'error');
    } finally {
      setSaving(false);
    }
  };

  const remove = async () => {
    if (!confirm('Order ta permanently delete korben? Eta ar ferot ana jabe na.')) return;
    try {
      await adminFetch(`/admin/orders/${id}`, { method: 'DELETE' });
      toast('Order delete hoyeche');
      router.push('/admin/orders');
    } catch (e: any) {
      toast(e.message, 'error');
    }
  };

  if (!o) return <p className="text-stone-500">Loading...</p>;
  const total = Math.max(0, o.subtotal + (Number(edit.deliveryCharge) || 0) - (Number(edit.discount) || 0));

  return (
    <div>
      <PageHeader title={`Order ${o.orderNo}`} desc={fmtDate(o.createdAt)}>
        <Link href="/admin/orders" className="a-btn-light">← Back</Link>
        <button className="a-btn-light" onClick={() => window.print()}>Invoice print</button>
        <button className="a-btn-danger" onClick={remove}>Delete</button>
      </PageHeader>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Invoice / items */}
        <div className="a-card lg:col-span-2">
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-3">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/brand/logo-256.png" alt="" className="h-14 w-14 object-contain" />
                <h2 className="font-display text-xl text-[#262d47]">RongerBari Henna</h2>
              </div>
              <p className="text-sm text-stone-500">Invoice: {o.orderNo}</p>
              <p className="text-sm text-stone-500">{fmtDate(o.createdAt)}</p>
            </div>
            <StatusBadge status={o.status} map={STATUS} />
          </div>
          <div className="mt-4 rounded-lg bg-stone-50 p-3 text-sm">
            <b>{o.customerName}</b> • {o.phone}
            <div className="text-stone-600">{o.address}</div>
            <div className="text-stone-500">Area: {o.area === 'inside' ? 'Dhakar vitore' : 'Dhakar baire'}</div>
            {o.note && <div className="mt-1 text-orange-700">Customer note: {o.note}</div>}
          </div>
          <table className="mt-4 w-full text-sm">
            <thead className="border-b text-left text-stone-500">
              <tr><th className="py-2">Item</th><th>Price</th><th>Qty</th><th className="text-right">Total</th></tr>
            </thead>
            <tbody>
              {o.items.map((i: any) => (
                <tr key={i.id} className="border-b">
                  <td className="py-2">{i.comboId && <span className="mr-1 rounded bg-yellow-100 px-1 text-xs">Combo</span>}{i.name}</td>
                  <td>{tk(i.price)}</td>
                  <td>{i.quantity}</td>
                  <td className="text-right">{tk(i.total)}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="ml-auto mt-4 max-w-xs space-y-1 text-sm">
            <div className="flex justify-between"><span>Subtotal</span><span>{tk(o.subtotal)}</span></div>
            <div className="flex justify-between"><span>Delivery</span><span>{tk(Number(edit.deliveryCharge) || 0)}</span></div>
            <div className="flex justify-between"><span>Discount</span><span>-{tk(Number(edit.discount) || 0)}</span></div>
            <div className="flex justify-between border-t pt-1 text-base font-bold"><span>Total (COD)</span><span>{tk(total)}</span></div>
          </div>

          <div className="no-print mt-6 flex flex-wrap gap-2 border-t pt-4">
            <a href={`tel:${o.phone}`} className="a-btn-light">Call korun</a>
            <a href={whatsappLink(o.phone, `আসসালামু আলাইকুম ${o.customerName}, RongerBari Henna থেকে বলছি। আপনার অর্ডার ${o.orderNo} (মোট ${o.total} টাকা) কনফার্ম করতে চাচ্ছি।`)} target="_blank" rel="noreferrer" className="a-btn-light">WhatsApp</a>
            <span className={`rounded-lg px-3 py-2 text-sm ${o.previousOrders > 0 ? 'bg-green-50 text-green-700' : 'bg-stone-50 text-stone-600'}`}>
              Ei number theke ager order: <b>{o.previousOrders}</b>
            </span>
          </div>
        </div>

        {/* Edit panel */}
        <div className="no-print a-card space-y-4">
          <h2 className="font-semibold">Order manage</h2>
          <label className="block">
            <span className="a-label">Status</span>
            <select className="a-input" value={edit.status} onChange={(e) => setEdit({ ...edit, status: e.target.value })}>
              {Object.keys(STATUS).map((s) => <option key={s} value={s}>{STATUS[s].label}</option>)}
            </select>
          </label>
          <Field label="Customer name" value={edit.customerName} onChange={(v) => setEdit({ ...edit, customerName: v })} />
          <Field label="Phone" value={edit.phone} onChange={(v) => setEdit({ ...edit, phone: v })} />
          <Field label="Address" textarea value={edit.address} onChange={(v) => setEdit({ ...edit, address: v })} />
          <label className="block">
            <span className="a-label">Area</span>
            <select className="a-input" value={edit.area} onChange={(e) => setEdit({ ...edit, area: e.target.value })}>
              <option value="inside">Dhakar vitore</option>
              <option value="outside">Dhakar baire</option>
            </select>
          </label>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Delivery charge" type="number" value={edit.deliveryCharge} onChange={(v) => setEdit({ ...edit, deliveryCharge: v })} />
            <Field label="Discount" type="number" value={edit.discount} onChange={(v) => setEdit({ ...edit, discount: v })} />
          </div>
          <Field label="Admin note (private)" textarea value={edit.adminNote} onChange={(v) => setEdit({ ...edit, adminNote: v })} placeholder="Courier tracking, call er info..." />
          <button className="a-btn w-full" onClick={save} disabled={saving}>{saving ? 'Saving...' : 'Save changes'}</button>
          <p className="text-xs text-stone-500">Cancelled/Returned korle stock auto ferot jabe.</p>
        </div>
      </div>
    </div>
  );
}
