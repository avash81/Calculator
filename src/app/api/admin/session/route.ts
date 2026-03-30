import { NextRequest, NextResponse } from 'next/server';
import { SignJWT } from 'jose';

export async function POST(req: NextRequest) {
  const adminSecret = process.env.ADMIN_SECRET_TOKEN || 'calcpro-admin-2082-nepal';
  const secret = new TextEncoder().encode(adminSecret);
  
  const token = await new SignJWT({ role: 'admin' })
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
