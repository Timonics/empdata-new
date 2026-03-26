export interface Permission {
  name: string;
  group: string;
}

export interface Role {
  id: number;
  name: string;
  is_system: boolean;
  permissions: string[];
  created_at: string;
  updated_at?: string;
  user_count?: number;
}

export interface AdminUser {
  id: number;
  name: string;
  email: string;
  two_factor_setup: boolean;
  roles: string[];
  all_permissions: string[];
  created_at: string;
}