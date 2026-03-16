"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useSearchParams } from "next/navigation";
import { useOnboardingWizard } from "@/hooks/queries/useOnboarding";
import { OnboardingHeader } from "./onboarding-header";
import { SuccessScreen } from "./success-screen";
import { AccountTypeStep } from "./steps/account-type-step";
import { PolicyPlanStep } from "./steps/policy-plan-step";
import { CompanyInfoStep } from "./steps/company-info-step";
import { DocumentUploadStep } from "./steps/document-upload-step";
import { BeneficiariesStep } from "./steps/beneficiaries-step";
import { ConsentStep } from "./steps/consent-step";
import { ReviewStep } from "./steps/review-step";
import { InformationPage } from "./steps/Information-page-step";
import type { AccountType } from "@/types/onboarding.types";

export function OnboardingWizard() {
  const searchParams = useSearchParams();
  const urlType = searchParams.get("type") as AccountType | null;
  
  const [initialized, setInitialized] = useState(false);

  const {
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
    handleNext,
    handleBack,
    handleSubmit,
  } = useOnboardingWizard();

  // Handle URL parameter for employee-group-life
  useEffect(() => {
    if (urlType === "employee-group-life" && !initialized) {
      // Set account type
      setAccountType("employee-group-life");
      
      // Set default plan to group life
      setSelectedPlan("Group Life Insurance Plan");
      
      // Skip to consent step (index 1 since account-type is step 0)
      setCurrentStep(1);
      
      setInitialized(true);
    } else if (urlType && !initialized) {
      // Handle other direct types if needed
      setAccountType(urlType);
      setInitialized(true);
    }
  }, [urlType, initialized, setAccountType, setSelectedPlan, setCurrentStep]);

  // Define steps based on account type
  const getSteps = () => {
    // Base steps that are always shown
    const baseSteps = [
      { id: "account-type", title: "Register your account", icon: "👤" },
    ];

    // If no account type selected yet, only show account type step
    if (!accountType) {
      return baseSteps;
    }

    // Build steps based on account type
    const steps = [...baseSteps];

    steps.push({ id: "consent", title: "Consent", icon: "✓" });

    // Add policy plan step for all account types
    steps.push({ id: "policy-plan", title: "Policy Plan", icon: "📋" });

    // Add type-specific steps
    if (accountType === "individual") {
      steps.push({
        id: "information",
        title: "Personal Information",
        icon: "👤",
      });
    }

    if (accountType === "corporate") {
      steps.push({
        id: "information",
        title: "Company Information",
        icon: "🏢",
      });
    }

    if (accountType === "employee-group-life") {
      steps.push({
        id: "information",
        title: "Personal Information",
        icon: "👤",
      });
    }

    // Add beneficiaries step only for employee group life
    if (accountType === "employee-group-life") {
      steps.push({ id: "beneficiaries", title: "Beneficiaries", icon: "👨‍👩‍👧" });
    }

    // Add documents step for all account types
    steps.push({ id: "documents", title: "Documents", icon: "📄" });

    steps.push({ id: "review", title: "Review", icon: "🔍" });

    return steps;
  };

  const steps = getSteps();
  
  // Ensure current step is within bounds
  const safeCurrentStep = Math.min(currentStep, steps.length - 1);
  const currentStepData = steps[safeCurrentStep] || steps[0];
  const progress = ((safeCurrentStep + 1) / steps.length) * 100;

  console.log("URL Type:", urlType);
  console.log("Account Type:", accountType);
  console.log("Selected Plan:", selectedPlan);
  console.log(
    "All Steps:",
    steps.map((s) => s.id),
  );
  console.log("Current Step:", safeCurrentStep, currentStepData?.id);
  console.log("Progress:", progress);

  // Reset to first step when account type changes (but not from URL init)
  useEffect(() => {
    if (!urlType) {
      setCurrentStep(0);
    }
  }, [accountType, setCurrentStep, urlType]);

  if (isSuccess) {
    return <SuccessScreen accountType={accountType} />;
  }

  const renderStep = () => {
    const stepId = currentStepData?.id;

    switch (stepId) {
      case "account-type":
        return (
          <AccountTypeStep
            accountType={accountType}
            setAccountType={setAccountType}
            onNext={handleNext}
            onBoardingData={onboardingData}
            setOnBoardingData={setOnboardingData}
          />
        );

      case "policy-plan":
        return (
          <PolicyPlanStep
            accountType={accountType}
            selectedPlan={selectedPlan}
            setSelectedPlan={setSelectedPlan}
            onNext={handleNext}
            onBack={handleBack}
            onBoardingData={onboardingData}
            setOnBoardingData={setOnboardingData}
          />
        );

      case "information":
        // Information page handles different account types internally
        return (
          <InformationPage
            accountType={accountType}
            onNext={handleNext}
            onBack={handleBack}
            onBoardingData={onboardingData}
            setOnBoardingData={setOnboardingData}
          />
        );

      case "documents":
        return (
          <DocumentUploadStep
            accountType={accountType}
            onNext={handleNext}
            onBack={handleBack}
            onBoardingData={onboardingData}
            setOnBoardingData={setOnboardingData}
          />
        );

      case "beneficiaries":
        return (
          <BeneficiariesStep
            onNext={handleNext}
            onBack={handleBack}
            onBoardingData={onboardingData}
            setOnBoardingData={setOnboardingData}
          />
        );

      case "consent":
        return (
          <ConsentStep
            onNext={handleNext}
            onBack={handleBack}
            onBoardingData={onboardingData}
            setOnBoardingData={setOnboardingData}
          />
        );

      case "review":
        return (
          <ReviewStep
            accountType={accountType}
            onBack={handleBack}
            onSubmit={handleSubmit}
            isSubmitting={isLoading}
            onBoardingData={onboardingData}
          />
        );

      default:
        return <div>Unknown step</div>;
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden">
      {/* Progress Bar */}
      <div className="h-2 bg-gray-100">
        <motion.div
          className="h-full bg-gradient-to-r from-blue-600 to-emerald-600"
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.3 }}
        />
      </div>

      <div className="p-6 md:p-8">
        {/* Form Header */}
        <OnboardingHeader
          title={currentStepData?.title || "Onboarding"}
          icon={currentStepData?.icon || "📝"}
          stepNumber={safeCurrentStep + 1}
          totalSteps={steps.length}
          accountType={accountType}
        />

        {/* Form Steps */}
        <div className="mt-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={safeCurrentStep}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              {renderStep()}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}