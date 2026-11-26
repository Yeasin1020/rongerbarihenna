export function slugify(input: string): string {
  const s = String(input || '')
    .trim()
    .toLowerCase()
    .replace(/[^\p{L}\p{M}\p{N}]+/gu, '-')
    .replace(/^-+|-+$/g, '');
  return s || `item-${Date.now()}`;
}

export function isPlainObject(v: unknown): v is Record<string, unknown> {
  return typeof v === 'object' && v !== null && !Array.isArray(v);
}

/** Object merge hoy, array/primitive replace hoy */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function deepMerge<T extends Record<string, any>>(base: T, override: unknown): T {
  if (!isPlainObject(override)) return base;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const out: Record<string, any> = { ...base };
  for (const key of Object.keys(override)) {
    const b = out[key];
    const o = override[key];
    if (o === undefined) continue;
    out[key] = isPlainObject(b) && isPlainObject(o) ? deepMerge(b, o) : o;
  }
  return out as T;
}

export function clone<T>(v: T): T {
  return JSON.parse(JSON.stringify(v));
}

export function normalizeBdPhone(phone: string): string {
  let p = String(phone || '').replace(/[^\d]/g, '');
  if (p.startsWith('88')) p = p.slice(2);
  return p;
}
