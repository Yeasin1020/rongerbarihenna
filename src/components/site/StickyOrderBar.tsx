'use client';

import { useEffect, useState } from 'react';
import Icon from './Icon';
import { formatPrice, whatsappLink } from '@/lib/utils';

/**
 * Mobile e niche sob somoy thake: koto taka hocche + order button.
 * Order form screen e thakle lukiye jay.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function StickyOrderBar({ currency, whatsapp, texts = {} }: { currency: string; whatsapp?: string; texts?: Record<string, any> }) {
  const [cart, setCart] = useState({ count: 0, total: 0 });
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onCart = (e: Event) => setCart((e as CustomEvent<{ count: number; total: number }>).detail);
    window.addEventListener('rbh:cart', onCart);
    const last = (window as unknown as { __rbhCart?: { count: number; total: number } }).__rbhCart;
    if (last) setCart(last);

    const order = document.getElementById('order');
    let orderInView = false;
    const update = () => setVisible(window.scrollY > 420 && !orderInView);
    const io = order
      ? new IntersectionObserver(([en]) => {
          orderInView = en.isIntersecting;
          update();
        }, { threshold: 0.05 })
      : null;
    if (order && io) io.observe(order);
    window.addEventListener('scroll', update, { passive: true });
    update();
    return () => {
      window.removeEventListener('rbh:cart', onCart);
      window.removeEventListener('scroll', update);
      io?.disconnect();
    };
  }, []);

  const wa = whatsapp && !/X/.test(whatsapp) ? whatsappLink(whatsapp, texts.whatsappMessage || '') : '';

  return (
    <div
      className={`fixed inset-x-0 bottom-0 z-50 border-t border-ink/10 bg-white/95 px-4 pb-[max(.75rem,env(safe-area-inset-bottom))] pt-3 backdrop-blur-md transition-transform duration-300 md:hidden ${visible ? 'translate-y-0' : 'translate-y-full'}`}
    >
      <div className="flex items-center gap-3">
        {wa && (
          <a href={wa} target="_blank" rel="noopener noreferrer" aria-label="WhatsApp e message" className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-leaf/20 text-[#1f8f4e]">
            <svg viewBox="0 0 32 32" className="h-6 w-6 fill-current" aria-hidden>
              <path d="M16 3C8.8 3 3 8.8 3 16c0 2.3.6 4.5 1.7 6.5L3 29l6.7-1.7c1.9 1 4.1 1.6 6.3 1.6 7.2 0 13-5.8 13-13S23.2 3 16 3zm5.9 15.6c-.3-.2-1.9-1-2.2-1.1-.3-.1-.5-.2-.7.2-.2.3-.8 1.1-1 1.3-.2.2-.4.2-.7.1-.3-.2-1.4-.5-2.6-1.6-1-.9-1.6-1.9-1.8-2.3-.2-.3 0-.5.1-.7l.5-.6c.2-.2.2-.3.3-.6.1-.2 0-.4 0-.6l-1-2.4c-.3-.6-.5-.5-.7-.5h-.6c-.2 0-.6.1-.9.4-.3.3-1.2 1.1-1.2 2.8s1.2 3.2 1.4 3.4c.2.2 2.4 3.6 5.7 5 .8.3 1.4.5 1.9.7.8.3 1.5.2 2.1.1.6-.1 1.9-.8 2.2-1.5.3-.7.3-1.4.2-1.5-.1-.2-.3-.3-.6-.4z" />
            </svg>
          </a>
        )}
        <div className="min-w-0 flex-1 leading-tight">
          <p className="text-[12.5px] text-ink/55">{cart.count ? `${cart.count.toLocaleString('bn-BD')}টি পণ্য • ডেলিভারি সহ` : texts.stickyIdle}</p>
          <p className="font-display text-[1.35rem] text-stain">{cart.total ? formatPrice(cart.total, currency) : texts.stickyEmpty}</p>
        </div>
        <a href="#order" className="flex h-12 shrink-0 items-center gap-2 rounded-xl bg-haldi px-5 font-semibold text-ink shadow-[0_2px_0_0_rgb(var(--c-text)/0.85)]">
          <Icon name="bag" className="h-5 w-5" />
          {texts.stickyButton || 'অর্ডার করুন'}
        </a>
      </div>
    </div>
  );
}
