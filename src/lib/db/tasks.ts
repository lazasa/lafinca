import { prisma } from "./prisma";
import { TaskStatus } from "@prisma/client";

export async function createTask(data: {
  title: string;
  description?: string;
  createdById: string;
}) {
  return await prisma.task.create({
    data: {
      title: data.title,
      description: data.description,
      createdById: data.createdById,
    },
    include: {
      createdBy: {
        select: {
          id: true,
          username: true,
          color: true,
        },
      },
    },
  });
}

export async function listTasks(status?: TaskStatus) {
  return await prisma.task.findMany({
    where: status ? { status } : undefined,
    include: {
      createdBy: {
        select: {
          id: true,
          username: true,
          color: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });
}

export async function getTaskById(id: string) {
  return await prisma.task.findUnique({
    where: { id },
    include: {
      createdBy: {
        select: {
          id: true,
          username: true,
          color: true,
        },
      },
    },
  });
}

export async function updateTaskStatus(id: string, status: TaskStatus) {
  return await prisma.task.update({
    where: { id },
    data: { status },
    include: {
      createdBy: {
        select: {
          id: true,
          username: true,
          color: true,
        },
      },
    },
  });
}

export async function deleteTask(id: string) {
  return await prisma.task.delete({
    where: { id },
  });
}
