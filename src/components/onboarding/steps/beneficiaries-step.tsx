"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import {
  Plus,
  Trash2,
  Users,
  Calendar,
  MapPin,
  Percent,
  AlertCircle,
  Check,
  HelpCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import type { Beneficiary } from "@/types/onboarding.types";

interface BeneficiariesStepProps {
  onNext: () => void;
  onBack: () => void;
  onBoardingData: any;
  setOnBoardingData: (data: any) => void;
}

const relationships = [
  "Spouse",
  "Child",
  "Parent",
  "Sibling",
  "Grandparent",
  "Grandchild",
  "Nephew",
  "Niece",
  "Friend",
  "Other",
];

export function BeneficiariesStep({
  onNext,
  onBack,
  onBoardingData,
  setOnBoardingData,
}: BeneficiariesStepProps) {
  const [openRelationship, setOpenRelationship] = useState<number | null>(null);

  // Initialize beneficiaries from onBoardingData or create empty array
  const beneficiaries: Beneficiary[] = onBoardingData?.beneficiaries || [
    {
      id: 1,
      first_name: "",
      last_name: "",
      address: "",
      date_of_birth: "",
      percentage_allocation: 0,
    },
  ];

  const handleAddBeneficiary = () => {
    if (beneficiaries.length >= 5) {
      toast.error("Maximum of 5 beneficiaries allowed");
      return;
    }

    const newId = Math.max(...beneficiaries.map((b) => b.id || 0)) + 1;
    const newBeneficiary: Beneficiary = {
      id: newId,
      first_name: "",
      last_name: "",
      address: "",
      date_of_birth: "",
      percentage_allocation: 0,
    };

    const updatedBeneficiaries = [...beneficiaries, newBeneficiary];

    setOnBoardingData((prev: any) => ({
      ...prev,
      beneficiaries: updatedBeneficiaries,
    }));
  };

  const handleRemoveBeneficiary = (id: number) => {
    if (beneficiaries.length <= 1) {
      toast.error("At least one beneficiary is required");
      return;
    }

    const updatedBeneficiaries = beneficiaries.filter((b) => b.id !== id);

    setOnBoardingData((prev: any) => ({
      ...prev,
      beneficiaries: updatedBeneficiaries,
    }));
  };

  const updateBeneficiary = (
    id: number,
    field: keyof Beneficiary,
    value: any,
  ) => {
    const updatedBeneficiaries = beneficiaries.map((beneficiary) => {
      if (beneficiary.id === id) {
        return { ...beneficiary, [field]: value };
      }
      return beneficiary;
    });

    setOnBoardingData((prev: any) => ({
      ...prev,
      beneficiaries: updatedBeneficiaries,
    }));
  };

  // Calculate total percentage
  const totalPercentage = beneficiaries.reduce((total, beneficiary) => {
    return total + (beneficiary.percentage_allocation || 0);
  }, 0);

  // Validate percentage input
  const validatePercentage = (id: number, value: string) => {
    const numValue = parseFloat(value);

    if (value === "") {
      updateBeneficiary(id, "percentage_allocation", 0);
      return;
    }

    if (isNaN(numValue) || numValue < 0 || numValue > 100) {
      toast.error("Percentage must be between 0 and 100");
      return;
    }

    // Check if adding this would exceed 100%
    const otherBeneficiariesTotal = beneficiaries
      .filter((b) => b.id !== id)
      .reduce((total, b) => total + (b.percentage_allocation || 0), 0);

    if (otherBeneficiariesTotal + numValue > 100) {
      toast.error(
        `Total cannot exceed 100%. Current total: ${otherBeneficiariesTotal}%`,
      );
      return;
    }

    updateBeneficiary(id, "percentage_allocation", numValue);
  };

  const isFormValid = () => {
    if (beneficiaries.length === 0) return false;

    const allValid = beneficiaries.every(
      (b) =>
        b.first_name &&
        b.last_name &&
        b.address &&
        b.date_of_birth &&
        b.percentage_allocation > 0,
    );

    return allValid && Math.abs(totalPercentage - 100) < 0.01; // Allow small floating point error
  };

  return (
    <div className="space-y-8">
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          Beneficiaries
        </h3>
        <p className="text-sm text-gray-500">
          Add the people who will receive the insurance benefits. You can add up
          to 5 beneficiaries.
        </p>
      </div>

      {/* Total Percentage Indicator */}
      <div className="bg-linear-to-r from-blue-50 to-emerald-50 rounded-xl p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Users className="w-5 h-5 text-blue-600" />
            <span className="font-semibold text-gray-900">
              Total Allocation:
            </span>
          </div>
          <div className="flex items-center gap-3">
            <span
              className={cn(
                "text-2xl font-bold",
                Math.abs(totalPercentage - 100) < 0.01
                  ? "text-green-600"
                  : "text-red-600",
              )}
            >
              {totalPercentage.toFixed(1)}%
            </span>
            <div className="w-32 h-2 bg-gray-200 rounded-full overflow-hidden">
              <motion.div
                className={cn(
                  "h-full",
                  Math.abs(totalPercentage - 100) < 0.01
                    ? "bg-green-500"
                    : "bg-blue-500",
                )}
                initial={{ width: 0 }}
                animate={{ width: `${totalPercentage}%` }}
                transition={{ duration: 0.3 }}
              />
            </div>
          </div>
        </div>

        {Math.abs(totalPercentage - 100) > 0.01 && (
          <div
            className={cn(
              "p-3 rounded-lg flex items-start gap-2",
              totalPercentage < 100 ? "bg-yellow-50" : "bg-red-50",
            )}
          >
            <AlertCircle
              className={cn(
                "w-4 h-4 mt-0.5",
                totalPercentage < 100 ? "text-yellow-600" : "text-red-600",
              )}
            />
            <p
              className={cn(
                "text-xs",
                totalPercentage < 100 ? "text-yellow-700" : "text-red-700",
              )}
            >
              {totalPercentage < 100
                ? `Total allocation is ${totalPercentage.toFixed(1)}%. You need to allocate ${(100 - totalPercentage).toFixed(1)}% more.`
                : `Total allocation exceeds 100% (${totalPercentage.toFixed(1)}%). Please adjust the percentages.`}
            </p>
          </div>
        )}
      </div>

      {/* Beneficiaries List */}
      <div className="space-y-6">
        <AnimatePresence>
          {beneficiaries.map((beneficiary, index) => (
            <motion.div
              key={beneficiary.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, x: -100 }}
              transition={{ duration: 0.3 }}
              className="bg-white border border-gray-200 rounded-xl overflow-hidden"
            >
              {/* Header */}
              <div className="bg-gray-50 px-6 py-4 border-b border-gray-200 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                    <span className="text-sm font-bold text-blue-600">
                      {index + 1}
                    </span>
                  </div>
                  <h4 className="font-medium text-gray-900">
                    Beneficiary {index + 1}
                  </h4>
                </div>
                {beneficiaries.length > 1 && (
                  <button
                    onClick={() => handleRemoveBeneficiary(beneficiary.id!)}
                    className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>

              {/* Form Fields */}
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* First Name */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">
                      First Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={beneficiary.first_name}
                      onChange={(e) =>
                        updateBeneficiary(
                          beneficiary.id!,
                          "first_name",
                          e.target.value,
                        )
                      }
                      placeholder="Enter first name"
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  {/* Last Name */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">
                      Last Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={beneficiary.last_name}
                      onChange={(e) =>
                        updateBeneficiary(
                          beneficiary.id!,
                          "last_name",
                          e.target.value,
                        )
                      }
                      placeholder="Enter last name"
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  {/* Date of Birth */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">
                      Date of Birth <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <DatePicker
                        selected={
                          beneficiary.date_of_birth
                            ? new Date(beneficiary.date_of_birth)
                            : null
                        }
                        onChange={(date: any) =>
                          updateBeneficiary(
                            beneficiary.id!,
                            "date_of_birth",
                            date?.toISOString(),
                          )
                        }
                        dateFormat="MMMM d, yyyy"
                        placeholderText="Select date of birth"
                        className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        showYearDropdown
                        scrollableYearDropdown
                        maxDate={new Date()}
                      />
                    </div>
                  </div>

                  {/* Percentage Allocation */}
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <label className="text-sm font-medium text-gray-700">
                        Percentage Allocation{" "}
                        <span className="text-red-500">*</span>
                      </label>
                      <Tooltip>
                        <TooltipTrigger>
                          <HelpCircle className="w-4 h-4 text-gray-400 cursor-help" />
                        </TooltipTrigger>
                        <TooltipContent>
                          Percentage of total benefit this beneficiary will
                          receive
                        </TooltipContent>
                      </Tooltip>
                    </div>
                    <div className="relative">
                      <Percent className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input
                        type="number"
                        min="0"
                        max="100"
                        step="1"
                        value={beneficiary.percentage_allocation || ""}
                        onChange={(e) =>
                          validatePercentage(beneficiary.id!, e.target.value)
                        }
                        placeholder="Enter percentage"
                        className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                  </div>

                  {/* Address */}
                  <div className="space-y-2 md:col-span-2">
                    <label className="text-sm font-medium text-gray-700">
                      Address <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input
                        type="text"
                        value={beneficiary.address}
                        onChange={(e) =>
                          updateBeneficiary(
                            beneficiary.id!,
                            "address",
                            e.target.value,
                          )
                        }
                        placeholder="Enter residential address"
                        className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Add Beneficiary Button */}
      {beneficiaries.length < 5 && (
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleAddBeneficiary}
          className="w-full py-4 border-2 border-dashed border-gray-300 rounded-xl hover:border-blue-500 hover:bg-blue-50 transition-all flex items-center justify-center gap-2 text-gray-600 hover:text-blue-600"
        >
          <Plus className="w-5 h-5" />
          <span className="font-medium">Add Another Beneficiary</span>
          <span className="text-sm text-gray-400 ml-2">
            ({beneficiaries.length}/5)
          </span>
        </motion.button>
      )}

      {/* Summary */}
      {beneficiaries.some(
        (b) => b.percentage_allocation && b.percentage_allocation > 0,
      ) && (
        <div className="bg-gray-50 rounded-xl p-6">
          <h4 className="font-medium text-gray-900 mb-4">
            Distribution Summary
          </h4>
          <div className="space-y-3">
            {beneficiaries
              .filter(
                (b) => b.percentage_allocation && b.percentage_allocation > 0,
              )
              .map((beneficiary) => (
                <div
                  key={beneficiary.id}
                  className="flex items-center justify-between py-2 border-b border-gray-200 last:border-0"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                      <span className="text-xs font-bold text-blue-600">
                        {beneficiary.first_name?.[0]}
                        {beneficiary.last_name?.[0]}
                      </span>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        {beneficiary.first_name} {beneficiary.last_name}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-lg font-bold text-blue-600">
                      {beneficiary.percentage_allocation}%
                    </span>
                    <div className="w-20 h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-blue-600"
                        style={{
                          width: `${beneficiary.percentage_allocation}%`,
                        }}
                      />
                    </div>
                  </div>
                </div>
              ))}

            <div className="pt-4 flex items-center justify-between font-bold">
              <span>Total Allocation</span>
              <span
                className={cn(
                  "text-lg",
                  Math.abs(totalPercentage - 100) < 0.01
                    ? "text-green-600"
                    : "text-red-600",
                )}
              >
                {totalPercentage.toFixed(1)}%
              </span>
            </div>
          </div>
        </div>
      )}

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
          disabled={!isFormValid()}
          className={cn(
            "px-8 py-3 rounded-xl font-medium transition-all",
            isFormValid()
              ? "bg-linear-to-r from-blue-600 to-emerald-600 text-white hover:shadow-lg hover:scale-105"
              : "bg-gray-100 text-gray-400 cursor-not-allowed",
          )}
        >
          Continue
        </button>
      </div>
    </div>
  );
}
