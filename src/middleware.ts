import { NextRequest, NextResponse } from 'next/server';

export function middleware(req: NextRequest) {
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

  // 2. Admin Router Protection
  if (url.pathname.startsWith('/admin')) {
    // Allow login page
    if (url.pathname === '/admin/login') return NextResponse.next();

    // Check for admin token cookie
    const token = req.cookies.get('admin_token')?.value;
    const adminSecret = process.env.ADMIN_SECRET_TOKEN;
    
    // If secret is not set or token doesn't match, redirect to login
    if (!adminSecret || token !== adminSecret) {
      return NextResponse.redirect(new URL('/admin/login', req.url));
    }
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};
