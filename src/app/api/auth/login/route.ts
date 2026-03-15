import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { callBackend } from "@/lib/server-api";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json(
        { success: false, message: "Email and password required" },
        { status: 400 }
      );
    }

    console.log(`Admin login attempt for: ${email}`);

    const result = await callBackend({
      method: "POST",
      path: "/auth/login",
      data: { email, password },
      authType: "admin",
    });

    console.log(`Result:`, JSON.stringify(result, null, 2));

    // Check if the backend call was successful
    if (result.success) {
      // The actual data is nested inside result.data
      const responseData = result.data;

      // Case 1: 2FA is required (no token, but has session_token)
      if (responseData?.requires_2fa && responseData?.session_token) {
        console.log("2FA required for admin");
        
        return NextResponse.json({
          success: true,
          requires_2fa: true,
          session_token: responseData.session_token,
          user: responseData.user,
          message: responseData.message || "Verification code sent to your email.",
        });
      }

      // Case 2: Normal login with token
      if (responseData?.token) {
        console.log("Normal login successful for admin");
        
        const token = responseData.token;
        const refreshToken = responseData.refresh_token;
        const user = responseData.user;

        const cookieStore = await cookies();

        cookieStore.set({
          name: `token_admin`,
          value: token,
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: "lax",
          maxAge: 60 * 60,
          path: "/",
        });

        if (refreshToken) {
          cookieStore.set({
            name: `refresh_admin`,
            value: refreshToken,
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            maxAge: 60 * 60 * 24 * 7,
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
    }

    // If we get here, login failed
    console.log("Admin login failed:", result.message);
    
    // Return the error from the backend
    return NextResponse.json(
      { 
        success: false, 
        message: result.message || "Invalid email or password",
        errors: result.errors 
      },
      { status: result.status || 401 }
    );

  } catch (error) {
    console.error("Login API error:", error);

    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}