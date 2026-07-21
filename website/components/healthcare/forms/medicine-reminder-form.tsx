"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Pill, Loader2, CheckCircle2, Bell } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { medicineReminderSchema, type MedicineReminderFormData } from "./schemas";
import { cn } from "@/lib/utils";

const frequencies = [
  { value: "once-daily", label: "Once Daily" },
  { value: "twice-daily", label: "Twice Daily" },
  { value: "three-times", label: "Three Times" },
  { value: "four-times", label: "Four Times" },
  { value: "as-needed", label: "As Needed" },
];

const foodTimings = [
  { value: "before", label: "Before Food" },
  { value: "after", label: "After Food" },
  { value: "any", label: "Any Time" },
];

interface MedicineReminderFormProps {
  onSubmit?: (data: MedicineReminderFormData) => void;
}

export function MedicineReminderForm({ onSubmit }: MedicineReminderFormProps) {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting, isSubmitSuccessful },
  } = useForm<MedicineReminderFormData>({
    resolver: zodResolver(medicineReminderSchema),
    defaultValues: {
      frequency: "once-daily",
      withFood: "any",
    },
  });

  const watchedFood = watch("withFood");

  const onFormSubmit = (data: MedicineReminderFormData) => {
    onSubmit?.(data);
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2.5">
          <div className="flex size-9 items-center justify-center rounded-xl bg-emerald-500/10">
            <Pill className="size-5 text-emerald-600 dark:text-emerald-400" />
          </div>
          <CardTitle className="text-base">Medicine Reminder</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-5">
          {/* Medicine Name & Dosage */}
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor="medicineName">Medicine Name</Label>
              <Input
                id="medicineName"
                placeholder="e.g., Metformin"
                {...register("medicineName")}
                className={cn(errors.medicineName && "border-red-500 focus-visible:ring-red-500")}
              />
              {errors.medicineName && (
                <p className="text-xs text-red-500">{errors.medicineName.message}</p>
              )}
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="dosage">Dosage</Label>
              <Input
                id="dosage"
                placeholder="e.g., 500mg"
                {...register("dosage")}
                className={cn(errors.dosage && "border-red-500 focus-visible:ring-red-500")}
              />
              {errors.dosage && (
                <p className="text-xs text-red-500">{errors.dosage.message}</p>
              )}
            </div>
          </div>

          {/* Frequency */}
          <div className="space-y-1.5">
            <Label>Frequency</Label>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
              {frequencies.map((f) => (
                <label
                  key={f.value}
                  className={cn(
                    "cursor-pointer rounded-lg border p-2.5 text-center text-xs font-medium transition-all",
                    watch("frequency") === f.value
                      ? "border-primary bg-primary/10 text-primary"
                      : "border-border text-muted-foreground hover:bg-muted",
                  )}
                >
                  <input
                    type="radio"
                    value={f.value}
                    {...register("frequency")}
                    className="sr-only"
                  />
                  {f.label}
                </label>
              ))}
            </div>
            {errors.frequency && (
              <p className="text-xs text-red-500">{errors.frequency.message}</p>
            )}
          </div>

          {/* Time & Duration */}
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor="time">Reminder Time</Label>
              <Input
                id="time"
                type="time"
                {...register("time")}
                className={cn(errors.time && "border-red-500 focus-visible:ring-red-500")}
              />
              {errors.time && (
                <p className="text-xs text-red-500">{errors.time.message}</p>
              )}
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="duration">Duration</Label>
              <Input
                id="duration"
                placeholder="e.g., 30 days"
                {...register("duration")}
                className={cn(errors.duration && "border-red-500 focus-visible:ring-red-500")}
              />
              {errors.duration && (
                <p className="text-xs text-red-500">{errors.duration.message}</p>
              )}
            </div>
          </div>

          {/* With Food */}
          <div className="space-y-1.5">
            <Label>Take With Food</Label>
            <div className="flex gap-2">
              {foodTimings.map((ft) => (
                <label
                  key={ft.value}
                  className={cn(
                    "flex-1 cursor-pointer rounded-lg border p-2.5 text-center text-xs font-medium transition-all",
                    watchedFood === ft.value
                      ? "border-primary bg-primary/10 text-primary"
                      : "border-border text-muted-foreground hover:bg-muted",
                  )}
                >
                  <input
                    type="radio"
                    value={ft.value}
                    {...register("withFood")}
                    className="sr-only"
                  />
                  {ft.label}
                </label>
              ))}
            </div>
            {errors.withFood && (
              <p className="text-xs text-red-500">{errors.withFood.message}</p>
            )}
          </div>

          {/* Start & End Date */}
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor="startDate">Start Date</Label>
              <Input
                id="startDate"
                type="date"
                {...register("startDate")}
                className={cn(errors.startDate && "border-red-500 focus-visible:ring-red-500")}
              />
              {errors.startDate && (
                <p className="text-xs text-red-500">{errors.startDate.message}</p>
              )}
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="endDate">End Date (Optional)</Label>
              <Input
                id="endDate"
                type="date"
                {...register("endDate")}
              />
            </div>
          </div>

          {/* Side Effects & Notes */}
          <div className="space-y-1.5">
            <Label htmlFor="sideEffects">Known Side Effects (Optional)</Label>
            <Input
              id="sideEffects"
              placeholder="e.g., Nausea, Dizziness"
              {...register("sideEffects")}
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="notes">Notes (Optional)</Label>
            <textarea
              id="notes"
              rows={2}
              placeholder="Additional instructions..."
              {...register("notes")}
              className="flex w-full rounded-lg border border-input bg-transparent px-3 py-2 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
            />
          </div>

          {/* Submit */}
          <Button
            type="submit"
            disabled={isSubmitting}
            className="w-full"
            size="lg"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="size-4 animate-spin" />
                Setting Reminder...
              </>
            ) : isSubmitSuccessful ? (
              <>
                <CheckCircle2 className="size-4" />
                Reminder Set Successfully
              </>
            ) : (
              <>
                <Bell className="size-4" />
                Set Reminder
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
