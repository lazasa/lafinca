import { NextRequest, NextResponse } from 'next/server';
import { verifyAccessToken } from '@/lib/auth/jwt';

export async function GET(request: NextRequest) {
  const authHeader = request.headers.get('authorization');

  if (!authHeader?.startsWith('Bearer ')) {
    return NextResponse.json(
      { error: 'Token no proporcionado' },
      { status: 401 }
    );
  }

  const token = authHeader.substring(7);
  const payload = await verifyAccessToken(token);

  if (!payload || payload.type !== 'access') {
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
      rol: payload.rol,
    },
  });
}
