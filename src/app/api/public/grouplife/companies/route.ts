import { NextResponse } from "next/server";
import { callBackend } from "@/lib/server-api";

export async function GET() {
  try {
    const result = await callBackend({
      method: "GET",
      path: "/public/grouplife/companies",
    });

    if (result.success) {
      return NextResponse.json(result);
    }

    return NextResponse.json(
      {
        success: false,
        message: result.message || "Failed to fetch companies",
      },
      { status: result.status || 400 },
    );
  } catch (error) {
    console.error("Public companies API error:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 },
    );
  }
}
