"use client";

import { useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { useRentals } from "@/hooks/useRentals";
import Calendar from "@/components/Calendar";
import CreateRental from "@/components/CreateRental";

export default function CalendarPage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const { rentals, loadingRentals, currentDate, setCurrentDate, fetchRentals } =
    useRentals();

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

  if (isLoading || !user) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-finca-black">
        <div className="text-white text-xl">Cargando...</div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-finca-black">
      <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-8 py-4 sm:py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <Calendar
              currentDate={currentDate}
              rentals={rentals}
              onPreviousMonth={handlePreviousMonth}
              onNextMonth={handleNextMonth}
              currentUserId={user.id}
              loading={loadingRentals}
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
