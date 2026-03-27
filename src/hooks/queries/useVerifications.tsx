import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { VerificationService } from "@/services/verification.service";
import { toast } from "sonner";
import { EncryptedNIN, NINResponse } from "@/types/onboarding.types";

export const verificationKeys = {
  all: ["verifications"] as const,
  allNIN: () => [...verificationKeys.all, "all-nin"] as const,
  companies: () => [...verificationKeys.all, "companies"] as const,
  employees: () => [...verificationKeys.all, "employees"] as const,
  individuals: () => [...verificationKeys.all, "individuals"] as const,
  public: () => [...verificationKeys.all, "public"] as const,
  documents: (type: string, id: number) =>
    [...verificationKeys.all, "documents", type, id] as const,
};

/**
 * Get all NIN verifications across all registration types
 */
export function useAllNINVerifications(filters?: {
  status?: string;
  from_date?: string;
  to_date?: string;
}) {
  return useQuery({
    queryKey: [...verificationKeys.allNIN(), { filters }],
    queryFn: async () => {
      const response =
        await VerificationService.getAllNINVerifications(filters);
      if (!response.success) {
        throw new Error("Failed to fetch NIN verifications");
      }
      return response;
    },
  });
}

/**
 * Verify NIN for a specific registration type
 */
export function useVerifyRegistrationNIN() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      type,
      id,
    }: {
      type: "company" | "employee" | "individual";
      id: number;
    }) => VerificationService.verifyRegistrationNIN(type, id),
    onSuccess: (response) => {
      if (response.success) {
        toast.success("NIN verified successfully");
        queryClient.invalidateQueries({ queryKey: verificationKeys.allNIN() });
        queryClient.invalidateQueries({
          queryKey: verificationKeys.companies(),
        });
        queryClient.invalidateQueries({
          queryKey: verificationKeys.employees(),
        });
        queryClient.invalidateQueries({
          queryKey: verificationKeys.individuals(),
        });
      } else {
        toast.error(response.message || "Failed to verify NIN");
      }
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to verify NIN");
    },
  });
}

/**
 * Reject NIN for a specific registration type
 */
export function useRejectRegistrationNIN() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      type,
      id,
      reason,
    }: {
      type: "company" | "employee" | "individual";
      id: number;
      reason: string;
    }) => VerificationService.rejectRegistrationNIN(type, id, reason),
    onSuccess: (response) => {
      if (response.success) {
        toast.success("NIN rejected successfully");
        queryClient.invalidateQueries({ queryKey: verificationKeys.allNIN() });
        queryClient.invalidateQueries({
          queryKey: verificationKeys.companies(),
        });
        queryClient.invalidateQueries({
          queryKey: verificationKeys.employees(),
        });
        queryClient.invalidateQueries({
          queryKey: verificationKeys.individuals(),
        });
      } else {
        toast.error(response.message || "Failed to reject NIN");
      }
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to reject NIN");
    },
  });
}

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
 * Verify Public NIN (for onboarding)
 */
export function usePublicVerifyNIN() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (encryptedData: EncryptedNIN) =>
      VerificationService.verifyPublicNIN(encryptedData),
    onSuccess: (response: NINResponse) => {
      if (response.success) {
        toast.success("NIN verified successfully");
        queryClient.invalidateQueries({ queryKey: verificationKeys.public() });
      } else {
        toast.error("Failed to verify NIN");
      }
    },
    onError: (error) => {
      toast.error("NIN verification failed");
    },
  });
}

/**
 * Get employee registrations for NIN verification (Admin)
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
 * Verify Employee Registration (Admin)
 * POST /api/admin/grouplife/employee-registrations/{id}/verify
 */
export function useVerifyEmployeeRegistration() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) =>
      VerificationService.verifyEmployeeRegistration(id),
    onSuccess: (response) => {
      if (response.success) {
        toast.success("Employee registration verified successfully");
        queryClient.invalidateQueries({
          queryKey: verificationKeys.employees(),
        });
      } else {
        toast.error(response.message || "Failed to verify registration");
      }
    },
    onError: (error: any) => {
      toast.error(
        error.response?.data?.message || "Failed to verify registration",
      );
    },
  });
}

/**
 * Reject Employee Registration (Admin)
 * POST /api/admin/grouplife/employee-registrations/{id}/reject
 */
export function useRejectEmployeeRegistration() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, reason }: { id: number; reason: string }) =>
      VerificationService.rejectEmployeeRegistration(id, reason),
    onSuccess: (response) => {
      if (response.success) {
        toast.success("Employee registration rejected");
        queryClient.invalidateQueries({
          queryKey: verificationKeys.employees(),
        });
      } else {
        toast.error(response.message || "Failed to reject registration");
      }
    },
    onError: (error: any) => {
      toast.error(
        error.response?.data?.message || "Failed to reject registration",
      );
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
