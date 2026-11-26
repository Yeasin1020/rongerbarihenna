import { adminRoute } from '@/lib/server/http';
import { getAllSettings, updateSettings } from '@/lib/server/settings';

export const dynamic = 'force-dynamic';

export const GET = adminRoute(async () => Response.json(await getAllSettings()));

export const PUT = adminRoute(async (req) => Response.json(await updateSettings(await req.json())));
