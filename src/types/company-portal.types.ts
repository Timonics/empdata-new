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

  created_at?: string;
}

export interface ProtalCompanyFull {
  id: number;
  name: string;
  email: string;
  phone: string | null;
  rc_number: string | null;
  address: string | null;
  city: string | null;
  state: string | null;
  country: string;
  insurance_type: string | null;
  registration_date: Date | null;
  license_number: string | null;
  status: string;
  created_at: string;
  updated_at: string;
  admins: [
    {
      id: number;
      name: string;
      email: string;
      password_set: boolean;
      invitation_sent_at: string | null;
      two_factor_enabled: false;
      created_at: string;
    },
  ];
  employee_stats: {
    total: number;
    active: number;
    inactive: number;
    terminated: number;
    nin_verified: number;
    no_portal_access: number;
    invitation_sent: number;
    password_set: number;
  };
  recent_employees: [
    {
      id: number;
      name: string;
      email: string;
      position: string;
      joined_at: Date;
    },
  ];
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
  status: "verified" | "pending" | "inactive";
  nin_verified: boolean;
  joined_at: string;
}

export interface InvitationSummary {
  id: number;
  email: string;
  role: string;
  sent_at: string;
  expires_at: string;
  status: "pending" | "accepted" | "expired";
}
