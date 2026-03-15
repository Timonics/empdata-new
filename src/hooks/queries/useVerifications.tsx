import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { VerificationService } from "@/services/verification.service";
import { toast } from "sonner";

export const verificationKeys = {
  all: ["verifications"] as const,
  companies: () => [...verificationKeys.all, "companies"] as const,
  employees: () => [...verificationKeys.all, "employees"] as const,
  documents: (type: string, id: number) =>
    [...verificationKeys.all, "documents", type, id] as const,
};

/**
 * Get company registrations for verification
 */
export function useCompanyVerifications(filters?: any) {
  return useQuery({
    queryKey: [...verificationKeys.companies(), { filters }],
    queryFn: async () => {
      const response =
        await VerificationService.getCompanyRegistrations(filters);
      if (!response.success) {
        throw new Error("Failed to fetch company verifications");
      }
      return response;
    },
  });
}

/**
 * Get employee registrations for NIN verification
 */
export function useEmployeeVerifications(filters?: any) {
  return useQuery({
    queryKey: [...verificationKeys.employees(), { filters }],
    queryFn: async () => {
      const response =
        await VerificationService.getEmployeeRegistrations(filters);
      if (!response.success) {
        throw new Error("Failed to fetch employee verifications");
      }
      return response;
    },
  });
}

/**
 * Verify NIN mutation
 */
export function useVerifyNIN() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => VerificationService.verifyNIN(id),
    onSuccess: (response) => {
      if (response.success) {
        toast.success("NIN verified successfully");
        queryClient.invalidateQueries({
          queryKey: verificationKeys.employees(),
        });
      } else {
        toast.error(response.message || "Failed to verify NIN");
      }
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to verify NIN");
    },
  });
}

/**
 * Reject NIN mutation
 */
export function useRejectNIN() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, reason }: { id: number; reason: string }) =>
      VerificationService.rejectNIN(id, reason),
    onSuccess: (response) => {
      if (response.success) {
        toast.success("NIN rejected");
        queryClient.invalidateQueries({
          queryKey: verificationKeys.employees(),
        });
      } else {
        toast.error(response.message || "Failed to reject NIN");
      }
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to reject NIN");
    },
  });
}

/**
 * Verify document mutation
 */
export function useVerifyDocument() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      type,
      id,
      documentType,
    }: {
      type: "company" | "employee";
      id: number;
      documentType: string;
    }) => VerificationService.verifyDocument(type, id, documentType),
    onSuccess: (response) => {
      if (response.success) {
        toast.success("Document verified successfully");
        queryClient.invalidateQueries({
          queryKey: verificationKeys.companies(),
        });
        queryClient.invalidateQueries({
          queryKey: verificationKeys.employees(),
        });
      } else {
        toast.error(response.message || "Failed to verify document");
      }
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to verify document");
    },
  });
}

/**
 * Reject document mutation
 */
export function useRejectDocument() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      type,
      id,
      documentType,
      reason,
    }: {
      type: "company" | "employee";
      id: number;
      documentType: string;
      reason: string;
    }) => VerificationService.rejectDocument(type, id, documentType, reason),
    onSuccess: (response) => {
      if (response.success) {
        toast.success("Document rejected");
        queryClient.invalidateQueries({
          queryKey: verificationKeys.companies(),
        });
        queryClient.invalidateQueries({
          queryKey: verificationKeys.employees(),
        });
      } else {
        toast.error(response.message || "Failed to reject document");
      }
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to reject document");
    },
  });
}
