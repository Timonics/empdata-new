class ServerEnv {
  private static instance: ServerEnv;
  private validated = false;

  private constructor() {
    this.validate();
  }

  static getInstance(): ServerEnv {
    if (!ServerEnv.instance) {
      ServerEnv.instance = new ServerEnv();
    }
    return ServerEnv.instance;
  }

  private validate() {
    if (this.validated) return;

    const requiredEnvVars = ["NEXT_PUBLIC_API_URL", "ENCRYPTION_KEY"] as const;

    const missing: string[] = [];

    requiredEnvVars.forEach((envVar) => {
      if (!process.env[envVar]) {
        missing.push(envVar);
      }
    });

    if (missing.length > 0) {
      throw new Error(
        `Missing required environment variables:\n${missing.join("\n")}\n\n` +
          "Please check your .env.local file",
      );
    }

    this.validated = true;
  }

  get API_URL(): string {
    return process.env.NEXT_PUBLIC_API_URL!;
  }

  get ENCRYPTION_KEY(): string {
    return process.env.ENCRYPTION_KEY!;
  }

  get APP_URL(): string {
    return process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
  }
}

// Export a singleton instance
export const serverEnv = ServerEnv.getInstance();

// Helper to check if we're on server
export const isServer = typeof window === "undefined";
export const isClient = !isServer;
