import Cookies from 'js-cookie';
import { UserRole } from "@/types/auth.types";

class TokenManager {
  private userRole: UserRole | null = null;
  private userData: any = null;
  private readonly TOKEN_PREFIX = 'token_';

  constructor() {
    // Initialize from storage on client side only
    if (typeof window !== "undefined") {
      this.loadFromStorage();
    }
  }

  private loadFromStorage() {
    // Load user role from localStorage (for UI state)
    const storedRole = localStorage.getItem("userRole") as UserRole | null;
    if (storedRole) {
      this.userRole = storedRole;
    }

    // Load user data from localStorage
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        this.userData = JSON.parse(storedUser);
      } catch (e) {
        console.error("Failed to parse user data", e);
      }
    }
  }

  setUserRole(role: UserRole | null) {
    this.userRole = role;
    if (typeof window !== "undefined") {
      if (role) {
        localStorage.setItem("userRole", role);
      } else {
        localStorage.removeItem("userRole");
      }
    }
  }

  getUserRole(): UserRole | null {
    // Check memory first
    if (this.userRole) return this.userRole;
    
    // Fallback to localStorage
    const storedRole = localStorage.getItem("userRole") as UserRole | null;
    if (storedRole) {
      this.userRole = storedRole;
      return storedRole;
    }
    
    return null;
  }

  setUserData(data: any) {
    this.userData = data;
    if (typeof window !== "undefined") {
      if (data) {
        localStorage.setItem("user", JSON.stringify(data));
      } else {
        localStorage.removeItem("user");
      }
    }
  }

  getUserData(): any {
    // Check memory first
    if (this.userData) return this.userData;
    
    // Fallback to localStorage
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        this.userData = JSON.parse(storedUser);
        return this.userData;
      } catch (e) {
        console.error("Failed to parse user data", e);
      }
    }
    
    return null;
  }

  /**
   * Clear all user data and cookies
   */
  clearUserData() {
    const role = this.getUserRole();
    
    // Clear cookies based on role
    if (role) {
      // Clear role-specific token cookie
      Cookies.remove(`${this.TOKEN_PREFIX}${role}`, { path: '/' });
    }
    
    // Clear all possible token cookies
    Cookies.remove(`${this.TOKEN_PREFIX}admin`, { path: '/' });
    Cookies.remove(`${this.TOKEN_PREFIX}company_admin`, { path: '/' });
    Cookies.remove(`${this.TOKEN_PREFIX}employee`, { path: '/' });
    Cookies.remove(`${this.TOKEN_PREFIX}individual`, { path: '/' });
    
    // Clear any other auth cookies that might exist
    const allCookies = document.cookie.split(';');
    allCookies.forEach(cookie => {
      const cookieName = cookie.split('=')[0].trim();
      if (cookieName.includes('token') || cookieName.includes('auth')) {
        Cookies.remove(cookieName, { path: '/' });
      }
    });
    
    // Clear localStorage
    localStorage.removeItem("userRole");
    localStorage.removeItem("user");
    sessionStorage.clear();
    
    // Reset memory state
    this.userRole = null;
    this.userData = null;
  }

  /**
   * Check if user has a valid session
   */
  hasValidSession(): boolean {
    const role = this.getUserRole();
    if (!role) return false;
    
    // Check if the cookie exists for this role
    const cookieExists = Cookies.get(`${this.TOKEN_PREFIX}${role}`);
    return !!cookieExists;
  }

  /**
   * Get the role from the URL or stored role
   */
  getRoleFromUrl(): UserRole | null {
    if (typeof window === "undefined") return null;
    
    const path = window.location.pathname;
    if (path.includes('/admin')) return 'super-admin';
    if (path.includes('/portal')) {
      // Could be company_admin or employee, check stored role
      const storedRole = this.getUserRole();
      if (storedRole === 'company_admin' || storedRole === 'employee') {
        return storedRole;
      }
      return 'company_admin'; // Default to company_admin for portal
    }
    return null;
  }
}

// Export a singleton instance
export const tokenManager = new TokenManager();