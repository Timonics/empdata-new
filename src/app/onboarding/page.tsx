import { Metadata } from "next";
import { OnboardingWizard } from "@/components/onboarding/onboarding-wizard";
import Logo from "@/components/logo";

export const metadata: Metadata = {
  title: "Onboarding - EMPDATA Insurance",
  description: "Complete your registration to get started",
};

export default function OnboardingPage() {
  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 via-white to-slate-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-4">
        <div className="flex justify-center">
          <Logo width={150} />
        </div>
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold tracking-tight bg-linear-to-r from-blue-800 to-blue-900 bg-clip-text text-transparent">
           CLIENT ONBOARDING KYC FORM
          </h1>
          <p className="mt-3 text-lg text-muted-foreground">
            Complete your registration to start managing your insurance
            portfolio
          </p>
        </div>

        <OnboardingWizard />
      </div>
    </div>
  );
}
