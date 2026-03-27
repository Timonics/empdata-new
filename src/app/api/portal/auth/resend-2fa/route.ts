import { NextResponse } from "next/server";
import { callBackend } from "@/lib/server-api";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, session_token } = body;

    if (!email || !session_token) {
      return NextResponse.json(
        { success: false, message: "Email and session token are required" },
        { status: 400 }
      );
    }

    console.log(`Resending 2FA code for portal user: ${email}`);

    const result = await callBackend({
      method: "POST",
      path: "/portal/auth/resend-2fa-code",
      data: { email, session_token },
      authType: "super-admin",
    });

    if (result.success) {
      return NextResponse.json({
        success: true,
        message: result.message || "Verification code resent successfully",
      });
    }

    return NextResponse.json(
      { success: false, message: result.message || "Failed to resend code" },
      { status: result.status || 400 }
    );
  } catch (error) {
    console.error("Portal resend 2FA API error:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}