/* eslint-disable @typescript-eslint/no-explicit-any */
// Ekta function diye Facebook Pixel, TikTok Pixel, GA4 / GTM — sob e event pathay

const GA_MAP: Record<string, string> = {
  ViewContent: 'view_item',
  AddToCart: 'add_to_cart',
  InitiateCheckout: 'begin_checkout',
  Purchase: 'purchase',
};

const TT_MAP: Record<string, string> = {
  ViewContent: 'ViewContent',
  AddToCart: 'AddToCart',
  InitiateCheckout: 'InitiateCheckout',
  Purchase: 'CompletePayment',
};

export type TrackData = {
  value?: number;
  currency?: string;
  content_ids?: string[];
  content_name?: string;
  contents?: { id: string; quantity: number; item_price?: number }[];
  num_items?: number;
  order_id?: string;
};

export function track(event: keyof typeof GA_MAP, data: TrackData = {}, eventId?: string) {
  if (typeof window === 'undefined') return;
  const w = window as any;
  const payload = { currency: 'BDT', content_type: 'product', ...data };

  try {
    w.fbq?.('track', event, payload, eventId ? { eventID: eventId } : undefined);
  } catch {}

  try {
    w.ttq?.track(TT_MAP[event], {
      value: payload.value,
      currency: 'BDT',
      contents: payload.contents?.map((c) => ({ content_id: c.id, quantity: c.quantity, price: c.item_price })),
      content_type: 'product',
    });
  } catch {}

  try {
    const ga = {
      currency: 'BDT',
      value: payload.value,
      transaction_id: payload.order_id,
      items: payload.contents?.map((c) => ({ item_id: c.id, quantity: c.quantity, price: c.item_price })),
    };
    if (w.gtag) w.gtag('event', GA_MAP[event], ga);
    else if (w.dataLayer) w.dataLayer.push({ event: GA_MAP[event], ecommerce: ga });
  } catch {}
}

export function getCookie(name: string) {
  if (typeof document === 'undefined') return undefined;
  const m = document.cookie.match(new RegExp('(?:^|; )' + name + '=([^;]*)'));
  return m ? decodeURIComponent(m[1]) : undefined;
}

export function newEventId() {
  try {
    return crypto.randomUUID();
  } catch {
    return `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
  }
}
