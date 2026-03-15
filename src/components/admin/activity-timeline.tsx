"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Building2,
  User,
  Shield,
  FileText,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";

const activities = [
  {
    id: 1,
    type: "company",
    action: "New company registered",
    user: "TechCorp Solutions",
    time: "2 minutes ago",
    icon: Building2,
    color: "bg-blue-100 text-blue-600",
  },
  {
    id: 2,
    type: "verification",
    action: "NIN verification completed",
    user: "John Smith",
    time: "15 minutes ago",
    icon: Shield,
    color: "bg-green-100 text-green-600",
  },
  {
    id: 3,
    type: "document",
    action: "Documents uploaded",
    user: "Global Industries",
    time: "1 hour ago",
    icon: FileText,
    color: "bg-purple-100 text-purple-600",
  },
  {
    id: 4,
    type: "employee",
    action: "New employee added",
    user: "Sarah Johnson",
    time: "3 hours ago",
    icon: User,
    color: "bg-yellow-100 text-yellow-600",
  },
  {
    id: 5,
    type: "approval",
    action: "Registration approved",
    user: "StartUp Inc",
    time: "5 hours ago",
    icon: CheckCircle2,
    color: "bg-emerald-100 text-emerald-600",
  },
];

export function ActivityTimeline() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Activity Timeline</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {activities.map((activity, index) => (
            <div key={activity.id} className="flex gap-3">
              <div className="relative">
                <div className={cn("rounded-full p-2", activity.color)}>
                  <activity.icon className="h-4 w-4" />
                </div>
                {index < activities.length - 1 && (
                  <div className="absolute left-1/2 top-8 h-12 w-px -translate-x-1/2 bg-gray-200" />
                )}
              </div>
              <div className="flex-1 pb-4">
                <div className="flex items-center justify-between">
                  <p className="font-medium">{activity.action}</p>
                  <span className="text-xs text-muted-foreground">
                    {activity.time}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground">{activity.user}</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
