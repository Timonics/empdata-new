import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { callBackend } from "@/lib/server-api";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    
    const cookieStore = await cookies();
    const token = cookieStore.get("token_super-admin")?.value;

    if (!token) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    const result = await callBackend({
      method: "POST",
      path: `/admin/individual/registrations/${id}/approve`,
      authType: "super-admin",
      token,
    });

    if (result.success) {
      return NextResponse.json(result);
    }

    return NextResponse.json(
      { success: false, message: result.message || "Failed to approve registration" },
      { status: result.status || 400 }
    );
  } catch (error) {
    console.error("Approve individual registration API error:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}