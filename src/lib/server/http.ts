import 'server-only';
import { cookies } from 'next/headers';
import { ZodError } from 'zod';
import { SESSION_COOKIE, verifySession } from '../auth';

export class HttpError extends Error {
  constructor(
    public status: number,
    message: string,
  ) {
    super(message);
  }
}

export async function getAdmin() {
  const c = await cookies();
  return verifySession(c.get(SESSION_COOKIE)?.value);
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Ctx = any;
type Admin = { id: number; email: string };

function toResponse(e: unknown) {
  if (e instanceof HttpError) return Response.json({ message: e.message }, { status: e.status });
  if (e instanceof ZodError) return Response.json({ message: e.issues[0]?.message || 'Tottho thik nei' }, { status: 400 });
  console.error(e);
  return Response.json({ message: 'Server e somossa hoyeche, abar chesta korun' }, { status: 500 });
}

/** Public route er jonno: error gula sundor JSON e return kore */
export function route(fn: (req: Request, ctx: Ctx) => Promise<Response>) {
  return async (req: Request, ctx: Ctx) => {
    try {
      return await fn(req, ctx);
    } catch (e) {
      return toResponse(e);
    }
  };
}

/** Admin route: login chara dhukte dey na */
export function adminRoute(fn: (req: Request, ctx: Ctx, admin: Admin) => Promise<Response>) {
  return route(async (req, ctx) => {
    const admin = await getAdmin();
    if (!admin) throw new HttpError(401, 'Login korun');
    return fn(req, ctx, admin);
  });
}

export async function idParam(ctx: Ctx) {
  const { id } = await ctx.params;
  const n = Number(id);
  if (!Number.isInteger(n)) throw new HttpError(400, 'Invalid id');
  return n;
}

export function clientIp(req: Request) {
  return req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || req.headers.get('x-real-ip') || 'unknown';
}

/** Choto in-memory rate limiter (fake order spam atkate) */
const hits = new Map<string, number[]>();
export function rateLimit(key: string, limit: number, windowMs: number) {
  const now = Date.now();
  const arr = (hits.get(key) || []).filter((t) => now - t < windowMs);
  if (arr.length >= limit) throw new HttpError(429, 'অনেকবার চেষ্টা করেছেন, ১ মিনিট পর আবার চেষ্টা করুন');
  arr.push(now);
  hits.set(key, arr);
  if (hits.size > 5000) hits.clear();
}
