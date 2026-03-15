import { NextResponse } from "next/server";
import { callBackend } from "@/lib/server-api";

export async function POST(request: Request) {
  try {
    const formData = await request.formData();

    const result = await callBackend({
      method: "POST",
      path: "/public/individual/register",
      data: formData,
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    if (result.success) {
      return NextResponse.json(result);
    }

    return NextResponse.json(
      { success: false, message: result.message || "Registration failed" },
      { status: result.status || 400 }
    );
  } catch (error) {
    console.error("Public individual registration API error:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}