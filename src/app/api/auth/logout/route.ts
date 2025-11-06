import { NextResponse } from 'next/server';
import { authConfig } from '@/lib/config/auth';

export async function POST() {
  const response = NextResponse.json({
    success: true,
  });

  response.cookies.set(authConfig.cookies.refreshToken.name, '', {
    ...authConfig.cookies.refreshToken,
    maxAge: 0,
  });

  return response;
}
