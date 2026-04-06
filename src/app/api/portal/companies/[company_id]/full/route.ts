// app/api/portal/dashboard/stats/route.ts
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { callBackend } from "@/lib/server-api";

export async function GET() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token_company_admin")?.value;

    if (!token) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 },
      );
    }

    // Get company_id from cookie or session storage (can't access localStorage here)
    // Option A: Read from a separate cookie set during login
    const companyIdCookie = cookieStore.get("company_id")?.value;
    let companyId = companyIdCookie ? parseInt(companyIdCookie, 10) : null;

    // Option B: If not available, fetch from /me endpoint
    if (!companyId) {
      const meResponse = await callBackend({
        method: "GET",
        path: "/portal/auth/me",
        authType: "company_admin",
        token,
      });

      if (meResponse.success && meResponse.data?.company_id) {
        companyId = meResponse.data.company_id;
      } else {
        return NextResponse.json(
          { success: false, message: "Company not found" },
          { status: 404 },
        );
      }
    }

    // Fetch full company profile
    const result = await callBackend({
      method: "GET",
      path: `/portal/companies/${companyId}/full`,
      authType: "company_admin",
      token,
    });

    if (!result.success) {
      return NextResponse.json(
        { success: false, message: result.message || "Failed to fetch stats" },
        { status: result.status || 500 },
      );
    }

    return NextResponse.json({
      success: true,
      data: result,
    });
  } catch (error) {
    console.error("Dashboard stats API error:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 },
    );
  }
}
