"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  CheckCircle2,
  XCircle,
  AlertCircle,
  Loader2,
  User,
  Calendar,
  MapPin,
  Mail,
  Phone,
  Building2,
  Hash,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface VerificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  type: "nin" | "cac";
  verificationData: any;
  userData: any;
  isLoading: boolean;
}

export function VerificationModal({
  isOpen,
  onClose,
  onConfirm,
  type,
  verificationData,
  userData,
  isLoading,
}: VerificationModalProps) {
  const [matchStatus, setMatchStatus] = useState<{
    nameMatch: boolean;
    dobMatch: boolean;
  }>({ nameMatch: false, dobMatch: false });

  useEffect(() => {
    if (verificationData && userData) {
      // Compare names
      const verificationName = `${verificationData.first_name || ""} ${verificationData.last_name || ""}`.toLowerCase();
      const userName = `${userData.first_name || ""} ${userData.last_name || ""}`.toLowerCase();
      const nameMatch = verificationName === userName || 
                        verificationData.first_name?.toLowerCase() === userData.first_name?.toLowerCase();

      // Compare DOB
      const verificationDob = verificationData.date_of_birth;
      const userDob = userData.date_of_birth;
      const dobMatch = verificationDob === userDob;

      setMatchStatus({ nameMatch, dobMatch });
    }
  }, [verificationData, userData]);

  const allMatch = matchStatus.nameMatch && matchStatus.dobMatch;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {type === "nin" ? (
              <>
                <span className="text-2xl">🇳🇬</span>
                NIN Verification
              </>
            ) : (
              <>
                <Building2 className="h-5 w-5 text-blue-600" />
                CAC Verification
              </>
            )}
          </DialogTitle>
          <DialogDescription>
            {type === "nin"
              ? "We've verified your NIN against official records. Please confirm the details match."
              : "We've verified your CAC registration. Please confirm the company details match."}
          </DialogDescription>
        </DialogHeader>

        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
            <p className="mt-4 text-sm text-gray-600">Verifying your details...</p>
          </div>
        ) : (
          <>
            <div className="space-y-4 py-4">
              {/* Verification Details */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="font-medium text-gray-900 mb-3">
                  {type === "nin" ? "NIN Records" : "CAC Records"}
                </h4>
                <div className="space-y-2">
                  {type === "nin" ? (
                    <>
                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-2 text-gray-600">
                          <User className="h-4 w-4" />
                          <span>Full Name:</span>
                        </div>
                        <span className="font-medium text-gray-900">
                          {verificationData?.first_name} {verificationData?.last_name}
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-2 text-gray-600">
                          <Calendar className="h-4 w-4" />
                          <span>Date of Birth:</span>
                        </div>
                        <span className="font-medium text-gray-900">
                          {verificationData?.date_of_birth}
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-2 text-gray-600">
                          <span className="font-medium">Gender:</span>
                        </div>
                        <span className="font-medium text-gray-900">
                          {verificationData?.gender || "Not specified"}
                        </span>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-2 text-gray-600">
                          <Building2 className="h-4 w-4" />
                          <span>Company Name:</span>
                        </div>
                        <span className="font-medium text-gray-900">
                          {verificationData?.company_name}
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-2 text-gray-600">
                          <Hash className="h-4 w-4" />
                          <span>RC Number:</span>
                        </div>
                        <span className="font-medium text-gray-900">
                          {verificationData?.rc_number}
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-2 text-gray-600">
                          <MapPin className="h-4 w-4" />
                          <span>Address:</span>
                        </div>
                        <span className="font-medium text-gray-900">
                          {verificationData?.address}
                        </span>
                      </div>
                    </>
                  )}
                </div>
              </div>

              {/* Match Status */}
              {type === "nin" && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Name Match:</span>
                    {matchStatus.nameMatch ? (
                      <Badge className="bg-green-100 text-green-800">
                        <CheckCircle2 className="h-3 w-3 mr-1" />
                        Matches
                      </Badge>
                    ) : (
                      <Badge variant="destructive" className="bg-red-100 text-red-800">
                        <XCircle className="h-3 w-3 mr-1" />
                        Mismatch
                      </Badge>
                    )}
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Date of Birth Match:</span>
                    {matchStatus.dobMatch ? (
                      <Badge className="bg-green-100 text-green-800">
                        <CheckCircle2 className="h-3 w-3 mr-1" />
                        Matches
                      </Badge>
                    ) : (
                      <Badge variant="destructive" className="bg-red-100 text-red-800">
                        <XCircle className="h-3 w-3 mr-1" />
                        Mismatch
                      </Badge>
                    )}
                  </div>
                </div>
              )}

              {/* Warning Message */}
              {type === "nin" && !allMatch && (
                <div className="bg-amber-50 rounded-lg p-3 flex items-start gap-2">
                  <AlertCircle className="h-4 w-4 text-amber-600 mt-0.5" />
                  <p className="text-sm text-amber-800">
                    Some information doesn't match. Please review your details or contact support if this is incorrect.
                  </p>
                </div>
              )}
            </div>

            <DialogFooter className="flex gap-2">
              <Button variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button
                onClick={onConfirm}
                disabled={type === "nin" && !allMatch}
                className={cn(
                  "bg-linear-to-r from-blue-600 to-emerald-600 hover:from-blue-700 hover:to-emerald-700",
                  type === "nin" && !allMatch && "opacity-50 cursor-not-allowed"
                )}
              >
                <CheckCircle2 className="h-4 w-4 mr-2" />
                {type === "nin" ? "Confirm & Continue" : "Confirm CAC"}
              </Button>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}