export interface MonthlyEmployeeRegistration {
  month: string;
  count: number;
}

export interface MonthlyEmployeeResponse {
  year: number;
  data: MonthlyEmployeeRegistration[];
}

// Company monthly registration with status breakdown
export interface CompanyMonthlyStatus {
  pending_approval: number;
  approved: number;
  rejected: number;
}

export interface CompanyMonthlyAccountStatus {
  pending: number;
  invited: number;
  active: number;
}

export interface CompanyMonthlyVerificationStatus {
  not_verified: number;
  verified: number;
}

export interface CompanyMonthlyData {
  month: string;
  total: number;
  by_status: CompanyMonthlyStatus;
  by_account_status: CompanyMonthlyAccountStatus;
  by_verification_status: CompanyMonthlyVerificationStatus;
}

export interface CompanyMonthlyResponse {
  year: number;
  data: CompanyMonthlyData[];
}

// Registration status summary
export interface CompanyRegistrationSummary {
  total: number;
  by_status: CompanyMonthlyStatus;
  by_account_status: CompanyMonthlyAccountStatus;
  by_verification_status: CompanyMonthlyVerificationStatus;
}

export interface EmployeeRegistrationSummary {
  total: number;
  by_status: CompanyMonthlyStatus; // Same structure, different totals
  by_account_status: CompanyMonthlyAccountStatus;
  by_verification_status: CompanyMonthlyVerificationStatus;
}

export interface RegistrationStatusSummary {
  company_registrations: CompanyRegistrationSummary;
  employee_registrations: EmployeeRegistrationSummary;
  combined_total: number;
}

// Current week data
export interface DailyCompanyBreakdown {
  total: number;
  by_status: CompanyMonthlyStatus;
  by_account_status: CompanyMonthlyAccountStatus;
  by_verification_status: CompanyMonthlyVerificationStatus;
}

export interface DailyEmployeeBreakdown {
  total: number;
  by_status: CompanyMonthlyStatus;
  by_account_status: CompanyMonthlyAccountStatus;
  by_verification_status: CompanyMonthlyVerificationStatus;
}

export interface DailyData {
  day: string;
  date: string;
  companies: DailyCompanyBreakdown;
  employees: DailyEmployeeBreakdown;
}

export interface CurrentWeekResponse {
  week_start: string;
  week_end: string;
  data: DailyData[];
}

// Recent registrations
export type RecentRegistrationType = 'company' | 'employee';

export interface RecentRegistration {
  id: number;
  type: RecentRegistrationType;
  name: string;
  email: string;
  status: string;
  account_status: string;
  verification_status: string;
  submission_type: string;
  submitted_at: string;
}

export interface RecentRegistrationsResponse {
  hours: number;
  since: string;
  total: number;
  data: RecentRegistration[];
}