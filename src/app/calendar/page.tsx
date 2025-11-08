"use client";

import { useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
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
  const router = useRouter();
  const {
    rentals,
    loadingRentals,
    currentDate,
    setCurrentDate,
    updateRentals,
  } = useRentals();

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/");
    }
  }, [user, isLoading, router]);

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

    const year = currentDate.getFullYear();
    const month = String(currentDate.getMonth() + 1).padStart(2, '0');
    const dayStr = String(day).padStart(2, '0');
    const dateString = `${year}-${month}-${dayStr}`;

    const existingRental = rentals.find((rental) => {
      const rentalDate = new Date(rental.date);
      return (
        rentalDate.getUTCDate() === day &&
        rentalDate.getUTCMonth() === currentDate.getMonth() &&
        rentalDate.getUTCFullYear() === currentDate.getFullYear() &&
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
          body: JSON.stringify({ date: `${dateString}T00:00:00.000Z` }),
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
          body: JSON.stringify({ date: `${dateString}T00:00:00.000Z` }),
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
        rentalDate.getUTCDate() === day &&
        rentalDate.getUTCMonth() === currentDate.getMonth() &&
        rentalDate.getUTCFullYear() === currentDate.getFullYear()
      );
    });
  };

  const getUniqueUsers = () => {
    const uniqueUsersMap = new Map<
      string,
      { username: string; color: string }
    >();
    rentals.forEach((rental) => {
      if (!uniqueUsersMap.has(rental.userId)) {
        uniqueUsersMap.set(rental.userId, {
          username: rental.username,
          color: rental.userColor,
        });
      }
    });
    return Array.from(uniqueUsersMap.values());
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
                  className="text-xs rounded px-1 py-0.5 truncate font-medium text-white"
                  style={{ backgroundColor: rental.userColor }}
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
            <div className="flex items-center gap-3">
              <h1 className="text-2xl sm:text-4xl font-bold text-finca-green text-center">
                {MONTHS[currentDate.getMonth()]} {currentDate.getFullYear()}
              </h1>
              {loadingRentals && (
                <div className="w-2 h-2 bg-finca-yellow rounded-full animate-pulse"></div>
              )}
            </div>
            <button
              onClick={handleNextMonth}
              className="w-full cursor-pointer sm:w-auto px-6 py-3 bg-finca-green text-white rounded-lg font-semibold hover:bg-finca-orange-dark transition-colors duration-200"
            >
              Siguiente →
            </button>
          </div>

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
            <div className="flex flex-wrap gap-3">
              {getUniqueUsers().map((user) => (
                <div key={user.username} className="flex items-center gap-2">
                  <div
                    className="w-6 h-6 rounded border border-finca-beige"
                    style={{ backgroundColor: user.color }}
                  ></div>
                  <span className="text-sm text-finca-brown">
                    {user.username}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
