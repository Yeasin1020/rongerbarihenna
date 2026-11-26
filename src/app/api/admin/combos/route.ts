import { revalidateTag } from 'next/cache';
import { db } from '@/lib/server/db';
import { adminRoute } from '@/lib/server/http';
import { comboSchema } from '@/lib/server/validation';
import { uniqueSlug } from '@/lib/server/slug';
import { comboInclude } from '@/lib/server/catalog';

export const dynamic = 'force-dynamic';

export const GET = adminRoute(async () =>
  Response.json(await db.combo.findMany({ include: comboInclude, orderBy: [{ sortOrder: 'asc' }, { createdAt: 'desc' }] })),
);

export const POST = adminRoute(async (req) => {
  const { items, slug, ...data } = comboSchema.parse(await req.json());
  const c = await db.combo.create({
    data: { ...data, slug: await uniqueSlug('combo', slug || data.name), items: { create: items } },
    include: comboInclude,
  });
  revalidateTag('site');
  return Response.json(c);
});
