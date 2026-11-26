import { adminRoute } from '@/lib/server/http';
import { orderStats } from '@/lib/server/orders';

export const dynamic = 'force-dynamic';

export const GET = adminRoute(async () => Response.json(await orderStats()));
