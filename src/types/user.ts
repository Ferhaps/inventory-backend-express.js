export enum UserRole {
  ADMIN = 'ADMIN',
  OPERATOR = 'OPERATOR'
}

export interface IUser {
  email: string;
  password: string;
  role: UserRole;
}