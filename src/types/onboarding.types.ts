export type AccountType = "individual" | "corporate" | "employee-group-life";

export type IdentityCardType =
  | "National Identity Number"
  | "National ID"
  | "International Passport"
  | "Driver's License"
  | "Voter's Card"
  | "Permanent Voter's Card";

export interface CompanyInfo {
  id: number;
  name: string;
  email: string;
}

// Base interface for common fields
export interface BaseOnboardingData {
  consent_checkbox: boolean;
  account_type: AccountType;
  selected_plan: string;
}

// Individual Onboarding (for individual policy plans)
export interface IndividualOnboardingData extends BaseOnboardingData {
  title?: string;
  first_name: string;
  last_name: string;
  middle_name?: string;
  gender?: string;
  date_of_birth: string;
  nationality: string;
  phone_number: string;
  confirm_phone_number: string;
  foreign_number?: string;
  email_address: string;
  confirm_email_address: string;
  country: string;
  state: string;
  city: string;
  chn?: string;
  house_address: string;
  previous_address?: string;

  // Bank Information (encrypted)
  bvn_iv?: string;
  bvn_data?: string;
  bvn_tag?: string;
  bvn_number?: string;
  bank_name?: string;
  bank_account_number?: string;
  tin_or_pin?: string;
  bank_details_consent?: boolean;

  // Identity Information
  identity_card_type: IdentityCardType;
  identity_card_number?: string; // For non-NIN
  nin_number_iv?: string; // For NIN
  nin_number_data?: string; // For NIN
  nin_number_tag?: string; // For NIN
  national_identification_number?: string;

  // Documents
  identity_card?: File;
  scanned_signature?: File;
  passport_photograph?: File;
  nin_document?: File;
}

// Company Group Life Onboarding
export interface CompanyGroupLifeOnboardingData extends BaseOnboardingData {
  // Company Information
  company_name: string;
  rc_number: string;
  country: string;
  state: string;
  city: string;
  phone_number: string;
  confirm_phone_number: string;
  secondary_phone?: string;
  email_address: string;
  confirm_email_address: string;
  house_address: string;
  previous_address?: string;

  // Director Information
  director_name: string;
  director_bvn_iv?: string;
  director_bvn_data?: string;
  director_bvn_tag?: string;
  director_bvn_number?: string;
  director_bank_name: string;
  director_bank_acct_number: string;
  director_tax_identification_number?: string;
  director_national_identification_number?: string;

  // Identity Information
  identity_card_type: IdentityCardType;
  identity_card_number?: string; // For non-NIN
  nin_number_iv?: string; // For NIN
  nin_number_data?: string; // For NIN
  nin_number_tag?: string; // For NIN

  // Documents
  director_identity_cards?: File;
  cac_document?: File;
  director_passport_photograph?: File;
}

// Employee Group Life Onboarding (requires company selection)
export interface EmployeeGroupLifeOnboardingData extends BaseOnboardingData {
  company_id: number;

  // Personal Information
  title?: string;
  first_name: string;
  last_name: string;
  middle_name?: string;
  gender?: string;
  date_of_birth: string;
  nationality: string;
  phone_number: string;
  confirm_phone_number: string;
  foreign_number?: string;
  email_address: string;
  confirm_email_address: string;
  country: string;
  state: string;
  city: string;
  chn?: string;
  house_address: string;
  previous_address?: string;

  // Bank Information (encrypted)
  bvn_iv?: string;
  bvn_data?: string;
  bvn_tag?: string;
  bvn_number?: string;
  bank_name?: string;
  bank_account_number?: string;
  tin_or_pin?: string;
  bank_details_consent?: boolean;

  // Identity Information
  identity_card_type: IdentityCardType;
  identity_card_number?: string; // For non-NIN
  nin_number_iv?: string; // For NIN
  nin_number_data?: string; // For NIN
  nin_number_tag?: string; // For NIN
  national_identification_number?: string;

  // Documents
  identity_card?: File;
  scanned_signature?: File;
  passport_photograph?: File;
  nin_document?: File;

  // Beneficiaries (for employee group life)
  beneficiaries?: Beneficiary[];
}

export interface Beneficiary {
  id?: number;
  first_name: string;
  last_name: string;
  address: string;
  date_of_birth: string;
  percentage_allocation: number;
  utility_bill?: File;
  identification_document?: File;
}

export interface OnboardingResponse {
  success: boolean;
  message: string;
  data?: {
    registration_id: number;
    first_name?: string;
    last_name?: string;
    email_address?: string;
    company_name?: string;
    status: string;
    submitted_at: string;
  };
}

export interface CompaniesResponse {
  success: boolean;
  data: CompanyInfo[];
}
