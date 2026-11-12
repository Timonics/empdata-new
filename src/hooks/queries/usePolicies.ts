import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { PolicyService } from "@/services/policy.service";
import { toast } from "sonner";
import type {
  PolicyFilters,
  CreatePolicyData,
  UpdatePolicyData,
} from "@/types/policy.types";

export const policyKeys = {
  all: ["policies"] as const,
  lists: () => [...policyKeys.all, "list"] as const,
  list: (filters?: PolicyFilters) => [...policyKeys.lists(), { filters }] as const,
  details: () => [...policyKeys.all, "detail"] as const,
  detail: (id: number) => [...policyKeys.details(), id] as const,
};

/**
 * Get policies with filters and pagination
 */
export function usePolicies(filters?: PolicyFilters) {
  return useQuery({
    queryKey: policyKeys.list(filters),
    queryFn: async () => {
      const response = await PolicyService.getPolicies(filters);
      if (!response.success) {
        throw new Error("Failed to fetch policies");
      }
      return response;
    },
  });
}

/**
 * Get single policy
 */
export function usePolicy(id: number) {
  return useQuery({
    queryKey: policyKeys.detail(id),
    queryFn: async () => {
      const response = await PolicyService.getPolicy(id);
      if (!response.success) {
        throw new Error("Failed to fetch policy");
      }
      return response.data;
    },
    enabled: !!id,
  });
}

/**
 * Create policy
 */
export function useCreatePolicy() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreatePolicyData) => PolicyService.createPolicy(data),
    onSuccess: (response) => {
      if (response.success) {
        toast.success("Policy created successfully");
        queryClient.invalidateQueries({ queryKey: policyKeys.lists() });
      } else {
        toast.error("Failed to create policy");
      }
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to create policy");
    },
  });
}

/**
 * Update policy
 */
export function useUpdatePolicy() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdatePolicyData }) =>
      PolicyService.updatePolicy(id, data),
    onSuccess: (response, variables) => {
      if (response.success) {
        toast.success("Policy updated successfully");
        queryClient.invalidateQueries({ queryKey: policyKeys.lists() });
        queryClient.invalidateQueries({
          queryKey: policyKeys.detail(variables.id),
        });
      } else {
        toast.error("Failed to update policy");
      }
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to update policy");
    },
  });
}

/**
 * Delete policy
 */
export function useDeletePolicy() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => PolicyService.deletePolicy(id),
    onSuccess: (response) => {
      if (response.success) {
        toast.success("Policy deleted successfully");
        queryClient.invalidateQueries({ queryKey: policyKeys.lists() });
      } else {
        toast.error(response.message || "Failed to delete policy");
      }
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to delete policy");
    },
  });
}
