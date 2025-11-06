import { NextRequest, NextResponse } from 'next/server';
import { authenticateUser } from '@/lib/auth/service';
import { authConfig, validateAuthConfig } from '@/lib/config/auth';
import { loginSchema } from '@/lib/validations/auth';
import type { AuthResponse } from '@/types/auth';

export async function POST(request: NextRequest) {
  try {
    validateAuthConfig();

    const body = await request.json();
    
    const validationResult = loginSchema.safeParse(body);
    
    if (!validationResult.success) {
      return NextResponse.json<AuthResponse>(
        {
          success: false,
          error: 'Credenciales inválidas',
        },
        { status: 400 }
      );
    }

    const result = await authenticateUser(validationResult.data);

    if (!result) {
      return NextResponse.json<AuthResponse>(
        {
          success: false,
          error: 'Usuario o contraseña incorrectos',
        },
        { status: 401 }
      );
    }

    const response = NextResponse.json<AuthResponse>({
      success: true,
      accessToken: result.tokens.accessToken,
      user: result.user,
    });

    response.cookies.set(
      authConfig.cookies.refreshToken.name,
      result.tokens.refreshToken,
      authConfig.cookies.refreshToken
    );

    return response;
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json<AuthResponse>(
      {
        success: false,
        error: 'Error al procesar la solicitud',
      },
      { status: 500 }
    );
  }
}
