"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
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
import { Loader2, Mail, ArrowLeft } from "lucide-react";
import { AuthService } from "@/services/auth.service";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

const forgotPasswordSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
});

type ForgotPasswordValues = z.infer<typeof forgotPasswordSchema>;

interface ForgotPasswordFormProps {
  role: "admin" | "company" | "employee";
}

export function ForgotPasswordForm({ role }: ForgotPasswordFormProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordValues>({
    resolver: zodResolver(forgotPasswordSchema),
  });

  // Get the appropriate back link based on role
  const getBackLink = () => {
    switch (role) {
      case "admin":
        return "/admin/login";
      case "company":
        return "/portal/auth";
      case "employee":
        return "/portal/auth";
    }
  };

  // Get the appropriate title based on role
  const getTitle = () => {
    switch (role) {
      case "admin":
        return "Admin Password Reset";
      case "company":
        return "Company Password Reset";
      case "employee":
        return "Employee Password Reset";
    }
  };

  const onSubmit = async (data: ForgotPasswordValues) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await AuthService.forgotPassword(data.email, role);

      if (response.success) {
        setSuccess(true);
        toast.success("Password reset email sent!");

        // Store email for reset page
        sessionStorage.setItem("resetEmail", data.email);
        sessionStorage.setItem("resetRole", role);

        // Don't auto-redirect, let user read the message
      } else {
        setError(response.message || "Failed to send reset email");
      }
    } catch (err: any) {
      setError(err.message || "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  if (success) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Check your email</CardTitle>
          <CardDescription>
            We've sent a password reset link to your email address.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Alert>
            <Mail className="h-4 w-4" />
            <AlertDescription>
              Click the link in the email to reset your password. The link will
              expire in 1 hour.
            </AlertDescription>
          </Alert>

          <div className="text-sm text-muted-foreground">
            <p>
              Didn't receive the email? Check your spam folder or try again.
            </p>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="ghost" onClick={() => setSuccess(false)}>
            Try again
          </Button>
          <Link
            href={getBackLink()}
            className="text-sm text-blue-600 hover:text-blue-800"
          >
            Back to login
          </Link>
        </CardFooter>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          <h1
            className={cn(
              "text-2xl font-semibold tracking-tight bg-linear-to-r bg-clip-text text-transparent",
              pathname.startsWith("/admin")
                ? "from-blue-600 to-blue-800"
                : "from-emerald-600 to-emerald-800",
            )}
          >
            {getTitle()}
          </h1>
        </CardTitle>
        <CardDescription>
          Enter your email to receive a password reset link
        </CardDescription>
      </CardHeader>
      <CardContent>
        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mt-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email address</Label>
            <Input
              id="email"
              type="email"
              placeholder="name@example.com"
              {...register("email")}
            />
            {errors.email && (
              <p className="text-sm text-red-500">{errors.email.message}</p>
            )}
          </div>

          <Button
            size={"lg"}
            type="submit"
            className="w-full"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Sending reset link...
              </>
            ) : (
              "Send reset link"
            )}
          </Button>
        </form>

        <div className="mt-4 text-xs text-muted-foreground">
          <p>Password reset instructions will be sent to this email.</p>
        </div>
      </CardContent>
      <CardFooter>
        <Link
          href={getBackLink()}
          className={cn(
            "flex items-center text-sm",
            pathname.startsWith("/admin")
              ? "text-blue-600 hover:text-blue-800"
              : "text-emerald-600 hover:text-emerald-800",
          )}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to login
        </Link>
      </CardFooter>
    </Card>
  );
}
