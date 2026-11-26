import type { MetadataRoute } from 'next';
import { getPublicSettings } from '@/lib/server/settings';
import { getProducts } from '@/lib/server/catalog';
import { siteUrl } from '@/lib/utils';

export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [s, products] = await Promise.all([getPublicSettings(), getProducts()]);
  const base = siteUrl(s);
  return [
    { url: base, lastModified: new Date(), changeFrequency: 'daily', priority: 1 },
    ...products.map((p) => ({
      url: `${base}/products/${encodeURIComponent(p.slug)}`,
      lastModified: p.updatedAt ? new Date(p.updatedAt) : new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    })),
  ];
}
