import { NextRequest, NextResponse } from "next/server";
import { getRentals, createRental, deleteRental } from "@/lib/db/rentals";
import { createRentalSchema, getRentalsQuerySchema } from "@/lib/validations/rental";
import type { RentalsResponse, CreateRentalResponse, DeleteRentalResponse } from "@/types/rental";
import { checkAccess } from "@/lib/auth/check";

export async function GET(request: NextRequest) {
  try {
    const payload = await checkAccess(request)
    
    if (!payload) {
      return NextResponse.json<RentalsResponse>(
        { success: false, error: "Token inválido" },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const startDateParam = searchParams.get("startDate");
    const endDateParam = searchParams.get("endDate");

    const validation = getRentalsQuerySchema.safeParse({
      startDate: startDateParam,
      endDate: endDateParam,
    });

    if (!validation.success) {
      return NextResponse.json<RentalsResponse>(
        { success: false, error: "Parámetros inválidos" },
        { status: 400 }
      );
    }

    const startDate = startDateParam ? new Date(startDateParam) : undefined;
    const endDate = endDateParam ? new Date(endDateParam) : undefined;

    const rentals = await getRentals(startDate, endDate);

    const formattedRentals = rentals.map((rental) => ({
      id: rental.id,
      date: rental.date.toISOString(),
      userId: rental.userId,
      username: rental.user.username,
      createdAt: rental.createdAt.toISOString(),
      updatedAt: rental.updatedAt.toISOString(),
    }));

    return NextResponse.json<RentalsResponse>({
      success: true,
      rentals: formattedRentals,
    });
  } catch (error) {
    console.error("Error fetching rentals:", error);
    return NextResponse.json<RentalsResponse>(
      { success: false, error: "Error al obtener las reservas" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const payload = await checkAccess(request)

    if (!payload) {
      return NextResponse.json<CreateRentalResponse>(
        { success: false, error: "Token inválido" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const validation = createRentalSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json<CreateRentalResponse>(
        { success: false, error: "Datos inválidos" },
        { status: 400 }
      );
    }

    const date = new Date(validation.data.date);
    date.setUTCHours(0, 0, 0, 0);

    const rental = await createRental(date, payload.userId);

    return NextResponse.json<CreateRentalResponse>({
      success: true,
      rental: {
        id: rental.id,
        date: rental.date.toISOString(),
        userId: rental.userId,
        username: rental.user.username,
        createdAt: rental.createdAt.toISOString(),
        updatedAt: rental.updatedAt.toISOString(),
      },
    });
  } catch (error) {
    console.error("Error creating rental:", error);
    return NextResponse.json<CreateRentalResponse>(
      { success: false, error: "Error al crear la reserva" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const payload = await checkAccess(request)

    if (!payload) {
      return NextResponse.json<DeleteRentalResponse>(
        { success: false, error: "Token inválido" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const validation = createRentalSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json<DeleteRentalResponse>(
        { success: false, error: "Datos inválidos" },
        { status: 400 }
      );
    }

    const date = new Date(validation.data.date);
    date.setUTCHours(0, 0, 0, 0);

    await deleteRental(date, payload.userId);

    return NextResponse.json<DeleteRentalResponse>({
      success: true,
    });
  } catch (error) {
    console.error("Error deleting rental:", error);
    return NextResponse.json<DeleteRentalResponse>(
      { success: false, error: "Error al eliminar la reserva" },
      { status: 500 }
    );
  }
}
