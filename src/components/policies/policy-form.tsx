"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

const policySchema = z.object({
  company_id: z.number().min(1),
  type: z.enum([
    "group_life",
    "individual_life",
    "health",
    "motor",
    "property",
  ]),
  start_date: z.string(),
  end_date: z.string(),
  premium_amount: z.number().positive(),
  sum_assured: z.number().positive(),
  beneficiaries: z.string().optional(),
});

type PolicyFormData = z.infer<typeof policySchema>;

export function PolicyForm({ defaultValues, onSubmit, isSubmitting }: any) {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(policySchema),
    defaultValues,
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label>Company</Label>
          <Select onValueChange={(v) => setValue("company_id", parseInt(v))}>
            <SelectTrigger>
              <SelectValue placeholder="Select company" />
            </SelectTrigger>
            <SelectContent>
              {/* TODO: Replace with real company list */}
              <SelectItem value="1">Acme Corp</SelectItem>
              <SelectItem value="2">TechCorp</SelectItem>
              <SelectItem value="3">FinServe</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label>Policy Type</Label>
          <Select onValueChange={(v) => setValue("type", v as any)}>
            <SelectTrigger>
              <SelectValue placeholder="Select type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="group_life">Group Life</SelectItem>
              <SelectItem value="individual_life">Individual Life</SelectItem>
              <SelectItem value="health">Health</SelectItem>
              <SelectItem value="motor">Motor</SelectItem>
              <SelectItem value="property">Property</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label>Start Date</Label>
          <Input type="date" {...register("start_date")} />
        </div>
        <div>
          <Label>End Date</Label>
          <Input type="date" {...register("end_date")} />
        </div>
        <div>
          <Label>Premium Amount (₦)</Label>
          <Input
            type="number"
            step="0.01"
            {...register("premium_amount", { valueAsNumber: true })}
          />
        </div>
        <div>
          <Label>Sum Assured (₦)</Label>
          <Input
            type="number"
            step="0.01"
            {...register("sum_assured", { valueAsNumber: true })}
          />
        </div>
        <div className="col-span-2">
          <Label>Beneficiaries</Label>
          <Textarea
            {...register("beneficiaries")}
            placeholder="e.g., John Doe (50%), Jane Doe (50%)"
          />
        </div>
      </div>
      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? "Saving..." : "Save Policy"}
      </Button>
    </form>
  );
}
