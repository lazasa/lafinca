import { NextRequest, NextResponse } from "next/server";
import { createTask, listTasks, updateTaskStatus } from "@/lib/db/tasks";
import { createTaskSchema, updateTaskStatusSchema } from "@/lib/validations/task";
import { checkAccess } from "@/lib/auth/check";
import { TaskStatus } from "@prisma/client";

interface TasksResponse {
  success: boolean;
  tasks?: Array<{
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
    createdAt: string;
    updatedAt: string;
  }>;
  error?: string;
}

interface CreateTaskResponse {
  success: boolean;
  task?: {
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
    createdAt: string;
    updatedAt: string;
  };
  error?: string;
}

interface UpdateTaskResponse {
  success: boolean;
  task?: {
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
    createdAt: string;
    updatedAt: string;
  };
  error?: string;
}

export async function GET(request: NextRequest) {
  try {
    const payload = await checkAccess(request);

    if (!payload) {
      return NextResponse.json<TasksResponse>(
        { success: false, error: "Token inválido" },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const statusParam = searchParams.get("status");

    let status: TaskStatus | undefined;
    if (statusParam === "PENDIENTE" || statusParam === "COMPLETADA") {
      status = statusParam;
    }

    const tasks = await listTasks(status);

    const formattedTasks = tasks.map((task) => ({
      id: task.id,
      title: task.title,
      description: task.description,
      status: task.status,
      createdById: task.createdById,
      createdBy: task.createdBy,
      createdAt: task.createdAt.toISOString(),
      updatedAt: task.updatedAt.toISOString(),
    }));

    return NextResponse.json<TasksResponse>({
      success: true,
      tasks: formattedTasks,
    });
  } catch (error) {
    console.error("Error fetching tasks:", error);
    return NextResponse.json<TasksResponse>(
      { success: false, error: "Error al obtener las tareas" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const payload = await checkAccess(request);

    if (!payload) {
      return NextResponse.json<CreateTaskResponse>(
        { success: false, error: "Token inválido" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const validation = createTaskSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json<CreateTaskResponse>(
        { success: false, error: "Datos inválidos" },
        { status: 400 }
      );
    }

    const task = await createTask({
      title: validation.data.title,
      description: validation.data.description,
      createdById: payload.userId,
    });

    return NextResponse.json<CreateTaskResponse>({
      success: true,
      task: {
        id: task.id,
        title: task.title,
        description: task.description,
        status: task.status,
        createdById: task.createdById,
        createdBy: task.createdBy,
        createdAt: task.createdAt.toISOString(),
        updatedAt: task.updatedAt.toISOString(),
      },
    });
  } catch (error) {
    console.error("Error creating task:", error);
    return NextResponse.json<CreateTaskResponse>(
      { success: false, error: "Error al crear la tarea" },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const payload = await checkAccess(request);

    if (!payload) {
      return NextResponse.json<UpdateTaskResponse>(
        { success: false, error: "Token inválido" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { id, ...statusData } = body;

    if (!id || typeof id !== "string") {
      return NextResponse.json<UpdateTaskResponse>(
        { success: false, error: "ID de tarea inválido" },
        { status: 400 }
      );
    }

    const validation = updateTaskStatusSchema.safeParse(statusData);

    if (!validation.success) {
      return NextResponse.json<UpdateTaskResponse>(
        { success: false, error: "Estado inválido" },
        { status: 400 }
      );
    }

    const task = await updateTaskStatus(id, validation.data.status);

    return NextResponse.json<UpdateTaskResponse>({
      success: true,
      task: {
        id: task.id,
        title: task.title,
        description: task.description,
        status: task.status,
        createdById: task.createdById,
        createdBy: task.createdBy,
        createdAt: task.createdAt.toISOString(),
        updatedAt: task.updatedAt.toISOString(),
      },
    });
  } catch (error) {
    console.error("Error updating task:", error);
    return NextResponse.json<UpdateTaskResponse>(
      { success: false, error: "Error al actualizar la tarea" },
      { status: 500 }
    );
  }
}
