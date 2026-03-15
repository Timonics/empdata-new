import { ApiResponse } from "@/types/api.types";
import {
  LoginCredentials,
  AuthResponse,
  ResetPasswordData,
  UserRole,
  User,
  Verify2FAData,
  Client,
} from "@/types/auth.types";
import { tokenManager } from "@/lib/token-manager";
import { api } from "@/lib/axios";

export class AuthService {
  private static readonly ADMIN_BASE = "/api/auth";
  private static readonly PORTAL_BASE = "/api/portal/auth";

  /**
   * Admin login
   */
  static async adminLogin(credentials: LoginCredentials) {
    const response = await api.post(`${this.ADMIN_BASE}/login`, credentials);
    
    console.log("Admin login response:", response.data);

    // Check if login was successful and has user data
    if (response.data?.success) {
      // For 2FA case, user data is at root level
      if (response.data?.user) {
        tokenManager.setUserData(response.data.user);
      }
      // For normal login case, user might be in data.user
      else if (response.data?.data?.user) {
        tokenManager.setUserData(response.data.data.user);
      }
    }

    return response.data;
  }

  /**
   * Portal login (employee or company_admin)
   */
  static async portalLogin(credentials: LoginCredentials) {
    const response = await api.post(`${this.PORTAL_BASE}/login`, credentials);
    
    console.log("Portal login response:", response.data);

    // Check if login was successful and has user data
    if (response.data?.success) {
      // For 2FA case, user data is at root level
      if (response.data?.user) {
        tokenManager.setUserData(response.data.user);
      }
      // For normal login case, user might be in data.user
      else if (response.data?.data?.user) {
        tokenManager.setUserData(response.data.data.user);
      }
    }

    return response.data;
  }

  /**
   * Admin 2FA verification
   */
  static async adminVerify2FA(data: Verify2FAData) {
    const response = await api.post(`${this.ADMIN_BASE}/verify-2fa`, data);
    
    console.log("Admin verify 2FA response:", response.data);

    if (response.data?.success && response.data?.user) {
      tokenManager.setUserData(response.data.user);
    }

    return response.data;
  }

  /**
   * Portal 2FA verification
   */
  static async portalVerify2FA(data: Verify2FAData) {
    const response = await api.post(`${this.PORTAL_BASE}/verify-2fa`, data);
    
    console.log("Portal verify 2FA response:", response.data);

    if (response.data?.success && response.data?.user) {
      tokenManager.setUserData(response.data.user);
    }

    return response.data;
  }

  /**
   * Forgot password (Admin only)
   */
  static async forgotPassword(email: string) {
    const response = await api.post(`${this.ADMIN_BASE}/forgot-password`, {
      email,
    });
    return response.data;
  }

  /**
   * Reset password (Admin only)
   */
  static async resetPassword(data: ResetPasswordData) {
    const response = await api.post(`${this.ADMIN_BASE}/reset-password`, data);
    return response.data;
  }

  /**
   * Set password (Portal invitation flow)
   */
  static async setPassword(data: ResetPasswordData) {
    const response = await api.post(`${this.PORTAL_BASE}/set-password`, data);
    return response.data;
  }

  /**
   * Resend code for Admin 2FA Verification
   */
  static async resendAdminVerify2fa(data: Omit<Verify2FAData, "code">) {
    const response = await api.post(`${this.ADMIN_BASE}/resend-2fa-code`, data);
    return response.data;
  }

  /**
   * Resend code for Portal 2FA Verification
   */
  static async resendPortalVerify2fa(data: Omit<Verify2FAData, "code">) {
    const response = await api.post(`${this.PORTAL_BASE}/resend-2fa-code`, data);
    return response.data;
  }

  /**
   * Enable 2FA for portal user
   */
  static async portalEnable2FA() {
    const response = await api.post(`${this.PORTAL_BASE}/enable-2fa`);
    return response.data;
  }

  /**
   * Disable 2FA for portal user
   */
  static async portalDisable2FA() {
    const response = await api.post(`${this.PORTAL_BASE}/disable-2fa`);
    return response.data;
  }

  /**
   * Get authenticated user
   */
  static async getCurrentUser(role: UserRole) {
    const endpoint = role === "admin" ? `${this.ADMIN_BASE}/me` : `${this.PORTAL_BASE}/me`;
    const response = await api.get(endpoint);
    return response.data;
  }

  /**
   * Logout
   */
  static async logout(role: UserRole) {
    const endpoint = role === "admin" ? `${this.ADMIN_BASE}/logout` : `${this.PORTAL_BASE}/logout`;
    
    try {
      const response = await api.post(endpoint);
      return response.data;
    } finally {
      // tokenManager.clearUserData();
    }
  }
}