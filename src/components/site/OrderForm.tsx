'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import SmartImage from './SmartImage';
import Icon from './Icon';
import { calcDelivery, effectivePrice, fill, formatPrice, toneBg } from '@/lib/utils';
import { getCookie, newEventId, track } from '@/lib/track';
import type { Combo, Product, Settings } from '@/lib/types';

type Line = { key: string; type: 'product' | 'combo'; id: number; name: string; price: number; image?: string | null; sub?: string; free?: boolean };

const trackId = (l: Line) => (l.type === 'product' ? String(l.id) : `combo-${l.id}`);

export default function OrderForm({
  products,
  combos,
  delivery = {},
  texts = {},
  t = {},
  currency = '৳',
  tone,
}: {
  products: Product[];
  combos: Combo[];
  delivery?: Settings;
  /** order section er title/subtitle/button */
  texts?: Settings;
  /** sob choto lekha (settings.texts) */
  t?: Settings;
  currency?: string;
  tone?: string;
}) {
  const dark = (tone || 'leaf') === 'leaf';
  const router = useRouter();
  const lines: Line[] = useMemo(
    () => [
      ...combos.map((c) => ({
        key: `c:${c.id}`,
        type: 'combo' as const,
        id: c.id,
        name: c.name,
        price: c.price,
        image: c.image || c.items?.[0]?.product?.images?.[0],
        sub: c.items?.map((i) => `${i.product?.name} ×${i.quantity.toLocaleString('bn-BD')}`).join(', '),
        free: !!c.freeDelivery,
      })),
      ...products.map((p) => ({
        key: `p:${p.id}`,
        type: 'product' as const,
        id: p.id,
        name: p.name,
        price: effectivePrice(p),
        image: p.images?.[0],
        sub: p.shortDesc || '',
        free: !!p.freeDelivery,
      })),
    ],
    [products, combos],
  );
  const lineMap = useMemo(() => new Map(lines.map((l) => [l.key, l])), [lines]);

  const [qty, setQty] = useState<Record<string, number>>(() => (lines.length ? { [lines[0].key]: 1 } : {}));
  const [form, setForm] = useState({ customerName: '', phone: '', address: '', note: '' });
  const [area, setArea] = useState<'inside' | 'outside'>('inside');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [flash, setFlash] = useState<string | null>(null);
  const checkoutFired = useRef(false);
  const qtyRef = useRef(qty);
  qtyRef.current = qty;

  const fireAdd = useCallback(
    (key: string) => {
      const l = lineMap.get(key);
      if (l && !qtyRef.current[key]) {
        track('AddToCart', { value: l.price, content_ids: [trackId(l)], content_name: l.name, contents: [{ id: trackId(l), quantity: 1, item_price: l.price }] });
      }
    },
    [lineMap],
  );

  const add = useCallback(
    (key: string) => {
      if (!lineMap.has(key)) return;
      fireAdd(key);
      setQty((q) => ({ ...q, [key]: Math.max(1, q[key] || 0) }));
      setFlash(key);
      setTimeout(() => setFlash(null), 1200);
    },
    [lineMap, fireAdd],
  );

  useEffect(() => {
    const p = new URLSearchParams(window.location.search).get('add');
    if (p) add(p);
    const handler = (e: Event) => add((e as CustomEvent<string>).detail);
    window.addEventListener('rbh:add', handler);
    return () => window.removeEventListener('rbh:add', handler);
  }, [add]);

  const change = (key: string, delta: number) => {
    if (delta > 0) fireAdd(key);
    setQty((q) => {
      const next = Math.max(0, Math.min(100, (q[key] || 0) + delta));
      const copy = { ...q };
      if (next === 0) delete copy[key];
      else copy[key] = next;
      return copy;
    });
  };

  const selected = lines.filter((l) => qty[l.key] > 0);
  const count = selected.reduce((s, l) => s + qty[l.key], 0);
  const subtotal = selected.reduce((s, l) => s + l.price * qty[l.key], 0);
  const dc = calcDelivery(delivery, area, subtotal, count, selected.some((l) => l.free));
  const deliveryCharge = dc.charge;
  const total = selected.length ? subtotal + deliveryCharge : 0;
  const freeHint =
    selected.length && !dc.free
      ? dc.needAmount > 0
        ? fill(t.freeHintAmount, { amount: formatPrice(dc.needAmount, currency) })
        : dc.needQty > 0
          ? fill(t.freeHintQty, { count: dc.needQty.toLocaleString('bn-BD') })
          : ''
      : '';

  // Mobile er niche sticky bar ke total janay
  useEffect(() => {
    (window as unknown as { __rbhCart: unknown }).__rbhCart = { count, total };
    window.dispatchEvent(new CustomEvent('rbh:cart', { detail: { count, total } }));
  }, [count, total]);

  const onFocus = () => {
    if (checkoutFired.current) return;
    checkoutFired.current = true;
    track('InitiateCheckout', { value: subtotal, num_items: count, content_ids: selected.map(trackId) });
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!selected.length) return setError(t.errSelect || 'অন্তত একটি পণ্য বাছাই করুন');
    const phone = form.phone.replace(/[\s-]/g, '');
    if (!/^(\+?88)?01[3-9]\d{8}$/.test(phone)) return setError(t.errPhone || 'সঠিক মোবাইল নাম্বার দিন');
    if (form.address.trim().length < 5) return setError(t.errAddress || 'পুরো ঠিকানা লিখুন');

    setLoading(true);
    const eventId = newEventId();
    const fbclid = new URLSearchParams(window.location.search).get('fbclid');
    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          phone,
          area,
          items: selected.map((l) => ({ type: l.type, id: l.id, quantity: qty[l.key] })),
          eventId,
          fbp: getCookie('_fbp'),
          fbc: getCookie('_fbc') || (fbclid ? `fb.1.${Date.now()}.${fbclid}` : undefined),
          sourceUrl: window.location.href,
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.message || 'অর্ডার নেওয়া যায়নি। ইন্টারনেট সংযোগ দেখে আবার চেষ্টা করুন।');
      sessionStorage.setItem('rbh_last_order', JSON.stringify({ ...data, eventId }));
      router.push(`/thank-you?order=${encodeURIComponent(data.orderNo)}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'অর্ডার নেওয়া যায়নি');
      setLoading(false);
    }
  };

  return (
    <section id="order" className={`scroll-mt-14 py-14 md:py-20 ${toneBg(tone, 'leaf')}`}>
      <div className="container max-w-5xl">
        <div className={`max-w-2xl ${dark ? 'text-white' : 'text-ink'}`}>
          <h2 className={`font-display text-[1.9rem] leading-[1.2] md:text-[2.6rem] ${dark ? '' : 'text-leaf'}`}>{texts.title || 'অর্ডার করুন'}</h2>
          {texts.subtitle && <p className={`mt-3 text-[1.05rem] leading-[1.75] ${dark ? 'text-white/75' : 'text-ink/70'}`}>{texts.subtitle}</p>}
        </div>

        <form onSubmit={submit} onFocus={onFocus} className={`mt-8 grid grid-cols-1 overflow-hidden rounded-[22px] bg-white md:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)] ${dark ? '' : 'border border-leaf/15'}`}>
          {/* ১. পণ্য */}
          <div className="min-w-0 p-4 sm:p-6 md:border-r md:border-ink/10 md:p-8">
            <StepTitle n="১" title={t.orderStep1 || 'পণ্য বাছাই করুন'} />
            <div className="mt-4 space-y-2.5">
              {lines.map((l) => {
                const q = qty[l.key] || 0;
                return (
                  <div
                    key={l.key}
                    className={`flex items-center gap-2.5 rounded-2xl border p-2 transition sm:gap-3 sm:p-2.5 ${q ? 'border-leaf bg-leaf/[0.04]' : 'border-ink/10'} ${flash === l.key ? 'ring-4 ring-haldi/50' : ''}`}
                  >
                    <SmartImage src={l.image} alt={l.name} sizes="64px" className="h-14 w-14 shrink-0 rounded-xl sm:h-16 sm:w-16" />
                    <div className="min-w-0 flex-1">
                      <p className="line-clamp-2 text-[15px] font-semibold leading-snug">{l.name}</p>
                      {l.sub && <p className="mt-0.5 truncate text-[12.5px] text-ink/50">{l.sub}</p>}
                      <p className="mt-0.5 flex flex-wrap items-center gap-x-2 font-display text-[1.1rem] text-stain">
                        {formatPrice(l.price, currency)}
                        {l.free && <span className="rounded bg-leaf px-1.5 py-px font-sans text-[11px] font-semibold text-haldi">{t.freeBadge}</span>}
                      </p>
                    </div>
                    {q === 0 ? (
                      <button type="button" onClick={() => change(l.key, 1)} className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-leaf/30 text-leaf" aria-label={`${l.name} যোগ করুন`}>
                        <Icon name="plus" className="h-5 w-5" />
                      </button>
                    ) : (
                      <div className="flex shrink-0 items-center rounded-full bg-leaf text-white">
                        <button type="button" aria-label="কমান" onClick={() => change(l.key, -1)} className="flex h-10 w-8 items-center justify-center sm:w-9">
                          <Icon name="minus" className="h-4 w-4" />
                        </button>
                        <span className="w-6 text-center font-semibold tabular-nums">{q.toLocaleString('bn-BD')}</span>
                        <button type="button" aria-label="বাড়ান" onClick={() => change(l.key, 1)} className="flex h-10 w-8 items-center justify-center sm:w-9">
                          <Icon name="plus" className="h-4 w-4" />
                        </button>
                      </div>
                    )}
                  </div>
                );
              })}
              {!lines.length && <p className="text-ink/60">এই মুহূর্তে কোনো পণ্য নেই।</p>}
            </div>
          </div>

          {/* ২. তথ্য */}
          <div className="min-w-0 border-t border-ink/10 bg-mist/40 p-4 sm:p-6 md:border-t-0 md:p-8">
            <StepTitle n="২" title={t.orderStep2 || 'আপনার তথ্য দিন'} />
            <div className="mt-4 space-y-3.5">
              <input required autoComplete="name" className="field" placeholder={t.namePlaceholder} value={form.customerName} onChange={(e) => setForm({ ...form, customerName: e.target.value })} aria-label={t.namePlaceholder || 'নাম'} />
              <input required type="tel" inputMode="numeric" autoComplete="tel" className="field" placeholder={t.phonePlaceholder} value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} aria-label={t.phonePlaceholder || 'মোবাইল'} />
              <textarea required rows={2} autoComplete="street-address" className="field resize-none" placeholder={t.addressPlaceholder} value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} aria-label={t.addressPlaceholder || 'ঠিকানা'} />

              <fieldset className="grid grid-cols-2 gap-2.5">
                <legend className="sr-only">ডেলিভারি এলাকা</legend>
                {(['inside', 'outside'] as const).map((a) => (
                  <label key={a} className={`flex min-w-0 cursor-pointer items-center gap-2 rounded-xl border bg-white px-2.5 py-3 transition sm:gap-2.5 sm:px-3 ${area === a ? 'border-leaf ring-4 ring-leaf/10' : 'border-ink/15'}`}>
                    <input type="radio" name="area" className="sr-only" checked={area === a} onChange={() => setArea(a)} />
                    <span className={`flex h-[18px] w-[18px] shrink-0 items-center justify-center rounded-full border-2 ${area === a ? 'border-leaf' : 'border-ink/25'}`}>
                      {area === a && <span className="h-2 w-2 rounded-full bg-leaf" />}
                    </span>
                    <span className="min-w-0 leading-tight">
                      <span className="block text-[13.5px] font-semibold sm:text-[14px]">{a === 'inside' ? delivery.insideLabel || 'ঢাকার ভিতরে' : delivery.outsideLabel || 'ঢাকার বাইরে'}</span>
                      {dc.free && selected.length ? (
                        <span className="text-[12.5px] font-semibold text-leaf">
                          <s className="mr-1 font-normal text-ink/40">{formatPrice(Number(a === 'inside' ? delivery.insideDhaka : delivery.outsideDhaka) || 0, currency)}</s>
                          {t.freeDelivery || 'ফ্রি'}
                        </span>
                      ) : (
                        <span className="text-[12.5px] text-ink/55">{formatPrice(Number(a === 'inside' ? delivery.insideDhaka : delivery.outsideDhaka) || 0, currency)}</span>
                      )}
                    </span>
                  </label>
                ))}
              </fieldset>
              <input className="field" placeholder={t.notePlaceholder} value={form.note} onChange={(e) => setForm({ ...form, note: e.target.value })} aria-label={t.notePlaceholder || 'নোট'} />
            </div>

            {/* রসিদ */}
            {freeHint && (
              <p className="mt-5 flex items-center gap-2 rounded-xl border border-dashed border-haldi bg-haldi/10 px-3 py-2.5 text-[14px] text-ink">
                <Icon name="truck" className="h-5 w-5 shrink-0 text-stain" /> {freeHint}
              </p>
            )}
            {dc.free && selected.length > 0 && t.freeApplied && (
              <p className="mt-5 flex items-center gap-2 rounded-xl bg-leaf px-3 py-2.5 text-[14px] font-medium text-white">
                <Icon name="truck" className="h-5 w-5 shrink-0 text-haldi" /> {t.freeApplied}
              </p>
            )}
            <div className="mt-4 rounded-2xl bg-white p-4 text-[15px]">
              <Row label={`${t.summaryItems || 'পণ্য'} (${count.toLocaleString('bn-BD')}টি)`} value={formatPrice(subtotal, currency)} />
              <Row label={t.summaryDelivery || 'ডেলিভারি চার্জ'} value={selected.length && deliveryCharge === 0 ? t.freeDelivery || 'ফ্রি' : formatPrice(selected.length ? deliveryCharge : 0, currency)} />
              <div className="dots-x my-3" />
              <div className="flex items-baseline justify-between">
                <span className="font-semibold">{t.summaryTotal || 'মোট'}</span>
                <span className="font-display text-[1.7rem] leading-none text-stain">{formatPrice(total, currency)}</span>
              </div>
            </div>

            {error && (
              <p role="alert" className="mt-4 rounded-xl border border-stain/20 bg-stain/5 px-4 py-3 text-[14.5px] text-stain">
                {error}
              </p>
            )}

            <button type="submit" disabled={loading} className="btn-haldi mt-4 w-full">
              {loading ? t.orderLoading || '…' : texts.buttonText || 'অর্ডার কনফার্ম করুন'}
            </button>
            <p className="mt-3 flex items-center justify-center gap-1.5 text-[13px] text-ink/55">
              <Icon name="shield" className="h-4 w-4" /> {t.orderTrust}
            </p>
          </div>
        </form>
      </div>
    </section>
  );
}

function StepTitle({ n, title }: { n: string; title: string }) {
  return (
    <h3 className="flex items-center gap-3 text-[1.1rem] font-semibold">
      <span className="flex h-8 w-8 items-center justify-center rounded-full bg-haldi font-display text-ink">{n}</span>
      {title}
    </h3>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between py-1 text-ink/70">
      <span>{label}</span>
      <span className="tabular-nums text-ink">{value}</span>
    </div>
  );
}
