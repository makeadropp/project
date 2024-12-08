export enum UserRole {
  ADMIN = 'ADMIN',
  DRIVER = 'DRIVER',
  CUSTOMER = 'CUSTOMER'
}

export interface User {
  id?: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  password: string;
  role: UserRole;
  isActive?: boolean;
  emailVerified?: boolean;
  phoneVerified?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
  lastLogin?: Date;
}

export interface UserWithoutPassword extends Omit<User, "password"> {
  id: string;
}

export interface CreateUserDTO {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  password: string;
  role: UserRole;
}

export interface LoginDTO {
  email: string;
  password: string;
}

export interface ResetPasswordDTO {
  email: string;
  oldPassword: string;
  newPassword: string;
}

export interface AuthResponse {
  user: UserWithoutPassword;
  token: string;
}
