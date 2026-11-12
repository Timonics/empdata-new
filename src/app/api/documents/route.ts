import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import axios from "axios";

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL;

/**
 * Authenticated document proxy.
 * Fetches a file from the backend using the caller's auth cookie and
 * streams it back, so documents can be opened in a tab or downloaded.
 */
export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const src = url.searchParams.get("src");
    const download = url.searchParams.get("download") === "1";

    if (!src || (!src.startsWith("/") && !src.startsWith("storage/"))) {
      return NextResponse.json(
        { success: false, message: "Invalid document source" },
        { status: 400 },
      );
    }

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

    const backendPath = src.startsWith("/") ? src : `/${src}`;

    const response = await axios.get(`${BACKEND_URL}${backendPath}`, {
      responseType: "arraybuffer",
      headers: {
        Authorization: `Bearer ${token}`,
        "x-auth-type": "super-admin",
      },
      timeout: 60000,
    });

    const contentType =
      response.headers["content-type"] || "application/octet-stream";
    const filename =
      decodeURIComponent(backendPath.split("/").pop() || "document") ||
      "document";
    const disposition = download ? "attachment" : "inline";

    return new NextResponse(Buffer.from(response.data), {
      status: 200,
      headers: {
        "Content-Type": contentType,
        "Content-Disposition": `${disposition}; filename="${filename}"`,
        "Cache-Control": "private, max-age=300",
      },
    });
  } catch (error) {
    const status = axios.isAxiosError(error)
      ? error.response?.status
      : undefined;
    console.error("Document proxy error:", status || error);
    return NextResponse.json(
      { success: false, message: "Failed to load document" },
      { status: status || 500 },
    );
  }
}
