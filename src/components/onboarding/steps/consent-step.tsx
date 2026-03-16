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
        <h3 className="text-lg font-medium text-gray-900 mb-2">Consent & Agreement</h3>
        <p className="text-sm text-gray-500">
          Please review and agree to our terms to complete your registration
        </p>
      </div>

      {/* Privacy & Security Highlights */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-blue-50 rounded-xl p-6 text-center">
          <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center mx-auto mb-4">
            <Shield className="w-6 h-6 text-blue-600" />
          </div>
          <h4 className="font-medium text-gray-900 mb-2">Data Protection</h4>
          <p className="text-xs text-gray-600">
            Your data is encrypted and handled in compliance with NDPR
          </p>
        </div>

        <div className="bg-emerald-50 rounded-xl p-6 text-center">
          <div className="w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-4">
            <Lock className="w-6 h-6 text-emerald-600" />
          </div>
          <h4 className="font-medium text-gray-900 mb-2">Secure Processing</h4>
          <p className="text-xs text-gray-600">
            All information is processed securely and confidentially
          </p>
        </div>

        <div className="bg-purple-50 rounded-xl p-6 text-center">
          <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center mx-auto mb-4">
            <FileText className="w-6 h-6 text-purple-600" />
          </div>
          <h4 className="font-medium text-gray-900 mb-2">Legal Compliance</h4>
          <p className="text-xs text-gray-600">
            We adhere to all applicable insurance regulations
          </p>
        </div>
      </div>

      {/* Full Consent Text */}
      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
        <button
          onClick={() => setShowFullConsent(!showFullConsent)}
          className="w-full px-6 py-4 flex items-center justify-between bg-gray-50 hover:bg-gray-100 transition-colors"
        >
          <span className="font-medium text-gray-900">Full Consent Agreement</span>
          <ChevronDown className={cn(
            "w-5 h-5 text-gray-500 transition-transform",
            showFullConsent && "rotate-180"
          )} />
        </button>

        {showFullConsent && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="px-6 py-4 border-t border-gray-200"
          >
            <div className="prose prose-sm max-w-none text-gray-600 space-y-4">
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

              <div className="bg-amber-50 p-4 rounded-lg">
                <p className="text-sm font-medium text-amber-800 mb-2">Your Rights:</p>
                <ul className="text-sm text-amber-700 space-y-1 list-disc list-inside">
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
      <div className="bg-gray-50 rounded-xl p-6">
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
                : "bg-white border-gray-300 hover:border-blue-500"
            )}>
              {consentChecked && <Check className="w-4 h-4 text-white" />}
            </div>
          </div>
          <div className="flex-1">
            <p className="text-sm text-gray-700">
              I have read and agree to the terms and conditions, privacy policy, 
              and consent to the processing of my personal data as described above.
              <span className="text-red-500 ml-1">*</span>
            </p>
            <p className="text-xs text-gray-500 mt-2">
              By checking this box, you confirm that all information provided is accurate 
              and you consent to its use for insurance purposes.
            </p>
          </div>
        </label>
      </div>

      {/* Data Processing Notice */}
      {/* <div className="flex items-center gap-3 text-sm text-gray-500 bg-white p-4 rounded-xl border border-gray-200">
        <Eye className="w-5 h-5 text-gray-400" />
        <p>
          You can review all information on the next page before final submission.
        </p>
      </div> */}

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
          disabled={!consentChecked}
          className={cn(
            "px-8 py-3 rounded-xl font-medium transition-all",
            consentChecked
              ? "bg-linear-to-r from-blue-600 to-emerald-600 text-white hover:shadow-lg hover:scale-105"
              : "bg-gray-100 text-gray-400 cursor-not-allowed"
          )}
        >
          Continue
        </button>
      </div>
    </div>
  );
}