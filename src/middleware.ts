import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  if (request.nextUrl.pathname.startsWith('/admin')) {
    // Exclude login route
    if (!request.nextUrl.pathname.startsWith('/admin/login')) {
      const token = request.cookies.get('admin_token');
      if (!token) {
        return NextResponse.redirect(new URL('/admin/login', request.url));
      }
    }
  }
  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};
