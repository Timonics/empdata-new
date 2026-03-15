'use client';

import { motion } from 'framer-motion';
import { User, Building2, Users, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { AccountType } from '@/types/onboarding.types';

interface AccountTypeStepProps {
  accountType: AccountType | null;
  setAccountType: (type: AccountType) => void;
  onNext: () => void;
  onBoardingData: any;
  setOnBoardingData: (data: any) => void;
}

const accountTypes = [
  {
    id: 'individual' as AccountType,
    title: 'Individual',
    description: 'For individuals seeking personal insurance coverage',
    icon: User,
    color: 'blue',
    gradient: 'from-blue-600 to-blue-400',
  },
  {
    id: 'corporate' as AccountType,
    title: 'Corporate',
    description: 'For companies and organizations',
    icon: Building2,
    color: 'purple',
    gradient: 'from-purple-600 to-purple-400',
  },
  {
    id: 'employee-group-life' as AccountType,
    title: 'Employee Group Life',
    description: 'For employees registering under their company',
    icon: Users,
    color: 'emerald',
    gradient: 'from-emerald-600 to-emerald-400',
  },
];

export function AccountTypeStep({
  accountType,
  setAccountType,
  onNext,
  setOnBoardingData,
}: AccountTypeStepProps) {
  const handleSelect = (type: AccountType) => {
    setAccountType(type);
    setOnBoardingData((prev: any) => ({
      ...prev,
      account_type: type,
    }));
  };

  const handleContinue = () => {
    if (accountType) {
      onNext();
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">Choose your account type</h3>
        <p className="text-sm text-gray-500">
          Select the type of account you want to create. This will determine the information we need from you.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {accountTypes.map((type) => {
          const Icon = type.icon;
          const isSelected = accountType === type.id;

          return (
            <motion.div
              key={type.id}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleSelect(type.id)}
              className={cn(
                "relative cursor-pointer rounded-2xl border-2 p-6 transition-all",
                isSelected
                  ? `border-${type.color}-500 bg-${type.color}-50`
                  : "border-gray-200 hover:border-gray-300 bg-white"
              )}
            >
              {isSelected && (
                <motion.div
                  layoutId="selectedIndicator"
                  className={cn(
                    "absolute inset-0 rounded-2xl bg-linear-to-br opacity-10",
                    type.gradient
                  )}
                  initial={false}
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                />
              )}
              
              <div className="relative">
                <div
                  className={cn(
                    "w-16 h-16 rounded-2xl flex items-center justify-center mb-4",
                    `bg-${type.color}-100`
                  )}
                >
                  <Icon className={cn("w-8 h-8", `text-${type.color}-600`)} />
                </div>
                
                <h4 className="text-lg font-semibold text-gray-900 mb-2">
                  {type.title}
                </h4>
                
                <p className="text-sm text-gray-500 mb-4">
                  {type.description}
                </p>

                {isSelected && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={cn(
                      "inline-flex items-center gap-2 text-sm font-medium",
                      `text-${type.color}-600`
                    )}
                  >
                    Selected
                    <ChevronRight className="w-4 h-4" />
                  </motion.div>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>

      <div className="flex justify-end pt-6 border-t border-gray-200">
        <button
          onClick={handleContinue}
          disabled={!accountType}
          className={cn(
            "px-8 py-3 rounded-xl font-medium transition-all flex items-center gap-2",
            accountType
              ? "bg-linear-to-r from-blue-600 to-emerald-600 text-white hover:shadow-lg hover:scale-105"
              : "bg-gray-100 text-gray-400 cursor-not-allowed"
          )}
        >
          Continue
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}