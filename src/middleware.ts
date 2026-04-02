import { NextRequest, NextResponse } from 'next/server';
import { jwtVerify } from 'jose';

export async function middleware(req: NextRequest) {
  const url = req.nextUrl;
  
  // 1. URL Normalization: Force lowercase, strip trailing slash, and redirect legacy routes
  if (!url.pathname.startsWith('/_next') && !url.pathname.startsWith('/api')) {
    let changed = false;

    // Force Lowercase
    if (url.pathname !== url.pathname.toLowerCase()) {
      url.pathname = url.pathname.toLowerCase();
      changed = true;
    }

    // Strip Trailing Slashes (except home)
    if (url.pathname.length > 1 && url.pathname.endsWith('/')) {
      url.pathname = url.pathname.slice(0, -1);
      changed = true;
    }

    // Redirect Legacy Multi-level Routes (Calculators/[category]/[slug] -> /calculator/[slug])
    // Example: /calculators/finance/loan-emi -> /calculator/loan-emi
    const calculatorsMatch = url.pathname.match(/^\/calculators\/[^/]+\/([^/]+)$/);
    if (calculatorsMatch) {
      url.pathname = `/calculator/${calculatorsMatch[1]}`;
      changed = true;
    }

    if (changed) {
      return NextResponse.redirect(url, 301); // Permanent Redirect
    }
  }

  // 2. Admin Router Protection (UI + sensitive admin APIs)
  const isAdminUi = url.pathname.startsWith('/admin');
  const isAdminApi = url.pathname.startsWith('/api/admin');

  // Public endpoints that bootstrap admin auth:
  const isAdminApiPublic =
    url.pathname === '/api/admin/auth' ||
    url.pathname === '/api/admin/session' ||
    url.pathname === '/api/admin/setup';

  if (isAdminUi) {
    // Allow login and setup pages
    if (url.pathname === '/admin/login' || url.pathname === '/admin/setup') {
      return NextResponse.next();
    }

    // Check for admin token cookie
    const token = req.cookies.get('admin_token')?.value;
    const adminSecret = process.env.ADMIN_SECRET_TOKEN;
    
    if (!adminSecret || !token) {
      return NextResponse.redirect(new URL('/admin/login', req.url));
    }

    try {
      const secret = new TextEncoder().encode(adminSecret);
      const { payload } = await jwtVerify(token, secret);
      if (payload.role !== 'admin' && payload.role !== 'editor') {
        return NextResponse.redirect(new URL('/admin/login', req.url));
      }
    } catch (error) {
      return NextResponse.redirect(new URL('/admin/login', req.url));
    }
  }

  if (isAdminApi && !isAdminApiPublic) {
    const token = req.cookies.get('admin_token')?.value;
    const adminSecret = process.env.ADMIN_SECRET_TOKEN;

    if (!adminSecret || !token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
      const secret = new TextEncoder().encode(adminSecret);
      const { payload } = await jwtVerify(token, secret);
      if (payload.role !== 'admin' && payload.role !== 'editor') {
        return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
      }
    } catch {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};
