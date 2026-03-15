'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Menu } from 'lucide-react';
import { useState } from 'react';
import Logo from '@/components/logo';

interface NavItem {
  title: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  children?: NavItem[];
}

interface SidebarProps {
  navItems: NavItem[];
  className?: string;
}

export function Sidebar({ navItems, className }: SidebarProps) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Mobile Sheet */}
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <Button variant="ghost" size="icon" className="md:hidden">
            <Menu className="h-5 w-5" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-64 p-0">
          <SidebarContent navItems={navItems} pathname={pathname} onNavClick={() => setOpen(false)} />
        </SheetContent>
      </Sheet>

      {/* Desktop Sidebar */}
      <div className={cn("hidden md:flex md:w-64 md:flex-col md:fixed md:inset-y-0", className)}>
        <SidebarContent navItems={navItems} pathname={pathname} />
      </div>
    </>
  );
}

function SidebarContent({ navItems, pathname, onNavClick }: { 
  navItems: NavItem[]; 
  pathname: string;
  onNavClick?: () => void;
}) {
  return (
    <div className="flex flex-col h-full bg-linear-to-b from-blue-600 via-blue-500 to-blue-400 text-white">
      <div className="p-4 border-b border-white/10">
        <Logo />
      </div>
      <ScrollArea className="flex-1 px-3 py-4">
        <nav className="space-y-1">
          {navItems.map((item) => (
            <NavItem
              key={item.href}
              item={item}
              pathname={pathname}
              onNavClick={onNavClick}
            />
          ))}
        </nav>
      </ScrollArea>
    </div>
  );
}

function NavItem({ item, pathname, onNavClick }: { 
  item: NavItem; 
  pathname: string;
  onNavClick?: () => void;
}) {
  const isActive = pathname === item.href || pathname.startsWith(item.href + '/');

  return (
    <Link
      href={item.href}
      onClick={onNavClick}
      className={cn(
        "flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-all",
        isActive 
          ? "bg-white/25 text-white shadow-lg backdrop-blur-sm" 
          : "text-white/80 hover:bg-white/10 hover:text-white"
      )}
    >
      <item.icon className="h-5 w-5" />
      <span>{item.title}</span>
    </Link>
  );
}