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

// Validation functions
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

  for (const field of required) {
    const value = data?.[field];
    if (value === undefined || value === null || value === "") {
      return false;
    }
  }

  const hasDateOfBirth = data?.date_of_birth !== undefined && data?.date_of_birth !== null && data?.date_of_birth !== "";
  const emailMatch = data?.email_address === data?.confirm_email_address;
  const phoneMatch = data?.phone_number === data?.confirm_phone_number;

  return hasDateOfBirth && emailMatch && phoneMatch;
};

const validateBankInfo = (data: any) => {
  return !!data?.bank_name && !!data?.bank_account_number;
};

const validateIdentityInfo = (data: any) => {
  if (!data?.identity_card_type) return false;

  if (data.identity_card_type === "National Identity Number") {
    // Check if NIN exists
    const hasNin = !!data?.national_identification_number;
    if (!hasNin) return false;
    
    // Check if NIN format is valid (11 digits)
    if (!/^\d{11}$/.test(data.national_identification_number)) return false;
    
    // CRITICAL: Check if verification has been attempted (either verified OR pending_admin)
    const hasVerificationAttempt = 
      data?.nin_verification_status === "verified" || 
      data?.nin_verification_status === "pending_admin";
    
    return hasVerificationAttempt;
  } else {
    return !!data?.identity_card_number;
  }
};

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

  for (const field of required) {
    const value = data?.[field];
    if (value === undefined || value === null || value === "") {
      return false;
    }
  }

  const emailMatch = data?.email_address === data?.confirm_email_address;
  const phoneMatch = data?.phone_number === data?.confirm_phone_number;

  return emailMatch && phoneMatch;
};

const validateDirectorIdentity = (data: any) => {
  if (!data?.identity_card_type) return false;

  if (data.identity_card_type === "National Identity Number") {
    // Check if director NIN exists
    const hasNin = !!data?.director_national_identification_number;
    if (!hasNin) return false;
    
    // Check if NIN format is valid (11 digits)
    if (!/^\d{11}$/.test(data.director_national_identification_number)) return false;
    
    // CRITICAL: Check if verification has been attempted (either verified OR pending_admin)
    const hasVerificationAttempt = 
      data?.nin_verification_status === "verified" || 
      data?.nin_verification_status === "pending_admin";
    
    return hasVerificationAttempt;
  } else {
    return !!data?.identity_card_number;
  }
};

