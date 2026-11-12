import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { callBackend } from "@/lib/server-api";
import { requirePermission } from "@/lib/server-api";

async function getToken() {
  const cookieStore = await cookies();
  return cookieStore.get("token_super-admin")?.value;
}

function unauthorized() {
  return NextResponse.json(
    { success: false, message: "Unauthorized" },
    { status: 401 },
  );
}

export async function GET(request: Request) {
  try {
    const token = await getToken();
    if (!token) return unauthorized();

    const url = new URL(request.url);
    const queryString = url.searchParams.toString();

    const result = await callBackend({
      method: "GET",
      path: `/portal/employees${queryString ? `?${queryString}` : ""}`,
      authType: "super-admin",
      token,
    });

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
    console.error("Admin employees API error:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 },
    );
  }
}

export async function POST(request: Request) {
  try {
    const token = await getToken();
    if (!token) return unauthorized();

    const body = await request.json();

    const result = await callBackend({
      method: "POST",
      path: "/portal/employees",
      data: body,
      authType: "super-admin",
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
