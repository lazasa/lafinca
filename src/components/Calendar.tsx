"use client";

import type { Rental } from "@/types/rental";

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

interface CalendarProps {
  currentDate: Date;
  rentals: Rental[];
  onPreviousMonth: () => void;
  onNextMonth: () => void;
  currentUserId?: string;
  loading?: boolean;
  compact?: boolean;
}

export default function Calendar({
  currentDate,
  rentals,
  onPreviousMonth,
  onNextMonth,
  currentUserId,
  loading = false,
  compact = false,
}: CalendarProps) {
  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    return { daysInMonth, startingDayOfWeek };
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
          className="aspect-square p-1 sm:p-2 md:p-3 border border-finca-beige bg-finca-beige/5"
        />
      );
    }

    for (let day = 1; day <= daysInMonth; day++) {
      const dayRentals = getRentalsByDay(day);
      const isRented = dayRentals.length > 0;
      const isCurrentUserRental =
        currentUserId &&
        dayRentals.some((rental) => rental.userId === currentUserId);

      days.push(
        <div
          key={day}
          className={`aspect-square p-1 sm:p-2 md:p-3 border border-finca-beige ${
            isRented ? "bg-finca-orange-light/30" : "bg-white"
          } ${isCurrentUserRental ? "ring-2 ring-finca-green" : ""}`}
        >
          <div className="text-xs sm:text-sm md:text-base font-semibold text-finca-brown">
            {day}
          </div>
          {isRented && (
            <div className="mt-0.5 sm:mt-1 space-y-0.5 sm:space-y-1">
              {dayRentals.map((rental) => (
                <div
                  key={rental.id}
                  className="text-[0.6rem] sm:text-xs rounded px-0.5 sm:px-1 py-0.5 truncate font-medium text-white"
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

  return (
    <div className="bg-white rounded-2xl shadow-2xl p-4 sm:p-6 md:p-8">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-6 sm:mb-8">
        <button
          onClick={onPreviousMonth}
          className="w-full cursor-pointer sm:w-auto px-4 sm:px-6 py-2 sm:py-3 bg-finca-green text-white rounded-lg font-semibold hover:bg-finca-orange-dark transition-colors duration-200 text-sm sm:text-base"
        >
          ← Anterior
        </button>
        <div className="flex items-center gap-3">
          <h2
            className={`${
              compact
                ? "text-lg sm:text-xl md:text-2xl"
                : "text-xl sm:text-2xl md:text-4xl"
            } font-bold text-finca-green text-center`}
          >
            {MONTHS[currentDate.getMonth()]} {currentDate.getFullYear()}
          </h2>
          {loading && (
            <div className="w-2 h-2 bg-finca-yellow rounded-full animate-pulse"></div>
          )}
        </div>
        <button
          onClick={onNextMonth}
          className="w-full cursor-pointer sm:w-auto px-4 sm:px-6 py-2 sm:py-3 bg-finca-green text-white rounded-lg font-semibold hover:bg-finca-orange-dark transition-colors duration-200 text-sm sm:text-base"
        >
          Siguiente →
        </button>
      </div>

      <div className="grid grid-cols-7 gap-0 mb-2">
        {DAYS.map((day) => (
          <div
            key={day}
            className="text-center text-[0.65rem] sm:text-sm font-semibold text-finca-brown py-2 sm:py-3 bg-finca-beige/20"
          >
            {day}
          </div>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-0 border-2 border-finca-beige rounded-lg overflow-hidden">
        {renderCalendar()}
      </div>
      <div className="mt-6 sm:mt-8 p-4 sm:p-6 bg-finca-beige/10 rounded-lg border border-finca-beige">
        <div className="flex flex-wrap gap-2 sm:gap-3">
          {getUniqueUsers().map((user) => (
            <div key={user.username} className="flex items-center gap-2">
              <div
                className="w-5 h-5 sm:w-6 sm:h-6 rounded border border-finca-beige"
                style={{ backgroundColor: user.color }}
              ></div>
              <span className="text-xs sm:text-sm text-finca-brown">
                {user.username}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
