import { NextResponse } from "next/server";
import { callBackend } from "@/lib/server-api";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    console.log("📝 Public BVN Verification Request:", {
      hasEncryptedBVN: !!body.encrypted_bvn,
      encryptedBVNLength: body.encrypted_bvn?.length,
    });

    const result = await callBackend({
      method: "POST",
      path: "/public/bvn/verify",
      data: body,
    });

    if (result.success) {
      return NextResponse.json(result);
    }

    return NextResponse.json(
      {
        success: false,
        message: result.message || "BVN verification failed",
        service_down: result.data?.service_down,
        errors: result.errors,
      },
      { status: result.status || 400 },
    );
  } catch (error) {
    console.error("Public BVN verification API error:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Internal server error. Please try again later.",
      },
      { status: 500 },
    );
  }
}
