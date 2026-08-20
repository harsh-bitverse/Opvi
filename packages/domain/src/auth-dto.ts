import { PublicUser } from './user';

export interface RegisterInput {
  email: string;
  password: string;
}

export interface LoginInput {
  email: string;
  password: string;
}

export interface PasswordResetRequestInput {
  email: string;
}

export interface PasswordResetConfirmInput {
  token: string;
  newPassword: string;
}

export interface EmailVerificationInput {
  token: string;
}

export interface AuthResponse {
  user: PublicUser;
}
