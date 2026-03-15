import { useQuery, useQueryClient } from "@tanstack/react-query";
import { AnalyticsService } from "@/services/analytics.service";
import { toast } from "sonner";

export const analyticsKeys = {
  all: ["analytics"] as const,
  monthlyEmployees: () => [...analyticsKeys.all, "monthly-employees"] as const,
  monthlyCompanies: () => [...analyticsKeys.all, "monthly-companies"] as const,
  statusSummary: () => [...analyticsKeys.all, "status-summary"] as const,
  currentWeek: () => [...analyticsKeys.all, "current-week"] as const,
  recentRegistrations: (hours?: number) =>
    [...analyticsKeys.all, "recent", hours] as const,
};

/**
 * Hook to get monthly employee registrations
 */
export function useMonthlyEmployeeRegistrations() {
  return useQuery({
    queryKey: analyticsKeys.monthlyEmployees(),
    queryFn: async () => {
      const response = await AnalyticsService.getMonthlyEmployeeRegistrations();
      if (!response.success) {
        throw new Error("Failed to fetch monthly employee registrations");
      }
      return response.data;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

/**
 * Hook to get monthly company registrations with status breakdown
 */
export function useMonthlyCompanyRegistrations() {
  return useQuery({
    queryKey: analyticsKeys.monthlyCompanies(),
    queryFn: async () => {
      const response = await AnalyticsService.getMonthlyCompanyRegistrations();
      if (!response.success) {
        throw new Error("Failed to fetch monthly company registrations");
      }
      return response.data;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

/**
 * Hook to get registration status summary
 */
export function useRegistrationStatusSummary() {
  return useQuery({
    queryKey: analyticsKeys.statusSummary(),
    queryFn: async () => {
      const response = await AnalyticsService.getRegistrationStatusSummary();
      if (!response.success) {
        throw new Error("Failed to fetch registration status summary");
      }
      return response.data;
    },
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
}

/**
 * Hook to get current week data
 */
export function useCurrentWeekData() {
  return useQuery({
    queryKey: analyticsKeys.currentWeek(),
    queryFn: async () => {
      const response = await AnalyticsService.getCurrentWeekData();
      if (!response.success) {
        throw new Error("Failed to fetch current week data");
      }
      return response.data;
    },
    staleTime: 60 * 1000, // 1 minute
  });
}

/**
 * Hook to get recent registrations
 * @param hours Number of hours to look back (1-168)
 */
export function useRecentRegistrations(hours: number = 7) {
  return useQuery({
    queryKey: analyticsKeys.recentRegistrations(hours),
    queryFn: async () => {
      const response = await AnalyticsService.getRecentRegistrations(hours);
      if (!response.success) {
        throw new Error("Failed to fetch recent registrations");
      }
      return response.data;
    },
    staleTime: 30 * 1000, // 30 seconds (more frequent updates)
  });
}

/**
 * Hook to refresh all analytics data
 */
export function useRefreshAnalytics() {
  const queryClient = useQueryClient();

  const refresh = () => {
    queryClient.invalidateQueries({ queryKey: analyticsKeys.all });
    toast.success("Analytics data refreshed");
  };

  return { refresh };
}

// Helper hooks for dashboard components
export function useDashboardStats() {
  const monthlyEmployees = useMonthlyEmployeeRegistrations();
  const monthlyCompanies = useMonthlyCompanyRegistrations();
  const statusSummary = useRegistrationStatusSummary();
  const currentWeek = useCurrentWeekData();
  const recentRegistrations = useRecentRegistrations(24); // Last 24 hours

  const isLoading =
    monthlyEmployees.isLoading ||
    monthlyCompanies.isLoading ||
    statusSummary.isLoading ||
    currentWeek.isLoading ||
    recentRegistrations.isLoading;

  const error =
    monthlyEmployees.error ||
    monthlyCompanies.error ||
    statusSummary.error ||
    currentWeek.error ||
    recentRegistrations.error;

  return {
    // Data
    monthlyEmployees: monthlyEmployees.data,
    monthlyCompanies: monthlyCompanies.data,
    statusSummary: statusSummary.data,
    currentWeek: currentWeek.data,
    recentRegistrations: recentRegistrations.data,

    // Loading states
    isLoading,
    error,

    // Individual loading states
    isLoadingMonthlyEmployees: monthlyEmployees.isLoading,
    isLoadingMonthlyCompanies: monthlyCompanies.isLoading,
    isLoadingStatusSummary: statusSummary.isLoading,
    isLoadingCurrentWeek: currentWeek.isLoading,
    isLoadingRecent: recentRegistrations.isLoading,
  };
}
