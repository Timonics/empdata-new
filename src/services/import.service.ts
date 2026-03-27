import { api } from "@/lib/axios";
import * as XLSX from 'xlsx';

export type ImportEntity = 
  | 'company-registrations'
  | 'employee-registrations'
  | 'individual-registrations';

export interface ImportResult {
  success: boolean;
  message: string;
  data: {
    summary: {
      total_rows: number;
      successful_count: number;
      failed_count: number;
    };
    successful: Array<{
      row: number;
      employee_name?: string;
      company_name?: string;
      email: string;
      submission_id: number;
      employee_id?: number;
    }>;
    failed: Array<{
      row: number;
      data: any;
      errors: string[];
    }>;
  };
}

export class ImportApiService {
  private static readonly ADMIN_BASE = "/api/admin";

  /**
   * Bulk Upload Company Registrations
   * POST /api/admin/grouplife/company-registrations/bulk-upload
   */
  static async bulkUploadCompanyRegistrations(
    file: File,
    sendInvitations?: boolean
  ): Promise<ImportResult> {
    const formData = new FormData();
    formData.append('csv_file', file);
    if (sendInvitations !== undefined) {
      formData.append('send_invitations', String(sendInvitations));
    }

    const response = await api.post(
      `${this.ADMIN_BASE}/grouplife/company-registrations/bulk-upload`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );
    return response.data;
  }

  /**
   * Bulk Upload Employee Registrations
   * POST /api/admin/grouplife/employee-registrations/bulk-upload
   */
  static async bulkUploadEmployeeRegistrations(file: File): Promise<ImportResult> {
    const formData = new FormData();
    formData.append('csv_file', file);

    const response = await api.post(
      `${this.ADMIN_BASE}/grouplife/employee-registrations/bulk-upload`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );
    return response.data;
  }

  /**
   * Parse CSV file (frontend only for individual registrations)
   */
  static async parseCSV(file: File): Promise<any[]> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const text = e.target?.result as string;
          const lines = text.split('\n');
          const headers = lines[0].split(',').map(h => h.replace(/["']/g, '').trim());
          
          const data = [];
          for (let i = 1; i < lines.length; i++) {
            if (!lines[i].trim()) continue;
            const values = ImportApiService.parseCSVLine(lines[i]);
            const row: any = {};
            headers.forEach((header, idx) => {
              row[header] = values[idx]?.trim() || '';
            });
            data.push(row);
          }
          resolve(data);
        } catch (error) {
          reject(error);
        }
      };
      reader.onerror = reject;
      reader.readAsText(file);
    });
  }

  /**
   * Parse Excel file (frontend only for individual registrations)
   */
  static async parseExcel(file: File): Promise<any[]> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const data = new Uint8Array(e.target?.result as ArrayBuffer);
          const workbook = XLSX.read(data, { type: 'array' });
          const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
          const jsonData = XLSX.utils.sheet_to_json(firstSheet);
          resolve(jsonData);
        } catch (error) {
          reject(error);
        }
      };
      reader.onerror = reject;
      reader.readAsArrayBuffer(file);
    });
  }

  private static parseCSVLine(line: string): string[] {
    const result: string[] = [];
    let current = '';
    let inQuotes = false;
    
    for (let i = 0; i < line.length; i++) {
      const char = line[i];
      if (char === '"') {
        inQuotes = !inQuotes;
      } else if (char === ',' && !inQuotes) {
        result.push(current);
        current = '';
      } else {
        current += char;
      }
    }
    result.push(current);
    return result;
  }
}