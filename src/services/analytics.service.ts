import { api } from "@/lib/axios";
import type {
  MonthlyEmployeeResponse,
  CompanyMonthlyResponse,
  RegistrationStatusSummary,
  CurrentWeekResponse,
  RecentRegistrationsResponse,
} from "@/types/analytics.types";

export class AnalyticsService {
  private static readonly BASE_PATH = "/api/admin/analytics";

  /**
   * Get monthly employee registrations
   * GET /api/admin/analytics/employee-registrations/monthly
   */
  static async getMonthlyEmployeeRegistrations() {
    const response = await api.get<{
      success: boolean;
      data: MonthlyEmployeeResponse;
    }>(`${this.BASE_PATH}/employee-registrations/monthly`);
    return response.data;
  }

  /**
   * Get monthly company registrations with status breakdown
   * GET /api/admin/analytics/company-registrations/monthly
   */
  static async getMonthlyCompanyRegistrations() {
    const response = await api.get<{
      success: boolean;
      data: CompanyMonthlyResponse;
    }>(`${this.BASE_PATH}/company-registrations/monthly`);
    return response.data;
  }

  /**
   * Get registration status summary
   * GET /api/admin/analytics/registrations/status-summary
   */
  static async getRegistrationStatusSummary() {
    const response = await api.get<{
      success: boolean;
      data: RegistrationStatusSummary;
    }>(`${this.BASE_PATH}/registrations/status-summary`);
    return response.data;
  }

  /**
   * Get current week data
   * GET /api/admin/analytics/current-week
   */
  static async getCurrentWeekData() {
    const response = await api.get<{
      success: boolean;
      data: CurrentWeekResponse;
    }>(`${this.BASE_PATH}/current-week`);
    return response.data;
  }

  /**
   * Get recent registrations
   * GET /api/admin/analytics/recent-registrations
   */
  static async getRecentRegistrations(hours: number = 7) {
    // Clamp hours between 1 and 168
    const clampedHours = Math.min(Math.max(hours, 1), 168);

    const response = await api.get<{
      success: boolean;
      data: RecentRegistrationsResponse;
    }>(`${this.BASE_PATH}/recent-registrations`, {
      params: { hours: clampedHours },
    });
    return response.data;
  }
}
