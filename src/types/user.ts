export enum UserRole {
  ADMIN = 'ADMIN',
  OPERATOR = 'OPERATOR'
}

export type IUser = {
  email: string;
  password: string;
  role: UserRole;
}