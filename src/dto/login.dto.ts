import { UserRole } from "types/user";
import { z } from 'zod';

export const LoginDtoSchema = z.object({
  email: z.string().email('Invalid email format'),
  password: z.string().min(1, 'Password is required'),
});

export type LoginDto = z.infer<typeof LoginDtoSchema>;

export type LoginResponse = {
  token: string;
  user: {
    id: unknown;
    email: string;
    role: UserRole;
  };
};