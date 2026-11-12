import { api } from "@/lib/axios";
import type {
  PortalEmployee,
  EmployeeFilters,
  PaginatedResponse,
} from "@/types/employee.types";

/**
 * Admin-scoped employee service (super-admin token).
 * Lists employees across all companies.
 */
export class AdminEmployeeService {
  private static readonly BASE_PATH = "/api/admin/employees";

  /**
   * List all employees with filters
   * GET /api/admin/employees
   */
  static async getEmployees(filters?: EmployeeFilters) {
    const params = new URLSearchParams();
    if (filters) {
      if (filters.page) params.append("page", filters.page.toString());
      if (filters.per_page)
        params.append("per_page", filters.per_page.toString());
      if (filters.search) params.append("search", filters.search);
      if (filters.employment_status)
        params.append("employment_status", filters.employment_status);
      if (filters.company_id !== undefined)
        params.append("company_id", String(filters.company_id));
      if (filters.nin_verified !== undefined)
        params.append("nin_verified", filters.nin_verified.toString());
    }

    const response = await api.get<PaginatedResponse<PortalEmployee>>(
      `${this.BASE_PATH}?${params.toString()}`,
    );
    return response.data;
  }

  /**
   * Get single employee by ID
   * GET /api/admin/employees/{id}
   */
  static async getEmployee(id: number) {
    const response = await api.get<{ success: boolean; data: PortalEmployee }>(
      `${this.BASE_PATH}/${id}`,
    );
    return response.data;
  }

  /**
   * Create an employee under a company (admin)
   * POST /api/admin/employees
   */
  static async createEmployee(data: {
    company_id: number;
    first_name: string;
    last_name: string;
    email: string;
    date_of_birth: string;
    phone?: string;
    department?: string;
    position?: string;
  }) {
    const response = await api.post<{
      success: boolean;
      message?: string;
      data: PortalEmployee;
    }>(this.BASE_PATH, data);
    return response.data;
  }
}
