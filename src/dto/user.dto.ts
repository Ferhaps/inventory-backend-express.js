import { UserRole } from "../types/user";

export type UserDto = {
  email: string;
  role: UserRole;
};