import { UserRole } from "@/types/auth.types";

class TokenManager {
  private userRole: UserRole | null = null;
  private userData: any = null;

  constructor() {
    // Initialize from localStorage on client side only
    if (typeof window !== "undefined") {
      this.loadFromStorage();
    }
  }

  private loadFromStorage() {
    // Load user role
    const storedRole = localStorage.getItem("userRole") as UserRole | null;
    if (storedRole) {
      this.userRole = storedRole;
    }

    // Load user data
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
    // Try from memory first
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

  // We don't store tokens in localStorage anymore - they're in HTTP-only cookies
  // These methods are kept for compatibility but don't actually store anything
  getToken(): string | null {
    // Tokens are in HTTP-only cookies, not accessible via JavaScript
    // This method returns null as tokens cannot be accessed from client
    return null;
  }

  clearUserData() {
    this.userRole = null;
    this.userData = null;
    
    if (typeof window !== "undefined") {
      localStorage.removeItem("userRole");
      localStorage.removeItem("user");
    }
  }

  hasValidSession(): boolean {
    return !!this.getUserRole();
  }
}

// Export a singleton instance
export const tokenManager = new TokenManager();