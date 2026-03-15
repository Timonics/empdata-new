import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { GroupLifeService } from "@/services/grouplife.service";
import { toast } from "sonner";
import type {
  RegistrationFilters,
  SendInvitationRequest,
  RejectRegistrationRequest,
} from "@/types/grouplife.types";

export const companyRegistrationKeys = {
  all: ["company-registrations"] as const,
  lists: () => [...companyRegistrationKeys.all, "list"] as const,
  list: (filters?: RegistrationFilters) =>
    [...companyRegistrationKeys.lists(), { filters }] as const,
  pending: () => [...companyRegistrationKeys.all, "pending"] as const,
  details: () => [...companyRegistrationKeys.all, "detail"] as const,
  detail: (id: number) => [...companyRegistrationKeys.details(), id] as const,
};

/**
 * Get all company registrations with filters
 */
export function useCompanyRegistrations(
  filters?: RegistrationFilters,
  page: number = 1,
) {
  return useQuery({
    queryKey: [...companyRegistrationKeys.list(filters), "page", page],
    queryFn: async () => {
      const response = await GroupLifeService.getCompanyRegistrations({
        ...filters,
        page,
        per_page: filters?.per_page || 15,
      });
      return response;
    },
  });
}

/**
 * Get pending company registrations
 */
export function usePendingCompanyRegistrations(per_page: number = 15) {
  return useQuery({
    queryKey: companyRegistrationKeys.pending(),
    queryFn: async () => {
      const response =
        await GroupLifeService.getPendingCompanyRegistrations(per_page);
      if (!response.success) {
        throw new Error("Failed to fetch pending company registrations");
      }
      return response;
    },
  });
}

/**
 * Get single company registration
 */
export function useCompanyRegistration(id: number) {
  return useQuery({
    queryKey: companyRegistrationKeys.detail(id),
    queryFn: async () => {
      const response = await GroupLifeService.getCompanyRegistration(id);
      if (!response.success) {
        throw new Error("Failed to fetch company registration");
      }
      return response.data;
    },
    enabled: !!id,
  });
}

/**
 * Approve company registration
 */
export function useApproveCompanyRegistration() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => GroupLifeService.approveCompanyRegistration(id),
    onSuccess: (response, id) => {
      if (response.success) {
        toast.success(response.message || "Company registration approved");
        queryClient.invalidateQueries({
          queryKey: companyRegistrationKeys.lists(),
        });
        queryClient.invalidateQueries({
          queryKey: companyRegistrationKeys.detail(id),
        });
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
 * Send invitation to company
 */
export function useSendCompanyInvitation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data?: SendInvitationRequest }) =>
      GroupLifeService.sendCompanyInvitation(id, data),
    onSuccess: (response, { id }) => {
      if (response.success) {
        toast.success(response.message || "Invitation sent successfully");
        queryClient.invalidateQueries({
          queryKey: companyRegistrationKeys.lists(),
        });
        queryClient.invalidateQueries({
          queryKey: companyRegistrationKeys.detail(id),
        });
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
 * Reject company registration
 */
export function useRejectCompanyRegistration() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: number;
      data: RejectRegistrationRequest;
    }) => GroupLifeService.rejectCompanyRegistration(id, data),
    onSuccess: (response, { id }) => {
      if (response.success) {
        toast.success("Company registration rejected");
        queryClient.invalidateQueries({
          queryKey: companyRegistrationKeys.lists(),
        });
        queryClient.invalidateQueries({
          queryKey: companyRegistrationKeys.detail(id),
        });
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
 * Export company registrations to CSV
 */
export function useExportCompanyRegistrations() {
  return useMutation({
    mutationFn: (filters?: RegistrationFilters) =>
      GroupLifeService.exportCompanyRegistrations(filters),
    onSuccess: (data) => {
      // Create download link
      const url = window.URL.createObjectURL(new Blob([data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute(
        "download",
        `company-registrations-${new Date().toISOString().split("T")[0]}.csv`,
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
 * Bulk upload company registrations
 */
export function useBulkUploadCompanies() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (formData: FormData) =>
      GroupLifeService.bulkUploadCompanies(formData),
    onSuccess: (response) => {
      if (response.success) {
        toast.success(response.message || "Bulk upload completed");
        queryClient.invalidateQueries({
          queryKey: companyRegistrationKeys.lists(),
        });
      } else {
        toast.error(response.message || "Bulk upload failed");
      }
    },
    onError: (error: any) => {
      toast.error(error.message || "Bulk upload failed");
    },
  });
}
