import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { callBackend } from "@/lib/server-api";

export async function GET(request: Request) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token_super-admin")?.value;

    if (!token) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 },
      );
    }

    const url = new URL(request.url);
    const type = url.searchParams.get("type"); // 'company' or 'employee'
    const id = url.searchParams.get("id");

    if (!type || !id) {
      return NextResponse.json(
        { success: false, message: "Type and ID are required" },
        { status: 400 },
      );
    }

    const path =
      type === "company"
        ? `/admin/grouplife/company-registrations/${id}`
        : `/admin/grouplife/employee-registrations/${id}`;

    const result = await callBackend({
      method: "GET",
      path,
      authType: "super-admin",
      token,
    });

    if (result.success) {
      return NextResponse.json(result);
    }

    return NextResponse.json(
      {
        success: false,
        message: result.message || "Failed to fetch documents",
      },
      { status: result.status || 400 },
    );
  } catch (error) {
    console.error("Documents API error:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 },
    );
  }
}
