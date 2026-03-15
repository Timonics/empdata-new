import { useQuery } from '@tanstack/react-query';
import { PortalDashboardService } from '@/services/portal.service';

export const dashboardKeys = {
  all: ['portal-dashboard'] as const,
  profile: () => [...dashboardKeys.all, 'profile'] as const,
  stats: () => [...dashboardKeys.all, 'stats'] as const,
  recentEmployees: () => [...dashboardKeys.all, 'recent-employees'] as const,
  pendingInvitations: () => [...dashboardKeys.all, 'pending-invitations'] as const,
};

/**
 * Get company profile
 */
export function useCompanyProfile() {
  return useQuery({
    queryKey: dashboardKeys.profile(),
    queryFn: async () => {
      const response = await PortalDashboardService.getCompanyProfile();
      if (!response.success) {
        throw new Error('Failed to fetch company profile');
      }
      return response.data;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

/**
 * Get dashboard stats
 */
export function useDashboardStats() {
  return useQuery({
    queryKey: dashboardKeys.stats(),
    queryFn: async () => {
      const response = await PortalDashboardService.getDashboardStats();
      if (!response.success) {
        throw new Error('Failed to fetch dashboard stats');
      }
      return response.data;
    },
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
}

/**
 * Get recent employees
 */
export function useRecentEmployees() {
  return useQuery({
    queryKey: dashboardKeys.recentEmployees(),
    queryFn: async () => {
      const response = await PortalDashboardService.getRecentEmployees();
      if (!response.success) {
        throw new Error('Failed to fetch recent employees');
      }
      return response.data;
    },
    staleTime: 1 * 60 * 1000, // 1 minute
  });
}

/**
 * Get pending invitations
 */
export function usePendingInvitations() {
  return useQuery({
    queryKey: dashboardKeys.pendingInvitations(),
    queryFn: async () => {
      const response = await PortalDashboardService.getPendingInvitations();
      if (!response.success) {
        throw new Error('Failed to fetch pending invitations');
      }
      return response.data;
    },
    staleTime: 1 * 60 * 1000, // 1 minute
  });
}