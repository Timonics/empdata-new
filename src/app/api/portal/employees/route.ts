import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { callBackend } from "@/lib/server-api";

export async function GET(request: Request) {
  try {
    const cookieStore = await cookies();
    // Try company token first, then employee token
    const token =
      cookieStore.get("token_company_admin")?.value ||
      cookieStore.get("token_employee")?.value;

    if (!token) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 },
      );
    }

    console.log(`Found token: ${token}`);

    const url = new URL(request.url);
    const queryString = url.searchParams.toString();

    const result = await callBackend({
      method: "GET",
      path: `/portal/employees${queryString ? `?${queryString}` : ""}`,
      authType: "company_admin",
      token,
    });

    console.log(`Result:`, JSON.stringify(result, null, 2));

    if (result.success) {
      return NextResponse.json(result);
    }

    return NextResponse.json(
      {
        success: false,
        message: result.message || "Failed to fetch employees",
      },
      { status: result.status || 400 },
    );
  } catch (error) {
    console.error("Portal employees API error:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 },
    );
  }
}

export async function POST(request: Request) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token_company")?.value;

    if (!token) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 },
      );
    }

    const body = await request.json();

    const result = await callBackend({
      method: "POST",
      path: "/portal/employees",
      data: body,
      authType: "company_admin",
      token,
    });

    if (result.success) {
      return NextResponse.json(result);
    }

    return NextResponse.json(
      {
        success: false,
        message: result.message || "Failed to create employee",
      },
      { status: result.status || 400 },
    );
  } catch (error) {
    console.error("Create employee API error:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 },
    );
  }
}
