import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { callBackend } from "@/lib/server-api";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, code, session_token } = body;

    if (!email || !code || !session_token) {
      return NextResponse.json(
        { success: false, message: "Email, code, and session token are required" },
        { status: 400 }
      );
    }

    console.log(`Verifying 2FA for admin: ${email}`);

    const result = await callBackend({
      method: "POST",
      path: "/auth/verify-2fa",
      data: { email, code, session_token },
      authType: "super-admin",
    });

    console.log("Verify 2FA result:", result);

    if (result.success && result.data?.token) {
      const token = result.data.token;
      const refreshToken = result.data.refresh_token;
      const user = result.data.user;

      const cookieStore = await cookies();

      // Set the final auth token
      cookieStore.set({
        name: `token_super-admin`,
        value: token,
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 60 * 60, // 1 hour
        path: "/",
      });

      if (refreshToken) {
        cookieStore.set({
          name: `refresh_super-admin`,
          value: refreshToken,
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: "lax",
          maxAge: 60 * 60 * 24 * 7, // 7 days
          path: "/api/auth/refresh",
        });
      }

      return NextResponse.json({
        success: true,
        user: {
          ...user,
          role: "admin",
        },
      });
    }

    return NextResponse.json(
      { success: false, message: result.message || "Verification failed" },
      { status: 401 }
    );
  } catch (error) {
    console.error("Verify 2FA API error:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}