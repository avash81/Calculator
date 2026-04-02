import { cookies } from 'next/headers';
import { jwtVerify } from 'jose';

export type AdminJwtPayload = {
  role?: string;
  [key: string]: unknown;
};

export function getAdminToken() {
  return cookies().get('admin_token')?.value;
}

/**
 * Verifies the `admin_token` cookie (HS256 signed JWT).
 * Returns the decoded payload if valid, otherwise `null`.
 */
export async function getAdminSession(): Promise<AdminJwtPayload | null> {
  const token = getAdminToken();
  const adminSecret = process.env.ADMIN_SECRET_TOKEN;
  if (!token || !adminSecret) return null;

  try {
    const secret = new TextEncoder().encode(adminSecret);
    const { payload } = await jwtVerify(token, secret);
    return payload as AdminJwtPayload;
  } catch {
    return null;
  }
}

export async function requireAdmin(allowedRoles: string[] = ['admin', 'editor']) {
  const session = await getAdminSession();
  const role = session?.role;
  if (!role || !allowedRoles.includes(role)) return null;
  return session;
}

export function logout() {
  cookies().delete('admin_token');
}
