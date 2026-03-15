import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { IndividualService } from "@/services/individual.service";
import { toast } from "sonner";
import type { IndividualRegistrationFilters } from "@/types/individual.types";

export const individualKeys = {
  all: ["individual-registrations"] as const,
  lists: () => [...individualKeys.all, "list"] as const,
  list: (filters?: IndividualRegistrationFilters) =>
    [...individualKeys.lists(), { filters }] as const,
  pending: () => [...individualKeys.all, "pending"] as const,
  details: () => [...individualKeys.all, "detail"] as const,
  detail: (id: number) => [...individualKeys.details(), id] as const,
  stats: () => ["individual-stats"] as const,
};

/**
 * Get all individual registrations with filters
 */
export function useIndividualRegistrations(
  filters?: IndividualRegistrationFilters,
) {
  return useQuery({
    queryKey: individualKeys.list(filters),
    queryFn: async () => {
      const response = await IndividualService.getRegistrations(filters);
      if (!response.success) {
        throw new Error("Failed to fetch individual registrations");
      }
      return response;
    },
  });
}

/**
 * Get pending individual registrations
 */
export function usePendingIndividualRegistrations(per_page: number = 15) {
  return useQuery({
    queryKey: individualKeys.pending(),
    queryFn: async () => {
      const response =
        await IndividualService.getPendingRegistrations(per_page);
      if (!response.success) {
        throw new Error("Failed to fetch pending individual registrations");
      }
      return response;
    },
  });
}

/**
 * Get single individual registration
 */
export function useIndividualRegistration(id: number) {
  return useQuery({
    queryKey: individualKeys.detail(id),
    queryFn: async () => {
      const response = await IndividualService.getRegistration(id);
      if (!response.success) {
        throw new Error("Failed to fetch individual registration");
      }
      return response.data;
    },
    enabled: !!id,
  });
}

/**
 * Approve individual registration
 */
export function useApproveIndividualRegistration() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => IndividualService.approveRegistration(id),
    onSuccess: (response, id) => {
      if (response.success) {
        toast.success(response.message || "Registration approved successfully");
        queryClient.invalidateQueries({ queryKey: individualKeys.lists() });
        queryClient.invalidateQueries({ queryKey: individualKeys.detail(id) });
        queryClient.invalidateQueries({ queryKey: individualKeys.stats() });
      } else {
        toast.error(response.message || "Failed to approve registration");
      }
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to approve registration");
    },
  });
}

/**
 * Send invitation to individual
 */
export function useSendIndividualInvitation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, email }: { id: number; email?: string }) =>
      IndividualService.sendInvitation(id, email),
    onSuccess: (response, { id }) => {
      if (response.success) {
        toast.success(response.message || "Invitation sent successfully");
        queryClient.invalidateQueries({ queryKey: individualKeys.lists() });
        queryClient.invalidateQueries({ queryKey: individualKeys.detail(id) });
      } else {
        toast.error(response.message || "Failed to send invitation");
      }
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to send invitation");
    },
  });
}

/**
 * Verify individual registration
 */
export function useVerifyIndividualRegistration() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => IndividualService.verifyRegistration(id),
    onSuccess: (response, id) => {
      if (response.success) {
        toast.success(response.message || "Registration verified successfully");
        queryClient.invalidateQueries({ queryKey: individualKeys.lists() });
        queryClient.invalidateQueries({ queryKey: individualKeys.detail(id) });
        queryClient.invalidateQueries({ queryKey: individualKeys.stats() });
      } else {
        toast.error(response.message || "Failed to verify registration");
      }
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to verify registration");
    },
  });
}

/**
 * Reject individual registration
 */
export function useRejectIndividualRegistration() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: number;
      data: { rejection_reason: string };
    }) => IndividualService.rejectRegistration(id, data),
    onSuccess: (response, { id }) => {
      if (response.success) {
        toast.success(response.message || "Registration rejected");
        queryClient.invalidateQueries({ queryKey: individualKeys.lists() });
        queryClient.invalidateQueries({ queryKey: individualKeys.detail(id) });
        queryClient.invalidateQueries({ queryKey: individualKeys.stats() });
      } else {
        toast.error(response.message || "Failed to reject registration");
      }
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to reject registration");
    },
  });
}

/**
 * Export individual registrations to CSV
 */
export function useExportIndividualRegistrations() {
  return useMutation({
    mutationFn: (filters?: IndividualRegistrationFilters) =>
      IndividualService.exportRegistrations(filters),
    onSuccess: (data) => {
      const url = window.URL.createObjectURL(new Blob([data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute(
        "download",
        `individual-registrations-${new Date().toISOString().split("T")[0]}.csv`,
      );
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
      toast.success("Export completed successfully");
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to export data");
    },
  });
}

/**
 * Get individual registration statistics
 */
export function useIndividualStats() {
  return useQuery({
    queryKey: individualKeys.stats(),
    queryFn: async () => {
      const response = await IndividualService.getStats();
      if (!response.success) {
        throw new Error("Failed to fetch individual stats");
      }
      return response.data;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}
