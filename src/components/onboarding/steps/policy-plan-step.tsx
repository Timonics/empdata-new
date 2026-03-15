"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, Search, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  individualPolicyPlans,
  corporatePolicyPlans,
} from "@/lib/onboarding/policy-plan";
import type { AccountType } from "@/types/onboarding.types";

interface PolicyPlanStepProps {
  accountType: AccountType | null;
  selectedPlan: string;
  setSelectedPlan: (plan: string) => void;
  onNext: () => void;
  onBack: () => void;
  onBoardingData: any;
  setOnBoardingData: (data: any) => void;
}

export function PolicyPlanStep({
  accountType,
  selectedPlan,
  setSelectedPlan,
  onNext,
  onBack,
  setOnBoardingData,
}: PolicyPlanStepProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const getPlans = () => {
    if (accountType === "individual") return individualPolicyPlans;
    if (accountType === "corporate" || accountType === "employee-group-life")
      return corporatePolicyPlans;
    return [];
  };

  const plans = getPlans();

  const filteredPlans = plans.filter((plan) =>
    plan.name.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const handleSelect = (planName: string) => {
    setSelectedPlan(planName);
    setOnBoardingData((prev: any) => ({
      ...prev,
      selected_plan: planName,
    }));
    setIsOpen(false);
    setSearchQuery("");
  };

  return (
    <div className={cn("space-y-8", isOpen && "h-125")}>
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          Choose Your Policy Plan
        </h3>
        <p className="text-sm text-gray-500">
          Select the insurance policy plan that best suits your needs
        </p>
      </div>

      <div className="max-w-xl mx-auto">
        {/* Dropdown Trigger */}
        <div className="relative">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className={cn(
              "w-full p-4 bg-white border-2 rounded-xl flex items-center justify-between transition-all",
              isOpen
                ? "border-blue-500 ring-4 ring-blue-100"
                : selectedPlan
                  ? "border-green-500 bg-green-50"
                  : "border-gray-200 hover:border-gray-300",
            )}
          >
            <div className="flex items-center gap-3">
              {selectedPlan ? (
                <>
                  <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
                    <Check className="w-4 h-4 text-green-600" />
                  </div>
                  <span className="font-medium text-gray-900">
                    {selectedPlan}
                  </span>
                </>
              ) : (
                <span className="text-gray-400">Select your policy plan</span>
              )}
            </div>
            <ChevronDown
              className={cn(
                "w-5 h-5 text-gray-400 transition-transform",
                isOpen && "rotate-180",
              )}
            />
          </button>

          {/* Dropdown Menu */}
          <AnimatePresence>
            {isOpen && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="absolute z-50 w-full mt-2 bg-white border border-gray-200 rounded-xl shadow-xl overflow-hidden"
              >
                {/* Search Input */}
                <div className="p-3 border-b border-gray-200">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search plans..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      autoFocus
                    />
                  </div>
                </div>

                {/* Options List */}
                <div className="max-h-64 overflow-y-auto">
                  {filteredPlans.length > 0 ? (
                    filteredPlans.map((plan, index) => (
                      <motion.button
                        key={index}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: index * 0.05 }}
                        onClick={() => handleSelect(plan.name)}
                        className="w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-0"
                      >
                        <p className="font-medium text-gray-900">{plan.name}</p>
                        <p className="text-xs text-gray-500 mt-1">
                          {plan.description}
                        </p>
                      </motion.button>
                    ))
                  ) : (
                    <div className="p-8 text-center">
                      <p className="text-sm text-gray-500">No plans found</p>
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
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
          disabled={!selectedPlan}
          className={cn(
            "px-8 py-3 rounded-xl font-medium transition-all",
            selectedPlan
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
