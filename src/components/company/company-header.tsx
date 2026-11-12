"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Bell,
  User,
  Settings,
  LogOut,
  HelpCircle,
  Building2,
  ChevronDown,
  UserPlus,
} from "lucide-react";
import { ProfileModal } from "../admin/profile-modal";
import { LogoutDialog } from "../admin/logout-dialog";
import { ThemeToggle } from "@/components/theme-toggle";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";

const notifications = [
  {
    title: "Employee pending verification",
    description: "John Doe submitted NIN for verification",
    time: "5 minutes ago",
    icon: UserPlus,
  },
  {
    title: "Invitation accepted",
    description: "Sarah Johnson accepted your invitation",
    time: "1 hour ago",
    icon: UserPlus,
  },
];

export function CompanyHeader() {
  const pathname = usePathname();
  const { user, logout, isLoggingOut } = useAuth();

  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showLogoutDialog, setShowLogoutDialog] = useState(false);

  const getPageTitle = () => {
    if (pathname === "/portal/company") return "Dashboard";
    const pathSegment = pathname.split("/").pop() || "";
    return (
      pathSegment.charAt(0).toUpperCase() +
      pathSegment.slice(1).replace(/-/g, " ")
    );
  };

  const handleLogout = async () => {
    try {
      logout();
      toast.success("Logged out successfully");
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
    return "CA";
  };

  return (
    <>
      <header className="z-10 flex h-16 shrink-0 items-center justify-between border-b border-border/70 bg-card/80 px-4 backdrop-blur-md md:px-6">
        {/* Left — page title */}
        <div className="flex min-w-0 items-center gap-3">
          <h1 className="truncate font-display text-lg font-semibold tracking-tight">
            {getPageTitle()}
          </h1>
          <Badge
            variant="outline"
            className="hidden border-emerald-200 bg-emerald-50 text-emerald-700 md:inline-flex"
          >
            <span className="size-1.5 rounded-full bg-current opacity-70" />
            Company Portal
          </Badge>
        </div>

        {/* Right — actions */}
        <div className="flex items-center gap-1.5">
          <ThemeToggle />

          {/* Company selector */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className="hidden gap-2 md:flex"
              >
                <Building2 className="size-4 text-muted-foreground" />
                <span className="max-w-40 truncate">
                  {user?.company_name || "Your Company"}
                </span>
                <ChevronDown className="size-3.5 text-muted-foreground" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Switch Company</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>{user?.company_name || "Your Company"}</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Notifications */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="relative">
                <Bell className="size-4.5" />
                <span className="absolute right-1.5 top-1.5 flex size-4 items-center justify-center rounded-full bg-brand-600 text-[10px] font-semibold text-white">
                  2
                </span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-80 p-0">
              <div className="flex items-center justify-between px-4 py-3">
                <p className="text-sm font-semibold">Notifications</p>
                <span className="rounded-full bg-brand-50 px-2 py-0.5 text-xs font-medium text-brand-700">
                  2 new
                </span>
              </div>
              <DropdownMenuSeparator className="m-0" />
              {notifications.map((item, i) => (
                <DropdownMenuItem
                  key={i}
                  className="cursor-pointer items-start gap-3 px-4 py-3 focus:bg-muted/60"
                >
                  <span className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-md bg-brand-50 text-brand-600">
                    <item.icon className="size-4" />
                  </span>
                  <div className="min-w-0 space-y-0.5">
                    <p className="truncate text-sm font-medium">{item.title}</p>
                    <p className="line-clamp-2 text-xs text-muted-foreground">
                      {item.description}
                    </p>
                    <p className="text-[11px] text-muted-foreground/70">
                      {item.time}
                    </p>
                  </div>
                </DropdownMenuItem>
              ))}
              <DropdownMenuSeparator className="m-0" />
              <button className="w-full py-2.5 text-center text-xs font-semibold text-brand-700 transition-colors hover:text-brand-800">
                View all notifications
              </button>
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
                  <AvatarImage src="/avatars/company-admin.png" alt="Admin" />
                  <AvatarFallback className="bg-emerald-100 text-xs font-semibold text-emerald-700">
                    {getUserInitials()}
                  </AvatarFallback>
                </Avatar>
                <div className="hidden text-left leading-tight lg:block">
                  <p className="text-sm font-medium">
                    {user?.name || "Company Admin"}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Company Administrator
                  </p>
                </div>
                <ChevronDown className="hidden size-3.5 text-muted-foreground lg:block" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel className="font-normal">
                <p className="text-sm font-medium">
                  {user?.name || "Company Admin"}
                </p>
                <p className="text-xs text-muted-foreground">
                  {user?.email || "admin@company.com"}
                </p>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => setShowProfileModal(true)}>
                <User className="mr-2 size-4" />
                Profile
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Settings className="mr-2 size-4" />
                Settings
              </DropdownMenuItem>
              <DropdownMenuItem>
                <HelpCircle className="mr-2 size-4" />
                Help & Support
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => setShowLogoutDialog(true)}
                className="text-red-600 focus:text-red-600"
              >
                <LogOut className="mr-2 size-4" />
                Sign Out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>

      {/* Profile Modal */}
      <ProfileModal
        open={showProfileModal}
        onOpenChange={setShowProfileModal}
      />

      {/* Logout Confirmation Dialog */}
      <LogoutDialog
        open={showLogoutDialog}
        onOpenChange={setShowLogoutDialog}
        onConfirm={handleLogout}
        isLoggingOut={isLoggingOut}
      />
    </>
  );
}
