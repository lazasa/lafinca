"use client";

import { Task } from "@/types/task";
import { TaskStatus } from "@prisma/client";
import Link from "next/link";

interface TasksSummaryProps {
  tasks: Task[];
  loading: boolean;
}

export default function TasksSummary({ tasks, loading }: TasksSummaryProps) {
  const pendingTasks = tasks
    .filter((task) => task.status === TaskStatus.PENDIENTE)
    .slice(0, 5);

  if (loading) {
    return (
      <div className="bg-white rounded-2xl shadow-2xl p-6 sm:p-8">
        <div className="text-finca-brown">Cargando tareas...</div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-2xl p-6 sm:p-8">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-semibold text-finca-green">
          Tareas pendientes
        </h2>
        <Link
          href="/dashboard/tasks"
          className="bg-finca-green text-white px-4 py-2 rounded-lg font-semibold hover:bg-finca-orange-dark transition-colors duration-200 text-sm"
        >
          Ver todas
        </Link>
      </div>

      {pendingTasks.length === 0 ? (
        <p className="text-finca-beige-text text-sm">
          No hay tareas pendientes
        </p>
      ) : (
        <div className="space-y-3">
          {pendingTasks.map((task) => (
            <div
              key={task.id}
              className="border border-finca-beige rounded-lg p-4"
            >
              <h4 className="font-semibold text-finca-brown mb-1">
                {task.title}
              </h4>
              {task.description && (
                <p className="text-sm text-finca-brown mb-2">
                  {task.description}
                </p>
              )}
              <p className="text-xs text-finca-beige-text">
                Creada por{" "}
                <span
                  className="font-semibold"
                  style={{ color: task.createdBy.color }}
                >
                  {task.createdBy.username}
                </span>
              </p>
            </div>
          ))}
        </div>
      )}

      <div className="mt-6 pt-6 border-t border-finca-beige">
        <Link
          href="/dashboard/tasks"
          className="text-finca-green hover:text-finca-orange-dark font-semibold text-sm"
        >
          Gestionar tareas →
        </Link>
      </div>
    </div>
  );
}
