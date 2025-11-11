"use client";

import { useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { useRentals } from "@/hooks/useRentals";
import { useAuthenticatedFetch } from "@/hooks/useAuthenticatedFetch";
import Calendar from "@/components/Calendar";
import CreateRental from "@/components/CreateRental";

export default function CalendarPage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const { rentals, loadingRentals, currentDate, setCurrentDate, fetchRentals } =
    useRentals();
  const authenticatedFetch = useAuthenticatedFetch();

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/");
    }
  }, [user, isLoading, router]);

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

  const handleRentalCreated = () => {
    fetchRentals();
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

  if (isLoading || !user) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-finca-brown text-xl">Cargando...</div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-8 py-4 sm:py-8">
        <div className="mb-6">
          <button
            onClick={() => router.push("/dashboard")}
            className="text-finca-green hover:text-finca-orange-dark font-semibold mb-4 inline-flex items-center gap-2"
          >
            ← Volver al inicio
          </button>
          <div className="bg-white rounded-2xl shadow-2xl p-4 sm:p-6 md:p-8">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-finca-green mb-2">
              Calendario de reservas
            </h1>
            <p className="text-sm sm:text-base text-finca-brown">
              Gestiona las reservas de la finca
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <Calendar
              currentDate={currentDate}
              rentals={rentals}
              onPreviousMonth={handlePreviousMonth}
              onNextMonth={handleNextMonth}
              currentUserId={user.id}
              loading={loadingRentals}
              onDeleteRental={handleDeleteRental}
            />
          </div>
          <div className="lg:col-span-1">
            <CreateRental onRentalCreated={handleRentalCreated} />
          </div>
        </div>
      </div>
    </main>
  );
}
