import bcrypt from 'bcryptjs';
import { db } from '@/lib/server/db';
import { adminRoute, HttpError } from '@/lib/server/http';
import { passwordSchema } from '@/lib/server/validation';

export const POST = adminRoute(async (req, _ctx, me) => {
  const { currentPassword, newPassword } = passwordSchema.parse(await req.json());
  const admin = await db.admin.findUnique({ where: { id: me.id } });
  if (!admin || !(await bcrypt.compare(currentPassword, admin.password))) throw new HttpError(400, 'Bortoman password vul');
  await db.admin.update({ where: { id: me.id }, data: { password: await bcrypt.hash(newPassword, 10) } });
  return Response.json({ ok: true });
});
