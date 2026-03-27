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
    const queryString = url.searchParams.toString();

    const result = await callBackend({
      method: "GET",
      path: `/admin/companies/export${queryString ? `?${queryString}` : ""}`,
      authType: "super-admin",
      token,
    });

    if (result.success) {
      // Return CSV file
      return new NextResponse(result.data, {
        headers: {
          "Content-Type": "text/csv",
          "Content-Disposition": `attachment; filename="companies-${new Date().toISOString().split("T")[0]}.csv"`,
        },
      });
    }

    return NextResponse.json(
      {
        success: false,
        message: result.message || "Failed to export companies",
      },
      { status: result.status || 400 },
    );
  } catch (error) {
    console.error("Export companies API error:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 },
    );
  }
}
