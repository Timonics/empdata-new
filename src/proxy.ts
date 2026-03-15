import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import type { UserRole } from "@/types/auth.types";

type ProtectedRoute = {
  pattern: RegExp;
  role: UserRole;
  loginPath: string;
};

const protectedRoutes: ProtectedRoute[] = [
  {
    pattern: /^\/admin(\/.*)?$/,
    role: "admin",
    loginPath: "/admin/login",
  },
  {
    pattern: /^\/portal\/company(\/.*)?$/,
    role: "company_admin",
    loginPath: "/portal/auth",
  },
  {
    pattern: /^\/portal\/employee(\/.*)?$/,
    role: "employee",
    loginPath: "/portal/auth",
  },
];

const publicRoutes: RegExp[] = [
  /^\/admin\/login$/,
  /^\/admin\/verify-2fa$/,
  /^\/admin\/forgot-password$/,
  /^\/admin\/set-password$/,
  /^\/admin\/reset-password$/,
  /^\/portal\/auth$/,
  /^\/portal\/auth\/verify-2fa$/,
  /^\/portal\/auth\/forgot-password$/,
  /^\/portal\/auth\/set-password$/,
  /^\/portal\/auth\/reset-password$/,
  /^\/onboarding(\/.*)?$/,
  /^\/$/,
];

/**
 * Check if a route is public
 */
function isPublicRoute(pathname: string): boolean {
  return publicRoutes.some((route) => route.test(pathname));
}

/**
 * Find a matching protected route
 */
function matchProtectedRoute(pathname: string): ProtectedRoute | null {
  return protectedRoutes.find((route) => route.pattern.test(pathname)) ?? null;
}

/**
 * Get auth token from cookies based on role
 */
function getAuthToken(request: NextRequest, role: UserRole): string | null {
  const cookieName = `token_${role}`;
  return request.cookies.get(cookieName)?.value ?? null;
}

/**
 * Create login redirect response
 */
function redirectToLogin(request: NextRequest, loginPath: string) {
  const loginUrl = new URL(loginPath, request.url);

  // Optional returnUrl support
  // loginUrl.searchParams.set("returnUrl", request.nextUrl.pathname);

  return NextResponse.redirect(loginUrl);
}

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  /**
   * Allow public routes
   */
  if (isPublicRoute(pathname)) {
    return NextResponse.next();
  }

  /**
   * Check protected routes
   */
  const matchedRoute = matchProtectedRoute(pathname);

  if (!matchedRoute) {
    return NextResponse.next();
  }

  /**
   * Validate authentication
   */
  const token = getAuthToken(request, matchedRoute.role);

  if (!token) {
    return redirectToLogin(request, matchedRoute.loginPath);
  }

  /**
   * Continue request
   */
  return NextResponse.next();
}

/**
 * Next.js matcher
 */
export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
