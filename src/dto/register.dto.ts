import { UserRole } from "../types/user";
import { z } from 'zod';

export const RegisterDtoSchema = z.object({
  email: z.string().email('Invalid email format'),
  password: z.string()
    .min(8, 'Password must be at least 8 characters long')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number')
    .regex(/[!@#$%^&*]/, 'Password must contain at least one special character'),
  role: z.enum(['ADMIN', 'OPERATOR'], {
    errorMap: () => ({ message: 'Role must be either ADMIN or OPERATOR' }),
  }),
});

export type RegisterDto = z.infer<typeof RegisterDtoSchema>;

export type RegisterResponse = {
  user: {
    id: unknown;
    email: string;
    role: UserRole;
  };
}