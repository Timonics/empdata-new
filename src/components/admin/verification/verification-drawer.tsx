"use client";

import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  User,
  Building2,
  Mail,
  Phone,
  Calendar,
  Shield,
  FileText,
  CheckCircle,
  XCircle,
  Clock,
  Download,
  X,
} from "lucide-react";
import { cn, formatDateSafe } from "@/lib/utils";

interface VerificationDrawerProps {
  verification: any;
  type: "nin" | "document" | "company" | "cac";
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

// Normalize a verification record from the API (snake_case) into the
// camelCase shape this drawer consumes, tolerating either convention.
function resolveVerification(v: any) {
  if (!v) return null;
  const status = v.nin_verification_status || v.verification_status || v.status;
  return {
    ...v,
    firstName: v.first_name ?? v.firstName ?? "",
    lastName: v.last_name ?? v.lastName ?? "",
    name: v.name ?? [v.first_name, v.last_name].filter(Boolean).join(" ") ?? "",
    // NIN is encrypted at rest; never render the ciphertext
    nin: v.nin ?? (v.encrypted_nin || v.nin_number_data ? "•••••••••••" : ""),
    bvn:
      v.bvn ??
      (v.director_bvn_number
        ? "••••••" + String(v.director_bvn_number).slice(-4)
        : ""),
    dateOfBirth: v.date_of_birth ?? v.dateOfBirth ?? "",
    company: v.company_name ?? v.company ?? "",
    email: v.email_address ?? v.email ?? "",
    phone: v.phone_number ?? v.phone ?? "",
    ninSubmitted: v.submitted_at ?? v.ninSubmitted ?? null,
    verifiedAt: v.verified_at ?? v.nin_verified_at ?? v.verifiedAt ?? null,
    failureReason: v.rejection_reason ?? v.failure_reason ?? v.failureReason ?? "",
    attempts: v.attempts ?? v.verification_attempts ?? null,
    verificationStatus: status,
    status,
  };
}

const statusStyles = {
  pending: "bg-yellow-100 text-yellow-800 border-yellow-200",
  verified: "bg-green-100 text-green-800 border-green-200",
  failed: "bg-red-100 text-red-800 border-red-200",
  in_progress: "bg-blue-100 text-blue-800 border-blue-200",
  rejected: "bg-red-100 text-red-800 border-red-200",
};

export function VerificationDrawer({
  verification,
  type,
  open,
  onOpenChange,
}: VerificationDrawerProps) {
  const resolved = resolveVerification(verification);
  if (!resolved) return null;
  verification = resolved;

  const InfoRow = ({
    label,
    value,
    icon: Icon,
  }: {
    label: string;
    value: string;
    icon?: any;
  }) => (
    <div className="flex items-start gap-3 py-3 border-b border-border/70 last:border-0">
      {Icon && <Icon className="h-4 w-4 text-gray-400 mt-0.5 shrink-0" />}
      <div className="flex-1 min-w-0">
        <p className="text-xs text-muted-foreground">{label}</p>
        <p className="text-sm font-medium mt-0.5 wrap-break-word">
          {value || "—"}
        </p>
      </div>
    </div>
  );

  const SectionCard = ({
    title,
    children,
  }: {
    title: string;
    children: React.ReactNode;
  }) => (
    <div className="bg-muted/60 rounded-lg p-5">
      <h3 className="text-sm font-medium text-gray-700 mb-4">{title}</h3>
      <div className="space-y-1">{children}</div>
    </div>
  );

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-5xl lg:max-w-6xl xl:max-w-7xl max-w-[95vw]! p-0 overflow-y-auto [&>div]:max-w-none! data-[side=right]:max-w-none!">
        {/* Header */}
        <div className="bg-navy-900 text-white p-6 sticky top-0 z-20">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-4">
              <div className="h-14 w-14 rounded-full bg-white/20 flex items-center justify-center">
                {type === "nin" && <Shield className="h-7 w-7" />}
                {type === "document" && <FileText className="h-7 w-7" />}
                {type === "company" && <Building2 className="h-7 w-7" />}
              </div>
              <div>
                <SheetTitle className="text-white text-xl">
                  {type === "nin" &&
                    `${verification.firstName} ${verification.lastName}`}
                  {type === "document" && verification.type}
                  {type === "company" && verification.name}
                </SheetTitle>
                <p className="text-blue-100 text-sm mt-1">
                  {type === "nin" && `NIN: ${verification.nin}`}
                  {type === "document" && verification.fileName}
                  {type === "company" && `RC: ${verification.rcNumber}`}
                </p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onOpenChange(false)}
              className="text-white hover:bg-white/20"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>

          {/* Status */}
          <div className="flex items-center gap-3 mt-4">
            <Badge
              variant="outline"
              className={cn(
                "px-3 py-1",
                "bg-white/20 text-white border-white/30",
                statusStyles[verification.status as keyof typeof statusStyles],
              )}
            >
              {verification.status}
            </Badge>
            {verification.attempts && (
              <Badge
                variant="outline"
                className="bg-white/20 text-white border-white/30"
              >
                Attempt {verification.attempts}/3
              </Badge>
            )}
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {type === "nin" && (
            <>
              {/* Progress for NIN verification */}
              {verification.verificationStatus === "in_progress" && (
                <div className="bg-blue-50 p-4 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-blue-700">
                      Verification in Progress
                    </span>
                    <span className="text-sm text-blue-700">60%</span>
                  </div>
                  <Progress value={60} className="h-2 bg-blue-200" />
                </div>
              )}

              <div className="grid grid-cols-2 gap-6">
                <SectionCard title="Personal Information">
                  <InfoRow
                    label="First Name"
                    value={verification.firstName}
                    icon={User}
                  />
                  <InfoRow
                    label="Last Name"
                    value={verification.lastName}
                    icon={User}
                  />
                  <InfoRow
                    label="Date of Birth"
                    value={verification.dateOfBirth}
                    icon={Calendar}
                  />
                  <InfoRow
                    label="Company"
                    value={verification.company}
                    icon={Building2}
                  />
                </SectionCard>

                <SectionCard title="Contact Information">
                  <InfoRow
                    label="Email"
                    value={verification.email}
                    icon={Mail}
                  />
                  <InfoRow
                    label="Phone"
                    value={verification.phone}
                    icon={Phone}
                  />
                </SectionCard>
              </div>

              <SectionCard title="Verification Details">
                <InfoRow label="NIN" value={verification.nin} icon={Shield} />
                <InfoRow label="BVN" value={verification.bvn} icon={Shield} />
                <InfoRow
                  label="Submitted On"
                  value={formatDateSafe(verification.ninSubmitted, {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                  icon={Clock}
                />
                {verification.verifiedAt && (
                  <InfoRow
                    label="Verified On"
                    value={formatDateSafe(verification.verifiedAt, {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                    icon={CheckCircle}
                  />
                )}
                {verification.failureReason && (
                  <InfoRow
                    label="Failure Reason"
                    value={verification.failureReason}
                    icon={XCircle}
                  />
                )}
              </SectionCard>
            </>
          )}

          {/* Action buttons */}
          {verification.status === "pending" && (
            <div className="flex items-center gap-3 pt-4 border-t">
              <Button className="flex-1 bg-green-600 hover:bg-green-700">
                <CheckCircle className="h-4 w-4 mr-2" />
                Approve Verification
              </Button>
              <Button className="flex-1" variant="destructive">
                <XCircle className="h-4 w-4 mr-2" />
                Reject
              </Button>
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
