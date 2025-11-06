import { z } from 'zod';

export const loginSchema = z.object({
  username: z.string().min(1, 'Usuario es requerido'),
  password: z.string().min(1, 'Contraseña es requerida'),
});

export type LoginInput = z.infer<typeof loginSchema>;
