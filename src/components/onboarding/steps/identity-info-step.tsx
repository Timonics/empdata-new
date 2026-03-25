"use client";

import { useState } from "react";
import { ChevronDown, IdCard, Hash, HelpCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { NinVerificationStep } from "./nin-verification-step";
import { CacVerificationStep } from "./cac-verification-step";
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

  const handleNinVerificationComplete = (status: "verified" | "pending_admin", data?: any) => {
    if (status === "verified") {
      handleChange("nin_verified", true);
      handleChange("nin_verification_status", "verified");
      if (data) {
        handleChange("nin_verification_data", data);
        // Auto-fill personal info if empty
        if (!onBoardingData?.first_name && data.first_name) {
          handleChange("first_name", data.first_name);
        }
        if (!onBoardingData?.last_name && data.last_name) {
          handleChange("last_name", data.last_name);
        }
        if (!onBoardingData?.date_of_birth && data.date_of_birth) {
          handleChange("date_of_birth", data.date_of_birth);
        }
      }
    } else if (status === "pending_admin") {
      handleChange("nin_verified", false);
      handleChange("nin_verification_status", "pending_admin");
      if (data) {
        handleChange("nin_verification_data", data);
      }
    } else {
      // Reset verification
      handleChange("nin_verified", false);
      handleChange("nin_verification_status", null);
      handleChange("nin_verification_data", null);
    }
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
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          {isCorporate
            ? "Director's Identity Information"
            : "Identity Information"}
        </h3>
        <p className="text-sm text-gray-500">
          Provide your identification details for verification purposes
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {/* Identity Card Type */}
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <label className="text-sm font-medium text-gray-700">
              Identity Card Type <span className="text-red-500">*</span>
            </label>
            <Tooltip>
              <TooltipTrigger>
                <HelpCircle className="w-4 h-4 text-gray-400 cursor-help" />
              </TooltipTrigger>
              <TooltipContent>
                Select the ID type you want to use for verification
              </TooltipContent>
            </Tooltip>
          </div>
          <div className="relative">
            <IdCard className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 z-10" />
            <button
              onClick={() => setOpenIdentityType(!openIdentityType)}
              className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-xl flex items-center justify-between hover:border-gray-300 transition-colors"
            >
              <span
                className={selectedType ? "text-gray-900" : "text-gray-400"}
              >
                {selectedType
                  ? selectedType.label
                  : "Select identity card type"}
              </span>
              <ChevronDown
                className={cn(
                  "w-4 h-4 text-gray-400",
                  openIdentityType && "rotate-180",
                )}
              />
            </button>

            {openIdentityType && (
              <div className="absolute z-20 w-full mt-1 bg-white border border-gray-200 rounded-xl shadow-lg overflow-hidden">
                <div className="p-3 border-b border-gray-200">
                  <input
                    type="text"
                    placeholder="Search identity types..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                      className="w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors flex items-center gap-3"
                    >
                      <span className="text-xl">{type.icon}</span>
                      <div>
                        <p className="font-medium text-gray-900">
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

        {/* NIN Verification Step */}
        {isNinSelected && (
          <div className="space-y-2">
            <NinVerificationStep
              value={onBoardingData?.national_identification_number || 
                     onBoardingData?.director_national_identification_number || ""}
              onChange={(value) => {
                if (isCorporate) {
                  handleChange("director_national_identification_number", value);
                } else {
                  handleChange("national_identification_number", value);
                }
              }}
              onVerificationComplete={handleNinVerificationComplete}
              userData={{
                first_name: isCorporate ? onBoardingData?.director_name?.split(" ")[0] : onBoardingData?.first_name,
                last_name: isCorporate ? onBoardingData?.director_name?.split(" ")[1] : onBoardingData?.last_name,
                date_of_birth: onBoardingData?.date_of_birth,
                gender: onBoardingData?.gender,
              }}
              verificationStatus={onBoardingData?.nin_verification_status}
              verificationData={onBoardingData?.nin_verification_data}
              label={
                isCorporate
                  ? "Director's NIN (National Identification Number)"
                  : "NIN (National Identification Number)"
              }
            />
          </div>
        )}

        {/* Other ID Number Field */}
        {selectedType && !isNinSelected && (
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">
              ID Number <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <Hash className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                value={onBoardingData?.identity_card_number || ""}
                onChange={(e) =>
                  handleChange("identity_card_number", e.target.value)
                }
                placeholder={`Enter your ${selectedType?.label || "ID"} number`}
                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
        )}
      </div>

      {/* CAC Verification for Corporate */}
      {isCorporate && (
        <div className="border-t border-gray-200 pt-6 mt-4">
          <CacVerificationStep
            rcNumber={onBoardingData?.rc_number || ""}
            companyName={onBoardingData?.company_name || ""}
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