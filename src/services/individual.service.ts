import { api } from "@/lib/axios";
import type {
  IndividualRegistration,
  IndividualRegistrationFilters,
  IndividualRegistrationDetail,
  IndividualStats,
  PaginatedResponse,
} from "@/types/individual.types";

export class IndividualService {
  private static readonly BASE_PATH = "/api/admin/individual/registrations";

  /**
   * Get all individual registrations with filters
   * GET /api/admin/individual/registrations
   */
  static async getRegistrations(filters?: IndividualRegistrationFilters) {
    const params = new URLSearchParams();
    if (filters) {
      if (filters.status) params.append("status", filters.status);
      if (filters.submission_type)
        params.append("submission_type", filters.submission_type);
      if (filters.account_status)
        params.append("account_status", filters.account_status);
      if (filters.verification_status)
        params.append("verification_status", filters.verification_status);
      if (filters.from_date) params.append("from_date", filters.from_date);
      if (filters.to_date) params.append("to_date", filters.to_date);
      if (filters.search) params.append("search", filters.search);
      if (filters.page) params.append("page", filters.page.toString());
      if (filters.per_page)
        params.append("per_page", filters.per_page.toString());
    }

    const response = await api.get<PaginatedResponse<IndividualRegistration>>(
      `${this.BASE_PATH}?${params.toString()}`,
    );
    return response.data;
  }

  /**
   * Get pending individual registrations
   * GET /api/admin/individual/registrations/pending
   */
  static async getPendingRegistrations(per_page: number = 15) {
    const response = await api.get<PaginatedResponse<IndividualRegistration>>(
      `${this.BASE_PATH}/pending?per_page=${per_page}`,
    );
    return response.data;
  }

  /**
   * Get single registration by ID
   * GET /api/admin/individual/registrations/{id}
   */
  static async getRegistration(id: number) {
    const response = await api.get<{
      success: boolean;
      data: IndividualRegistrationDetail;
    }>(`${this.BASE_PATH}/${id}`);
    return response.data;
  }

  /**
   * Update registration
   * PUT /api/admin/individual/registrations/{id}
   */
  static async updateRegistration(id: number, data: FormData) {
    const response = await api.post(`${this.BASE_PATH}/${id}`, data, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  }

  /**
   * Approve registration
   * POST /api/admin/individual/registrations/{id}/approve
   */
  static async approveRegistration(id: number) {
    const response = await api.post(`${this.BASE_PATH}/${id}/approve`);
    return response.data;
  }

  /**
   * Send invitation
   * POST /api/admin/individual/registrations/{id}/send-invitation
   */
  static async sendInvitation(id: number, email?: string) {
    const response = await api.post(`${this.BASE_PATH}/${id}/send-invitation`, {
      email,
    });
    return response.data;
  }

  /**
   * Verify registration
   * POST /api/admin/individual/registrations/{id}/verify
   */
  static async verifyRegistration(id: number) {
    const response = await api.post(`${this.BASE_PATH}/${id}/verify`);
    return response.data;
  }

  /**
   * Reject registration
   * POST /api/admin/individual/registrations/{id}/reject
   */
  static async rejectRegistration(
    id: number,
    data: { rejection_reason: string },
  ) {
    const response = await api.post(`${this.BASE_PATH}/${id}/reject`, data);
    return response.data;
  }

  /**
   * Export registrations to CSV
   * GET /api/admin/individual/registrations/export/csv
   */
  static async exportRegistrations(filters?: IndividualRegistrationFilters) {
    const params = new URLSearchParams();
    if (filters) {
      if (filters.status) params.append("status", filters.status);
      if (filters.submission_type)
        params.append("submission_type", filters.submission_type);
      if (filters.account_status)
        params.append("account_status", filters.account_status);
      if (filters.from_date) params.append("from_date", filters.from_date);
      if (filters.to_date) params.append("to_date", filters.to_date);
      if (filters.search) params.append("search", filters.search);
    }

    const response = await api.get(
      `${this.BASE_PATH}/export/csv?${params.toString()}`,
      {
        responseType: "blob",
      },
    );
    return response.data;
  }

  /**
   * Get registration statistics
   * GET /api/admin/analytics/individual/stats
   */
  static async getStats() {
    const response = await api.get<{ success: boolean; data: IndividualStats }>(
      "/api/admin/analytics/individual/stats",
    );
    return response.data;
  }
}
