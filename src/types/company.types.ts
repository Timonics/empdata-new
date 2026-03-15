export type CompanyStatus = "active" | "inactive" | "pending" | "suspended";

export interface Company {
  id: number;
  name: string;
  rc_number: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  country: string;
  website?: string;
  tax_id?: string;
  status: CompanyStatus;
  employees_count: number;
  policies_count: number;
  insurance_type?: string;
  joined_date: string;
  created_at: string;
  updated_at?: string;

  // Admin user info
  admin_name?: string;
  admin_email?: string;
  admin_phone?: string;
  admin_position?: string;
}

export interface CreateCompanyData {
  name: string;
  rc_number: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  country: string;
  website?: string;
  tax_id?: string;
  insurance_type?: string;

  // Admin info
  admin_name: string;
  admin_email: string;
  admin_phone: string;
  admin_position?: string;
}

export interface UpdateCompanyData extends Partial<CreateCompanyData> {
  status?: CompanyStatus;
}

export interface CompanyFilters {
  status?: CompanyStatus;
  insurance_type?: string;
  search?: string;
  page?: number;
  per_page?: number;
}

export interface PaginatedResponse<T> {
  success: boolean;
  data: T[];
  pagination: {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    from: number;
    to: number;
  };
}
