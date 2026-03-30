import { cookies } from 'next/headers';

export function getAdminToken() {
  return cookies().get('admin_token')?.value;
}

export function isAuthenticated() {
  const token = getAdminToken();
  return token === process.env.ADMIN_SECRET_TOKEN;
}

export function logout() {
  cookies().delete('admin_token');
}
