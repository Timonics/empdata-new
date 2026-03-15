"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { AlertTriangle, Loader2 } from "lucide-react";

interface DeleteEmployeeModalProps {
  employee: {
    id: number;
    first_name: string;
    last_name: string;
    email?: string;
    employee_number?: string;
  } | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  isDeleting?: boolean;
}

export function DeleteEmployeeModal({
  employee,
  open,
  onOpenChange,
  onConfirm,
  isDeleting = false,
}: DeleteEmployeeModalProps) {
  if (!employee) return null;

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="sm:max-w-md">
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center gap-2 text-red-600">
            <AlertTriangle className="h-5 w-5" />
            Delete Employee
          </AlertDialogTitle>
          <AlertDialogDescription className="space-y-4">
            <p>
              Are you sure you want to delete{" "}
              <span className="font-semibold text-foreground">
                {employee.first_name} {employee.last_name}
              </span>
              {employee.employee_number && (
                <> (ID: {employee.employee_number})</>
              )}
              ?
            </p>

            <div className="bg-red-50 border border-red-200 rounded-lg p-4 space-y-2">
              <p className="text-sm font-medium text-red-800 flex items-center gap-2">
                <AlertTriangle className="h-4 w-4" />
                This action cannot be undone
              </p>
              <ul className="text-sm text-red-700 list-disc list-inside space-y-1">
                <li>The employee profile will be permanently deleted</li>
                <li>All beneficiary records will be removed</li>
                <li>Insurance policies and claims will be cancelled</li>
                <li>Portal access will be revoked immediately</li>
                <li>All associated data will be lost forever</li>
              </ul>
            </div>

            <p className="text-sm text-muted-foreground">
              Email:{" "}
              <span className="font-medium">{employee.email || "N/A"}</span>
            </p>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="gap-2 sm:gap-0">
          <AlertDialogCancel disabled={isDeleting} className="mt-0 sm:mt-0">
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={onConfirm}
            disabled={isDeleting}
            className="bg-red-600 hover:bg-red-700 focus:ring-red-600 text-white"
          >
            {isDeleting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Deleting...
              </>
            ) : (
              "Delete Employee"
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
