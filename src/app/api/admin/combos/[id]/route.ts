import { revalidateTag } from 'next/cache';
import { db } from '@/lib/server/db';
import { adminRoute, HttpError, idParam } from '@/lib/server/http';
import { comboSchema } from '@/lib/server/validation';
import { uniqueSlug } from '@/lib/server/slug';
import { comboInclude } from '@/lib/server/catalog';

export const dynamic = 'force-dynamic';

async function find(id: number) {
  const c = await db.combo.findUnique({ where: { id }, include: comboInclude });
  if (!c) throw new HttpError(404, 'Combo pawa jay nai');
  return c;
}

export const GET = adminRoute(async (_req, ctx) => Response.json(await find(await idParam(ctx))));

export const PATCH = adminRoute(async (req, ctx) => {
  const id = await idParam(ctx);
  const current = await find(id);
  const { items, slug, ...data } = comboSchema.partial().parse(await req.json());
  const c = await db.$transaction(async (tx) => {
    if (items) {
      await tx.comboItem.deleteMany({ where: { comboId: id } });
      await tx.comboItem.createMany({ data: items.map((i) => ({ ...i, comboId: id })) });
    }
    return tx.combo.update({
      where: { id },
      data: { ...data, ...(slug !== undefined ? { slug: await uniqueSlug('combo', slug || data.name || current.name, id) } : {}) },
      include: comboInclude,
    });
  });
  revalidateTag('site');
  return Response.json(c);
});

export const DELETE = adminRoute(async (_req, ctx) => {
  const id = await idParam(ctx);
  await find(id);
  await db.combo.delete({ where: { id } });
  revalidateTag('site');
  return Response.json({ ok: true });
});
