import { UserRole } from '../types/user';

export type UserDto = {
	id: string;
	email: string;
	role: UserRole;
	createdAt: string;
	updatedAt: string;
};
