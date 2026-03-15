"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import {
  User,
  Mail,
  Phone,
  Calendar,
  Briefcase,
  Hash,
  X,
  Save,
  MapPin,
  Heart,
  Shield,
} from "lucide-react";
import { cn } from "@/lib/utils";

const employeeSchema = z.object({
  // Personal Information
  firstName: z.string().min(2, "First name is required"),
  lastName: z.string().min(2, "Last name is required"),
  dateOfBirth: z.string().min(1, "Date of birth is required"),
  gender: z.string().min(1, "Gender is required"),

  // Employment Details
  employeeId: z.string().min(2, "Employee ID is required"),
  department: z.string().min(1, "Department is required"),
  position: z.string().min(2, "Position is required"),
  dateJoined: z.string().min(1, "Date joined is required"),
  status: z.enum(["verified", "pending", "inactive"]),

  // Contact Information
  email: z.string().email("Valid email is required"),
  phone: z.string().min(10, "Valid phone number is required"),
  address: z.string().min(5, "Address is required"),
  city: z.string().min(2, "City is required"),
  state: z.string().min(2, "State is required"),

  // Emergency Contact
  emergencyName: z.string().min(2, "Emergency contact name is required"),
  emergencyPhone: z.string().min(10, "Emergency phone is required"),
  emergencyRelation: z.string().min(2, "Relationship is required"),

  // NIN Info
  ninVerified: z.boolean(),
  ninSubmitted: z.boolean(),
});

type EmployeeFormValues = z.infer<typeof employeeSchema>;

interface EditEmployeeDrawerProps {
  employee: any;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave?: (data: EmployeeFormValues) => Promise<void>;
}

const statusOptions = [
  { value: "verified", label: "Verified", color: "green" },
  { value: "pending", label: "Pending", color: "yellow" },
  { value: "inactive", label: "Inactive", color: "gray" },
];

