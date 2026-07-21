import { z } from "zod";

export const appointmentSchema = z.object({
  patientName: z.string().min(2, "Patient name must be at least 2 characters"),
  doctorName: z.string().min(2, "Doctor name is required"),
  specialty: z.string().min(1, "Please select a specialty"),
  date: z.string().min(1, "Please select a date"),
  time: z.string().min(1, "Please select a time"),
  type: z.enum(["in-person", "video", "follow-up"], {
    error: "Please select appointment type",
  }),
  reason: z
    .string()
    .min(5, "Please describe the reason (min 5 characters)")
    .max(500, "Reason must be 500 characters or less"),
  notes: z.string().max(1000, "Notes must be 1000 characters or less").optional(),
});

export type AppointmentFormData = z.infer<typeof appointmentSchema>;

export const medicineReminderSchema = z.object({
  medicineName: z.string().min(2, "Medicine name is required"),
  dosage: z.string().min(1, "Dosage is required"),
  frequency: z.enum(["once-daily", "twice-daily", "three-times", "four-times", "as-needed"], {
    error: "Please select frequency",
  }),
  time: z.string().min(1, "Please select a time"),
  duration: z.string().min(1, "Duration is required"),
  withFood: z.enum(["before", "after", "any"], {
    error: "Please select food timing",
  }),
  startDate: z.string().min(1, "Start date is required"),
  endDate: z.string().optional(),
  sideEffects: z.string().optional(),
  notes: z.string().max(500, "Notes must be 500 characters or less").optional(),
});

export type MedicineReminderFormData = z.infer<typeof medicineReminderSchema>;

export const symptomSchema = z.object({
  symptomName: z.string().min(2, "Symptom name is required"),
  severity: z.enum(["mild", "moderate", "severe", "very-severe"], {
    error: "Please select severity",
  }),
  duration: z.string().min(1, "Duration is required"),
  location: z.string().min(1, "Body location is required"),
  description: z
    .string()
    .min(10, "Please describe the symptom (min 10 characters)")
    .max(1000, "Description must be 1000 characters or less"),
  triggers: z.string().optional(),
  associatedSymptoms: z.array(z.string()).optional(),
  startedDate: z.string().min(1, "Date when symptom started is required"),
  isRecurring: z.boolean(),
});

export type SymptomFormData = z.infer<typeof symptomSchema>;

export const patientRegistrationSchema = z
  .object({
    firstName: z.string().min(2, "First name must be at least 2 characters"),
    lastName: z.string().min(2, "Last name must be at least 2 characters"),
    email: z.string().email("Please enter a valid email address"),
    phone: z
      .string()
      .min(10, "Phone number must be at least 10 digits")
      .regex(/^\+?[\d\s-]+$/, "Please enter a valid phone number"),
    dateOfBirth: z.string().min(1, "Date of birth is required"),
    gender: z.enum(["male", "female", "other"], {
      error: "Please select gender",
    }),
    bloodGroup: z.enum(["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"], {
      error: "Please select blood group",
    }),
    address: z.string().min(5, "Address must be at least 5 characters"),
    city: z.string().min(2, "City is required"),
    state: z.string().min(2, "State is required"),
    zipCode: z.string().min(5, "ZIP code must be at least 5 characters"),
    emergencyContactName: z.string().min(2, "Emergency contact name is required"),
    emergencyContactPhone: z
      .string()
      .min(10, "Emergency contact phone must be at least 10 digits"),
    insuranceProvider: z.string().optional(),
    insuranceNumber: z.string().optional(),
    medicalHistory: z.string().optional(),
    allergies: z.string().optional(),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
      .regex(/[0-9]/, "Password must contain at least one number"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export type PatientRegistrationFormData = z.infer<typeof patientRegistrationSchema>;

export const doctorRegistrationSchema = z
  .object({
    firstName: z.string().min(2, "First name must be at least 2 characters"),
    lastName: z.string().min(2, "Last name must be at least 2 characters"),
    email: z.string().email("Please enter a valid email address"),
    phone: z
      .string()
      .min(10, "Phone number must be at least 10 digits")
      .regex(/^\+?[\d\s-]+$/, "Please enter a valid phone number"),
    specialty: z.string().min(1, "Please select a specialty"),
    subSpecialty: z.string().optional(),
    licenseNumber: z.string().min(5, "License number is required"),
    yearsOfExperience: z
      .number()
      .min(0, "Years of experience must be positive")
      .max(60, "Years of experience seems too high"),
    hospital: z.string().min(2, "Hospital/clinic name is required"),
    address: z.string().min(5, "Address must be at least 5 characters"),
    city: z.string().min(2, "City is required"),
    state: z.string().min(2, "State is required"),
    zipCode: z.string().min(5, "ZIP code must be at least 5 characters"),
    education: z.array(z.string()).min(1, "At least one education entry is required"),
    certifications: z.array(z.string()).optional(),
    bio: z
      .string()
      .min(20, "Bio must be at least 20 characters")
      .max(1000, "Bio must be 1000 characters or less"),
    consultationFee: z
      .number()
      .min(0, "Fee must be positive")
      .optional(),
    availableDays: z.array(z.string()).min(1, "Select at least one available day"),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
      .regex(/[0-9]/, "Password must contain at least one number"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export type DoctorRegistrationFormData = z.infer<typeof doctorRegistrationSchema>;
