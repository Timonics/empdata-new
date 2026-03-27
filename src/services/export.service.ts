import { api } from "@/lib/axios";
import { saveAs } from 'file-saver';
import { format } from 'date-fns';

export type ExportFormat = 'csv' | 'excel';
export type ExportEntity = 
  | 'company-registrations'
  | 'employee-registrations'
  | 'individual-registrations'
  | 'portal-employees';

export interface ExportOptions {
  format: ExportFormat;
  entity: ExportEntity;
  filters?: Record<string, any>;
  selectedIds?: number[];
  dateRange?: { from: Date; to: Date };
  filename?: string;
}

export class ExportApiService {
  private static readonly ADMIN_BASE = "/api/admin";
  private static readonly PORTAL_BASE = "/api/portal";

  /**
   * Export Company Registrations (Group Life)
   * GET /api/admin/grouplife/company-registrations/export/csv
   */
  static async exportCompanyRegistrations(params?: {
    status?: string;
    submission_type?: string;
    account_status?: string;
    verification_status?: string;
    from_date?: string;
    to_date?: string;
    ids?: string;
  }) {
    const response = await api.get(
      `${this.ADMIN_BASE}/grouplife/company-registrations/export/csv`,
      {
        params,
        responseType: 'blob',
      }
    );
    return response.data;
  }

  /**
   * Export Employee Registrations (Group Life)
   * GET /api/admin/grouplife/employee-registrations/export/csv
   */
  static async exportEmployeeRegistrations(params?: {
    status?: string;
    submission_type?: string;
    account_status?: string;
    verification_status?: string;
    company_id?: number;
    from_date?: string;
    to_date?: string;
    ids?: string;
  }) {
    const response = await api.get(
      `${this.ADMIN_BASE}/grouplife/employee-registrations/export/csv`,
      {
        params,
        responseType: 'blob',
      }
    );
    return response.data;
  }

  /**
   * Export Individual Registrations
   * GET /api/admin/individual/registrations/export/csv
   */
  static async exportIndividualRegistrations(params?: {
    status?: string;
    submission_type?: string;
    account_status?: string;
    from_date?: string;
    to_date?: string;
    ids?: string;
  }) {
    const response = await api.get(
      `${this.ADMIN_BASE}/individual/registrations/export/csv`,
      {
        params,
        responseType: 'blob',
      }
    );
    return response.data;
  }

  /**
   * Export Portal Employees (Company Employees)
   * GET /api/portal/employees/export/csv
   */
  static async exportPortalEmployees(params?: {
    company_id?: number;
    search?: string;
    employment_status?: string;
    nin_verified?: boolean;
    ids?: string;
  }) {
    const response = await api.get(
      `${this.PORTAL_BASE}/employees/export/csv`,
      {
        params,
        responseType: 'blob',
      }
    );
    return response.data;
  }

  /**
   * Download blob as file
   */
  static download(blob: Blob, filename: string) {
    saveAs(blob, filename);
  }
}