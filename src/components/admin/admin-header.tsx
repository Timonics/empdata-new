"use client";

import { usePathname } from "next/navigation";
import { useSidebar } from "@/contexts/sidebar-context";
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
import { Bell, PanelRight, User, Settings, LogOut, HelpCircle } from "lucide-react";

export function AdminHeader() {
  const pathname = usePathname();
  const { toggleSidebar } = useSidebar();

  // Generate page title in your original style
  const getPageTitle = () => {
    if (pathname === "/admin") {
      return "Dashboard";
    }
    
    const pathSegment = pathname.split("/").pop() || "";
    return pathSegment.charAt(0).toUpperCase() + 
           pathSegment.slice(1).replace(/-/g, " ");
  };

  return (
    <header className="border-b-2 border-black/5 bg-white/95 backdrop-blur supports-backdrop-filter:bg-white/60">
      <div className="flex h-16 items-center justify-between px-4 md:px-6">
        {/* Left section - Toggle and Title */}
        <div className="flex items-center gap-6">
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleSidebar}
            className="hidden md:inline-flex"
          >
            <PanelRight className="h-5 w-5" />
          </Button>
          
          <h2 className="text-2xl md:text-3xl font-medium">
            {getPageTitle()}
          </h2>
        </div>

        {/* Right section - Actions */}
        <div className="flex items-center gap-4">
          {/* Notifications */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="relative">
                <Bell className="h-5 w-5" />
                <span className="absolute -right-0.5 -top-0.5 h-4 w-4 rounded-full bg-red-500 text-[10px] font-medium text-white flex items-center justify-center">
                  3
                </span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-80">
              <DropdownMenuLabel>Notifications</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {[1, 2, 3].map((i) => (
                <DropdownMenuItem key={i} className="cursor-pointer">
                  <div className="flex flex-col gap-1">
                    <p className="text-sm font-medium">
                      New registration pending
                    </p>
                    <p className="text-xs text-gray-500">
                      A new company has registered for Group Life insurance
                    </p>
                    <p className="text-xs text-gray-400">5 minutes ago</p>
                  </div>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* User Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="flex items-center gap-2 px-2">
                <Avatar className="h-8 w-8">
                  <AvatarImage src="/avatars/admin.png" alt="Admin" />
                  <AvatarFallback className="bg-blue-100 text-blue-600">
                    AD
                  </AvatarFallback>
                </Avatar>
                <div className="hidden text-left lg:block">
                  <p className="text-sm font-medium">Admin User</p>
                  <p className="text-xs text-gray-500">Super Admin</p>
                </div>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <User className="mr-2 h-4 w-4" />
                Profile
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Settings className="mr-2 h-4 w-4" />
                Settings
              </DropdownMenuItem>
              <DropdownMenuItem>
                <HelpCircle className="mr-2 h-4 w-4" />
                Help
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-red-600">
                <LogOut className="mr-2 h-4 w-4" />
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}