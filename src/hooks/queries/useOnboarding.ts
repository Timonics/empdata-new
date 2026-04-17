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
import { cleanObject } from "@/lib/utils";

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
      const submissionData = { ...data, director_name: "Adebayo Nelson" };

      // Handle Director's BVN
      if (data.director_bvn_number) {
        try {
          const publicKey = await EncryptionService.getPublicKey();
          const encrypted = await EncryptionService.encryptBvn(
            publicKey,
            data.director_bvn_number,
          );
          submissionData.encrypted_bvn = encrypted.encrypted_bvn;
          delete submissionData.director_bvn_number;
        } catch (error) {
          toast.error("Failed to encrypt director's BVN");
          throw error;
        }
      }

      // Handle Director's NIN - ALWAYS encrypt and store
      if (
        data.identity_card_type === "National Identity Number" &&
        data.director_national_identification_number
      ) {
        try {
          const publicKey = await EncryptionService.getPublicKey();
          const encrypted = await EncryptionService.encryptNin(
            publicKey,
            data.director_national_identification_number,
          );

          // Store the encrypted NIN as 'encrypted_nin'
          submissionData.encrypted_nin = encrypted.encrypted_nin;
          delete submissionData.director_national_identification_number;

          // Track verification status for admin
          if (data.nin_verification_status === "pending_admin") {
            submissionData.nin_verification_pending = true;
          }
        } catch (error) {
          toast.error("Failed to encrypt director's NIN");
          throw error;
        }
      }

      // Handle CAC verification status
      if (data.cac_verification_status === "pending_admin") {
        submissionData.cac_verification_pending = true;
      }

      // Remove any undefined/null values
      const cleanedData = cleanObject(submissionData);
      const formData = buildFormData(cleanedData, "corporate");
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
      const submissionData = {
        ...data,
        selected_plan: "Employee Group Life Insurance Plan",
      };

      if (data.bvn_number) {
        try {
          const publicKey = await EncryptionService.getPublicKey();
          const encrypted = await EncryptionService.encryptBvn(
            publicKey,
            data.bvn_number,
          );
          submissionData.encrypted_bvn = encrypted.encrypted_bvn;
          delete submissionData.bvn_number;
        } catch (error) {
          toast.error("Failed to encrypt director's BVN");
          throw error;
        }
      }
      // Handle Employee NIN - ALWAYS encrypt and store
      if (
        data.identity_card_type === "National Identity Number" &&
        data.national_identification_number
      ) {
        try {
          const publicKey = await EncryptionService.getPublicKey();
          const encrypted = await EncryptionService.encryptNin(
            publicKey,
            data.national_identification_number,
          );

          // Store the encrypted NIN as 'encrypted_nin'
          submissionData.encrypted_nin = encrypted.encrypted_nin;
          delete submissionData.national_identification_number;

          // Track verification status for admin
          if (data.nin_verification_status === "pending_admin") {
            submissionData.nin_verification_pending = true;
          }
        } catch (error) {
          toast.error("Failed to encrypt NIN");
          throw error;
        }
      }

      // Remove any undefined/null values
      const cleanedData = cleanObject(submissionData);
      const formData = buildFormData(cleanedData, "employee-group-life");
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
export function useSubmitIndividualRegistration() {
  return useMutation({
    mutationFn: async (data: IndividualOnboardingData) => {
      const submissionData = { ...data };

      // Handle BVN
      if (data.bvn_number) {
        try {
          const publicKey = await EncryptionService.getPublicKey();
          const encrypted = await EncryptionService.encryptBvn(
            publicKey,
            data.bvn_number,
          );
          submissionData.encrypted_bvn = encrypted.encrypted_bvn;
          delete submissionData.bvn_number;
        } catch (error) {
          toast.error("Failed to encrypt BVN. Please try again.");
          throw error;
        }
      }

      // Handle NIN - ALWAYS encrypt and store
      if (
        data.identity_card_type === "National Identity Number" &&
        data.national_identification_number
      ) {
        try {
          const publicKey = await EncryptionService.getPublicKey();
          const encrypted = await EncryptionService.encryptNin(
            publicKey,
            data.national_identification_number,
          );

          // Store the encrypted NIN as 'encrypted_nin'
          submissionData.encrypted_nin = encrypted.encrypted_nin;
          delete submissionData.national_identification_number;

          // Track verification status for admin
          if (data.nin_verification_status === "pending_admin") {
            submissionData.nin_verification_pending = true;
          }
        } catch (error) {
          toast.error("Failed to encrypt NIN. Please try again.");
          throw error;
        }
      }

      // Remove any undefined/null values
      const cleanedData = cleanObject(submissionData);
      const formData = buildFormData(cleanedData, "individual");
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
      } else if (accountType === "employee-group-life") {
        await submitEmployee.mutateAsync(
          onboardingData as EmployeeGroupLifeOnboardingData,
        );
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
