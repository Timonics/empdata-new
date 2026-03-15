import { api } from "@/lib/axios";
import type {
  CompanyProfile,
  DashboardStats,
  EmployeeSummary,
  InvitationSummary,
} from "@/types/company-portal.types";

export class PortalDashboardService {
  private static readonly BASE_PATH = "/api/portal";

  /**
   * Get company profile
   * GET /api/portal/company/profile
   */
  static async getCompanyProfile() {
    const response = await api.get<{ success: boolean; data: CompanyProfile }>(
      `${this.BASE_PATH}/company/profile`,
    );
    return response.data;
  }

  /**
   * Get dashboard stats
   * GET /api/portal/dashboard/stats
   */
  static async getDashboardStats() {
    const response = await api.get<{ success: boolean; data: DashboardStats }>(
      `${this.BASE_PATH}/dashboard/stats`,
    );
    return response.data;
  }

  /**
   * Get recent employees
   * GET /api/portal/employees?per_page=5&sort=created_at&order=desc
   */
  static async getRecentEmployees() {
    const response = await api.get<{
      success: boolean;
      data: EmployeeSummary[];
    }>(`${this.BASE_PATH}/employees?per_page=5&sort=created_at&order=desc`);
    return response.data;
  }

  /**
   * Get pending invitations
   * GET /api/portal/invitations?status=pending&per_page=5
   */
  static async getPendingInvitations() {
    const response = await api.get<{
      success: boolean;
      data: InvitationSummary[];
    }>(`${this.BASE_PATH}/invitations?status=pending&per_page=5`);
    return response.data;
  }
}
