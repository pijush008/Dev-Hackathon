"use client";

import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Activity, Loader2, CheckCircle2, Plus, X } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { symptomSchema, type SymptomFormData } from "./schemas";
import { cn } from "@/lib/utils";

const severities = [
  { value: "mild", label: "Mild", color: "text-emerald-600 dark:text-emerald-400" },
  { value: "moderate", label: "Moderate", color: "text-amber-600 dark:text-amber-400" },
  { value: "severe", label: "Severe", color: "text-orange-600 dark:text-orange-400" },
  { value: "very-severe", label: "Very Severe", color: "text-red-600 dark:text-red-400" },
];

const bodyLocations = [
  "Head",
  "Face",
  "Neck",
  "Chest",
  "Back",
  "Abdomen",
  "Arms",
  "Hands",
  "Legs",
  "Feet",
  "Joints",
  "Skin (General)",
];

interface SymptomFormProps {
  onSubmit?: (data: SymptomFormData) => void;
}

export function SymptomForm({ onSubmit }: SymptomFormProps) {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting, isSubmitSuccessful },
    control,
  } = useForm<SymptomFormData>({
    resolver: zodResolver(symptomSchema),
    defaultValues: {
      severity: "mild",
      isRecurring: false,
      associatedSymptoms: [],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "associatedSymptoms" as never,
  });

  const watchedSeverity = watch("severity");

  const onFormSubmit = (data: SymptomFormData) => {
    onSubmit?.(data);
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2.5">
          <div className="flex size-9 items-center justify-center rounded-xl bg-red-500/10">
            <Activity className="size-5 text-red-600 dark:text-red-400" />
          </div>
          <CardTitle className="text-base">Log Symptom</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-5">
          {/* Symptom Name & Location */}
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor="symptomName">Symptom Name</Label>
              <Input
                id="symptomName"
                placeholder="e.g., Headache, Fever"
                {...register("symptomName")}
                className={cn(errors.symptomName && "border-red-500 focus-visible:ring-red-500")}
              />
              {errors.symptomName && (
                <p className="text-xs text-red-500">{errors.symptomName.message}</p>
              )}
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="location">Body Location</Label>
              <select
                id="location"
                {...register("location")}
                className={cn(
                  "flex h-9 w-full rounded-lg border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring",
                  errors.location && "border-red-500 focus-visible:ring-red-500",
                )}
              >
                <option value="">Select location</option>
                {bodyLocations.map((loc) => (
                  <option key={loc} value={loc}>
                    {loc}
                  </option>
                ))}
              </select>
              {errors.location && (
                <p className="text-xs text-red-500">{errors.location.message}</p>
              )}
            </div>
          </div>

          {/* Severity */}
          <div className="space-y-1.5">
            <Label>Severity</Label>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
              {severities.map((s) => (
                <label
                  key={s.value}
                  className={cn(
                    "cursor-pointer rounded-lg border p-3 text-center text-xs font-medium transition-all",
                    watchedSeverity === s.value
                      ? "border-primary bg-primary/10 text-primary"
                      : "border-border text-muted-foreground hover:bg-muted",
                  )}
                >
                  <input
                    type="radio"
                    value={s.value}
                    {...register("severity")}
                    className="sr-only"
                  />
                  {s.label}
                </label>
              ))}
            </div>
            {errors.severity && (
              <p className="text-xs text-red-500">{errors.severity.message}</p>
            )}
          </div>

          {/* Duration & Date */}
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor="duration">Duration</Label>
              <Input
                id="duration"
                placeholder="e.g., 3 days, 2 weeks"
                {...register("duration")}
                className={cn(errors.duration && "border-red-500 focus-visible:ring-red-500")}
              />
              {errors.duration && (
                <p className="text-xs text-red-500">{errors.duration.message}</p>
              )}
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="startedDate">When Did It Start?</Label>
              <Input
                id="startedDate"
                type="date"
                {...register("startedDate")}
                className={cn(errors.startedDate && "border-red-500 focus-visible:ring-red-500")}
              />
              {errors.startedDate && (
                <p className="text-xs text-red-500">{errors.startedDate.message}</p>
              )}
            </div>
          </div>

          {/* Description */}
          <div className="space-y-1.5">
            <Label htmlFor="description">Description</Label>
            <textarea
              id="description"
              rows={3}
              placeholder="Describe your symptom in detail..."
              {...register("description")}
              className={cn(
                "flex w-full rounded-lg border border-input bg-transparent px-3 py-2 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring",
                errors.description && "border-red-500 focus-visible:ring-red-500",
              )}
            />
            {errors.description && (
              <p className="text-xs text-red-500">{errors.description.message}</p>
            )}
          </div>

          {/* Triggers */}
          <div className="space-y-1.5">
            <Label htmlFor="triggers">Triggers (Optional)</Label>
            <Input
              id="triggers"
              placeholder="e.g., Stress, certain foods, weather"
              {...register("triggers")}
            />
          </div>

          {/* Associated Symptoms */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <Label>Associated Symptoms (Optional)</Label>
              <button
                type="button"
                onClick={() => append("")}
                className="flex items-center gap-1 text-xs font-medium text-primary hover:underline"
              >
                <Plus className="size-3" />
                Add
              </button>
            </div>
            <div className="space-y-2">
              {fields.map((field, index) => (
                <div key={field.id} className="flex gap-2">
                  <Input
                    placeholder="e.g., Nausea, Fatigue"
                    {...register(`associatedSymptoms.${index}` as const)}
                    className="flex-1"
                  />
                  <button
                    type="button"
                    onClick={() => remove(index)}
                    className="rounded-lg border border-border p-2 text-muted-foreground hover:bg-red-500/10 hover:text-red-500"
                  >
                    <X className="size-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Recurring */}
          <label className="flex items-center gap-3 rounded-lg border p-3 cursor-pointer">
            <input
              type="checkbox"
              {...register("isRecurring")}
              className="size-4 rounded border-gray-300"
            />
            <div>
              <p className="text-sm font-medium">Recurring Symptom</p>
              <p className="text-xs text-muted-foreground">
                Check if this symptom comes and goes periodically
              </p>
            </div>
          </label>

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
                Logging Symptom...
              </>
            ) : isSubmitSuccessful ? (
              <>
                <CheckCircle2 className="size-4" />
                Symptom Logged Successfully
              </>
            ) : (
              "Log Symptom"
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
