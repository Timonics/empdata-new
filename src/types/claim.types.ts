export type ClaimStatus = 'submitted' | 'under_review' | 'approved' | 'rejected' | 'paid';

export interface Claim {
  id: number;
  claim_number: string;
  policy_id: number;
  policy_number: string;
  employee_id?: number;
  employee_name: string;
  amount: number;
  status: ClaimStatus;
  incident_date: string;
  description: string;
  documents: string[];
  submitted_at: string;
  rejection_reason: string | null;
}