import type { CSSProperties } from 'react';

export function effectivePrice(p: { price: number; salePrice?: number | null }) {
  return p.salePrice && p.salePrice > 0 && p.salePrice < p.price ? p.salePrice : p.price;
}

export function formatPrice(n: number, currency = '৳') {
  return `${currency}${Number(n || 0).toLocaleString('bn-BD')}`;
}

export function discountPercent(regular?: number | null, price?: number | null) {
  if (!regular || !price || price >= regular) return 0;
  return Math.round(((regular - price) / regular) * 100);
}

export function hexToRgb(hex?: string, fallback = '0 0 0') {
  if (!hex) return fallback;
  let h = hex.replace('#', '').trim();
  if (h.length === 3) h = h.split('').map((c) => c + c).join('');
  if (!/^[0-9a-fA-F]{6}$/.test(h)) return fallback;
  const n = parseInt(h, 16);
  return `${(n >> 16) & 255} ${(n >> 8) & 255} ${n & 255}`;
}

export function themeVars(theme: Record<string, string> = {}): CSSProperties {
  return {
    ['--c-primary' as string]: hexToRgb(theme.primary, '38 45 71'),
    ['--c-accent' as string]: hexToRgb(theme.accent, '148 100 44'),
    ['--c-highlight' as string]: hexToRgb(theme.highlight, '238 189 122'),
    ['--c-bg' as string]: hexToRgb(theme.background, '241 240 245'),
    ['--c-text' as string]: hexToRgb(theme.text, '23 27 44'),
  };
}

export function whatsappLink(num?: string, text = '') {
  if (!num) return '';
  let n = num.replace(/[^\d]/g, '');
  if (n.startsWith('0')) n = '88' + n;
  return `https://wa.me/${n}${text ? `?text=${encodeURIComponent(text)}` : ''}`;
}

export function youtubeId(url?: string) {
  if (!url) return '';
  const m = url.match(/(?:youtu\.be\/|v=|embed\/|shorts\/)([\w-]{11})/);
  return m ? m[1] : /^[\w-]{11}$/.test(url) ? url : '';
}

export function cn(...c: (string | false | null | undefined)[]) {
  return c.filter(Boolean).join(' ');
}

export function siteUrl(s?: { seo?: { siteUrl?: string } }) {
  const env = process.env.NEXT_PUBLIC_SITE_URL;
  // Vercel e live thakle nijei project er domain pay (localhost link Google/Facebook e jabe na)
  const vercel = process.env.VERCEL_PROJECT_PRODUCTION_URL ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}` : '';
  const useEnv = env && !(vercel && /localhost/.test(env)) ? env : '';
  return (s?.seo?.siteUrl || useEnv || vercel || 'http://localhost:3000').replace(/\/$/, '');
}

const DISPLAY_FONTS: Record<string, string> = { tiro: '--f-tiro', notoSerif: '--f-noto-serif', galada: '--f-galada' };
const BODY_FONTS: Record<string, string> = { anek: '--f-anek', hind: '--f-hind', notoSans: '--f-noto-sans' };

/** Theme rong + font — site wrapper e style hisebe boshe */
export function siteStyle(theme: Record<string, string> = {}, design: { fontDisplay?: string; fontBody?: string } = {}): CSSProperties {
  return {
    ...themeVars(theme),
    ['--font-display' as string]: `var(${DISPLAY_FONTS[design.fontDisplay || ''] || '--f-tiro'})`,
    ['--font-body' as string]: `var(${BODY_FONTS[design.fontBody || ''] || '--f-anek'})`,
  };
}

/** Section er background: admin theke white / mist / leaf */
export function toneBg(tone: string | undefined, fallback: 'white' | 'mist' | 'leaf') {
  const t = tone || fallback;
  return t === 'mist' ? 'bg-mist' : t === 'leaf' ? 'bg-leaf' : 'bg-white';
}

/** "{price} theke" -> asol value boshay */
export function fill(template: string | undefined, vars: Record<string, string>) {
  return String(template || '').replace(/\{(\w+)\}/g, (_, k) => vars[k] ?? '');
}

export type DeliverySettings = {
  insideDhaka?: number | string;
  outsideDhaka?: number | string;
  freeAll?: boolean;
  freeAbove?: number | string;
  freeAboveQty?: number | string;
};

/**
 * Delivery charge er hisab — website ar server dui jaygay EKI niyom.
 * Free hoy jodi: admin sob order e free kore, ba cart e free-delivery product/combo thake,
 * ba eto takar beshi kine, ba eto piece er beshi ney.
 */
export function calcDelivery(d: DeliverySettings, area: string, subtotal: number, count: number, hasFreeItem: boolean) {
  const base = Number(area === 'inside' ? d.insideDhaka : d.outsideDhaka) || 0;
  const above = Number(d.freeAbove) || 0;
  const aboveQty = Number(d.freeAboveQty) || 0;
  let reason: 'all' | 'item' | 'amount' | 'qty' | null = null;
  if (d.freeAll) reason = 'all';
  else if (hasFreeItem) reason = 'item';
  else if (above > 0 && subtotal >= above) reason = 'amount';
  else if (aboveQty > 0 && count >= aboveQty) reason = 'qty';
  return {
    charge: reason ? 0 : base,
    base,
    free: !!reason,
    reason,
    needAmount: !reason && above > 0 ? above - subtotal : 0,
    needQty: !reason && aboveQty > 0 ? aboveQty - count : 0,
  };
}
