"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useOnboardingWizard } from "@/hooks/queries/useOnboarding";
import { OnboardingProgress } from "./onboarding-progress";
import { OnboardingHeader } from "./onboarding-header";
import { SuccessScreen } from "./success-screen";
import { AccountTypeStep } from "./steps/account-type-step";
import { PolicyPlanStep } from "./steps/policy-plan-step";
import { CompanySelectStep } from "./steps/company-select-step";
import { PersonalInfoStep } from "./steps/personal-info-step";
import { CompanyInfoStep } from "./steps/company-info-step";
import { BankInfoStep } from "./steps/bank-info-step";
import { IdentityInfoStep } from "./steps/identity-info-step";
import { DocumentUploadStep } from "./steps/document-upload-step";
import { BeneficiariesStep } from "./steps/beneficiaries-step";
import { ConsentStep } from "./steps/consent-step";
import { ReviewStep } from "./steps/review-step";

const steps = [
  { id: "account-type", title: "Account Type", icon: "👤" },
  { id: "policy-plan", title: "Policy Plan", icon: "📋" },
  { id: "company-select", title: "Select Company", icon: "🏢" },
  { id: "personal-info", title: "Personal Info", icon: "👤" },
  { id: "company-info", title: "Company Info", icon: "🏢" },
  { id: "bank-info", title: "Bank Details", icon: "🏦" },
  { id: "identity", title: "Identity", icon: "🆔" },
  { id: "documents", title: "Documents", icon: "📄" },
  { id: "beneficiaries", title: "Beneficiaries", icon: "👨‍👩‍👧" },
  { id: "consent", title: "Consent", icon: "✓" },
  { id: "review", title: "Review", icon: "🔍" },
];

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

  // Filter steps based on account type
  const getVisibleSteps = () => {
    if (!accountType) return steps.slice(0, 1);

    const visibleSteps = steps.filter((step) => {
      if (step.id === "account-type") return true;
      if (step.id === "policy-plan") return true;
      if (step.id === "company-select")
        return accountType === "employee-group-life";
      if (step.id === "personal-info")
        return (
          accountType === "individual" || accountType === "employee-group-life"
        );
      if (step.id === "company-info") return accountType === "corporate";
      if (step.id === "bank-info") return true;
      if (step.id === "identity") return true;
      if (step.id === "documents") return true;
      if (step.id === "beneficiaries")
        return accountType === "employee-group-life";
      if (step.id === "consent") return true;
      if (step.id === "review") return true;
      return false;
    });

    return visibleSteps;
  };

  const visibleSteps = getVisibleSteps();
  const currentStepIndex = visibleSteps.findIndex(
    (s) => s.id === steps[currentStep].id,
  );
  const progress = ((currentStepIndex + 1) / visibleSteps.length) * 100;

  if (isSuccess) {
    return <SuccessScreen accountType={accountType} />;
  }

  const renderStep = () => {
    const stepId = steps[currentStep].id;

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

      case "company-select":
        return (
          <CompanySelectStep
            onNext={handleNext}
            onBack={handleBack}
            onBoardingData={onboardingData}
            setOnBoardingData={setOnboardingData}
          />
        );

      case "personal-info":
        return (
          <PersonalInfoStep
            accountType={accountType}
            onNext={handleNext}
            onBack={handleBack}
            onBoardingData={onboardingData}
            setOnBoardingData={setOnboardingData}
          />
        );

      case "company-info":
        return (
          <CompanyInfoStep
            onNext={handleNext}
            onBack={handleBack}
            onBoardingData={onboardingData}
            setOnBoardingData={setOnboardingData}
          />
        );

      case "bank-info":
        return (
          <BankInfoStep
            accountType={accountType}
            onNext={handleNext}
            onBack={handleBack}
            onBoardingData={onboardingData}
            setOnBoardingData={setOnboardingData}
          />
        );

      case "identity":
        return (
          <IdentityInfoStep
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
        return null;
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
        {/* Step Indicator */}
        {/* {accountType && (
          <OnboardingProgress
            steps={visibleSteps}
            currentStep={currentStepIndex}
            accountType={accountType}
          />
        )} */}

        {/* Form Header */}
        <OnboardingHeader
          title={steps[currentStep].title}
          icon={steps[currentStep].icon}
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
