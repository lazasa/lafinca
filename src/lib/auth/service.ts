import { verifyPassword } from '@/lib/auth/password';
import { generateTokens } from '@/lib/auth/jwt';
import { getUserByUsername } from '@/lib/db/users';
import type { LoginCredentials, AuthTokens, User } from '@/types/auth';

export async function authenticateUser(credentials: LoginCredentials): Promise<{ user: User; tokens: AuthTokens } | null> {
  const user = await getUserByUsername(credentials.username);
  
  if (!user) {
    return null;
  }

  const isPasswordValid = await verifyPassword(credentials.password, user.password);
  
  if (!isPasswordValid) {
    return null;
  }

  const userWithoutPassword = {
    id: user.id,
    username: user.username,
    color: user.color,
  };

  const tokens = await generateTokens(userWithoutPassword);

  return {
    user: userWithoutPassword,
    tokens,
  };
}
