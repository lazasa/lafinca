"use client";

import { Rental } from "@/types/rental";
import Link from "next/link";

interface RentalsSummaryProps {
  rentals: Rental[];
  currentUserId: string;
  loading: boolean;
}

export default function RentalsSummary({
  rentals,
  currentUserId,
  loading,
}: RentalsSummaryProps) {
  const sortedRentals = [...rentals]
    .filter((rental) => new Date(rental.date) >= new Date())
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .slice(0, 5);

  const formatDate = (date: string) => {
    const d = new Date(date);
    return d.toLocaleDateString("es-AR", {
      weekday: "short",
      day: "numeric",
      month: "short",
      year: "numeric",
      timeZone: "UTC",
    });
  };

  const formatTime = (hour: number) => {
    return `${String(hour).padStart(2, "0")}:00`;
  };

  if (loading) {
    return (
      <div className="bg-white rounded-2xl shadow-2xl p-6 sm:p-8">
        <div className="text-finca-brown">Cargando reservas...</div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-2xl p-6 sm:p-8">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-semibold text-finca-green">
          Próximas reservas
        </h2>
        <Link
          href="/dashboard/calendar"
          className="bg-finca-green text-white px-4 py-2 rounded-lg font-semibold hover:bg-finca-orange-dark transition-colors duration-200 text-sm"
        >
          Agregar reserva
        </Link>
      </div>

      {sortedRentals.length === 0 ? (
        <p className="text-finca-beige-text text-sm">
          No hay reservas próximas
        </p>
      ) : (
        <div className="space-y-4">
          {sortedRentals.map((rental) => {
            const isCurrentUser = rental.userId === currentUserId;
            return (
              <div
                key={rental.id}
                className={`border rounded-lg p-4 ${
                  isCurrentUser
                    ? "border-finca-green bg-finca-green/5"
                    : "border-finca-beige"
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <div
                        className="w-3 h-3 rounded-full border border-finca-beige"
                        style={{ backgroundColor: rental.userColor }}
                      ></div>
                      <span className="text-sm font-semibold text-finca-brown">
                        {rental.username}
                      </span>
                    </div>
                    <div className="text-base font-semibold text-finca-green mb-1">
                      {formatDate(rental.date)}
                    </div>
                    <div className="text-sm text-finca-brown">
                      {formatTime(rental.startHour)} -{" "}
                      {formatTime(rental.endHour)}
                    </div>
                    {rental.notes && (
                      <p className="text-sm text-finca-brown mt-2">
                        {rental.notes}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <div className="mt-6 pt-6 border-t border-finca-beige">
        <Link
          href="/dashboard/calendar"
          className="text-finca-green hover:text-finca-orange-dark font-semibold text-sm"
        >
          Ver calendario completo →
        </Link>
      </div>
    </div>
  );
}
