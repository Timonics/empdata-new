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
import { Loader2, Mail, ArrowLeft, CheckCircle } from "lucide-react";
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

  // Determine if this is admin or portal
  const isAdmin = role === "admin";
  const theme = isAdmin ? "blue" : "emerald";

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
      // Pass the role to the service
      const response = await AuthService.forgotPassword(data.email);

      if (response.success) {
        setSuccess(true);
        toast.success("Password reset email sent!");

        // Store email for reset page
        sessionStorage.setItem("resetEmail", data.email);
        sessionStorage.setItem("resetRole", role);

        // Auto redirect after 3 seconds
        setTimeout(() => {
          router.push(getBackLink());
        }, 3000);
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
      <Card className={cn(
        "w-full shadow-lg border-0",
        isAdmin ? "border-blue-100" : "border-emerald-100"
      )}>
        <CardHeader>
          <div className="flex items-center gap-2">
            <CheckCircle className={cn(
              "h-6 w-6",
              isAdmin ? "text-blue-600" : "text-emerald-600"
            )} />
            <CardTitle className={cn(
              isAdmin ? "text-blue-600" : "text-emerald-600"
            )}>
              Check your email
            </CardTitle>
          </div>
          <CardDescription>
            We've sent a password reset link to your email address.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Alert className={cn(
            isAdmin ? "bg-blue-50 border-blue-200" : "bg-emerald-50 border-emerald-200"
          )}>
            <Mail className={cn(
              "h-4 w-4",
              isAdmin ? "text-blue-600" : "text-emerald-600"
            )} />
            <AlertDescription className={cn(
              isAdmin ? "text-blue-800" : "text-emerald-800"
            )}>
              Click the link in the email to reset your password. The link will
              expire in 1 hour.
            </AlertDescription>
          </Alert>

          <div className="text-sm text-muted-foreground">
            <p>
              Didn't receive the email? Check your spam folder or try again.
            </p>
          </div>

          <p className="text-xs text-center text-muted-foreground">
            Redirecting to login in 3 seconds...
          </p>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button 
            variant="outline" 
            onClick={() => setSuccess(false)}
            className={cn(
              isAdmin && "hover:bg-blue-50 hover:text-blue-600",
              !isAdmin && "hover:bg-emerald-50 hover:text-emerald-600"
            )}
          >
            Try again
          </Button>
          <Link
            href={getBackLink()}
            className={cn(
              "text-sm transition-colors",
              isAdmin ? "text-blue-600 hover:text-blue-800" : "text-emerald-600 hover:text-emerald-800"
            )}
          >
            Back to login
          </Link>
        </CardFooter>
      </Card>
    );
  }

  return (
    <Card className={cn(
      "w-full shadow-lg border-0",
      isAdmin ? "border-blue-100" : "border-emerald-100"
    )}>
      <CardHeader>
        <CardTitle>
          <h1
            className={cn(
              "text-2xl font-semibold tracking-tight bg-linear-to-r bg-clip-text text-transparent",
              isAdmin
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
              disabled={isLoading}
            />
            {errors.email && (
              <p className="text-sm text-red-500">{errors.email.message}</p>
            )}
          </div>

          <Button
            size="lg"
            type="submit"
            className={cn(
              "w-full",
              isAdmin 
                ? "bg-blue-600 hover:bg-blue-700" 
                : "bg-emerald-600 hover:bg-emerald-700"
            )}
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
            "flex items-center text-sm transition-colors",
            isAdmin
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