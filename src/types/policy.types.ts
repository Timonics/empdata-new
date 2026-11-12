// types/policy.types.ts
export type PolicyStatus = 'draft' | 'active' | 'expired' | 'cancelled';
export type PolicyType = 'group_life' | 'individual_life' | 'health' | 'motor' | 'property';

export interface Policy {
  id: number;
  policy_number: string;
  company_id: number;
  company_name?: string;
  type: PolicyType;
  status: PolicyStatus;
  start_date: string;
  end_date: string;
  premium_amount: number;
  sum_assured: number;
  beneficiaries?: string;
  created_at?: string;
  updated_at?: string;
}

export interface PolicyFilters {
  status?: PolicyStatus;
  type?: PolicyType;
  company_id?: number;
  search?: string;
  page?: number;
  per_page?: number;
}

export interface CreatePolicyData {
  company_id: number;
  type: PolicyType;
  start_date: string;
  end_date: string;
  premium_amount: number;
  sum_assured: number;
  beneficiaries?: string;
}

export interface UpdatePolicyData extends Partial<CreatePolicyData> {
  status?: PolicyStatus;
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
