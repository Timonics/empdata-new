export interface AdminProfile {
  id: number;
  name: string;
  email: string;
  phone?: string;
  avatar?: string;
  role: string;
  two_factor_enabled: boolean;
  email_verified_at?: string;
  created_at?: string;
  updated_at?: string;
}

export interface CompanyProfile {
  company_id: number;
  created_at: string;
  email: string;
  email_verified_at: string;
  id: number;
  name: string;
  role: string;
  two_factor_enabled: boolean;
}

export interface UpdateProfileData {
  name?: string;
  email?: string;
  phone?: string;
}

export interface ChangePasswordData {
  current_password: string;
  new_password: string;
  new_password_confirmation: string;
}

export interface ProfileResponse {
  success: boolean;
  message: string;
  data?: AdminProfile;
}
