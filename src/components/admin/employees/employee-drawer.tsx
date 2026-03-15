"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet";
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
import {
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Users,
  Shield,
  Briefcase,
  Building2,
  Edit,
  Save,
  X,
  Hash,
  Heart,
  FileText,
} from "lucide-react";
import { cn } from "@/lib/utils";

// Validation schema for employee form
const employeeSchema = z.object({
  firstName: z.string().min(2, "First name is required"),
  lastName: z.string().min(2, "Last name is required"),
  email: z.string().email("Valid email is required"),
  phone: z.string().min(10, "Valid phone number is required"),
  employeeId: z.string().min(2, "Employee ID is required"),
  department: z.string().min(2, "Department is required"),
  position: z.string().min(2, "Position is required"),
  dateOfBirth: z.string().min(2, "Date of birth is required"),
  gender: z.string().min(1, "Gender is required"),
  address: z.string().min(5, "Address is required"),
  city: z.string().min(2, "City is required"),
  state: z.string().min(2, "State is required"),
  country: z.string().min(2, "Country is required"),
  status: z.enum(["verified", "pending", "inactive", "suspended"]),
});

type EmployeeFormValues = z.infer<typeof employeeSchema>;

interface EmployeeDrawerProps {
  employee: any;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mode: "view" | "edit";
  onModeChange?: (mode: "view" | "edit") => void;
  onSave?: (data: EmployeeFormValues) => Promise<void>;
}

const statusStyles = {
  verified: "bg-green-100 text-green-800 border-green-200",
  pending: "bg-yellow-100 text-yellow-800 border-yellow-200",
  inactive: "bg-gray-100 text-gray-800 border-gray-200",
  suspended: "bg-red-100 text-red-800 border-red-200",
};

const statusOptions = [
  { value: "verified", label: "Verified", color: "green" },
  { value: "pending", label: "Pending", color: "yellow" },
  { value: "inactive", label: "Inactive", color: "gray" },
  { value: "suspended", label: "Suspended", color: "red" },
];

const genderOptions = [
  { value: "Male", label: "Male" },
  { value: "Female", label: "Female" },
  { value: "Other", label: "Other" },
];

