import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { GroupLifeService } from "@/services/grouplife.service";
import { toast } from "sonner";
import type {
  RegistrationFilters,
  SendInvitationRequest,
  RejectRegistrationRequest,
} from "@/types/grouplife.types";

export const employeeRegistrationKeys = {
  all: ["employee-registrations"] as const,
  lists: () => [...employeeRegistrationKeys.all, "list"] as const,
  list: (filters?: RegistrationFilters) =>
    [...employeeRegistrationKeys.lists(), { filters }] as const,
  pending: () => [...employeeRegistrationKeys.all, "pending"] as const,
  details: () => [...employeeRegistrationKeys.all, "detail"] as const,
  detail: (id: number) => [...employeeRegistrationKeys.details(), id] as const,
};

/**
 * Get all employee registrations with filters
 */
export function useEmployeeRegistrations(
  filters?: RegistrationFilters,
  page: number = 1,
) {
  return useQuery({
    queryKey: employeeRegistrationKeys.list({
      ...filters,
      page,
      per_page: filters?.per_page || 15,
    }),
    queryFn: async () => {
      const response = await GroupLifeService.getEmployeeRegistrations(filters);
      if (!response.success) {
        throw new Error("Failed to fetch employee registrations");
      }
      return response;
    },
  });
}

/**
 * Get pending employee registrations
 */
export function usePendingEmployeeRegistrations(per_page: number = 15) {
  return useQuery({
    queryKey: employeeRegistrationKeys.pending(),
    queryFn: async () => {
      const response =
        await GroupLifeService.getPendingEmployeeRegistrations(per_page);
      if (!response.success) {
        throw new Error("Failed to fetch pending employee registrations");
      }
      return response;
    },
  });
}

/**
 * Get single employee registration
 */
export function useEmployeeRegistration(id: number) {
  return useQuery({
    queryKey: employeeRegistrationKeys.detail(id),
    queryFn: async () => {
      const response = await GroupLifeService.getEmployeeRegistration(id);
      if (!response.success) {
        throw new Error("Failed to fetch employee registration");
      }
      return response.data;
    },
    enabled: !!id,
  });
}

/**
 * Approve employee registration
 */
export function useApproveEmployeeRegistration() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) =>
      GroupLifeService.approveEmployeeRegistration(id),
    onSuccess: (response, id) => {
      if (response.success) {
        toast.success(response.message || "Employee registration approved");
        queryClient.invalidateQueries({
          queryKey: employeeRegistrationKeys.lists(),
        });
        queryClient.invalidateQueries({
          queryKey: employeeRegistrationKeys.detail(id),
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
 * Send invitation to employee
 */
export function useSendEmployeeInvitation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data?: SendInvitationRequest }) =>
      GroupLifeService.sendEmployeeInvitation(id, data),
    onSuccess: (response, { id }) => {
      if (response.success) {
        toast.success(response.message || "Invitation sent successfully");
        queryClient.invalidateQueries({
          queryKey: employeeRegistrationKeys.lists(),
        });
        queryClient.invalidateQueries({
          queryKey: employeeRegistrationKeys.detail(id),
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
 * Reject employee registration
 */
export function useRejectEmployeeRegistration() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: number;
      data: RejectRegistrationRequest;
    }) => GroupLifeService.rejectEmployeeRegistration(id, data),
    onSuccess: (response, { id }) => {
      if (response.success) {
        toast.success("Employee registration rejected");
        queryClient.invalidateQueries({
          queryKey: employeeRegistrationKeys.lists(),
        });
        queryClient.invalidateQueries({
          queryKey: employeeRegistrationKeys.detail(id),
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
 * Export employee registrations to CSV
 */
export function useExportEmployeeRegistrations() {
  return useMutation({
    mutationFn: (filters?: RegistrationFilters) =>
      GroupLifeService.exportEmployeeRegistrations(filters),
    onSuccess: (data) => {
      const url = window.URL.createObjectURL(new Blob([data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute(
        "download",
        `employee-registrations-${new Date().toISOString().split("T")[0]}.csv`,
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
 * Bulk upload employee registrations
 */
export function useBulkUploadEmployees() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (formData: FormData) =>
      GroupLifeService.bulkUploadEmployees(formData),
    onSuccess: (response) => {
      if (response.success) {
        toast.success(response.message || "Bulk upload completed");
        queryClient.invalidateQueries({
          queryKey: employeeRegistrationKeys.lists(),
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
