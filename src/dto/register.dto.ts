import { UserRole } from "../types/user";
import { z } from 'zod';

export const RegisterDtoSchema = z.object({
  email: z.string().email('Invalid email format'),
  password: z.string()
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
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