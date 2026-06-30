// hooks/queries/useAuditLogs.ts
import { useQuery } from '@tanstack/react-query';
import { AuditLogService } from '@/services/audit-log.service';
import { AuditLogFilters } from '@/types/audit-log.types';

export const auditLogKeys = {
  all: ['audit-logs'] as const,
  list: (filters: AuditLogFilters) => [...auditLogKeys.all, 'list', filters] as const,
};

export function useAuditLogs(filters: AuditLogFilters) {
  return useQuery({
    queryKey: auditLogKeys.list(filters),
    queryFn: () => AuditLogService.getLogs(filters),
    placeholderData: (previousData) => previousData, // replaces keepPreviousData
  });
}