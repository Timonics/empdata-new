import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { callBackend } from "@/lib/server-api";

export async function GET(request: Request) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token_super-admin")?.value;

    if (!token) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    // Get hours from query params
    const url = new URL(request.url);
    let hours = parseInt(url.searchParams.get("hours") || "7");

    // Clamp hours between 1 and 168
    hours = Math.min(Math.max(hours, 1), 168);

    const result = await callBackend({
      method: "GET",
      path: `/admin/analytics/recent-registrations?hours=${hours}`,
      authType: "super-admin",
      token,
    });

    if (result.success) {
      return NextResponse.json(result);
    }

    return NextResponse.json(
      { success: false, message: result.message || "Failed to fetch data" },
      { status: result.status || 400 }
    );
  } catch (error) {
    console.error("Analytics API error:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}