import bcrypt from 'bcryptjs';
import { cookies } from 'next/headers';
import { db } from '@/lib/server/db';
import { clientIp, HttpError, rateLimit, route } from '@/lib/server/http';
import { loginSchema } from '@/lib/server/validation';
import { SESSION_COOKIE, signSession } from '@/lib/auth';

export const POST = route(async (req) => {
  rateLimit(`login:${clientIp(req)}`, 10, 60_000);
  const { email, password } = loginSchema.parse(await req.json());

  // Prothom bar: database e admin na thakle .env theke toiri hobe
  if ((await db.admin.count()) === 0) {
    await db.admin.create({
      data: {
        email: (process.env.ADMIN_EMAIL || 'admin@rongerbari.com').toLowerCase(),
        password: await bcrypt.hash(process.env.ADMIN_PASSWORD || 'admin12345', 10),
        name: 'Admin',
      },
    });
  }

  const admin = await db.admin.findUnique({ where: { email: email.toLowerCase() } });
  if (!admin || !(await bcrypt.compare(password, admin.password))) throw new HttpError(401, 'Email ba password vul');

  const token = await signSession({ id: admin.id, email: admin.email });
  (await cookies()).set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24 * 7,
  });
  return Response.json({ ok: true, admin: { email: admin.email, name: admin.name } });
});
