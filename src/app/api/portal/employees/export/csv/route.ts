import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { callBackend } from "@/lib/server-api";

export async function GET(request: Request) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token_company")?.value;

    if (!token) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    const url = new URL(request.url);
    const queryString = url.searchParams.toString();

    const result = await callBackend({
      method: "GET",
      path: `/portal/employees/export/csv${queryString ? `?${queryString}` : ''}`,
      authType: "company_admin",
      token,
      headers: {
        "Accept": "text/csv",
      },
    });

    if (result.success) {
      // Return CSV file
      return new NextResponse(result.data, {
        headers: {
          'Content-Type': 'text/csv; charset=UTF-8',
          'Content-Disposition': result.headers?.['content-disposition'] || 
            `attachment; filename="employees-${new Date().toISOString().split('T')[0]}.csv"`,
        },
      });
    }

    return NextResponse.json(
      { success: false, message: result.message || "Failed to export employees" },
      { status: result.status || 400 }
    );
  } catch (error) {
    console.error("Export employees API error:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}