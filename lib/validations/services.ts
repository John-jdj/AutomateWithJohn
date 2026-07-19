import { z } from "zod";

const slugPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export const serviceSchema = z.object({
  title: z.string().min(1, "Title is required").max(200),
  slug: z
    .string()
    .min(1, "Slug is required")
    .max(200)
    .regex(slugPattern, "Use lowercase letters, numbers, and hyphens only"),
  description: z.string().min(1, "Description is required"),
  icon: z.string().max(100).optional().or(z.literal("")),
  features: z.string().max(1000).optional().or(z.literal("")), // comma-separated in the form
  priceFrom: z.string().max(20).optional().or(z.literal("")), // parsed as decimal in the action
  category: z.string().max(100).optional().or(z.literal("")),
  order: z.string().max(10).optional().or(z.literal("")), // parsed as int in the action
});

export type ServiceInput = z.infer<typeof serviceSchema>;
