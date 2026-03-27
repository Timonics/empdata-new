import { NextResponse } from "next/server";
import { callBackend } from "@/lib/server-api";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    console.log("📝 Public NIN Verification Request:", {
      hasEncryptedNIN: !!body.encrypted_nin,
      encryptedNINLength: body.encrypted_nin?.length
    });

    const result = await callBackend({
      method: "POST",
      path: "/public/nin/verify",
      data: body,
    });

    if (result.success) {
      return NextResponse.json(result);
    }

    return NextResponse.json(
      {
        success: false,
        message: result.message || "NIN verification failed",
        errors: result.errors,
      },
      { status: result.status || 400 },
    );
  } catch (error) {
    console.error("Public NIN verification API error:", error);
    return NextResponse.json(
      { 
        success: false, 
        message: "Internal server error. Please try again later." 
      },
      { status: 500 },
    );
  }
}