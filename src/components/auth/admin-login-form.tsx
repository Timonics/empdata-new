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
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, UserCog, ArrowLeft } from "lucide-react";

const loginSchema = z.object({
  email: z.email("Please enter a valid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export function AdminLoginForm() {
  const [showPassword, setShowPassword] = useState(false);
  const { adminLogin, isLoading, } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: LoginFormValues) => {
    adminLogin({ email: data.email, password: data.password });
  };

  return (
    <Card className="w-full shadow-lg border-0">
      <CardHeader className="space-y-1">
        <div className="flex items-center justify-between">
          <CardTitle className="text-2xl">
            <h1 className="text-3xl font-semibold tracking-tight bg-linear-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
              Admin Access
            </h1>
          </CardTitle>
          <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
            <UserCog className="h-5 w-5 text-blue-600" />
          </div>
        </div>
        <CardDescription>
          Sign in to manage the Client Onboarding platform
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* {loginError && (
          <Alert variant="destructive">
            <AlertDescription>{loginError}</AlertDescription>
          </Alert>
        )} */}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mt-2">
          {/* Email */}
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="admin@example.com"
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
                href="/admin/forgot-password"
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

        {/* Admin info */}
        <div className="bg-blue-50/50 p-3 rounded-lg">
          <p className="text-xs text-muted-foreground flex items-center gap-2">
            <UserCog className="h-8 w-20 text-blue-600" />
            Full platform access: manage companies, employees, registrations,
            and system settings.
          </p>
        </div>
      </CardContent>
      <CardFooter className="flex flex-col space-y-4 border-t pt-6">
        <div className="flex items-center justify-between w-full">
          <Link
            href="/"
            className="text-sm text-muted-foreground hover:text-blue-600 flex items-center gap-1"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to home
          </Link>
        </div>
      </CardFooter>
    </Card>
  );
}
