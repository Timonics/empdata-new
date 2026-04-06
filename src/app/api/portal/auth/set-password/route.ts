// app/api/portal/auth/set-password/route.ts
import { NextResponse } from "next/server";
import { callBackend } from "@/lib/server-api";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    // Validate required fields
    const { token, email, password, password_confirmation } = body;
    if (!token || !email || !password || !password_confirmation) {
      return NextResponse.json(
        { success: false, message: "Missing required fields" },
        { status: 400 },
      );
    }

    // Proxy to backend
    const result = await callBackend({
      method: "POST",
      path: "/portal/auth/set-password",
      data: { token, email, password, password_confirmation },
      // No authentication token needed for this endpoint
    });

    if (result.success) {
      return NextResponse.json(result);
    }

    return NextResponse.json(
      {
        success: false,
        message: result.message || "Failed to set password",
      },
      { status: result.status || 400 },
    );
  } catch (error) {
    console.error("Set password API error:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 },
    );
  }
}
