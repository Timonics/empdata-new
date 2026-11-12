import axios from "axios";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import type { UserRole } from "@/types/auth.types";

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL;

if (!BACKEND_URL) {
  throw new Error("BACKEND_URL is not defined");
}

export interface BackendCallOptions {
  method: "GET" | "POST" | "PUT" | "DELETE";
  path: string;
  data?: unknown;
  authType?: UserRole;
  token?: string;
  headers?: Record<string, string>;
}

export async function callBackend(
  options: BackendCallOptions,
): Promise<any> {
  const { method, path, data, authType, token, headers = {} } = options;

  const requestHeaders: Record<string, string> = {
    "Content-Type": "application/json",
    ...headers,
  };

  if (authType) requestHeaders["x-auth-type"] = authType;
  if (token) requestHeaders["Authorization"] = `Bearer ${token}`;

  // console.log(options);

  try {
    console.log(`📤 Calling backend: ${method} ${BACKEND_URL}${path}`);
    
    const response = await axios({
      method,
      url: `${BACKEND_URL}${path}`,
      data,
      headers: requestHeaders,
      timeout: 60000,
    });

    console.log(`📥 Backend response:`, response.data);

    const payload = response.data;

    // Detect Laravel-style paginators in either position and preserve
    // their meta so the client gets { data, pagination }, not a bare array:
    //   1. payload IS the paginator:        { current_page, data: [...], total }
    //   2. payload.data IS the paginator:   { success, data: { current_page, data: [...], total } }
    // Distinguish paginators from plain { total, data } payloads (like
    // recent-registrations) by requiring Laravel paginator-only fields.
    const looksLikePaginator = (value: any) =>
      value &&
      typeof value === "object" &&
      Array.isArray(value.data) &&
      typeof value.total === "number" &&
      typeof value.current_page === "number";

    const pickPaginator = (candidate: any) => {
      if (looksLikePaginator(candidate)) {
        return candidate;
      }
      if (looksLikePaginator(candidate?.data)) {
        return candidate.data;
      }
      return null;
    };

    const paginator = pickPaginator(payload);

    if (paginator) {
      return {
        success: true,
        data: paginator.data,
        status: response.status,
        pagination: {
          current_page: paginator.current_page,
          last_page: paginator.last_page,
          per_page: paginator.per_page,
          total: paginator.total,
          from: paginator.from,
          to: paginator.to,
        },
      };
    }

    // Plain { success, data } envelope or raw object/array
    return {
      success: true,
      data: payload?.data ?? payload,
      status: response.status,
    };
  } catch (error: any) {
    console.error(error)
    console.error(
      `❌ Backend API Error [${path}]:`,
      error.response?.data || error.message,
    );

    return {
      success: false,
      message: error.response?.data?.message || "Backend request failed",
      status: error.response?.status || 500,
      errors: error.response?.data?.errors,
    };
  }
}
/**
 * Permission guard for admin API routes.
 *
 * Verifies the caller's token carries one of the required permissions
 * (or the super-admin role, which bypasses all checks). The check goes
 * through the backend's /admin/me so permission truth stays in one place.
 *
 * Returns null when allowed, or a 401/403 NextResponse to return.
 */
export async function requirePermission(
  request: Request,
  required: string[],
): Promise<NextResponse | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get("token_super-admin")?.value;

  if (!token) {
    return NextResponse.json(
      { success: false, message: "Unauthorized" },
      { status: 401 },
    );
  }

  const result = await callBackend({
    method: "GET",
    path: "/admin/me",
    authType: "super-admin",
    token,
  });

  if (!result.success) {
    return NextResponse.json(
      { success: false, message: "Forbidden" },
      { status: 403 },
    );
  }

  const admin = result.data;
  const roles: string[] = admin?.roles ?? [];
  const permissions: string[] = admin?.all_permissions ?? [];

  if (roles.includes("super-admin")) return null;

  const hasRequired = required.some((p) => permissions.includes(p));
  if (!hasRequired) {
    return NextResponse.json(
      {
        success: false,
        message: `Forbidden: missing required permission (${required.join(" or ")})`,
      },
      { status: 403 },
    );
  }

  return null;
}
