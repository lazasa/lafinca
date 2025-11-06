export const authConfig = {
  jwt: {
    accessSecret: process.env.JWT_ACCESS_SECRET || '',
    refreshSecret: process.env.JWT_REFRESH_SECRET || '',
    accessTokenExpiry: '15m',
    refreshTokenExpiry: '7d',
  },
  cookies: {
    refreshToken: {
      name: 'refresh_token',
      maxAge: 7 * 24 * 60 * 60,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax' as const,
      path: '/',
    },
  },
};

export function validateAuthConfig() {
  if (!authConfig.jwt.accessSecret || !authConfig.jwt.refreshSecret) {
    throw new Error('JWT secrets must be configured in environment variables');
  }
}
