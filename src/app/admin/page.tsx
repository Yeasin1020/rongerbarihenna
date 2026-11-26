'use client';

/* eslint-disable @typescript-eslint/no-explicit-any */
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { adminFetch, fmtDate, STATUS, tk, toast } from '@/lib/admin';
import { PageHeader, StatusBadge } from '@/components/admin/ui';

export default function Dashboard() {
  const [s, setS] = useState<any>(null);

  useEffect(() => {
    adminFetch('/admin/stats').then(setS).catch((e) => toast(e.message, 'error'));
  }, []);

  if (!s) return <p className="text-stone-500">Loading...</p>;
  const max = Math.max(1, ...s.days.map((d: any) => d.orders));

  return (
    <div>
      <PageHeader title="Dashboard" desc="Apnar business er ek nojore hisab" />

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <Stat label="Ajker order" value={s.today.orders} sub={tk(s.today.amount)} />
        <Stat label="Pending order" value={s.statusCounts.PENDING} sub="Confirm kora baki" highlight />
        <Stat label="Last 30 din" value={s.last30.orders} sub={tk(s.last30.amount)} />
        <Stat label="Delivered (total)" value={s.delivered.orders} sub={tk(s.delivered.amount)} />
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        <div className="a-card lg:col-span-2">
          <h2 className="font-semibold">Last 7 din er order</h2>
          <div className="mt-6 flex h-48 items-end gap-3">
            {s.days.map((d: any) => (
              <div key={d.date} className="flex flex-1 flex-col items-center gap-1">
                <span className="text-xs font-semibold">{d.orders}</span>
                <div className="w-full rounded-t bg-[#262d47]" style={{ height: `${(d.orders / max) * 140 + 4}px` }} title={tk(d.amount)} />
                <span className="text-[11px] text-stone-500">{d.date.slice(5)}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="a-card">
          <h2 className="font-semibold">Order status</h2>
          <ul className="mt-4 space-y-2">
            {Object.entries(s.statusCounts).map(([k, v]) => (
              <li key={k}>
                <Link href={`/admin/orders?status=${k}`} className="flex items-center justify-between rounded-lg px-2 py-1.5 hover:bg-stone-50">
                  <StatusBadge status={k} map={STATUS} />
                  <span className="font-semibold">{v as number}</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        <div className="a-card lg:col-span-2">
          <div className="flex items-center justify-between">
            <h2 className="font-semibold">Notun order</h2>
            <Link href="/admin/orders" className="text-sm text-blue-600">Sob dekhun →</Link>
          </div>
          <div className="mt-4 overflow-x-auto">
            <table className="w-full text-sm">
              <tbody>
                {s.recent.map((o: any) => (
                  <tr key={o.id} className="border-t">
                    <td className="py-2"><Link href={`/admin/orders/${o.id}`} className="font-medium text-blue-600">{o.orderNo}</Link></td>
                    <td>{o.customerName}<div className="text-xs text-stone-500">{o.phone}</div></td>
                    <td>{tk(o.total)}</td>
                    <td><StatusBadge status={o.status} map={STATUS} /></td>
                    <td className="text-xs text-stone-500">{fmtDate(o.createdAt)}</td>
                  </tr>
                ))}
                {!s.recent.length && <tr><td className="py-6 text-center text-stone-400">Ekhono kono order nai</td></tr>}
              </tbody>
            </table>
          </div>
        </div>
        <div className="a-card">
          <h2 className="font-semibold">Stock kome geche</h2>
          <ul className="mt-4 space-y-2 text-sm">
            {s.lowStock.map((p: any) => (
              <li key={p.id} className="flex justify-between">
                <Link href={`/admin/products/${p.id}`} className="truncate hover:underline">{p.name}</Link>
                <span className={p.stock <= 0 ? 'font-bold text-red-600' : 'text-orange-600'}>{p.stock}</span>
              </li>
            ))}
            {!s.lowStock.length && <li className="text-stone-400">Sob product e jothesto stock ache</li>}
          </ul>
          <div className="mt-6 border-t pt-4 text-sm text-stone-600">
            Products: <b>{s.productCount}</b> • Combos: <b>{s.comboCount}</b> • Total orders: <b>{s.totalOrders}</b>
          </div>
        </div>
      </div>
    </div>
  );
}

function Stat({ label, value, sub, highlight }: { label: string; value: number; sub?: string; highlight?: boolean }) {
  return (
    <div className={`a-card ${highlight && value > 0 ? 'border-yellow-300 bg-yellow-50' : ''}`}>
      <div className="text-sm text-stone-500">{label}</div>
      <div className="mt-1 text-3xl font-bold">{value}</div>
      {sub && <div className="mt-1 text-sm text-stone-600">{sub}</div>}
    </div>
  );
}
