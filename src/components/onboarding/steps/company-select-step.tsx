"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, Search, Building2, Check, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { useActiveCompanies } from "@/hooks/queries/useOnboarding";

interface CompanySelectStepProps {
  onNext: () => void;
  onBack: () => void;
  onBoardingData: any;
  setOnBoardingData: (data: any) => void;
}

export function CompanySelectStep({
  onNext,
  onBack,
  onBoardingData,
  setOnBoardingData,
}: CompanySelectStepProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const { data: companies, isLoading } = useActiveCompanies();

  const filteredCompanies = companies?.filter((company) =>
    company.name.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const selectedCompany = companies?.find(
    (c) => c.id === onBoardingData?.company_id,
  );

  const handleSelect = (companyId: number, companyName: string) => {
    setOnBoardingData((prev: any) => ({
      ...prev,
      company_id: companyId,
      company_name: companyName,
    }));
    setIsOpen(false);
    setSearchQuery("");
  };

  const handleContinue = () => {
    if (onBoardingData?.company_id) {
      onNext();
    }
  };

  return (
    <div className={cn("space-y-8", isOpen && "h-125")}>
      <div>
        <h3 className="text-lg font-medium text-foreground mb-2">
          Select Your Company
        </h3>
        <p className="text-sm text-muted-foreground">
          Choose the company you are registering under for Group Life insurance
        </p>
      </div>
      <div className="max-w-xl mx-auto">
        {/* Dropdown Trigger */}
        <div className="relative">
          <button
            onClick={() => !isLoading && setIsOpen(!isOpen)}
            disabled={isLoading}
            className={cn(
              "w-full p-4 bg-card border-2 rounded-xl flex items-center justify-between transition-all",
              isOpen
                ? "border-blue-500 ring-4 ring-blue-100"
                : selectedCompany
                  ? "border-green-500 bg-green-50"
                  : "border-border hover:border-muted-foreground/40",
              isLoading && "opacity-50 cursor-not-allowed",
            )}
          >
            <div className="flex items-center gap-3">
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin text-muted-foreground/70" />
                  <span className="text-muted-foreground/70">Loading companies...</span>
                </>
              ) : selectedCompany ? (
                <>
                  <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
                    <Check className="w-4 h-4 text-green-600" />
                  </div>
                  <span className="font-medium text-foreground">
                    {selectedCompany.name}
                  </span>
                </>
              ) : (
                <span className="text-muted-foreground/70">Select your company</span>
              )}
            </div>
            {!isLoading && (
              <ChevronDown
                className={cn(
                  "w-5 h-5 text-muted-foreground/70 transition-transform",
                  isOpen && "rotate-180",
                )}
              />
            )}
          </button>

          {/* Dropdown Menu */}
          <AnimatePresence>
            {isOpen && !isLoading && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="absolute z-50 w-full mt-2 bg-card border border-border rounded-xl shadow-xl overflow-hidden"
              >
                {/* Search Input */}
                <div className="p-3 border-b border-border">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/70" />
                    <input
                      type="text"
                      placeholder="Search companies..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      autoFocus
                    />
                  </div>
                </div>

                {/* Options List */}
                <div className="max-h-64 overflow-y-auto">
                  {filteredCompanies && filteredCompanies.length > 0 ? (
                    filteredCompanies.map((company, index) => (
                      <motion.button
                        key={company.id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: index * 0.05 }}
                        onClick={() => handleSelect(company.id, company.name)}
                        className="w-full px-4 py-3 text-left hover:bg-muted/60 transition-colors border-b border-border/70 last:border-0"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                            <Building2 className="w-4 h-4 text-blue-600" />
                          </div>
                          <div>
                            <p className="font-medium text-foreground">
                              {company.name}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {company.email}
                            </p>
                          </div>
                        </div>
                      </motion.button>
                    ))
                  ) : (
                    <div className="p-8 text-center">
                      <p className="text-sm text-muted-foreground">
                        No companies found
                      </p>
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
      {/* Navigation Buttons */}
      <div className="flex items-center justify-between pt-6 border-t border-border">
        <button
          onClick={onBack}
          className="px-8 py-3 rounded-xl font-medium text-muted-foreground hover:bg-muted transition-colors"
        >
          Back
        </button>
        <button
          onClick={handleContinue}
          disabled={!onBoardingData?.company_id}
          className={cn(
            "px-8 py-3 rounded-xl font-medium transition-all",
            onBoardingData?.company_id
              ? "bg-primary text-primary-foreground shadow-sm hover:bg-brand-700"
              : "bg-muted text-muted-foreground/70 cursor-not-allowed",
          )}
        >
          Continue
        </button>
      </div>
    </div>
  );
}
