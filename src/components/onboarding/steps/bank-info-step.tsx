"use client";

import { useState, useEffect } from "react";
import {
  Building,
  CreditCard,
  Hash,
  ChevronDown,
  HelpCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import type { AccountType } from "@/types/onboarding.types";

interface BankInfoStepProps {
  accountType: AccountType | null;
  onBoardingData: any;
  setOnBoardingData: (data: any) => void;
  onValidationChange?: (isValid: boolean) => void;
}

const banks = [
  "Access Bank",
  "Citibank",
  "Ecobank",
  "Fidelity Bank",
  "First Bank",
  "First City Monument Bank (FCMB)",
  "Globus Bank",
  "Guaranty Trust Bank (GTB)",
  "Heritage Bank",
  "Keystone Bank",
  "Parallex Bank",
  "Polaris Bank",
  "Providus Bank",
  "Stanbic IBTC Bank",
  "Standard Chartered Bank",
  "Sterling Bank",
  "Suntrust Bank",
  "Titan Trust Bank",
  "Union Bank",
  "United Bank for Africa (UBA)",
  "Unity Bank",
  "Wema Bank",
  "Zenith Bank",
];

export function BankInfoStep({
  accountType,
  onBoardingData,
  setOnBoardingData,
  onValidationChange,
}: BankInfoStepProps) {
  const [openBank, setOpenBank] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const isIndividual = accountType === "individual";
  const isCorporate = accountType === "corporate";
  const isEmployeeGroupLife = accountType === "employee-group-life";

  const handleChange = (field: string, value: any) => {
    setOnBoardingData((prev: any) => {
      const newData = {
        ...prev,
        [field]: value,
      };
      
      // Auto-validate when data changes
      // if (onValidationChange) {
      //   onValidationChange(validateForm(newData));
      // }
      
      return newData;
    });
  };

  const filteredBanks = banks.filter((bank) =>
    bank.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  // Validation function
  // const validateForm = (data: any) => {
  //   if (isIndividual) {
  //     return !!(
  //       data?.bvn_number &&
  //       data?.bank_name &&
  //       data?.bank_account_number
  //     );
  //   }
    
  //   if (isCorporate) {
  //     return !!(
  //       data?.director_bvn_number &&
  //       data?.director_bank_name &&
  //       data?.director_bank_acct_number &&
  //       data?.director_tax_identification_number
  //     );
  //   }
    
  //   if (isEmployeeGroupLife) {
  //     // For employee group life, bank info might be optional or required
  //     // Adjust based on your business rules
  //     return true; // Change this based on your requirements
  //   }
    
  //   return false;
  // };

  // Validate on mount and when data changes
  // useEffect(() => {
  //   if (onValidationChange) {
  //     onValidationChange(validateForm(onBoardingData));
  //   }
  // }, [onBoardingData, accountType]);

  // Determine if this component should render
  const shouldRender = isIndividual || isCorporate || isEmployeeGroupLife;

  if (!shouldRender) {
    return null;
  }

  // For employee group life, we might show a simplified version or message
  if (isEmployeeGroupLife) {
    return (
      <div className="space-y-8">
        <div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Bank Information (Optional)
          </h3>
          <p className="text-sm text-gray-500">
            Provide your bank details for premium payments and claims
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* BVN */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <label className="text-sm font-medium text-gray-700">
                BVN
              </label>
              <Tooltip>
                <TooltipTrigger>
                  <HelpCircle className="w-4 h-4 text-gray-400 cursor-help" />
                </TooltipTrigger>
                <TooltipContent>
                  <p>Bank Verification Number (11 digits) - Optional</p>
                </TooltipContent>
              </Tooltip>
            </div>
            <div className="relative">
              <Hash className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                maxLength={11}
                value={onBoardingData?.bvn_number || ""}
                onChange={(e) => {
                  const value = e.target.value.replace(/\D/g, "");
                  handleChange("bvn_number", value);
                }}
                placeholder="Enter 11-digit BVN (optional)"
                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <p className="text-xs text-gray-500">
              Your BVN is encrypted for security
            </p>
          </div>

          {/* Bank Name */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">
              Bank Name
            </label>
            <div className="relative">
              <Building className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 z-10" />
              <button
                onClick={() => setOpenBank(!openBank)}
                className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-xl flex items-center justify-between hover:border-gray-300 transition-colors"
              >
                <span
                  className={
                    onBoardingData?.bank_name
                      ? "text-gray-900"
                      : "text-gray-400"
                  }
                >
                  {onBoardingData?.bank_name || "Select your bank (optional)"}
                </span>
                <ChevronDown
                  className={cn(
                    "w-4 h-4 text-gray-400",
                    openBank && "rotate-180",
                  )}
                />
              </button>

              {openBank && (
                <div className="absolute z-20 w-full mt-1 bg-white border border-gray-200 rounded-xl shadow-lg overflow-hidden">
                  <div className="p-3 border-b border-gray-200">
                    <input
                      type="text"
                      placeholder="Search banks..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      autoFocus
                    />
                  </div>
                  <div className="max-h-48 overflow-y-auto">
                    {filteredBanks.map((bank) => (
                      <button
                        key={bank}
                        onClick={() => {
                          handleChange("bank_name", bank);
                          setOpenBank(false);
                          setSearchQuery("");
                        }}
                        className="w-full px-4 py-2 text-left hover:bg-gray-50 transition-colors"
                      >
                        {bank}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Account Number */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">
              Account Number
            </label>
            <div className="relative">
              <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                maxLength={10}
                value={onBoardingData?.bank_account_number || ""}
                onChange={(e) => {
                  const value = e.target.value.replace(/\D/g, "");
                  handleChange("bank_account_number", value);
                }}
                placeholder="Enter 10-digit account number (optional)"
                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>

        {/* Security Notice */}
        <div className="bg-blue-50 rounded-xl p-4">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center shrink-0">
              <span className="text-blue-600 font-bold">🔒</span>
            </div>
            <div>
              <p className="text-sm font-medium text-blue-900">
                Your information is secure
              </p>
              <p className="text-xs text-blue-700 mt-1">
                Bank details are optional for group life enrollment. If provided,
                they will be encrypted before transmission.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Original implementation for individual and corporate
  return (
    <div className="space-y-8">
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          {isCorporate ? "Director's Bank Information" : "Bank Information"}
        </h3>
        <p className="text-sm text-gray-500">
          {isCorporate
            ? "Provide the director's bank details for premium payments and claims"
            : "Provide your bank details for premium payments and claims"}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* BVN */}
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <label className="text-sm font-medium text-gray-700">
              {isCorporate ? "Director's BVN" : "BVN"}{" "}
              <span className="text-red-500">*</span>
            </label>
            <Tooltip>
              <TooltipTrigger>
                <HelpCircle className="w-4 h-4 text-gray-400 cursor-help" />
              </TooltipTrigger>
              <TooltipContent>
                <p>Bank Verification Number (11 digits)</p>
              </TooltipContent>
            </Tooltip>
          </div>
          <div className="relative">
            <Hash className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              maxLength={11}
              value={
                isIndividual
                  ? onBoardingData?.bvn_number || ""
                  : onBoardingData?.director_bvn_number || ""
              }
              onChange={(e) => {
                const value = e.target.value.replace(/\D/g, "");
                if (isIndividual) {
                  handleChange("bvn_number", value);
                } else {
                  handleChange("director_bvn_number", value);
                }
              }}
              placeholder="Enter 11-digit BVN"
              className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <p className="text-xs text-gray-500">
            Your BVN is encrypted for security
          </p>
        </div>

        {/* Bank Name */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">
            {isCorporate ? "Director's Bank" : "Bank Name"}{" "}
            <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <Building className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 z-10" />
            <button
              onClick={() => setOpenBank(!openBank)}
              className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-xl flex items-center justify-between hover:border-gray-300 transition-colors"
            >
              <span
                className={
                  isIndividual
                    ? onBoardingData?.bank_name
                      ? "text-gray-900"
                      : "text-gray-400"
                    : onBoardingData?.director_bank_name
                      ? "text-gray-900"
                      : "text-gray-400"
                }
              >
                {isIndividual
                  ? onBoardingData?.bank_name || "Select your bank"
                  : onBoardingData?.director_bank_name ||
                    "Select director's bank"}
              </span>
              <ChevronDown
                className={cn(
                  "w-4 h-4 text-gray-400",
                  openBank && "rotate-180",
                )}
              />
            </button>

            {openBank && (
              <div className="absolute z-20 w-full mt-1 bg-white border border-gray-200 rounded-xl shadow-lg overflow-hidden">
                <div className="p-3 border-b border-gray-200">
                  <input
                    type="text"
                    placeholder="Search banks..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    autoFocus
                  />
                </div>
                <div className="max-h-48 overflow-y-auto">
                  {filteredBanks.map((bank) => (
                    <button
                      key={bank}
                      onClick={() => {
                        if (isIndividual) {
                          handleChange("bank_name", bank);
                        } else {
                          handleChange("director_bank_name", bank);
                        }
                        setOpenBank(false);
                        setSearchQuery("");
                      }}
                      className="w-full px-4 py-2 text-left hover:bg-gray-50 transition-colors"
                    >
                      {bank}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Account Number */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">
            {isCorporate ? "Director's Account Number" : "Account Number"}{" "}
            <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              maxLength={10}
              value={
                isIndividual
                  ? onBoardingData?.bank_account_number || ""
                  : onBoardingData?.director_bank_acct_number || ""
              }
              onChange={(e) => {
                const value = e.target.value.replace(/\D/g, "");
                if (isIndividual) {
                  handleChange("bank_account_number", value);
                } else {
                  handleChange("director_bank_acct_number", value);
                }
              }}
              placeholder="Enter 10-digit account number"
              className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Tax/Payer ID */}
        {isCorporate && (
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <label className="text-sm font-medium text-gray-700">
                Tax Identification Number{" "}
                <span className="text-red-500">*</span>
              </label>
              <Tooltip>
                <TooltipTrigger>
                  <HelpCircle className="w-4 h-4 text-gray-400 cursor-help" />
                </TooltipTrigger>
                <TooltipContent>
                  Tax Identification Number (TIN) or Payer ID
                </TooltipContent>
              </Tooltip>
            </div>
            <div className="relative">
              <Hash className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                value={onBoardingData?.director_tax_identification_number || ""}
                onChange={(e) =>
                  handleChange(
                    "director_tax_identification_number",
                    e.target.value,
                  )
                }
                placeholder="Enter TIN"
                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
        )}
      </div>

      {/* Security Notice */}
      <div className="bg-blue-50 rounded-xl p-4">
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center shrink-0">
            <span className="text-blue-600 font-bold">🔒</span>
          </div>
          <div>
            <p className="text-sm font-medium text-blue-900">
              Your information is secure
            </p>
            <p className="text-xs text-blue-700 mt-1">
              All sensitive information including BVN is encrypted before
              transmission. We never store your banking details in plain text.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}