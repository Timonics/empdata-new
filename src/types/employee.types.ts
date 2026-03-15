export type EmploymentStatus = 'active' | 'inactive';
export type NINStatus = 'verified' | 'pending' | 'not_submitted';

export interface PortalEmployee {
  id: number;
  company_id: number;
  company_name: string;
  first_name: string;
  last_name: string;
  email: string;
  phone?: string;
  employee_number: string;
  department?: string;
  position?: string;
  date_of_birth: string;
  employment_status: EmploymentStatus;
  
  // NIN Verification
  nin_verification?: {
    has_submitted_nin: boolean;
    is_nin_verified: boolean;
    is_validated: boolean;
    nin_verified_at: string | null;
    nin_data?: {
      firstname: string;
      middlename: string;
      surname: string;
      phone: string;
      gender: string;
      birthdate: string;
      birth_info: {
        country: string;
        state: string;
        lga: string;
      };
      residence_info: {
        state: string;
        town: string;
        lga: string;
        address: string;
      };
      photo?: string;
      report_id: string;
    } | null;
  };
  
  // Beneficiaries
  beneficiaries_count: number;
  
  // Timestamps
  created_at: string;
  updated_at?: string;
}

export interface Beneficiary {
  id?: number;
  first_name: string;
  last_name: string;
  address: string;
  date_of_birth: string;
  percentage_allocation: number;
  utility_bill?: File | string;
  identification_document?: File | string;
  utility_bill_url?: string;
  identification_url?: string;
}

export interface CreateEmployeeData {
  first_name: string;
  last_name: string;
  email: string;
  date_of_birth: string;
  phone?: string;
  department?: string;
  position?: string;
}

export interface UpdateEmployeeData extends Partial<CreateEmployeeData> {
  employment_status?: EmploymentStatus;
}

export interface EmployeeFilters {
  page?: number;
  per_page?: number;
  search?: string;
  employment_status?: EmploymentStatus;
  nin_verified?: boolean;
}

export interface SubmitNINData {
  iv: string;
  data: string;
  tag: string;
}

export interface BeneficiariesData {
  beneficiaries: Beneficiary[];
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

export interface EmployeeStats {
  total: number;
  active: number;
  inactive: number;
  verified_nin: number;
  pending_nin: number;
}