"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, UserPlus } from "lucide-react";
import { useAdminCreateEmployee } from "@/hooks/queries/useEmployees";

interface AddEmployeeModalProps {
  companyId: number;
  companyName?: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AddEmployeeModal({
  companyId,
  companyName,
  open,
  onOpenChange,
}: AddEmployeeModalProps) {
  const createEmployee = useAdminCreateEmployee();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [department, setDepartment] = useState("");
  const [position, setPosition] = useState("");

  const reset = () => {
    setFirstName("");
    setLastName("");
    setEmail("");
    setPhone("");
    setDateOfBirth("");
    setDepartment("");
    setPosition("");
  };

  const canSubmit =
    firstName.trim() &&
    lastName.trim() &&
    email.trim() &&
    dateOfBirth &&
    !createEmployee.isPending;

  const handleSubmit = async () => {
    if (!canSubmit) return;
    await createEmployee.mutateAsync({
      company_id: companyId,
      first_name: firstName.trim(),
      last_name: lastName.trim(),
      email: email.trim(),
      date_of_birth: dateOfBirth,
      phone: phone.trim() || undefined,
      department: department.trim() || undefined,
      position: position.trim() || undefined,
    });
    reset();
    onOpenChange(false);
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(v) => {
        if (!v) reset();
        onOpenChange(v);
      }}
    >
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <UserPlus className="h-5 w-5" />
            Add Employee
          </DialogTitle>
          <DialogDescription>
            {companyName
              ? `Add a new employee to ${companyName}. An invitation will be sent to their email.`
              : "Add a new employee. An invitation will be sent to their email."}
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-2 gap-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="emp-first-name">
              First Name <span className="text-red-500">*</span>
            </Label>
            <Input
              id="emp-first-name"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              placeholder="John"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="emp-last-name">
              Last Name <span className="text-red-500">*</span>
            </Label>
            <Input
              id="emp-last-name"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              placeholder="Doe"
            />
          </div>
          <div className="space-y-2 col-span-2">
            <Label htmlFor="emp-email">
              Email <span className="text-red-500">*</span>
            </Label>
            <Input
              id="emp-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="john.doe@company.com"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="emp-dob">
              Date of Birth <span className="text-red-500">*</span>
            </Label>
            <Input
              id="emp-dob"
              type="date"
              value={dateOfBirth}
              onChange={(e) => setDateOfBirth(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="emp-phone">Phone</Label>
            <Input
              id="emp-phone"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="08012345678"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="emp-department">Department</Label>
            <Input
              id="emp-department"
              value={department}
              onChange={(e) => setDepartment(e.target.value)}
              placeholder="Engineering"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="emp-position">Position</Label>
            <Input
              id="emp-position"
              value={position}
              onChange={(e) => setPosition(e.target.value)}
              placeholder="Software Engineer"
            />
          </div>
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={createEmployee.isPending}
          >
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={!canSubmit}>
            {createEmployee.isPending && (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            )}
            Add Employee
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
