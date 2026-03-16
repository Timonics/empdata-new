"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ChevronDown, ChevronUp, CheckCircle, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import type { AccountType } from "@/types/onboarding.types";
import { PersonalInfoSection } from "./personal-info-step";
import { BankInfoStep } from "./bank-info-step";
import { IdentityInfoStep } from "./identity-info-step";
import { CompanyInfoStep } from "./company-info-step";

interface InformationPageProps {
  accountType: AccountType | null;
  onNext: () => void;
  onBack: () => void;
  onBoardingData: any;
  setOnBoardingData: (data: any) => void;
}

// Validation functions for individual
const validatePersonalInfo = (data: any) => {
  const required = [
    "first_name",
    "last_name",
    "date_of_birth",
    "nationality",
    "phone_number",
    "confirm_phone_number",
    "email_address",
    "confirm_email_address",
    "country",
    "state",
    "city",
    "house_address",
  ];

  const missingFields: string[] = [];
  required.forEach((field) => {
    const value = data?.[field];
    if (value === undefined || value === null || value === "") {
      missingFields.push(field);
    }
  });

  const hasDateOfBirth =
    data?.date_of_birth !== undefined &&
    data?.date_of_birth !== null &&
    data?.date_of_birth !== "";

  const emailMatch = data?.email_address === data?.confirm_email_address;
  const phoneMatch = data?.phone_number === data?.confirm_phone_number;

  const allFieldsPresent = missingFields.length === 0 && hasDateOfBirth;

  return allFieldsPresent && emailMatch && phoneMatch;
};

const validateBankInfo = (data: any) => {
  return !!data?.bank_name && !!data?.bank_account_number;
};

const validateIdentityInfo = (data: any) => {
  if (!data?.identity_card_type) return false;

  if (data.identity_card_type === "National Identity Number") {
    return !!data?.national_identification_number;
  } else {
    return !!data?.identity_card_number;
  }
};

// Validation function for corporate
const validateCompanyInfo = (data: any) => {
  const required = [
    "company_name",
    "rc_number",
    "email_address",
    "confirm_email_address",
    "phone_number",
    "confirm_phone_number",
    "house_address",
    "city",
    "state",
    "country",
  ];

  // Check all required fields
  const allFieldsPresent = required.every(
    (field) => data?.[field] !== undefined && data?.[field] !== null && data?.[field] !== ""
  );

  // Email confirmation
  const emailMatch = data?.email_address === data?.confirm_email_address;
  
  // Phone confirmation
  const phoneMatch = data?.phone_number === data?.confirm_phone_number;

  return allFieldsPresent && emailMatch && phoneMatch;
};

// Validation function for corporate director's identity
// const validateDirectorIdentity = (data: any) => {  
//   console.log(data);

//   // Identity card type is required
//   if (!data?.identity_card_type) return false;

//   // If NIN is selected, check for director's NIN
//   if (data.identity_card_type === "National Identity Number") {
//     return !!data?.director_national_identification_number;
//   } else {
//     // For other ID types, check identity card number
//     return !!data?.identity_card_number;
//   }
// };

