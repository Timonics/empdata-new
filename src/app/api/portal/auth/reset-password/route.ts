import { NextResponse } from "next/server";
import { callBackend } from "@/lib/server-api";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { token, email, password, password_confirmation } = body;

    if (!token || !email || !password || !password_confirmation) {
      return NextResponse.json(
        { success: false, message: "Missing required fields" },
        { status: 400 }
      );
    }

    const result = await callBackend({
      method: "POST",
      path: "/portal/auth/reset-password",
      data: { token, email, password, password_confirmation },
    });

    if (result.success) {
      return NextResponse.json(result);
    }

    return NextResponse.json(
      {
        success: false,
        message: result.message || "Failed to reset password",
        errors: result.errors,
      },
      { status: result.status || 400 }
    );
  } catch (error) {
    console.error("Portal reset password API error:", error);

    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}
