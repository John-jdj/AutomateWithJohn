import { z } from "zod";

export const testimonialSchema = z.object({
  clientName: z.string().min(1, "Client name is required").max(200),
  clientRole: z.string().max(200).optional().or(z.literal("")),
  company: z.string().max(200).optional().or(z.literal("")),
  avatar: z.string().url().optional().or(z.literal("")),
  content: z.string().min(1, "Content is required").max(1000),
  rating: z.string().max(2).optional().or(z.literal("")), // 1-5, parsed in the action
  featured: z.boolean().optional(),
  clientId: z.string().optional().or(z.literal("")),
  projectId: z.string().optional().or(z.literal("")),
});

export type TestimonialInput = z.infer<typeof testimonialSchema>;
