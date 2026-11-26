import { adminRoute } from '@/lib/server/http';
import { listOrders } from '@/lib/server/orders';

export const dynamic = 'force-dynamic';

export const GET = adminRoute(async (req) => Response.json(await listOrders(new URL(req.url).searchParams)));
