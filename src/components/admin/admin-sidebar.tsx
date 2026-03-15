"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
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
} from "lucide-react";
import Logo from "@/components/logo";
import { useSidebar } from "@/contexts/sidebar-context";

const navigation = [
  {
    name: "Dashboard",
    link: "/admin",
    icon: LayoutDashboard,
  },
  {
    name: "Registrations",
    link: "/admin/registrations",
    icon: StickyNote,
    children: [
      { name: "Group Life", link: "/admin/registrations/group-life" },
      { name: "Individual", link: "/admin/registrations/individual" },
    ],
  },
  {
    name: "Companies",
    link: "/admin/companies",
    icon: Building2,
  },
  {
    name: "Employees",
    link: "/admin/employees",
    icon: Users,
  },
  {
    name: "Verification Status",
    link: "/admin/verification",
    icon: ShieldCheck,
  },
  {
    name: "Audit Logs",
    link: "/admin/audit-logs",
    icon: Logs,
  },
  {
    name: "Reports",
    link: "/admin/reports",
    icon: BarChart3,
  },
  {
    name: "Settings",
    link: "/admin/settings",
    icon: Settings,
  },
];

interface NavItemProps {
  item: (typeof navigation)[0];
  pathname: string;
  navIsOpen: boolean;
  onNavClick?: () => void;
}

function NavItem({ item, pathname, navIsOpen, onNavClick }: NavItemProps) {
  const isActive = pathname === item.link;
  const [isOpen, setIsOpen] = useState(false);

  if (item.children) {
    return (
      <div className="w-full">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className={cn(
            "flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm transition-all",
            isActive
              ? "bg-white/25 text-white shadow-lg backdrop-blur-sm font-bold"
              : "text-white/80 hover:bg-white/10 hover:text-white font-medium",
            !navIsOpen && "justify-center",
          )}
        >
          <item.icon size={navIsOpen ? 20 : 25} className="shrink-0" />
          {navIsOpen && (
            <>
              <span className="flex-1 text-left">{item.name}</span>
              <ChevronRight
                className={cn(
                  "h-4 w-4 transition-transform shrink-0",
                  isOpen && "rotate-90",
                )}
              />
            </>
          )}
        </button>
        {navIsOpen && isOpen && (
          <div className="ml-8 mt-1 space-y-1">
            {item.children.map((child) => (
              <Link
                key={child.link}
                href={child.link}
                onClick={onNavClick}
                className={cn(
                  "block rounded-lg px-3 py-2 text-sm text-white/70 hover:bg-white/10 hover:text-white transition duration-300",
                  pathname === child.link && "bg-white/25 text-white font-bold",
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
      className={cn(
        "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-all duration-300 hover:scale-95",
        isActive
          ? "bg-white/25 text-white shadow-lg backdrop-blur-sm font-bold"
          : "text-white/80 hover:bg-white/10 hover:text-white font-medium",
        !navIsOpen && "justify-center px-4",
      )}
    >
      <item.icon size={navIsOpen ? 20 : 25} className="shrink-0" />
      {navIsOpen && <span className="flex-1">{item.name}</span>}
    </Link>
  );
}

export function AdminSidebar() {
  const { isCollapsed, toggleSidebar } = useSidebar();
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();

  // For compatibility with your original naming
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
                    navIsOpen={true}
                    onNavClick={() => setMobileOpen(false)}
                  />
                ))}
              </nav>
            </ScrollArea>
          </div>
        </SheetContent>
      </Sheet>

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

          <ScrollArea className="flex-1 px-1 mt-4">
            <div
              className={cn(
                "flex flex-col h-full gap-2",
                !navIsOpen && "items-center",
              )}
            >
              {/* Dashboard Link */}
              <NavItem
                item={{
                  name: "Dashboard",
                  link: "/admin",
                  icon: LayoutDashboard,
                }}
                pathname={pathname}
                navIsOpen={navIsOpen}
              />

              {/* Registrations Section */}
              {navIsOpen ? (
                <h4 className="mt-6 pl-2 text-sm opacity-50">REGISTRATIONS</h4>
              ) : (
                <hr className="text-center border w-full mt-6 opacity-30" />
              )}

              {/* Registrations with children */}
              <NavItem
                item={navigation[1]} // Registrations
                pathname={pathname}
                navIsOpen={navIsOpen}
              />

              {/* ORGANISATIONS Section */}
              {navIsOpen ? (
                <h4 className="mt-6 pl-2 text-sm opacity-50">ORGANISATIONS</h4>
              ) : (
                <hr className="text-center border w-full mt-6 opacity-30" />
              )}

              {/* Companies and Employees */}
              {navigation.slice(2, 4).map((item) => (
                <NavItem
                  key={item.link}
                  item={item}
                  pathname={pathname}
                  navIsOpen={navIsOpen}
                />
              ))}

              {/* REPORTS AND COMPLIANCE Section */}
              {navIsOpen ? (
                <h4 className="mt-6 pl-2 text-sm opacity-50">
                  REPORTS AND COMPLIANCE
                </h4>
              ) : (
                <hr className="text-center border w-full mt-6 opacity-30" />
              )}

              {/* Verification, Audit Logs, Reports */}
              {navigation.slice(4, 7).map((item) => (
                <NavItem
                  key={item.link}
                  item={item}
                  pathname={pathname}
                  navIsOpen={navIsOpen}
                />
              ))}

              {/* SYSTEM Section */}
              {navIsOpen ? (
                <h4 className="mt-6 pl-2 text-sm opacity-30">SYSTEM</h4>
              ) : (
                <hr className="text-center mt-6 border w-full opacity-30" />
              )}

              {/* Settings */}
              <NavItem
                item={navigation[7]} // Settings
                pathname={pathname}
                navIsOpen={navIsOpen}
              />

              {/* Logout Button */}
              <button
                className={cn(
                  "w-full flex items-center gap-2 p-2 pl-4 rounded-lg font-medium transition duration-300 hover:bg-red-100 hover:text-red-600 text-red-800",
                  navIsOpen ? "justify-start" : "justify-center",
                )}
              >
                <LogOut size={navIsOpen ? 20 : 25} />
                {navIsOpen && <h5 className="text-sm">Logout</h5>}
              </button>
            </div>
          </ScrollArea>
        </div>

        {/* Collapse Toggle Button - Positioned at bottom */}
        <div
          className={cn(
            "p-4 border-t border-white/10 flex items-center",
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
