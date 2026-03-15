import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { callBackend } from "@/lib/server-api";

export async function GET() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token_admin")?.value;

    if (!token) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 },
      );
    }

    const result = await callBackend({
      method: "GET",
      path: "/admin/profile",
      authType: "admin",
      token,
    });

    if (result.success) {
      return NextResponse.json(result);
    }

    return NextResponse.json(
      { success: false, message: result.message || "Failed to fetch profile" },
      { status: result.status || 400 },
    );
  } catch (error) {
    console.error("Profile API error:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 },
    );
  }
}

export async function PUT(request: Request) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token_admin")?.value;

    if (!token) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 },
      );
    }

    const contentType = request.headers.get("content-type") || "";
    let body;

    if (contentType.includes("multipart/form-data")) {
      body = await request.formData();
    } else {
      body = await request.json();
    }

    const result = await callBackend({
      method: "PUT",
      path: "/admin/profile",
      data: body,
      authType: "admin",
      token,
      headers: contentType.includes("multipart/form-data")
        ? { "Content-Type": "multipart/form-data" }
        : undefined,
    });

    if (result.success) {
      return NextResponse.json(result);
    }

    return NextResponse.json(
      { success: false, message: result.message || "Failed to update profile" },
      { status: result.status || 400 },
    );
  } catch (error) {
    console.error("Update profile API error:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 },
    );
  }
}
