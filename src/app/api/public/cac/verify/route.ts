import { NextResponse } from "next/server";
import { callBackend } from "@/lib/server-api";

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const rcNumber = url.searchParams.get("rc_number");
    const companyType = url.searchParams.get("company_type");

    if (!rcNumber || !companyType) {
      return NextResponse.json(
        {
          success: false,
          message: "rc_number and company_type are required.",
        },
        { status: 422 },
      );
    }

    const result = await callBackend({
      method: "GET",
      path: `/public/cac/verify?rc_number=${encodeURIComponent(rcNumber)}&company_type=${encodeURIComponent(companyType)}`,
    });

    if (result.success) {
      return NextResponse.json(result);
    }

    return NextResponse.json(
      {
        success: false,
        message: result.message || "CAC verification failed",
        service_down: result.data?.service_down,
      },
      { status: result.status || 422 },
    );
  } catch (error) {
    console.error("Public CAC verification API error:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Internal server error. Please try again later.",
      },
      { status: 500 },
    );
  }
}
