'use client';

import { usePathname } from 'next/navigation';
import { useSidebar } from '@/contexts/sidebar-context';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Bell, PanelRight, User, Settings, LogOut, HelpCircle, Building2 } from 'lucide-react';

export function CompanyHeader() {
  const pathname = usePathname();
  const { toggleSidebar } = useSidebar();

  // Generate page title
  const getPageTitle = () => {
    if (pathname === '/portal/company') {
      return 'Dashboard';
    }
    
    const pathSegment = pathname.split('/').pop() || '';
    return pathSegment.charAt(0).toUpperCase() + 
           pathSegment.slice(1).replace(/-/g, ' ');
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
          
          <div className="flex items-center gap-3">
            <h2 className="text-2xl md:text-3xl font-medium">
              {getPageTitle()}
            </h2>
            <Badge variant="outline" className="hidden md:inline-flex bg-green-50 text-green-700 border-green-200">
              Company Portal
            </Badge>
          </div>
        </div>

        {/* Right section - Actions */}
        <div className="flex items-center gap-4">
          {/* Company Info - Quick selector (if managing multiple companies) */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="hidden md:flex gap-2">
                <Building2 className="h-4 w-4" />
                <span>TechCorp Ltd</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>Switch Company</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

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
              <DropdownMenuItem className="cursor-pointer">
                <div className="flex flex-col gap-1">
                  <p className="text-sm font-medium">Employee pending verification</p>
                  <p className="text-xs text-gray-500">John Doe submitted NIN for verification</p>
                  <p className="text-xs text-gray-400">5 minutes ago</p>
                </div>
              </DropdownMenuItem>
              <DropdownMenuItem className="cursor-pointer">
                <div className="flex flex-col gap-1">
                  <p className="text-sm font-medium">Invitation accepted</p>
                  <p className="text-xs text-gray-500">Sarah Johnson accepted your invitation</p>
                  <p className="text-xs text-gray-400">1 hour ago</p>
                </div>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* User Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="flex items-center gap-2 px-2">
                <Avatar className="h-8 w-8">
                  <AvatarImage src="/avatars/company-admin.png" alt="Admin" />
                  <AvatarFallback className="bg-green-100 text-green-600">
                    TA
                  </AvatarFallback>
                </Avatar>
                <div className="hidden text-left lg:block">
                  <p className="text-sm font-medium">Tolu Adeleke</p>
                  <p className="text-xs text-gray-500">Company Admin</p>
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