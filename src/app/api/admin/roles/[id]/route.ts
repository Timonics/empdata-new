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
    const token = cookieStore.get("token_super-admin")?.value;

    if (!token) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    const result = await callBackend({
      method: "GET",
      path: `/admin/roles/${id}`,
      authType: "super-admin",
      token,
    });

    if (result.success) {
      return NextResponse.json(result);
    }

    return NextResponse.json(
      {
        success: false,
        message: result.message || "Failed to fetch role",
      },
      { status: result.status || 400 }
    );
  } catch (error) {
    console.error("Get role API error:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function PUT(
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

    const body = await request.json();

    const result = await callBackend({
      method: "PUT",
      path: `/admin/roles/${id}`,
      authType: "super-admin",
      token,
      data: body,
    });

    if (result.success) {
      return NextResponse.json(result);
    }

    return NextResponse.json(
      {
        success: false,
        message: result.message || "Failed to update role",
      },
      { status: result.status || 400 }
    );
  } catch (error) {
    console.error("Update role API error:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function DELETE(
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
      method: "DELETE",
      path: `/admin/roles/${id}`,
      authType: "super-admin",
      token,
    });

    if (result.success) {
      return NextResponse.json(result);
    }

    return NextResponse.json(
      {
        success: false,
        message: result.message || "Failed to delete role",
      },
      { status: result.status || 400 }
    );
  } catch (error) {
    console.error("Delete role API error:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}