export function InformationPage({
  accountType,
  onNext,
  onBack,
  onBoardingData,
  setOnBoardingData,
}: InformationPageProps) {
  const [expandedSections, setExpandedSections] = useState({
    personal: true,
    bank: false,
    identity: false,
    company: true,
    directorIdentity: false,
  });

  // Determine account type
  const isIndividual = accountType === "individual";
  const isCorporate = accountType === "corporate";

  // Validation states
  const [validation, setValidation] = useState({
    personal: true,
    bank: true,
    identity: true,
    company: true,
    directorIdentity: true,
  });

  // Update validation when data changes
  // useEffect(() => {
  //   if (isIndividual) {
  //     setValidation({
  //       personal: validatePersonalInfo(onBoardingData),
  //       bank: validateBankInfo(onBoardingData),
  //       identity: validateIdentityInfo(onBoardingData),
  //       company: false,
  //       directorIdentity: false,
  //     });
  //   } else if (isCorporate) {
  //     setValidation({
  //       personal: false,
  //       bank: false,
  //       identity: false,
  //       company: validateCompanyInfo(onBoardingData),
  //       directorIdentity: true
  //     });
  //     setValidation({
  //       personal: false,
  //       bank: false,
  //       identity: false,
  //       company: validateCompanyInfo(onBoardingData),
  //       directorIdentity: true
  //     })
  //   }
  // }, [onBoardingData, isIndividual, isCorporate]);

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  // For corporate, we have two sections
  const allValid = isCorporate 
    ? (validation.company && validation.directorIdentity)
    : (validation.personal && validation.bank && validation.identity);

  const completedCount = isCorporate 
    ? (validation.company ? 1 : 0) + (validation.directorIdentity ? 1 : 0)
    : Object.values(validation).filter(Boolean).length;
  
  const totalCount = isCorporate ? 2 : 3;

  const SectionStatus = ({ isValid }: { isValid: boolean }) => {
    if (isValid) {
      return <CheckCircle className="w-5 h-5 text-green-500" />;
    }
    return <AlertCircle className="w-5 h-5 text-gray-300" />;
  };

  // Determine header text based on account type
  const getHeaderText = () => {
    if (isIndividual) {
      return "Personal Information";
    } else if (isCorporate) {
      return "Company & Director Information";
    } else {
      return "Information";
    }
  };

  const getHeaderDescription = () => {
    if (isIndividual) {
      return "Tell us about yourself. This information helps us personalize your insurance coverage.";
    } else if (isCorporate) {
      return "Provide your company details and director's information for verification.";
    } else {
      return "Please provide your information to continue.";
    }
  };

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          {getHeaderText()}
        </h2>
        <p className="text-sm text-gray-500">{getHeaderDescription()}</p>
      </div>

      {/* Progress Overview */}
      <div className="bg-linear-to-r from-blue-50 to-emerald-50 p-6 rounded-xl">
        <div className="flex items-center justify-between mb-3">
          <span className="font-semibold text-gray-900">Section Progress</span>
          <span className="text-sm font-medium text-blue-600">
            {completedCount}/{totalCount} completed
          </span>
        </div>
        <div className="flex gap-1 h-2">
          {isCorporate ? (
            // Two progress bars for corporate
            <>
              <div
                className={cn(
                  "flex-1 rounded-full transition-all duration-300",
                  validation.company ? "bg-green-500" : "bg-gray-200",
                )}
              />
              <div
                className={cn(
                  "flex-1 rounded-full transition-all duration-300",
                  validation.directorIdentity ? "bg-green-500" : "bg-gray-200",
                )}
              />
            </>
          ) : (
            // Three progress bars for individual
            <>
              <div
                className={cn(
                  "flex-1 rounded-full transition-all duration-300",
                  validation.personal ? "bg-green-500" : "bg-gray-200",
                )}
              />
              <div
                className={cn(
                  "flex-1 rounded-full transition-all duration-300",
                  validation.bank ? "bg-green-500" : "bg-gray-200",
                )}
              />
              <div
                className={cn(
                  "flex-1 rounded-full transition-all duration-300",
                  validation.identity ? "bg-green-500" : "bg-gray-200",
                )}
              />
            </>
          )}
        </div>
        <div className="flex justify-between mt-2 text-xs text-gray-500">
          {isCorporate ? (
            <>
              <span>Company Information</span>
              <span>Director's Identity</span>
            </>
          ) : (
            <>
              <span>Personal Info</span>
              <span>Bank Details</span>
              <span>Identity</span>
            </>
          )}
        </div>
      </div>

      {isCorporate ? (
        /* Corporate View - Two Sections */
        <>
          {/* Company Information Section */}
          <motion.div
            layout
            className="border border-gray-200 rounded-xl overflow-hidden bg-white shadow-sm"
          >
            <button
              onClick={() => toggleSection("company")}
              className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <SectionStatus isValid={validation.company} />
                <h3 className="text-lg font-semibold text-gray-900">
                  Company Information
                </h3>
                {validation.company && (
                  <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">
                    Completed
                  </span>
                )}
              </div>
              {expandedSections.company ? (
                <ChevronUp className="w-5 h-5 text-gray-500" />
              ) : (
                <ChevronDown className="w-5 h-5 text-gray-500" />
              )}
            </button>

            {expandedSections.company && (
              <motion.div
                initial={{ height: 0 }}
                animate={{ height: "auto" }}
                exit={{ height: 0 }}
                transition={{ duration: 0.2 }}
                className="border-t border-gray-200"
              >
                <div className="p-6">
                  <CompanyInfoStep
                    onBoardingData={onBoardingData}
                    setOnBoardingData={setOnBoardingData}
                  />
                </div>
              </motion.div>
            )}
          </motion.div>

          {/* Director's Identity Section */}
          <motion.div
            layout
            className="border border-gray-200 rounded-xl overflow-hidden bg-white shadow-sm"
          >
            <button
              onClick={() => toggleSection("directorIdentity")}
              className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <SectionStatus isValid={validation.directorIdentity} />
                <h3 className="text-lg font-semibold text-gray-900">
                  Director's Identity
                </h3>
                {validation.directorIdentity && (
                  <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">
                    Completed
                  </span>
                )}
              </div>
              {expandedSections.directorIdentity ? (
                <ChevronUp className="w-5 h-5 text-gray-500" />
              ) : (
                <ChevronDown className="w-5 h-5 text-gray-500" />
              )}
            </button>

            {expandedSections.directorIdentity && (
              <motion.div
                initial={{ height: 0 }}
                animate={{ height: "auto" }}
                exit={{ height: 0 }}
                transition={{ duration: 0.2 }}
                className="border-t border-gray-200"
              >
                <div className="p-6">
                  <IdentityInfoStep
                    accountType={accountType}
                    onBoardingData={onBoardingData}
                    setOnBoardingData={setOnBoardingData}
                  />
                </div>
              </motion.div>
            )}
          </motion.div>
        </>
      ) : (
        /* Individual View - Three Sections */
        <>
          {/* Personal Information Section */}
          <motion.div
            layout
            className="border border-gray-200 rounded-xl overflow-hidden bg-white shadow-sm"
          >
            <button
              onClick={() => toggleSection("personal")}
              className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <SectionStatus isValid={validation.personal} />
                <h3 className="text-lg font-semibold text-gray-900">
                  Personal Information
                </h3>
                {validation.personal && (
                  <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">
                    Completed
                  </span>
                )}
              </div>
              {expandedSections.personal ? (
                <ChevronUp className="w-5 h-5 text-gray-500" />
              ) : (
                <ChevronDown className="w-5 h-5 text-gray-500" />
              )}
            </button>

            {expandedSections.personal && (
              <motion.div
                initial={{ height: 0 }}
                animate={{ height: "auto" }}
                exit={{ height: 0 }}
                transition={{ duration: 0.2 }}
                className="border-t border-gray-200"
              >
                <div className="p-6">
                  <PersonalInfoSection
                    accountType={accountType}
                    onBoardingData={onBoardingData}
                    setOnBoardingData={setOnBoardingData}
                  />
                </div>
              </motion.div>
            )}
          </motion.div>

          {/* Bank Information Section */}
          <motion.div
            layout
            className="border border-gray-200 rounded-xl overflow-hidden bg-white shadow-sm"
          >
            <button
              onClick={() => toggleSection("bank")}
              className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <SectionStatus isValid={validation.bank} />
                <h3 className="text-lg font-semibold text-gray-900">
                  Bank Information
                </h3>
                {validation.bank && (
                  <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">
                    Completed
                  </span>
                )}
              </div>
              {expandedSections.bank ? (
                <ChevronUp className="w-5 h-5 text-gray-500" />
              ) : (
                <ChevronDown className="w-5 h-5 text-gray-500" />
              )}
            </button>

            {expandedSections.bank && (
              <motion.div
                initial={{ height: 0 }}
                animate={{ height: "auto" }}
                exit={{ height: 0 }}
                transition={{ duration: 0.2 }}
                className="border-t border-gray-200"
              >
                <div className="p-6">
                  <BankInfoStep
                    accountType={accountType}
                    onBoardingData={onBoardingData}
                    setOnBoardingData={setOnBoardingData}
                  />
                </div>
              </motion.div>
            )}
          </motion.div>

          {/* Identity Information Section */}
          <motion.div
            layout
            className="border border-gray-200 rounded-xl overflow-hidden bg-white shadow-sm"
          >
            <button
              onClick={() => toggleSection("identity")}
              className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <SectionStatus isValid={validation.identity} />
                <h3 className="text-lg font-semibold text-gray-900">
                  Identity Information
                </h3>
                {validation.identity && (
                  <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">
                    Completed
                  </span>
                )}
              </div>
              {expandedSections.identity ? (
                <ChevronUp className="w-5 h-5 text-gray-500" />
              ) : (
                <ChevronDown className="w-5 h-5 text-gray-500" />
              )}
            </button>

            {expandedSections.identity && (
              <motion.div
                initial={{ height: 0 }}
                animate={{ height: "auto" }}
                exit={{ height: 0 }}
                transition={{ duration: 0.2 }}
                className="border-t border-gray-200"
              >
                <div className="p-6">
                  <IdentityInfoStep
                    accountType={accountType}
                    onBoardingData={onBoardingData}
                    setOnBoardingData={setOnBoardingData}
                  />
                </div>
              </motion.div>
            )}
          </motion.div>
        </>
      )}

      {/* Summary Card */}
      <div className="bg-gray-50 p-4 rounded-lg">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {allValid ? (
              <CheckCircle className="w-5 h-5 text-green-500" />
            ) : (
              <AlertCircle className="w-5 h-5 text-yellow-500" />
            )}
            <span className="text-sm font-medium">
              {allValid
                ? isCorporate 
                  ? "All information completed! You're ready to continue."
                  : "All sections completed! You're ready to continue."
                : `Please complete all required fields (${completedCount}/${totalCount} sections)`}
            </span>
          </div>
        </div>
      </div>

      {/* Navigation Buttons */}
      <div className="flex items-center justify-between pt-6 border-t border-gray-200">
        <button
          onClick={onBack}
          className="px-8 py-3 rounded-xl font-medium text-gray-600 hover:bg-gray-100 transition-colors"
        >
          Back
        </button>
        <button
          onClick={onNext}
          disabled={!allValid}
          className={cn(
            "px-8 py-3 rounded-xl font-medium transition-all flex items-center gap-2",
            allValid
              ? "bg-linear-to-r from-blue-600 to-emerald-600 text-white hover:shadow-lg hover:scale-105"
              : "bg-gray-100 text-gray-400 cursor-not-allowed",
          )}
        >
          Continue
          {!allValid && (
            <span className="text-xs bg-gray-200 text-gray-600 px-2 py-1 rounded-full ml-2">
              {totalCount - completedCount} missing
            </span>
          )}
        </button>
      </div>
    </div>
  );
}