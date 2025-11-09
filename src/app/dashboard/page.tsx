"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { useRentals } from "@/hooks/useRentals";
import { useAuthenticatedFetch } from "@/hooks/useAuthenticatedFetch";
import Calendar from "@/components/Calendar";

export default function Dashboard() {
  const { user, isLoading, logout } = useAuth();
  const router = useRouter();
  const { rentals, loadingRentals, currentDate, setCurrentDate, fetchRentals } =
    useRentals();
  const authenticatedFetch = useAuthenticatedFetch();

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

  const handleDeleteRental = async (rentalId: string) => {
    try {
      const rental = rentals.find((r) => r.id === rentalId);
      if (!rental) return;

      const response = await authenticatedFetch("/api/rentals", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ date: rental.date }),
      });

      if (response.ok) {
        fetchRentals();
      } else {
        const errorData = await response.json();
        alert(errorData.error || "Error al eliminar la reserva");
      }
    } catch (error) {
      console.error("Error deleting rental:", error);
      alert("Error al eliminar la reserva");
    }
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
          <div className="bg-white rounded-2xl shadow-2xl p-4 sm:p-6 md:p-8">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 sm:gap-0 sm:mb-8">
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

        <Calendar
          currentDate={currentDate}
          rentals={rentals}
          onPreviousMonth={handlePreviousMonth}
          onNextMonth={handleNextMonth}
          currentUserId={user.id}
          loading={loadingRentals}
          compact={true}
          onDeleteRental={handleDeleteRental}
        />
      </div>
    </main>
  );
}
