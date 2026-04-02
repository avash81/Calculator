import { NextRequest, NextResponse } from 'next/server';
import { SignJWT, createRemoteJWKSet, jwtVerify } from 'jose';

export async function POST(req: NextRequest) {
  const adminSecret = process.env.ADMIN_SECRET_TOKEN;
  if (!adminSecret) {
    return NextResponse.json({ error: 'Server misconfigured' }, { status: 500 });
  }

  const body = await req.json().catch(() => ({} as any));
  const idToken = body?.idToken;
  if (!idToken || typeof idToken !== 'string') {
    return NextResponse.json({ error: 'Missing idToken' }, { status: 400 });
  }

  const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
  if (!projectId) {
    return NextResponse.json({ error: 'Firebase not configured' }, { status: 500 });
  }
  const dbId = process.env.NEXT_PUBLIC_FIREBASE_DATABASE_ID || '(default)';

  // Verify Firebase ID token signature (prevents minting admin cookies without valid Firebase auth).
  const jwks = createRemoteJWKSet(
    new URL('https://www.googleapis.com/robot/v1/metadata/x509/securetoken@system.gserviceaccount.com')
  );

  let decoded: any;
  try {
    const issuer = `https://securetoken.google.com/${projectId}`;
    const { payload } = await jwtVerify(idToken, jwks, {
      issuer,
      audience: projectId,
    });
    decoded = payload;
  } catch {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const uid = decoded?.user_id as string | undefined;
  if (!uid) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  // Ask Firestore (with the caller's ID token) which role they have.
  // This mirrors `firestore.rules` authorization logic without needing firebase-admin.
  let role: string | undefined;
  try {
    const url = `https://firestore.googleapis.com/v1/projects/${projectId}/databases/${dbId}/documents/users/${uid}`;
    const res = await fetch(url, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${idToken}`,
      },
    });

    if (res.ok) {
      const data = await res.json();
      role = data?.fields?.role?.stringValue;
    }
  } catch {
    // Fall through to deny below.
  }

  if (role !== 'admin' && role !== 'editor') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  const secret = new TextEncoder().encode(adminSecret);
  const token = await new SignJWT({ role })
    .setProtectedHeader({ alg: 'HS256' })
    .setExpirationTime('8h')
    .sign(secret);

  const response = NextResponse.json({ success: true });
  response.cookies.set('admin_token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 8 * 60 * 60, // 8h
    path: '/',
  });

  return response;
}
