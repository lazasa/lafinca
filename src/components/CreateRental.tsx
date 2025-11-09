"use client";

import { useState } from "react";
import RentalModal from "./RentalModal";
import { useAuthenticatedFetch } from "@/hooks/useAuthenticatedFetch";

interface CreateRentalProps {
  onRentalCreated: () => void;
}

export default function CreateRental({ onRentalCreated }: CreateRentalProps) {
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const authenticatedFetch = useAuthenticatedFetch();

  const handleOpenModal = () => {
    setSelectedDate(new Date());
    setModalOpen(true);
  };

  const handleModalSave = async (data: {
    startHour: number;
    endHour: number;
    notes: string;
  }) => {
    if (!selectedDate) return;

    setIsCreating(true);

    const year = selectedDate.getFullYear();
    const month = String(selectedDate.getMonth() + 1).padStart(2, "0");
    const day = String(selectedDate.getDate()).padStart(2, "0");
    const dateString = `${year}-${month}-${day}`;

    try {
      const response = await authenticatedFetch("/api/rentals", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          date: `${dateString}T00:00:00.000Z`,
          startHour: data.startHour,
          endHour: data.endHour,
          notes: data.notes || undefined,
        }),
      });

      if (response.ok) {
        const responseData = await response.json();
        if (responseData.success) {
          setModalOpen(false);
          setSelectedDate(null);
          onRentalCreated();
        }
      } else {
        const errorData = await response.json();
        alert(errorData.error || "Error al crear la reserva");
      }
    } catch (error) {
      console.error("Error creating rental:", error);
      alert("Error al crear la reserva");
    } finally {
      setIsCreating(false);
    }
  };

  const handleModalClose = () => {
    setModalOpen(false);
    setSelectedDate(null);
  };

  const handleDateChange = (date: Date) => {
    setSelectedDate(date);
  };

  return (
    <>
      <div className="bg-white rounded-2xl shadow-2xl p-6 sm:p-8">
        <h2 className="text-2xl font-bold text-finca-green mb-4">
          Nueva Reserva
        </h2>
        <p className="text-finca-brown mb-6">
          Crea una nueva reserva seleccionando la fecha y horarios deseados.
        </p>
        <button
          onClick={handleOpenModal}
          disabled={isCreating}
          className="w-full cursor-pointer py-3 px-6 bg-finca-green text-white rounded-lg font-semibold hover:bg-finca-orange-dark transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isCreating ? "Creando..." : "Crear Reserva"}
        </button>
      </div>

      <RentalModal
        key={selectedDate?.toISOString()}
        isOpen={modalOpen}
        onClose={handleModalClose}
        onSave={handleModalSave}
        date={selectedDate}
        allowDateSelection={true}
        onDateChange={handleDateChange}
      />
    </>
  );
}
