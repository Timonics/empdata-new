import { Metadata } from "next";
import { OnboardingWizard } from "@/components/onboarding/onboarding-wizard";
import { ThemeToggle } from "@/components/theme-toggle";

export const metadata: Metadata = {
  title: "Onboarding - EMPDATA Insurance",
  description: "Complete your registration to get started",
};

export default function OnboardingPage() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-muted/40 px-4 py-12 sm:px-6 lg:px-8 dark:bg-[#131F45]">
      {/* backdrop — adapts to the active theme */}
      <div className="pointer-events-none absolute inset-0">
        <div className="bg-grid-faint absolute inset-0 dark:bg-grid-faint-dark [mask-image:radial-gradient(ellipse_70%_50%_at_50%_0%,black,transparent)]" />
        <div className="absolute -top-32 left-1/2 h-[420px] w-[760px] -translate-x-1/2 rounded-full bg-brand-600/10 blur-[130px] dark:bg-brand-600/20" />
      </div>

      {/* theme toggle */}
      <div className="absolute top-5 right-5 z-20">
        <ThemeToggle />
      </div>

      <div className="relative mx-auto max-w-6xl space-y-4">
        <div className="mb-10 text-center">
          <p className="mb-3 text-[11px] font-semibold tracking-[0.28em] text-brand-700/80 uppercase dark:text-brand-300/90">
            Secure KYC · Encrypted end-to-end
          </p>
          <h1 className="font-display text-4xl font-semibold tracking-tight text-navy-900 dark:text-white">
            Client{" "}
            <span className="font-serif text-brand-600 italic dark:text-brand-300">
              onboarding
            </span>
          </h1>
          <p className="mx-auto mt-3 max-w-xl text-base text-muted-foreground dark:text-white/50">
            Complete your registration to start managing your insurance
            portfolio — most people finish in under 10 minutes.
          </p>
        </div>

        <OnboardingWizard />
      </div>
    </div>
  );
}
