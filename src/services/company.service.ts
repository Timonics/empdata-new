import { api } from "@/lib/axios";
import type { 
  Company, 
  CreateCompanyData, 
  UpdateCompanyData, 
  CompanyFilters,
  PaginatedResponse 
} from "@/types/company.types";

export class CompanyService {
  private static readonly BASE_PATH = "/api/admin/companies";

  /**
   * Get all companies (paginated)
   * GET /api/admin/companies
   */
  static async getCompanies(filters?: CompanyFilters) {
    const params = new URLSearchParams();
    if (filters) {
      if (filters.status) params.append('status', filters.status);
      if (filters.insurance_type) params.append('insurance_type', filters.insurance_type);
      if (filters.search) params.append('search', filters.search);
      if (filters.page) params.append('page', filters.page.toString());
      if (filters.per_page) params.append('per_page', filters.per_page.toString());
    }
    
    const response = await api.get<PaginatedResponse<Company>>(
      `${this.BASE_PATH}?${params.toString()}`
    );
    return response.data;
  }

  /**
   * Get single company by ID
   * GET /api/admin/companies/{id}
   */
  static async getCompany(id: number) {
    const response = await api.get<{ success: boolean; data: Company }>(
      `${this.BASE_PATH}/${id}`
    );
    return response.data;
  }

  /**
   * Create new company
   * POST /api/admin/companies
   */
  static async createCompany(data: CreateCompanyData) {
    const response = await api.post<{ success: boolean; data: Company }>(
      this.BASE_PATH,
      data
    );
    return response.data;
  }

  /**
   * Update company
   * PUT /api/admin/companies/{id}
   */
  static async updateCompany(id: number, data: UpdateCompanyData) {
    const response = await api.put<{ success: boolean; data: Company }>(
      `${this.BASE_PATH}/${id}`,
      data
    );
    return response.data;
  }

  /**
   * Delete company
   * DELETE /api/admin/companies/{id}
   */
  static async deleteCompany(id: number) {
    const response = await api.delete<{ success: boolean; message: string }>(
      `${this.BASE_PATH}/${id}`
    );
    return response.data;
  }

  /**
   * Export companies to CSV
   * GET /api/admin/companies/export
   */
  static async exportCompanies(filters?: CompanyFilters) {
    const params = new URLSearchParams();
    if (filters) {
      if (filters.status) params.append('status', filters.status);
      if (filters.insurance_type) params.append('insurance_type', filters.insurance_type);
      if (filters.search) params.append('search', filters.search);
    }
    
    const response = await api.get(
      `${this.BASE_PATH}/export?${params.toString()}`,
      {
        responseType: 'blob',
      }
    );
    return response.data;
  }
}