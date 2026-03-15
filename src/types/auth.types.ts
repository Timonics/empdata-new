export type UserRole = "admin" | "company_admin" | "employee";

export interface User {
  id: number;
  name: string;
  email: string;
  role: UserRole;
  two_factor_enabled: boolean;
  email_verified_at?: string | null;
  created_at?: string;
}

export interface Client extends User {
  employee_id?: number;
  nin_verification?: {
    has_submitted_nin: boolean;
    is_nin_verified: boolean;
    nin_verified_at: string | null;
  } | null;
}

export interface AuthState {
  user: User | Client | null;
  token: string | null;
  expiresAt: number | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface ResetPasswordData {
  token: string;
  email: string;
  password: string;
  password_confirmation: string;
}

export interface Verify2FAData {
  email: string;
  code: string;
  session_token: string;
}

export interface AuthResponse<T = any> {
  requires_2fa?: boolean;
  session_token?: string;
  user: T;
  message?: string;
}