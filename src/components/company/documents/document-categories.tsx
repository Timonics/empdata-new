'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';
import {
  Folder,
  FileText,
  FileCheck,
  FileWarning,
  Building2,
  Receipt,
  Users,
  Shield,
  ChevronRight,
} from 'lucide-react';

const categories = [
  {
    id: 'cac',
    name: 'CAC Documents',
    icon: Building2,
    count: 8,
    total: 12,
    color: 'blue',
    documents: ['Certificate of Incorporation', 'Memorandum', 'Articles of Association'],
  },
  {
    id: 'tax',
    name: 'Tax Certificates',
    icon: Receipt,
    count: 5,
    total: 8,
    color: 'green',
    documents: ['Tax Clearance', 'VAT Registration', 'CAC Tax ID'],
  },
  {
    id: 'insurance',
    name: 'Insurance Policies',
    icon: Shield,
    count: 12,
    total: 15,
    color: 'purple',
    documents: ['Group Life Policy', 'Health Insurance', 'Workmen Comp'],
  },
  {
    id: 'employee',
    name: 'Employee Records',
    icon: Users,
    count: 45,
    total: 60,
    color: 'orange',
    documents: ['Employment Contracts', 'NIN Slips', 'Medical Records'],
  },
  {
    id: 'financial',
    name: 'Financial Reports',
    icon: FileText,
    count: 6,
    total: 10,
    color: 'pink',
    documents: ['Audited Accounts', 'Tax Returns', 'Payroll Records'],
  },
];

const colorClasses = {
  blue: {
    bg: 'bg-blue-50',
    text: 'text-blue-600',
    iconBg: 'bg-blue-100',
    progress: 'bg-blue-600',
  },
  green: {
    bg: 'bg-green-50',
    text: 'text-green-600',
    iconBg: 'bg-green-100',
    progress: 'bg-green-600',
  },
  purple: {
    bg: 'bg-purple-50',
    text: 'text-purple-600',
    iconBg: 'bg-purple-100',
    progress: 'bg-purple-600',
  },
  orange: {
    bg: 'bg-orange-50',
    text: 'text-orange-600',
    iconBg: 'bg-orange-100',
    progress: 'bg-orange-600',
  },
  pink: {
    bg: 'bg-pink-50',
    text: 'text-pink-600',
    iconBg: 'bg-pink-100',
    progress: 'bg-pink-600',
  },
};

export function DocumentCategories() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>('cac');

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Categories</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {categories.map((category) => {
          const colors = colorClasses[category.color as keyof typeof colorClasses];
          const Icon = category.icon;
          const progress = (category.count / category.total) * 100;

          return (
            <div
              key={category.id}
              className={cn(
                "p-3 rounded-lg cursor-pointer transition-all",
                selectedCategory === category.id
                  ? "bg-emerald-50 border border-emerald-200"
                  : "hover:bg-gray-50 border border-transparent"
              )}
              onClick={() => setSelectedCategory(category.id)}
            >
              <div className="flex items-center gap-3">
                <div className={cn("rounded-lg p-2", colors.bg)}>
                  <Icon className={cn("h-5 w-5", colors.text)} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium truncate">{category.name}</p>
                    <ChevronRight className={cn(
                      "h-4 w-4 transition-transform",
                      selectedCategory === category.id ? "text-emerald-600" : "text-gray-400"
                    )} />
                  </div>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge variant="outline" className="text-xs">
                      {category.count}/{category.total}
                    </Badge>
                    <span className="text-xs text-muted-foreground">
                      {Math.round(progress)}% complete
                    </span>
                  </div>
                  <Progress value={progress} className="h-1 mt-2" />
                </div>
              </div>

              {selectedCategory === category.id && (
                <div className="mt-3 pt-3 border-t border-emerald-100">
                  <p className="text-xs font-medium text-emerald-700 mb-2">Required Documents:</p>
                  <ul className="space-y-1">
                    {category.documents.map((doc, index) => (
                      <li key={index} className="flex items-center gap-2 text-xs text-gray-600">
                        <FileCheck className="h-3 w-3 text-emerald-500" />
                        {doc}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          );
        })}

        <div className="pt-4 border-t">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Storage Used</span>
            <span className="font-medium">2.4 GB / 10 GB</span>
          </div>
          <Progress value={24} className="h-2 mt-2" />
        </div>
      </CardContent>
    </Card>
  );
}