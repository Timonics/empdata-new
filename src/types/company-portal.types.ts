export interface CompanyProfile {
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
  insurance_type: string;
  member_since: string;
  employees_count: number;
  verified_employees: number;
  completion_rate: number;
  admin_name: string;
  admin_email: string;
  admin_phone?: string;
}

export interface DashboardStats {
  total_employees: number;
  pending_invitations: number;
  verified_nin: number;
  verification_rate: number;
  recent_employees: EmployeeSummary[];
  recent_invitations: InvitationSummary[];
}

export interface EmployeeSummary {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  department?: string;
  status: 'verified' | 'pending' | 'inactive';
  nin_verified: boolean;
  joined_at: string;
}

export interface InvitationSummary {
  id: number;
  email: string;
  role: string;
  sent_at: string;
  expires_at: string;
  status: 'pending' | 'accepted' | 'expired';
}