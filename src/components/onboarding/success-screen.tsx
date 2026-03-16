"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  CheckCircle,
  Mail,
  ArrowRight,
  Building2,
  User,
  Users,
} from "lucide-react";
import confetti from "canvas-confetti";
import type { AccountType } from "@/types/onboarding.types";

interface SuccessScreenProps {
  accountType: AccountType | null;
}

export function SuccessScreen({ accountType }: SuccessScreenProps) {
  const router = useRouter();

  useEffect(() => {
    // Trigger confetti animation
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
      colors: ["#3b82f6", "#10b981", "#8b5cf6", "#f59e0b"],
    });

    // Auto redirect after 5 seconds
    const timer = setTimeout(() => {
      router.push("/");
    }, 5000);

    return () => clearTimeout(timer);
  }, [router]);

  const getIcon = () => {
    switch (accountType) {
      case "corporate":
        return Building2;
      default:
        return User;
    }
  };

  const getTitle = () => {
    switch (accountType) {
      case "corporate":
        return "Company Registration Submitted!";
      default:
        return "Individual Registration Submitted!";
    }
  };

  const getMessage = () => {
    switch (accountType) {
      case "corporate":
        return "Your company registration has been submitted successfully!";
        return "Your individual registration has been submitted successfully!";
    }
  };

  const getNextSteps = () => {
    switch (accountType) {
      case "corporate":
        return [
          "You'll receive a confirmation email with your application details",
          "Our team will review your company documents within 24-48 hours",
          "Once approved, the company admin will receive login credentials via email",
        ];
      default:
        return [
          "You'll receive a confirmation email with your application details",
          "Our team will review your documents within 24-48 hours",
          "Once approved, you'll receive login credentials via email",
        ];
    }
  };

  const Icon = getIcon();

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="min-h-150 flex items-center justify-center p-6"
    >
      <div className="max-w-md w-full text-center">
        {/* Success Icon */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
          className="mb-8"
        >
          <div className="w-24 h-24 rounded-full bg-linear-to-r from-green-400 to-emerald-500 mx-auto flex items-center justify-center">
            <CheckCircle className="w-12 h-12 text-white" />
          </div>
        </motion.div>

        {/* Success Message */}
        <motion.h2
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-3xl font-bold text-gray-900 mb-4"
        >
          {getTitle()}
        </motion.h2>

        <motion.p
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="text-gray-600 mb-8"
        >
          {getMessage()}
        </motion.p>

        {/* Account Type Card */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="bg-linear-to-r from-blue-600 to-emerald-600 text-white rounded-2xl p-6 mb-8"
        >
          <div className="w-16 h-16 rounded-full bg-white/20 mx-auto mb-4 flex items-center justify-center">
            <Icon className="w-8 h-8" />
          </div>
          <p className="text-lg font-semibold mb-2">
            {accountType === "individual" && "Individual Account"}
            {accountType === "corporate" && "Corporate Account"}
          </p>
          <p className="text-sm text-white/80">
            Your application is being reviewed
          </p>
        </motion.div>

        {/* What's Next */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="bg-gray-50 rounded-xl p-6 mb-8"
        >
          <h3 className="font-semibold text-gray-900 mb-4">What's Next?</h3>
          <div className="space-y-4">
            {getNextSteps().map((step, index) => (
              <div key={index} className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center shrink-0 mt-0.5">
                  <span className="text-xs font-bold text-blue-600">
                    {index + 1}
                  </span>
                </div>
                <p className="text-sm text-gray-600 text-left">{step}</p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Email Notice */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="flex items-center justify-center gap-2 text-sm text-gray-500 mb-8"
        >
          <Mail className="w-4 h-4" />
          <span>Check your email for confirmation</span>
        </motion.div>

        {/* Redirect Button */}
        <motion.button
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.8 }}
          onClick={() => router.push("/")}
          className="inline-flex items-center gap-2 px-6 py-3 bg-gray-900 text-white rounded-xl hover:bg-gray-800 transition-colors"
        >
          Go to Home
          <ArrowRight className="w-4 h-4" />
        </motion.button>

        <p className="text-xs text-gray-400 mt-4">
          You will be redirected automatically in 5 seconds
        </p>
      </div>
    </motion.div>
  );
}
