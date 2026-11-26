'use client';

/* eslint-disable @typescript-eslint/no-explicit-any */
import Link from 'next/link';
import { useCallback, useEffect, useState } from 'react';
import { adminFetch, fmtDate, STATUS, tk, toast } from '@/lib/admin';
import { PageHeader } from '@/components/admin/ui';

const STATUSES = Object.keys(STATUS);

export default function OrdersPage() {
  const [status, setStatus] = useState('ALL');
  const [search, setSearch] = useState('');
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [page, setPage] = useState(1);
  const [res, setRes] = useState<any>(null);
  const [counts, setCounts] = useState<Record<string, number>>({});
  const [selected, setSelected] = useState<number[]>([]);
  const [loading, setLoading] = useState(false);
  const [init, setInit] = useState(false);

  useEffect(() => {
    const st = new URLSearchParams(window.location.search).get('status');
    if (st) setStatus(st);
    setInit(true);
  }, []);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const q = new URLSearchParams({ status, search, from, to, page: String(page), limit: '20' });
      const [r, st] = await Promise.all([adminFetch(`/admin/orders?${q}`), adminFetch('/admin/stats')]);
      setRes(r);
      setCounts({ ALL: st.totalOrders, ...st.statusCounts });
      setSelected([]);
    } catch (e: any) {
      toast(e.message, 'error');
    } finally {
      setLoading(false);
    }
  }, [status, search, from, to, page]);

  useEffect(() => {
    if (!init) return;
    const t = setTimeout(load, search ? 400 : 0);
    return () => clearTimeout(t);
  }, [load, init, search]);

  // Notun order ashle auto refresh (protti 60 second)
  useEffect(() => {
    if (!init) return;
    const t = setInterval(load, 60_000);
    return () => clearInterval(t);
  }, [load, init]);

  const changeStatus = async (id: number, st: string) => {
    try {
      await adminFetch(`/admin/orders/${id}`, { method: 'PATCH', body: JSON.stringify({ status: st }) });
      toast('Status update hoyeche');
      load();
    } catch (e: any) {
      toast(e.message, 'error');
    }
  };

  const bulk = async (st: string) => {
    if (!st || !selected.length) return;
    try {
      await adminFetch('/admin/orders/bulk-status', { method: 'PATCH', body: JSON.stringify({ ids: selected, status: st }) });
      toast(`${selected.length} ta order ${st} kora holo`);
      load();
    } catch (e: any) {
      toast(e.message, 'error');
    }
  };

  const exportCsv = () => {
    const rows = [['Order No', 'Date', 'Name', 'Phone', 'Address', 'Area', 'Items', 'Subtotal', 'Delivery', 'Discount', 'Total', 'Status', 'Note']];
    (res?.data || []).forEach((o: any) =>
      rows.push([
        o.orderNo,
        fmtDate(o.createdAt),
        o.customerName,
        o.phone,
        o.address,
        o.area,
        o.items.map((i: any) => `${i.name} x${i.quantity}`).join(' | '),
        o.subtotal,
        o.deliveryCharge,
        o.discount,
        o.total,
        o.status,
        o.note || '',
      ]),
    );
    const csv = '﻿' + rows.map((r) => r.map((c) => `"${String(c ?? '').replace(/"/g, '""')}"`).join(',')).join('\n');
    const a = document.createElement('a');
    a.href = URL.createObjectURL(new Blob([csv], { type: 'text/csv;charset=utf-8' }));
    a.download = `orders-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
  };

  const all = res?.data || [];
  const allChecked = all.length > 0 && selected.length === all.length;

  return (
    <div>
      <PageHeader title="Orders" desc="Sob order ekhane — status change, edit, export">
        <button className="a-btn-light" onClick={load} disabled={loading}>{loading ? '...' : 'Refresh'}</button>
        <button className="a-btn-light" onClick={exportCsv}>CSV download</button>
      </PageHeader>

      <div className="mb-4 flex gap-2 overflow-x-auto pb-1">
        {['ALL', ...STATUSES].map((s) => (
          <button
            key={s}
            onClick={() => { setStatus(s); setPage(1); }}
            className={`whitespace-nowrap rounded-full px-4 py-1.5 text-sm font-medium ${status === s ? 'bg-[#262d47] text-white' : 'border bg-white text-stone-700'}`}
          >
            {s === 'ALL' ? 'All' : STATUS[s].label} <span className="opacity-60">({counts[s] ?? 0})</span>
          </button>
        ))}
      </div>

      <div className="a-card mb-4 grid gap-3 md:grid-cols-4">
        <input className="a-input md:col-span-2" placeholder="Order no, phone ba naam diye khujun" value={search} onChange={(e) => { setSearch(e.target.value); setPage(1); }} />
        <input type="date" className="a-input" value={from} onChange={(e) => { setFrom(e.target.value); setPage(1); }} />
        <input type="date" className="a-input" value={to} onChange={(e) => { setTo(e.target.value); setPage(1); }} />
      </div>

      {selected.length > 0 && (
        <div className="mb-3 flex items-center gap-3 rounded-lg bg-blue-50 p-3 text-sm">
          <b>{selected.length} ta selected</b>
          <select className="a-input !w-auto" defaultValue="" onChange={(e) => { bulk(e.target.value); e.target.value = ''; }}>
            <option value="" disabled>Status change korun...</option>
            {STATUSES.map((s) => <option key={s} value={s}>{STATUS[s].label}</option>)}
          </select>
        </div>
      )}

      {/* Mobile: card */}
      <div className="space-y-3 md:hidden">
        {all.map((o: any) => (
          <div key={o.id} className="a-card !p-4">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-start gap-3">
                <input type="checkbox" className="mt-1" checked={selected.includes(o.id)} onChange={() => setSelected((s) => (s.includes(o.id) ? s.filter((x) => x !== o.id) : [...s, o.id]))} />
                <Link href={`/admin/orders/${o.id}`}>
                  <div className="font-semibold">{o.customerName}</div>
                  <div className="text-xs text-stone-500">{o.orderNo} • {fmtDate(o.createdAt)}</div>
                </Link>
              </div>
              <div className="text-right font-semibold">{tk(o.total)}</div>
            </div>
            <div className="mt-2 text-sm text-stone-600">{o.items.map((i: any) => `${i.name} ×${i.quantity}`).join(', ')}</div>
            <div className="mt-1 line-clamp-1 text-xs text-stone-500">{o.address}</div>
            <div className="mt-3 flex items-center gap-2">
              <select value={o.status} onChange={(e) => changeStatus(o.id, e.target.value)} className={`flex-1 rounded-lg border-0 px-2 py-2 text-xs font-semibold ${STATUS[o.status]?.cls}`}>
                {STATUSES.map((s) => <option key={s} value={s}>{STATUS[s].label}</option>)}
              </select>
              <a href={`tel:${o.phone}`} className="a-btn-light !px-3 !py-2 text-xs">Call</a>
              <Link href={`/admin/orders/${o.id}`} className="a-btn !px-3 !py-2 text-xs">Details</Link>
            </div>
          </div>
        ))}
        {!all.length && <p className="py-10 text-center text-stone-400">{loading ? 'Loading...' : 'Ei filter e kono order nai'}</p>}
      </div>

      <div className="a-card !p-0 hidden overflow-x-auto md:block">
        <table className="w-full min-w-[900px] text-sm">
          <thead className="bg-stone-50 text-left text-xs uppercase text-stone-500">
            <tr>
              <th className="p-3"><input type="checkbox" checked={allChecked} onChange={() => setSelected(allChecked ? [] : all.map((o: any) => o.id))} /></th>
              <th className="p-3">Order</th>
              <th className="p-3">Customer</th>
              <th className="p-3">Items</th>
              <th className="p-3">Total</th>
              <th className="p-3">Status</th>
              <th className="p-3">Action</th>
            </tr>
          </thead>
          <tbody>
            {all.map((o: any) => (
              <tr key={o.id} className="border-t align-top hover:bg-stone-50">
                <td className="p-3"><input type="checkbox" checked={selected.includes(o.id)} onChange={() => setSelected((s) => (s.includes(o.id) ? s.filter((x) => x !== o.id) : [...s, o.id]))} /></td>
                <td className="p-3">
                  <Link href={`/admin/orders/${o.id}`} className="font-semibold text-blue-600">{o.orderNo}</Link>
                  <div className="text-xs text-stone-500">{fmtDate(o.createdAt)}</div>
                </td>
                <td className="p-3">
                  <div className="font-medium">{o.customerName}</div>
                  <a href={`tel:${o.phone}`} className="text-xs text-blue-600">{o.phone}</a>
                  <div className="max-w-[220px] truncate text-xs text-stone-500" title={o.address}>{o.address}</div>
                </td>
                <td className="p-3 text-xs">
                  {o.items.map((i: any) => <div key={i.id}>{i.name} × {i.quantity}</div>)}
                </td>
                <td className="p-3 font-semibold">{tk(o.total)}</td>
                <td className="p-3">
                  <select value={o.status} onChange={(e) => changeStatus(o.id, e.target.value)} className={`rounded-full border-0 px-2 py-1 text-xs font-semibold ${STATUS[o.status]?.cls}`}>
                    {STATUSES.map((s) => <option key={s} value={s}>{STATUS[s].label}</option>)}
                  </select>
                </td>
                <td className="p-3">
                  <Link href={`/admin/orders/${o.id}`} className="a-btn-light !px-3 !py-1 text-xs">View</Link>
                </td>
              </tr>
            ))}
            {!all.length && (
              <tr><td colSpan={7} className="p-10 text-center text-stone-400">{loading ? 'Loading...' : 'Ei filter e kono order nai'}</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {res && res.pages > 1 && (
        <div className="mt-4 flex items-center justify-between text-sm">
          <span className="text-stone-500">Mot {res.total} ta order</span>
          <div className="flex gap-2">
            <button className="a-btn-light" disabled={page <= 1} onClick={() => setPage(page - 1)}>← Prev</button>
            <span className="px-2 py-2">{page} / {res.pages}</span>
            <button className="a-btn-light" disabled={page >= res.pages} onClick={() => setPage(page + 1)}>Next →</button>
          </div>
        </div>
      )}
    </div>
  );
}