export function EmployeeDrawer({
  employee,
  open,
  onOpenChange,
  mode,
  onModeChange,
  onSave,
}: EmployeeDrawerProps) {
  const [activeTab, setActiveTab] = useState("overview");
  const [isSaving, setIsSaving] = useState(false);

  const form = useForm<EmployeeFormValues>({
    resolver: zodResolver(employeeSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      employeeId: "",
      department: "",
      position: "",
      dateOfBirth: "",
      gender: "",
      address: "",
      city: "",
      state: "",
      country: "Nigeria",
      status: "pending",
    },
  });

  // Reset form when employee changes
  useEffect(() => {
    if (employee) {
      form.reset({
        firstName: employee.firstName || "",
        lastName: employee.lastName || "",
        email: employee.email || "",
        phone: employee.phone || "",
        employeeId: employee.employeeId || "",
        department: employee.department || "",
        position: employee.position || "",
        dateOfBirth: employee.dateOfBirth || "",
        gender: employee.gender || "",
        address: employee.address || "",
        city: employee.city || "",
        state: employee.state || "",
        country: employee.country || "Nigeria",
        status: employee.status || "pending",
      });
    }
  }, [employee, form]);

  const handleSubmit = async (data: EmployeeFormValues) => {
    setIsSaving(true);
    try {
      if (onSave) {
        await onSave(data);
      }
      onModeChange?.("view");
    } catch (error) {
      console.error("Error saving employee:", error);
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
    <div className="flex items-start gap-3 py-3 border-b border-gray-100 last:border-0">
      {Icon && <Icon className="h-4 w-4 text-gray-400 mt-0.5 shrink-0" />}
      <div className="flex-1 min-w-0">
        <p className="text-xs text-gray-500">{label}</p>
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
    <div className="bg-gray-50 rounded-lg p-5">
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
          <FormLabel className="text-xs text-gray-500">{label}</FormLabel>
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

  if (!employee) return null;

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-5xl lg:max-w-6xl xl:max-w-7xl max-w-[95vw]! p-0 overflow-y-auto [&>div]:max-w-none! data-[side=right]:max-w-none!">
        {/* Header with gradient background */}
        <div className="bg-linear-to-r from-blue-600 to-blue-800 text-white p-8 sticky top-0 z-20">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-4">
              <div className="h-16 w-16 rounded-full bg-white/20 flex items-center justify-center">
                <User className="h-8 w-8" />
              </div>
              <div>
                <SheetTitle className="text-white text-2xl">
                  {employee.firstName} {employee.lastName}
                </SheetTitle>
                <p className="text-blue-100 text-sm mt-1">
                  {employee.employeeId} • {employee.position} • Joined{" "}
                  {new Date(employee.dateJoined).getFullYear()}
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
                  Edit Employee
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
                statusStyles[employee.status as keyof typeof statusStyles],
              )}
            >
              {employee.status}
            </Badge>
            <Badge
              variant="outline"
              className="px-3 py-1 text-sm bg-white/20 text-white border-white/30"
            >
              {employee.department}
            </Badge>
            <Badge
              variant="outline"
              className="px-3 py-1 text-sm bg-white/20 text-white border-white/30"
            >
              {employee.beneficiaries} Beneficiaries
            </Badge>
          </div>
        </div>

        {/* Tabs navigation */}
        <div className="border-b px-8 sticky top-39 bg-white z-10">
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
                value="beneficiaries"
                className="data-[state=active]:border-b-2 data-[state=active]:border-blue-600 rounded-none px-6 py-4 text-sm font-medium"
              >
                Beneficiaries
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
                    {/* Personal Information */}
                    <SectionCard title="Personal Information">
                      <div className="grid grid-cols-2 gap-4">
                        <EditField
                          name="firstName"
                          label="First Name"
                          icon={User}
                        />
                        <EditField
                          name="lastName"
                          label="Last Name"
                          icon={User}
                        />
                        <EditField
                          name="dateOfBirth"
                          label="Date of Birth"
                          icon={Calendar}
                          type="date"
                        />
                        <FormField
                          control={form.control}
                          name="gender"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Gender</FormLabel>
                              <Select
                                onValueChange={field.onChange}
                                defaultValue={field.value}
                              >
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select gender" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  {genderOptions.map((option) => (
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
                      </div>
                    </SectionCard>

                    {/* Employment Details */}
                    <SectionCard title="Employment Details">
                      <div className="grid grid-cols-2 gap-4">
                        <EditField
                          name="employeeId"
                          label="Employee ID"
                          icon={Hash}
                        />
                        <EditField
                          name="department"
                          label="Department"
                          icon={Briefcase}
                        />
                        <EditField
                          name="position"
                          label="Position"
                          icon={Briefcase}
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
                                            option.color === "yellow" &&
                                              "bg-yellow-500",
                                            option.color === "gray" &&
                                              "bg-gray-500",
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

                    {/* Form Actions */}
                    <div className="flex items-center justify-end gap-3 sticky bottom-0 bg-white py-4 border-t">
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
                      <Building2 className="h-6 w-6 text-blue-500 mx-auto mb-2" />
                      <p className="text-sm font-medium">{employee.company}</p>
                      <p className="text-xs text-gray-500">Company</p>
                    </div>
                    <div className="bg-green-50 p-4 rounded-lg text-center">
                      <Shield className="h-6 w-6 text-green-500 mx-auto mb-2" />
                      <p className="text-sm font-medium">
                        {employee.ninVerified
                          ? "Verified"
                          : employee.ninSubmitted
                            ? "Pending"
                            : "Not Submitted"}
                      </p>
                      <p className="text-xs text-gray-500">NIN Status</p>
                    </div>
                    <div className="bg-purple-50 p-4 rounded-lg text-center">
                      <Heart className="h-6 w-6 text-purple-500 mx-auto mb-2" />
                      <p className="text-2xl font-bold">
                        {employee.beneficiaries}
                      </p>
                      <p className="text-xs text-gray-500">Beneficiaries</p>
                    </div>
                    <div className="bg-orange-50 p-4 rounded-lg text-center">
                      <FileText className="h-6 w-6 text-orange-500 mx-auto mb-2" />
                      <p className="text-2xl font-bold">{employee.policies}</p>
                      <p className="text-xs text-gray-500">Policies</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-6">
                    {/* Left Column */}
                    <div className="space-y-6">
                      <SectionCard title="Personal Information">
                        <InfoRow
                          label="Full Name"
                          value={`${employee.firstName} ${employee.lastName}`}
                          icon={User}
                        />
                        <InfoRow
                          label="Date of Birth"
                          value={new Date(
                            employee.dateOfBirth,
                          ).toLocaleDateString()}
                          icon={Calendar}
                        />
                        <InfoRow
                          label="Gender"
                          value={employee.gender}
                          icon={User}
                        />
                        <InfoRow
                          label="Employee ID"
                          value={employee.employeeId}
                          icon={Hash}
                        />
                      </SectionCard>

                      <SectionCard title="Employment Details">
                        <InfoRow
                          label="Company"
                          value={employee.company}
                          icon={Building2}
                        />
                        <InfoRow
                          label="Department"
                          value={employee.department}
                          icon={Briefcase}
                        />
                        <InfoRow
                          label="Position"
                          value={employee.position}
                          icon={Briefcase}
                        />
                        <InfoRow
                          label="Date Joined"
                          value={new Date(
                            employee.dateJoined,
                          ).toLocaleDateString()}
                          icon={Calendar}
                        />
                      </SectionCard>
                    </div>

                    {/* Right Column */}
                    <div className="space-y-6">
                      <SectionCard title="Contact Information">
                        <InfoRow
                          label="Email"
                          value={employee.email}
                          icon={Mail}
                        />
                        <InfoRow
                          label="Phone"
                          value={employee.phone}
                          icon={Phone}
                        />
                        <InfoRow
                          label="Address"
                          value={`${employee.address}, ${employee.city}, ${employee.state}, ${employee.country}`}
                          icon={MapPin}
                        />
                      </SectionCard>

                      <SectionCard title="NIN Verification">
                        <InfoRow
                          label="Status"
                          value={
                            employee.ninVerified
                              ? "Verified"
                              : employee.ninSubmitted
                                ? "Pending"
                                : "Not Submitted"
                          }
                          icon={Shield}
                        />
                        {employee.ninVerified && (
                          <InfoRow
                            label="Verified Date"
                            value="2024-03-15"
                            icon={Calendar}
                          />
                        )}
                      </SectionCard>
                    </div>
                  </div>
                </div>
              )}
            </TabsContent>

            {/* Beneficiaries Tab */}
            <TabsContent value="beneficiaries" className="mt-0">
              <div className="text-center py-16 bg-gray-50 rounded-lg">
                <Heart className="h-16 w-16 mx-auto text-gray-300 mb-4" />
                <h3 className="text-lg font-medium mb-2">Beneficiaries</h3>
                <p className="text-sm text-gray-500 mb-6">
                  This employee has {employee.beneficiaries} registered
                  beneficiaries
                </p>
                <Button>View Beneficiaries</Button>
              </div>
            </TabsContent>

            {/* Policies Tab */}
            <TabsContent value="policies" className="mt-0">
              <div className="text-center py-16 bg-gray-50 rounded-lg">
                <Shield className="h-16 w-16 mx-auto text-gray-300 mb-4" />
                <h3 className="text-lg font-medium mb-2">Insurance Policies</h3>
                <p className="text-sm text-gray-500 mb-6">
                  This employee has {employee.policies} active policies
                </p>
                <Button>View Policies</Button>
              </div>
            </TabsContent>

            {/* Documents Tab */}
            <TabsContent value="documents" className="mt-0">
              <div className="text-center py-16 bg-gray-50 rounded-lg">
                <FileText className="h-16 w-16 mx-auto text-gray-300 mb-4" />
                <h3 className="text-lg font-medium mb-2">Employee Documents</h3>
                <p className="text-sm text-gray-500 mb-6">
                  NIN slip, passport photographs, and other documents
                </p>
                <Button variant="outline">View Documents</Button>
              </div>
            </TabsContent>
          </Tabs>
        </div>

        {/* Footer with actions */}
        {mode === "view" && (
          <div className="border-t p-6 bg-gray-50 sticky bottom-0">
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-500">
                <span className="font-medium">Last updated:</span> 2 days ago
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
                  Edit Employee
                </Button>
              </div>
            </div>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}
