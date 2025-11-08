"use client";

import { useAuth } from "@/contexts/AuthContext";
import { useRentals } from "@/hooks/useRentals";

const MONTHS = [
  "Enero",
  "Febrero",
  "Marzo",
  "Abril",
  "Mayo",
  "Junio",
  "Julio",
  "Agosto",
  "Septiembre",
  "Octubre",
  "Noviembre",
  "Diciembre",
];

const DAYS = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"];

export default function CalendarPage() {
  const { user, accessToken, isLoading } = useAuth();
  const {
    rentals,
    loadingRentals,
    currentDate,
    setCurrentDate,
    updateRentals,
  } = useRentals();

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    return { daysInMonth, startingDayOfWeek };
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

  const handleDayClick = async (day: number) => {
    if (!accessToken || !user) return;

    const clickedDate = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      day
    );
    clickedDate.setHours(0, 0, 0, 0);

    const existingRental = rentals.find((rental) => {
      const rentalDate = new Date(rental.date);
      return (
        rentalDate.getDate() === day &&
        rentalDate.getMonth() === currentDate.getMonth() &&
        rentalDate.getFullYear() === currentDate.getFullYear() &&
        rental.userId === user.id
      );
    });

    try {
      if (existingRental) {
        const response = await fetch("/api/rentals", {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify({ date: clickedDate.toISOString() }),
        });

        if (response.ok) {
          updateRentals((prev) =>
            prev.filter((rental) => rental.id !== existingRental.id)
          );
        }
      } else {
        const response = await fetch("/api/rentals", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify({ date: clickedDate.toISOString() }),
        });

        if (response.ok) {
          const data = await response.json();
          if (data.success && data.rental) {
            updateRentals((prev) => [...prev, data.rental]);
          }
        }
      }
    } catch (error) {
      console.error("Error toggling rental:", error);
    }
  };

  const getRentalsByDay = (day: number) => {
    return rentals.filter((rental) => {
      const rentalDate = new Date(rental.date);
      return (
        rentalDate.getDate() === day &&
        rentalDate.getMonth() === currentDate.getMonth() &&
        rentalDate.getFullYear() === currentDate.getFullYear()
      );
    });
  };

  const renderCalendar = () => {
    const { daysInMonth, startingDayOfWeek } = getDaysInMonth(currentDate);
    const days = [];

    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(
        <div
          key={`empty-${i}`}
          className="aspect-square p-2 sm:p-3 border border-finca-beige bg-finca-beige/5"
        />
      );
    }

    for (let day = 1; day <= daysInMonth; day++) {
      const dayRentals = getRentalsByDay(day);
      const isRented = dayRentals.length > 0;
      const isCurrentUserRental = dayRentals.some(
        (rental) => rental.userId === user?.id
      );

      days.push(
        <div
          key={day}
          onClick={() => handleDayClick(day)}
          className={`aspect-square p-2 sm:p-3 border border-finca-beige cursor-pointer transition-all duration-200 hover:bg-finca-green/10 focus:outline-none focus:ring-2 focus:ring-finca-green ${
            isRented
              ? "bg-finca-orange-light/30"
              : "bg-white hover:bg-finca-beige/20"
          } ${isCurrentUserRental ? "ring-2 ring-finca-green" : ""}`}
        >
          <div className="text-sm sm:text-base font-semibold text-finca-brown">
            {day}
          </div>
          {isRented && (
            <div className="mt-1 space-y-1">
              {dayRentals.map((rental) => (
                <div
                  key={rental.id}
                  className={`text-xs rounded px-1 py-0.5 truncate font-medium ${
                    rental.userId === user?.id
                      ? "bg-finca-green text-white"
                      : "bg-finca-orange-dark text-white"
                  }`}
                  title={rental.username}
                >
                  {rental.username}
                </div>
              ))}
            </div>
          )}
        </div>
      );
    }

    return days;
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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-2xl shadow-2xl p-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-8">
            <button
              onClick={handlePreviousMonth}
              className="w-full cursor-pointer sm:w-auto px-6 py-3 bg-finca-green text-white rounded-lg font-semibold hover:bg-finca-orange-dark transition-colors duration-200"
            >
              ← Anterior
            </button>
            <h1 className="text-2xl sm:text-4xl font-bold text-finca-green text-center">
              {MONTHS[currentDate.getMonth()]} {currentDate.getFullYear()}
            </h1>
            <button
              onClick={handleNextMonth}
              className="w-full cursor-pointer sm:w-auto px-6 py-3 bg-finca-green text-white rounded-lg font-semibold hover:bg-finca-orange-dark transition-colors duration-200"
            >
              Siguiente →
            </button>
          </div>

          {loadingRentals ? (
            <div className="text-center py-12 text-finca-brown text-lg">
              Cargando calendario...
            </div>
          ) : (
            <>
              <div className="grid grid-cols-7 gap-0 mb-2">
                {DAYS.map((day) => (
                  <div
                    key={day}
                    className="text-center text-sm font-semibold text-finca-brown py-3 bg-finca-beige/20"
                  >
                    {day}
                  </div>
                ))}
              </div>
              <div className="grid grid-cols-7 gap-0 border-2 border-finca-beige rounded-lg overflow-hidden">
                {renderCalendar()}
              </div>
              <div className="mt-8 p-6 bg-finca-beige/10 rounded-lg border border-finca-beige">
                <h3 className="text-xl font-semibold text-finca-brown mb-4">
                  Leyenda:
                </h3>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-3">
                    <div className="w-6 h-6 bg-finca-orange-light/30 border border-finca-beige rounded"></div>
                    <span className="text-finca-brown">Día reservado</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-6 h-6 bg-finca-orange-light/30 border border-finca-beige rounded ring-2 ring-finca-green"></div>
                    <span className="text-finca-brown font-semibold">
                      Tu reserva
                    </span>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </main>
  );
}
