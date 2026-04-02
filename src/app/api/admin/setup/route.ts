import { NextRequest, NextResponse } from 'next/server';

/**
 * Admin bootstrap endpoint.
 * Verifies the typed `secret` against `ADMIN_SECRET_TOKEN` on the server.
 *
 * Important: this must NOT expose `ADMIN_SECRET_TOKEN` to the client bundle.
 */
export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({} as any));
  const secret = body?.secret;

  const adminSecret = process.env.ADMIN_SECRET_TOKEN;
  if (!adminSecret) {
    return NextResponse.json({ error: 'Server misconfigured' }, { status: 500 });
  }

  if (typeof secret !== 'string' || !secret.trim()) {
    return NextResponse.json({ error: 'Missing secret' }, { status: 400 });
  }

  if (secret !== adminSecret) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  return NextResponse.json({ success: true });
}

