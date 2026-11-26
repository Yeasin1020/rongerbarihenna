'use client';

// Admin panel ar API ekoi website e — login cookie diye kaj kore
export async function logout() {
  await fetch('/api/auth/logout', { method: 'POST' }).catch(() => null);
  window.location.href = '/admin/login';
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function adminFetch<T = any>(path: string, opts: RequestInit = {}): Promise<T> {
  const headers: Record<string, string> = { ...((opts.headers as Record<string, string>) || {}) };
  if (!(opts.body instanceof FormData)) headers['Content-Type'] = 'application/json';

  const res = await fetch(`/api${path}`, { ...opts, headers, cache: 'no-store', credentials: 'same-origin' });
  if (res.status === 401) {
    if (!window.location.pathname.startsWith('/admin/login')) window.location.href = '/admin/login';
    throw new Error('Login korun');
  }
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.message || 'Kaj ta kora jay ni, abar chesta korun');
  return data as T;
}

type SignResponse = { enabled: boolean; cloudName?: string; apiKey?: string; folder?: string; timestamp?: number; signature?: string };

/**
 * Chobi upload: Cloudinary set kora thakle browser theke sorasori Cloudinary te jay (fast),
 * na hole server er maddhome database e save hoy.
 */
export async function uploadImage(file: File): Promise<string> {
  if (!file.type.startsWith('image/')) throw new Error('Shudhu chobi upload kora jabe');

  const sign = await adminFetch<SignResponse>('/admin/upload/sign').catch(() => ({ enabled: false }) as SignResponse);
  if (sign.enabled && sign.cloudName) {
    if (file.size > 10 * 1024 * 1024) throw new Error('Chobi 10MB er choto hote hobe');
    const fd = new FormData();
    fd.append('file', file);
    fd.append('api_key', sign.apiKey || '');
    fd.append('timestamp', String(sign.timestamp));
    fd.append('folder', sign.folder || '');
    fd.append('signature', sign.signature || '');
    const res = await fetch(`https://api.cloudinary.com/v1_1/${sign.cloudName}/image/upload`, { method: 'POST', body: fd });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(data?.error?.message ? `Cloudinary: ${data.error.message}` : 'Cloudinary te upload hoy ni');
    return data.secure_url as string;
  }

  const fd = new FormData();
  fd.append('file', file);
  const r = await adminFetch<{ url: string }>('/admin/upload', { method: 'POST', body: fd });
  return r.url;
}

export function toast(message: string, type: 'success' | 'error' = 'success') {
  window.dispatchEvent(new CustomEvent('rbh:toast', { detail: { message, type } }));
}

export const STATUS: Record<string, { label: string; cls: string }> = {
  PENDING: { label: 'Pending', cls: 'bg-yellow-100 text-yellow-800' },
  CONFIRMED: { label: 'Confirmed', cls: 'bg-blue-100 text-blue-800' },
  PROCESSING: { label: 'Processing', cls: 'bg-indigo-100 text-indigo-800' },
  SHIPPED: { label: 'Shipped', cls: 'bg-purple-100 text-purple-800' },
  DELIVERED: { label: 'Delivered', cls: 'bg-green-100 text-green-800' },
  CANCELLED: { label: 'Cancelled', cls: 'bg-red-100 text-red-800' },
  RETURNED: { label: 'Returned', cls: 'bg-gray-200 text-gray-800' },
};

export const tk = (n: number) => `৳${Number(n || 0).toLocaleString('en-IN')}`;

export function fmtDate(d: string | Date) {
  return new Date(d).toLocaleString('en-GB', {
    timeZone: 'Asia/Dhaka',
    day: '2-digit',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  });
}

// ---- nested object helpers (settings editor er jonno) ----
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function getIn(obj: any, path: string) {
  return path.split('.').reduce((o, k) => (o == null ? undefined : o[k]), obj);
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function setIn(obj: any, path: string, value: unknown): any {
  const [k, ...rest] = path.split('.');
  const copy = Array.isArray(obj) ? [...obj] : { ...(obj || {}) };
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (copy as any)[k] = rest.length ? setIn((obj || {})[k], rest.join('.'), value) : value;
  return copy;
}
