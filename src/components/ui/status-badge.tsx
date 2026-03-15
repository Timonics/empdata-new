import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

type StatusType =
  | "pending"
  | "approved"
  | "rejected"
  | "verified"
  | "invited"
  | "active"
  | "inactive";

interface StatusBadgeProps {
  status: StatusType | string;
  className?: string;
}

const statusStyles: Record<string, string> = {
  pending: "bg-yellow-100 text-yellow-800 border-yellow-200",
  approved: "bg-green-100 text-green-800 border-green-200",
  rejected: "bg-red-100 text-red-800 border-red-200",
  verified: "bg-blue-100 text-blue-800 border-blue-200",
  invited: "bg-purple-100 text-purple-800 border-purple-200",
  active: "bg-emerald-100 text-emerald-800 border-emerald-200",
  inactive: "bg-gray-100 text-gray-800 border-gray-200",
};

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const normalizedStatus = status.toLowerCase();
  const style = statusStyles[normalizedStatus] || statusStyles.pending;

  return (
    <Badge variant="outline" className={cn(style, "font-medium", className)}>
      {status}
    </Badge>
  );
}
