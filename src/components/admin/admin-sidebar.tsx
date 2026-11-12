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
  Building2,
  Users,
  StickyNote,
  ShieldCheck,
  Logs,
  Settings,
  ChevronLeft,
  ChevronRight,
  Menu,
  BarChart3,
  LogOut,
  X,
  FileText,
  Shield,
  KeyRound,
} from "lucide-react";
import Logo from "@/components/logo";
import { useSidebar } from "@/contexts/sidebar-context";
import { useAuth } from "@/hooks/useAuth";
import { LogoutDialog } from "./logout-dialog";

type NavChild = { name: string; link: string };
type NavEntry =
  | { name: string; link: string; icon: React.ComponentType<{ className?: string }> }
  | { name: string; icon: React.ComponentType<{ className?: string }>; children: NavChild[] };

const sections: { label: string; items: NavEntry[] }[] = [
  {
    label: "Overview",
    items: [
      { name: "Dashboard", link: "/admin", icon: LayoutDashboard },
      {
        name: "Registrations",
        icon: StickyNote,
        children: [
          { name: "Group Life", link: "/admin/registrations/group-life" },
          { name: "Corporate", link: "/admin/registrations/corporate" },
          { name: "Individual", link: "/admin/registrations/individual" },
        ],
      },
    ],
  },
  {
    label: "Organisations",
    items: [
      { name: "Companies", link: "/admin/companies", icon: Building2 },
      { name: "Employees", link: "/admin/employees", icon: Users },
    ],
  },
  {
    label: "Insurance",
    items: [
      { name: "Policies", link: "/admin/policies", icon: FileText },
      { name: "Claims", link: "/admin/claims", icon: Shield },
      { name: "Verification", link: "/admin/verification", icon: ShieldCheck },
    ],
  },
  {
    label: "Reports & Compliance",
    items: [
      { name: "Audit Logs", link: "/admin/audit-logs", icon: Logs },
      { name: "Reports", link: "/admin/reports", icon: BarChart3 },
    ],
  },
  {
    label: "System",
    items: [
      { name: "Permissions", link: "/admin/permissions", icon: KeyRound },
      { name: "Settings", link: "/admin/settings", icon: Settings },
    ],
  },
];

function isItemActive(item: NavEntry, pathname: string): boolean {
  if ("link" in item) {
    return pathname === item.link;
  }
  return item.children.some((c) => pathname === c.link);
}

function NavItem({
  item,
  pathname,
  expanded,
  onNavClick,
}: {
  item: NavEntry;
  pathname: string;
  expanded: boolean;
  onNavClick?: () => void;
}) {
  const active = isItemActive(item, pathname);
  const [open, setOpen] = useState(
    "children" in item && item.children.some((c) => pathname === c.link),
  );

  if ("children" in item) {
    return (
      <div>
        <button
          onClick={() => setOpen(!open)}
          aria-expanded={open}
          className={cn(
            "group flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors",
            active
              ? "text-white font-semibold"
              : "text-sidebar-foreground/70 hover:text-white font-medium",
            !expanded && "justify-center px-0",
          )}
        >
          <span
            className={cn(
              "flex size-8 shrink-0 items-center justify-center rounded-md transition-colors",
              active
                ? "bg-brand-500/20 text-brand-300"
                : "text-sidebar-foreground/60 group-hover:bg-white/5 group-hover:text-white",
            )}
          >
            <item.icon className="size-4" />
          </span>
          {expanded && (
            <>
              <span className="flex-1 text-left">{item.name}</span>
              <ChevronRight
                className={cn(
                  "size-4 shrink-0 text-sidebar-foreground/40 transition-transform duration-200",
                  open && "rotate-90",
                )}
              />
            </>
          )}
        </button>
        {expanded && open && (
          <div className="relative mt-0.5 ml-7 space-y-0.5 border-l border-sidebar-border pl-3">
            {item.children.map((child) => (
              <Link
                key={child.link}
                href={child.link}
                onClick={onNavClick}
                className={cn(
                  "block rounded-md py-1.5 pr-2 text-[13px] transition-colors",
                  pathname === child.link
                    ? "font-semibold text-brand-300"
                    : "text-sidebar-foreground/60 hover:text-white font-medium",
                )}
              >
                {child.name}
              </Link>
            ))}
          </div>
        )}
      </div>
    );
  }

  return (
    <Link
      href={item.link}
      onClick={onNavClick}
      title={expanded ? undefined : item.name}
      className={cn(
        "group flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors",
        active
          ? "bg-white/10 text-white font-semibold shadow-sm"
          : "text-sidebar-foreground/70 hover:bg-white/5 hover:text-white font-medium",
        active &&
          "relative before:absolute before:inset-y-1.5 before:left-0 before:w-[3px] before:rounded-full before:bg-brand-400",
        !expanded && "justify-center px-0",
      )}
    >
      <span
        className={cn(
          "flex size-8 shrink-0 items-center justify-center rounded-md transition-colors",
          active
            ? "bg-brand-500/20 text-brand-300"
            : "text-sidebar-foreground/60 group-hover:bg-white/5 group-hover:text-white",
        )}
      >
        <item.icon className="size-4" />
      </span>
      {expanded && <span className="flex-1">{item.name}</span>}
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
              Admin Console
            </p>
          </div>
        )}
      </div>

      {/* Navigation */}
      <ScrollArea className="flex-1 px-3 py-4">
        <nav className="space-y-5">
          {sections.map((section) => (
            <div key={section.label} className="space-y-0.5">
              {expanded ? (
                <p className="px-3 pb-1.5 text-[11px] font-semibold uppercase tracking-wider text-sidebar-foreground/40">
                  {section.label}
                </p>
              ) : (
                <div className="mx-2 mb-2 border-t border-sidebar-border" />
              )}
              {section.items.map((item) => (
                <NavItem
                  key={item.name}
                  item={item}
                  pathname={pathname}
                  expanded={expanded}
                  onNavClick={onNavClick}
                />
              ))}
            </div>
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

export function AdminSidebar() {
  const { isCollapsed, toggleSidebar } = useSidebar();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [showLogoutDialog, setShowLogoutDialog] = useState(false);
  const pathname = usePathname();
  const { logout, isLoggingOut } = useAuth();

  const expanded = !isCollapsed;

  const handleLogout = async () => {
    try {
      logout();
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

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
        <div
          className={cn(
            "absolute -right-3 top-[72px] hidden md:block",
          )}
        >
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
        onConfirm={handleLogout}
        isLoggingOut={isLoggingOut}
      />
    </>
  );
}
