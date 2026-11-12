import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import axios from "axios";

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL;

/**
 * Export employee registrations to CSV.
 * Proxies the file stream from the backend with the admin token.
 */
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

    if (!BACKEND_URL) {
      return NextResponse.json(
        { success: false, message: "Backend URL is not configured" },
        { status: 500 },
      );
    }

    const url = new URL(request.url);
    const queryString = url.searchParams.toString();

    const response = await axios.get(
      `${BACKEND_URL}/admin/grouplife/employee-registrations/export/csv${queryString ? `?${queryString}` : ""}`,
      {
        responseType: "arraybuffer",
        headers: {
          Authorization: `Bearer ${token}`,
          "x-auth-type": "super-admin",
        },
        timeout: 120000,
      },
    );

    return new NextResponse(Buffer.from(response.data), {
      status: 200,
      headers: {
        "Content-Type": "text/csv",
        "Content-Disposition": `attachment; filename="employee-registrations-${new Date().toISOString().split("T")[0]}.csv"`,
      },
    });
  } catch (error) {
    const status = axios.isAxiosError(error)
      ? error.response?.status
      : undefined;
    console.error("Employee registrations export API error:", status || error);
    return NextResponse.json(
      { success: false, message: "Export failed" },
      { status: status || 500 },
    );
  }
}
