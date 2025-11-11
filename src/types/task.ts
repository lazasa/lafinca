import { TaskStatus } from "@prisma/client";

export interface Task {
  id: string;
  title: string;
  description: string | null;
  status: TaskStatus;
  createdById: string;
  createdBy: {
    id: string;
    username: string;
    color: string;
  };
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateTaskInput {
  title: string;
  description?: string;
}

export interface UpdateTaskStatusInput {
  status: TaskStatus;
}
