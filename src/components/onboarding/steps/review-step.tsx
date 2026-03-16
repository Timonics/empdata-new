"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Check,
  Edit,
  Building2,
  User,
  Users,
  Banknote,
  IdCard,
  FileText,
  Heart,
  ChevronRight,
  Loader2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { AccountType } from "@/types/onboarding.types";

interface ReviewStepProps {
  accountType: AccountType | null;
  onBack: () => void;
  onSubmit: () => Promise<void>;
  isSubmitting: boolean;
  onBoardingData: any;
}

const sectionIcons = {
  "Account Type": User,
  "Policy Plan": FileText,
  "Company Selection": Building2,
  "Personal Info": User,
  "Company Info": Building2,
  "Bank Details": Banknote,
  Identity: IdCard,
  Documents: FileText,
  Beneficiaries: Heart,
};

export function ReviewStep({
  accountType,
  onBack,
  onSubmit,
  isSubmitting,
  onBoardingData,
}: ReviewStepProps) {
  const [expandedSection, setExpandedSection] = useState<string | null>(null);

  const handleSubmit = async () => {
    await onSubmit();
  };

  const renderValue = (value: any) => {
    if (value instanceof Date) return value.toLocaleDateString();
    if (typeof value === "boolean") return value ? "Yes" : "No";
    if (value === null || value === undefined) return "—";
    if (typeof value === "object" && !Array.isArray(value)) return "✓ Provided";
    if (Array.isArray(value)) return `${value.length} item(s)`;
    return String(value);
  };

  const sections: Array<{
    title: string;
    data: Record<string, any>;
  }> = [
    {
      title: "Account Type",
      data: {
        "Account Type": accountType,
      },
    },
    {
      title: "Policy Plan",
      data: {
        "Selected Plan": onBoardingData?.selected_plan || "Not selected",
      },
    },
  ];

  // Company Selection (for employee group life)
  // if (accountType === 'employee-group-life' && onBoardingData?.company_name) {
  //   sections.push({
  //     title: 'Company Selection',
  //     data: {
  //       'Company': onBoardingData.company_name,
  //     },
  //   });
  // }

  // Personal Info (for individual and employee)
  if (accountType === "individual") {
    sections.push({
      title: "Personal Info",
      data: {
        "Full Name":
          `${onBoardingData?.title || ""} ${onBoardingData?.first_name || ""} ${onBoardingData?.last_name || ""}`.trim(),
        Gender: onBoardingData?.gender,
        "Date of Birth": onBoardingData?.date_of_birth
          ? new Date(onBoardingData.date_of_birth).toLocaleDateString()
          : null,
        Nationality: onBoardingData?.nationality,
        Phone: onBoardingData?.phone_number,
        Email: onBoardingData?.email_address,
        Address: `${onBoardingData?.house_address || ""}, ${onBoardingData?.city || ""}, ${onBoardingData?.state || ""}, ${onBoardingData?.country || ""}`,
      },
    });
  }

  // Company Info (for corporate)
  if (accountType === "corporate") {
    sections.push({
      title: "Company Info",
      data: {
        "Company Name": onBoardingData?.company_name,
        "RC Number": onBoardingData?.rc_number,
        Email: onBoardingData?.email_address,
        Phone: onBoardingData?.phone_number,
        Address: `${onBoardingData?.house_address || ""}, ${onBoardingData?.city || ""}, ${onBoardingData?.state || ""}, ${onBoardingData?.country || ""}`,
      },
    });
  }

  // Bank Details
  if (accountType === "corporate") {
    sections.push({
      title: "Bank Details",
      data: {
        "Director's BVN": onBoardingData?.director_bvn_number
          ? "••••••" + onBoardingData.director_bvn_number.slice(-4)
          : "Not provided",
        "Director's Bank": onBoardingData?.director_bank_name,
        "Director's Account": onBoardingData?.director_bank_acct_number,
        TIN:
          onBoardingData?.director_tax_identification_number || "Not provided",
      },
    });
  } else {
    sections.push({
      title: "Bank Details",
      data: {
        BVN: onBoardingData?.bvn_number
          ? "••••••" + onBoardingData.bvn_number.slice(-4)
          : "Not provided",
        "Bank Name": onBoardingData?.bank_name,
        "Account Number": onBoardingData?.bank_account_number,
        "Bank Consent": onBoardingData?.bank_details_consent ? "Yes" : "No",
      },
    });
  }

  // Identity
  sections.push({
    title: "Identity",
    data: {
      "ID Type": onBoardingData?.identity_card_type,
      "ID Number":
        onBoardingData?.identity_card_number ||
        (onBoardingData?.national_identification_number ? "•••••••••••" : null),
    },
  });

  // Documents
  sections.push({
    title: "Documents",
    data: {
      "Identity Card":
        onBoardingData?.identity_card || onBoardingData?.director_identity_cards
          ? "✓ Uploaded"
          : "Not uploaded",
      "CAC Document": onBoardingData?.cac_document
        ? "✓ Uploaded"
        : accountType === "corporate"
          ? "Not uploaded"
          : "N/A",
      Passport:
        onBoardingData?.passport_photograph ||
        onBoardingData?.director_passport_photograph
          ? "✓ Uploaded"
          : "Not uploaded",
      Signature: onBoardingData?.scanned_signature
        ? "✓ Uploaded"
        : accountType === "individual"
          ? "Not uploaded"
          : "N/A",
      "NIN Document": onBoardingData?.nin_document
        ? "✓ Uploaded"
        : onBoardingData?.identity_card_type === "National Identity Number"
          ? "Not uploaded"
          : "N/A",
    },
  });

  // Beneficiaries (for employee group life)
  if (onBoardingData?.beneficiaries) {
    const beneficiariesData: any = {};
    onBoardingData.beneficiaries.forEach((b: any, index: number) => {
      beneficiariesData[`Beneficiary ${index + 1}`] =
        `${b.first_name} ${b.last_name} (${b.percentage_allocation}%)`;
    });
    sections.push({
      title: "Beneficiaries",
      data: beneficiariesData,
    });
  }

  return (
    <div className="space-y-8">
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          Review Your Information
        </h3>
        <p className="text-sm text-gray-500">
          Please review all information before submitting. You can go back to
          make changes.
        </p>
      </div>

      {/* Summary Cards */}
      <div className="space-y-4">
        {sections.map((section, idx) => {
          const Icon =
            sectionIcons[section.title as keyof typeof sectionIcons] ||
            FileText;
          const isExpanded = expandedSection === section.title;

          return (
            <motion.div
              key={section.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="bg-white border border-gray-200 rounded-xl overflow-hidden"
            >
              {/* Section Header */}
              <button
                onClick={() =>
                  setExpandedSection(isExpanded ? null : section.title)
                }
                className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                    <Icon className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900 text-left">
                      {section.title}
                    </h4>
                    <p className="text-xs text-gray-500 text-left">
                      {Object.keys(section.data).length} items
                    </p>
                  </div>
                </div>
                <ChevronRight
                  className={cn(
                    "w-5 h-5 text-gray-400 transition-transform",
                    isExpanded && "rotate-90",
                  )}
                />
              </button>

              {/* Section Details */}
              {isExpanded && (
                <motion.div
                  initial={{ height: 0 }}
                  animate={{ height: "auto" }}
                  exit={{ height: 0 }}
                  className="border-t border-gray-200 px-6 py-4"
                >
                  <dl className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {Object.entries(section.data).map(([key, value]) => (
                      <div
                        key={key}
                        className={cn(
                          "space-y-1",
                          typeof value === "string" &&
                            value.includes("Not") &&
                            "text-amber-600",
                        )}
                      >
                        <dt className="text-xs text-gray-500">{key}</dt>
                        <dd className="text-sm font-medium text-gray-900">
                          {renderValue(value)}
                        </dd>
                      </div>
                    ))}
                  </dl>
                </motion.div>
              )}
            </motion.div>
          );
        })}
      </div>

      {/* Declaration */}
      <div className="bg-blue-50 rounded-xl p-6">
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center shrink-0">
            <Check className="w-4 h-4 text-blue-600" />
          </div>
          <div>
            <p className="text-sm font-medium text-blue-900">Declaration</p>
            <p className="text-xs text-blue-700 mt-1">
              I hereby declare that all the information provided is true and
              correct to the best of my knowledge. I understand that providing
              false information may result in rejection of my application or
              cancellation of any policy issued.
            </p>
          </div>
        </div>
      </div>

      {/* Navigation Buttons */}
      <div className="flex items-center justify-between pt-6 border-t border-gray-200">
        <button
          onClick={onBack}
          disabled={isSubmitting}
          className="px-8 py-3 rounded-xl font-medium text-gray-600 hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Back
        </button>
        <button
          onClick={handleSubmit}
          disabled={isSubmitting}
          className={cn(
            "px-8 py-3 rounded-xl font-medium transition-all flex items-center gap-2",
            "bg-linear-to-l  -to-r from-blue-600 to-emerald-600 text-white hover:shadow-lg hover:scale-105",
            isSubmitting && "opacity-70 cursor-not-allowed hover:scale-100",
          )}
        >
          {isSubmitting ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Submitting...
            </>
          ) : (
            "Submit Application"
          )}
        </button>
      </div>
    </div>
  );
}
