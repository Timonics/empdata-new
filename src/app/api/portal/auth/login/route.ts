import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { callBackend } from "@/lib/server-api";
import { UserRole } from "@/types/auth.types";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json(
        { success: false, message: "Email and password are required" },
        { status: 400 },
      );
    }

    console.log(`Portal login attempt for: ${email}`);

    // Try company_admin first, then employee
    const rolesToTry: UserRole[] = ["company_admin", "employee"];
    let lastError = null;

    for (const role of rolesToTry) {
      console.log(`Attempting login as ${role}`);

      const result = await callBackend({
        method: "POST",
        path: "/portal/auth/login",
        data: { email, password },
        authType: role,
      });

      console.log(`Result for ${role}:`, JSON.stringify(result, null, 2));

      if (result.success) {
        const responseData = result.data;

        // Case 1: 2FA is required
        if (responseData?.requires_2fa && responseData?.session_token) {
          console.log(`2FA required for ${role}`);

          return NextResponse.json({
            success: true,
            requires_2fa: true,
            session_token: responseData.session_token,
            user: responseData.user,
            message:
              responseData.message || "Verification code sent to your email.",
          });
        }

        // Case 2: Normal login with token (2FA disabled)
        if (responseData?.token) {
          console.log(`Normal login successful for ${role}`);

          const token = responseData.token;
          const refreshToken = responseData.refresh_token;
          const user = responseData.user;

          const cookieStore = await cookies();

          // Set the auth token
          cookieStore.set({
            name: `token_${role}`,
            value: token,
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            maxAge: 60 * 60, // 1 hour
            path: "/",
          });

          if (refreshToken) {
            cookieStore.set({
              name: `refresh_${role}`,
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
              role,
            },
          });
        }
      }

      lastError = result;
    }

    // If we get here, all login attempts failed
    console.log("All portal login attempts failed");
    return NextResponse.json(
      { success: false, message: "Invalid email or password" },
      { status: 401 },
    );
  } catch (error) {
    console.error("Portal login API error:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 },
    );
  }
}
