import { useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { OnboardingService } from "@/services/onboarding.service";
import { EncryptionService } from "@/lib/encryption";
import { buildFormData } from "@/lib/form-data";
import { validateOnboardingData, validateFiles } from "@/lib/validation";
import { toast } from "sonner";
import {
  AccountType,
  IndividualOnboardingData,
  CompanyGroupLifeOnboardingData,
  EmployeeGroupLifeOnboardingData,
} from "@/types/onboarding.types";

export const onboardingKeys = {
  companies: ["active-companies"] as const,
};

/**
 * Hook to get active companies for employee dropdown
 */
export function useActiveCompanies() {
  return useQuery({
    queryKey: onboardingKeys.companies,
    queryFn: async () => {
      const response = await OnboardingService.getActiveCompanies();
      if (!response.success) {
        throw new Error("Failed to fetch companies");
      }
      return response.data;
    },
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
}

/**
 * Hook to submit company registration
 */
export function useSubmitCompanyRegistration() {
  return useMutation({
    mutationFn: async (data: CompanyGroupLifeOnboardingData) => {
      // Encrypt BVN
      const submissionData = { ...data };

      // Encrypt Director's NIN if applicable
      if (
        data.identity_card_type === "National Identity Number" &&
        data.director_national_identification_number
      ) {
        try {
          const encrypted = await EncryptionService.encryptNin(
            data.director_national_identification_number,
          );

          submissionData.nin_number_iv = encrypted.nin_number_iv;
          submissionData.nin_number_data = encrypted.nin_number_data;
          submissionData.nin_number_tag = encrypted.nin_number_tag;

          delete submissionData.director_national_identification_number;
        } catch (error) {
          toast.error("Failed to encrypt director's NIN");
          throw error;
        }
      }

      // Handle BVN similarly when implemented
      if (data.director_bvn_number) {
        // Will use EncryptionService.encryptBvn() when implemented
        delete submissionData.director_bvn_number; // Remove plain text for now
      }

      const formData = buildFormData(submissionData, "corporate");
      return await OnboardingService.submitCompanyRegistration(formData);
    },
    onSuccess: (response) => {
      if (response.success) {
        toast.success("Company registration submitted successfully!");
      } else {
        toast.error(response.message || "Failed to submit registration");
      }
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to submit registration");
    },
  });
}

/**
 * Hook to submit employee registration
 */
export function useSubmitEmployeeRegistration() {
  return useMutation({
    mutationFn: async (data: EmployeeGroupLifeOnboardingData) => {
      // Encrypt BVN
      if (data.bvn_number) {
        const encrypted = await encryptData(data.bvn_number);
        data.bvn_iv = encrypted.iv;
        data.bvn_data = encrypted.data;
        data.bvn_tag = encrypted.tag;
        delete data.bvn_number;
      }

      // Encrypt NIN if present
      if (
        data.identity_card_type === "National Identity Number" &&
        data.national_identification_number
      ) {
        const encrypted = await encryptData(
          data.national_identification_number,
        );
        data.nin_number_iv = encrypted.iv;
        data.nin_number_data = encrypted.data;
        data.nin_number_tag = encrypted.tag;
        delete data.national_identification_number;
      }

      const formData = buildFormData(data, "employee-group-life");
      return OnboardingService.submitEmployeeRegistration(formData);
    },
    onSuccess: (response) => {
      if (response.success) {
        toast.success("Employee registration submitted successfully!");
      } else {
        toast.error(response.message || "Failed to submit registration");
      }
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to submit registration");
    },
  });
}

/**
 * Hook to submit individual registration
 */
/**
 * Hook to submit individual registration
 */
export function useSubmitIndividualRegistration() {
  return useMutation({
    mutationFn: async (data: IndividualOnboardingData) => {
      // Create a copy of data to avoid mutating the original
      const submissionData = { ...data };

      // Encrypt BVN if present (you'll need to implement BVN encryption similarly)
      if (data.bvn_number) {
        // For now, handle BVN similarly or remove if not needed
        // You might need a separate BVN encryption function
        delete submissionData.bvn_number; // Remove plain text
      }

      // Encrypt NIN if present and identity type is National Identity Number
      if (
        data.identity_card_type === "National Identity Number" &&
        data.national_identification_number
      ) {
        try {
          // Encrypt the NIN using RSA
          const encrypted = await EncryptionService.encryptNin(
            data.national_identification_number,
          );

          // Add the encrypted fields to submission data
          submissionData.nin_number_iv = encrypted.nin_number_iv;
          submissionData.nin_number_data = encrypted.nin_number_data;
          submissionData.nin_number_tag = encrypted.nin_number_tag;

          // Remove plain text NIN
          delete submissionData.national_identification_number;
        } catch (error) {
          toast.error("Failed to encrypt NIN. Please try again.");
          throw error;
        }
      }

      // Build FormData and submit
      const formData = buildFormData(submissionData, "individual");
      return await OnboardingService.submitIndividualRegistration(formData);
    },
    onSuccess: (response) => {
      if (response.success) {
        toast.success("Individual registration submitted successfully!");
      } else {
        toast.error(response.message || "Failed to submit registration");
      }
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to submit registration");
    },
  });
}

/**
 * Main onboarding wizard hook
 */
export function useOnboardingWizard() {
  const [currentStep, setCurrentStep] = useState(0);
  const [accountType, setAccountType] = useState<AccountType | null>(null);
  const [selectedPlan, setSelectedPlan] = useState("");
  const [onboardingData, setOnboardingData] = useState<any>({});

  const submitCompany = useSubmitCompanyRegistration();
  const submitEmployee = useSubmitEmployeeRegistration();
  const submitIndividual = useSubmitIndividualRegistration();

  const handleNext = () => {
    setCurrentStep((prev) => prev + 1);

    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1);

      if (typeof window !== "undefined") {
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    }
  };

  const handleSubmit = async () => {
    if (!accountType) return;

    // Validate data
    if (!validateOnboardingData(accountType, onboardingData)) {
      toast.error("Please fill in all required fields");
      return;
    }

    const fileErrors = validateFiles(accountType, onboardingData);
    if (fileErrors.length > 0) {
      fileErrors.forEach((error) => toast.error(error));
      return;
    }

    try {
      if (accountType === "corporate") {
        await submitCompany.mutateAsync(
          onboardingData as CompanyGroupLifeOnboardingData,
        );
        // } else if (accountType === "employee-group-life") {
        //   await submitEmployee.mutateAsync(
        //     onboardingData as EmployeeGroupLifeOnboardingData,
        //   );
      } else {
        await submitIndividual.mutateAsync(
          onboardingData as IndividualOnboardingData,
        );
      }
    } catch (error) {
      throw error;
    }
  };

  const isLoading =
    submitCompany.isPending ||
    submitEmployee.isPending ||
    submitIndividual.isPending;
  const isSuccess =
    submitCompany.isSuccess ||
    submitEmployee.isSuccess ||
    submitIndividual.isSuccess;

  return {
    // State
    currentStep,
    setCurrentStep,
    accountType,
    setAccountType,
    selectedPlan,
    setSelectedPlan,
    onboardingData,
    setOnboardingData,
    isLoading,
    isSuccess,

    // Actions
    handleNext,
    handleBack,
    handleSubmit,
  };
}