const validateCacInfo = (data: any) => {
  // Check if RC number exists
  const hasRcNumber = !!data?.rc_number;
  if (!hasRcNumber) return false;
  
  // CRITICAL: Check if CAC verification has been attempted (either verified OR pending_admin)
  const hasVerificationAttempt = 
    data?.cac_verification_status === "verified" || 
    data?.cac_verification_status === "pending_admin";
  
  return hasVerificationAttempt;
};

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

  const isIndividual = accountType === "individual";
  const isCorporate = accountType === "corporate";
  const isEmployeeGroupLife = accountType === "employee-group-life";

  const [validation, setValidation] = useState({
    personal: false,
    bank: false,
    identity: false,
    company: false,
    directorIdentity: false,
    cac: false,
  });

  useEffect(() => {
    if (isIndividual) {
      setValidation({
        personal: validatePersonalInfo(onBoardingData),
        bank: validateBankInfo(onBoardingData),
        identity: validateIdentityInfo(onBoardingData),
        company: false,
        directorIdentity: false,
        cac: false,
      });
    } else if (isCorporate) {
      setValidation({
        personal: false,
        bank: false,
        identity: false,
        company: validateCompanyInfo(onBoardingData),
        directorIdentity: validateDirectorIdentity(onBoardingData),
        cac: validateCacInfo(onBoardingData),
      });
    } else if (isEmployeeGroupLife) {
      setValidation({
        personal: validatePersonalInfo(onBoardingData),
        bank: true, // Optional for employees
        identity: validateIdentityInfo(onBoardingData),
        company: false,
        directorIdentity: false,
        cac: false,
      });
    }
  }, [onBoardingData, isIndividual, isCorporate, isEmployeeGroupLife]);

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const allValid = isCorporate 
    ? (validation.company && validation.directorIdentity && validation.cac)
    : isIndividual
      ? (validation.personal && validation.bank && validation.identity)
      : (validation.personal && validation.identity);

  const completedCount = isCorporate 
    ? (validation.company ? 1 : 0) + (validation.directorIdentity ? 1 : 0) + (validation.cac ? 1 : 0)
    : isIndividual
      ? (validation.personal ? 1 : 0) + (validation.bank ? 1 : 0) + (validation.identity ? 1 : 0)
      : (validation.personal ? 1 : 0) + (validation.identity ? 1 : 0);
  
  const totalCount = isCorporate ? 3 : isIndividual ? 3 : 2;

  const SectionStatus = ({ isValid }: { isValid: boolean }) => {
    if (isValid) {
      return <CheckCircle className="w-5 h-5 text-green-500" />;
    }
    return <AlertCircle className="w-5 h-5 text-gray-300" />;
  };

  const getHeaderText = () => {
    if (isIndividual) return "Personal Information";
    if (isCorporate) return "Company & Director Information";
    return "Employee Information";
  };

  const getHeaderDescription = () => {
    if (isIndividual) return "Tell us about yourself. This information helps us personalize your insurance coverage.";
    if (isCorporate) return "Provide your company details and director's information for verification.";
    return "Provide your personal details for group life enrollment.";
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          {getHeaderText()}
        </h2>
        <p className="text-sm text-gray-500">{getHeaderDescription()}</p>
      </div>

      {isCorporate ? (
        <>
          <motion.div layout className="border border-gray-200 rounded-xl overflow-hidden bg-white shadow-sm">
            <button onClick={() => toggleSection("company")} className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors">
              <div className="flex items-center gap-3">
                <SectionStatus isValid={validation.company} />
                <h3 className="text-lg font-semibold text-gray-900">Company Information</h3>
                {validation.company && <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">Completed</span>}
              </div>
              {expandedSections.company ? <ChevronUp className="w-5 h-5 text-gray-500" /> : <ChevronDown className="w-5 h-5 text-gray-500" />}
            </button>
            {expandedSections.company && (
              <motion.div initial={{ height: 0 }} animate={{ height: "auto" }} exit={{ height: 0 }} transition={{ duration: 0.2 }} className="border-t border-gray-200">
                <div className="p-6">
                  <CompanyInfoStep onBoardingData={onBoardingData} setOnBoardingData={setOnBoardingData} />
                </div>
              </motion.div>
            )}
          </motion.div>

          <motion.div layout className="border border-gray-200 rounded-xl overflow-hidden bg-white shadow-sm">
            <button onClick={() => toggleSection("directorIdentity")} className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors">
              <div className="flex items-center gap-3">
                <SectionStatus isValid={validation.directorIdentity} />
                <h3 className="text-lg font-semibold text-gray-900">Director's Identity</h3>
                {validation.directorIdentity && <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">Completed</span>}
              </div>
              {expandedSections.directorIdentity ? <ChevronUp className="w-5 h-5 text-gray-500" /> : <ChevronDown className="w-5 h-5 text-gray-500" />}
            </button>
            {expandedSections.directorIdentity && (
              <motion.div initial={{ height: 0 }} animate={{ height: "auto" }} exit={{ height: 0 }} transition={{ duration: 0.2 }} className="border-t border-gray-200">
                <div className="p-6">
                  <IdentityInfoStep accountType={accountType} onBoardingData={onBoardingData} setOnBoardingData={setOnBoardingData} />
                </div>
              </motion.div>
            )}
          </motion.div>
        </>
      ) : (
        <>
          <motion.div layout className="border border-gray-200 rounded-xl overflow-hidden bg-white shadow-sm">
            <button onClick={() => toggleSection("personal")} className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors">
              <div className="flex items-center gap-3">
                <SectionStatus isValid={validation.personal} />
                <h3 className="text-lg font-semibold text-gray-900">Personal Information</h3>
                {validation.personal && <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">Completed</span>}
              </div>
              {expandedSections.personal ? <ChevronUp className="w-5 h-5 text-gray-500" /> : <ChevronDown className="w-5 h-5 text-gray-500" />}
            </button>
            {expandedSections.personal && (
              <motion.div initial={{ height: 0 }} animate={{ height: "auto" }} exit={{ height: 0 }} transition={{ duration: 0.2 }} className="border-t border-gray-200">
                <div className="p-6">
                  <PersonalInfoSection accountType={accountType} onBoardingData={onBoardingData} setOnBoardingData={setOnBoardingData} />
                </div>
              </motion.div>
            )}
          </motion.div>

          {isIndividual && (
            <motion.div layout className="border border-gray-200 rounded-xl overflow-hidden bg-white shadow-sm">
              <button onClick={() => toggleSection("bank")} className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors">
                <div className="flex items-center gap-3">
                  <SectionStatus isValid={validation.bank} />
                  <h3 className="text-lg font-semibold text-gray-900">Bank Information</h3>
                  {validation.bank && <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">Completed</span>}
                </div>
                {expandedSections.bank ? <ChevronUp className="w-5 h-5 text-gray-500" /> : <ChevronDown className="w-5 h-5 text-gray-500" />}
              </button>
              {expandedSections.bank && (
                <motion.div initial={{ height: 0 }} animate={{ height: "auto" }} exit={{ height: 0 }} transition={{ duration: 0.2 }} className="border-t border-gray-200">
                  <div className="p-6">
                    <BankInfoStep accountType={accountType} onBoardingData={onBoardingData} setOnBoardingData={setOnBoardingData} />
                  </div>
                </motion.div>
              )}
            </motion.div>
          )}

          <motion.div layout className="border border-gray-200 rounded-xl overflow-hidden bg-white shadow-sm">
            <button onClick={() => toggleSection("identity")} className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors">
              <div className="flex items-center gap-3">
                <SectionStatus isValid={validation.identity} />
                <h3 className="text-lg font-semibold text-gray-900">Identity Information</h3>
                {validation.identity && <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">Completed</span>}
              </div>
              {expandedSections.identity ? <ChevronUp className="w-5 h-5 text-gray-500" /> : <ChevronDown className="w-5 h-5 text-gray-500" />}
            </button>
            {expandedSections.identity && (
              <motion.div initial={{ height: 0 }} animate={{ height: "auto" }} exit={{ height: 0 }} transition={{ duration: 0.2 }} className="border-t border-gray-200">
                <div className="p-6">
                  <IdentityInfoStep accountType={accountType} onBoardingData={onBoardingData} setOnBoardingData={setOnBoardingData} />
                </div>
              </motion.div>
            )}
          </motion.div>
        </>
      )}

      <div className="bg-gray-50 p-4 rounded-lg">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {allValid ? <CheckCircle className="w-5 h-5 text-green-500" /> : <AlertCircle className="w-5 h-5 text-yellow-500" />}
            <span className="text-sm font-medium">
              {allValid
                ? "All information completed! You're ready to continue."
                : `Please complete all required fields (${completedCount}/${totalCount} sections)`}
            </span>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between pt-6 border-t border-gray-200">
        <button onClick={onBack} className="px-8 py-3 rounded-xl font-medium text-gray-600 hover:bg-gray-100 transition-colors">
          Back
        </button>
        <button
          onClick={onNext}
          disabled={!allValid}
          className={cn(
            "px-8 py-3 rounded-xl font-medium transition-all flex items-center gap-2",
            allValid
              ? "bg-gradient-to-r from-blue-600 to-emerald-600 text-white hover:shadow-lg hover:scale-105"
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