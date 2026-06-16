'use client';

import { ReactNode } from 'react';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { cn } from '@/lib/utils';

interface DetailSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description?: string;
  children: ReactNode;
  className?: string;
}

export function DetailSheet({ open, onOpenChange, title, description, children, className }: DetailSheetProps) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className={cn(
        "w-[560px] sm:w-[600px] overflow-y-auto p-0 bg-gradient-to-b from-white to-gray-50/80",
        className
      )}>
        <div className="p-6 border-b bg-white/80 backdrop-blur-sm sticky top-0 z-10">
          <SheetHeader>
            <SheetTitle className="text-2xl font-bold tracking-tight">{title}</SheetTitle>
            {description && <SheetDescription>{description}</SheetDescription>}
          </SheetHeader>
        </div>
        <div className="p-6">
          {children}
        </div>
      </SheetContent>
    </Sheet>
  );
}