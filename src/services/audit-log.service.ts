// services/audit-log.service.ts
import { api } from '@/lib/axios';
import { AuditLogFilters } from '@/types/audit-log.types';

export interface AuditLogPage {
  data: any[];
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
  from: number;
  to: number;
}

export class AuditLogService {
  private static readonly BASE = '/api/admin/audit-logs';

  /**
   * Get audit logs. Always returns complete pagination fields (defaulting
   * to a single page built from the records) so consumers can rely on them.
   */
  static async getLogs(filters: AuditLogFilters = {}): Promise<AuditLogPage> {
    const response = await api.get<{
      success: boolean;
      data?: any[];
      pagination?: {
        current_page: number;
        last_page: number;
        per_page: number;
        total: number;
        from: number;
        to: number;
      };
    }>(this.BASE, { params: filters });

    const body = response.data;
    const rows = body?.data ?? [];
    const meta = body?.pagination;

    return {
      data: rows,
      current_page: meta?.current_page ?? 1,
      last_page: meta?.last_page ?? 1,
      per_page: meta?.per_page ?? (rows.length || 1),
      total: meta?.total ?? rows.length,
      from: meta?.from ?? (rows.length ? 1 : 0),
      to: meta?.to ?? rows.length,
    };
  }
}
