import { api } from "@/lib/axios";
import type { 
  PortalEmployee, 
  CreateEmployeeData, 
  UpdateEmployeeData,
  EmployeeFilters,
  SubmitNINData,
  BeneficiariesData,
  Beneficiary,
  PaginatedResponse,
  EmployeeStats
} from "@/types/employee.types";

export class PortalEmployeeService {
  private static readonly BASE_PATH = "/api/portal/employees";

  /**
   * Create new employee
   * POST /api/portal/employees
   */
  static async createEmployee(data: CreateEmployeeData) {
    const response = await api.post<{ success: boolean; data: PortalEmployee }>(
      this.BASE_PATH,
      data
    );
    return response.data;
  }

  /**
   * List employees with filters
   * GET /api/portal/employees
   */
  static async getEmployees(filters?: EmployeeFilters) {
    const params = new URLSearchParams();
    if (filters) {
      if (filters.page) params.append('page', filters.page.toString());
      if (filters.per_page) params.append('per_page', filters.per_page.toString());
      if (filters.search) params.append('search', filters.search);
      if (filters.employment_status) params.append('employment_status', filters.employment_status);
      if (filters.nin_verified !== undefined) params.append('nin_verified', filters.nin_verified.toString());
    }
    
    const response = await api.get<PaginatedResponse<PortalEmployee>>(
      `${this.BASE_PATH}?${params.toString()}`
    );
    return response.data;
  }

  /**
   * Get single employee by ID
   * GET /api/portal/employees/{id}
   */
  static async getEmployee(id: number) {
    const response = await api.get<{ success: boolean; data: PortalEmployee }>(
      `${this.BASE_PATH}/${id}`
    );
    return response.data;
  }

  /**
   * Update employee
   * PUT /api/portal/employees/{id}
   */
  static async updateEmployee(id: number, data: UpdateEmployeeData) {
    const response = await api.put<{ success: boolean; data: PortalEmployee }>(
      `${this.BASE_PATH}/${id}`,
      data
    );
    return response.data;
  }

  /**
   * Delete employee
   * DELETE /api/portal/employees/{id}
   */
  static async deleteEmployee(id: number) {
    const response = await api.delete<{ success: boolean; message: string }>(
      `${this.BASE_PATH}/${id}`
    );
    return response.data;
  }

  /**
   * Submit NIN for verification
   * POST /api/portal/employees/{id}/submit-nin
   */
  static async submitNIN(id: number, data: SubmitNINData) {
    const response = await api.post<{ success: boolean; data: PortalEmployee }>(
      `${this.BASE_PATH}/${id}/submit-nin`,
      data
    );
    return response.data;
  }

  /**
   * Get beneficiaries
   * GET /api/portal/employees/{id}/beneficiaries
   */
  static async getBeneficiaries(id: number) {
    const response = await api.get<{ 
      success: boolean; 
      data: {
        employee: PortalEmployee;
        count: number;
        total_allocation: number;
        beneficiaries: Beneficiary[];
      } 
    }>(`${this.BASE_PATH}/${id}/beneficiaries`);
    return response.data;
  }

  /**
   * Save/Update beneficiaries
   * POST /api/portal/employees/{id}/beneficiaries
   */
  static async saveBeneficiaries(id: number, data: BeneficiariesData) {
    // Check if there are any files
    const hasFiles = data.beneficiaries.some(b => 
      b.utility_bill instanceof File || b.identification_document instanceof File
    );

    if (hasFiles) {
      const formData = new FormData();
      
      // Send beneficiaries as JSON string (without file data)
      formData.append('beneficiaries', JSON.stringify(data.beneficiaries.map(b => ({
        id: b.id,
        first_name: b.first_name,
        last_name: b.last_name,
        address: b.address,
        date_of_birth: b.date_of_birth,
        percentage_allocation: b.percentage_allocation,
      }))));

      // Append files
      data.beneficiaries.forEach((b, index) => {
        if (b.utility_bill instanceof File) {
          formData.append(`beneficiary_${index}_utility_bill`, b.utility_bill);
        }
        if (b.identification_document instanceof File) {
          formData.append(`beneficiary_${index}_identification`, b.identification_document);
        }
      });

      const response = await api.post(
        `${this.BASE_PATH}/${id}/beneficiaries`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );
      return response.data;
    }

    // No files, send as JSON
    const response = await api.post(
      `${this.BASE_PATH}/${id}/beneficiaries`,
      data
    );
    return response.data;
  }

  /**
   * Export employees to CSV
   * GET /api/portal/employees/export/csv
   */
  static async exportEmployees(filters?: Omit<EmployeeFilters, 'page' | 'per_page'>) {
    const params = new URLSearchParams();
    if (filters) {
      if (filters.search) params.append('search', filters.search);
      if (filters.employment_status) params.append('employment_status', filters.employment_status);
      if (filters.nin_verified !== undefined) params.append('nin_verified', filters.nin_verified.toString());
    }
    
    const response = await api.get(
      `${this.BASE_PATH}/export/csv?${params.toString()}`,
      {
        responseType: 'blob',
      }
    );
    return response.data;
  }

  /**
   * Get employee statistics for dashboard
   * Combines multiple queries to get stats
   */
  static async getEmployeeStats(): Promise<EmployeeStats> {
    const [totalRes, activeRes, verifiedRes] = await Promise.all([
      this.getEmployees({ per_page: 1 }),
      this.getEmployees({ employment_status: 'active', per_page: 1 }),
      this.getEmployees({ nin_verified: true, per_page: 1 }),
    ]);

    return {
      total: totalRes.pagination?.total || 0,
      active: activeRes.pagination?.total || 0,
      inactive: (totalRes.pagination?.total || 0) - (activeRes.pagination?.total || 0),
      verified_nin: verifiedRes.pagination?.total || 0,
      pending_nin: (totalRes.pagination?.total || 0) - (verifiedRes.pagination?.total || 0),
    };
  }
}