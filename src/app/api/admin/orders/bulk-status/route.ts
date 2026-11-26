import { adminRoute } from '@/lib/server/http';
import { updateOrder } from '@/lib/server/orders';
import { bulkStatusSchema } from '@/lib/server/validation';

export const PATCH = adminRoute(async (req) => {
  const { ids, status } = bulkStatusSchema.parse(await req.json());
  for (const id of ids) await updateOrder(id, { status });
  return Response.json({ ok: true, count: ids.length });
});
