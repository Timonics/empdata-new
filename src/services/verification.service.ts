import { api } from "@/lib/axios";
import { EncryptedNIN } from "@/types/onboarding.types";

export class VerificationService {
  private static readonly COMPANY_BASE =
    "/api/admin/grouplife/company-registrations";
  private static readonly EMPLOYEE_BASE =
    "/api/admin/grouplife/employee-registrations";
  private static readonly INDIVIDUAL_BASE =
    "/api/admin/individual/registrations";
  private static readonly PUBLIC_VERIFY_NIN = "/api/public/nin/verify";

  /**
   * Get company registrations (director NIN verifications)
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
   * Get employee registrations (employee NIN verifications)
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
   * Get individual registrations (individual NIN verifications)
   */
  static async getIndividualRegistrations(filters?: any) {
    const params = new URLSearchParams();
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value) params.append(key, value.toString());
      });
    }

    const response = await api.get(
      `${this.INDIVIDUAL_BASE}?${params.toString()}`,
    );
    return response.data;
  }

  /**
   * Get all NIN verifications across all registration types
   */
  static async getAllNINVerifications(filters?: {
    status?: string;
    from_date?: string;
    to_date?: string;
  }) {
    // Fetch all three types in parallel
    const [companies, employees, individuals] = await Promise.all([
      this.getCompanyRegistrations(filters),
      this.getEmployeeRegistrations(filters),
      this.getIndividualRegistrations(filters),
    ]);

    // Combine and format the data
    const allVerifications = [
      ...(companies?.data || []).map((item: any) => ({
        ...item,
        type: "company",
        name: `${item.director_name || "N/A"}`,
        nin_value: item.director_nin_value || item.nin_value,
        nin_verification_status: item.nin_verification_status || item.status,
        registration_id: item.id,
      })),
      ...(employees?.data || []).map((item: any) => ({
        ...item,
        type: "employee",
        name: `${item.first_name} ${item.last_name}`,
        nin_value: item.nin_value,
        nin_verification_status: item.nin_verification_status || item.status,
        registration_id: item.id,
      })),
      ...(individuals?.data || []).map((item: any) => ({
        ...item,
        type: "individual",
        name: `${item.first_name} ${item.last_name}`,
        nin_value: item.nin_value,
        nin_verification_status: item.nin_verification_status || item.status,
        registration_id: item.id,
      })),
    ];

    return {
      success: true,
      data: allVerifications,
      total: allVerifications.length,
    };
  }

  /**
   * Verify NIN for a specific registration
   */
  static async verifyRegistrationNIN(
    type: "company" | "employee" | "individual",
    id: number,
  ) {
    let endpoint = "";
    switch (type) {
      case "company":
        endpoint = `${this.COMPANY_BASE}/${id}/verify`;
        break;
      case "employee":
        endpoint = `${this.EMPLOYEE_BASE}/${id}/verify`;
        break;
      case "individual":
        endpoint = `${this.INDIVIDUAL_BASE}/${id}/verify`;
        break;
    }
    const response = await api.post(endpoint);
    return response.data;
  }

  /**
   * Reject NIN for a specific registration
   */
  static async rejectRegistrationNIN(
    type: "company" | "employee" | "individual",
    id: number,
    rejectionReason: string,
  ) {
    let endpoint = "";
    switch (type) {
      case "company":
        endpoint = `${this.COMPANY_BASE}/${id}/reject`;
        break;
      case "employee":
        endpoint = `${this.EMPLOYEE_BASE}/${id}/reject`;
        break;
      case "individual":
        endpoint = `${this.INDIVIDUAL_BASE}/${id}/reject`;
        break;
    }
    const response = await api.post(endpoint, {
      rejection_reason: rejectionReason,
    });
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
   * Verify NIN (Public forms)
   */
  static async verifyPublicNIN(encryptedNIN: EncryptedNIN) {
    const response = await api.post(`${this.PUBLIC_VERIFY_NIN}`, encryptedNIN);
    return response.data;
  }

  /**
   * Verify Employee Registration (Admin)
   * POST /api/admin/grouplife/employee-registrations/{id}/verify
   */
  static async verifyEmployeeRegistration(id: number) {
    const response = await api.post(`${this.EMPLOYEE_BASE}/${id}/verify`);
    return response.data;
  }

  /**
   * Reject Employee Registration (Admin)
   * POST /api/admin/grouplife/employee-registrations/{id}/reject
   */
  static async rejectEmployeeRegistration(id: number, rejectionReason: string) {
    const response = await api.post(`${this.EMPLOYEE_BASE}/${id}/reject`, {
      rejection_reason: rejectionReason,
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
