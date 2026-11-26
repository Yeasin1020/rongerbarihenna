import { db } from '@/lib/server/db';

// Database theke chobi serve kore (browser/CDN 1 bochor cache kore — fast)
export async function GET(_req: Request, ctx: { params: Promise<{ id: string }> }) {
  const { id } = await ctx.params;
  const n = parseInt(id, 10);
  if (!Number.isInteger(n)) return new Response('Not found', { status: 404 });
  const m = await db.media.findUnique({ where: { id: n } });
  if (!m) return new Response('Not found', { status: 404 });
  return new Response(new Uint8Array(m.data), {
    headers: {
      'Content-Type': m.mime,
      'Content-Length': String(m.size),
      'Cache-Control': 'public, max-age=31536000, immutable',
    },
  });
}
