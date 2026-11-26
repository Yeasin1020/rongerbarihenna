import 'server-only';
import { createHash } from 'crypto';

/**
 * Facebook Conversion API (server-side Purchase).
 * Browser pixel er sathe same event_id jay, tai Facebook duplicate count kore na.
 */
const sha = (v: string) => createHash('sha256').update(v.trim().toLowerCase()).digest('hex');

type Tracking = { fbPixelId?: string; fbAccessToken?: string; fbTestEventCode?: string };
type OrderLike = {
  orderNo: string;
  customerName: string;
  phone: string;
  total: number;
  items: { productId: number | null; comboId: number | null; quantity: number; price: number }[];
};

export async function sendPurchaseEvent(
  order: OrderLike,
  tracking: Tracking,
  ctx: { ip?: string; ua?: string; eventId?: string; fbp?: string; fbc?: string; sourceUrl?: string },
) {
  const pixelId = tracking?.fbPixelId?.trim();
  const token = tracking?.fbAccessToken?.trim();
  if (!pixelId || !token) return;

  const [fn, ...rest] = order.customerName.trim().split(/\s+/);
  const contentId = (i: OrderLike['items'][number]) => (i.productId ? String(i.productId) : `combo-${i.comboId}`);

  const body: Record<string, unknown> = {
    data: [
      {
        event_name: 'Purchase',
        event_time: Math.floor(Date.now() / 1000),
        event_id: ctx.eventId || order.orderNo,
        action_source: 'website',
        event_source_url: ctx.sourceUrl,
        user_data: {
          ph: [sha('88' + order.phone)],
          fn: [sha(fn || '')],
          ...(rest.length ? { ln: [sha(rest.join(' '))] } : {}),
          country: [sha('bd')],
          client_ip_address: ctx.ip,
          client_user_agent: ctx.ua,
          ...(ctx.fbp ? { fbp: ctx.fbp } : {}),
          ...(ctx.fbc ? { fbc: ctx.fbc } : {}),
        },
        custom_data: {
          currency: 'BDT',
          value: order.total,
          order_id: order.orderNo,
          content_type: 'product',
          content_ids: order.items.map(contentId),
          contents: order.items.map((i) => ({ id: contentId(i), quantity: i.quantity, item_price: i.price })),
          num_items: order.items.reduce((s, i) => s + i.quantity, 0),
        },
      },
    ],
  };
  if (tracking.fbTestEventCode?.trim()) body.test_event_code = tracking.fbTestEventCode.trim();

  try {
    const r = await fetch(`https://graph.facebook.com/v21.0/${pixelId}/events?access_token=${encodeURIComponent(token)}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    if (!r.ok) console.warn('[FB CAPI]', await r.text());
  } catch (e) {
    console.warn('[FB CAPI] failed:', (e as Error).message);
  }
}
