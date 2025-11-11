"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { useTasks } from "@/hooks/useTasks";
import TasksList from "@/components/TasksList";

export default function TasksPage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const { tasks, loadingTasks, fetchTasks } = useTasks();

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/");
    }
  }, [user, isLoading, router]);

  if (isLoading) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-finca-brown text-xl">Cargando...</div>
      </main>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <main className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <button
            onClick={() => router.push("/dashboard")}
            className="text-finca-green hover:text-finca-orange-dark font-semibold mb-4 inline-flex items-center gap-2"
          >
            ← Volver al inicio
          </button>
          <div className="bg-white rounded-2xl shadow-2xl p-4 sm:p-6 md:p-8">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-finca-green mb-2">
              Gestión de tareas
            </h1>
            <p className="text-sm sm:text-base text-finca-brown">
              Administra las tareas pendientes y completadas
            </p>
          </div>
        </div>

        <div className="max-w-4xl">
          <TasksList
            tasks={tasks}
            onTaskUpdate={fetchTasks}
            loading={loadingTasks}
          />
        </div>
      </div>
    </main>
  );
}
