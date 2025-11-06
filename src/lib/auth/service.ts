import { verifyPassword } from '@/lib/auth/password';
import { generateTokens } from '@/lib/auth/jwt';
import { getUserByUsername } from '@/lib/db/users';
import type { LoginCredentials, AuthTokens, User } from '@/types/auth';

export async function authenticateUser(credentials: LoginCredentials): Promise<{ user: User; tokens: AuthTokens } | null> {
  const userRecord = getUserByUsername(credentials.username);
  
  if (!userRecord) {
    return null;
  }

  const isPasswordValid = await verifyPassword(credentials.password, userRecord.passwordHash);
  
  if (!isPasswordValid) {
    return null;
  }

  const tokens = await generateTokens(userRecord.user);

  return {
    user: userRecord.user,
    tokens,
  };
}
