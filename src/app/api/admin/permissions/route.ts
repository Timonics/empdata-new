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
        { status: 401 }
      );
    }

    const result = await callBackend({
      method: "GET",
      path: "/admin/permissions",
      authType: "super-admin",
      token,
    });

    if (result.success) {
      return NextResponse.json(result);
    }

    return NextResponse.json(
      {
        success: false,
        message: result.message || "Failed to fetch permissions",
      },
      { status: result.status || 400 }
    );
  } catch (error) {
    console.error("Permissions API error:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}