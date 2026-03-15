import { useQuery, useMutation } from "@tanstack/react-query";
import { GroupLifeService } from "@/services/grouplife.service";
import { toast } from "sonner";

export const publicKeys = {
  companies: ["public-companies"] as const,
};

/**
 * Get active companies for employee selection (public)
 */
export function usePublicCompanies() {
  return useQuery({
    queryKey: publicKeys.companies,
    queryFn: async () => {
      const response = await GroupLifeService.getPublicCompanies();
      if (!response.success) {
        throw new Error("Failed to fetch companies");
      }
      return response.data;
    },
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
}

/**
 * Submit employee registration (public)
 */
export function useSubmitEmployeeRegistration() {
  return useMutation({
    mutationFn: (formData: FormData) =>
      GroupLifeService.submitEmployeeRegistration(formData),
    onSuccess: (response) => {
      if (response.success) {
        toast.success(
          response.message || "Registration submitted successfully",
        );
      } else {
        toast.error(response.message || "Failed to submit registration");
      }
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to submit registration");
    },
  });
}
