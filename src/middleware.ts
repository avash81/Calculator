import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Protect /admin routes
  if (pathname.startsWith('/admin')) {
    // Allow access to the login page itself
    if (pathname.startsWith('/admin/login')) {
      return NextResponse.next();
    }

    const token = request.cookies.get('admin_token')?.value;
    const adminSecret = process.env.ADMIN_SECRET_TOKEN;

    if (!token || !adminSecret) {
      const url = new URL('/admin/login', request.url);
      return NextResponse.redirect(url);
    }

    try {
      const secret = new TextEncoder().encode(adminSecret);
      await jwtVerify(token, secret);
      // Signature is valid
      return NextResponse.next();
    } catch (error) {
      // Token is invalid, expired, or tampered with
      console.warn('Middleware: Invalid admin_token detected. Redirecting to login.');
      const response = NextResponse.redirect(new URL('/admin/login', request.url));
      // Clear the invalid cookie
      response.cookies.delete('admin_token');
      return response;
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};
