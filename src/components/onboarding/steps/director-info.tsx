"use client";

import { useState } from "react";
import { ChevronDown, IdCard, Hash, HelpCircle, User } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
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
//   { value: "National ID", label: "National ID Card", icon: "🆔" },
//   { value: "Driver's License", label: "Driver's License", icon: "🚗" },
//   {
//     value: "International Passport",
//     label: "International Passport",
//     icon: "🛂",
//   },
//   { value: "Voter's Card", label: "Voter's Card", icon: "🗳️" },
//   {
//     value: "Permanent Voter's Card",
//     label: "Permanent Voter's Card",
//     icon: "🗳️",
//   },
];

export function IdentityInfoStep({
  accountType,
  onBoardingData,
  setOnBoardingData,
}: IdentityInfoStepProps) {
  const [openIdentityType, setOpenIdentityType] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const isCorporate = accountType === "corporate";

  const handleChange = (field: string, value: any) => {
    setOnBoardingData((prev: any) => ({
      ...prev,
      [field]: value,
    }));
  };

  const filteredTypes = identityCardTypes.filter((type) =>
    type.label.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const selectedType = identityCardTypes.find(
    (type) => type.value === onBoardingData?.identity_card_type,
  );

  const isFormValid = () => {
    if (!onBoardingData?.identity_card_type) return false;

    if (onBoardingData?.identity_card_type === "National Identity Number") {
      return onBoardingData?.director_national_identification_number; // Changed for corporate
    } else {
      return onBoardingData?.identity_card_number;
    }
  };

  return (
    <div className={cn("space-y-8", openIdentityType && "h-125")}>
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          {isCorporate
            ? "Director's Identity Information"
            : "Identity Information"}
        </h3>
        <p className="text-sm text-gray-500">
          {isCorporate
            ? "Provide the director's identification details for verification"
            : "Provide your identification details for verification purposes"}
        </p>
      </div>

      {/* Director Name - Only for Corporate */}
      {isCorporate && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">
              Director's Full Name <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                value={onBoardingData?.director_name || ""}
                onChange={(e) => handleChange("director_name", e.target.value)}
                placeholder="Enter director's full name"
                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Identity Card Type */}
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <label className="text-sm font-medium text-gray-700">
              {isCorporate ? "Director's ID Type" : "Identity Card Type"}{" "}
              <span className="text-red-500">*</span>
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
                        // Clear NIN fields if not NIN
                        if (type.value !== "National Identity Number") {
                          handleChange(
                            isCorporate
                              ? "director_national_identification_number"
                              : "national_identification_number",
                            undefined,
                          );
                          handleChange("nin_number_iv", undefined);
                          handleChange("nin_number_data", undefined);
                          handleChange("nin_number_tag", undefined);
                        }
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

        {/* ID Number Field - Conditional based on type */}
        {selectedType?.value === "National Identity Number" ? (
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">
              {isCorporate ? "Director's NIN" : "NIN (National Identification Number)"}{" "}
              <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <Hash className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
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
                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <p className="text-xs text-gray-500">
              The NIN will be encrypted before transmission
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">
              {isCorporate ? "Director's ID Number" : "ID Number"}{" "}
              <span className="text-red-500">*</span>
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
                ? "The director's identity information will be verified against official databases. Ensure the details match exactly with the chosen ID."
                : "Your identity information will be verified against official databases. Ensure the details match exactly with your chosen ID."}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}