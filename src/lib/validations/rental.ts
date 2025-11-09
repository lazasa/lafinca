import { z } from "zod";

export const createRentalSchema = z.object({
  date: z.string().datetime(),
  startHour: z.number().int().min(0).max(23).optional().default(8),
  endHour: z.number().int().min(0).max(23).optional().default(20),
  notes: z.string().optional(),
});

export const deleteRentalSchema = z.object({
  date: z.string().datetime(),
});

export const getRentalsQuerySchema = z.object({
  startDate: z.string().datetime().optional(),
  endDate: z.string().datetime().optional(),
});
