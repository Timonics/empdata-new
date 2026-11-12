"use client";

import { useState, useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import {
  Building2,
  Mail,
  Phone,
  MapPin,
  User,
  Briefcase,
  FileText,
  Calendar,
  Users,
  Shield,
  Edit,
  Download,
  Printer,
  X,
  Save,
  Globe,
  Hash,
  AlertCircle,
} from "lucide-react";
import { cn, formatDateSafe, getYearSafe, joinAddress } from "@/lib/utils";
import { useCompany } from "@/hooks/queries/useCompanies";
import { DrawerLoading } from "../registrations/drawer-loading";
import { AddEmployeeModal } from "./add-employee-modal";

// Validation schema for company form
const companySchema = z.object({
  // Company Information
  name: z.string().min(2, "Company name is required"),
  rcNumber: z.string().min(5, "RC Number is required"),
  taxId: z.string().optional(),
  website: z.string().url().optional().or(z.literal("")),

  // Contact Information
  email: z.string().email("Valid email is required"),
  phone: z.string().min(10, "Valid phone number is required"),
  address: z.string().min(5, "Address is required"),
  city: z.string().min(2, "City is required"),
  state: z.string().min(2, "State is required"),
  country: z.string().min(2, "Country is required"),

  // Insurance Details
  insuranceType: z.string().min(1, "Insurance type is required"),
  status: z.enum(["active", "inactive", "pending", "suspended"]),

  // Admin Information
  adminName: z.string().min(2, "Admin name is required"),
  adminEmail: z.string().email("Valid admin email is required"),
  adminPhone: z.string().min(10, "Valid admin phone is required"),
  adminPosition: z.string().optional(),
});

type CompanyFormValues = z.infer<typeof companySchema>;

interface CompanyDrawerProps {
  company: any;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mode: "view" | "edit";
  onModeChange?: (mode: "view" | "edit") => void;
  onSave?: (data: any) => Promise<void>;
}

const statusStyles = {
  active: "bg-green-100 text-green-800 border-green-200",
  inactive: "bg-muted text-foreground border-border",
  pending: "bg-yellow-100 text-yellow-800 border-yellow-200",
  suspended: "bg-red-100 text-red-800 border-red-200",
};

const statusOptions = [
  { value: "active", label: "Active", color: "green" },
  { value: "inactive", label: "Inactive", color: "gray" },
  { value: "pending", label: "Pending", color: "yellow" },
  { value: "suspended", label: "Suspended", color: "red" },
];

// Normalize a company record from the API (snake_case) into the camelCase
// shape this drawer consumes, tolerating either naming convention.
function resolveCompany(c: any) {
  if (!c) return null;
  return {
    ...c,
    name: c.company_name ?? c.name ?? "",
    rcNumber: c.rc_number ?? c.rcNumber ?? "",
    taxId: c.tax_id ?? c.taxId ?? "",
    website: c.website ?? "",
    email: c.email ?? "",
    phone: c.phone ?? "",
    address: c.address ?? c.house_address ?? "",
    city: c.city ?? "",
    state: c.state ?? "",
    country: c.country ?? "",
    insuranceType: c.insurance_type ?? c.insuranceType ?? "",
    adminName: c.admin_name ?? c.adminName ?? "",
    adminEmail: c.admin_email ?? c.adminEmail ?? "",
    adminPhone: c.admin_phone ?? c.adminPhone ?? "",
    adminPosition: c.admin_position ?? c.adminPosition ?? "",
    joinedDate: c.joined_date ?? c.joinedDate ?? c.created_at ?? null,
    employees: c.employees_count ?? c.employees ?? 0,
    policies: c.policies_count ?? c.policies ?? 0,
    createdAt: c.created_at ?? c.createdAt ?? null,
    updatedAt: c.updated_at ?? c.updatedAt ?? null,
  };
}

const insuranceOptions = [
  { value: "Group Life", label: "Group Life" },
  { value: "Health Insurance", label: "Health Insurance" },
  { value: "Group Life + Health", label: "Group Life + Health" },
  { value: "Group Life + Education", label: "Group Life + Education" },
  { value: "Education Plan", label: "Education Plan" },
  { value: "Individual Life", label: "Individual Life" },
  { value: "Corporate Insurance", label: "Corporate Insurance" },
];

export function CompanyDrawer({
  company: initialCompany,
  open,
  onOpenChange,
  mode,
  onModeChange,
  onSave,
}: CompanyDrawerProps) {
  const [activeTab, setActiveTab] = useState("overview");
  const [isSaving, setIsSaving] = useState(false);
  const [showAddEmployee, setShowAddEmployee] = useState(false);

  // Fetch the full company record when the drawer opens
  const { data: detail, isLoading: isDetailLoading } = useCompany(
    open && initialCompany?.id ? initialCompany.id : 0,
  );

  // Memoized so the form-reset effect doesn't fire on every render
  const initialResolved = useMemo(() => resolveCompany(initialCompany), [initialCompany]);
  const company = useMemo(
    () =>
      detail
        ? { ...initialResolved, ...resolveCompany(detail) }
        : initialResolved,
    [detail, initialResolved],
  );

  const form = useForm<CompanyFormValues>({
    resolver: zodResolver(companySchema),
    defaultValues: {
      name: "",
      rcNumber: "",
      taxId: "",
      website: "",
      email: "",
      phone: "",
      address: "",
      city: "",
      state: "",
      country: "Nigeria",
      insuranceType: "",
      status: "active",
      adminName: "",
      adminEmail: "",
      adminPhone: "",
      adminPosition: "",
    },
  });

  // Reset form when company changes
  useEffect(() => {
    if (company) {
      form.reset({
        name: company.name || "",
        rcNumber: company.rcNumber || "",
        taxId: company.taxId || "",
        website: company.website || "",
        email: company.email || "",
        phone: company.phone || "",
        address: company.address || "",
        city: company.city || "",
        state: company.state || "",
        country: company.country || "Nigeria",
        insuranceType: company.insuranceType || "",
        status: company.status || "active",
        adminName: company.adminName || "",
        adminEmail: company.adminEmail || "",
        adminPhone: company.adminPhone || "",
        adminPosition: company.adminPosition || "",
      });
    }
  }, [company, form]);

  const handleSubmit = async (data: CompanyFormValues) => {
    setIsSaving(true);
    try {
      if (onSave) {
        await onSave({
          company_name: data.name,
          rc_number: data.rcNumber,
          tax_id: data.taxId,
          website: data.website,
          email: data.email,
          phone: data.phone,
          address: data.address,
          city: data.city,
          state: data.state,
          country: data.country,
          insurance_type: data.insuranceType,
          status: data.status,
          admin_name: data.adminName,
          admin_email: data.adminEmail,
          admin_phone: data.adminPhone,
          admin_position: data.adminPosition,
        });
      }
      onModeChange?.("view");
    } catch (error) {
      console.error("Error saving company:", error);
    } finally {
      setIsSaving(false);
    }
  };

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

  const EditField = ({
    name,
    label,
    icon: Icon,
    type = "text",
    placeholder,
  }: any) => (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel className="text-xs text-muted-foreground">{label}</FormLabel>
          <FormControl>
            <div className="relative">
              {Icon && (
                <Icon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              )}
              <Input
                {...field}
                type={type}
                placeholder={placeholder}
                className={Icon ? "pl-9" : ""}
              />
            </div>
          </FormControl>
          <FormMessage className="text-xs" />
        </FormItem>
      )}
    />
  );

  if (!company) return null;

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-5xl lg:max-w-6xl xl:max-w-7xl max-w-[95vw]! p-0 overflow-y-auto [&>div]:max-w-none data-[side=right]:max-w-none">
        <div className="bg-navy-900 text-white p-8 sticky top-0 z-20">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-4">
              <div className="h-16 w-16 rounded-full bg-white/20 flex items-center justify-center">
                <Building2 className="h-8 w-8" />
              </div>
              <div>
                <SheetTitle className="text-white text-2xl">
                  {company.name}
                </SheetTitle>
                <p className="text-blue-100 text-sm mt-1">
                  RC: {company.rcNumber || "—"}
                  {getYearSafe(company.joinedDate) !== null &&
                    " • Since " + getYearSafe(company.joinedDate)}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {mode === "view" ? (
                <Button
                  variant="ghost"
                  size="default"
                  onClick={() => onModeChange?.("edit")}
                  className="text-white hover:bg-white/20"
                >
                  <Edit className="h-4 w-4 mr-2" />
                  Edit Company
                </Button>
              ) : (
                <Button
                  variant="ghost"
                  size="default"
                  onClick={() => onModeChange?.("view")}
                  className="text-white hover:bg-white/20"
                >
                  <X className="h-4 w-4 mr-2" />
                  Cancel Edit
                </Button>
              )}
              <Button
                variant="ghost"
                size="icon"
                onClick={() => onOpenChange(false)}
                className="text-white hover:bg-white/20"
              >
                <X className="h-5 w-5" />
              </Button>
            </div>
          </div>

          {/* Status badges */}
          <div className="flex items-center gap-3 mt-6">
            <Badge
              variant="outline"
              className={cn(
                "px-3 py-1 text-sm",
                "bg-white/20 text-white border-white/30",
                statusStyles[company.status as keyof typeof statusStyles],
              )}
            >
              {company.status}
            </Badge>
            <Badge
              variant="outline"
              className="px-3 py-1 text-sm bg-white/20 text-white border-white/30"
            >
              {company.insuranceType}
            </Badge>
            <Badge
              variant="outline"
              className="px-3 py-1 text-sm bg-white/20 text-white border-white/30"
            >
              {company.employees} Employees
            </Badge>
          </div>
        </div>
        {/* Tabs navigation - sticky */}
        <div className="border-b px-8 sticky top-35 bg-card z-10">
          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="w-full"
          >
            <TabsList className="w-full justify-start h-auto p-0 bg-transparent">
              <TabsTrigger
                value="overview"
                className="data-[state=active]:border-b-2 data-[state=active]:border-blue-600 rounded-none px-6 py-4 text-sm font-medium"
              >
                Overview
              </TabsTrigger>
              <TabsTrigger
                value="employees"
                className="data-[state=active]:border-b-2 data-[state=active]:border-blue-600 rounded-none px-6 py-4 text-sm font-medium"
              >
                Employees
              </TabsTrigger>
              <TabsTrigger
                value="policies"
                className="data-[state=active]:border-b-2 data-[state=active]:border-blue-600 rounded-none px-6 py-4 text-sm font-medium"
              >
                Policies
              </TabsTrigger>
              <TabsTrigger
                value="documents"
                className="data-[state=active]:border-b-2 data-[state=active]:border-blue-600 rounded-none px-6 py-4 text-sm font-medium"
              >
                Documents
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
        {/* Tab content */}
        <div className="p-8">
          {isDetailLoading ? (
            <DrawerLoading />
          ) : (
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            {/* Overview Tab */}
            <TabsContent value="overview" className="mt-0">
              {mode === "edit" ? (
                // Edit Mode Form
                <Form {...form}>
                  <form
                    onSubmit={form.handleSubmit(handleSubmit)}
                    className="space-y-8"
                  >
                    {/* Company Information */}
                    <SectionCard title="Company Information">
                      <div className="grid grid-cols-2 gap-4">
                        <EditField
                          name="name"
                          label="Company Name"
                          icon={Building2}
                        />
                        <EditField
                          name="rcNumber"
                          label="RC Number"
                          icon={Hash}
                        />
                        <EditField
                          name="taxId"
                          label="Tax ID"
                          icon={FileText}
                        />
                        <EditField
                          name="website"
                          label="Website"
                          icon={Globe}
                          type="url"
                          placeholder="https://"
                        />
                      </div>
                    </SectionCard>

                    {/* Contact Information */}
                    <SectionCard title="Contact Information">
                      <div className="grid grid-cols-2 gap-4">
                        <EditField
                          name="email"
                          label="Email"
                          icon={Mail}
                          type="email"
                        />
                        <EditField name="phone" label="Phone" icon={Phone} />
                        <div className="col-span-2">
                          <EditField
                            name="address"
                            label="Street Address"
                            icon={MapPin}
                          />
                        </div>
                        <EditField name="city" label="City" />
                        <EditField name="state" label="State" />
                        <EditField name="country" label="Country" />
                      </div>
                    </SectionCard>

                    {/* Insurance Details */}
                    <SectionCard title="Insurance Details">
                      <div className="grid grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name="insuranceType"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Insurance Type</FormLabel>
                              <Select
                                onValueChange={field.onChange}
                                defaultValue={field.value}
                              >
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select insurance type" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  {insuranceOptions.map((option) => (
                                    <SelectItem
                                      key={option.value}
                                      value={option.value}
                                    >
                                      {option.label}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="status"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Status</FormLabel>
                              <Select
                                onValueChange={field.onChange}
                                defaultValue={field.value}
                              >
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select status" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  {statusOptions.map((option) => (
                                    <SelectItem
                                      key={option.value}
                                      value={option.value}
                                    >
                                      <div className="flex items-center gap-2">
                                        <div
                                          className={cn(
                                            "h-2 w-2 rounded-full",
                                            option.color === "green" &&
                                              "bg-green-500",
                                            option.color === "gray" &&
                                              "bg-gray-500",
                                            option.color === "yellow" &&
                                              "bg-yellow-500",
                                            option.color === "red" &&
                                              "bg-red-500",
                                          )}
                                        />
                                        {option.label}
                                      </div>
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    </SectionCard>

                    {/* Admin Information */}
                    <SectionCard title="Admin Account">
                      <div className="grid grid-cols-2 gap-4">
                        <EditField
                          name="adminName"
                          label="Admin Name"
                          icon={User}
                        />
                        <EditField
                          name="adminPosition"
                          label="Position"
                          icon={Briefcase}
                        />
                        <EditField
                          name="adminEmail"
                          label="Admin Email"
                          icon={Mail}
                          type="email"
                        />
                        <EditField
                          name="adminPhone"
                          label="Admin Phone"
                          icon={Phone}
                        />
                      </div>
                    </SectionCard>

                    {/* Form Actions */}
                    <div className="flex items-center justify-end gap-3 sticky bottom-0 bg-card py-4 border-t">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => onModeChange?.("view")}
                      >
                        Cancel
                      </Button>
                      <Button type="submit" disabled={isSaving}>
                        {isSaving ? (
                          <>
                            <div className="animate-spin mr-2 h-4 w-4 border-2 border-white border-t-transparent rounded-full" />
                            Saving...
                          </>
                        ) : (
                          <>
                            <Save className="h-4 w-4 mr-2" />
                            Save Changes
                          </>
                        )}
                      </Button>
                    </div>
                  </form>
                </Form>
              ) : (
                // View Mode
                <div className="space-y-6">
                  {/* Key Statistics */}
                  <div className="grid grid-cols-4 gap-4">
                    <div className="bg-blue-50 p-4 rounded-lg text-center">
                      <Users className="h-6 w-6 text-blue-500 mx-auto mb-2" />
                      <p className="text-2xl font-bold">{company.employees}</p>
                      <p className="text-xs text-muted-foreground">Employees</p>
                    </div>
                    <div className="bg-green-50 p-4 rounded-lg text-center">
                      <Shield className="h-6 w-6 text-green-500 mx-auto mb-2" />
                      <p className="text-2xl font-bold">{company.policies}</p>
                      <p className="text-xs text-muted-foreground">Policies</p>
                    </div>
                    <div className="bg-purple-50 p-4 rounded-lg text-center">
                      <Calendar className="h-6 w-6 text-purple-500 mx-auto mb-2" />
                      <p className="text-2xl font-bold">
                        {getYearSafe(company.joinedDate) !== null
                          ? Math.max(
                              0,
                              new Date().getFullYear() -
                                (getYearSafe(company.joinedDate) || 0),
                            )
                          : "—"}
                      </p>
                      <p className="text-xs text-muted-foreground">Years Active</p>
                    </div>
                    <div className="bg-orange-50 p-4 rounded-lg text-center">
                      <AlertCircle className="h-6 w-6 text-orange-500 mx-auto mb-2" />
                      <p className="text-2xl font-bold text-base wrap-break-word">
                        {company.insuranceType || "—"}
                      </p>
                      <p className="text-xs text-muted-foreground">Plan Type</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-6">
                    {/* Left Column */}
                    <div className="space-y-6">
                      <SectionCard title="Company Details">
                        <InfoRow
                          label="Company Name"
                          value={company.name}
                          icon={Building2}
                        />
                        <InfoRow
                          label="RC Number"
                          value={company.rcNumber}
                          icon={Hash}
                        />
                        <InfoRow
                          label="Tax ID"
                          value={company.taxId || "Not provided"}
                          icon={FileText}
                        />
                        <InfoRow
                          label="Website"
                          value={company.website || "Not provided"}
                          icon={Globe}
                        />
                      </SectionCard>

                      <SectionCard title="Contact Information">
                        <InfoRow
                          label="Email"
                          value={company.email}
                          icon={Mail}
                        />
                        <InfoRow
                          label="Phone"
                          value={company.phone}
                          icon={Phone}
                        />
                        <InfoRow
                          label="Address"
                          value={joinAddress([
                            company.address,
                            company.city,
                            company.state,
                            company.country,
                          ])}
                          icon={MapPin}
                        />
                      </SectionCard>
                    </div>

                    {/* Right Column */}
                    <div className="space-y-6">
                      <SectionCard title="Admin Account">
                        <InfoRow
                          label="Name"
                          value={company.adminName}
                          icon={User}
                        />
                        <InfoRow
                          label="Position"
                          value={company.adminPosition || "Administrator"}
                          icon={Briefcase}
                        />
                        <InfoRow
                          label="Email"
                          value={company.adminEmail}
                          icon={Mail}
                        />
                        <InfoRow
                          label="Phone"
                          value={company.adminPhone}
                          icon={Phone}
                        />
                      </SectionCard>

                      <SectionCard title="Activity">
                        <InfoRow
                          label="Joined Date"
                          value={formatDateSafe(company.joinedDate)}
                          icon={Calendar}
                        />
                        <InfoRow
                          label="Last Updated"
                          value={formatDateSafe(company.updatedAt)}
                          icon={Calendar}
                        />
                      </SectionCard>
                    </div>
                  </div>
                </div>
              )}
            </TabsContent>

            {/* Employees Tab */}
            <TabsContent value="employees" className="mt-0">
              <div className="text-center py-16 bg-muted/60 rounded-lg">
                <Users className="h-16 w-16 mx-auto text-gray-300 mb-4" />
                <h3 className="text-lg font-medium mb-2">
                  Employee Management
                </h3>
                <p className="text-sm text-muted-foreground mb-6">
                  This company has {company.employees} employees across various
                  departments
                </p>
                <div className="flex items-center justify-center gap-3">
                  <Button asChild>
                    <a href="/admin/employees">View All Employees</a>
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => setShowAddEmployee(true)}
                  >
                    Add Employee
                  </Button>
                </div>
              </div>
            </TabsContent>

            {/* Policies Tab */}
            <TabsContent value="policies" className="mt-0">
              <div className="text-center py-16 bg-muted/60 rounded-lg">
                <Shield className="h-16 w-16 mx-auto text-gray-300 mb-4" />
                <h3 className="text-lg font-medium mb-2">Insurance Policies</h3>
                <p className="text-sm text-muted-foreground mb-6">
                  This company has {company.policies} active insurance policies
                </p>
                <Button>View All Policies</Button>
              </div>
            </TabsContent>

            {/* Documents Tab */}
            <TabsContent value="documents" className="mt-0">
              <div className="text-center py-16 bg-muted/60 rounded-lg">
                <FileText className="h-16 w-16 mx-auto text-gray-300 mb-4" />
                <h3 className="text-lg font-medium mb-2">Company Documents</h3>
                <p className="text-sm text-muted-foreground mb-6">
                  CAC registration, tax certificates, and other official
                  documents
                </p>
                <div className="flex items-center justify-center gap-3">
                  <Button variant="outline">
                    <Download className="h-4 w-4 mr-2" />
                    Download All
                  </Button>
                  <Button variant="outline">
                    <Printer className="h-4 w-4 mr-2" />
                    Print
                  </Button>
                </div>
              </div>
            </TabsContent>
          </Tabs>
          )}
        </div>
        {/* Add Employee Modal */}
        {company.id && (
          <AddEmployeeModal
            companyId={company.id}
            companyName={company.name}
            open={showAddEmployee}
            onOpenChange={setShowAddEmployee}
          />
        )}

        {/* Footer with actions - sticky */}
        {mode === "view" && (
          <div className="border-t p-6 bg-muted/60 sticky bottom-0">
            <div className="flex items-center justify-between">
              <div className="text-sm text-muted-foreground">
                <span className="font-medium">Last updated:</span>{" "}
                {formatDateSafe(company.updatedAt, {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                })}
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="default"
                  onClick={() => onOpenChange(false)}
                >
                  Close
                </Button>
                <Button size="default" onClick={() => onModeChange?.("edit")}>
                  <Edit className="h-4 w-4 mr-2" />
                  Edit Company
                </Button>
              </div>
            </div>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}
