import type { MetadataRoute } from 'next';
import { getPublicSettings } from '@/lib/server/settings';
import { siteUrl } from '@/lib/utils';

export default async function robots(): Promise<MetadataRoute.Robots> {
  const base = siteUrl(await getPublicSettings());
  return {
    rules: [{ userAgent: '*', allow: '/', disallow: ['/admin', '/thank-you', '/api'] }],
    sitemap: `${base}/sitemap.xml`,
    host: base,
  };
}
