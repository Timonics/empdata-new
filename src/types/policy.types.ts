// types/policy.types.ts
export type PolicyStatus = 'draft' | 'active' | 'expired' | 'cancelled';
export type PolicyType = 'group_life' | 'individual_life' | 'health' | 'motor' | 'property';

export interface Policy {
  id: number;
  policy_number: string;
  company_id: number;
  company_name: string;
  type: PolicyType;
  status: PolicyStatus;
  start_date: string;
  end_date: string;
  premium_amount: number;
  sum_assured: number;
  beneficiaries: string;
  created_at: string;
}