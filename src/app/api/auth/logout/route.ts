import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { callBackend } from "@/lib/server-api";

export async function POST(request: Request) {
  try {
    const cookieStore = await cookies();

    // Get the admin token from cookies
    const token = cookieStore.get("token_super-admin")?.value;

    if (!token) {
      // Already logged out
      return NextResponse.json({
        success: true,
        message: "Already logged out",
      });
    }

    // Call backend logout with the token
    const result = await callBackend({
      method: "POST",
      path: "/auth/logout",
      data: {},
      authType: "super-admin",
      token, // Include the token for authentication
    });

    // Always clear the cookie, regardless of backend response
    cookieStore.delete("token_super-admin");

    if (result.success) {
      return NextResponse.json({
        success: true,
        message: "Logged out successfully",
      });
    }

    // Even if backend fails, we cleared the cookie
    return NextResponse.json({
      success: true,
      message: "Logged out locally",
    });
  } catch (error) {
    console.error("Admin logout API error:", error);

    // Still try to clear the cookie on error
    try {
      const cookieStore = await cookies();
      cookieStore.delete("token_admin");
    } catch (e) {
      // Ignore cookie errors
    }

    return NextResponse.json({
      success: true,
      message: "Logged out (with errors)",
    });
  }
}
