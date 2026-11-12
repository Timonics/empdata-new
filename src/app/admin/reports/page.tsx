// app/admin/reports/page.tsx
"use client";

import { useState } from "react";
import { format } from "date-fns";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Building2,
  Users,
  User,
  Download,
  Loader2,
  FileSpreadsheet,
} from "lucide-react";
import { useRegistrationStatusSummary } from "@/hooks/queries/useAnalytics";
import { ExportApiService, type ExportEntity } from "@/services/export.service";
import { toast } from "sonner";
import { toFiniteNumber } from "@/lib/utils";

const ENTITY_LABELS: Record<ExportEntity, string> = {
  "company-registrations": "Company Registrations",
  "employee-registrations": "Employee Registrations",
  "individual-registrations": "Individual Registrations",
  "portal-employees": "Employees",
};

interface ExportCardProps {
  entity: ExportEntity;
  icon: typeof Building2;
  description: string;
}

function ExportCard({ entity, icon: Icon, description }: ExportCardProps) {
  const [status, setStatus] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [isExporting, setIsExporting] = useState(false);

  const handleExport = async () => {
    setIsExporting(true);
    try {
      const params: Record<string, string> = {};
      if (status) params.status = status;
      if (fromDate) params.from_date = fromDate;
      if (toDate) params.to_date = toDate;

      let blob: Blob;
      switch (entity) {
        case "company-registrations":
          blob = await ExportApiService.exportCompanyRegistrations(params);
          break;
        case "employee-registrations":
          blob = await ExportApiService.exportEmployeeRegistrations(params);
          break;
        case "individual-registrations":
          blob = await ExportApiService.exportIndividualRegistrations(params);
          break;
        default:
          throw new Error(`Unsupported entity: ${entity}`);
      }

      ExportApiService.download(
        blob,
        `${entity}-${format(new Date(), "yyyy-MM-dd")}.csv`,
      );
      toast.success(`${ENTITY_LABELS[entity]} exported successfully`);
    } catch (error: any) {
      toast.error(error.message || `Failed to export ${ENTITY_LABELS[entity]}`);
    } finally {
      setIsExporting(false);
    }
  };

  const statusOptions: Array<{ value: string; label: string }> =
    entity === "individual-registrations"
      ? [
          { value: "pending", label: "Pending" },
          { value: "approved", label: "Approved" },
          { value: "verified", label: "Verified" },
          { value: "rejected", label: "Rejected" },
        ]
      : [
          { value: "pending_approval", label: "Pending Approval" },
          { value: "approved", label: "Approved" },
          { value: "rejected", label: "Rejected" },
        ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Icon className="h-5 w-5 text-brand-600" />
          {ENTITY_LABELS[entity]}
        </CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          <div className="space-y-1.5">
            <Label className="text-xs">Status</Label>
            <Select value={status} onValueChange={setStatus}>
              <SelectTrigger>
                <SelectValue placeholder="All statuses" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All statuses</SelectItem>
                {statusOptions.map((o) => (
                  <SelectItem key={o.value} value={o.value}>
                    {o.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs">From Date</Label>
            <Input
              type="date"
              value={fromDate}
              onChange={(e) => setFromDate(e.target.value)}
            />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs">To Date</Label>
            <Input
              type="date"
              value={toDate}
              onChange={(e) => setToDate(e.target.value)}
            />
          </div>
        </div>
        <Button
          onClick={handleExport}
          disabled={isExporting}
          className="w-full"
        >
          {isExporting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Exporting...
            </>
          ) : (
            <>
              <Download className="mr-2 h-4 w-4" />
              Export CSV
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  );
}

export default function ReportsPage() {
  const { data: summary } = useRegistrationStatusSummary();

  const companies = toFiniteNumber(summary?.company_registrations?.total);
  const employees = toFiniteNumber(summary?.employee_registrations?.total);

  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-3xl font-bold">Reports</h1>
        <p className="text-muted-foreground">
          Export registration data as CSV with filters
        </p>
      </div>

      {/* Live snapshot from real analytics */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Company Registrations
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{companies.toLocaleString()}</p>
            <Badge variant="outline" className="mt-1">
              Live
            </Badge>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Employee Registrations
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{employees.toLocaleString()}</p>
            <Badge variant="outline" className="mt-1">
              Live
            </Badge>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Combined Total
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">
              {toFiniteNumber(summary?.combined_total).toLocaleString()}
            </p>
            <Badge variant="outline" className="mt-1">
              Live
            </Badge>
          </CardContent>
        </Card>
      </div>

      {/* Export center — every card hits a real documented CSV endpoint */}
      <div className="flex items-center gap-2">
        <FileSpreadsheet className="h-5 w-5 text-brand-600" />
        <h2 className="text-lg font-semibold">Export Center</h2>
      </div>
      <div className="grid gap-4 lg:grid-cols-3">
        <ExportCard
          entity="company-registrations"
          icon={Building2}
          description="Company and director KYC submissions, approvals, and status history."
        />
        <ExportCard
          entity="employee-registrations"
          icon={Users}
          description="Employee group-life enrollments with verification states."
        />
        <ExportCard
          entity="individual-registrations"
          icon={User}
          description="Individual / retail policy registrations and outcomes."
        />
      </div>
    </div>
  );
}
