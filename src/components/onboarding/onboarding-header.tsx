"use client";

import { motion } from "framer-motion";
import { Building2, User, Users } from "lucide-react";
import type { AccountType } from "@/types/onboarding.types";

interface OnboardingHeaderProps {
  title: string;
  icon: string;
  stepNumber: number;
  totalSteps: number;
  accountType: AccountType | null;
}

export function OnboardingHeader({
  title,
  icon,
  stepNumber,
  totalSteps,
  accountType,
}: OnboardingHeaderProps) {
  const getAccountTypeIcon = () => {
    if (accountType === "corporate") return <Building2 className="w-5 h-5" />;
    if (accountType === "employee-group-life")
      return <Building2 className="w-5 h-5" />;
    return <User className="w-5 h-5" />;
  };

  const getAccountTypeLabel = () => {
    if (accountType === "corporate") return "Corporate";
    if (accountType === "employee-group-life") return "Employee Group Life";
    return "Individual/Retail";
  };

  return (
    <div className="flex items-center justify-between border-b border-border pb-6">
      <div className="flex items-center gap-4">
        <div className="flex size-12 items-center justify-center rounded-xl bg-navy-900 text-xl text-white">
          {icon}
        </div>
        <div>
          <h2 className="font-display text-2xl font-semibold tracking-tight">{title}</h2>
          <div className="mt-1 flex items-center gap-2">
            {accountType && (
              <>
                <div className="flex items-center gap-1.5 rounded-full bg-muted px-3 py-1 text-xs font-medium text-muted-foreground">
                  {getAccountTypeIcon()}
                  <span className="capitalize">{getAccountTypeLabel()}</span>
                </div>
                <span className="text-muted-foreground/40">•</span>
              </>
            )}
            <span className="text-xs tracking-wide text-muted-foreground uppercase">
              Step {stepNumber} of {totalSteps}
            </span>
          </div>
        </div>
      </div>
      <motion.div
        className="font-serif text-5xl text-muted-foreground/25 italic"
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.2 }}
      >
        {String(stepNumber).padStart(2, "0")}
      </motion.div>
    </div>
  );
}
