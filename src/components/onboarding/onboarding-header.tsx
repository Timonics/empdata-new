'use client';

import { motion } from 'framer-motion';
import { Building2, User, Users } from 'lucide-react';
import type { AccountType } from '@/types/onboarding.types';

interface OnboardingHeaderProps {
  title: string;
  icon: string;
  stepNumber: number;
  totalSteps: number;
  accountType: AccountType | null;
}

export function OnboardingHeader({
  title,
  icon,
  stepNumber,
  totalSteps,
  accountType,
}: OnboardingHeaderProps) {
  const getAccountTypeIcon = () => {
    if (accountType === 'corporate') return <Building2 className="w-5 h-5" />;
    return <User className="w-5 h-5" />;
  };

  const getAccountTypeLabel = () => {
    if (accountType === 'corporate') return 'Corporate';
    if(accountType === "employee-group-life") return 'Employee Group Life'
    return 'Individual';
  };

  return (
    <div className="flex items-center justify-between border-b border-gray-200 pb-6">
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-full bg-linear-to-r from-blue-600 to-emerald-600 flex items-center justify-center text-white text-2xl">
          {icon}
        </div>
        <div>
          <h2 className="text-2xl font-bold text-gray-900">{title}</h2>
          <div className="flex items-center gap-2 mt-1">
            {accountType && (
              <>
                <div className="flex items-center gap-1 text-sm text-gray-600 bg-gray-100 px-3 py-1 rounded-full">
                  {getAccountTypeIcon()}
                  <span className="capitalize">{getAccountTypeLabel()}</span>
                </div>
                <span className="text-gray-300">•</span>
              </>
            )}
            <span className="text-sm text-gray-500">
              Step {stepNumber} of {totalSteps}
            </span>
          </div>
        </div>
      </div>
      <motion.div
        className="text-4xl font-bold text-gray-200"
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.2 }}
      >
        {String(stepNumber).padStart(2, '0')}
      </motion.div>
    </div>
  );
}