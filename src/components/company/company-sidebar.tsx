"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import {
  LayoutDashboard,
  Users,
  Mail,
  FileText,
  ChevronLeft,
  ChevronRight,
  Menu,
  LogOut,
  X,
} from "lucide-react";
import Logo from "@/components/logo";
import { useSidebar } from "@/contexts/sidebar-context";
import { useAuth } from "@/hooks/useAuth";
import { LogoutDialog } from "../admin/logout-dialog";

const navigation = [
  { name: "Dashboard", link: "/portal/company", icon: LayoutDashboard },
  { name: "Employees", link: "/portal/company/employees", icon: Users },
  { name: "Invitations", link: "/portal/company/invitations", icon: Mail, badge: "3" },
  { name: "Documents", link: "/portal/company/documents", icon: FileText },
];

function NavItem({
  item,
  pathname,
  expanded,
  onNavClick,
}: {
  item: (typeof navigation)[0];
  pathname: string;
  expanded: boolean;
  onNavClick?: () => void;
}) {
  const isActive =
    item.link === "/portal/company"
      ? pathname === item.link
      : pathname.startsWith(item.link);

  return (
    <Link
      href={item.link}
      onClick={onNavClick}
      title={expanded ? undefined : item.name}
      className={cn(
        "group flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors",
        isActive
          ? "bg-white/10 font-semibold text-white shadow-sm"
          : "font-medium text-sidebar-foreground/70 hover:bg-white/5 hover:text-white",
        isActive &&
          "relative before:absolute before:inset-y-1.5 before:left-0 before:w-[3px] before:rounded-full before:bg-brand-400",
        !expanded && "justify-center px-0",
      )}
    >
      <span
        className={cn(
          "flex size-8 shrink-0 items-center justify-center rounded-md transition-colors",
          isActive
            ? "bg-brand-500/20 text-brand-300"
            : "text-sidebar-foreground/60 group-hover:bg-white/5 group-hover:text-white",
        )}
      >
        <item.icon className="size-4" />
      </span>
      {expanded && (
        <>
          <span className="flex-1">{item.name}</span>
          {item.badge && (
            <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-brand-600 px-1.5 text-xs font-semibold text-white">
              {item.badge}
            </span>
          )}
        </>
      )}
    </Link>
  );
}

function SidebarBody({
  pathname,
  expanded,
  onNavClick,
  onLogout,
}: {
  pathname: string;
  expanded: boolean;
  onNavClick?: () => void;
  onLogout: () => void;
}) {
  return (
    <div className="flex h-full flex-col bg-sidebar text-sidebar-foreground">
      {/* Brand */}
      <div
        className={cn(
          "flex h-16 shrink-0 items-center border-b border-sidebar-border px-4",
          !expanded && "justify-center px-0",
        )}
      >
        <Logo width={36} height={36} className="shadow-none" />
        {expanded && (
          <div className="ml-3 leading-tight">
            <p className="font-display text-sm font-semibold text-white">
              EMPDATA
            </p>
            <p className="text-[11px] text-sidebar-foreground/50">
              Company Portal
            </p>
          </div>
        )}
      </div>

      {/* Navigation */}
      <ScrollArea className="flex-1 px-3 py-4">
        <nav className="space-y-0.5">
          {navigation.map((item) => (
            <NavItem
              key={item.link}
              item={item}
              pathname={pathname}
              expanded={expanded}
              onNavClick={onNavClick}
            />
          ))}
        </nav>
      </ScrollArea>

      {/* Logout */}
      <div className="shrink-0 border-t border-sidebar-border p-3">
        <button
          onClick={onLogout}
          title={expanded ? undefined : "Logout"}
          className={cn(
            "flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-sidebar-foreground/70 transition-colors hover:bg-red-500/10 hover:text-red-300",
            !expanded && "justify-center px-0",
          )}
        >
          <LogOut className="size-4 shrink-0" />
          {expanded && <span>Logout</span>}
        </button>
      </div>
    </div>
  );
}

export function CompanySidebar() {
  const { isCollapsed, toggleSidebar } = useSidebar();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [showLogoutDialog, setShowLogoutDialog] = useState(false);
  const pathname = usePathname();
  const { logout, isLoggingOut } = useAuth();

  const expanded = !isCollapsed;

  return (
    <>
      {/* Mobile Menu Button */}
      <Button
        variant="ghost"
        size="icon"
        className="fixed left-4 top-4 z-40 md:hidden"
        onClick={() => setMobileOpen(true)}
      >
        <Menu className="size-5" />
      </Button>

      {/* Mobile Sheet */}
      <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
        <SheetContent side="left" className="w-64 p-0">
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-3 top-4 z-10 text-sidebar-foreground/70 hover:text-white"
            onClick={() => setMobileOpen(false)}
          >
            <X className="size-4" />
          </Button>
          <SidebarBody
            pathname={pathname}
            expanded={true}
            onNavClick={() => setMobileOpen(false)}
            onLogout={() => {
              setMobileOpen(false);
              setShowLogoutDialog(true);
            }}
          />
        </SheetContent>
      </Sheet>

      {/* Desktop Sidebar */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 hidden flex-col border-r border-sidebar-border transition-[width] duration-300 ease-in-out md:flex",
          expanded ? "w-64" : "w-16",
        )}
      >
        <SidebarBody
          pathname={pathname}
          expanded={expanded}
          onLogout={() => setShowLogoutDialog(true)}
        />

        {/* Collapse Toggle */}
        <div className="absolute -right-3 top-[72px] hidden md:block">
          <button
            onClick={toggleSidebar}
            className="flex size-6 items-center justify-center rounded-full border border-border bg-card text-muted-foreground shadow-card transition-colors hover:text-foreground"
          >
            {expanded ? (
              <ChevronLeft className="size-3.5" />
            ) : (
              <ChevronRight className="size-3.5" />
            )}
          </button>
        </div>
      </aside>

      {/* Logout Confirmation Dialog */}
      <LogoutDialog
        open={showLogoutDialog}
        onOpenChange={setShowLogoutDialog}
        onConfirm={logout}
        isLoggingOut={isLoggingOut}
      />
    </>
  );
}
