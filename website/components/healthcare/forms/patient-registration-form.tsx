"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  UserPlus,
  Loader2,
  CheckCircle2,
  Eye,
  EyeOff,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { patientRegistrationSchema, type PatientRegistrationFormData } from "./schemas";
import { cn } from "@/lib/utils";

const bloodGroups = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

interface PatientRegistrationFormProps {
  onSubmit?: (data: PatientRegistrationFormData) => void;
}

export function PatientRegistrationForm({ onSubmit }: PatientRegistrationFormProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, isSubmitSuccessful },
  } = useForm<PatientRegistrationFormData>({
    resolver: zodResolver(patientRegistrationSchema),
  });

  const onFormSubmit = (data: PatientRegistrationFormData) => {
    onSubmit?.(data);
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2.5">
          <div className="flex size-9 items-center justify-center rounded-xl bg-violet-500/10">
            <UserPlus className="size-5 text-violet-600 dark:text-violet-400" />
          </div>
          <CardTitle className="text-base">Patient Registration</CardTitle>
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
                  placeholder="John"
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
                  placeholder="Doe"
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
                  placeholder="john@example.com"
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
            <div className="grid gap-4 sm:grid-cols-3">
              <div className="space-y-1.5">
                <Label htmlFor="dateOfBirth">Date of Birth</Label>
                <Input
                  id="dateOfBirth"
                  type="date"
                  {...register("dateOfBirth")}
                  className={cn(errors.dateOfBirth && "border-red-500 focus-visible:ring-red-500")}
                />
                {errors.dateOfBirth && (
                  <p className="text-xs text-red-500">{errors.dateOfBirth.message}</p>
                )}
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="gender">Gender</Label>
                <select
                  id="gender"
                  {...register("gender")}
                  className={cn(
                    "flex h-9 w-full rounded-lg border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring",
                    errors.gender && "border-red-500 focus-visible:ring-red-500",
                  )}
                >
                  <option value="">Select</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
                {errors.gender && (
                  <p className="text-xs text-red-500">{errors.gender.message}</p>
                )}
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="bloodGroup">Blood Group</Label>
                <select
                  id="bloodGroup"
                  {...register("bloodGroup")}
                  className={cn(
                    "flex h-9 w-full rounded-lg border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring",
                    errors.bloodGroup && "border-red-500 focus-visible:ring-red-500",
                  )}
                >
                  <option value="">Select</option>
                  {bloodGroups.map((bg) => (
                    <option key={bg} value={bg}>
                      {bg}
                    </option>
                  ))}
                </select>
                {errors.bloodGroup && (
                  <p className="text-xs text-red-500">{errors.bloodGroup.message}</p>
                )}
              </div>
            </div>
          </div>

          {/* Address */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Address
            </h4>
            <div className="space-y-1.5">
              <Label htmlFor="address">Street Address</Label>
              <Input
                id="address"
                placeholder="123 Main St"
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
                  placeholder="New York"
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
                  placeholder="NY"
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
                  placeholder="10001"
                  {...register("zipCode")}
                  className={cn(errors.zipCode && "border-red-500 focus-visible:ring-red-500")}
                />
                {errors.zipCode && (
                  <p className="text-xs text-red-500">{errors.zipCode.message}</p>
                )}
              </div>
            </div>
          </div>

          {/* Emergency Contact */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Emergency Contact
            </h4>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label htmlFor="emergencyContactName">Contact Name</Label>
                <Input
                  id="emergencyContactName"
                  placeholder="Jane Doe"
                  {...register("emergencyContactName")}
                  className={cn(errors.emergencyContactName && "border-red-500 focus-visible:ring-red-500")}
                />
                {errors.emergencyContactName && (
                  <p className="text-xs text-red-500">{errors.emergencyContactName.message}</p>
                )}
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="emergencyContactPhone">Contact Phone</Label>
                <Input
                  id="emergencyContactPhone"
                  placeholder="+1 (555) 000-0000"
                  {...register("emergencyContactPhone")}
                  className={cn(errors.emergencyContactPhone && "border-red-500 focus-visible:ring-red-500")}
                />
                {errors.emergencyContactPhone && (
                  <p className="text-xs text-red-500">{errors.emergencyContactPhone.message}</p>
                )}
              </div>
            </div>
          </div>

          {/* Insurance */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Insurance (Optional)
            </h4>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label htmlFor="insuranceProvider">Provider</Label>
                <Input
                  id="insuranceProvider"
                  placeholder="e.g., Blue Cross"
                  {...register("insuranceProvider")}
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="insuranceNumber">Policy Number</Label>
                <Input
                  id="insuranceNumber"
                  placeholder="Policy #"
                  {...register("insuranceNumber")}
                />
              </div>
            </div>
          </div>

          {/* Medical Info */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Medical History (Optional)
            </h4>
            <div className="space-y-1.5">
              <Label htmlFor="medicalHistory">Medical History</Label>
              <textarea
                id="medicalHistory"
                rows={2}
                placeholder="Previous conditions, surgeries..."
                {...register("medicalHistory")}
                className="flex w-full rounded-lg border border-input bg-transparent px-3 py-2 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="allergies">Allergies</Label>
              <Input
                id="allergies"
                placeholder="e.g., Penicillin, Peanuts"
                {...register("allergies")}
              />
            </div>
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
              "Register Patient"
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
