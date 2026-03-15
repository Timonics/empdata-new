import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { callBackend } from "@/lib/server-api";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { type, documentType, reason } = body;
    
    const cookieStore = await cookies();
    const token = cookieStore.get("token_admin")?.value;

    if (!token) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    const basePath = type === 'company' 
      ? `/admin/grouplife/company-registrations`
      : `/admin/grouplife/employee-registrations`;

    const result = await callBackend({
      method: "POST",
      path: `${basePath}/${id}/reject-document`,
      data: { document_type: documentType, reason },
      authType: "admin",
      token,
    });

    if (result.success) {
      return NextResponse.json(result);
    }

    return NextResponse.json(
      { success: false, message: result.message || "Failed to reject document" },
      { status: result.status || 400 }
    );
  } catch (error) {
    console.error("Reject document API error:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}