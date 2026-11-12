'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Check, Shield, FileText, Lock, Eye, ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ConsentStepProps {
  onNext: () => void;
  onBack: () => void;
  onBoardingData: any;
  setOnBoardingData: (data: any) => void;
}

export function ConsentStep({
  onNext,
  onBack,
  onBoardingData,
  setOnBoardingData,
}: ConsentStepProps) {
  const [consentChecked, setConsentChecked] = useState(onBoardingData?.consent_checkbox || false);
  const [showFullConsent, setShowFullConsent] = useState(false);

  const handleConsentChange = (checked: boolean) => {
    setConsentChecked(checked);
    setOnBoardingData((prev: any) => ({
      ...prev,
      consent_checkbox: checked,
    }));
  };

  return (
    <div className="space-y-8">
      <div>
        <h3 className="text-lg font-medium text-foreground mb-2">Consent & Agreement</h3>
        <p className="text-sm text-muted-foreground">
          Please review and agree to our terms to complete your registration
        </p>
      </div>

      {/* Privacy & Security Highlights */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-card border border-border rounded-xl p-6 text-center shadow-card">
          <div className="flex size-12 items-center justify-center rounded-xl bg-gradient-to-br from-brand-500 to-brand-700 text-white shadow-md shadow-brand-600/25 mx-auto mb-4">
            <Shield className="size-6" />
          </div>
          <h4 className="font-medium text-foreground mb-2">Data Protection</h4>
          <p className="text-xs text-muted-foreground">
            Your data is encrypted and handled in compliance with NDPR
          </p>
        </div>

        <div className="bg-card border border-border rounded-xl p-6 text-center shadow-card">
          <div className="flex size-12 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-700 text-white shadow-md shadow-emerald-600/25 mx-auto mb-4">
            <Lock className="size-6" />
          </div>
          <h4 className="font-medium text-foreground mb-2">Secure Processing</h4>
          <p className="text-xs text-muted-foreground">
            All information is processed securely and confidentially
          </p>
        </div>

        <div className="bg-card border border-border rounded-xl p-6 text-center shadow-card">
          <div className="flex size-12 items-center justify-center rounded-xl bg-gradient-to-br from-purple-500 to-purple-700 text-white shadow-md shadow-purple-600/25 mx-auto mb-4">
            <FileText className="size-6" />
          </div>
          <h4 className="font-medium text-foreground mb-2">Legal Compliance</h4>
          <p className="text-xs text-muted-foreground">
            We adhere to all applicable insurance regulations
          </p>
        </div>
      </div>

      {/* Full Consent Text */}
      <div className="bg-card border border-border rounded-xl overflow-hidden">
        <button
          onClick={() => setShowFullConsent(!showFullConsent)}
          className="w-full px-6 py-4 flex items-center justify-between bg-muted/60 hover:bg-muted transition-colors"
        >
          <span className="font-medium text-foreground">Full Consent Agreement</span>
          <ChevronDown className={cn(
            "w-5 h-5 text-muted-foreground transition-transform",
            showFullConsent && "rotate-180"
          )} />
        </button>

        {showFullConsent && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="px-6 py-4 border-t border-border"
          >
            <div className="prose prose-sm max-w-none text-muted-foreground space-y-4">
              <p>
                I hereby consent to Scib Nigeria & Co. Limited collecting, processing, 
                and transferring my personal and employment information to the relevant 
                insurer(s) for the purpose of administering and managing the Group Life 
                Insurance Policy. I confirm that the information provided is true and 
                accurate to the best of my knowledge.
              </p>
              
              <p>
                I understand that my data is being collected and processed in compliance 
                with applicable legal and regulatory requirements, including data protection 
                and insurance regulations. All information will be handled confidentially 
                and in accordance with Scib's Data Protection and Privacy Policy and 
                applicable data protection laws.
              </p>
              
              <p>
                I further acknowledge that my data may be used for policy administration, 
                underwriting, claims processing, regulatory compliance, and related 
                communications.
              </p>

              <div className="bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 p-4 rounded-lg">
                <p className="text-sm font-medium text-amber-800 dark:text-amber-200 mb-2">Your Rights:</p>
                <ul className="text-sm text-amber-700 dark:text-amber-300 space-y-1 list-disc list-inside">
                  <li>Right to access your personal data</li>
                  <li>Right to rectify inaccurate information</li>
                  <li>Right to withdraw consent at any time</li>
                  <li>Right to lodge a complaint with NDPC</li>
                </ul>
              </div>
            </div>
          </motion.div>
        )}
      </div>

      {/* Consent Checkbox */}
      <div className="bg-muted/60 rounded-xl p-6">
        <label className="flex items-start gap-4 cursor-pointer">
          <div className="relative">
            <input
              type="checkbox"
              checked={consentChecked}
              onChange={(e) => handleConsentChange(e.target.checked)}
              className="sr-only"
            />
            <div className={cn(
              "w-6 h-6 rounded-md border-2 transition-all flex items-center justify-center",
              consentChecked
                ? "bg-blue-600 border-blue-600"
                : "bg-card border-border hover:border-blue-500"
            )}>
              {consentChecked && <Check className="w-4 h-4 text-white" />}
            </div>
          </div>
          <div className="flex-1">
            <p className="text-sm text-foreground/80">
              I have read and agree to the terms and conditions, privacy policy, 
              and consent to the processing of my personal data as described above.
              <span className="text-red-500 ml-1">*</span>
            </p>
            <p className="text-xs text-muted-foreground mt-2">
              By checking this box, you confirm that all information provided is accurate 
              and you consent to its use for insurance purposes.
            </p>
          </div>
        </label>
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
          onClick={onNext}
          disabled={!consentChecked}
          className={cn(
            "px-8 py-3 rounded-xl font-medium transition-all",
            consentChecked
              ? "bg-primary text-primary-foreground shadow-sm hover:bg-brand-700"
              : "bg-muted text-muted-foreground/70 cursor-not-allowed"
          )}
        >
          Continue
        </button>
      </div>
    </div>
  );
}