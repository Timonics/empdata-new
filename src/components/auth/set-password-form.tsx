"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
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
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";
import {
  Loader2,
  Lock,
  Eye,
  EyeOff,
  CheckCircle2,
  XCircle,
  ArrowLeft,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { AuthService } from "@/services/auth.service";
import { toast } from "sonner";

const setPasswordSchema = z
  .object({
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
      .regex(/[a-z]/, "Password must contain at least one lowercase letter")
      .regex(/[0-9]/, "Password must contain at least one number")
      .regex(
        /[^A-Za-z0-9]/,
        "Password must contain at least one special character",
      ),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

type SetPasswordFormValues = z.infer<typeof setPasswordSchema>;

interface PasswordRequirement {
  label: string;
  met: boolean;
}

export function SetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isValidating, setIsValidating] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [password, setPassword] = useState("");

  // Get token and email from URL
  const token = searchParams.get("token");
  const email = searchParams.get("email");
  const type = searchParams.get("type") as 'company' | 'employee' | null;

  // Basic validation on mount
  useEffect(() => {
    if (!token || !email || !type) {
      setError("Invalid invitation link. Missing required parameters.");
    }
    setIsValidating(false);
  }, [token, email, type]);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<SetPasswordFormValues>({
    resolver: zodResolver(setPasswordSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  // Watch password for real-time validation
  const watchedPassword = watch("password", "");

  // Update password state for requirements
  useEffect(() => {
    setPassword(watchedPassword);
  }, [watchedPassword]);

  const passwordRequirements: PasswordRequirement[] = [
    {
      label: "At least 8 characters",
      met: password.length >= 8,
    },
    {
      label: "At least one uppercase letter",
      met: /[A-Z]/.test(password),
    },
    {
      label: "At least one lowercase letter",
      met: /[a-z]/.test(password),
    },
    {
      label: "At least one number",
      met: /[0-9]/.test(password),
    },
    {
      label: "At least one special character",
      met: /[^A-Za-z0-9]/.test(password),
    },
  ];

  const passwordStrength = passwordRequirements.filter((req) => req.met).length;
  const strengthPercentage =
    (passwordStrength / passwordRequirements.length) * 100;

  const getStrengthColor = () => {
    if (passwordStrength <= 2) return "bg-red-500";
    if (passwordStrength <= 4) return "bg-yellow-500";
    return "bg-green-500";
  };

  const getStrengthText = () => {
    if (password.length === 0) return "Enter a password";
    if (passwordStrength <= 2) return "Weak";
    if (passwordStrength <= 4) return "Medium";
    return "Strong";
  };

  const onSubmit = async (data: SetPasswordFormValues) => {
    if (!token || !email || !type) {
      setError("Missing required information");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // Call the correct API endpoint
      const response = await AuthService.setPassword({
        token,
        email,
        password: data.password,
        password_confirmation: data.confirmPassword,
      });

      if (response.success) {
        setSuccess(true);
        toast.success("Password set successfully!");

        // Redirect to login after 3 seconds
        setTimeout(() => {
          router.push("/portal/auth");
        }, 3000);
      } else {
        setError(response.message || "Failed to set password");
      }
    } catch (error: any) {
      setError(error.response?.data?.message || "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  if (isValidating) {
    return (
      <Card className="w-full shadow-lg border-0">
        <CardContent className="pt-6">
          <div className="flex flex-col items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-emerald-600 mb-4" />
            <p className="text-muted-foreground">
              Validating your invitation...
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error && (!token || !email || !type)) {
    return (
      <Card className="w-full shadow-lg border-0">
        <CardHeader>
          <CardTitle className="text-red-600">Invalid Link</CardTitle>
          <CardDescription>
            This invitation link is invalid or has expired.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        </CardContent>
        <CardFooter>
          <Link
            href="/"
            className="text-sm text-emerald-600 hover:text-emerald-800 flex items-center gap-1"
          >
            <ArrowLeft className="h-4 w-4" />
            Go to home page
          </Link>
        </CardFooter>
      </Card>
    );
  }

  if (success) {
    return (
      <Card className="w-full shadow-lg border-0">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-emerald-600">
            <CheckCircle2 className="h-6 w-6" />
            Password Set Successfully!
          </CardTitle>
          <CardDescription>
            Your account has been activated. You'll be redirected to login in a
            moment.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="bg-emerald-50 p-4 rounded-lg">
            <p className="text-sm text-emerald-800">
              You can now log in with your email and new password.
            </p>
          </div>
        </CardContent>
        <CardFooter>
          <Link
            href="/portal/auth"
            className="text-sm text-emerald-600 hover:text-emerald-800"
          >
            Go to login now →
          </Link>
        </CardFooter>
      </Card>
    );
  }

  const isPortal = true; // Always portal for this form

  return (
    <Card className="w-full shadow-lg border-0">
      <CardHeader>
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-full bg-emerald-100 flex items-center justify-center">
            <Lock className="h-5 w-5 text-emerald-600" />
          </div>
          <div>
            <CardTitle className="text-xl">Set Your Password</CardTitle>
            <CardDescription>
              {email && <span className="text-sm">For: {email}</span>}
            </CardDescription>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Password Field */}
          <div className="space-y-2">
            <Label htmlFor="password">New Password</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                {...register("password")}
                className="pl-10 pr-20 h-11"
                disabled={isLoading}
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-1 top-1 h-9 px-3 hover:bg-transparent"
                onClick={() => setShowPassword(!showPassword)}
                disabled={isLoading}
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </Button>
            </div>
            {errors.password && (
              <p className="text-sm text-red-500">{errors.password.message}</p>
            )}
          </div>

          {/* Password Strength Meter */}
          {password.length > 0 && (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">
                  Password strength:
                </span>
                <span
                  className={cn(
                    "font-medium",
                    passwordStrength <= 2 && "text-red-600",
                    passwordStrength > 2 &&
                      passwordStrength <= 4 &&
                      "text-yellow-600",
                    passwordStrength > 4 && "text-green-600",
                  )}
                >
                  {getStrengthText()}
                </span>
              </div>
              <Progress
                value={strengthPercentage}
                className={cn("h-2", getStrengthColor())}
              />
            </div>
          )}

          {/* Password Requirements */}
          <div className="bg-gray-50 p-4 rounded-lg space-y-2">
            <p className="text-sm font-medium text-gray-700">
              Password requirements:
            </p>
            <ul className="space-y-1">
              {passwordRequirements.map((req, index) => (
                <li key={index} className="flex items-center gap-2 text-sm">
                  {req.met ? (
                    <CheckCircle2 className="h-4 w-4 text-green-500" />
                  ) : (
                    <XCircle className="h-4 w-4 text-gray-300" />
                  )}
                  <span
                    className={cn(
                      "text-muted-foreground",
                      req.met && "text-gray-900",
                    )}
                  >
                    {req.label}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* Confirm Password Field */}
          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Confirm Password</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <Input
                id="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Confirm your password"
                {...register("confirmPassword")}
                className="pl-10 pr-20 h-11"
                disabled={isLoading}
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-1 top-1 h-9 px-3 hover:bg-transparent"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                disabled={isLoading}
              >
                {showConfirmPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </Button>
            </div>
            {errors.confirmPassword && (
              <p className="text-sm text-red-500">
                {errors.confirmPassword.message}
              </p>
            )}
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            className="w-full h-11 text-base bg-emerald-600 hover:bg-emerald-700"
            disabled={isLoading || passwordStrength < 5}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Setting password...
              </>
            ) : (
              "Set Password"
            )}
          </Button>
        </form>

        <div className="text-xs text-center text-muted-foreground">
          By setting a password, you agree to our{" "}
          <Link
            href="/terms"
            className="text-emerald-600 hover:text-emerald-800 hover:underline"
          >
            Terms of Service
          </Link>{" "}
          and{" "}
          <Link
            href="/privacy"
            className="text-emerald-600 hover:text-emerald-800 hover:underline"
          >
            Privacy Policy
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}