import { z } from "zod";

export const providerSearchSchema = z.object({
  lat: z.number().min(-90).max(90).optional(),
  lng: z.number().min(-180).max(180).optional(),
  radiusKm: z.number().min(1).max(200).default(50),
  specialties: z.array(z.string()).optional(),
  insurance: z.string().optional(),
  slidingScale: z.boolean().optional(),
  telehealth: z.boolean().optional(),
  language: z.string().optional(),
  providerType: z.string().optional(),
  limit: z.number().min(1).max(100).default(20),
  offset: z.number().min(0).default(0),
});

export const providerSchema = z.object({
  npi: z.string().optional(),
  name: z.string().min(1),
  credentials: z.array(z.string()).optional(),
  specialties: z.array(z.string()).optional(),
  providerType: z.string().min(1),
  bio: z.string().optional(),
  licenseState: z.array(z.string()).optional(),
  licenseNumber: z.string().optional(),
  acceptsInsurance: z.boolean().default(true),
  insuranceNetworks: z.array(z.string()).optional(),
  slidingScale: z.boolean().default(false),
  minFeeCents: z.number().optional(),
  maxFeeCents: z.number().optional(),
  languages: z.array(z.string()).default(["en"]),
  telehealth: z.boolean().default(true),
  inPerson: z.boolean().default(false),
  address: z.string().optional(),
  availability: z.record(z.string(), z.unknown()).optional(),
});

export type ProviderSearchInput = z.infer<typeof providerSearchSchema>;
export type ProviderInput = z.infer<typeof providerSchema>;