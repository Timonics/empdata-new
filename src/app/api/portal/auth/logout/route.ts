import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { callBackend } from "@/lib/server-api";

export async function POST(request: Request) {
  try {
    const cookieStore = await cookies();
    
    // Get the user's role from cookies
    const companyToken = cookieStore.get("token_company_admin")?.value;
    const employeeToken = cookieStore.get("token_employee")?.value;
    
    let token: string | undefined;
    let role: string | undefined;
    
    // Determine which role is logged in
    if (companyToken) {
      token = companyToken;
      role = "company";
    } else if (employeeToken) {
      token = employeeToken;
      role = "employee";
    } else {
      // No active session
      return NextResponse.json(
        { success: true, message: "Already logged out" },
        { status: 200 }
      );
    }

    console.log(`Logging out ${role} user`);

    // Call backend logout
    const result = await callBackend({
      method: "POST",
      path: "/portal/auth/logout",
      authType: role === "company" ? "company_admin" : "employee",
      token,
    });

    // Clear cookies regardless of backend response
    cookieStore.delete("token_company_admin");
    cookieStore.delete("token_employee");
    cookieStore.delete("refresh_company_admin");
    cookieStore.delete("refresh_employee");

    if (result.success) {
      return NextResponse.json({
        success: true,
        message: "Logged out successfully",
      });
    }

    // Even if backend fails, we cleared cookies so user is logged out
    return NextResponse.json({
      success: true,
      message: "Logged out locally",
    });

  } catch (error) {
    console.error("Portal logout API error:", error);
    
    // Still try to clear cookies on error
    try {
      const cookieStore = await cookies();
      cookieStore.delete("token_company_admin");
      cookieStore.delete("token_employee");
      cookieStore.delete("refresh_company_admin");
      cookieStore.delete("refresh_employee");
    } catch (e) {
      // Ignore cookie errors
    }

    return NextResponse.json({
      success: true,
      message: "Logged out (with errors)",
    });
  }
}