import { prisma } from './prisma';
import type { User } from '@/types/auth';

type UserWithPassword = User & { password: string };

const USER_COLORS = [
  "#2E6B3A",
  "#C96E2D",
  "#5A3A1E",
  "#E19A56",
  "#F3B94D",
  "#8B4513",
  "#228B22",
  "#CD853F",
  "#D2691E",
  "#B8860B",
  "#8FBC8F",
  "#BC8F8F",
];

export function getRandomUserColor(existingColors: string[] = []): string {
  const availableColors = USER_COLORS.filter(
    (color) => !existingColors.includes(color)
  );

  if (availableColors.length === 0) {
    return USER_COLORS[Math.floor(Math.random() * USER_COLORS.length)];
  }

  return availableColors[Math.floor(Math.random() * availableColors.length)];
}

export function getAllUserColors(): string[] {
  return [...USER_COLORS];
}

export async function getUserByUsername(username: string): Promise<UserWithPassword | null> {
  const user = await prisma.user.findUnique({
    where: { username },
    select: {
      id: true,
      username: true,
      password: true,
      color: true,
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
      color: true,
    },
  });

  return user;
}

export async function createUser(data: {
  username: string;
  password: string;
}): Promise<User> {
  const existingUsers = await prisma.user.findMany({
    select: { color: true },
  });
  const existingColors = existingUsers.map((u) => u.color);
  const color = getRandomUserColor(existingColors);

  const user = await prisma.user.create({
    data: {
      ...data,
      color,
    },
    select: {
      id: true,
      username: true,
      color: true,
    },
  });

  return user;
}
