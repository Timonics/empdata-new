"use client";

import { useState } from "react";
import {
  Building2,
  Globe,
  MapPin,
  Phone,
  Mail,
  Hash,
  ChevronDown,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface CompanyInfoStepProps {
  onBoardingData: any;
  setOnBoardingData: (data: any) => void;
}

const countries = ["Nigeria", "Ghana", "Kenya", "South Africa", "Other"];
const states = [
  "Lagos",
  "Abuja FCT",
  "Rivers",
  "Oyo",
  "Kano",
  "Kaduna",
  "Delta",
  "Edo",
  "Ogun",
  "Anambra",
  "Enugu",
  "Cross River",
  "Others",
];

export function CompanyInfoStep({
  onBoardingData,
  setOnBoardingData,
}: CompanyInfoStepProps) {
  const [openCountry, setOpenCountry] = useState(false);
  const [openState, setOpenState] = useState(false);

  const handleChange = (field: string, value: any) => {
    setOnBoardingData((prev: any) => ({
      ...prev,
      [field]: value,
    }));
  };

  const isFormValid = () => {
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

    // Email confirmation
    if (
      onBoardingData?.email_address !== onBoardingData?.confirm_email_address
    ) {
      return false;
    }

    // Phone confirmation
    if (onBoardingData?.phone_number !== onBoardingData?.confirm_phone_number) {
      return false;
    }

    return required.every((field) => onBoardingData?.[field]);
  };

  return (
    <div className="space-y-8">
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          Company Information
        </h3>
        <p className="text-sm text-gray-500">
          Tell us about your company. This information will be used for your
          insurance policy.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 overflow-auto">
        {/* Company Name */}
        <div className="space-y-2 md:col-span-2">
          <label className="text-sm font-medium text-gray-700">
            Company Name <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              value={onBoardingData?.company_name || ""}
              onChange={(e) => handleChange("company_name", e.target.value)}
              placeholder="Enter your company name"
              className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* RC Number */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">
            RC Number <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <Hash className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              value={onBoardingData?.rc_number || ""}
              onChange={(e) => handleChange("rc_number", e.target.value)}
              placeholder="e.g., RC-123456"
              className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* TIN (Optional) */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">
            Tax Identification Number (Optional)
          </label>
          <div className="relative">
            <Hash className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              value={onBoardingData?.tax_identification_number || ""}
              onChange={(e) =>
                handleChange("tax_identification_number", e.target.value)
              }
              placeholder="Enter TIN if available"
              className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Business Email */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">
            Business Email <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="email"
              value={onBoardingData?.email_address || ""}
              onChange={(e) => handleChange("email_address", e.target.value)}
              placeholder="info@company.com"
              className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Confirm Email */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">
            Confirm Email <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="email"
              value={onBoardingData?.confirm_email_address || ""}
              onChange={(e) =>
                handleChange("confirm_email_address", e.target.value)
              }
              placeholder="Confirm business email"
              className={cn(
                "w-full pl-10 pr-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent",
                onBoardingData?.email_address &&
                  onBoardingData?.confirm_email_address &&
                  onBoardingData?.email_address !==
                    onBoardingData?.confirm_email_address
                  ? "border-red-300 bg-red-50"
                  : "border-gray-200",
              )}
            />
          </div>
          {onBoardingData?.email_address &&
            onBoardingData?.confirm_email_address &&
            onBoardingData?.email_address !==
              onBoardingData?.confirm_email_address && (
              <p className="text-xs text-red-500 mt-1">
                Email addresses do not match
              </p>
            )}
        </div>

        {/* Phone Number */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">
            Business Phone <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="tel"
              value={onBoardingData?.phone_number || ""}
              onChange={(e) => handleChange("phone_number", e.target.value)}
              placeholder="+234 801 234 5678"
              className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Confirm Phone */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">
            Confirm Phone <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="tel"
              value={onBoardingData?.confirm_phone_number || ""}
              onChange={(e) =>
                handleChange("confirm_phone_number", e.target.value)
              }
              placeholder="Confirm phone number"
              className={cn(
                "w-full pl-10 pr-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent",
                onBoardingData?.phone_number &&
                  onBoardingData?.confirm_phone_number &&
                  onBoardingData?.phone_number !==
                    onBoardingData?.confirm_phone_number
                  ? "border-red-300 bg-red-50"
                  : "border-gray-200",
              )}
            />
          </div>
          {onBoardingData?.phone_number &&
            onBoardingData?.confirm_phone_number &&
            onBoardingData?.phone_number !==
              onBoardingData?.confirm_phone_number && (
              <p className="text-xs text-red-500 mt-1">
                Phone numbers do not match
              </p>
            )}
        </div>

        {/* Secondary Phone (Optional) */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">
            Secondary Phone (Optional)
          </label>
          <div className="relative">
            <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="tel"
              value={onBoardingData?.secondary_phone || ""}
              onChange={(e) => handleChange("secondary_phone", e.target.value)}
              placeholder="Alternative contact number"
              className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Address */}
        <div className="space-y-2 md:col-span-2">
          <label className="text-sm font-medium text-gray-700">
            Business Address <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              value={onBoardingData?.house_address || ""}
              onChange={(e) => handleChange("house_address", e.target.value)}
              placeholder="Enter your business address"
              className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Previous Address (Optional) */}
        <div className="space-y-2 md:col-span-2">
          <label className="text-sm font-medium text-gray-700">
            Previous Address (Optional)
          </label>
          <div className="relative">
            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              value={onBoardingData?.previous_address || ""}
              onChange={(e) => handleChange("previous_address", e.target.value)}
              placeholder="Enter previous address if applicable"
              className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* City */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">
            City <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={onBoardingData?.city || ""}
            onChange={(e) => handleChange("city", e.target.value)}
            placeholder="e.g., Lagos"
            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        {/* State */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">
            State <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <button
              onClick={() => setOpenState(!openState)}
              className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl flex items-center justify-between hover:border-gray-300 transition-colors"
            >
              <span
                className={
                  onBoardingData?.state ? "text-gray-900" : "text-gray-400"
                }
              >
                {onBoardingData?.state || "Select state"}
              </span>
              <ChevronDown
                className={cn(
                  "w-4 h-4 text-gray-400",
                  openState && "rotate-180",
                )}
              />
            </button>
            {openState && (
              <div className="absolute z-20 w-full mt-1 bg-white border border-gray-200 rounded-xl shadow-lg max-h-48 overflow-y-auto">
                {states.map((state) => (
                  <button
                    key={state}
                    onClick={() => {
                      handleChange("state", state);
                      setOpenState(false);
                    }}
                    className="w-full px-4 py-2 text-left hover:bg-gray-50 transition-colors"
                  >
                    {state}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Country */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">
            Country <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <Globe className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <button
              onClick={() => setOpenCountry(!openCountry)}
              className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-xl flex items-center justify-between hover:border-gray-300 transition-colors"
            >
              <span
                className={
                  onBoardingData?.country ? "text-gray-900" : "text-gray-400"
                }
              >
                {onBoardingData?.country || "Select country"}
              </span>
              <ChevronDown
                className={cn(
                  "w-4 h-4 text-gray-400",
                  openCountry && "rotate-180",
                )}
              />
            </button>
            {openCountry && (
              <div className="absolute z-20 w-full mt-1 bg-white border border-gray-200 rounded-xl shadow-lg overflow-hidden">
                {countries.map((country) => (
                  <button
                    key={country}
                    onClick={() => {
                      handleChange("country", country);
                      setOpenCountry(false);
                    }}
                    className="w-full px-4 py-2 text-left hover:bg-gray-50 transition-colors"
                  >
                    {country}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Navigation Buttons */}
      {/* <div className="flex items-center justify-between pt-6 border-t border-gray-200">
        <button
          onClick={onBack}
          className="px-8 py-3 rounded-xl font-medium text-gray-600 hover:bg-gray-100 transition-colors"
        >
          Back
        </button>
        <button
          onClick={onNext}
          disabled={!isFormValid()}
          className={cn(
            "px-8 py-3 rounded-xl font-medium transition-all",
            isFormValid()
              ? "bg-linear-to-r from-blue-600 to-emerald-600 text-white hover:shadow-lg hover:scale-105"
              : "bg-gray-100 text-gray-400 cursor-not-allowed"
          )}
        >
          Continue
        </button>
      </div> */}
    </div>
  );
}
