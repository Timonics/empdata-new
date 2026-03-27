import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { callBackend } from "@/lib/server-api";

export async function GET() {
  try {
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
      path: "/admin/analytics/employee-registrations/monthly",
      authType: "super-admin",
      token,
    });

    if (result.success) {
      return NextResponse.json(result);
    }

    return NextResponse.json(
      { success: false, message: result.message || "Failed to fetch data" },
      { status: result.status || 400 },
    );
  } catch (error) {
    console.error("Analytics API error:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 },
    );
  }
}