export function EditEmployeeDrawer({
  employee,
  open,
  onOpenChange,
  onSave,
}: EditEmployeeDrawerProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState("personal");

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
      dateJoined: "",
      gender: "",
      status: "pending",
      address: "",
      city: "",
      state: "",
      emergencyName: "",
      emergencyPhone: "",
      emergencyRelation: "",
      ninVerified: false,
      ninSubmitted: false,
    },
  });

  // Reset form when employee changes
  useEffect(() => {
    if (employee) {
      // Parse emergency contact
      const emergencyParts = employee.emergencyContact?.split(" - ") || [
        "",
        "",
      ];

      form.reset({
        firstName: employee.firstName || "",
        lastName: employee.lastName || "",
        email: employee.email || "",
        phone: employee.phone || "",
        employeeId: employee.employeeId || "",
        department: employee.department || "",
        position: employee.position || "",
        dateOfBirth: employee.dateOfBirth || "",
        dateJoined: employee.dateJoined || "",
        gender: employee.gender || "",
        status: employee.status || "pending",
        address: employee.address || "",
        city: employee.city || "",
        state: employee.state || "",
        emergencyName: emergencyParts[0] || "",
        emergencyPhone: emergencyParts[1] || "",
        emergencyRelation: employee.emergencyRelation || "",
        ninVerified: employee.ninVerified || false,
        ninSubmitted: employee.ninSubmitted || false,
      });
    }
  }, [employee, form]);

  const onSubmit = async (data: EmployeeFormValues) => {
    setIsSubmitting(true);
    try {
      if (onSave) {
        await onSave(data);
      } else {
        // Simulate API call
        console.log("Updating employee:", data);
        await new Promise((resolve) => setTimeout(resolve, 1000));
      }
      onOpenChange(false);
    } catch (error) {
      console.error("Error updating employee:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!employee) return null;

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-5xl lg:max-w-6xl xl:max-w-7xl max-w-[95vw]! p-0 overflow-y-auto [&>div]:max-w-none data-[side=right]:max-w-none">
        {/* Header */}
        <div className="sticky top-0 bg-linear-to-r from-emerald-600 to-emerald-800 text-white p-6 z-10">
          <div className="flex items-center justify-between">
            <div>
              <SheetTitle className="text-white text-xl">
                Edit Employee
              </SheetTitle>
              <p className="text-emerald-100 text-sm mt-1">
                {employee.firstName} {employee.lastName} • {employee.employeeId}
              </p>
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

          {/* Status badges */}
          <div className="flex items-center gap-3 mt-4">
            <Badge
              variant="outline"
              className={cn(
                "px-3 py-1",
                "bg-white/20 text-white border-white/30",
                employee.status === "verified" &&
                  "bg-green-500/20 text-green-100",
                employee.status === "pending" &&
                  "bg-yellow-500/20 text-yellow-100",
                employee.status === "inactive" &&
                  "bg-gray-500/20 text-gray-100",
              )}
            >
              {employee.status}
            </Badge>
            <Badge
              variant="outline"
              className="bg-white/20 text-white border-white/30"
            >
              {employee.department}
            </Badge>
          </div>
        </div>
        {/* Tabs */}
        <div className="border-b px-6 sticky top-31 bg-white z-10">
          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="w-full"
          >
            <TabsList className="w-full justify-start h-auto p-0 bg-transparent">
              <TabsTrigger
                value="personal"
                className="data-[state=active]:border-b-2 data-[state=active]:border-emerald-600 rounded-none px-4 py-3"
              >
                Personal
              </TabsTrigger>
              <TabsTrigger
                value="employment"
                className="data-[state=active]:border-b-2 data-[state=active]:border-emerald-600 rounded-none px-4 py-3"
              >
                Employment
              </TabsTrigger>
              <TabsTrigger
                value="contact"
                className="data-[state=active]:border-b-2 data-[state=active]:border-emerald-600 rounded-none px-4 py-3"
              >
                Contact
              </TabsTrigger>
              <TabsTrigger
                value="emergency"
                className="data-[state=active]:border-b-2 data-[state=active]:border-emerald-600 rounded-none px-4 py-3"
              >
                Emergency
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
        {/* Form */}
        <div className="p-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                {/* Personal Information Tab */}
                <TabsContent value="personal" className="mt-0 space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="firstName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>First Name</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                              <Input className="pl-9" {...field} />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="lastName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Last Name</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                              <Input className="pl-9" {...field} />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="dateOfBirth"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Date of Birth</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Calendar className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                              <Input className="pl-9" type="date" {...field} />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
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
                              <SelectItem value="Male">Male</SelectItem>
                              <SelectItem value="Female">Female</SelectItem>
                              <SelectItem value="Other">Other</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </TabsContent>

                {/* Employment Tab */}
                <TabsContent value="employment" className="mt-0 space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="employeeId"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Employee ID</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Hash className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                              <Input className="pl-9" {...field} />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="department"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Department</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select department" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="Engineering">
                                Engineering
                              </SelectItem>
                              <SelectItem value="HR">
                                Human Resources
                              </SelectItem>
                              <SelectItem value="Finance">Finance</SelectItem>
                              <SelectItem value="Marketing">
                                Marketing
                              </SelectItem>
                              <SelectItem value="Operations">
                                Operations
                              </SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="position"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Position</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Briefcase className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                              <Input className="pl-9" {...field} />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="dateJoined"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Date Joined</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Calendar className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                              <Input className="pl-9" type="date" {...field} />
                            </div>
                          </FormControl>
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
                                        option.color === "yellow" &&
                                          "bg-yellow-500",
                                        option.color === "gray" &&
                                          "bg-gray-500",
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

                    <div className="col-span-2 bg-gray-50 p-4 rounded-lg">
                      <div className="flex items-center gap-3">
                        <Shield className="h-5 w-5 text-gray-400" />
                        <div className="flex-1">
                          <p className="text-sm font-medium">
                            NIN Verification
                          </p>
                          <p className="text-xs text-gray-500">
                            {employee.ninVerified
                              ? "Verified"
                              : employee.ninSubmitted
                                ? "Pending verification"
                                : "Not submitted"}
                          </p>
                        </div>
                        <Badge
                          variant="outline"
                          className={cn(
                            employee.ninVerified &&
                              "bg-green-50 text-green-700",
                            employee.ninSubmitted &&
                              !employee.ninVerified &&
                              "bg-yellow-50 text-yellow-700",
                            !employee.ninSubmitted &&
                              "bg-gray-50 text-gray-700",
                          )}
                        >
                          {employee.ninVerified
                            ? "Verified"
                            : employee.ninSubmitted
                              ? "Pending"
                              : "Not Submitted"}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </TabsContent>

                {/* Contact Tab */}
                <TabsContent value="contact" className="mt-0 space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem className="col-span-2">
                          <FormLabel>Email</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                              <Input className="pl-9" type="email" {...field} />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="phone"
                      render={({ field }) => (
                        <FormItem className="col-span-2">
                          <FormLabel>Phone Number</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Phone className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                              <Input className="pl-9" {...field} />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="address"
                      render={({ field }) => (
                        <FormItem className="col-span-2">
                          <FormLabel>Street Address</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <MapPin className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                              <Input className="pl-9" {...field} />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="city"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>City</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="state"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>State</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </TabsContent>

                {/* Emergency Contact Tab */}
                <TabsContent value="emergency" className="mt-0 space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="emergencyName"
                      render={({ field }) => (
                        <FormItem className="col-span-2">
                          <FormLabel>Full Name</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Heart className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                              <Input className="pl-9" {...field} />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="emergencyPhone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Phone Number</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Phone className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                              <Input className="pl-9" {...field} />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="emergencyRelation"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Relationship</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Spouse, Parent, etc."
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </TabsContent>
              </Tabs>

              {/* Form Actions */}
              <div className="sticky bottom-0 bg-white py-4 border-t flex items-center justify-end gap-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => onOpenChange(false)}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? (
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
        </div>
      </SheetContent>
    </Sheet>
  );
}
