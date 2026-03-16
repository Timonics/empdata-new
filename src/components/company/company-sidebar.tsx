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
  Building2,
  Settings,
  ChevronLeft,
  ChevronRight,
  Menu,
  FileText,
  LogOut,
  X,
  UserPlus,
  BarChart3,
} from "lucide-react";
import Logo from "@/components/logo";
import { useSidebar } from "@/contexts/sidebar-context";

const navigation = [
  {
    name: "Dashboard",
    link: "/portal/company",
    icon: LayoutDashboard,
  },
  {
    name: "Employees",
    link: "/portal/company/employees",
    icon: Users,
  },
  {
    name: "Invitations",
    link: "/portal/company/invitations",
    icon: Mail,
    badge: "3",
  },
  {
    name: "Documents",
    link: "/portal/company/documents",
    icon: FileText,
  }
];

interface NavItemProps {
  item: (typeof navigation)[0];
  pathname: string;
  collapsed: boolean;
  onNavClick?: () => void;
}

function NavItem({ item, pathname, collapsed, onNavClick }: NavItemProps) {
  const isActive = pathname === item.link;

  return (
    <Link
      href={item.link}
      onClick={onNavClick}
      className={cn(
        "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-all duration-300 hover:scale-95",
        isActive
          ? "bg-white/25 text-white shadow-lg backdrop-blur-sm font-bold"
          : "text-white/80 hover:bg-white/10 hover:text-white font-medium",
        !collapsed && "justify-start",
        collapsed && "justify-center px-2",
      )}
    >
      <item.icon size={collapsed ? 22 : 20} className="shrink-0" />
      {!collapsed && (
        <>
          <span className="flex-1">{item.name}</span>
          {item.badge && (
            <span className="bg-red-500 text-white text-xs rounded-full h-5 min-w-5 flex items-center justify-center px-1">
              {item.badge}
            </span>
          )}
        </>
      )}
      {collapsed && item.badge && (
        <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
          {item.badge}
        </span>
      )}
    </Link>
  );
}

export function CompanySidebar() {
  const { isCollapsed, toggleSidebar } = useSidebar();
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();

  // For compatibility
  const navIsOpen = !isCollapsed;

  return (
    <>
      {/* Mobile Menu Button */}
      <Button
        variant="ghost"
        size="icon"
        className="fixed left-4 top-4 z-40 md:hidden"
        onClick={() => setMobileOpen(true)}
      >
        <Menu className="h-5 w-5" />
      </Button>

      {/* Mobile Sheet */}
      <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
        <SheetContent side="left" className="w-64 p-0">
          <div className="flex h-full flex-col bg-linear-to-b from-blue-600 via-blue-500 to-blue-400 text-white">
            <div className="flex justify-between items-center p-4 border-b border-white/10">
              <Logo />
              <X
                className="text-white/75 cursor-pointer hover:text-white transition duration-300"
                onClick={() => setMobileOpen(false)}
              />
            </div>
            <ScrollArea className="flex-1 px-3 py-4">
              <nav className="space-y-1">
                {navigation.map((item) => (
                  <NavItem
                    key={item.link}
                    item={item}
                    pathname={pathname}
                    collapsed={false}
                    onNavClick={() => setMobileOpen(false)}
                  />
                ))}
              </nav>
            </ScrollArea>

            {/* Logout button at bottom */}
            <div className="p-4 border-t border-white/10">
              <button className="w-full flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-white/80 hover:bg-white/10 hover:text-white transition duration-300">
                <LogOut size={20} />
                <span>Logout</span>
              </button>
            </div>
          </div>
        </SheetContent>
      </Sheet>

      {/* Desktop Sidebar */}
      <div
        className={cn(
          "fixed inset-y-0 left-0 z-50 hidden md:flex md:flex-col h-full border-r-2 bg-linear-to-b from-blue-600 via-blue-500 to-blue-400 border-gray-400 px-2",
          "transition-all duration-300 ease-in-out overflow-auto scrollbar",
          navIsOpen ? "w-55" : "w-24",
        )}
      >
        <div className="flex flex-col text-white h-full gap-6 py-4">
          <div className="mx-auto">
            <Logo />
          </div>

          <ScrollArea className="flex-1 px-1">
            <div
              className={cn(
                "flex flex-col h-full gap-2",
                !navIsOpen && "items-center",
              )}
            >
              {/* Navigation Items */}
              {navigation.map((item) => (
                <NavItem
                  key={item.link}
                  item={item}
                  pathname={pathname}
                  collapsed={!navIsOpen}
                />
              ))}
            </div>
          </ScrollArea>

          {/* Logout Button */}
          <div className={cn("mt-auto", navIsOpen ? "px-1" : "px-0")}>
            <button
              className={cn(
                "w-full flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-white/80 hover:bg-white/10 hover:text-white transition duration-300",
                !navIsOpen && "justify-center",
              )}
            >
              <LogOut size={navIsOpen ? 20 : 22} />
              {navIsOpen && <span>Logout</span>}
            </button>
          </div>
        </div>

        {/* Collapse Toggle Button */}
        <div
          className={cn(
            "py-4 border-t border-white/10 flex items-center",
            navIsOpen ? "justify-end" : "justify-center",
          )}
        >
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleSidebar}
            className="text-white hover:bg-white/10"
          >
            {navIsOpen ? (
              <ChevronLeft className="h-5 w-5" />
            ) : (
              <ChevronRight className="h-5 w-5" />
            )}
          </Button>
        </div>
      </div>
    </>
  );
}
