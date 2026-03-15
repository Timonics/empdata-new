import { api } from "@/lib/axios";

export class VerificationService {
  private static readonly COMPANY_BASE =
    "/api/admin/grouplife/company-registrations";
  private static readonly EMPLOYEE_BASE =
    "/api/admin/grouplife/employee-registrations";

  /**
   * Get company registrations (for company verifications)
   */
  static async getCompanyRegistrations(filters?: any) {
    const params = new URLSearchParams();
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value) params.append(key, value.toString());
      });
    }

    const response = await api.get(`${this.COMPANY_BASE}?${params.toString()}`);
    return response.data;
  }

  /**
   * Get employee registrations (for NIN verifications)
   */
  static async getEmployeeRegistrations(filters?: any) {
    const params = new URLSearchParams();
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value) params.append(key, value.toString());
      });
    }

    const response = await api.get(
      `${this.EMPLOYEE_BASE}?${params.toString()}`,
    );
    return response.data;
  }

  /**
   * Get documents for a specific registration
   */
  static async getRegistrationDocuments(
    type: "company" | "employee",
    id: number,
  ) {
    const base = type === "company" ? this.COMPANY_BASE : this.EMPLOYEE_BASE;
    const response = await api.get(`${base}/${id}`);
    return response.data;
  }

  /**
   * Verify NIN
   */
  static async verifyNIN(id: number) {
    const response = await api.post(`${this.EMPLOYEE_BASE}/${id}/verify-nin`);
    return response.data;
  }

  /**
   * Reject NIN
   */
  static async rejectNIN(id: number, reason: string) {
    const response = await api.post(`${this.EMPLOYEE_BASE}/${id}/reject-nin`, {
      reason,
    });
    return response.data;
  }

  /**
   * Verify document
   */
  static async verifyDocument(
    type: "company" | "employee",
    id: number,
    documentType: string,
  ) {
    const base = type === "company" ? this.COMPANY_BASE : this.EMPLOYEE_BASE;
    const response = await api.post(`${base}/${id}/verify-document`, {
      document_type: documentType,
    });
    return response.data;
  }

  /**
   * Reject document
   */
  static async rejectDocument(
    type: "company" | "employee",
    id: number,
    documentType: string,
    reason: string,
  ) {
    const base = type === "company" ? this.COMPANY_BASE : this.EMPLOYEE_BASE;
    const response = await api.post(`${base}/${id}/reject-document`, {
      document_type: documentType,
      reason,
    });
    return response.data;
  }
}
