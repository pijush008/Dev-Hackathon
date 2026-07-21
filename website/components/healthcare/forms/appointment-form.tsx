"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Calendar, Loader2, CheckCircle2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { appointmentSchema, type AppointmentFormData } from "./schemas";
import { cn } from "@/lib/utils";

const specialties = [
  "General Medicine",
  "Cardiology",
  "Neurology",
  "Orthopedics",
  "Dermatology",
  "Pediatrics",
  "Gynecology",
  "Ophthalmology",
  "ENT",
  "Psychiatry",
];

const timeSlots = [
  "09:00 AM",
  "09:30 AM",
  "10:00 AM",
  "10:30 AM",
  "11:00 AM",
  "11:30 AM",
  "02:00 PM",
  "02:30 PM",
  "03:00 PM",
  "03:30 PM",
  "04:00 PM",
  "04:30 PM",
];

interface AppointmentFormProps {
  onSubmit?: (data: AppointmentFormData) => void;
}

export function AppointmentForm({ onSubmit }: AppointmentFormProps) {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting, isSubmitSuccessful },
  } = useForm<AppointmentFormData>({
    resolver: zodResolver(appointmentSchema),
    defaultValues: {
      type: "in-person",
    },
  });

  const watchedType = watch("type");

  const onFormSubmit = (data: AppointmentFormData) => {
    onSubmit?.(data);
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2.5">
          <div className="flex size-9 items-center justify-center rounded-xl bg-blue-500/10">
            <Calendar className="size-5 text-blue-600 dark:text-blue-400" />
          </div>
          <CardTitle className="text-base">Book Appointment</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-5">
          {/* Patient & Doctor */}
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor="patientName">Patient Name</Label>
              <Input
                id="patientName"
                placeholder="John Doe"
                {...register("patientName")}
                className={cn(errors.patientName && "border-red-500 focus-visible:ring-red-500")}
              />
              {errors.patientName && (
                <p className="text-xs text-red-500">{errors.patientName.message}</p>
              )}
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="doctorName">Doctor Name</Label>
              <Input
                id="doctorName"
                placeholder="Dr. Sarah Chen"
                {...register("doctorName")}
                className={cn(errors.doctorName && "border-red-500 focus-visible:ring-red-500")}
              />
              {errors.doctorName && (
                <p className="text-xs text-red-500">{errors.doctorName.message}</p>
              )}
            </div>
          </div>

          {/* Specialty */}
          <div className="space-y-1.5">
            <Label htmlFor="specialty">Specialty</Label>
            <select
              id="specialty"
              {...register("specialty")}
              className={cn(
                "flex h-9 w-full rounded-lg border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring",
                errors.specialty && "border-red-500 focus-visible:ring-red-500",
              )}
            >
              <option value="">Select specialty</option>
              {specialties.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
            {errors.specialty && (
              <p className="text-xs text-red-500">{errors.specialty.message}</p>
            )}
          </div>

          {/* Date & Time */}
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor="date">Date</Label>
              <Input
                id="date"
                type="date"
                {...register("date")}
                className={cn(errors.date && "border-red-500 focus-visible:ring-red-500")}
              />
              {errors.date && (
                <p className="text-xs text-red-500">{errors.date.message}</p>
              )}
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="time">Time</Label>
              <select
                id="time"
                {...register("time")}
                className={cn(
                  "flex h-9 w-full rounded-lg border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring",
                  errors.time && "border-red-500 focus-visible:ring-red-500",
                )}
              >
                <option value="">Select time</option>
                {timeSlots.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
              {errors.time && (
                <p className="text-xs text-red-500">{errors.time.message}</p>
              )}
            </div>
          </div>

          {/* Type */}
          <div className="space-y-1.5">
            <Label>Appointment Type</Label>
            <div className="flex gap-2">
              {(["in-person", "video", "follow-up"] as const).map((type) => (
                <label
                  key={type}
                  className={cn(
                    "flex-1 cursor-pointer rounded-lg border p-2.5 text-center text-xs font-medium transition-all",
                    watchedType === type
                      ? "border-primary bg-primary/10 text-primary"
                      : "border-border text-muted-foreground hover:bg-muted",
                  )}
                >
                  <input
                    type="radio"
                    value={type}
                    {...register("type")}
                    className="sr-only"
                  />
                  {type === "in-person" && "In-Person"}
                  {type === "video" && "Video Call"}
                  {type === "follow-up" && "Follow-Up"}
                </label>
              ))}
            </div>
            {errors.type && (
              <p className="text-xs text-red-500">{errors.type.message}</p>
            )}
          </div>

          {/* Reason */}
          <div className="space-y-1.5">
            <Label htmlFor="reason">Reason for Visit</Label>
            <textarea
              id="reason"
              rows={3}
              placeholder="Describe the reason for your appointment..."
              {...register("reason")}
              className={cn(
                "flex w-full rounded-lg border border-input bg-transparent px-3 py-2 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring",
                errors.reason && "border-red-500 focus-visible:ring-red-500",
              )}
            />
            {errors.reason && (
              <p className="text-xs text-red-500">{errors.reason.message}</p>
            )}
          </div>

          {/* Notes */}
          <div className="space-y-1.5">
            <Label htmlFor="notes">Additional Notes (Optional)</Label>
            <textarea
              id="notes"
              rows={2}
              placeholder="Any additional information..."
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
                Booking...
              </>
            ) : isSubmitSuccessful ? (
              <>
                <CheckCircle2 className="size-4" />
                Booked Successfully
              </>
            ) : (
              "Book Appointment"
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
