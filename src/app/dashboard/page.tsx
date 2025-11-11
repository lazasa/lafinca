"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { useRentals } from "@/hooks/useRentals";
import { useTasks } from "@/hooks/useTasks";
import RentalsSummary from "@/components/RentalsSummary";
import TasksSummary from "@/components/TasksSummary";

export default function Dashboard() {
  const { user, isLoading, logout } = useAuth();
  const router = useRouter();
  const { rentals, loadingRentals } = useRentals();
  const { tasks, loadingTasks } = useTasks();

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/");
    }
  }, [user, isLoading, router]);

  const handleLogout = async () => {
    await logout();
    router.push("/");
  };

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
          <div className="bg-white rounded-2xl shadow-2xl p-4 sm:p-6 md:p-8">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 sm:gap-0">
              <div>
                <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-finca-green mb-2">
                  Administración
                </h1>
                <p className="text-sm sm:text-base text-finca-brown">
                  Bienvenido,{" "}
                  <span className="font-semibold">{user.username}</span>
                </p>
              </div>
              <button
                onClick={handleLogout}
                className="w-full sm:w-auto cursor-pointer bg-finca-brown text-white px-4 sm:px-6 py-2 rounded-lg font-semibold hover:bg-finca-orange-dark transition-colors duration-200 text-sm sm:text-base"
              >
                Cerrar sesión
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <RentalsSummary
            rentals={rentals}
            currentUserId={user.id}
            loading={loadingRentals}
          />

          <TasksSummary tasks={tasks} loading={loadingTasks} />
        </div>
      </div>
    </main>
  );
}
