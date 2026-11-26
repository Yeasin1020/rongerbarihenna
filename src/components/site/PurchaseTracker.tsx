'use client';

import { useEffect, useState } from 'react';
import { track } from '@/lib/track';
import { formatPrice } from '@/lib/utils';

type LastOrder = {
  orderNo: string;
  total: number;
  deliveryCharge: number;
  eventId: string;
  items: { id: string; name: string; price: number; quantity: number }[];
};

/** Thank-you page e ekbar Purchase event (browser pixel + server CAPI e same eventId) */
export default function PurchaseTracker({ currency, payLabel, deliveryLabel }: { currency: string; payLabel?: string; deliveryLabel?: string }) {
  const [order, setOrder] = useState<LastOrder | null>(null);

  useEffect(() => {
    let o: LastOrder;
    try {
      const raw = sessionStorage.getItem('rbh_last_order');
      if (!raw) return;
      o = JSON.parse(raw);
    } catch {
      return;
    }
    setOrder(o);
    const key = `rbh_fired_${o.orderNo}`;
    if (sessionStorage.getItem(key)) return;
    const t = setTimeout(() => {
      track(
        'Purchase',
        {
          value: o.total,
          order_id: o.orderNo,
          content_ids: o.items.map((i) => i.id),
          contents: o.items.map((i) => ({ id: i.id, quantity: i.quantity, item_price: i.price })),
          num_items: o.items.reduce((s, i) => s + i.quantity, 0),
        },
        o.eventId,
      );
      sessionStorage.setItem(key, '1');
    }, 1200);
    return () => clearTimeout(t);
  }, []);

  if (!order) return null;
  return (
    <div className="mt-8 rounded-2xl bg-white p-5 text-left text-[15px]">
      {order.items.map((i) => (
        <div key={i.id} className="flex justify-between gap-4 py-1.5">
          <span className="text-ink/75">
            {i.name} × {i.quantity.toLocaleString('bn-BD')}
          </span>
          <span className="tabular-nums">{formatPrice(i.price * i.quantity, currency)}</span>
        </div>
      ))}
      <div className="flex justify-between py-1.5 text-ink/75">
        <span>{deliveryLabel || 'ডেলিভারি'}</span>
        <span>{formatPrice(order.deliveryCharge, currency)}</span>
      </div>
      <div className="dots-x my-3" />
      <div className="flex items-baseline justify-between">
        <span className="font-semibold">{payLabel || 'মোট'}</span>
        <span className="font-display text-[1.6rem] text-stain">{formatPrice(order.total, currency)}</span>
      </div>
    </div>
  );
}
