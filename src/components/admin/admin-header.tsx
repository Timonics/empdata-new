"use client";

import { useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import {
  Bell,
  ChevronDown,
  LogOut,
  User as UserIcon,
  Settings as SettingsIcon,
  Building2,
  Users,
  UserCheck,
  FileCheck,
} from "lucide-react";
import { ProfileModal } from "./profile-modal";
import { LogoutDialog } from "./logout-dialog";
import { ThemeToggle } from "@/components/theme-toggle";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import {
  useRegistrationStatusSummary,
  useRecentRegistrations,
} from "@/hooks/queries/useAnalytics";
import { formatDistanceToNow } from "date-fns";
import type { RecentRegistration } from "@/types/analytics.types";

export function AdminHeader() {
  const router = useRouter();
  const { user, logout, isLoggingOut } = useAuth();

  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showLogoutDialog, setShowLogoutDialog] = useState(false);

  const pathname = usePathname();
  const getPageTitle = () => {
    if (pathname === "/admin") return "Dashboard";
    const pathSegment = pathname.split("/").pop() || "";
    return (
      pathSegment.charAt(0).toUpperCase() +
      pathSegment.slice(1).replace(/-/g, " ")
    );
  };

  // Real notification sources: pending review workload + recent submissions
  const { data: summary } = useRegistrationStatusSummary();
  const { data: recent } = useRecentRegistrations(24);

  const pendingCompanies =
    summary?.company_registrations?.by_status?.pending_approval ?? 0;
  const pendingEmployees =
    summary?.employee_registrations?.by_status?.pending_approval ?? 0;
  const pendingTotal = pendingCompanies + pendingEmployees;

  const recentItems: RecentRegistration[] = recent?.data ?? [];

  interface NotificationItem {
    key: string;
    title: string;
    description: string;
    time: string;
    icon: typeof FileCheck;
    href: string;
  }

  const notifications: NotificationItem[] = [];

  if (pendingTotal > 0) {
    notifications.push({
      key: "pending-review",
      title: `${pendingTotal} registration${pendingTotal === 1 ? "" : "s"} pending review`,
      description: `${pendingCompanies} company / director, ${pendingEmployees} employee submission${
        pendingEmployees === 1 ? "" : "s"
      } awaiting approval`,
      time: "Workload",
      icon: FileCheck,
      href: "/admin/registrations/group-life",
    });
  }

  for (const item of recentItems.slice(0, 5)) {
    notifications.push({
      key: `${item.type}-${item.id}`,
      title: `New ${item.type} registration`,
      description: `${item.name} · ${item.email}`,
      time: item.submitted_at
        ? formatDistanceToNow(new Date(item.submitted_at), { addSuffix: true })
        : "",
      icon: item.type === "company" ? Building2 : Users,
      href:
        item.type === "company"
          ? "/admin/registrations/group-life"
          : "/admin/registrations/employee-group-life",
    });
  }

  const handleLogout = async () => {
    try {
      logout();
      toast.success("Logged out successfully");
      router.push("/admin/login");
    } catch (error) {
      toast.error("Failed to logout");
    }
  };

  const getUserInitials = () => {
    if (user?.name) {
      return user.name
        .split(" ")
        .map((n: string) => n[0])
        .join("")
        .slice(0, 2)
        .toUpperCase();
    }
    return "AD";
  };

  return (
    <>
      <header className="z-10 flex h-16 shrink-0 items-center justify-between border-b border-border/70 bg-card/80 px-4 backdrop-blur-md md:px-6">
        {/* Left — page title */}
        <div className="flex min-w-0 items-center gap-3">
          <h1 className="truncate font-display text-lg font-semibold tracking-tight">
            {getPageTitle()}
          </h1>
        </div>

        {/* Right — actions */}
        <div className="flex items-center gap-1.5">
          <ThemeToggle />

          {/* Notifications — fed by real pending counts and recent registrations */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="relative">
                <Bell className="size-4.5" />
                {pendingTotal > 0 && (
                  <span className="absolute right-1.5 top-1.5 flex size-4 items-center justify-center rounded-full bg-brand-600 text-[10px] font-semibold text-white">
                    {pendingTotal > 9 ? "9+" : pendingTotal}
                  </span>
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-80 p-0">
              <div className="flex items-center justify-between px-4 py-3">
                <p className="text-sm font-semibold">Notifications</p>
                {pendingTotal > 0 && (
                  <span className="rounded-full bg-brand-50 px-2 py-0.5 text-xs font-medium text-brand-700">
                    {pendingTotal} pending
                  </span>
                )}
              </div>
              <DropdownMenuSeparator className="m-0" />
              {notifications.length === 0 ? (
                <div className="px-4 py-8 text-center">
                  <UserCheck className="mx-auto mb-2 h-8 w-8 text-muted-foreground/40" />
                  <p className="text-sm font-medium">You&apos;re all caught up</p>
                  <p className="text-xs text-muted-foreground">
                    New registrations and pending reviews will appear here.
                  </p>
                </div>
              ) : (
                notifications.map((item) => (
                  <DropdownMenuItem
                    key={item.key}
                    className="cursor-pointer items-start gap-3 px-4 py-3 focus:bg-muted/60"
                    onSelect={() => router.push(item.href)}
                  >
                    <span className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-md bg-brand-50 text-brand-600">
                      <item.icon className="size-4" />
                    </span>
                    <div className="min-w-0 space-y-0.5">
                      <p className="truncate text-sm font-medium">{item.title}</p>
                      <p className="line-clamp-2 text-xs text-muted-foreground">
                        {item.description}
                      </p>
                      {item.time && (
                        <p className="text-[11px] text-muted-foreground/70">
                          {item.time}
                        </p>
                      )}
                    </div>
                  </DropdownMenuItem>
                ))
              )}
            </DropdownMenuContent>
          </DropdownMenu>

          <Separator orientation="vertical" className="mx-1.5 h-6" />

          {/* User Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="flex items-center gap-2.5 px-2 hover:bg-muted"
              >
                <Avatar className="size-8">
                  <AvatarImage src="/avatars/admin.png" alt="Admin" />
                  <AvatarFallback className="bg-brand-100 text-xs font-semibold text-brand-700">
                    {getUserInitials()}
                  </AvatarFallback>
                </Avatar>
                <div className="hidden text-left md:block">
                  <p className="text-sm font-medium leading-none">{user?.name}</p>
                  <p className="mt-0.5 text-xs text-muted-foreground">Super Admin</p>
                </div>
                <ChevronDown className="size-4 text-muted-foreground" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem onSelect={() => setShowProfileModal(true)}>
                <UserIcon className="mr-2 size-4" />
                Profile
              </DropdownMenuItem>
              <DropdownMenuItem onSelect={() => router.push("/admin/settings")}>
                <SettingsIcon className="mr-2 size-4" />
                Settings
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onSelect={() => setShowLogoutDialog(true)}
                className="text-red-600 focus:text-red-600"
              >
                <LogOut className="mr-2 size-4" />
                {isLoggingOut ? "Logging out..." : "Log out"}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>

      {/* Profile Modal */}
      {showProfileModal && (
        <ProfileModal open={showProfileModal} onOpenChange={setShowProfileModal} />
      )}

      {/* Logout Dialog */}
      <LogoutDialog
        open={showLogoutDialog}
        onOpenChange={setShowLogoutDialog}
        onConfirm={handleLogout}
        isLoggingOut={isLoggingOut}
      />
    </>
  );
}
