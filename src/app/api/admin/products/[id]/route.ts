import { revalidateTag } from 'next/cache';
import { db } from '@/lib/server/db';
import { adminRoute, HttpError, idParam } from '@/lib/server/http';
import { productSchema } from '@/lib/server/validation';
import { uniqueSlug } from '@/lib/server/slug';

export const dynamic = 'force-dynamic';

async function find(id: number) {
  const p = await db.product.findUnique({ where: { id } });
  if (!p) throw new HttpError(404, 'Product pawa jay nai');
  return p;
}

export const GET = adminRoute(async (_req, ctx) => Response.json(await find(await idParam(ctx))));

export const PATCH = adminRoute(async (req, ctx) => {
  const id = await idParam(ctx);
  const current = await find(id);
  const { slug, ...data } = productSchema.partial().parse(await req.json());
  const p = await db.product.update({
    where: { id },
    data: { ...data, ...(slug !== undefined ? { slug: await uniqueSlug('product', slug || data.name || current.name, id) } : {}) },
  });
  revalidateTag('site');
  return Response.json(p);
});

export const DELETE = adminRoute(async (_req, ctx) => {
  const id = await idParam(ctx);
  await find(id);
  await db.product.delete({ where: { id } });
  revalidateTag('site');
  return Response.json({ ok: true });
});
