import { revalidateTag } from 'next/cache';
import { db } from '@/lib/server/db';
import { adminRoute } from '@/lib/server/http';
import { productSchema } from '@/lib/server/validation';
import { uniqueSlug } from '@/lib/server/slug';

export const dynamic = 'force-dynamic';

export const GET = adminRoute(async (req) => {
  const search = new URL(req.url).searchParams.get('search')?.trim();
  const items = await db.product.findMany({
    where: search ? { name: { contains: search, mode: 'insensitive' } } : undefined,
    orderBy: [{ sortOrder: 'asc' }, { createdAt: 'desc' }],
  });
  return Response.json(items);
});

export const POST = adminRoute(async (req) => {
  const data = productSchema.parse(await req.json());
  const slug = await uniqueSlug('product', data.slug || data.name);
  const p = await db.product.create({ data: { ...data, slug } });
  revalidateTag('site');
  return Response.json(p);
});
