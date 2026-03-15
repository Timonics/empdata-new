type UserRole = 'admin' | 'company' | 'employee';

class TokenManager {
  private tokens: Map<UserRole, string | null> = new Map();
  private refreshTokens: Map<UserRole, string | null> = new Map();
  private userRole: UserRole | null = null;
  private userData: any = null;

  constructor() {
    // Initialize from localStorage on client side only
    if (typeof window !== 'undefined') {
      this.loadFromStorage();
    }
  }

  private loadFromStorage() {
    const roles: UserRole[] = ['admin', 'company', 'employee'];
    roles.forEach(role => {
      const token = localStorage.getItem(`token_${role}`);
      const refreshToken = localStorage.getItem(`refresh_${role}`);
      if (token) this.tokens.set(role, token);
      if (refreshToken) this.refreshTokens.set(role, refreshToken);
    });
    
    const storedRole = localStorage.getItem('userRole') as UserRole | null;
    if (storedRole) {
      this.userRole = storedRole;
    }
  }

  setToken(role: UserRole, token: string | null) {
    this.tokens.set(role, token);
    if (typeof window !== 'undefined') {
      if (token) {
        localStorage.setItem(`token_${role}`, token);
      } else {
        localStorage.removeItem(`token_${role}`);
      }
    }
  }

  getToken(role?: UserRole): string | null {
    if (role) {
      return this.tokens.get(role) || null;
    }
    // If no role provided, try to get token for current user role
    if (this.userRole) {
      return this.tokens.get(this.userRole) || null;
    }
    return null;
  }

  setRefreshToken(role: UserRole, token: string | null) {
    this.refreshTokens.set(role, token);
    if (typeof window !== 'undefined') {
      if (token) {
        localStorage.setItem(`refresh_${role}`, token);
      } else {
        localStorage.removeItem(`refresh_${role}`);
      }
    }
  }

  getRefreshToken(role: UserRole): string | null {
    return this.refreshTokens.get(role) || null;
  }

  setUserRole(role: UserRole | null) {
    this.userRole = role;
    if (typeof window !== 'undefined') {
      if (role) {
        localStorage.setItem('userRole', role);
      } else {
        localStorage.removeItem('userRole');
      }
    }
  }

  getUserRole(): UserRole | null {
    return this.userRole;
  }

  setUserData(data: any) {
    this.userData = data;
  }

  getUserData(): any {
    return this.userData;
  }

  clearTokens(role?: UserRole) {
    if (role) {
      this.setToken(role, null);
      this.setRefreshToken(role, null);
      if (this.userRole === role) {
        this.userRole = null;
        this.userData = null;
      }
    } else {
      const roles: UserRole[] = ['admin', 'company', 'employee'];
      roles.forEach(r => {
        this.setToken(r, null);
        this.setRefreshToken(r, null);
      });
      this.userRole = null;
      this.userData = null;
    }
  }

  clearAllTokens() {
    const roles: UserRole[] = ['admin', 'company', 'employee'];
    roles.forEach(r => {
      this.setToken(r, null);
      this.setRefreshToken(r, null);
    });
    this.userRole = null;
    this.userData = null;
  }

  hasValidToken(role?: UserRole): boolean {
    if (role) {
      return !!this.getToken(role);
    }
    if (this.userRole) {
      return !!this.getToken(this.userRole);
    }
    return false;
  }

  getCurrentRole(): UserRole | null {
    return this.userRole;
  }
}

// Export a singleton instance
export const tokenManager = new TokenManager();