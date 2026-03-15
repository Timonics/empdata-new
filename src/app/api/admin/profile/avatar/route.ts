import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { callBackend } from "@/lib/server-api";

export async function POST(request: Request) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token_admin")?.value;

    if (!token) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    const formData = await request.formData();

    const result = await callBackend({
      method: "POST",
      path: "/admin/profile/avatar",
      data: formData,
      authType: "admin",
      token,
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    if (result.success) {
      return NextResponse.json(result);
    }

    return NextResponse.json(
      { success: false, message: result.message || "Failed to upload avatar" },
      { status: result.status || 400 }
    );
  } catch (error) {
    console.error("Upload avatar API error:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}