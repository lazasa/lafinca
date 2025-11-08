import { prisma } from "@/lib/db/prisma";

export async function getRentals(startDate?: Date, endDate?: Date) {
  const where = startDate && endDate
    ? {
        date: {
          gte: startDate,
          lte: endDate,
        },
      }
    : {};

  return await prisma.rental.findMany({
    where,
    include: {
      user: {
        select: {
          username: true,
        },
      },
    },
    orderBy: {
      date: "asc",
    },
  });
}

export async function createRental(date: Date, userId: string) {
  return await prisma.rental.create({
    data: {
      date,
      userId,
    },
    include: {
      user: {
        select: {
          username: true,
        },
      },
    },
  });
}

export async function deleteRental(date: Date, userId: string) {
  return await prisma.rental.deleteMany({
    where: {
      date,
      userId,
    },
  });
}

export async function getRentalByDateAndUser(date: Date, userId: string) {
  return await prisma.rental.findUnique({
    where: {
      date_userId: {
        date,
        userId,
      },
    },
    include: {
      user: {
        select: {
          username: true,
        },
      },
    },
  });
}
