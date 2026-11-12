"use client";

import { useState } from "react";
import { ChevronDown, IdCard, Hash, HelpCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { CacVerificationStep } from "./cac-verification-step";
import { VerifyIdentityButton } from "./verify-identity-button";
import type { AccountType } from "@/types/onboarding.types";

interface IdentityInfoStepProps {
  accountType: AccountType | null;
  onBoardingData: any;
  setOnBoardingData: (data: any) => void;
}

const identityCardTypes = [
  {
    value: "National Identity Number",
    label: "National Identification Number (NIN)",
    icon: "🇳🇬",
  },
];

export function IdentityInfoStep({
  accountType,
  onBoardingData,
  setOnBoardingData,
}: IdentityInfoStepProps) {
  const [openIdentityType, setOpenIdentityType] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const isCorporate = accountType === "corporate";
  const isIndividual = accountType === "individual";

  const handleChange = (field: string, value: any) => {
    setOnBoardingData((prev: any) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleCacVerificationComplete = (status: "verified" | "pending_admin", data?: any) => {
    if (status === "verified") {
      handleChange("cac_verified", true);
      handleChange("cac_verification_status", "verified");
      if (data) {
        handleChange("cac_verification_data", data);
        // Auto-fill company info
        if (!onBoardingData?.company_name && data.company_name) {
          handleChange("company_name", data.company_name);
        }
        if (!onBoardingData?.rc_number && data.rc_number) {
          handleChange("rc_number", data.rc_number);
        }
      }
    } else if (status === "pending_admin") {
      handleChange("cac_verified", false);
      handleChange("cac_verification_status", "pending_admin");
      if (data) {
        handleChange("cac_verification_data", data);
      }
    } else {
      // Reset verification
      handleChange("cac_verified", false);
      handleChange("cac_verification_status", null);
      handleChange("cac_verification_data", null);
    }
  };

  const filteredTypes = identityCardTypes.filter((type) =>
    type.label.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const selectedType = identityCardTypes.find(
    (type) => type.value === onBoardingData?.identity_card_type,
  );

  const isNinSelected = selectedType?.value === "National Identity Number";

  return (
    <div className={cn("space-y-8", openIdentityType && "h-125")}>
      <div>
        <h3 className="text-lg font-medium text-foreground mb-2">
          {isCorporate
            ? "Director's Identity Information"
            : "Identity Information"}
        </h3>
        <p className="text-sm text-muted-foreground">
          Provide your identification details for verification purposes
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {/* Identity Card Type */}
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <label className="text-sm font-medium text-foreground/80">
              Identity Card Type <span className="text-red-500">*</span>
            </label>
            <Tooltip>
              <TooltipTrigger>
                <HelpCircle className="w-4 h-4 text-muted-foreground/70 cursor-help" />
              </TooltipTrigger>
              <TooltipContent>
                Select the ID type you want to use for verification
              </TooltipContent>
            </Tooltip>
          </div>
          <div className="relative">
            <IdCard className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/70 z-10" />
            <button
              onClick={() => setOpenIdentityType(!openIdentityType)}
              className="w-full pl-10 pr-4 py-3 bg-card border border-border rounded-xl flex items-center justify-between hover:border-muted-foreground/40 transition-colors"
            >
              <span
                className={selectedType ? "text-foreground" : "text-muted-foreground/70"}
              >
                {selectedType
                  ? selectedType.label
                  : "Select identity card type"}
              </span>
              <ChevronDown
                className={cn(
                  "w-4 h-4 text-muted-foreground/70",
                  openIdentityType && "rotate-180",
                )}
              />
            </button>

            {openIdentityType && (
              <div className="absolute z-20 w-full mt-1 bg-card border border-border rounded-xl shadow-lg overflow-hidden">
                <div className="p-3 border-b border-border">
                  <input
                    type="text"
                    placeholder="Search identity types..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    autoFocus
                  />
                </div>
                <div className="max-h-48 overflow-y-auto">
                  {filteredTypes.map((type) => (
                    <button
                      key={type.value}
                      onClick={() => {
                        handleChange("identity_card_type", type.value);
                        setOpenIdentityType(false);
                        setSearchQuery("");
                      }}
                      className="w-full px-4 py-3 text-left hover:bg-muted/60 transition-colors flex items-center gap-3"
                    >
                      <span className="text-xl">{type.icon}</span>
                      <div>
                        <p className="font-medium text-foreground">
                          {type.label}
                        </p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* NIN Field */}
        {isNinSelected && (
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground/80">
              {isCorporate
                ? "Director's NIN (National Identification Number)"
                : "NIN (National Identification Number)"}{" "}
              <span className="text-red-500">*</span>
            </label>
            <div className="flex gap-3 items-start">
              <div className="relative flex-1">
                <Hash className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/70" />
                <input
                  type="text"
                  maxLength={11}
                  value={
                    isCorporate
                      ? onBoardingData?.director_national_identification_number || ""
                      : onBoardingData?.national_identification_number || ""
                  }
                  onChange={(e) => {
                    const value = e.target.value.replace(/\D/g, "");
                    handleChange(
                      isCorporate
                        ? "director_national_identification_number"
                        : "national_identification_number",
                      value,
                    );
                  }}
                  placeholder="Enter 11-digit NIN"
                  className="w-full pl-10 pr-4 py-3 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <VerifyIdentityButton
                type="nin"
                value={
                  isCorporate
                    ? onBoardingData?.director_national_identification_number || ""
                    : onBoardingData?.national_identification_number || ""
                }
                onVerified={(data) => {
                  if (!isCorporate) {
                    if (!onBoardingData?.first_name && data.first_name) {
                      handleChange("first_name", data.first_name);
                    }
                    if (!onBoardingData?.last_name && data.last_name) {
                      handleChange("last_name", data.last_name);
                    }
                    if (!onBoardingData?.date_of_birth && data.date_of_birth) {
                      handleChange("date_of_birth", data.date_of_birth);
                    }
                    if (!onBoardingData?.gender && data.gender) {
                      handleChange("gender", data.gender);
                    }
                  }
                  handleChange(
                    isCorporate ? "director_nin_verified" : "nin_verified",
                    true,
                  );
                }}
              />
            </div>
            <p className="text-xs text-muted-foreground">
              Your NIN is encrypted before verification and only ever stored in
              encrypted form.
            </p>
          </div>
        )}

        {/* Director's BVN - Corporate only */}
        {isCorporate && (
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground/80">
              Director's BVN (Bank Verification Number){" "}
              <span className="text-red-500">*</span>
            </label>
            <div className="flex gap-3 items-start">
              <div className="relative flex-1">
                <Hash className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/70" />
                <input
                  type="text"
                  maxLength={11}
                  value={onBoardingData?.director_bvn_number || ""}
                  onChange={(e) => {
                    const value = e.target.value.replace(/\D/g, "");
                    handleChange("director_bvn_number", value);
                  }}
                  placeholder="Enter 11-digit BVN"
                  className="w-full pl-10 pr-4 py-3 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <VerifyIdentityButton
                type="bvn"
                value={onBoardingData?.director_bvn_number || ""}
                onVerified={() =>
                  handleChange("director_bvn_verified", true)
                }
              />
            </div>
            <p className="text-xs text-muted-foreground">
              The BVN will be encrypted before transmission
            </p>
          </div>
        )}

        {/* Other ID Number Field */}
        {selectedType && !isNinSelected && (
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground/80">
              ID Number <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <Hash className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/70" />
              <input
                type="text"
                value={onBoardingData?.identity_card_number || ""}
                onChange={(e) =>
                  handleChange("identity_card_number", e.target.value)
                }
                placeholder={`Enter your ${selectedType?.label || "ID"} number`}
                className="w-full pl-10 pr-4 py-3 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
        )}
      </div>

      {/* CAC Verification for Corporate */}
      {isCorporate && (
        <div className="border-t border-border pt-6 mt-4">
          <CacVerificationStep
            rcNumber={onBoardingData?.rc_number || ""}
            // companyName={onBoardingData?.company_name || ""}
            onRcNumberChange={(value) => handleChange("rc_number", value)}
            onCompanyNameChange={(value) => handleChange("company_name", value)}
            onVerificationComplete={handleCacVerificationComplete}
            verificationStatus={onBoardingData?.cac_verification_status}
            verificationData={onBoardingData?.cac_verification_data}
          />
        </div>
      )}

      {/* Info Box */}
      <div className="bg-amber-50 rounded-xl p-4">
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center shrink-0">
            <span className="text-amber-600 font-bold">!</span>
          </div>
          <div>
            <p className="text-sm font-medium text-amber-900">
              Important Information
            </p>
            <p className="text-xs text-amber-700 mt-1">
              {isCorporate
                ? "Both director's identity and company CAC details will be verified. Please ensure all information matches official records."
                : "Your identity information will be verified against official databases. Ensure the details match exactly with your chosen ID."}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}