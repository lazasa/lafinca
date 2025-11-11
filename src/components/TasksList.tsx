"use client";

import { useState } from "react";
import { Task } from "@/types/task";
import { TaskStatus } from "@prisma/client";
import { useAuthenticatedFetch } from "@/hooks/useAuthenticatedFetch";

interface TasksListProps {
  tasks: Task[];
  onTaskUpdate: () => void;
  loading: boolean;
}

export default function TasksList({
  tasks,
  onTaskUpdate,
  loading,
}: TasksListProps) {
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [newTaskDescription, setNewTaskDescription] = useState("");
  const [showCompleted, setShowCompleted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const authenticatedFetch = useAuthenticatedFetch();

  const pendingTasks = tasks.filter(
    (task) => task.status === TaskStatus.PENDIENTE
  );
  const completedTasks = tasks.filter(
    (task) => task.status === TaskStatus.COMPLETADA
  );

  const handleCreateTask = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!newTaskTitle.trim()) return;

    setSubmitting(true);
    try {
      const response = await authenticatedFetch("/api/tasks", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: newTaskTitle,
          description: newTaskDescription || undefined,
        }),
      });

      if (response.ok) {
        setNewTaskTitle("");
        setNewTaskDescription("");
        onTaskUpdate();
      } else {
        const errorData = await response.json();
        alert(errorData.error || "Error al crear la tarea");
      }
    } catch (error) {
      console.error("Error creating task:", error);
      alert("Error al crear la tarea");
    } finally {
      setSubmitting(false);
    }
  };

  const handleUpdateStatus = async (taskId: string, newStatus: TaskStatus) => {
    try {
      const response = await authenticatedFetch("/api/tasks", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: taskId,
          status: newStatus,
        }),
      });

      if (response.ok) {
        onTaskUpdate();
      } else {
        const errorData = await response.json();
        alert(errorData.error || "Error al actualizar la tarea");
      }
    } catch (error) {
      console.error("Error updating task:", error);
      alert("Error al actualizar la tarea");
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-2xl shadow-2xl p-8">
        <div className="text-finca-brown">Cargando tareas...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl shadow-2xl p-8">
        <h2 className="text-2xl font-semibold text-finca-green mb-6">Tareas</h2>

        <form onSubmit={handleCreateTask} className="mb-8 space-y-4">
          <div>
            <label
              htmlFor="taskTitle"
              className="block text-sm font-medium text-finca-brown mb-2"
            >
              Nueva tarea
            </label>
            <input
              id="taskTitle"
              type="text"
              value={newTaskTitle}
              onChange={(e) => setNewTaskTitle(e.target.value)}
              placeholder="Título de la tarea"
              className="w-full border border-finca-beige rounded-lg py-3 px-4 text-finca-brown placeholder-finca-beige-text focus:outline-none focus:ring-2 focus:ring-finca-green"
              disabled={submitting}
            />
          </div>
          <div>
            <label
              htmlFor="taskDescription"
              className="block text-sm font-medium text-finca-brown mb-2"
            >
              Descripción (opcional)
            </label>
            <textarea
              id="taskDescription"
              value={newTaskDescription}
              onChange={(e) => setNewTaskDescription(e.target.value)}
              placeholder="Descripción adicional"
              rows={2}
              className="w-full border border-finca-beige rounded-lg py-3 px-4 text-finca-brown placeholder-finca-beige-text focus:outline-none focus:ring-2 focus:ring-finca-green resize-none"
              disabled={submitting}
            />
          </div>
          <button
            type="submit"
            disabled={submitting || !newTaskTitle.trim()}
            className="w-full bg-finca-green text-white py-3 px-6 rounded-lg font-semibold hover:bg-finca-orange-dark transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {submitting ? "Creando..." : "Agregar tarea"}
          </button>
        </form>

        <div className="space-y-4">
          <h3 className="text-xl font-semibold text-finca-brown">Pendientes</h3>
          {pendingTasks.length === 0 ? (
            <p className="text-finca-beige-text text-sm">
              No hay tareas pendientes
            </p>
          ) : (
            <div className="space-y-3">
              {pendingTasks.map((task) => (
                <div
                  key={task.id}
                  className="border border-finca-beige rounded-lg p-4 flex justify-between items-start gap-4"
                >
                  <div className="flex-1">
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
                  <button
                    onClick={() =>
                      handleUpdateStatus(task.id, TaskStatus.COMPLETADA)
                    }
                    className="bg-finca-brown text-white py-2 px-4 rounded-lg text-sm font-semibold hover:bg-finca-orange-dark transition-colors duration-200 whitespace-nowrap"
                  >
                    Tachar
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-2xl p-8">
        <button
          onClick={() => setShowCompleted(!showCompleted)}
          className="w-full flex justify-between items-center mb-4"
        >
          <h3 className="text-xl font-semibold text-finca-brown">
            Completadas ({completedTasks.length})
          </h3>
          <span className="text-finca-green text-2xl">
            {showCompleted ? "−" : "+"}
          </span>
        </button>

        {showCompleted && (
          <div className="space-y-3">
            {completedTasks.length === 0 ? (
              <p className="text-finca-beige-text text-sm">
                No hay tareas completadas
              </p>
            ) : (
              completedTasks.map((task) => (
                <div
                  key={task.id}
                  className="border border-finca-beige rounded-lg p-4 flex justify-between items-start gap-4 opacity-60"
                >
                  <div className="flex-1">
                    <h4 className="font-semibold text-finca-brown mb-1 line-through">
                      {task.title}
                    </h4>
                    {task.description && (
                      <p className="text-sm text-finca-brown mb-2 line-through">
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
                  <button
                    onClick={() =>
                      handleUpdateStatus(task.id, TaskStatus.PENDIENTE)
                    }
                    className="bg-finca-green text-white py-2 px-4 rounded-lg text-sm font-semibold hover:bg-finca-orange-dark transition-colors duration-200 whitespace-nowrap"
                  >
                    Pendiente
                  </button>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
}
