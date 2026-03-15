import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { callBackend } from "@/lib/server-api";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    
    const cookieStore = await cookies();
    const token = cookieStore.get("token_employee")?.value ||
                  cookieStore.get("token_company")?.value;

    if (!token) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    const result = await callBackend({
      method: "GET",
      path: `/portal/employees/${id}/beneficiaries`,
      authType: "employee",
      token,
    });

    if (result.success) {
      return NextResponse.json(result);
    }

    return NextResponse.json(
      { success: false, message: result.message || "Failed to fetch beneficiaries" },
      { status: result.status || 400 }
    );
  } catch (error) {
    console.error("Get beneficiaries API error:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const contentType = request.headers.get("content-type") || "";
    
    let body;
    let headers: Record<string, string> = {};

    if (contentType.includes("multipart/form-data")) {
      body = await request.formData();
      headers["Content-Type"] = "multipart/form-data";
    } else {
      body = await request.json();
      headers["Content-Type"] = "application/json";
    }
    
    const cookieStore = await cookies();
    const token = cookieStore.get("token_employee")?.value ||
                  cookieStore.get("token_company")?.value;

    if (!token) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    const result = await callBackend({
      method: "POST",
      path: `/portal/employees/${id}/beneficiaries`,
      data: body,
      authType: "employee",
      token,
      headers,
    });

    if (result.success) {
      return NextResponse.json(result);
    }

    return NextResponse.json(
      { success: false, message: result.message || "Failed to save beneficiaries" },
      { status: result.status || 400 }
    );
  } catch (error) {
    console.error("Save beneficiaries API error:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}