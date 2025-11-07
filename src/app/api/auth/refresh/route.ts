import { NextRequest, NextResponse } from 'next/server';
import { verifyRefreshToken, generateAccessToken } from '@/lib/auth/jwt';
import { authConfig, validateAuthConfig } from '@/lib/config/auth';
import { getUserById } from '@/lib/db/users';
import type { AuthResponse } from '@/types/auth';

export async function POST(request: NextRequest) {
  try {
    validateAuthConfig();

    const refreshToken = request.cookies.get(authConfig.cookies.refreshToken.name)?.value;

    if (!refreshToken) {
      return NextResponse.json<AuthResponse>(
        {
          success: false,
          error: 'Token de actualización no encontrado',
        },
        { status: 401 }
      );
    }

    const payload = await verifyRefreshToken(refreshToken);

    if (!payload || payload.type !== 'refresh') {
      return NextResponse.json<AuthResponse>(
        {
          success: false,
          error: 'Token de actualización inválido',
        },
        { status: 401 }
      );
    }

    const user = await getUserById(payload.userId);

    if (!user) {
      return NextResponse.json<AuthResponse>(
        {
          success: false,
          error: 'Usuario no encontrado',
        },
        { status: 401 }
      );
    }

    const newAccessToken = await generateAccessToken(user);

    return NextResponse.json<AuthResponse>({
      success: true,
      accessToken: newAccessToken,
      user,
    });
  } catch (error) {
    console.error('Refresh token error:', error);
    return NextResponse.json<AuthResponse>(
      {
        success: false,
        error: 'Error al actualizar el token',
      },
      { status: 500 }
    );
  }
}
