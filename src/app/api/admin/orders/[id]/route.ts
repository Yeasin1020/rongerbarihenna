import { adminRoute, idParam } from '@/lib/server/http';
import { deleteOrder, getOrder, updateOrder } from '@/lib/server/orders';
import { orderUpdateSchema } from '@/lib/server/validation';

export const dynamic = 'force-dynamic';

export const GET = adminRoute(async (_req, ctx) => Response.json(await getOrder(await idParam(ctx))));

export const PATCH = adminRoute(async (req, ctx) =>
  Response.json(await updateOrder(await idParam(ctx), orderUpdateSchema.parse(await req.json()))),
);

export const DELETE = adminRoute(async (_req, ctx) => {
  await deleteOrder(await idParam(ctx));
  return Response.json({ ok: true });
});
