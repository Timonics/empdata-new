"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, Briefcase, Building2, ArrowLeft } from "lucide-react";

const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  role: z.enum(["company", "employee"], {
    error: "Please select your account type",
  }),
});

type LoginFormValues = z.infer<typeof loginSchema>;

const roleIcons = {
  company: Building2,
  employee: Briefcase,
};

const roleLabels = {
  company: "Company Admin",
  employee: "Employee",
};

export function PortalLoginForm() {
  const [showPassword, setShowPassword] = useState(false);
  const { portalLogin, isLoading } = useAuth();

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      role: "company",
      email: "",
      password: "",
    },
  });

  const selectedRole = watch("role");
  const RoleIcon = roleIcons[selectedRole];

  // Get the appropriate forgot password link based on role
  const getForgotPasswordLink = () => {
    return selectedRole === "company"
      ? "/portal/auth/forgot-password"
      : "/portal/auth/employee/forgot-password";
  };

  const onSubmit = async (data: LoginFormValues) => {
    portalLogin({ email: data.email, password: data.password });
  };

  return (
    <Card className="w-full shadow-lg border-0">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-2xl">
            <h1 className="text-3xl font-semibold tracking-tight bg-linear-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
              Portal Login
            </h1>
          </CardTitle>
          <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
            <RoleIcon className="h-5 w-5 text-blue-600" />
          </div>
        </div>
        <CardDescription>Sign in to your portal account</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )} */}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mt-2">
          {/* Role Selection */}
          {/* <div className="space-y-2">
            <Label htmlFor="role">I am a</Label>
            <Select
              value={selectedRole}
              onValueChange={(value: "company" | "employee") =>
                setValue("role", value)
              }
            >
              <SelectTrigger className="h-11">
                <SelectValue placeholder="Select account type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="company">
                  <div className="flex items-center gap-2">
                    <Building2 className="h-4 w-4" />
                    <span>Company Administrator</span>
                  </div>
                </SelectItem>
                <SelectItem value="employee">
                  <div className="flex items-center gap-2">
                    <Briefcase className="h-4 w-4" />
                    <span>Employee</span>
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
            {errors.role && (
              <p className="text-sm text-red-500">{errors.role.message}</p>
            )}
          </div> */}

          {/* Email */}
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="name@example.com"
              {...register("email")}
              className="h-11"
            />
            {errors.email && (
              <p className="text-sm text-red-500">{errors.email.message}</p>
            )}
          </div>

          {/* Password */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="password">Password</Label>
              <Link
                href={getForgotPasswordLink()}
                className="text-sm text-blue-600 hover:text-blue-800 transition-colors"
              >
                Forgot password?
              </Link>
            </div>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                {...register("password")}
                className="h-11 pr-20"
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-1 top-1 h-9 px-3 hover:bg-transparent"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? "Hide" : "Show"}
              </Button>
            </div>
            {errors.password && (
              <p className="text-sm text-red-500">{errors.password.message}</p>
            )}
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            className="w-full h-11 text-base"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Signing in...
              </>
            ) : (
              "Sign in"
            )}
          </Button>
        </form>

        {/* Role-specific info */}
        <div className="bg-blue-50 p-4 rounded-lg mt-4">
          <p className="text-xs text-blue-800 flex items-start gap-2">
            <Building2 className="h-4 w-4 mt-0.5 shrink-0" />
            <span>
              <strong>Company admins:</strong> Manage your employees, send
              invitations, and view reports
            </span>
          </p>
          <p className="text-xs text-blue-800 flex items-start gap-2 mt-2">
            <Briefcase className="h-4 w-4 mt-0.5 shrink-0" />
            <span>
              <strong>Employees:</strong> View your profile, manage
              beneficiaries, and submit NIN verification
            </span>
          </p>
        </div>
      </CardContent>
      <CardFooter className="flex flex-col space-y-4 border-t pt-6">
        <div className="flex items-center justify-center w-full">
          {/* <Link
            href="/"
            className="text-sm text-muted-foreground hover:text-blue-600 flex items-center gap-1"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to home
          </Link> */}
          <div className="text-sm text-muted-foreground">
            New here?{" "}
            <Link
              href="/onboarding"
              className="text-blue-600 hover:text-blue-800 font-medium"
            >
              Start onboarding
            </Link>
          </div>
        </div>
      </CardFooter>
    </Card>
  );
}
