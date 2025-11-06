import type { User } from '@/types/auth';

export const mockUsers: Record<string, { user: User; passwordHash: string }> = {
  admin: {
    user: {
      id: '1',
      username: 'admin',
      nombre: 'Administrador',
      rol: 'admin',
    },
    passwordHash: '$2a$10$rG8kPQmFMYVYMQyN5dKBju2GHq.FQ5cYLvXLZO.JvKmOELwL2xQ2e',
  },
};

export function getUserByUsername(username: string): { user: User; passwordHash: string } | null {
  return mockUsers[username] || null;
}
