"use client";

import { useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Stethoscope,
  Loader2,
  CheckCircle2,
  Eye,
  EyeOff,
  Plus,
  X,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { doctorRegistrationSchema, type DoctorRegistrationFormData } from "./schemas";
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
  "Urology",
  "Oncology",
  "Radiology",
  "Anesthesiology",
  "Surgery",
];

const daysOfWeek = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

interface DoctorRegistrationFormProps {
  onSubmit?: (data: DoctorRegistrationFormData) => void;
}

export function DoctorRegistrationForm({ onSubmit }: DoctorRegistrationFormProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    control,
    formState: { errors, isSubmitting, isSubmitSuccessful },
  } = useForm<DoctorRegistrationFormData>({
    resolver: zodResolver(doctorRegistrationSchema),
    defaultValues: {
      education: [""],
      certifications: [],
      availableDays: [],
    },
  });

  const {
    fields: eduFields,
    append: appendEdu,
    remove: removeEdu,
  } = useFieldArray({
    control,
    name: "education" as never,
  });

  const {
    fields: certFields,
    append: appendCert,
    remove: removeCert,
  } = useFieldArray({
    control,
    name: "certifications" as never,
  });

  const watchedDays = watch("availableDays") ?? [];

  const onFormSubmit = (data: DoctorRegistrationFormData) => {
    onSubmit?.(data);
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2.5">
          <div className="flex size-9 items-center justify-center rounded-xl bg-cyan-500/10">
            <Stethoscope className="size-5 text-cyan-600 dark:text-cyan-400" />
          </div>
          <CardTitle className="text-base">Doctor Registration</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-5">
          {/* Personal Info */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Personal Information
            </h4>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label htmlFor="firstName">First Name</Label>
                <Input
                  id="firstName"
                  placeholder="Sarah"
                  {...register("firstName")}
                  className={cn(errors.firstName && "border-red-500 focus-visible:ring-red-500")}
                />
                {errors.firstName && (
                  <p className="text-xs text-red-500">{errors.firstName.message}</p>
                )}
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="lastName">Last Name</Label>
                <Input
                  id="lastName"
                  placeholder="Chen"
                  {...register("lastName")}
                  className={cn(errors.lastName && "border-red-500 focus-visible:ring-red-500")}
                />
                {errors.lastName && (
                  <p className="text-xs text-red-500">{errors.lastName.message}</p>
                )}
              </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="dr.chen@hospital.com"
                  {...register("email")}
                  className={cn(errors.email && "border-red-500 focus-visible:ring-red-500")}
                />
                {errors.email && (
                  <p className="text-xs text-red-500">{errors.email.message}</p>
                )}
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="phone">Phone</Label>
                <Input
                  id="phone"
                  placeholder="+1 (555) 000-0000"
                  {...register("phone")}
                  className={cn(errors.phone && "border-red-500 focus-visible:ring-red-500")}
                />
                {errors.phone && (
                  <p className="text-xs text-red-500">{errors.phone.message}</p>
                )}
              </div>
            </div>
          </div>

          {/* Professional Info */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Professional Information
            </h4>
            <div className="grid gap-4 sm:grid-cols-2">
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
              <div className="space-y-1.5">
                <Label htmlFor="subSpecialty">Sub-Specialty (Optional)</Label>
                <Input
                  id="subSpecialty"
                  placeholder="e.g., Interventional Cardiology"
                  {...register("subSpecialty")}
                />
              </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label htmlFor="licenseNumber">License Number</Label>
                <Input
                  id="licenseNumber"
                  placeholder="MD-12345"
                  {...register("licenseNumber")}
                  className={cn(errors.licenseNumber && "border-red-500 focus-visible:ring-red-500")}
                />
                {errors.licenseNumber && (
                  <p className="text-xs text-red-500">{errors.licenseNumber.message}</p>
                )}
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="yearsOfExperience">Years of Experience</Label>
                <Input
                  id="yearsOfExperience"
                  type="number"
                  min={0}
                  max={60}
                  placeholder="10"
                  {...register("yearsOfExperience", { valueAsNumber: true })}
                  className={cn(errors.yearsOfExperience && "border-red-500 focus-visible:ring-red-500")}
                />
                {errors.yearsOfExperience && (
                  <p className="text-xs text-red-500">{errors.yearsOfExperience.message}</p>
                )}
              </div>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="hospital">Hospital / Clinic</Label>
              <Input
                id="hospital"
                placeholder="City General Hospital"
                {...register("hospital")}
                className={cn(errors.hospital && "border-red-500 focus-visible:ring-red-500")}
              />
              {errors.hospital && (
                <p className="text-xs text-red-500">{errors.hospital.message}</p>
              )}
            </div>
          </div>

          {/* Address */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Practice Address
            </h4>
            <div className="space-y-1.5">
              <Label htmlFor="address">Street Address</Label>
              <Input
                id="address"
                placeholder="456 Medical Center Blvd"
                {...register("address")}
                className={cn(errors.address && "border-red-500 focus-visible:ring-red-500")}
              />
              {errors.address && (
                <p className="text-xs text-red-500">{errors.address.message}</p>
              )}
            </div>
            <div className="grid gap-4 sm:grid-cols-3">
              <div className="space-y-1.5">
                <Label htmlFor="city">City</Label>
                <Input
                  id="city"
                  placeholder="Boston"
                  {...register("city")}
                  className={cn(errors.city && "border-red-500 focus-visible:ring-red-500")}
                />
                {errors.city && (
                  <p className="text-xs text-red-500">{errors.city.message}</p>
                )}
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="state">State</Label>
                <Input
                  id="state"
                  placeholder="MA"
                  {...register("state")}
                  className={cn(errors.state && "border-red-500 focus-visible:ring-red-500")}
                />
                {errors.state && (
                  <p className="text-xs text-red-500">{errors.state.message}</p>
                )}
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="zipCode">ZIP Code</Label>
                <Input
                  id="zipCode"
                  placeholder="02101"
                  {...register("zipCode")}
                  className={cn(errors.zipCode && "border-red-500 focus-visible:ring-red-500")}
                />
                {errors.zipCode && (
                  <p className="text-xs text-red-500">{errors.zipCode.message}</p>
                )}
              </div>
            </div>
          </div>

          {/* Education */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Education
              </h4>
              <button
                type="button"
                onClick={() => appendEdu("")}
                className="flex items-center gap-1 text-xs font-medium text-primary hover:underline"
              >
                <Plus className="size-3" />
                Add
              </button>
            </div>
            <div className="space-y-2">
              {eduFields.map((field, index) => (
                <div key={field.id} className="flex gap-2">
                  <Input
                    placeholder="e.g., MD - Harvard Medical School"
                    {...register(`education.${index}`)}
                    className="flex-1"
                  />
                  {eduFields.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeEdu(index)}
                      className="rounded-lg border border-border p-2 text-muted-foreground hover:bg-red-500/10 hover:text-red-500"
                    >
                      <X className="size-4" />
                    </button>
                  )}
                </div>
              ))}
            </div>
            {errors.education && (
              <p className="text-xs text-red-500">{errors.education.message}</p>
            )}
          </div>

          {/* Certifications */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Certifications (Optional)
              </h4>
              <button
                type="button"
                onClick={() => appendCert("")}
                className="flex items-center gap-1 text-xs font-medium text-primary hover:underline"
              >
                <Plus className="size-3" />
                Add
              </button>
            </div>
            <div className="space-y-2">
              {certFields.map((field, index) => (
                <div key={field.id} className="flex gap-2">
                  <Input
                    placeholder="e.g., Board Certified Cardiologist"
                    {...register(`certifications.${index}` as const)}
                    className="flex-1"
                  />
                  <button
                    type="button"
                    onClick={() => removeCert(index)}
                    className="rounded-lg border border-border p-2 text-muted-foreground hover:bg-red-500/10 hover:text-red-500"
                  >
                    <X className="size-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Bio */}
          <div className="space-y-1.5">
            <Label htmlFor="bio">Professional Bio</Label>
            <textarea
              id="bio"
              rows={3}
              placeholder="Tell patients about your experience and approach to care..."
              {...register("bio")}
              className={cn(
                "flex w-full rounded-lg border border-input bg-transparent px-3 py-2 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring",
                errors.bio && "border-red-500 focus-visible:ring-red-500",
              )}
            />
            {errors.bio && (
              <p className="text-xs text-red-500">{errors.bio.message}</p>
            )}
          </div>

          {/* Consultation Fee */}
          <div className="space-y-1.5">
            <Label htmlFor="consultationFee">Consultation Fee (Optional)</Label>
            <Input
              id="consultationFee"
              type="number"
              min={0}
              placeholder="150"
              {...register("consultationFee", { valueAsNumber: true })}
            />
          </div>

          {/* Available Days */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Available Days
            </h4>
            <div className="flex flex-wrap gap-2">
              {daysOfWeek.map((day) => {
                const isSelected = watchedDays.includes(day);
                return (
                  <label
                    key={day}
                    className={cn(
                      "cursor-pointer rounded-lg border px-3 py-1.5 text-xs font-medium transition-all",
                      isSelected
                        ? "border-primary bg-primary/10 text-primary"
                        : "border-border text-muted-foreground hover:bg-muted",
                    )}
                  >
                    <input
                      type="checkbox"
                      value={day}
                      {...register("availableDays")}
                      className="sr-only"
                    />
                    {day.slice(0, 3)}
                  </label>
                );
              })}
            </div>
            {errors.availableDays && (
              <p className="text-xs text-red-500">{errors.availableDays.message}</p>
            )}
          </div>

          {/* Password */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Account Security
            </h4>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Min 8 chars, 1 uppercase, 1 number"
                    {...register("password")}
                    className={cn(errors.password && "border-red-500 focus-visible:ring-red-500", "pr-9")}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-xs text-red-500">{errors.password.message}</p>
                )}
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    type={showConfirm ? "text" : "password"}
                    placeholder="Re-enter password"
                    {...register("confirmPassword")}
                    className={cn(errors.confirmPassword && "border-red-500 focus-visible:ring-red-500", "pr-9")}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirm(!showConfirm)}
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    {showConfirm ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                  </button>
                </div>
                {errors.confirmPassword && (
                  <p className="text-xs text-red-500">{errors.confirmPassword.message}</p>
                )}
              </div>
            </div>
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
                Registering...
              </>
            ) : isSubmitSuccessful ? (
              <>
                <CheckCircle2 className="size-4" />
                Registration Complete
              </>
            ) : (
              "Register Doctor"
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
