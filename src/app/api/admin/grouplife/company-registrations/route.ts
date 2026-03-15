import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { callBackend } from "@/lib/server-api";

export async function GET(request: Request) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token_admin")?.value;

    if (!token) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 },
      );
    }

    // Forward query parameters
    const url = new URL(request.url);
    const queryString = url.searchParams.toString();

    const result = await callBackend({
      method: "GET",
      path: `/admin/grouplife/company-registrations${queryString ? `?${queryString}` : ""}`,
      authType: "admin",
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
    console.error("Company registrations API error:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 },
    );
  }
}
