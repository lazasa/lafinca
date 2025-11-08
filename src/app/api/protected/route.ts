import { NextRequest, NextResponse } from 'next/server';
import { checkAccess } from '@/lib/auth/check';

export async function GET(request: NextRequest) {
  const payload = await checkAccess(request);
  
  if (!payload) {
    return NextResponse.json(
      { error: 'Token inválido o expirado' },
      { status: 401 }
    );
  }

  return NextResponse.json({
    message: 'Acceso autorizado',
    user: {
      userId: payload.userId,
      username: payload.username,
    },
  });
}
