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
        { status: 401 }
      );
    }

    const url = new URL(request.url);
    const per_page = url.searchParams.get("per_page") || "15";

    const result = await callBackend({
      method: "GET",
      path: `/admin/grouplife/company-registrations/pending?per_page=${per_page}`,
      authType: "admin",
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
    console.error("Pending company registrations API error:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}