import axios from "axios";
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

  try {
    console.log(`📤 Calling backend: ${method} ${BACKEND_URL}${path}`);
    
    const response = await axios({
      method,
      url: `${BACKEND_URL}${path}`,
      data,
      headers: requestHeaders,
      timeout: 15000,
    });

    console.log(`📥 Backend response:`, response.data);

    // Return the data in a flattened structure
    return {
      success: true,
      data: response.data.data || response.data,
      status: response.status,
    };
  } catch (error: any) {
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