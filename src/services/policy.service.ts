import { api } from "@/lib/axios";
import type {
  Policy,
  PolicyFilters,
  CreatePolicyData,
  UpdatePolicyData,
  PaginatedResponse,
} from "@/types/policy.types";

export class PolicyService {
  private static readonly BASE_PATH = "/api/admin/policies";

  /**
   * List policies with filters
   * GET /api/admin/policies
   */
  static async getPolicies(filters?: PolicyFilters) {
    const params = new URLSearchParams();
    if (filters) {
      if (filters.status) params.append("status", filters.status);
      if (filters.type) params.append("type", filters.type);
      if (filters.company_id !== undefined)
        params.append("company_id", String(filters.company_id));
      if (filters.search) params.append("search", filters.search);
      if (filters.page) params.append("page", String(filters.page));
      if (filters.per_page) params.append("per_page", String(filters.per_page));
    }

    const response = await api.get<PaginatedResponse<Policy>>(
      `${this.BASE_PATH}?${params.toString()}`,
    );
    return response.data;
  }

  /**
   * Get single policy
   * GET /api/admin/policies/{id}
   */
  static async getPolicy(id: number) {
    const response = await api.get<{ success: boolean; data: Policy }>(
      `${this.BASE_PATH}/${id}`,
    );
    return response.data;
  }

  /**
   * Create policy
   * POST /api/admin/policies
   */
  static async createPolicy(data: CreatePolicyData) {
    const response = await api.post<{ success: boolean; data: Policy }>(
      this.BASE_PATH,
      data,
    );
    return response.data;
  }

  /**
   * Update policy
   * PUT /api/admin/policies/{id}
   */
  static async updatePolicy(id: number, data: UpdatePolicyData) {
    const response = await api.post<{ success: boolean; data: Policy }>(
      `${this.BASE_PATH}/${id}`,
      { ...data, _method: "PUT" },
    );
    return response.data;
  }

  /**
   * Delete policy
   * DELETE /api/admin/policies/{id}
   */
  static async deletePolicy(id: number) {
    const response = await api.delete<{ success: boolean; message: string }>(
      `${this.BASE_PATH}/${id}`,
    );
    return response.data;
  }
}
