import { NextResponse } from "next/server";
import { callBackend } from "@/lib/server-api";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email } = body;

    if (!email) {
      return NextResponse.json(
        { success: false, message: "Email is required" },
        { status: 400 }
      );
    }

    const result = await callBackend({
      method: "POST",
      path: "/portal/auth/forgot-password",
      data: { email },
    });

    if (result.success) {
      return NextResponse.json({
        success: true,
        message: result.message || "Password reset link sent to your email.",
      });
    }

    return NextResponse.json(
      {
        success: false,
        message: result.message || "Failed to send reset email",
        errors: result.errors,
      },
      { status: result.status || 400 }
    );
  } catch (error) {
    console.error("Portal forgot password API error:", error);

    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}
