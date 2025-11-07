import { SignJWT, jwtVerify } from 'jose';
import { authConfig } from '@/lib/config/auth';
import type { TokenPayload, User } from '@/types/auth';

const accessSecretKey = new TextEncoder().encode(authConfig.jwt.accessSecret);
const refreshSecretKey = new TextEncoder().encode(authConfig.jwt.refreshSecret);

export async function generateAccessToken(user: User): Promise<string> {
  const token = await new SignJWT({
    userId: user.id,
    username: user.username,
    type: 'access',
  })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime(authConfig.jwt.accessTokenExpiry)
    .sign(accessSecretKey);

  return token;
}

export async function generateRefreshToken(user: User): Promise<string> {
  const token = await new SignJWT({
    userId: user.id,
    username: user.username,
    type: 'refresh',
  })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime(authConfig.jwt.refreshTokenExpiry)
    .sign(refreshSecretKey);

  return token;
}

export async function verifyAccessToken(token: string): Promise<TokenPayload | null> {
  try {
    const { payload } = await jwtVerify(token, accessSecretKey);
    return payload as unknown as TokenPayload;
  } catch {
    return null;
  }
}

export async function verifyRefreshToken(token: string): Promise<TokenPayload | null> {
  try {
    const { payload } = await jwtVerify(token, refreshSecretKey);
    return payload as unknown as TokenPayload;
  } catch {
    return null;
  }
}

export async function generateTokens(user: User): Promise<{ accessToken: string; refreshToken: string }> {
  const [accessToken, refreshToken] = await Promise.all([
    generateAccessToken(user),
    generateRefreshToken(user),
  ]);

  return { accessToken, refreshToken };
}
