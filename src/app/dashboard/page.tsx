"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { useRentals } from "@/hooks/useRentals";
import Calendar from "@/components/Calendar";

export default function Dashboard() {
  const { user, isLoading, logout } = useAuth();
  const router = useRouter();
  const { rentals, loadingRentals, currentDate, setCurrentDate } = useRentals();

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/");
    }
  }, [user, isLoading, router]);

  const handleLogout = async () => {
    await logout();
    router.push("/");
  };

  const handlePreviousMonth = () => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1)
    );
  };

  const handleNextMonth = () => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1)
    );
  };

  if (isLoading) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-finca-black">
        <div className="text-white text-xl">Cargando...</div>
      </main>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <main className="min-h-screen bg-finca-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <div className="bg-white rounded-2xl shadow-2xl p-8">
            <div className="flex justify-between items-start mb-8">
              <div>
                <h1 className="text-4xl font-bold text-finca-green mb-2">
                  Administración
                </h1>
                <p className="text-finca-brown">
                  Bienvenido,{" "}
                  <span className="font-semibold">{user.username}</span>
                </p>
              </div>
              <button
                onClick={handleLogout}
                className="cursor-pointer bg-finca-brown text-white px-6 py-2 rounded-lg font-semibold hover:bg-finca-orange-dark transition-colors duration-200"
              >
                Cerrar sesión
              </button>
            </div>
          </div>
        </div>

        <Calendar
          currentDate={currentDate}
          rentals={rentals}
          onPreviousMonth={handlePreviousMonth}
          onNextMonth={handleNextMonth}
          currentUserId={user.id}
          loading={loadingRentals}
          compact={true}
        />
      </div>
    </main>
  );
}
