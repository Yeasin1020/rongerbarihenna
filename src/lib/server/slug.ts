import 'server-only';
import { db } from './db';
import { slugify } from './helpers';

export async function uniqueSlug(model: 'product' | 'combo', base: string, ignoreId?: number) {
  const root = slugify(base);
  let slug = root;
  for (let i = 2; i < 500; i++) {
    const found =
      model === 'product'
        ? await db.product.findUnique({ where: { slug }, select: { id: true } })
        : await db.combo.findUnique({ where: { slug }, select: { id: true } });
    if (!found || found.id === ignoreId) return slug;
    slug = `${root}-${i}`;
  }
  return `${root}-${Date.now()}`;
}
