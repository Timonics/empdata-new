export type IndividualStatus = "pending" | "approved" | "verified" | "rejected";
export type AccountStatus = "pending" | "invited" | "active";
export type VerificationStatus = "not_verified" | "verified";
export type SubmissionType = "public_form" | "bulk_upload";
export type IdentityCardType =
  | "National Identity Number"
  | "National ID"
  | "International Passport"
  | "Driver's License"
  | "Voter's Card"
  | "Permanent Voter's Card";

export interface IndividualRegistration {
  id: number;
  title?: string;
  first_name: string;
  last_name: string;
  middle_name?: string;
  email_address: string;
  phone_number: string;
  gender?: string;
  date_of_birth: string;
  nationality: string;
  country: string;
  state: string;
  city: string;
  chn?: string;
  house_address: string;
  previous_address?: string;

  // Bank info (encrypted)
  bank_name?: string;
  bank_account_number?: string;
  tin_or_pin?: string;
  bank_details_consent?: boolean;

  // Identity
  identity_card_type: IdentityCardType;
  identity_card_number?: string; // For non-NIN

  // Status tracking
  submission_type: SubmissionType;
  status: IndividualStatus;
  account_status: AccountStatus;
  verification_status: VerificationStatus;
  rejection_reason?: string;

  // Timestamps
  submitted_at: string;
  approved_at?: string;
  rejected_at?: string;
  verified_at?: string;

  // Admin info
  approved_by?: number;
  rejected_by?: number;
  verified_by?: number;

  // Related
  portal_user_id?: number;

  // Document URLs
  documents?: {
    identity_card?: string;
    scanned_signature?: string;
    passport_photograph?: string;
    nin_document?: string;
  };
}

export interface IndividualRegistrationFilters {
  status?: IndividualStatus;
  submission_type?: SubmissionType;
  account_status?: AccountStatus;
  verification_status?: VerificationStatus;
  from_date?: string;
  to_date?: string;
  search?: string;
  page?: number;
  per_page?: number;
}

export interface IndividualRegistrationDetail extends IndividualRegistration {
  // Additional details for single view
  bvn_iv?: string;
  bvn_data?: string;
  bvn_tag?: string;
  nin_number_iv?: string;
  nin_number_data?: string;
  nin_number_tag?: string;

  // Full document objects
  identity_card_file?: string;
  scanned_signature_file?: string;
  passport_photograph_file?: string;
  nin_document_file?: string;
}

export interface IndividualStats {
  total: number;
  pending: number;
  approved: number;
  verified: number;
  rejected: number;
  not_verified: number;
  change: string;
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
