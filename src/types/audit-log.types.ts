// types/audit-log.types.ts
export interface AuditLog {
  id: number;
  timestamp: string;
  action: string;
  actor_type: 'admin' | 'portal_user' | 'system' | 'public';
  actor_id: number | null;
  actor_email: string | null;
  ip_address: string | null;
  record_type: string | null;
  record_id: number | null;
  status: 'SUCCESS' | 'FAILED';
  metadata: Record<string, any> | null;
  prev_hash: string | null;
  current_hash: string;
}

export interface AuditLogsResponse {
  success: boolean;
  data: {
    current_page: number;
    data: AuditLog[];
    total: number;
    per_page: number;
    last_page: number;
    from: number;
    to: number;
  };
}

export interface AuditLogFilters {
  action?: string;
  actor_type?: string;
  actor_email?: string;
  record_type?: string;
  record_id?: number;
  status?: 'SUCCESS' | 'FAILED';
  date_from?: string;
  date_to?: string;
  per_page?: number;
  page?: number;
}