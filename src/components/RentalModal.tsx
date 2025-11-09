"use client";

import { useState } from "react";

interface RentalModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: { startHour: number; endHour: number; notes: string }) => void;
  date: Date | null;
  existingRental?: {
    startHour: number;
    endHour: number;
    notes?: string;
  };
  allowDateSelection?: boolean;
  onDateChange?: (date: Date) => void;
}

export default function RentalModal({
  isOpen,
  onClose,
  onSave,
  date,
  existingRental,
  allowDateSelection = false,
  onDateChange,
}: RentalModalProps) {
  const [startHour, setStartHour] = useState(existingRental?.startHour || 8);
  const [endHour, setEndHour] = useState(existingRental?.endHour || 20);
  const [notes, setNotes] = useState(existingRental?.notes || "");
  const [selectedDate, setSelectedDate] = useState(date || new Date());

  if (!isOpen || !date) return null;

  const handleSave = () => {
    if (startHour >= endHour) {
      alert("La hora de inicio debe ser anterior a la hora de fin");
      return;
    }
    onSave({ startHour, endHour, notes });
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("es-AR", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const formatDateInput = (date: Date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newDate = new Date(e.target.value + "T00:00:00");
    setSelectedDate(newDate);
    if (onDateChange) {
      onDateChange(newDate);
    }
  };

  const hours = Array.from({ length: 24 }, (_, i) => i);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl p-6 sm:p-8 w-full max-w-md">
        <h2 className="text-xl sm:text-2xl font-bold text-finca-green mb-2">
          Reservar día
        </h2>
        {!allowDateSelection && date && (
          <p className="text-sm sm:text-base text-finca-brown mb-6 capitalize">
            {formatDate(date)}
          </p>
        )}

        <div className="space-y-4 sm:space-y-6">
          {allowDateSelection && (
            <div>
              <label className="block text-sm font-medium text-finca-brown mb-2">
                Fecha
              </label>
              <input
                type="date"
                value={formatDateInput(selectedDate)}
                onChange={handleDateChange}
                className="w-full py-2 sm:py-3 px-3 sm:px-4 border border-finca-beige rounded-lg focus:outline-none focus:ring-2 focus:ring-finca-green text-finca-brown text-sm sm:text-base"
              />
            </div>
          )}
          <div>
            <label className="block text-sm font-medium text-finca-brown mb-2">
              Hora de inicio
            </label>
            <select
              value={startHour}
              onChange={(e) => setStartHour(Number(e.target.value))}
              className="w-full py-2 sm:py-3 px-3 sm:px-4 border border-finca-beige rounded-lg focus:outline-none focus:ring-2 focus:ring-finca-green text-finca-brown text-sm sm:text-base"
            >
              {hours.map((hour) => (
                <option key={hour} value={hour}>
                  {String(hour).padStart(2, "0")}:00
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-finca-brown mb-2">
              Hora de fin
            </label>
            <select
              value={endHour}
              onChange={(e) => setEndHour(Number(e.target.value))}
              className="w-full py-2 sm:py-3 px-3 sm:px-4 border border-finca-beige rounded-lg focus:outline-none focus:ring-2 focus:ring-finca-green text-finca-brown text-sm sm:text-base"
            >
              {hours.map((hour) => (
                <option key={hour} value={hour}>
                  {String(hour).padStart(2, "0")}:00
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-finca-brown mb-2">
              Notas (opcional)
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Escribe cualquier nota adicional..."
              rows={4}
              className="w-full py-2 sm:py-3 px-3 sm:px-4 border border-finca-beige rounded-lg focus:outline-none focus:ring-2 focus:ring-finca-green text-finca-brown placeholder:text-finca-beige-text resize-none text-sm sm:text-base"
            />
          </div>
        </div>

        <div className="flex gap-3 sm:gap-4 mt-6 sm:mt-8">
          <button
            onClick={onClose}
            className="cursor-pointer flex-1 py-2 sm:py-3 px-4 sm:px-6 border border-finca-beige text-finca-brown rounded-lg font-semibold hover:bg-finca-beige/20 transition-colors duration-200 text-sm sm:text-base"
          >
            Cancelar
          </button>
          <button
            onClick={handleSave}
            className="cursor-pointer flex-1 py-2 sm:py-3 px-4 sm:px-6 bg-finca-green text-white rounded-lg font-semibold hover:bg-finca-orange-dark transition-colors duration-200 text-sm sm:text-base"
          >
            Guardar
          </button>
        </div>
      </div>
    </div>
  );
}
