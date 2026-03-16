"use client";

import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
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

export function OnboardingWizard() {
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

  console.log(selectedPlan);

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
        id: "company-info",
        title: "Company Information",
        icon: "🏢",
      });
    }

    // Add beneficiaries step only for employee group life
    // if (
    //   accountType === "corporate" &&
    //   selectedPlan === "Group Life Insurance Plan"
    // ) {
    //   steps.push({ id: "beneficiaries", title: "Beneficiaries", icon: "👨‍👩‍👧" });
    // }

    // Add documents step for all account types
    steps.push({ id: "documents", title: "Documents", icon: "📄" });

    steps.push({ id: "review", title: "Review", icon: "🔍" });

    return steps;
  };

  const steps = getSteps();
  const currentStepData = steps[currentStep] || steps[0];
  const progress = ((currentStep + 1) / steps.length) * 100;

  console.log("Account Type:", accountType);
  console.log(
    "All Steps:",
    steps.map((s) => s.id),
  );
  console.log("Current Step:", currentStep, currentStepData?.id);
  console.log("Progress:", progress);

  // Reset to first step when account type changes
  useEffect(() => {
    setCurrentStep(0);
  }, [accountType, setCurrentStep]);

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
        return (
          <InformationPage
            accountType={accountType}
            onNext={handleNext}
            onBack={handleBack}
            onBoardingData={onboardingData}
            setOnBoardingData={setOnboardingData}
          />
        );

      case "company-info":
        return (
          <InformationPage
            accountType={"corporate"}
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
          className="h-full bg-linear-to-r from-blue-600 to-emerald-600"
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
          stepNumber={currentStep + 1}
          totalSteps={steps.length}
          accountType={accountType}
        />

        {/* Form Steps */}
        <div className="mt-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
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
