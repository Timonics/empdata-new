// Registration status types
export type ApprovalStatus = 'pending_approval' | 'approved' | 'rejected';
export type AccountStatus = 'pending' | 'invited' | 'active';
export type VerificationStatus = 'not_verified' | 'verified';
export type SubmissionType = 'public_form' | 'bulk_upload';
export type IdentityCardType = 
  | 'National Identity Number'
  | 'National ID'
  | 'International Passport'
  | "Driver's License"
  | "Voter's Card"
  | "Permanent Voter's Card";

// Company Registration
export interface CompanyRegistration {
  id: number;
  company_name: string;
  email_address: string;
  phone_number: string;
  country: string;
  state: string;
  city: string;
  rc_number?: string;
  secondary_phone?: string;
  house_address?: string;
  previous_address?: string;
  
  // Director Info
  director_name?: string;
  identity_card_type?: IdentityCardType;
  identity_card_number?: string;
  
  // Status tracking
  submission_type: SubmissionType;
  status: ApprovalStatus;
  account_status: AccountStatus;
  verification_status: VerificationStatus;
  rejection_reason?: string;
  
  // Timestamps
  submitted_at: string;
  approved_at?: string;
  rejected_at?: string;
  
  // Admin info
  approved_by?: number;
  rejected_by?: number;
  
  // Document URLs (from API)
  director_identity_cards?: string;
  cac_document?: string;
  director_passport_photograph?: string;
}

// Employee Registration
export interface EmployeeRegistration {
  id: number;
  company_id: number;
  company_name: string;
  first_name: string;
  last_name: string;
  middle_name?: string;
  email_address: string;
  phone_number: string;
  country: string;
  state: string;
  city: string;
  
  // Status tracking
  submission_type: SubmissionType;
  status: ApprovalStatus;
  account_status: AccountStatus;
  verification_status: VerificationStatus;
  rejection_reason?: string;
  
  // Timestamps
  submitted_at: string;
  approved_at?: string;
  rejected_at?: string;
  
  // Admin info
  approved_by?: number;
  rejected_by?: number;
}

// Pagination
export interface PaginationMeta {
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
  from: number;
  to: number;
}

export interface PaginatedResponse<T> {
  success: boolean;
  data: T[];
  pagination: PaginationMeta;
}

// Filter parameters
export interface RegistrationFilters {
  status?: ApprovalStatus;
  submission_type?: SubmissionType;
  account_status?: AccountStatus;
  verification_status?: VerificationStatus;
  company_id?: number;
  from_date?: string;
  to_date?: string;
  per_page?: number;
  page?: number;
}

// Public company list for employee registration
export interface PublicCompany {
  id: number;
  name: string;
  email: string;
}

// Single registration response
export interface CompanyRegistrationDetail extends CompanyRegistration {
  // Additional details for single view
  director_bvn_iv?: string;
  director_bvn_data?: string;
  director_bvn_tag?: string;
  nin_number_iv?: string;
  nin_number_data?: string;
  nin_number_tag?: string;
  
  // Document URLs
  document_urls?: {
    director_identity_cards?: string;
    cac_document?: string;
    director_passport_photograph?: string;
  };
}

// Send invitation request/response
export interface SendInvitationRequest {
  email?: string; // Optional custom email for sending invitation
}

export interface SendInvitationResponse {
  success: boolean;
  message: string;
  data: {
    submission_id: number;
    company_id: number;
    company_name: string;
    company_email: string;
    status: ApprovalStatus;
    account_status: AccountStatus;
  };
}

// Approve registration response
export interface ApproveRegistrationResponse {
  success: boolean;
  message: string;
  data: {
    id: number;
    company_name: string;
    email_address: string;
    status: ApprovalStatus;
    account_status: AccountStatus;
    approved_at: string;
  };
}

// Reject registration request
export interface RejectRegistrationRequest {
  rejection_reason: string;
}