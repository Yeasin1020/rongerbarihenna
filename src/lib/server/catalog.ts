import 'server-only';
import { unstable_cache } from 'next/cache';
import { db } from './db';
import type { Combo, Product } from '../types';

export const comboInclude = {
  items: {
    include: {
      product: { select: { id: true, name: true, slug: true, images: true, price: true, salePrice: true } },
    },
  },
} as const;

const order = [{ sortOrder: 'asc' as const }, { createdAt: 'desc' as const }];

const cachedProducts = unstable_cache(
  async () => db.product.findMany({ where: { isActive: true }, orderBy: order }),
  ['products'],
  { tags: ['site'], revalidate: 3600 },
);

const cachedCombos = unstable_cache(
  async () => db.combo.findMany({ where: { isActive: true }, include: comboInclude, orderBy: order }),
  ['combos'],
  { tags: ['site'], revalidate: 3600 },
);

const cachedProduct = unstable_cache(
  async (slug: string) => db.product.findFirst({ where: { slug, isActive: true } }),
  ['product-by-slug'],
  { tags: ['site'], revalidate: 3600 },
);

// unstable_cache JSON e rakhe, tai Date gula string hoye ashe
export async function getProducts(): Promise<Product[]> {
  try {
    return JSON.parse(JSON.stringify(await cachedProducts()));
  } catch (e) {
    console.error('[catalog] products:', (e as Error).message);
    return [];
  }
}

export async function getCombos(): Promise<Combo[]> {
  try {
    return JSON.parse(JSON.stringify(await cachedCombos()));
  } catch (e) {
    console.error('[catalog] combos:', (e as Error).message);
    return [];
  }
}

export async function getProduct(slug: string): Promise<Product | null> {
  try {
    const p = await cachedProduct(slug);
    return p ? JSON.parse(JSON.stringify(p)) : null;
  } catch {
    return null;
  }
}
