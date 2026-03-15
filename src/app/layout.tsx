import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "./providers";
import { SidebarProvider } from "@/contexts/sidebar-context";

export const metadata: Metadata = {
  title: "EMPDATA - Employee Data Management",
  description: "Manage employees, companies, and group life registrations",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${GeistSans.variable} ${GeistMono.variable}`}
    >
      <body className="font-sans antialiased bg-background text-foreground">
        <SidebarProvider>
          <Providers>{children}</Providers>
        </SidebarProvider>
      </body>
    </html>
  );
}
