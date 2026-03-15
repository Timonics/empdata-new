import { api } from "@/lib/axios";
import type {
  CompanyRegistration,
  EmployeeRegistration,
  PaginatedResponse,
  RegistrationFilters,
  PublicCompany,
  CompanyRegistrationDetail,
  SendInvitationRequest,
  SendInvitationResponse,
  ApproveRegistrationResponse,
  RejectRegistrationRequest,
} from "@/types/grouplife.types";

export class GroupLifeService {
  // ==================== PUBLIC ENDPOINTS ====================
  private static readonly PUBLIC_BASE = "/api/public/grouplife";

  /**
   * Get active companies for employee selection
   * GET /api/public/grouplife/companies
   */
  static async getPublicCompanies() {
    const response = await api.get<{ success: boolean; data: PublicCompany[] }>(
      `${this.PUBLIC_BASE}/companies`
    );
    return response.data;
  }

  /**
   * Submit employee registration (public)
   * POST /api/public/grouplife/employee/register
   */
  static async submitEmployeeRegistration(formData: FormData) {
    const response = await api.post(
      `${this.PUBLIC_BASE}/employee/register`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );
    return response.data;
  }

  // ==================== ADMIN COMPANY REGISTRATIONS ====================
  private static readonly ADMIN_COMPANY_BASE = "/api/admin/grouplife/company-registrations";

