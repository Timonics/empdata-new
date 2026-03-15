import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { AuthService } from "@/services/auth.service";
import { useRouter } from "next/navigation";
import { LoginCredentials, UserRole, Verify2FAData } from "@/types/auth.types";
import { toast } from "sonner";
import { tokenManager } from "@/lib/token-manager";

// Auth keys for React Query cache
export const authKeys = {
  all: ["auth"] as const,
  user: () => [...authKeys.all, "user"] as const,
  session: () => [...authKeys.all, "session"] as const,
};

export function useAuth() {
  const queryClient = useQueryClient();
  const router = useRouter();

  // Get current user from cache or token manager
  const { data: user, isLoading: isLoadingUser } = useQuery({
    queryKey: authKeys.user(),
    queryFn: () => {
      // First try to get from token manager
      const userData = tokenManager.getUserData();
      if (userData) return userData;

      // Fallback to localStorage
      const stored = localStorage.getItem("user");
      return stored ? JSON.parse(stored) : null;
    },
    staleTime: Infinity,
  });

  // Get current role
  const userRole = tokenManager.getUserRole();

  // Admin login mutation
  const adminLoginMutation = useMutation({
    mutationFn: (credentials: LoginCredentials) =>
      AuthService.adminLogin(credentials),
    onSuccess: (data) => {
      console.log("Admin login onSuccess - data:", data);

      if (data.success) {
        // Check if 2FA is required
        if (data.requires_2fa && data.session_token) {
          // Store 2FA info in session storage
          sessionStorage.setItem("2fa_email", data.user.email);
          sessionStorage.setItem("2fa_session_token", data.session_token);
          sessionStorage.setItem("2fa_role", "admin");

          toast.info("Verification required", {
            description: "Please enter the code sent to your email",
          });

          console.log("Redirecting to 2FA verification page");

          // Try router.push first
          try {
            router.push("/admin/verify-2fa");
          } catch (e) {
            console.log("router.push failed, using window.location", e);
            window.location.href = "/admin/verify-2fa";
          }

          // IMPORTANT: Return here to prevent further execution
          return;
        }

        // Normal login (2FA not enabled)
        if (data.user) {
          // Update cache
          queryClient.setQueryData(authKeys.user(), data.user);

          // Store user data
          tokenManager.setUserData(data.user);
          tokenManager.setUserRole(data.user.role);

          toast.success("Login successful!", {
            description: `Welcome back, Admin`,
          });

          console.log("Redirecting to admin dashboard");

          try {
            router.push("/admin");
          } catch (e) {
            console.log("router.push failed, using window.location", e);
            window.location.href = "/admin";
          }
        }
      } else {
        toast.error("Login failed", {
          description: data.message || "Invalid credentials",
        });
      }
    },
    onError: (error: any) => {
      console.error("Admin login error:", error);
      toast.error("Login failed", {
        description: error.message || "An unexpected error occurred",
      });
    },
  });

  // Admin 2FA verification mutation
  const adminVerify2faMutation = useMutation({
    mutationFn: (verifyData: Verify2FAData) =>
      AuthService.adminVerify2FA(verifyData),
    onSuccess: (data) => {
      if (data.success && data?.user) {
        // Update cache with user data
        queryClient.setQueryData(authKeys.user(), data.user);

        // Store the final token (the response might include a token)
        if (data.token) {
          // Token is already set in HTTP-only cookie by the API
          // But we might need to store user data
          tokenManager.setUserData(data.user);
        }

        toast.success("Successfully verified", {
          description: "Redirecting to your Dashboard...",
        });

        router.push("/admin");
      } else {
        toast.error("Verification failed", {
          description: data.message || "Invalid verification code",
        });
      }
    },
    onError: (error: any) => {
      toast.error("Verification failed", {
        description: error.message || "An unexpected error occurred",
      });
    },
  });

  // Portal login mutation
  const portalLoginMutation = useMutation({
    mutationFn: (credentials: LoginCredentials) =>
      AuthService.portalLogin(credentials),
    onSuccess: (data) => {
      if (data.success) {
        // Check if 2FA is required
        if (data.requires_2fa && data.session_token) {
          // Store 2FA info in session storage
          sessionStorage.setItem("2fa_email", data.user.email);
          sessionStorage.setItem("2fa_session_token", data.session_token);
          sessionStorage.setItem("2fa_role", data.user?.role || "");

          toast.info("Verification required", {
            description: "Please enter the code sent to your email",
          });

          // Redirect to 2FA verification
          router.push("/portal/verify-2fa");
          return;
        }

        // Normal login (2FA not enabled)
        if (data.user) {
          // Update cache
          queryClient.setQueryData(authKeys.user(), data.user);

          // Store user data in token manager
          tokenManager.setUserData(data.user);

          const role = data.user.role;
          const userName =
            role === "company_admin" ? "Company Admin" : "Employee";

          toast.success("Login successful!", {
            description: `Welcome back, ${userName}`,
          });

          // Redirect based on role
          if (role === "company_admin") {
            router.push("/portal/company");
          } else {
            router.push("/portal/employee");
          }
        }
      } else {
        toast.error("Login failed", {
          description: data.message || "Invalid email or password",
        });
      }
    },
    onError: (error: any) => {
      toast.error("Login failed", {
        description: error.message || "An unexpected error occurred",
      });
    },
  });

  // Portal 2FA verification mutation
  const portalVerify2faMutation = useMutation({
    mutationFn: (verifyData: Verify2FAData) =>
      AuthService.portalVerify2FA(verifyData),
    onSuccess: (data) => {
      if (data.success && data.data?.user) {
        // Update cache with user data
        queryClient.setQueryData(authKeys.user(), data.user);

        // Store user data in token manager
        tokenManager.setUserData(data.user);

        toast.success("Successfully verified", {
          description: "Redirecting to your Dashboard...",
        });

        // Redirect based on role
        if (data.user.role === "company_admin") {
          router.push("/portal/company");
        } else {
          router.push("/portal/employee");
        }
      } else {
        toast.error("Verification failed", {
          description: data.message || "Invalid verification code",
        });
      }
    },
    onError: (error: any) => {
      toast.error("Verification failed", {
        description: error.message || "An unexpected error occurred",
      });
    },
  });

  // Logout mutation
  const logoutMutation = useMutation({
    mutationFn: async () => {
      const role = tokenManager.getUserRole();
      if (role) {
        await AuthService.logout(role);
      } else {
        await AuthService.logout();
      }
    },
    onSuccess: () => {
      // Clear cache
      queryClient.setQueryData(authKeys.user(), null);
      queryClient.invalidateQueries({ queryKey: authKeys.all });
      // Clear token manager
      tokenManager.clearUserData();
      toast.success("Logged out successfully");
      // Redirect to appropriate login page
      const lastRole = tokenManager.getUserRole();
      if (lastRole === "admin") {
        router.push("/admin/login");
      } else {
        router.push("/portal/auth");
      }
    },
    onError: (error: any) => {
      toast.error("Logout failed", {
        description: error.message || "An error occurred during logout",
      });

      // Still clear local state and redirect
      queryClient.setQueryData(authKeys.user(), null);
      tokenManager.clearUserData();
      router.push("/");
    },
  });

  // Forgot password mutation
  const forgotPasswordMutation = useMutation({
    mutationFn: (email: string) => AuthService.forgotPassword(email),
    onSuccess: (data) => {
      if (data.success) {
        toast.success("Reset link sent!", {
          description: "Check your email for password reset instructions",
        });
      } else {
        toast.error("Failed to send reset link", {
          description: data.message || "Please try again",
        });
      }
    },
    onError: (error: any) => {
      toast.error("Failed to send reset link", {
        description: error.message || "An unexpected error occurred",
      });
    },
  });

  // Reset password mutation
  const resetPasswordMutation = useMutation({
    mutationFn: (data: any) => AuthService.resetPassword(data),
    onSuccess: (data) => {
      if (data.success) {
        toast.success("Password reset successful!", {
          description: "You can now login with your new password",
        });
        router.push("/admin/login");
      } else {
        toast.error("Password reset failed", {
          description: data.message || "Please try again",
        });
      }
    },
    onError: (error: any) => {
      toast.error("Password reset failed", {
        description: error.message || "An unexpected error occurred",
      });
    },
  });

  // Set password mutation (for portal invitations)
  const setPasswordMutation = useMutation({
    mutationFn: (data: any) => AuthService.setPassword(data),
    onSuccess: (data) => {
      if (data.success) {
        toast.success("Password set successfully!", {
          description: "You can now login with your new password",
        });
        router.push("/portal/login");
      } else {
        toast.error("Failed to set password", {
          description: data.message || "Please try again",
        });
      }
    },
    onError: (error: any) => {
      toast.error("Failed to set password", {
        description: error.message || "An unexpected error occurred",
      });
    },
  });

  return {
    // User state
    user,
    userRole,
    isAuthenticated: !!user,
    isLoading:
      isLoadingUser ||
      adminLoginMutation.isPending ||
      portalLoginMutation.isPending ||
      adminVerify2faMutation.isPending ||
      portalVerify2faMutation.isPending,

    // Admin login & verification
    adminLogin: (credentials: LoginCredentials) =>
      adminLoginMutation.mutate(credentials),
    adminVerify: (verifyData: Verify2FAData) =>
      adminVerify2faMutation.mutate(verifyData),

    // Portal login & verification
    portalLogin: (credentials: LoginCredentials) =>
      portalLoginMutation.mutate(credentials),
    portalVerify: (verifyData: Verify2FAData) =>
      portalVerify2faMutation.mutate(verifyData),

    // Logout
    logout: () => logoutMutation.mutate(),

    // Password management
    forgotPassword: (email: string) => forgotPasswordMutation.mutate(email),
    resetPassword: (data: any) => resetPasswordMutation.mutate(data),
    setPassword: (data: any) => setPasswordMutation.mutate(data),

    // Mutation states for UI
    isLoggingOut: logoutMutation.isPending,
    isLoggingIn: adminLoginMutation.isPending || portalLoginMutation.isPending,
    isVerifying:
      adminVerify2faMutation.isPending || portalVerify2faMutation.isPending,
    // isLoggingOut: logoutMutation.isPending,
    isSendingReset: forgotPasswordMutation.isPending,
    isResetting: resetPasswordMutation.isPending,
    isSettingPassword: setPasswordMutation.isPending,

    // Errors
    loginError: adminLoginMutation.error || portalLoginMutation.error,
    verifyError: adminVerify2faMutation.error || portalVerify2faMutation.error,
    logoutError: logoutMutation.error,
  };
}
