import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import axios from "axios";
import { requirePermission } from "@/lib/server-api";

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL;

/**
 * Bulk upload company registrations (CSV import).
 * Forwards the multipart body to the backend with the admin token.
 */
export async function POST(request: Request) {
  try {
    const guard = await requirePermission(request, ["bulk_upload_company_registrations"]);
    if (guard) return guard;
    const cookieStore = await cookies();
    const token = cookieStore.get("token_super-admin")?.value;

    if (!token) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 },
      );
    }

    if (!BACKEND_URL) {
      return NextResponse.json(
        { success: false, message: "Backend URL is not configured" },
        { status: 500 },
      );
    }

    const contentType = request.headers.get("content-type") || "";
    const body = await request.arrayBuffer();

    const response = await axios.post(
      `${BACKEND_URL}/admin/grouplife/company-registrations/bulk-upload`,
      body,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "x-auth-type": "super-admin",
          "Content-Type": contentType,
        },
        timeout: 120000,
      },
    );

    return NextResponse.json(response.data, { status: response.status });
  } catch (error) {
    const status = axios.isAxiosError(error)
      ? error.response?.status
      : undefined;
    console.error("Company bulk upload API error:", status || error);
    return NextResponse.json(
      {
        success: false,
        message:
          (axios.isAxiosError(error) &&
            error.response?.data?.message) ||
          "Bulk upload failed",
      },
      { status: status || 500 },
    );
  }
}
