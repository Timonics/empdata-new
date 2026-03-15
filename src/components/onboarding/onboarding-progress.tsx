'use client';

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Check } from 'lucide-react';
import type { AccountType } from '@/types/onboarding.types';

interface OnboardingProgressProps {
  steps: Array<{ id: string; title: string; icon: string }>;
  currentStep: number;
  accountType: AccountType | null;
}

export function OnboardingProgress({ steps, currentStep, accountType }: OnboardingProgressProps) {
  return (
    <div className="mb-8">
      <div className="flex items-center justify-between">
        {steps.map((step, index) => {
          const isCompleted = index < currentStep;
          const isCurrent = index === currentStep;
          
          return (
            <div key={step.id} className="flex-1 last:flex-none">
              <div className="flex items-center">
                <div className="relative">
                  <motion.div
                    className={cn(
                      "w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold transition-all",
                      isCompleted
                        ? "bg-linear-to-r from-blue-600 to-emerald-600 text-white"
                        : isCurrent
                        ? "bg-blue-100 text-blue-600 border-2 border-blue-600"
                        : "bg-gray-100 text-gray-400"
                    )}
                    initial={false}
                    animate={{
                      scale: isCurrent ? 1.1 : 1,
                    }}
                  >
                    {isCompleted ? (
                      <Check className="w-5 h-5" />
                    ) : (
                      <span>{step.icon}</span>
                    )}
                  </motion.div>
                  {index < steps.length - 1 && (
                    <div className="absolute top-5 left-10 w-full h-0.5 bg-gray-200 -z-10">
                      <motion.div
                        className="h-full bg-linear-to-r from-blue-600 to-emerald-600"
                        initial={{ width: 0 }}
                        animate={{
                          width: isCompleted ? '100%' : '0%',
                        }}
                        transition={{ duration: 0.3 }}
                      />
                    </div>
                  )}
                </div>
                <div className="ml-3 hidden sm:block">
                  <p
                    className={cn(
                      "text-sm font-medium",
                      isCurrent ? "text-blue-600" : "text-gray-500"
                    )}
                  >
                    {step.title}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}