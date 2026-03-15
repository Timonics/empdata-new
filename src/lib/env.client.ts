import { z } from "zod";

// Schema for client-side env vars
const clientEnvSchema = z.object({
  NEXT_PUBLIC_API_URL: z.url(),
  NEXT_PUBLIC_APP_URL: z.url().optional(),
  ENCRYPTION_KEY: z.string(),
});

// Parse env vars
const parsedEnv = clientEnvSchema.safeParse({
  NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
  NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
  ENCRYPTION_KEY: process.env.ENCRYPTION_KEY,
});

// Development fallback
if (!parsedEnv.success) {
  if (process.env.NODE_ENV === "development") {
    console.warn(
      "⚠️ Invalid or missing client environment variables. Falling back to defaults.",
    );
  } else {
    console.error(parsedEnv.error.format());
    throw new Error("Invalid client environment variables");
  }
}

// Final env object
export const clientEnv = {
  API_URL:
    parsedEnv.success && parsedEnv.data.NEXT_PUBLIC_API_URL
      ? parsedEnv.data.NEXT_PUBLIC_API_URL
      : "http://localhost:8000/api",

  APP_URL:
    parsedEnv.success && parsedEnv.data.NEXT_PUBLIC_APP_URL
      ? parsedEnv.data.NEXT_PUBLIC_APP_URL
      : "http://localhost:3000",

  ENCRYPTION_KEY:
    parsedEnv.success && parsedEnv.data.ENCRYPTION_KEY
      ? parsedEnv.data.ENCRYPTION_KEY
      : "",

  isServer: typeof window === "undefined",
  isClient: typeof window !== "undefined",
};
