// app/api/portal/company/[id]/full/route.ts
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { callBackend } from "@/lib/server-api";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ company_id: string }> },
) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token_company_admin")?.value;

    if (!token) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 },
      );
    }

    const { company_id } = await params;

    if (!company_id) {
      return NextResponse.json(
        { success: false, message: "Company ID is required" },
        { status: 400 },
      );
    }

    console.log(company_id);

    const result = await callBackend({
      method: "GET",
      path: `/portal/companies/${company_id}/full`,
      authType: "company_admin",
      token,
    });

    console.log(result);

    if (result.success) {
      return NextResponse.json(result);
    }

    return NextResponse.json(
      {
        success: false,
        message: result.message || "Failed to fetch company employees",
      },
      { status: result.status || 400 },
    );
  } catch (error) {
    console.error("Company full employees API error:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 },
    );
  }
}
