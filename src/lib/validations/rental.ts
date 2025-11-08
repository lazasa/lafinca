import { z } from "zod";

export const createRentalSchema = z.object({
  date: z.string().datetime(),
});

export const deleteRentalSchema = z.object({
  date: z.string().datetime(),
});

export const getRentalsQuerySchema = z.object({
  startDate: z.string().datetime().optional(),
  endDate: z.string().datetime().optional(),
});
