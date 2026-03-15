import { useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { OnboardingService } from "@/services/onboarding.service";
import { encryptData } from "@/lib/encryption";
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
      if (data.director_bvn_number) {
        const encrypted = await encryptData(data.director_bvn_number);
        data.director_bvn_iv = encrypted.iv;
        data.director_bvn_data = encrypted.data;
        data.director_bvn_tag = encrypted.tag;
        delete data.director_bvn_number;
      }

      // Encrypt NIN if present
      if (
        data.identity_card_type === "National Identity Number" &&
        data.director_national_identification_number
      ) {
        const encrypted = await encryptData(
          data.director_national_identification_number,
        );
        data.nin_number_iv = encrypted.iv;
        data.nin_number_data = encrypted.data;
        data.nin_number_tag = encrypted.tag;
        delete data.director_national_identification_number;
      }

      const formData = buildFormData(data, "corporate");
      return OnboardingService.submitCompanyRegistration(formData);
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
export function useSubmitIndividualRegistration() {
  return useMutation({
    mutationFn: async (data: IndividualOnboardingData) => {
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

      const formData = buildFormData(data, "individual");
      return OnboardingService.submitIndividualRegistration(formData);
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
