import { prisma } from './prisma';
import type { User } from '@/types/auth';

type UserWithPassword = User & { password: string };

export async function getUserByUsername(username: string): Promise<UserWithPassword | null> {
  const user = await prisma.user.findUnique({
    where: { username },
    select: {
      id: true,
      username: true,
      password: true,
    },
  });

  return user;
}

export async function getUserById(id: string): Promise<User | null> {
  const user = await prisma.user.findUnique({
    where: { id },
    select: {
      id: true,
      username: true,
    },
  });

  return user;
}

export async function createUser(data: {
  username: string;
  password: string;
}): Promise<User> {
  const user = await prisma.user.create({
    data,
    select: {
      id: true,
      username: true,
    },
  });

  return user;
}
