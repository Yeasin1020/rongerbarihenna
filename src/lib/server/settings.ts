/* eslint-disable @typescript-eslint/no-explicit-any */
import 'server-only';
import { revalidateTag, unstable_cache } from 'next/cache';
import { createHash } from 'crypto';
import type { Prisma } from '@prisma/client';
import { db } from './db';
import { clone, deepMerge } from './helpers';
import { DEFAULT_SETTINGS, type SiteSettings } from '../default-settings';

/** Sob setting (secret soho) — shudhu server/admin e use hoy, cache nai */
export async function getAllSettings(): Promise<SiteSettings> {
  const row = await db.setting.findUnique({ where: { id: 1 } });
  const raw = (row?.data ?? {}) as Record<string, any>;
  const merged = ensureGallerySections(deepMerge(clone(DEFAULT_SETTINGS), raw));
  return raw.brandVersion === DEFAULT_SETTINGS.brandVersion ? merged : migrateBrand(merged, raw);
}

const OLD_GREEN = ['#2f4a2c', '#7a2e1b', '#e8b33d', '#edf0e4', '#1e2318'];

/**
 * Purono version e save kora settings e jodi purono default rong / faka logo thake,
 * seta notun brand (navy + gold + logo) e bodle dey. Admin nijer bachai kora rong chhoy na.
 */
function migrateBrand(s: SiteSettings, raw: Record<string, any>): SiteSettings {
  const out = clone(s);
  const t = raw.theme || {};
  if (!t.primary || OLD_GREEN.includes(String(t.primary).toLowerCase())) out.theme = clone(DEFAULT_SETTINGS.theme);
  if (!raw.logo) out.logo = DEFAULT_SETTINGS.logo;
  if (!raw.seo?.ogImage) out.seo = { ...out.seo, ogImage: DEFAULT_SETTINGS.seo.ogImage };
  if (!raw.hero?.image) out.hero = { ...out.hero, image: DEFAULT_SETTINGS.hero.image };
  out.sections = out.sections.map((x) => (x.key === 'hero' && x.tone === 'mist' ? { ...x, tone: 'leaf' } : x));
  out.brandVersion = DEFAULT_SETTINGS.brandVersion;
  // Purono naam -> notun naam (sob lekhay)
  return JSON.parse(JSON.stringify(out).replace(/Ronger Bari Hennal/g, 'RongerBari Henna'));
}

/** Je gallery ache kintu Sections e nai (purono save kora settings), seta order form er age jog kori */
function ensureGallerySections(s: SiteSettings): SiteSettings {
  const sections = [...(s.sections || [])];
  for (const g of s.galleries || []) {
    const key = `gallery-${g.id}`;
    if (sections.some((x) => x.key === key)) continue;
    const def = DEFAULT_SETTINGS.sections.find((x) => x.key === key);
    const idx = sections.findIndex((x) => x.key === 'order');
    sections.splice(idx >= 0 ? idx : sections.length, 0, def || { key, label: `Gallery: ${g.title}`, enabled: true, tone: 'white' });
  }
  return { ...s, sections };
}

// Default settings code e bodlale cache er naam o bodlay — purono cache dekhay na
const DEFAULTS_VERSION = createHash('md5').update(JSON.stringify(DEFAULT_SETTINGS)).digest('hex').slice(0, 10);

function stripSecrets(s: SiteSettings): SiteSettings {
  return { ...s, tracking: { ...s.tracking, fbAccessToken: '' } };
}

const cachedPublic = unstable_cache(async () => stripSecrets(await getAllSettings()), ['public-settings', DEFAULTS_VERSION], {
  tags: ['site'],
  revalidate: 3600,
});

/** Website er jonno (cache kora — super fast) */
export async function getPublicSettings(): Promise<SiteSettings> {
  try {
    return await cachedPublic();
  } catch (e) {
    console.error('[settings] DB error, default dekhano hocche:', (e as Error).message);
    return stripSecrets(clone(DEFAULT_SETTINGS));
  }
}

export async function updateSettings(data: unknown) {
  const merged = deepMerge(clone(DEFAULT_SETTINGS), data);
  await db.setting.upsert({
    where: { id: 1 },
    create: { id: 1, data: merged as unknown as Prisma.InputJsonValue },
    update: { data: merged as unknown as Prisma.InputJsonValue },
  });
  revalidateTag('site');
  return merged;
}