  /**
   * List all company registrations with filters
   * GET /api/admin/grouplife/company-registrations
   */
  static async getCompanyRegistrations(filters?: RegistrationFilters) {
    const params = new URLSearchParams();
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined) {
          params.append(key, value.toString());
        }
      });
    }
    
    const response = await api.get<PaginatedResponse<CompanyRegistration>>(
      `${this.ADMIN_COMPANY_BASE}?${params.toString()}`
    );
    return response.data;
  }

  /**
   * List pending company registrations
   * GET /api/admin/grouplife/company-registrations/pending
   */
  static async getPendingCompanyRegistrations(per_page: number = 15) {
    const response = await api.get<PaginatedResponse<CompanyRegistration>>(
      `${this.ADMIN_COMPANY_BASE}/pending?per_page=${per_page}`
    );
    return response.data;
  }

  /**
   * Get single company registration
   * GET /api/admin/grouplife/company-registrations/{id}
   */
  static async getCompanyRegistration(id: number) {
    const response = await api.get<{ success: boolean; data: CompanyRegistrationDetail }>(
      `${this.ADMIN_COMPANY_BASE}/${id}`
    );
    return response.data;
  }

  /**
   * Update company registration
   * PUT /api/admin/grouplife/company-registrations/{id}
   */
  static async updateCompanyRegistration(id: number, formData: FormData) {
    formData.append('_method', 'PUT'); // Laravel method spoofing
    const response = await api.post(
      `${this.ADMIN_COMPANY_BASE}/${id}`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );
    return response.data;
  }

  /**
   * Approve company registration (optional step)
   * POST /api/admin/grouplife/company-registrations/{id}/approve
   */
  static async approveCompanyRegistration(id: number) {
    const response = await api.post<ApproveRegistrationResponse>(
      `${this.ADMIN_COMPANY_BASE}/${id}/approve`
    );
    return response.data;
  }

  /**
   * Send invitation to company
   * POST /api/admin/grouplife/company-registrations/{id}/send-invitation
   */
  static async sendCompanyInvitation(id: number, data?: SendInvitationRequest) {
    const response = await api.post<SendInvitationResponse>(
      `${this.ADMIN_COMPANY_BASE}/${id}/send-invitation`,
      data || {}
    );
    return response.data;
  }

  /**
   * Reject company registration
   * POST /api/admin/grouplife/company-registrations/{id}/reject
   */
  static async rejectCompanyRegistration(id: number, data: RejectRegistrationRequest) {
    const response = await api.post(
      `${this.ADMIN_COMPANY_BASE}/${id}/reject`,
      data
    );
    return response.data;
  }

  /**
   * Export company registrations to CSV
   * GET /api/admin/grouplife/company-registrations/export/csv
   */
  static async exportCompanyRegistrations(filters?: RegistrationFilters) {
    const params = new URLSearchParams();
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined) {
          params.append(key, value.toString());
        }
      });
    }
    
    const response = await api.get(
      `${this.ADMIN_COMPANY_BASE}/export/csv?${params.toString()}`,
      {
        responseType: 'blob',
      }
    );
    return response.data;
  }

  /**
   * Bulk upload company registrations via CSV
   * POST /api/admin/grouplife/company-registrations/bulk-upload
   */
  static async bulkUploadCompanies(formData: FormData) {
    const response = await api.post(
      `${this.ADMIN_COMPANY_BASE}/bulk-upload`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );
    return response.data;
  }

  // ==================== ADMIN EMPLOYEE REGISTRATIONS ====================
  private static readonly ADMIN_EMPLOYEE_BASE = "/api/admin/grouplife/employee-registrations";

  /**
   * List all employee registrations with filters
   * GET /api/admin/grouplife/employee-registrations
   */
  static async getEmployeeRegistrations(filters?: RegistrationFilters) {
    const params = new URLSearchParams();
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined) {
          params.append(key, value.toString());
        }
      });
    }
    
    const response = await api.get<PaginatedResponse<EmployeeRegistration>>(
      `${this.ADMIN_EMPLOYEE_BASE}?${params.toString()}`
    );
    return response.data;
  }

  /**
   * List pending employee registrations
   * GET /api/admin/grouplife/employee-registrations/pending
   */
  static async getPendingEmployeeRegistrations(per_page: number = 15) {
    const response = await api.get<PaginatedResponse<EmployeeRegistration>>(
      `${this.ADMIN_EMPLOYEE_BASE}/pending?per_page=${per_page}`
    );
    return response.data;
  }

  /**
   * Get single employee registration
   * GET /api/admin/grouplife/employee-registrations/{id}
   */
  static async getEmployeeRegistration(id: number) {
    const response = await api.get(
      `${this.ADMIN_EMPLOYEE_BASE}/${id}`
    );
    return response.data;
  }

  /**
   * Update employee registration
   * PUT /api/admin/grouplife/employee-registrations/{id}
   */
  static async updateEmployeeRegistration(id: number, formData: FormData) {
    formData.append('_method', 'PUT');
    const response = await api.post(
      `${this.ADMIN_EMPLOYEE_BASE}/${id}`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );
    return response.data;
  }

  /**
   * Approve employee registration
   * POST /api/admin/grouplife/employee-registrations/{id}/approve
   */
  static async approveEmployeeRegistration(id: number) {
    const response = await api.post(
      `${this.ADMIN_EMPLOYEE_BASE}/${id}/approve`
    );
    return response.data;
  }

  /**
   * Send invitation to employee
   * POST /api/admin/grouplife/employee-registrations/{id}/send-invitation
   */
  static async sendEmployeeInvitation(id: number, data?: SendInvitationRequest) {
    const response = await api.post(
      `${this.ADMIN_EMPLOYEE_BASE}/${id}/send-invitation`,
      data || {}
    );
    return response.data;
  }

  /**
   * Reject employee registration
   * POST /api/admin/grouplife/employee-registrations/{id}/reject
   */
  static async rejectEmployeeRegistration(id: number, data: RejectRegistrationRequest) {
    const response = await api.post(
      `${this.ADMIN_EMPLOYEE_BASE}/${id}/reject`,
      data
    );
    return response.data;
  }

  /**
   * Export employee registrations to CSV
   * GET /api/admin/grouplife/employee-registrations/export/csv
   */
  static async exportEmployeeRegistrations(filters?: RegistrationFilters) {
    const params = new URLSearchParams();
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined) {
          params.append(key, value.toString());
        }
      });
    }
    
    const response = await api.get(
      `${this.ADMIN_EMPLOYEE_BASE}/export/csv?${params.toString()}`,
      {
        responseType: 'blob',
      }
    );
    return response.data;
  }

  /**
   * Bulk upload employee registrations via CSV
   * POST /api/admin/grouplife/employee-registrations/bulk-upload
   */
  static async bulkUploadEmployees(formData: FormData) {
    const response = await api.post(
      `${this.ADMIN_EMPLOYEE_BASE}/bulk-upload`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );
    return response.data;
  }
}