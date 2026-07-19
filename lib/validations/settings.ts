import { z } from "zod";

export const settingsSchema = z.object({
  siteName: z.string().min(1, "Site name is required").max(200),
  siteDescription: z.string().max(500).optional().or(z.literal("")),
  contactEmail: z.string().email("Enter a valid email address").optional().or(z.literal("")),
  contactPhone: z.string().max(50).optional().or(z.literal("")),
  twitter: z.string().url().optional().or(z.literal("")),
  linkedin: z.string().url().optional().or(z.literal("")),
  github: z.string().url().optional().or(z.literal("")),
  instagram: z.string().url().optional().or(z.literal("")),
});

export type SettingsInput = z.infer<typeof settingsSchema>;
