// Edge + Node dui jaygay chole (middleware eo use hoy)
import { SignJWT, jwtVerify } from 'jose';

export const SESSION_COOKIE = 'rbh_session';

const key = () => new TextEncoder().encode(process.env.JWT_SECRET || 'dev-only-secret-please-change-this-value');

export async function signSession(admin: { id: number; email: string }) {
  return new SignJWT({ email: admin.email })
    .setProtectedHeader({ alg: 'HS256' })
    .setSubject(String(admin.id))
    .setIssuedAt()
    .setExpirationTime('7d')
    .sign(key());
}

export async function verifySession(token?: string | null) {
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, key());
    return { id: Number(payload.sub), email: String(payload.email) };
  } catch {
    return null;
  }
}
