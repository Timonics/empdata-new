// services/audit-log.service.ts
import { api } from '@/lib/axios';
import { AuditLogFilters, AuditLogsResponse } from '@/types/audit-log.types';

export class AuditLogService {
  private static readonly BASE = '/api/admin/audit-logs';

  static async getLogs(filters: AuditLogFilters = {}): Promise<AuditLogsResponse['data']> {
    const response = await api.get<AuditLogsResponse>(this.BASE, { params: filters });
    return response.data.data;
  }
}